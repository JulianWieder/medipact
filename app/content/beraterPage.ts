// app/content/beraterPage.ts
//
// Landingpage für Multiplikatoren (/fuer-berater): Steuerberater, Wirtschafts-
// prüfer, Notare, Nachfolge- und M&A-Berater.
//
// WARUM DIESE SEITE KEINE ZWEITE ODR-SEITE IST — bitte vor Änderungen lesen:
// /konflikte/odr spricht die Streitpartei an und trägt über den deepDive-Block
// bewusst allein die Suchphrase "Mediation bei Geschäftspartnern" (siehe
// odrPage.ts). Diese Seite hier spricht NICHT die Streitpartei an, sondern die
// Person, die daneben sitzt und den Konflikt zuerst sieht. Sie ist deshalb
// kein SEO-Duplikat, sondern ein Vertriebs-Asset: die URL, die nach einem
// Telefonat oder in einer Mail an eine Kanzlei geht.
//
// Daraus folgt für den Ton: Kein einziges Argument richtet sich an jemanden,
// der im Streit steckt. Die Sorge dieser Zielgruppe ist eine andere — sie
// lautet "verliere ich mein Mandat" und "ist das berufsrechtlich sauber".
// Genau diese zwei Fragen beantwortet die Seite zuerst, nicht zuletzt.
//
// Preise: Am 10.08.2026 entschieden und deshalb hier ausgeschrieben — für
// diese Zielgruppe ist die Zahl kein Detail, sondern der Satz, den sie im
// Mandantengespräch braucht. Gesellschafter-, Nachfolge- und Teamkonflikte
// kosten 1.900 €, der B2B-Vertragsstreit 1.200 €, jeweils einmalig für den
// Fall (pricing.py, "once"). Bei Änderung: hier UND in odrPage.ts, /preise
// und /ratgeber/online-dispute-resolution nachziehen.

