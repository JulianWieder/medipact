// Suchsprache dieser Seite (GSC, 3 Monate, Stand 05.08.2026):
// Vier der sieben Queries fragen nach dem *Mediator*, nicht nach der
// Mediation — "was kostet ein mediator pro stunde" (Pos. 34,5, die beste
// der Seite), "mediator stundensatz" (58,0), "was kostet ein mediator",
// "scheidung mediator kosten" (65,0). Dazu "kosten mediation" (58,5),
// "mediation kosten" (87,5), "mediationskosten" (39,0). Titel, H1 und die
// oberen H2 tragen deshalb beide Wortfamilien.
//
// ACHTUNG Stundensätze: Die Spannen unten stammen aus Sekundärquellen
// (Mediations- und Anbieterportale, u. a. mit Verweis auf Erhebungen des
// Bundesverbands Mediation). Sie decken sich über mehrere unabhängige
// Quellen, sind aber nicht amtlich. Vor Veröffentlichung gegenlesen und
// jährlich nachziehen — dieselbe Vorsicht wie bei der 80-Prozent-Angabe in
// scheidung-mediator-kosten.ts. Die medipact-Preise (49 € Einstieg pro
// Partei) stammen dagegen aus backend/app/pricing.py und sind belastbar.

import type { RatgeberArticle } from "./types";

