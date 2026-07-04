// ── Ratgeber-Artikel (SEO-Content) ─────────────────────────────────────────
//
// Original verfasste Artikel für den Ratgeber-Bereich (/ratgeber). NICHTS aus
// fremden Quellen kopieren — jeder Text ist eigenständig formuliert und auf
// medipact zugeschnitten. Gerendert von RatgeberArtikelTemplate.tsx.
//
// Hinweis zu Fakten: Rechtliche/historische Angaben (z. B. Mediationsgesetz
// seit 2012) sind nach bestem Wissen korrekt, sollten vor Veröffentlichung
// aber noch einmal gegengelesen werden. Keine erfundenen Statistiken.

export type RatgeberBlock =
  | { type: "heading"; text: string; id?: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; text: string };

export type RatgeberFaq = {
  /** Frage so formulieren, wie Nutzer sie googeln. */
  question: string;
  /** Erster Satz = direkte Antwort (~30 Wörter) für "Nutzer fragen auch". */
  answer: string;
};

export type RatgeberArticle = {
  slug: string;
  /** Kategorie-Label (aktuell nur "Mediation"). */
  category: string;
  /** Sichtbare H1. */
  title: string;
  /** <title> im <head> (mit "| medipact"). */
  metaTitle: string;
  /** Meta-Description + Intro-Absatz. */
  description: string;
  eyebrow: string;
  /** ISO-Datum letzte inhaltliche Aktualisierung. */
  updated: string;
  readingMinutes: number;
  /** Lead-Absatz oben im Artikel. */
  intro: string;
  blocks: RatgeberBlock[];
  faq: RatgeberFaq[];
  /** Interne Verlinkung ans Ende (andere Artikel/Seiten). */
  related: { label: string; href: string }[];
};

