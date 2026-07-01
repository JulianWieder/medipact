import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import QuickCheck from "@/app/components/QuickCheck";
import { ImagePinHero } from "@/app/components/ui/ImagePinHero";
import { Breadcrumbs } from "@/app/components/ui/Breadcrumbs";
import konFormenPhoto from "@/fotos/kon_formen.jpg";
import kostenPhoto from "@/fotos/kosten.jpg";

export const metadata: Metadata = {
  title: "Konfliktarten – Trennung, Nachbarschaft, Erbschaft | medipact",
  description:
    "Für welchen Konflikt brauchen Sie Hilfe? Medipact unterstützt bei Trennung & Scheidung, Nachbarschaftsstreit und Erbschaftskonflikten. Jetzt kostenlos einschätzen.",
  alternates: { canonical: "https://medipact.de/konflikte" },
};

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
    title: "Erbe & Familie",
    text: "Wenn Nachlass, Verantwortung, Erwartungen oder alte Familienkonflikte zu Streit führen.",
    href: "/konflikte/erbschaft",
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
      <ImagePinHero image={konFormenPhoto} imageAlt="Verschiedene Formen privater Konflikte">
        <div className="container max-w-4xl">
          <Breadcrumbs items={[{ label: "Konfliktarten" }]} variant="dark" />
          <p className="eyebrow mb-4 text-accent-300">Konflikte</p>

          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
            Konflikte haben viele Formen.{" "}
            <span className="text-accent-300">
              Mediation schafft Klarheit.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-200">
            Ob Trennung, Erbschaft oder Nachbarschaft: Viele Konflikte
            eskalieren nicht wegen des eigentlichen Themas, sondern weil
            Kommunikation, Erwartungen und Emotionen durcheinandergeraten.
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
              Gerade bei Trennung, Erbe oder Nachbarschaft geht es nicht nur
              um Recht. Es geht um Stress, Geld, Familie und Alltag. Genau
              hier setzt Medipact an.
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
                  <p className="text-base leading-7 text-neutral-700">{point}</p>
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

          <div className="mt-12 grid gap-6 md:grid-cols-3">
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

          <Link href="/kontakt" className="btn btn-primary mt-8">
            Konflikt einschätzen
          </Link>
        </div>
      </section>
    </>
  );
}
