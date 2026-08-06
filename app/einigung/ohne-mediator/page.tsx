import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { einigungOhneMediatorPageContent } from "@/app/content/einigungOhneMediatorPage";
import { JsonLd } from "@/app/components/JsonLd";
import gespraechPhoto from "@/fotos/medi_gespraech.jpg";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Mediation ohne Mediator: Was geht und was nicht | medipact",
  description:
    "Konflikt online klären ohne Mediator und ohne Anwalt: Was der geführte Prozess allein leistet – und die fünf Fälle, in denen ein Mensch übernehmen muss.",
  path: "/einigung/ohne-mediator",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: einigungOhneMediatorPageContent.faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function OhneMediatorPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <MarketingPageTemplate
        {...einigungOhneMediatorPageContent}
        heroImage={{
          src: gespraechPhoto,
          alt: "Gespräch zwischen zwei Konfliktparteien",
        }}
        breadcrumbs={[
          { label: "Einigungsprozess", href: "/einigung" },
          { label: "Ohne Mediator" },
        ]}
        relatedCases={[
          { label: "Nachbarschaft: Lärm", href: "/cases/nachbarschaft-laerm" },
          { label: "Trennung mit Kindern", href: "/cases/trennung-mit-kindern" },
          { label: "Streit ums Testament", href: "/cases/streit-ums-testament" },
        ]}
      />
    </>
  );
}
