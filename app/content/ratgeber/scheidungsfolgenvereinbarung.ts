// Ziel-Suchbegriffe: "scheidungsfolgenvereinbarung", "scheidungsfolgen-
// vereinbarung kosten", "scheidungsfolgenvereinbarung notar", "scheidungs-
// folgenvereinbarung muster", "was kostet eine scheidungsfolgenvereinbarung".
//
// 12.08.2026 – neu. Anlass: docs/kaufabsicht-scheidung.md. Unter 36 Ratgeber-
// Artikeln gab es keinen zu genau dem Dokument, das der medipact-Prozess am
// Ende produziert. Die Suchen dazu sind transaktional: Wer so sucht, hat sich
// getrennt, ist im Grundsatz einig und sucht den Weg zur verbindlichen Regelung.
//
// KERNARGUMENT dieses Artikels (bitte beim Überarbeiten erhalten):
// Der Notar beurkundet ein Ergebnis, er verhandelt es nicht. Wer ohne Einigung
// zum Notartermin geht, zahlt für einen Termin, der nichts klärt. medipact
// ersetzt also nicht die Beurkundung, sondern den teuren Weg zur Einigung
// davor. Dieselbe Logik wie bei § 114 FamFG auf /kostenrechner: Mediation
// ersetzt die Scheidung nicht, sie ersetzt den Streit darüber.
//
// ACHTUNG VOR VERÖFFENTLICHUNG: Dieser Artikel nennt Paragrafen und
// Notarkosten. Die Beurkundungspflichten (§ 1410 BGB, § 7 VersAusglG,
// § 1585c BGB, § 311b BGB, § 2348 BGB) und die Gebührenbeispiele nach GNotKG
// müssen juristisch gegengelesen werden. Die Kostenbeispiele sind 2,0-Gebühren
// nach Tabelle B, ohne Umsatzsteuer und Auslagen — bewusst als Größenordnung
// und nicht als Zusage formuliert.

import type { RatgeberArticle } from "./types";

