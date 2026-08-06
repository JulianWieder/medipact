import type { Metadata } from "next";
import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "50/50-Patt in der GmbH gelöst – in 3 Monaten | medipact",
  description:
    "Zwei Gründer, je 50 % der Anteile, komplette Blockade bei 18 Mitarbeitern: Wie die Agentur das Patt in drei Monaten löste – ohne Rechtsstreit.",
  path: "/cases/gesellschafter-streit",
  type: "article",
});

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
        { label: "Carla & Marco: Trennung mit GmbH", href: "/cases/trennung-gemeinsame-firma" },
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
