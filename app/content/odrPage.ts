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
  // Die exakte Zielphrase "Mediation bei Geschäftspartnern" steht bewusst in
  // der H1 (Highlight-Zeile): Sie rankt bereits auf Seite 2 und soll auf
  // Seite 1 gezogen werden – siehe auch deepDive weiter unten.
  titleHighlight:
    "Mediation bei Geschäftspartnern, Gesellschaftern und im Team.",
  intro:
    "Online Dispute Resolution (ODR) heißt: Konflikte werden vollständig digital beigelegt – strukturiert, strikt vertraulich und deutlich schneller als ein Gerichtsverfahren. Ob Streit unter Geschäftspartnern, innerbetrieblich, im E-Commerce oder als Schlichtung mit konkretem Lösungsvorschlag: medipact bildet die passende Verfahrensart online ab.",

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

  // ── SEO-Vertiefung: "Mediation bei Geschäftspartnern" ────────────────────
  // Eigener H2/H3-Block zur Ziel-Suchphrase. Bewusst KEINE eigene URL: Die
  // ODR-Seite hat die Ranking-Kraft, eine zweite Seite würde sie nur
  // kannibalisieren.
  deepDive: {
    eyebrow: "Geschäftspartner & Gesellschafter",
    title: "Mediation bei Geschäftspartnern: Streit klären, Partnerschaft retten",
    intro:
      "Ein Konflikt unter Geschäftspartnern ist selten nur ein Rechtsproblem. Es geht um Geld und Anteile – aber genauso um Vertrauen, Anerkennung und die Frage, wer künftig entscheidet. Genau deshalb scheitern Verhandlungen zwischen Partnern, obwohl beide Seiten rechnen können. Mediation bei Geschäftspartnern trennt diese Ebenen: Sie klärt zuerst, worum es wirklich geht, und verhandelt dann die Zahlen.",
    items: [
      {
        title: "Gesellschafterstreit & Patt-Situationen",
        text: "Zwei Gesellschafter mit je 50 % blockieren sich gegenseitig, Beschlüsse kommen nicht zustande, das operative Geschäft leidet. Die Mediation trennt Rollen (Gesellschafter, Geschäftsführer, Kollege) und macht Entscheidungswege wieder handlungsfähig – bevor eine Auflösungsklage die Firma zerlegt.",
      },
      {
        title: "Ausstieg & Anteilsbewertung",
        text: "Ein Partner will raus, der andere weiter – und die Bewertung der Anteile liegt weit auseinander. Statt zweier gegenläufiger Gutachten wird eine gemeinsame Bewertungsgrundlage vereinbart und daraus ein Ausstiegsszenario mit Zahlungsplan entwickelt.",
      },
      {
        title: "Ungleiche Beiträge & Vergütung",
        text: "„Ich arbeite 60 Stunden, du 20 – wir teilen aber 50:50.“ Der Klassiker unter Gründungspartnern. Die Mediation macht Erwartungen und tatsächliche Beiträge explizit und übersetzt sie in eine neue Vergütungs- und Verantwortungsregel.",
      },
      {
        title: "Strategie & Richtungsstreit",
        text: "Wachstum gegen Konsolidierung, neuer Markt gegen Kerngeschäft: Wertekonflikte lassen sich nicht wegverhandeln. Vereinbart werden deshalb Entscheidungsregeln, Budgetgrenzen und Überprüfungspunkte statt einer Sieger-Position.",
      },
      {
        title: "B2B-Vertragspartner & Lieferanten",
        text: "Verzug, Mängel, strittige SLA-Auslegung oder offene Rechnungen zwischen zwei Unternehmen. Ein Prozess läuft weiter, während er geklärt wird – anders als bei einer Kündigung, die beide Seiten Jahre und Anwaltskosten kostet.",
      },
      {
        title: "Familienunternehmen & Nachfolge",
        text: "Wenn Geschäftspartner zugleich Familie sind, überlagern alte Familienthemen jede Sachfrage. Die Mediation adressiert beide Systeme getrennt – Gesellschaftsvertrag hier, Familienverhältnis dort – und hält sie im Ergebnis wieder vereinbar.",
      },
    ],
    bulletsTitle:
      "Wann Mediation zwischen Geschäftspartnern der bessere erste Schritt ist",
    bullets: [
      "Entscheidungen werden vertagt oder blockiert – das Tagesgeschäft leidet spürbar.",
      "Jede Seite hat bereits anwaltlich prüfen lassen, aber niemand will wirklich klagen.",
      "Die Geschäftsbeziehung soll bestehen bleiben – oder zumindest sauber enden.",
      "Ein öffentliches Verfahren würde Kunden, Banken oder Investoren verunsichern.",
      "Es geht um Anteile, Ausstieg oder Bewertung und gleichzeitig um verletztes Vertrauen.",
      "Beide Seiten sind grundsätzlich gesprächsbereit, kommen allein aber nicht weiter.",
    ],
    note:
      "Der Ablauf ist derselbe wie bei jedem ODR-Verfahren: strukturierte, getrennte Fallaufnahme, Diagnose der Konfliktart und Eskalationsstufe, dann die passende Methode – facilitativ nach Harvard, evaluativ bei harten Vertrags- und Bewertungsfragen oder Shuttle-Mediation, wenn ein gemeinsamer Termin (noch) nicht möglich ist. Ergebnis ist eine verbindliche Vereinbarung, die notariell beurkundet oder als Anwaltsvergleich vollstreckbar gemacht werden kann. Einzelfall ab €399.",
    links: [
      { label: "Fallbeispiel: Gesellschafter-Patt", href: "/cases/gesellschafter-streit" },
      { label: "Fallbeispiel: B2B-Projektstreit", href: "/cases/b2b-projektstreit" },
      { label: "Ratgeber: Wirtschaftsmediation", href: "/ratgeber/wirtschaftsmediation" },
    ],
  },

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
        "Von erfahrenen Mediator:innen geprüfter, strukturiert erarbeiteter Lösungsvorschlag",
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
      question: "Wie läuft eine Mediation bei Geschäftspartnern ab?",
      answer:
        "Eine Mediation bei Geschäftspartnern läuft in vier Schritten: getrennte, vertrauliche Fallaufnahme beider Seiten, Diagnose von Konfliktart und Eskalationsstufe, moderierte Klärung mit der passenden Methode – und zum Schluss eine schriftliche, verbindliche Vereinbarung. Bei medipact läuft das vollständig online und asynchron, meist in Tagen bis wenigen Wochen statt in Monaten. Der Einzelfall kostet €399.",
    },
    {
      question: "Was kostet eine Mediation zwischen Geschäftspartnern?",
      answer:
        "Bei medipact kostet der Einzelfall €399 als Pauschale für den geführten Online-Prozess – unabhängig davon, ob es um einen Gesellschafterstreit, einen Ausstieg oder einen B2B-Vertragskonflikt geht. Unternehmen mit laufendem Bedarf nutzen die Business-Tarife ab €1.000 pro Monat. Zum Vergleich: Ein Gesellschafterprozess erreicht über mehrere Instanzen schnell einen fünfstelligen Betrag.",
    },
    {
      question: "Lohnt sich Mediation bei einem Gesellschafterstreit?",
      answer:
        "Meistens ja – vor allem, wenn beide Seiten am Unternehmen hängen. Ein Gesellschafterprozess ist öffentlich, dauert Jahre und blockiert währenddessen Beschlüsse, Finanzierungen und oft das operative Geschäft. Die Mediation ist vertraulich, klärt Rollen und Entscheidungswege und lässt beide Optionen offen: Weitermachen mit neuen Regeln oder ein geordneter Ausstieg mit vereinbarter Bewertung.",
    },
    {
      question: "Was ist Online Dispute Resolution (ODR)?",
      answer:
        "ODR bezeichnet die Beilegung von Konflikten über digitale Plattformen – von der Online-Mediation über die Online-Schlichtung bis zur automatisierten Massen-Streitbeilegung. Bei medipact läuft das gesamte Verfahren digital: strukturierte Fallaufnahme, systematische Auswertung, geprüfte Vereinbarung. Ohne Terminfindungs-Marathon, ohne Gericht.",
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
