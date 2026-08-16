import type { Metadata } from "next";
import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Trennung mit gemeinsamer GmbH: Firma gerettet | medipact",
  description:
    "Privat getrennt, geschäftlich verbunden: Wie Abfindung und Fortbestand in sechs Monaten geregelt wurden – 600 € statt 37.000 €, alle Jobs erhalten.",
  path: "/cases/trennung-gemeinsame-firma",
  type: "article",
});

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["trennung-gemeinsame-firma"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Trennung & Scheidung", href: "/scheidungsmediation" },
        { label: "Carla & Marco" },
      ]}
      relatedCases={[
        { label: "Jens & Katarina", href: "/cases/internationale-trennung" },
        { label: "Maria & Thomas", href: "/cases/trennung-mit-kindern" },
      ]}
      faq={[
        {
          question: "Was passiert mit einer gemeinsamen Firma bei der Trennung?",
          answer:
            "Drei Wege: Verkauf, Fortführung durch einen Partner mit Abfindung, oder gemeinsame Weiterführung. Carla führte die GmbH weiter, Marco erhielt €200.000 Abfindung – die Mitarbeiter behielten ihre Jobs.",
        },
        {
          question: "Wie wird eine GmbH bei der Scheidung bewertet?",
          answer:
            "Über eine neutrale Unternehmensbewertung, meist nach dem Ertragswertverfahren. In der Mediation dient sie beiden Seiten als gemeinsame Faktenbasis statt als Kampfinstrument zweier Parteigutachter.",
        },
        {
          question: "Was kostet eine Mediation, wenn ein Unternehmen im Spiel ist?",
          answer:
            "Hier €600 statt geschätzter €37.000 im Streitverfahren, gelöst in 6 statt 36 Monaten. Der größte Wert: Die Firma überlebte den Konflikt.",
        },
      ]}
    />
  );
}
