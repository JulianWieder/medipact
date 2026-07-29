import type { Metadata } from "next";
import Link from "next/link";
import { ImagePinHero } from "@/app/components/ui/ImagePinHero";
import { StepImage } from "@/app/components/StepImage";
import { JsonLd } from "@/app/components/JsonLd";
import { DidYouKnowSection } from "@/app/components/ui/DidYouKnowSection";
import { EinladungsAssistent } from "@/app/components/EinladungsAssistent";
import { ArrowLink } from "@/app/components/ui/ArrowLink";
import whiteboardPhoto from "../../fotos/whiteboard-erklaerung.jpg";
import step1Photo from "../../fotos/schritte/1.jpg";
import step2Photo from "../../fotos/schritte/2.jpg";
import step3Photo from "../../fotos/schritte/3.jpg";
import step4Photo from "../../fotos/schritte/4.jpg";
import step5Photo from "../../fotos/schritte/5.jpg";
import step6Photo from "../../fotos/schritte/6.jpg";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Ablauf einer Mediation: 6 Schritte bei medipact",
  description:
    "Vom ersten Schritt bis zur Vereinbarung: der 6-Schritte-Prozess, alle Mediationsphasen und die Rollen von KI und Mediator – transparent erklärt.",
  path: "/methode",
});

const differentiators = [
  {
    num: "01",
    eyebrow: "Struktur statt Eskalation",
    title: "Geführt, nicht allein gelassen.",
    text: "Die meisten Streits scheitern nicht am Willen, sondern am Weg. Medipact gibt beiden Seiten eine klare Struktur – statt endloser, kreisender Gespräche.",
  },
  {
    num: "02",
    eyebrow: "Bewährte Methode",
    title: "Kein Bauchgefühl. Das Harvard-Prinzip.",
    text: "Interessen statt Positionen, Optionen statt Schuldzuweisungen. Eine Methode, die seit Jahrzehnten in der Konfliktlösung funktioniert – jetzt digital zugänglich.",
  },
  {
    num: "03",
    eyebrow: "Fair für alle Seiten",
    title: "Eine Lösung, mit der beide weiterleben können.",
    text: "Bei Trennung, Erbe oder Nachbarschaft sehen sich Menschen oft wieder. Medipact zielt nicht auf Sieg, sondern auf eine Einigung, die trägt.",
  },
];

const workflowSteps = [
  {
    num: "01",
    title: "Streitfall starten",
    text: "Sie beschreiben kurz, worum es geht: Trennung, Nachbarschaft, Erbe oder ein anderer privater Konflikt.",
    image: step1Photo,
  },
  {
    num: "02",
    title: "Zweite Seite einladen",
    text: "Die andere Partei wird sachlich eingebunden. Kein öffentlicher Druck, keine bloßstellende Konfrontation.",
    image: step2Photo,
  },
  {
    num: "03",
    title: "Themen sortieren",
    text: "Medipact trennt Emotionen, Forderungen und eigentliche Interessen. Dadurch wird der Konflikt greifbarer.",
    image: step3Photo,
  },
  {
    num: "04",
    title: "Geführt austauschen",
    text: "Beide Seiten antworten strukturiert. Die KI hilft, Eskalation zu vermeiden und beim Wesentlichen zu bleiben.",
    image: step4Photo,
  },
  {
    num: "05",
    title: "Lösungen entwickeln",
    text: "Aus den Interessen entstehen konkrete Vorschläge, die beide Seiten prüfen, anpassen oder ablehnen können.",
    image: step5Photo,
  },
  {
    num: "06",
    title: "Einigung dokumentieren",
    text: "Das Ergebnis wird klar festgehalten. Bei rechtlich wichtigen Fragen sollte es juristisch geprüft werden.",
    image: step6Photo,
  },
];

