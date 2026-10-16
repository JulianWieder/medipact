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

// Eigene @id je Konfliktart (nicht #service: das ist die Dachleistung auf
// Startseite, /konflikte und /preise – sechs verschiedene Leistungen unter
// einer @id wuerde Google zu einer Entitaet mit widerspruechlichen Namen
// verschmelzen). Verknuepft ueber isRelatedTo. Preis aus backend/app/pricing.py –
// bei Preisaenderung hier mitziehen.
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://medipact.de/konflikte/mietverhaeltnis#service",
  name: "Mediation im Mietverhältnis",
  provider: { "@id": "https://medipact.de/#organization" },
  isRelatedTo: { "@id": "https://medipact.de/#service" },
  serviceType: "Mediation bei Streitigkeiten zwischen Mieter und Vermieter",
  description:
    "Strukturierte Online-Mediation bei Mietstreit – Nebenkostenabrechnung, Mängel und Minderung, Kaution, Mieterhöhung, Kündigung und Auszug – als Alternative zum Amtsgericht.",
  areaServed: {
    "@type": "Country",
    name: "Germany",
  },
  availableLanguage: "German",
  url: "https://medipact.de/konflikte/mietverhaeltnis",
  offers: {
    "@type": "Offer",
    priceCurrency: "EUR",
    price: "49",
    description: "Festpreis pro Partei",
    url: "https://medipact.de/preise",
    availability: "https://schema.org/InStock",
  },
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
          { label: "Konflikte", href: "/konflikte" },
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
