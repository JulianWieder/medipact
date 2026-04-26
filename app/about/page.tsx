import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { aboutPageContent } from "@/app/content/aboutPage";

export default function AboutPage() {
  return <MarketingPageTemplate {...aboutPageContent} />;
}
