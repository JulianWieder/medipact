import type { RatgeberArticle } from "./types";

// 09.11.2026: von ~740 auf ~1.700 Wörter ausgebaut (GSC: "gecrawlt, nicht
// indexiert", kürzester Artikel im Cluster). Abgrenzung im Cluster:
//   was-ist-mediation             = Definition, Gesetz, Abgrenzung zu
//                                   Schlichtung/Schiedsgericht/Gericht
//   was-ist-ein-mediator          = die Person: Pflichten, Ausbildung, Auswahl
//   mediation-als-konfliktloesung = Entscheidungshilfe: passt der Weg zu
//                                   meinem Konflikt?
// Rechtsangaben geprüft gegen gesetze-im-internet.de (MediationsG §§ 1–4),
// § 203 BGB, § 278a ZPO. Nichts ergänzen, was dort nicht steht.
export const article: RatgeberArticle = {
  slug: "was-ist-mediation",
  category: "Mediation",
  title: "Was ist Mediation? Definition, Ablauf und Vorteile",
  metaTitle: "Was ist Mediation? Definition, Ablauf & Vorteile | medipact",
  description:
    "Mediation einfach erklärt: Was sie bedeutet, wie ein Verfahren abläuft, wann es sich eignet und welche Vorteile es gegenüber dem Gericht hat.",
  eyebrow: "Ratgeber · Mediation",
  updated: "2026-11-09",
  readingMinutes: 9,
  intro:
    "Die meisten Menschen suchen nicht nach „Mediation“, weil sie das Wort interessiert. Sie suchen danach, weil etwas festgefahren ist: Die Gespräche mit dem Ex-Partner enden jedes Mal im selben Vorwurf, die Schwester antwortet nicht mehr, der Geschäftspartner schreibt nur noch über seinen Anwalt. Mediation ist der Weg, einen solchen Konflikt außergerichtlich und einvernehmlich zu lösen – mit Unterstützung einer neutralen Person, aber in Ihrer eigenen Verantwortung. Dieser Artikel erklärt, was Mediation genau ist, wie sie abläuft, was das Gesetz dazu sagt und wann sie die bessere Wahl ist.",
  blocks: [
    { type: "heading", text: "Definition: Was bedeutet Mediation?" },
    {
      type: "paragraph",
      text: "Mediation ist ein freiwilliges und vertrauliches Verfahren, in dem eine allparteiliche dritte Person – der Mediator – Konfliktparteien dabei unterstützt, selbst eine gemeinsame Lösung zu erarbeiten. Der Mediator entscheidet nicht und urteilt nicht; er sorgt für einen fairen, strukturierten Gesprächsrahmen. Die Verantwortung für das Ergebnis bleibt vollständig bei den Beteiligten.",
    },
    {
      type: "paragraph",
      text: "In Deutschland ist Mediation seit 2012 gesetzlich geregelt. Das Mediationsgesetz beschreibt sie in § 1 als vertrauliches und strukturiertes Verfahren, in dem die Parteien mit Hilfe eines oder mehrerer Mediatoren freiwillig und eigenverantwortlich eine einvernehmliche Beilegung ihres Konflikts anstreben. In diesem einen Satz steckt alles, was Mediation vom Streit vor Gericht unterscheidet: Niemand wird gezwungen, niemand wird verurteilt, und nichts davon wird öffentlich.",
    },
    {
      type: "callout",
      text: "Vor Gericht wird über Sie entschieden. In der Mediation entscheiden Sie selbst – gemeinsam mit dem Menschen, mit dem Sie gerade am wenigsten reden können.",
    },
    { type: "heading", text: "Die Grundprinzipien der Mediation" },
    {
      type: "list",
      items: [
        "Freiwilligkeit: Alle Beteiligten nehmen freiwillig teil und können jederzeit aussteigen – ohne Begründung und ohne Nachteil.",
        "Vertraulichkeit: Was in der Mediation besprochen wird, bleibt vertraulich. Der Mediator ist gesetzlich zur Verschwiegenheit verpflichtet.",
        "Allparteilichkeit: Der Mediator steht auf keiner Seite und bewertet nicht. Er ist beiden gleichermaßen verpflichtet.",
        "Eigenverantwortung: Die Lösung entwickeln die Parteien selbst, nicht der Mediator.",
        "Ergebnisoffenheit: Das Verfahren schreibt kein bestimmtes Ergebnis vor – auch nicht, dass es eine Einigung geben muss.",
        "Informiertheit: Eine Vereinbarung soll in Kenntnis der Sachlage getroffen werden. Wer rechtlich unsicher ist, lässt sie vor der Unterschrift prüfen.",
      ],
    },
    { type: "heading", text: "Warum Mediation oft dort weiterkommt, wo Gespräche scheitern" },
    {
      type: "paragraph",
      text: "Wer lange streitet, streitet irgendwann nicht mehr über die Sache, sondern über Positionen. „Ich will das Haus.“ „Die Hecke bleibt.“ „Ich zahle keinen Cent mehr.“ Positionen lassen nur zwei Ausgänge zu: Einer gewinnt, oder man trifft sich lustlos in der Mitte. Mediation fragt deshalb nach dem, was hinter der Position steht. Wer das Haus will, will vielleicht vor allem, dass die Kinder nicht die Schule wechseln müssen. Wer keinen Cent mehr zahlen will, hat vielleicht Angst, selbst nicht über die Runden zu kommen.",
    },
    {
      type: "paragraph",
      text: "Das klingt nach einer Kleinigkeit, verändert aber den ganzen Streit. Über Positionen kann man nur feilschen. Über Interessen kann man verhandeln – und häufig stellt sich heraus, dass beide Seiten mehr bekommen können, als ein Kompromiss in der Mitte hergegeben hätte. Der oft schwerste Moment einer Mediation ist dabei gar nicht die Einigung, sondern der Augenblick davor: zum ersten Mal seit Monaten zuzuhören, ohne schon die Antwort zu formulieren.",
    },
    { type: "heading", text: "Wie läuft eine Mediation ab?" },
    {
      type: "paragraph",
      text: "Ein Mediationsverfahren folgt einem klaren Aufbau, dem Phasenmodell. Nach einer Einleitung, in der Ablauf und Regeln geklärt werden, sammeln die Beteiligten die Themen, arbeiten ihre Interessen heraus, entwickeln Lösungsoptionen und halten die beste Lösung in einer Abschlussvereinbarung fest. Diese Reihenfolge ist kein Formalismus: Sie verhindert, dass über Lösungen gestritten wird, bevor überhaupt klar ist, worum es beiden geht.",
    },
    {
      type: "callout",
      text: "Den kompletten Ablauf erklären wir Schritt für Schritt im Artikel „Die Phasen der Mediation“.",
    },
    {
      type: "paragraph",
      text: "Wie lange das dauert, hängt von der Zahl der Themen ab. Ein klar umrissener Streit ist oft nach wenigen Sitzungen geklärt, eine Trennung mit Haus, Unterhalt und Kindern braucht mehr Zeit. Wer durch das Verfahren führt und woran Sie eine gute Begleitung erkennen, lesen Sie im Artikel [Was ist ein Mediator?](/ratgeber/was-ist-ein-mediator).",
    },
    { type: "heading", text: "Mediation, Schlichtung, Schiedsgericht, Gericht: der Unterschied" },
    {
      type: "paragraph",
      text: "Die Begriffe werden im Alltag oft durcheinandergeworfen. Der entscheidende Unterschied liegt in einer einzigen Frage: Wer bestimmt am Ende das Ergebnis?",
    },
    {
      type: "table",
      caption:
        "Mediation, Schlichtung, Schiedsgericht und staatliches Gericht im Vergleich: Wer entscheidet, wie verbindlich ist das Ergebnis, wie öffentlich ist das Verfahren",
      headers: ["Verfahren", "Wer entscheidet?", "Ergebnis", "Öffentlich?"],
      rows: [
        [
          "Mediation",
          "Die Parteien selbst. Der Mediator macht keinen Lösungsvorschlag, den jemand annehmen müsste.",
          "Abschlussvereinbarung – ein Vertrag, den beide wollen.",
          "Nein, vertraulich.",
        ],
        [
          "Schlichtung",
          "Die Parteien, aber auf Grundlage eines Vorschlags des Schlichters.",
          "Schlichtungsvorschlag, der angenommen oder abgelehnt werden kann.",
          "In der Regel nein.",
        ],
        [
          "Schiedsgericht",
          "Private Schiedsrichter, auf die sich die Parteien vorher geeinigt haben.",
          "Schiedsspruch, für beide bindend.",
          "Nein.",
        ],
        [
          "Staatliches Gericht",
          "Die Richterin oder der Richter.",
          "Urteil, notfalls mit Zwang durchsetzbar.",
          "Ja, die Verhandlung ist grundsätzlich öffentlich.",
        ],
      ],
    },
    {
      type: "paragraph",
      text: "Mediation ist damit das einzige dieser Verfahren, in dem Ihnen niemand eine Lösung vorgibt. Das ist ihre größte Stärke – und der Grund, warum sie nur funktioniert, wenn beide Seiten wirklich wollen. Einen ausführlichen Vergleich mit Kosten und Dauer finden Sie unter [Gericht oder Mediation?](/ratgeber/gericht-oder-mediation).",
    },
    { type: "heading", text: "Wann ist Mediation sinnvoll?" },
    {
      type: "paragraph",
      text: "Mediation eignet sich besonders, wenn die Beteiligten grundsätzlich eine Lösung suchen und auch künftig miteinander zu tun haben – etwa als Eltern, Nachbarn, Erben oder Geschäftspartner. Typische Einsatzfelder sind [Trennung und Scheidung](/scheidungsmediation), [Nachbarschaftskonflikte](/konflikte/nachbarschaft), [Erb- und Familienstreitigkeiten](/konflikte/erbschaft), Streit im [Mietverhältnis](/konflikte/mietverhaeltnis) sowie [Konflikte am Arbeitsplatz](/konflikte/arbeitsplatz).",
    },
    {
      type: "paragraph",
      text: "Weniger geeignet ist Mediation, wenn eine Seite gar nicht verhandeln will, ein starkes Machtungleichgewicht besteht oder eine schnelle gerichtliche Klärung zwingend nötig ist. Bei Gewalt oder Angst vor der anderen Person gilt: Sicherheit geht vor, und eine Mediation ist dann nicht der richtige erste Schritt. Wenn Sie unsicher sind, wo Ihr Konflikt steht, gibt der kostenlose [Eignungscheck](/eignungscheck) eine erste Orientierung.",
    },
    { type: "heading", text: "Vorteile gegenüber einem Gerichtsverfahren" },
    {
      type: "list",
      items: [
        "Schneller: Viele Konflikte lassen sich in Wochen statt Jahren klären.",
        "Günstiger: Ein Verfahren ist meist deutlich preiswerter als ein streitiger Prozess – und Sie tragen kein Risiko, am Ende auch die Gegenseite bezahlen zu müssen.",
        "Selbstbestimmt: Die Lösung kommt von den Beteiligten, nicht von einem Urteil.",
        "Beziehungserhaltend: Der Umgangston bleibt fair – wichtig, wenn man sich wiedersieht, etwa bei der Übergabe der Kinder oder am Gartenzaun.",
        "Vertraulich: Anders als ein Gerichtsverfahren findet Mediation nicht öffentlich statt.",
        "Passgenau: Ein Urteil kann nur zusprechen, was beantragt wurde. Eine Vereinbarung kann auch regeln, wer die Katze nimmt und wer Weihnachten bei den Großeltern ist.",
      ],
    },
    { type: "heading", text: "Was rechtlich gilt: Vertraulichkeit, Fristen, Verbindlichkeit" },
    {
      type: "paragraph",
      text: "Die Vertraulichkeit ist nicht nur ein Versprechen, sondern steht im Gesetz: Der Mediator ist nach § 4 Mediationsgesetz zur Verschwiegenheit über alles verpflichtet, was ihm im Verfahren bekannt wird. Ausnahmen gibt es nur in engen Grenzen, etwa wenn das Kindeswohl gefährdet ist. Ob auch die Parteien untereinander zur Vertraulichkeit verpflichtet sind, regelt die Vereinbarung, die zu Beginn der Mediation geschlossen wird.",
    },
    {
      type: "paragraph",
      text: "Viele zögern, weil sie fürchten, während der Gespräche Fristen zu verlieren. Für die Verjährung gilt: Solange über einen Anspruch verhandelt wird, ist sie nach § 203 BGB gehemmt, und eine Mediation gilt als solche Verhandlung. Für kurze Klagefristen – zum Beispiel die drei Wochen nach einer Kündigung – sollten Sie sich darauf nicht verlassen und rechtzeitig Rechtsrat einholen. Und wenn bereits ein Verfahren läuft, ist es nicht zu spät: Das Gericht kann den Parteien nach § 278a ZPO eine Mediation vorschlagen und das Verfahren so lange ruhen lassen.",
    },
    {
      type: "paragraph",
      text: "Am Ende steht die Abschlussvereinbarung. Sie ist ein Vertrag und damit bindend. Für manche Inhalte schreibt das Gesetz eine besondere Form vor, etwa die notarielle Beurkundung bei Grundstücken oder bestimmten Regelungen zwischen Ehegatten. Eine notarielle Urkunde kann außerdem so gestaltet werden, dass sie notfalls vollstreckbar ist. Dieser Artikel ersetzt keine Rechtsberatung; lassen Sie eine Vereinbarung mit rechtlichem Gewicht vor der Unterschrift prüfen.",
    },
    { type: "heading", text: "Mediation online mit medipact" },
    {
      type: "paragraph",
      text: "medipact macht das Prinzip der Mediation digital zugänglich: Beide Seiten werden getrennt durch dieselben Schritte geführt – im eigenen Tempo, ohne die Hürde eines gemeinsamen Termins vor Ort und ohne dass jemand seine Position erst formulieren müsste. Das Verfahren orientiert sich am bewährten Ablauf einer klassischen Mediation und bleibt dabei niedrigschwellig und fair für alle Beteiligten.",
    },
    {
      type: "paragraph",
      text: "Gerade der Anfang ist für viele das Schwerste: dem anderen überhaupt vorzuschlagen, es noch einmal anders zu versuchen. Deshalb beginnt der Weg bei medipact nicht mit einer Verpflichtung, sondern mit dem Verstehen. Sie sehen, wie Online-Mediation funktioniert, finden eine Person, der Sie beide vertrauen, und klären, ob eine Lösung überhaupt in Reichweite ist. Was das kostet, steht vorab fest – die Übersicht finden Sie unter [Preise](/preise).",
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
      question: "Was ist der Unterschied zwischen Mediation und Schlichtung?",
      answer:
        "In der Schlichtung macht der Schlichter einen eigenen Lösungsvorschlag, den die Parteien annehmen oder ablehnen. In der Mediation gibt es keinen solchen Vorschlag: Die Beteiligten erarbeiten die Lösung selbst, der Mediator führt nur durch das Verfahren.",
    },
    {
      question: "Was kostet eine Mediation?",
      answer:
        "Die Kosten hängen von Anbieter, Umfang und Abrechnung ab, meist pro Stunde. Online-Verfahren sind in der Regel günstiger. Details finden Sie in unserem Artikel zu den Mediationskosten.",
    },
    {
      question: "Was passiert, wenn die Mediation scheitert?",
      answer:
        "Dann steht Ihnen der Rechtsweg weiter offen. Jede Seite kann die Mediation jederzeit beenden. Häufig ist aber auch eine Mediation ohne vollständige Einigung nicht umsonst: Die strittigen Punkte sind danach meist klarer und weniger.",
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
    { label: "Mediation als Konfliktlösung: passt sie zu Ihrem Konflikt?", href: "/ratgeber/mediation-als-konfliktloesung" },
    { label: "Gericht oder Mediation?", href: "/ratgeber/gericht-oder-mediation" },
    { label: "Was kostet eine Mediation?", href: "/ratgeber/mediation-kosten" },
  ],
};
