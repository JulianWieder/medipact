import type { Metadata } from "next";
import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";

export const metadata: Metadata = {
  title: "Fallbeispiel Parkstreit: Herr Wagner & Frau Lehmann | medipact",
  description:
    "Blockierte Einfahrt, täglicher Streit: Wie eine Nachbarschaftsmediation in wenigen Sitzungen eine klare Parkregelung schuf und den Dauerkonflikt vor der Haustür beendete.",
  alternates: { canonical: "https://medipact.de/cases/nachbarschaft-parken" },
};

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
            "Selten – die Kosten stehen meist außer Verhältnis, und man bleibt danach trotzdem Nachbarn. Eine Mediation ab €20 pro Partei löst den Konflikt, statt ihn zu gewinnen.",
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
