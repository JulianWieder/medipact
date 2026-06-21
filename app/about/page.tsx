import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { aboutPageContent } from "@/app/content/aboutPage";
import aboutPhoto from "@/fotos/medi_about.jpg";

export const metadata: Metadata = {
  title: "Über medipact – KI-Mediation mit klarem Ergebnisfokus",
  description:
    "Medipact steht für strukturierte Mediation bei privaten Konflikten. Wir helfen Menschen, festgefahrene Situationen zu klären – vertraulich und lösungsorientiert.",
  alternates: { canonical: "https://medipact.de/about" },
};

export default function AboutPage() {
  return (
    <MarketingPageTemplate
      {...aboutPageContent}
      heroImage={{
        src: aboutPhoto,
        alt: "medipact – Mediation für private Konflikte",
      }}
    />
  );
}
