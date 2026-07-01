import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["maria-thomas"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Trennung & Scheidung", href: "/konflikte/trennung" },
        { label: "Maria & Thomas" },
      ]}
      relatedCases={[
        { label: "Alexa & David", href: "/cases/alexa-david" },
        { label: "Peter & Sarah", href: "/cases/peter-sarah" },
      ]}
    />
  );
}
