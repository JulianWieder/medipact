// Ziel-Suchbegriffe: "geschwister streiten ums erbe", "streit mit geschwistern
// erbe", "bruder will haus nicht verkaufen erbe".
//
// Suchsprache-Artikel und emotionaler Einstieg in die Konfliktart Erbschaft.
// Bewusst NICHT juristisch aufgezogen: Wer so sucht, hat kein Rechtsproblem
// im Kopf, sondern ein Familienproblem. Die Rechtslage kommt als Werkzeug
// vor, nicht als Thema.
//
// Longtail-Ergänzung zum Pillar erbstreit-loesen-ohne-gericht: dort geht es
// um das Verfahren, hier um die Beziehungsebene. Kannibalisierung vermieden,
// indem dieser Artikel keine Verfahrensschritte wiederholt.
//
// Preise aus backend/app/pricing.py: erbschaft = 399 € "once".

import type { RatgeberArticle } from "./types";

export const article: RatgeberArticle = {
  slug: "geschwister-streiten-ums-erbe",
  category: "Familie & Erbe",
  title: "Geschwister streiten ums Erbe – was tun?",
  metaTitle: "Geschwister streiten ums Erbe: Was tun? | medipact",
  description:
    "Warum Erbstreit zwischen Geschwistern selten am Geld liegt, welche Muster fast immer auftauchen und wie Sie aus der Blockade herauskommen.",
  eyebrow: "Ratgeber · Familie & Erbe",
  updated: "2026-07-31",
  published: "2026-07-31",
  readingMinutes: 9,
  intro:
    "Es geht fast nie um das Geld. Es geht darum, wer sich gekümmert hat, wer weggezogen ist, wer immer schon der Liebling war und wer das Gefühl hat, zum zweiten Mal übergangen zu werden. Der Nachlass liefert nur die Rechnung, auf der das alles zusammenkommt. Dieser Artikel beschreibt die Muster – und den Ausweg.",
  blocks: [
    {
      type: "paragraph",
      text: "Erbstreit unter Geschwistern folgt erstaunlich wenigen Mustern. Wer sie erkennt, versteht schneller, worüber tatsächlich verhandelt wird – und merkt oft, dass die eigene Position weniger mit dem Nachlass zu tun hat als gedacht.",
    },
    {
      type: "heading",
      text: "Die fünf Muster",
    },
    {
      type: "list",
      items: [
        "Die Pflege: Eines der Kinder hat sich jahrelang gekümmert und erwartet dafür einen Ausgleich. Die anderen sehen jemanden, der ohnehin schon näher dran war.",
        "Das Haus: Einer will es behalten, einer will Geld. Beide haben recht – und ohne Einigung geht keines von beidem.",
        "Die Vorempfänge: Wer damals das Studium finanziert bekam oder Geld für den Hausbau, soll sich das anrechnen lassen. Zahlen dazu gibt es fast nie.",
        "Das Testament: Eine ungleiche Verteilung wird als Urteil über den eigenen Wert gelesen, nicht als Verfügung über Vermögen.",
        "Die Auskunft: Einer hatte Zugang zu Konten und Unterlagen, die anderen nicht. Daraus entsteht Misstrauen, das sich kaum wieder auflöst.",
      ],
    },
    {
      type: "callout",
      text: "Wenn Sie sich in mehr als einem dieser Punkte wiederfinden, ist das der Normalfall und kein Zeichen dafür, dass Ihre Familie besonders zerstritten wäre. Diese Muster treten in fast jedem Nachlass mit mehreren Kindern auf.",
    },
    {
      type: "heading",
      text: "Warum die Erbengemeinschaft alle blockiert",
    },
    {
      type: "paragraph",
      text: "Mit dem Erbfall entsteht zwischen den Erben automatisch eine Gemeinschaft, die niemand gewählt hat. Ihr gehört der Nachlass gemeinsam, und über das Wesentliche kann nur gemeinsam entschieden werden. Kein Miterbe kann allein über das Haus verfügen, das Konto auflösen oder Möbel verkaufen.",
    },
    {
      type: "paragraph",
      text: "Das ist der Grund, warum ein einzelner Blockierer eine ganze Familie über Jahre lahmlegen kann. Und es ist der Grund, warum sich der Konflikt nicht aussitzen lässt: Die Gemeinschaft löst sich nicht von selbst auf. Sie besteht weiter, bis jemand sie beendet – im Zweifel über ein Gericht.",
    },
    {
      type: "heading",
      text: "Was ein Gericht klären kann – und was nicht",
    },
    {
      type: "paragraph",
      text: "Ein Gericht kann Auskunft erzwingen, die Wirksamkeit eines Testaments feststellen und die Auseinandersetzung anordnen. Bei Immobilien führt der Weg regelmäßig in die Teilungsversteigerung. Die endet mit einem Erlös, der fast immer unter dem Marktwert liegt – finanziert aus dem Nachlass, um den gestritten wird.",
    },
    {
      type: "paragraph",
      text: "Was ein Urteil nicht kann: die Frage beantworten, warum es so verfügt wurde. Ob die Pflegeleistung gesehen wurde. Ob man bei der nächsten Beerdigung noch nebeneinander sitzen kann. Diese Fragen bleiben offen, und sie sind bei Geschwistern der eigentliche Streitgegenstand.",
    },
    {
      type: "heading",
      text: "Der Ausweg beginnt mit Zahlen, nicht mit Gefühlen",
    },
    {
      type: "paragraph",
      text: "So paradox es klingt: Der schnellste Weg aus einem emotionalen Erbstreit führt über die Sachebene. Solange unklar ist, was überhaupt im Nachlass ist und was es wert ist, verhandelt jede Seite gegen ein Phantom – und unterstellt der anderen, mehr zu wissen.",
    },
    {
      type: "list",
      items: [
        "Vollständiges Verzeichnis: Was gehört zum Nachlass, welche Verbindlichkeiten bestehen?",
        "Gemeinsame Bewertung: Zuerst einigen, WER bewertet – danach über das Ergebnis sprechen.",
        "Vorempfänge offenlegen: Wer hat zu Lebzeiten was bekommen? Ohne Zahlen bleibt es beim Verdacht.",
        "Pflegeleistungen benennen: Was wurde geleistet, über welchen Zeitraum, was hätte es gekostet?",
        "Erst danach verteilen – nicht vorher.",
      ],
    },
    {
      type: "callout",
      text: "Der wirksamste einzelne Schritt ist meist die gemeinsame Bewertung. Zwei getrennt beauftragte Gutachten führen fast immer zu einem dritten, gerichtlich bestellten – und zu der Überzeugung auf beiden Seiten, dass die andere manipuliert hat.",
    },
    {
      type: "heading",
      text: "Der Satz, der oft mehr bewirkt als jede Zahlung",
    },
    {
      type: "paragraph",
      text: "In der Praxis sinkt die Härte einer Forderung häufig deutlich, sobald einmal ausgesprochen wurde, was jahrelang unausgesprochen blieb: dass die Pflege gesehen wurde. Dass der Wegzug nicht als Verrat gemeint war. Dass die ungleiche Verteilung nicht bedeutete, jemanden weniger gemocht zu haben.",
    },
    {
      type: "paragraph",
      text: "Ein Gericht bietet dafür keinen Raum. In einem Mediationsverfahren ist dieser Raum ausdrücklich vorgesehen – und er ist der Grund, warum Erbfälle unter Geschwistern sich hier überdurchschnittlich oft lösen lassen, obwohl sie festgefahren wirken.",
    },
    {
      type: "heading",
      text: "Wie es bei medipact abläuft",
    },
    {
      type: "paragraph",
      text: "Vollständig online und schriftlich. Jede Seite schildert ihre Sicht zunächst getrennt – es gibt keinen gemeinsamen Termin, den erst alle koordinieren müssten, und niemand muss dem anderen gegenübersitzen. Danach werden Unterlagen, Bewertung und Verteilung Schritt für Schritt abgearbeitet.",
    },
    {
      type: "paragraph",
      text: "Der Fall kostet pauschal 399 €, gezahlt von der Partei, die ihn anlegt. Für die übrigen Geschwister entstehen keine Kosten. Gerade wenn mehrere Beteiligte misstrauisch sind, senkt das die Hemmschwelle, überhaupt anzufangen.",
    },
    {
      type: "cta",
      text: "Was würde der Erbstreit vor Gericht kosten?",
      href: "/kostenrechner?art=erbschaft",
    },
    {
      type: "heading",
      text: "Wann Sie trotzdem zum Anwalt sollten",
    },
    {
      type: "list",
      items: [
        "Ein Geschwisterteil verweigert jede Auskunft über den Nachlass.",
        "Es besteht begründeter Verdacht, dass Werte beiseitegeschafft wurden.",
        "Die Wirksamkeit des Testaments oder die Testierfähigkeit ist ernsthaft strittig.",
        "Fristen laufen ab, insbesondere bei Pflichtteilsansprüchen.",
      ],
    },
    {
      type: "callout",
      text: "Mediation ersetzt keine Rechtsberatung. Lassen Sie Ihre Ansprüche vorab prüfen und die Vereinbarung vor der Unterschrift anwaltlich kontrollieren. Wird Grundeigentum übertragen, ist zusätzlich eine notarielle Beurkundung erforderlich.",
    },
    {
      type: "cta",
      text: "Erbstreit in der Familie klären – 399 € pro Fall",
      href: "/konflikte/erbschaft",
    },
  ],
  faq: [
    {
      question: "Was tun, wenn Geschwister sich um das Erbe streiten?",
      answer:
        "Zuerst die Sachebene klären: ein vollständiges Nachlassverzeichnis, eine gemeinsam beauftragte Bewertung und offengelegte Vorempfänge. Die meisten Erbstreitigkeiten unter Geschwistern eskalieren nicht am Betrag, sondern an unterschiedlichen Annahmen darüber, was überhaupt vorhanden ist. Erst danach über die Verteilung sprechen.",
    },
    {
      question: "Kann ein Geschwisterteil die Erbengemeinschaft blockieren?",
      answer:
        "Ja. Über wesentliche Fragen muss die Erbengemeinschaft gemeinsam entscheiden, deshalb kann ein einzelner Miterbe die Auseinandersetzung faktisch aufhalten. Auflösen lässt sich die Blockade durch Einigung, durch den Verkauf eines Erbteils oder – bei Immobilien – durch eine Teilungsversteigerung, die für alle Beteiligten meist teuer wird.",
    },
    {
      question: "Muss sich Pflege der Eltern beim Erbe auszahlen?",
      answer:
        "Ein Ausgleich für Pflegeleistungen unter Abkömmlingen ist gesetzlich vorgesehen, seine Voraussetzungen und Höhe sind aber im Einzelfall oft strittig – besonders wenn nichts dokumentiert wurde. In einer Einigung lässt sich die Leistung deutlich flexibler berücksichtigen als über ein Verfahren. Lassen Sie den Anspruch anwaltlich prüfen.",
    },
    {
      question: "Was passiert, wenn einer das geerbte Haus behalten will und die anderen Geld wollen?",
      answer:
        "Dann muss die Person, die bleiben will, die anderen auszahlen – Grundlage ist der Verkehrswert abzüglich Nachlassverbindlichkeiten. Scheitert das an der Finanzierung oder am Wert, sind Zwischenwege üblich: Ratenzahlung, Stundung gegen Sicherheit oder die Übertragung anderer Nachlasswerte als Ausgleich.",
    },
    {
      question: "Was kostet eine Mediation im Erbstreit?",
      answer:
        "Bei medipact pauschal 399 € pro Fall – gezahlt von der Partei, die ihn anlegt, für die übrigen Beteiligten entstehen keine Kosten. Vor Gericht richten sich Gerichts- und Anwaltskosten dagegen nach dem Wert des Nachlassanteils, dazu kommen Bewertungsgutachten; bei einer Teilungsversteigerung verlieren zusätzlich alle Beteiligten am Erlös.",
    },
  ],
  related: [
    { label: "Erbengemeinschaft: Einer blockiert – was tun?", href: "/ratgeber/erbengemeinschaft-blockade" },
    { label: "Erbstreit lösen ohne Gericht", href: "/ratgeber/erbstreit-loesen-ohne-gericht" },
    { label: "Pflichtteil einfordern", href: "/ratgeber/pflichtteil-einfordern" },
    { label: "Erbschaft & Familie: Mediation im Überblick", href: "/konflikte/erbschaft" },
  ],
};
