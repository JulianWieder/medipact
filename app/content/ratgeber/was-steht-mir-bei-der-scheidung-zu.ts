// Ziel-Suchbegriffe: "was steht mir bei der scheidung zu", "was bekomme ich
// bei scheidung", "scheidung was steht der frau zu".
//
// Suchsprache-Artikel: Der Titel ist die Frage, die Betroffene tatsächlich
// eingeben. "Mediation" kommt erst als Konsequenz vor, nicht als Aufhänger —
// wer so sucht, kennt das Wort nicht.
//
// ACHTUNG, stark verrechtlicht: Zugewinn, Unterhalt, Versorgungsausgleich.
// Der Text nennt bewusst KEINE Quoten, Beträge oder Berechnungen für den
// Einzelfall und verweist konsequent auf anwaltliche Prüfung.
// Vor Veröffentlichung juristisch gegenlesen.

import type { RatgeberArticle } from "./types";

export const article: RatgeberArticle = {
  slug: "was-steht-mir-bei-der-scheidung-zu",
  category: "Trennung & Scheidung",
  title: "Was steht mir bei der Scheidung zu?",
  metaTitle: "Was steht mir bei der Scheidung zu? | medipact",
  description:
    "Zugewinn, Unterhalt, Rente, Hausrat: Was bei einer Scheidung tatsächlich aufgeteilt wird, was nicht – und woran sich die Höhe bemisst.",
  eyebrow: "Ratgeber · Trennung & Scheidung",
  updated: "2026-07-31",
  published: "2026-07-31",
  readingMinutes: 9,
  intro:
    "Diese Frage wird meist nachts gestellt, wenn die Entscheidung noch nicht gefallen ist. Die ehrliche Antwort lautet: Es gibt nicht die eine Summe, die Ihnen zusteht. Es gibt vier voneinander unabhängige Bereiche, die getrennt geregelt werden – und in drei davon können Sie mitbestimmen. Dieser Artikel zeigt, welche das sind und woran sich die Höhe bemisst.",
  blocks: [
    {
      type: "paragraph",
      text: "Bei einer Scheidung wird nicht „das Vermögen halbiert“. Das ist der häufigste Irrtum. Geregelt werden vier Dinge, die rechtlich nichts miteinander zu tun haben: der Zugewinn, die Rentenanwartschaften, der Unterhalt und die Frage, wer Wohnung und Hausrat bekommt. Jeder dieser Punkte folgt eigenen Regeln.",
    },
    {
      type: "heading",
      text: "1. Zugewinnausgleich: die Hälfte des Zuwachses, nicht des Vermögens",
    },
    {
      type: "paragraph",
      text: "Wer ohne Ehevertrag heiratet, lebt in der Zugewinngemeinschaft. Das bedeutet: Das Vermögen bleibt während der Ehe getrennt. Es wird nichts gemeinsam, nur weil man verheiratet ist. Ausgeglichen wird am Ende der Zuwachs – also die Differenz zwischen dem, was jemand bei der Heirat hatte, und dem, was er bei Zustellung des Scheidungsantrags hat.",
    },
    {
      type: "paragraph",
      text: "Wer in der Ehe mehr dazugewonnen hat, zahlt dem anderen die Hälfte des Unterschieds. Es geht also um den Zuwachs, nicht um den Bestand. Wer mit einem Haus in die Ehe geht, behält es; ausgeglichen wird allenfalls seine Wertsteigerung.",
    },
    {
      type: "list",
      items: [
        "Erbschaften und Schenkungen zählen zum Anfangsvermögen – sie werden nicht geteilt, nur ihre Wertsteigerung fließt in den Zugewinn ein.",
        "Schulden bleiben grundsätzlich bei dem, der sie aufgenommen hat.",
        "Stichtag für das Endvermögen ist die Zustellung des Scheidungsantrags, nicht der Auszug.",
        "Der Ausgleich ist ein Geldanspruch. Niemand bekommt automatisch „das halbe Haus“.",
        "Ein Ehevertrag kann all das abbedingen – dann gilt, was dort steht.",
      ],
    },
    {
      type: "callout",
      text: "Der Zugewinnausgleich wird nur durchgeführt, wenn ihn jemand verlangt. Er passiert nicht von selbst. Wer schweigt, verzichtet faktisch – und das ist der teuerste vermeidbare Fehler in diesem Bereich.",
    },
    {
      type: "heading",
      text: "2. Versorgungsausgleich: die Rente wird geteilt",
    },
    {
      type: "paragraph",
      text: "Was viele überrascht: Die während der Ehe erworbenen Rentenanwartschaften werden hälftig geteilt. Wer weniger eingezahlt hat – typischerweise die Person, die für Kinder beruflich zurückgesteckt hat – bekommt vom anderen etwas ab. Betriebsrenten und private Altersvorsorge können ebenfalls einbezogen werden.",
    },
    {
      type: "paragraph",
      text: "Anders als beim Zugewinn führt das Gericht den Versorgungsausgleich bei Ehen ab einer gewissen Dauer von Amts wegen durch. Sie müssen ihn nicht beantragen. Für viele ist das langfristig der wertvollste Posten der ganzen Scheidung – und der, über den am wenigsten gesprochen wird.",
    },
    {
      type: "heading",
      text: "3. Unterhalt: drei verschiedene Ansprüche",
    },
    {
      type: "paragraph",
      text: "„Unterhalt“ ist kein einheitlicher Begriff. Es gibt drei Arten, die sich nach Zeitpunkt und Empfänger unterscheiden – und die häufig verwechselt werden.",
    },
    {
      type: "table",
      caption: "Die drei Unterhaltsarten bei einer Trennung im Überblick",
      headers: ["Art", "Zeitraum", "Grundgedanke"],
      rows: [
        [
          "Kindesunterhalt",
          "ab Trennung, bis das Kind wirtschaftlich selbstständig ist",
          "Wer das Kind nicht betreut, zahlt – Höhe nach Einkommen und Alter des Kindes",
        ],
        [
          "Trennungsunterhalt",
          "ab Trennung bis zur rechtskräftigen Scheidung",
          "Der bisherige Lebensstandard soll nicht sofort zusammenbrechen",
        ],
        [
          "Nachehelicher Unterhalt",
          "nach der Scheidung",
          "Nur bei besonderem Grund, etwa Kinderbetreuung, Alter oder Krankheit",
        ],
      ],
    },
    {
      type: "paragraph",
      text: "Der wichtigste Unterschied liegt zwischen Trennungs- und nachehelichem Unterhalt. Während der Trennung ist die Schwelle niedrig. Nach der Scheidung gilt der Grundsatz, dass jeder für sich selbst sorgt – Unterhalt gibt es dann nur, wenn ein anerkannter Grund vorliegt. Wer damit rechnet, dauerhaft versorgt zu sein, plant oft falsch.",
    },
    {
      type: "heading",
      text: "4. Wohnung, Hausrat, Auto",
    },
    {
      type: "paragraph",
      text: "Hier geht es nicht ums Eigentum, sondern um die Nutzung. Wer in der Wohnung bleibt, richtet sich während der Trennung danach, wer sie dringender braucht – häufig die Person, bei der die Kinder leben. Wem die Wohnung gehört oder wer im Mietvertrag steht, ist dabei nicht allein entscheidend. Der Hausrat wird nach Billigkeit verteilt, nicht nach Kassenbon.",
    },
    {
      type: "heading",
      text: "Was Ihnen niemand zusteht: eine schnelle Antwort",
    },
    {
      type: "paragraph",
      text: "Die Höhe hängt an Zahlen, die Sie beide zusammentragen müssen: Einkommen, Vermögensstände zu zwei Stichtagen, Rentenauskünfte, Kreditverträge. Solange diese Zahlen nicht auf dem Tisch liegen, ist jede Auskunft eine Schätzung. Genau hier entsteht der teuerste Teil vieler Scheidungen – nicht am Streit über die Aufteilung, sondern am monatelangen Ringen darum, wer welche Unterlagen herausrückt.",
    },
    {
      type: "paragraph",
      text: "Wer diesen Teil gemeinsam und strukturiert erledigt, statt ihn über zwei Anwaltskanzleien laufen zu lassen, spart Monate und einen erheblichen Teil der Kosten. Bei medipact wird genau das online abgearbeitet: Beide Seiten tragen ihre Angaben im eigenen Tempo ein, ohne gemeinsame Termine. Erst danach wird über Zahlen verhandelt.",
    },
    {
      type: "callout",
      text: "Eine Mediation ersetzt die Scheidung nicht. Eine Ehe wird in Deutschland nur durch gerichtlichen Beschluss geschieden, und für den Antrag ist mindestens ein Anwalt zwingend vorgeschrieben. Was die Einigung ersetzt, ist der Streit davor – und den zweiten Anwalt.",
    },
    {
      type: "cta",
      text: "Kostenrisiko vergleichen: Was kostet der Streit vor Gericht?",
      href: "/kostenrechner?art=trennung",
    },
    {
      type: "heading",
      text: "Die drei Fragen, die Sie zuerst klären sollten",
    },
    {
      type: "list",
      items: [
        "Gibt es einen Ehevertrag? Er schlägt fast alles oben Beschriebene.",
        "Was war zum Zeitpunkt der Heirat da, und was ist heute da? Ohne diese beiden Zahlen lässt sich zum Zugewinn nichts sagen.",
        "Wer steht in welchem Kreditvertrag? Gegenüber der Bank haften Sie unabhängig davon, was Sie untereinander vereinbaren.",
      ],
    },
    {
      type: "cta",
      text: "Trennung fair regeln – strukturiert und online",
      href: "/konflikte/trennung",
    },
  ],
  faq: [
    {
      question: "Was steht mir bei einer Scheidung zu?",
      answer:
        "Vier Dinge werden getrennt geregelt: der Zugewinnausgleich (die Hälfte des Vermögenszuwachses des anderen), der Versorgungsausgleich (hälftige Teilung der in der Ehe erworbenen Rentenanwartschaften), Unterhalt für Kinder und gegebenenfalls für Sie selbst sowie die Nutzung von Wohnung und Hausrat. Eine pauschale Summe gibt es nicht.",
    },
    {
      question: "Wird bei einer Scheidung das Vermögen halbiert?",
      answer:
        "Nein. Geteilt wird nur der Zuwachs während der Ehe, nicht der Bestand. Wer mit Vermögen in die Ehe geht, behält es; ausgeglichen wird allenfalls dessen Wertsteigerung. Wer in der Ehe mehr dazugewonnen hat, zahlt dem anderen die Hälfte der Differenz – als Geldbetrag, nicht als Anteil an einzelnen Gegenständen.",
    },
    {
      question: "Zählt eine Erbschaft zum Zugewinn?",
      answer:
        "Die Erbschaft selbst nicht. Sie wird dem Anfangsvermögen zugerechnet und damit nicht geteilt. Eine Wertsteigerung, die das Geerbte während der Ehe erfährt, kann dagegen in den Zugewinn einfließen. Bei geerbten Immobilien lohnt es sich deshalb, den Wert zum Zeitpunkt des Erbfalls zu dokumentieren.",
    },
    {
      question: "Bekomme ich nach der Scheidung Unterhalt?",
      answer:
        "Nicht automatisch. Nach der Scheidung gilt der Grundsatz, dass jeder für seinen Unterhalt selbst sorgt. Ein Anspruch besteht nur bei einem anerkannten Grund – etwa weil Sie ein gemeinsames Kind betreuen, wegen Alter oder Krankheit nicht arbeiten können oder wegen der Ehe beruflich zurückgesteckt haben. Während der Trennung bis zur Scheidung sind die Voraussetzungen deutlich niedriger.",
    },
    {
      question: "Muss ich den Zugewinnausgleich beantragen?",
      answer:
        "Ja. Anders als der Versorgungsausgleich, den das Gericht bei entsprechend langer Ehe von Amts wegen durchführt, wird der Zugewinnausgleich nur auf Verlangen ausgeglichen. Wer ihn nicht geltend macht, bekommt ihn nicht. Lassen Sie deshalb vor einer Einigung anwaltlich prüfen, ob und in welcher Höhe Ihnen ein Anspruch zusteht.",
    },
  ],
  related: [
    { label: "Trennungsvereinbarung: was hineingehört", href: "/ratgeber/trennungsvereinbarung" },
    { label: "Scheidung ohne Anwalt: geht das?", href: "/ratgeber/scheidung-ohne-anwalt" },
    { label: "Scheidungsfolgenvereinbarung: Inhalt und Kosten", href: "/ratgeber/scheidungsfolgenvereinbarung" },
    { label: "Vermögen aufteilen bei Scheidung", href: "/ratgeber/vermoegensauseinandersetzung" },
    { label: "Muss ich bei der Scheidung das Haus verkaufen?", href: "/ratgeber/haus-bei-scheidung" },
    { label: "Scheidung mit Mediator: Was kostet das?", href: "/ratgeber/scheidung-mediator-kosten" },
    { label: "Trennung & Scheidung: Mediation im Überblick", href: "/konflikte/trennung" },
  ],
};
