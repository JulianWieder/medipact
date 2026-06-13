import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { erbschaftPageContent } from "@/app/content/erbschaftPage";

export const metadata: Metadata = {
  title: "Erbschaftsstreit lösen – faire Einigung ohne Gericht | medipact",
  description:
    "Trauer, Erwartungen und Familiengeschichte treffen aufeinander. Medipact hilft, Erbschaftskonflikte strukturiert zu klären – bevor Anwalt und Gericht notwendig werden.",
  alternates: { canonical: "https://medipact.de/konflikte/erbschaft" },
};

export default function ErbschaftPage() {
  return <MarketingPageTemplate {...erbschaftPageContent} />;
}
