import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { getTrennungPageContent } from "@/app/content/trennungPage.loader";
import { JsonLd } from "@/app/components/JsonLd";
import type { AppLocale } from "@/i18n/routing";
import trennungPhoto from "@/fotos/medi_trennung.jpg";

export const metadata: Metadata = {
  title: "Trennung & Scheidung ohne Eskalation – KI-Mediation | medipact",
  description:
    "Unterhalt, Betreuung, Finanzen – Trennung bringt viele offene Fragen. Medipact hilft, faire Lösungen zu finden, ohne dass jede Nachricht zum Streit wird.",
  alternates: { canonical: "https://medipact.de/konflikte/trennung" },
};

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
    "KI-gestützte Mediation bei Trennung und Scheidung – Unterhalt, Betreuung, Vermögensaufteilung – als strukturierte Alternative zum anwaltlichen Streit.",
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

  return (
    <>
      <JsonLd data={serviceSchema} />
      <MarketingPageTemplate
        {...getTrennungPageContent(locale)}
        heroImage={{
          src: trennungPhoto,
          alt: "Paar im Gespräch über eine Trennung",
        }}
        breadcrumbs={[
          { label: "Konfliktarten", href: "/konflikte" },
          { label: "Trennung & Scheidung" },
        ]}
        relatedCases={[
          { label: "Trennung mit 2 Kindern", href: "/cases/maria-thomas" },
          { label: "Hohes Vermögen, komplexe Aufteilung", href: "/cases/peter-sarah" },
          { label: "Nach 38 Jahren Ehe", href: "/cases/rolf-helga" },
        ]}
      />
    </>
  );
}
