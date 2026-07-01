import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { nachbarschaftPageContent } from "@/app/content/nachbarschaftPage";
import { JsonLd } from "@/app/components/JsonLd";
import nachbarnPhoto from "@/fotos/medi_nachbarn.jpg";

export const metadata: Metadata = {
  title: "Nachbarschaftsstreit lösen ohne Gericht | medipact",
  description:
    "Lärm, Grenzen, Parkplätze oder Garten – Nachbarschaftskonflikte belasten den Alltag. Medipact hilft, wieder normal nebeneinander zu leben.",
  alternates: { canonical: "https://medipact.de/konflikte/nachbarschaft" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Nachbarschaftsmediation",
  provider: {
    "@type": "Organization",
    name: "medipact",
    url: "https://medipact.de",
  },
  serviceType: "Mediation bei Nachbarschaftskonflikten",
  description:
    "KI-gestützte Mediation bei Nachbarschaftsstreit – Lärm, Grenzen, Hecken, Parkplätze oder Hausordnung – als strukturierte Alternative zu Schiedsstelle und Gericht.",
  areaServed: {
    "@type": "Country",
    name: "Germany",
  },
  availableLanguage: "German",
  url: "https://medipact.de/konflikte/nachbarschaft",
};

export default function NachbarschaftPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <MarketingPageTemplate
      {...nachbarschaftPageContent}
      heroImage={{
        src: nachbarnPhoto,
        alt: "Nachbarn im Gespräch über einen Konflikt",
      }}
      breadcrumbs={[
        { label: "Konfliktarten", href: "/konflikte" },
        { label: "Nachbarschaft" },
      ]}
      relatedCases={[
        { label: "Lärm bei Nacht", href: "/cases/nachbarschaft-laerm" },
        { label: "Zaun auf der Grenze", href: "/cases/nachbarschaft-zaun" },
        { label: "Parkplatz blockiert", href: "/cases/nachbarschaft-parken" },
      ]}
      />
    </>
  );
}
