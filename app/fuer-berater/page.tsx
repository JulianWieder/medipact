import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { beraterPageContent } from "@/app/content/beraterPage";
import { JsonLd } from "@/app/components/JsonLd";
import gespraechPhoto from "@/fotos/medi_gespraech.jpg";
import einordnenPhoto from "@/fotos/medi_einordnen.jpg";
import { pageMetadata } from "@/lib/seo";

// Zielgruppe ist NICHT die Streitpartei, sondern der Berater daneben. Deshalb
// zielt der Title bewusst auf "Mandant"/"Mandat"-Sprache statt auf die
// Konflikt-Suchphrasen: /konflikte/odr soll "Mediation bei Geschäftspartnern"
// weiter allein tragen (siehe Kommentar in odrPage.ts). Zwei Seiten auf
// dieselbe Phrase wären Kannibalisierung, hier greifen sie nicht ineinander.
// Title ≤60, Description ≤155 Zeichen — wie auf allen Seiten.
export const metadata: Metadata = pageMetadata({
  title: "Für Steuerberater, Notare & Nachfolgeberater | medipact",
  description:
    "Konflikt im Mandat? Wir übernehmen das Klärungsverfahren, Sie behalten die Beratung. Keine Provision, kein Zugriff aufs Mandat. Fall einschätzen lassen.",
  path: "/fuer-berater",
});

// Kein Service-Schema mit Preis: Diese Seite verkauft kein Produkt, sondern
// erklärt eine Zusammenarbeit. ProfessionalService + FAQPage passen dazu,
// Offer/Price gehört auf /preise.
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "medipact für Steuerberater, Wirtschaftsprüfer und Notare",
  provider: {
    "@type": "Organization",
    name: "medipact",
    url: "https://medipact.de",
  },
  serviceType:
    "Online-Mediation bei Gesellschafterkonflikten, Unternehmensnachfolge und Erbengemeinschaften mit Betriebsvermögen — als Zuweisungsangebot für beratende Berufe",
  areaServed: { "@type": "Country", name: "Germany" },
  availableLanguage: "German",
  url: "https://medipact.de/fuer-berater",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: beraterPageContent.faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function FuerBeraterPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />
      <MarketingPageTemplate
        {...beraterPageContent}
        heroImage={{
          src: gespraechPhoto,
          alt: "Beratungsgespräch an einem Besprechungstisch",
        }}
        trustImage={{
          src: einordnenPhoto,
          alt: "Unterlagen werden gemeinsam durchgesehen und eingeordnet",
        }}
        breadcrumbs={[{ label: "Für Berater" }]}
        relatedCases={[
          { label: "Gesellschafter-Patt", href: "/cases/gesellschafter-streit" },
          { label: "Unternehmen geerbt", href: "/cases/unternehmen-geerbt" },
          { label: "Trennung mit gemeinsamer Firma", href: "/cases/trennung-gemeinsame-firma" },
          { label: "Business & ODR", href: "/konflikte/odr" },
        ]}
      />
    </>
  );
}
