import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/app/components/JsonLd";
import { Breadcrumbs } from "@/app/components/ui/Breadcrumbs";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import {
  KONFLIKTARTEN,
  KOSTENRECHT_STAND,
  type Konfliktart,
} from "@/lib/kostenrecht";
import { ladePreisOverlay } from "@/lib/pricing-matrix";
import KostenrechnerClient from "./KostenrechnerClient";
import { ImagePinHero } from "@/app/components/ui/ImagePinHero";
import kostenrechnerPhoto from "@/fotos/prozess_kostenrechner.jpg";

// ── /kostenrechner ──────────────────────────────────────────────────────────
//
// Positionierung: bewusst NICHT "noch ein Prozesskostenrechner". Auf den
// Head-Terms ("Prozesskostenrechner", "Scheidungskostenrechner") sitzen
// Domains wie FORIS und smart-rechner, dagegen ist kurzfristig nichts zu
// holen. Was keiner dieser Rechner tut: der Gerichtsseite eine Alternative
// gegenüberstellen — sie enden alle in "Anwalt beauftragen" oder
// "Prozessfinanzierung anfragen". Die zweite Spalte ist frei, und genau
// darauf zielen Titel, H1 und die Longtail-Keywords ab.
//
// Zweck ist Verlinkung, nicht Conversion: Die nachvollziehbare Herleitung mit
// Fundstelle je Position ist der eigentliche Linkbait.

export const metadata: Metadata = pageMetadata({
  title: "Prozesskosten-Rechner: Gericht oder Mediation? | medipact",
  description:
    "Was kostet Ihr Streit vor Gericht — und was ohne? Kostenrisiko nach GKG/RVG berechnen, inklusive Stundenhonorar-Vergleich. Kostenlos, ohne Anmeldung.",
  path: "/kostenrechner",
});

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Prozesskosten-Rechner: Gericht oder Mediation",
  url: `${SITE_URL}/kostenrechner`,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  inLanguage: "de-DE",
  description:
    "Berechnet das Kostenrisiko eines Gerichtsverfahrens nach den gesetzlichen Gebührentabellen (GKG, FamGKG, RVG) und stellt ihm die Kosten einer Mediation gegenüber.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  publisher: { "@type": "Organization", name: "medipact", url: SITE_URL },
};

