import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["nachbarschaft-zaun"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Nachbarschaft", href: "/konflikte/nachbarschaft" },
        { label: "Familien Krüger & Hoffmann" },
      ]}
      relatedCases={[
        { label: "Nächtlicher Lärm", href: "/cases/nachbarschaft-laerm" },
        { label: "Parkplatz blockiert", href: "/cases/nachbarschaft-parken" },
      ]}
    />
  );
}
