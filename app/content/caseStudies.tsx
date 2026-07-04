export type CaseStudyStep = {
  label: string;
  title: string;
  description: string;
};

export type CaseStudyQuote = {
  text: string;
  author: string;
};

export type CaseStudyData = {
  slug: string;
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  intro: string;

  situationTitle: string;
  situationIntro?: string;

  perspectives: [
    {
      title: string;
      content: string;
    },
    {
      title: string;
      content: string;
    },
  ];

  factsTitle?: string;
  facts: string[];

  riskTitle?: string;
  risks: string[];

  processTitle?: string;
  processIntro?: string;
  steps: CaseStudyStep[];

  resultTitle?: string;
  resultIntro?: string;

  positive: {
    title: string;
    items: string[];
  };

  negative: {
    title: string;
    items: string[];
  };

  quotesTitle?: string;
  quotes: CaseStudyQuote[];

  ctaTitle: string;
  ctaText: string;
  ctaHref: string;
  ctaLabel: string;
};

export const caseStudies: Record<string, CaseStudyData> = {
  "maria-thomas": {
    slug: "maria-thomas",
    eyebrow: "Fallbeispiel",
    title: "Maria & Thomas",
    titleHighlight: "Trennung mit 2 Kindern",
    intro:
      "Verheiratet 12 Jahre. 2 Kinder (7 & 9). Thomas wollte die Trennung, Maria wollte kämpfen. Mit Mediation: Lösung in 5 Monaten statt 3 Jahre Gericht.",

    situationTitle: '"Ich wollte die Kinder nicht verlieren"',
    situationIntro:
      "Eine Trennung mit Kindern wurde zum emotionalen Ausnahmezustand. Der Kernkonflikt war nicht nur die Beziehung, sondern die Angst vor dem Verlust der Kinder.",

    perspectives: [
      {
        title: "Maria, 38, Teilzeit-Krankenschwester",
        content:
          "Ich habe Thomas geheiratet, wollte immer mit ihm zusammen sein. Als er mir sagte, dass er mich nicht mehr liebt, habe ich komplett zusammengebrochen. Die Kinder waren mein Fokus – ich konnte mir nicht vorstellen, sie nur jeden 2. und 4. Samstag zu sehen. Ich war bereit zu kämpfen, wenn nötig vor Gericht.",
      },
      {
        title: "Thomas, 40, IT-Projektmanager",
        content:
          "Ich liebe meine Kinder. Aber die Ehe war vorbei. Ich wollte nicht vor Gericht mit Maria kämpfen – das wäre für alle furchtbar. Ich brauchte eine Lösung, die für die Kinder funktioniert. Maria wollte aber nicht mit mir reden.",
      },
    ],

    factsTitle: "Die Zahlen",
    facts: [
      "Verheiratet: 12 Jahre",
      "Kinder: Emma (9), Felix (7)",
      "Gemeinsames Haus: €600.000 (noch Hypothek €400.000)",
      "Ersparnisse: €80.000 (geteilt)",
      "Maria verdient: €2.500/Monat",
      "Thomas verdient: €3.500/Monat",
    ],

    riskTitle: "Ohne Mediation (Gericht)",
    risks: [
      "3 Jahre Verfahren",
      "2 Anwälte: €20.000 pro Seite",
      "Psychologische Gutachter: €5.000",
      "Immobilien-Gutachter: €2.000",
      "Gerichtskosten: €5.000",
      "Total: €52.000+",
      "Emma & Felix: Loyalitätskonflikte, Schulnoten fallen, Angststörungen",
    ],

    processTitle: "Der Weg zur Mediation",
    processIntro:
      "Bevor die eigentliche Mediation strukturiert begann, musste erst wieder eine minimale Gesprächsbasis entstehen.",
    steps: [
      {
        label: "1",
        title: "Der Tiefpunkt",
        description:
          'Maria und Thomas sprechen nicht miteinander. Ein Anwalt-Freund von Thomas sagt: "Gericht wird ein Desaster für alle. Versucht Mediation."',
      },
      {
        label: "2",
        title: "Erste Skepsis",
        description:
          'Maria ist skeptisch. "Wie soll das funktionieren? Thomas will die Ehe beenden!" Aber Thomas verspricht: "Es geht nicht darum, die Ehe zu retten. Es geht darum, fair für die Kinder zu regeln."',
      },
      {
        label: "3",
        title: "Der Anruf bei medipact",
        description:
          "Thomas kontaktiert medipact. Der Mediator erklärt das Konzept. Beide vereinbaren ein Treffen – getrennt zuerst, dann zusammen.",
      },
      {
        label: "4",
        title: "Erstes Gespräch",
        description:
          'Der Mediator führt getrennte Gespräche mit Maria und Thomas. Maria kann endlich ihre Angst aussprechen: "Ich verliere die Kinder!" Der Mediator macht klar: Das Ziel ist nicht Verlust, sondern eine tragfähige Elternlösung.',
      },
      {
        label: "Monat 1",
        title: "Interessen klären",
        description:
          'Was brauchen Maria, Thomas und die Kinder wirklich? Nicht "Ich will das Haus", sondern "Ich brauche Stabilität für die Kinder."',
      },
      {
        label: "Monat 2",
        title: "Kindeswohl im Fokus",
        description:
          "Emma und Felix brauchen beide Eltern regelmäßig, einen sicheren Zuhause-Ort und keine Loyalitätskonflikte. Der Mediator arbeitet mit dem Harvard-Prinzip.",
      },
      {
        label: "Monat 3",
        title: "Sorgerecht & Umgang",
        description:
          "Gemeinsames Sorgerecht bleibt bestehen. Emma und Felix leben hauptsächlich bei Maria. Umgang: Thomas hat Montag, Mittwoch, Freitag 17:00–20:00 plus jedes zweite Wochenende.",
      },
      {
        label: "Monat 4",
        title: "Finanzen transparent",
        description:
          "Unterhalt nach Düsseldorfer Tabelle: Thomas zahlt €450/Monat für beide Kinder. Hausregelung: Maria bleibt wohnen, Thomas erhält einen Ausgleich. Die Belastungen werden offen kalkuliert.",
      },
      {
        label: "Monat 5",
        title: "Schriftliche Vereinbarung",
        description:
          "Alles wird dokumentiert, rechtlich verbindlich festgehalten und von beiden unterschrieben. Kein Gerichtsverfahren nötig.",
      },
    ],

    resultTitle: "Das Ergebnis",
    positive: {
      title: "Mit Mediation",
      items: [
        "€499 Kosten (statt €52k+)",
        "5 Monate (statt 3 Jahre)",
        "Gemeinsames Sorgerecht bleibt",
        "Thomas hat beide Kinder regelmäßig",
        "Maria behält das Haus",
        "Emma & Felix: Kein Gerichts-Trauma",
        "Maria & Thomas: Respekt bleibt",
      ],
    },
    negative: {
      title: "Ohne Mediation (Gericht)",
      items: [
        "€52k+ Kosten",
        "3 Jahre Verfahren",
        "Gericht bestimmt Sorgerecht statt gemeinsamer Lösung",
        'Umgangsrecht starr: "2. & 4. Samstag"',
        "Haus-Verkauf unter Druck",
        "Emma & Felix: Psychologische Gutachter, Angst",
        "Maria & Thomas: Dauerhass",
      ],
    },

    quotesTitle: "Was sie sagen",
    quotes: [
      {
        text: "Ich hätte nie gedacht, dass Thomas und ich ohne Krieg eine Lösung finden. Der Mediator hat uns nicht geraten, sondern hat uns Fragen gestellt, die uns selbst zum Nachdenken brachten. Und die Kinder – Emma und Felix sind so entspannt. Sie sehen Papa regelmäßig, sie wissen, dass beide sie lieben.",
        author: "Maria",
      },
      {
        text: "Maria war anfangs wütend auf mich. Mediation hat uns beide geholfen zu sehen: Es geht nicht um unsere Ehe. Es geht darum, dass Emma und Felix eine gute Zukunft haben. Jetzt respektieren wir uns – nicht mehr als Partner, aber als Co-Eltern. Das ist wichtig für die Kinder.",
        author: "Thomas",
      },
    ],

    ctaTitle: "Eure Geschichte könnte ähnlich sein",
    ctaText:
      "€499. Fair. Schnell. Ohne Gericht. Eure Kinder verdienen eine Lösung, bei der beide Eltern sich respektieren – nicht bekämpfen.",
    ctaHref: "mailto:hallo@medipact.de?subject=Mediation",
    ctaLabel: "Mediation starten",
  },

  "alexa-david": {
    slug: "alexa-david",
    eyebrow: "Fallbeispiel",
    title: "Alexa & David",
    titleHighlight: "Mit neuem Partner & Stiefkind",
    intro:
      "Verheiratet 6 Jahre. 2 Kinder (4 & 6). Alexa hat eine neue Partnerschaft mit Stiefkind. Die Fragen: Wer macht was? Wie funktioniert das für alle? Lösung in 4 Monaten ohne Gericht.",

    situationTitle: '"Ist mein neuer Partner ein Problem?"',
    situationIntro:
      "Die Trennung ist komplizierter geworden, weil neue Beziehungen und neue Rollen dazukommen. Die eigentliche Herausforderung ist nicht nur die Trennung, sondern das neue Familiensystem.",

    perspectives: [
      {
        title: "Alexa, 35, Sozialarbeiterin",
        content:
          "Ich liebe David noch, aber wir passen nicht zusammen. Dann habe ich Martin kennengelernt – er hat ein Kind (8), und wir wollen zusammenwohnen. Aber ich hatte Angst: Wird David das verstehen? Was ist mit unseren Kindern?",
      },
      {
        title: "David, 37, Handwerker",
        content:
          "Ich wollte das nicht hören – Alexa hat einen neuen Freund! Mein erster Gedanke war: Ich verliere meine Kinder. Aber dann habe ich realisiert: Alexa will nicht egoistisch sein. Sie sucht wirklich eine Lösung, die für alle funktioniert. Gericht war das Gegenteil.",
      },
    ],

    factsTitle: "Die Zahlen",
    facts: [
      "Verheiratet: 6 Jahre",
      "Kinder: Sophie (6), Leon (4)",
      "Alexa verdient: €2.200/Monat",
      "David verdient: €2.800/Monat",
      "Wohnung gemeinsam: €1.200 Miete",
      "Martins Kind: 8 Jahre (bei Mutter am Wochenende)",
    ],

    riskTitle: "Ohne Mediation (Gericht)",
    risks: [
      "2+ Jahre Sorgerechtsstreit",
      "Psychologische Gutachter: €5.000",
      "2 Anwälte: €25.000",
      "Gerichtskosten: €3.000",
      "Total: €33.000+",
      'Sophie & Leon: Angst, "Magst du Martin mehr als mich?" – Loyalitätskonflikte',
    ],

    processTitle: "Der Mediations-Prozess (4 Monate)",
    steps: [
      {
        label: "Monat 1",
        title: "Alle Beteiligten verstehen",
        description:
          "Nicht nur Alexa und David, sondern auch Martin werden mitgedacht. Welche Ängste gibt es? Was brauchen die Kinder? Wo entstehen Rollen-Konflikte?",
      },
      {
        label: "Monat 2",
        title: "Rollen klären",
        description:
          "Ist Martin eine Quasi-Elternfigur? Wie stellt sich David das vor? Können Sophie und Leon Martin mögen, ohne das Gefühl zu haben, ihren Vater zu verraten?",
      },
      {
        label: "Monat 3",
        title: "Umgang regeln",
        description:
          "Sophie und Leon leben überwiegend bei Alexa und Martin. David hat feste Zeiten unter der Woche plus jedes zweite Wochenende. Gleichzeitig wird klar geregelt, wie Martins Kind eingebunden ist, ohne Alexas Kinder zu überfordern.",
      },
      {
        label: "Monat 4",
        title: "Schriftliche Vereinbarung",
        description:
          "Alle verstehen die Rollen. Unterhalt: David zahlt €400/Monat. Zusätzlich werden Regeln für spätere Veränderungen festgelegt, zum Beispiel wenn Martins Kind öfter da sein möchte.",
      },
    ],

    resultTitle: "Das Ergebnis",
    positive: {
      title: "Mit Mediation",
      items: [
        "€499 (statt €33k)",
        "4 Monate (statt 2 Jahre)",
        "Sophie & Leon: Beide Eltern, klare Rollen",
        "Martin: Klare Rolle, keine Verwirrung",
        "David: Regelmäßiger Umgang bleibt",
        "Alle 4 respektieren sich",
      ],
    },
    negative: {
      title: "Ohne Mediation",
      items: [
        "€33k+ Kosten",
        "2 Jahre Verfahren",
        "Sophie & Leon: Psychologische Gutachter",
        "Hass zwischen Alexa & David",
        "Martins Rolle: Ungeklärt und konfus",
        "Neue Partnerschaft scheitert unter Druck",
      ],
    },

    quotesTitle: "Was sie sagen",
    quotes: [
      {
        text: "Ich hatte Angst, dass David alles kompliziert macht. Aber Mediation hat ihm geholfen zu sehen: Es geht nicht um mich oder Martin. Es geht um Sophie und Leon. Jetzt unterstützt David sogar, dass Martin eine gute Rolle in ihrem Leben hat – nicht als Vater, aber als wichtiger Erwachsener.",
        author: "Alexa",
      },
      {
        text: "Ich war wütend auf Martin. Aber der Mediator hat mir geholfen zu verstehen: Martin ist nicht der Feind. Er liebt Alexa, und er wird gut zu Sophie und Leon sein. Das ist besser als ein Krieg vor Gericht, der meine Beziehung zu den Kindern zerstört.",
        author: "David",
      },
    ],

    ctaTitle: "€499. Fair. Für alle.",
    ctaText:
      "Neue Partner, Stiefkinder, komplexe Rollen – Mediation findet faire Lösungen, die für alle funktionieren.",
    ctaHref: "mailto:hallo@medipact.de?subject=Mediation",
    ctaLabel: "Mediation starten",
  },

  "peter-sarah": {
    slug: "peter-sarah",
    eyebrow: "Fallbeispiel",
    title: "Peter & Sarah",
    titleHighlight: "Hohes Vermögen, komplexe Aufteilung",
    intro:
      "Verheiratet 20 Jahre. Keine Kinder. Vermögen: Haus (€800k), Ersparnisse (€300k), Rentenpunkte. Gericht kostet €45k+ und dauert Jahre. Mediation: €1.500, schneller, transparenter.",

    situationTitle: '"Wie teilen wir eine Million?"',
    situationIntro:
      "Wenn Vermögen hoch und die Struktur komplex ist, wird das Verfahren oft technisch und teuer. Genau dort kann Mediation Transparenz und Rationalität herstellen.",

    perspectives: [
      {
        title: "Peter, 55, Geschäftsführer",
        content:
          "Unsere Ehe ist zu Ende. Aber wir haben viel zusammen aufgebaut. Wie teilen wir das fair? Immobilien-Gutachter, Rentengutachter, Steuern – das wird eine Katastrophe vor Gericht. Und wir sind beide zu intelligent dafür.",
      },
      {
        title: "Sarah, 52, Unternehmensberaterin",
        content:
          "Ich verdiene genauso wie Peter. Ich möchte keine Unterhalts-Schlacht. Ich möchte wissen: Wer bekommt das Haus? Wie wird die Rente geteilt? Transparent. Fair. Schnell. Gericht ist dafür zu langsam.",
      },
    ],

    factsTitle: "Vermögen",
    facts: [
      "Haus: €800.000 (Hypothek: €200k)",
      "Ersparnisse: €300.000",
      "Rentenpunkte: 50 Jahre Erwerbstätigkeit",
      "Betriebliche Altersvorsorge (Peter)",
      "Gesamtvermögen: ca. €1,1 Mio.",
    ],

    riskTitle: "Ohne Mediation (Gericht)",
    risks: [
      "4 Jahre Verfahren",
      "Immobilien-Gutachter: €3.000",
      "Rentengutachter: €2.000",
      "2 Anwälte: €30.000",
      "Gerichtskosten: €5.000",
      "Steuerberatung: €5.000",
      "Total: €45.000+",
    ],

    processTitle: "Der Mediations-Prozess (8 Monate)",
    steps: [
      {
        label: "Monat 1–2",
        title: "Vermögens-Inventar",
        description:
          "Alle Konten, Versicherungen und Schulden werden vollständig offengelegt. Beide haben dieselbe Datenbasis.",
      },
      {
        label: "Monat 3",
        title: "Immobilien-Gutachter",
        description:
          "Ein gemeinsamer Gutachter statt zwei gegensätzlicher Bewertungen. Das spart Geld und stärkt Akzeptanz.",
      },
      {
        label: "Monat 4",
        title: "Rentenpunkte teilen",
        description:
          "Der Versorgungsausgleich wird verständlich erklärt. Beide wissen, was rechtlich gilt und was wirtschaftlich sinnvoll ist.",
      },
      {
        label: "Monat 5–6",
        title: "Steuern optimieren",
        description:
          "Ein Steuerberater unterstützt bei der Frage, welche Struktur steuerlich sinnvoll ist. So wird nicht nur verteilt, sondern auch optimiert.",
      },
      {
        label: "Monat 7–8",
        title: "Finale Aufteilung & Vereinbarung",
        description:
          "Hausverkauf, Aufteilung des Erlöses, Teilung der Ersparnisse und verbindliche Dokumentation der Einigung.",
      },
    ],

    resultTitle: "Das Ergebnis",
    positive: {
      title: "Mit Mediation",
      items: [
        "€1.500 (statt €45k)",
        "8 Monate (statt 4 Jahre)",
        "€20k Steuern gespart durch Optimierung",
        "Jeder erhält: €475.000",
        "Beide verstehen alle Entscheidungen",
        "Netto-Vorteil: €43.500 pro Person",
      ],
    },
    negative: {
      title: "Ohne Mediation",
      items: [
        "€45k+ Kosten",
        "4 Jahre Verfahren",
        "Haus-Verkauf unter Zeitdruck",
        "Jeder erhält nur ca. €440.000 wegen Kosten",
        "Steueroptimierung wird oft übersehen",
        "Netto-Verlust: ca. €35k pro Person",
      ],
    },

    quotesTitle: "Was sie sagen",
    quotes: [
      {
        text: "Wir sind beide intelligent. Gericht wäre ein Insult für unsere Intelligenz. Mediation war professionell, fair und sparte uns enorme Kosten. Das ist im Rückblick die einzig vernünftige Entscheidung gewesen.",
        author: "Peter & Sarah",
      },
    ],

    ctaTitle: "€1.500. Sparen Sie fünfstellig.",
    ctaText:
      "Komplexes Vermögen? Mediation mit Experten ist transparenter, schneller und kostengünstiger als ein langes Verfahren.",
    ctaHref: "mailto:hallo@medipact.de?subject=Mediation",
    ctaLabel: "Mediation starten",
  },

  "rolf-helga": {
    slug: "rolf-helga",
    eyebrow: "Fallbeispiel",
    title: "Rolf & Helga",
    titleHighlight: "Nach 38 Jahren Ehe",
    intro:
      "Verheiratet 38 Jahre. Beide um die 60. Rolf hat Beamten-Pension, Helga nur geringe Rentenansprüche. Mit Mediation: Klarheit in 6 Monaten statt 2+ Jahre Verfahren.",

    situationTitle: '"Im Alter noch Streit?"',
    situationIntro:
      "Langjährige Ehen sind oft emotional weniger laut, aber wirtschaftlich umso sensibler. Besonders im Alter ist Unsicherheit über Versorgung eine massive Belastung.",

    perspectives: [
      {
        title: "Rolf, 62, ehemaliger Polizist (Beamter)",
        content:
          "Helga war 25 Jahre zuhause für die Kinder. Jetzt wollen wir uns trennen. Ich verdiene €3.500/Monat, Helga verdient nur €1.800. Wie regeln wir das? Ich möchte nicht vor Gericht kämpfen – das schadet uns beiden im Alter.",
      },
      {
        title: "Helga, 60, Teilzeit-Angestellte",
        content:
          "Ich habe meine Karriere für die Familie geopfert. Jetzt habe ich niedrige Rentenpunkte. Im Alter – mit nur rund €800/Monat – wie soll ich leben? Gericht verspricht Sicherheit, aber dauert Jahre. Ich brauche Klarheit jetzt für meine Planung.",
      },
    ],

    factsTitle: "Die Zahlen",
    facts: [
      "Verheiratet: 38 Jahre",
      "Rolf: Beamten-Pension €3.500/Monat",
      "Helga: Spätere Rente ca. €800/Monat",
      "Haus: Abbezahlt, Wert ca. €400k",
      "Ersparnisse: €120.000",
    ],

    riskTitle: "Ohne Mediation (Gericht)",
    risks: [
      "2+ Jahre Verfahren",
      "Rentengutachter: €2.000",
      "Beamten-Pension-Spezialist: €1.500",
      "2 Anwälte: €20.000",
      "Gerichtskosten: €3.000",
      "Total: €26.500+",
      'Helga bleibt mit der Frage zurück: "Wie sicher ist meine Altersversorgung?"',
    ],

    processTitle: "Der Mediations-Prozess (6 Monate)",
    steps: [
      {
        label: "Monat 1",
        title: "Rentenpunkte analysieren",
        description:
          "Welche Ansprüche bestehen tatsächlich? Welche Anteile wurden in der Ehe erworben? Der Versorgungsausgleich wird konkret berechnet.",
      },
      {
        label: "Monat 2",
        title: "Beamten-Pension klären",
        description:
          "Die Besonderheiten der Beamtenversorgung werden mit Fachwissen verständlich gemacht. So entsteht Sicherheit statt Vermutung.",
      },
      {
        label: "Monat 3",
        title: "Helga im Alter absichern",
        description:
          "Die Kombination aus Versorgungsausgleich, Ersparnissen und Hauslösung wird so gestaltet, dass Helga planbar abgesichert ist.",
      },
      {
        label: "Monat 4–5",
        title: "Was-wenn-Szenarien",
        description:
          "Was passiert bei längerer Erwerbstätigkeit, früherem Tod oder späteren Veränderungen? Diese Szenarien werden ausdrücklich mitgedacht.",
      },
      {
        label: "Monat 6",
        title: "Schriftliche Vereinbarung",
        description:
          "Die Regelung wird verbindlich festgehalten. Beide wissen, was gilt und wie die Zukunft abgesichert ist.",
      },
    ],

    resultTitle: "Das Ergebnis",
    positive: {
      title: "Mit Mediation",
      items: [
        "€800 (statt €26.500+)",
        "6 Monate (statt 2+ Jahre)",
        "Helga: ca. €1.200/Monat im Alter",
        "Helga: Haus bleibt ihr",
        "Beide sparen zusammen €25.700",
        '"Was-wenn"-Szenarien sind geklärt',
      ],
    },
    negative: {
      title: "Ohne Mediation",
      items: [
        "€26.500+ Kosten",
        "2+ Jahre Verfahren",
        "Helga: Unsicherheit über Altersversorgung",
        "Rolf: Jahrelange Spannung",
        "Haus-Verkauf möglich",
        "Emotionale Belastung im Alter",
      ],
    },

    quotesTitle: "Was sie sagen",
    quotes: [
      {
        text: "Im Alter noch Streit vor Gericht? Das ist das Letzte, was wir wollten. Mediation hat uns beide beruhigt. Jetzt weiß Helga, dass sie im Alter versorgt ist. Und ich weiß, dass das fair ist. Im Alter ist Respekt wichtiger als Kampf.",
        author: "Rolf & Helga",
      },
    ],

    ctaTitle: "€800. Im Alter in Frieden.",
    ctaText:
      "Langjährige Ehen und komplexe Rentenverhältnisse brauchen Sicherheit, nicht jahrelange Unsicherheit.",
    ctaHref: "mailto:hallo@medipact.de?subject=Mediation",
    ctaLabel: "Mediation starten",
  },

  "carla-marco": {
    slug: "carla-marco",
    eyebrow: "Fallbeispiel",
    title: "Carla & Marco",
    titleHighlight: "Mit Unternehmen",
    intro:
      "Verheiratet 10 Jahre. Zusammen eine GmbH gegründet. Marco will raus, Carla will weitermachen. Lösung: Abfindung plus Fortbestand der Firma.",

    situationTitle: '"Wir bauen eine Firma auf – dann Trennung"',
    situationIntro:
      "Wenn Ehe und Unternehmen miteinander verflochten sind, geht es nie nur um zwei Menschen. Es geht auch um Mitarbeiter, Cashflow und Zukunftsfähigkeit.",

    perspectives: [
      {
        title: "Carla, 38, Geschäftsführerin",
        content:
          "Wir gründeten die Firma zusammen. Aber unsere Ehe funktioniert nicht. Ich möchte die Firma weitermachen – das ist mein Baby. Aber Marco will raus und sein Geld.",
      },
      {
        title: "Marco, 40, technischer Gründer",
        content:
          "Ich bin erschöpft. Ich möchte raus und mein Kapital zurück. Aber ich will nicht, dass die Firma stirbt und unsere Mitarbeiter ihren Job verlieren.",
      },
    ],

    factsTitle: "Die Zahlen",
    facts: [
      "GmbH-Wert: €500.000",
      "Carla & Marco: je 50% Anteile",
      "Schulden: €100.000",
      "5 Mitarbeiter",
      "Jahresumsatz: €800.000",
    ],

    riskTitle: "Ohne Mediation",
    risks: [
      "3+ Jahre Verfahren",
      "Gutachter plus Anwälte: €37.000",
      "Firma wird instabil",
      "Mitarbeiter gehen",
      "Umsatz fällt",
      "Konkurs-Risiko steigt",
    ],

    processTitle: "Der Mediations-Prozess (6 Monate)",
    steps: [
      {
        label: "Monat 1",
        title: "Firma fair bewerten",
        description:
          "Ein Wirtschaftsprüfer bewertet die GmbH nachvollziehbar. So entsteht eine belastbare Basis für die Abfindung.",
      },
      {
        label: "Monat 2–3",
        title: "Übergangsplan",
        description:
          "Es wird geklärt, wie die Firma ohne Marco weiterläuft und wie der operative Übergang stabil bleibt.",
      },
      {
        label: "Monat 4–5",
        title: "Finanzierung strukturieren",
        description:
          "Carla zahlt Marco in Raten aus. Damit bleibt die Firma liquide und Marco erhält planbar sein Geld.",
      },
      {
        label: "Monat 6",
        title: "Schriftliche Vereinbarung",
        description:
          "Marco scheidet aus Geschäftsführung und Anteilen aus. Carla führt allein weiter. Die Firma bleibt stabil.",
      },
    ],

    resultTitle: "Das Ergebnis",
    positive: {
      title: "Mit Mediation",
      items: [
        "€600 Kosten (statt €37k)",
        "6 Monate (statt 3 Jahre)",
        "Marco: €200k Abfindung",
        "Carla: Firma läuft weiter",
        "Mitarbeiter: Jobs bleiben",
        "Beide sparen €36.400",
      ],
    },
    negative: {
      title: "Ohne Mediation",
      items: [
        "€37k+ Kosten",
        "3 Jahre Verfahren",
        "Marco wartet lange auf Geld",
        "Carla: Firma instabil",
        "Mitarbeiter gehen",
        "Firma möglicherweise insolvent",
      ],
    },

    quotesTitle: "Was sie sagen",
    quotes: [
      {
        text: "Mediation rettete unsere Firma. Jetzt bin ich Alleingeschäftsführerin, Marco ist raus mit seiner Abfindung, und unsere Mitarbeiter haben ihre Jobs.",
        author: "Carla",
      },
    ],

    ctaTitle: "€600. Die Firma überlebt.",
    ctaText:
      "Gründer-Trennung? Mediation kann die Firma stabil halten und beiden Seiten einen fairen Ausstieg ermöglichen.",
    ctaHref: "mailto:hallo@medipact.de?subject=Mediation",
    ctaLabel: "Mediation starten",
  },

  "jens-katarina": {
    slug: "jens-katarina",
    eyebrow: "Fallbeispiel",
    title: "Jens & Katarina",
    titleHighlight: "Internationale Trennung",
    intro:
      "Verheiratet 8 Jahre. Katarina ist Schweizerin und will zurück in die Schweiz. 1 Kind (5). Fragen: Welches Recht? Welcher Wohnort? Vermögen in 2 Ländern? Lösung in 9 Monaten.",

    situationTitle: '"Ich will nach Hause – mit Kind!"',
    situationIntro:
      "Internationale Trennungen werden schnell zu einem juristischen Minenfeld. Ohne abgestimmte Lösung drohen Verfahren in mehreren Ländern.",

    perspectives: [
      {
        title: "Jens, 36, Deutscher, Architekt",
        content:
          "Katarina möchte zurück in die Schweiz – ihre Heimat. Aber unser Kind lebt hier. Zwei Länder, zwei Rechtssysteme – das wird kompliziert. Deutsches oder Schweizer Recht? Gericht wo? Das wird ein Albtraum.",
      },
      {
        title: "Katarina, 34, Schweizerin, Grafikerin",
        content:
          "Ich liebe die Schweiz. Ich möchte Lucas dorthin mitnehmen – Nähe zur Familie, bessere Schulen. Aber ich will nicht, dass er seinen Papa verliert. Und ich will nicht, dass zwei Länder gegeneinander arbeiten. Mediation ist die Lösung.",
      },
    ],

    factsTitle: "Die Komplexität",
    facts: [
      "Länder: Deutschland & Schweiz",
      "Kind: Lucas, 5 Jahre",
      "Vermögen in Deutschland: Haus (€400k)",
      "Vermögen in der Schweiz: Ersparnisse (CHF 80k)",
      "Jens: €3.200 Einkommen",
      "Katarina: CHF 3.500 Einkommen",
    ],

    riskTitle: "Ohne Mediation (Gericht)",
    risks: [
      "2+ Jahre in 2 Ländern",
      "2 Anwälte in Deutschland: €20.000",
      "2 Anwälte in der Schweiz: CHF 25.000",
      "Internationale Verfahren / Hague-Konvention",
      "Total: €60.000+",
      "Lucas: Unsicherheit, wo sein Zuhause ist",
    ],

    processTitle: "Der Mediations-Prozess (9 Monate)",
    steps: [
      {
        label: "Monat 1",
        title: "Rechtliche Grundlagen klären",
        description:
          "Welches Recht gilt? Was ist ohne Zustimmung unzulässig? Die Spielregeln müssen zuerst klar sein.",
      },
      {
        label: "Monat 2–3",
        title: "Interessen analysieren",
        description:
          "Heimat, Familie, Schulen, Vater-Sohn-Kontakt: Die Interessen werden auseinandergezogen, statt nur Rechtspositionen zu diskutieren.",
      },
      {
        label: "Monat 4–5",
        title: "Lösung gestalten",
        description:
          "Lucas zieht mit Katarina in die Schweiz. Jens erhält feste Ferienzeiten, Monatsbesuche und regelmäßige Videotelefonie.",
      },
      {
        label: "Monat 6",
        title: "Finanzen regeln",
        description:
          "Unterhalt, Währungsfragen und die Vermögensaufteilung über Ländergrenzen hinweg werden konkret geregelt.",
      },
      {
        label: "Monat 7–8",
        title: "Anerkennung in beiden Ländern",
        description:
          "Die Vereinbarung wird so vorbereitet, dass sie sowohl in Deutschland als auch in der Schweiz belastbar ist.",
      },
      {
        label: "Monat 9",
        title: "Bi-nationale Vereinbarung",
        description:
          "Alles wird final schriftlich dokumentiert. Beide Länder, beide Eltern, ein stabiles Ergebnis.",
      },
    ],

    resultTitle: "Das Ergebnis",
    positive: {
      title: "Mit Mediation",
      items: [
        "€1.200 Kosten (statt €60k)",
        "9 Monate (statt 2+ Jahre)",
        "Lucas: Mutter in der Schweiz, Vater regelmäßig präsent",
        "Katarina: Familie und Heimatnähe",
        "Jens: Kontinuierlicher Kontakt",
        "In beiden Ländern rechtsgültig",
      ],
    },
    negative: {
      title: "Ohne Mediation",
      items: [
        "€60k+ Kosten",
        "2+ Jahre Verfahren",
        "Lucas: Unsicherheit und Angst",
        "Internationale Konflikte eskalieren",
        "Risiko von Hague-Verfahren",
        "Unklarheit: Welches Urteil gilt wo?",
      ],
    },

    quotesTitle: "Was sie sagen",
    quotes: [
      {
        text: "Zwei Länder, ein Kind – das hätte ein Desaster sein können. Aber Mediation hat allen geholfen zu sehen: Wir alle lieben Lucas. Jetzt lebt er mit mir in der Schweiz, sieht seinen Papa regelmäßig, und wir respektieren die Lösung.",
        author: "Katarina & Jens",
      },
    ],

    ctaTitle: "€1.200. Grenzen egal.",
    ctaText:
      "Internationale Trennung? Mediation kann länderübergreifend respektvoll und rechtlich tragfähig funktionieren.",
    ctaHref: "mailto:hallo@medipact.de?subject=Mediation",
    ctaLabel: "Mediation starten",
  },

  "anna-klaus": {
    slug: "anna-klaus",
    eyebrow: "Erbschafts-Fallbeispiel",
    title: "Anna & Klaus",
    titleHighlight: "Geschwister-Streit um das Haus",
    intro:
      "Eltern verstorben. Ein Haus, zwei Geschwister, zwei völlig unterschiedliche Vorstellungen. Ohne Mediation: Jahre Streit. Mit Mediation: Fair gelöst in 3 Monaten.",

    situationTitle: "Die Situation",
    situationIntro:
      "Erbstreit ist selten nur finanziell. Häufig hängt an Vermögen ein emotionaler Rest der Elternbeziehung.",

    perspectives: [
      {
        title: "Anna, 32, Krankenpflegerin",
        content:
          "Unsere Eltern sind beide gestorben – erst Mama, dann Papa. Das Haus ist alles, was mir von ihnen bleibt. Ich möchte es behalten, für meine Familie. Klaus war immer egoistisch – warum sollte er jetzt die Hälfte bekommen, nur weil es das Gesetz sagt?",
      },
      {
        title: "Klaus, 35, Manager",
        content:
          "Ich habe kein Interesse am Haus. Aber es ist auch mein Erbe. Anna kann es haben, aber dann muss sie mich auszahlen – €150k. Das ist fair. Aber Anna will zahlen und zahlen... das wird nicht funktionieren. Dann muss ein Gericht entscheiden.",
      },
    ],

    factsTitle: "Die Zahlen",
    facts: [
      "Haus-Wert: €300.000",
      "Hypothek: €0",
      "Erbengemeinschaft: Anna & Klaus je 50%",
      "Klaus' Anteil: €150.000",
      "Anna Einkommen: €2.500/Monat",
      "Klaus Einkommen: €3.500/Monat",
    ],

    riskTitle: "Ohne Mediation (Gericht)",
    risks: [
      "2 Jahre Verfahren",
      "Immobilien-Gutachter: €2.000",
      "2 Anwälte: €15.000",
      "Gerichtskosten: €3.000",
      "Total: €20.000+",
      "Anna & Klaus sprechen möglicherweise jahrelang nicht miteinander",
    ],

    processTitle: "Mit Mediation",
    steps: [
      {
        label: "Monat 1",
        title: "Haus fair bewerten",
        description:
          "Ein gemeinsamer Gutachter bestätigt den Wert. Damit ist der auszuzahlende Anteil nicht mehr Streitpunkt.",
      },
      {
        label: "Monat 2",
        title: "Finanzierung klären",
        description:
          "Anna kann den Betrag nicht sofort zahlen. Deshalb wird ein tragfähiger Ratenplan entwickelt.",
      },
      {
        label: "Monat 3",
        title: "Schriftliche Vereinbarung",
        description:
          "Klaus tritt aus der Erbengemeinschaft aus, Anna wird Alleineigentümerin, der Zahlungsplan wird verbindlich geregelt.",
      },
    ],

    resultTitle: "Das Ergebnis",
    positive: {
      title: "Mit Mediation",
      items: [
        "€800 Kosten (statt €20k+)",
        "3 Monate (statt 2 Jahre)",
        "Anna behält das Haus",
        "Klaus erhält €150k fair",
        "Anna: Zahlung in Raten möglich",
        "Geschwister-Beziehung bleibt erhalten",
      ],
    },
    negative: {
      title: "Ohne Mediation",
      items: [
        "€20k+ Kosten",
        "2 Jahre Streit",
        "Haus möglicherweise Verkauf unter Druck",
        "Klaus wartet und wird ungeduldig",
        "Anna: Finanzielle Last unklar",
        "Dauerhafter Geschwister-Bruch",
      ],
    },

    quotesTitle: "Was sie sagen",
    quotes: [
      {
        text: "Ich dachte, Klaus und ich kämpfen jetzt 2 Jahre vor Gericht. Mediation hat uns gezeigt: Wir wollen beide fair behandelt werden. Anna behält das Haus unserer Eltern, Klaus bekommt sein Geld. Und wir sind wieder Geschwister statt Feinde.",
        author: "Anna & Klaus",
      },
    ],

    ctaTitle: "€800. Familie retten.",
    ctaText:
      "Erbschaftsstreit ist schmerzhaft. Mediation hilft Geschwistern, fair zu teilen – und die Beziehung nicht zu zerstören.",
    ctaHref: "mailto:hallo@medipact.de?subject=Mediation",
    ctaLabel: "Mediation starten",
  },

  "marie-sophie": {
    slug: "marie-sophie",
    eyebrow: "Erbschafts-Fallbeispiel",
    title: "Marie & Sophie",
    titleHighlight: "Testament-Konflikt",
    intro:
      "Mutter verstorben. Testament: Sophie erhält €500k, Marie nur €50k. Marie fühlt sich betrogen. Mediation führt zu einer faireren und verständlichen Lösung – ohne jahrelangen Streit.",

    situationTitle: "Die Situation",
    situationIntro:
      "Testamentskonflikte sind besonders emotional, weil sie fast immer als Liebes- oder Gerechtigkeitsfrage erlebt werden, nicht nur als Vermögensfrage.",

    perspectives: [
      {
        title: "Marie, 28, Grafikerin",
        content:
          "Ich war Mamas Lieblingskind! Oder? Das Testament sagt: Nein. Sophie bekommt €500k, ich nur €50k. Warum? Mutter hat mir kurz vor ihrem Tod nichts gesagt. Ich glaube, das Testament ist falsch. Ich werde vor Gericht kämpfen.",
      },
      {
        title: "Sophie, 31, Anwältin",
        content:
          "Mutter hat mir alles vermacht, weil sie wusste, dass ich ihre Schulden bezahlen muss. Die Pflege in den letzten 2 Jahren hat €200k gekostet. Ich bin nicht reicher – ich bin stärker belastet. Aber Marie glaubt, ich sei die Böse.",
      },
    ],

    factsTitle: "Die Zahlen",
    facts: [
      "Testament: Sophie €500k, Marie €50k",
      "Pflegekosten (2 Jahre): €200.000",
      "Schulden der Mutter: €50.000",
      "Erwartete Streit-Kosten: €40k+",
      "Dauer vor Gericht: 3+ Jahre",
    ],

    riskTitle: "Ohne Mediation (Gericht)",
    risks: [
      "3+ Jahre Streit",
      "Psychologische Gutachter zur Testierfähigkeit: €5.000",
      "2 Anwälte: €20.000",
      "Gerichtskosten: €3.000",
      "Total: €28.000+",
      "Marie & Sophie riskieren lebenslange Feindschaft",
    ],

    processTitle: "Mit Mediation",
    steps: [
      {
        label: "Monat 1",
        title: "Zahlen transparent machen",
        description:
          "Pflegekosten, Schulden und tatsächliche Lasten werden offen gelegt. Emotionen treffen erstmals auf überprüfbare Fakten.",
      },
      {
        label: "Monat 2",
        title: "Faire Lösung entwickeln",
        description:
          "Nach Abzug der Belastungen wird eine nachvollziehbare Verteilung ausgehandelt, die sowohl Leistung als auch Erbanspruch berücksichtigt.",
      },
      {
        label: "Monat 3",
        title: "Versöhnung & Vereinbarung",
        description:
          "Beide unterschreiben. Nicht alles wird gleich, aber es wird verständlich, tragfähig und beziehungsschonender.",
      },
    ],

    resultTitle: "Das Ergebnis",
    positive: {
      title: "Mit Mediation",
      items: [
        "€800 Kosten (statt €28k+)",
        "3 Monate (statt 3 Jahre)",
        "Marie erhält €75k statt €50k plus Streit",
        "Sophie kann Schulden fair tragen",
        "Pflegeleistung wird anerkannt",
        "Schwestern-Beziehung bleibt erhalten",
      ],
    },
    negative: {
      title: "Ohne Mediation",
      items: [
        "€28k+ Kosten",
        "3 Jahre Streit",
        "Marie gewinnt möglicherweise – oder nicht",
        "Sophie trägt Schulden weiter",
        "Gericht ignoriert oft die Pflege-Realität",
        "Schwestern sprechen nie wieder",
      ],
    },

    quotesTitle: "Was sie sagen",
    quotes: [
      {
        text: "Ich dachte, Mutter liebte mich nicht. Das Testament schien es zu beweisen. Aber Mediation hat mir gezeigt: Mutter liebte uns beide – nur auf unterschiedliche Weise. Ich bin nicht betrogen. Ich bin verstanden.",
        author: "Marie",
      },
    ],

    ctaTitle: "€800. Vertrauen wiederherstellen.",
    ctaText:
      "Testament-Streit ist hoch emotional. Mediation hilft, Zahlen, Motive und Beziehung wieder ins richtige Verhältnis zu setzen.",
    ctaHref: "mailto:hallo@medipact.de?subject=Mediation",
    ctaLabel: "Mediation starten",
  },

  "familie-weber": {
    slug: "familie-weber",
    eyebrow: "Erbschafts-Fallbeispiel",
    title: "Familie Weber",
    titleHighlight: "Unternehmen erben – Betrieb retten oder verkaufen?",
    intro:
      "Der Vater stirbt plötzlich. Ein Metallbau-Betrieb mit 20 Mitarbeitern steht im Raum. Drei Kinder erben: Einer will weitermachen – die anderen wollen ausgezahlt werden. Ohne Einigung droht der Verkauf – und 20 Jobs stehen auf dem Spiel.",

    situationTitle: "Die Situation",
    situationIntro:
      "Bei Unternehmens-Erbschaften geht es nie nur um Geld. Es geht um Verantwortung, Existenz und oft um das Lebenswerk der Familie.",

    perspectives: [
      {
        title: "Thomas, 38, arbeitet im Betrieb",
        content:
          "Ich habe den Betrieb mit meinem Vater aufgebaut. Wenn ich meine Geschwister sofort auszahlen muss, schaffe ich das finanziell nicht. Ein Verkauf würde alles zerstören – für mich und die Mitarbeiter.",
      },
      {
        title: "Lisa, 35, und Martin, 32",
        content:
          "Wir haben nichts mit dem Betrieb zu tun. Aber es ist unser Erbe. Warum sollte Thomas alles bekommen und wir warten oder leer ausgehen? Wir brauchen eine faire und sichere Lösung.",
      },
    ],

    factsTitle: "Die Zahlen",
    facts: [
      "Unternehmenswert: €1.200.000",
      "Schulden: €200.000",
      "Nettovermögen: €1.000.000",
      "Anteil pro Kind: ca. €333.000",
      "20 Arbeitsplätze betroffen",
      "Umsatz: €3,5 Mio. jährlich",
    ],

    riskTitle: "Wenn es vor Gericht geht",
    risks: [
      "3–4 Jahre Streit",
      "Kosten über €38.000",
      "Zwang zum Verkauf möglich",
      "20 Mitarbeiter verlieren ihre Jobs",
      "Familie zerbricht dauerhaft",
    ],

    processTitle: "Wie Mediation hilft",
    steps: [
      {
        label: "Monat 1",
        title: "Klare Bewertung",
        description:
          "Ein unabhängiger Gutachter bewertet den Betrieb realistisch – Grundlage für alle weiteren Entscheidungen.",
      },
      {
        label: "Monat 2",
        title: "Individuelle Lösung",
        description:
          "Thomas übernimmt den Betrieb. Die Geschwister erhalten eine Kombination aus sofortiger Auszahlung und abgesicherten späteren Zahlungen.",
      },
      {
        label: "Monat 3",
        title: "Rechtliche Absicherung",
        description:
          "Vertragliche Sicherheiten sorgen dafür, dass alle Ansprüche klar geregelt und geschützt sind.",
      },
      {
        label: "Monat 4",
        title: "Einigung",
        description:
          "Der Betrieb bleibt bestehen, die Geschwister erhalten ihr Geld, die Familie kann wieder miteinander sprechen.",
      },
    ],

    resultTitle: "Das Ergebnis",
    positive: {
      title: "Mit Mediation",
      items: [
        "€1.200 statt €38.000+ Kosten",
        "Lösung in 4 Monaten",
        "Betrieb bleibt in der Familie",
        "20 Arbeitsplätze gesichert",
        "Fairer Ausgleich für alle",
        "Familienbeziehung bleibt intakt",
      ],
    },
    negative: {
      title: "Ohne Mediation",
      items: [
        "Jahrelanger Rechtsstreit",
        "Hohe Kosten",
        "Zwangsverkauf möglich",
        "Arbeitsplätze gehen verloren",
        "Ungewisse Auszahlung",
        "Dauerhafte Familienkonflikte",
      ],
    },

    quotesTitle: "Was sie sagen",
    quotes: [
      {
        text: "Wir dachten, einer gewinnt und die anderen verlieren. Am Ende haben wir eine Lösung gefunden, mit der wir alle leben können – und der Betrieb bleibt bestehen.",
        author: "Familie Weber",
      },
    ],

    ctaTitle: "Betrieb retten statt Streit eskalieren lassen",
    ctaText:
      "Wenn ein Unternehmen Teil der Erbschaft ist, braucht es mehr als juristische Lösungen. Mediation schafft Klarheit, Sicherheit und Zukunft.",
    ctaHref: "mailto:hallo@medipact.de?subject=Mediation",
    ctaLabel: "Gespräch starten",
  },
  "nachbarschaft-laerm": {
    slug: "nachbarschaft-laerm",
    eyebrow: "Nachbarschafts-Fallbeispiel",
    title: "Familie Schneider",
    titleHighlight: "Nächtlicher Lärm – wie viel ist zumutbar?",
    intro:
      "Seit Monaten laute Musik bis spät in die Nacht. Gespräche eskalieren, die Polizei war schon mehrfach da. Beide Seiten fühlen sich im Recht – die Situation droht zu kippen.",

    situationTitle: "Die Situation",
    situationIntro:
      "Lärm ist einer der häufigsten Auslöser für Nachbarschaftskonflikte – weil er direkt den Alltag und die Erholung betrifft.",

    perspectives: [
      {
        title: "Familie Schneider",
        content:
          "Wir können nachts nicht schlafen. Unser Kind wacht ständig auf. Wir haben mehrfach das Gespräch gesucht – ohne Erfolg.",
      },
      {
        title: "Herr Becker, 29",
        content:
          "Ich arbeite viel und genieße meine Freizeit abends. Ich fühle mich kontrolliert und ungerecht behandelt.",
      },
    ],

    factsTitle: "Die Fakten",
    facts: [
      "Mehrere Polizeieinsätze",
      "Beschwerden über Monate",
      "Schlafstörungen bei Familie",
      "Verhältnis komplett zerrüttet",
    ],

    riskTitle: "Wenn es eskaliert",
    risks: [
      "Anzeige wegen Ruhestörung",
      "Gerichtsverfahren",
      "Dauerhafte Feindschaft",
      "Stress im Alltag für beide Seiten",
    ],

    processTitle: "Wie Mediation hilft",
    steps: [
      {
        label: "Schritt 1",
        title: "Beide Seiten verstehen",
        description:
          "Beide Parteien schildern ihre Perspektive – ohne Unterbrechung oder Bewertung.",
      },
      {
        label: "Schritt 2",
        title: "Konkrete Lösungen",
        description:
          "Klare Ruhezeiten und Vereinbarungen werden gemeinsam erarbeitet.",
      },
      {
        label: "Schritt 3",
        title: "Verbindlichkeit",
        description: "Die Vereinbarung wird schriftlich festgehalten.",
      },
    ],

    resultTitle: "Das Ergebnis",
    positive: {
      title: "Mit Mediation",
      items: [
        "Klare Ruhezeiten",
        "Weniger Stress im Alltag",
        "Keine weiteren Polizeieinsätze",
        "Nachbarschaft entspannt sich",
      ],
    },
    negative: {
      title: "Ohne Mediation",
      items: [
        "Weitere Eskalation",
        "Gerichtliche Auseinandersetzung",
        "Dauerhafter Konflikt",
        "Wohnqualität sinkt",
      ],
    },

    quotesTitle: "Was sie sagen",
    quotes: [
      {
        text: "Wir wollten einfach wieder ruhig schlafen. Jetzt gibt es klare Regeln – und endlich wieder Frieden.",
        author: "Familie Schneider",
      },
    ],

    ctaTitle: "Ruhe statt Dauerstress",
    ctaText:
      "Nachbarschaftskonflikte müssen nicht eskalieren. Mediation schafft klare und faire Lösungen.",
    ctaHref: "mailto:hallo@medipact.de?subject=Mediation",
    ctaLabel: "Konflikt lösen",
  },
  "nachbarschaft-zaun": {
    slug: "nachbarschaft-zaun",
    eyebrow: "Nachbarschafts-Fallbeispiel",
    title: "Familien Krüger & Hoffmann",
    titleHighlight: "Zaun auf der Grenze – wem gehört das Stück Land?",
    intro:
      "Ein neuer Zaun sorgt für Streit: Steht er auf der richtigen Grenze oder nicht? Beide Parteien sind überzeugt, im Recht zu sein.",

    situationTitle: "Die Situation",
    situationIntro:
      "Grundstücksgrenzen sind emotional aufgeladen – weil sie Besitz und Kontrolle betreffen.",

    perspectives: [
      {
        title: "Familie Krüger",
        content:
          "Der Zaun steht zu weit auf unserem Grundstück. Das können wir nicht akzeptieren.",
      },
      {
        title: "Familie Hoffmann",
        content:
          "Wir haben uns an die Pläne gehalten. Jetzt wird uns unterstellt, wir hätten etwas falsch gemacht.",
      },
    ],

    factsTitle: "Die Fakten",
    facts: [
      "Unklare Grenzverläufe",
      "Unterschiedliche Interpretationen der Pläne",
      "Emotionale Eskalation",
    ],

    riskTitle: "Wenn es vor Gericht geht",
    risks: [
      "Teure Gutachten",
      "Langwieriger Rechtsstreit",
      "Nachbarschaft dauerhaft zerstört",
    ],

    processTitle: "Wie Mediation hilft",
    steps: [
      {
        label: "Schritt 1",
        title: "Klärung der Fakten",
        description:
          "Gemeinsame Sichtung von Plänen und ggf. neutraler Vermessung.",
      },
      {
        label: "Schritt 2",
        title: "Lösungsoptionen",
        description: "Versetzen des Zauns oder finanzieller Ausgleich.",
      },
      {
        label: "Schritt 3",
        title: "Einigung",
        description: "Beide Seiten einigen sich auf eine akzeptable Lösung.",
      },
    ],

    resultTitle: "Das Ergebnis",
    positive: {
      title: "Mit Mediation",
      items: [
        "Schnelle Einigung",
        "Keine Gerichtskosten",
        "Nachbarschaft bleibt erhalten",
      ],
    },
    negative: {
      title: "Ohne Mediation",
      items: ["Hohe Kosten", "Langwieriger Streit", "Dauerhafte Spannungen"],
    },

    quotesTitle: "Was sie sagen",
    quotes: [
      {
        text: "Am Ende ging es gar nicht um den Zaun – sondern darum, gehört zu werden.",
        author: "Familie Hoffmann",
      },
    ],

    ctaTitle: "Grenzen klären ohne Streit",
    ctaText:
      "Konflikte um Grundstücke lassen sich oft schneller und fairer lösen als gedacht.",
    ctaHref: "mailto:hallo@medipact.de?subject=Mediation",
    ctaLabel: "Lösung finden",
  },
  "nachbarschaft-parken": {
    slug: "nachbarschaft-parken",
    eyebrow: "Nachbarschafts-Fallbeispiel",
    title: "Herr Wagner & Frau Lehmann",
    titleHighlight: "Parkplatz blockiert – täglicher Streit vor der Haustür",
    intro:
      "Immer wieder wird die Einfahrt blockiert. Diskussionen eskalieren, gegenseitige Vorwürfe nehmen zu. Der Konflikt ist inzwischen persönlich geworden.",

    situationTitle: "Die Situation",
    situationIntro:
      "Parkplätze sind knapp – und schnell wird aus einem kleinen Problem ein persönlicher Konflikt.",

    perspectives: [
      {
        title: "Herr Wagner",
        content:
          "Ich komme oft nicht aus meiner Einfahrt. Das kann so nicht weitergehen.",
      },
      {
        title: "Frau Lehmann",
        content:
          "Es gibt einfach zu wenige Parkplätze. Ich habe keine andere Wahl.",
      },
    ],

    factsTitle: "Die Fakten",
    facts: [
      "Regelmäßige Blockade der Einfahrt",
      "Wiederholte Streitgespräche",
      "Keine klare Regelung",
    ],

    riskTitle: "Wenn es eskaliert",
    risks: [
      "Abschleppen des Fahrzeugs",
      "Anzeige",
      "Dauerhafte Nachbarschaftskonflikte",
    ],

    processTitle: "Wie Mediation hilft",
    steps: [
      {
        label: "Schritt 1",
        title: "Konflikt klären",
        description: "Beide Seiten schildern ihre Situation und Bedürfnisse.",
      },
      {
        label: "Schritt 2",
        title: "Praktische Lösungen",
        description:
          "Konkrete Parkregelungen oder alternative Lösungen werden entwickelt.",
      },
      {
        label: "Schritt 3",
        title: "Vereinbarung",
        description: "Eine klare und verbindliche Lösung wird festgehalten.",
      },
    ],

    resultTitle: "Das Ergebnis",
    positive: {
      title: "Mit Mediation",
      items: [
        "Klare Parkregelung",
        "Weniger Konflikte",
        "Alltag entspannt sich",
      ],
    },
    negative: {
      title: "Ohne Mediation",
      items: [
        "Eskalation",
        "Kosten durch Abschleppen",
        "Nachbarschaft dauerhaft belastet",
      ],
    },

    quotesTitle: "Was sie sagen",
    quotes: [
      {
        text: "Wir haben endlich eine Lösung, mit der wir beide leben können.",
        author: "Herr Wagner",
      },
    ],

    ctaTitle: "Alltag ohne Streit",
    ctaText:
      "Auch kleine Konflikte können groß werden – Mediation hilft, sie früh zu lösen.",
    ctaHref: "mailto:hallo@medipact.de?subject=Mediation",
    ctaLabel: "Konflikt klären",
  },
};
