// app/content/geschaeftPage.ts
//
// Marketing-Content für den Mediationstyp "geschaeft" (Business-Mediation).
// Brennpunkt: interne Mediation (Team/Führung/Gesellschafter/Nachfolge) UND
// externe B2B-Mediation (Verträge/Lieferanten, IT-Großprojekte, M&A) plus die
// vier methodischen Ansätze. Workflow-Hintergrund: docs/konzept_organisations-
// konflikt.md und docs/faelle-phasen-inhalte.md. Preise: /preise (Einzelfall
// €399, Business-Pauschale €5.000/Monat mit bis zu 150 Mediationen).

export const geschaeftPageContent = {
  eyebrow: "Business-Mediation",
  title: "Wenn Konflikte das Unternehmen blockieren.",
  titleHighlight:
    "Im Team, unter Gesellschaftern – oder mit Geschäftspartnern.",
  intro:
    "Ob innerbetrieblich oder über die Unternehmensgrenze hinaus (B2B): Konflikte kosten Arbeitsfähigkeit, Geld und Partnerschaften. Medipact klärt strukturiert – strikt vertraulich und deutlich schneller als ein Gerichtsverfahren.",

  primaryCta: {
    label: "Business-Konflikt einschätzen",
    href: "#cta",
  },

  secondaryCta: {
    label: "Preise für Unternehmen",
    href: "/preise",
  },

  featuresTitle: "Einsatzfelder: intern und B2B",
  featuresIntro:
    "Innerbetrieblich geht es meist darum, Arbeitsfähigkeit und Betriebsklima wiederherzustellen. Verlässt der Konflikt die Unternehmensgrenze, stehen Geld, Haftung oder eine langjährige strategische Partnerschaft auf dem Spiel.",

  features: [
    {
      title: "Team- & Abteilungsmediation",
      text: "Der Klassiker: Reibungen in Projektteams, festgefahrene Fronten zwischen Abteilungen (z. B. IT vs. Fachbereich) oder Konflikte nach Umstrukturierungen.",
    },
    {
      title: "Führungsmediation",
      text: "Konflikte auf Management-Ebene, zwischen Hierarchiestufen – und das klassische Spannungsfeld zwischen Geschäftsführung und Betriebsrat.",
    },
    {
      title: "Gesellschafter & Nachfolge",
      text: "Streit im Gründerteam oder unter Shareholdern um Ausrichtung, Anteile oder Ausstieg – und die emotionale Übergabe an die nächste Generation im Familienunternehmen.",
    },
    {
      title: "Verträge & Lieferanten (B2B)",
      text: "Lieferverzug, mangelhafte Qualität oder strittige SLA-Auslegung: Die Mediation hält das Projekt am Laufen, statt es jahrelang vor Gericht zu blockieren.",
    },
    {
      title: "IT- & Großprojekte (B2B)",
      text: "Komplexe Software- und Infrastrukturprojekte laufen aus dem Ruder? Bevor der Vertrag gekündigt wird, rettet eine Mediation oft das Projekt.",
    },
    {
      title: "M&A & Post-Merger (B2B)",
      text: "Wenn zwei Firmen fusionieren und Unternehmenskulturen oder Führungsteams aufeinanderprallen, entscheidet die Integration über den Deal-Erfolg.",
    },
  ],

  processTitle: "Wie medipact unterstützt",
  process: [
    {
      title: "Diagnose zuerst",
      text: "Konfliktart (Sach-, Beziehungs-, Rollen- oder Strukturkonflikt) und Eskalationsstufe werden strukturiert erfasst – bevor irgendjemand über Lösungen spricht.",
    },
    {
      title: "Der passende Ansatz",
      text: "Je nach Dynamik: facilitativ nach Harvard, evaluativ bei harten Vertragsfragen, transformativ fürs Team – oder Shuttle-Mediation bei eskalierten Fronten.",
    },
    {
      title: "Verbindliche Vereinbarung",
      text: "Am Ende steht ein konkreter Plan: wer macht was bis wann, mit Follow-up-Termin – damit die Klärung im Geschäftsalltag hält.",
    },
  ],

  comparisonTitle: "Die methodischen Ansätze im Business",
  comparisonIntro:
    "Je nach Dynamik nutzen Wirtschaftsmediatoren unterschiedliche Modelle – medipact wählt den Ansatz nach der Diagnose.",
  comparisonPlans: [
    {
      title: "Harvard-Konzept (facilitativ)",
      status: "Interessen statt Positionen",
      features: [
        "Der Standard, um sachliche Win-Win-Lösungen zu verhandeln",
        "Fragt nach den Interessen hinter den Forderungen",
        "Basis des geführten medipact-Prozesses",
      ],
      featured: true,
    },
    {
      title: "Evaluative Mediation",
      status: "Rechtliche & sachliche Einschätzung",
      features: [
        "Mediator:in (oft mit juristischem Hintergrund) gibt eine Richtung vor",
        "Gut bei harten Vertragsstreitigkeiten und SLA-Fragen",
      ],
    },
    {
      title: "Transformative Mediation",
      status: "Beziehung & Kommunikation",
      features: [
        "Fokus auf der Dynamik zwischen den Beteiligten",
        "Ideal, wenn das Team danach noch Jahre zusammenarbeiten muss",
      ],
    },
    {
      title: "Shuttle-Mediation",
      status: "Getrennte Gespräche",
      features: [
        "Die Parteien sitzen in getrennten Räumen, die Mediator:in pendelt",
        "Sinnvoll bei extrem eskalierten Fronten",
      ],
    },
  ],

  trustTitle: "Der Business-Vorteil",
  trustPoints: [
    {
      title: "Strikt vertraulich",
      text: "Anders als ein Gerichtsverfahren bleibt alles unter Verschluss – kein öffentliches Verfahren, kein Image-Schaden am Markt.",
    },
    {
      title: "Deutlich schneller als Gericht",
      text: "Wochen statt Jahre: Das schont Ressourcen, und Projekte laufen weiter, statt blockiert zu werden.",
    },
    {
      title: "Partnerschaft bleibt erhalten",
      text: "Ziel ist eine Lösung, mit der man weiter zusammenarbeiten kann – im Team wie mit dem Geschäftspartner.",
    },
  ],

  faqTitle: "Häufige Fragen zur Business-Mediation",
  faqs: [
    {
      question: "Welchen Zeitaufwand müssen wir für das Verfahren einplanen?",
      answer:
        "Da unser geführter Prozess digital und asynchron gestartet wird, entfallen lange Terminabsprachen. Die Parteien bearbeiten die strukturierte Fallaufnahme flexibel im eigenen Tempo. Eine Klärung wird so oft innerhalb weniger Tage statt Wochen erzielt – spürbar schneller als bei klassischen Präsenz-Mediationen.",
    },
    {
      question: "Was passiert, wenn eine Partei die Mediation abbricht?",
      answer:
        "Die Teilnahme ist stets freiwillig. Sollte der strukturierte Prozess ins Stocken geraten oder eine Partei abbrechen, liefert medipact bis dahin eine klare, sachliche Dokumentation der Standpunkte. Das spart Zeit und Kosten, falls der Konflikt danach intern durch Führungskräfte gelöst oder rechtlich übergeben werden muss.",
    },
    {
      question: "Was kostet Business-Mediation bei medipact?",
      answer:
        "Der einzelne Fall kostet €399 (einmalig, geführter Online-Prozess). Für Unternehmen mit laufendem Bedarf gibt es die Business-Pauschale: €5.000 pro Monat mit bis zu 150 Mediationen monatlich – ideal für HR, große Organisationen und Verbände. Details auf der Preisseite.",
    },
    {
      question: "Intern oder extern – was passt zu unserem Konflikt?",
      answer:
        "Innerbetriebliche Konflikte (Team, Führung, Gesellschafter, Nachfolge) zielen auf Arbeitsfähigkeit und Betriebsklima. Verlässt der Konflikt die Unternehmensgrenze (Lieferanten, IT-Projekte, M&A), geht es um Geld, Haftung und Partnerschaften – beides bildet der medipact-Prozess ab, inklusive passender Varianten.",
    },
    {
      question: "Wann reicht interne Moderation nicht mehr?",
      answer:
        "Die Diagnose erfasst die Eskalationsstufe nach Glasl. Ab der Win-Lose-Zone (Stufe 4–6) empfiehlt der Prozess eine externe, allparteiliche Mediation; in der Lose-Lose-Zone (7–9) benennt er ehrlich die Grenzen der Mediation – dann braucht es Führungsentscheidungen oder rechtliche Schritte.",
    },
    {
      question: "Bleibt der Inhalt wirklich vertraulich?",
      answer:
        "Ja. Alle Eingaben dienen ausschließlich der Klärung und werden vertraulich behandelt. Es gibt kein öffentliches Verfahren und keine öffentlichen Dokumente – anders als vor Gericht.",
    },
  ],

  finalCtaTitle: "Klärt den Konflikt, bevor er das Geschäft kostet.",
  finalCtaText:
    "Beschreiben Sie kurz die Situation – wir zeigen, welcher Weg passt: interne Klärung, externe Mediation oder die Business-Pauschale für laufenden Bedarf.",
  finalCta: {
    label: "Jetzt starten",
    href: "/kontakt",
  },
};
