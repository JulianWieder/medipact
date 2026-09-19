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
  title: "Ablauf der Mediation: geführt statt verhandelt | medipact",
  description:
    "Beide Seiten werden getrennt durch das Verfahren geführt, der Mediator entscheidet die strittigen Punkte in zwei Sitzungen à 60 Minuten. Ab 49 € je Partei.",
  path: "/methode",
});

const differentiators = [
  {
    num: "01",
    eyebrow: "Keine Hürde",
    title: "Sie müssen nichts formulieren.",
    text: "Wer mitten im Streit steckt, schreibt keine guten Texte – deshalb eskalieren E-Mails zwischen zerstrittenen Parteien so zuverlässig. Hier beantworten Sie Fragen und treffen Auswahlen. Das Verfahren macht daraus, was die andere Seite lesen kann.",
  },
  {
    num: "02",
    eyebrow: "Getrennt statt gegenüber",
    title: "Niemand muss sofort reagieren.",
    text: "Sie müssen sich nicht in einen Raum setzen, um sich zu einigen. Beide Seiten gehen unabhängig voneinander durch dieselben Schritte, zu unterschiedlichen Zeiten. Niemand unterbricht, und niemand sagt etwas im Affekt.",
  },
  {
    num: "03",
    eyebrow: "Nachlesbar",
    title: "Wer was wann vorgeschlagen hat, steht fest.",
    text: "Bei einer Vereinbarung, die Jahre halten soll – Betreuungszeiten, Zahlungen, Nutzungsregeln – ist das kein Nebeneffekt, sondern der Punkt.",
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

// Was das System uebernimmt, stand hier frueher als zweite Spalte ("Was die
// KI uebernimmt") und noch einmal als Vertraulich/Freiwillig/Neutral-Kasten.
// Beides ist am 06.08.2026 ins /einigung-Cluster umgezogen: die Faehigkeiten
// nach /einigung, die Transparenz- und Fairness-Aussagen nach
// /einigung/gleichbehandlung, die Grenzen nach /einigung/ohne-mediator.
// Diese Seite beantwortet nur noch, WER den Fall verantwortet - das ist ihr
// eigener Job und der einzige Teil, den das Cluster nicht abdeckt.
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
    text: "In den Modellen Hybrid und Vollservice führt ein zertifizierter Mediator die entscheidenden Sitzungen – per Video, zu zweit oder zu dritt.",
  },
  {
    title: "Eingreifen bei Eskalation",
    text: "Droht der Prozess zu kippen, greift der Mediator ein: Er moderiert, sortiert neu oder holt bei Bedarf Spezialisten dazu.",
  },
];

// Die Pakete spiegeln backend/app/pricing.py (PRICE_MATRIX). Wichtig und
// vorher falsch dargestellt: Hybrid und Vollservice sind dort NUR für
// "trennung" hinterlegt – bei nachbarschaft, verbraucher, erbschaft und der
// gesamten ODR-Familie steht überall None. Die Seite hat sie bis 31.07.2026
// als allgemein buchbar gezeigt. `availability` macht das jetzt sichtbar;
// beim Ergänzen neuer Preise in pricing.py hier nachziehen.
const variants = [
  {
    badge: "Ohne Sitzung",
    title: "Schnell & günstig",
    price: "ab €49",
    priceNote: "Nachbarschaft und Verbraucher je Partei; Trennung und Erbe ab €399, Geschäftskonflikte ab €1.200",
    availability: "Für alle Konfliktarten",
    text: "Das komplette Verfahren geführt, in Ihrem Tempo. Für Fälle, in denen die Sache klar ist und nur die Struktur fehlt.",
    facts: ["Geführter Prozess, 24/7 verfügbar", "Dauer: meist 1–2 Wochen", "Ideal für klare bis mittelschwere Fälle"],
    highlight: false,
  },
  {
    badge: "Hybrid",
    title: "Persönlich & unterstützt",
    price: "€499 / Partei",
    priceNote: "Zwei Sitzungen à 60 Minuten inklusive",
    availability: "Nur bei Trennung & Scheidung",
    text: "Das Verfahren bereitet alles vor, der Mediator entscheidet mit Ihnen die strittigen Punkte – per Video, zu zweit oder zu dritt.",
    facts: ["Zertifizierter Mediator in der Sitzung", "Dauer: 2–8 Wochen", "Spezialisten bei Bedarf zubuchbar"],
    highlight: true,
  },
  {
    badge: "Vollservice",
    title: "Komplett & begleitet",
    price: "€899 / Partei",
    priceNote: "Fünf Sitzungen plus anwaltliche Ersteinschätzung",
    availability: "Nur bei Trennung & Scheidung",
    text: "Für sehr komplexe Fälle – mit Vermögen, Firma, Kindern oder hohem Konfliktniveau. Eine feste Ansprechperson von Anfang bis Ende.",
    facts: ["Feste Ansprechperson, durchgehend", "Dauer: 4–12 Wochen", "Für stark eskalierte Verfahren"],
    highlight: false,
  },
];

