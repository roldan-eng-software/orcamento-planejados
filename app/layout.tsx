import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Suspense } from "react";
import { GoogleAnalyticsPageView } from "@/components/analytics/google-analytics-page-view";
import "./globals.css";

const googleAnalyticsId = "G-T6H05QHR20";

export const metadata: Metadata = {
  title: "Roldan Marcenaria",
  description: "Orcamentos para moveis planejados sob medida.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body>
        <header className="border-b border-[var(--line)] bg-white/85">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link className="text-lg font-bold text-[var(--brand-strong)]" href="/">
              Roldan Marcenaria
            </Link>
            <div className="flex items-center gap-4 text-sm text-slate-700">
              <Link href="/privacidade">Privacidade</Link>
              <Link href="/contato">Contato</Link>
              <Link className="font-semibold text-[var(--brand)]" href="/admin/login">
                Admin
              </Link>
            </div>
          </nav>
        </header>
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}', { send_page_view: false });
          `}
        </Script>
        <Suspense fallback={null}>
          <GoogleAnalyticsPageView measurementId={googleAnalyticsId} />
        </Suspense>
      </body>
    </html>
  );
}
