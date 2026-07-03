import type { Metadata } from "next";
import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";

export const metadata: Metadata = {
  title: "Fallbeispiel Erbstreit ums Haus: Anna & Klaus | medipact",
  description:
    "Zwei Geschwister, ein geerbtes Haus: Wie Anna & Klaus per Mediation in 3 Monaten eine faire Lösung fanden – Anna behält das Haus, Klaus erhält €150.000, für €800 statt €20.000.",
  alternates: { canonical: "https://medipact.de/cases/anna-klaus" },
};

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["anna-klaus"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Erbschaft", href: "/konflikte/erbschaft" },
        { label: "Anna & Klaus" },
      ]}
      relatedCases={[
        { label: "Marie & Sophie", href: "/cases/marie-sophie" },
        { label: "Familie Weber", href: "/cases/familie-weber" },
      ]}
      faq={[
        {
          question: "Wie einigen sich Geschwister bei einem geerbten Haus?",
          answer:
            "Drei Optionen: Übernahme gegen Auszahlung, gemeinsamer Verkauf oder Vermietung. Anna behielt das Haus und zahlte Klaus €150.000 aus – mit Ratenzahlung, die ihm ohne Gericht nie angeboten worden wäre.",
        },
        {
          question: "Kann man eine Erbengemeinschaft ohne Gericht auflösen?",
          answer:
            "Ja, über eine einvernehmliche Auseinandersetzungsvereinbarung – nur die Immobilienübertragung selbst braucht einen Notar. Der Gang zum Gericht (Teilungsversteigerung) vernichtet dagegen meist Vermögen und Beziehungen.",
        },
        {
          question: "Was kostet eine Erbschaftsmediation?",
          answer:
            "Bei medipact ab €249 pro Partei. Anna & Klaus zahlten €800 und waren nach 3 Monaten fertig – ein Erbstreit vor Gericht hätte über €20.000 gekostet und Jahre gedauert.",
        },
      ]}
    />
  );
}
