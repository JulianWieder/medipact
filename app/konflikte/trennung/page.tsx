// app/trennung/page.tsx

import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { trennungPageContent } from "@/app/content/trennungPage";

export default function TrennungPage() {
  return <MarketingPageTemplate {...trennungPageContent} />;
}