export const article: RatgeberArticle = {
  slug: "scheidungsfolgenvereinbarung",
  category: "Trennung & Scheidung",
  title: "Scheidungsfolgenvereinbarung: Inhalt, Kosten und wann der Notar muss",
  metaTitle: "Scheidungsfolgenvereinbarung: Inhalt & Kosten | medipact",
  description:
    "Was in eine Scheidungsfolgenvereinbarung gehört, wann sie notariell beurkundet werden muss und was sie kostet – und warum der teure Teil davor liegt.",
  eyebrow: "Ratgeber · Trennung & Scheidung",
  updated: "2026-08-12",
  published: "2026-08-12",
  readingMinutes: 11,
  intro:
    "Eine Scheidungsfolgenvereinbarung ist der Vertrag, in dem Sie beide regeln, was nach der Ehe gelten soll: Vermögen, Unterhalt, Versorgungsausgleich, Immobilie, Kinder. Sie ist der Grund, warum manche Scheidungen in drei Monaten erledigt sind und andere über Jahre laufen. Dieser Artikel zeigt, was hineingehört, wann Sie zwingend zum Notar müssen, was das kostet – und an welcher Stelle die eigentlichen Kosten entstehen.",
  blocks: [
    {
      type: "paragraph",
      text: "Der Begriff klingt nach Formalität, meint aber etwas sehr Praktisches: Statt jede offene Frage vom Familiengericht entscheiden zu lassen, entscheiden Sie beide sie vorher selbst und halten das Ergebnis schriftlich fest. Das Gericht muss dann nur noch die Ehe scheiden – nicht darüber urteilen, wem das Auto gehört.",
    },
    {
      type: "paragraph",
      text: "Der wirtschaftliche Effekt ist erheblich, und er wird oft falsch verstanden. Nicht der Anwalt macht eine Scheidung teuer, sondern die Zahl der Streitpunkte: Jede Folgesache, die ins Verfahren getragen wird, erhöht den Verfahrenswert – und an diesem Wert hängen sämtliche Gerichts- und Anwaltsgebühren. Wer sich vorher einigt, senkt die Kosten an der Wurzel.",
    },
    {
      type: "heading",
      text: "Trennungsvereinbarung, Ehevertrag, Scheidungsfolgenvereinbarung",
    },
    {
      type: "paragraph",
      text: "Die drei werden ständig verwechselt, obwohl der Unterschied nur im Zeitpunkt liegt. Inhaltlich überschneiden sie sich stark, und eine Trennungsvereinbarung kann ausdrücklich bestimmen, dass ihre Regelungen auch nach der Scheidung weitergelten sollen.",
    },
    {
      type: "table",
      caption:
        "Ehevertrag, Trennungsvereinbarung und Scheidungsfolgenvereinbarung im Vergleich: Zeitpunkt und typischer Inhalt",
      headers: ["Vertrag", "Zeitpunkt", "Typischer Inhalt"],
      rows: [
        [
          "Ehevertrag",
          "vor oder während intakter Ehe",
          "Güterstand, Versorgungsausgleich, Unterhalt – vorsorglich für den Fall der Fälle",
        ],
        [
          "Trennungsvereinbarung",
          "ab der Trennung, im Trennungsjahr",
          "Wer wohnt wo, Trennungsunterhalt, Hausrat, Umgang mit den Kindern, laufende Kosten",
        ],
        [
          "Scheidungsfolgenvereinbarung",
          "vor oder während des Scheidungsverfahrens",
          "Alles, was nach der Ehe gelten soll: Zugewinn, Versorgungsausgleich, nachehelicher Unterhalt, Immobilie",
        ],
      ],
    },
    {
      type: "heading",
      text: "Was hineingehört",
    },
    {
      type: "paragraph",
      text: "Es gibt keine vorgeschriebene Gliederung. In der Praxis sind es aber immer dieselben sechs Bereiche – und die Vollständigkeit ist wichtiger als die Formulierung. Was Sie offenlassen, bleibt offen und kann Jahre später wieder aufbrechen.",
    },
    {
      type: "list",
      items: [
        "Zugewinnausgleich: Wie wird der in der Ehe entstandene Vermögenszuwachs ausgeglichen – oder verzichten Sie wechselseitig darauf?",
        "Versorgungsausgleich: Werden die Rentenanwartschaften geteilt, ausgeschlossen oder abweichend geregelt?",
        "Nachehelicher Unterhalt: Wer zahlt wie viel, wie lange, und unter welchen Bedingungen ändert sich das?",
        "Kindesunterhalt: Höhe, Fälligkeit, Anpassung – meist entlang der Düsseldorfer Tabelle, aber mit klarer Regelung für Sonderbedarf.",
        "Immobilie, Hausrat und Schulden: Wer übernimmt was, wer wird aus welchem Darlehen entlassen, wie wird ein Erlös verteilt?",
        "Sorge und Umgang: Wo leben die Kinder, wie ist der Umgang geregelt, wie werden Entscheidungen getroffen?",
      ],
    },
    {
      type: "callout",
      text: "Regelungen zu Sorge und Umgang binden das Familiengericht nicht wie ein Vertrag über Geld. Es bleibt am Kindeswohl orientiert und kann eine Regelung später abändern (§ 1696 BGB). Das ist kein Grund, sie wegzulassen – eine schriftliche Absprache trägt im Alltag auch dann, wenn sie nicht erzwingbar ist.",
    },
    {
      type: "heading",
      text: "Wann Sie zwingend zum Notar müssen",
    },
    {
      type: "paragraph",
      text: "Das ist der Punkt, an dem die meisten Missverständnisse entstehen. Eine Scheidungsfolgenvereinbarung ist nicht pauschal beurkundungspflichtig – aber die wirtschaftlich wichtigsten Regelungen sind es. Und ist auch nur eine davon enthalten, muss in aller Regel die gesamte Urkunde beurkundet werden.",
    },
    {
      type: "table",
      caption:
        "Beurkundungspflicht bei einer Scheidungsfolgenvereinbarung nach Regelungsbereich",
      headers: ["Regelung", "Form", "Grundlage"],
      rows: [
        [
          "Zugewinnausgleich / Güterstand",
          "notarielle Beurkundung, beide gleichzeitig anwesend",
          "§ 1410 BGB",
        ],
        [
          "Versorgungsausgleich",
          "notarielle Beurkundung – oder Protokollierung im laufenden Verfahren",
          "§ 7 VersAusglG",
        ],
        [
          "Nachehelicher Unterhalt",
          "beurkundungspflichtig, solange die Scheidung nicht rechtskräftig ist; danach formfrei",
          "§ 1585c BGB",
        ],
        [
          "Übertragung von Grundeigentum",
          "notarielle Beurkundung, zusätzlich Grundbucheintragung",
          "§ 311b BGB",
        ],
        [
          "Pflichtteils- oder Erbverzicht",
          "notarielle Beurkundung",
          "§ 2348 BGB",
        ],
        [
          "Sorge, Umgang, Hausrat",
          "formfrei – Schriftform genügt",
          "—",
        ],
      ],
    },
    {
      type: "paragraph",
      text: "Für den Kindesunterhalt gibt es einen Weg, den kaum jemand kennt: Er lässt sich beim Jugendamt in einer vollstreckbaren Urkunde festhalten – kostenfrei. Das ersetzt keine vollständige Vereinbarung, spart aber bei diesem Punkt den Notar und schafft trotzdem einen Titel, aus dem vollstreckt werden kann.",
    },
    {
      type: "heading",
      text: "Was der Notar kostet",
    },
    {
      type: "paragraph",
      text: "Notargebühren sind gesetzlich festgelegt und nicht verhandelbar – sie richten sich nach dem Geschäftswert der Vereinbarung. Ein Notar ist deshalb nicht günstiger oder teurer als der andere; wer Angebote vergleicht, vergleicht nichts.",
    },
    {
      type: "table",
      caption:
        "Größenordnung der Notargebühren für eine Scheidungsfolgenvereinbarung nach Geschäftswert",
      headers: ["Geschäftswert", "Notargebühr (Größenordnung)"],
      rows: [
        ["bis 25.000 €", "rund 230 €"],
        ["bis 50.000 €", "rund 330 €"],
        ["bis 100.000 €", "rund 550 €"],
        ["bis 500.000 €", "rund 1.900 €"],
      ],
    },
    {
      type: "paragraph",
      text: "Dazu kommen Umsatzsteuer und Auslagen. Die Zahlen sind Anhaltspunkte für die 2,0-Gebühr, die bei solchen Verträgen üblicherweise anfällt – die verbindliche Berechnung macht das Notariat vorab, und danach zu fragen ist völlig normal.",
    },
    {
      type: "callout",
      text: "Der Geschäftswert ist fast immer höher als gedacht, weil sich die Regelungsbereiche addieren: Vermögen, Immobilienwert, Rentenanwartschaften und der kapitalisierte Unterhalt fließen zusammen. Wer nur an das Sparbuch denkt, unterschätzt die Gebühr um ein Vielfaches. Lassen Sie den Wert vor dem Termin schätzen.",
    },
    {
      type: "heading",
      text: "Der teure Teil liegt vor dem Notartermin",
    },
    {
      type: "paragraph",
      text: "Ein Notar beurkundet ein Ergebnis. Er verhandelt es nicht, und er vermittelt nicht zwischen Ihnen. Zwar ist er zur Neutralität und zur Belehrung beider Seiten verpflichtet – aber wer ohne Einigung zum Termin erscheint, zahlt für einen Termin, an dem nichts geklärt wird. Genau deshalb ist die Notargebühr selten der große Posten.",
    },
    {
      type: "paragraph",
      text: "Teuer wird der Weg dorthin. Wenn zwei Anwälte über Monate Entwürfe hin- und herschicken, entstehen Gebühren nach Gegenstandswert – auf beiden Seiten. Kommt keine Einigung zustande, wandern die strittigen Punkte als Folgesachen ins Scheidungsverfahren, erhöhen den Verfahrenswert und damit erneut sämtliche Gebühren. Zur Einordnung: Eine streitige Scheidung erreicht regelmäßig einen deutlich vierstelligen bis fünfstelligen Betrag pro Person und dauert ein bis drei Jahre.",
    },
    {
      type: "callout",
      text: "Die Reihenfolge, die Geld spart: erst einigen, dann formulieren lassen, dann beurkunden. Die umgekehrte Reihenfolge – erst Entwürfe, dann verhandeln – ist der Normalfall und der Grund, warum einvernehmliche Trennungen trotzdem teuer werden.",
    },
    {
      type: "heading",
      text: "Warum Muster aus dem Internet selten tragen",
    },
    {
      type: "paragraph",
      text: "Ein Muster kann zeigen, wie so ein Vertrag aussieht – das ist nützlich. Es kann aber nicht wissen, ob Sie Gütertrennung haben, ob eine Immobilie belastet ist, ob jemand selbstständig ist oder ob ein Verzicht in Ihrer Konstellation überhaupt wirksam wäre. Vereinbarungen, die eine Seite grob einseitig belasten, können später als sittenwidrig unwirksam sein – und das stellt sich erfahrungsgemäß in dem Moment heraus, in dem man sich darauf verlassen wollte.",
    },
    {
      type: "paragraph",
      text: "Praktisch nützlich ist ein Muster trotzdem, aber an anderer Stelle: als Checkliste dafür, welche Punkte Sie besprechen müssen. Genau das ist die Arbeit, die Ihnen niemand abnimmt – und die kein Formular leisten kann.",
    },
    {
      type: "heading",
      text: "Wie medipact in diesen Ablauf passt",
    },
    {
      type: "paragraph",
      text: "medipact ersetzt weder den Notar noch das Scheidungsverfahren. Für die Scheidung selbst braucht es nach § 114 FamFG mindestens auf einer Seite anwaltliche Vertretung, und beurkundungspflichtige Regelungen bleiben beurkundungspflichtig. Was medipact abbildet, ist der Schritt davor: die strukturierte Einigung.",
    },
    {
      type: "list",
      items: [
        "Beide Seiten tragen ihre Angaben getrennt und schriftlich zusammen – ohne gemeinsamen Termin und ohne dass eine Seite die andere im Gespräch überfährt.",
        "Der Prozess geht die Regelungsbereiche vollständig durch, sodass keiner davon offenbleibt.",
        "Strittige Punkte werden gewichtet und gegeneinander abgewogen, statt nur ausgetauscht zu werden.",
        "Am Ende steht eine schriftliche Vereinbarung, die Sie anwaltlich prüfen und – wo nötig – notariell beurkunden lassen.",
      ],
    },
    {
      type: "paragraph",
      text: "Der Unterschied liegt im Preis für diesen Schritt: ein Festpreis pro Partei statt Stundensätze oder Gebühren nach Gegenstandswert. Zum Vergleich: Familienmediation über Stundensätze liegt in Deutschland üblicherweise bei mehreren hundert bis wenigen tausend Euro pro Partei.",
    },
    {
      type: "cta",
      text: "Was kostet der Weg über das Gericht? Jetzt vergleichen",
      href: "/kostenrechner?art=trennung",
    },
    {
      type: "callout",
      text: "Dieser Artikel ersetzt keine Rechts- oder Steuerberatung. Ob ein Verzicht in Ihrer Konstellation wirksam ist, welcher Geschäftswert anzusetzen ist und welche Regelung steuerlich sinnvoll wäre, hängt am Einzelfall. Lassen Sie die Vereinbarung prüfen, bevor Sie unterschreiben – nicht danach.",
    },
    {
      type: "cta",
      text: "Trennung strukturiert und fair regeln",
      href: "/konflikte/trennung",
    },
  ],
  faq: [
    {
      question: "Was kostet eine Scheidungsfolgenvereinbarung?",
      answer:
        "Die Notargebühr richtet sich nach dem Geschäftswert und ist gesetzlich festgelegt: grob 230 € bis 25.000 €, rund 330 € bis 50.000 € und etwa 1.900 € bis 500.000 € Geschäftswert, jeweils zuzüglich Umsatzsteuer und Auslagen. Der größere Kostenblock ist meist nicht die Beurkundung, sondern der Weg zur Einigung davor – anwaltliche Entwürfe und Verhandlungen auf beiden Seiten.",
    },
    {
      question: "Muss eine Scheidungsfolgenvereinbarung notariell beurkundet werden?",
      answer:
        "Nicht pauschal, aber bei den meisten wichtigen Punkten: Regelungen zum Zugewinnausgleich, zum Versorgungsausgleich, zum nachehelichen Unterhalt vor Rechtskraft der Scheidung, zur Übertragung von Grundeigentum sowie ein Pflichtteilsverzicht sind beurkundungspflichtig. Enthält die Vereinbarung auch nur einen dieser Punkte, muss in der Regel die gesamte Urkunde beurkundet werden.",
    },
    {
      question:
        "Was ist der Unterschied zwischen Trennungsvereinbarung und Scheidungsfolgenvereinbarung?",
      answer:
        "Vor allem der Zeitpunkt. Die Trennungsvereinbarung regelt die Zeit ab der Trennung – wer wohnt wo, Trennungsunterhalt, Hausrat, Umgang. Die Scheidungsfolgenvereinbarung regelt, was nach der Ehe gelten soll: Zugewinn, Versorgungsausgleich, nachehelicher Unterhalt. Inhaltlich überschneiden sie sich stark, und eine Trennungsvereinbarung kann bestimmen, dass ihre Regelungen fortgelten.",
    },
    {
      question: "Brauchen wir für eine Scheidungsfolgenvereinbarung einen Anwalt?",
      answer:
        "Vorgeschrieben ist es nicht, sinnvoll fast immer. Der Notar beurkundet und belehrt beide Seiten neutral, er berät aber keine Seite einseitig zu ihren Interessen. Gerade bei Verzichten – etwa auf Versorgungsausgleich oder nachehelichen Unterhalt – sollte jede Seite vorher wissen, worauf sie verzichtet. Für die Scheidung selbst braucht mindestens eine Seite ohnehin anwaltliche Vertretung.",
    },
    {
      question: "Kann eine Scheidungsfolgenvereinbarung später geändert oder angefochten werden?",
      answer:
        "Ändern können Sie sie jederzeit einvernehmlich, in derselben Form wie den ursprünglichen Vertrag. Einseitig angreifbar ist sie nur in engen Grenzen: etwa wenn eine Seite grob einseitig belastet wird und die Vereinbarung deshalb als sittenwidrig unwirksam ist, oder wenn wesentliche Umstände verschwiegen wurden. Regelungen zu Sorge und Umgang kann das Familiengericht am Kindeswohl orientiert abändern.",
    },
    {
      question: "Was passiert, wenn wir keine Scheidungsfolgenvereinbarung schließen?",
      answer:
        "Dann entscheidet über die strittigen Punkte das Familiengericht. Jede Folgesache, die ins Verfahren kommt, erhöht den Verfahrenswert und damit die Gerichts- und Anwaltsgebühren, und sie verlängert das Verfahren erheblich. Ohne Streitpunkte dauert eine einvernehmliche Scheidung wenige Monate; mit ihnen sind ein bis drei Jahre keine Seltenheit.",
    },
  ],
  related: [
    { label: "Trennungsvereinbarung: was hineingehört", href: "/ratgeber/trennungsvereinbarung" },
    { label: "Scheidung ohne Anwalt: geht das?", href: "/ratgeber/scheidung-ohne-anwalt" },
    { label: "Was steht mir bei der Scheidung zu?", href: "/ratgeber/was-steht-mir-bei-der-scheidung-zu" },
    { label: "Vermögen aufteilen bei Scheidung", href: "/ratgeber/vermoegensauseinandersetzung" },
    { label: "Haus verkaufen bei Scheidung oder Trennung", href: "/ratgeber/haus-bei-scheidung" },
    { label: "Trennungsjahr nachweisen", href: "/ratgeber/trennungsjahr-nachweisen" },
    { label: "Sorgerecht und Umgangsrecht regeln", href: "/ratgeber/sorgerecht-und-umgangsrecht" },
    { label: "Was kostet ein Mediator bei der Scheidung?", href: "/ratgeber/scheidung-mediator-kosten" },
    { label: "Kostenrechner: Gericht oder Einigung?", href: "/kostenrechner" },
    { label: "Trennung & Scheidung: Mediation im Überblick", href: "/konflikte/trennung" },
  ],
};