export const article: RatgeberArticle = {
  slug: "mediation-kosten",
  category: "Mediation",
  title: "Was kostet ein Mediator? Kosten und Stundensätze im Überblick",
  metaTitle: "Mediation Kosten: Was kostet ein Mediator? | medipact",
  // Die Description trägt bewusst konkrete Zahlen: Wer "was kostet ein
  // mediator pro stunde" googelt, sucht einen Betrag. Ein Snippet ohne Zahl
  // verliert den Klick an Wettbewerber, die eine nennen — bei 32
  // Impressionen und 1 Klick war genau das der Fall.
  description:
    "Was kostet ein Mediator pro Stunde? Übliche Stundensätze von 150–250 €, Pauschalen und Gesamtkosten – online bei medipact ab 49 € pro Partei.",
  eyebrow: "Ratgeber · Mediation",
  updated: "2026-08-05",
  readingMinutes: 8,
  intro:
    "Ein Mediator kostet bei privaten Konflikten üblicherweise 150 bis 250 Euro pro Stunde, in der Wirtschaftsmediation deutlich mehr. Was am Ende zusammenkommt, hängt aber weniger am Stundensatz als an der Zahl der Sitzungen. Dieser Artikel zeigt die üblichen Stundensätze und Preismodelle, womit Sie insgesamt rechnen müssen, wer die Kosten trägt und wie Mediation im Vergleich zum Gericht abschneidet.",
  blocks: [
    { type: "heading", text: "Was kostet ein Mediator pro Stunde?" },
    {
      type: "paragraph",
      text: "Am häufigsten rechnen Mediatorinnen und Mediatoren nach Stundensatz ab. Für private Konflikte – Familie, Erbe, Nachbarschaft – liegen die üblichen Sätze bei etwa 150 bis 250 Euro pro Stunde. In der Wirtschaftsmediation ist die Spanne deutlich höher: Dort sind 250 bis 400 Euro pro Stunde verbreitet, bei komplexen Verfahren auch mehr. Für mehrtägige Verfahren werden statt Stundensätzen oft Tagessätze vereinbart, die je nach Umfang im vierstelligen Bereich liegen.",
    },
    {
      type: "table",
      caption:
        "Übliche Stundensätze für Mediatorinnen und Mediatoren in Deutschland nach Konfliktart",
      headers: ["Bereich", "Üblicher Stundensatz", "Wer zahlt"],
      rows: [
        [
          "Familien- und Erbmediation",
          "ca. 150–250 € pro Stunde",
          "beide Parteien gemeinsam, meist hälftig",
        ],
        [
          "Nachbarschaft und Verbraucher",
          "ca. 120–200 € pro Stunde",
          "beide Parteien gemeinsam, meist hälftig",
        ],
        [
          "Wirtschaftsmediation",
          "ca. 250–400 € pro Stunde, oft zzgl. USt.",
          "die beteiligten Unternehmen",
        ],
      ],
    },
    {
      type: "callout",
      text: "Wichtig: Der Stundensatz gilt für die gemeinsame Sitzung, nicht pro Person. Anders als beim Anwalt zahlen Sie nicht jeder eine eigene Rechnung für eigene Beratung – die Parteien teilen sich in der Regel eine Rechnung.",
    },
    {
      type: "heading",
      text: "Wovon hängt der Stundensatz des Mediators ab?",
    },
    {
      type: "paragraph",
      text: "Die Spanne ist breit, und das hat Gründe: Ausbildung und Zertifizierung schlagen sich im Satz nieder, ebenso die Region – in Großstädten liegen die Sätze spürbar über dem Niveau ländlicher Gegenden. Dazu kommt die Komplexität des Falls. Ein Mediator, der neben der Mediationsausbildung noch juristische oder betriebswirtschaftliche Expertise mitbringt, ruft bei entsprechend gelagerten Konflikten mehr auf.",
    },
    {
      type: "paragraph",
      text: "Entscheidender für Ihre Rechnung ist aber etwas anderes: die Zahl der Sitzungen. Ein Verfahren mit einem klar umrissenen Thema ist oft nach wenigen Terminen erledigt. Bei mehreren offenen Streitpunkten summieren sich private Mediationen schnell auf einen vierstelligen Gesamtbetrag – und zwar unabhängig davon, ob der Stundensatz bei 150 oder 200 Euro liegt. Wer die Kosten begrenzen will, achtet deshalb nicht auf den Stundensatz, sondern auf die Struktur des Verfahrens.",
    },
    { type: "heading", text: "Welche Abrechnungsmodelle gibt es?" },
    {
      type: "paragraph",
      text: "Neben der Abrechnung pro Stunde gibt es Pauschalpreise für ein komplettes Verfahren. Sie machen die Kosten planbar und nehmen den Druck, in jeder Sitzung auf die Uhr zu schauen. Online-Mediation ist in der Regel am günstigsten, weil Raum- und Anfahrtskosten wegfallen und die Terminfindung nicht zum Verfahrensbestandteil wird.",
    },
    {
      type: "list",
      items: [
        "Stundensatz: Abrechnung nach tatsächlichem Zeitaufwand.",
        "Pauschale: Fester Preis für das gesamte Verfahren – gut kalkulierbar.",
        "Online-Mediation: In der Regel günstiger, da kein Vor-Ort-Aufwand anfällt.",
      ],
    },
    {
      type: "table",
      caption:
        "Abrechnungsmodelle der Mediation im Vergleich: Kostentreiber, Planbarkeit und wofür sich das Modell eignet",
      headers: ["Modell", "Kostentreiber", "Planbarkeit", "Passt bei"],
      rows: [
        [
          "Stundensatz",
          "Zahl und Länge der Sitzungen",
          "Offen – die Summe steht erst am Ende fest",
          "Konflikten mit unklarem Umfang",
        ],
        [
          "Pauschale",
          "Fester Preis für das ganze Verfahren",
          "Hoch – der Betrag ist vorab bekannt",
          "klar umrissenen Themen",
        ],
        [
          "Online-Pauschale (medipact)",
          "Konflikttyp und gebuchte Zusatzleistungen",
          "Hoch – ab 49 € pro Partei, vorab sichtbar",
          "allen Konflikten, die sich digital klären lassen",
        ],
        [
          "Gerichtsverfahren",
          "Streitwert (Gerichts- und Anwaltskosten)",
          "Gering – hängt an Instanzen und Dauer",
          "Fällen, in denen ein Urteil unvermeidbar ist",
        ],
      ],
    },
    {
      type: "cta",
      text: "Kosten für Ihren Fall berechnen",
      href: "/kostenrechner",
    },
    { type: "heading", text: "Was kostet eine Mediation insgesamt?" },
    {
      type: "paragraph",
      text: "Die Gesamtkosten ergeben sich aus Stundensatz mal Anzahl der Sitzungen. Wie viele Sitzungen nötig sind, hängt stark vom Konflikt ab: Ein klar umrissenes Thema ist oft in wenigen Sitzungen gelöst. Bei mehreren Streitpunkten kommen erfahrungsgemäß mehrere Termine à zwei bis drei Stunden zusammen – rechnerisch landet eine private Mediation damit häufig im Bereich von zwei- bis knapp fünftausend Euro für beide Parteien zusammen. Ein verbindlicher Betrag lässt sich seriös nur im Einzelfall nennen; lassen Sie sich vorab ein transparentes Angebot geben.",
    },
    // Abgrenzung zum Spezialartikel: "scheidung mediator kosten" ist die
    // impressionsstärkste Query DIESER Seite (4 Impressionen, Pos. 65) —
    // obwohl es dafür einen eigenen, ausführlicheren Artikel gibt. Google
    // ist sich also nicht sicher, welche Seite das Thema besitzt. Der
    // Verweis macht die Zuständigkeit für Leser und Crawler eindeutig.
    {
      type: "callout",
      text: "Sie stehen vor einer Trennung oder Scheidung? Dort gelten eigene Preismodelle und ein anderer Vergleichsmaßstab (Anwalt statt Gericht). Die Details stehen im Ratgeber „Scheidung mit Mediator: Was kostet das?“ – dieser Artikel bleibt beim allgemeinen Überblick.",
    },
    {
      type: "cta",
      text: "Scheidung mit Mediator: Kosten im Detail",
      href: "/ratgeber/scheidung-mediator-kosten",
    },
    {
      type: "callout",
      text: "Tipp: Klären Sie vor Beginn, wie abgerechnet wird, ob ein Erstgespräch kostenlos ist und ob es eine Ober­grenze gibt. So vermeiden Sie Überraschungen.",
    },
    { type: "heading", text: "Wer trägt die Kosten der Mediation?" },
    {
      type: "paragraph",
      text: "In der Regel teilen sich die Konfliktparteien die Kosten – häufig je zur Hälfte, manchmal auch nach einem anderen vereinbarten Schlüssel. Weil beide Seiten vom Ergebnis profitieren, ist die hälftige Teilung der übliche Weg. Die genaue Aufteilung wird zu Beginn vereinbart.",
    },
    // "mediationskosten" als ein Wort ist eine eigene Query (Pos. 39,0) und
    // kam im Artikel nirgends vor — Komposita zählen für Google nicht
    // automatisch als Treffer für ihre Bestandteile.
    { type: "heading", text: "Mediationskosten im Vergleich: Gericht, klassische Mediation oder medipact" },
    {
      type: "paragraph",
      text: "Am teuersten ist fast immer der Weg vor Gericht. Gerichts- und Anwaltskosten richten sich nach dem Streitwert und summieren sich schnell auf mehrere Tausend Euro – bei hohen Streitwerten deutlich mehr. Dazu kommen eine Verfahrensdauer, die sich über Jahre ziehen kann, und ein öffentliches Verfahren, das die Beziehung der Beteiligten oft endgültig zerrüttet. Gerade bei Familien, Nachbarn oder Geschäftspartnern, die sich weiter begegnen, wiegt das schwer.",
    },
    {
      type: "paragraph",
      text: "Eine klassische Mediation vor Ort ist günstiger als ein Prozess – aber ebenfalls mit spürbaren Kosten verbunden. Bei Abrechnung nach Stundensatz und mehreren Sitzungen kommt schnell ein vierstelliger Betrag zusammen. Sie ist fair, vertraulich und beziehungserhaltend, aber eben nicht billig.",
    },
    {
      type: "paragraph",
      text: "medipact liegt preislich deutlich unter beiden Wegen: Weil das Verfahren strukturiert und online abläuft, entfällt die offene Stundenabrechnung, und der Preis ist von Anfang an transparent und planbar. Ehrlich bleiben wir dabei trotzdem – kostenlos ist auch medipact nicht. Aber Sie zahlen einen klaren, überschaubaren Betrag statt der offenen Kosten eines Prozesses oder einer klassischen Vor-Ort-Mediation.",
    },
    {
      type: "cta",
      text: "Aktuelle Preise ansehen",
      href: "/preise",
    },
  ],
  faq: [
    // Erste beide Fragen wörtlich die stärksten Queries der Seite
    // ("was kostet ein mediator pro stunde" Pos. 34,5, "mediator
    // stundensatz" 58,0). Erster Satz jeweils mit Zahl – das ist das
    // Format, das Google für Featured Snippets übernimmt.
    {
      question: "Was kostet ein Mediator pro Stunde?",
      answer:
        "Bei privaten Konflikten liegen die üblichen Stundensätze bei etwa 150 bis 250 Euro, in der Wirtschaftsmediation bei 250 bis 400 Euro. Der Satz gilt für die gemeinsame Sitzung, nicht pro Person – die Parteien teilen sich die Rechnung in der Regel hälftig.",
    },
    {
      question: "Wovon hängt der Stundensatz eines Mediators ab?",
      answer:
        "Von Ausbildung und Zertifizierung, der Region und der Komplexität des Falls – in Großstädten liegen die Sätze über dem Niveau ländlicher Gegenden. Für die Gesamtrechnung ist aber die Zahl der Sitzungen entscheidender als der Stundensatz.",
    },
    {
      question: "Was kostet eine Mediation bei medipact?",
      answer:
        "Der Einstieg liegt bei 49 € pro Partei – etwa bei Nachbarschafts- und Verbraucherkonflikten. Umfangreichere Verfahren wie eine Trennungsmediation kosten mehr, der Preis steht aber vorab fest statt sich über eine offene Stundenrechnung aufzubauen. Der Kostenrechner zeigt den Betrag für Ihren Fall.",
    },
    {
      question: "Wer bezahlt die Mediation?",
      answer:
        "Üblicherweise teilen sich beide Konfliktparteien die Kosten, häufig zur Hälfte. Da beide Seiten vom Ergebnis profitieren, wird die Aufteilung zu Beginn des Verfahrens gemeinsam festgelegt.",
    },
    {
      question: "Ist Mediation günstiger als ein Gerichtsverfahren?",
      answer:
        "In den meisten Fällen ja. Mediation ist in der Regel schneller und kostengünstiger als ein streitiges Gerichtsverfahren, dessen Kosten sich am Streitwert orientieren und über Jahre laufen können.",
    },
    {
      question: "Übernimmt die Rechtsschutzversicherung die Mediation?",
      answer:
        "Manche Rechtsschutzversicherungen beteiligen sich an den Kosten einer Mediation – der Umfang hängt vom Tarif ab. Klären Sie das im Einzelfall vorab direkt mit Ihrer Versicherung.",
    },
  ],
  related: [
    { label: "Kostenrechner: Gericht oder Mediation?", href: "/kostenrechner" },
    { label: "Was ist Mediation?", href: "/ratgeber/was-ist-mediation" },
    { label: "Scheidung mit Mediator: Kosten im Detail", href: "/ratgeber/scheidung-mediator-kosten" },
    { label: "Wirtschaftsmediation: Kosten im Unternehmen", href: "/ratgeber/wirtschaftsmediation" },
    { label: "Die 5 Phasen der Mediation", href: "/ratgeber/5-phasen-der-mediation" },
    { label: "Konfliktarten: die 6 Arten im Überblick", href: "/konflikte" },
    { label: "Mediation bei Trennung & Scheidung", href: "/konflikte/trennung" },
    { label: "Mediation bei Erbstreit", href: "/konflikte/erbschaft" },
    { label: "Preise ansehen", href: "/preise" },
  ],
};
