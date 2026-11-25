import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllReports, getReportBySlug } from "@/lib/reports";
import { ArrowLeft, Calendar, List } from "lucide-react";

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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
      <article className="lg:col-span-9 bg-white border border-[#e2dfd7] rounded-xl p-6 sm:p-10 shadow-sm">
        <div className="lg:hidden mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1e3a5f] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Tüm Bültenlere Dön
          </Link>
        </div>

        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#8b1e3f] mb-3">
          <Calendar className="w-3.5 h-3.5" />
          <span>{report.cutoff}</span>
        </div>

        <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#121417] leading-tight mb-6 pb-6 border-b border-[#e2dfd7]">
          {report.title}
        </h1>

        <div
          className="prose-intel"
          dangerouslySetInnerHTML={{ __html: report.htmlContent }}
        />
      </article>
    </div>
  );
}
