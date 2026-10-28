import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { fuerMediatorenPageContent } from "@/app/content/fuerMediatorenPage";
import { JsonLd } from "@/app/components/JsonLd";
import mediatorinPhoto from "@/fotos/medi_modern.jpg";
import { pageMetadata } from "@/lib/seo";

// Zielgruppe ist die Mediatorin, nicht die Streitpartei (siehe Kopf von
// fuerMediatorenPage.ts). Wie /fuer-berater ein Vertriebs-Asset: lebt von
// Direktlinks aus Mails und Gesprächen, nicht von der Suche.
// Title ≤60, Description ≤155 Zeichen — wie auf allen Seiten.
export const metadata: Metadata = pageMetadata({
  title: "Für Mediatoren: Anfragen ohne Akquise | medipact",
  description:
    "Eigenes Profil im Verzeichnis, Kennenlernen gebucht und bezahlt, Abrechnung über medipact. Werden Sie Teil des medipact-Mediatorenpools.",
  path: "/fuer-mediatoren",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: fuerMediatorenPageContent.faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function FuerMediatorenPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <MarketingPageTemplate
        {...fuerMediatorenPageContent}
        heroImage={{
          src: mediatorinPhoto,
          alt: "Mediatorin im Gespräch mit zwei Beteiligten",
        }}
        breadcrumbs={[{ label: "Für Mediatoren" }]}
        showLogbuchHinweis={false}
      />
    </>
  );
}
