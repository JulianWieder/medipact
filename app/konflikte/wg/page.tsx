import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { wgPageContent } from "@/app/content/wgPage";
import { JsonLd } from "@/app/components/JsonLd";
import wgPhoto from "@/fotos/medi_modern.jpg";

export const metadata: Metadata = {
  title: "WG-Konflikt lösen: Putzen, Kosten, Lärm | medipact",
  description:
    "Streit in der WG um Putzplan, Nebenkosten, Lärm oder Gäste? Online-Mediation ab 20 € pro Person hilft, faire Regeln zu finden. Jetzt klären.",
  alternates: { canonical: "https://medipact.de/konflikte/wg" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "WG-Mediation",
  provider: {
    "@type": "Organization",
    name: "medipact",
    url: "https://medipact.de",
  },
  serviceType: "Mediation bei WG- und Mitbewohner-Konflikten",
  description:
    "Strukturierte Online-Mediation bei WG-Konflikten – Putzplan, Kosten, Lärm, Gäste oder Auszug – niedrigschwellig ab 20 € pro Person.",
  areaServed: {
    "@type": "Country",
    name: "Germany",
  },
  availableLanguage: "German",
  url: "https://medipact.de/konflikte/wg",
};

export default function WgPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <MarketingPageTemplate
        {...wgPageContent}
        heroImage={{
          src: wgPhoto,
          alt: "Mitbewohner im Gespräch über einen WG-Konflikt",
        }}
        breadcrumbs={[
          { label: "Konfliktarten", href: "/konflikte" },
          { label: "WG & Mitbewohner" },
        ]}
        relatedCases={[
          { label: "Lärm bei Nacht", href: "/cases/nachbarschaft-laerm" },
          { label: "Zaun auf der Grenze", href: "/cases/nachbarschaft-zaun" },
          { label: "Parkplatz blockiert", href: "/cases/nachbarschaft-parken" },
        ]}
      />
    </>
  );
}
