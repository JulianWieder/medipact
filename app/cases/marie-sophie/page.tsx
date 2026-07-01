import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["marie-sophie"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Erbschaft", href: "/konflikte/erbschaft" },
        { label: "Marie & Sophie" },
      ]}
      relatedCases={[
        { label: "Anna & Klaus", href: "/cases/anna-klaus" },
        { label: "Familie Weber", href: "/cases/familie-weber" },
      ]}
    />
  );
}
