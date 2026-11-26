import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

export interface ScenarioItem {
  name: string;
  probability: number;
  label: string;
}

export interface PrioritySignalItem {
  level: string;
  score: number;
  title: string;
}

export interface MarketMetricItem {
  indicator: string;
  value: string;
  delta: string;
  note: string;
}

export interface IntelligenceReport {
  slug: string;
  date: string;
  cutoff: string;
  title: string;
  headline: string;
  blufPreview: string;
  scenarios: ScenarioItem[];
  signals: PrioritySignalItem[];
  marketMetrics: MarketMetricItem[];
  htmlContent: string;
  toc: { id: string; text: string }[];
}

const REPORTS_DIR = path.join(process.cwd(), "content", "raporlar");

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function enhanceReportHtml(html: string): string {
  // 1. Epistemik ve NATO etiketlerini rozete cevir
  let out = html
    .replace(/\[OLGU\]/g, '<span class="badge badge-fact">OLGU</span>')
    .replace(/\[İDDİA\]/g, '<span class="badge badge-claim">İDDİA</span>')
    .replace(
      /\[(TEMEL VARSAYIM|VARSAYIM)\]/g,
      '<span class="badge badge-assumption">$1</span>'
    )
    .replace(
      /\[ANALİTİK YARGI\]/g,
      '<span class="badge badge-judgment">ANALİTİK YARGI</span>'
    )
    .replace(
      /\[NATO:\s*([A-F][1-6])\]/g,
      '<span class="badge badge-nato" data-abbr="NATO">NATO: $1</span>'
    )
    .replace(
      /\[Analitik Güven:\s*([^\]]+)\]/g,
      '<span class="badge badge-confidence">Analitik Güven: $1</span>'
    );

  // 2. Metin ici [1], [2] gibi kaynak referanslarini tiklanabilir #kaynak-N linkine cevir
  out = out.replace(
    /\[(\d{1,2})\](?!\()/g,
    '<a href="#kaynak-$1" class="citation-link" title="Kaynak $1\'e git">[$1]</a>'
  );

  // 3. Bolum 8 Kaynakca <ol> icindeki <li> ogelerine id="kaynak-N" ekle
  const kaynakIdx = out.indexOf('id="8-denetlenmis-kaynakca');
  if (kaynakIdx !== -1) {
    const before = out.slice(0, kaynakIdx);
    let after = out.slice(kaynakIdx);
    let refCounter = 1;
    after = after.replace(/<li>/g, () => {
      const id = `kaynak-${refCounter}`;
      refCounter += 1;
      return `<li id="${id}" class="source-item">`;
    });
    out = before + after;
  }

  // 4. Tablolari responsive yatay kaydirmali sarmalayiciya al
  out = out
    .replace(/<table>/g, '<div class="table-wrap"><table>')
    .replace(/<\/table>/g, "</table></div>");

  return out;
}

function parseScenarios(raw: string): ScenarioItem[] {
  const scenarios: ScenarioItem[] = [];
  const regex =
    /\|\s*\*\*Senaryo\s*(\d+):\s*([^*]+)\*\*\s*\|\s*[^|]*\|\s*\*\*([^*%]+)\(%(\d+)\)\*\*/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(raw)) !== null) {
    scenarios.push({
      name: `Senaryo ${match[1]}: ${match[2].trim()}`,
      label: match[3].trim(),
      probability: Number(match[4]),
    });
  }
  return scenarios;
}

function parsePrioritySignals(raw: string): PrioritySignalItem[] {
  const signals: PrioritySignalItem[] = [];
  const regex =
    /\|\s*\*\*(P[1-3])\s*\((\d+)\/15\)\*\*\s*\|\s*([^|]+)\|/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(raw)) !== null) {
    signals.push({
      level: match[1],
      score: Number(match[2]),
      title: match[3].replace(/\[\d+\]/g, "").trim(),
    });
  }
  return signals;
}

function parseMarketMetrics(raw: string): MarketMetricItem[] {
  const sec41 = raw.match(/###\s*4\.1\b([\s\S]*?)(?=\n###\s*4\.2|\n##\s*5\.)/);
  if (!sec41) return [];
  const rows: MarketMetricItem[] = [];
  for (const line of sec41[1].split(/\r?\n/)) {
    if (!line.trim().startsWith("|") || line.includes("---")) continue;
    const cols = line
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());
    if (cols.length < 4 || cols[0].includes("Gösterge")) continue;
    const indicator = cols[0].replace(/\*\*/g, "").trim();
    const value = cols[1].replace(/\[\d+\]/g, "").replace(/\*\*/g, "").trim();
    const delta = cols[2].replace(/\*\*/g, "").trim();
    const note = cols[3].replace(/\*\*/g, "").trim();
    if (value.toLowerCase().includes("teyit edilememiştir")) continue;
    rows.push({ indicator, value, delta, note });
  }
  return rows.slice(0, 8);
}

export function getAllReports(): IntelligenceReport[] {
  if (!fs.existsSync(REPORTS_DIR)) return [];
  const files = fs
    .readdirSync(REPORTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .reverse();

  return files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(REPORTS_DIR, file), "utf-8");
    const lines = raw.split(/\r?\n/);

    const h1 = lines.find((l) => l.startsWith("# ")) ?? `# ${slug}`;
    const cutoffMatch = h1.match(/\[([^\]]+)\]/);
    const cutoff = cutoffMatch ? cutoffMatch[1] : slug;
    const dateMatch = slug.match(/^(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch ? dateMatch[1] : slug;

    const headlineLine =
      lines.find((l) => l.startsWith("**") && l.endsWith("**")) ?? "";
    const headline = headlineLine.replace(/^\*\*|\*\*$/g, "").trim();

    const blufIdx = lines.findIndex((l) => l.startsWith("## 1."));
    let blufPreview = "";
    if (blufIdx !== -1) {
      for (let i = blufIdx + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line && !line.startsWith("|") && !line.startsWith("#")) {
          blufPreview = line
            .replace(
              /\[(?:OLGU|ANALİTİK YARGI|İDDİA|VARSAYIM|TEMEL VARSAYIM)\]\s*/g,
              ""
            )
            .replace(/\[\d+\]/g, "");
          break;
        }
      }
    }

    const toc: { id: string; text: string }[] = [];
    const renderer = new marked.Renderer();
    renderer.heading = ({ tokens, depth }) => {
      const text =
        tokens.map((t) => ("text" in t ? t.text : "")).join("") || "";
      const id = slugify(text);
      if (depth === 2) {
        toc.push({ id, text });
      }
      return `<h${depth} id="${id}">${text}</h${depth}>\n`;
    };

    const bodyWithoutH1 = lines.slice(1).join("\n");
    const rawHtml = marked.parse(bodyWithoutH1, {
      renderer,
      async: false,
    }) as string;
    const htmlContent = enhanceReportHtml(rawHtml);

    return {
      slug,
      date,
      cutoff,
      title: h1.replace(/^#\s*/, ""),
      headline,
      blufPreview,
      scenarios: parseScenarios(raw),
      signals: parsePrioritySignals(raw),
      marketMetrics: parseMarketMetrics(raw),
      htmlContent,
      toc,
    };
  });
}

export function getReportBySlug(slug: string): IntelligenceReport | undefined {
  return getAllReports().find((r) => r.slug === slug);
}
