import type { RatgeberArticle } from "./types";

export const article: RatgeberArticle = {
  slug: "was-ist-ein-mediator",
  category: "Mediation",
  title: "Was ist ein Mediator? Aufgaben, Rolle und Ausbildung",
  metaTitle: "Was ist ein Mediator? Aufgaben und Rolle | medipact",
  description:
    "Was macht ein Mediator? Rolle, Aufgaben und Grenzen im Konflikt, der Unterschied zum Richter oder Anwalt und woran Sie einen guten Mediator erkennen.",
  eyebrow: "Ratgeber · Mediation",
  updated: "2026-07-04",
  readingMinutes: 5,
  intro:
    "Der Mediator ist die neutrale Person, die durch ein Mediationsverfahren führt. Doch anders als ein Richter entscheidet er nichts – seine Aufgabe ist eine andere. Dieser Artikel erklärt, was ein Mediator genau tut, wo seine Grenzen liegen und woran man einen guten erkennt.",
  blocks: [
    { type: "heading", text: "Die Rolle des Mediators" },
    {
      type: "paragraph",
      text: "Ein Mediator ist eine allparteiliche dritte Person, die Konfliktparteien dabei unterstützt, selbst eine Lösung zu finden. „Allparteilich“ bedeutet: Er steht nicht neutral daneben, sondern nimmt beide Seiten gleichermaßen ernst. Er sorgt für einen fairen Gesprächsrahmen, in dem beide gehört werden.",
    },
    {
      type: "paragraph",
      text: "Entscheidend ist, was ein Mediator gerade nicht tut: Er urteilt nicht, gibt keine Empfehlung ab und drängt keine Lösung auf. Die inhaltliche Verantwortung bleibt bei den Beteiligten.",
    },
    { type: "heading", text: "Aufgaben eines Mediators" },
    {
      type: "list",
      items: [
        "Das Gespräch strukturieren und durch die Phasen führen",
        "Auf die Einhaltung der vereinbarten Gesprächsregeln achten",
        "Durch Fragen helfen, Interessen hinter Positionen sichtbar zu machen",
        "Aussagen zusammenfassen und für gegenseitiges Verständnis sorgen",
        "Bei festgefahrenen Situationen deeskalieren und den Prozess in Gang halten",
        "Die Abschlussvereinbarung schriftlich festhalten",
      ],
    },
    { type: "heading", text: "Mediator, Richter oder Anwalt – wo ist der Unterschied?" },
    {
      type: "paragraph",
      text: "Ein Richter fällt ein Urteil, das für die Parteien verbindlich ist. Ein Anwalt vertritt einseitig die Interessen seiner Mandantschaft. Ein Mediator dagegen entscheidet nichts und vertritt niemanden einseitig – er hilft beiden Seiten gemeinsam dabei, eine eigene Lösung zu entwickeln.",
    },
    {
      type: "callout",
      text: "Kurz gesagt: Der Richter entscheidet für Sie, der Anwalt kämpft für Sie – der Mediator arbeitet mit Ihnen beiden.",
    },
    { type: "heading", text: "Ausbildung: Wer darf sich Mediator nennen?" },
    {
      type: "paragraph",
      text: "Die Berufsbezeichnung „Mediator“ ist in Deutschland nicht streng geschützt. Es gibt jedoch den gesetzlich geregelten „zertifizierten Mediator“, der eine Ausbildung nach den Vorgaben des Mediationsgesetzes und der zugehörigen Verordnung absolviert und sich regelmäßig fortbildet. Achten Sie deshalb auf Qualifikation und Erfahrung.",
    },
    { type: "heading", text: "Woran erkennt man einen guten Mediator?" },
    {
      type: "list",
      items: [
        "Nachweisbare Ausbildung und Erfahrung im relevanten Konfliktbereich",
        "Klare Erklärung von Ablauf, Rolle und Kosten zu Beginn",
        "Echte Allparteilichkeit – keine Seite wird bevorzugt",
        "Gute Fragetechnik und die Fähigkeit, zuzuhören und zusammenzufassen",
        "Transparenz über Grenzen: Wann rät er zu anwaltlicher oder notarieller Prüfung?",
      ],
    },
    { type: "heading", text: "Wie medipact die Rolle des Mediators unterstützt" },
    {
      type: "paragraph",
      text: "medipact übernimmt die strukturierende Funktion eines Mediators im digitalen Prozess: Es führt beide Seiten fair durch die Phasen, achtet auf einen sachlichen Rahmen und hilft, Interessen sichtbar zu machen. Bei rechtlich sensiblen Fragen bleibt die Empfehlung dieselbe wie bei jeder guten Mediation – das Ergebnis fachkundig prüfen zu lassen.",
    },
  ],
  faq: [
    {
      question: "Was macht ein Mediator?",
      answer:
        "Ein Mediator führt neutral durch ein Konfliktgespräch, sorgt für faire Regeln und hilft beiden Seiten, ihre Interessen zu klären und selbst eine Lösung zu finden. Er entscheidet und urteilt dabei nicht.",
    },
    {
      question: "Darf ein Mediator eine Lösung vorschlagen?",
      answer:
        "Grundsätzlich hält sich ein Mediator inhaltlich zurück; die Lösung entwickeln die Parteien selbst. Er kann Optionen sichtbar machen und Denkanstöße geben, drängt aber kein bestimmtes Ergebnis auf.",
    },
    {
      question: "Ist die Bezeichnung Mediator geschützt?",
      answer:
        "Der Begriff „Mediator“ allein ist nicht streng geschützt. Geregelt ist jedoch der „zertifizierte Mediator“, der eine Ausbildung nach dem Mediationsgesetz absolviert und sich fortbildet.",
    },
    {
      question: "Was ist der Unterschied zwischen Mediator und Anwalt?",
      answer:
        "Ein Anwalt vertritt einseitig die Interessen einer Partei. Ein Mediator ist allparteilich und unterstützt beide Seiten gemeinsam dabei, eine einvernehmliche Lösung zu erarbeiten.",
    },
  ],
  related: [
    { label: "Kostenrechner: Gericht oder Einigung?", href: "/kostenrechner" },
    { label: "Was ist Mediation?", href: "/ratgeber/was-ist-mediation" },
    { label: "Die Phasen der Mediation", href: "/ratgeber/5-phasen-der-mediation" },
    { label: "Was kostet eine Mediation?", href: "/ratgeber/mediation-kosten" },
  ],
};
