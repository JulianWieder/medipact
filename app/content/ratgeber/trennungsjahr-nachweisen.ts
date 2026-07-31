// Ziel-Suchbegriffe: "trennungsjahr nachweisen", "trennungsjahr wie beweisen",
// "wann beginnt das trennungsjahr", "trennungsjahr in einer wohnung".
//
// Suchsprache-Artikel. Der häufigste Irrtum bei dieser Suche: dass es eine
// Behörde gäbe, bei der man die Trennung "anmeldet". Gibt es nicht — genau
// das ist die eigentliche Antwort und steht deshalb weit oben.
//
// Zweiter Schwerpunkt: das Trennungsdatum ist Startpunkt für mehrere
// Berechnungen (Steuerklasse, Zugewinn-Stichtag, Unterhalt). Wer es nicht
// dokumentiert, verliert später Geld — das ist der Nutzwert des Artikels.
//
// Vor Veröffentlichung juristisch und steuerlich gegenlesen.

import type { RatgeberArticle } from "./types";

export const article: RatgeberArticle = {
  slug: "trennungsjahr-nachweisen",
  category: "Trennung & Scheidung",
  title: "Trennungsjahr: Wann beginnt es – und wie weist man es nach?",
  metaTitle: "Trennungsjahr nachweisen: So geht es | medipact",
  description:
    "Es gibt keine Behörde, bei der man sich trennt. Wann das Trennungsjahr beginnt, wie es sich belegen lässt und warum das Datum bares Geld wert ist.",
  eyebrow: "Ratgeber · Trennung & Scheidung",
  updated: "2026-07-31",
  published: "2026-07-31",
  readingMinutes: 7,
  intro:
    "Die häufigste Fehlannahme zuerst: Es gibt keine Behörde, bei der man eine Trennung anmeldet. Kein Formular, kein Amt, kein Stempel. Das Trennungsjahr beginnt an dem Tag, an dem Sie tatsächlich getrennt leben – und Sie selbst bestimmen, wie gut dieser Tag später belegbar ist. Dieser Artikel zeigt, worauf es dabei ankommt.",
  blocks: [
    {
      type: "heading",
      text: "Wann das Trennungsjahr beginnt",
    },
    {
      type: "paragraph",
      text: "Getrennt leben heißt: Es gibt keine häusliche Gemeinschaft mehr, und mindestens eine Seite will sie nicht wiederherstellen. Der Auszug ist dafür der klarste Fall, aber nicht der einzige. Entscheidend ist nicht die Adresse, sondern ob noch gemeinsam gewirtschaftet wird.",
    },
    {
      type: "paragraph",
      text: "Deshalb kann das Trennungsjahr auch innerhalb derselben Wohnung laufen. Das ist ausdrücklich anerkannt und für viele Paare die einzige wirtschaftlich mögliche Variante. Voraussetzung ist eine konsequente Trennung des Alltags.",
    },
    {
      type: "list",
      items: [
        "Getrennte Schlafräume – dauerhaft, nicht nur nach Streit.",
        "Getrennte Finanzen: eigene Konten, keine gemeinsame Kasse für den Alltag.",
        "Kein Waschen, Einkaufen oder Kochen füreinander.",
        "Getrennte Freizeit; gemeinsame Zeit nur noch wegen der Kinder.",
        "Nicht schädlich: sich die Küche zu teilen oder gemeinsam Elternabende zu besuchen.",
      ],
    },
    {
      type: "callout",
      text: "Kurze Versöhnungsversuche unterbrechen das Trennungsjahr nicht. Wer ein Wochenende oder ein paar Wochen noch einmal versucht, verliert die bereits abgelaufene Zeit nicht. Ein längeres echtes Zusammenleben setzt die Uhr dagegen zurück.",
    },
    {
      type: "heading",
      text: "Wie man es nachweist",
    },
    {
      type: "paragraph",
      text: "Im Normalfall gar nicht aufwendig. Sind sich beide einig, wird das Trennungsdatum im Scheidungsantrag angegeben, und die andere Seite bestätigt es. Damit ist die Sache erledigt – niemand muss Beweise vorlegen. Aufwendig wird es nur, wenn die andere Seite das Datum bestreitet.",
    },
    {
      type: "paragraph",
      text: "Und genau dafür lohnt sich ein wenig Vorsorge. Nicht, weil ein Streit wahrscheinlich wäre, sondern weil er sich mit fünf Minuten Aufwand ausschließen lässt.",
    },
    {
      type: "table",
      caption: "Belege für den Beginn des Trennungsjahres, nach Aussagekraft",
      headers: ["Beleg", "Aussagekraft", "Aufwand"],
      rows: [
        [
          "Gemeinsame schriftliche Trennungserklärung mit Datum",
          "hoch – beide bestätigen dasselbe Datum",
          "sehr gering",
        ],
        [
          "Eigener Mietvertrag oder Ummeldung",
          "hoch, wenn jemand auszieht",
          "ergibt sich ohnehin",
        ],
        [
          "Schreiben an den Partner mit klarer Trennungsansage",
          "mittel bis hoch",
          "gering",
        ],
        [
          "Kontotrennung, geänderte Daueraufträge",
          "mittel – zeigt das Ende der gemeinsamen Wirtschaft",
          "gering",
        ],
        [
          "Zeugen aus dem Umfeld",
          "gering bis mittel",
          "unangenehm für alle Beteiligten",
        ],
      ],
    },
    {
      type: "callout",
      text: "Der beste Beleg ist der billigste: zwei Sätze, von beiden unterschrieben, mit Datum. „Wir leben seit dem [Datum] getrennt und führen keinen gemeinsamen Haushalt mehr.“ Das kostet nichts und beendet die Diskussion, bevor sie entsteht.",
    },
    {
      type: "heading",
      text: "Warum das Datum bares Geld wert ist",
    },
    {
      type: "paragraph",
      text: "Das Trennungsdatum ist nicht nur der Startschuss für die Wartezeit. Es ist der Ausgangspunkt für mehrere Berechnungen, die zusammen erhebliche Beträge ausmachen können.",
    },
    {
      type: "list",
      items: [
        "Trennungsunterhalt kann ab der Trennung verlangt werden – rückwirkend allerdings nur eingeschränkt. Wer zu lange wartet, verliert Monate.",
        "Die steuerliche Zusammenveranlagung ist letztmalig für das Jahr der Trennung möglich; danach ändert sich die Steuerklasse.",
        "Der Zugewinnausgleich stellt zwar auf die Zustellung des Scheidungsantrags ab – die Trennung bestimmt aber, wann dieser überhaupt gestellt werden kann.",
        "Nach einem Jahr Trennung und beiderseitigem Einverständnis kann geschieden werden; ohne Zustimmung dauert es deutlich länger.",
      ],
    },
    {
      type: "heading",
      text: "Was das Trennungsjahr nicht ist",
    },
    {
      type: "paragraph",
      text: "Es ist keine Wartezeit, in der nichts zu tun wäre. Im Gegenteil: Es ist die Phase, in der sich fast alles regeln lässt, was später teuer wird – Unterhalt, Immobilie, Hausrat, Umgang mit den Kindern. Paare, die dieses Jahr nutzen, gehen mit einer fertigen Vereinbarung ins Scheidungsverfahren und brauchen dort nur noch einen Anwalt für den Antrag.",
    },
    {
      type: "paragraph",
      text: "Paare, die das Jahr verstreichen lassen, beginnen die Verhandlungen erst, wenn ohnehin schon Anwälte beteiligt sind – und zahlen dann für jeden Punkt doppelt. Genau darin liegt der wirtschaftliche Unterschied zwischen einer einvernehmlichen und einer streitigen Scheidung.",
    },
    {
      type: "cta",
      text: "Kostenrisiko vergleichen: Gericht oder Einigung?",
      href: "/kostenrechner?art=trennung",
    },
    {
      type: "paragraph",
      text: "Bei medipact wird genau dieses Jahr strukturiert genutzt: Die offenen Punkte werden nacheinander abgearbeitet, schriftlich und ohne gemeinsame Termine. Am Ende steht eine Vereinbarung, die Sie anwaltlich prüfen und – wo nötig – notariell beurkunden lassen.",
    },
    {
      type: "callout",
      text: "Dieser Artikel ersetzt keine Rechts- oder Steuerberatung. Fristen für Unterhalt und die steuerlichen Folgen der Trennung hängen am Einzelfall und sollten früh geprüft werden – hier entstehen die vermeidbarsten Verluste.",
    },
    {
      type: "cta",
      text: "Das Trennungsjahr nutzen statt abwarten",
      href: "/konflikte/trennung",
    },
  ],
  faq: [
    {
      question: "Wann beginnt das Trennungsjahr?",
      answer:
        "An dem Tag, an dem Sie tatsächlich getrennt leben – also keine häusliche Gemeinschaft mehr besteht und mindestens eine Seite sie nicht wiederherstellen will. Der Auszug ist der klarste Fall, aber nicht erforderlich: Das Trennungsjahr kann auch innerhalb derselben Wohnung laufen, wenn Haushalt und Finanzen konsequent getrennt sind.",
    },
    {
      question: "Muss man die Trennung irgendwo anmelden?",
      answer:
        "Nein. Es gibt keine Behörde und kein Formular für die Trennung. Das Trennungsdatum wird erst im Scheidungsantrag angegeben und von der anderen Seite bestätigt. Genau deshalb lohnt es sich, den Beginn selbst schriftlich festzuhalten – am besten in einer kurzen, von beiden unterschriebenen Erklärung mit Datum.",
    },
    {
      question: "Wie weist man das Trennungsjahr nach, wenn man in derselben Wohnung wohnt?",
      answer:
        "Durch die tatsächliche Trennung des Alltags: getrennte Schlafräume, getrennte Konten, kein Kochen oder Waschen füreinander, getrennte Freizeit. Am aussagekräftigsten ist eine gemeinsame schriftliche Erklärung mit dem Trennungsdatum. Zusätzlich helfen belegbare Änderungen wie eigene Konten und geänderte Daueraufträge.",
    },
    {
      question: "Unterbricht ein Versöhnungsversuch das Trennungsjahr?",
      answer:
        "Kurze Versuche über einen begrenzten Zeitraum nicht – die bereits abgelaufene Trennungszeit bleibt erhalten. Wer dagegen längere Zeit wieder als Paar zusammenlebt und gemeinsam wirtschaftet, beginnt das Trennungsjahr von vorn. Wo genau die Grenze liegt, ist eine Frage des Einzelfalls.",
    },
    {
      question: "Kann man sich ohne Trennungsjahr scheiden lassen?",
      answer:
        "Nur in seltenen Härtefällen, in denen ein Festhalten an der Ehe unzumutbar wäre – die Anforderungen daran sind hoch. Der Regelfall ist: nach einem Jahr Trennung mit Zustimmung beider Seiten, ohne Zustimmung erst nach deutlich längerer Zeit. Lassen Sie einen möglichen Härtefall anwaltlich prüfen.",
    },
  ],
  related: [
    { label: "Wer muss bei einer Trennung aus der Wohnung?", href: "/ratgeber/wer-muss-aus-der-wohnung" },
    { label: "Was steht mir bei der Scheidung zu?", href: "/ratgeber/was-steht-mir-bei-der-scheidung-zu" },
    { label: "Scheidung ohne Rosenkrieg", href: "/ratgeber/scheidung-ohne-rosenkrieg" },
    { label: "Trennung & Scheidung: Mediation im Überblick", href: "/konflikte/trennung" },
  ],
};