// Die Mediationsphasen, wie sie auch in der Plattform ablaufen (Einleitung bis
// Abschluss, plus Onboarding als Vor-Phase). Inhaltlich angelehnt an das
// klassische Phasenmodell der Mediation – ausführlich erklärt im Ratgeber.
const mediationPhases = [
  {
    num: "0",
    title: "Onboarding & Einladung",
    text: "Sie beschreiben Ihren Fall, die Gegenseite wird sachlich eingeladen. Erst wenn beide Seiten freiwillig dabei sind, beginnt die eigentliche Mediation.",
    platform: "Die Plattform formuliert auf Wunsch eine neutrale, professionelle Einladungsnachricht für Sie.",
  },
  {
    num: "1",
    title: "Einleitung",
    text: "Der Rahmen wird geklärt: Wie läuft das Verfahren ab, welche Regeln gelten, was bleibt vertraulich? Beide Seiten wissen von Anfang an, worauf sie sich einlassen.",
    platform: "Gesprächsregeln, Ablauf und Vertraulichkeit werden transparent festgehalten – für beide Seiten gleich.",
  },
  {
    num: "2",
    title: "Themensammlung",
    text: "Beide Seiten schildern aus ihrer Sicht, welche Themen offen sind – zunächst ohne Bewertung. Oft zeigt sich: Hinter einem großen Streit stecken mehrere klar benennbare Punkte.",
    platform: "Ihre Eingaben werden strukturiert gesammelt und zu einer gemeinsamen Themenliste geordnet.",
  },
  {
    num: "3",
    title: "Interessenklärung",
    text: "Das Herzstück: Hinter jeder Forderung steckt ein Interesse – ein Bedürfnis, eine Sorge, ein Wunsch. Positionen schließen sich oft aus, Interessen lassen sich meist vereinbaren.",
    platform: "Gezielte Fragen helfen, vom „Was fordere ich?“ zum „Worum geht es mir wirklich?“ zu kommen.",
  },
  {
    num: "4",
    title: "Lösungsoptionen",
    text: "Jetzt werden Ideen entwickelt – möglichst viele, zunächst ohne Bewertung. Ziel sind Lösungen, die mehrere Interessen gleichzeitig erfüllen, statt eines Kompromisses, mit dem niemand zufrieden ist.",
    platform: "Aus den geklärten Interessen entstehen konkrete Vorschläge, die beide Seiten prüfen und anpassen können.",
  },
  {
    num: "5",
    title: "Bewertung & Verhandlung",
    text: "Die Optionen werden verhandelt: Ist die Lösung fair? Ist sie umsetzbar? Schritt für Schritt nähern sich beide Seiten der Option, die ihnen am besten gerecht wird.",
    platform: "Die Plattform hält fest, wo Einigkeit besteht und wo noch verhandelt wird – nichts geht verloren.",
  },
  {
    num: "6",
    title: "Abschluss & Vereinbarung",
    text: "Die beste Lösung wird schriftlich festgehalten und von beiden Seiten bestätigt. Bei rechtlich wichtigen Fragen empfiehlt sich eine juristische Prüfung.",
    platform: "Am Ende steht eine klare, dokumentierte Vereinbarung – wer tut was bis wann.",
  },
];

const kiTasks = [
  {
    title: "Struktur & Führung",
    text: "Die KI führt beide Seiten Schritt für Schritt durch die Phasen – rund um die Uhr, in Ihrem Tempo, ohne Terminabsprachen.",
  },
  {
    title: "Deeskalation",
    text: "Formulierungen werden versachlicht, bevor sie die Gegenseite erreichen. Vorwürfe werden zu Themen, Angriffe zu Anliegen.",
  },
  {
    title: "Zusammenfassungen",
    text: "Nach jeder Phase fasst die KI zusammen, was beide Seiten eingebracht haben – neutral und für beide gleich sichtbar.",
  },
  {
    title: "Lösungsvorschläge",
    text: "Aus den Interessen beider Seiten entwickelt die KI konkrete Optionen als Verhandlungsgrundlage – entscheiden tun immer Sie.",
  },
];

