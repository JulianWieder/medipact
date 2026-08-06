import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { einigungPageContent } from "@/app/content/einigungPage";
import { JsonLd } from "@/app/components/JsonLd";
import prozessPhoto from "@/fotos/medi_modern.jpg";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Warum Mediation bei uns Festpreis hat | medipact",
  description:
    "Nicht der Termin ist digitalisiert, sondern der Einigungsprozess standardisiert. Was das System übernimmt – und warum daran der Preis hängt.",
  path: "/einigung",
});

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Standardisierter Einigungsprozess",
  provider: {
    "@type": "Organization",
    name: "medipact",
    url: "https://medipact.de",
  },
  serviceType: "Online-Mediation",
  description:
    "Geführter Einigungsprozess: Themen ordnen, Formulierungen versachlichen, Interessen aus Forderungen lösen, strittige Punkte gewichtet abgleichen und die Vereinbarung erzeugen – zum Festpreis statt zum Stundensatz.",
  areaServed: {
    "@type": "Country",
    name: "Germany",
  },
  availableLanguage: "German",
  url: "https://medipact.de/einigung",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: einigungPageContent.faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function EinigungPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />
      <MarketingPageTemplate
        {...einigungPageContent}
        heroImage={{
          src: prozessPhoto,
          alt: "Zwei Menschen arbeiten an einer gemeinsamen Lösung",
        }}
        breadcrumbs={[{ label: "Einigungsprozess" }]}
        relatedCases={[
          { label: "Nachbarschaft: Streit um den Zaun", href: "/cases/nachbarschaft-zaun" },
          { label: "Erbstreit ums Haus", href: "/cases/erbstreit-haus-geschwister" },
          { label: "Gesellschafter-Streit", href: "/cases/gesellschafter-streit" },
        ]}
      />
    </>
  );
}
