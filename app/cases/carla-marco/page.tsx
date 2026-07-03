import type { Metadata } from "next";
import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";

export const metadata: Metadata = {
  title: "Fallbeispiel Trennung mit Firma: Carla & Marco | medipact",
  description:
    "Trennung mit gemeinsamer GmbH: Wie Carla & Marco per Mediation Abfindung und Firmenfortbestand in 6 Monaten regelten – €200k Abfindung, Jobs gesichert, €600 statt €37.000 Kosten.",
  alternates: { canonical: "https://medipact.de/cases/carla-marco" },
};

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["carla-marco"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Trennung & Scheidung", href: "/konflikte/trennung" },
        { label: "Carla & Marco" },
      ]}
      relatedCases={[
        { label: "Jens & Katarina", href: "/cases/jens-katarina" },
        { label: "Maria & Thomas", href: "/cases/maria-thomas" },
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
