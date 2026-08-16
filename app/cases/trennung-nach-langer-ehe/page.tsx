import type { Metadata } from "next";
import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Scheidung nach 38 Jahren: Rente fair geteilt | medipact",
  description:
    "Pension auf der einen Seite, kleine Rente auf der anderen: Wie Altersvorsorge und Haus in sechs Monaten aufgeteilt wurden – 800 € statt 26.500 €.",
  path: "/cases/trennung-nach-langer-ehe",
  type: "article",
});

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["trennung-nach-langer-ehe"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Trennung & Scheidung", href: "/scheidungsmediation" },
        { label: "Rolf & Helga" },
      ]}
      relatedCases={[
        { label: "Peter & Sarah", href: "/cases/trennung-vermoegen-aufteilen" },
        { label: "Carla & Marco", href: "/cases/trennung-gemeinsame-firma" },
      ]}
      faq={[
        {
          question: "Was passiert mit der Rente bei einer späten Scheidung?",
          answer:
            "Im Versorgungsausgleich werden die in der Ehezeit erworbenen Rentenanwartschaften geteilt – auch Beamtenpensionen. Für Helga bedeutete die faire Regelung rund €1.200 monatlich im Alter.",
        },
        {
          question: "Lohnt sich Mediation auch nach sehr langer Ehe?",
          answer:
            "Ja, gerade dann: Nach 38 Jahren gibt es viel gemeinsames Vermögen und Ansprüche. Rolf & Helga hatten in 6 Monaten Klarheit statt 2+ Jahre Verfahren – und sparten zusammen €25.700.",
        },
        {
          question: "Wer bekommt das Haus bei einer Scheidung im Alter?",
          answer:
            "Das ist frei verhandelbar: Übernahme durch einen Partner mit Ausgleich, Verkauf oder Nießbrauch. Hier blieb das Haus bei Helga, mit klar geregeltem Ausgleich für Rolf.",
        },
      ]}
    />
  );
}
