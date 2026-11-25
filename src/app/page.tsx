import Link from "next/link";
import { getAllReports } from "@/lib/reports";
import { ArrowRight, Calendar, ShieldAlert, TrendingUp } from "lucide-react";

export default function HomePage() {
  const reports = getAllReports();
  const latest = reports[0];
  const archive = reports.slice(1);

  if (!latest) {
    return (
      <div className="bg-white border border-[#e2dfd7] rounded-xl p-10 text-center">
        <h1 className="font-serif-editorial text-2xl font-bold text-[#1e3a5f]">
          Henüz yayımlanmış rapor bulunmuyor
        </h1>
        <p className="text-sm text-[#4a5568] mt-2">
          İlk günlük stratejik istihbarat raporu üretildiğinde burada görünecektir.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Manşet - Son Rapor */}
      <section className="bg-white border border-[#e2dfd7] rounded-xl p-6 sm:p-10 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#8b1e3f] mb-4">
          <span className="px-2.5 py-0.5 rounded bg-[#8b1e3f] text-white font-semibold">
            SON BÜLTEN
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#4a5568]">
            <Calendar className="w-3.5 h-3.5" />
            {latest.cutoff}
          </span>
        </div>

        <h1 className="font-serif-editorial text-2xl sm:text-4xl font-bold text-[#121417] leading-tight mb-4">
          {latest.headline || latest.title}
        </h1>

        <p className="text-base sm:text-lg text-[#374151] leading-relaxed mb-6">
          {latest.blufPreview}
        </p>

        {/* Senaryo Olasılıkları Şeridi */}
        {latest.scenarios.length > 0 && (
          <div className="bg-[#faf9f6] border border-[#e2dfd7] rounded-lg p-5 mb-6">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#1e3a5f] font-bold mb-3">
              <TrendingUp className="w-4 h-4" />
              Güncel Senaryo Olasılıkları (1–6 Ay Ufku)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {latest.scenarios.map((sc, idx) => {
                const barColors = [
                  "bg-[#1e3a5f]",
                  "bg-[#8b1e3f]",
                  "bg-[#2d6a4f]",
                ];
                return (
                  <div
                    key={sc.name}
                    className="bg-white border border-[#e2dfd7] rounded-md p-3.5"
                  >
                    <div className="flex justify-between items-baseline gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-[#1f2937] line-clamp-1">
                        {sc.name}
                      </span>
                      <span className="font-mono text-sm font-bold text-[#1e3a5f]">
                        %{sc.probability}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#efede7] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColors[idx % barColors.length]}`}
                        style={{ width: `${sc.probability}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-[#64748b] mt-1.5 block">
                      ICD 203: {sc.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#efede7]">
          <div className="flex items-center gap-2 text-xs text-[#64748b]">
            <ShieldAlert className="w-4 h-4 text-[#1e3a5f]" />
            <span>8 Bölümlü Tam Brifing · Mini-ACH · Oyun Teorisi · Entman Matrisi</span>
          </div>
          <Link
            href={`/rapor/${latest.slug}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#162c48] transition-colors"
          >
            Tam Raporu Oku
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

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

      {archive.length === 0 && (
        <p className="text-xs text-[#64748b] italic">
          Her sabah 07:00 UTC+3 sonrası üretilen yeni bültenler otomatik olarak arşiv akışına eklenecektir.
        </p>
      )}
    </div>
  );
}
