import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import Link from "next/link";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "T2SAIM Günlük Stratejik İstihbarat Brifingi",
  description:
    "Türkiye ve küresel sistem odaklı günlük açık kaynak (OSINT), makro-ekonomi, oyun teorisi, EWS 23 ülke takvimi ve kurumsal risk analizi bülteni.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${newsreader.variable}`}>
      <body className="min-h-screen flex flex-col">
        <header className="border-b border-[#e2dfd7] bg-white/95 backdrop-blur sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
            <Link href="/" className="group flex flex-col">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.18em] text-[#8b1e3f] font-semibold">
                T2SAIM · OSINT &amp; STRATEJİK ÖNGÖRÜ
              </span>
              <span className="font-serif-editorial text-xl sm:text-3xl font-bold text-[#1e3a5f] group-hover:opacity-85 transition-opacity">
                Günlük Stratejik İstihbarat
              </span>
              <span className="font-serif-editorial italic text-xs sm:text-sm tracking-wide mt-0.5">
                <span className="text-[#8b1e3f]">In memoriam</span>{" "}
                <span className="text-[#1e3a5f] font-semibold">Erkut Ersoy</span>{" "}
                <span className="text-[#8b1e3f]">— cum reverentia et gratitudine</span>
              </span>
            </Link>

            <nav className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
              <Link
                href="/"
                className="px-3 py-1.5 rounded-lg bg-[#f3f1eb] hover:bg-[#e7e4dc] text-[#1e3a5f] font-semibold transition-colors"
              >
                Günlük Brifing
              </Link>
              <Link
                href="/lm4-adli"
                className="px-3 py-1.5 rounded-lg bg-[#fdf2f4] hover:bg-[#fbe3e8] text-[#8b1e3f] border border-[#f5c6d0] font-semibold transition-colors"
              >
                LM-4 Adli Medya
              </Link>
              <Link
                href="/ews-takvim"
                className="px-3 py-1.5 rounded-lg bg-[#1e3a5f] hover:bg-[#162c48] text-white font-semibold transition-colors"
              >
                EWS 23 Ülke Takvimi
              </Link>
              <Link
                href="/special-edition"
                className="px-3 py-1.5 rounded-lg bg-[#fbf8f1] hover:bg-[#f3ebda] text-[#6b4c1e] border border-[#e2d4b7] font-semibold transition-colors"
              >
                Özel Dosya
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 py-6 sm:py-8">
          {children}
        </main>

        <footer className="border-t border-[#e2dfd7] bg-white mt-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#64748b]">
            <p>
              T2SAIM Günlük Stratejik İstihbarat Bülteni · Çift Katmanlı Durumsal Mimari
            </p>
            <p className="font-mono">
              Her gün 07:00 UTC+3 veri kesimiyle güncellenir · VERITAS PER SE
            </p>
          </div>
        </footer>
        <SpeedInsights />
      </body>
    </html>
  );
}
