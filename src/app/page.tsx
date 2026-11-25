import Link from "next/link";
import { getAllReports } from "@/lib/reports";
import { getEws23Countries } from "@/lib/ews";
import {
  ArchitectureSchema,
  PrioritySignalChart,
  ScenarioDonutChart,
} from "@/components/ReportVisuals";
import { ArrowRight, Calendar, Globe2, ShieldAlert } from "lucide-react";

export default function HomePage() {
  const reports = getAllReports();
  const latest = reports[0];
  const ewsCountries = getEws23Countries();
  const topRisk = ewsCountries.slice(0, 4);

  if (!latest) {
    return (
      <div className="bg-white border border-[#e2dfd7] rounded-xl p-10 text-center">
        <h1 className="font-serif-editorial text-2xl font-bold text-[#1e3a5f]">
          Henüz yayımlanmış rapor bulunmuyor
        </h1>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Manşet - Son Rapor */}
      <section className="bg-white border border-[#e2dfd7] rounded-xl p-5 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#8b1e3f]">
          <span className="px-2.5 py-0.5 rounded bg-[#8b1e3f] text-white font-semibold">
            SON BÜLTEN
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#4a5568]">
            <Calendar className="w-3.5 h-3.5" />
            {latest.cutoff}
          </span>
        </div>

        <h1 className="font-serif-editorial text-2xl sm:text-4xl font-bold text-[#121417] leading-tight">
          {latest.headline || latest.title}
        </h1>

        <p className="text-base sm:text-lg text-[#374151] leading-relaxed">
          {latest.blufPreview}
        </p>

        {/* Grafikler: Senaryo Donut + P1/P2 Önem Eşiği */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ScenarioDonutChart scenarios={latest.scenarios} />
          <PrioritySignalChart signals={latest.signals} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#efede7]">
          <div className="flex items-center gap-2 text-xs text-[#64748b]">
            <ShieldAlert className="w-4 h-4 text-[#1e3a5f] shrink-0" />
            <span>
              Kısaltma açıklamaları (hover/dokunmatik) · Tıklanabilir kaynakça
            </span>
          </div>
          <Link
            href={`/rapor/${latest.slug}`}
            className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#162c48] transition-colors"
          >
            Tam Raporu Oku
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* EWS 23 Ülke Kriz Takvimi Özeti */}
      {topRisk.length > 0 && (
        <section className="bg-white border border-[#e2dfd7] rounded-xl p-5 sm:p-7 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-[#8b1e3f]" />
              <h2 className="font-serif-editorial text-xl font-bold text-[#1e3a5f]">
                EWS 23 Ülke Günlük Kriz Takvimi (En Yüksek Riskli 4 Ülke)
              </h2>
            </div>
            <Link
              href="/ews-takvim"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#8b1e3f] hover:underline"
            >
              23 Ülke Takvimini Aç
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {topRisk.map((c) => (
              <div
                key={c.iso3}
                className="rounded-lg border border-[#e2dfd7] bg-[#faf9f6] p-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-[#121417]">
                    {c.countryName}
                  </span>
                  <span className="font-mono text-sm font-bold text-[#8b1e3f]">
                    {c.forward1yScore.toFixed(2)}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-[#64748b] mb-2">
                  2025: {c.v270Score2025.toFixed(2)} (+{c.deltaScore.toFixed(2)})
                </div>
                <div className="text-xs text-[#374151] line-clamp-2">
                  {c.primaryCrisisLabel}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mimari Akış Şeması */}
      <ArchitectureSchema />

      {/* Arşiv */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#e2dfd7] pb-2">
          <h2 className="font-serif-editorial text-xl font-bold text-[#1e3a5f]">
            Günlük Brifing Arşivi
          </h2>
          <span className="text-xs font-mono text-[#64748b]">
            Toplam {reports.length} bülten
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reports.map((rep) => (
            <Link
              key={rep.slug}
              href={`/rapor/${rep.slug}`}
              className="group bg-white border border-[#e2dfd7] rounded-lg p-5 hover:border-[#1e3a5f] transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-mono text-[#8b1e3f] mb-2">
                  {rep.cutoff}
                </div>
                <h3 className="font-serif-editorial text-lg font-bold text-[#121417] group-hover:text-[#1e3a5f] transition-colors mb-2">
                  {rep.headline || rep.title}
                </h3>
                <p className="text-sm text-[#4a5568] line-clamp-3">
                  {rep.blufPreview}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#efede7] flex items-center justify-between text-xs font-semibold text-[#1e3a5f]">
                <span>Raporu Aç</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
