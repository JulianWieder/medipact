// app/content/mietverhaeltnisPage.ts
//
// Zuständigkeitsgrenze wie bei nachbarschaftPage: Diese Seite besitzt die
// Verfahrensspur (Mieter ↔ Vermieter). Nachbarschaftskonflikte im selben Haus
// gehören auf /konflikte/nachbarschaft und werden hier nur verlinkt.
//
// Kernargument dieser Seite ist nicht "billiger als das Amtsgericht", sondern
// die Fortsetzung: Anders als beim einmaligen Kaufvertrag läuft das
// Mietverhältnis nach dem Prozess in aller Regel weiter — mit derselben
// Abrechnung im nächsten Jahr und derselben Heizung.

import { mietverhaeltnisFacts } from "@/app/components/ui/DidYouKnowSection";

export const mietverhaeltnisPageContent = {
  eyebrow: "Streit im Mietverhältnis",
  title: "Der Streit endet, das Mietverhältnis bleibt.",
  titleHighlight: "Klären Sie es so, dass beides funktioniert.",
  intro:
    "Nebenkosten, Mängel, Kaution, Eigenbedarf: Mietstreit ist selten eine reine Rechtsfrage. Meist geht es um eine Abrechnung, die niemand erklärt hat, um Mängel, die zu lange liegen blieben – und um zwei Seiten, die danach weiter miteinander zu tun haben.",

  primaryCta: {
    label: "Mietstreit einschätzen lassen",
    href: "#cta",
  },

  secondaryCta: {
    label: "Zur Übersicht",
    href: "/konflikte",
  },

  featuresTitle: "Typische Herausforderungen",
  featuresIntro:
    "Mietkonflikte haben eine Eigenart: Beide Seiten sind vertraglich aneinander gebunden und können sich nicht einfach trennen.",

  features: [
    {
      title: "Die Abrechnung erklärt sich nicht",
      text: "Eine Nachzahlung über vierstellige Beträge kommt ohne Erläuterung ins Haus. Ein großer Teil des Streits löst sich allein durch Belegeinsicht und eine nachvollziehbare Herleitung.",
    },
    {
      title: "Zurückbehaltung eskaliert die Lage",
      text: "Wer mindert oder Zahlungen zurückhält, hat dafür oft gute Gründe – riskiert aber gleichzeitig eine Kündigung wegen Zahlungsverzugs. Aus einem Mangel wird so ein Streit über den Bestand des Mietverhältnisses.",
    },
    {
      title: "Fristen laufen im Hintergrund",
      text: "Abrechnungsfrist, Einwendungsfrist, Widerspruch gegen die Kündigung, Räumungsfrist: Im Mietrecht entscheidet oft nicht die bessere Begründung, sondern wer rechtzeitig reagiert hat.",
    },
    {
      title: "Der Streitwert trägt kein Verfahren",
      text: "Bei einer strittigen Nebenkostenabrechnung über 800 € stehen Anwalts- und Gerichtskosten in keinem Verhältnis zur Sache. Der Ärger ist trotzdem real – und bleibt ohne Klärung jedes Jahr aufs Neue bestehen.",
    },
    {
      title: "Beide Seiten sammeln Belege",
      text: "Fotos, Mängelanzeigen, Zeugen, Protokolle. Wenn beide dokumentieren statt zu reden, ist das ein sicheres Zeichen dafür, dass niemand mehr an eine Einigung glaubt.",
    },
    {
      title: "Recht behalten hilft nur begrenzt",
      text: "Selbst ein gewonnener Prozess ändert nichts daran, dass im nächsten Jahr dieselbe Abrechnung kommt und dieselbe Heizung im Haus steht. Das Mietverhältnis überdauert das Urteil.",
    },
  ],

  deepDive: {
    eyebrow: "Mediation im Mietverhältnis im Detail",
    title: "Mietstreit: Typische Streitpunkte und was sich regeln lässt",
    intro:
      "Im Mietrecht ist die Rechtslage oft klarer, als der Streit vermuten lässt – und trotzdem wird gestritten. Der Grund ist meist nicht Uneinigkeit über das Gesetz, sondern über die Zahlen dahinter: Welche Kosten sind umlagefähig, ab wann war der Mangel angezeigt, was ist normale Abnutzung? Diese Fragen entscheidet ein Gericht am Ende auch nur anhand dessen, was beide Seiten vorlegen. Genau das lässt sich vorher klären – schneller, günstiger und ohne dass das Mietverhältnis daran zerbricht.",
    items: [
      {
        title: "Nebenkosten und Belegeinsicht",
        text: "Der häufigste Streitpunkt überhaupt. Umlagefähigkeit, Verteilerschlüssel, Abgrenzung von Instandhaltung: Vieles davon ist nachrechenbar, wenn die Belege auf dem Tisch liegen. Die Fristen des § 556 Abs. 3 BGB laufen dabei in beide Richtungen – zwölf Monate zum Abrechnen, zwölf Monate zum Einwenden.",
      },
      {
        title: "Mängel und Minderung",
        text: "Die Minderung tritt nach § 536 BGB kraft Gesetzes ein, sobald ein Mangel die Tauglichkeit beeinträchtigt. Gestritten wird deshalb fast nie über das Ob, sondern über die Höhe und ab welchem Zeitpunkt der Mangel angezeigt war. Beides ist verhandelbar, eine einseitig gewählte Minderungsquote dagegen riskant.",
      },
      {
        title: "Kaution und Abrechnung nach Auszug",
        text: "§ 551 BGB begrenzt die Sicherheit auf drei Nettokaltmieten, zahlbar in drei Raten. Streit entsteht meist beim Auszug: Welche Schäden gehen über vertragsgemäße Abnutzung hinaus, und wie lange darf der Vermieter einbehalten? Ein gemeinsames Übergabeprotokoll entschärft die meisten dieser Fälle.",
      },
      {
        title: "Schönheitsreparaturen",
        text: "Ein Feld, auf dem viele Formulierungen in Altverträgen unwirksam sind – mit der Folge, dass die Pflicht ganz beim Vermieter liegt. Wer hier ohne Prüfung streicht oder streichen lässt, verhandelt über etwas, das rechtlich gar nicht offen ist.",
      },
      {
        title: "Mieterhöhung und Modernisierung",
        text: "Zwischen Vergleichsmiete, Kappungsgrenze und Modernisierungsumlage liegt viel Rechenweg. Häufig ist nicht die Erhöhung das Problem, sondern dass sie unangekündigt und ohne Herleitung kommt.",
      },
      {
        title: "Kündigung und Eigenbedarf",
        text: "Der Fall mit den höchsten Einsätzen auf beiden Seiten. Über die Wirksamkeit einer Kündigung entscheidet das Gericht – verhandelbar sind dagegen Auszugstermin, Umzugskosten, Räumungsfristen und eine geordnete Übergabe. Genau darüber wird vor Gericht am Ende meist auch verglichen.",
      },
    ],
    bulletsTitle: "Wann Mediation im Mietverhältnis der bessere erste Schritt ist",
    bullets: [
      "Das Mietverhältnis soll fortgesetzt werden – Sie brauchen eine Regelung, kein Urteil.",
      "Der strittige Betrag würde ein Gerichtsverfahren wirtschaftlich nicht rechtfertigen.",
      "Die Abrechnung ist möglicherweise richtig, aber niemand hat sie erklärt.",
      "Mängel sind angezeigt, aber die Kommunikation ist zum Erliegen gekommen.",
      "Es geht um einen Auszug, der geordnet ablaufen soll statt per Räumungsklage.",
      "Eine Seite hat bereits Anwalt oder Mieterverein eingeschaltet, und der Ton hat sich geändert.",
    ],
    note:
      "Für Wohnraummietstreitigkeiten ist nach § 23 Nr. 2a GVG ausschließlich das Amtsgericht zuständig – ohne Rücksicht auf den Wert des Streitgegenstands. Der Streitwert bemisst sich beim Streit über Bestand oder Dauer des Mietverhältnisses nach § 41 GKG am Entgelt für den strittigen Zeitraum, höchstens am Jahresbetrag. Wichtig: Eine Mediation hemmt keine Fristen. Die Einwendungsfrist gegen eine Betriebskostenabrechnung (§ 556 Abs. 3 BGB) und Widerspruchs- oder Räumungsfristen laufen unabhängig weiter. Bei medipact liegt die Mediation im Mietverhältnis im Einstiegstarif von 49 € pro Partei.",
    links: [
      { label: "Ratgeber: Gericht oder Mediation?", href: "/ratgeber/gericht-oder-mediation" },
      { label: "Ratgeber: Was kostet eine Mediation?", href: "/ratgeber/mediation-kosten" },
      { label: "Ratgeber: Konflikt richtig dokumentieren", href: "/ratgeber/konflikt-dokumentieren" },
      { label: "Streit mit Nachbarn im selben Haus", href: "/konflikte/nachbarschaft" },
      { label: "Ratgeber: Streit in der Eigentümergemeinschaft", href: "/ratgeber/weg-streit-mediation" },
      { label: "Kostenrechner: Gericht oder Mediation?", href: "/kostenrechner" },
    ],
  },

  processTitle: "Wie medipact unterstützt",
  process: [
    {
      title: "Zahlen und Sachlage ordnen",
      text: "Vertrag, Abrechnung, Mängelanzeigen und Fristen kommen strukturiert auf den Tisch – beide Seiten arbeiten mit derselben Grundlage.",
    },
    {
      title: "Strittiges von Unerklärtem trennen",
      text: "Häufig löst sich ein Teil des Streits, sobald eine Position nachvollziehbar hergeleitet ist. Was danach bleibt, ist der eigentliche Verhandlungsgegenstand.",
    },
    {
      title: "Schriftlich vereinbaren",
      text: "Konkrete Absprachen zu Beträgen, Arbeiten und Terminen – bis hin zum geordneten Auszug, wenn das die bessere Lösung ist.",
    },
  ],

  trustTitle: "Warum Mediation im Mietverhältnis hilft",
  trustPoints: [
    {
      title: "Nachvollziehbar",
      text: "Statt Behauptung gegen Behauptung stehen am Ende Zahlen, die beide Seiten geprüft haben.",
    },
    {
      title: "Verhältnismäßig",
      text: "Bei Streitwerten von wenigen hundert bis wenigen tausend Euro ist ein Verfahren selten wirtschaftlich – eine Einigung schon.",
    },
    {
      title: "Tragfähig",
      text: "Die Vereinbarung regelt nicht nur den Einzelfall, sondern oft auch, wie es im nächsten Jahr laufen soll.",
    },
  ],

  didYouKnowFacts: mietverhaeltnisFacts,

  faqTitle: "Häufige Fragen zur Mediation im Mietverhältnis",
  faqs: [
    {
      question: "Was kostet eine Mediation im Mietverhältnis?",
      answer:
        "Bei medipact kostet sie 49 € pro Partei – eine einmalige Pauschale für den kompletten geführten Online-Prozess, keine Stundenabrechnung. Bei zwei Beteiligten liegt der Gesamtaufwand damit bei 98 €. Zum Vergleich: Ein Zivilverfahren über eine strittige Nebenkostenabrechnung von 1.500 € kostet mit beidseitiger anwaltlicher Vertretung regelmäßig ein Vielfaches davon – unabhängig davon, wer am Ende recht bekommt.",
    },
    {
      question: "Hemmt eine Mediation die Fristen im Mietrecht?",
      answer:
        "Nein, und das ist der wichtigste Punkt. Die Einwendungsfrist gegen eine Betriebskostenabrechnung beträgt zwölf Monate ab Zugang (§ 556 Abs. 3 BGB), und auch Widerspruchs- sowie Räumungsfristen laufen unabhängig von jedem Einigungsversuch weiter. Wenn eine Frist knapp wird, sichern Sie diese zuerst – schriftlich und fristwahrend – und verhandeln Sie danach oder parallel.",
    },
    {
      question: "Welches Gericht wäre für einen Mietstreit zuständig?",
      answer:
        "Bei Wohnraum ausschließlich das Amtsgericht, und zwar unabhängig vom Streitwert (§ 23 Nr. 2a GVG). Das ist eine Besonderheit: Sonst entscheidet im Zivilrecht die Höhe der Forderung darüber, ob Amts- oder Landgericht zuständig ist. Der Gebührenstreitwert richtet sich beim Streit über Bestand oder Dauer des Mietverhältnisses nach § 41 GKG – maßgeblich ist das Entgelt für den strittigen Zeitraum, höchstens der Jahresbetrag.",
    },
    {
      question: "Ist das Ergebnis rechtlich bindend?",
      answer:
        "Ja. Die Abschlussvereinbarung ist ein Vertrag zwischen den Beteiligten und damit bindend. Bei Bedarf lässt sie sich notariell beurkunden oder als Anwaltsvergleich vollstreckbar machen. Für die meisten Mietthemen – ein anerkannter Nachzahlungsbetrag, eine Ratenzahlung, ein Termin für die Mängelbeseitigung, ein Auszugsdatum – genügt die schriftliche Vereinbarung, weil beide Seiten sie selbst entwickelt haben.",
    },
    {
      question: "Kann ich mieten und trotzdem mindern, während die Mediation läuft?",
      answer:
        "Die Minderung tritt nach § 536 BGB kraft Gesetzes ein, sie hängt also nicht von einer Zustimmung ab. Riskant ist allerdings die Höhe: Wer zu viel einbehält, gerät in Zahlungsverzug und riskiert eine Kündigung. In der Praxis bewährt sich, den strittigen Teil unter Vorbehalt zu zahlen und die Quote in der Mediation zu klären. Bei größeren Beträgen lohnt vorher eine rechtliche Einschätzung.",
    },
    {
      question: "Gilt das auch für Gewerbemietverhältnisse?",
      answer:
        "Ja. Der Ablauf ist derselbe, die rechtlichen Rahmenbedingungen unterscheiden sich allerdings deutlich – im Gewerbemietrecht gilt weniger zwingendes Mieterschutzrecht, und die Zuständigkeitsregel des § 23 Nr. 2a GVG greift nicht. Bei hohen Streitwerten oder komplexen Vertragskonstellationen ist ein B2B-Verfahren häufig der passendere Zuschnitt.",
    },
    {
      question: "Was, wenn die andere Seite nicht mitmachen will?",
      answer:
        "Mediation ist freiwillig – ohne beide Seiten geht es nicht. Erfahrungsgemäß hilft ein sachlicher schriftlicher Vorschlag mit konkreter Zahl mehr als eine weitere Mängelanzeige: Er macht deutlich, dass es um eine Lösung geht und nicht um Beweissicherung. Lehnt die Gegenseite ab, ist der Einigungsversuch dokumentiert – das schadet auf dem formalen Weg nie.",
    },
    {
      question: "Wie lange dauert das Verfahren?",
      answer:
        "Der Prozess läuft online und asynchron, es entfällt also die Terminfindung. Beide Seiten bearbeiten die strukturierte Fallaufnahme im eigenen Tempo. Typische Mietthemen sind dadurch häufig innerhalb weniger Tage bis Wochen geklärt – ein Amtsgerichtsverfahren über dieselbe Frage dauert regelmäßig viele Monate.",
    },
  ],

  finalCtaTitle: "Mietstreit klären, bevor er das Verhältnis beendet.",
  finalCtaText:
    "Beschreiben Sie kurz Ihre Situation und finden Sie heraus, wie ein sinnvoller nächster Schritt aussehen kann.",
  finalCta: {
    label: "Jetzt starten",
    href: "/kontakt",
  },
};
