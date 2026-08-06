import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { einigungAbgleichPageContent } from "@/app/content/einigungAbgleichPage";
import { JsonLd } from "@/app/components/JsonLd";
import AbgleichDiagramm from "@/app/components/AbgleichDiagramm";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Gewichteter Abgleich: Einigung ohne Verhandeln | medipact",
  description:
    "Bei strittigen Punkten entscheidet nicht Verhandlungsgeschick, sondern Gewichtung: Wie der Abgleich beider Seiten einen fairen Einigungsvorschlag erzeugt.",
  path: "/einigung/abgleich",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: einigungAbgleichPageContent.faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

// Bewusst OHNE heroImage: Der helle Hero-Zweig des Templates rendert
// stattdessen `heroAside` – und auf dieser Seite erklärt das Schaubild den
// Mechanismus besser als jedes Stimmungsfoto. Es ist die einzige Seite im
// Cluster, auf der das gilt.
export default function AbgleichPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <MarketingPageTemplate
        {...einigungAbgleichPageContent}
        heroAside={<AbgleichDiagramm />}
        breadcrumbs={[
          { label: "Einigungsprozess", href: "/einigung" },
          { label: "Abgleich & Tausch" },
        ]}
        relatedCases={[
          { label: "Nachbarschaft: Parken", href: "/cases/nachbarschaft-parken" },
          { label: "Trennung: Vermögen aufteilen", href: "/cases/trennung-vermoegen-aufteilen" },
          { label: "B2B-Projektstreit", href: "/cases/b2b-projektstreit" },
        ]}
      />
    </>
  );
}
