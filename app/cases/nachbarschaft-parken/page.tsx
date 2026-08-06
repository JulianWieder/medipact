import type { Metadata } from "next";
import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Parkstreit vor der Einfahrt: endlich geregelt | medipact",
  description:
    "Blockierte Einfahrt, täglicher Ärger beim Nachhausekommen: Wie in wenigen Sitzungen eine Regelung entstand, an die sich seither beide halten.",
  path: "/cases/nachbarschaft-parken",
  type: "article",
});

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["nachbarschaft-parken"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Nachbarschaft", href: "/konflikte/nachbarschaft" },
        { label: "Herr Wagner & Frau Lehmann" },
      ]}
      relatedCases={[
        { label: "Nächtlicher Lärm", href: "/cases/nachbarschaft-laerm" },
        { label: "Zaun auf der Grenze", href: "/cases/nachbarschaft-zaun" },
      ]}
      faq={[
        {
          question: "Was kann ich tun, wenn meine Einfahrt ständig blockiert wird?",
          answer:
            "Abschleppen und Unterlassungsansprüche sind rechtlich möglich, verschärfen den Konflikt aber meist. Die Mediation setzt an der Ursache an: eine Parkregelung, die beide Nachbarn mittragen.",
        },
        {
          question: "Lohnt sich ein Anwalt bei einem Parkstreit unter Nachbarn?",
          answer:
            "Selten – die Kosten stehen meist außer Verhältnis, und man bleibt danach trotzdem Nachbarn. Eine Mediation ab €49 pro Partei löst den Konflikt, statt ihn zu gewinnen.",
        },
        {
          question: "Wie schnell wirkt eine Nachbarschaftsmediation?",
          answer:
            "Oft reichen ein bis drei Sitzungen innerhalb weniger Wochen. Bei Herrn Wagner und Frau Lehmann entspannte sich der Alltag unmittelbar nach der gemeinsamen Regelung.",
        },
      ]}
    />
  );
}
