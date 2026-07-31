import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import QuickCheck from "@/app/components/QuickCheck";
import { ImagePinHero } from "@/app/components/ui/ImagePinHero";
import { Breadcrumbs } from "@/app/components/ui/Breadcrumbs";
import konFormenPhoto from "@/fotos/kon_formen.jpg";
import kostenPhoto from "@/fotos/kosten.jpg";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Konfliktarten: die 6 Arten im Überblick | medipact",
  description:
    "Die 6 Konfliktarten: Sach-, Interessen-, Beziehungs-, Werte-, Rollen- und Machtkonflikt – mit Beispiel, Lösungsweg und Eskalationsstufen. Jetzt einordnen.",
  path: "/konflikte",
});

const conflictTypes = [
  {
    title: "Scheidung & Trennung",
    text: "Wenn Beziehung endet und Fragen zu Unterhalt, Betreuung, Verantwortung und Kommunikation offen bleiben.",
    href: "/konflikte/trennung",
  },
  {
    title: "Nachbarschaft",
    text: "Wenn Lärm, Grenzen, Nutzung von Flächen oder alte Spannungen den Alltag belasten.",
    href: "/konflikte/nachbarschaft",
  },
  {
    title: "Verbraucher & Handwerker",
    text: "Wenn strittige Rechnungen, Mängel oder nicht erbrachte Leistungen zum Streit führen.",
    href: "/konflikte/verbraucher",
  },
  {
    title: "Erbe & Familie",
    text: "Wenn Nachlass, Verantwortung, Erwartungen oder alte Familienkonflikte zu Streit führen.",
    href: "/konflikte/erbschaft",
  },
  {
    title: "Business & ODR",
    text: "Wenn Konflikte im Team, zwischen Abteilungen, mit Geschäftspartnern oder Kunden die Zusammenarbeit lähmen – Online Dispute Resolution klärt digital.",
    href: "/konflikte/odr",
  },
];

const konfliktarten = [
  {
    title: "Sachkonflikt",
    frage: "Worum geht es wirklich?",
    text: "Zwei Seiten bewerten dieselbe Sachlage unterschiedlich – oft, weil Informationen fehlen, unklar oder widersprüchlich sind. Beispiel: Uneinigkeit über den Wert einer Immobilie im Nachlass.",
    loesung: "Fakten gemeinsam klären, neutrale Informationsbasis schaffen.",
    beispiel: "Streit über den Verkehrswert des Elternhauses",
  },
  {
    title: "Interessenkonflikt",
    frage: "Wer bekommt was?",
    text: "Beide Seiten wollen dasselbe knappe Gut: Geld, Zeit, Raum oder Zuständigkeit. Der Klassiker unter den Konfliktarten – von der Erbverteilung bis zum Budgetstreit zwischen Abteilungen.",
    loesung: "Interessen hinter den Positionen herausarbeiten, Optionen entwickeln.",
    beispiel: "Zwei Abteilungen beanspruchen dasselbe Budget",
  },
  {
    title: "Beziehungskonflikt",
    frage: "Wie gehen wir miteinander um?",
    text: "Verletzungen, Misstrauen oder Kränkungen überlagern die Sachebene. Häufig bei Trennung, in Familien – und zwischen langjährigen Kollegen oder Gesellschaftern.",
    loesung: "Kommunikation strukturieren, Wahrnehmungen aussprechen, Vertrauen schrittweise aufbauen.",
    beispiel: "Ex-Partner können nicht mehr sachlich über die Kinderbetreuung sprechen",
  },
  {
    title: "Wertekonflikt",
    frage: "Was ist richtig?",
    text: "Unterschiedliche Überzeugungen, Kulturen oder Prinzipien prallen aufeinander. Werte lassen sich nicht wegverhandeln – wohl aber ein respektvoller Umgang damit.",
    loesung: "Nicht überzeugen wollen, sondern Koexistenz und konkrete Verhaltensregeln vereinbaren.",
    beispiel: "Generationenwechsel im Familienbetrieb: Tradition gegen Modernisierung",
  },
  {
    title: "Rollenkonflikt",
    frage: "Wer ist wofür zuständig?",
    text: "Unklare Zuständigkeiten, widersprüchliche Erwartungen oder doppelte Rollen erzeugen Dauerreibung – typisch im Unternehmen und in Familien, die zusammen wirtschaften.",
    loesung: "Rollen und Erwartungen explizit machen, Verantwortlichkeiten neu vereinbaren.",
    beispiel: "Teamleiterin ist zugleich Kollegin und Vorgesetzte",
  },
  {
    title: "Machtkonflikt",
    frage: "Wer entscheidet?",
    text: "Es geht um Einfluss, Kontrolle und Augenhöhe. Oft versteckt er sich hinter Sachthemen – erkennbar daran, dass jede Lösung der Gegenseite abgelehnt wird.",
    loesung: "Faire Verfahrensregeln vereinbaren, Entscheidungswege transparent machen.",
    beispiel: "Zwei Gesellschafter blockieren gegenseitig jede Entscheidung",
  },
];

