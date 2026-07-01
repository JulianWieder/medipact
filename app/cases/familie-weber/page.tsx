import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["familie-weber"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Erbschaft", href: "/konflikte/erbschaft" },
        { label: "Familie Weber" },
      ]}
      relatedCases={[
        { label: "Anna & Klaus", href: "/cases/anna-klaus" },
        { label: "Marie & Sophie", href: "/cases/marie-sophie" },
      ]}
    />
  );
}
