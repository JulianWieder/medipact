import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["alexa-david"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Trennung & Scheidung", href: "/konflikte/trennung" },
        { label: "Alexa & David" },
      ]}
      relatedCases={[
        { label: "Maria & Thomas", href: "/cases/maria-thomas" },
        { label: "Carla & Marco", href: "/cases/carla-marco" },
      ]}
    />
  );
}