// Die vier Methoden entsprechen den Varianten aus Migration q9r0s1t2u3v4
// (methode_harvard / _shuttle / _transformativ / _evaluativ). Sie sind
// additiv zum Basis-Workflow: Der Mediator ordnet einem Fall eine Methode zu,
// dann kommen deren Schritte zu den Standardschritten der Phase dazu.
const methodVariants = [
  {
    name: "Harvard-Methode",
    claim: "Sachbezogen zum Ja",
    text: "Hart in der Sache, weich zu den Menschen: Interessen statt Positionen, ein durchdachter Plan B, eine Optionen-Werkstatt und objektive Kriterien – bis beide Seiten guten Gewissens zustimmen können.",
    fit: "Der Standardweg für die meisten Fälle",
  },
  {
    name: "Shuttle-Mediation",
    claim: "Getrennte Gespräche",
    text: "Die Parteien treffen sich zunächst gar nicht. Der Mediator pendelt vertraulich zwischen beiden Seiten und bringt nur das hinüber, was helfen soll.",
    fit: "Bei starker Eskalation, Machtgefälle oder hartem Verhandlungspoker",
  },
  {
    name: "Transformative Mediation",
    claim: "Beziehung zuerst",
    text: "Erst die Menschen, dann die Sache: Anerkennung, Perspektivwechsel und ein gemeinsames Zukunftsbild stehen vor der Einigung über Zahlen.",
    fit: "Wenn Sie danach weiter zusammenarbeiten oder Familie bleiben",
  },
  {
    name: "Evaluative Mediation",
    claim: "Realitätscheck",
    text: "Der ehrliche Blick auf Zahlen und Risiken: Was kostet der Streit wirklich, wie stehen die Chancen vor Gericht, wo liegt die Einigungszone? Jede Option bekommt ein Preisschild.",
    fit: "Wenn eine Seite ihre Erfolgsaussichten deutlich überschätzt",
  },
];

// ODR = Online Dispute Resolution. Die vier Typen aus pricing.py (ODR_TYPES).
// Alle "once", aber seit 10.08.2026 gestaffelt: odr 1.900 €, b2b 1.200 €,
// schlichtung und ecommerce je 399 €. Alternativ im Firmen-Abo (Organization).
const odrTypes = [
  {
    title: "Wirtschaftsmediation",
    text: "Gesellschafter, Geschäftspartner, Lieferanten: Konflikte, bei denen die Geschäftsbeziehung überleben soll.",
  },
  {
    title: "Online-Schlichtung",
    text: "Mit Schlichterspruch am Ende – für Fälle, in denen eine Empfehlung von außen den Ausschlag geben muss.",
  },
  {
    title: "E-Commerce & Plattform",
    text: "Streit zwischen Händler und Kunde oder zwischen Plattform und Anbieter, in hoher Stückzahl abwickelbar.",
  },
  {
    title: "B2B-Vertragsstreit",
    text: "Leistungsstörungen, Abnahme, Gewährleistung – geklärt, bevor die Kündigung im Raum steht.",
  },
];

