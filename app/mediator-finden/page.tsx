import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { mediatorFindenPageContent } from "@/app/content/mediatorFindenPage";
import { JsonLd } from "@/app/components/JsonLd";
import gespraechPhoto from "@/fotos/medi_gespraech.jpg";
import einordnenPhoto from "@/fotos/medi_einordnen.jpg";
import { pageMetadata } from "@/lib/seo";
import { ladeMediatoren } from "@/lib/mediatoren";
import {
  KENNENLERN_ANZAHL,
  KENNENLERN_MINUTEN,
  STARTPAKET_NAME,
  STARTPAKET_PREIS_EUR,
} from "@/lib/mediatorVermittlung";
import { MediatorenVerzeichnis } from "./MediatorenVerzeichnis";

// Zusatzbaustein neben dem Online-Verfahren (siehe Kopf von
// mediatorFindenPage.ts). Zielphrase ist „Mediator finden": Wer so sucht,
// will eine Person, kein Verfahren — die Konflikt-Seiten zielen auf die
// Konfliktart und greifen deshalb nicht in dieselbe Suche.
// Title ≤60, Description ≤155 Zeichen — wie auf allen Seiten.
export const metadata: Metadata = pageMetadata({
  title: "Mediator finden: persönliche Mediation vermittelt | medipact",
  description:
    "Geprüfte Mediator:innen für Trennung, Erbe, Nachbarschaft und Team. Vormerken, Fall digital vorbereiten, bis zu 3 kennenlernen. 189 € pro Fall.",
  path: "/mediator-finden",
});

// Offer = das Starterpaket; Preis aus lib/mediatorVermittlung.ts, dieselbe
// Zahl wie auf /preise.
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://medipact.de/mediator-finden#service",
  name: "Vermittlung persönlicher Mediation",
  provider: { "@id": "https://medipact.de/#organization" },
  isRelatedTo: { "@id": "https://medipact.de/#service" },
  serviceType: "Vermittlung von Mediatorinnen und Mediatoren",
  description:
    "medipact vermittelt eine passende Mediatorin oder einen Mediator für eine klassische Mediation vor Ort oder per Video — bei Trennung, Erbschaft, Nachbarschafts- und Teamkonflikten.",
  areaServed: { "@type": "Country", name: "Germany" },
  availableLanguage: "German",
  url: "https://medipact.de/mediator-finden",
  offers: {
    "@type": "Offer",
    name: STARTPAKET_NAME,
    priceCurrency: "EUR",
    price: STARTPAKET_PREIS_EUR,
    description: `Fall digital vorbereiten, bis zu ${KENNENLERN_ANZAHL} Kennenlerngespräche à ${KENNENLERN_MINUTEN} Minuten, Übergabe an die gewählte Mediatorin – einmal pro Fall`,
    url: "https://medipact.de/preise#starterpaket",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: mediatorFindenPageContent.faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default async function MediatorFindenPage() {
  // Aus kerno, alle fünf Minuten frisch (lib/mediatoren.ts). Leer, solange
  // noch niemand freigegeben ist – die Seite zeigt dann den Weg über die Anfrage.
  const mediatoren = await ladeMediatoren();
  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />
      <MarketingPageTemplate
        {...mediatorFindenPageContent}
        heroImage={{
          src: gespraechPhoto,
          alt: "Zwei Beteiligte im Gespräch mit einer Mediatorin am Tisch",
        }}
        trustImage={{
          src: einordnenPhoto,
          alt: "Unterlagen werden gemeinsam durchgesehen und eingeordnet",
        }}
        breadcrumbs={[{ label: "Mediator finden" }]}
        afterHero={<MediatorenVerzeichnis mediatoren={mediatoren} />}
        showLogbuchHinweis={false}
        relatedCases={[
          { label: "Scheidungsmediation", href: "/scheidungsmediation" },
          { label: "Erbschaft", href: "/konflikte/erbschaft" },
          { label: "Nachbarschaft", href: "/konflikte/nachbarschaft" },
          { label: "Team & Organisation", href: "/konflikte/odr" },
          { label: "Das Online-Verfahren", href: "/methode" },
        ]}
      />
    </>
  );
}
