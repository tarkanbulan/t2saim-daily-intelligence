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
