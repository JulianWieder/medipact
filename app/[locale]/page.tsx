import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/app/components/JsonLd";
import { ArrowLink } from "@/app/components/ui/ArrowLink";
import { NumberedSteps, type NumberedStep } from "@/app/components/ui/NumberedSteps";
import { HeroScrollPin } from "@/app/components/HeroScrollPin";
import { ThemenTabs } from "@/app/components/ThemenTabs";
import { EmpfehlungenGrid } from "@/app/components/EmpfehlungenGrid";
import { DidYouKnowSection } from "@/app/components/ui/DidYouKnowSection";
import { ErsteHilfeBox } from "@/app/components/ErsteHilfeBox";
import NewsletterSignup from "@/app/components/NewsletterSignup";
import QuickCheck from "@/app/components/QuickCheck";
import LogbuchSection from "@/app/components/LogbuchSection";
import KampagnenKarussell from "@/app/components/KampagnenKarussell";
import ZweiWelten from "@/app/components/ZweiWelten";
import OutcomeWand from "@/app/components/OutcomeWand";
import type { Metadata } from "next";
import heroPhoto from "../../fotos/medi_main.jpg";
import { pageMetadata } from "@/lib/seo";
import type { AppLocale } from "@/i18n/routing";

// Body copy lives in messages/*.json under "home" (see migration-notes.md
// for the lift-into-translations pattern used here and in HeroScrollPin).

// Das Foto, das die Startseite in der Google-Suche repraesentieren soll.
//
// Warum eine eigene Datei in public/ und nicht der Import aus fotos/: Bilder,
// die ueber `next/image` laufen, bekommen eine gehashte, gebaute URL
// (/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmedi_main.<hash>.jpg&…). Die
// laesst sich in JSON-LD nicht stabil hinschreiben. public/ liefert eine feste
// URL, die Build-Wechsel ueberlebt. Inhaltlich ist es dieselbe Aufnahme wie im
// Hero (fotos/medi_main.jpg, 1600x912) — nur eben unter eigener Adresse.
const HERO_IMAGE = "https://medipact.de/startseite-mediation.jpg";

// Muss `generateMetadata` sein und darf kein statisches Objekt bleiben: Diese
// Seite liegt unter app/[locale]/ und wird fuer JEDE Sprache ausgeliefert.
// Ob sie indexiert werden darf, haengt genau daran (siehe lib/seo.ts) — /en
// zeigt heute deutschen Text und hat im Index nichts verloren.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    title: "Mediation online: Konflikte lösen ohne Gericht | medipact",
    description:
      "Streit bei Trennung, Erbe, Nachbarschaft oder im Unternehmen? Online-Mediation löst Ihren Konflikt fair, vertraulich und ohne Gericht. Jetzt starten.",
    path: "",
    image: HERO_IMAGE,
    imageWidth: 1600,
    imageHeight: 912,
    locale,
  });
}

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Online-Mediation",
  provider: {
    "@type": "Organization",
    name: "medipact",
    url: "https://medipact.de",
  },
  serviceType: "Mediation",
  description:
    "Strukturierte Online-Mediation bei Trennung, Scheidung, Nachbarschaftsstreit, Erbschaft sowie Team- und Organisationskonflikten. Von erfahrenen Mediatoren begleitet, nach dem Harvard-Prinzip.",
  areaServed: {
    "@type": "Country",
    name: "Germany",
  },
  availableLanguage: "German",
  url: "https://medipact.de",
  image: HERO_IMAGE,
  offers: {
    "@type": "Offer",
    priceCurrency: "EUR",
    price: "49",
    description: "Online-Mediation ab €49",
  },
};

// Sagt Google explizit, welches Bild diese Seite repraesentiert.
//
// Ohne diese Angabe sucht Google sich das Vorschaubild selbst aus allen
// Bildern der Seite — und nahm bisher eines der Themen-Kacheln
// (fotos/medi_trennung.jpg), weil das Hero-Foto als ganzflaechiger
// Hintergrund hinter zwei Schwarz-Gradienten liegt und dadurch eher wie
// Dekoration aussieht. `primaryImageOfPage` ist das staerkste Signal, das
// wir dagegen setzen koennen — eine Garantie ist es nicht, die Auswahl
// bleibt Googles Entscheidung.
const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://medipact.de/#webpage",
  url: "https://medipact.de",
  name: "Mediation online: Konflikte lösen ohne Gericht | medipact",
  inLanguage: "de",
  isPartOf: { "@id": "https://medipact.de/#organization" },
  primaryImageOfPage: {
    "@type": "ImageObject",
    "@id": "https://medipact.de/#primaryimage",
    url: HERO_IMAGE,
    contentUrl: HERO_IMAGE,
    width: 1600,
    height: 912,
    caption:
      "Mediationssitzung: zwei Konfliktparteien im Gespräch mit einer Mediatorin",
  },
};

