"use client";

import { useMemo, useState } from "react";
import type { EwsCountryForecast } from "@/lib/ews";
import { Calendar, ChevronDown, ExternalLink, Search } from "lucide-react";

const FLAG_STYLES: Record<
  EwsCountryForecast["flagLevel"],
  { bg: string; text: string; bar: string; label: string }
> = {
  black: {
    bg: "bg-[#111827] text-white",
    text: "text-[#111827]",
    bar: "bg-[#111827]",
    label: "SİYAH FLAG",
  },
  red: {
    bg: "bg-[#991b1b] text-white",
    text: "text-[#991b1b]",
    bar: "bg-[#b91c1c]",
    label: "KIRMIZI FLAG",
  },
  orange: {
    bg: "bg-[#c2410c] text-white",
    text: "text-[#c2410c]",
    bar: "bg-[#ea580c]",
    label: "TURUNCU FLAG",
  },
  yellow: {
    bg: "bg-[#a16207] text-white",
    text: "text-[#a16207]",
    bar: "bg-[#ca8a04]",
    label: "SARI FLAG",
  },
};

export function EwsCalendarClient({
  countries,
  todayStr,
}: {
  countries: EwsCountryForecast[];
  todayStr: string;
}) {
  const [filter, setFilter] = useState<
    "all" | EwsCountryForecast["flagLevel"]
  >("all");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>("TUR");

  const filtered = useMemo(() => {
    return countries.filter((c) => {
      if (filter !== "all" && c.flagLevel !== filter) return false;
      if (
        query.trim() &&
        !c.countryName.toLowerCase().includes(query.toLowerCase()) &&
        !c.iso3.toLowerCase().includes(query.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [countries, filter, query]);

  const counts = useMemo(() => {
    return {
      all: countries.length,
      black: countries.filter((c) => c.flagLevel === "black").length,
      red: countries.filter((c) => c.flagLevel === "red").length,
      orange: countries.filter((c) => c.flagLevel === "orange").length,
      yellow: countries.filter((c) => c.flagLevel === "yellow").length,
    };
  }, [countries]);

  return (
    <div className="space-y-8">
      {/* Başlık ve Günlük Takvim Özeti */}
      <section className="bg-white border border-[#e2dfd7] rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#8b1e3f] mb-2">
          <Calendar className="w-4 h-4" />
          <span>GÜNLÜK EWS KRİZ TAKVİMİ · {todayStr}</span>
        </div>
        <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#121417] mb-3">
          23 Kanonik Ülke Erken Uyarı (EWS) ve Günlük Kurum Takip Takvimi
        </h1>
        <p className="text-sm sm:text-base text-[#4a5568] leading-relaxed">
          T2SAIM v2.8.0 (1M AM-MCMC) modeliyle 23 ülke için hesaplanan 2025 baz ve
          1 yıllık ileri kriz risk skorları, ACH baskın hipotez dağılımları ve her
          gün taranan 138 resmi kurum (ülke başına 6 sütun) canlı takvim görünümü.
        </p>

        {/* 23 Ülke Risk Skorları Yatay Bar Grafiği */}
        <div className="mt-6 bg-[#faf9f6] border border-[#e2dfd7] rounded-lg p-4 sm:p-5">
          <div className="text-xs font-mono uppercase tracking-wider text-[#1e3a5f] font-bold mb-3">
            23 Ülke 1Y İleri Kriz Skoru Karşılaştırması (0–100)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2.5">
            {countries.map((c) => {
              const st = FLAG_STYLES[c.flagLevel];
              return (
                <div key={c.iso3} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-[#1f2937]">
                      {c.countryName}{" "}
                      <span className="font-mono text-[10px] text-[#64748b]">
                        ({c.iso3})
                      </span>
                    </span>
                    <span className={`font-mono font-bold ${st.text}`}>
                      {c.forward1yScore.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#e7e4dc] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${st.bar}`}
                      style={{ width: `${Math.min(100, c.forward1yScore)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filtreler ve Arama */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", `Tümü (${counts.all})`],
              ["black", `Siyah (${counts.black})`],
              ["red", `Kırmızı (${counts.red})`],
              ["orange", `Turuncu (${counts.orange})`],
              ["yellow", `Sarı (${counts.yellow})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-colors ${
                filter === key
                  ? "bg-[#1e3a5f] text-white border-[#1e3a5f]"
                  : "bg-white text-[#374151] border-[#e2dfd7] hover:border-[#1e3a5f]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ülke veya ISO3 ara (ör. TUR)..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#e2dfd7] rounded-lg focus:outline-none focus:border-[#1e3a5f]"
          />
        </div>
      </div>

      {/* Ülke Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((c) => {
          const st = FLAG_STYLES[c.flagLevel];
          const isOpen = expanded === c.iso3;
          return (
            <div
              key={c.iso3}
              className="bg-white border border-[#e2dfd7] rounded-xl p-5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif-editorial text-lg font-bold text-[#121417]">
                        {c.countryName}
                      </span>
                      <span className="text-xs font-mono text-[#64748b]">
                        {c.iso3}
                      </span>
                    </div>
                    <span
                      className={`inline-block mt-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded ${st.bg}`}
                    >
                      {st.label}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-xl font-bold text-[#121417]">
                      {c.forward1yScore.toFixed(2)}
                    </div>
                    <div className="text-[11px] font-mono text-[#64748b]">
                      2025: {c.v270Score2025.toFixed(2)} (
                      <span className="text-[#8b1e3f] font-semibold">
                        +{c.deltaScore.toFixed(2)}
                      </span>
                      )
                    </div>
                  </div>
                </div>

                <div className="text-xs text-[#374151] bg-[#faf9f6] border border-[#efede7] rounded-lg p-3 mb-3">
                  <div className="font-semibold text-[#1e3a5f] mb-1">
                    Baskın Kriz Vektörü:
                  </div>
                  <p>{c.primaryCrisisLabel}</p>
                </div>

                {/* ACH Dağılımı */}
                <div className="mb-3">
                  <div className="text-[11px] font-mono text-[#64748b] mb-1">
                    ACH Hipotez Dağılımı (Fon {c.achH1Fund}% · Borç {c.achH2Debt}% · Kur {c.achH3Fx}% · Reel {c.achH4Real}%)
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden flex bg-[#efede7]">
                    <div className="bg-[#7c3aed]" style={{ width: `${c.achH1Fund}%` }} />
                    <div className="bg-[#0284c7]" style={{ width: `${c.achH2Debt}%` }} />
                    <div className="bg-[#d97706]" style={{ width: `${c.achH3Fx}%` }} />
                    <div className="bg-[#dc2626]" style={{ width: `${c.achH4Real}%` }} />
                  </div>
                </div>

                <div className="text-xs text-[#4a5568] mb-3">
                  <span className="font-semibold text-[#121417]">
                    Baskın Politika Tepkisi ({c.dominantActionProb}%):
                  </span>{" "}
                  {c.dominantActionLabel}
                </div>
              </div>

              <div className="pt-3 border-t border-[#efede7]">
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : c.iso3)}
                  className="w-full flex items-center justify-between text-xs font-mono font-semibold text-[#1e3a5f] py-1"
                >
                  <span>
                    Günlük İzlenen Resmi Kurumlar ({c.institutions.length})
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && c.institutions.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {c.institutions.map((inst) => (
                      <a
                        key={inst.pillar}
                        href={inst.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-2 text-xs p-2 rounded bg-[#faf9f6] hover:bg-[#f0ede4] text-[#1f2937]"
                      >
                        <span className="truncate">{inst.name}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[#1e3a5f]" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
