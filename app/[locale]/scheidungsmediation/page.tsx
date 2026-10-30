import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { getTrennungPageContent } from "@/app/content/trennungPage.loader";
import { JsonLd } from "@/app/components/JsonLd";
import type { AppLocale } from "@/i18n/routing";
import trennungPhoto from "@/fotos/medi_trennung.jpg";
import { pageMetadata } from "@/lib/seo";

// generateMetadata statt statischem Objekt, weil Titel und Beschreibung
// je Sprache wechseln. /en ist seit 30.10.2026 übersetzt, aber noch NICHT
// in INDEXED_LOCALE_ROUTES (i18n/routing.ts) – die Freigabe für Google ist
// ein eigener Schritt (siehe lib/seo.ts und app/sitemap.ts).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    // Keyword-Ziel ist das Kompositum "Scheidungsmediation" — vorher stand
    // hier "Trennung & Scheidung", also zwei getrennte Wörter. Seit dem
    // 15.08.2026 trägt auch die URL das Kompositum: /scheidungsmediation
    // statt /konflikte/trennung (301 in next.config.ts). Die Seite hatte in
    // drei Monaten 6 Impressionen — es gab hier keine Historie zu verlieren,
    // anders als bei /konflikte und /konflikte/odr (Entscheidung 27.07.).
    title:
      locale === "en"
        ? "Divorce mediation online: agree fairly | medipact"
        : "Scheidungsmediation online: fair einigen | medipact",
    description:
      locale === "en"
        ? "Online divorce mediation from €299 per party: settle maintenance, childcare and finances in a structured way – confidential and without a court battle."
        : "Scheidungsmediation online ab 299 € pro Partei: Unterhalt, Betreuung und Finanzen strukturiert klären – vertraulich und ohne Rosenkrieg vor Gericht.",
    path: "/scheidungsmediation",
    locale,
  });
}

const serviceSchemaDe = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Trennungs- und Scheidungsmediation",
  provider: {
    "@type": "Organization",
    name: "medipact",
    url: "https://medipact.de",
  },
  serviceType: "Mediation bei Trennung und Scheidung",
  description:
    "Strukturierte Online-Mediation bei Trennung und Scheidung – Unterhalt, Betreuung, Vermögensaufteilung – als strukturierte Alternative zum anwaltlichen Streit.",
  areaServed: {
    "@type": "Country",
    name: "Germany",
  },
  availableLanguage: "German",
  url: "https://medipact.de/scheidungsmediation",
  // 07.09.2026: Der Service-Knoten stand hier ohne Preis — und ein Angebot
  // ohne Preis liest sich strukturell wie ein Themenartikel. Die drei Stufen
  // entsprechen /preise: 399 € Basis, 499 € inkl. 2 Std. Mediation,
  // 899 € Vollservice — jeweils pro Partei.
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "EUR",
    // 299 € = Paket "Einvernehmliche Scheidung" seit 01.10.2026
    lowPrice: "299",
    highPrice: "899",
    offerCount: 4,
    url: "https://medipact.de/preise",
    availability: "https://schema.org/InStock",
  },
};

// /en: gleiche Angebote, eigene Texte und URL. Das Verfahren selbst läuft
// weiter auf Deutsch – deshalb bleibt availableLanguage "German".
const serviceSchemaEn = {
  ...serviceSchemaDe,
  name: "Separation and divorce mediation",
  serviceType: "Mediation for separation and divorce",
  description:
    "Structured online mediation for separation and divorce – maintenance, childcare, division of assets – as a structured alternative to a dispute between lawyers.",
  url: "https://medipact.de/en/scheidungsmediation",
};

// Die Ratgeber und Fallbeispiele gibt es nur auf Deutsch. Auf /en sagt das
// Label es dazu, statt eine englische Seite vorzutäuschen.
const relatedCasesDe = [
  { label: "Ratgeber: Was steht mir bei der Scheidung zu?", href: "/ratgeber/was-steht-mir-bei-der-scheidung-zu" },
  { label: "Ratgeber: Muss ich das Haus verkaufen?", href: "/ratgeber/haus-bei-scheidung" },
  { label: "Ratgeber: Wer muss aus der Wohnung?", href: "/ratgeber/wer-muss-aus-der-wohnung" },
  { label: "Ratgeber: Scheidung mit Mediator – Kosten", href: "/ratgeber/scheidung-mediator-kosten" },
  { label: "Ratgeber: Sorgerecht und Umgang regeln", href: "/ratgeber/sorgerecht-und-umgangsrecht" },
  { label: "Ratgeber: Trennung von einem Narzissten", href: "/ratgeber/trennung-von-einem-narzissten" },
  { label: "Ratgeber: Sorgerecht verloren – was tun?", href: "/ratgeber/sorgerecht-verloren-was-tun" },
  { label: "Trennung mit 2 Kindern", href: "/cases/trennung-mit-kindern" },
  { label: "Hohes Vermögen, komplexe Aufteilung", href: "/cases/trennung-vermoegen-aufteilen" },
  { label: "Nach 38 Jahren Ehe", href: "/cases/trennung-nach-langer-ehe" },
];

const relatedCasesEn = [
  { label: "Guide: What am I entitled to in a divorce? (in German)", href: "/ratgeber/was-steht-mir-bei-der-scheidung-zu" },
  { label: "Guide: Do I have to sell the house? (in German)", href: "/ratgeber/haus-bei-scheidung" },
  { label: "Guide: Who has to move out? (in German)", href: "/ratgeber/wer-muss-aus-der-wohnung" },
  { label: "Guide: Divorce with a mediator – costs (in German)", href: "/ratgeber/scheidung-mediator-kosten" },
  { label: "Guide: Arranging custody and contact (in German)", href: "/ratgeber/sorgerecht-und-umgangsrecht" },
  { label: "Guide: Separating from a narcissist (in German)", href: "/ratgeber/trennung-von-einem-narzissten" },
  { label: "Guide: Lost custody – what now? (in German)", href: "/ratgeber/sorgerecht-verloren-was-tun" },
  { label: "Case: Separation with 2 children (in German)", href: "/cases/trennung-mit-kindern" },
  { label: "Case: High assets, complex division (in German)", href: "/cases/trennung-vermoegen-aufteilen" },
  { label: "Case: After 38 years of marriage (in German)", href: "/cases/trennung-nach-langer-ehe" },
];

export default async function TrennungPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  const content = getTrennungPageContent(locale);
  const en = locale === "en";

  // FAQs sind locale-abhängig, deshalb wird das FAQPage-JSON-LD hier im
  // Body gebaut und nicht als Modul-Konstante. Quelle ist dieselbe Liste,
  // die das Template sichtbar rendert.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <JsonLd data={en ? serviceSchemaEn : serviceSchemaDe} />
      <JsonLd data={faqSchema} />
      <MarketingPageTemplate
        {...content}
        heroImage={{
          src: trennungPhoto,
          alt: en ? "Couple talking about a separation" : "Paar im Gespräch über eine Trennung",
        }}
        breadcrumbs={[
          // Die Seite liegt nicht mehr unter /konflikte, bleibt inhaltlich
          // aber dessen Kind. Breadcrumbs dürfen vom URL-Pfad abweichen.
          { label: en ? "Conflicts" : "Konflikte", href: "/konflikte" },
          { label: en ? "Divorce mediation" : "Scheidungsmediation" },
        ]}
        kostenrechnerArt="trennung"
        // /mediator-finden gibt es nur auf Deutsch.
        mediatorHinweis={locale === "de"}
        relatedCases={en ? relatedCasesEn : relatedCasesDe}
      />
    </>
  );
}
