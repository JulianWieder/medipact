import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { aboutPageContent } from "@/app/content/aboutPage";
import { mediationsgesetzFacts } from "@/app/components/ui/DidYouKnowSection";
import { FounderSection } from "@/app/components/FounderSection";
import aboutPhoto from "@/fotos/medi_about.jpg";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Über medipact – Struktur für festgefahrene Konflikte",
  description:
    "Warum wir den Einigungsprozess standardisiert haben, wer dahintersteht und wofür medipact geradesteht: vertraulich, ohne Sieger und ohne Verlierer.",
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
