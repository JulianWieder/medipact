import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { verbraucherPageContent } from "@/app/content/verbraucherPage";
import { JsonLd } from "@/app/components/JsonLd";
import verbraucherPhoto from "@/fotos/kosten.jpg";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Handwerker- & Verbraucherstreit lösen | medipact",
  description:
    "Strittige Rechnung, Mängel oder Leistung nicht erbracht? Online-Mediation ab 49 € pro Partei – schneller und günstiger als Gericht. Jetzt klären.",
  path: "/konflikte/verbraucher",
});

// Eigene @id je Konfliktart (nicht #service: das ist die Dachleistung auf
// Startseite, /konflikte und /preise – sechs verschiedene Leistungen unter
// einer @id wuerde Google zu einer Entitaet mit widerspruechlichen Namen
// verschmelzen). Verknuepft ueber isRelatedTo. Preis aus backend/app/pricing.py –
// bei Preisaenderung hier mitziehen.
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://medipact.de/konflikte/verbraucher#service",
  name: "Verbraucher-Mediation",
  provider: { "@id": "https://medipact.de/#organization" },
  isRelatedTo: { "@id": "https://medipact.de/#service" },
  serviceType: "Mediation bei Verbraucher- und Handwerkerstreitigkeiten",
  description:
    "Strukturierte Online-Mediation bei Streit um Rechnungen, Mängel oder Handwerkerleistungen – außergerichtlich, ab 49 € pro Partei.",
  areaServed: {
    "@type": "Country",
    name: "Germany",
  },
  availableLanguage: "German",
  url: "https://medipact.de/konflikte/verbraucher",
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
  mainEntity: verbraucherPageContent.faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function VerbraucherPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />
      <MarketingPageTemplate
        {...verbraucherPageContent}
        heroImage={{
          src: verbraucherPhoto,
          alt: "Kunde prüft eine strittige Handwerker-Rechnung",
        }}
        breadcrumbs={[
          { label: "Konflikte", href: "/konflikte" },
          { label: "Verbraucher & Handwerker" },
        ]}
        kostenrechnerArt="verbraucher"
        relatedCases={[
          { label: "B2B-Projektstreit", href: "/cases/b2b-projektstreit" },
          { label: "Gesellschafter-Streit", href: "/cases/gesellschafter-streit" },
          { label: "Team-Konflikt", href: "/cases/team-konflikt" },
        ]}
      />
    </>
  );
}
