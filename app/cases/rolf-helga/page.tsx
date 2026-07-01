import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["rolf-helga"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Trennung & Scheidung", href: "/konflikte/trennung" },
        { label: "Rolf & Helga" },
      ]}
      relatedCases={[
        { label: "Peter & Sarah", href: "/cases/peter-sarah" },
        { label: "Carla & Marco", href: "/cases/carla-marco" },
      ]}
    />
  );
}
