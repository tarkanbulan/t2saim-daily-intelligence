import { getLatestLm4Telemetry } from "@/lib/lm4";
import { Activity, ExternalLink, FileCheck2, Radio, ShieldAlert } from "lucide-react";

export default function Lm4AdliPage() {
  const data = getLatestLm4Telemetry();

  if (!data) {
    return (
      <div className="bg-white border border-[#e2dfd7] rounded-xl p-8 text-center">
        <h1 className="font-serif-editorial text-2xl font-bold text-[#1e3a5f]">
          LM-4 Adli Medya Telemetrisi Henüz Üretilmedi
        </h1>
        <p className="text-sm text-[#4a5568] mt-2">
          Günlük 07:00 TSİ çalıştırması sonrası canlı GDELT ve LM-4-LF (105 kalıp) verileri burada görünecektir.
        </p>
      </div>
    );
  }

  const maxTimelineVal = Math.max(
    1,
    ...data.gdelt_timeline_tail.map((t) => t.value)
  );
  const categories = Object.entries(data.lm4_lf_scan.hits_by_category).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <div className="space-y-8">
      {/* Üst Özet & Daubert SHA-256 Mührü */}
      <section className="bg-white border border-[#e2dfd7] rounded-xl p-5 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#8b1e3f] font-bold">
            <Radio className="w-4 h-4" />
            <span>{data.protocol} · {data.date}</span>
          </div>
          {data.sha256 && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono bg-[#e6f4ea] text-[#137333] border border-[#ceead6] px-2.5 py-1 rounded">
              <FileCheck2 className="w-3.5 h-3.5" />
              SHA-256: {data.sha256.slice(0, 16)}…
            </span>
          )}
        </div>

        <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#121417]">
          Türkiye İçi Medya Manipülasyonu ve Adli Dilbilim (LM-4-LF) Radarı
        </h1>
        <p className="text-sm sm:text-base text-[#4a5568] leading-relaxed">
          <em>&ldquo;HOW NOT WHO&rdquo;</em> ilkesiyle niyet atfı yapmadan yalnızca
          gözlemlenebilir dilsel örüntüleri ({data.lm4_lf_scan.pattern_count} kanonik
          kalıp), ≤48 saatlik koordineli başlık yayılımını (D-08) ve GDELT 2.0
          dikkat kilidi Z-skorunu deterministik olarak ölçer.
        </p>

        {/* 4 Temel Metrik Kartı */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-lg border border-[#e2dfd7] bg-[#faf9f6] p-4">
            <div className="text-[11px] font-mono text-[#64748b]">GDELT Z-SKORU</div>
            <div className="font-mono text-2xl font-bold text-[#1e3a5f] mt-1">
              {data.gdelt_attention_lock.z_score}
            </div>
            <div className="text-[11px] font-mono mt-1 text-[#8b1e3f]">
              {data.gdelt_attention_lock.attention_lock
                ? "DİKKAT KİLİDİ AKTİF (Z≥1.96)"
                : "Normal Bant (<1.96)"}
            </div>
          </div>

          <div className="rounded-lg border border-[#e2dfd7] bg-[#faf9f6] p-4">
            <div className="text-[11px] font-mono text-[#64748b]">D-08 KOPYA KÜME</div>
            <div className="font-mono text-2xl font-bold text-[#8b1e3f] mt-1">
              {data.d08_coordinated_clusters.length}
            </div>
            <div className="text-[11px] text-[#4a5568] mt-1">
              ≥2 mecrada eşzamanlı başlık
            </div>
          </div>

          <div className="rounded-lg border border-[#e2dfd7] bg-[#faf9f6] p-4">
            <div className="text-[11px] font-mono text-[#64748b]">LM-4 KALIP İSABETİ</div>
            <div className="font-mono text-2xl font-bold text-[#121417] mt-1">
              {data.lm4_lf_scan.total_pattern_hits}
            </div>
            <div className="text-[11px] text-[#4a5568] mt-1">
              {data.lm4_lf_scan.total_articles_scanned} makalede ({data.lm4_lf_scan.pattern_count} kalıp)
            </div>
          </div>

          <div className="rounded-lg border border-[#e2dfd7] bg-[#faf9f6] p-4">
            <div className="text-[11px] font-mono text-[#64748b]">AĞIRLIKLI RİSK SKORU</div>
            <div className="font-mono text-2xl font-bold text-[#2d6a4f] mt-1">
              {data.lm4_lf_scan.weighted_manipulation_score}
            </div>
            <div className="text-[11px] text-[#4a5568] mt-1">
              {data.lm4_lf_scan.lexicons_loaded.join(", ")}
            </div>
          </div>
        </div>
      </section>

      {/* GDELT 7 Günlük Medya Yoğunluk Grafiği */}
      {data.gdelt_timeline_tail.length > 0 && (
        <section className="bg-white border border-[#e2dfd7] rounded-xl p-5 sm:p-7 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#1e3a5f] font-bold mb-4">
            <Activity className="w-4 h-4" />
            GDELT 2.0 Son Ölçüm Penceresi Medya Yoğunluğu (Ham Hacim)
          </div>
          <div className="flex items-end gap-1.5 h-36 border-b border-[#e2dfd7] pb-2 overflow-x-auto">
            {data.gdelt_timeline_tail.map((pt, i) => {
              const hPct = Math.max(4, Math.round((pt.value / maxTimelineVal) * 100));
              return (
                <div
                  key={i}
                  className="flex-1 min-w-[10px] flex flex-col items-center justify-end h-full group"
                  title={`${pt.date}: ${pt.value}`}
                >
                  <div
                    className="w-full rounded-t bg-[#1e3a5f] group-hover:bg-[#8b1e3f] transition-colors"
                    style={{ height: `${hPct}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[#64748b] mt-2">
            <span>{data.gdelt_timeline_tail[0]?.date}</span>
            <span>Ortalama: {data.gdelt_attention_lock.mean} · Std: {data.gdelt_attention_lock.std}</span>
            <span>{data.gdelt_timeline_tail[data.gdelt_timeline_tail.length - 1]?.date}</span>
          </div>
        </section>
      )}

      {/* D-08 Koordineli / Copy-Paste Kümeleri */}
      <section className="bg-white border border-[#e2dfd7] rounded-xl p-5 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8b1e3f] font-bold">
          <ShieldAlert className="w-4 h-4" />
          Motor 1 (D-08): ≤48 Saat İçinde Çoklu Mecrada Eşzamanlı Başlık Kümeleri
        </div>

        {data.d08_coordinated_clusters.length === 0 ? (
          <p className="text-sm text-[#4a5568]">
            Son 48 saatlik taramada ≥2 bağımsız alan adında eşzamanlı kopya başlık kümesi tespit edilmedi.
          </p>
        ) : (
          <div className="space-y-3">
            {data.d08_coordinated_clusters.map((cl, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-[#e2dfd7] bg-[#faf9f6] p-4 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-sm text-[#121417]">
                    {cl.anchor_title}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#8b1e3f] text-white">
                    {cl.domain_count} Mecra
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cl.domains.map((d) => (
                    <span
                      key={d}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-[#e2dfd7] text-[#1e3a5f]"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* LM-4 Kategori Dağılımı ve Eşleşen Örnekler */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#e2dfd7] rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
          <h2 className="font-serif-editorial text-lg font-bold text-[#1e3a5f]">
            LM-4-LF Kalıp Kategorileri Dağılımı
          </h2>
          {categories.length === 0 ? (
            <p className="text-xs text-[#64748b]">
              Son taramada kategori eşleşmesi kaydedilmedi.
            </p>
          ) : (
            <div className="space-y-2.5">
              {categories.map(([cat, cnt]) => (
                <div key={cat} className="flex items-center justify-between text-xs border-b border-[#efede7] pb-2">
                  <span className="text-[#1f2937] font-medium">{cat}</span>
                  <span className="font-mono font-bold text-[#8b1e3f]">{cnt}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-[#e2dfd7] rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
          <h2 className="font-serif-editorial text-lg font-bold text-[#1e3a5f]">
            Diplomatik Sismograf &amp; Dış Basın Akışı (Son 48s)
          </h2>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {data.diplomatic_seismograph.slice(0, 6).map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between gap-2 text-xs p-2.5 rounded bg-[#faf9f6] hover:bg-[#f0ede4] border border-[#efede7]"
              >
                <div>
                  <div className="font-semibold text-[#121417]">{item.title}</div>
                  <div className="text-[10px] font-mono text-[#64748b] mt-0.5">
                    {item.domain} · {item.seendate}
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[#1e3a5f] mt-0.5" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
