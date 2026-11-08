// 16.10.2026: Lexikon-Teil von /konflikte hierher ausgelagert (Stufe 2 der
// Intent-Entscheidung vom 07.09.2026). Eine Seite kann nicht Nachschlagewerk
// und Verfahrenseinstieg zugleich sein: /konflikte trug "konfliktarten"
// (154 Impr, Pos 63) und hat damit die ganze Domain als Ratgeber markiert.
// Ab jetzt besitzt DIESER Artikel den Begriff, /konflikte das Verfahren.
//
// Inhalte (6 Arten, Tabelle, Glasl-Zonen, FAQs) 1:1 aus app/konflikte/page.tsx
// übernommen, nur in Ratgeber-Blöcke umgesetzt. Article- und FAQPage-Schema
// erzeugt RatgeberArtikelTemplate automatisch.
//
// 08.11.2026: /konflikte rankt noch Pos 57 für "konfliktarten" (132 Impr,
// GSC 07.08.–06.11.), dazu "4 konfliktarten", "konfliktarten beispiele",
// "arten von konflikten", "kalte konflikte". Neu: heiß/kalt/schwelend und
// die verbreitete Vierer-Einteilung, je mit FAQ.

import type { RatgeberArticle } from "./types";

export const article: RatgeberArticle = {
  slug: "konfliktarten",
  category: "Mediation",
  title: "Konfliktarten: die 6 Arten von Konflikten im Überblick",
  metaTitle: "Konfliktarten: 6 Arten von Konflikten mit Beispielen",
  description:
    "Welche Konfliktarten gibt es? Sach-, Interessen-, Beziehungs-, Werte-, Rollen- und Machtkonflikt mit Beispielen – und heiße, kalte, schwelende Konflikte.",
  eyebrow: "Ratgeber · Mediation",
  updated: "2026-11-08",
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
    { type: "heading", text: "Heiße, kalte und schwelende Konflikte" },
    {
      type: "paragraph",
      text: "Neben dem Inhalt lassen sich Konflikte danach unterscheiden, wie sie ausgetragen werden. Friedrich Glasl unterscheidet heiße und kalte Konflikte – eine Einteilung, die quer zu den sechs Arten oben liegt: Ein Erbstreit kann heiß oder kalt geführt werden.",
    },
    {
      type: "list",
      items: [
        "Heißer Konflikt: offen, laut, emotional. Beide Seiten wollen überzeugen, suchen die Auseinandersetzung und sind überzeugt, im Recht zu sein. Beispiel: Geschwister, die sich bei jedem Treffen über das Elternhaus anschreien.",
        "Kalter Konflikt: still, verhärtet, enttäuscht. Man meidet sich, kommuniziert nur noch schriftlich oder gar nicht, und die Abwertung läuft über Schweigen und Dienst nach Vorschrift. Beispiel: Kollegen, die seit Monaten nur noch per E-Mail miteinander verkehren.",
        "Schwelender Konflikt: noch nicht offen ausgebrochen, aber spürbar unter der Oberfläche – oft die Vorstufe eines heißen oder der Anfang eines kalten Konflikts.",
      ],
    },
    {
      type: "paragraph",
      text: "Kalte Konflikte werden oft unterschätzt, weil es ruhig wirkt. Sie sind aber schwerer zu bearbeiten als heiße, weil niemand mehr das Gespräch sucht. Wie man einen [schwelenden Konflikt](/ratgeber/schwelender-konflikt) erkennt und was man tun kann, bevor er sich verhärtet, steht in einem eigenen Ratgeber.",
    },
    { type: "heading", text: "4 Konfliktarten? Die verschiedenen Einteilungen" },
    {
      type: "paragraph",
      text: "Je nach Lehrbuch ist von vier, fünf oder sechs Konfliktarten die Rede. Das ist kein Widerspruch – die Modelle schneiden dasselbe Feld nur unterschiedlich fein. Verbreitet ist etwa die Einteilung in vier Arten:",
    },
    {
      type: "list",
      items: [
        "Zielkonflikt: Die Beteiligten wollen Unterschiedliches erreichen (der eine will das Haus verkaufen, der andere behalten).",
        "Beurteilungskonflikt: Das Ziel ist gleich, aber man schätzt den Weg oder die Fakten unterschiedlich ein (beide wollen verkaufen, sind sich aber über den Wert uneinig).",
        "Verteilungskonflikt: Es geht darum, wer wie viel von etwas Knappem bekommt – Geld, Zeit, Raum, Anerkennung.",
        "Beziehungskonflikt: Die Störung liegt zwischen den Personen selbst – Kränkung, Misstrauen, fehlender Respekt.",
      ],
    },
    {
      type: "paragraph",
      text: "Eine andere Vierer-Einteilung ordnet nicht nach dem Inhalt, sondern nach den Beteiligten: der innere Konflikt einer einzelnen Person, der Konflikt zwischen zwei Personen, der Konflikt innerhalb einer Gruppe und der zwischen Gruppen. Das Sechser-Modell oben ist feiner, weil es Werte, Rollen und Macht als eigene Ursachen ausweist – für die Frage, welcher Lösungsweg passt, ist das meist hilfreicher.",
    },
    { type: "heading", text: "Konfliktarten und Eskalationsstufen nach Glasl" },
    {
      type: "paragraph",
      text: "Die Konfliktart sagt, worum es geht. Die Eskalationsstufe sagt, was jetzt noch möglich ist. Das bekannteste Modell dafür stammt von Friedrich Glasl und unterscheidet neun Stufen in drei Zonen – genau diese Einordnung nimmt auch die medipact-Diagnose vor, bevor über Lösungen gesprochen wird. Wer gerade mitten in einer Eskalation steckt, findet erste Schritte unter [Akuter Konflikt – was tun?](/ratgeber/akuter-konflikt-was-tun).",
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
      question: "Was sind die 4 Konfliktarten?",
      answer:
        "Eine verbreitete Einteilung unterscheidet vier Konfliktarten: Zielkonflikt, Beurteilungskonflikt, Verteilungskonflikt und Beziehungskonflikt. Andere Modelle ordnen nach den Beteiligten (innerer Konflikt, zwischen zwei Personen, in einer Gruppe, zwischen Gruppen) oder unterscheiden feiner sechs Arten.",
    },
    {
      question: "Was ist ein kalter Konflikt?",
      answer:
        "Ein kalter Konflikt wird nicht offen ausgetragen, sondern durch Rückzug, Schweigen und Vermeidung. Die Beteiligten haben sich innerlich voneinander verabschiedet und kommunizieren kaum noch. Er wirkt ruhig, ist aber oft schwerer zu lösen als ein heißer Konflikt, weil niemand mehr das Gespräch sucht.",
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
