import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { getTrennungPageContent } from "@/app/content/trennungPage.loader";
import { JsonLd } from "@/app/components/JsonLd";
import type { AppLocale } from "@/i18n/routing";
import trennungPhoto from "@/fotos/medi_trennung.jpg";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  // Keyword-Ziel ist das Kompositum "Scheidungsmediation" — vorher stand hier
  // "Trennung & Scheidung", also zwei getrennte Wörter. Die URL bleibt
  // bewusst /konflikte/trennung (kein Umzug, siehe Entscheidung vom 27.07.).
  title: "Scheidungsmediation online: fair einigen | medipact",
  description:
    "Scheidungsmediation online ab 399 € pro Partei: Unterhalt, Betreuung und Finanzen strukturiert klären – vertraulich und ohne Rosenkrieg vor Gericht.",
  path: "/konflikte/trennung",
});

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
  url: "https://medipact.de/konflikte/trennung",
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
          { label: "Konfliktarten", href: "/konflikte" },
          { label: "Trennung & Scheidung" },
        ]}
        kostenrechnerArt="trennung"
        relatedCases={[
          { label: "Ratgeber: Was steht mir bei der Scheidung zu?", href: "/ratgeber/was-steht-mir-bei-der-scheidung-zu" },
          { label: "Ratgeber: Muss ich das Haus verkaufen?", href: "/ratgeber/haus-bei-scheidung" },
          { label: "Ratgeber: Wer muss aus der Wohnung?", href: "/ratgeber/wer-muss-aus-der-wohnung" },
          { label: "Ratgeber: Scheidung mit Mediator – Kosten", href: "/ratgeber/scheidung-mediator-kosten" },
          { label: "Ratgeber: Sorgerecht und Umgang regeln", href: "/ratgeber/sorgerecht-und-umgangsrecht" },
          { label: "Trennung mit 2 Kindern", href: "/cases/maria-thomas" },
          { label: "Hohes Vermögen, komplexe Aufteilung", href: "/cases/peter-sarah" },
          { label: "Nach 38 Jahren Ehe", href: "/cases/rolf-helga" },
        ]}
      />
    </>
  );
}
