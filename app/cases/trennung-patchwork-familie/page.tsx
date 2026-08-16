import type { Metadata } from "next";
import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Patchwork-Trennung: klare Rollen für alle | medipact",
  description:
    "Zwei Kinder, ein Stiefkind, ein neuer Partner: Wie in vier Monaten klare Zuständigkeiten für alle Beteiligten entstanden – 499 € statt 33.000 €.",
  path: "/cases/trennung-patchwork-familie",
  type: "article",
});

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["trennung-patchwork-familie"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Trennung & Scheidung", href: "/scheidungsmediation" },
        { label: "Alexa & David" },
      ]}
      relatedCases={[
        { label: "Maria & Thomas", href: "/cases/trennung-mit-kindern" },
        { label: "Carla & Marco", href: "/cases/trennung-gemeinsame-firma" },
      ]}
      faq={[
        {
          question: "Wie regelt man den Umgang in einer Patchwork-Familie?",
          answer:
            "Alle Beteiligten – auch neue Partner – bekommen klar definierte Rollen, die gemeinsam vereinbart werden. Alexa & David bezogen Martins Rolle als Stiefvater aktiv in die Mediation ein, statt sie zum Tabu zu machen.",
        },
        {
          question: "Hat der neue Partner ein Mitspracherecht bei den Kindern?",
          answer:
            "Rechtlich nein – das Sorgerecht bleibt bei den Eltern. In der Mediation lässt sich die Alltagsrolle des neuen Partners aber transparent regeln, damit keine Verwirrung für die Kinder entsteht.",
        },
        {
          question: "Was kostet eine Mediation bei Trennung mit Kindern?",
          answer:
            "Bei medipact ab €399 pro Partei. Alexa & David zahlten zusammen €798 und waren nach 4 Monaten fertig – ein Gerichtsverfahren hätte rund €33.000 gekostet und 2 Jahre gedauert.",
        },
      ]}
    />
  );
}