const FAQ = [
  {
    question: "Wie werden Gerichtskosten berechnet?",
    answer:
      "Gerichtskosten hängen allein vom Streitwert ab. Zu jedem Streitwert gehört eine 1,0-Gebühr aus Anlage 2 GKG; in erster Instanz fällt davon das Dreifache an, in der Berufung das Vierfache. Bei einer Scheidung sind es 2,0 Gebühren nach KV 1110 FamGKG.",
  },
  {
    question: "Was kostet ein Anwalt vor Gericht?",
    answer:
      "Gesetzlich fallen eine 1,3-Verfahrensgebühr und eine 1,2-Terminsgebühr aus der Tabelle in Anlage 2 RVG an, dazu 20 Euro Auslagenpauschale und 19 Prozent Umsatzsteuer. Das ist allerdings nur die Untergrenze: Viele Kanzleien rechnen stattdessen nach Stunden ab.",
  },
  {
    question: "Ist ein Stundensatz von 350 Euro normal?",
    answer:
      "Ja. Im Familienrecht sind Zeithonorare der Regelfall, übliche Sätze bei Fachanwälten liegen zwischen 250 und 400 Euro netto pro Stunde. Die Rechtsprechung hält Sätze bis 350 bis 400 Euro seit Jahren für unbedenklich, spezialisierte Kanzleien nennen 380 Euro aufwärts.",
  },
  {
    question:
      "Bekomme ich das Stundenhonorar erstattet, wenn ich den Prozess gewinne?",
    answer:
      "Nein. Die unterlegene Partei muss nur die gesetzlichen Gebühren ersetzen (§ 91 Absatz 2 Satz 1 ZPO). Alles, was Ihr Anwalt darüber hinaus in Rechnung stellt, bleibt bei Ihnen. Bei einer Scheidung wird ohnehin nichts erstattet: Die Kosten werden gegeneinander aufgehoben (§ 150 Absatz 1 FamFG).",
  },
  {
    question: "Spart Mediation die Scheidungskosten komplett?",
    answer:
      "Nein, und wer das behauptet, rechnet falsch. Eine Ehe wird in Deutschland nur durch gerichtlichen Beschluss geschieden, und für den Antrag ist mindestens ein Anwalt zwingend vorgeschrieben (§ 114 FamFG). Mediation macht aus einer streitigen eine einvernehmliche Scheidung — die Gerichtskosten und ein Anwalt bleiben.",
  },
  {
    question: "Was passiert, wenn die Mediation scheitert?",
    answer:
      "Dann fallen die Mediationskosten zusätzlich zum Gerichtsverfahren an. Der Rechner weist dieses Szenario deshalb ausdrücklich aus. Was in der Mediation bereits geklärt wurde, verkleinert allerdings den Streitgegenstand und damit den Streitwert vor Gericht.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

/**
 * ?art= belegt die Konfliktart vor. Gesetzt wird der Parameter von den
 * Konfliktarten-Seiten (KostenrechnerHinweis) – ein unbekannter oder
 * fehlender Wert fällt still auf die Voreinstellung zurück, damit sich über
 * die URL keine kaputten Zustände erzeugen lassen.
 *
 * Kein Einfluss auf Indexierung: pageMetadata setzt das Canonical fest auf
 * /kostenrechner, die Parameter-Varianten kanonisieren also auf die
 * Hauptseite und verwässern sie nicht.
 */
function artParsen(wert?: string | string[]): Konfliktart | undefined {
  const eins = Array.isArray(wert) ? wert[0] : wert;
  return KONFLIKTARTEN.some((k) => k.key === eins)
    ? (eins as Konfliktart)
    : undefined;
}

export default async function Kostenrechner({
  searchParams,
}: {
  searchParams: Promise<{ art?: string | string[] }>;
}) {
  // Preise kommen aus backend/app/pricing.py (GET /pricing/matrix). Ist das
  // Backend nicht erreichbar, bleibt es bei den Fallback-Werten aus
  // lib/kostenrecht.ts – siehe lib/pricing-matrix.ts.
  const preise = await ladePreisOverlay();
  const start = artParsen((await searchParams).art);

  return (
    <>
      <JsonLd data={appSchema} />
      <JsonLd data={faqSchema} />

      <main className="app-shell pt-[73px]">
        <ImagePinHero
          image={kostenrechnerPhoto}
          imageAlt="Gerichtskosten und Mediationskosten im Vergleich"
        >
          <div className="mx-auto w-full max-w-5xl px-6 lg:px-8">
            <Breadcrumbs
              variant="dark"
              items={[{ label: "Prozesskosten-Rechner" }]}
            />
            <p className="eyebrow mb-4 mt-6 text-accent-300">
              Prozesskosten-Rechner
            </p>

            <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
              Was kostet der Streit?{" "}
              <span className="text-accent-300">Vor Gericht — und ohne.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-200">
              Gerichts- und Anwaltskosten richten sich nach festen gesetzlichen
              Tabellen. Der Rechner wendet sie an, zeigt jede Position mit
              Fundstelle und stellt daneben, was dieselbe Sache in einer
              Mediation kostet. Kostenlos, ohne Anmeldung, Stand{" "}
              {KOSTENRECHT_STAND}.
            </p>
          </div>
        </ImagePinHero>

        <section className="section-base pt-10">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <KostenrechnerClient preise={preise} start={start} />
          </div>
        </section>

        {/* ── KONTEXT ─────────────────────────────────────────────────── */}
        <section className="section-base pb-20 pt-16">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <h2 className="font-display text-2xl font-medium text-neutral-900">
              Warum die Gerichtszahl ein Risiko ist und kein Preis
            </h2>
            <p className="mt-4 leading-7 text-neutral-700">
              Ein Gerichtsverfahren hat keinen Preis, den man vorher kennt. Es
              hat ein Risiko. Wer gewinnt, bekommt seine Kosten von der
              Gegenseite erstattet (§ 91 ZPO); wer verliert, zahlt beide
              Seiten und das Gericht. Der Betrag im Rechner ist deshalb das,
              was auf Sie zukommt, wenn es vollständig gegen Sie ausgeht — und
              niemand, auch kein Anwalt, kann Ihnen vorher sagen, wie
              wahrscheinlich das ist.
            </p>
            <p className="mt-4 leading-7 text-neutral-700">
              Dazu kommt, was in keiner Tabelle steht: Ein Zivilverfahren
              dauert in erster Instanz häufig ein bis zwei Jahre, bei Berufung
              deutlich länger. In dieser Zeit bleibt der Konflikt offen — und
              bei Nachbarn, Geschwistern oder getrennten Eltern ist genau das
              der eigentliche Schaden.
            </p>

            <h2 className="mt-12 font-display text-2xl font-medium text-neutral-900">
              Der Streitwert ist die einzige Stellschraube
            </h2>
            <p className="mt-4 leading-7 text-neutral-700">
              Beide Tabellen — die für das Gericht wie die für den Anwalt —
              hängen ausschließlich vom Streitwert ab, nicht vom Aufwand. Ein
              einfacher Fall mit hohem Streitwert kostet mehr als ein
              komplizierter mit niedrigem. Deshalb lohnt es sich, vor jeder
              Klage zu prüfen, worüber tatsächlich gestritten wird: Was in
              einer Mediation vorab geklärt wird, taucht im Streitwert nicht
              mehr auf.
            </p>

            <h2 className="mt-12 font-display text-2xl font-medium text-neutral-900">
              Häufige Fragen
            </h2>
            <dl className="mt-6 space-y-6">
              {FAQ.map((f) => (
                <div key={f.question}>
                  <dt className="font-semibold text-neutral-900">
                    {f.question}
                  </dt>
                  <dd className="mt-2 leading-7 text-neutral-700">
                    {f.answer}
                  </dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-12 font-display text-2xl font-medium text-neutral-900">
              Weiterlesen
            </h2>
            <ul className="mt-4 space-y-2 text-accent-700">
              <li>
                <Link href="/ratgeber/gericht-oder-mediation" className="underline">
                  Gericht oder Mediation — was passt zu Ihrem Fall?
                </Link>
              </li>
              <li>
                <Link href="/ratgeber/mediation-kosten" className="underline">
                  Was kostet eine Mediation?
                </Link>
              </li>
              <li>
                <Link href="/ratgeber/scheidung-mediator-kosten" className="underline">
                  Scheidung mit Mediator: Kosten im Detail
                </Link>
              </li>
              <li>
                <Link href="/preise" className="underline">
                  Preise bei medipact
                </Link>
              </li>
            </ul>

            <p className="mt-10 text-xs leading-6 text-neutral-500">
              Rechtsgrundlagen: Anlage 2 und § 34 Gerichtskostengesetz, § 28
              Gesetz über Gerichtskosten in Familiensachen, Anlage 2 und § 13
              Rechtsanwaltsvergütungsgesetz, Vergütungsverzeichnis Nrn. 3100,
              3104, 7002 und 7008 RVG — alle in der seit dem{" "}
              {KOSTENRECHT_STAND} geltenden Fassung (Kosten- und
              Betreuervergütungsrechtsänderungsgesetz 2025, BGBl. I Nr. 109).
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
