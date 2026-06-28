import type { Metadata } from "next";
import Link from "next/link";
import { ImagePinHero } from "@/app/components/ui/ImagePinHero";
import MiniMatrix from "@/app/components/MiniMatrix";
import mediModernPhoto from "@/fotos/medi_modern.jpg";

export const metadata: Metadata = {
  title: "Fallbeispiele – So löst Mediation echte Konflikte | medipact",
  description:
    "Echte Fallbeispiele aus Trennung, Erbschaft und Nachbarschaftsstreit: Wie Mediation in wenigen Monaten zu fairen Lösungen führt – statt jahrelangem Streit.",
  alternates: { canonical: "https://medipact.de/cases" },
};

type CaseCard = {
  slug: string;
  title: string;
  titleHighlight: string;
  intro: string;
};

const trennungCases: CaseCard[] = [
  {
    slug: "maria-thomas",
    title: "Maria & Thomas",
    titleHighlight: "Trennung mit 2 Kindern",
    intro:
      "Verheiratet 12 Jahre, 2 Kinder. Mit Mediation: Lösung in 5 Monaten statt 3 Jahre Gericht.",
  },
  {
    slug: "alexa-david",
    title: "Alexa & David",
    titleHighlight: "Mit neuem Partner & Stiefkind",
    intro:
      "Neue Partnerschaft, neue Fragen: Wer macht was? Lösung in 4 Monaten ohne Gericht.",
  },
  {
    slug: "peter-sarah",
    title: "Peter & Sarah",
    titleHighlight: "Hohes Vermögen, komplexe Aufteilung",
    intro:
      "Haus, Ersparnisse, Rentenpunkte. Gericht kostet €45k+ — Mediation: €1.500, schneller, transparenter.",
  },
  {
    slug: "rolf-helga",
    title: "Rolf & Helga",
    titleHighlight: "Nach 38 Jahren Ehe",
    intro:
      "Beamten-Pension trifft geringe Rentenansprüche. Klarheit in 6 Monaten statt 2+ Jahre Verfahren.",
  },
  {
    slug: "carla-marco",
    title: "Carla & Marco",
    titleHighlight: "Mit Unternehmen",
    intro:
      "Gemeinsame GmbH, einer will raus. Lösung: Abfindung plus Fortbestand der Firma.",
  },
  {
    slug: "jens-katarina",
    title: "Jens & Katarina",
    titleHighlight: "Internationale Trennung",
    intro:
      "Zwei Länder, ein Kind. Welches Recht, welcher Wohnort? Lösung in 9 Monaten.",
  },
];

const erbschaftCases: CaseCard[] = [
  {
    slug: "anna-klaus",
    title: "Anna & Klaus",
    titleHighlight: "Geschwister-Streit um das Haus",
    intro:
      "Ein Haus, zwei Geschwister, zwei Vorstellungen. Fair gelöst in 3 Monaten statt Jahren Streit.",
  },
  {
    slug: "marie-sophie",
    title: "Marie & Sophie",
    titleHighlight: "Testament-Konflikt",
    intro:
      "Ungleiche Erbteile, das Gefühl von Ungerechtigkeit. Mediation führt zu einer fairen, verständlichen Lösung.",
  },
  {
    slug: "familie-weber",
    title: "Familie Weber",
    titleHighlight: "Unternehmen erben – retten oder verkaufen?",
    intro:
      "20 Mitarbeiter, drei Erben, gegensätzliche Pläne. Ohne Einigung droht der Verkauf.",
  },
];

