import fs from "node:fs";
import path from "node:path";

const sourceDir = path.resolve(process.cwd(), "..", "raporlar");
const targetDir = path.resolve(process.cwd(), "content", "raporlar");

fs.mkdirSync(targetDir, { recursive: true });

if (fs.existsSync(sourceDir)) {
  const files = fs.readdirSync(sourceDir).filter((f) => f.endsWith(".md"));
  for (const file of files) {
    fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, file));
  }
  console.log(`Synced ${files.length} report(s) to content/raporlar.`);
} else {
  console.log("Source raporlar directory not found; keeping existing content/raporlar.");
}

// EWS 23 ulke canonical forecast ve 138 kurum gunluk takip matrisi senkronizasyonu
const ewsSourceDir = path.resolve(
  process.cwd(),
  "..",
  "..",
  "..",
  "10_T2SAIM_EWS_WTG_Clean_Area",
  "02_APPROVED_FINAL_DATA"
);
const ewsTargetDir = path.resolve(process.cwd(), "content", "ews");
fs.mkdirSync(ewsTargetDir, { recursive: true });

const ewsFiles = [
  "07_KANONIK_23_ULKE_1Y_EWS_ACH_LAMP_1M_AMMCMC_FORECAST_V280.csv",
  "09_KANONIK_23_ULKE_138_RESMI_KURUM_GUNLUK_TAKIP_MATRISI_V280.csv",
];

for (const f of ewsFiles) {
  const src = path.join(ewsSourceDir, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(ewsTargetDir, f));
    console.log(`Synced EWS file: ${f}`);
  }
}