const exampleCases = [
  {
    href: "/cases/trennung-mit-kindern",
    eyebrow: "Trennung mit Kindern",
    title: "Maria & Thomas",
    text: "12 Jahre verheiratet, 2 Kinder. Lösung in 5 Monaten statt 3 Jahre Gericht.",
  },
  {
    href: "/cases/trennung-nach-langer-ehe",
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
    a: "Für private wie geschäftliche Konflikte, bei denen beide Seiten grundsätzlich eine Lösung suchen: Trennung und Scheidung, Nachbarschaftsstreit, Erbe und familiäre Auseinandersetzungen, Verbraucher- und Handwerkerstreit sowie Geschäftskonflikte zwischen Unternehmen (Online Dispute Resolution).",
  },
  {
    q: "Kann ich Hybrid oder Vollservice für jeden Konflikt buchen?",
    a: "Nein. Die Pakete mit Sitzungen bieten wir derzeit nur bei Trennung und Scheidung an. Alle übrigen Konfliktarten laufen über das Verfahren ohne Sitzungen – Nachbarschaft und Verbraucher ab 49 Euro je Partei, Erbstreit pauschal 399 Euro pro Fall, Geschäftskonflikte 1.900 Euro (Gesellschafter, Nachfolge, Team) beziehungsweise 1.200 Euro (B2B-Vertragsstreit).",
  },
  {
    q: "Nach welcher Methode wird mediiert?",
    a: "Standard ist das Harvard-Prinzip: Interessen statt Positionen. Je nach Fall kommen drei weitere Methoden infrage – Shuttle-Mediation bei starker Eskalation, transformative Mediation, wenn die Beziehung bestehen bleibt, und evaluative Mediation, wenn eine Seite ihre Chancen vor Gericht überschätzt. Der Mediator wählt die Methode aus.",
  },
  {
    q: "Was kostet ein Gerichtsverfahren im Vergleich?",
    a: "Das hängt allein vom Streitwert ab, nicht vom Aufwand. Unser Prozesskosten-Rechner wendet die gesetzlichen Tabellen an und stellt das Kostenrisiko den Mediationskosten gegenüber – kostenlos, ohne Anmeldung und mit Fundstelle zu jeder Position.",
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
    "Strukturiertes Mediationsverfahren: Beide Parteien werden getrennt und zeitversetzt durch einen geführten Ablauf gebracht, ein zertifizierter Mediator entscheidet die strittigen Punkte in ein bis zwei Videositzungen. Für Trennung und Scheidung, Nachbarschaft, Erbschaft, Verbraucher- und Geschäftskonflikte (ODR). Nach dem Harvard-Prinzip, ergänzt um Shuttle-, transformative und evaluative Mediation.",
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
          <p className="eyebrow mb-4 text-accent-300">Das Verfahren</p>

          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
            Der Termin ist nicht das Verfahren.{" "}
            <span className="text-accent-300">Die Arbeit passiert davor.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-200">
            Beide Seiten werden getrennt voneinander durch dieselben
            Schritte geführt – Sie müssen nichts formulieren und nichts
            vorbereiten. Der Mediator kommt für die Stellen dazu, an denen es
            einen Menschen braucht: zwei Sitzungen à 60 Minuten statt sechs
            Termine.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/auth/register" className="btn btn-primary">
              Mediation starten
            </Link>
            <Link
              href="/kostenrechner"
              className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Kostenrechner
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

      {/* WARUM DAS ANDERS LAEUFT - der Unterschied zur klassischen Mediation.
          Steht bewusst VOR Harvard und vor den sechs Schritten: Wer das
          Phasenmodell zuerst liest, liest einen Ratgeber. Das Preismodell
          (#varianten) ist der Beleg und wurde deshalb nach oben gezogen. */}
      <section className="section section-base">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="eyebrow mb-4">Warum das anders läuft</div>
            <h2 className="heading-2">Der Termin ist nicht das Verfahren</h2>
            <div className="mt-6 space-y-5 text-lg leading-8 text-neutral-700">
              <p>
                In der klassischen Mediation passiert alles im Termin. Beide
                Seiten sitzen im Raum, tragen vor, hören zu, verhandeln – und
                weil die Uhr läuft, geht ein großer Teil der Zeit für Dinge
                drauf, die keine Verhandlung sind: Sachverhalte sortieren,
                Positionen erklären, Zahlen zusammentragen. Das ist der Grund,
                warum eine Mediation sechs Termine und einen vierstelligen
                Betrag kostet.
              </p>
              <p>
                Hier läuft diese Arbeit vorher – und zwar geführt. Beide Seiten
                gehen getrennt voneinander durch dieselben Schritte: Fragen,
                Auswahlmöglichkeiten, Prioritäten. Kein leeres Textfeld, keine
                Stellungnahme, die man erst formulieren muss. Daraus sortiert
                das Verfahren, worüber Einigkeit besteht und wo der Konflikt
                tatsächlich liegt – meist an weniger Stellen als gedacht.
              </p>
              <p>
                Erst dann kommt der Mediator dazu, und zwar für genau diese
                Stellen: zwei Sitzungen à 60 Minuten, in denen entschieden
                wird, was sich vorher nicht entscheiden lässt. So viele wie
                nötig, so wenige wie möglich.
              </p>
              <p className="font-semibold text-neutral-900">
                Die Struktur ersetzt nicht den Mediator. Sie ersetzt die
                Stunden, in denen er zugehört hat, statt zu vermitteln.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-muted border-y border-neutral-200">
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

      {/* HAUPTSACHE UND NEBENSACHE */}
      {/*
        19.09.2026: Der gewichtete Abgleich stand bisher nur als Mechanismus
        auf /einigung/abgleich. Hier steht das Prinzip dahinter, weil /methode
        die Seite ist, auf der Besucher verstehen wollen, WARUM das Verfahren
        so gebaut ist — nicht nur, wie es abläuft.
      */}
      <section className="section section-base">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="eyebrow mb-4">Worum es wirklich geht</div>
          <h2 className="heading-2">
            Zwei Punkte entscheiden. Dreißig halten auf.
          </h2>
          <p className="mt-6 text-lg leading-8 text-neutral-700">
            In fast jedem Konflikt gibt es zwei oder drei Fragen, an denen
            tatsächlich etwas hängt — und einen langen Rest, an dem sich der
            Streit festfrisst. Der Fernseher. Der Zaunpfahl, acht Zentimeter
            zu weit. Der Tonfall der letzten E-Mail. Diese Nebensachen sind
            nicht belanglos; sie stehen meist stellvertretend für etwas, das
            nie ausgesprochen wurde. Aber sie sind nicht das, worüber man sich
            einigen muss.
          </p>
          <p className="mt-5 text-lg leading-8 text-neutral-700">
            Eine freie Verhandlung kann diese Trennung nicht leisten, weil
            keine Seite den ersten Punkt aufgeben will: Wer zuerst nachgibt,
            verliert. Ein Gerichtsverfahren leistet sie ebenfalls nicht — es
            behandelt alles, was in der Akte steht, mit demselben Ernst und
            derselben Gründlichkeit. Der Mediationsprozess ist genau dafür
            gebaut. Er sortiert zuerst, worüber ohnehin Einigkeit besteht,
            dann die Interessen hinter den Positionen. Übrig bleibt eine kurze
            Liste echter Gegensätze.
          </p>
          <p className="mt-5 text-lg leading-8 text-neutral-700">
            Erst an dieser kurzen Liste setzt der gewichtete Abgleich an. Beide
            Seiten haben dafür ein begrenztes Kontingent und können deshalb
            nicht alles für unverzichtbar erklären. Das ist unbequem — und
            der eigentliche Punkt: Es zwingt jede Seite, ihre Hauptsache zu
            benennen. Sobald das geschehen ist, lässt sich tauschen, statt zu
            streiten.
          </p>
          <div className="mt-8">
            <ArrowLink href="/einigung/abgleich">
              Wie der gewichtete Abgleich funktioniert
            </ArrowLink>
          </div>
        </div>
      </section>

      {/* VARIANTEN-VERGLEICH */}
      <section id="varianten" className="section section-base">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="eyebrow mb-4 justify-center">Drei Wege zur Einigung</div>
            <h2 className="heading-2">So viel Begleitung, wie Ihr Fall braucht</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-700">
              Dasselbe Verfahren – wahlweise ganz ohne Sitzung, mit zwei
              Sitzungen oder durchgehend begleitet. Die Pakete mit Sitzungen
              bieten wir derzeit nur bei Trennung und Scheidung an.
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

                {/* Verfügbarkeit gehört direkt an den Preis: Hybrid und
                    Vollservice gibt es nur bei Trennung & Scheidung. */}
                <p className="mt-3 inline-flex rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
                  {v.availability}
                </p>

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

          <div className="mt-10 flex flex-col items-center gap-4">
            <ArrowLink href="/einigung">
              Warum der Prozess zum Festpreis geht
            </ArrowLink>
            <ArrowLink href="/preise">
              Alle Preise und Leistungen im Detail
            </ArrowLink>
            <ArrowLink href="/kostenrechner">
              Was würde derselbe Streit vor Gericht kosten?
            </ArrowLink>
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

      {/* ROLLEN: WER VERANTWORTET DEN FALL */}
      <section id="rollen" className="section section-strong">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 max-w-2xl">
            <div className="eyebrow mb-4 text-accent-300">Wer macht was</div>
            <h2 className="heading-2 text-white">
              Der Prozess strukturiert. Ein Mensch verantwortet.
            </h2>
            <p className="mt-4 text-lg leading-8 text-neutral-300">
              Medipact ist kein Chatbot, der Ihren Streit „löst“. Der geführte
              Prozess übernimmt die Struktur- und Fleißarbeit – die
              Verantwortung für Ihren Fall trägt immer ein Mensch.
            </p>
          </div>

          <div className="rounded-[2rem] border border-accent-500/30 bg-accent-500/10 p-8 backdrop-blur sm:p-10">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">
              Was der Mediator übernimmt
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
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

          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:p-10">
            <h3 className="text-lg font-bold text-white">
              Und was übernimmt der Prozess?
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-300">
              Themen ordnen, Formulierungen versachlichen, Interessen aus
              Forderungen lösen, strittige Punkte gewichtet abgleichen und die
              Vereinbarung erzeugen. Weil daran auch der Preis hängt, hat das
              eine eigene Seite bekommen – zusammen mit den Grenzen des
              Verfahrens und der Frage, wo und wie KI eingesetzt wird.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-x-8">
              <ArrowLink href="/einigung" tone="light">
                Der Einigungsprozess im Überblick
              </ArrowLink>
              <ArrowLink href="/einigung/ohne-mediator" tone="light">
                Wie weit kommt man ohne Mediator?
              </ArrowLink>
              <ArrowLink href="/einigung/abgleich" tone="light">
                Der gewichtete Abgleich
              </ArrowLink>
              <ArrowLink href="/einigung/gleichbehandlung" tone="light">
                Fairness und KI-Einsatz
              </ArrowLink>
            </div>
          </div>

          <div className="mt-10">
            <ArrowLink href="/ratgeber/was-ist-ein-mediator" tone="light">
              Mehr über die Rolle des Mediators
            </ArrowLink>
          </div>
        </div>
      </section>

      {/* PHASEN IM DETAIL */}
      <section id="phasen" className="section section-muted border-y border-neutral-200">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="mb-16 max-w-2xl">
            <div className="eyebrow mb-4">Die Methode dahinter</div>
            <h2 className="heading-2">Die Mediationsphasen im Detail</h2>
            <p className="mt-4 text-lg text-neutral-700">
              Das Verfahren erfindet die Mediation nicht neu – es verlagert
              nur, wo ihre Arbeit stattfindet. Zugrunde liegt das klassische
              Fünf-Phasen-Modell, ergänzt um eine Phase 0 für Onboarding und
              Einladung, und als Methode das Harvard-Prinzip: Interessen statt
              Positionen, Optionen statt Schuldzuweisungen. Der Rahmen ist fest
              – welche Schritte Ihr Fall in jeder Phase braucht, legt der
              verantwortliche Mediator individuell fest.
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

      {/* METHODEN-VARIANTEN */}
      <section id="methoden" className="section section-base">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 max-w-2xl">
            <div className="eyebrow mb-4">Vier Methoden</div>
            <h2 className="heading-2">Nicht jeder Konflikt braucht denselben Weg</h2>
            <p className="mt-4 text-lg text-neutral-700">
              Das Harvard-Prinzip ist unser Standard, aber nicht immer das
              richtige Werkzeug. Wer sich nicht in einem Raum aushält, braucht
              getrennte Gespräche. Wer die eigenen Chancen vor Gericht
              überschätzt, braucht Zahlen. Der Mediator wählt die Methode zum
              Fall – der Ablauf bleibt derselbe, die Schritte darin ändern sich.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {methodVariants.map((m) => (
              <div
                key={m.name}
                className="rounded-[2rem] border border-neutral-200 bg-white p-8"
              >
                <div className="inline-flex items-center rounded border border-accent-200 bg-accent-50 px-3 py-1.5 text-xs font-semibold uppercase text-accent-700">
                  {m.claim}
                </div>
                <h3 className="mt-5 text-xl font-bold text-neutral-900">
                  {m.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                  {m.text}
                </p>
                <p className="mt-5 border-t border-neutral-200 pt-4 text-sm text-neutral-700">
                  <span className="font-semibold text-neutral-900">Passt: </span>
                  {m.fit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GESCHÄFTSKONFLIKTE / ODR */}
      <section id="geschaeft" className="section section-muted border-y border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 max-w-2xl">
            <div className="eyebrow mb-4">Auch für Unternehmen</div>
            <h2 className="heading-2">Geschäftskonflikte online beilegen</h2>
            <p className="mt-4 text-lg text-neutral-700">
              Derselbe Prozess funktioniert zwischen Unternehmen – dort
              allerdings unter dem Namen Online Dispute Resolution. Der
              Unterschied ist weniger die Methode als das Tempo: Ein blockierter
              Auftrag oder ein Gesellschafter-Patt kostet jeden Tag Geld, den er
              ungelöst bleibt.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {odrTypes.map((o) => (
              <div
                key={o.title}
                className="rounded-[2rem] border border-neutral-200 bg-white p-7"
              >
                <h3 className="text-lg font-bold text-neutral-900">{o.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                  {o.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-[2rem] bg-neutral-900 p-8 sm:p-10">
            <h3 className="text-xl font-bold text-white">
              Für Unternehmen mit vielen Fällen
            </h3>
            <p className="mt-3 max-w-3xl leading-7 text-neutral-300">
              Ein einzelnes Massenverfahren – Online-Schlichtung oder
              E-Commerce-Streit – kostet pauschal 399 € und wird von der Seite
              bezahlt, die es anlegt. Wer regelmäßig Streitfälle abzuwickeln
              hat – Fluggastrechte, Mietforderungen, E-Commerce-Reklamationen –
              nutzt stattdessen ein Firmen-Abo, in dem die Fälle enthalten sind.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="/konflikte/odr" className="btn btn-primary">
                Geschäftskonflikte im Detail
              </Link>
              <Link
                href="/kontakt"
                className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:border-accent-300 hover:text-accent-300"
              >
                Firmen-Abo anfragen
              </Link>
            </div>
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
            Mediation starten
          </Link>
        </div>
      </section>
    </>
  );
}
