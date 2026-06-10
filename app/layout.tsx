import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ConditionalHeader, ConditionalFooter } from "@/app/components/ConditionalHeader";
import { JsonLd } from "@/app/components/JsonLd";

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
  title: "medipact – KI-Mediation ab €499",
  description:
    "Konflikte lösen ohne Gericht. KI-basierte Mediation nach dem Harvard-Prinzip. Schneller, günstiger, menschlicher als klassische Mediation.",
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
    title: "medipact – KI-Mediation ab €499",
    description: "Konflikte lösen ohne Gericht.",
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
    title: "medipact – KI-Mediation ab €499",
    description: "Konflikte lösen ohne Gericht.",
    creator: "@medipact_de",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
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

        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-HV7LZJ0V1M"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-HV7LZJ0V1M');
            `,
          }}
        />
      </head>
      <body className="antialiased" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <ConditionalHeader />
        {children}
        <ConditionalFooter />
      </body>
    </html>
  );
}
