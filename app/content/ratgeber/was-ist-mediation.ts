import type { RatgeberArticle } from "./types";

export const article: RatgeberArticle = {
  slug: "was-ist-mediation",
  category: "Mediation",
  title: "Was ist Mediation? Definition, Ablauf und Vorteile",
  metaTitle: "Was ist Mediation? Definition, Ablauf & Vorteile | medipact",
  description:
    "Mediation einfach erklärt: Was sie bedeutet, wie ein Verfahren abläuft, wann es sich eignet und welche Vorteile es gegenüber dem Gericht hat.",
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
    { label: "Kostenrechner: Gericht oder Einigung?", href: "/kostenrechner" },
    { label: "Die Phasen der Mediation", href: "/ratgeber/5-phasen-der-mediation" },
    { label: "Was ist ein Mediator?", href: "/ratgeber/was-ist-ein-mediator" },
    { label: "Was kostet eine Mediation?", href: "/ratgeber/mediation-kosten" },
  ],
};
