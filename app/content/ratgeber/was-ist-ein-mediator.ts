import type { RatgeberArticle } from "./types";

// 09.11.2026: von ~730 auf ~1.700 Wörter ausgebaut. Abgrenzung im Cluster:
// dieser Artikel handelt von der PERSON (Pflichten, Ausbildung, Auswahl,
// Erstgespräch); Definition und Verfahren stehen in was-ist-mediation.
// Rechtsangaben geprüft gegen gesetze-im-internet.de: MediationsG §§ 2–5,
// ZMediatAusbV §§ 2–3 (130 Stunden, fünf supervidierte Mediationen binnen
// drei Jahren, 40 Stunden Fortbildung in vier Jahren; Fassung der Verordnung
// vom 11.07.2023). Zahlen bei einer Novelle dort nachsehen.
export const article: RatgeberArticle = {
  slug: "was-ist-ein-mediator",
  category: "Mediation",
  title: "Was ist ein Mediator? Aufgaben, Rolle und Ausbildung",
  metaTitle: "Was ist ein Mediator? Aufgaben und Rolle | medipact",
  description:
    "Was macht ein Mediator? Rolle, Aufgaben und Grenzen im Konflikt, der Unterschied zum Richter oder Anwalt und woran Sie einen guten Mediator erkennen.",
  eyebrow: "Ratgeber · Mediation",
  updated: "2026-11-09",
  readingMinutes: 9,
  intro:
    "Wenn zwei Menschen nicht mehr miteinander reden können, braucht es jemanden, der nicht mitstreitet. Jemanden, der zuhört, ohne Partei zu ergreifen, und der einen Raum schafft, in dem beide wieder ausreden dürfen. Das ist der Mediator: die neutrale Person, die durch ein Mediationsverfahren führt. Anders als ein Richter entscheidet er nichts – seine Aufgabe ist eine andere. Dieser Artikel erklärt, was ein Mediator genau tut, wozu ihn das Gesetz verpflichtet, wo seine Grenzen liegen und woran man einen guten erkennt.",
  blocks: [
    { type: "heading", text: "Die Rolle des Mediators" },
    {
      type: "paragraph",
      text: "Ein Mediator ist eine allparteiliche dritte Person, die Konfliktparteien dabei unterstützt, selbst eine Lösung zu finden. „Allparteilich“ bedeutet: Er steht nicht neutral daneben, sondern nimmt beide Seiten gleichermaßen ernst. Er sorgt für einen fairen Gesprächsrahmen, in dem beide gehört werden.",
    },
    {
      type: "paragraph",
      text: "Entscheidend ist, was ein Mediator gerade nicht tut: Er urteilt nicht, gibt keine Empfehlung ab und drängt keine Lösung auf. Die inhaltliche Verantwortung bleibt bei den Beteiligten. Das Mediationsgesetz fasst es knapp: Der Mediator ist eine unabhängige und neutrale Person ohne Entscheidungsbefugnis, die die Parteien durch die Mediation führt.",
    },
    {
      type: "paragraph",
      text: "Für viele ist das zunächst eine Enttäuschung. Wer lange gestritten hat, wünscht sich insgeheim jemanden, der endlich sagt: Sie haben recht. Ein Mediator sagt das nicht – zu keinem von beiden. Was er stattdessen anbietet, ist auf Dauer mehr wert: Er sorgt dafür, dass Sie beide gehört werden, vielleicht zum ersten Mal seit Monaten.",
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
        "Darauf achten, dass beide Seiten angemessen zu Wort kommen – auch die leisere",
        "Die Abschlussvereinbarung schriftlich festhalten",
      ],
    },
    {
      type: "paragraph",
      text: "Ein Beispiel: Ein Paar streitet seit Wochen darüber, wer in der gemeinsamen Wohnung bleibt. Im Gespräch fällt immer wieder derselbe Satz: „Du hast doch längst entschieden.“ Ein Mediator hakt an dieser Stelle nicht bei der Wohnung nach, sondern bei dem Satz. Was genau wurde entschieden, und wann hat der andere das Gefühl bekommen, nicht mehr gefragt zu werden? Oft löst sich die Sachfrage erst, wenn diese zweite Ebene einmal ausgesprochen ist.",
    },
    { type: "heading", text: "Wozu das Gesetz einen Mediator verpflichtet" },
    {
      type: "paragraph",
      text: "Seit 2012 regelt das Mediationsgesetz, was Sie von einem Mediator erwarten dürfen – unabhängig davon, wie er seine Arbeit selbst beschreibt. Die wichtigsten Pflichten:",
    },
    {
      type: "list",
      items: [
        "Aufklären: Er vergewissert sich, dass beide Seiten die Grundsätze und den Ablauf verstanden haben und freiwillig teilnehmen (§ 2 Abs. 2).",
        "Beiden verpflichtet sein: Er ist allen Parteien gleichermaßen verpflichtet und fördert ihre Kommunikation. Einzelgespräche führt er nur, wenn alle einverstanden sind (§ 2 Abs. 3).",
        "Offenlegen: Er muss alles nennen, was seine Unabhängigkeit und Neutralität beeinträchtigen kann – zum Beispiel, wenn er eine Seite privat kennt (§ 3 Abs. 1).",
        "Nicht in eigener Sache: Wer in derselben Angelegenheit schon für eine Partei tätig war, etwa als Anwalt, darf nicht Mediator sein – und darf auch danach keine Seite in dieser Sache vertreten (§ 3 Abs. 2).",
        "Schweigen: Er ist zur Verschwiegenheit über alles verpflichtet, was er im Verfahren erfährt (§ 4).",
        "Auf Prüfung hinweisen: Kommt es zur Einigung, wirkt er darauf hin, dass beide sie in Kenntnis der Sachlage treffen und ihren Inhalt verstehen. Wer ohne fachliche Beratung teilnimmt, wird auf die Möglichkeit hingewiesen, die Vereinbarung extern prüfen zu lassen (§ 2 Abs. 6).",
      ],
    },
    {
      type: "paragraph",
      text: "Auf Ihr Verlangen muss ein Mediator außerdem über seinen fachlichen Hintergrund, seine Ausbildung und seine Erfahrung Auskunft geben (§ 3 Abs. 5). Diese Frage dürfen Sie also ohne Scheu stellen – sie ist Ihr gutes Recht.",
    },
    { type: "heading", text: "Mediator, Richter oder Anwalt – wo ist der Unterschied?" },
    {
      type: "paragraph",
      text: "Ein Richter fällt ein Urteil, das für die Parteien verbindlich ist. Ein Anwalt vertritt einseitig die Interessen seiner Mandantschaft. Ein Mediator dagegen entscheidet nichts und vertritt niemanden einseitig – er hilft beiden Seiten gemeinsam dabei, eine eigene Lösung zu entwickeln.",
    },
    {
      type: "table",
      caption:
        "Mediator, Richter, Anwalt und Schlichter im Vergleich: für wen sie arbeiten, ob sie entscheiden und ob sie rechtlich beraten",
      headers: ["Rolle", "Arbeitet für", "Entscheidet?", "Berät rechtlich?"],
      rows: [
        ["Mediator", "Beide Seiten gleichermaßen", "Nein", "Nein, er verweist dafür an Anwälte oder Notare"],
        ["Richter", "Niemanden, er ist dem Gesetz verpflichtet", "Ja, durch Urteil", "Nein"],
        ["Anwalt", "Eine Seite", "Nein", "Ja, einseitig im Interesse der eigenen Mandantschaft"],
        ["Schlichter", "Beide Seiten", "Nein, macht aber einen eigenen Vorschlag", "Je nach Schlichtungsstelle"],
      ],
    },
    {
      type: "callout",
      text: "Kurz gesagt: Der Richter entscheidet für Sie, der Anwalt kämpft für Sie – der Mediator arbeitet mit Ihnen beiden.",
    },
    {
      type: "paragraph",
      text: "Mediator und Anwalt schließen sich dabei nicht aus. Viele Vereinbarungen entstehen in der Mediation und werden anschließend von Anwälten oder einem Notar geprüft. Die Mediation klärt, was Sie beide wollen; die rechtliche Prüfung stellt sicher, dass es so auch trägt.",
    },
    { type: "heading", text: "Ausbildung: Wer darf sich Mediator nennen?" },
    {
      type: "paragraph",
      text: "Die Berufsbezeichnung „Mediator“ ist in Deutschland nicht streng geschützt. Es gibt jedoch den gesetzlich geregelten „zertifizierten Mediator“, der eine Ausbildung nach den Vorgaben des Mediationsgesetzes und der zugehörigen Verordnung absolviert und sich regelmäßig fortbildet. Achten Sie deshalb auf Qualifikation und Erfahrung. Wenn Sie einen [Mediator finden](/mediator-finden) möchten, der zu Ihrem Konflikt passt, hilft das Verzeichnis von medipact.",
    },
    {
      type: "paragraph",
      text: "Was hinter dem Zusatz „zertifiziert“ steht, legt die Zertifizierte-Mediatoren-Ausbildungsverordnung fest: ein Ausbildungslehrgang von mindestens 130 Stunden, dazu fünf eigene Mediationen, die unter Supervision durchgeführt und innerhalb von drei Jahren nach dem Lehrgang abgeschlossen sein müssen. Danach folgt eine Fortbildungspflicht von mindestens 40 Stunden in jeweils vier Jahren. Wer sie nicht erfüllt, darf die Bezeichnung nicht weiter führen.",
    },
    {
      type: "paragraph",
      text: "Mediatoren kommen aus sehr unterschiedlichen Berufen: Juristinnen, Psychologen, Pädagoginnen, Steuerberater, Führungskräfte. Der Grundberuf sagt nichts über die Qualität, aber einiges über den Blickwinkel. Bei einer Trennung mit Kindern kann ein psychologischer oder pädagogischer Hintergrund helfen, bei einem Gesellschafterstreit wirtschaftliches Verständnis. Wichtiger als der Titel ist, ob die Person Erfahrung mit Konflikten wie Ihrem hat.",
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
    {
      type: "paragraph",
      text: "Dazu kommt etwas, das in keiner Urkunde steht: Sie müssen der Person beide vertrauen können. Mediation ist Beziehungsarbeit. Wenn einer von Ihnen das Gefühl hat, der Mediator sei eigentlich der Mediator des anderen, ist das Verfahren verloren, bevor es begonnen hat. Dieses Vertrauen entsteht nicht durch ein Profilfoto, sondern im Gespräch – und es darf Zeit brauchen.",
    },
    { type: "heading", text: "Fünf Fragen für das erste Gespräch" },
    {
      type: "list",
      items: [
        "Welche Ausbildung haben Sie, und wie viele Fälle wie unseren haben Sie begleitet?",
        "Wie rechnen Sie ab – nach Stunde oder pauschal – und womit müssen wir insgesamt rechnen?",
        "Führen Sie Einzelgespräche, und wie gehen Sie mit dem um, was Sie dort erfahren?",
        "Was tun Sie, wenn einer von uns das Gespräch dominiert oder der andere verstummt?",
        "An welcher Stelle empfehlen Sie, einen Anwalt oder Notar hinzuzuziehen?",
      ],
    },
    {
      type: "paragraph",
      text: "Ein guter Mediator beantwortet diese Fragen gern und konkret. Ausweichende Antworten, ein Erfolgsversprechen oder eine vorschnelle Einschätzung, wer „im Recht“ ist, sind dagegen Warnzeichen. Was eine Begleitung üblicherweise kostet, zeigt der Überblick zu den [Kosten einer Mediation](/ratgeber/mediation-kosten).",
    },
    { type: "heading", text: "Wie medipact die Rolle des Mediators unterstützt" },
    {
      type: "paragraph",
      text: "medipact übernimmt die strukturierende Funktion eines Mediators im digitalen Prozess: Es führt beide Seiten fair durch die Phasen, achtet auf einen sachlichen Rahmen und hilft, Interessen sichtbar zu machen. Bei rechtlich sensiblen Fragen bleibt die Empfehlung dieselbe wie bei jeder guten Mediation – das Ergebnis fachkundig prüfen zu lassen.",
    },
    {
      type: "paragraph",
      text: "Weil die passende Person so entscheidend ist, steht sie bei medipact am Anfang und nicht am Ende. Im Starterpaket lernen Sie Online-Mediation kennen, finden eine Mediatorin oder einen Mediator, bei dem Sie sich beide gut aufgehoben fühlen, und klären gemeinsam, ob eine Lösung überhaupt möglich erscheint. Die Einigung selbst entsteht erst danach – in dem Tempo, das Ihr Konflikt braucht. Was im Paket enthalten ist, steht unter [Preise](/preise).",
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
      question: "Wie lange dauert die Ausbildung zum zertifizierten Mediator?",
      answer:
        "Der Ausbildungslehrgang umfasst mindestens 130 Stunden. Hinzu kommen fünf supervidierte Mediationen innerhalb von drei Jahren nach dem Lehrgang und danach eine Fortbildung von mindestens 40 Stunden alle vier Jahre.",
    },
    {
      question: "Ist ein Mediator zur Verschwiegenheit verpflichtet?",
      answer:
        "Ja. Nach § 4 Mediationsgesetz muss ein Mediator über alles schweigen, was er im Verfahren erfährt. Ausnahmen gelten nur in engen Grenzen, etwa zur Abwendung einer Gefährdung des Kindeswohls.",
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
    { label: "Mediator finden", href: "/mediator-finden" },
    { label: "Die Phasen der Mediation", href: "/ratgeber/5-phasen-der-mediation" },
    { label: "Was kostet eine Mediation?", href: "/ratgeber/mediation-kosten" },
    { label: "Was kostet ein Mediator bei der Scheidung?", href: "/ratgeber/scheidung-mediator-kosten" },
  ],
};
