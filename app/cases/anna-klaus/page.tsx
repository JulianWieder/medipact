import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["anna-klaus"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Erbschaft", href: "/konflikte/erbschaft" },
        { label: "Anna & Klaus" },
      ]}
      relatedCases={[
        { label: "Marie & Sophie", href: "/cases/marie-sophie" },
        { label: "Familie Weber", href: "/cases/familie-weber" },
      ]}
    />
  );
}
