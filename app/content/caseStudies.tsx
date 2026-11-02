export type CaseStudyStep = {
  label: string;
  title: string;
  description: string;
};

export type CaseStudyQuote = {
  text: string;
  author: string;
};

export type CaseStudyChapter = {
  kicker?: string;
  title: string;
  paragraphs: string[];
  quote?: CaseStudyQuote;
};

export type CaseStudyRandnotiz = {
  norm: string;
  text: string;
};

export type CaseStudyTwist = {
  /** Was ein Gericht entschieden hätte. */
  gericht: string;
  /** Was am Mediationstisch herauskam. */
  einigung: string;
};

export type CaseStudyData = {
  slug: string;
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  intro: string;

  situationTitle: string;
  situationIntro?: string;

  storyTitle?: string;
  storyIntro?: string;
  chapters?: CaseStudyChapter[];

  /** Augenzwinkernde, aber juristisch korrekte Einordnung — unter der Geschichte. */
  randnotizen?: CaseStudyRandnotiz[];
  /** Kuriose Einigungen: was ein Urteil so nie hätte regeln können. */
  twists?: CaseStudyTwist[];

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
  "trennung-mit-kindern": {
    slug: "trennung-mit-kindern",
    eyebrow: "Fallbeispiel",
    title: "Maria & Thomas",
    titleHighlight: "Trennung mit 2 Kindern",
    intro:
      "Zwölf Jahre Ehe, zwei Kinder und ein Fernseher, der mitten in der Sendung ausging. Thomas wollte gehen, Maria wollte kämpfen, notfalls bis zum Oberlandesgericht. Fünf Monate später hatten die beiden keinen Beschluss, sondern einen Plan, in dem sogar der Kater vorkommt.",

    situationTitle: '"Ich wollte die Kinder nicht verlieren"',
    situationIntro:
      "Auf dem Papier ging es um Haus, Unterhalt und Umgang. Darunter lag eine einzige Angst, und die hatten beide, ohne es voneinander zu wissen: die Kinder zu verlieren.",

    storyIntro:
      "Wie aus einem stummen Krieg am Küchentisch in fünf Monaten eine Lösung wurde, die beide unterschrieben haben — erzählt entlang der Momente, die den Unterschied gemacht haben.",
    chapters: [
      {
        kicker: "Kapitel 1 · Der Satz, der alles veränderte",
        title: "Ein Dienstagabend im Oktober",
        paragraphs: [
          "Die Kinder schliefen schon, als Thomas den Fernseher ausschaltete. Maria wusste in dem Moment, dass etwas kommen würde — er schaltete den Fernseher nie mitten in einer Sendung aus. „Maria, ich kann nicht mehr. Ich liebe dich nicht mehr so, wie man einen Menschen lieben sollte, mit dem man alt wird.“ Zwölf Jahre Ehe, zusammengefaltet in zwei Sätzen.",
          "Maria erinnert sich vor allem an die Stille danach. Und an den ersten Gedanken, der nicht Thomas galt, sondern Emma und Felix: Was wird aus den Kindern? In den Wochen danach sprachen die beiden fast nur noch über Logistik — wer bringt die Kinder zur Schule, wer kauft ein. Alles andere war vermint.",
        ],
        quote: {
          text: "Ich habe nachts wach gelegen und Gerichtsurteile gegoogelt. ‚Umgangsrecht jeden zweiten Samstag‘ — dieser Satz hat mich fertiggemacht.",
          author: "Maria",
        },
      },
      {
        kicker: "Kapitel 2 · Die Fronten",
        title: "Zwei Anwälte, null Gespräch",
        paragraphs: [
          "Maria suchte sich eine Anwältin, „nur zur Sicherheit“. Thomas erfuhr davon über einen gemeinsamen Freund — und fühlte sich verraten. Er antwortete mit einem eigenen Anwaltstermin. Innerhalb von drei Wochen war aus einem traurigen Paar ein Fall geworden: Aktenzeichen statt Frühstückstisch.",
          "Der Wendepunkt kam ausgerechnet von Thomas' Anwalt-Freund Markus, beim Bier: „Ich verdiene mein Geld mit solchen Verfahren, also glaub mir: Gericht wird ein Desaster. Drei Jahre, fünfzigtausend Euro, und am Ende hassen euch eure Kinder für das, was sie mit ansehen mussten. Versucht Mediation. Wenn es scheitert, könnt ihr immer noch streiten.“",
        ],
      },
      {
        kicker: "Kapitel 3 · Der erste Termin",
        title: "„Es geht nicht darum, die Ehe zu retten“",
        paragraphs: [
          "Maria sagte am Telefon fast ab. Was sie umstimmte, war ein Detail: Der Mediator bot getrennte Erstgespräche an. Sie musste Thomas nicht gegenübersitzen, noch nicht. In ihrem Einzelgespräch sprach sie zum ersten Mal den Satz aus, der unter allem lag: „Ich habe Angst, die Kinder zu verlieren.“",
          "Die Antwort des Mediators hat sie später oft zitiert: „Dann haben Sie und Ihr Mann schon mal ein gemeinsames Ziel — denn genau davor hat er auch Angst.“ Es war das erste Mal seit Monaten, dass Maria und Thomas auf derselben Seite standen, ohne es zu wissen.",
        ],
        quote: {
          text: "Der Mediator hat uns nie gesagt, was richtig ist. Er hat Fragen gestellt, auf die wir selbst nie gekommen wären.",
          author: "Maria",
        },
      },
      {
        kicker: "Kapitel 4 · Die Arbeit",
        title: "Vom Haus zum eigentlichen Thema",
        paragraphs: [
          "In den gemeinsamen Sitzungen ging es zunächst scheinbar ums Haus. Maria wollte es behalten, Thomas wollte seinen Anteil. Erst als der Mediator fragte, wofür das Haus eigentlich steht, kippte das Gespräch: Für Maria war das Haus nicht Vermögen, sondern der Beweis, dass für Emma und Felix nicht alles zusammenbricht. Für Thomas war sein Anteil nicht Geld, sondern die Möglichkeit, in der Nähe eine Wohnung zu finanzieren, in der die Kinder gerne sind.",
          "Aus Positionen wurden Interessen — und plötzlich gab es Lösungen: Maria bleibt mit den Kindern im Haus und zahlt Thomas einen fairen Ausgleich, gestreckt über Jahre. Thomas nimmt die Wohnung zwei Straßen weiter. Der Umgang wurde nicht nach Schema geregelt, sondern nach dem Alltag der Kinder: Montag, Mittwoch, Freitag nach der Schule bei Papa, dazu jedes zweite Wochenende.",
        ],
      },
      {
        kicker: "Kapitel 5 · Fünf Monate später",
        title: "Eine Unterschrift statt eines Urteils",
        paragraphs: [
          "Im März saßen Maria und Thomas zum letzten Mal beim Mediator. Auf dem Tisch: eine Vereinbarung über Sorgerecht, Umgang, Unterhalt nach Düsseldorfer Tabelle und die Hausregelung. Kein Richter hatte auch nur eine Zeile davon diktiert.",
          "Emma und Felix haben nie einen Gerichtsflur von innen gesehen. Als Felix Monate später beim Abendessen fragte, ob Mama und Papa sich noch lieb haben, antwortete Maria: „Anders als früher. Aber dich und Emma — genau wie immer.“ Felix nickte und aß weiter. Mehr wollte er gar nicht wissen.",
        ],
        quote: {
          text: "Wir sind kein Paar mehr. Aber wir sind Eltern geblieben — und zwar beide.",
          author: "Thomas",
        },
      },
    ],

    randnotizen: [
      {
        norm: "§ 1684 BGB",
        text: "Das Umgangsrecht gehört zuerst dem Kind und erst danach den Eltern. Emma und Felix haben ein Recht auf ihren Vater, und Thomas hat die Pflicht, auch zu erscheinen. Das Gesetz denkt hier erstaunlich modern. In der Praxis landet man trotzdem oft beim Klassiker „jedes zweite Wochenende“.",
      },
      {
        norm: "§ 90a BGB · § 1568b BGB",
        text: "Tiere sind keine Sachen, sagt § 90a BGB. Bei der Trennung werden sie trotzdem wie Hausrat behandelt, und ein Umgangsrecht für Haustiere kennt das Familienrecht nicht. Kater Pelle wäre juristisch in derselben Schublade gelandet wie die Mikrowelle.",
      },
    ],

    twists: [
      {
        gericht:
          "Kater Pelle wird als Haushaltsgegenstand einer Seite zugewiesen, genau wie die Mikrowelle.",
        einigung:
          "Pelle bleibt im Haus, weil Kater Orte lieben und nicht Menschen. Damit es auch bei Papa etwas zu füttern gibt, bekommt Felix für die neue Wohnung den Goldfisch, den er sich seit drei Jahren wünscht.",
      },
      {
        gericht:
          "Umgang nach Schema: jedes zweite Wochenende, die Ferien hälftig.",
        einigung:
          "Umgang nach Stundenplan: Montag, Mittwoch und Freitag bei Papa. Thomas ist der Einzige in der Familie, der Emmas Mathe versteht, und freitags hat Felix Fußball, wo Papa sowieso am Rand steht.",
      },
      {
        gericht:
          "Über Geburtstage und Weihnachten entscheidet niemand, solange keiner einen Antrag stellt.",
        einigung:
          "Kindergeburtstage feiern beide zusammen, Weihnachten wechselt jedes Jahr. Am 24. um 17 Uhr gibt es einen Videoanruf, egal wo die Kinder sind. Im Vertrag heißt der Absatz „Bescherungsklausel“.",
      },
    ],

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

  "trennung-patchwork-familie": {
    slug: "trennung-patchwork-familie",
    eyebrow: "Fallbeispiel",
    title: "Alexa & David",
    titleHighlight: "Mit neuem Partner & Stiefkind",
    intro:
      "Sechs Jahre Ehe, zwei kleine Kinder, und dann sagt Alexa den Satz „Da ist jemand“. Jemand mit einem eigenen Kind. Aus einer Trennung wurde eine Gleichung mit vier Erwachsenen und drei Kindern. Gelöst haben sie sie in vier Monaten, mit einem Absatz, den kein Gesetz vorsieht.",

    situationTitle: '"Ist mein neuer Partner ein Problem?"',
    situationIntro:
      "David hatte Angst, ersetzt zu werden. Alexa hatte Angst, dass ihr neues Glück den Kindern schadet. Und Martin fürchtete vor allem eines: das erste Elterngespräch.",

    storyIntro:
      "Eine Trennung, ein neuer Partner, ein Stiefkind — und die Frage, wie aus vier Erwachsenen und drei Kindern eine Familie in neuer Form werden kann.",
    chapters: [
      {
        kicker: "Kapitel 1 · Das Geständnis",
        title: "„Da ist jemand“",
        paragraphs: [
          "Alexa hatte den Satz wochenlang vor sich hergeschoben. Als sie ihn schließlich aussprach — an einem Sonntagabend, die Kinder bei den Großeltern — brauchte David einen Moment, um zu verstehen. „Da ist jemand. Er heißt Martin. Er hat einen Sohn.“",
          "David beschreibt die Tage danach als Nebel. Nicht die Trennung selbst traf ihn am härtesten — dass es kriselte, wussten beide. Es war das Bild, das sich in seinem Kopf festsetzte: ein fremder Mann, der morgens mit seinen Kindern frühstückt. „Ich habe ernsthaft überlegt, ums alleinige Sorgerecht zu kämpfen. Nicht weil ich es für richtig hielt. Sondern weil ich Angst hatte, ersetzt zu werden.“",
        ],
        quote: {
          text: "Mein erster Gedanke war nicht ‚meine Ehe ist vorbei‘. Mein erster Gedanke war: Ich verliere meine Kinder an einen Fremden.",
          author: "David",
        },
      },
      {
        kicker: "Kapitel 2 · Die Eskalation, die nicht kam",
        title: "Ein Anruf statt einer Klage",
        paragraphs: [
          "Davids Schwester, selbst geschieden, hörte sich seine Pläne an und stellte eine einzige Frage: „Willst du, dass Sophie und Leon in fünf Jahren erzählen, wie Papa gegen Mama gekämpft hat — oder wie ihre Eltern das hinbekommen haben?“ David rief noch am selben Abend nicht seinen Anwalt an, sondern Alexa.",
          "Das Gespräch war kurz und unbeholfen. Aber am Ende stand ein Satz, den beide als Anfang beschreiben: „Lass uns jemanden suchen, der uns hilft, bevor wir uns zerlegen.“ Eine Woche später saßen sie beim medipact-Mediator — noch ohne Martin, das war Davids Bedingung.",
        ],
      },
      {
        kicker: "Kapitel 3 · Der Elefant bekommt einen Namen",
        title: "Martins Rolle",
        paragraphs: [
          "In der dritten Sitzung sprach der Mediator aus, worüber alle schwiegen: „Herr M. wird im Alltag Ihrer Kinder vorkommen. Die Frage ist nicht ob, sondern wie — und wer das mitgestaltet.“ David durfte zum ersten Mal formulieren, was Martin aus seiner Sicht sein darf und was nicht: kein zweiter Papa, kein Erziehungsberechtigter — aber gerne der Erwachsene, der Leon das Fahrradfahren beibringt, wenn Leon das möchte.",
          "Alexa wiederum verstand, dass Davids Härte keine Bosheit war, sondern Angst. Und Martin, der später zu einer Sitzung dazukam, sagte den Satz, der das Eis brach: „Ich will deinen Platz nicht. Ich hätte nur gerne, dass wir uns in die Augen schauen können, wenn wir uns beim Abholen begegnen.“",
        ],
        quote: {
          text: "Sophie hat mich gefragt: ‚Papa, darf ich Martin mögen?‘ Da wusste ich, dass wir es richtig machen mussten — für sie.",
          author: "David",
        },
      },
      {
        kicker: "Kapitel 4 · Die neue Ordnung",
        title: "Vier Erwachsene, ein Plan",
        paragraphs: [
          "Nach vier Monaten stand die Vereinbarung: Sophie und Leon leben überwiegend bei Alexa und Martin, David hat feste Zeiten unter der Woche und jedes zweite Wochenende. Unterhalt: €400 im Monat, transparent gerechnet. Und — ungewöhnlich, aber für alle zentral — ein Absatz über Rollen: Entscheidungen über Schule, Gesundheit und Erziehung treffen Alexa und David. Niemand sonst.",
          "Heute, sagt Alexa, gibt es beim Abholen manchmal sogar einen Kaffee an der Tür. Nicht aus Freundschaft. Aus Respekt. „Die Kinder sehen: Die Erwachsenen haben das im Griff. Mehr Sicherheit kann man ihnen nicht geben.“",
        ],
      },
    ],

    randnotizen: [
      {
        norm: "§ 1687b BGB",
        text: "Rechtlich hat Martin bei Sophie und Leon nichts zu sagen, nicht einmal beim Zahnarzt. Ein „kleines Sorgerecht“ gibt es nur für den Ehegatten eines allein sorgeberechtigten Elternteils. Alexa und David haben das Sorgerecht gemeinsam, also bleibt Martin juristisch: der nette Mann mit dem Bobbycar.",
      },
    ],

    twists: [
      {
        gericht:
          "Ein Gericht regelt Umgang und Unterhalt. Die Rolle des neuen Partners ist gar nicht Teil des Verfahrens.",
        einigung:
          "Ein eigener Absatz mit der Überschrift „Wer ist Martin?“. Martin ist Martin und nicht Papa. Er darf trösten, vorlesen und Pflaster kleben. Über Schule, Kita und Haarschnitt entscheidet er nicht.",
      },
      {
        gericht: "Wer das Hochbett aufbaut, ist keine Rechtsfrage.",
        einigung:
          "Das Hochbett für das neue Kinderzimmer haben David und Martin zusammen aufgebaut. David ist Handwerker, Martin hatte den Akkuschrauber. Es war das erste Gespräch der beiden, das länger als zwei Sätze dauerte.",
      },
      {
        gericht:
          "Geburtstage finden dort statt, wo der Umgangsplan es gerade vorsieht.",
        einigung:
          "Kindergeburtstage feiern alle zusammen, Martins Achtjähriger eingeschlossen. Der hat sich zu seinem eigenen Geburtstag ausdrücklich „die zwei Kleinen“ als Gäste gewünscht.",
      },
    ],

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

  "trennung-vermoegen-aufteilen": {
    slug: "trennung-vermoegen-aufteilen",
    eyebrow: "Fallbeispiel",
    title: "Peter & Sarah",
    titleHighlight: "Hohes Vermögen, komplexe Aufteilung",
    intro:
      "Zwanzig Jahre Ehe, keine Kinder, gut eine Million Euro, und zwei Menschen, die beruflich Verhandlungen gewinnen. Die Ansage war klar: Wir trennen uns wie Profis. Am längsten gestritten haben sie am Ende über 140 Flaschen Rotwein.",

    situationTitle: '"Wie teilen wir eine Million?"',
    situationIntro:
      "Zwei Führungskräfte, die jeden Deal durchrechnen können, nur nicht den eigenen. Bei hohem Vermögen wird jede Frage technisch, und jede technische Frage kann man jahrelang begutachten lassen.",

    storyIntro:
      "Zwei Führungskräfte, zwanzig Jahre Ehe, gut eine Million Euro Vermögen — und die Entscheidung, die Trennung wie erwachsene Menschen zu regeln statt wie Prozessgegner.",
    chapters: [
      {
        kicker: "Kapitel 1 · Die nüchterne Diagnose",
        title: "Zwei Profis stellen fest: Es ist vorbei",
        paragraphs: [
          "Bei Peter und Sarah gab es keinen Knall, keine Affäre, keinen Streit, an dem man es festmachen könnte. Es gab ein Abendessen in ihrem Lieblingsrestaurant, bei dem Sarah irgendwann das Besteck ablegte und sagte: „Wir führen seit Jahren eine WG mit gemeinsamer Steuererklärung. Findest du nicht auch?“ Peter, der den Gedanken selbst seit Monaten mit sich herumtrug, war fast erleichtert.",
          "Die Sachlichkeit endete allerdings genau dort, wo die Zahlen anfingen. Ein Haus mit €800.000 Wert, €300.000 Ersparnisse, Rentenpunkte aus fünfzig Erwerbsjahren, Peters betriebliche Altersvorsorge. Beide hatten in ihrem Berufsleben genug Verhandlungen geführt, um zu wissen: Genau an solchen Aufteilungen zerbrechen zivilisierte Absichten.",
        ],
        quote: {
          text: "Wir haben beide beruflich mit Konflikten zu tun. Wir wussten, was passiert, wenn zwei Anwälte anfangen, Gutachten gegeneinander zu schreiben.",
          author: "Sarah",
        },
      },
      {
        kicker: "Kapitel 2 · Der Kassensturz",
        title: "Alles auf den Tisch",
        paragraphs: [
          "Die ersten beiden Monate der Mediation waren unglamourös: ein vollständiges Vermögensinventar. Jedes Konto, jede Versicherung, jede Verbindlichkeit — offengelegt für beide. Der Mediator bestand auf einem Prinzip: Verhandelt wird erst, wenn beide auf dieselben Zahlen schauen.",
          "Für Sarah war das der entscheidende Unterschied zum Gerichtsverfahren: „Vor Gericht hätte jeder von uns versucht, Positionen zu verstecken oder kleinzurechnen. Hier gab es keinen Vorteil darin. Die Transparenz hat das Misstrauen entschärft, bevor es entstehen konnte.“",
        ],
      },
      {
        kicker: "Kapitel 3 · Ein Gutachter statt zwei Gegengutachten",
        title: "Die Immobilienfrage",
        paragraphs: [
          "Beim Haus drohte der Klassiker: Peter hielt es für wertvoller, Sarah für überschätzt — je nachdem, wer auszahlen und wer ausgezahlt werden würde. Statt zwei Parteigutachten beauftragen sie gemeinsam einen Sachverständigen, dessen Ergebnis beide vorab als verbindlich akzeptierten.",
          "Der Gutachter kam auf einen Wert, der zwischen beiden Erwartungen lag. Weil das Verfahren fair war, akzeptierten es beide ohne Diskussion. „Das hat uns nicht nur €3.000 für ein zweites Gutachten gespart“, sagt Peter, „sondern etwa ein Jahr Streit darüber, welches Gutachten das richtige ist.“",
        ],
      },
      {
        kicker: "Kapitel 4 · Die Überraschung",
        title: "€20.000, die niemand auf dem Zettel hatte",
        paragraphs: [
          "In Monat fünf holte der Mediator einen Steuerberater dazu — auf gemeinsame Rechnung. Der rechnete verschiedene Aufteilungsvarianten durch und fand eine Struktur für Hausverkauf und Vermögensübertragung, die rund €20.000 Steuern sparte. Geld, das in einem streitigen Verfahren schlicht liegen geblieben wäre, weil dort niemand gemeinsam optimiert.",
          "Am Ende von acht Monaten erhielt jeder €475.000 — transparent hergeleitet, steuerlich sauber, von beiden verstanden. Peter und Sarah gingen nach der letzten Sitzung zusammen essen. Im selben Restaurant, in dem Sarah das Besteck abgelegt hatte.",
        ],
        quote: {
          text: "Die Mediation hat sich nicht nur bezahlt gemacht. Sie hat uns netto reicher gemacht als jedes Urteil es gekonnt hätte.",
          author: "Peter",
        },
      },
    ],

    randnotizen: [
      {
        norm: "§ 1378 BGB",
        text: "Der Zugewinnausgleich ist reine Mathematik. Wer in der Ehe mehr hinzugewonnen hat, gibt die Hälfte des Überschusses ab. Wer die Steuererklärungen gemacht oder den Wein ausgesucht hat, spielt dabei keine Rolle.",
      },
      {
        norm: "§ 180 ZVG",
        text: "Können sich Eheleute über ein gemeinsames Haus nicht einigen, kann jeder von beiden die Teilungsversteigerung beantragen. Das Gericht teilt dann nicht „gerecht“, es versteigert an den Meistbietenden, nicht selten unter Wert. Gerecht ist daran nur, dass beide gleich viel verlieren.",
      },
    ],

    twists: [
      {
        gericht:
          "Der Weinkeller wird von einem Gutachter bewertet und als Rechenposten in den Zugewinn gesteckt.",
        einigung:
          "Die 140 Flaschen werden gewählt wie Mannschaften im Schulsport: abwechselnd, Sarah zieht zuerst. Die eine Magnum, um die beide gekämpft haben, wurde am Tag der Unterschrift geöffnet. Gemeinsam.",
      },
      {
        gericht:
          "Zwei Gutachten, ein Gegengutachten und die Frage, welches davon das Gericht für richtig hält.",
        einigung:
          "Ein einziger Gutachter, gemeinsam ausgesucht und gemeinsam bezahlt. Allein das hat mehr gespart, als die ganze Mediation gekostet hat.",
      },
      {
        gericht:
          "Die steuerlichen Folgen der Aufteilung sind nicht Sache des Familiengerichts.",
        einigung:
          "Ein Steuerberater rechnete am Tisch mit und fand die €20.000, die niemand auf dem Zettel hatte. Peter nennt sie „das einzige Geld, das wir in zwanzig Jahren gespart haben, ohne es zu wollen“.",
      },
    ],

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

  "trennung-nach-langer-ehe": {
    slug: "trennung-nach-langer-ehe",
    eyebrow: "Fallbeispiel",
    title: "Rolf & Helga",
    titleHighlight: "Nach 38 Jahren Ehe",
    intro:
      "38 Jahre verheiratet, die Kinder aus dem Haus, die Silberhochzeit lange gefeiert. Und dann die Frage, die im Alter am meisten Angst macht: Reicht das Geld, wenn wir es halbieren? Sechs Monate, ein Taschenrechner und ein Tafelservice für zwölf Personen später lautete die Antwort: ja.",

    situationTitle: '"Im Alter noch Streit?"',
    situationIntro:
      "Lange Ehen trennen sich selten laut. Sie trennen sich leise am Esstisch, mit einer Frage im Raum: Wovon lebe ich, wenn ich allein bin? Für Helga war das keine Rechenaufgabe, sondern ein Abgrund.",

    storyIntro:
      "38 Jahre Ehe enden nicht mit einem Knall, sondern mit einer leisen Erkenntnis — und mit der Frage, wie zwei Menschen um die 60 getrennt weiterleben, ohne dass einer von beiden im Alter in Not gerät.",
    chapters: [
      {
        kicker: "Kapitel 1 · Das leere Nest",
        title: "Als die Kinder aus dem Haus waren",
        paragraphs: [
          "Solange die drei Kinder da waren, hatte das gemeinsame Leben eine Struktur. Als das jüngste auszog, saßen Rolf und Helga zum ersten Mal seit Jahrzehnten allein am Frühstückstisch — und stellten fest, dass sie sich wenig zu sagen hatten. Es dauerte fast zwei Jahre, bis Helga aussprach, was beide dachten: „Wir müssen nicht so weitermachen, nur weil es alle erwarten.“",
          "Rolf nickte damals nur. Der eigentliche Schock kam später, als Helga zum ersten Mal ihre Rentenauskunft auf den Tisch legte: rund €800 im Monat würden ihr zustehen. 25 Jahre Familienarbeit tauchten in dieser Zahl schlicht nicht auf. Rolfs Beamtenpension dagegen: €3.500. „Da wurde mir klar“, sagt Rolf, „dass unsere Trennung vor allem eine Gerechtigkeitsfrage ist.“",
        ],
        quote: {
          text: "Ich hatte keine Angst vor dem Alleinsein. Ich hatte Angst vor €800 im Monat.",
          author: "Helga",
        },
      },
      {
        kicker: "Kapitel 2 · Die falschen Ratgeber",
        title: "„Hol dir einen Anwalt, sonst zieht er dich über den Tisch“",
        paragraphs: [
          "Helgas Freundinnen meinten es gut: Bloß nichts unterschreiben, erst mal klagen, Beamtenpensionen seien kompliziert, da müsse man kämpfen. Rolf bekam vom Kollegen den gegenteiligen Rat: bloß nicht zu viel zugestehen. Innerhalb weniger Wochen redeten zwei Menschen, die 38 Jahre lang jede Entscheidung gemeinsam getroffen hatten, nur noch über Dritte übereinander.",
          "Es war ausgerechnet die älteste Tochter, die intervenierte: „Ihr wart euer Leben lang vernünftig. Warum hört ihr jetzt damit auf?“ Sie hatte von Mediation gelesen und vereinbarte für beide das Erstgespräch — halb gegen ihren Willen, wie beide heute zugeben.",
        ],
      },
      {
        kicker: "Kapitel 3 · Rechnen statt fürchten",
        title: "Der Versorgungsausgleich wird verständlich",
        paragraphs: [
          "Die größte Last in den ersten Sitzungen war nicht Wut — es war Unwissen. Was passiert mit einer Beamtenpension bei Scheidung? Was bedeutet Versorgungsausgleich konkret in Euro? Der Mediator zog einen Spezialisten für Beamtenversorgung hinzu und ließ alle Szenarien durchrechnen: Helgas Ansprüche nach Ausgleich, mit und ohne Weiterarbeit, mit verschiedenen Hauslösungen.",
          "Aus dem diffusen „Wie soll ich leben?“ wurde eine konkrete Zahl: rund €1.200 im Monat für Helga, dazu das abbezahlte Haus, während Rolf mit seiner verbleibenden Pension und den geteilten Ersparnissen eine Wohnung finanzieren konnte. Sogar die unangenehmen Fragen — was gilt, wenn einer früh stirbt? — wurden ausdrücklich durchgespielt statt verdrängt.",
        ],
        quote: {
          text: "Vor der Mediation war meine Zukunft ein schwarzes Loch. Danach war sie eine Tabelle, die ich verstehe.",
          author: "Helga",
        },
      },
      {
        kicker: "Kapitel 4 · Frieden statt Verfahren",
        title: "Sechs Monate, eine Unterschrift",
        paragraphs: [
          "Nach sechs Monaten unterschrieben beide eine Vereinbarung, die ein Gericht in dieser Form nie angeordnet hätte: das Haus für Helga als Alterssicherung, ein fairer Versorgungsausgleich, klare Regeln für alle Was-wäre-wenn-Fälle. Kosten: €800 statt der €26.500, die zwei Anwälte und Gutachter mindestens gekostet hätten.",
          "Rolf und Helga sehen sich heute bei Familienfesten. Es ist nicht mehr die alte Vertrautheit — aber es ist auch keine Feindschaft. „Bei der Konfirmation unseres Enkels saßen wir am selben Tisch“, erzählt Rolf. „Die Alternative wäre gewesen, dass wir uns zu dem Zeitpunkt noch vor Gericht gegenübersitzen.“",
        ],
      },
    ],

    randnotizen: [
      {
        norm: "Versorgungsausgleichsgesetz",
        text: "Seit 2009 wird beim Versorgungsausgleich jedes Rentenanrecht einzeln geteilt: Pension, gesetzliche Rente, Betriebsrente. Das ist gerecht. Was das konkret im Monat bedeutet, verstehen ohne Rechenbeispiel allerdings selbst Juristen erst beim zweiten Kaffee.",
      },
      {
        norm: "§ 1565 BGB",
        text: "Auch nach 38 Jahren verlangt das Gesetz in der Regel ein Trennungsjahr, bevor geschieden wird. Rolf meinte dazu, auf das eine Jahr komme es jetzt auch nicht mehr an.",
      },
    ],

    twists: [
      {
        gericht:
          "Der Hausrat wird nach Billigkeit verteilt, im Streitfall Teller für Teller.",
        einigung:
          "Das Hochzeitsservice für zwölf Personen wird geteilt, jeder bekommt sechs Gedecke. Zu Weihnachten, wenn die Enkel kommen, wird zusammengelegt, und Rolf bringt seine sechs Teller mit.",
      },
      {
        gericht:
          "Ein Gericht kann ein Grundstück bewerten, aber keinen Garten teilen.",
        einigung:
          "Helga behält Haus und Garten, Rolf das Wohnmobil. Dazu kommt das verbriefte Recht, jeden Herbst die Äpfel von dem Baum zu holen, den er 1991 gepflanzt hat.",
      },
      {
        gericht:
          "Was passiert, wenn einer krank wird? Das beantwortet kein Urteil.",
        einigung:
          "Ein Absatz für später: Wird einer von beiden pflegebedürftig, hilft der andere den Kindern bei der Organisation. „Wir sind geschieden“, sagt Helga, „aber nicht fremd.“",
      },
    ],

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

  "trennung-gemeinsame-firma": {
    slug: "trennung-gemeinsame-firma",
    eyebrow: "Fallbeispiel",
    title: "Carla & Marco",
    titleHighlight: "Mit Unternehmen",
    intro:
      "Zwei Verträge: einer vor dem Standesamt, einer beim Notar. Marco wollte aus beiden raus. Carla war bereit, den ersten aufzulösen, aber nicht den zweiten, denn der zweite war ihr Lebenswerk. Fünf Mitarbeiter warteten auf eine Antwort.",

    situationTitle: '"Wir bauen eine Firma auf – dann Trennung"',
    situationIntro:
      "In der Kaffeeküche wurde schon gewettet, wer die Firma bekommt. Wenn Ehe und GmbH verflochten sind, trennt sich nie nur ein Paar. Es wackeln Gehälter, Kunden und die Frage, wer morgen die Rechnungen freigibt.",

    storyIntro:
      "Ein Ehepaar, eine GmbH, fünf Mitarbeiter — und die Frage, ob mit der Ehe auch das Lebenswerk enden muss.",
    chapters: [
      {
        kicker: "Kapitel 1 · Zwei Verträge",
        title: "Ehe und Gesellschaftsvertrag",
        paragraphs: [
          "Carla und Marco gründeten die Firma im dritten Ehejahr — sie mit dem Blick für Kunden und Zahlen, er mit der Technik. Zehn Jahre später machte die GmbH €800.000 Umsatz, beschäftigte fünf Leute und war das Thema, über das die beiden noch problemlos reden konnten. Über alles andere längst nicht mehr.",
          "Als Marco an einem Freitagabend im Büro sagte, dass er raus wolle — aus der Ehe und aus der Firma —, war Carlas erste Reaktion keine Träne, sondern eine Frage: „Und was sagen wir Montag den Mitarbeitern?“ Genau darin lag das Problem: Zwei Verträge banden sie aneinander, und der gefährlichere war nicht der Ehevertrag.",
        ],
        quote: {
          text: "Eine Scheidung übersteht man. Aber wenn die Firma in den Strudel gerät, verlieren fünf Familien ihr Einkommen.",
          author: "Carla",
        },
      },
      {
        kicker: "Kapitel 2 · Der gefährliche Schwebezustand",
        title: "Gerüchte in der Kaffeeküche",
        paragraphs: [
          "Wochenlang passierte: nichts. Marco zog aus, kam aber weiter ins Büro. Die Stimmung zwischen den Gesellschafter-Eheleuten war für alle spürbar. Die erste Mitarbeiterin fragte vorsichtig, ob ihr Arbeitsplatz sicher sei. Ein Kunde erkundigte sich beiläufig, ob die Firma „umstrukturiert“ werde.",
          "Carla verstand: Ein Rosenkrieg mit Anwälten würde nicht nur Jahre dauern — er würde das Unternehmen in genau dieser Schwebe halten. Wer investiert in eine Firma, deren Gesellschafter sich verklagen? Ihr Steuerberater sprach die Empfehlung aus, die alles drehte: „Trennt die Verfahren. Die Ehe könnt ihr scheiden lassen. Die Firma braucht eine Mediation — jetzt.“",
        ],
      },
      {
        kicker: "Kapitel 3 · Der Preis der Fairness",
        title: "Was ist die Firma wert — und was ist sie Carla wert?",
        paragraphs: [
          "Die Mediation begann mit der härtesten Frage: der Bewertung. Ein gemeinsam beauftragter Wirtschaftsprüfer kam auf €500.000 Unternehmenswert bei €100.000 Schulden. Marcos hälftiger Anteil: €200.000. Geld, das die Firma nicht auf dem Konto hatte.",
          "Der Durchbruch war eine Struktur, die vor Gericht niemand hätte anordnen können: Carla übernimmt alle Anteile, zahlt Marco die Abfindung in Raten über drei Jahre — abgesichert, verzinst, aber so gestreckt, dass die Liquidität der GmbH nie gefährdet ist. Marco verzichtete auf einen Teil des Maximalwerts, dafür bekam er Planbarkeit statt eines jahrelangen Verfahrens mit ungewissem Ausgang.",
        ],
        quote: {
          text: "Ich hätte vor Gericht vielleicht mehr herausgeholt. In drei Jahren. Wenn die Firma dann noch etwas wert gewesen wäre.",
          author: "Marco",
        },
      },
      {
        kicker: "Kapitel 4 · Montagmorgen, 9 Uhr",
        title: "Die Botschaft an das Team",
        paragraphs: [
          "Sechs Monate nach Marcos Freitagabend-Satz standen beide gemeinsam vor der Belegschaft. Die Botschaft war kurz: Marco verlässt das Unternehmen, Carla führt es allein weiter, alle Arbeitsplätze bleiben. Keine Floskeln, keine Gerüchte mehr — Klarheit.",
          "Heute läuft die GmbH unter Carlas alleiniger Führung, Marco hat mit seiner Abfindung ein neues Projekt gestartet. Die Scheidung selbst war danach fast eine Formalie: Die schwierigsten Vermögensfragen waren längst gelöst.",
        ],
      },
    ],

    randnotizen: [
      {
        norm: "GmbH-Gesetz",
        text: "Eine Scheidung beendet die Ehe, nicht die GmbH. Wer im Gesellschaftsvertrag nichts geregelt hat, sitzt nach der Scheidung weiter mit dem Ex in der Gesellschafterversammlung. Bei 50 zu 50 heißt das: Jede Abstimmung wird zur Paartherapie, nur ohne Therapeuten.",
      },
    ],

    twists: [
      {
        gericht:
          "Die Abfindung wird nach Gutachten festgesetzt und auf einen Schlag fällig, notfalls auf Kosten der Liquidität.",
        einigung:
          "€200.000 Abfindung, gestaffelt aus dem laufenden Geschäft, damit die Firma nicht ausblutet. Marco hat dadurch ein ganz eigenes Interesse, dass Carla Erfolg hat.",
      },
      {
        gericht: "Wer geht, geht. Das Wissen in seinem Kopf geht mit.",
        einigung:
          "Marco bleibt zwölf Monate als externer Berater für den Code, den außer ihm niemand versteht, und rechnet nach Stunden ab. Im Team heißt das intern „das Umgangsrecht fürs Backend“.",
      },
      {
        gericht:
          "Firmenwagen, Laptop, Büroinventar: alles Rechenposten in der Bilanz.",
        einigung:
          "Um den Tischkicker gab es eine ernsthafte Debatte. Er bleibt in der Firma, und Marco darf zur Weihnachtsfeier kommen und eine Revanche verlangen.",
      },
    ],

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

  "internationale-trennung": {
    slug: "internationale-trennung",
    eyebrow: "Fallbeispiel",
    title: "Jens & Katarina",
    titleHighlight: "Internationale Trennung",
    intro:
      "Katarina hatte Heimweh nach den Bergen, nach ihrer Mutter, nach einer Sprache, in der sie nicht jedes Wort übersetzen muss. Nur ist Lucas fünf und hat einen Vater in Deutschland. Ein voreilig gepackter Koffer, und aus einer Mutter wäre nach internationalem Recht eine Kindesentführerin geworden.",

    situationTitle: '"Ich will nach Hause – mit Kind!"',
    situationIntro:
      "Zwei Länder, zwei Rechtsordnungen und zwei Anwälte, die schon über die Zuständigkeit stritten, bevor es überhaupt um Lucas ging. Internationale Trennungen sind ein Minenfeld, und Kinder laufen als Erste darüber.",

    storyIntro:
      "Zwei Länder, zwei Rechtssysteme, ein fünfjähriger Junge — und zwei Eltern, die um Haaresbreite in ein internationales Verfahren geraten wären.",
    chapters: [
      {
        kicker: "Kapitel 1 · Heimweh",
        title: "„Ich gehöre nicht hierher“",
        paragraphs: [
          "Katarina war für die Liebe nach Deutschland gezogen. Acht Jahre später, die Ehe am Ende, saß sie abends oft mit dem Handy in der Küche und scrollte durch Fotos ihrer Schwester aus Zürich. Als die Trennung feststand, war für sie klar: Sie will zurück in die Schweiz. Mit Lucas.",
          "Für Jens war derselbe Satz eine Kampfansage. Lucas war fünf, sein Kindergarten, seine Großeltern väterlicherseits, sein ganzes kleines Leben war hier. „Ich habe nachts gerechnet: Zürich–Frankfurt, viereinhalb Stunden Zug. Das ist kein Papa mehr, das ist ein Besucher.“",
        ],
        quote: {
          text: "Ich wollte Katarina nicht in Deutschland festhalten. Aber ich wollte auch nicht der Vater werden, den man zweimal im Jahr sieht.",
          author: "Jens",
        },
      },
      {
        kicker: "Kapitel 2 · Der Abgrund",
        title: "Zwei Anwälte, zwei Länder, ein Wort: Haager Konvention",
        paragraphs: [
          "Jens' erster Anwaltstermin endete mit einer Warnung: Sollte Katarina mit Lucas ohne Zustimmung ausreisen, wäre das internationale Kindesentführung — Haager Konvention, Rückführungsverfahren, Gerichte in zwei Ländern. Katarinas Schweizer Anwältin sagte ihr sinngemäß dasselbe, nur aus der Gegenrichtung.",
          "Beide erzählen heute, dass genau diese Gespräche der Wendepunkt waren — aus Schreck. Ein Verfahren über zwei Rechtsordnungen hinweg: über €60.000, Jahre Dauer, Ausgang offen, und in der Mitte ein Fünfjähriger. Katarina schlug die Mediation vor. Jens stimmte zu, „weil jede Alternative schlimmer war“.",
        ],
      },
      {
        kicker: "Kapitel 3 · Regeln zuerst",
        title: "Was rechtlich überhaupt geht",
        paragraphs: [
          "Die erste Phase der Mediation bestand aus Aufklärung: Welches Recht gilt für Sorgerecht, Unterhalt, Vermögen? Was ist ohne Zustimmung des anderen schlicht illegal? Erst als beide dieselben Spielregeln kannten, konnte über Interessen geredet werden — Katarinas Bedürfnis nach Heimat und Familie, Jens' Bedürfnis nach echter, regelmäßiger Vaterschaft, Lucas' Bedürfnis nach beidem.",
          "Die Lösung entstand in Schichten: Lucas zieht mit Katarina nach Zürich — aber erst zum Schuljahresbeginn, mit langem Abschied statt Hauruck. Jens bekommt garantierte Monatswochenenden, die Hälfte aller Ferien, tägliche Videotelefonate. Die Mehrkosten der Reisen trägt Katarina anteilig, weil der Umzug ihr Wunsch war — ihr eigener Vorschlag.",
        ],
        quote: {
          text: "Der Mediator hat nie gefragt, wer gewinnt. Er hat gefragt, wie Lucas' Woche aussehen soll.",
          author: "Katarina",
        },
      },
      {
        kicker: "Kapitel 4 · Ein Abkommen für zwei Länder",
        title: "Rechtsgültig in Deutschland und der Schweiz",
        paragraphs: [
          "Die letzten Monate galten der Absicherung: Die Vereinbarung wurde juristisch so gefasst, dass sie in beiden Ländern anerkannt wird — Unterhalt in der richtigen Währung geregelt, das deutsche Haus und die Schweizer Ersparnisse sauber aufgeteilt, Zuständigkeiten für künftige Änderungen definiert.",
          "Lucas geht heute in Zürich zur Schule und verbringt jeden Sommer wochenlang bei seinem Vater. Als er in der Schule gefragt wurde, wo er wohnt, soll er geantwortet haben: „In Zürich und bei Papa.“ Für Jens ist dieser Satz das Ergebnis, das kein Gericht hätte anordnen können.",
        ],
      },
    ],

    randnotizen: [
      {
        norm: "Haager Kindesentführungsübereinkommen",
        text: "Wer bei gemeinsamem Sorgerecht ohne Zustimmung des anderen mit dem Kind ins Ausland zieht, kann eine „widerrechtliche Verbringung“ begehen, auch wenn das Ziel nur die Oma ist. Deutschland und die Schweiz sind beide Vertragsstaaten. Am Ende steht dann ein Rückführungsverfahren, das schnell gehen soll und trotzdem niemanden glücklich macht.",
      },
    ],

    twists: [
      {
        gericht:
          "Ein Gericht entscheidet, wo Lucas lebt. Und damit auch, wer verliert.",
        einigung:
          "Lucas zieht mit Katarina in die Schweiz. Dafür verbringt er die Hälfte der Schulferien in Deutschland, und Jens kommt zwei Wochenenden im Monat. Die Bahnkosten teilen sich beide, weil beide wollen, dass er fährt.",
      },
      {
        gericht: "Gutenachtgeschichten sind kein Regelungsgegenstand.",
        einigung:
          "Dienstags und donnerstags um 19 Uhr liest Papa per Video vor, immer kapitelweise, damit Lucas wissen will, wie es weitergeht. Jens hat jedes Buch doppelt gekauft: eins für jedes Kinderzimmer.",
      },
      {
        gericht: "Sprache und Alltag stehen in keinem Aufenthaltsbeschluss.",
        einigung:
          "Lucas wächst mit beidem auf: Schule in der Schweiz, Wochenenden mit Papa. Ob man „Velo“ oder „Fahrrad“ sagt, darf er laut Vereinbarung selbst entscheiden.",
      },
    ],

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

  "erbstreit-haus-geschwister": {
    slug: "erbstreit-haus-geschwister",
    eyebrow: "Erbschafts-Fallbeispiel",
    title: "Anna & Klaus",
    titleHighlight: "Geschwister-Streit um das Haus",
    intro:
      "Die Beerdigung war vorbei, Papas Jacke hing noch an der Garderobe, und zwischen Anna und Klaus stand ein Haus im Wert von €300.000. Anna wollte bleiben, Klaus wollte sein Geld. Drei Monate später hatten sie beides geschafft, und dazu ein jährliches Kirschen-Grillfest.",

    situationTitle: "„Das ist auch mein Elternhaus“",
    situationIntro:
      "Erbstreit ist selten ein Streit ums Geld. Es ist ein Streit darüber, wer Papa näher war, wer öfter da war und wer sich jetzt wie der Erwachsene benimmt.",

    storyIntro:
      "Ein Elternhaus, zwei Geschwister, ein halbes Leben an unausgesprochenen Vorwürfen — und drei Monate, die entschieden haben, ob Anna und Klaus Familie bleiben.",
    chapters: [
      {
        kicker: "Kapitel 1 · Nach der Beerdigung",
        title: "Das Haus, in dem noch Papas Jacke hängt",
        paragraphs: [
          "Zwei Wochen nach der Beerdigung des Vaters trafen sich Anna und Klaus im Elternhaus, um „die Dinge zu regeln“. Anna ging durch die Zimmer, in denen noch alles so war wie immer — die Jacke des Vaters an der Garderobe, Mamas Handschrift auf den Gewürzgläsern. Klaus kam mit einem Aktenordner und einer Excel-Tabelle.",
          "Es war genau diese Szene, an der alles zerbrach. Anna sah einen Bruder, der das Elternhaus „abwickeln“ wollte. Klaus sah eine Schwester, die so tat, als gehöre ihr allein, was beiden gehörte. Der Streit, der an diesem Nachmittag begann, hatte in Wahrheit dreißig Jahre Vorgeschichte: Anna, die immer da war. Klaus, der früh weggezogen und in ihren Augen „immer nur zu Besuch“ gekommen war.",
        ],
        quote: {
          text: "Für Klaus war das Haus eine Zahl: 300.000. Für mich war es der letzte Ort, an dem meine Eltern noch existierten.",
          author: "Anna",
        },
      },
      {
        kicker: "Kapitel 2 · Verhärtung",
        title: "„Dann sehen wir uns eben vor Gericht“",
        paragraphs: [
          "Die Erbengemeinschaft — je 50 Prozent — zwang die beiden aneinander. Klaus wollte seinen Anteil: €150.000, nachvollziehbar und rechtlich einwandfrei. Anna konnte diese Summe nicht aufbringen und hörte in jeder Zahlungsforderung nur eines: Er reißt mir das Elternhaus weg. Nach einem eskalierten Telefonat kam Klaus' Drohung mit der Teilungsversteigerung — dem gerichtlichen Zwangsverkauf.",
          "Es war Annas Ehemann, der die Notbremse zog. Er hatte ausgerechnet, was eine Versteigerung bedeuten würde: Erlös deutlich unter Marktwert, dazu Anwälte, Gutachter, Gerichtskosten — und ein endgültig zerstörtes Verhältnis. Sein Vorschlag: ein Mediationsversuch. Drei Sitzungen. Wenn es nichts bringt, bleibt der Rechtsweg ja offen.",
        ],
      },
      {
        kicker: "Kapitel 3 · Die Wende",
        title: "Als zum ersten Mal jemand zuhörte",
        paragraphs: [
          "In der ersten gemeinsamen Sitzung ließ die Mediatorin beide erzählen — nicht über das Haus, sondern über die Eltern. Klaus sprach davon, wie er sich jahrelang als der Sohn gefühlt hatte, der „nur Geld überweisen durfte, aber nie gefragt wurde“. Anna erzählte von den Pflegejahren, von durchwachten Nächten, von der Wut, dass Klaus' Leben einfach weiterlief.",
          "Zum ersten Mal hörten beide die Geschichte des anderen vollständig. Der Streit um €150.000 entpuppte sich als Streit um Anerkennung. Und Anerkennung, stellte sich heraus, konnte man regeln: Der gemeinsame Gutachter bestätigte den Hauswert, Annas Pflegeleistung wurde bei der Aufteilung ausdrücklich gewürdigt, und Klaus verzichtete auf sofortige Zahlung zugunsten eines Ratenplans, den Annas Familie tragen konnte.",
        ],
        quote: {
          text: "Ich wollte nie das Haus. Ich wollte, dass einmal jemand sagt: Du gehörst auch dazu.",
          author: "Klaus",
        },
      },
      {
        kicker: "Kapitel 4 · Drei Monate später",
        title: "Alleineigentümerin und wieder Schwester",
        paragraphs: [
          "Nach drei Monaten war die Vereinbarung unterschrieben: Anna wird Alleineigentümerin, Klaus scheidet aus der Erbengemeinschaft aus und erhält seine €150.000 in planbaren Raten. Kosten der Mediation: €800 — gegenüber gut €20.000, die der Rechtsweg gekostet hätte.",
          "An Weihnachten saß Klaus mit seiner Familie wieder am Tisch im Elternhaus. Es war Annas Einladung. „Papa hätte uns beide für verrückt erklärt“, sagte sie beim Essen, „dass wir uns wegen seines Hauses fast verklagt hätten.“",
        ],
      },
    ],

    randnotizen: [
      {
        norm: "§ 2042 BGB · § 180 ZVG",
        text: "Jeder Miterbe kann jederzeit die Auseinandersetzung verlangen und das Elternhaus notfalls zur Teilungsversteigerung bringen, auch gegen den Willen der Schwester. Dann ersteigert es womöglich der Nachbar, der sich seit zwanzig Jahren über den Kirschbaum beschwert.",
      },
      {
        norm: "§ 94 BGB",
        text: "Kirschen am Baum sind wesentlicher Bestandteil des Grundstücks. Sie gehören also dem, dem der Garten gehört. Juristisch hätte Klaus mit dem Haus auch jede einzelne Kirsche verloren.",
      },
    ],

    twists: [
      {
        gericht:
          "Teilungsversteigerung: Wer am meisten bietet, bekommt das Haus, der Erlös wird halbiert.",
        einigung:
          "Anna behält das Haus und zahlt Klaus in Raten aus, so wie sie es als Krankenpflegerin stemmen kann, und nicht so, wie es eine Bank gern hätte.",
      },
      {
        gericht:
          "Die Werkstatt im Keller gehört zum Haus. Wer das Haus hat, hat auch die Hobelbank.",
        einigung:
          "Klaus bekommt Papas Werkzeug und die alte Hobelbank. Anna hätte damit nichts anfangen können. Klaus hat seitdem zwei Vogelhäuschen gebaut, und eins davon hängt im Garten seiner Schwester.",
      },
      {
        gericht: "Die Kirschen gehören, wem der Baum gehört.",
        einigung:
          "Klaus darf jeden Juni ernten. Seitdem gibt es jedes Jahr ein Kirschen-Grillfest im Garten. Anna besorgt die Würstchen, Klaus bringt die Leiter mit.",
      },
    ],

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

  "streit-ums-testament": {
    slug: "streit-ums-testament",
    eyebrow: "Erbschafts-Fallbeispiel",
    title: "Marie & Sophie",
    titleHighlight: "Testament-Konflikt",
    intro:
      "Zehn Minuten im Nachlassgericht, und eine Schwesternbeziehung lag in Trümmern: €500.000 für Sophie, €50.000 für Marie. Auf dem Parkplatz fiel das Wort „gefälscht“. Drei Monate später hing bei Marie ein Brief der Mutter an der Wand, und gefunden wurde er nur, weil die Schwestern wieder miteinander redeten.",

    situationTitle: "„Warum hat Mama das getan?“",
    situationIntro:
      "Ein Testament ohne Erklärung ist wie ein Urteil ohne Begründung. Wer weniger bekommt, liest darin keine Zahlen, sondern eine Liebeserklärung an die andere.",

    storyIntro:
      "Ein Testament, das wie ein Urteil klang: €500.000 für die eine Tochter, €50.000 für die andere. Was wie Bevorzugung aussah, hatte eine Geschichte — die erst die Mediation ans Licht brachte.",
    chapters: [
      {
        kicker: "Kapitel 1 · Die Testamentseröffnung",
        title: "Zehn Minuten, die eine Schwesternbeziehung sprengten",
        paragraphs: [
          "Marie saß im Nachlassgericht und wartete darauf, dass sich der Verlust der Mutter wenigstens geordnet anfühlen würde. Dann las der Rechtspfleger vor: Sophie erbt das Haus und das Vermögen — zusammen rund €500.000. Marie: €50.000. Kein erklärender Brief. Kein persönliches Wort. Nur Paragrafen.",
          "Marie beschreibt den Moment als doppelten Tod: „Meine Mutter war gestorben. Und dann starb auch noch das Bild, das ich von unserer Beziehung hatte.“ Auf dem Parkplatz vor dem Gericht sprach sie den Satz aus, den sie heute bereut: „Das Testament ist gefälscht, oder du hast sie beeinflusst. Ich sehe dich vor Gericht.“",
        ],
        quote: {
          text: "Ich habe nicht um Geld getrauert. Ich habe um die Antwort auf eine Frage getrauert, die ich Mama nicht mehr stellen konnte: Warum?",
          author: "Marie",
        },
      },
      {
        kicker: "Kapitel 2 · Der stille Vorwurf",
        title: "Was Marie nicht wusste",
        paragraphs: [
          "Sophie schwieg in den Wochen danach — aus Erschöpfung, wie sie später erklärte. Was Marie nicht wusste: Sophie hatte die letzten zwei Jahre die Pflege der Mutter organisiert und größtenteils bezahlt. €200.000 hatten Pflegeheim und Betreuung gekostet, dazu kamen €50.000 alte Schulden der Mutter, für die Sophie gebürgt hatte. Das „große Erbe“ war zur Hälfte bereits ausgegeben oder verpfändet.",
          "Die Mutter hatte das Testament genau deshalb so gefasst — und niemandem davon erzählt, am wenigsten Marie, die sie schonen wollte. Ein Anwaltsprozess über die Testierfähigkeit hätte all das in Gutachten und Schriftsätzen zerrieben. Stattdessen schlug Sophies eigene Anwältin — bemerkenswert genug — eine Mediation vor: „Ihr habt kein Rechtsproblem. Ihr habt ein Informationsproblem.“",
        ],
      },
      {
        kicker: "Kapitel 3 · Die Zahlen auf dem Tisch",
        title: "Kontoauszüge statt Verdächtigungen",
        paragraphs: [
          "Die erste Mediationssitzung bestand fast nur aus Papier: Pflegeheimrechnungen, Kontoauszüge, der Bürgschaftsvertrag. Marie sah zum ersten Mal, was die letzten zwei Jahre wirklich gekostet hatten — an Geld, aber auch an Sophies Kraft. Sophie wiederum verstand, dass Maries Wut nie Gier gewesen war, sondern der Schmerz, sich als ungeliebte Tochter zu fühlen.",
          "Auf dieser Grundlage wurde neu gerechnet: Nach Abzug der realen Lasten war das Erbe deutlich kleiner, als das Testament suggerierte. Die Schwestern einigten sich darauf, Maries Anteil auf €75.000 zu erhöhen — nicht weil ein Gericht es erzwungen hätte, sondern weil beide es nach Kenntnis aller Zahlen für fair hielten.",
        ],
        quote: {
          text: "Drei Jahre Prozess hätten mir vielleicht mehr Geld gebracht. Aber sie hätten mir nie erklärt, warum Mama es so entschieden hat.",
          author: "Marie",
        },
      },
      {
        kicker: "Kapitel 4 · Was bleibt",
        title: "Ein Karton mit Briefen",
        paragraphs: [
          "Beim Ausräumen des Hauses, Wochen nach der Einigung, fand Sophie einen Karton mit Briefen der Mutter — darunter einer an Marie, nie abgeschickt, geschrieben in den letzten Monaten. Er erklärte nichts Juristisches. Er sagte nur, dass sie stolz auf ihre „kleine Künstlerin“ sei und hoffe, dass die Schwestern aufeinander aufpassen.",
          "Marie hat den Brief gerahmt. Die €25.000 Unterschied zur Testamentssumme, sagt sie, hätte kein Gericht der Welt mit diesem Brief aufwiegen können — und ohne die Mediation hätte Sophie ihn ihr womöglich nie gegeben.",
        ],
      },
    ],

    randnotizen: [
      {
        norm: "§ 2303 BGB",
        text: "Kinder kann man im Testament knapp halten, aber nicht ganz übergehen: Der Pflichtteil beträgt die Hälfte des gesetzlichen Erbteils. Gerechnet wird allerdings mit dem, was nach Abzug der Schulden übrig bleibt. Wer nur die Zahl im Testament liest, rechnet mit dem falschen Nachlass.",
      },
      {
        norm: "Testierfähigkeit",
        text: "„Das hat sie nicht freiwillig geschrieben“ ist schnell gesagt und schwer bewiesen. Wer behauptet, die Erblasserin sei testierunfähig gewesen, muss es nachweisen, meist mit psychiatrischen Gutachten über eine Verstorbene. Selten gewinnt dabei jemand. Verlieren tut dabei fast immer die Familie.",
      },
    ],

    twists: [
      {
        gericht:
          "Ein Gericht prüft, ob das Testament wirksam ist. Warum die Mutter so entschieden hat, steht in keinem Urteil.",
        einigung:
          "Die erste Sitzung bestand aus Pflegeheimrechnungen. Marie erfuhr, was ihre Schwester zwei Jahre lang getragen hatte, und Sophie verstand, dass Maries Wut nie Gier gewesen war.",
      },
      {
        gericht:
          "Marie bekommt, was ihr rechtlich zusteht. Keinen Cent mehr, keinen weniger.",
        einigung:
          "Sophie erhöht freiwillig auf €75.000. Kein Paragraf verlangt das. Es war ihre Art zu sagen: Du warst Mama genauso wichtig.",
      },
      {
        gericht:
          "Persönliche Gegenstände werden als Nachlass aufgelistet und bewertet.",
        einigung:
          "Beim gemeinsamen Ausräumen fand Sophie den Karton mit Briefen. Der an Marie hängt heute gerahmt in ihrem Atelier. Kein Gericht der Welt hätte ihn ihr zugesprochen.",
      },
    ],

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

  "unternehmen-geerbt": {
    slug: "unternehmen-geerbt",
    eyebrow: "Erbschafts-Fallbeispiel",
    title: "Familie Weber",
    titleHighlight: "Unternehmen erben – Betrieb retten oder verkaufen?",
    intro:
      "Dienstag, 6:40 Uhr, der Anruf aus dem Krankenhaus. Der Vater hatte seit 1987 alles im Kopf, nur keinen Nachfolgeplan. Plötzlich gehörte der Betrieb drei Geschwistern: Thomas arbeitet dort, Lisa braucht Geld für ihren Hausbau, Martin will vor allem Ruhe. Und 20 Mitarbeiter fragten: Was jetzt?",

    situationTitle: "„Papa hätte gewusst, was zu tun ist“",
    situationIntro:
      "In einer Erbengemeinschaft muss man sich einigen. Bei einem Betrieb, der jeden Morgen Material bestellen und am Monatsende Löhne zahlen muss, ist „Wir einigen uns später“ keine Option.",

    storyIntro:
      "Ein Herzinfarkt, kein Nachfolgeplan, drei Erben mit drei Lebensentwürfen — und 20 Mitarbeiter, deren Zukunft an einer Familieneinigung hing.",
    chapters: [
      {
        kicker: "Kapitel 1 · Der Anruf",
        title: "Dienstag, 6:40 Uhr",
        paragraphs: [
          "Thomas Weber stand in der Werkhalle, als seine Mutter anrief. Der Vater war in der Nacht gestorben — Herzinfarkt, 63 Jahre alt, kein Testament, kein Nachfolgeplan. Um 7 Uhr kamen die ersten Mitarbeiter. Thomas begrüßte jeden einzelnen per Handschlag, wie es sein Vater immer getan hatte, und sagte erst einmal nichts.",
          "Der Metallbau-Betrieb war das Lebenswerk des Vaters: €3,5 Millionen Umsatz, 20 Beschäftigte, ein Name, der in der Region etwas galt. Und jetzt, über Nacht, gehörte er zu je einem Drittel drei Geschwistern, von denen nur eines je in der Werkhalle gestanden hatte.",
        ],
        quote: {
          text: "Ich habe an dem Morgen zwei Dinge verloren: meinen Vater und die Gewissheit, dass es den Betrieb nächstes Jahr noch gibt.",
          author: "Thomas",
        },
      },
      {
        kicker: "Kapitel 2 · Drei Geschwister, drei Wahrheiten",
        title: "Das Zerwürfnis am Küchentisch",
        paragraphs: [
          "Die erste Familienrunde nach der Beerdigung eskalierte nach zwanzig Minuten. Lisa, Lehrerin in München, brauchte ihren Anteil für die Baufinanzierung. Martin, gerade in Elternzeit, wollte „einfach nur eine faire, schnelle Lösung“. Und Thomas rechnete vor, dass der Betrieb €333.000 pro Geschwister schlicht nicht auszahlen konnte, ohne sich zu strangulieren.",
          "Der Satz, der das Tischtuch zerschnitt, kam von Lisa: „Dann muss eben verkauft werden.“ Für Thomas war das Verrat am Vater. Für Lisa war Thomas' Anspruch auf den Betrieb Selbstbedienung. Beide hatten, aus ihrer Sicht, recht — und genau das machte es so gefährlich. Ein Nachlassstreit vor Gericht hätte den Verkauf sogar erzwingen können.",
        ],
      },
      {
        kicker: "Kapitel 3 · Die Rechnung mit der Wahrheit",
        title: "Was ist der Betrieb wirklich wert?",
        paragraphs: [
          "Die Mediation begann mit einem unabhängigen Gutachter — nicht dem Steuerberater der Firma, dem Lisa misstraute, sondern einem von allen dreien gemeinsam gewählten Sachverständigen. Sein Ergebnis: €1,2 Millionen Unternehmenswert, €200.000 Schulden, netto eine Million. Aber auch: Der Betrieb konnte maximal €150.000 kurzfristig liquidieren, ohne Aufträge und Arbeitsplätze zu gefährden.",
          "Diese Zahl veränderte das Gespräch. Es ging nicht mehr um „Thomas gegen Lisa und Martin“, sondern um ein gemeinsames Problem: Wie bekommen zwei Erben ihr Geld, ohne die Quelle des Geldes zu zerstören? Die Lösung: Sofortzahlung aus den liquiden Mitteln, der Rest in grundbuchlich abgesicherten Raten über sieben Jahre, verzinst — plus eine Klausel, dass bei einem späteren Verkauf des Betriebs alle drei am Mehrerlös beteiligt würden.",
        ],
        quote: {
          text: "Als ich verstanden habe, dass Thomas nicht reicher wird als wir, sondern nur anders — da konnte ich unterschreiben.",
          author: "Lisa",
        },
      },
      {
        kicker: "Kapitel 4 · Die Werkhalle bleibt",
        title: "Vier Monate nach dem Anruf",
        paragraphs: [
          "Im vierten Monat unterschrieben alle drei die Auseinandersetzungsvereinbarung beim Notar. Thomas übernahm den Betrieb als Alleininhaber, Lisa konnte ihre Baufinanzierung stemmen, Martin hatte Planungssicherheit. Kein einziger Arbeitsplatz ging verloren.",
          "Am ersten Weihnachten ohne den Vater saß die Familie wieder zusammen — angespannt, aber zusammen. Auf dem Betriebsgelände hängt heute ein Foto des Vaters in der Werkhalle. Darunter hat Thomas ein kleines Schild anbringen lassen: „Gegründet 1987. Weitergeführt von seiner Familie.“ Alle drei Namen stehen darauf.",
        ],
      },
    ],

    randnotizen: [
      {
        norm: "§ 2038 BGB",
        text: "Den Nachlass verwalten die Erben gemeinschaftlich. Für einen Handwerksbetrieb heißt das im Ernstfall: Drei Geschwister müssen sich einig werden, wer den Auftrag für die neue Hallenheizung unterschreibt. Der Gesetzgeber hatte dabei eher einen Bausparvertrag im Kopf als eine Werkhalle mit 20 Leuten.",
      },
    ],

    twists: [
      {
        gericht:
          "Auseinandersetzung heißt im Zweifel: verkaufen und den Erlös durch drei teilen.",
        einigung:
          "Thomas übernimmt den Betrieb allein und zahlt seine Geschwister nach einem Plan aus, den der Betrieb verkraftet. Lisa zuerst, weil ihre Baufinanzierung drängt.",
      },
      {
        gericht: "Wer ausgezahlt ist, ist raus.",
        einigung:
          "Lisa und Martin bekommen ein Vorkaufsrecht, falls Thomas den Betrieb je verkaufen will. Mitreden wollten sie nicht. Sie wollten nur nicht eines Tages erfahren, dass Papas Firma einem Fremden gehört.",
      },
      {
        gericht: "Ein Schild in der Werkhalle hat keinen Streitwert.",
        einigung:
          "Unter dem Foto des Vaters stehen alle drei Namen: „Gegründet 1987. Weitergeführt von seiner Familie.“ Darauf hat Thomas bestanden, obwohl er den Betrieb heute allein führt.",
      },
    ],

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
      "23:47 Uhr, und der Bass kommt wieder durch den Boden. Oben steht die Tochter der Schneiders zum dritten Mal in dieser Woche im Schlafanzug in der Tür. Unten sitzt Herr Becker nach der Spätschicht und versteht nicht, warum schon wieder die Polizei klingelt.",

    situationTitle: "„Wir schlafen seit Monaten nicht mehr“",
    situationIntro:
      "Lärm ist der Klassiker unter den Nachbarschaftskonflikten, weil er nachts kommt, wenn man am wenigsten Geduld hat. Und weil jede Seite fest davon überzeugt ist, dass die andere rücksichtslos ist.",

    storyIntro:
      "Ein Mehrfamilienhaus, ein Kinderzimmer über einem Wohnzimmer mit guter Anlage — und zwei Parteien, die sich nach Monaten nur noch über die Polizei verständigten.",
    chapters: [
      {
        kicker: "Kapitel 1 · 23:47 Uhr",
        title: "Wieder wach",
        paragraphs: [
          "Es war die vierte Nacht in Folge. Der Bass aus der Wohnung unter dem Kinderzimmer war nicht ohrenbetäubend — er war schlimmer: ein dumpfes, regelmäßiges Wummern, das durch den Boden kroch. Die sechsjährige Tochter der Schneiders stand um kurz vor Mitternacht wieder im Schlafanzimmer der Eltern. „Es brummt schon wieder.“",
          "Herr Schneider war anfangs zweimal runtergegangen. Beim ersten Mal öffnete Herr Becker freundlich und drehte leiser. Beim zweiten Mal, Wochen später, blieb die Tür zu und die Musik an. Danach klingelten die Schneiders nicht mehr — sie riefen die Polizei. Dreimal in zwei Monaten.",
        ],
        quote: {
          text: "Irgendwann ging es mir nicht mehr um die Musik. Es ging darum, dass er uns offensichtlich egal waren.",
          author: "Herr Schneider",
        },
      },
      {
        kicker: "Kapitel 2 · Die andere Seite der Decke",
        title: "Beckers Wahrheit",
        paragraphs: [
          "Herr Becker, 29, arbeitete im Schichtdienst eines Logistikzentrums. Sein Feierabend begann, wenn andere schliefen. Die Musik war für ihn das Einzige, was vom Tag übrig blieb. Die Polizeieinsätze empfand er als Kriegserklärung: „Die hätten einfach reden können. Stattdessen stand zweimal im Monat eine Streife vor meiner Tür wie bei einem Kriminellen.“",
          "Was keiner der Beteiligten wusste: Beide Seiten hatten längst an Auszug gedacht. Und beide Seiten hielten sich für das Opfer. Die Hausverwaltung, von beiden mit Beschwerden bombardiert, schlug schließlich vor, was keiner von selbst getan hätte: eine Mediation, bevor Abmahnungen und Klagen das Wohnverhältnis endgültig vergifteten.",
        ],
      },
      {
        kicker: "Kapitel 3 · Am Tisch",
        title: "90 Minuten, die die Fronten auflösten",
        paragraphs: [
          "In der ersten Sitzung durfte jede Seite erzählen, ohne unterbrochen zu werden. Frau Schneider beschrieb die übermüdete Tochter am Frühstückstisch. Becker beschrieb den Schichtdienst und das Gefühl, im eigenen Zuhause kriminalisiert zu werden. Beide hörten zum ersten Mal Details, die alles veränderten: Die Schneiders wussten nichts vom Schichtdienst. Becker wusste nicht, dass über seinem Wohnzimmer ein Kind schlief.",
          "Die Lösung war fast banal — und genau deshalb tragfähig: feste Ruhezeiten ab 22 Uhr an Schultagen, dafür ausdrücklich tolerierte längere Abende am Wochenende mit Vorankündigung. Becker rückte seine Anlage von der gemeinsamen Wand weg und legte sich Kopfhörer für die Nachtstunden zu. Die Schneiders verpflichteten sich, künftig zu klingeln statt die Polizei zu rufen — und Becker, die Tür dann auch zu öffnen.",
        ],
        quote: {
          text: "Ich hätte nie gedacht, dass ich das mal sage: Wir grüßen uns wieder im Treppenhaus. Manchmal reden wir sogar.",
          author: "Herr Becker",
        },
      },
    ],

    randnotizen: [
      {
        norm: "„Zimmerlautstärke“",
        text: "Steht in keinem Gesetz und wird trotzdem in jedem Treppenhaus zitiert. Was als Zimmerlautstärke gilt, entscheiden im Streitfall Gerichte von Fall zu Fall, gern mit Messgerät. Die Ruhezeiten selbst stehen meist in der Hausordnung, im Mietvertrag oder im Landesrecht, nicht im BGB.",
      },
    ],

    twists: [
      {
        gericht:
          "Unterlassung: Ab 22 Uhr ist Ruhe, an jedem Tag der Woche, mit Ordnungsgeld bei jedem Verstoß.",
        einigung:
          "An Schultagen ab 22 Uhr Ruhe, am Wochenende darf es länger werden, mit Vorankündigung. Herr Becker kündigt seine Abende inzwischen im Hausflur an, mit Uhrzeit.",
      },
      {
        gericht: "Wo die Lautsprecher stehen, entscheidet kein Gericht.",
        einigung:
          "Die Anlage rückt einen Meter von der Wand weg. Die Schneiders haben beim Tragen geholfen. Es war das erste Mal, dass sie Herrn Beckers Wohnung von innen gesehen haben.",
      },
      {
        gericht:
          "Ob jemand klingelt oder die Polizei ruft, ist keine Rechtsfrage.",
        einigung:
          "Eine Klingelpflicht statt Notruf: Die Schneiders klingeln zuerst, und Herr Becker verpflichtet sich, dann auch aufzumachen. Seitdem gab es keinen einzigen Polizeieinsatz mehr.",
      },
    ],

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
      "Zehn Jahre gute Nachbarn, ausgeliehene Rasenmäher und Geburtstagsgrüße über die Hecke. Dann bauten die Hoffmanns an einem Wochenende einen Zaun, und die Krügers maßen nach: 40 Zentimeter. Danach kamen die Anwaltsbriefe, und gegrüßt wurde nicht mehr.",

    situationTitle: "„40 Zentimeter, und zehn Jahre sind vergessen“",
    situationIntro:
      "Um 40 Zentimeter Rasen streitet niemand wegen des Rasens. Man streitet darum, ob man übergangen wurde, und darum, wer am Ende als Lügner dasteht.",

    storyIntro:
      "Ein neuer Zaun, 40 Zentimeter Streitfläche und zwei Familien, die zehn Jahre lang gute Nachbarn waren — bis eine Grenzfrage zur Charakterfrage wurde.",
    chapters: [
      {
        kicker: "Kapitel 1 · Der neue Zaun",
        title: "Ein Wochenendprojekt mit Folgen",
        paragraphs: [
          "Die Hoffmanns hatten lange gespart: neue Terrasse, neuer Rasen, neuer Zaun. Am Samstagabend stand er — ordentlich, dunkelgrau, exakt entlang der Linie, die laut ihrem Bauplan die Grenze war. Am Sonntagmorgen klingelte Herr Krüger. Er hatte ein Maßband in der Hand.",
          "Nach Krügers Messung stand der Zaun etwa 40 Zentimeter auf Krüger'schem Grund — auf ganzer Länge, das summierte sich auf mehrere Quadratmeter. Die Hoffmanns verwiesen auf ihre Pläne, die Krügers auf ihre. Beide Dokumente stammten aus unterschiedlichen Jahren und widersprachen sich. Aus einem Messproblem wurde binnen Tagen ein Beziehungsproblem: Man grüßte nicht mehr.",
        ],
        quote: {
          text: "Zehn Jahre haben wir uns die Pakete angenommen und die Blumen gegossen. Und dann zerlegt uns ein Zaun.",
          author: "Frau Krüger",
        },
      },
      {
        kicker: "Kapitel 2 · Die Spirale",
        title: "Anwaltsbrief gegen Anwaltsbrief",
        paragraphs: [
          "Der erste Anwaltsbrief kam von den Krügers — förmlich, mit Fristsetzung zur „Beseitigung des Überbaus“. Die Hoffmanns, die sich keiner Schuld bewusst waren, empfanden ihn als Ungeheuerlichkeit und antworteten ebenfalls anwaltlich. Kostenpunkt bis dahin: einige hundert Euro. Absehbarer weiterer Weg: amtliche Neuvermessung, Gutachten, Klage — schnell fünfstellig, bei einem Streitwert von ein paar Quadratmetern Rasen.",
          "Es war der Anwalt der Hoffmanns, der trocken zusammenfasste: „Sie können für dieses Stück Land mehr bezahlen, als es wert ist — oder Sie setzen sich einmal mit einem Mediator zusammen.“ Beide Familien stimmten zu, jede überzeugt, der Mediator werde ihr recht geben.",
        ],
      },
      {
        kicker: "Kapitel 3 · Das Maßband und das Eigentliche",
        title: "Worum es wirklich ging",
        paragraphs: [
          "Die Mediation begann mit Fakten: Eine gemeinsam beauftragte Vermessung schaffte erstmals eine Grundlage, die beide akzeptierten. Das Ergebnis lag — wie so oft — dazwischen: Der Zaun stand tatsächlich auf Krüger'schem Grund, aber deutlich weniger als gemessen; ein Teil der Abweichung steckte in den alten Plänen selbst.",
          "Wichtiger war, was danach geschah. Frau Hoffmann sprach aus, was der eigentliche Stachel war: nicht die Zentimeter, sondern der Anwaltsbrief — „als wären wir Betrüger“. Herr Krüger wiederum hatte sich übergangen gefühlt, weil der Zaun ohne ein Wort der Absprache gebaut worden war. Die Einigung: Der Zaun bleibt stehen, die Krügers erhalten einen fairen Ausgleich für den Grundstreifen, notariell festgehalten. Und: Künftige Bauvorhaben an der Grenze werden vorher besprochen — bei einem Kaffee, nicht per Einschreiben.",
        ],
        quote: {
          text: "Am Ende ging es gar nicht um den Zaun — sondern darum, gehört zu werden.",
          author: "Familie Hoffmann",
        },
      },
    ],

    randnotizen: [
      {
        norm: "§ 921 BGB",
        text: "Steht ein Zaun auf der Grenze, vermutet das Gesetz, dass beide Nachbarn ihn gemeinsam benutzen dürfen. Wie hoch und wie dicht er sein darf, regeln vielfach die Nachbarrechtsgesetze der Länder. Was in einem Bundesland erlaubt ist, kann im nächsten schon zu hoch sein.",
      },
    ],

    twists: [
      {
        gericht:
          "Beseitigung: Der Zaun wird zurückversetzt, auf Kosten der Hoffmanns.",
        einigung:
          "Der Zaun bleibt stehen. Die Krügers bekommen einen Ausgleich für den Streifen, notariell festgehalten, und das ist für alle günstiger als Abriss und Neubau.",
      },
      {
        gericht: "Die Vermessung zahlt am Ende, wer verliert.",
        einigung:
          "Beide bestellen die Vermessung gemeinsam und teilen sich die Rechnung. Ergebnis: Ein Teil des Fehlers steckte schon in den alten Plänen. Schuld war am Ende ein Bauzeichner, der längst in Rente ist.",
      },
      {
        gericht:
          "Künftige Bauvorhaben bleiben ungeregelt, bis zum nächsten Prozess.",
        einigung:
          "Eine „Grenzklausel“: Wer an der Grenze baut, pflanzt oder bohrt, sagt es vorher. Erster Anwendungsfall: Die Hoffmanns fragten, ob sie am Zaun Tomaten ziehen dürfen. Die Krügers bekommen jetzt die Hälfte der Ernte.",
      },
    ],

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
      "Der erste Zettel war höflich, der zehnte nicht mehr. Monatelang redeten Herr Wagner und Frau Lehmann nur noch über ihre Windschutzscheiben miteinander. Gelöst hat den Streit am Ende ein Stellplatz, von dem keiner wusste, dass man ihn haben kann.",

    situationTitle: "„Ich komme nicht aus meiner eigenen Einfahrt“",
    situationIntro:
      "Eine enge Straße, zu wenig Platz und zwei Dienstpläne, die nicht zusammenpassen. Aus „Sie stehen schon wieder vor meiner Einfahrt“ wird schnell „Sie sind ein rücksichtsloser Mensch“.",

    storyIntro:
      "Eine enge Wohnstraße, zu wenige Parkplätze, eine blockierte Einfahrt — und zwei Menschen, die sich monatelang nur noch über Zettel an der Windschutzscheibe unterhielten.",
    chapters: [
      {
        kicker: "Kapitel 1 · Der erste Zettel",
        title: "„Sie stehen vor meiner Einfahrt!“",
        paragraphs: [
          "Es begann harmlos: ein handgeschriebener Zettel unter dem Scheibenwischer von Frau Lehmanns Kleinwagen. Herr Wagner musste um 6:30 Uhr zur Arbeit, und wenn ihr Auto auch nur zur Hälfte vor seiner Einfahrt stand, kam er mit dem Kombi nicht heraus. Der zweite Zettel war schon in Großbuchstaben geschrieben. Der fünfte enthielt das Wort „Abschleppdienst“.",
          "Frau Lehmann, Altenpflegerin im Spätdienst, kam oft nach 22 Uhr heim — dann war in der Straße seit Stunden nichts mehr frei. Die Lücke an Wagners Einfahrt war regelmäßig die einzige Option im Umkreis von zehn Minuten Fußweg. „Ich habe ja nicht aus Bosheit da gestanden“, sagt sie. „Ich hatte schlicht keine Alternative — und nach zehn Stunden Schicht auch keine Kraft mehr, eine zu suchen.“",
        ],
        quote: {
          text: "Ich habe mich irgendwann dabei ertappt, dass ich abends am Fenster stand und auf ihr Auto gewartet habe. Da wusste ich: Das ist nicht mehr normal.",
          author: "Herr Wagner",
        },
      },
      {
        kicker: "Kapitel 2 · Eskalation im Kleinen",
        title: "Vom Parkproblem zur Feindschaft",
        paragraphs: [
          "Nach einem halben Jahr redeten die beiden nicht mehr — sie dokumentierten. Wagner fotografierte jede Blockade mit Zeitstempel. Lehmann sammelte die Zettel als „Beweise für Schikane“. Einmal ließ Wagner tatsächlich abschleppen: 280 Euro, die Frau Lehmann an die Grenze ihres Monatsbudgets brachten. Danach zerkratzte jemand — unaufgeklärt — Wagners Seitenspiegel. Das Misstrauen war komplett.",
          "Ausgerechnet die Quartiersmanagerin des Viertels, bei der beide sich unabhängig voneinander beschwert hatten, brachte den Stein ins Rollen: Sie kannte medipact und schlug eine Kurz-Mediation vor. Beide sagten zu — Wagner, um „endlich Ruhe zu haben“, Lehmann, um „nicht mehr als Monster behandelt zu werden“.",
        ],
      },
      {
        kicker: "Kapitel 3 · Zwei Dienstpläne, eine Lösung",
        title: "Das Problem war lösbar — man musste es nur kennen",
        paragraphs: [
          "In der Mediation lagen zum ersten Mal beide Tagesabläufe nebeneinander: Wagner braucht die Einfahrt werktags zwischen 6 und 7 Uhr frei. Lehmann braucht nachts irgendeinen legalen Platz. Zwei Bedürfnisse, die sich — anders als die beiden Menschen — nie wirklich im Weg standen.",
          "Die Vereinbarung: Lehmann darf mit Wagners ausdrücklicher Erlaubnis abends quer vor der Einfahrt stehen, hinterlegt aber ihre Handynummer und parkt bis 6 Uhr um — im Gegenzug fragte Wagner bei seinem Vermieter an, ob der ungenutzte zweite Stellplatz im Hof vermietet werden kann. Zwei Monate später parkte Lehmann dort, für eine kleine Monatsmiete. Die Zettel-Sammlung landete im Altpapier.",
        ],
        quote: {
          text: "Wir haben ein halbes Jahr Krieg geführt um ein Problem, das sich in neunzig Minuten lösen ließ.",
          author: "Frau Lehmann",
        },
      },
    ],

    randnotizen: [
      {
        norm: "§ 12 StVO",
        text: "Vor Grundstücksein- und -ausfahrten darf nicht geparkt werden, das ist eindeutig. Abschleppen lassen ist erlaubt, und die Kosten muss in der Regel der Falschparker tragen. Was die StVO nicht regelt: wie man sich am nächsten Morgen auf dem Gehweg grüßt.",
      },
    ],

    twists: [
      {
        gericht:
          "Abschleppen, Anzeige, vielleicht ein Unterlassungsurteil. Vollstreckbar, aber nicht befahrbar.",
        einigung:
          "Frau Lehmann darf abends mit Erlaubnis vor der Einfahrt stehen, hinterlegt ihre Handynummer und parkt bis 6 Uhr um. Die Uhrzeit stammt direkt aus Herrn Wagners Dienstplan.",
      },
      {
        gericht: "Einen Parkplatz kann kein Gericht herbeiurteilen.",
        einigung:
          "Der zweite Stellplatz im Hof, den Herr Wagner nie gebraucht hat, gehört jetzt Frau Lehmann, gegen eine kleine Monatsmiete an den Vermieter. Der Platz war die ganze Zeit da. Es hatte nur nie jemand gefragt.",
      },
      {
        gericht: "Die Zettel werden als Beweismittel zur Akte genommen.",
        einigung:
          "Die Zettelsammlung landete gemeinsam im Altpapier. Der letzte Zettel kam von Frau Lehmann, steckte im Briefkasten und hatte nur ein Wort: „Danke.“",
      },
    ],

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

  "gesellschafter-streit": {
    slug: "gesellschafter-streit",
    eyebrow: "Geschäfts-Fallbeispiel",
    title: "Stefan & Tobias",
    titleHighlight: "Gesellschafter-Patt in der Softwareagentur",
    intro:
      "Gegründet in einer WG-Küche, zwölf Jahre beste Freunde, 50 zu 50 an allem. Dann wollte Stefan in KI investieren und Tobias nicht, und plötzlich konnten sich zwei Geschäftsführer nicht einmal mehr auf ein Logo einigen. Am Ende hatte jeder seine eigene Firma und beide wieder einen Termin am Freitagmittag.",

    situationTitle: '"Wir konnten nicht mal mehr über das Logo entscheiden"',
    situationIntro:
      "Ein 50/50-Patt ist im Gesellschaftsrecht die schönste Form der Gleichberechtigung und zugleich die gefährlichste. Wer nicht entscheiden kann, entscheidet trotzdem, nämlich für den Stillstand.",

    storyIntro:
      "Zwölf Jahre nach der Gründung in einer WG-Küche standen sich zwei beste Freunde als Blockierer gegenüber — und die Firma, die beide liebten, drohte zwischen ihnen zerrieben zu werden.",
    chapters: [
      {
        kicker: "Kapitel 1 · Die WG-Küche",
        title: "Vom Duo zur Doppelspitze",
        paragraphs: [
          "Stefan und Tobias gründeten die Agentur mit Anfang zwanzig: Stefan der Verkäufer, Tobias der Architekt der Systeme. Die 50/50-Aufteilung war damals Ausdruck ihrer Freundschaft — niemand sollte über dem anderen stehen. Zwölf Jahre später beschäftigte die Agentur 18 Leute und machte solide Gewinne. Und die Gleichberechtigung von damals war zur Falle geworden.",
          "Der Riss begann mit einer Strategiefrage: Stefan wollte aggressiv wachsen, Fremdkapital aufnehmen, in KI-Produkte investieren. Tobias wollte das profitable Agenturgeschäft schützen und keine Schulden. Beide Positionen waren vertretbar. Aber bei 50/50 gewinnt keine — es verliert nur die Firma.",
        ],
        quote: {
          text: "Wir haben in Gesellschafterversammlungen gesessen, zu zweit, und protokolliert, dass wir uns nicht einigen. Absurder geht es nicht.",
          author: "Tobias",
        },
      },
      {
        kicker: "Kapitel 2 · Der kalte Krieg",
        title: "Zwei Lager in einem Großraumbüro",
        paragraphs: [
          "Das Patt sickerte ins Unternehmen. Die Entwickler orientierten sich an Tobias, das Sales-Team an Stefan. Neueinstellungen: blockiert. Die Investitionsentscheidung: vertagt, viermal. Zwei Leistungsträger kündigten, weil „hier gerade niemand weiß, wohin die Reise geht“. Ein Kunde fragte offen, ob die Agentur in einem Jahr noch existiere.",
          "Stefans Anwalt skizzierte die juristischen Optionen: Auflösungsklage, Zwangseinziehung, Anteilsverkauf an Dritte — alles Wege, die Jahre dauern, sechsstellig kosten und die Firma währenddessen entwerten. „Sie können den Streit gewinnen und trotzdem alles verlieren“, sagte er. Es war Tobias, der schließlich den Mediationsvorschlag machte — per E-Mail, weil man nicht mehr miteinander sprach.",
        ],
      },
      {
        kicker: "Kapitel 3 · Die Frage hinter der Frage",
        title: "Worüber gestritten wurde — und worum es ging",
        paragraphs: [
          "Der Mediator ließ beide zunächst getrennt erzählen. Dabei zeigte sich: Der Strategiestreit war nur die Oberfläche. Stefan fühlte sich seit Jahren als derjenige, der das Geld reinholt, während Tobias „im Maschinenraum verschwindet“. Tobias fühlte sich von Stefans Alleingängen übergangen — der KI-Plan war ihm zuerst von einem Kunden erzählt worden, nicht vom eigenen Mitgründer.",
          "In den gemeinsamen Sitzungen wurde aus der Machtfrage eine Sachfrage: Was braucht das Wachstum wirklich, was riskiert es? Am Ende stand ein Modell, auf das keiner allein gekommen wäre: Die KI-Sparte wird als Tochter-GmbH ausgegründet — Stefan führt sie und hält dort die Mehrheit, Tobias führt die Agentur mit umgekehrten Verhältnissen. Die Holding bleibt 50/50, aber mit klarer Schiedsklausel und einem Beirat für künftige Pattsituationen.",
        ],
        quote: {
          text: "Wir haben nicht die Anteile neu verteilt. Wir haben die Verantwortung neu verteilt — das war der eigentliche Durchbruch.",
          author: "Stefan",
        },
      },
      {
        kicker: "Kapitel 4 · Danach",
        title: "Zwei Chefs, zwei Firmen, ein Fundament",
        paragraphs: [
          "Drei Monate nach der ersten Sitzung waren die Verträge notariell beurkundet. Die Belegschaft erfuhr die Neuordnung in einer gemeinsamen Runde — vorgestellt von beiden Gründern nebeneinander, zum ersten Mal seit einem Jahr.",
          "Heute läuft die Agentur stabil unter Tobias, die KI-Tochter wächst unter Stefan. Freitags essen die beiden wieder zusammen zu Mittag. „Nicht jede Woche“, sagt Tobias. „Aber öfter als in den zwei Jahren davor.“",
        ],
      },
    ],

    randnotizen: [
      {
        norm: "§ 47 GmbHG",
        text: "In der GmbH entscheidet die Mehrheit der Stimmen. Bei zwei Gesellschaftern mit je 50 Prozent gibt es aber keine Mehrheit, nur ein Unentschieden. Ein Elfmeterschießen hat das Gesetz dafür nicht vorgesehen. Das muss man sich selbst in den Vertrag schreiben.",
      },
      {
        norm: "„Russian Roulette“ und „Texas Shoot-out“",
        text: "Diese Klauseln heißen wirklich so: Einer nennt einen Preis, der andere muss zu diesem Preis entweder verkaufen oder kaufen. Juristisch elegant, menschlich ein Duell im Morgengrauen. Stefan und Tobias haben sich bewusst dagegen entschieden.",
      },
    ],

    twists: [
      {
        gericht:
          "Auflösungsklage oder Ausschluss: Am Ende verliert einer seine Firma, oft verlieren sie beide.",
        einigung:
          "Stefans KI-Ideen bekommen eine eigene Tochtergesellschaft, die Agentur bleibt Tobias’ Bühne. Der Streit um die eine Strategie war in Wahrheit ein Streit um zwei Strategien für zwei Firmen.",
      },
      {
        gericht: "Das Logo ist keine Frage für das Landgericht.",
        einigung:
          "Über das neue Logo hat das Team abgestimmt. Die beiden Gründer haben sich freiwillig enthalten, und beide sagen, das sei die beste Entscheidung des Jahres gewesen.",
      },
      {
        gericht: "Eine Freundschaft lässt sich nicht einklagen.",
        einigung:
          "Freitags gibt es wieder Mittagessen. Das steht in keinem Vertrag, aber in beiden Kalendern, als wiederkehrender Termin ohne Enddatum.",
      },
    ],

    perspectives: [
      {
        title: "Stefan, 36, Gründer & Vertrieb",
        content:
          "Ich habe gesehen, wie unser Markt sich verändert. Wer jetzt nicht in KI investiert, ist in fünf Jahren weg. Aber jede Entscheidung wurde blockiert. Ich war so weit, meine Anteile an einen Investor zu verkaufen — an irgendwen, Hauptsache raus aus der Lähmung.",
      },
      {
        title: "Tobias, 37, Gründer & Technik",
        content:
          "Wir haben 18 Angestellte, die von einem profitablen Geschäft leben. Stefan wollte das für eine Wette aufs Spiel setzen — und hat Pläne gemacht, ohne mich einzubeziehen. Es ging mir nie gegen die Idee. Es ging darum, wie mit mir umgegangen wurde.",
      },
    ],

    factsTitle: "Die Zahlen",
    facts: [
      "Agentur: 18 Mitarbeiter, seit 12 Jahren am Markt",
      "Anteile: je 50% — vollständige Pattsituation",
      "Jahresumsatz: €2,4 Mio., profitabel",
      "2 Kündigungen von Leistungsträgern während des Konflikts",
      "Investitionsentscheidung: viermal vertagt",
    ],

    riskTitle: "Ohne Mediation (Gesellschafterstreit)",
    risks: [
      "Auflösungsklage oder Anteilszwangsverkauf: 2–4 Jahre",
      "Anwälte & Gutachter: €50.000+",
      "Firmenwert fällt während des Verfahrens",
      "Weitere Schlüssel-Mitarbeiter gehen",
      "Kunden wandern zur Konkurrenz",
      "Freundschaft endgültig zerstört",
    ],

    processTitle: "Der Mediations-Prozess (3 Monate)",
    steps: [
      {
        label: "Woche 1–2",
        title: "Getrennte Vorgespräche",
        description:
          "Beide Gesellschafter schildern Sicht, Interessen und rote Linien einzeln. Der eigentliche Konflikt — Anerkennung und Einbeziehung — wird sichtbar.",
      },
      {
        label: "Monat 1",
        title: "Sachebene trennen",
        description:
          "Strategiefrage und Beziehungsfrage werden auseinandergezogen. Ein externer Zahlen-Check objektiviert Chancen und Risiken beider Strategien.",
      },
      {
        label: "Monat 2",
        title: "Optionen entwickeln",
        description:
          "Statt 'wer setzt sich durch': Ausgründungsmodell, Verantwortungsteilung, Beirat und Schiedsklausel gegen künftige Patts werden entworfen.",
      },
      {
        label: "Monat 3",
        title: "Rechtlich umsetzen",
        description:
          "Anwälte beider Seiten gestalten die Vereinbarung aus, der Notar beurkundet. Die Belegschaft wird gemeinsam informiert.",
      },
    ],

    resultTitle: "Das Ergebnis",
    positive: {
      title: "Mit Mediation",
      items: [
        "€2.400 Kosten (statt €50k+)",
        "3 Monate (statt Jahre)",
        "Beide führen — jeder in seinem Bereich",
        "Firma und Arbeitsplätze stabil",
        "Schiedsklausel verhindert künftige Patts",
        "Die Freundschaft hat überlebt",
      ],
    },
    negative: {
      title: "Ohne Mediation",
      items: [
        "€50k+ Verfahrenskosten",
        "Jahrelange Blockade",
        "Firmenwert verfällt im Streit",
        "Mitarbeiter- und Kundenverlust",
        "Zwangsverkauf oder Auflösung droht",
        "Zwölf Jahre Freundschaft enden vor Gericht",
      ],
    },

    quotesTitle: "Was sie sagen",
    quotes: [
      {
        text: "Ein Richter hätte entschieden, wer recht hat. Die Mediation hat dafür gesorgt, dass es die Firma in fünf Jahren noch gibt. Das ist nicht dasselbe.",
        author: "Stefan & Tobias",
      },
    ],

    ctaTitle: "Gesellschafter-Patt? Erst reden, dann klagen.",
    ctaText:
      "Blockierte Entscheidungen kosten jeden Monat Firmenwert. Mediation löst das Patt, bevor Anwälte und Gerichte es zementieren.",
    ctaHref: "mailto:hallo@medipact.de?subject=Business-Mediation",
    ctaLabel: "Mediation starten",
  },

  "team-konflikt": {
    slug: "team-konflikt",
    eyebrow: "Geschäfts-Fallbeispiel",
    title: "Vertrieb gegen Entwicklung",
    titleHighlight: "Ein Teamkonflikt legt den Mittelständler lahm",
    intro:
      "Der Vertrieb sagte einem Großkunden ein Feature zu, und die Entwicklung erfuhr davon aus dem Protokoll. Danach gab es zwei Abteilungen, eine gemeinsame Kaffeemaschine und keine gemeinsamen Mittagspausen mehr, bis Krankmeldungen und Kündigungen die Geschäftsführung aufweckten.",

    situationTitle: '"Die reden nur noch über Ticketsysteme miteinander"',
    situationIntro:
      "Wenn zwei Teams sich nicht mehr ausstehen können, sieht es aus wie ein Charakterproblem. Meistens ist es ein Prozessproblem mit Gesichtern.",

    storyIntro:
      "Wie aus einem verpatzten Produktlaunch ein Grabenkrieg zwischen zwei Abteilungen wurde — und was ihn beendet hat.",
    chapters: [
      {
        kicker: "Kapitel 1 · Der Launch",
        title: "Ein Versprechen, das niemand halten konnte",
        paragraphs: [
          "Der Auslöser war ein Erfolg: Der Vertrieb eines Software-Mittelständlers (85 Mitarbeiter) hatte einem Großkunden ein Feature-Paket zugesagt — Lieferung in drei Monaten. Die Entwicklung erfuhr davon aus der Unternehmens-Rundmail. Realistischer Aufwand: acht Monate. Der Launch scheiterte, der Kunde kündigte, und die Schuldfrage zerriss das Haus.",
          "Für den Vertrieb war klar: Die Entwicklung ist zu langsam und blockiert Geschäft. Für die Entwicklung war klar: Der Vertrieb verkauft Luftschlösser und lässt andere die Trümmer wegräumen. Beide Erzählungen wurden in jedem Meeting weitererzählt — und mit jedem Mal wahrer für die, die sie erzählten.",
        ],
        quote: {
          text: "Irgendwann haben unsere Leute Sätze gesagt wie 'die da drüben'. Da wusste ich, dass wir ein echtes Problem haben.",
          author: "Die Geschäftsführerin",
        },
      },
      {
        kicker: "Kapitel 2 · Die Kosten des Schweigens",
        title: "Krankmeldungen und Kündigungen",
        paragraphs: [
          "Sechs Monate später war der Konflikt messbar: Der Krankenstand in beiden Teams lag deutlich über dem Firmenschnitt, zwei Entwickler und eine Account-Managerin hatten gekündigt, Übergaben zwischen den Abteilungen liefen nur noch schriftlich über das Ticketsystem — dokumentiert, absicherungsorientiert, langsam. Ein internes Projekt verzögerte sich um ein Quartal, weil niemand zuständig sein wollte.",
          "Die Geschäftsführerin stand vor der klassischen Wahl: durchgreifen — Umstrukturierung, Versetzungen, notfalls Trennungen — oder den Konflikt bearbeiten lassen. Ihr Personalleiter rechnete vor, was allein die drei Kündigungen an Recruiting- und Einarbeitungskosten verursacht hatten: über €120.000. Die Mediation kostete einen Bruchteil davon.",
        ],
      },
      {
        kicker: "Kapitel 3 · Der Workshop, der keiner sein sollte",
        title: "Zwei Teams, ein Raum, klare Regeln",
        paragraphs: [
          "Die Mediation begann nicht mit einem großen Rundentisch, sondern mit Einzelgesprächen: erst die beiden Teamleitungen, dann Schlüsselpersonen aus beiden Abteilungen. Dabei zeigte sich der Kern: Es gab keinen definierten Prozess, wie Zusagen an Kunden entstehen. Der Vertrieb schätzte Aufwände selbst, weil Anfragen an die Entwicklung „ewig dauerten“. Die Entwicklung priorisierte Anfragen des Vertriebs zuletzt, weil sie „eh wieder alles umwerfen“.",
          "In zwei gemeinsamen Sitzungen wurde der Konflikt entpersonalisiert: Nicht Menschen waren das Problem, sondern eine fehlende Schnittstelle. Das Ergebnis war unspektakulär und wirksam — ein verbindlicher Angebots-Prozess mit Aufwandscheck vor jeder Kundenzusage, ein wöchentliches 30-Minuten-Format beider Teamleitungen und eine Eskalationsregel, die Konflikte zur Geschäftsführung bringt, bevor sie in den Fluren landen.",
        ],
        quote: {
          text: "Ich dachte, wir brauchen ein Teambuilding mit Kletterpark. Wir brauchten einen Prozess und zwei ehrliche Gespräche.",
          author: "Der Entwicklungsleiter",
        },
      },
    ],

    randnotizen: [
      {
        norm: "§ 106 GewO",
        text: "Der Arbeitgeber darf per Weisung bestimmen, wer was wann macht. Er kann also anordnen, dass Vertrieb und Entwicklung zusammenarbeiten. Dass sie es gern tun, kann er nicht anordnen. Dafür gibt es keinen Paragrafen, nur Gespräche.",
      },
    ],

    twists: [
      {
        gericht:
          "Arbeitsgericht: Abmahnung, Kündigungsschutzklage, Vergleich mit Abfindung. Die Ursache bleibt im Haus.",
        einigung:
          "Ein Aufwandscheck vor jeder Kundenzusage, mit fester Antwortfrist. Der Vertrieb bekommt schnell eine Zahl, die Entwicklung bekommt keine Überraschungen mehr.",
      },
      {
        gericht: "Verständnis füreinander lässt sich nicht einklagen.",
        einigung:
          "Ein Tag Rollentausch: Jede Entwicklerin und jeder Entwickler war einmal mit beim Kunden, jede Vertriebsperson saß einen Tag in der Sprintplanung. Der meistzitierte Satz danach: „Ach, DAS meint ihr mit Aufwand.“",
      },
      {
        gericht: "Eskaliert wird über Abmahnungen und den Flurfunk.",
        einigung:
          "Eine Eskalationsregel: Was die beiden Teamleitungen nicht in ihrer wöchentlichen halben Stunde klären, geht an die Geschäftsführung, bevor es in der Kaffeeküche landet.",
      },
    ],

    perspectives: [
      {
        title: "Vertriebsleiterin, 41",
        content:
          "Wir stehen beim Kunden im Feuer. Wenn ich für jede Zusage erst drei Wochen auf eine Aufwandsschätzung warte, ist der Auftrag weg. Also haben wir selbst geschätzt. Dass das die Entwicklung überrollt hat, habe ich erst in der Mediation wirklich verstanden.",
      },
      {
        title: "Entwicklungsleiter, 45",
        content:
          "Mein Team hat Wochenenden durchgearbeitet für ein Versprechen, das wir nie gegeben haben. Als der Launch scheiterte, standen wir als die Langsamen da. Danach habe ich jede Vertriebsanfrage mit spitzen Fingern angefasst — zugegeben: auch aus Trotz.",
      },
    ],

    factsTitle: "Die Zahlen",
    facts: [
      "Unternehmen: Software-Mittelständler, 85 Mitarbeiter",
      "Konfliktdauer vor Mediation: über 6 Monate",
      "3 Kündigungen, Fluktuationskosten €120.000+",
      "Krankenstand beider Teams deutlich über Firmenschnitt",
      "1 verlorener Großkunde als Auslöser",
    ],

    riskTitle: "Ohne Mediation",
    risks: [
      "Weitere Kündigungen von Leistungsträgern",
      "Dauerhaft verhärtete Abteilungs-Silos",
      "Verschleppte Projekte und Kundenverluste",
      "Arbeitsrechtliche Eskalation (Abmahnungen, Versetzungen)",
      "Kulturschaden, der Recruiting erschwert",
    ],

    processTitle: "Der Mediations-Prozess (6 Wochen)",
    steps: [
      {
        label: "Woche 1",
        title: "Auftragsklärung mit der Geschäftsführung",
        description:
          "Ziele, Vertraulichkeit und Grenzen werden definiert: Mediation ersetzt keine Führungsentscheidung, sie macht Teams wieder arbeitsfähig.",
      },
      {
        label: "Woche 2–3",
        title: "Einzelgespräche",
        description:
          "Teamleitungen und Schlüsselpersonen beider Abteilungen werden vertraulich gehört. Muster und Kernthema (fehlende Schnittstelle) werden sichtbar.",
      },
      {
        label: "Woche 4–5",
        title: "Gemeinsame Sitzungen",
        description:
          "Konflikt wird entpersonalisiert, gegenseitige Zwänge werden verstanden. Gemeinsame Arbeitsregeln und ein Angebots-Prozess entstehen.",
      },
      {
        label: "Woche 6",
        title: "Vereinbarung & Follow-up",
        description:
          "Schriftliche Team-Vereinbarung, Vorstellung bei der Geschäftsführung, Review-Termin nach drei Monaten.",
      },
    ],

    resultTitle: "Das Ergebnis",
    positive: {
      title: "Mit Mediation",
      items: [
        "€1.800 Kosten — weniger als 2% der Fluktuationskosten",
        "Arbeitsfähige Teams nach 6 Wochen",
        "Verbindlicher Angebots-Prozess mit Aufwandscheck",
        "Krankenstand normalisiert sich",
        "Keine weiteren Kündigungen",
        "Eskalationsregel für künftige Konflikte",
      ],
    },
    negative: {
      title: "Ohne Mediation",
      items: [
        "Fluktuation frisst weiter sechsstellige Beträge",
        "Silos verhärten dauerhaft",
        "Weitere Kunden- und Projektverluste",
        "Führung verliert Glaubwürdigkeit",
        "Konflikt wandert in jedes neue Projekt mit",
      ],
    },

    quotesTitle: "Was sie sagen",
    quotes: [
      {
        text: "Die Mediation hat uns nicht zu Freunden gemacht. Sie hat etwas Besseres geschafft: Wir können wieder professionell zusammenarbeiten — und streiten jetzt über Sachfragen statt übereinander.",
        author: "Vertriebsleiterin & Entwicklungsleiter",
      },
    ],

    ctaTitle: "Ihr Teamkonflikt kostet jeden Monat Geld.",
    ctaText:
      "Krankenstand, Fluktuation, verschleppte Projekte — ungelöste Teamkonflikte sind teurer als jede Mediation. Wir machen Ihre Teams wieder arbeitsfähig.",
    ctaHref: "mailto:hallo@medipact.de?subject=Business-Mediation",
    ctaLabel: "Erstgespräch vereinbaren",
  },

  "b2b-projektstreit": {
    slug: "b2b-projektstreit",
    eyebrow: "Geschäfts-Fallbeispiel",
    title: "Maschinenbauer & IT-Dienstleister",
    titleHighlight: "ERP-Projekt vor dem Scherbenhaufen",
    intro:
      "€1,8 Millionen Budget, ein ERP-System, das nicht lief, €400.000 offene Nachträge und zwei Geschäftsführer, die sich einst auf einer Hausmesse per Handschlag einig geworden waren. Beide Rechtsabteilungen bereiteten die Klagen vor. Herausgekommen ist ein Go-live, ein neuer Vertrag und eine Klausel, die beide Häuser inzwischen überall verwenden.",

    situationTitle: '"Kündigen wir, verlieren wir beide Millionen"',
    situationIntro:
      "In IT-Projekten gibt es selten einen Schuldigen, aber immer zwei Seiten, die beweisen können, dass es der andere war. Vor Gericht wird daraus ein Gutachterkrieg, den am Ende vor allem die Gutachter gewinnen.",

    storyIntro:
      "Die Geschichte eines Projekts, das juristisch schon tot war — und wirtschaftlich zu wertvoll, um es sterben zu lassen.",
    chapters: [
      {
        kicker: "Kapitel 1 · Das Vorzeigeprojekt",
        title: "Zwei Handschläge und ein Werkvertrag",
        paragraphs: [
          "Als der Maschinenbauer (240 Mitarbeiter) sein altes ERP-System ablösen wollte, fiel die Wahl auf einen IT-Dienstleister, mit dem man seit Jahren gut zusammenarbeitete. Projektvolumen: €1,8 Millionen, Laufzeit: 18 Monate. Beide Geschäftsführer besiegelten den Start per Handschlag auf der Hausmesse.",
          "Vierzehn Monate nach dem geplanten Go-live war nichts live. Der Dienstleister hatte €400.000 an Nachträgen in Rechnung gestellt, die der Maschinenbauer nicht zahlte — „für Leistungen, die im Vertrag stehen“. Der Dienstleister sah das Gegenteil: über 60 Änderungswünsche, die das halbe Projekt umgekrempelt hatten. Beide hatten inzwischen Anwälte. Die Projektmeetings waren durch Schriftsätze ersetzt worden.",
        ],
        quote: {
          text: "Wir haben irgendwann mehr Geld für die Dokumentation des Streits ausgegeben als für das Projekt selbst.",
          author: "Der Projektleiter des Maschinenbauers",
        },
      },
      {
        kicker: "Kapitel 2 · Die Rechnung, die niemand sehen wollte",
        title: "Was ein Prozess wirklich kosten würde",
        paragraphs: [
          "Der Justiziar des Maschinenbauers legte der Geschäftsführung eine nüchterne Analyse vor: Ein IT-Prozess über Werkvertragsleistungen dauert durch die Instanzen drei bis fünf Jahre, IT-Sachverständige und Anwälte würden €150.000 bis €250.000 kosten, und der Ausgang war offen, weil beide Seiten dokumentierte Versäumnisse hatten. Vor allem aber: Das alte ERP-System lief aus dem Support. Ein neuer Anbieter würde bei null anfangen — Mehrkosten weit über einer Million.",
          "Beim Dienstleister sah die Rechnung ähnlich düster aus: €400.000 Außenstände, gebundene Entwickler, ein drohender Reputationsschaden in der Branche. Als der Mediationsvorschlag kam — angeregt durch den Beirat des Maschinenbauers — stimmten beide binnen einer Woche zu. Nicht aus Versöhnlichkeit. Aus Rechenschärfe.",
        ],
      },
      {
        kicker: "Kapitel 3 · Rückwärts durch das Projekt",
        title: "60 Änderungswünsche, ein Muster",
        paragraphs: [
          "Die Mediatorin — erfahren in IT-Projekten — ließ beide Seiten zunächst die Projektgeschichte rekonstruieren: gemeinsam, chronologisch, anhand der Protokolle. Dabei wurde ein Muster sichtbar, das keiner bestritt: Das Lastenheft war zu vage gewesen, Änderungswünsche waren mündlich zugesagt und nie sauber bepreist worden — von beiden Seiten aus Bequemlichkeit, solange die Stimmung gut war.",
          "Damit war die Schuldfrage vom Tisch, denn sie hatte keine Antwort. Übrig blieb die Zukunftsfrage: Was kostet die Fertigstellung, wer trägt was? Das Ergebnis: Der Maschinenbauer zahlt €250.000 der offenen Nachträge, der Dienstleister erlässt den Rest und stellt das Projekt mit einem Festpreis-Restpaket fertig — mit klarem Change-Request-Prozess, wöchentlichem Lenkungskreis und einem Eskalationsverfahren mit Mediationsklausel für alle künftigen Verträge.",
        ],
        quote: {
          text: "Vor Gericht hätten wir bewiesen, dass die anderen schuld sind. In der Mediation haben wir bewiesen, dass wir das Projekt fertig kriegen. Nur eines davon bringt Geld.",
          author: "Der Geschäftsführer des IT-Dienstleisters",
        },
      },
      {
        kicker: "Kapitel 4 · Go-live",
        title: "Sieben Monate später",
        paragraphs: [
          "Das System ging mit sieben Monaten Zusatzaufwand live — begleitet vom selben Team, das den Streit durchgestanden hatte. Die beiden Geschäftsführer trafen sich zur Abnahme wieder auf der Hausmesse. Diesmal gab es keinen Handschlag ohne Vertrag: Das neue Wartungsabkommen enthält die Mediationsklausel, die inzwischen in allen Verträgen beider Häuser steht.",
        ],
      },
    ],

    randnotizen: [
      {
        norm: "§ 611 · § 631 · § 640 BGB",
        text: "Ist ein ERP-Projekt ein Werkvertrag, bei dem ein funktionierendes System geschuldet ist, oder ein Dienstvertrag, bei dem nur die Arbeit geschuldet ist? Darüber streiten Juristen gern länger, als das Projekt gedauert hat. An der Antwort hängt, wer das Risiko trägt und ob es auf die Abnahme ankommt.",
      },
      {
        norm: "§ 203 BGB",
        text: "Solange über einen Anspruch verhandelt wird, ist die Verjährung gehemmt. Profis vereinbaren trotzdem einen Verjährungsverzicht, damit niemand aus Angst vor dem Fristende klagen muss, während man eigentlich gerade miteinander redet.",
      },
    ],

    twists: [
      {
        gericht:
          "Nach Jahren ein Urteil über die Nachträge. Ein laufendes System spricht kein Gericht zu.",
        einigung:
          "€250.000 der Nachträge zahlt der Maschinenbauer, den Rest erlässt der Dienstleister und baut das System zum Festpreis fertig. Beide bekommen, was kein Urteil liefern kann: einen Go-live.",
      },
      {
        gericht:
          "Wer schuld war, klärt ein Sachverständiger, für eine sechsstellige Summe.",
        einigung:
          "Eine gemeinsame Chronologie statt der Schuldfrage: vages Lastenheft, Änderungen auf beiden Seiten per Zuruf. Als das an der Wand hing, wollte niemand mehr einen Gutachter bezahlen.",
      },
      {
        gericht:
          "Nach dem Urteil spricht man höchstens noch über den Gerichtsvollzieher miteinander.",
        einigung:
          "Ein neues Wartungsabkommen mit Mediationsklausel. Die Abnahme feierten die Geschäftsführer auf derselben Hausmesse, auf der alles angefangen hatte.",
      },
    ],

    perspectives: [
      {
        title: "Projektleiter Maschinenbau, 48",
        content:
          "Wir haben €1,8 Millionen budgetiert und ein System bekommen, das nicht lief. Natürlich haben wir die Nachträge nicht einfach gezahlt. Aber mir war klar: Wenn wir klagen, habe ich in drei Jahren weder ein Urteil noch ein ERP-System — dafür ein Millionengrab.",
      },
      {
        title: "Geschäftsführer IT-Dienstleister, 52",
        content:
          "Meine Entwickler haben Monate an Änderungen gearbeitet, die nie beauftragt, aber immer erwartet wurden. €400.000 offene Forderungen kann ein Mittelständler wie wir nicht aussitzen. Trotzdem war klagen die schlechteste Option: Der Kunde war ja nicht böswillig — das Projekt war schlecht aufgesetzt. Von uns beiden.",
      },
    ],

    factsTitle: "Die Zahlen",
    facts: [
      "Projektvolumen: €1,8 Mio., 18 Monate geplant",
      "Verzug: 14 Monate",
      "Strittige Nachträge: €400.000",
      "Über 60 undokumentierte Änderungswünsche",
      "Altes ERP-System kurz vor Support-Ende",
    ],

    riskTitle: "Ohne Mediation (IT-Prozess)",
    risks: [
      "3–5 Jahre durch die Instanzen",
      "Anwälte & IT-Sachverständige: €150.000–250.000",
      "Projektabbruch: Neustart kostet €1 Mio.+",
      "Ausgang offen — beide Seiten haben Versäumnisse",
      "Geschäftsbeziehung und Reputation zerstört",
    ],

    processTitle: "Der Mediations-Prozess (10 Wochen)",
    steps: [
      {
        label: "Woche 1–2",
        title: "Verfahrensvereinbarung",
        description:
          "Vertraulichkeit, Verjährungsverzicht und Teilnehmerkreis werden geregelt — beide Seiten verhandeln ohne prozessuales Risiko.",
      },
      {
        label: "Woche 3–5",
        title: "Gemeinsame Projektrekonstruktion",
        description:
          "Chronologie statt Schuldzuweisung: Anhand der Protokolle wird das Muster sichtbar — vages Lastenheft, undokumentierte Änderungen auf beiden Seiten.",
      },
      {
        label: "Woche 6–8",
        title: "Wirtschaftliche Lösung verhandeln",
        description:
          "Vergleich über die Nachträge (€250k/€150k), Festpreis-Restpaket für die Fertigstellung, klarer Change-Request-Prozess.",
      },
      {
        label: "Woche 9–10",
        title: "Vergleich & Neustart",
        description:
          "Anwaltlich ausgestalteter Vergleich, neuer Lenkungskreis, Mediationsklausel für alle künftigen Verträge.",
      },
    ],

    resultTitle: "Das Ergebnis",
    positive: {
      title: "Mit Mediation",
      items: [
        "€3.000 Kosten (statt €150k–250k Prozess)",
        "Lösung in 10 Wochen statt 3–5 Jahren",
        "Projekt wird fertiggestellt — Go-live erreicht",
        "Fairer Vergleich über die Nachträge",
        "Geschäftsbeziehung bleibt bestehen",
        "Mediationsklausel schützt künftige Projekte",
      ],
    },
    negative: {
      title: "Ohne Mediation",
      items: [
        "€150k+ Verfahrenskosten",
        "3–5 Jahre Rechtsstreit",
        "Projektabbruch und Millionen-Neustart",
        "Support-Ende des Altsystems als Damoklesschwert",
        "Zwei beschädigte Reputationen",
        "Urteil, mit dem keiner arbeiten kann",
      ],
    },

    quotesTitle: "Was sie sagen",
    quotes: [
      {
        text: "Der Vergleich hat wehgetan — auf beiden Seiten. Aber er hat zwei Unternehmen gerettet, die noch zehn Jahre Geschäft miteinander machen werden.",
        author: "Beide Geschäftsführer, gemeinsames Statement",
      },
    ],

    ctaTitle: "Projekt festgefahren? Verhandeln statt prozessieren.",
    ctaText:
      "B2B-Streitigkeiten vor Gericht kennen nur Verlierer mit unterschiedlich hohen Rechnungen. Wirtschaftsmediation rettet Projekt und Geschäftsbeziehung.",
    ctaHref: "mailto:hallo@medipact.de?subject=Business-Mediation",
    ctaLabel: "Fall schildern",
  },
};
