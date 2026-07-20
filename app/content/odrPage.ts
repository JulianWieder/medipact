// app/content/odrPage.ts (ehemals geschaeftPage.ts)
//
// Marketing-Content für die ODR-Familie (Online Dispute Resolution, ehemals
// Typ "geschaeft"/Wirtschaftsmediation). Brennpunkt: interne Klärung (Team/
// Führung/Gesellschafter/Nachfolge), externe B2B-Streitbeilegung (Verträge/
// Lieferanten, IT-Großprojekte, M&A) sowie die weiteren ODR-Verfahren
// (Online-Schlichtung, E-Commerce/Plattform, B2B-Vertragsstreit) und die
// digitalisierte Massen-ODR über das Firmen-Abo. Workflow-Hintergrund:
// docs/konzept_organisationskonflikt.md und docs/faelle-phasen-inhalte.md.
// Preise: /preise (Einzelfall €399; Business-Tarife: Light €1.000/Monat bis
// 10 Mediationen, Business €5.000/Monat bis 50, Premium Full Service auf
// Anfrage – Direktanruf).

import { geschaeftFacts } from "@/app/components/ui/DidYouKnowSection";

export const odrPageContent = {
  eyebrow: "Online Dispute Resolution (ODR)",
  title: "Wenn Konflikte das Unternehmen blockieren.",
  titleHighlight:
    "Im Team, unter Gesellschaftern – oder mit Geschäftspartnern.",
  intro:
    "Online Dispute Resolution (ODR) heißt: Konflikte werden vollständig digital beigelegt – strukturiert, strikt vertraulich und deutlich schneller als ein Gerichtsverfahren. Ob innerbetrieblich, B2B, im E-Commerce oder als Schlichtung mit konkretem Lösungsvorschlag: medipact bildet die passende Verfahrensart online ab.",

  primaryCta: {
    label: "Konflikt einschätzen",
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

  processTitle: "Ablauf eines ODR-Verfahrens im Betrieb",
  process: [
    {
      title: "Diagnose zuerst",
      text: "Konfliktart (Sach-, Beziehungs-, Rollen- oder Strukturkonflikt) und Eskalationsstufe nach Glasl werden strukturiert erfasst – bevor irgendjemand über Lösungen spricht.",
    },
    {
      title: "Vertrauliche Fallaufnahme",
      text: "Jede Partei schildert ihre Sicht zunächst getrennt und asynchron – ohne Terminfindungs-Marathon, neben dem Tagesgeschäft. Die Arbeit läuft währenddessen weiter.",
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

  comparisonTitle: "Die Verfahren der ODR-Familie",
  comparisonIntro:
    "Nicht jeder Konflikt braucht dasselbe Verfahren. medipact bildet vier ODR-Verfahrensarten ab – die Diagnose zeigt, welches passt. Für sehr große Fallzahlen (Fluggastrechte, Mietpreisbremse, E-Commerce) gibt es die digitalisierte Massen-ODR im Firmen-Abo.",
  comparisonPlans: [
    {
      title: "ODR-Mediation (Geschäft & Organisation)",
      status: "Die Parteien entwickeln die Lösung selbst",
      features: [
        "Team-, Führungs- und Gesellschafterkonflikte sowie B2B",
        "Diagnose nach Konfliktart und Glasl-Eskalationsstufe",
        "Methodisch facilitativ, evaluativ, transformativ oder Shuttle",
      ],
      featured: true,
    },
    {
      title: "Online-Schlichtung",
      status: "Neutraler Lösungsvorschlag (Schlichterspruch)",
      features: [
        "Beide Seiten werden strukturiert angehört",
        "KI-gestützter, von Mediator:innen geprüfter Lösungsvorschlag",
        "Annehmen oder ablehnen – der Rechtsweg bleibt offen",
      ],
    },
    {
      title: "E-Commerce & Plattform",
      status: "B2C-Streit aus Online-Käufen",
      features: [
        "Nicht gelieferte Ware, Erstattungen, Konto-Sperrungen, Bewertungen",
        "Schneller und günstiger als jeder Rechtsweg bei kleinen Streitwerten",
      ],
    },
    {
      title: "B2B-Vertragsstreit",
      status: "Unternehmen gegen Unternehmen",
      features: [
        "Offene Rechnungen, Leistungsumfang, Verzug, Kündigung",
        "Vertraulich – die Geschäftsbeziehung bleibt erhalten",
      ],
    },
  ],

  trustTitle: "Diskretion, Tempo, Rechtssicherheit",
  trustPoints: [
    {
      title: "Strikt vertraulich",
      text: "Anders als ein Gerichtsverfahren bleibt alles unter Verschluss – kein öffentliches Verfahren, kein Image-Schaden am Markt. Mediator:innen unterliegen der gesetzlichen Verschwiegenheitspflicht (§ 4 Mediationsgesetz).",
    },
    {
      title: "Deutlich schneller als Gericht",
      text: "Wochen statt Jahre: Das schont Ressourcen, und Projekte laufen weiter, statt blockiert zu werden.",
    },
    {
      title: "Rechtssicher vereinbart",
      text: "Die Abschlussvereinbarung ist ein bindender Vertrag und kann bei Bedarf notariell beurkundet oder als Anwaltsvergleich vollstreckbar gemacht werden – Grundlage ist das Mediationsgesetz.",
    },
    {
      title: "Partnerschaft bleibt erhalten",
      text: "Ziel ist eine Lösung, mit der man weiter zusammenarbeiten kann – im Team wie mit dem Geschäftspartner.",
    },
  ],

  didYouKnowFacts: geschaeftFacts,

  faqTitle: "Häufige Fragen zur Online Dispute Resolution (ODR)",
  faqs: [
    {
      question: "Was ist Online Dispute Resolution (ODR)?",
      answer:
        "ODR bezeichnet die Beilegung von Konflikten über digitale Plattformen – von der Online-Mediation über die Online-Schlichtung bis zur automatisierten Massen-Streitbeilegung. Bei medipact läuft das gesamte Verfahren digital: strukturierte Fallaufnahme, KI-gestützte Auswertung, geprüfte Vereinbarung. Ohne Terminfindungs-Marathon, ohne Gericht.",
    },
    {
      question: "Mediation oder Schlichtung – was ist der Unterschied?",
      answer:
        "In der Mediation entwickeln die Parteien die Lösung selbst; die Mediator:in strukturiert nur den Prozess. In der Online-Schlichtung erarbeitet die neutrale Stelle nach Anhörung beider Seiten einen konkreten, begründeten Lösungsvorschlag (Schlichterspruch), den die Parteien annehmen oder ablehnen können. Schlichtung passt, wenn eine schnelle sachliche Entscheidung wichtiger ist als der gemeinsame Prozess.",
    },
    {
      question: "Was ist digitalisierte Massen-ODR?",
      answer:
        "Bei sehr großen Fallzahlen – etwa Fluggastrechten, Mietpreisbremsen-Streitigkeiten oder E-Commerce-Konflikten – kommen ODR-Plattformen zum Einsatz, die viele gleichartige Fälle standardisiert und weitgehend automatisiert abwickeln. medipact bildet das über die Business-Tarife ab: Firmenkunden legen ODR-Fälle im Abo an (je nach Tarif 10 bis 50 Verfahren pro Monat, größere Kontingente im Business Premium auf Anfrage), jeder Fall läuft durch den geführten digitalen Prozess.",
    },
    {
      question: "Was kosten ungelöste Konflikte im Unternehmen?",
      answer:
        "Mehr als jede Mediation: Laut KPMG-Konfliktkostenstudie verbringen Mitarbeitende 10–15 % ihrer Arbeitszeit mit Konflikten, Führungskräfte je nach Eskalation 30–50 %. Dazu kommen Fluktuation, Krankheitstage, blockierte Projekte – und im Streitfall Anwalts- und Gerichtskosten über Jahre. Eine Wirtschaftsmediation bei medipact kostet ab €399 pro Fall und klärt in Tagen bis Wochen.",
    },
    {
      question: "Ist eine Wirtschaftsmediation rechtssicher?",
      answer:
        "Ja. Das Verfahren ist im Mediationsgesetz geregelt, Mediator:innen unterliegen der Verschwiegenheitspflicht (§ 4 MediationsG). Die Abschlussvereinbarung ist ein bindender Vertrag und kann notariell beurkundet oder als Anwaltsvergleich vollstreckbar gemacht werden.",
    },
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
        "Der einzelne Fall kostet €399 (einmalig, geführter Online-Prozess). Für Unternehmen mit laufendem Bedarf gibt es drei Business-Tarife: Business Light (€1.000/Monat, bis zu 10 Mediationen), Business (€5.000/Monat, bis zu 50 Mediationen) und Business Premium als Full Service mit individuellem Kontingent – Preis auf Anfrage, am besten direkt anrufen. Details auf der Preisseite.",
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
    "Beschreiben Sie kurz die Situation – wir zeigen, welcher Weg passt: interne Klärung, externe Mediation oder ein Business-Tarif für laufenden Bedarf.",
  finalCta: {
    label: "Jetzt starten",
    href: "/kontakt",
  },
};
