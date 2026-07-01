import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["carla-marco"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Trennung & Scheidung", href: "/konflikte/trennung" },
        { label: "Carla & Marco" },
      ]}
      relatedCases={[
        { label: "Jens & Katarina", href: "/cases/jens-katarina" },
        { label: "Maria & Thomas", href: "/cases/maria-thomas" },
      ]}
    />
  );
}
