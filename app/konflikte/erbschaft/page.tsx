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

// Eigene @id je Konfliktart (nicht #service: das ist die Dachleistung auf
// Startseite, /konflikte und /preise – sechs verschiedene Leistungen unter
// einer @id wuerde Google zu einer Entitaet mit widerspruechlichen Namen
// verschmelzen). Verknuepft ueber isRelatedTo. Preis aus backend/app/pricing.py –
// bei Preisaenderung hier mitziehen.
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://medipact.de/konflikte/erbschaft#service",
  name: "Erbschaftsmediation",
  provider: { "@id": "https://medipact.de/#organization" },
  isRelatedTo: { "@id": "https://medipact.de/#service" },
  serviceType: "Mediation bei Erbschaftskonflikten",
  description:
    "Strukturierte Online-Mediation bei Erbstreitigkeiten – Erbengemeinschaften, Pflichtteil, Testament oder geerbte Unternehmen – als strukturierte Alternative zum Gerichtsverfahren.",
  areaServed: {
    "@type": "Country",
    name: "Germany",
  },
  availableLanguage: "German",
  url: "https://medipact.de/konflikte/erbschaft",
  offers: {
    "@type": "Offer",
    priceCurrency: "EUR",
    price: "399",
    description: "Festpreis pro Verfahren",
    url: "https://medipact.de/preise",
    availability: "https://schema.org/InStock",
  },
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
          { label: "Konflikte", href: "/konflikte" },
          { label: "Erbschaft" },
        ]}
        kostenrechnerArt="erbschaft"
        mediatorHinweis
        relatedCases={[
          { label: "Ratgeber: Geschwister streiten ums Erbe", href: "/ratgeber/geschwister-streiten-ums-erbe" },
          { label: "Ratgeber: Erbengemeinschaft blockiert", href: "/ratgeber/erbengemeinschaft-blockade" },
          { label: "Ratgeber: Erbstreit lösen ohne Gericht", href: "/ratgeber/erbstreit-loesen-ohne-gericht" },
          { label: "Ratgeber: Pflichtteil verhandeln", href: "/ratgeber/pflichtteil-einfordern" },
          { label: "Geschwister-Streit ums Haus", href: "/cases/erbstreit-haus-geschwister" },
          { label: "Testament-Konflikt", href: "/cases/streit-ums-testament" },
          { label: "Unternehmen erben", href: "/cases/unternehmen-geerbt" },
        ]}
      />
    </>
  );
}
