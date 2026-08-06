import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { aboutPageContent } from "@/app/content/aboutPage";
import { FounderSection } from "@/app/components/FounderSection";
import { JsonLd } from "@/app/components/JsonLd";
import aboutPhoto from "@/fotos/medi_about.jpg";
import { pageMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Über medipact – Einigung zum Festpreis",
  description:
    "Warum medipact den Einigungsprozess standardisiert hat, was die Plattform heute leistet und wo ihre Grenzen liegen. Ab 49 € pro Partei, ohne Stundensatz.",
  path: "/about",
});

// /about ist die kanonische Seite ÜBER die Organisation. Deshalb `AboutPage`
// mit `about` auf den globalen Organization-Knoten aus app/layout.tsx (per
// @id, nicht als zweite Kopie) — und `founder` als einzige Ergänzung an
// diesem Knoten. Das ist die Stelle, an der Google Urheberschaft erwartet.
// Bewusst nur belegbare Angaben: Name und Rolle stehen so im Impressum,
// erfundene Mediations-Zertifikate haben hier nichts zu suchen (siehe
// FounderSection.tsx).
const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${SITE_URL}/about#webpage`,
  url: `${SITE_URL}/about`,
  name: "Über medipact",
  inLanguage: "de",
  description:
    "Warum medipact den Einigungsprozess standardisiert hat, was die Plattform heute leistet und wo ihre Grenzen liegen.",
  about: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    founder: {
      "@type": "Person",
      name: "Julian Wieder",
      jobTitle: "Gründer",
    },
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: aboutPageContent.faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutSchema} />
      <JsonLd data={faqSchema} />

      {/* `didYouKnowFacts` und `relatedCases` stehen bewusst IM Content-File
          (wie bei einigungPage.ts) und nicht mehr hier als Props: sonst gibt
          es zwei Orte, an denen über den Seiteninhalt entschieden wird. */}
      <MarketingPageTemplate
        {...aboutPageContent}
        heroImage={{
          src: aboutPhoto,
          alt: "medipact – strukturierte Online-Mediation für private und geschäftliche Konflikte",
        }}
        breadcrumbs={[{ label: "Über medipact" }]}
      />
      <FounderSection />
    </>
  );
}
