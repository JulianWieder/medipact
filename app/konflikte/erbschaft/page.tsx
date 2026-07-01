import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { erbschaftPageContent } from "@/app/content/erbschaftPage";
import { JsonLd } from "@/app/components/JsonLd";
import erbschaftFamilie from "@/fotos/medi_Erbe.jpg";
import erbschaftTisch from "@/fotos/erbschaft-tisch.jpg";

export const metadata: Metadata = {
  title: "Erbschaftsstreit lösen – faire Einigung ohne Gericht | medipact",
  description:
    "Trauer, Erwartungen und Familiengeschichte treffen aufeinander. Medipact hilft, Erbschaftskonflikte strukturiert zu klären – bevor Anwalt und Gericht notwendig werden.",
  alternates: { canonical: "https://medipact.de/konflikte/erbschaft" },
};

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
    "KI-gestützte Mediation bei Erbstreitigkeiten – Erbengemeinschaften, Pflichtteil, Testament oder geerbte Unternehmen – als strukturierte Alternative zum Gerichtsverfahren.",
  areaServed: {
    "@type": "Country",
    name: "Germany",
  },
  availableLanguage: "German",
  url: "https://medipact.de/konflikte/erbschaft",
};

export default function ErbschaftPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
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
          { label: "Geschwister-Streit ums Haus", href: "/cases/anna-klaus" },
          { label: "Testament-Konflikt", href: "/cases/marie-sophie" },
          { label: "Unternehmen erben", href: "/cases/familie-weber" },
        ]}
      />
    </>
  );
}