// Zweite Achse neben der Konfliktart: Wie weit ist der Konflikt eskaliert?
// Modell der neun Eskalationsstufen nach Friedrich Glasl, gruppiert in die
// drei bekannten Zonen. Dieselbe Logik nutzt die Fall-Diagnose im Produkt.
const eskalationsZonen = [
  {
    zone: "Win-Win",
    stufen: "Stufe 1–3",
    text: "Verhärtung, Debatte, Taten statt Worte. Die Beteiligten sind noch lösungsorientiert, auch wenn es unangenehm wird. Eine Lösung, mit der beide Seiten gut leben können, ist realistisch.",
    weg: "Klärendes Gespräch, Moderation – oder eine Mediation, die schnell zum Ergebnis führt.",
  },
  {
    zone: "Win-Lose",
    stufen: "Stufe 4–6",
    text: "Koalitionen, Gesichtsverlust, Drohstrategien. Es geht nicht mehr um die Sache, sondern ums Gewinnen. Ohne Dritte von außen dreht sich die Spirale weiter.",
    weg: "Externe, allparteiliche Mediation – häufig zunächst getrennt (Shuttle-Verfahren).",
  },
  {
    zone: "Lose-Lose",
    stufen: "Stufe 7–9",
    text: "Begrenzte Vernichtung, Zersplitterung, gemeinsam in den Abgrund. Der eigene Schaden wird in Kauf genommen, wenn er nur die Gegenseite härter trifft.",
    weg: "Hier stößt Mediation an ihre Grenzen: Es braucht Machtentscheidungen, rechtliche Schritte oder Schutz.",
  },
];

const konfliktartenFaq = [
  {
    q: "Welche Arten von Konflikten gibt es?",
    a: "Die Konfliktforschung unterscheidet sechs wichtige Konfliktarten: Sachkonflikte, Interessenkonflikte, Beziehungskonflikte, Wertekonflikte, Rollenkonflikte und Machtkonflikte. In der Praxis treten sie meist gemischt auf – hinter einem Sachthema steckt oft ein Beziehungs- oder Machtkonflikt.",
  },
  {
    q: "Welche Konfliktarten gibt es im Unternehmen?",
    a: "Im Unternehmen dominieren Rollenkonflikte (unklare Zuständigkeiten), Interessenkonflikte (Budget, Ressourcen), Beziehungskonflikte im Team und Machtkonflikte zwischen Führungskräften oder Gesellschaftern. Ungelöst kosten sie Produktivität, Fluktuation und Krankheitstage – eine Wirtschaftsmediation setzt genau hier an.",
  },
  {
    q: "Wie löst man die verschiedenen Konfliktarten?",
    a: "Jede Konfliktart braucht einen anderen Hebel: Sachkonflikte eine gemeinsame Faktenbasis, Interessenkonflikte eine Verhandlung über die dahinterliegenden Bedürfnisse, Beziehungskonflikte strukturierte Kommunikation. Mediation kombiniert diese Ansätze in einem geordneten Verfahren mit neutraler Begleitung.",
  },
  {
    q: "Wie erkenne ich, welche Konfliktart vorliegt?",
    a: "Achten Sie darauf, woran das Gespräch scheitert. Streiten Sie über Zahlen und Fakten, ist es ein Sachkonflikt. Geht es darum, wer wie viel bekommt, ein Interessenkonflikt. Wird es persönlich, steckt ein Beziehungskonflikt dahinter. Werden alle Vorschläge der Gegenseite abgelehnt – auch gute – ist es meist ein Machtkonflikt. In der Praxis mischen sich mehrere Arten; entscheidend ist, welche das Gespräch blockiert.",
  },
  {
    q: "Welche Konfliktarten gibt es in Familie und Partnerschaft?",
    a: "Privat dominieren Beziehungskonflikte (Verletzungen, Misstrauen), Wertekonflikte (unterschiedliche Vorstellungen von Erziehung, Geld oder Lebensführung) und Interessenkonflikte bei Trennung und Erbe – etwa um Unterhalt, Betreuungszeiten oder die Aufteilung des Nachlasses. Rollenkonflikte kommen dazu, wenn Familie und Geschäft zusammenfallen, zum Beispiel im Familienunternehmen.",
  },
  {
    q: "Was sind die neun Eskalationsstufen nach Glasl?",
    a: "Friedrich Glasl beschreibt neun Stufen in drei Zonen: Win-Win (Stufe 1–3: Verhärtung, Debatte, Taten statt Worte), Win-Lose (Stufe 4–6: Koalitionen, Gesichtsverlust, Drohstrategien) und Lose-Lose (Stufe 7–9: begrenzte Vernichtung, Zersplitterung, gemeinsam in den Abgrund). Die Stufe entscheidet über den passenden Weg: Bis Stufe 3 genügt oft Moderation, ab Stufe 4 braucht es externe Mediation, ab Stufe 7 rechtliche Schritte oder Schutz.",
  },
];

