import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";

export default function Page() {
  return <CaseStudyTemplate {...caseStudies["rolf-helga"]} />;
}
