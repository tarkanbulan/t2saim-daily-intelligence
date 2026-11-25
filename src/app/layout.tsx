import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "T2SAIM Günlük Stratejik İstihbarat Brifingi",
  description:
    "Türkiye ve küresel sistem odaklı günlük açık kaynak (OSINT), makro-ekonomi, oyun teorisi ve kurumsal risk analizi bülteni.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${newsreader.variable}`}>
      <body className="min-h-screen flex flex-col">
        <header className="border-b border-[#e2dfd7] bg-white/90 backdrop-blur sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="group flex flex-col">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#8b1e3f] font-semibold">
                T2SAIM · OSINT &amp; STRATEJİK ÖNGÖRÜ
              </span>
              <span className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1e3a5f] group-hover:opacity-85 transition-opacity">
                Günlük Stratejik İstihbarat
              </span>
            </Link>
            <div className="flex items-center gap-3 text-xs font-mono text-[#4a5568]">
              <span className="px-2.5 py-1 rounded bg-[#f3f1eb] border border-[#e2dfd7]">
                ICD 203/206 · NATO 6×6
              </span>
              <span className="hidden sm:inline px-2.5 py-1 rounded bg-[#1e3a5f] text-white">
                VERITAS PER SE
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>

        <footer className="border-t border-[#e2dfd7] bg-white mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#64748b]">
            <p>
              T2SAIM Günlük Stratejik İstihbarat Bülteni · Çift Katmanlı Durumsal Mimari
            </p>
            <p className="font-mono">
              Her gün 07:00 UTC+3 veri kesimiyle güncellenir.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
