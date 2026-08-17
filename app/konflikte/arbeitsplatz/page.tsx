import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { arbeitsplatzPageContent } from "@/app/content/arbeitsplatzPage";
import { JsonLd } from "@/app/components/JsonLd";
import arbeitsplatzPhoto from "@/fotos/medi_karriere.jpg";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Konflikt am Arbeitsplatz lösen – ohne Gericht | medipact",
  description:
    "Spannungen im Team, mit der Führungskraft oder rund um eine Trennung: Mediation klärt den Konflikt, bevor Kündigung und Arbeitsgericht die einzigen Wege sind.",
  path: "/konflikte/arbeitsplatz",
});

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Mediation am Arbeitsplatz",
  provider: {
    "@type": "Organization",
    name: "medipact",
    url: "https://medipact.de",
  },
  serviceType: "Mediation bei Konflikten im Arbeitsverhältnis",
  description:
    "Strukturierte Online-Mediation bei Konflikten am Arbeitsplatz – Führung, Team, Rollen, Rückkehr nach Abwesenheit und einvernehmliche Beendigung – als Klärung vor Kündigung und Arbeitsgericht.",
  areaServed: {
    "@type": "Country",
    name: "Germany",
  },
  availableLanguage: "German",
  url: "https://medipact.de/konflikte/arbeitsplatz",
};

// Die FAQs werden auf der Seite sichtbar gerendert - hier zusätzlich als
// FAQPage-JSON-LD, damit sie für Rich Results und "Nutzer fragen auch"
// in Frage kommen. Quelle ist dieselbe Liste, kein Duplikat.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: arbeitsplatzPageContent.faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function ArbeitsplatzPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />
      <MarketingPageTemplate
        {...arbeitsplatzPageContent}
        heroImage={{
          src: arbeitsplatzPhoto,
          alt: "Zwei Personen im klärenden Gespräch am Arbeitsplatz",
        }}
        breadcrumbs={[
          { label: "Konfliktarten", href: "/konflikte" },
          { label: "Arbeitsplatz" },
        ]}
        kostenrechnerArt="arbeitsplatz"
        relatedCases={[
          { label: "Ratgeber: Mediation am Arbeitsplatz", href: "/ratgeber/mediation-am-arbeitsplatz" },
          { label: "Ratgeber: Kündigung – wie es ohne Gericht weitergeht", href: "/ratgeber/kuendigung-ohne-gericht" },
          { label: "Ratgeber: Mediation im Unternehmen", href: "/ratgeber/mediation-im-unternehmen" },
          { label: "Ratgeber: Gericht oder Mediation?", href: "/ratgeber/gericht-oder-mediation" },
          { label: "Ratgeber: Schwelender Konflikt", href: "/ratgeber/schwelender-konflikt" },
          { label: "Business & ODR", href: "/konflikte/odr" },
        ]}
      />
    </>
  );
}
