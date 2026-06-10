import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { nachbarschaftPageContent } from "@/app/content/nachbarschaftPage";

export const metadata: Metadata = {
  title: "Nachbarschaftsstreit lösen ohne Gericht | medipact",
  description:
    "Lärm, Grenzen, Parkplätze oder Garten – Nachbarschaftskonflikte belasten den Alltag. Medipact hilft, wieder normal nebeneinander zu leben.",
  alternates: { canonical: "https://medipact.de/konflikte/nachbarschaft" },
};

export default function NachbarschaftPage() {
  return <MarketingPageTemplate {...nachbarschaftPageContent} />;
}
