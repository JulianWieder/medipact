import type { Metadata } from "next";
import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Fallbeispiel internationale Trennung: Jens & Katarina | medipact",
  description:
    "Trennung über Ländergrenzen (Deutschland/Schweiz) mit Kind: Wie Jens & Katarina per Mediation Wohnort, Umgang und Vermögen in 9 Monaten regelten – für €1.200 statt €60.000.",
  path: "/cases/internationale-trennung",
  type: "article",
});

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["internationale-trennung"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Trennung & Scheidung", href: "/konflikte/trennung" },
        { label: "Jens & Katarina" },
      ]}
      relatedCases={[
        { label: "Alexa & David", href: "/cases/trennung-patchwork-familie" },
        { label: "Rolf & Helga", href: "/cases/trennung-nach-langer-ehe" },
      ]}
      faq={[
        {
          question: "Welches Recht gilt bei einer internationalen Scheidung?",
          answer:
            "Grundsätzlich das Recht am gewöhnlichen Aufenthaltsort – bei mehreren Ländern wird es schnell komplex und teuer. Jens & Katarina erarbeiteten in der Mediation eine Vereinbarung, die in Deutschland und der Schweiz rechtsgültig ist.",
        },
        {
          question: "Darf ein Elternteil mit dem Kind ins Ausland ziehen?",
          answer:
            "Nur mit Zustimmung des anderen Sorgeberechtigten oder des Gerichts. In der Mediation fanden beide eine Lösung: Lucas lebt bei der Mutter in der Schweiz, Jens bleibt durch feste Umgangszeiten präsent.",
        },
        {
          question: "Was kostet eine internationale Trennungs-Mediation?",
          answer:
            "Hier €1.200 statt geschätzter €60.000 für Verfahren in zwei Ländern – und 9 Monate statt über 2 Jahre.",
        },
      ]}
    />
  );
}