const mediatorTasks = [
  {
    title: "Verantwortung für den Fall",
    text: "Jeder Fall hat einen verantwortlichen Mediator. Er legt fest, welche Schritte Ihr Fall in jeder Phase braucht – und passt den Ablauf an, wenn nötig.",
  },
  {
    title: "Qualitätskontrolle",
    text: "Zwischenergebnisse und Vereinbarungen werden geprüft, bevor es weitergeht. Die KI arbeitet zu – die Verantwortung bleibt beim Menschen.",
  },
  {
    title: "Persönliche Gespräche",
    text: "In den Modellen Hybrid und Vollservice begleitet der Mediator die entscheidenden Gespräche persönlich – per Videokonferenz oder vor Ort.",
  },
  {
    title: "Eingreifen bei Eskalation",
    text: "Droht der Prozess zu kippen, greift der Mediator ein: Er moderiert, sortiert neu oder holt bei Bedarf Spezialisten dazu.",
  },
];

const variants = [
  {
    badge: "Online-Prozess",
    title: "Schnell & günstig",
    price: "ab €49",
    priceNote: "je nach Konfliktart, fair aufgeteilt",
    text: "Der geführte Prozess bringt Sie Schritt für Schritt zur Lösung – rund um die Uhr, ganz in Ihrem Tempo.",
    facts: ["Geführter Prozess, 24/7 verfügbar", "Dauer: meist 1–2 Wochen", "Ideal für klare bis mittelschwere Fälle"],
    highlight: false,
  },
  {
    badge: "Hybrid",
    title: "Persönlich & unterstützt",
    price: "ab €499 / Partei",
    priceNote: "2 Std. persönliche Mediation inklusive",
    text: "Der Prozess bereitet alles vor – ein zertifizierter Mediator begleitet Sie persönlich durch die entscheidenden Gespräche.",
    facts: ["Profi-Mediator persönlich dabei", "Dauer: 2–8 Wochen", "Spezialisten bei Bedarf zubuchbar"],
    highlight: true,
  },
  {
    badge: "Vollservice",
    title: "Komplett & begleitet",
    price: "ab €899 / Partei",
    priceNote: "5 Std. Mediator + anwaltliche Ersteinschätzung inklusive",
    text: "Für sehr komplexe Fälle – mit Vermögen, Firma, Kindern oder hohem Konfliktniveau. Eine feste Ansprechperson von Anfang bis Ende.",
    facts: ["Feste Ansprechperson, durchgehend", "Dauer: 4–12 Wochen", "Höchste Erfolgsquote bei Eskalation"],
    highlight: false,
  },
];

const exampleCases = [
  {
    href: "/cases/maria-thomas",
    eyebrow: "Trennung mit Kindern",
    title: "Maria & Thomas",
    text: "12 Jahre verheiratet, 2 Kinder. Lösung in 5 Monaten statt 3 Jahre Gericht.",
  },
  {
    href: "/cases/rolf-helga",
    eyebrow: "Scheidung nach 38 Jahren",
    title: "Rolf & Helga",
    text: "Beamten-Pension trifft geringe Rente. Klarheit in 6 Monaten statt 2+ Jahre Verfahren.",
  },
  {
    href: "/cases/nachbarschaft-laerm",
    eyebrow: "Nachbarschaft & Lärm",
    title: "Familie Schneider",
    text: "Monatelanger Streit um nächtlichen Lärm, mehrfach Polizei – gelöst ohne Gericht.",
  },
  {
    href: "/cases/gesellschafter-streit",
    eyebrow: "Gesellschafter-Streit",
    title: "Stefan & Tobias",
    text: "50/50-Patt, 18 Mitarbeiter, Firma blockiert. Lösung in 3 Monaten.",
  },
];

