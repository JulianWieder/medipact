import type { RatgeberArticle } from "./types";

// Keywords: akuter Konflikt was tun, Streit eskaliert, Konflikt eskaliert was
// tun, Streit mit Nachbarn eskaliert, akute Konfliktsituation, Sofortmaßnahmen.
// CTA-Ziel: /konflikt-logbuch (sofort dokumentieren) + /preise (Mediation).

export const article: RatgeberArticle = {
  slug: "akuter-konflikt-was-tun",
  category: "Mediation",
  title: "Akuter Konflikt: Was Sie jetzt tun sollten – und was nicht",
  metaTitle: "Akuter Konflikt: Was tun, wenn es eskaliert? | medipact",
  description:
    "Der Streit eskaliert gerade? Ruhe bewahren, nichts Unumkehrbares tun, sofort dokumentieren – und die nächsten Schritte klug wählen.",
  eyebrow: "Ratgeber · Mediation",
  updated: "2026-07-21",
  readingMinutes: 8,
  intro:
    "Eine wütende E-Mail, ein eskaliertes Gespräch im Treppenhaus, eine Drohung mit dem Anwalt: In der akuten Konfliktlage entscheidet sich oft, ob ein Streit lösbar bleibt oder dauerhaft vergiftet wird. Die gute Nachricht: Die ersten 48 Stunden folgen einfachen Regeln. Dieser Ratgeber zeigt, was jetzt hilft – und welche verständlichen Impulse Sie teuer zu stehen kommen können.",
  blocks: [
    { type: "heading", text: "Regel 1: Nichts Unumkehrbares tun" },
    {
      type: "paragraph",
      text: "Im akuten Konflikt arbeitet Ihr Körper gegen Sie: Adrenalin macht schnell, laut und absolut. Fast alles, was Konflikte dauerhaft unlösbar macht, passiert in genau diesem Zustand – die beleidigende Antwort-Mail, das Ultimatum, die Kündigung des Gesprächsfadens, der vorschnelle Anwaltsbrief. Die wichtigste Sofortmaßnahme kostet nichts: 24 Stunden zwischen Impuls und Reaktion legen. Kein wichtiger Konflikt wurde je verloren, weil eine Antwort einen Tag später kam.",
    },
    {
      type: "callout",
      text: "Schreiben Sie die wütende Antwort ruhig – aber nicht im E-Mail-Programm, sondern in Ihr privates Journal. Der Dampf ist raus, gesendet ist nichts, und Sie haben festgehalten, wie es Ihnen wirklich geht.",
    },
    { type: "heading", text: "Regel 2: Sofort dokumentieren – solange die Erinnerung frisch ist" },
    {
      type: "paragraph",
      text: "Was auch immer als Nächstes passiert – ein klärendes Gespräch, eine Mediation oder im schlimmsten Fall ein Gerichtsverfahren – Ihre stärkste Ressource ist eine saubere, zeitnahe Dokumentation. Halten Sie noch am selben Tag fest: Was genau ist passiert, wann, wer war beteiligt, was wurde (möglichst wörtlich) gesagt? Sichern Sie Belege: Screenshots von Nachrichten, E-Mails, Fotos. Erinnerungen verblassen in Tagen; ein Gedächtnisprotokoll vom selben Abend ist Gold wert.",
    },
    {
      type: "paragraph",
      text: "Trennen Sie dabei Fakten von Gefühlen: Die sachliche Chronologie können Sie später vorzeigen – Ihre Wut, Angst und Ihre ungefilterten Gedanken gehören in einen privaten Journal-Eintrag, den niemand außer Ihnen liest. Beides hat seinen Platz, aber nicht im selben Text.",
    },
    { type: "heading", text: "Regel 3: Den Konflikt nicht verbreitern" },
    {
      type: "list",
      items: [
        "Keine Verbündeten-Rekrutierung: Wer Nachbarn, Kollegen oder die Familie zur Partei macht, macht die Lösung um jede dieser Personen schwerer.",
        "Keine Öffentlichkeit: Ein wütender Social-Media-Post oder eine Rundmail fühlt sich nach Gerechtigkeit an – und ist später das größte Hindernis für jede Einigung (und manchmal ein rechtliches Risiko).",
        "Keine Nebenkriegsschauplätze: Jetzt nicht zusätzlich die Parkplatzfrage, die alte Rechnung und den Ton von vor drei Jahren aufmachen. Ein Thema, ein Konflikt.",
      ],
    },
    { type: "heading", text: "Die ersten 48 Stunden: eine kleine Checkliste" },
    {
      type: "list",
      items: [
        "Durchatmen und 24 Stunden nicht reagieren (bei Fristen: nur das Nötigste, sachlich).",
        "Vorfall dokumentieren: Chronologie, Zitate, Beteiligte, Belege sichern.",
        "Gefühle ins private Journal – nicht in die Antwort.",
        "Klären, was Sie eigentlich wollen: Wiedergutmachung? Ruhe? Die Beziehung retten? Ihre Antwort bestimmt den richtigen nächsten Schritt.",
        "Erst dann reagieren: kurz, sachlich, ohne Vorwürfe – oder bewusst ein Gesprächsangebot machen.",
      ],
    },
    { type: "heading", text: "Wann Sie Hilfe von außen holen sollten" },
    {
      type: "paragraph",
      text: "Nicht jeder akute Streit braucht Dritte. Aber es gibt klare Signale: Sie reden nur noch schriftlich miteinander, jedes Gespräch eskaliert nach Minuten, es stehen Drohungen im Raum, oder der Konflikt kostet Sie Schlaf und Gesundheit. Dann ist eine Mediation meist der schnellste und günstigste Weg – gerade weil sie früh ansetzt, bevor Positionen zementiert sind. Ihre Dokumentation aus den ersten Tagen gibt dem Verfahren einen sauberen Start.",
    },
    {
      type: "paragraph",
      text: "Bei Gewalt oder Bedrohung gilt das alles nicht: Dann geht Ihre Sicherheit vor – holen Sie sofort Hilfe (im Notfall die Polizei).",
    },
    {
      type: "cta",
      text: "Jetzt kostenlos dokumentieren: das Konflikt-Logbuch",
      href: "/konflikt-logbuch",
    },
  ],
  faq: [
    {
      question: "Was sollte ich als Erstes tun, wenn ein Streit eskaliert?",
      answer:
        "Nicht sofort reagieren: 24 Stunden Abstand verhindern die Fehler, die Konflikte unlösbar machen. Dokumentieren Sie stattdessen zeitnah den Vorfall mit Datum, Beteiligten und Zitaten und sichern Sie Belege wie Screenshots.",
    },
    {
      question: "Soll ich auf eine wütende E-Mail sofort antworten?",
      answer:
        "Nein. Antworten Sie frühestens am nächsten Tag, kurz und sachlich. Den Ärger schreiben Sie sich vorher in einem privaten Journal-Eintrag von der Seele – so bleibt die Antwort professionell und der Konflikt lösbar.",
    },
    {
      question: "Wann brauche ich bei einem akuten Konflikt Hilfe von außen?",
      answer:
        "Wenn Gespräche regelmäßig eskalieren, nur noch schriftlich kommuniziert wird, Drohungen im Raum stehen oder der Streit Ihre Gesundheit angreift. Dann ist eine früh angesetzte Mediation meist der schnellste Weg zurück zu einer Lösung.",
    },
    {
      question: "Warum ist Dokumentation im akuten Konflikt so wichtig?",
      answer:
        "Weil Erinnerungen in Tagen verblassen und jede spätere Instanz – Gespräch, Mediation, Anwalt, Gericht – zuerst fragt: Was ist wann passiert? Eine zeitnahe Chronologie mit Belegen macht Sie glaubwürdig und handlungsfähig.",
    },
  ],
  related: [
    { label: "Konflikt dokumentieren: das Streit-Tagebuch", href: "/ratgeber/konflikt-dokumentieren" },
    { label: "Konflikt-Journal: Gefühle privat sortieren", href: "/ratgeber/konflikt-journal" },
    { label: "Gericht oder Mediation?", href: "/ratgeber/gericht-oder-mediation" },
    { label: "Das kostenlose Konflikt-Logbuch", href: "/konflikt-logbuch" },
  ],
};
