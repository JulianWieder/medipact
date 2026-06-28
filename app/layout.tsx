import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ConditionalHeader, ConditionalFooter } from "@/app/components/ConditionalHeader";
import { JsonLd } from "@/app/components/JsonLd";
import Analytics from "@/app/components/Analytics";
import CookieConsent from "@/app/components/CookieConsent";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "medipact",
  url: "https://medipact.de",
  logo: "https://medipact.de/og-image.png",
  description:
    "KI-gestützte Mediation für private Konflikte – bei Trennung, Nachbarschaftsstreit und Erbschaft.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: "German",
  },
  sameAs: ["https://twitter.com/medipact_de"],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "medipact",
  url: "https://medipact.de",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://medipact.de/cases?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export const metadata: Metadata = {
  title: "medipact – Mediation online: Konflikte fair, vertraulich und ohne Gericht lösen",
  description:
    "Mediation online – Konflikte fair, vertraulich und ohne Gericht lösen. KI-basierte Mediation nach dem Harvard-Prinzip. Schneller, günstiger, menschlicher als klassische Mediation.",
  keywords: [
    "Mediation",
    "KI-Mediation",
    "Konfliktlösung",
    "Harvard-Prinzip",
    "Trennung",
    "Erbschaft",
    "Nachbarschaftsstreit",
  ],
  authors: [{ name: "medipact" }],
  creator: "medipact",
  publisher: "medipact",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://medipact.de",
    siteName: "medipact",
    title: "medipact – Mediation online: Konflikte fair, vertraulich und ohne Gericht lösen",
    description: "Mediation online – Konflikte fair, vertraulich und ohne Gericht lösen.",
    images: [
      {
        url: "https://medipact.de/og-image.png",
        width: 1200,
        height: 630,
        alt: "medipact",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "medipact – Mediation online: Konflikte fair, vertraulich und ohne Gericht lösen",
    description: "Mediation online – Konflikte fair, vertraulich und ohne Gericht lösen.",
    creator: "@medipact_de",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Resolved by middleware.ts for marketing routes (/, /de/..., /en/...).
  // For /dashboard, /workspace, /auth/* — which sit outside the [locale]
  // segment on purpose, see migration-notes.md — this falls back to the
  // default locale ("de"), matching today's German-only behavior.
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <JsonLd data={organizationSchema} />
          <JsonLd data={websiteSchema} />
          <Analytics />
          <ConditionalHeader />
          {children}
          <ConditionalFooter />
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
