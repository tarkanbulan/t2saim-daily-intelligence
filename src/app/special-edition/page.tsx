import { ArrowLeft, ExternalLink, Scale } from "lucide-react";
import Link from "next/link";

export default function SpecialEditionPage() {
  return (
    <div className="space-y-6">
      <section className="bg-white border border-[#e2dfd7] rounded-xl p-5 sm:p-7 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#8b1e3f] font-bold mb-1.5">
            <Scale className="w-4 h-4" />
            <span>SPECIAL EDITION · ADLİ FİNANS DOSYASI (2012–2026)</span>
          </div>
          <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#121417]">
            Türkiye Adli Finans Mekanizmaları İncelemesi
          </h1>
          <p className="text-xs sm:text-sm text-[#4a5568] mt-1">
            Serbest Fonlar, SPK 2026/61 Tasfiyeleri, E-Para Lisans Zinciri, Kapalıçarşı ve 2012–2016 Zarrab/Halkbank Yapısal Karşılaştırması (Etkileşimli Chart.js &amp; 47 Kayıtlı Veri Gezgini).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#e2dfd7] bg-[#faf9f6] text-xs font-mono font-semibold text-[#1e3a5f] hover:bg-[#efede7]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Günlük Brifing
          </Link>
          <a
            href="/special/turkiye-adli-finans-2012-2026.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1e3a5f] text-white text-xs font-mono font-semibold hover:bg-[#162c48]"
          >
            Tam Ekran Aç
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      <div className="bg-white border border-[#e2dfd7] rounded-xl overflow-hidden shadow-sm">
        <iframe
          src="/special/turkiye-adli-finans-2012-2026.html"
          title="Türkiye Adli Finans Mekanizmaları İncelemesi (2012–2026)"
          className="w-full h-[82vh] min-h-[680px] border-0"
        />
      </div>
    </div>
  );
}
