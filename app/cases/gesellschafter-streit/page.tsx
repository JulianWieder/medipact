import type { Metadata } from "next";
import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";

export const metadata: Metadata = {
  title: "Fallbeispiel Gesellschafterstreit: 50/50-Patt gelöst | medipact",
  description:
    "Zwei Gründer, je 50% der Anteile, komplette Blockade: Wie eine Softwareagentur mit 18 Mitarbeitern das Gesellschafter-Patt in 3 Monaten per Mediation gelöst hat – statt jahrelangem Rechtsstreit.",
  alternates: {
    canonical: "https://medipact.de/cases/gesellschafter-streit",
  },
};

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["gesellschafter-streit"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Team & Organisation", href: "/konflikte/odr" },
        { label: "Gesellschafterstreit" },
      ]}
      relatedCases={[
        { label: "Teamkonflikt im Mittelstand", href: "/cases/team-konflikt" },
        { label: "ERP-Projektstreit", href: "/cases/b2b-projektstreit" },
        { label: "Carla & Marco: Trennung mit GmbH", href: "/cases/carla-marco" },
      ]}
      faq={[
        {
          question: "Was tun bei einer 50/50-Pattsituation unter Gesellschaftern?",
          answer:
            "Mediation ist meist der schnellste Ausweg: Sie löst die Blockade in Wochen statt Jahren. Juristische Wege wie Auflösungsklage oder Zwangseinziehung dauern Jahre und entwerten die Firma währenddessen.",
        },
        {
          question: "Was kostet eine Gesellschafter-Mediation?",
          answer:
            "Deutlich weniger als ein Gesellschafterstreit vor Gericht: In diesem Fall €2.400 statt €50.000+ Verfahrenskosten. Der größte Hebel ist aber der erhaltene Firmenwert.",
        },
        {
          question: "Ist das Ergebnis einer Gesellschafter-Mediation rechtlich bindend?",
          answer:
            "Ja. Die Vereinbarung wird von den Anwälten beider Seiten ausgestaltet und – wo nötig, etwa bei Anteilsübertragungen – notariell beurkundet. Sie ist damit voll vollstreckbar.",
        },
        {
          question: "Wie verhindert man künftige Pattsituationen?",
          answer:
            "Mit strukturellen Regelungen aus der Mediation: Schiedsklauseln, ein Beirat mit Stichentscheid oder klar getrennte Verantwortungsbereiche verhindern, dass ein neues Patt die Firma erneut blockiert.",
        },
      ]}
    />
  );
}