const nachbarschaftCases: CaseCard[] = [
  {
    slug: "nachbarschaft-laerm",
    title: "Familie Schneider",
    titleHighlight: "Nächtlicher Lärm – wie viel ist zumutbar?",
    intro:
      "Laute Musik bis spät in die Nacht, schon mehrfach die Polizei involviert. Beide Seiten fühlen sich im Recht.",
  },
  {
    slug: "nachbarschaft-zaun",
    title: "Familien Krüger & Hoffmann",
    titleHighlight: "Zaun auf der Grenze",
    intro:
      "Ein neuer Zaun, zwei überzeugte Parteien. Wer hat recht — und wie geht es weiter?",
  },
  {
    slug: "nachbarschaft-parken",
    title: "Herr Wagner & Frau Lehmann",
    titleHighlight: "Parkplatz blockiert",
    intro:
      "Täglich blockierte Einfahrt, eskalierende Vorwürfe. Der Konflikt ist längst persönlich geworden.",
  },
];

function CaseSection({
  eyebrow,
  title,
  text,
  cases,
}: {
  eyebrow: string;
  title: string;
  text: string;
  cases: CaseCard[];
}) {
  return (
    <section className="section section-base">
      <div className="container">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h2 className="heading-2 text-neutral-900">{title}</h2>
          <p className="mt-5 text-lg leading-8 text-neutral-600">{text}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cases.map((item) => (
            <Link
              key={item.slug}
              href={`/cases/${item.slug}`}
              className="card group transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="heading-3 group-hover:text-accent-700">
                {item.title}
              </h3>
              <p className="mt-1 text-sm font-medium text-accent-700">
                {item.titleHighlight}
              </p>
              <p className="mt-4 leading-7 text-neutral-600">{item.intro}</p>
              <p className="mt-6 font-medium text-accent-700">
                Fallbeispiel lesen →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function CasesPage() {
  return (
    <>
      <ImagePinHero
        image={mediModernPhoto}
        imageAlt="Mediation in der Praxis – echte Fallbeispiele"
      >
        <div className="container max-w-3xl">
          <p className="eyebrow mb-4 text-accent-300">Fallbeispiele</p>

          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
            Wie Mediation echte Konflikte{" "}
            <span className="text-accent-300">tatsächlich löst</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-200">
            Anonymisierte Fallbeispiele aus Trennung, Erbschaft und
            Nachbarschaftsstreit — mit den Perspektiven beider Seiten, dem
            Ablauf und dem Ergebnis.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/kontakt" className="btn btn-primary">
              Eigene Situation einschätzen
            </Link>
            <Link
              href="/methode"
              className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              So funktioniert die Methode
            </Link>
          </div>
        </div>
      </ImagePinHero>

      <CaseSection
        eyebrow="Trennung & Scheidung"
        title="Wenn eine Beziehung endet, aber alles geregelt werden muss"
        text="Kinder, Finanzen, Wohnung — sechs Beispiele, wie unterschiedliche Familien zu einer fairen Lösung gefunden haben."
        cases={trennungCases}
      />

      <CaseSection
        eyebrow="Erbschaft"
        title="Wenn ein Nachlass Familien auseinanderbringt"
        text="Drei Beispiele, wie Geschwister und Erbengemeinschaften trotz unterschiedlicher Erwartungen eine gemeinsame Lösung gefunden haben."
        cases={erbschaftCases}
      />

      <CaseSection
        eyebrow="Nachbarschaft"
        title="Wenn der Alltag zum täglichen Streit wird"
        text="Drei Beispiele, wie Lärm-, Grenz- und Parkkonflikte zwischen Nachbarn ohne Gericht gelöst wurden."
        cases={nachbarschaftCases}
      />

      <MiniMatrix />

      <section className="section section-strong">
        <div className="container max-w-2xl text-center">
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl leading-tight">
            Welche Situation kommt Ihrer am nächsten?
          </h2>
          <p className="mt-4 text-neutral-300">
            Lassen Sie uns gemeinsam einschätzen, ob Mediation auch in Ihrem
            Fall der schnellere, günstigere Weg ist.
          </p>

          <Link href="/kontakt" className="btn btn-primary mt-6 inline-block">
            Kostenlos einschätzen lassen
          </Link>
        </div>
      </section>
    </>
  );
}
