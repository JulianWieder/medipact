import type { Metadata } from "next";
import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Erbstreit ums Haus: 800 € statt 20.000 € | medipact",
  description:
    "Zwei Geschwister, ein geerbtes Haus, 150.000 € strittig. Wie die Einigung in drei Monaten gelang – und warum sie 800 € statt 20.000 € gekostet hat.",
  path: "/cases/erbstreit-haus-geschwister",
  type: "article",
});

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["erbstreit-haus-geschwister"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Erbschaft", href: "/konflikte/erbschaft" },
        { label: "Anna & Klaus" },
      ]}
      relatedCases={[
        { label: "Marie & Sophie", href: "/cases/streit-ums-testament" },
        { label: "Familie Weber", href: "/cases/unternehmen-geerbt" },
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
            "Bei medipact ab €399 einmalig für den Fall. Anna & Klaus zahlten €399 und waren nach 3 Monaten fertig – ein Erbstreit vor Gericht hätte über €20.000 gekostet und Jahre gedauert.",
        },
      ]}
    />
  );
}
