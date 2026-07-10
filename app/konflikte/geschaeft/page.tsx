import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { geschaeftPageContent } from "@/app/content/geschaeftPage";
import { JsonLd } from "@/app/components/JsonLd";
import teamPhoto from "@/fotos/medi_buiness.jpg";
import konfliktPhoto from "@/fotos/kon_formen.jpg";

export const metadata: Metadata = {
  title: "Business-Mediation – Team, Gesellschafter & B2B-Konflikte | medipact",
  description:
    "Wirtschaftsmediation für Unternehmen: intern (Team, Führung, Gesellschafter, Nachfolge) und B2B (Lieferanten, IT-Großprojekte, M&A). Vertraulich und schneller als Gericht – ab €399 pro Fall oder als Business-Pauschale.",
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
  serviceType: "Wirtschaftsmediation (intern und B2B)",
  description:
    "KI-gestützte Wirtschaftsmediation: innerbetrieblich (Team- und Abteilungsmediation, Führungsmediation, Gesellschafter, Unternehmensnachfolge) und B2B (Vertrags- und Lieferantenstreit, IT- und Großprojekte, M&A). Diagnose nach Konfliktart und Glasl-Eskalationsstufe, methodisch facilitativ, evaluativ, transformativ oder als Shuttle-Mediation.",
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
          { label: "Gesellschafter-Patt", href: "/cases/gesellschafter-streit" },
          { label: "Teamkonflikt im Mittelstand", href: "/cases/team-konflikt" },
          { label: "B2B-Projektstreit", href: "/cases/b2b-projektstreit" },
          { label: "Preise für Unternehmen", href: "/preise" },
        ]}
      />
    </>
  );
}
