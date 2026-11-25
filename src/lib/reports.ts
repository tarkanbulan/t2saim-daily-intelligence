import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

export interface ScenarioItem {
  name: string;
  probability: number;
  label: string;
}

export interface IntelligenceReport {
  slug: string;
  date: string;
  cutoff: string;
  title: string;
  headline: string;
  blufPreview: string;
  scenarios: ScenarioItem[];
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

function enhanceEpistemicTags(html: string): string {
  return html
    .replace(
      /\[OLGU\]/g,
      '<span class="badge badge-fact">OLGU</span>'
    )
    .replace(
      /\[İDDİA\]/g,
      '<span class="badge badge-claim">İDDİA</span>'
    )
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
      '<span class="badge badge-nato">NATO: $1</span>'
    )
    .replace(
      /\[Analitik Güven:\s*([^\]]+)\]/g,
      '<span class="badge badge-confidence">Analitik Güven: $1</span>'
    )
    .replace(
      /<table>/g,
      '<div class="table-wrap"><table>'
    )
    .replace(/<\/table>/g, "</table></div>");
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
          blufPreview = line.replace(/\[(?:OLGU|ANALİTİK YARGI|İDDİA|VARSAYIM|TEMEL VARSAYIM)\]\s*/g, "");
          break;
        }
      }
    }

    const toc: { id: string; text: string }[] = [];
    const renderer = new marked.Renderer();
    renderer.heading = ({ tokens, depth }) => {
      const text = tokens.map((t) => ("text" in t ? t.text : "")).join("") || "";
      const id = slugify(text);
      if (depth === 2) {
        toc.push({ id, text });
      }
      return `<h${depth} id="${id}">${text}</h${depth}>\n`;
    };

    const bodyWithoutH1 = lines.slice(1).join("\n");
    const rawHtml = marked.parse(bodyWithoutH1, { renderer, async: false }) as string;
    const htmlContent = enhanceEpistemicTags(rawHtml);

    return {
      slug,
      date,
      cutoff,
      title: h1.replace(/^#\s*/, ""),
      headline,
      blufPreview,
      scenarios: parseScenarios(raw),
      htmlContent,
      toc,
    };
  });
}

export function getReportBySlug(slug: string): IntelligenceReport | undefined {
  return getAllReports().find((r) => r.slug === slug);
}
