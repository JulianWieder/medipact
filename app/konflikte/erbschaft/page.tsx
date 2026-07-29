import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { erbschaftPageContent } from "@/app/content/erbschaftPage";
import { JsonLd } from "@/app/components/JsonLd";
import erbschaftFamilie from "@/fotos/medi_Erbe.jpg";
import erbschaftTisch from "@/fotos/erbschaft-tisch.jpg";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Erbschaftsstreit lösen: fair einigen ohne Gericht | medipact",
  description:
    "Streit ums Erbe belastet die Familie. Mediation klärt Erbschaftskonflikte strukturiert und fair – bevor Anwalt und Gericht nötig werden. Jetzt starten.",
  path: "/konflikte/erbschaft",
});

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Erbschaftsmediation",
  provider: {
    "@type": "Organization",
    name: "medipact",
    url: "https://medipact.de",
  },
  serviceType: "Mediation bei Erbschaftskonflikten",
  description:
    "Strukturierte Online-Mediation bei Erbstreitigkeiten – Erbengemeinschaften, Pflichtteil, Testament oder geerbte Unternehmen – als strukturierte Alternative zum Gerichtsverfahren.",
  areaServed: {
    "@type": "Country",
    name: "Germany",
  },
  availableLanguage: "German",
  url: "https://medipact.de/konflikte/erbschaft",
};


// Die FAQs werden auf der Seite sichtbar gerendert - hier zusätzlich als
// FAQPage-JSON-LD, damit sie für Rich Results und "Nutzer fragen auch"
// in Frage kommen. Quelle ist dieselbe Liste, kein Duplikat.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: erbschaftPageContent.faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function ErbschaftPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />
      <MarketingPageTemplate
        {...erbschaftPageContent}
        heroImage={{
          src: erbschaftFamilie,
          alt: "Mehrere Generationen einer Familie besprechen den Nachlass am Tisch",
        }}
        trustImage={{
          src: erbschaftTisch,
          alt: "Familie im Gespräch über den Nachlass",
        }}
        breadcrumbs={[
          { label: "Konfliktarten", href: "/konflikte" },
          { label: "Erbschaft" },
        ]}
        relatedCases={[
          { label: "Ratgeber: Erbstreit lösen ohne Gericht", href: "/ratgeber/erbstreit-loesen-ohne-gericht" },
          { label: "Ratgeber: Pflichtteil verhandeln", href: "/ratgeber/pflichtteil-mediation" },
          { label: "Geschwister-Streit ums Haus", href: "/cases/anna-klaus" },
          { label: "Testament-Konflikt", href: "/cases/marie-sophie" },
          { label: "Unternehmen erben", href: "/cases/familie-weber" },
        ]}
      />
    </>
  );
}
