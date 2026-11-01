import type { Metadata } from "next";
import Link from "next/link";
import { ImagePinHero } from "@/app/components/ui/ImagePinHero";
import { Button } from "@/app/components/ui/Button";
import { ArrowLink } from "@/app/components/ui/ArrowLink";
import { FeatureCard } from "@/app/components/ui/FeatureCard";
import { NumberedSteps, type NumberedStep } from "@/app/components/ui/NumberedSteps";
import { JsonLd } from "@/app/components/JsonLd";
import gespraechPhoto from "@/fotos/medi_gespraech.jpg";
import { ANMELDEN_URL } from "@/lib/nutzerbereich";
import { pageMetadata } from "@/lib/seo";

// Seite für die eingeladene Seite (01.11.2026). Ohne ihr Ja gibt es keinen
// Fall - und sie kennt medipact meist nur aus einer Mail mit Link. Deshalb
// hier zuerst Entlastung ("kein Schritt gegen Sie"), dann was medipact ist und
// was nicht (Muster Mercury: "keine Bank"), dann offene Kosten (Muster
// Stripe). Inhalte aus der Aufklärung der Gegenseite im Produkt
// (dashboard/[id]/intro, Fallback-Blöcke) und aus dem Onboarding für
// Eingeladene in kerno. Keine Zahlen über Fälle: es gibt noch keine.
// Hintergrund: docs/story-mercury-stripe.md.

export const metadata: Metadata = pageMetadata({
  title: "Zur Mediation eingeladen – was jetzt? | medipact",
  description:
    "Sie haben eine Einladung zu einer Online-Mediation bekommen? Was das bedeutet, was es kostet und wie es weitergeht – freiwillig, vertraulich, ohne Gericht.",
  path: "/eingeladen",
});

const nichtListe = [
  {
    title: "Keine Kanzlei",
    text: "medipact vertritt keine Seite und berät nicht rechtlich. Auch nicht die Person, die Sie eingeladen hat.",
  },
  {
    title: "Kein Gericht",
    text: "Niemand entscheidet über Sie. Eine Lösung gilt nur, wenn beide Seiten sie mittragen.",
  },
  {
    title: "Der Rechtsweg bleibt offen",
    text: "Sie können jederzeit aussteigen und anwaltlichen Rat einholen. Durch die Mediation verlieren Sie nichts.",
  },
];

const grundsaetze = [
  {
    title: "Freiwillig",
    text: "Niemand zwingt Sie. Sie können die Einladung ansehen und dann entscheiden – auch später noch aussteigen.",
  },
  {
    title: "Vertraulich",
    text: "Was Sie schreiben, sehen nur die Beteiligten. Als vertraulich gekennzeichnete Schritte sieht nur der Mediator, nicht die andere Seite.",
  },
  {
    title: "Allparteilich",
    text: "Der Mediator steht auf keiner Seite – auch nicht auf der Seite derjenigen, die den Fall angelegt hat.",
  },
  {
    title: "Ergebnisoffen",
    text: "Es gibt kein vorgegebenes Ergebnis. Eine Einigung zählt nur, wenn beide Seiten sie tragen.",
  },
];

const schritte: NumberedStep[] = [
  {
    title: "Einladung öffnen",
    text: "Über den Link in Ihrer E-Mail. Sie legen ein kostenloses Konto an und bekommen eine kurze Einführung.",
  },
  {
    title: "In Ruhe entscheiden",
    text: "Sie sehen, worum es geht, und ggf. eine persönliche Nachricht. Dann entscheiden Sie, ob Sie teilnehmen.",
  },
  {
    title: "Gemeinsam starten",
    text: "Beide Seiten schalten das Verfahren frei. Die Kosten sehen Sie vorher. Danach beginnt die Mediation.",
  },
];

