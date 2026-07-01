import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["peter-sarah"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Trennung & Scheidung", href: "/konflikte/trennung" },
        { label: "Peter & Sarah" },
      ]}
      relatedCases={[
        { label: "Rolf & Helga", href: "/cases/rolf-helga" },
        { label: "Jens & Katarina", href: "/cases/jens-katarina" },
      ]}
    />
  );
}
