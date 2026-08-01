import type { Metadata } from "next";
import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Fallbeispiel Testament-Konflikt: Marie & Sophie | medipact",
  description:
    "Ungleiches Testament, verletzte Gefühle: Wie Marie & Sophie per Mediation in 3 Monaten eine faire Lösung fanden, die Pflegeleistung anerkennt – für €800 statt €28.000 Prozesskosten.",
  path: "/cases/streit-ums-testament",
  type: "article",
});

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["streit-ums-testament"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Erbschaft", href: "/konflikte/erbschaft" },
        { label: "Marie & Sophie" },
      ]}
      relatedCases={[
        { label: "Anna & Klaus", href: "/cases/erbstreit-haus-geschwister" },
        { label: "Familie Weber", href: "/cases/unternehmen-geerbt" },
      ]}
      faq={[
        {
          question: "Kann man ein Testament anfechten, wenn es unfair wirkt?",
          answer:
            "Nur in engen Grenzen – gefühlte Ungerechtigkeit reicht rechtlich nicht. Die Mediation ermöglichte hier, was kein Gericht zugesprochen hätte: Marie erhielt €75.000 statt €50.000, und die Beziehung zur Schwester blieb erhalten.",
        },
        {
          question: "Wird die Pflege der Eltern beim Erbe berücksichtigt?",
          answer:
            "Ja, § 2057a BGB sieht einen Ausgleich für pflegende Kinder vor – vor Gericht ist er aber schwer zu beziffern. In der Mediation wurde Maries jahrelange Pflegeleistung konkret anerkannt.",
        },
        {
          question: "Was kostet ein Erbstreit vor Gericht im Vergleich zur Mediation?",
          answer:
            "Ein Testament-Prozess kostet schnell €28.000 oder mehr und dauert Jahre. Marie & Sophie zahlten €800 und hatten nach 3 Monaten eine unterschriebene Vereinbarung.",
        },
      ]}
    />
  );
}
