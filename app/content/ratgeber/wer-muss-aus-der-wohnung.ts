// Ziel-Suchbegriffe: "wer muss bei trennung aus der wohnung", "wer muss
// ausziehen bei trennung", "trennung wohnung wer bleibt".
//
// Suchsprache-Artikel mit hoher Dringlichkeit — wird oft in der Woche der
// Trennung gesucht. Deshalb steht die Antwort im ersten Satz.
//
// WICHTIG: Der Artikel muss die Gewaltkonstellation sauber abbiegen. Wer in
// einer Bedrohungslage sucht, braucht keine Mediation, sondern Polizei und
// Gewaltschutz. Das steht bewusst weit oben und nicht in einer Fußnote.
//
// Die Sechs-Monats-Regel beim Auszug ist der praktisch wertvollste Punkt und
// in Ratgebern selten sauber dargestellt. Vor Veröffentlichung juristisch
// gegenlesen.

import type { RatgeberArticle } from "./types";

export const article: RatgeberArticle = {
  slug: "wer-muss-aus-der-wohnung",
  category: "Trennung & Scheidung",
  title: "Wer muss bei einer Trennung aus der Wohnung?",
  metaTitle: "Trennung: Wer muss aus der Wohnung? | medipact",
  description:
    "Erst einmal niemand. Wann eine Zuweisung möglich ist, was der Mietvertrag bedeutet und warum ein vorschneller Auszug teuer werden kann.",
  eyebrow: "Ratgeber · Trennung & Scheidung",
  updated: "2026-07-31",
  published: "2026-07-31",
  readingMinutes: 8,
  intro:
    "Die kurze Antwort: erst einmal niemand. Beide Ehegatten dürfen in der gemeinsamen Wohnung bleiben, unabhängig davon, wem sie gehört oder wer im Mietvertrag steht. Wer auszieht, tut das freiwillig – und sollte vorher wissen, was das auslöst. Dieser Artikel erklärt, wann das anders ist und welcher Fehler am häufigsten gemacht wird.",
  blocks: [
    {
      type: "callout",
      text: "Wenn Sie Gewalt erleben oder bedroht werden, gilt dieser Artikel nicht. Rufen Sie die Polizei (110). Sie kann den Täter sofort der Wohnung verweisen, und das Gericht kann die Wohnung kurzfristig allein zuweisen. Das Hilfetelefon Gewalt gegen Frauen ist rund um die Uhr unter 116 016 erreichbar, kostenlos und anonym. Mediation ist in solchen Fällen der falsche Weg.",
    },
    {
      type: "heading",
      text: "Der Grundsatz: beide dürfen bleiben",
    },
    {
      type: "paragraph",
      text: "Die Ehewohnung hat einen besonderen Schutz. Solange die Ehe besteht, hat jeder Ehegatte ein Recht, dort zu wohnen – auch derjenige, dem die Wohnung nicht gehört und der nicht im Mietvertrag steht. Ein Eigentümer kann seinen Ehepartner nicht einfach vor die Tür setzen, und ein Hauptmieter kann das ebenso wenig.",
    },
    {
      type: "paragraph",
      text: "Praktisch bedeutet das: Niemand muss gehen, nur weil der andere es verlangt. Schlösser austauschen, Sachen vor die Tür stellen oder den Zugang versperren ist keine Lösung, sondern schafft eine zusätzliche Rechtsposition für die Gegenseite.",
    },
    {
      type: "heading",
      text: "Wann eine Zuweisung möglich ist",
    },
    {
      type: "paragraph",
      text: "Das Gericht kann die Wohnung einem Ehegatten allein zuweisen – aber nur, wenn das Zusammenleben eine unbillige Härte bedeutet. Die Schwelle liegt bewusst hoch. Dass die Stimmung unerträglich ist und man sich aus dem Weg geht, reicht dafür in der Regel nicht.",
    },
    {
      type: "list",
      items: [
        "Gewalt oder ernsthafte Drohungen – hier ist die Zuweisung der Regelfall, nicht die Ausnahme.",
        "Das Kindeswohl ist konkret beeinträchtigt, etwa durch dauernde Eskalationen vor den Kindern.",
        "Eine Seite ist auf die Wohnung besonders angewiesen, etwa wegen Behinderung oder Pflegebedürftigkeit.",
        "Nicht ausreichend: Streit, Schweigen, eine neue Partnerschaft oder der Wunsch nach Ruhe.",
      ],
    },
    {
      type: "heading",
      text: "Der teuerste Fehler: einfach ausziehen",
    },
    {
      type: "paragraph",
      text: "Viele ziehen aus, um Ruhe zu haben. Das ist verständlich und oft der einzige Weg, aber es hat eine Folge, die kaum jemand kennt: Wer auszieht und nicht innerhalb einer bestimmten Frist ernsthaft deutlich macht, dass er zurückwill, gilt als jemand, der dem anderen das alleinige Nutzungsrecht überlassen hat. Diese Frist beträgt sechs Monate.",
    },
    {
      type: "callout",
      text: "Wenn Sie ausziehen, aber die Wohnung nicht aufgeben wollen, erklären Sie Ihre Rückkehrabsicht schriftlich und nachweisbar gegenüber Ihrem Ehepartner – am besten innerhalb weniger Wochen. Ein Auszug „auf Zeit“, den niemand dokumentiert hat, wird später zu einem endgültigen.",
    },
    {
      type: "paragraph",
      text: "Wichtig zur Einordnung: Der Auszug ändert nichts am Eigentum und nichts an Ihrer Verpflichtung aus einem Mietvertrag. Wer den Mietvertrag mitunterschrieben hat, schuldet dem Vermieter weiterhin die Miete – auch wenn er dort nicht mehr wohnt. Aus dem Vertrag kommt man nur mit Zustimmung des Vermieters heraus.",
    },
    {
      type: "heading",
      text: "Miete, Nebenkosten, Nutzungsentschädigung",
    },
    {
      type: "paragraph",
      text: "Wer allein in einer Wohnung bleibt, die beiden gehört, nutzt einen Vermögenswert des anderen mit. Dafür kann eine Nutzungsentschädigung verlangt werden. Umgekehrt trägt derjenige, der bleibt, häufig die laufenden Kosten allein. Beides wird in der Praxis gegeneinander gerechnet – und beides wird häufig vergessen, bis Monate später jemand rückwirkend abrechnen will.",
    },
    {
      type: "list",
      items: [
        "Regeln Sie schriftlich, wer ab wann welche Kosten trägt – Miete, Nebenkosten, Darlehensraten, Strom.",
        "Klären Sie, ob eine Nutzungsentschädigung gezahlt wird und ab wann.",
        "Halten Sie den Auszugszeitpunkt fest. Er ist später für mehrere Berechnungen relevant.",
        "Denken Sie an Ummeldung, Versicherungen und Daueraufträge – hier entstehen sonst monatelang stille Kosten.",
      ],
    },
    {
      type: "heading",
      text: "Trennung in derselben Wohnung",
    },
    {
      type: "paragraph",
      text: "Wenn niemand ausziehen kann oder will, ist eine Trennung innerhalb der Wohnung möglich. Sie setzt voraus, dass es keine gemeinsame Haushaltsführung mehr gibt: getrennte Schlafräume, getrennte Finanzen, kein Waschen und Kochen füreinander. Das ist unangenehm, aber es ist der anerkannte Weg für alle, denen zwei Wohnungen wirtschaftlich nicht möglich sind.",
    },
    {
      type: "paragraph",
      text: "Wer das tut, sollte den Beginn der Trennung festhalten – etwa in einer kurzen gemeinsamen schriftlichen Erklärung. Er ist der Startpunkt für das Trennungsjahr und damit für den gesamten weiteren Zeitplan.",
    },
    {
      type: "heading",
      text: "Warum das eine Verhandlungs- und keine Rechtsfrage ist",
    },
    {
      type: "paragraph",
      text: "In den allermeisten Fällen führt der Streit um die Wohnung zu keinem Gerichtsverfahren, weil die Voraussetzungen für eine Zuweisung nicht vorliegen. Was bleibt, ist eine Verhandlung: Wer geht, wann, zu welchen Bedingungen, wer zahlt was, und was passiert mit dem Hausrat.",
    },
    {
      type: "paragraph",
      text: "Genau dafür ist ein strukturiertes Verfahren gemacht. Bei medipact wird das schriftlich und asynchron abgearbeitet – ohne gemeinsamen Termin, was gerade in dieser Phase oft der entscheidende Punkt ist. Beide Seiten müssen sich nicht gegenübersitzen, um zu einer Regelung zu kommen.",
    },
    {
      type: "cta",
      text: "Wohnung und Trennung strukturiert regeln",
      href: "/konflikte/trennung",
    },
    {
      type: "callout",
      text: "Dieser Artikel ersetzt keine Rechtsberatung. Ob eine Wohnungszuweisung in Ihrem Fall in Betracht kommt und welche Fristen für Sie laufen, sollten Sie anwaltlich prüfen lassen – gerade weil ein Auszug Folgen hat, die sich später kaum korrigieren lassen.",
    },
  ],
  faq: [
    {
      question: "Wer muss bei einer Trennung aus der Wohnung ausziehen?",
      answer:
        "Grundsätzlich niemand. Beide Ehegatten haben ein Recht, in der Ehewohnung zu bleiben – unabhängig davon, wem sie gehört oder wer im Mietvertrag steht. Ein Auszug ist freiwillig. Nur wenn das Zusammenleben eine unbillige Härte darstellt, etwa bei Gewalt, kann ein Gericht die Wohnung einem Ehegatten allein zuweisen.",
    },
    {
      question: "Kann mich mein Partner aus der Wohnung werfen, wenn ihm die Wohnung gehört?",
      answer:
        "Nein. Solange die Ehe besteht, ist die Ehewohnung besonders geschützt. Auch der Eigentümer kann seinen Ehepartner nicht einseitig vor die Tür setzen. Schlösser auszutauschen oder den Zugang zu versperren ist unzulässig und verschlechtert die eigene Position im weiteren Verfahren erheblich.",
    },
    {
      question: "Was passiert, wenn ich ausziehe?",
      answer:
        "Ihr Wohnrecht kann verloren gehen: Wer auszieht und nicht innerhalb von sechs Monaten ernsthaft zu erkennen gibt, dass er zurückkehren will, muss damit rechnen, dass dem anderen das alleinige Nutzungsrecht zugesprochen wird. Wenn Sie zurückwollen, erklären Sie das schriftlich und nachweisbar – am besten binnen weniger Wochen.",
    },
    {
      question: "Muss ich weiter Miete zahlen, wenn ich ausgezogen bin?",
      answer:
        "Wenn Sie den Mietvertrag mitunterschrieben haben: ja. Gegenüber dem Vermieter bleiben Sie verpflichtet, auch wenn Sie dort nicht mehr wohnen. Aus dem Vertrag kommen Sie nur mit Zustimmung des Vermieters heraus. Wer intern etwas anderes vereinbart, regelt damit nur das Verhältnis untereinander, nicht das zum Vermieter.",
    },
    {
      question: "Kann man sich trennen, ohne auszuziehen?",
      answer:
        "Ja. Eine Trennung innerhalb der gemeinsamen Wohnung ist anerkannt, wenn es keine gemeinsame Haushaltsführung mehr gibt: getrennte Schlafräume, getrennte Finanzen, keine Versorgungsleistungen füreinander. Für viele Paare ist das die einzige wirtschaftlich mögliche Variante. Halten Sie den Beginn der Trennung schriftlich fest.",
    },
  ],
  related: [
    { label: "Kostenrechner: Gericht oder Einigung?", href: "/kostenrechner?art=trennung" },
    { label: "Trennungsvereinbarung: was hineingehört", href: "/ratgeber/trennungsvereinbarung" },
    { label: "Trennungsjahr: Wie weist man es nach?", href: "/ratgeber/trennungsjahr-nachweisen" },
    { label: "Muss ich bei der Scheidung das Haus verkaufen?", href: "/ratgeber/haus-bei-scheidung" },
    { label: "„Ich will mich trennen“ aussprechen", href: "/ratgeber/ich-will-mich-trennen" },
    { label: "Trennung & Scheidung: Mediation im Überblick", href: "/konflikte/trennung" },
  ],
};