const faqs = [
  {
    q: "Für welche Konflikte ist Medipact geeignet?",
    a: "Vor allem für private Konflikte, bei denen beide Seiten grundsätzlich eine Lösung suchen: Trennung, Scheidung, Nachbarschaftsstreit, Erbe oder familiäre Auseinandersetzungen.",
  },
  {
    q: "Ersetzt Medipact einen Anwalt oder ein Gericht?",
    a: "Nein. Medipact ist eine niedrigschwellige Alternative zur strukturierten Einigung. Bei komplexen rechtlichen Fragen sollte das Ergebnis anwaltlich geprüft werden.",
  },
  {
    q: "Was passiert, wenn die andere Seite nicht mitmacht?",
    a: "Dann kann keine gemeinsame Einigung entstehen. Sie können Ihre Sicht trotzdem sortieren und besser vorbereitet entscheiden, ob ein anderer Weg notwendig ist.",
  },
  {
    q: "Ist das Ergebnis rechtlich bindend?",
    a: "Eine Vereinbarung kann verbindlich werden, wenn beide Seiten sie bewusst akzeptieren und die rechtlichen Anforderungen erfüllt sind. Bei Scheidung, Erbe oder größeren Vermögenswerten ist eine juristische Prüfung sinnvoll.",
  },
  {
    q: "Wie lange dauert der Prozess?",
    a: "Viele Konflikte lassen sich in wenigen Wochen strukturieren und lösen. Die Dauer hängt davon ab, wie komplex der Streit ist und wie aktiv beide Seiten mitarbeiten.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

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
  url: "https://medipact.de/methode",
  offers: {
    "@type": "Offer",
    priceCurrency: "EUR",
    price: "49",
    description: "KI-Mediation ab €49",
  },
};

export default function MethodePage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={serviceSchema} />

      <ImagePinHero image={whiteboardPhoto} imageAlt="Mediatorin erklärt den strukturierten Mediationsprozess">
        <div className="container max-w-4xl">
          <p className="eyebrow mb-4 text-accent-300">So funktioniert es</p>

          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
            Drei Gründe, warum es funktioniert.{" "}
            <span className="text-accent-300">Sechs Schritte zur Einigung.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-200">
            Medipact ersetzt das kreisende Gespräch durch einen klaren,
            geführten Prozess – nach dem Harvard-Prinzip, fair für alle
            Seiten.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/auth/register" className="btn btn-primary">
              Kostenlosen Account erstellen
            </Link>
            <Link
              href="/preise"
              className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Preise ansehen
            </Link>
          </div>
        </div>
      </ImagePinHero>

      <section className="section section-base">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 max-w-2xl">
            <div className="eyebrow mb-4">Warum medipact anders ist</div>
            <h2 className="heading-2">Drei Gründe, die den Unterschied machen.</h2>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {differentiators.map((d) => (
              <div key={d.num}>
                <div className="text-sm font-black tracking-widest text-neutral-300">
                  {d.num}
                </div>
                <div className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-accent-700">
                  {d.eyebrow}
                </div>
                <h3 className="mt-3 text-xl font-bold text-neutral-900">
                  {d.title}
                </h3>
                <p className="mt-3 leading-relaxed text-neutral-600">
                  {d.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="section section-muted border-y border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 text-center text-neutral-900">
            <div className="eyebrow mb-4 justify-center">So funktioniert es</div>
            <h2 className="heading-2">In 6 Schritten zur möglichen Einigung</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-700">
              Klar genug für Sachfragen. Ruhig genug für emotionale Themen.
            </p>
          </div>

          <div className="grid gap-4">
            {workflowSteps.map((step) => (
              <div
                key={step.num}
                className="group flex items-center gap-6 rounded-[2rem] border border-neutral-100 bg-white p-6 transition hover:border-accent-200 hover:shadow-md sm:gap-8 sm:p-8"
              >
                <StepImage src={step.image} alt={step.title} num={step.num} />

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-50 text-base font-black text-accent-700 shadow-sm sm:hidden">
                  {step.num}
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-neutral-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-neutral-600">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Schritt 0: Konflikt-Logbuch & Journal (kostenlos, vor der Mediation) */}
          <div className="mt-8 rounded-[2rem] border border-accent-200 bg-accent-50/60 p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700">
                  Schritt 0 – noch vor der Mediation
                </div>
                <h3 className="mt-2 text-xl font-bold text-neutral-900">
                  Erst dokumentieren: Konflikt-Logbuch &amp; Journal
                </h3>
                <p className="mt-2 max-w-2xl leading-relaxed text-neutral-600">
                  Nicht sicher, ob der Konflikt eskaliert? Halten Sie kostenlos
                  fest, was passiert – Vorkommnisse, Gespräche, E-Mails – und
                  führen Sie parallel ein privates Journal für Ihre Gedanken,
                  das garantiert niemand außer Ihnen liest. Eskaliert es doch,
                  wird das Logbuch mit einem Klick zur Mediation; geteilt wird
                  nur, was Sie ausdrücklich freigeben.
                </p>
              </div>
              <Link href="/konflikt-logbuch" className="btn btn-primary shrink-0">
                Kostenloses Logbuch starten
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PHASEN IM DETAIL */}
      <section id="phasen" className="section section-base">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="mb-16 max-w-2xl">
            <div className="eyebrow mb-4">Die Methode dahinter</div>
            <h2 className="heading-2">Die Mediationsphasen im Detail</h2>
            <p className="mt-4 text-lg text-neutral-700">
              Hinter den sechs Schritten steht das bewährte Phasenmodell der
              Mediation. Der Rahmen ist fest – welche Schritte Ihr Fall in
              jeder Phase braucht, legt der verantwortliche Mediator
              individuell fest.
            </p>
          </div>

          <ol className="relative space-y-8 border-l border-neutral-200 pl-8 sm:pl-10">
            {mediationPhases.map((phase) => (
              <li key={phase.num} className="relative">
                <span className="absolute -left-[45px] flex h-9 w-9 items-center justify-center rounded-full border border-accent-200 bg-accent-50 text-sm font-black text-accent-700 sm:-left-[53px]">
                  {phase.num}
                </span>
                <h3 className="text-lg font-bold text-neutral-900">
                  {phase.title}
                </h3>
                <p className="mt-2 leading-relaxed text-neutral-600">
                  {phase.text}
                </p>
                <p className="mt-3 rounded-xl bg-accent-50/60 px-4 py-3 text-sm leading-relaxed text-accent-900">
                  <span className="font-bold">Auf der Plattform: </span>
                  {phase.platform}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
            <ArrowLink href="/ratgeber/5-phasen-der-mediation">
              Die Phasen der Mediation ausführlich erklärt
            </ArrowLink>
            <ArrowLink href="/ratgeber/was-ist-mediation" tone="muted">
              Was ist Mediation?
            </ArrowLink>
          </div>
        </div>
      </section>

      {/* ROLLEN: KI & MEDIATOR */}
      <section id="rollen" className="section section-strong">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 max-w-2xl">
            <div className="eyebrow mb-4 text-accent-300">Wer macht was</div>
            <h2 className="heading-2 text-white">
              Die KI strukturiert. Der Mediator verantwortet.
            </h2>
            <p className="mt-4 text-lg leading-8 text-neutral-300">
              Medipact ist kein Chatbot, der Ihren Streit „löst“. Die KI
              übernimmt die Struktur- und Fleißarbeit – die Verantwortung für
              Ihren Fall trägt immer ein Mensch.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur sm:p-10">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">
                Was die KI übernimmt
              </div>
              <div className="mt-6 space-y-6">
                {kiTasks.map((t) => (
                  <div key={t.title}>
                    <h3 className="font-bold text-white">{t.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-neutral-300">
                      {t.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-accent-500/30 bg-accent-500/10 p-8 backdrop-blur sm:p-10">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">
                Was der Mediator übernimmt
              </div>
              <div className="mt-6 space-y-6">
                {mediatorTasks.map((t) => (
                  <div key={t.title}>
                    <h3 className="font-bold text-white">{t.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-neutral-300">
                      {t.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:grid-cols-3 sm:p-10">
            {[
              {
                title: "Vertraulich",
                text: "Ihre Eingaben sind nicht öffentlich. Die Gegenseite sieht nur, was für den Prozess bestimmt ist.",
              },
              {
                title: "Freiwillig",
                text: "Mediation funktioniert nur ohne Zwang. Beide Seiten können jederzeit aussteigen.",
              },
              {
                title: "Neutral",
                text: "Weder KI noch Mediator ergreifen Partei. Beide Seiten bekommen denselben fairen Rahmen.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="font-bold text-white">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-300">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <ArrowLink href="/ratgeber/was-ist-ein-mediator" tone="light">
              Mehr über die Rolle des Mediators
            </ArrowLink>
          </div>
        </div>
      </section>

      {/* VARIANTEN-VERGLEICH */}
      <section id="varianten" className="section section-muted border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="eyebrow mb-4 justify-center">Drei Wege zur Einigung</div>
            <h2 className="heading-2">So viel Begleitung, wie Ihr Fall braucht</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-700">
              Derselbe geführte Prozess – wahlweise komplett online, mit
              persönlicher Mediation oder rundum begleitet.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {variants.map((v) => (
              <div
                key={v.badge}
                className={
                  v.highlight
                    ? "relative rounded-[2rem] border-2 border-accent-600 bg-gradient-to-br from-accent-50 to-white p-8"
                    : "rounded-[2rem] border border-neutral-200 bg-white p-8"
                }
              >
                {v.highlight && (
                  <div className="absolute -top-3 right-8 rounded-full bg-accent-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                    Beliebt
                  </div>
                )}
                <div className="inline-flex items-center rounded border border-accent-200 bg-accent-50 px-3 py-1.5 text-xs font-semibold uppercase text-accent-700">
                  {v.badge}
                </div>
                <h3 className="mt-5 text-2xl font-black text-neutral-900">
                  {v.title}
                </h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-accent-600">
                    {v.price}
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-500">{v.priceNote}</p>
                <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                  {v.text}
                </p>
                <ul className="mt-5 space-y-2.5 border-t border-neutral-200 pt-5">
                  {v.facts.map((f) => (
                    <li key={f} className="flex gap-2.5 text-sm text-neutral-700">
                      <span className="font-bold text-accent-600">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <ArrowLink href="/preise">
              Alle Preise und Leistungen im Detail
            </ArrowLink>
          </div>
        </div>
      </section>

      {/* FALLBEISPIELE */}
      <section id="fallbeispiele" className="section section-base">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 max-w-2xl">
            <div className="eyebrow mb-4">Aus der Praxis</div>
            <h2 className="heading-2">So sieht das in echten Fällen aus</h2>
            <p className="mt-4 text-lg text-neutral-700">
              Von der Trennung mit Kindern bis zum Gesellschafter-Patt: Diese
              Fallbeispiele zeigen den Prozess Schritt für Schritt – inklusive
              Kosten- und Zeitvergleich zum Gerichtsweg.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {exampleCases.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group rounded-[2rem] border border-neutral-200 bg-white p-7 transition hover:border-accent-200 hover:shadow-md"
              >
                <div className="text-xs font-bold uppercase tracking-[0.15em] text-accent-700">
                  {c.eyebrow}
                </div>
                <h3 className="mt-3 text-lg font-bold text-neutral-900 transition group-hover:text-accent-700">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {c.text}
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-accent-700">
                  Fall lesen{" "}
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            <ArrowLink href="/cases">Alle Fallbeispiele ansehen</ArrowLink>
            <ArrowLink href="/konflikte" tone="muted">
              Welcher Konflikttyp passt zu Ihrer Situation?
            </ArrowLink>
          </div>
        </div>
      </section>

      <EinladungsAssistent />

      <section id="faq" className="section section-base">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="eyebrow mb-4 justify-center">FAQ</div>
            <h2 className="heading-2">Häufige Fragen</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="app-surface p-6 sm:p-8">
                <h3 className="font-semibold text-neutral-900">{faq.q}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DidYouKnowSection />

      <section className="section section-strong text-center">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl leading-tight">
            Bereit für den ersten Schritt?
          </h2>
          <p className="mt-5 text-lg leading-8 text-neutral-300">
            Starten Sie ruhig, vertraulich und unverbindlich.
          </p>
          <Link href="/auth/register" className="btn btn-primary mt-8">
            Kostenlosen Account erstellen
          </Link>
        </div>
      </section>
    </>
  );
}
