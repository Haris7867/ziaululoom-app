import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { LanguageProvider, langInitScript } from "@/i18n/provider";
import { SiteHeader } from "@/components/SiteHeader";
import { CookieNotice, FloatingWhatsApp, SiteFooter } from "@/components/SiteFooter";
import { DecorBackground } from "@/components/Decor";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ziaululoom.com"),
  title: {
    default: "Jamia Ghousia Zia-Ul-Uloom — Faith, Scholarship, Service",
    template: "%s | Jamia Ghousia Zia-Ul-Uloom",
  },
  description:
    "A bilingual Islamic higher-education institution in Lahore, Pakistan: Alimiyyah and degree programmes, Darul Ifta, a digital library, Qurbani 2027 and student welfare.",
  keywords: [
    "Islamic university Pakistan", "Alimiyyah", "Darul Ifta", "Qurbani 2027", "Islamic studies Lahore",
  ],
  openGraph: {
    type: "website",
    title: "Jamia Ghousia Zia-Ul-Uloom",
    description: "Islamic higher education in Pakistan — programmes, fatawa, library, Qurbani 2027 and donations.",
    images: ["/images/campus-hero.jpg"],
    locale: "en_PK",
    siteName: "Jamia Ghousia Zia-Ul-Uloom",
  },
  twitter: { card: "summary_large_image", images: ["/images/campus-hero.jpg"] },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: langInitScript }} />
        <meta name="theme-color" content="#00633A" />
      </head>
      <body className="antialiased">
        <LanguageProvider>
          <DecorBackground />
          <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-3 focus:top-3 focus:z-50 focus:rounded focus:bg-deep focus:px-4 focus:py-2 focus:text-white">
            Skip to content
          </a>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <FloatingWhatsApp />
          <CookieNotice />
        </LanguageProvider>
      </body>
    </html>
  );
}
