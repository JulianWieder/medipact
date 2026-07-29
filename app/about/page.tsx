import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { aboutPageContent } from "@/app/content/aboutPage";
import { mediationsgesetzFacts } from "@/app/components/ui/DidYouKnowSection";
import { FounderSection } from "@/app/components/FounderSection";
import aboutPhoto from "@/fotos/medi_about.jpg";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Über medipact – strukturierte Mediation mit klarem Ergebnisfokus",
  description:
    "Medipact steht für strukturierte Mediation bei privaten Konflikten. Wir helfen Menschen, festgefahrene Situationen zu klären – vertraulich und lösungsorientiert.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <MarketingPageTemplate
        {...aboutPageContent}
        heroImage={{
          src: aboutPhoto,
          alt: "medipact – Mediation für private Konflikte",
        }}
        didYouKnowFacts={mediationsgesetzFacts}
        breadcrumbs={[{ label: "Über medipact" }]}
      />
      <FounderSection />
    </>
  );
}