const fragen = [
  {
    q: "Ist die Einladung ein Schritt gegen mich?",
    a: "Nein. Die andere Seite versucht, den Konflikt fair und ohne Gericht zu klären. Eine Mediation ist kein Verfahren gegen jemanden, sondern ein gemeinsames.",
  },
  {
    q: "Was kostet mich das?",
    a: "Das Konto und das Ansehen der Einladung sind kostenlos. Kosten entstehen erst, wenn beide Seiten das Verfahren freischalten – zum Festpreis je Partei, kein Stundenhonorar. Den Betrag sehen Sie vorher. Die einladende Seite kann Ihren Anteil freiwillig übernehmen.",
  },
  {
    q: "Sieht die andere Seite alles, was ich schreibe?",
    a: "Nicht alles. Gemeinsame Schritte sehen beide Seiten. Schritte, die als vertraulich gekennzeichnet sind, sieht ausschließlich der Mediator.",
  },
  {
    q: "Brauche ich einen Anwalt?",
    a: "Für die Mediation nicht. Sie können aber jederzeit anwaltlichen Rat einholen, zum Beispiel bevor Sie eine Vereinbarung unterschreiben. medipact ersetzt keine Rechtsberatung.",
  },
  {
    q: "Der Link funktioniert nicht mehr.",
    a: "Einladungen sind sieben Tage gültig. Bitten Sie die Person, die Sie eingeladen hat, um eine neue Einladung – oder schreiben Sie uns an hallo@medipact.de.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: fragen.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function EingeladenPage() {
  return (
    <main className="app-shell pt-[73px]">
      <JsonLd data={faqSchema} />

      <ImagePinHero
        image={gespraechPhoto}
        imageAlt="Zwei Menschen im ruhigen Gespräch"
        heightVh={115}
        overlayStrength="strong"
        contentClassName="justify-center"
      >
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <p className="eyebrow mb-4 justify-center text-accent-300">Eingeladen?</p>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
            Sie wurden zu einer Mediation{" "}
            <span className="bg-gradient-to-r from-accent-300 via-accent-200 to-white bg-clip-text text-transparent">
              eingeladen.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-200">
            Die andere Seite möchte den Konflikt fair und ohne Gericht klären. Das ist
            kein Schritt gegen Sie. Hier steht in Ruhe, was das bedeutet – und was
            nicht.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <Button href={ANMELDEN_URL} external size="lg">
              Zur Anmeldung
            </Button>
            <p className="text-sm text-neutral-300">
              Am einfachsten über den Link in Ihrer Einladungs-E-Mail.
            </p>
          </div>
        </div>
      </ImagePinHero>

      <section className="section section-base">
        <div className="container max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-4 justify-center">Zur Einordnung</p>
            <h2 className="heading-2 text-neutral-900">Was medipact nicht ist</h2>
            <p className="mt-5 text-lg leading-8 text-neutral-600">
              medipact ist eine Plattform für Online-Mediation mit zertifizierten
              Mediatorinnen und Mediatoren. Damit klar ist, worauf Sie sich einlassen:
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {nichtListe.map((p) => (
              <FeatureCard key={p.title} title={p.title} text={p.text} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-muted border-y border-neutral-200">
        <div className="container max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-4 justify-center">Die Grundsätze</p>
            <h2 className="heading-2 text-neutral-900">Woran sich alle halten</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {grundsaetze.map((p) => (
              <FeatureCard key={p.title} title={p.title} text={p.text} />
            ))}
          </div>
          <p className="mt-8 text-center">
            <ArrowLink href="/methode" className="text-base">
              Wie das Verfahren abläuft
            </ArrowLink>
          </p>
        </div>
      </section>

      <section className="section section-base text-center">
        <div className="container max-w-5xl">
          <p className="eyebrow mb-4 justify-center">So geht es weiter</p>
          <h2 className="heading-2 text-neutral-900">Drei Schritte, keiner verpflichtet Sie</h2>
          <NumberedSteps steps={schritte} className="mt-12" />
          <p className="mt-10">
            <ArrowLink href="/preise" className="text-base">
              Preise ansehen
            </ArrowLink>
          </p>
        </div>
      </section>

      <section className="section section-muted border-t border-neutral-200">
        <div className="container max-w-3xl">
          <p className="eyebrow mb-4 justify-center text-center">Häufige Fragen</p>
          <h2 className="heading-2 text-center text-neutral-900">Was Eingeladene wissen wollen</h2>
          <div className="mt-10 divide-y divide-neutral-200 rounded-3xl border border-neutral-200 bg-white">
            {fragen.map((f) => (
              <details key={f.q} className="group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-neutral-900">
                  {f.q}
                  <span className="text-accent-600 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 leading-7 text-neutral-600">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-neutral-500">
            Noch Fragen?{" "}
            <Link href="/kontakt" className="text-accent-700 hover:underline">
              Schreiben Sie uns
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