export default async function MedipactLanding() {
  const t = await getTranslations("home");
  const stats = t.raw("stats") as { value: string; label: string }[];
  const bekanntAusTags = t.raw("bekanntAusTags") as string[];
  const processSteps = t.raw("processSteps") as NumberedStep[];

  return (
    <>
      <JsonLd data={webPageSchema} />
      <JsonLd data={serviceSchema} />
      <main className="app-shell pt-0">
        <HeroScrollPin heroPhoto={heroPhoto} />

        <section className="relative z-10 px-6 lg:px-8">
          <div className="relative mx-auto -mt-10 max-w-5xl rounded-[1.75rem] border border-neutral-100 bg-white/95 px-6 py-7 shadow-xl shadow-neutral-900/10 backdrop-blur-sm sm:-mt-14 sm:px-10 sm:py-8 lg:-mt-16">
            <div className="grid grid-cols-2 divide-neutral-100 sm:grid-cols-4 sm:divide-x">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="px-2 py-2 text-center first:pl-0 sm:px-6 sm:first:pl-0 sm:last:pr-0"
                >
                  <div className="bg-gradient-to-br from-neutral-900 to-accent-700 bg-clip-text text-xl font-black text-transparent sm:text-2xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs leading-snug text-neutral-500">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <KampagnenKarussell />

        <ErsteHilfeBox />

        <section className="border-y border-neutral-100 bg-neutral-50 py-5">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-neutral-500 sm:gap-x-10">
              <span className="font-semibold text-neutral-700">
                {t("bekanntAusLabel")}
              </span>
              {bekanntAusTags.map((tag, index) => (
                <span key={tag} className="flex items-center gap-x-6 sm:gap-x-10">
                  {index === 0 && (
                    <span className="font-semibold tracking-tight text-neutral-400">
                      {tag}
                    </span>
                  )}
                  {index > 0 && (
                    <>
                      <span className="text-neutral-300">·</span>
                      <span className="font-semibold tracking-tight text-neutral-400">
                        {tag}
                      </span>
                    </>
                  )}
                </span>
              ))}
            </div>
          </div>
        </section>

        <ZweiWelten />

        <ThemenTabs />

        <EmpfehlungenGrid />

        <QuickCheck />

        <LogbuchSection />

        <section
          id="process"
          className="section section-muted border-y border-neutral-200 text-center scroll-mt-20"
        >
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl">
              <div className="eyebrow mb-4 justify-center">
                {t("processEyebrow")}
              </div>
              <h2 className="heading-2">{t("processTitle")}</h2>
              <p className="mt-5 text-lg leading-8 text-neutral-700">
                {t("processText")}
              </p>
            </div>
            <NumberedSteps steps={processSteps} className="mt-12" />
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-x-10">
              <ArrowLink href="/methode" className="text-base">
                {t("processLink")}
              </ArrowLink>
              {/* Zweiter Ausgang bewusst hierhin: Der Preis-Einwand entsteht
                  direkt nach der Prozessbeschreibung, nicht erst auf /preise. */}
              <ArrowLink href="/einigung" className="text-base">
                {t("processLinkEinigung")}
              </ArrowLink>
            </div>
          </div>
        </section>

        <OutcomeWand />

        {/* Mission-Sektion (Palantir-Stil: Haltung statt Feature) */}
        <section className="section section-accent border-y border-accent-100 text-center">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <div className="eyebrow mb-4 justify-center">
              {t("mission.eyebrow")}
            </div>
            <h2 className="text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl leading-[1.15]">
              {t("mission.statement")}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-700">
              {t("mission.text")}
            </p>
            <ArrowLink href="/about" className="mt-8 text-base">
              {t("mission.link")}
            </ArrowLink>
          </div>
        </section>

        <DidYouKnowSection />

        <NewsletterSignup variant="section" source="landing" />

        <section
          id="cta"
          className="section section-strong border-t border-white/5 text-center"
        >
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-300 mb-8">
              {t("ctaBadge")}
            </div>
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl leading-[1.1]">
              {t("ctaTitle")}
            </h2>
            <p className="mt-6 text-lg text-neutral-300 leading-8">
              {t("ctaText")}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent-600 px-10 py-4 text-base font-bold text-white shadow-lg shadow-accent-900/40 transition hover:scale-[1.02] hover:bg-accent-500"
              >
                {t("ctaButton")}
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </a>
              <ArrowLink href="/preise" tone="light" className="px-4 py-4 text-base">
                {t("ctaSecondaryLabel")}
              </ArrowLink>
            </div>

            <p className="mt-6 text-xs text-neutral-500">{t("ctaDisclaimer")}</p>
          </div>
        </section>
      </main>
    </>
  );
}
