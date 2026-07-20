import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { odrPageContent } from "@/app/content/odrPage";
import { JsonLd } from "@/app/components/JsonLd";
import teamPhoto from "@/fotos/medi_buiness.jpg";
import konfliktPhoto from "@/fotos/kon_formen.jpg";

export const metadata: Metadata = {
  title: "Online Dispute Resolution (ODR) – ab 399 € | medipact",
  description:
    "Gesellschafterstreit, B2B-Konflikt oder E-Commerce-Streit? ODR löst ihn digital in Wochen – Mediation oder Schlichtung, ohne Gericht. Jetzt starten.",
  alternates: { canonical: "https://medipact.de/konflikte/odr" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Online Dispute Resolution (ODR)",
  provider: {
    "@type": "Organization",
    name: "medipact",
    url: "https://medipact.de",
  },
  serviceType:
    "Online Dispute Resolution (Wirtschaftsmediation, Online-Schlichtung, E-Commerce- und B2B-Streitbeilegung)",
  description:
    "KI-gestützte Online Dispute Resolution: innerbetriebliche Klärung (Team- und Abteilungsmediation, Führungsmediation, Gesellschafter, Unternehmensnachfolge), B2B-Vertragsstreit, E-Commerce- und Plattform-Konflikte sowie Online-Schlichtung mit Schlichterspruch. Digitalisierte Massen-ODR für große Fallzahlen (z. B. Fluggastrechte, Mietpreisbremse, E-Commerce) über die Business-Tarife.",
  areaServed: {
    "@type": "Country",
    name: "Germany",
  },
  availableLanguage: "German",
  url: "https://medipact.de/konflikte/odr",
};

export default function OdrPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <MarketingPageTemplate
        {...odrPageContent}
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
          { label: "Online Dispute Resolution (ODR)" },
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
