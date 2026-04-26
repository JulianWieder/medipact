// app/nachbarschaft/page.tsx

import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { nachbarschaftPageContent } from "@/app/content/nachbarschaftPage";

export default function NachbarschaftPage() {
  return <MarketingPageTemplate {...nachbarschaftPageContent} />;
}
