import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { nachbarschaftPageContent } from "@/app/content/nachbarschaftPage";
import { JsonLd } from "@/app/components/JsonLd";
import nachbarnPhoto from "@/fotos/med_nachbarn_d.jpg";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Nachbarschaftsstreit lösen ohne Gericht | medipact",
  description:
    "Lärm, Grenzen, Parkplätze oder Garten – Nachbarschaftsstreit belastet den Alltag. Mediation hilft, wieder normal nebeneinander zu leben. Jetzt starten.",
  path: "/konflikte/nachbarschaft",
});

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
    "Strukturierte Online-Mediation bei Nachbarschaftsstreit – Lärm, Grenzen, Hecken, Parkplätze oder Hausordnung – als strukturierte Alternative zu Schiedsstelle und Gericht.",
  areaServed: {
    "@type": "Country",
    name: "Germany",
  },
  availableLanguage: "German",
  url: "https://medipact.de/konflikte/nachbarschaft",
};


// Die FAQs werden auf der Seite sichtbar gerendert - hier zusätzlich als
// FAQPage-JSON-LD, damit sie für Rich Results und "Nutzer fragen auch"
// in Frage kommen. Quelle ist dieselbe Liste, kein Duplikat.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: nachbarschaftPageContent.faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function NachbarschaftPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />
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
        { label: "Ratgeber: Nachbarschaftsstreit schlichten", href: "/ratgeber/nachbarschaftsstreit-mediation" },
        { label: "Ratgeber: Streit in der Eigentümergemeinschaft", href: "/ratgeber/weg-streit-mediation" },
        { label: "Lärm bei Nacht", href: "/cases/nachbarschaft-laerm" },
        { label: "Zaun auf der Grenze", href: "/cases/nachbarschaft-zaun" },
        { label: "Parkplatz blockiert", href: "/cases/nachbarschaft-parken" },
      ]}
      />
    </>
  );
}
