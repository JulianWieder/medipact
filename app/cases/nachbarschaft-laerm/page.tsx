import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["nachbarschaft-laerm"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Nachbarschaft", href: "/konflikte/nachbarschaft" },
        { label: "Familie Schneider" },
      ]}
      relatedCases={[
        { label: "Zaun auf der Grenze", href: "/cases/nachbarschaft-zaun" },
        { label: "Parkplatz blockiert", href: "/cases/nachbarschaft-parken" },
      ]}
    />
  );
}
