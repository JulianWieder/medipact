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
    "Was kostet Ihr Streit vor Gericht — und was ohne? Gerichts-, Anwalts- und Gutachterkosten berechnen, auch für Sorgerecht und Umgang. Ohne Anmeldung.",
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
    "Berechnet das Kostenrisiko eines Gerichtsverfahrens nach den gesetzlichen Gebührentabellen (GKG, FamGKG, RVG, JVEG) — einschließlich Sorge- und Umgangsverfahren mit Gutachten und Verfahrensbeistand — und stellt ihm die Kosten einer Mediation gegenüber.",
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
    question: "Was kostet ein Mediator pro Stunde?",
    answer:
      "Frei tätige Mediatorinnen und Mediatoren rechnen nach Stunden ab. Die Sätze reichen von rund 80 bis 500 Euro, der übliche Bereich liegt zwischen 150 und 300 Euro pro Stunde; in der Familienmediation sind Werte um 160 Euro verbreitet. Abgerechnet wird meist je Sitzung, und die Zahl der Sitzungen steht vorher nicht fest — das ist der entscheidende Unterschied zu einem Festpreis.",
  },
  {
    question: "Was kostet eine Mediation insgesamt?",
    answer:
      "Bei stundenweiser Abrechnung sind für eine Familienmediation üblicherweise drei bis acht Sitzungen anzusetzen; die Gesamtkosten liegen dann grob zwischen 800 und 3.000 Euro pro Partei, je nach Stundensatz und Zahl der Termine. Das ist deutlich weniger als ein streitiges Verfahren, aber ein offener Betrag: Wie viele Sitzungen es werden, entscheidet sich erst im Verlauf.",
  },
  {
    question: "Was kostet ein Sorgerechts- oder Umgangsverfahren?",
    answer:
      "Der Verfahrenswert steht fest: 5.000 Euro je Gegenstand (§ 45 Absatz 1 FamGKG). Daraus ergeben sich bei Sorge und Umgang zusammen rund 2.100 Euro an Gerichts- und Anwaltsgebühren für beide Seiten. Diese Zahl ist allerdings irreführend, weil die größten Posten nicht am Verfahrenswert hängen: ein familienpsychologisches Gutachten kostet je nach Umfang 4.000 bis 15.000 Euro, der Verfahrensbeistand 690 Euro je Rechtszug. In hoch strittigen Verfahren mit Eilantrag, Beschwerde und späterer Abänderung liegt der Betrag pro Elternteil regelmäßig im fünfstelligen Bereich.",
  },
  {
    question:
      "Erhöht sich der Wert, wenn ich Sorgerecht und Aufenthaltsbestimmungsrecht beantrage?",
    answer:
      "Nein. Das Gesetz behandelt die elterliche Sorge und jeden Teil davon — also auch das Aufenthaltsbestimmungsrecht — als einen einzigen Gegenstand (§ 45 Absatz 1 Nummer 1 FamGKG). Das Umgangsrecht ist dagegen ein eigener Gegenstand, sein Wert kommt hinzu. Und die Zahl der betroffenen Kinder ändert am Verfahrenswert gar nichts (§ 45 Absatz 2 FamGKG).",
  },
  {
    question: "Wer zahlt das Gutachten im Sorgerechtsverfahren?",
    answer:
      "Zunächst die Staatskasse, die es anschließend als gerichtliche Auslage in Rechnung stellt. Wie die Kosten verteilt werden, entscheidet das Gericht nach billigem Ermessen (§ 81 FamFG); in Sorge- und Umgangssachen ist die Regel, dass Gerichtskosten und Auslagen halbiert werden und jeder Elternteil seinen eigenen Anwalt zahlt. Ein Gewinnen, das die Rechnung kleiner macht, gibt es hier nicht.",
  },
  {
    question: "Kann man Sorgerecht und Umgang ohne Gericht regeln?",
    answer:
      "Ja, und das ist der wesentliche Unterschied zur Scheidung. Eltern dürfen Sorge und Umgang frei vereinbaren; ein gerichtliches Verfahren ist dafür nicht vorgeschrieben. Wer die Vereinbarung vollstreckbar haben möchte, lässt sie vom Familiengericht billigen (§ 156 Absatz 2 FamFG) — ein Termin, ohne Beweisaufnahme und ohne Gutachten.",
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

            {/* Der Rechner stellte bisher nur zwei Zahlen gegenüber: Gericht
                und medipact. Damit fehlte der Vergleich, den Suchende
                tatsächlich anstellen — nämlich der zur frei tätigen
                Mediatorin, nicht zum Prozess. Genau darauf zielen Suchen wie
                "was kostet ein mediator pro stunde" und "mediator
                stundensatz". Ohne diese Einordnung wirkt ein Festpreis nicht
                günstig, sondern verdächtig.
                Keine medipact-Preise hart hineinschreiben: die kommen aus
                backend/app/pricing.py und stehen oben im Rechner. */}
            <h2 className="mt-12 font-display text-2xl font-medium text-neutral-900">
              Womit der Rechner eigentlich vergleicht
            </h2>
            <p className="mt-4 leading-7 text-neutral-700">
              Die zweite Spalte oben zeigt einen Festpreis. Das ist nicht der
              übliche Weg, eine Mediation abzurechnen — und wer nur diese beiden
              Zahlen sieht, vergleicht die falschen Dinge. Der ehrliche
              Vergleich hat drei Spalten, nicht zwei.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <caption className="sr-only">
                  Wege der Konfliktklärung im Kostenvergleich: Gerichtsverfahren,
                  frei tätige Mediation nach Stundensatz und Online-Mediation zum
                  Festpreis
                </caption>
                <thead>
                  <tr className="border-b border-neutral-300">
                    <th scope="col" className="py-3 pr-4 font-semibold text-neutral-900">
                      Weg
                    </th>
                    <th scope="col" className="py-3 pr-4 font-semibold text-neutral-900">
                      Kostenlogik
                    </th>
                    <th scope="col" className="py-3 font-semibold text-neutral-900">
                      Steht der Betrag vorher fest?
                    </th>
                  </tr>
                </thead>
                <tbody className="text-neutral-700">
                  <tr className="border-b border-neutral-200">
                    <th scope="row" className="py-3 pr-4 font-medium text-neutral-900">
                      Gerichtsverfahren
                    </th>
                    <td className="py-3 pr-4">
                      Nach Streitwert, gesetzliche Tabellen; Gutachten und
                      weitere Instanzen kommen hinzu
                    </td>
                    <td className="py-3">
                      Nein — es ist ein Risiko, kein Preis
                    </td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <th scope="row" className="py-3 pr-4 font-medium text-neutral-900">
                      Freie Mediation vor Ort
                    </th>
                    <td className="py-3 pr-4">
                      Nach Stundensatz, üblich 150–300 € pro Stunde; für eine
                      Familienmediation meist 3–8 Sitzungen
                    </td>
                    <td className="py-3">
                      Nein — die Zahl der Sitzungen zeigt sich erst im Verlauf
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3 pr-4 font-medium text-neutral-900">
                      Online-Mediation zum Festpreis
                    </th>
                    <td className="py-3 pr-4">
                      Einmalige Pauschale für den geführten Prozess, unabhängig
                      von der Dauer
                    </td>
                    <td className="py-3">Ja</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-6 leading-7 text-neutral-700">
              In Zahlen heißt das: Eine Familienmediation über Stundensätze
              landet erfahrungsgemäß bei grob 800 bis 3.000 Euro pro Partei —
              deutlich unter einem streitigen Verfahren, aber eben ein offener
              Betrag. Genau diese Offenheit ist der Grund, warum viele Paare
              die Mediation gar nicht erst beginnen: Nicht die Höhe schreckt ab,
              sondern die Unklarheit.
            </p>
            <p className="mt-4 leading-7 text-neutral-700">
              Der Festpreis oben löst dieses Problem, aber er kauft etwas
              anderes: einen strukturierten, überwiegend schriftlichen
              Online-Prozess statt gemeinsamer Sitzungen mit einer Mediatorin im
              Raum. Für viele Konflikte ist das der bessere Weg — bei hoher
              Eskalation, Angst vor der Gegenseite oder komplexen
              Unternehmensbeteiligungen ist die persönliche Begleitung es. Wer
              vergleicht, sollte beides wissen.
            </p>

            <h2 className="mt-12 font-display text-2xl font-medium text-neutral-900">
              Warum Sorge und Umgang aus dem Rahmen fallen
            </h2>
            <p className="mt-4 leading-7 text-neutral-700">
              In jedem anderen Verfahren steigen die Kosten mit dem Streitwert.
              Bei Kindschaftssachen ist es umgekehrt: Der Wert ist gesetzlich
              gedeckelt — 5.000 Euro je Gegenstand, egal wie viele Kinder
              betroffen sind und wie lange gestritten wird — und das Gericht
              nimmt daraus nur eine halbe Gebühr. Auf dem Papier sind das die
              billigsten Familienverfahren überhaupt.
            </p>
            <p className="mt-4 leading-7 text-neutral-700">
              Tatsächlich sind sie die teuersten, weil die drei größten Posten
              vom Verfahrenswert vollständig entkoppelt sind: das
              familienpsychologische Gutachten, das nach Stunden vergütet wird,
              der Verfahrensbeistand mit seiner Pauschale je Rechtszug — und
              die Zahl der Verfahren. Eilantrag, Hauptsache, Beschwerde und
              jede spätere Abänderung nach § 1696 BGB sind kostenrechtlich
              eigenständige Verfahren mit eigenen Gebühren. Ein Sorge- oder
              Umgangsstreit hört nicht mit einem Beschluss auf; er kann sich
              über die gesamte Kindheit erstrecken und dabei bei jedem Elternteil
              einen fünfstelligen Betrag hinterlassen.
            </p>
            <p className="mt-4 leading-7 text-neutral-700">
              Anders als bei der Scheidung gibt es hier aber auch keinen Zwang
              zum Gericht. Eltern dürfen Sorge und Umgang selbst regeln, und
              eine getroffene Vereinbarung lässt sich auf Antrag
              familiengerichtlich billigen und damit vollstreckbar machen
              (§ 156 Absatz 2 FamFG). Der gesamte Kostenblock oben ist damit
              vermeidbar — er entsteht erst, wenn die Eltern die Entscheidung
              abgeben.
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
                <Link href="/ratgeber/scheidungsfolgenvereinbarung" className="underline">
                  Scheidungsfolgenvereinbarung: Inhalt und Kosten
                </Link>
              </li>
              <li>
                <Link href="/ratgeber/scheidung-ohne-anwalt" className="underline">
                  Scheidung ohne Anwalt: was das wirklich spart
                </Link>
              </li>
              <li>
                <Link href="/preise" className="underline">
                  Preise bei medipact
                </Link>
              </li>
            </ul>

            <p className="mt-10 text-xs leading-6 text-neutral-500">
              Rechtsgrundlagen: Anlage 2 und § 34 Gerichtskostengesetz, §§ 28,
              43, 44, 45 und 50 sowie Kostenverzeichnis Nrn. 1110, 1310, 1314
              und 1410 des Gesetzes über Gerichtskosten in Familiensachen,
              Anlage 2 und § 13 Rechtsanwaltsvergütungsgesetz,
              Vergütungsverzeichnis Nrn. 3100, 3104, 3200, 3202, 7002 und 7008
              RVG, § 158c Gesetz über das Verfahren in Familiensachen sowie § 9
              und Anlage 1 Justizvergütungs- und -entschädigungsgesetz — alle in
              der seit dem{" "}
              {KOSTENRECHT_STAND} geltenden Fassung (Kosten- und
              Betreuervergütungsrechtsänderungsgesetz 2025, BGBl. I Nr. 109).
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
