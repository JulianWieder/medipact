import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { nachbarschaftPageContent } from "@/app/content/nachbarschaftPage";
import { JsonLd } from "@/app/components/JsonLd";
import nachbarnPhoto from "@/fotos/med_nachbarn_d.jpg";
import { pageMetadata } from "@/lib/seo";

// 16.10.2026: GSC 14.10. – Seite stand mit 232 Impr auf Pos 77,7, Google spielte
// sie breit auf "nachbarschaftsstreit" aus (Pos 86,6) und liess sie gegen den
// eigenen Ratgeber verlieren. Zuschnitt jetzt: diese Seite = das Verfahren
// ("Nachbarschaftsmediation"), der Ratgeber nachbarschaftsstreit-was-tun = die
// Frage "Nachbarschaftsstreit – was tun?".
export const metadata: Metadata = pageMetadata({
  title: "Nachbarschaftsmediation: online zum Festpreis | medipact",
  description:
    "Nachbarschaftsmediation bei Lärm, Hecke, Grenze oder Parkplatz: geführtes Online-Verfahren mit Mediator, 49 € pro Partei, schriftliche Vereinbarung.",
  path: "/konflikte/nachbarschaft",
});

// Eigene @id je Konfliktart (nicht #service: das ist die Dachleistung auf
// Startseite, /konflikte und /preise – sechs verschiedene Leistungen unter
// einer @id wuerde Google zu einer Entitaet mit widerspruechlichen Namen
// verschmelzen). Verknuepft ueber isRelatedTo. Preis aus backend/app/pricing.py –
// bei Preisaenderung hier mitziehen.
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://medipact.de/konflikte/nachbarschaft#service",
  name: "Nachbarschaftsmediation",
  provider: { "@id": "https://medipact.de/#organization" },
  isRelatedTo: { "@id": "https://medipact.de/#service" },
  serviceType: "Mediation bei Nachbarschaftskonflikten",
  description:
    "Strukturierte Online-Mediation bei Nachbarschaftsstreit – Lärm, Grenzen, Hecken, Parkplätze oder Hausordnung – als strukturierte Alternative zu Schiedsstelle und Gericht.",
  areaServed: {
    "@type": "Country",
    name: "Germany",
  },
  availableLanguage: "German",
  url: "https://medipact.de/konflikte/nachbarschaft",
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
        { label: "Konflikte", href: "/konflikte" },
        { label: "Nachbarschaftsmediation" },
      ]}
      kostenrechnerArt="nachbarschaft"
      relatedCases={[
        { label: "Ratgeber: Nachbar zu laut – was tun?", href: "/ratgeber/nachbar-laerm-was-tun" },
        { label: "Ratgeber: Wie hoch darf die Hecke sein?", href: "/ratgeber/hecke-nachbar-hoehe" },
        { label: "Ratgeber: Nachbarschaftsstreit schlichten", href: "/ratgeber/nachbarschaftsstreit-was-tun" },
        { label: "Ratgeber: Streit in der Eigentümergemeinschaft", href: "/ratgeber/weg-streit-mediation" },
        { label: "Lärm bei Nacht", href: "/cases/nachbarschaft-laerm" },
        { label: "Zaun auf der Grenze", href: "/cases/nachbarschaft-zaun" },
        { label: "Parkplatz blockiert", href: "/cases/nachbarschaft-parken" },
      ]}
      />
    </>
  );
}