export const beraterPageContent = {
  eyebrow: "Für Steuerberater, Wirtschaftsprüfer und Notare",
  title: "Wenn der Konflikt Ihr Mandat blockiert.",
  titleHighlight: "Wir übernehmen den Streit. Nicht das Mandat.",
  intro:
    "Ein Gesellschafterstreit, eine festgefahrene Nachfolge, eine Erbengemeinschaft, die sich nicht einigt: Sie merken es zuerst — weil der Jahresabschluss liegen bleibt, die Bewertung nicht abgestimmt wird oder Beschlüsse ausbleiben. Für den Konflikt selbst sind Sie nicht zuständig, und Sie wollen es auch nicht sein. medipact führt das Klärungsverfahren, Sie behalten die Beratung.",

  primaryCta: {
    label: "Fall unverbindlich einschätzen",
    href: "/kontakt",
  },

  secondaryCta: {
    label: "So läuft das Verfahren",
    href: "/methode",
  },

  featuresTitle: "Die Konstellationen, in denen Sie uns brauchen können",
  featuresIntro:
    "Alle haben dasselbe Muster: Fachlich ist der Fall lösbar, aber die Beteiligten reden nicht mehr miteinander — und solange das so bleibt, kommen Sie mit Ihrer eigenen Arbeit nicht weiter.",

  features: [
    {
      title: "Gesellschafterstreit und Patt",
      text: "Zwei Gesellschafter mit je 50 %, keine Beschlüsse, das operative Geschäft leidet. Sie können die Zahlen aufbereiten — entscheiden müssen die beiden, und genau das tun sie nicht mehr.",
    },
    {
      title: "Unternehmensnachfolge in der Familie",
      text: "Die Übergabe ist steuerlich durchgerechnet und scheitert trotzdem: weil ein Kind sich übergangen fühlt, weil der Senior nicht loslässt, weil niemand ausspricht, was alle denken.",
    },
    {
      title: "Erbengemeinschaft mit Betriebsvermögen",
      text: "Jeder Miterbe kann die Auseinandersetzung verlangen — und damit den Betrieb gefährden. Die Alternative ist eine Einigung, nicht ein besseres Gutachten.",
    },
    {
      title: "Ausstieg und Bewertung",
      text: "Über die Methode ließe sich reden, über den Preis auch. Aber solange es in Wahrheit um Anerkennung und Kränkung geht, bewegt sich keine Zahl.",
    },
    {
      title: "Trennung mit gemeinsamer Firma",
      text: "Privat getrennt, geschäftlich verbunden. Zwei Verfahren, die sich gegenseitig blockieren, wenn sie getrennt geführt werden.",
    },
    {
      title: "Blockierter Abschluss",
      text: "Feststellung, Entlastung, Gewinnverwendung: Wenn ein Konflikt formale Beschlüsse aufhält, wird aus einem persönlichen Streit ein Terminproblem — auch Ihres.",
    },
  ],

  bulletsTitle: "Woran Sie erkennen, dass es kein Rechtsfall ist",
  bullets: [
    "Die Rechtslage ist im Kern unstrittig — gestritten wird trotzdem.",
    "Beide Seiten haben recht, und beide haben Belege dafür.",
    "Es gab schon einen Vorschlag, den sachlich niemand ablehnen konnte. Er wurde abgelehnt.",
    "Die Beteiligten müssen auch danach miteinander weiterarbeiten oder sich zumindest weiter begegnen.",
    "Was gefordert wird, ist keine Leistung, sondern eine Anerkennung.",
  ],
  note:
    "Trifft davon nichts zu, ist Mediation vermutlich das falsche Instrument — dann sagen wir Ihnen das auch. Ein Verfahren, das erkennbar nicht passt, schadet Ihrem Mandanten und unserem Namen gleichermaßen.",
  links: [
    { label: "Die Methode im Detail", href: "/methode" },
    { label: "Preise und Leistungsumfang", href: "/preise" },
    { label: "Fallbeispiel: Gesellschafter-Patt", href: "/cases/gesellschafter-streit" },
    { label: "Fallbeispiel: Unternehmen geerbt", href: "/cases/unternehmen-geerbt" },
  ],

  processTitle: "Wie eine Empfehlung praktisch abläuft",
  process: [
    {
      title: "Anruf, ohne Namen",
      text: "Sie schildern die Konstellation anonymisiert. Wir sagen Ihnen, ob das Verfahren passt — und wenn nicht, woran es liegt. Das kostet nichts und verpflichtet zu nichts.",
    },
    {
      title: "Sie stellen den Kontakt her",
      text: "Entweder Sie geben die Seite weiter, oder Sie nennen uns die Beteiligten und wir schreiben beide Seiten neutral an. Der zweite Weg ist oft leichter, weil die Einladung dann nicht von einer Seite kommt.",
    },
    {
      title: "Das Verfahren läuft ohne Sie",
      text: "Beide Parteien arbeiten getrennt und schriftlich, begleitet von einer Mediatorin oder einem Mediator. Sie müssen an keinem Termin teilnehmen und keine Unterlagen liefern.",
    },
    {
      title: "Das Ergebnis kommt zu Ihnen zurück",
      text: "Am Ende steht eine schriftliche Vereinbarung. Was daraus steuerlich, gesellschaftsrechtlich oder notariell umzusetzen ist, machen Sie — genau wie vorher.",
    },
  ],

  comparisonTitle: "Wer was macht",
  comparisonIntro:
    "Die Abgrenzung ist der wichtigste Teil dieser Seite. Sie ist bewusst eng gezogen: Wir machen keine Rechts-, Steuer- oder Unternehmensberatung, und wir wollen Ihr Mandat nicht.",
  comparisonPlans: [
    {
      title: "Das übernimmt medipact",
      status: "Das Verfahren",
      features: [
        "Beide Seiten getrennt und vertraulich anhören",
        "Themen, Interessen und Optionen strukturiert erarbeiten",
        "Moderierte Verhandlung, schriftlich und in klaren Phasen",
        "Schriftliche Abschlussvereinbarung als Ergebnis",
      ],
      featured: true,
    },
    {
      title: "Das bleibt bei Ihnen",
      status: "Die Beratung",
      features: [
        "Steuerliche und betriebswirtschaftliche Bewertung",
        "Gesellschaftsrechtliche Gestaltung und Vertragsentwurf",
        "Beurkundung, Registeranmeldungen, Umsetzung",
        "Das Mandantenverhältnis — vor, während und nach dem Verfahren",
      ],
    },
    {
      title: "Das macht niemand nebenbei",
      status: "Die Grenzen",
      features: [
        "Rechtsberatung im Verfahren: findet nicht statt",
        "Eine Anteilsübertragung bleibt beurkundungspflichtig (§ 15 GmbHG)",
        "Bei laufenden Fristen ersetzt Mediation keinen anwaltlichen Rat",
        "Wer nicht will, wird nicht überzeugt — Teilnahme ist freiwillig",
      ],
    },
  ],

  trustTitle: "Warum eine Empfehlung Sie nichts kostet",
  trustPoints: [
    {
      title: "Keine Provision, in keine Richtung",
      text: "Wir zahlen keine Vermittlungsprovision und nehmen keine. Das ist Absicht: Eine Empfehlung, an der Sie verdienen, müssten Sie berufsrechtlich prüfen und Ihrem Mandanten offenlegen. So bleibt es das, was es sein soll — ein fachlicher Hinweis.",
    },
    {
      title: "Kein Zugriff auf Ihr Mandat",
      text: "medipact berät nicht steuerlich, rechtlich oder betriebswirtschaftlich und bietet Ihren Mandanten keine Leistung an, die mit Ihrer konkurriert. Wir sehen die Beteiligten im Verfahren und danach nicht wieder.",
    },
    {
      title: "Strikt vertraulich",
      text: "Mediatorinnen und Mediatoren unterliegen der gesetzlichen Verschwiegenheitspflicht (§ 4 Mediationsgesetz). Es gibt keine öffentliche Verhandlung, kein Aktenzeichen und nichts, was am Markt sichtbar wird.",
    },
    {
      title: "Fester Preis, vorab bekannt",
      text: "1.900 € für einen Gesellschafter-, Nachfolge- oder Teamkonflikt, 1.200 € für einen B2B-Vertragsstreit — einmalig für den Fall, nicht pro Partei, und unabhängig davon, wie lange gestritten wird. Das ist der Satz, den Sie im Mandantengespräch brauchen: Ein offener Stundenrahmen ist genau das, wovor Ihre Mandanten zurückschrecken.",
    },
  ],

  faqTitle: "Was Berater uns typischerweise fragen",
  faqs: [
    {
      question: "Verliere ich mein Mandat, wenn ich medipact empfehle?",
      answer:
        "Nein. medipact führt ausschließlich das Klärungsverfahren und erbringt keine steuerliche, rechtliche oder betriebswirtschaftliche Beratung. Alles, was aus der Einigung folgt — Bewertung, Vertragsgestaltung, Umsetzung, Beurkundung —, bleibt bei Ihnen. In der Praxis ist es eher umgekehrt: Ein gelöster Konflikt macht die Arbeit am Mandat überhaupt erst wieder möglich.",
    },
    {
      question: "Gibt es eine Provision für die Empfehlung?",
      answer:
        "Nein, bewusst nicht. Eine Vermittlungsprovision würde Sie in eine Offenlegungs- und berufsrechtliche Prüfpflicht bringen und den Charakter der Empfehlung verändern. Wir zahlen keine und nehmen keine.",
    },
    {
      question: "Ersetzt die Mediation den Anwalt oder den Notar?",
      answer:
        "Nein. Die Mediation klärt, worüber sich die Beteiligten einigen. Die rechtliche Prüfung und die formale Umsetzung bleiben davon unberührt: Eine Übertragung von GmbH-Anteilen ist weiterhin beurkundungspflichtig (§ 15 GmbHG), und bei laufenden Fristen sollte parallel anwaltlich beraten werden.",
    },
    {
      question: "Was kostet das meinen Mandanten?",
      answer:
        "Ein Gesellschafter-, Nachfolge- oder Teamkonflikt kostet 1.900 €, ein B2B-Vertragsstreit 1.200 € — jeweils einmalig für den gesamten Fall und nicht pro Partei. Der Betrag steht vor dem ersten Gespräch fest, unabhängig von Dauer und Zahl der Themen. Zum Vergleich: Ein Gesellschafterprozess über mehrere Instanzen erreicht schnell einen fünfstelligen Betrag, und die Kosten laufen weiter, während das Unternehmen blockiert ist.",
    },
    {
      question: "Was passiert, wenn die Mediation scheitert?",
      answer:
        "Dann steht keine Vereinbarung, und der Rechtsweg ist unverändert offen — nichts, was im Verfahren gesagt wurde, kann später gegen eine Seite verwendet werden. In vielen Fällen bleibt trotzdem etwas übrig: eine Teilvereinbarung, ein geklärter Sachstand oder schlicht die Erkenntnis, worüber wirklich gestritten wird.",
    },
    {
      question: "Wie lange dauert ein Verfahren?",
      answer:
        "Das Verfahren läuft asynchron und schriftlich, die Beteiligten arbeiten in ihrem eigenen Tempo. Üblich sind Wochen, nicht Monate — vor allem, weil keine gemeinsamen Termine gefunden werden müssen. Ein Gesellschafterprozess über mehrere Instanzen dauert Jahre.",
    },
    {
      question: "Muss ich als empfehlende Person etwas tun?",
      answer:
        "Nein. Sie können den Kontakt herstellen und sich danach heraushalten. Wenn Ihre Mandanten es ausdrücklich wünschen, können Sie über den Stand informiert werden — ohne diese Zustimmung erfahren Sie nichts, auch das folgt aus der Vertraulichkeit des Verfahrens.",
    },
    {
      question: "Für welche Konflikte passt das Verfahren nicht?",
      answer:
        "Wenn eine Seite nicht teilnehmen will, wenn eine Grundsatzentscheidung mit Präzedenzwirkung gebraucht wird, wenn Straftaten im Raum stehen oder wenn eine laufende Frist sofortiges Handeln verlangt. In diesen Fällen sagen wir ab.",
    },
  ],

  finalCtaTitle: "Schildern Sie den Fall, bevor Sie ihn weitergeben.",
  finalCtaText:
    "Ein kurzes Gespräch, anonymisiert und unverbindlich: Wir sagen Ihnen, ob das Verfahren zu dieser Konstellation passt — und wenn nicht, was stattdessen trägt.",
  finalCta: {
    label: "Fall einschätzen lassen",
    href: "/kontakt",
  },
};
