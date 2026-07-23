import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { verbraucherPageContent } from "@/app/content/verbraucherPage";
import { JsonLd } from "@/app/components/JsonLd";
import verbraucherPhoto from "@/fotos/kosten.jpg";

export const metadata: Metadata = {
  title: "Handwerker- & Verbraucherstreit lösen | medipact",
  description:
    "Strittige Rechnung, Mängel oder Leistung nicht erbracht? Online-Mediation ab 20 € pro Partei – schneller und günstiger als Gericht. Jetzt klären.",
  alternates: { canonical: "https://medipact.de/konflikte/verbraucher" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Verbraucher-Mediation",
  provider: {
    "@type": "Organization",
    name: "medipact",
    url: "https://medipact.de",
  },
  serviceType: "Mediation bei Verbraucher- und Handwerkerstreitigkeiten",
  description:
    "Strukturierte Online-Mediation bei Streit um Rechnungen, Mängel oder Handwerkerleistungen – außergerichtlich, ab 20 € pro Partei.",
  areaServed: {
    "@type": "Country",
    name: "Germany",
  },
  availableLanguage: "German",
  url: "https://medipact.de/konflikte/verbraucher",
};

export default function VerbraucherPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <MarketingPageTemplate
        {...verbraucherPageContent}
        heroImage={{
          src: verbraucherPhoto,
          alt: "Kunde prüft eine strittige Handwerker-Rechnung",
        }}
        breadcrumbs={[
          { label: "Konfliktarten", href: "/konflikte" },
          { label: "Verbraucher & Handwerker" },
        ]}
        relatedCases={[
          { label: "B2B-Projektstreit", href: "/cases/b2b-projektstreit" },
          { label: "Gesellschafter-Streit", href: "/cases/gesellschafter-streit" },
          { label: "Team-Konflikt", href: "/cases/team-konflikt" },
        ]}
      />
    </>
  );
}
