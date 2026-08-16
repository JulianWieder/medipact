import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { getTrennungPageContent } from "@/app/content/trennungPage.loader";
import { JsonLd } from "@/app/components/JsonLd";
import type { AppLocale } from "@/i18n/routing";
import trennungPhoto from "@/fotos/medi_trennung.jpg";
import { pageMetadata } from "@/lib/seo";

// generateMetadata statt statischem Objekt — Begruendung wie auf der
// Startseite: /en liefert denselben deutschen Text und bleibt deshalb
// unindexiert (siehe lib/seo.ts).
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
    title: "Scheidungsmediation online: fair einigen | medipact",
    description:
      "Scheidungsmediation online ab 399 € pro Partei: Unterhalt, Betreuung und Finanzen strukturiert klären – vertraulich und ohne Rosenkrieg vor Gericht.",
    path: "/scheidungsmediation",
    locale,
  });
}

const serviceSchema = {
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
};

export default async function TrennungPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  const content = getTrennungPageContent(locale);

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
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />
      <MarketingPageTemplate
        {...content}
        heroImage={{
          src: trennungPhoto,
          alt: "Paar im Gespräch über eine Trennung",
        }}
        breadcrumbs={[
          // Die Seite liegt nicht mehr unter /konflikte, bleibt inhaltlich
          // aber dessen Kind. Breadcrumbs dürfen vom URL-Pfad abweichen.
          { label: "Konfliktarten", href: "/konflikte" },
          { label: "Scheidungsmediation" },
        ]}
        kostenrechnerArt="trennung"
        relatedCases={[
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
        ]}
      />
    </>
  );
}
