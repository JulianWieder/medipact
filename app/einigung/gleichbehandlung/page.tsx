import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { einigungGleichbehandlungPageContent } from "@/app/content/einigungGleichbehandlungPage";
import { JsonLd } from "@/app/components/JsonLd";
import neutralPhoto from "@/fotos/medi_einordnen.jpg";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Neutralität im Verfahren: Fairness by design | medipact",
  description:
    "Beide Seiten, dieselben Schritte: Wie medipact Gleichbehandlung im Ablauf verankert, was vertraulich bleibt und wo KI eingesetzt wird – und wo nicht.",
  path: "/einigung/gleichbehandlung",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: einigungGleichbehandlungPageContent.faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function GleichbehandlungPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <MarketingPageTemplate
        {...einigungGleichbehandlungPageContent}
        heroImage={{
          src: neutralPhoto,
          alt: "Neutrale Einordnung eines Konflikts",
        }}
        breadcrumbs={[
          { label: "Einigungsprozess", href: "/einigung" },
          { label: "Gleichbehandlung" },
        ]}
        relatedCases={[
          { label: "Trennung nach langer Ehe", href: "/cases/trennung-nach-langer-ehe" },
          { label: "Team-Konflikt", href: "/cases/team-konflikt" },
          { label: "Unternehmen geerbt", href: "/cases/unternehmen-geerbt" },
        ]}
      />
    </>
  );
}
