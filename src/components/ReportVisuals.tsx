import type { PrioritySignalItem, ScenarioItem } from "@/lib/reports";

export function ArchitectureSchema() {
  const steps = [
    {
      tag: "KATMAN 1",
      title: "Stok Hafıza",
      desc: "Aylık/çeyreklik sabit OVP, TÜİK 2025=100, WJP & WIPO çıpaları",
      color: "border-[#1e3a5f] bg-[#f4f7fb]",
      badge: "bg-[#1e3a5f] text-white",
    },
    {
      tag: "KATMAN 2",
      title: "24s Delta OSINT",
      desc: "Çok dilli tarama + 15 puanlık önem eşiği + 4 kademeli kaynak denetimi",
      color: "border-[#8b1e3f] bg-[#fdf4f6]",
      badge: "bg-[#8b1e3f] text-white",
    },
    {
      tag: "MOTORLAR",
      title: "SATs & Oyun Teorisi",
      desc: "Mini-ACH, 2×2 Nash Dengesi, Entman Söylem & Bayesyen güncelleme",
      color: "border-[#2d6a4f] bg-[#f2f9f5]",
      badge: "bg-[#2d6a4f] text-white",
    },
    {
      tag: "KATMAN 3",
      title: "Devir Teslim & Red-Cell",
      desc: "Bölüm 6.3–7 eşikleri ertesi güne aktarılır + 7 maddelik öz-denetim",
      color: "border-[#6b4c1e] bg-[#fbf8f1]",
      badge: "bg-[#6b4c1e] text-white",
    },
  ];

  return (
    <div className="bg-white border border-[#e2dfd7] rounded-xl p-5 sm:p-6">
      <div className="text-xs font-mono uppercase tracking-wider text-[#1e3a5f] font-bold mb-4">
        Üç Katmanlı Durumsal İstihbarat Mimarisi (Akış Şeması)
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((s, i) => (
          <div
            key={s.tag}
            className={`relative rounded-lg border p-4 ${s.color}`}
          >
            <span
              className={`inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded ${s.badge} mb-2`}
            >
              {s.tag}
            </span>
            <h3 className="font-serif-editorial text-base font-bold text-[#121417] mb-1">
              {i + 1}. {s.title}
            </h3>
            <p className="text-xs text-[#374151] leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScenarioDonutChart({
  scenarios,
}: {
  scenarios: ScenarioItem[];
}) {
  if (!scenarios.length) return null;
  const colors = ["#1e3a5f", "#8b1e3f", "#2d6a4f"];
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;

  return (
    <div className="bg-[#faf9f6] border border-[#e2dfd7] rounded-xl p-5">
      <div className="text-xs font-mono uppercase tracking-wider text-[#1e3a5f] font-bold mb-4">
        Senaryo Olasılık Dağılımı (Bayesyen 1–6 Ay Ufku)
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-36 h-36 shrink-0">
          <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
            {scenarios.map((sc, idx) => {
              const dash = (sc.probability / 100) * circumference;
              const offset = -cumulative;
              cumulative += dash;
              return (
                <circle
                  key={sc.name}
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="transparent"
                  stroke={colors[idx % colors.length]}
                  strokeWidth="18"
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={offset}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-mono text-[#64748b]">TOPLAM</span>
            <span className="text-lg font-mono font-bold text-[#121417]">
              %100
            </span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-3">
          {scenarios.map((sc, idx) => (
            <div key={sc.name} className="space-y-1">
              <div className="flex justify-between items-baseline gap-2 text-xs">
                <span className="font-semibold text-[#1f2937] flex items-center gap-2">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ backgroundColor: colors[idx % colors.length] }}
                  />
                  {sc.name}
                </span>
                <span className="font-mono font-bold text-[#1e3a5f] shrink-0">
                  %{sc.probability}
                </span>
              </div>
              <div className="w-full h-2 bg-[#e7e4dc] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${sc.probability}%`,
                    backgroundColor: colors[idx % colors.length],
                  }}
                />
              </div>
              <span className="text-[11px] font-mono text-[#64748b] block">
                ICD 203: {sc.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PrioritySignalChart({
  signals,
}: {
  signals: PrioritySignalItem[];
}) {
  if (!signals.length) return null;
  return (
    <div className="bg-[#faf9f6] border border-[#e2dfd7] rounded-xl p-5">
      <div className="text-xs font-mono uppercase tracking-wider text-[#8b1e3f] font-bold mb-4">
        15 Puanlık Deterministik Önem Eşiği Grafiği (P1 ≥ 11 | P2 ≥ 7)
      </div>
      <div className="space-y-3">
        {signals.map((sig, i) => {
          const pct = Math.round((sig.score / 15) * 100);
          const isP1 = sig.level === "P1";
          return (
            <div key={i} className="space-y-1">
              <div className="flex justify-between items-start gap-3 text-xs">
                <span className="text-[#1f2937] font-medium leading-snug">
                  <span
                    className={`inline-block font-mono font-bold px-1.5 py-0.5 rounded mr-1.5 text-[10px] ${
                      isP1
                        ? "bg-[#8b1e3f] text-white"
                        : "bg-[#1e3a5f] text-white"
                    }`}
                  >
                    {sig.level}
                  </span>
                  {sig.title}
                </span>
                <span className="font-mono font-bold text-[#121417] shrink-0">
                  {sig.score}/15
                </span>
              </div>
              <div className="w-full h-2 bg-[#e7e4dc] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isP1 ? "bg-[#8b1e3f]" : "bg-[#1e3a5f]"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
