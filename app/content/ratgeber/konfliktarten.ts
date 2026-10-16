// 16.10.2026: Lexikon-Teil von /konflikte hierher ausgelagert (Stufe 2 der
// Intent-Entscheidung vom 07.09.2026). Eine Seite kann nicht Nachschlagewerk
// und Verfahrenseinstieg zugleich sein: /konflikte trug "konfliktarten"
// (154 Impr, Pos 63) und hat damit die ganze Domain als Ratgeber markiert.
// Ab jetzt besitzt DIESER Artikel den Begriff, /konflikte das Verfahren.
//
// Inhalte (6 Arten, Tabelle, Glasl-Zonen, FAQs) 1:1 aus app/konflikte/page.tsx
// übernommen, nur in Ratgeber-Blöcke umgesetzt. Article- und FAQPage-Schema
// erzeugt RatgeberArtikelTemplate automatisch.

import type { RatgeberArticle } from "./types";

export const article: RatgeberArticle = {
  slug: "konfliktarten",
  category: "Mediation",
  title: "Konfliktarten: die 6 Arten von Konflikten im Überblick",
  metaTitle: "Konfliktarten: die 6 Arten im Überblick | medipact",
  description:
    "Sach-, Interessen-, Beziehungs-, Werte-, Rollen- und Machtkonflikt: die 6 Konfliktarten mit Beispielen, Lösungswegen und den Eskalationsstufen nach Glasl.",
  eyebrow: "Ratgeber · Mediation",
  updated: "2026-10-16",
  published: "2026-10-16",
  readingMinutes: 7,
  intro:
    "Konflikte wirken oft chaotisch – dahinter stecken aber wiederkehrende Muster. Die Konfliktforschung unterscheidet sechs zentrale Konfliktarten: Sachkonflikt, Interessenkonflikt, Beziehungskonflikt, Wertekonflikt, Rollenkonflikt und Machtkonflikt. Wer sie erkennt, versteht, warum ein Streit festgefahren ist und welcher Lösungsweg passt.",
  blocks: [
    { type: "heading", text: "Welche Arten von Konflikten gibt es?" },
    {
      type: "table",
      caption: "Die 6 Konfliktarten im Überblick: Kernfrage, typisches Beispiel und Lösungsansatz",
      headers: ["Konfliktart", "Kernfrage", "Typisches Beispiel", "Lösungsansatz"],
      rows: [
        ["Sachkonflikt", "Worum geht es wirklich?", "Streit über den Verkehrswert des Elternhauses", "Fakten gemeinsam klären, neutrale Informationsbasis schaffen."],
        ["Interessenkonflikt", "Wer bekommt was?", "Zwei Abteilungen beanspruchen dasselbe Budget", "Interessen hinter den Positionen herausarbeiten, Optionen entwickeln."],
        ["Beziehungskonflikt", "Wie gehen wir miteinander um?", "Ex-Partner können nicht mehr sachlich über die Kinderbetreuung sprechen", "Kommunikation strukturieren, Wahrnehmungen aussprechen, Vertrauen schrittweise aufbauen."],
        ["Wertekonflikt", "Was ist richtig?", "Generationenwechsel im Familienbetrieb: Tradition gegen Modernisierung", "Nicht überzeugen wollen, sondern Koexistenz und konkrete Verhaltensregeln vereinbaren."],
        ["Rollenkonflikt", "Wer ist wofür zuständig?", "Teamleiterin ist zugleich Kollegin und Vorgesetzte", "Rollen und Erwartungen explizit machen, Verantwortlichkeiten neu vereinbaren."],
        ["Machtkonflikt", "Wer entscheidet?", "Zwei Gesellschafter blockieren gegenseitig jede Entscheidung", "Faire Verfahrensregeln vereinbaren, Entscheidungswege transparent machen."],
      ],
    },
    { type: "heading", text: "1. Sachkonflikt" },
    {
      type: "paragraph",
      text: "Zwei Seiten bewerten dieselbe Sachlage unterschiedlich – oft, weil Informationen fehlen, unklar oder widersprüchlich sind. Beispiel: Uneinigkeit über den Wert einer Immobilie im Nachlass. Der Lösungsweg ist eine gemeinsame, neutrale Informationsbasis.",
    },
    { type: "heading", text: "2. Interessenkonflikt" },
    {
      type: "paragraph",
      text: "Beide Seiten wollen dasselbe knappe Gut: Geld, Zeit, Raum oder Zuständigkeit. Der Klassiker unter den Konfliktarten – von der Erbverteilung bis zum Budgetstreit zwischen Abteilungen. Lösbar wird er, wenn die Interessen hinter den Positionen sichtbar werden und daraus Optionen entstehen.",
    },
    { type: "heading", text: "3. Beziehungskonflikt" },
    {
      type: "paragraph",
      text: "Verletzungen, Misstrauen oder Kränkungen überlagern die Sachebene. Häufig bei Trennung, in Familien – und zwischen langjährigen Kollegen oder Gesellschaftern. Hier hilft strukturierte Kommunikation: Wahrnehmungen aussprechen und Vertrauen schrittweise aufbauen.",
    },
    { type: "heading", text: "4. Wertekonflikt" },
    {
      type: "paragraph",
      text: "Unterschiedliche Überzeugungen, Kulturen oder Prinzipien prallen aufeinander. Werte lassen sich nicht wegverhandeln – wohl aber ein respektvoller Umgang damit. Ziel ist nicht, den anderen zu überzeugen, sondern konkrete Verhaltensregeln für das Nebeneinander.",
    },
    { type: "heading", text: "5. Rollenkonflikt" },
    {
      type: "paragraph",
      text: "Unklare Zuständigkeiten, widersprüchliche Erwartungen oder doppelte Rollen erzeugen Dauerreibung – typisch im Unternehmen und in Familien, die zusammen wirtschaften. Gelöst wird er, indem Rollen und Erwartungen ausdrücklich gemacht und Verantwortlichkeiten neu vereinbart werden.",
    },
    { type: "heading", text: "6. Machtkonflikt" },
    {
      type: "paragraph",
      text: "Es geht um Einfluss, Kontrolle und Augenhöhe. Oft versteckt er sich hinter Sachthemen – erkennbar daran, dass jede Lösung der Gegenseite abgelehnt wird. Faire Verfahrensregeln und transparente Entscheidungswege nehmen ihm die Grundlage.",
    },
    {
      type: "callout",
      text: "In der Praxis treten die Konfliktarten fast nie allein auf. Hinter einem Sachthema steckt oft ein Beziehungs- oder Machtkonflikt. Entscheidend ist, welche Art das Gespräch gerade blockiert.",
    },
    { type: "heading", text: "Konfliktarten und Eskalationsstufen nach Glasl" },
    {
      type: "paragraph",
      text: "Die Konfliktart sagt, worum es geht. Die Eskalationsstufe sagt, was jetzt noch möglich ist. Das bekannteste Modell dafür stammt von Friedrich Glasl und unterscheidet neun Stufen in drei Zonen – genau diese Einordnung nimmt auch die medipact-Diagnose vor, bevor über Lösungen gesprochen wird.",
    },
    {
      type: "table",
      caption: "Die drei Eskalationszonen nach Glasl und der jeweils passende Weg",
      headers: ["Zone", "Stufen", "Was passiert", "Passender Weg"],
      rows: [
        ["Win-Win", "Stufe 1–3", "Verhärtung, Debatte, Taten statt Worte. Die Beteiligten sind noch lösungsorientiert; eine Lösung, mit der beide gut leben können, ist realistisch.", "Klärendes Gespräch, Moderation – oder eine Mediation, die schnell zum Ergebnis führt."],
        ["Win-Lose", "Stufe 4–6", "Koalitionen, Gesichtsverlust, Drohstrategien. Es geht ums Gewinnen, nicht mehr um die Sache. Ohne Dritte dreht sich die Spirale weiter.", "Externe, allparteiliche Mediation – häufig zunächst getrennt (Shuttle-Verfahren)."],
        ["Lose-Lose", "Stufe 7–9", "Begrenzte Vernichtung, Zersplitterung, gemeinsam in den Abgrund. Der eigene Schaden wird in Kauf genommen, wenn er die Gegenseite härter trifft.", "Hier stößt Mediation an ihre Grenzen: Es braucht Machtentscheidungen, rechtliche Schritte oder Schutz."],
      ],
    },
    { type: "heading", text: "Egal welche Konfliktart: Mediation setzt am Muster an" },
    {
      type: "paragraph",
      text: "Jede Konfliktart braucht einen anderen Hebel – Mediation kombiniert sie in einem geordneten Verfahren mit neutraler Begleitung. Welches Verfahren zu Ihrem Konflikt passt, ob Trennung, Erbe, Nachbarschaft oder Unternehmen, zeigt die Übersicht der Verfahren.",
    },
    {
      type: "cta",
      text: "Das passende Verfahren für Ihren Konflikt finden",
      href: "/konflikte",
    },
  ],
  faq: [
    {
      question: "Welche Arten von Konflikten gibt es?",
      answer:
        "Die Konfliktforschung unterscheidet sechs wichtige Konfliktarten: Sachkonflikte, Interessenkonflikte, Beziehungskonflikte, Wertekonflikte, Rollenkonflikte und Machtkonflikte. In der Praxis treten sie meist gemischt auf – hinter einem Sachthema steckt oft ein Beziehungs- oder Machtkonflikt.",
    },
    {
      question: "Welche Konfliktarten gibt es im Unternehmen?",
      answer:
        "Im Unternehmen dominieren Rollenkonflikte (unklare Zuständigkeiten), Interessenkonflikte (Budget, Ressourcen), Beziehungskonflikte im Team und Machtkonflikte zwischen Führungskräften oder Gesellschaftern. Ungelöst kosten sie Produktivität, Fluktuation und Krankheitstage – eine Wirtschaftsmediation setzt genau hier an.",
    },
    {
      question: "Wie löst man die verschiedenen Konfliktarten?",
      answer:
        "Jede Konfliktart braucht einen anderen Hebel: Sachkonflikte eine gemeinsame Faktenbasis, Interessenkonflikte eine Verhandlung über die dahinterliegenden Bedürfnisse, Beziehungskonflikte strukturierte Kommunikation. Mediation kombiniert diese Ansätze in einem geordneten Verfahren mit neutraler Begleitung.",
    },
    {
      question: "Wie erkenne ich, welche Konfliktart vorliegt?",
      answer:
        "Achten Sie darauf, woran das Gespräch scheitert. Streiten Sie über Zahlen und Fakten, ist es ein Sachkonflikt. Geht es darum, wer wie viel bekommt, ein Interessenkonflikt. Wird es persönlich, steckt ein Beziehungskonflikt dahinter. Werden alle Vorschläge der Gegenseite abgelehnt – auch gute – ist es meist ein Machtkonflikt.",
    },
    {
      question: "Welche Konfliktarten gibt es in Familie und Partnerschaft?",
      answer:
        "Privat dominieren Beziehungskonflikte (Verletzungen, Misstrauen), Wertekonflikte (unterschiedliche Vorstellungen von Erziehung, Geld oder Lebensführung) und Interessenkonflikte bei Trennung und Erbe – etwa um Unterhalt, Betreuungszeiten oder die Aufteilung des Nachlasses. Rollenkonflikte kommen dazu, wenn Familie und Geschäft zusammenfallen.",
    },
    {
      question: "Was sind die neun Eskalationsstufen nach Glasl?",
      answer:
        "Friedrich Glasl beschreibt neun Stufen in drei Zonen: Win-Win (Stufe 1–3: Verhärtung, Debatte, Taten statt Worte), Win-Lose (Stufe 4–6: Koalitionen, Gesichtsverlust, Drohstrategien) und Lose-Lose (Stufe 7–9: begrenzte Vernichtung, Zersplitterung, gemeinsam in den Abgrund). Bis Stufe 3 genügt oft Moderation, ab Stufe 4 braucht es externe Mediation, ab Stufe 7 rechtliche Schritte oder Schutz.",
    },
  ],
  related: [
    { label: "Konflikt lösen: das passende Verfahren finden", href: "/konflikte" },
    { label: "Schwelender Konflikt: Bedeutung und Anzeichen", href: "/ratgeber/schwelender-konflikt" },
    { label: "Akuter Konflikt: was jetzt zu tun ist", href: "/ratgeber/akuter-konflikt-was-tun" },
    { label: "Die 5 Phasen der Mediation", href: "/ratgeber/5-phasen-der-mediation" },
    { label: "Wirtschaftsmediation: Konflikte im Unternehmen lösen", href: "/ratgeber/wirtschaftsmediation" },
    { label: "Was kostet eine Mediation?", href: "/ratgeber/mediation-kosten" },
  ],
};
