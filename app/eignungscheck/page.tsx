import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/app/components/JsonLd";
import { ArrowLink } from "@/app/components/ui/ArrowLink";
import { pageMetadata } from "@/lib/seo";
import { EignungsCheck } from "./EignungsCheck";
import {
  PAARCHECK_PREIS,
  PAARCHECK_PREIS_EUR,
  PAARCHECK_URL,
  checkAngebote,
  eignungscheckFaqs,
  glaslPhasen,
  type Ampel,
} from "@/app/content/eignungscheck";

// /eignungscheck (03.11.2026): kostenloser Kurz-Check "Ist Mediation das
// Richtige?" als Einstieg in den Paar-Check. Oben das Werkzeug, darunter der
// Erklärteil in Suchsprache ("Eskalationsstufen", "ist Mediation sinnvoll")
// statt Verfahrenssprache. Ziel-Keywords: "Konflikt Eskalationsstufen Test",
// "Glasl Eskalationsstufen", "ist Mediation sinnvoll".
export const metadata: Metadata = pageMetadata({
  title: "Konflikt-Eskalationsstufen-Test: Ist Mediation sinnvoll? | medipact",
  description:
    "Kostenloser Kurz-Check nach den Glasl-Eskalationsstufen: 8 Fragen, Ampel-Ergebnis und ehrliche Einschätzung, ob Mediation sinnvoll ist. Ohne Anmeldung.",
  path: "/eignungscheck",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: eignungscheckFaqs.map((f) => ({
    "@type": "Question",
    name: f.frage,
    acceptedAnswer: { "@type": "Answer", text: f.antwort },
  })),
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://medipact.de/eignungscheck#service",
  name: "Eignungscheck Mediation",
  provider: { "@id": "https://medipact.de/#organization" },
  isRelatedTo: { "@id": "https://medipact.de/#service" },
  serviceType: "Einschätzung der Konflikteskalation",
  areaServed: { "@type": "Country", name: "Germany" },
  availableLanguage: "German",
  url: "https://medipact.de/eignungscheck",
  offers: [
    {
      "@type": "Offer",
      name: "Kurz-Check",
      description: "Eigene Sicht, 8 Fragen, Auswertung im Browser",
      priceCurrency: "EUR",
      price: "0",
    },
    {
      "@type": "Offer",
      name: "Paar-Check",
      description: "Beide Seiten beantworten getrennt, danach Abgleich",
      priceCurrency: "EUR",
      price: PAARCHECK_PREIS_EUR,
    },
  ],
};

const phasenFarbe: Record<Ampel, string> = {
  gruen: "bg-emerald-500",
  gelb: "bg-amber-400",
  rot: "bg-red-500",
};

export default function EignungscheckPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={serviceSchema} />

      {/* CHECK - bewusst ohne Bild-Hero: Das Werkzeug soll auf dem ersten
          Bildschirm beginnen. */}
      <section id="check" className="section section-muted scroll-mt-20 border-b border-neutral-200 pt-12 sm:pt-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="text-center">
            <div className="eyebrow mb-4 justify-center">Kostenloser Kurz-Check</div>
            <h1 className="font-display text-3xl font-semibold leading-[1.15] tracking-tight text-neutral-900 sm:text-5xl">
              Ist Mediation das Richtige?
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-neutral-700">
              8 Fragen in Anlehnung an die Eskalationsstufen nach Friedrich
              Glasl. Am Ende sehen Sie eine Ampel: wie weit Ihr Konflikt
              eskaliert ist und welcher Weg jetzt passt.
            </p>
            <p className="mt-3 text-sm text-neutral-500">
              Ohne Anmeldung · etwa 2 Minuten · Ihre Antworten bleiben in Ihrem
              Browser und werden nicht gespeichert
            </p>
          </div>

          <div className="mt-10">
            <EignungsCheck />
          </div>
        </div>
      </section>

      {/* ERKLAERTEIL: Glasl in eigenen Worten */}
      <section id="eskalationsstufen" className="section section-base">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="eyebrow mb-4">Hintergrund</div>
            <h2 className="heading-2">Die 9 Eskalationsstufen nach Glasl, einfach erklärt</h2>
            <p className="mt-5 text-lg leading-8 text-neutral-700">
              Der österreichische Konfliktforscher Friedrich Glasl hat
              beschrieben, wie Konflikte Schritt für Schritt eskalieren: in
              neun Stufen, die sich zu drei Phasen bündeln. Das Modell hilft
              einzuordnen, wo ein Streit gerade steht – und was dann noch
              möglich ist.
            </p>
          </div>

          <div className="mt-12 space-y-10">
            {glaslPhasen.map((phase) => (
              <div key={phase.titel}>
                <div className="flex items-center gap-3">
                  <span className={`h-3 w-3 rounded-full ${phasenFarbe[phase.ampel]}`} aria-hidden="true" />
                  <h3 className="text-xl font-bold text-neutral-900">{phase.titel}</h3>
                </div>
                <p className="mt-2 max-w-3xl leading-7 text-neutral-600">{phase.text}</p>
                <ol className="mt-5 grid gap-4 sm:grid-cols-3">
                  {phase.stufen.map((s) => (
                    <li key={s.nr} className="rounded-3xl border border-neutral-200 bg-white p-6">
                      <div className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
                        Stufe {s.nr}
                      </div>
                      <div className="mt-2 font-bold text-neutral-900">{s.name}</div>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">{s.text}</p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <div className="rounded-[2rem] border border-accent-200 bg-accent-50/60 p-8">
              <h3 className="text-xl font-bold text-neutral-900">Wann ist Mediation sinnvoll?</h3>
              <p className="mt-3 leading-7 text-neutral-700">
                In den ersten beiden Phasen, also bis Stufe 6. Früh ist eine
                Mediation am einfachsten, weil beide Seiten noch miteinander
                reden. In den Stufen 4 bis 6 braucht sie eine klare Struktur
                und eine neutrale Begleitung, die verhindert, dass alte
                Muster weiterlaufen. Ab Stufe 7 und immer bei Gewalt oder
                Angst fehlt die Grundlage für eine freiwillige Einigung.
              </p>
            </div>
            <div className="rounded-[2rem] border border-neutral-200 bg-white p-8">
              <h3 className="text-xl font-bold text-neutral-900">Eskalation ist kein Automatismus</h3>
              <p className="mt-3 leading-7 text-neutral-700">
                Die Stufen beschreiben, wie Konflikte typischerweise
                verlaufen, nicht, dass sie so verlaufen müssen. Viele Streits
                bleiben auf einer Stufe stehen, und mit Unterstützung lassen
                sie sich auch wieder zurückführen. Wer früh ansetzt, hat mehr
                Möglichkeiten.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <ArrowLink href="/ratgeber/konfliktarten">
              Konfliktarten und Eskalationsstufen im Ratgeber
            </ArrowLink>
          </div>
        </div>
      </section>

      {/* ANGEBOTE */}
      <section id="angebote" className="section section-muted border-y border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <div className="eyebrow mb-4">Drei Wege zur Einschätzung</div>
            <h2 className="heading-2">Eigene Sicht, beide Sichten oder gleich mit Starterpaket</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {checkAngebote.map((a) => (
              <div
                key={a.name}
                className={
                  a.hervorgehoben
                    ? "rounded-[2rem] border-2 border-accent-600 bg-white p-8"
                    : "rounded-[2rem] border border-neutral-200 bg-white p-8"
                }
              >
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">{a.fuer}</div>
                <h3 className="mt-3 text-2xl font-black text-neutral-900">{a.name}</h3>
                <div className="mt-2 text-lg font-bold text-accent-600">{a.preis}</div>
                <ul className="mt-5 space-y-2.5 border-t border-neutral-200 pt-5">
                  {a.punkte.map((p) => (
                    <li key={p} className="flex gap-2.5 text-sm text-neutral-700">
                      <span className="font-bold text-accent-600">✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link href="#check" className="btn btn-primary justify-center">
              Kurz-Check starten
            </Link>
            <Link
              href={PAARCHECK_URL}
              className="inline-flex justify-center rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-800 transition hover:border-accent-400 hover:text-accent-700"
            >
              Paar-Check für {PAARCHECK_PREIS}
            </Link>
            <ArrowLink href="/preise" tone="muted">
              Alle Preise
            </ArrowLink>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section section-base">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="eyebrow mb-4 justify-center">FAQ</div>
            <h2 className="heading-2">Häufige Fragen zum Eignungscheck</h2>
          </div>
          <div className="space-y-3">
            {eignungscheckFaqs.map((f) => (
              <div key={f.frage} className="app-surface p-6 sm:p-8">
                <h3 className="font-semibold text-neutral-900">{f.frage}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">{f.antwort}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-xs text-neutral-500">
            Der Check ist eine Orientierung, keine Diagnose, und ersetzt keine
            Beratung. Das Stufenmodell geht auf Friedrich Glasl zurück; Fragen
            und Auswertung sind eine vereinfachte Anlehnung von medipact.
          </p>
        </div>
      </section>
    </>
  );
}
