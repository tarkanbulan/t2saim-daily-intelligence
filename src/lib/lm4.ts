import fs from "node:fs";
import path from "node:path";

export interface Lm4Telemetry {
  protocol: string;
  date: string;
  generated_utc: string;
  gdelt_attention_lock: {
    count: number;
    mean: number;
    std: number;
    latest: number;
    z_score: number;
    attention_lock: boolean;
  };
  gdelt_timeline_tail: { date: string; value: number }[];
  d08_coordinated_clusters: {
    anchor_title: string;
    domain_count: number;
    domains: string[];
    sample_urls: string[];
    timestamps: string[];
  }[];
  lm4_lf_scan: {
    lexicons_loaded: string[];
    pattern_count: number;
    total_articles_scanned: number;
    total_pattern_hits: number;
    weighted_manipulation_score: number;
    hits_by_category: Record<string, number>;
    samples: {
      pattern_id: string;
      term: string;
      category: string;
      risk_weight: number;
      domain: string;
      title: string;
      url: string;
      seendate: string;
    }[];
  };
  diplomatic_seismograph: {
    title: string;
    domain: string;
    seendate: string;
    url: string;
  }[];
  boomerang_foreign_feed: {
    title: string;
    domain: string;
    seendate: string;
    url: string;
  }[];
  sha256?: string;
}

export function getLatestLm4Telemetry(): Lm4Telemetry | null {
  const dir = path.join(process.cwd(), "content", "lm4");
  if (!fs.existsSync(dir)) return null;
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith("_lm4_telemetry.json"))
    .sort()
    .reverse();
  if (!files.length) return null;

  const latestFile = files[0];
  const data = JSON.parse(
    fs.readFileSync(path.join(dir, latestFile), "utf-8")
  ) as Lm4Telemetry;

  const manifestPath = path.join(dir, "MANIFEST_SHA256.json");
  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
      if (manifest[latestFile]?.sha256) {
        data.sha256 = manifest[latestFile].sha256;
      }
    } catch {
      // ignore
    }
  }
  return data;
}
