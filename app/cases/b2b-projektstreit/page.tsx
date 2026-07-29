import type { Metadata } from "next";
import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Fallbeispiel B2B-Streit: ERP-Projekt gerettet statt verklagt | medipact",
  description:
    "14 Monate Verzug, €400.000 strittige Nachträge: Wie ein Maschinenbauer und sein IT-Dienstleister das festgefahrene ERP-Projekt in 10 Wochen per Wirtschaftsmediation gerettet haben – statt 3–5 Jahre zu prozessieren.",
  path: "/cases/b2b-projektstreit",
  type: "article",
});

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["b2b-projektstreit"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Team & Organisation", href: "/konflikte/odr" },
        { label: "B2B-Projektstreit" },
      ]}
      relatedCases={[
        { label: "Gesellschafterstreit", href: "/cases/gesellschafter-streit" },
        { label: "Teamkonflikt im Mittelstand", href: "/cases/team-konflikt" },
      ]}
      faq={[
        {
          question: "Lohnt sich Mediation bei B2B-Streitigkeiten?",
          answer:
            "Fast immer, wenn Projekt oder Geschäftsbeziehung noch Wert haben: IT-Prozesse dauern 3–5 Jahre und kosten sechsstellig. Wirtschaftsmediation löst denselben Streit typischerweise in Wochen.",
        },
        {
          question: "Verjähren Ansprüche während der Mediation?",
          answer:
            "Nein, wenn es richtig aufgesetzt wird: Zu Beginn vereinbaren beide Seiten einen Verjährungsverzicht. Damit verhandelt niemand unter prozessualem Zeitdruck.",
        },
        {
          question: "Ist ein Mediationsvergleich zwischen Unternehmen bindend?",
          answer:
            "Ja. Der Vergleich wird anwaltlich ausgestaltet und ist ein vollwertiger Vertrag – auf Wunsch als vollstreckbarer Anwaltsvergleich oder notariell beurkundet.",
        },
        {
          question: "Was ist eine Mediationsklausel?",
          answer:
            "Eine Vertragsklausel, die bei künftigen Streitigkeiten zuerst eine Mediation vorsieht, bevor geklagt werden darf. Sie verhindert, dass Projektkonflikte direkt zu Juristen eskalieren.",
        },
      ]}
    />
  );
}
