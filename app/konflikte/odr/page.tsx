import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { odrPageContent } from "@/app/content/odrPage";
import { JsonLd } from "@/app/components/JsonLd";
import teamPhoto from "@/fotos/medi_buiness.jpg";
import konfliktPhoto from "@/fotos/kon_formen.jpg";
import { pageMetadata } from "@/lib/seo";

// Title/Description tragen die Ziel-Suchphrase "Mediation bei Geschäfts-
// partnern" (rankte auf Seite 2) vorn, ODR bleibt als Marken-/Kategoriebegriff
// dahinter. Title ≤60, Description ≤155 Zeichen mit CTA – wie auf allen Seiten.
export const metadata: Metadata = pageMetadata({
  title: "Mediation bei Geschäftspartnern & Gesellschaftern | medipact",
  description:
    "Streit unter Geschäftspartnern, Gesellschaftern oder im Team? Online-Mediation statt Gericht: vertraulich, in Wochen, zum Festpreis. Jetzt einschätzen.",
  path: "/konflikte/odr",
});

// Eigene @id je Konfliktart (nicht #service: das ist die Dachleistung auf
// Startseite, /konflikte und /preise – sechs verschiedene Leistungen unter
// einer @id wuerde Google zu einer Entitaet mit widerspruechlichen Namen
// verschmelzen). Verknuepft ueber isRelatedTo. Preis aus backend/app/pricing.py –
// bei Preisaenderung hier mitziehen.
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://medipact.de/konflikte/odr#service",
  name: "Online Dispute Resolution (ODR)",
  provider: { "@id": "https://medipact.de/#organization" },
  isRelatedTo: { "@id": "https://medipact.de/#service" },
  serviceType:
    "Online Dispute Resolution (Wirtschaftsmediation, Online-Schlichtung, E-Commerce- und B2B-Streitbeilegung)",
  description:
    "Strukturierte Online Dispute Resolution: innerbetriebliche Klärung (Team- und Abteilungsmediation, Führungsmediation, Gesellschafter, Unternehmensnachfolge), B2B-Vertragsstreit, E-Commerce- und Plattform-Konflikte sowie Online-Schlichtung mit Schlichterspruch. Digitalisierte Massen-ODR für große Fallzahlen (z. B. Fluggastrechte, Mietpreisbremse, E-Commerce) über die Business-Tarife.",
  areaServed: {
    "@type": "Country",
    name: "Germany",
  },
  availableLanguage: "German",
  url: "https://medipact.de/konflikte/odr",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "EUR",
    lowPrice: "399",
    highPrice: "1900",
    offerCount: 4,
    description: "Festpreis pro Verfahren je nach Verfahrensart (Schlichtung, E-Commerce, B2B, Wirtschaftsmediation)",
    url: "https://medipact.de/preise",
    availability: "https://schema.org/InStock",
  },
};

// Die FAQs werden auf der Seite sichtbar gerendert – hier zusätzlich als
// FAQPage-JSON-LD, damit sie für Rich Results und "Nutzer fragen auch"
// überhaupt in Frage kommen. Quelle ist dieselbe Liste, kein Duplikat.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: odrPageContent.faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function OdrPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />
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
          { label: "Konflikte", href: "/konflikte" },
          { label: "Online Dispute Resolution (ODR)" },
        ]}
        kostenrechnerArt="odr"
        mediatorHinweis
        relatedCases={[
          { label: "Gesellschafter-Patt", href: "/cases/gesellschafter-streit" },
          { label: "Teamkonflikt im Mittelstand", href: "/cases/team-konflikt" },
          { label: "B2B-Projektstreit", href: "/cases/b2b-projektstreit" },
          { label: "Für Steuerberater & Notare", href: "/fuer-berater" },
          { label: "Ratgeber: Kündigung ohne Gericht", href: "/ratgeber/kuendigung-ohne-gericht" },
          { label: "Preise für Unternehmen", href: "/preise" },
        ]}
      />
    </>
  );
}
