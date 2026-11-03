import { REGISTRIEREN_URL } from "@/lib/nutzerbereich";
import type { Metadata } from "next";
import Link from "next/link";
import { ImagePinHero } from "@/app/components/ui/ImagePinHero";
import { StarterpaketSection } from "@/app/components/StarterpaketSection";
import { starterpaketInhaltDe } from "@/app/content/starterpaket";
import { aboutGrundsaetze } from "@/app/content/aboutPage";
import { JsonLd } from "@/app/components/JsonLd";
import { DidYouKnowSection } from "@/app/components/ui/DidYouKnowSection";
import { EinladungsAssistent } from "@/app/components/EinladungsAssistent";
import { ArrowLink } from "@/app/components/ui/ArrowLink";
import { SectionNav } from "@/app/components/ui/SectionNav";
import whiteboardPhoto from "../../fotos/whiteboard-erklaerung.jpg";
import { pageMetadata } from "@/lib/seo";
import {
  KENNENLERN_ANZAHL,
  STARTPAKET_DANACH,
  STARTPAKET_NAME,
  STARTPAKET_PREIS,
  STARTPAKET_PREIS_EUR,
  STARTERPAKET_URL,
} from "@/lib/mediatorVermittlung";

export const metadata: Metadata = pageMetadata({
  title: "Ablauf der Mediation: Phasen, Starterpaket und Wege | medipact",
  description: `Wie Mediation abläuft, wie Sie mit dem Starterpaket (${STARTPAKET_PREIS} pro Fall) einsteigen und Mediator:innen kennenlernen – und welche Wege danach offenstehen: online ab 49 € je Partei oder mit Sitzungen.`,
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

// Die Mediationsphasen, wie sie auch in der Plattform ablaufen (Einleitung bis
// Abschluss, plus Onboarding als Vor-Phase). Inhaltlich angelehnt an das
// klassische Phasenmodell der Mediation – ausführlich erklärt im Ratgeber.
//
// 03.11.2026: Die frühere Liste "In 6 Schritten zur möglichen Einigung"
// (workflowSteps) ist hier aufgegangen – sie erzählte dieselben Phasen ein
// zweites Mal. `starter` markiert die Phasen, die das Starterpaket abdeckt
// (STARTPAKET_PHASEN in lib/mediatorVermittlung.ts: Einladung, Einleitung,
// Themen, Interessen); ändern sich die dort, hier nachziehen. Die
// "Auf der Plattform"-Texte zu Phase 0, 2 und 6 stammen aus dem früheren
// Ablauf auf /about (umgezogen 03.11.2026).
const mediationPhases = [
  {
    num: "0",
    starter: true,
    title: "Onboarding & Einladung",
    text: "Sie beschreiben kurz, worum es geht, die Gegenseite wird sachlich eingeladen – ohne öffentlichen Druck, ohne bloßstellende Konfrontation. Erst wenn beide Seiten freiwillig dabei sind, beginnt die eigentliche Mediation.",
    platform: "Sie schildern die Situation zuerst allein. Die Einladung an die andere Seite ist sachlich formuliert und enthält die Vorwürfe nicht, mit denen ein solches Gespräch sonst beginnt. Fall anlegen und Situation schildern ist kostenlos.",
  },
  {
    num: "1",
    starter: true,
    title: "Einleitung",
    text: "Der Rahmen wird geklärt: Wie läuft das Verfahren ab, welche Regeln gelten, was bleibt vertraulich? Beide Seiten wissen von Anfang an, worauf sie sich einlassen.",
    platform: "Gesprächsregeln, Ablauf und Vertraulichkeit werden transparent festgehalten – für beide Seiten gleich.",
  },
  {
    num: "2",
    starter: true,
    title: "Themensammlung",
    text: "Beide Seiten schildern aus ihrer Sicht, welche Themen offen sind – zunächst ohne Bewertung. Emotionen, Forderungen und eigentliche Anliegen werden getrennt. Oft zeigt sich: Hinter einem großen Streit stecken mehrere klar benennbare Punkte.",
    platform: "Beide Seiten gehen dieselben Schritte, jeweils dann, wenn es passt. Antworten werden erst gegenübergestellt, wenn beide geliefert haben – niemand kann sich an der anderen Seite ausrichten. Daraus entsteht eine gemeinsame Themenliste.",
  },
  {
    num: "3",
    starter: true,
    title: "Interessenklärung",
    text: "Das Herzstück: Hinter jeder Forderung steckt ein Interesse – ein Bedürfnis, eine Sorge, ein Wunsch. Positionen schließen sich oft aus, Interessen lassen sich meist vereinbaren.",
    platform: "Gezielte Fragen helfen, vom „Was fordere ich?“ zum „Worum geht es mir wirklich?“ zu kommen.",
  },
  {
    num: "4",
    title: "Lösungsoptionen",
    text: "Jetzt werden Ideen entwickelt – möglichst viele, zunächst ohne Bewertung. Ziel sind Lösungen, die mehrere Interessen gleichzeitig erfüllen, statt eines Kompromisses, mit dem niemand zufrieden ist.",
    platform: "Aus den geklärten Interessen entstehen konkrete Vorschläge, die beide Seiten prüfen, anpassen oder ablehnen können.",
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
    platform: "Wer macht was bis wann steht am Ende da, weil es während des Verfahrens entstanden ist – nicht weil es jemand hinterher gegen Honorar aufsetzt. Beide Seiten bestätigen dasselbe Dokument.",
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
    text: "Zwischenergebnisse und Vereinbarungen werden geprüft, bevor es weitergeht. Das Verfahren arbeitet zu – die Verantwortung bleibt beim Menschen.",
  },
  {
    title: "Persönliche Gespräche",
    text: "Im Starterpaket lernen Sie Mediator:innen in Kennenlerngesprächen persönlich kennen. In Hybrid und Vollservice führt ein zertifizierter Mediator die entscheidenden Sitzungen – per Video, zu zweit oder zu dritt.",
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
    text: "Das Verfahren bereitet alles vor, der Mediator klärt mit Ihnen die strittigen Punkte – per Video, zu zweit oder zu dritt. Die Entscheidung bleibt bei Ihnen.",
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

// Vergleich Mediation / Anwalt / Gericht – bis 03.11.2026 auf /about
// (comparisonPlans), jetzt hier, weil er erklärt, was Mediation von den
// anderen Wegen unterscheidet.
const vergleich = [
  {
    title: "medipact",
    status: "Festpreis, ab 49 €",
    features: [
      "Preis steht vor dem Start fest",
      "beide Seiten arbeiten asynchron",
      "Ergebnis wird gemeinsam beschlossen",
      "Vereinbarung entsteht im Verfahren",
      "menschlicher Mediator zubuchbar",
      "Rechtsweg bleibt offen",
    ],
    featured: true,
  },
  {
    title: "Anwaltlicher Streit",
    status: "Positionsgetrieben",
    features: [
      "Kommunikation läuft über Dritte",
      "Kosten hängen am Streitwert",
      "Verhandlung um Positionen, nicht Interessen",
      "richtig und nötig bei klaren Rechtsfragen",
    ],
    featured: false,
  },
  {
    title: "Gerichtsverfahren",
    status: "Fremdbestimmt",
    features: [
      "ein Richter entscheidet, nicht Sie",
      "dauert in der Regel Monate bis Jahre",
      "belastet die Beziehung zusätzlich",
      "unverzichtbar, wenn keine Einigung möglich ist",
    ],
    featured: false,
  },
];

// Unternavigation (SectionNav). Reihenfolge = Reihenfolge auf der Seite;
// "Zwei Punkte entscheiden" und Geschäftskonflikte haben bewusst keinen
// eigenen Eintrag (gehören zu "Online-Verfahren" bzw. eigene Seite).
const sectionNav = [
  { id: "mediation", label: "Was ist Mediation" },
  { id: "vergleich", label: "Vergleich" },
  { id: "phasen", label: "Phasen" },
  { id: "starterpaket", label: "Starterpaket" },
  { id: "varianten", label: "Wege & Preise" },
  { id: "online-verfahren", label: "Online-Verfahren" },
  { id: "rollen", label: "Wer macht was" },
  { id: "methoden", label: "Methoden" },
  { id: "fallbeispiele", label: "Fallbeispiele" },
  { id: "faq", label: "FAQ" },
];

const faqs = [
  {
    q: "Was ist das Starterpaket?",
    a: `Der Einstieg für alle, die erst verstehen wollen, wie Mediation arbeitet, bevor sie sich festlegen. Sie gehen mit der anderen Seite die ersten Phasen digital durch – Einleitung, Themen, Interessen – und führen danach bis zu ${KENNENLERN_ANZAHL} Kennenlerngespräche mit Mediator:innen Ihrer Wahl. Es kostet ${STARTPAKET_PREIS} pro Fall, geteilt zwischen beiden Seiten, und wird erst fällig, wenn die andere Seite zusagt. Eine erste Fallanalyse ist im Preis enthalten.`,
  },
  {
    q: "Kann im Starterpaket schon eine Einigung entstehen?",
    a: "Nein, bewusst nicht. Das Starterpaket klärt, ob zwischen Ihnen eine Lösung erreichbar ist und mit wem Sie sie erarbeiten wollen. Die Einigung selbst entsteht danach – im Online-Verfahren oder in Sitzungen mit der Mediatorin, die Sie gewählt haben.",
  },
  {
    q: "Was passiert nach dem Starterpaket?",
    a: STARTPAKET_DANACH,
  },
  {
    q: "Muss ich mit dem Starterpaket anfangen?",
    a: "Nein. Wer schon weiß, dass das geführte Online-Verfahren passt, startet direkt damit. Das Starterpaket ist für alle gedacht, die erst sehen wollen, wie Mediation funktioniert, und die Person kennenlernen möchten, mit der sie den Konflikt klären.",
  },
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
  name: "Mediation",
  provider: {
    "@type": "Organization",
    name: "medipact",
    url: "https://medipact.de",
  },
  serviceType: "Mediation",
  description:
    "Strukturiertes Mediationsverfahren: Beide Parteien werden getrennt und zeitversetzt durch einen geführten Ablauf gebracht, auf Wunsch klärt ein zertifizierter Mediator die strittigen Punkte mit ihnen in Videositzungen. Einstieg über das Starterpaket mit Kennenlerngesprächen möglich. Für Trennung und Scheidung, Nachbarschaft, Erbschaft, Verbraucher- und Geschäftskonflikte (ODR). Nach dem Harvard-Prinzip, ergänzt um Shuttle-, transformative und evaluative Mediation.",
  areaServed: {
    "@type": "Country",
    name: "Germany",
  },
  availableLanguage: "German",
  url: "https://medipact.de/methode",
  offers: [
    {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: "49",
      description: "Online-Mediationsverfahren ab €49 je Partei",
    },
    {
      "@type": "Offer",
      name: STARTPAKET_NAME,
      priceCurrency: "EUR",
      price: STARTPAKET_PREIS_EUR,
      description: "Starterpaket pro Fall, geteilt zwischen beiden Seiten",
    },
  ],
};

// Seitenaufbau seit 03.11.2026: erklären statt verkaufen. Reihenfolge folgt
// der Frage des Besuchers – Was ist Mediation? Wie läuft sie ab? Wie fange
// ich an (Starterpaket)? Welcher Weg danach? Erst dann das Warum des
// Online-Verfahrens, Methoden, Rollen. Nichts ist dabei weggefallen: Die
// sechs Schritte stecken in den Phasen, der ODR-Block ist ein Verweis auf
// /konflikte/odr (dort vollständig, inkl. Preisen und Firmen-Abo).
export default function MethodePage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={serviceSchema} />

      <ImagePinHero image={whiteboardPhoto} imageAlt="Mediatorin erklärt den strukturierten Mediationsprozess">
        <div className="container max-w-4xl">
          <p className="eyebrow mb-4 text-accent-300">Die Methode</p>

          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
            So funktioniert Mediation.{" "}
            <span className="text-accent-300">Erst verstehen, dann entscheiden.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-200">
            In einer Mediation finden Sie die Lösung selbst – begleitet von
            einer Mediatorin, die nicht entscheidet. Hier sehen Sie, wie die
            Phasen ablaufen, wie Sie mit dem Starterpaket einsteigen und
            welche Wege danach offenstehen: online in Ihrem Tempo oder mit
            persönlichen Sitzungen.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="#starterpaket" className="btn btn-primary">
              Zum Starterpaket
            </Link>
            <Link
              href={REGISTRIEREN_URL}
              className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Direkt online starten
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

      {/* Nav und Abschnitte teilen sich dieses div, damit die Leiste am
          Ende der FAQ aufhört zu kleben statt bis in den Footer. */}
      <div>
        <SectionNav items={sectionNav} />

        {/* WAS MEDIATION IST - Grundsätze kommen aus aboutGrundsaetze
            (app/content/aboutPage.ts), gegen das Mediationsgesetz geprüft.
            Hier die Langfassung; /about zeigt nur die Begriffe und verlinkt
            auf #mediation. */}
        <section id="mediation" className="section section-muted border-y border-neutral-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="eyebrow mb-4">Was Mediation ist</div>
              <h2 className="heading-2">Niemand entscheidet für Sie.</h2>
              <p className="mt-6 text-lg leading-8 text-neutral-700">
                Mediation ist ein vertrauliches, freiwilliges Verfahren, in dem
                beide Seiten mit Unterstützung einer neutralen Person eine
                eigene Lösung erarbeiten. Anders als ein Gericht fällt die
                Mediatorin kein Urteil, und anders als ein Anwalt vertritt sie
                keine Seite. Sie sorgt dafür, dass das Gespräch Struktur hat –
                die Lösung gehört den Beteiligten.
              </p>
              <p className="mt-5 text-lg leading-8 text-neutral-700">
                {aboutGrundsaetze.text}
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {aboutGrundsaetze.items.map((g) => (
                <div
                  key={g.letter}
                  className="rounded-[2rem] border border-neutral-200 bg-white p-7"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-600 text-base font-black text-white">
                    {g.letter}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-neutral-900">
                    {g.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {g.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              <ArrowLink href="/ratgeber/was-ist-mediation">
                Was ist Mediation? Ausführlich im Ratgeber
              </ArrowLink>
              <ArrowLink href="/about" tone="muted">
                Warum es medipact gibt
              </ArrowLink>
            </div>
          </div>
        </section>

        {/* VERGLEICH - von /about umgezogen (03.11.2026). */}
        <section id="vergleich" className="section section-strong">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-12 max-w-2xl">
              <div className="eyebrow mb-4 text-accent-300">Im Vergleich</div>
              <h2 className="heading-2 text-white">
                Der bessere erste Schritt vor der Eskalation
              </h2>
              <p className="mt-4 text-lg leading-8 text-neutral-300">
                Mediation ist kein Kampfmodus und keine Rechtsdurchsetzung. Es
                ist der Weg, der offen bleibt, solange beide Seiten noch etwas
                voneinander wollen.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {vergleich.map((plan) => (
                <div
                  key={plan.title}
                  className={`rounded-[2rem] border p-8 ${
                    plan.featured
                      ? "border-accent-600/40 bg-neutral-800/70"
                      : "border-neutral-700 bg-neutral-800/50"
                  }`}
                >
                  <h3 className="text-xl font-bold text-white">{plan.title}</h3>
                  <div
                    className={`mt-1 text-sm font-medium ${
                      plan.featured ? "text-accent-300" : "text-neutral-400"
                    }`}
                  >
                    {plan.status}
                  </div>
                  <div className="my-6 h-px bg-white/10" />
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-neutral-300"
                      >
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                            plan.featured
                              ? "bg-accent-500 text-white"
                              : "bg-neutral-700 text-neutral-400"
                          }`}
                        >
                          ✓
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <ArrowLink href="/kostenrechner" tone="light">
                Was würde Ihr Streit vor Gericht kosten?
              </ArrowLink>
            </div>
          </div>
        </section>

        {/* PHASEN - seit 03.11.2026 zusammen mit den früheren "6 Schritten".
            Die Phasen 0–3 tragen das Starterpaket-Badge: So sieht man, wie
            weit der Einstieg reicht, bevor das Paket selbst erklärt wird. */}
        <section id="phasen" className="section section-base">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <div className="mb-16 max-w-2xl">
              <div className="eyebrow mb-4">Der Ablauf</div>
              <h2 className="heading-2">Die Phasen einer Mediation</h2>
              <p className="mt-4 text-lg text-neutral-700">
                Zugrunde liegt das klassische Fünf-Phasen-Modell, ergänzt um
                eine Phase 0 für Onboarding und Einladung, und als Methode das
                Harvard-Prinzip: Interessen statt Positionen, Optionen statt
                Schuldzuweisungen. Der Rahmen ist fest – welche Schritte Ihr
                Fall in jeder Phase braucht, legt der verantwortliche Mediator
                individuell fest.
              </p>
              <p className="mt-4 text-lg text-neutral-700">
                Die ersten vier Phasen können Sie mit dem Starterpaket
                gemeinsam mit der anderen Seite erleben, bevor Sie sich für
                einen Weg entscheiden.
              </p>
            </div>

            <ol className="relative space-y-8 border-l border-neutral-200 pl-8 sm:pl-10">
              {mediationPhases.map((phase) => (
                <li key={phase.num} className="relative">
                  <span className="absolute -left-[45px] flex h-9 w-9 items-center justify-center rounded-full border border-accent-200 bg-accent-50 text-sm font-black text-accent-700 sm:-left-[53px]">
                    {phase.num}
                  </span>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="text-lg font-bold text-neutral-900">
                      {phase.title}
                    </h3>
                    {phase.starter && (
                      <span className="rounded-full bg-accent-600 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white">
                        Im Starterpaket
                      </span>
                    )}
                  </div>
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
            </div>

            {/* Konflikt-Logbuch & Journal (kostenlos, vor der Mediation) */}
            <div className="mt-12 rounded-[2rem] border border-accent-200 bg-accent-50/60 p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700">
                    Noch vor der Mediation
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

        {/* EINSTIEG - dieselbe Sektion wie auf Startseite und /preise, Texte
            aus app/content/starterpaket.ts (Zahlen aus lib/mediatorVermittlung). */}
        <StarterpaketSection inhalt={starterpaketInhaltDe} />

        {/* WEGE DANACH - Pakete spiegeln backend/app/pricing.py (siehe
            Kommentar an `variants`). */}
        <section id="varianten" className="section section-base">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-16 text-center">
              <div className="eyebrow mb-4 justify-center">Die Wege zur Einigung</div>
              <h2 className="heading-2">So viel Begleitung, wie Ihr Fall braucht</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-700">
                Ob nach dem Starterpaket oder direkt: Die Einigung erarbeiten
                Sie wahlweise ganz ohne Sitzung, mit zwei Sitzungen oder
                durchgehend begleitet. Die Pakete mit Sitzungen bieten wir
                derzeit nur bei Trennung und Scheidung an.
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

            <div className="mx-auto mt-8 max-w-3xl rounded-[2rem] border border-accent-200 bg-accent-50/60 p-6 sm:p-8">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700">
                Nach dem Starterpaket
              </div>
              <p className="mt-2 leading-relaxed text-neutral-700">
                {STARTPAKET_DANACH}
              </p>
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

        {/* WARUM DAS ONLINE-VERFAHREN ANDERS LAEUFT - Prosa und die drei
            Gründe, früher zwei getrennte Sektionen direkt unter dem Hero. */}
        <section id="online-verfahren" className="section section-muted border-y border-neutral-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <div className="eyebrow mb-4">Das Online-Verfahren</div>
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
                  Im Online-Verfahren läuft diese Arbeit vorher – und zwar
                  geführt. Beide Seiten gehen getrennt voneinander durch
                  dieselben Schritte: Fragen, Auswahlmöglichkeiten, Prioritäten.
                  Kein leeres Textfeld, keine Stellungnahme, die man erst
                  formulieren muss. Daraus sortiert das Verfahren, worüber
                  Einigkeit besteht und wo der Konflikt tatsächlich liegt – meist
                  an weniger Stellen als gedacht.
                </p>
                <p>
                  Wo es einen Menschen braucht, kommt der Mediator für genau
                  diese Stellen dazu: zwei Sitzungen à 60 Minuten, in denen Sie
                  gemeinsam klären, was sich vorher nicht klären ließ. So viele
                  wie nötig, so wenige wie möglich.
                </p>
                <p className="font-semibold text-neutral-900">
                  Die Struktur ersetzt nicht den Mediator. Sie ersetzt die
                  Stunden, in denen er zugehört hat, statt zu vermitteln.
                </p>
              </div>
            </div>

            <div className="mt-16 grid gap-10 sm:grid-cols-3">
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
                Verfahrens und der Frage, wie Fairness technisch abgesichert
                wird.
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
                  Fairness und Gleichbehandlung
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

        {/* METHODEN-VARIANTEN */}
        <section id="methoden" className="section section-muted border-y border-neutral-200">
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

        {/* GESCHÄFTSKONFLIKTE / ODR - seit 03.11.2026 nur noch Verweis: Die
            Verfahrensarten, Preise und das Firmen-Abo stehen vollständig auf
            /konflikte/odr (app/content/odrPage.ts). */}
        <section id="geschaeft" className="section section-base">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="rounded-[2rem] bg-neutral-900 p-8 sm:p-10">
              <div className="eyebrow mb-4 text-accent-300">Auch für Unternehmen</div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Geschäftskonflikte online beilegen
              </h2>
              <p className="mt-4 max-w-3xl leading-7 text-neutral-300">
                Derselbe Prozess funktioniert zwischen Unternehmen – dort
                unter dem Namen Online Dispute Resolution. Der Unterschied ist
                weniger die Methode als das Tempo: Ein blockierter Auftrag oder
                ein Gesellschafter-Patt kostet jeden Tag Geld.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {odrTypes.map((o) => (
                  <li
                    key={o.title}
                    title={o.text}
                    className="rounded-full border border-white/15 px-3 py-1 text-sm text-neutral-200"
                  >
                    {o.title}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-4">
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
        <section id="fallbeispiele" className="section section-muted border-y border-neutral-200">
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

      </div>

      <DidYouKnowSection />

      <section className="section section-strong text-center">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl leading-tight">
            Bereit für den ersten Schritt?
          </h2>
          <p className="mt-5 text-lg leading-8 text-neutral-300">
            Erst kennenlernen mit dem Starterpaket – oder direkt mit dem
            Online-Verfahren beginnen. Vertraulich und in Ihrem Tempo.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={STARTERPAKET_URL} className="btn btn-primary">
              Starterpaket buchen
            </Link>
            <Link
              href={REGISTRIEREN_URL}
              className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:border-accent-300 hover:text-accent-300"
            >
              Online-Verfahren starten
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
