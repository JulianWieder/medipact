import type { Metadata } from "next";
import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";

export const metadata: Metadata = {
  title: "Fallbeispiel Teamkonflikt: Vertrieb gegen Entwicklung | medipact",
  description:
    "Eskalierte Meetings, Krankmeldungen, drei Kündigungen: Wie ein Software-Mittelständler den Konflikt zwischen Vertrieb und Entwicklung in 6 Wochen per Teammediation gelöst hat.",
  alternates: { canonical: "https://medipact.de/cases/team-konflikt" },
};

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["team-konflikt"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Team & Organisation", href: "/konflikte/geschaeft" },
        { label: "Teamkonflikt" },
      ]}
      relatedCases={[
        { label: "Gesellschafterstreit", href: "/cases/gesellschafter-streit" },
        { label: "ERP-Projektstreit", href: "/cases/b2b-projektstreit" },
      ]}
      faq={[
        {
          question: "Wann lohnt sich eine Teammediation?",
          answer:
            "Sobald ein Konflikt die Zusammenarbeit messbar stört – etwa durch Krankenstand, Kündigungen oder verschleppte Projekte. Je früher, desto günstiger: Ungelöste Teamkonflikte kosten schnell sechsstellige Beträge an Fluktuation.",
        },
        {
          question: "Wie läuft eine Teammediation ab?",
          answer:
            "In der Regel in drei Phasen: vertrauliche Einzelgespräche mit Schlüsselpersonen, gemeinsame moderierte Sitzungen und eine schriftliche Team-Vereinbarung mit Follow-up. Dauer meist 4–8 Wochen.",
        },
        {
          question: "Erfährt die Geschäftsführung, was in der Mediation besprochen wurde?",
          answer:
            "Nein, die Gespräche sind vertraulich. Die Geschäftsführung erhält nur die gemeinsam beschlossenen Ergebnisse und Vereinbarungen – das schützt die Offenheit der Beteiligten.",
        },
        {
          question: "Was kostet ein ungelöster Teamkonflikt?",
          answer:
            "Oft mehr als gedacht: In diesem Fall über €120.000 allein durch drei Kündigungen (Recruiting und Einarbeitung), dazu erhöhter Krankenstand und ein verlorener Großkunde. Die Mediation kostete €1.800.",
        },
      ]}
    />
  );
}
