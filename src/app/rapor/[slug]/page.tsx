import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllReports, getReportBySlug } from "@/lib/reports";
import { GlossaryArticle } from "@/components/GlossaryArticle";
import {
  PrioritySignalChart,
  ScenarioDonutChart,
} from "@/components/ReportVisuals";
import { ArrowLeft, Calendar, ChevronDown, Info, List } from "lucide-react";

export function generateStaticParams() {
  return getAllReports().map((r) => ({ slug: r.slug }));
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const report = getReportBySlug(slug);

  if (!report) {
    notFound();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      {/* Sol İçindekiler (Masaüstü) */}
      <aside className="hidden lg:block lg:col-span-3 sticky top-24 bg-white border border-[#e2dfd7] rounded-xl p-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1e3a5f] hover:underline mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Tüm Bültenler
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#64748b] font-bold mb-3">
          <List className="w-3.5 h-3.5" />
          Bölümler
        </div>
        <nav className="space-y-2 text-xs">
          {report.toc.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="block text-[#4a5568] hover:text-[#1e3a5f] leading-snug py-0.5"
            >
              {item.text}
            </a>
          ))}
        </nav>
      </aside>

      {/* Ana Rapor İçeriği */}
      <article className="lg:col-span-9 bg-white border border-[#e2dfd7] rounded-xl p-4 sm:p-10 shadow-sm space-y-6">
        <div className="lg:hidden flex items-center justify-between gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1e3a5f] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Tüm Bültenler
          </Link>
        </div>

        {/* Mobil Açılır Bölümler Menüsü */}
        <details className="lg:hidden bg-[#faf9f6] border border-[#e2dfd7] rounded-lg p-3">
          <summary className="flex items-center justify-between text-xs font-mono font-bold text-[#1e3a5f] cursor-pointer list-none">
            <span className="inline-flex items-center gap-1.5">
              <List className="w-4 h-4" />
              Rapor Bölümleri ({report.toc.length})
            </span>
            <ChevronDown className="w-4 h-4" />
          </summary>
          <nav className="mt-3 space-y-2 text-xs border-t border-[#e2dfd7] pt-2.5">
            {report.toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block text-[#374151] py-1"
              >
                {item.text}
              </a>
            ))}
          </nav>
        </details>

        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#8b1e3f]">
          <Calendar className="w-3.5 h-3.5" />
          <span>{report.cutoff}</span>
        </div>

        <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#121417] leading-tight pb-5 border-b border-[#e2dfd7]">
          {report.title}
        </h1>

        <div className="flex items-start gap-2 text-xs bg-[#f4f7fb] border border-[#d6e2f0] text-[#1e3a5f] rounded-lg p-3">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Altı noktalı çizgili kısaltmaların (<strong>BLUF</strong>,{" "}
            <strong>CDS</strong>, <strong>OVP</strong>, <strong>PIR</strong>{" "}
            vb.) üzerine gelerek veya dokunarak tanımını görebilir;{" "}
            <strong>[1]</strong> numaralı atıflara basarak doğrudan kaynakçaya
            gidebilirsiniz.
          </span>
        </div>

        {/* Rapor İçi Grafikler */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ScenarioDonutChart scenarios={report.scenarios} />
          <PrioritySignalChart signals={report.signals} />
        </div>

        <GlossaryArticle htmlContent={report.htmlContent} />
      </article>
    </div>
  );
}
