import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/app/components/JsonLd";
import { HeroScrollPin } from "@/app/components/HeroScrollPin";
import { ThemenTabs } from "@/app/components/ThemenTabs";
import { DidYouKnowSection } from "@/app/components/ui/DidYouKnowSection";
import type { Metadata } from "next";
import heroPhoto from "../../fotos/hero-mediation.png";

// NOTE: this page's body copy (stats, headings, CTA text below) is still
// hardcoded German — only the routing/provider plumbing was migrated in
// this pass. See migration-notes.md for how to lift these into
// messages/*.json the same way Header/Footer/CookieConsent were done.

export const metadata: Metadata = {
  title:
    "medipact – Mediation online: Konflikte fair, vertraulich und ohne Gericht lösen",
  description:
    "Mediation online – Konflikte fair, vertraulich und ohne Gericht lösen. Medipact hilft bei Trennung, Nachbarschaftsstreit und Erbschaft nach dem Harvard-Prinzip.",
  alternates: {
    canonical: "https://medipact.de",
  },
};

const stats = [
  { value: "6 Schritte", label: "strukturierter Prozess" },
  { value: "< 4 Wochen", label: "typische Dauer" },
  { value: "ab €499", label: "statt tausenden an Anwaltskosten" },
  { value: "100 %", label: "vertraulich & DSGVO-konform" },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "KI-Mediation",
  provider: {
    "@type": "Organization",
    name: "medipact",
    url: "https://medipact.de",
  },
  serviceType: "Mediation",
  description:
    "KI-gestützte Mediation für private Konflikte bei Trennung, Scheidung, Nachbarschaftsstreit und Erbschaft. Nach dem Harvard-Prinzip.",
  areaServed: {
    "@type": "Country",
    name: "Germany",
  },
  availableLanguage: "German",
  url: "https://medipact.de",
  offers: {
    "@type": "Offer",
    priceCurrency: "EUR",
    price: "499",
    description: "KI-Mediation ab €499",
  },
};

export default function MedipactLanding() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <main className="app-shell pt-0 sm:pt-[73px]">
        <HeroScrollPin heroPhoto={heroPhoto} />

        <section className="border-b border-neutral-100 bg-white py-10">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-black text-accent-700">
                    {s.value}
                  </div>
                  <div className="mt-0.5 text-xs leading-snug text-neutral-500">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-neutral-100 bg-neutral-50 py-5">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-neutral-500 sm:gap-x-10">
              <span className="font-semibold text-neutral-700">Bekannt aus</span>
              <span className="font-semibold tracking-tight text-neutral-400">
                Harvard-Methode
              </span>
              <span className="text-neutral-300">·</span>
              <span className="font-semibold tracking-tight text-neutral-400">
                DSGVO-konform
              </span>
              <span className="text-neutral-300">·</span>
              <span className="font-semibold tracking-tight text-neutral-400">
                Made in Germany
              </span>
              <span className="text-neutral-300">·</span>
              <span className="font-semibold tracking-tight text-neutral-400">
                SSL-verschlüsselt
              </span>
            </div>
          </div>
        </section>

        <ThemenTabs />

        <section className="section section-base">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <p className="text-base text-neutral-600">
              Trennung, Nachbarschaft oder Erbe – sehen Sie sich an,{" "}
              <Link
                href="/cases"
                className="font-semibold text-accent-700 hover:underline"
              >
                wie konkrete Fälle mit Medipact gelöst wurden →
              </Link>
            </p>
          </div>
        </section>

        <section className="section section-muted border-y border-neutral-200 text-center">
          <div className="mx-auto max-w-2xl px-6 lg:px-8">
            <div className="eyebrow mb-4 justify-center">So funktioniert es</div>
            <h2 className="heading-2">
              In 6 klaren Schritten zur möglichen Einigung.
            </h2>
            <p className="mt-5 text-lg leading-8 text-neutral-700">
              Geführt statt allein gelassen, nach dem Harvard-Prinzip – fair
              für alle Seiten.
            </p>
            <Link
              href="/methode"
              className="mt-8 inline-flex font-semibold text-accent-700 hover:underline"
            >
              So funktioniert medipact →
            </Link>
          </div>
        </section>

        <section className="section section-accent border-y border-accent-100 text-center">
          <div className="mx-auto max-w-2xl px-6 lg:px-8">
            <p className="text-base text-neutral-700">
              Vertraulich, DSGVO-konform und mit menschlicher Mediation als
              Rückfalloption –{" "}
              <Link
                href="/about"
                className="font-semibold text-accent-700 hover:underline"
              >
                mehr über medipact erfahren →
              </Link>
            </p>
          </div>
        </section>

        <DidYouKnowSection />

        <section
          id="cta"
          className="section section-strong border-t border-white/5 text-center"
        >
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-300 mb-8">
              Jetzt starten
            </div>
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl leading-[1.1]">
              Der Streit muss nicht größer werden.
            </h2>
            <p className="mt-6 text-lg text-neutral-300 leading-8">
              Starten Sie ruhig, vertraulich und unverbindlich. Der erste
              Schritt ist nicht die Einigung – sondern wieder Klarheit.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent-600 px-10 py-4 text-base font-bold text-white shadow-lg shadow-accent-900/40 transition hover:scale-[1.02] hover:bg-accent-500"
              >
                Kostenlosen Account erstellen
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
            </div>

            <p className="mt-6 text-xs text-neutral-500">
              Keine Kreditkarte erforderlich · Kostenloser Einstieg · Jederzeit
              kündbar
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
