import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { geschaeftPageContent } from "@/app/content/geschaeftPage";
import { JsonLd } from "@/app/components/JsonLd";
import teamPhoto from "@/fotos/medi_modern.jpg";
import konfliktPhoto from "@/fotos/kon_formen.jpg";

export const metadata: Metadata = {
  title: "Team-Konflikt lösen – Mediation für Organisationen | medipact",
  description:
    "Konflikte im Team, zwischen Abteilungen oder mit Führungskräften strukturiert klären: Diagnose nach Konfliktart und Eskalationsstufe, dann Moderation oder externe Mediation. Für Unternehmen und Organisationen.",
  alternates: { canonical: "https://medipact.de/konflikte/geschaeft" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Team- und Organisationsmediation",
  provider: {
    "@type": "Organization",
    name: "medipact",
    url: "https://medipact.de",
  },
  serviceType: "Mediation bei Team- und Organisationskonflikten",
  description:
    "KI-gestützte Mediation bei Konflikten in Teams und Organisationen – mit strukturierter Diagnose (Konfliktart, Glasl-Eskalationsstufe) und zwei Wegen: mediativ orientierte Führung oder externe, allparteiliche Mediation.",
  areaServed: {
    "@type": "Country",
    name: "Germany",
  },
  availableLanguage: "German",
  url: "https://medipact.de/konflikte/geschaeft",
};

export default function GeschaeftPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <MarketingPageTemplate
        {...geschaeftPageContent}
        heroImage={{
          src: teamPhoto,
          alt: "Kolleginnen und Kollegen klären einen Konflikt am Besprechungstisch",
        }}
        trustImage={{
          src: konfliktPhoto,
          alt: "Hitzige Diskussion zwischen mehreren Beteiligten",
        }}
        breadcrumbs={[
          { label: "Konfliktarten", href: "/konflikte" },
          { label: "Team & Organisation" },
        ]}
        relatedCases={[
          { label: "Unternehmen erben", href: "/cases/familie-weber" },
          { label: "Alle Konfliktarten", href: "/konflikte" },
          { label: "Preise für Unternehmen", href: "/preise" },
        ]}
      />
    </>
  );
}
