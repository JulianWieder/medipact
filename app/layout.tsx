import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ConditionalHeader, ConditionalFooter } from "@/app/components/ConditionalHeader";
import { JsonLd } from "@/app/components/JsonLd";
import Analytics from "@/app/components/Analytics";
import CookieConsent from "@/app/components/CookieConsent";
import { socialProfiles } from "@/app/content/social";

// Self-hosted via next/font statt Google-Fonts-<link>: kein render-blockendes
// externes Stylesheet mehr, kein Layout-Shift (size-adjust-Fallback), Fonts
// kommen vom eigenen Server. Die CSS-Variablen werden in globals.css
// (--font-body / --font-display) referenziert.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://medipact.de/#organization",
  name: "medipact",
  url: "https://medipact.de",
  // /logo.png (512x512, quadratisch) statt /og-image.png: Letzteres ist ein
  // 1200x630-Marketing-Banner. Google erwartet unter `logo` ein echtes,
  // erkennbares Logo — der Banner wird sonst verworfen.
  logo: "https://medipact.de/logo.png",
  description:
    "KI-gestützte Mediation für private und geschäftliche Konflikte – bei Trennung, Erbschaft, Nachbarschaftsstreit und im Unternehmen.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: "German",
  },
  // Nur echte, im Footer verlinkte Profile — siehe app/content/social.ts.
  ...(socialProfiles.length > 0 && {
    sameAs: socialProfiles.map((p) => p.url),
  }),
};

// Kein `potentialAction`/SearchAction mehr: Das zeigte auf
// /cases?q={search_term_string}, aber /cases wertet gar keine searchParams
// aus — eine Falschbehauptung im Markup. Die Sitelinks-Searchbox, für die das
// gedacht war, hat Google ohnehin abgekündigt.
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "medipact",
  url: "https://medipact.de",
  inLanguage: "de",
  publisher: { "@id": "https://medipact.de/#organization" },
};

export const metadata: Metadata = {
  metadataBase: new URL("https://medipact.de"),
  title: "Mediation online: Konflikte lösen ohne Gericht | medipact",
  description:
    "Streit bei Trennung, Erbe, Nachbarschaft oder im Unternehmen? Online-Mediation löst Ihren Konflikt fair, vertraulich und ohne Gericht. Jetzt starten.",
  keywords: [
    "Mediation",
    "KI-Mediation",
    "Wirtschaftsmediation",
    "Online Dispute Resolution",
    "ODR",
    "Konfliktlösung",
    "Harvard-Prinzip",
    "Trennung",
    "Erbschaft",
    "Nachbarschaftsstreit",
    "Mediation Unternehmen",
  ],
  authors: [{ name: "medipact" }],
  creator: "medipact",
  publisher: "medipact",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "de_DE",
    // Bewusst KEIN `url` hier: Unterseiten, die openGraph nicht überschreiben,
    // erben diesen Wert und meldeten dadurch alle og:url = Startseite
    // (z. B. /konflikte -> https://medipact.de). Lieber kein og:url als ein
    // falsches; die Kanonisierung läuft ohnehin über `alternates.canonical`.
    // Seiten, die ein eigenes og:url wollen, setzen es relativ (metadataBase
    // löst es auf), z. B. openGraph: { url: "/konflikte" }.
    siteName: "medipact",
    title: "Mediation online: Konflikte lösen ohne Gericht | medipact",
    description:
      "Konflikte fair, vertraulich und ohne Gericht lösen – Online-Mediation mit Mediator und KI.",
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
    title: "Mediation online: Konflikte lösen ohne Gericht | medipact",
    description:
      "Konflikte fair, vertraulich und ohne Gericht lösen – Online-Mediation mit Mediator und KI.",
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
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable}`}
    >
      <head>
        {/* Favicon – Google zieht fuer die Suchergebnisse die groesste passende
            Variante und beschneidet sie kreisrund, darum zusaetzlich 96/192 px */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="96x96" href="/icon-96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased">
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
