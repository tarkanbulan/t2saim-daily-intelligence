import fs from "node:fs";
import path from "node:path";

export interface EwsCountryForecast {
  iso2: string;
  iso3: string;
  countryName: string;
  v270Score2025: number;
  forward1yScore: number;
  deltaScore: number;
  flag: string;
  flagLevel: "black" | "red" | "orange" | "yellow";
  primaryCrisisCode: string;
  primaryCrisisLabel: string;
  achH1Fund: number;
  achH2Debt: number;
  achH3Fx: number;
  achH4Real: number;
  dominantActionLabel: string;
  dominantActionProb: number;
  institutions: {
    pillar: string;
    name: string;
    url: string;
  }[];
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function detectFlagLevel(flag: string): "black" | "red" | "orange" | "yellow" {
  const upper = flag.toUpperCase();
  if (upper.includes("SİYAH") || upper.includes("SIYAH")) return "black";
  if (upper.includes("KIRMIZI")) return "red";
  if (upper.includes("TURUNCU")) return "orange";
  return "yellow";
}

export function getEws23Countries(): EwsCountryForecast[] {
  const ewsDir = path.join(process.cwd(), "content", "ews");
  const forecastPath = path.join(
    ewsDir,
    "07_KANONIK_23_ULKE_1Y_EWS_ACH_LAMP_1M_AMMCMC_FORECAST_V280.csv"
  );
  const instPath = path.join(
    ewsDir,
    "09_KANONIK_23_ULKE_138_RESMI_KURUM_GUNLUK_TAKIP_MATRISI_V280.csv"
  );

  if (!fs.existsSync(forecastPath)) return [];

  const instMap = new Map<
    string,
    { pillar: string; name: string; url: string }[]
  >();
  if (fs.existsSync(instPath)) {
    const instLines = fs
      .readFileSync(instPath, "utf-8")
      .split(/\r?\n/)
      .filter(Boolean);
    for (let i = 1; i < instLines.length; i++) {
      const cols = parseCsvLine(instLines[i]);
      if (cols.length < 9) continue;
      const iso3 = cols[2];
      const list = instMap.get(iso3) ?? [];
      list.push({
        pillar: cols[6],
        name: cols[7],
        url: cols[8].split("|")[0].trim(),
      });
      instMap.set(iso3, list);
    }
  }

  const lines = fs
    .readFileSync(forecastPath, "utf-8")
    .split(/\r?\n/)
    .filter(Boolean);

  const countries: EwsCountryForecast[] = [];
  for (let i = 1; i < lines.length; i++) {
    const c = parseCsvLine(lines[i]);
    if (c.length < 21) continue;
    const v270 = Number(c[4]);
    const fwd = Number(c[5]);
    const iso3 = c[2];
    countries.push({
      iso2: c[1],
      iso3,
      countryName: c[3],
      v270Score2025: v270,
      forward1yScore: fwd,
      deltaScore: Number((fwd - v270).toFixed(2)),
      flag: c[6],
      flagLevel: detectFlagLevel(c[6]),
      primaryCrisisCode: c[7],
      primaryCrisisLabel: c[8],
      achH1Fund: Math.round(Number(c[9]) * 100),
      achH2Debt: Math.round(Number(c[10]) * 100),
      achH3Fx: Math.round(Number(c[11]) * 100),
      achH4Real: Math.round(Number(c[12]) * 100),
      dominantActionLabel: c[19],
      dominantActionProb: Math.round(Number(c[20]) * 100),
      institutions: instMap.get(iso3) ?? [],
    });
  }

  return countries.sort((a, b) => b.forward1yScore - a.forward1yScore);
}
