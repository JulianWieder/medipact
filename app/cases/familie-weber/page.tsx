import type { Metadata } from "next";
import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";

export const metadata: Metadata = {
  title: "Fallbeispiel Firmenerbe: Familie Weber | medipact",
  description:
    "Drei Kinder erben einen Metallbau-Betrieb mit 20 Mitarbeitern: Wie die Familie Weber per Mediation in 4 Monaten den Betrieb rettete – für €1.200 statt €38.000 Verfahrenskosten.",
  alternates: { canonical: "https://medipact.de/cases/familie-weber" },
};

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["familie-weber"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Erbschaft", href: "/konflikte/erbschaft" },
        { label: "Familie Weber" },
      ]}
      relatedCases={[
        { label: "Anna & Klaus", href: "/cases/anna-klaus" },
        { label: "Marie & Sophie", href: "/cases/marie-sophie" },
      ]}
      faq={[
        {
          question: "Was passiert mit einem Betrieb in der Erbengemeinschaft?",
          answer:
            "Ohne Einigung droht Verkauf oder Zerschlagung, denn jeder Miterbe kann die Auseinandersetzung verlangen. Bei Familie Weber führt ein Kind den Betrieb fort, die anderen erhalten einen fairen Ausgleich – 20 Arbeitsplätze blieben gesichert.",
        },
        {
          question: "Wie wird ein geerbtes Unternehmen bewertet?",
          answer:
            "Durch eine neutrale Unternehmensbewertung, die alle Erben gemeinsam beauftragen. Sie ersetzt den teuren Kampf konkurrierender Parteigutachten und schafft eine Faktenbasis, der alle vertrauen.",
        },
        {
          question: "Was kostet eine Mediation beim Firmenerbe?",
          answer:
            "Hier €1.200 statt über €38.000 im Streitfall – gelöst in 4 Monaten. Der eigentliche Wert: Betrieb und Familienbeziehung haben den Erbfall überlebt.",
        },
      ]}
    />
  );
}