export const ratgeberArticles: RatgeberArticle[] = [
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: "5-phasen-der-mediation",
    category: "Mediation",
    title: "Die Phasen der Mediation – das 7-Phasen-Modell erklärt",
    metaTitle: "Die Phasen der Mediation: das 7-Phasen-Modell erklärt | medipact",
    description:
      "Die Phasen der Mediation im Überblick – oft als 5 Phasen zusammengefasst, hier als ausführliches 7-Phasen-Modell: von der Vorbereitung über die Interessenklärung bis zur Umsetzung.",
    eyebrow: "Ratgeber · Mediation",
    updated: "2026-07-04",
    readingMinutes: 8,
    intro:
      "Eine Mediation folgt einem klaren, aufeinander aufbauenden Ablauf. Häufig wird er als Fünf-Phasen-Modell zusammengefasst; ausführlicher betrachtet gliedert er sich in sieben Phasen – von der Vorbereitung bis zur Umsetzung. Dieses Modell gibt dem Gespräch Struktur und sorgt dafür, dass am Ende eine tragfähige Lösung steht statt eines neuen Streits.",
    blocks: [
      { type: "heading", text: "Wie viele Phasen hat die Mediation – 5, 6 oder 7?" },
      {
        type: "paragraph",
        text: "Mediation ist ein strukturiertes Verfahren zur Konfliktlösung, bei dem eine neutrale dritte Person – der Mediator – die Beteiligten dabei unterstützt, selbst eine Lösung zu finden. Damit dieser Prozess nicht im Kreis läuft, folgt er einem festen Ablauf. Am bekanntesten ist das Fünf-Phasen-Modell, das auf den Mediationsforscher Christoph Besemer zurückgeht. Zählt man die Vorbereitung davor und die Umsetzung danach mit und trennt die Abschlussphase in Bewertung und Vereinbarung, ergibt sich das ausführlichere Sieben-Phasen-Modell. Ob 5, 6 oder 7 – gemeint ist immer derselbe Prozess, nur unterschiedlich fein unterteilt.",
      },
      {
        type: "paragraph",
        text: "Wichtig ist die Reihenfolge: Jede Phase baut auf der vorherigen auf. Erst wenn geklärt ist, worum es überhaupt geht und was den Parteien wirklich wichtig ist, ergibt die Suche nach Lösungen Sinn. Genau dieser Aufbau ist es, der Mediation von einem gewöhnlichen Streitgespräch unterscheidet. Im Folgenden die sieben Phasen im Detail.",
      },
      { type: "heading", text: "Phase 1: Vorbereitung und Arbeitsbündnis" },
      {
        type: "paragraph",
        text: "Noch vor dem eigentlichen Gespräch steht die Vorbereitung. Es wird geklärt, ob Mediation für den Konflikt überhaupt geeignet ist und ob alle Beteiligten freiwillig mitmachen. Der Mediator nimmt Kontakt zu beiden Seiten auf und schafft den organisatorischen Rahmen – erst wenn alle an Bord sind, kann die Mediation beginnen.",
      },
      { type: "heading", text: "Phase 2: Einleitung und Auftragsklärung" },
      {
        type: "paragraph",
        text: "In der Einleitung geht es um den Rahmen. Der Mediator erklärt, wie das Verfahren abläuft und welche Rolle er einnimmt: Er moderiert das Gespräch, ergreift aber für keine Seite Partei und schlägt auch keine Lösung vor. Die Verantwortung für das Ergebnis bleibt bei den Beteiligten.",
      },
      {
        type: "paragraph",
        text: "Gemeinsam werden Gesprächsregeln vereinbart – etwa ausreden lassen, keine Beleidigungen, Vertraulichkeit. Anschließend wird häufig eine Mediationsvereinbarung geschlossen, die den Rahmen und die Freiwilligkeit festhält.",
      },
      {
        type: "list",
        items: [
          "Ablauf und Rolle des Mediators werden erklärt",
          "Gesprächsregeln werden gemeinsam festgelegt",
          "Freiwilligkeit und Vertraulichkeit werden zugesichert",
          "Eine Mediationsvereinbarung kann unterzeichnet werden",
        ],
      },
      { type: "heading", text: "Phase 3: Themensammlung" },
      {
        type: "paragraph",
        text: "Jetzt wird zusammengetragen, worüber überhaupt gesprochen werden soll. Beide Seiten schildern aus ihrer Sicht, welche Themen und Streitpunkte offen sind – zunächst ohne Bewertung und ohne Diskussion. Der Mediator sammelt, ordnet und fasst zusammen, damit eine gemeinsame Themenliste entsteht.",
      },
      {
        type: "paragraph",
        text: "Diese Phase schafft Überblick. Oft zeigt sich hier bereits, dass hinter einem großen Streit mehrere kleinere, klar benennbare Themen stecken, die sich einzeln bearbeiten lassen.",
      },
      { type: "heading", text: "Phase 4: Interessenklärung" },
      {
        type: "paragraph",
        text: "Diese Phase ist das Herzstück der Mediation. Hinter jeder Forderung – der sogenannten Position – steckt ein tieferliegendes Interesse: ein Bedürfnis, eine Sorge, ein Wunsch. Während Positionen sich oft gegenseitig ausschließen, lassen sich Interessen häufig miteinander vereinbaren.",
      },
      {
        type: "callout",
        text: "Beispiel: Zwei Nachbarn streiten über einen Zaun (Position). Dahinter stehen das Bedürfnis nach Ruhe auf der einen und nach einem freien Blick auf der anderen Seite (Interessen). Kennt man die Interessen, wird eine Lösung möglich, die beiden gerecht wird.",
      },
      {
        type: "paragraph",
        text: "Der Mediator unterstützt diesen Schritt mit Fragen, spiegelt Aussagen und hilft, gegenseitiges Verständnis aufzubauen. Erst wenn die Interessen klar sind, ist die Grundlage für gute Lösungen gelegt.",
      },
      { type: "heading", text: "Phase 5: Suche nach Lösungsoptionen" },
      {
        type: "paragraph",
        text: "Nun werden Ideen entwickelt – möglichst viele und zunächst ohne Bewertung. Methoden wie Brainstorming helfen, kreativ zu werden und auch ungewöhnliche Optionen zuzulassen. Ziel ist es, Lösungen zu finden, die mehrere Interessen gleichzeitig erfüllen (Win-win), statt einen Kompromiss zu erzwingen, mit dem am Ende niemand zufrieden ist.",
      },
      { type: "heading", text: "Phase 6: Bewertung und Verhandlung" },
      {
        type: "paragraph",
        text: "Die gesammelten Ideen werden nun bewertet und verhandelt: Ist die Lösung fair für alle? Ist sie praktisch umsetzbar? Was spricht dafür, was dagegen? Schritt für Schritt nähern sich die Parteien der Option, die beiden am besten gerecht wird, und arbeiten deren Details konkret aus – wer tut was bis wann.",
      },
      { type: "heading", text: "Phase 7: Abschlussvereinbarung und Umsetzung" },
      {
        type: "paragraph",
        text: "Die beste Lösung wird in einer schriftlichen Abschlussvereinbarung festgehalten und von den Beteiligten unterzeichnet. Damit ist die Mediation abgeschlossen. In der Umsetzungsphase wird die Vereinbarung im Alltag gelebt; optional prüft ein Folgetermin, ob sie in der Praxis hält, und klärt offene Punkte.",
      },
      { type: "heading", text: "Fester Rahmen – individuell auf Ihren Fall angepasst" },
      {
        type: "paragraph",
        text: "Grundsätzlich ist dieser Phasenablauf vorgegeben – er gibt der Mediation ihre bewährte, verlässliche Struktur. Bei medipact bleibt er aber nicht starr: Der Mediator passt den Ablauf über den Workflow individuell auf Ihren Fall an – einzelne Schritte lassen sich ergänzen, weglassen oder in der Reihenfolge verschieben, je nachdem, was Ihr Konflikt konkret braucht. So verbinden sich die Verlässlichkeit des Phasenmodells und die Flexibilität, die reale Konflikte oft verlangen.",
      },
      {
        type: "paragraph",
        text: "So bildet medipact die bewährten Phasen der Mediation digital ab – beide Seiten werden strukturiert und im eigenen Tempo durch das Verfahren geführt, während der Mediator den Weg passgenau auf ihre Situation zuschneidet.",
      },
    ],
    faq: [
      {
        question: "Wie viele Phasen hat eine Mediation?",
        answer:
          "Je nach Darstellung fünf, sechs oder sieben. Das ausführliche Sieben-Phasen-Modell umfasst: Vorbereitung, Einleitung, Themensammlung, Interessenklärung, Suche nach Lösungsoptionen, Bewertung und Verhandlung sowie Abschlussvereinbarung und Umsetzung.",
      },
      {
        question: "Was ist die wichtigste Phase der Mediation?",
        answer:
          "Als Herzstück gilt die Interessenklärung. Hier wird herausgearbeitet, welche Bedürfnisse hinter den Forderungen stehen – die Grundlage für Lösungen, die für beide Seiten tragfähig sind.",
      },
      {
        question: "Muss man alle Phasen der Mediation durchlaufen?",
        answer:
          "Ja, die Reihenfolge ist bewusst aufeinander aufgebaut. Jede Phase schafft die Grundlage für die nächste. Erst wenn Themen und Interessen geklärt sind, ergibt die Lösungssuche Sinn.",
      },
      {
        question: "Wer hat das Phasenmodell der Mediation entwickelt?",
        answer:
          "Das bekannte Fünf-Phasen-Modell geht auf den Mediator und Autor Christoph Besemer zurück. Es ist heute ein weit verbreiteter Standard für den Ablauf von Mediationsverfahren.",
      },
    ],
    related: [
      { label: "Was ist Mediation? Definition & Ablauf", href: "/ratgeber/was-ist-mediation" },
      { label: "Was ist ein Mediator?", href: "/ratgeber/was-ist-ein-mediator" },
      { label: "So funktioniert medipact", href: "/methode" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  {
    slug: "was-ist-mediation",
    category: "Mediation",
    title: "Was ist Mediation? Definition, Ablauf und Vorteile",
    metaTitle: "Was ist Mediation? Definition, Ablauf & Vorteile | medipact",
    description:
      "Mediation einfach erklärt: Was Mediation bedeutet, wie ein Mediationsverfahren abläuft, wann es sich eignet und welche Vorteile es gegenüber dem Gericht hat.",
    eyebrow: "Ratgeber · Mediation",
    updated: "2026-07-04",
    readingMinutes: 6,
    intro:
      "Mediation ist ein Weg, Konflikte außergerichtlich und einvernehmlich zu lösen – mit Unterstützung einer neutralen Person, aber in Eigenverantwortung der Beteiligten. Dieser Artikel erklärt, was Mediation genau ist, wie sie abläuft und wann sie sinnvoll ist.",
    blocks: [
      { type: "heading", text: "Definition: Was bedeutet Mediation?" },
      {
        type: "paragraph",
        text: "Mediation ist ein freiwilliges und vertrauliches Verfahren, in dem eine allparteiliche dritte Person – der Mediator – Konfliktparteien dabei unterstützt, selbst eine gemeinsame Lösung zu erarbeiten. Der Mediator entscheidet nicht und urteilt nicht; er sorgt für einen fairen, strukturierten Gesprächsrahmen. Die Verantwortung für das Ergebnis bleibt vollständig bei den Beteiligten.",
      },
      {
        type: "paragraph",
        text: "In Deutschland ist Mediation seit 2012 gesetzlich geregelt: Das Mediationsgesetz definiert die Grundsätze des Verfahrens, etwa Freiwilligkeit, Vertraulichkeit und die Neutralität des Mediators.",
      },
      { type: "heading", text: "Die Grundprinzipien der Mediation" },
      {
        type: "list",
        items: [
          "Freiwilligkeit: Alle Beteiligten nehmen freiwillig teil und können jederzeit aussteigen.",
          "Vertraulichkeit: Was in der Mediation besprochen wird, bleibt vertraulich.",
          "Allparteilichkeit: Der Mediator steht auf keiner Seite und bewertet nicht.",
          "Eigenverantwortung: Die Lösung entwickeln die Parteien selbst, nicht der Mediator.",
          "Ergebnisoffenheit: Das Verfahren schreibt kein bestimmtes Ergebnis vor.",
        ],
      },
      { type: "heading", text: "Wie läuft eine Mediation ab?" },
      {
        type: "paragraph",
        text: "Ein Mediationsverfahren folgt einem klaren Aufbau, dem Phasenmodell. Nach einer Einleitung, in der Ablauf und Regeln geklärt werden, sammeln die Beteiligten die Themen, arbeiten ihre Interessen heraus, entwickeln Lösungsoptionen und halten die beste Lösung in einer Abschlussvereinbarung fest.",
      },
      {
        type: "callout",
        text: "Den kompletten Ablauf erklären wir Schritt für Schritt im Artikel „Die Phasen der Mediation“.",
      },
      { type: "heading", text: "Wann ist Mediation sinnvoll?" },
      {
        type: "paragraph",
        text: "Mediation eignet sich besonders, wenn die Beteiligten grundsätzlich eine Lösung suchen und auch künftig miteinander zu tun haben – etwa als Eltern, Nachbarn, Erben oder Geschäftspartner. Typische Einsatzfelder sind Trennung und Scheidung, Nachbarschaftskonflikte, Erb- und Familienstreitigkeiten sowie Konflikte am Arbeitsplatz.",
      },
      {
        type: "paragraph",
        text: "Weniger geeignet ist Mediation, wenn eine Seite gar nicht verhandeln will, ein starkes Machtungleichgewicht besteht oder eine schnelle gerichtliche Klärung zwingend nötig ist.",
      },
      { type: "heading", text: "Vorteile gegenüber einem Gerichtsverfahren" },
      {
        type: "list",
        items: [
          "Schneller: Viele Konflikte lassen sich in Wochen statt Jahren klären.",
          "Günstiger: Ein Verfahren ist meist deutlich preiswerter als ein streitiger Prozess.",
          "Selbstbestimmt: Die Lösung kommt von den Beteiligten, nicht von einem Urteil.",
          "Beziehungserhaltend: Der Umgangston bleibt fair – wichtig, wenn man sich wiedersieht.",
          "Vertraulich: Anders als ein Gerichtsverfahren findet Mediation nicht öffentlich statt.",
        ],
      },
      { type: "heading", text: "Mediation online mit medipact" },
      {
        type: "paragraph",
        text: "medipact macht das Prinzip der Mediation digital zugänglich: Beide Seiten werden strukturiert durch den Prozess geführt – schriftlich, im eigenen Tempo und ohne die Hürde eines gemeinsamen Termins vor Ort. Das Verfahren orientiert sich am bewährten Ablauf einer klassischen Mediation und bleibt dabei niedrigschwellig und fair für alle Beteiligten.",
      },
    ],
    faq: [
      {
        question: "Was ist Mediation einfach erklärt?",
        answer:
          "Mediation ist ein freiwilliges Verfahren, bei dem eine neutrale Person zwei Konfliktparteien hilft, selbst eine gemeinsame Lösung zu finden. Der Mediator entscheidet nicht, sondern moderiert das Gespräch.",
      },
      {
        question: "Ist Mediation rechtlich bindend?",
        answer:
          "Die Mediation selbst ist ergebnisoffen. Die am Ende geschlossene Abschlussvereinbarung ist jedoch ein Vertrag und damit bindend. Für bestimmte Inhalte kann zusätzlich eine notarielle Beurkundung nötig sein.",
      },
      {
        question: "Was kostet eine Mediation?",
        answer:
          "Die Kosten hängen von Anbieter, Umfang und Abrechnung ab, meist pro Stunde. Online-Verfahren sind in der Regel günstiger. Details finden Sie in unserem Artikel zu den Mediationskosten.",
      },
      {
        question: "Ersetzt Mediation einen Anwalt?",
        answer:
          "Nein. Mediation ist eine Alternative zur einvernehmlichen Einigung. Bei komplexen rechtlichen Fragen – etwa bei Scheidung oder Erbe – sollte das Ergebnis zusätzlich anwaltlich oder notariell geprüft werden.",
      },
    ],
    related: [
      { label: "Die Phasen der Mediation", href: "/ratgeber/5-phasen-der-mediation" },
      { label: "Was ist ein Mediator?", href: "/ratgeber/was-ist-ein-mediator" },
      { label: "Was kostet eine Mediation?", href: "/ratgeber/mediation-kosten" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  {
    slug: "was-ist-ein-mediator",
    category: "Mediation",
    title: "Was ist ein Mediator? Aufgaben, Rolle und Ausbildung",
    metaTitle: "Was ist ein Mediator? Aufgaben, Rolle & Ausbildung | medipact",
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
      { label: "Was ist Mediation?", href: "/ratgeber/was-ist-mediation" },
      { label: "Die Phasen der Mediation", href: "/ratgeber/5-phasen-der-mediation" },
      { label: "Was kostet eine Mediation?", href: "/ratgeber/mediation-kosten" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  {
    slug: "mediation-kosten",
    category: "Mediation",
    title: "Was kostet eine Mediation? Kosten und Preise im Überblick",
    metaTitle: "Was kostet eine Mediation? Kosten & Preise im Überblick | medipact",
    description:
      "Was eine Mediation kostet: Stundensätze, typische Gesamtkosten, wer zahlt und wie sich Mediation preislich zum Gericht verhält – plus günstige Online-Alternative.",
    eyebrow: "Ratgeber · Mediation",
    updated: "2026-07-04",
    readingMinutes: 6,
    intro:
      "Was eine Mediation kostet, hängt von mehreren Faktoren ab – vom Umfang des Konflikts bis zur Art der Abrechnung. Dieser Artikel gibt einen Überblick über die üblichen Preismodelle, wer die Kosten trägt und wie Mediation im Vergleich zum Gericht abschneidet.",
    blocks: [
      { type: "heading", text: "Wie wird Mediation abgerechnet?" },
      {
        type: "paragraph",
        text: "Am häufigsten rechnen Mediatorinnen und Mediatoren nach Stundensatz ab. Die Höhe variiert je nach Qualifikation, Region und Art des Konflikts – bei privaten Konflikten liegt der Stundensatz meist niedriger als bei komplexen Wirtschaftsmediationen. Neben der Abrechnung pro Stunde gibt es auch Pauschalpreise für ein komplettes Verfahren, was die Kosten planbarer macht.",
      },
      {
        type: "list",
        items: [
          "Stundensatz: Abrechnung nach tatsächlichem Zeitaufwand.",
          "Pauschale: Fester Preis für das gesamte Verfahren – gut kalkulierbar.",
          "Online-Mediation: In der Regel günstiger, da kein Vor-Ort-Aufwand anfällt.",
        ],
      },
      { type: "heading", text: "Womit muss man insgesamt rechnen?" },
      {
        type: "paragraph",
        text: "Die Gesamtkosten ergeben sich aus Stundensatz mal Anzahl der Sitzungen. Wie viele Sitzungen nötig sind, hängt stark vom Konflikt ab: Ein klar umrissenes Thema ist oft in wenigen Sitzungen gelöst, eine komplexe Trennung mit mehreren Streitpunkten braucht mehr Zeit. Genaue Pauschalbeträge lassen sich seriös nur im Einzelfall nennen – lassen Sie sich vorab ein transparentes Angebot geben.",
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
      { type: "heading", text: "Mediation vs. Gericht: der Kostenvergleich" },
      {
        type: "paragraph",
        text: "Ein streitiges Gerichtsverfahren verursacht Gerichts- und Anwaltskosten, die sich am Streitwert orientieren und schnell hoch werden – dazu kommt oft eine Verfahrensdauer von Jahren. Mediation ist demgegenüber meist deutlich günstiger und schneller, weil sie auf Einigung statt auf Streit setzt. Hinzu kommt ein schwer bezifferbarer Vorteil: Eine einvernehmliche Lösung erhält die Beziehung, was gerade bei Familien, Nachbarn oder Geschäftspartnern viel wert ist.",
      },
      { type: "heading", text: "Was kostet Mediation bei medipact?" },
      {
        type: "paragraph",
        text: "medipact setzt auf transparente, planbare Preise statt auf offene Stundenabrechnung. Weil das Verfahren online und strukturiert abläuft, ist es günstiger als eine klassische Vor-Ort-Mediation – ohne auf den bewährten Ablauf zu verzichten. Die aktuellen Preise finden Sie auf unserer Preisseite.",
      },
      {
        type: "callout",
        text: "Aktuelle Preise und Leistungsumfang: siehe /preise. (Bitte konkrete Beträge vor Veröffentlichung mit der Preisseite abgleichen.)",
      },
    ],
    faq: [
      {
        question: "Was kostet eine Mediation pro Stunde?",
        answer:
          "Der Stundensatz variiert je nach Qualifikation, Region und Konfliktart. Private Mediationen liegen meist niedriger als Wirtschaftsmediationen. Online-Verfahren sind in der Regel günstiger als Sitzungen vor Ort.",
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
      { label: "Was ist Mediation?", href: "/ratgeber/was-ist-mediation" },
      { label: "Die Phasen der Mediation", href: "/ratgeber/5-phasen-der-mediation" },
      { label: "Preise ansehen", href: "/preise" },
    ],
  },
];

export const ratgeberBySlug: Record<string, RatgeberArticle> = Object.fromEntries(
  ratgeberArticles.map((a) => [a.slug, a]),
);