const suitablePoints = [
  "Beide Seiten sind grundsätzlich bereit zu sprechen.",
  "Es gibt kein akutes Machtungleichgewicht.",
  "Keine Gewalt, Drohung oder massiver Druck steht im Raum.",
  "Beide Seiten können eigene Lösungen akzeptieren.",
  "Es geht nicht primär darum, Recht zu bekommen.",
];

const unsuitablePoints = [
  "Eine Seite will manipulieren, bestrafen oder Zeit gewinnen.",
  "Gewalt, Sucht, Stalking oder starke psychische Instabilität sind zentral.",
  "Eine Partei hat Angst, offen zu sprechen.",
  "Ein Gericht oder Anwalt ist zwingend nötig.",
  "Eine Seite übernimmt keinerlei Verantwortung.",
];

const problemPoints = [
  "Gespräche eskalieren, obwohl eigentlich eine Lösung gebraucht wird.",
  "Anwälte und Gerichte sind teuer, langsam und emotional belastend.",
  "Familien, Nachbarn oder Ex-Partner müssen oft trotzdem weiter miteinander umgehen.",
];

export default function KonfliktePage() {
  return (
    <>
      <ImagePinHero
        image={konFormenPhoto}
        imageAlt="Verschiedene Formen privater Konflikte"
      >
        <div className="container max-w-4xl">
          <Breadcrumbs items={[{ label: "Konfliktarten" }]} variant="dark" />
          <p className="eyebrow mb-4 text-accent-300">Konflikte</p>

          {/* H1 trägt die Ziel-Suchphrase "Konfliktarten" wörtlich – sie ist
              der stärkste Impressionen-Lieferant der Seite. */}
          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
            Konfliktarten erkennen.{" "}
            <span className="text-accent-300">Mediation schafft Klarheit.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-200">
            Ob Trennung, Erbschaft, Nachbarschaft oder Streit im Unternehmen:
            Viele Konflikte eskalieren nicht wegen des eigentlichen Themas,
            sondern weil Kommunikation, Erwartungen und Emotionen
            durcheinandergeraten. Wer die Konfliktart kennt, findet den
            passenden Lösungsweg.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/kontakt" className="btn btn-primary">
              Konflikt einschätzen
            </Link>

            <Link
              href="/cases"
              className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Fallbeispiele ansehen
            </Link>
          </div>
        </div>
      </ImagePinHero>

      <QuickCheck />

      <section className="section section-muted">
        <div className="container">
          <div className="mb-12 max-w-3xl">
            <div className="eyebrow mb-4">Das Problem</div>
            <h2 className="heading-2 text-neutral-900">
              Private Konflikte brauchen keinen jahrelangen Kampf.
            </h2>
            <p className="mt-5 text-lg leading-8 text-neutral-600">
              Gerade bei Trennung, Erbe oder Nachbarschaft geht es nicht nur um
              Recht. Es geht um Stress, Geld, Familie und Alltag. Genau hier
              setzt Medipact an.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
            <div
              className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-neutral-200 shadow-xl shadow-neutral-900/5"
              style={{ aspectRatio: "4/3" }}
            >
              <Image
                src={kostenPhoto}
                alt="Kosten und Belastung durch einen langwierigen Konflikt"
                fill
                sizes="(max-width: 1024px) 100vw, 576px"
                style={{ objectFit: "cover" }}
              />
            </div>

            <div className="grid gap-4">
              {problemPoints.map((point, i) => (
                <div key={point} className="card">
                  <div className="mb-4 text-3xl font-black text-neutral-100">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <p className="text-base leading-7 text-neutral-700">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-base">
        <div className="container">
          <div className="max-w-3xl">
            <p className="eyebrow mb-4">Orientierung</p>

            <h2 className="heading-2 text-neutral-900">
              Welche Konfliktart passt zu Ihrer Situation?
            </h2>

            <p className="mt-5 text-lg leading-8 text-neutral-600">
              Wählen Sie den Bereich, der Ihrer Lage am nächsten kommt. Auf den
              Detailseiten finden Sie typische Dynamiken, Beispiele und mögliche
              nächste Schritte.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {conflictTypes.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="card group transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="heading-3 group-hover:text-accent-700">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-neutral-600">{item.text}</p>

                <p className="mt-6 font-medium text-accent-700">
                  Konfliktart ansehen →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: konfliktartenFaq.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              }),
            }}
          />
          <div className="max-w-3xl">
            <p className="eyebrow mb-4">Wissen</p>

            <h2 className="heading-2 text-neutral-900">
              Welche Arten von Konflikten gibt es? Die 6 wichtigsten
              Konfliktarten
            </h2>

            <p className="mt-5 text-lg leading-8 text-neutral-600">
              Konflikte wirken oft chaotisch – dahinter stecken aber
              wiederkehrende Muster. Die Konfliktforschung unterscheidet sechs
              zentrale Konfliktarten. Wer sie erkennt, versteht, warum ein
              Streit festgefahren ist und welcher Lösungsweg passt.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {konfliktarten.map((art, i) => (
              <div key={art.title} className="card">
                <div className="mb-3 text-sm font-semibold text-accent-700">
                  {String(i + 1).padStart(2, "0")} · {art.frage}
                </div>
                <h3 className="heading-3 text-neutral-900">{art.title}</h3>
                <p className="mt-4 leading-7 text-neutral-600">{art.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">
                Die 6 Konfliktarten im Überblick: Kernfrage, typisches Beispiel
                und Lösungsansatz
              </caption>
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-900">
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Konfliktart
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Kernfrage
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Typisches Beispiel
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Lösungsansatz
                  </th>
                </tr>
              </thead>
              <tbody>
                {konfliktarten.map((art) => (
                  <tr
                    key={art.title}
                    className="border-b border-neutral-100 last:border-0"
                  >
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-neutral-900"
                    >
                      {art.title}
                    </th>
                    <td className="px-5 py-4 text-neutral-600">{art.frage}</td>
                    <td className="px-5 py-4 text-neutral-600">
                      {art.beispiel}
                    </td>
                    <td className="px-5 py-4 text-neutral-600">
                      {art.loesung}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-16 max-w-3xl">
            <p className="eyebrow mb-4">Zweite Achse</p>

            <h2 className="heading-2 text-neutral-900">
              Konfliktarten und Eskalationsstufen: Wie weit ist es schon?
            </h2>

            <p className="mt-5 text-lg leading-8 text-neutral-600">
              Die Konfliktart sagt, worum es geht. Die Eskalationsstufe sagt,
              was jetzt noch möglich ist. Das bekannteste Modell dafür stammt
              von Friedrich Glasl und unterscheidet neun Stufen in drei Zonen –
              genau diese Einordnung nimmt auch die medipact-Diagnose vor,
              bevor über Lösungen gesprochen wird.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {eskalationsZonen.map((z) => (
              <div key={z.zone} className="card">
                <div className="mb-3 text-sm font-semibold text-accent-700">
                  {z.stufen}
                </div>
                <h3 className="heading-3 text-neutral-900">{z.zone}</h3>
                <p className="mt-4 leading-7 text-neutral-600">{z.text}</p>
                <p className="mt-4 border-t border-neutral-100 pt-4 text-sm leading-6 text-neutral-500">
                  <span className="font-semibold text-neutral-700">
                    Passender Weg:
                  </span>{" "}
                  {z.weg}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 max-w-3xl">
            <p className="eyebrow mb-4">Häufige Fragen</p>

            <h2 className="heading-2 text-neutral-900">
              Fragen zu den Konfliktarten
            </h2>
          </div>

          <div className="mt-10 grid gap-6">
            {konfliktartenFaq.map((f) => (
              <div key={f.q} className="card">
                <h3 className="heading-3 text-neutral-900">{f.q}</h3>
                <p className="mt-3 leading-7 text-neutral-600">{f.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-neutral-900 p-6 text-white">
            <h3 className="text-lg font-bold">
              Egal welche Konfliktart: Mediation setzt am Muster an, nicht am
              Symptom.
            </h3>

            <p className="mt-3 leading-7 text-neutral-300">
              Im privaten Umfeld hilft Mediation bei{" "}
              <Link
                href="/konflikte/trennung"
                className="font-semibold text-accent-300 underline-offset-4 hover:underline"
              >
                Trennung
              </Link>
              ,{" "}
              <Link
                href="/konflikte/erbschaft"
                className="font-semibold text-accent-300 underline-offset-4 hover:underline"
              >
                Erbstreit
              </Link>{" "}
              oder{" "}
              <Link
                href="/konflikte/nachbarschaft"
                className="font-semibold text-accent-300 underline-offset-4 hover:underline"
              >
                Nachbarschaftskonflikten
              </Link>
              {" "}– was eine{" "}
              <Link
                href="/ratgeber/scheidung-mediator-kosten"
                className="font-semibold text-accent-300 underline-offset-4 hover:underline"
              >
                Scheidung mit Mediator kostet
              </Link>
              , steht im Kostenüberblick. Im Unternehmen löst eine professionelle{" "}
              <Link
                href="/konflikte/odr"
                className="font-semibold text-accent-300 underline-offset-4 hover:underline"
              >
                Online Dispute Resolution (ODR)
              </Link>{" "}
              blockierte Teams, Gesellschafterstreits und Führungskonflikte –
              diskret, schnell und deutlich günstiger als ein Rechtsstreit.
              Mehr dazu im Ratgeber:{" "}
              <Link
                href="/ratgeber/wirtschaftsmediation"
                className="font-semibold text-accent-300 underline-offset-4 hover:underline"
              >
                Wirtschaftsmediation – Konflikte im Unternehmen lösen
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="section section-base">
        <div className="container">
          <div className="max-w-3xl">
            <p className="eyebrow mb-4">Eignung</p>

            <h2 className="heading-2 text-neutral-900">
              Wann passt Mediation – und wann eher nicht?
            </h2>

            <p className="mt-5 text-lg leading-8 text-neutral-600">
              Mediation ist kein Ersatz für Schutz, Recht oder Therapie. Sie
              hilft vor allem dann, wenn ein sicherer Gesprächsrahmen möglich
              ist und beide Seiten an einer tragfähigen Lösung arbeiten können.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="card-accent">
              <h3 className="heading-3 text-accent-900">
                Mediation kann geeignet sein, wenn:
              </h3>

              <ul className="mt-6 space-y-4 text-neutral-700">
                {suitablePoints.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-1 text-accent-700">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h3 className="heading-3 text-neutral-900">
                Eher nicht geeignet, wenn:
              </h3>

              <ul className="mt-6 space-y-4 text-neutral-700">
                {unsuitablePoints.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-1 text-neutral-400">×</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-neutral-900 p-6 text-white">
            <h3 className="text-lg font-bold">
              Entscheidend ist nicht nur: „Ist Mediation geeignet?“
            </h3>

            <p className="mt-3 leading-7 text-neutral-300">
              Oft lautet die bessere Frage: Was fehlt noch, damit ein sicheres
              und faires Gespräch möglich wird?
            </p>

            <div className="mt-6">
              <Link href="/kontakt" className="btn btn-primary">
                Situation einordnen lassen
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="eyebrow mb-4">Warum Mediation?</p>

            <h2 className="heading-2 text-neutral-900">
              Nicht jeder Streit braucht sofort Gericht, Anwalt oder Abbruch.
            </h2>

            <p className="mt-5 text-lg leading-8 text-neutral-600">
              Mediation hilft, wenn Gespräche festgefahren sind, aber eine
              tragfähige Lösung noch möglich ist. Ziel ist nicht Harmonie um
              jeden Preis, sondern eine klare, realistische Vereinbarung.
            </p>
          </div>

          <div className="card-accent">
            <h3 className="heading-3">Typische Anzeichen</h3>

            <ul className="mt-5 space-y-3 text-neutral-700">
              <li>• Gespräche drehen sich im Kreis.</li>
              <li>• Sachfragen werden persönlich.</li>
              <li>• Entscheidungen werden immer wieder vertagt.</li>
              <li>• Beide Seiten fühlen sich missverstanden.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-strong">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl leading-tight">
            Bereit, den Konflikt klarer einzuordnen?
          </h2>

          <p className="mt-5 text-lg leading-8 text-neutral-300">
            Der erste Schritt ist keine fertige Lösung, sondern eine nüchterne
            Einschätzung der Situation.
          </p>

          {/* Die Übersichtsseite endete bisher nur auf /kontakt. Wer bereits
              weiß, worum es geht, soll direkt starten können. */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/register" className="btn btn-primary">
              Mediation starten
            </Link>

            <Link
              href="/kontakt"
              className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:border-accent-300 hover:text-accent-300"
            >
              Konflikt einschätzen
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
