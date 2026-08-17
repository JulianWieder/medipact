import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { mietverhaeltnisPageContent } from "@/app/content/mietverhaeltnisPage";
import { JsonLd } from "@/app/components/JsonLd";
import mietPhoto from "@/fotos/medi_modern.jpg";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Streit mit Vermieter oder Mieter lösen | medipact",
  description:
    "Nebenkosten, Mängel, Kaution oder Eigenbedarf: Mediation klärt den Mietstreit schriftlich und ohne Amtsgericht – ab 49 € pro Partei. Jetzt starten.",
  path: "/konflikte/mietverhaeltnis",
});

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Mediation im Mietverhältnis",
  provider: {
    "@type": "Organization",
    name: "medipact",
    url: "https://medipact.de",
  },
  serviceType: "Mediation bei Streitigkeiten zwischen Mieter und Vermieter",
  description:
    "Strukturierte Online-Mediation bei Mietstreit – Nebenkostenabrechnung, Mängel und Minderung, Kaution, Mieterhöhung, Kündigung und Auszug – als Alternative zum Amtsgericht.",
  areaServed: {
    "@type": "Country",
    name: "Germany",
  },
  availableLanguage: "German",
  url: "https://medipact.de/konflikte/mietverhaeltnis",
};

// Die FAQs werden auf der Seite sichtbar gerendert - hier zusätzlich als
// FAQPage-JSON-LD, damit sie für Rich Results und "Nutzer fragen auch"
// in Frage kommen. Quelle ist dieselbe Liste, kein Duplikat.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: mietverhaeltnisPageContent.faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function MietverhaeltnisPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />
      <MarketingPageTemplate
        {...mietverhaeltnisPageContent}
        heroImage={{
          src: mietPhoto,
          alt: "Mieterin und Vermieter im Gespräch über eine Abrechnung",
        }}
        breadcrumbs={[
          { label: "Konfliktarten", href: "/konflikte" },
          { label: "Mietverhältnis" },
        ]}
        kostenrechnerArt="mietverhaeltnis"
        relatedCases={[
          { label: "Ratgeber: Gericht oder Mediation?", href: "/ratgeber/gericht-oder-mediation" },
          { label: "Ratgeber: Was kostet eine Mediation?", href: "/ratgeber/mediation-kosten" },
          { label: "Ratgeber: Konflikt richtig dokumentieren", href: "/ratgeber/konflikt-dokumentieren" },
          { label: "Ratgeber: Streit in der Eigentümergemeinschaft", href: "/ratgeber/weg-streit-mediation" },
          { label: "Nachbarschaftsstreit", href: "/konflikte/nachbarschaft" },
          { label: "Verbraucher & Handwerker", href: "/konflikte/verbraucher" },
        ]}
      />
    </>
  );
}
