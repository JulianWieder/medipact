import type { Metadata } from "next";
import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";

export const metadata: Metadata = {
  title: "Fallbeispiel Trennung mit Kindern: Maria & Thomas | medipact",
  description:
    "Trennung nach 12 Jahren Ehe, 2 Kinder: Wie Maria & Thomas mit Mediation in 5 Monaten Sorgerecht, Unterhalt und Haus fair geregelt haben – für €499 statt €52.000 Gerichtskosten.",
  alternates: { canonical: "https://medipact.de/cases/maria-thomas" },
};

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["maria-thomas"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Trennung & Scheidung", href: "/konflikte/trennung" },
        { label: "Maria & Thomas" },
      ]}
      relatedCases={[
        { label: "Alexa & David", href: "/cases/alexa-david" },
        { label: "Peter & Sarah", href: "/cases/peter-sarah" },
      ]}
      faq={[
        {
          question: "Wer trägt die Kosten bei einer Mediation?",
          answer:
            "In der Regel teilen sich beide Parteien die Kosten anteilig – bei medipact ab €399 pro Partei. Im Fall von Maria & Thomas kostete die gesamte Mediation €798, ein Gerichtsverfahren hätte über €52.000 gekostet.",
        },
        {
          question: "Wie lange dauert eine Mediation bei Trennung?",
          answer:
            "Eine Trennungs-Mediation dauert meist drei bis sechs Monate. Maria & Thomas regelten Sorgerecht, Unterhalt und Hausübernahme in fünf Monaten – ein streitiges Gerichtsverfahren dauert oft drei Jahre oder länger.",
        },
        {
          question: "Ist eine Mediationsvereinbarung rechtlich bindend?",
          answer:
            "Ja, die schriftliche Abschlussvereinbarung ist ein bindender Vertrag. Einzelne Scheidungsfolgen wie Zugewinnausgleich oder Ehegattenunterhalt müssen zusätzlich notariell beurkundet werden, um vollstreckbar zu sein.",
        },
        {
          question: "Funktioniert Mediation, wenn ein Partner nicht will?",
          answer:
            "Mediation ist freiwillig – beide müssen zustimmen. In der Praxis hilft oft ein getrenntes Erstgespräch: Auch Maria war anfangs skeptisch und stimmte erst nach einem Einzelgespräch mit dem Mediator zu.",
        },
      ]}
    />
  );
}
