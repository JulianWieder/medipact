import type { Metadata } from "next";
import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Fallbeispiel Scheidung mit Vermögen: Peter & Sarah | medipact",
  description:
    "Scheidung nach 20 Jahren mit Haus, Ersparnissen und Rentenpunkten: Wie Peter & Sarah per Mediation €1,1 Mio. fair aufteilten und €20.000 Steuern sparten – für €1.500 statt €45.000.",
  path: "/cases/trennung-vermoegen-aufteilen",
  type: "article",
});

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["trennung-vermoegen-aufteilen"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Trennung & Scheidung", href: "/konflikte/trennung" },
        { label: "Peter & Sarah" },
      ]}
      relatedCases={[
        { label: "Rolf & Helga", href: "/cases/trennung-nach-langer-ehe" },
        { label: "Jens & Katarina", href: "/cases/internationale-trennung" },
      ]}
      faq={[
        {
          question: "Wie wird Vermögen bei einer Scheidung aufgeteilt?",
          answer:
            "Gesetzlich über den Zugewinnausgleich – in der Mediation können Paare die Aufteilung aber frei und steueroptimiert gestalten. Peter & Sarah erhielten so je €475.000, transparent nachvollziehbar für beide.",
        },
        {
          question: "Kann Mediation bei der Scheidung Steuern sparen?",
          answer:
            "Ja, eine durchdachte Aufteilung von Immobilien und Kapital kann erhebliche Steuern vermeiden. Bei Peter & Sarah brachte die gemeinsam geplante Übertragung €20.000 Steuerersparnis – ein Netto-Vorteil von €43.500 pro Person.",
        },
        {
          question: "Was kostet eine Scheidungsmediation bei großem Vermögen?",
          answer:
            "Deutlich weniger als ein streitiges Verfahren: Hier €1.500 statt über €45.000 an Anwalts- und Gerichtskosten, und 8 Monate statt geschätzter 4 Jahre.",
        },
      ]}
    />
  );
}
