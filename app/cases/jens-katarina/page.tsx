import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["jens-katarina"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Trennung & Scheidung", href: "/konflikte/trennung" },
        { label: "Jens & Katarina" },
      ]}
      relatedCases={[
        { label: "Alexa & David", href: "/cases/alexa-david" },
        { label: "Rolf & Helga", href: "/cases/rolf-helga" },
      ]}
    />
  );
}
