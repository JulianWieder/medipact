// app/content/einigungGleichbehandlungPage.ts
//
// Die Vertrauens-Seite des Clusters.
//
// Warum sie existiert: Ohne sie liest sich "Einigung ohne Mediator" als
// "Einigung ohne Schutz". Sie ist die Voraussetzung dafür, dass die anderen
// drei Seiten überhaupt zumutbar sind — und sie ist die EINZIGE Seite im
// Cluster, auf der KI explizit benannt wird. Überall sonst wird der
// Mechanismus beschrieben, nicht die Technologie; hier gehört die Technologie
// hin, weil Transparenz darüber Teil des Vertrauens ist.

export const einigungGleichbehandlungPageContent = {
  eyebrow: "Fairness by design",
  title: "Neutralität,",
  titleHighlight: "die nicht von der Tagesform abhängt.",
  intro:
    "Ein Mediator ist neutral, weil er sich darum bemüht — und weil er gut ausgebildet ist, gelingt ihm das meistens. Ein Prozess ist neutral, weil er für beide Seiten derselbe ist. Das ist die schwächere Form von Neutralität in schwierigen Momenten und die verlässlichere in allen anderen.",

  primaryCta: {
    label: "Kostenlos starten",
    href: "/auth/register",
  },

  secondaryCta: {
    label: "Zum Einigungsprozess",
    href: "/einigung",
  },

  featuresTitle: "Vier Regeln, die für beide Seiten gelten",
  featuresIntro:
    "Keine davon ist eine Zusage, die jemand einhalten muss. Es sind Eigenschaften des Ablaufs — sie gelten auch dann, wenn niemand hinschaut.",

  features: [
    {
      title: "Identische Schritte für beide",
      text: "Niemand bekommt eine andere Reihenfolge, andere Fragen oder mehr Zeit. Wer den Fall angelegt hat, hat keinen Vorsprung im Verfahren. Das klingt selbstverständlich und ist es nicht: In der Praxis prägt die Seite, die zuerst schildert, oft den gesamten Rahmen.",
    },
    {
      title: "Vertrauliches bleibt vertraulich",
      text: "Was Sie als private Notiz eingeben, sieht die Gegenseite nicht — auch nicht in zusammengefasster Form. Bei jedem Eingabefeld steht, ob es geteilt wird. Das ist wichtiger, als es klingt: Ohne einen Ort für unfertige Gedanken schreibt niemand ehrlich.",
    },
    {
      title: "Niemand sieht die Karten des anderen zu früh",
      text: "Antworten und Gewichtungen werden erst gegenübergestellt, wenn beide Seiten geliefert haben. Wer später dran ist, kann sich nicht an der ersten Seite ausrichten — und wer zuerst liefert, wird dafür nicht bestraft.",
    },
    {
      title: "Alles bleibt nachlesbar",
      text: "Jeder Schritt, jede Zusage und jede Änderung ist dokumentiert und für beide Seiten einsehbar. Es gibt kein Das haben Sie damals aber anders gesagt — der häufigste Satz in festgefahrenen Konflikten wird schlicht überflüssig.",
    },
  ],

  deepDive: {
    eyebrow: "Transparenz",
    title: "Was die Technik tut — und was sie ausdrücklich nicht tut",
    intro:
      "medipact setzt Sprachmodelle ein: beim Versachlichen von Formulierungen, beim Sortieren von Themen, beim Zusammenfassen einer Phase und beim Erzeugen von Optionsvorschlägen. Weil das für die Fairness des Verfahrens relevant ist, steht hier, wo genau — statt es als Feature zu bewerben oder es zu verschweigen.",
    items: [
      {
        title: "Sie schlägt vor, sie entscheidet nicht",
        text: "Zusammenfassungen, Optionen und Formulierungen sind Vorschläge, die beide Seiten prüfen, ändern oder ablehnen können. Kein Ergebnis wird verbindlich, ohne dass beide Seiten ausdrücklich zugestimmt haben. Es gibt an keiner Stelle im Verfahren eine automatische Entscheidung über einen strittigen Punkt.",
      },
      {
        title: "Sie bewertet nicht, wer recht hat",
        text: "Es gibt keine Einschätzung der Rechtslage, keine Erfolgsprognose und kein Urteil darüber, welche Seite angemessener argumentiert. Das ist keine technische Beschränkung, sondern eine bewusste: Eine Partei, die sich beurteilt fühlt, hört auf zu verhandeln.",
      },
      {
        title: "Sie arbeitet für beide Seiten gleich",
        text: "Dieselben Schritte, dieselben Fragen, dieselbe Versachlichung — unabhängig davon, wer den Fall angelegt hat und wer bezahlt. Auch dann, wenn eine Partei für die andere mitbezahlt, entsteht daraus kein Vorrang im Verfahren.",
      },
      {
        title: "Der Abgleich rechnet, er interpretiert nicht",
        text: "Der Einigungsvorschlag bei strittigen Punkten entsteht ausschließlich aus den Gewichtungen, die beide Seiten selbst gesetzt haben. Kein Modell entscheidet dort mit, und keine Seite kann die Auswertung beeinflussen, ohne ihre eigene Gewichtung zu ändern.",
      },
      {
        title: "Datenschutz",
        text: "Die Verarbeitung erfolgt DSGVO-konform, verschlüsselt und ohne dass Ihre Inhalte zum Training öffentlicher Modelle verwendet werden. Was im Einzelnen verarbeitet und wie lange gespeichert wird, steht in der Datenschutzerklärung — nicht nur zusammengefasst, sondern vollständig.",
      },
    ],
    bulletsTitle: "Was ein Mensch entscheidet, nicht das System",
    bullets: [
      "Ob eine Vereinbarung zustande kommt — beide Parteien, durch ausdrückliche Zustimmung.",
      "Ob ein Vorschlag angemessen ist — die Parteien, im Zweifel mit anwaltlicher Prüfung.",
      "Ob ein Verfahren fortgeführt werden kann, wenn es eskaliert — der Mediator.",
      "Ob ein Fall überhaupt für Mediation geeignet ist — Sie selbst, unterstützt durch den Schnell-Check.",
      "Was vertraulich bleibt — Sie, an jedem einzelnen Eingabefeld.",
    ],
    note:
      "Verantwortung lässt sich nicht an Software delegieren. Deshalb ist an keiner Stelle des Verfahrens vorgesehen, dass etwas verbindlich wird, ohne dass ein Mensch zugestimmt hat.",
    links: [
      { label: "Datenschutzerklärung", href: "/datenschutz" },
      { label: "Der gewichtete Abgleich", href: "/einigung/abgleich" },
      { label: "Wie weit kommt man ohne Mediator?", href: "/einigung/ohne-mediator" },
      { label: "Der Einigungsprozess im Überblick", href: "/einigung" },
    ],
  },

  processTitle: "Drei Stellen, an denen Verfahren sonst kippen",
  process: [
    {
      title: "Der erste Eindruck",
      text: "Wer zuerst schildert, prägt sonst den Rahmen. Hier bringen beide Seiten unabhängig voneinander ein, worum es aus ihrer Sicht geht — bevor eine gemeinsame Themenliste entsteht.",
    },
    {
      title: "Der Ton",
      text: "Ein einziger scharfer Satz kann ein Verfahren beenden. Versachlichung greift in beide Richtungen und für beide Seiten gleich — nicht nur bei der Partei, die als schwieriger gilt.",
    },
    {
      title: "Der Schluss",
      text: "Zustimmungen hängen an den Inhalten, auf die sie sich beziehen. Ändert sich der Inhalt, verfällt die Zustimmung. Nachträgliche Verschiebungen sind damit nicht bloß unfair, sondern technisch wirkungslos.",
    },
  ],

  trustTitle: "Was Neutralität hier bedeutet",
  trustPoints: [
    {
      title: "Nicht unparteiisch gemeint, sondern gleich gebaut",
      text: "Der Prozess kennt keine Sympathie und keinen schlechten Tag. Er behandelt beide Seiten identisch, weil er gar nicht anders kann.",
    },
    {
      title: "Nachprüfbar statt versprochen",
      text: "Jeder Schritt ist dokumentiert. Sie müssen niemandem glauben, dass es fair zugegangen ist — Sie können es nachlesen.",
    },
    {
      title: "Wo Struktur nicht reicht, kommt ein Mensch",
      text: "Bei Machtungleichgewicht, Druck oder Angst hilft Gleichbehandlung im Ablauf nicht weiter. Diese Grenze benennen wir ausdrücklich, statt sie zu überspielen.",
    },
  ],

  faqTitle: "Häufige Fragen zu Fairness und Daten",
  faqs: [
    {
      question: "Wer sieht meine Eingaben?",
      answer:
        "Nur, was ausdrücklich geteilt ist, erreicht die Gegenseite. Private Notizen bleiben privat und fließen auch nicht in Zusammenfassungen für die andere Seite ein. An jedem Eingabefeld ist erkennbar, ob es geteilt wird.",
    },
    {
      question: "Hat die Partei, die bezahlt, mehr Rechte im Verfahren?",
      answer:
        "Nein. Der Ablauf ist für beide Seiten identisch, unabhängig davon, wer den Fall angelegt hat und wer die Kosten trägt. Auch bei Kostenübernahme durch eine Partei entsteht daraus kein Vorrang.",
    },
    {
      question: "Werden meine Inhalte zum Training von KI-Modellen verwendet?",
      answer:
        "Nein. Die Verarbeitung erfolgt DSGVO-konform und ohne Freigabe Ihrer Inhalte für das Training öffentlicher Modelle. Details stehen in der Datenschutzerklärung.",
    },
    {
      question: "Kann die KI entscheiden, wer recht hat?",
      answer:
        "Sie ist dafür weder vorgesehen noch eingesetzt. Es gibt keine Bewertung der Rechtslage, keine Erfolgsprognose und kein Urteil über die Angemessenheit einer Position. Verbindlich wird ausschließlich, wozu beide Seiten ausdrücklich zustimmen.",
    },
    {
      question: "Was, wenn ich der Zusammenfassung nicht zustimme?",
      answer:
        "Dann korrigieren Sie sie. Zusammenfassungen sind Arbeitsstände, keine Feststellungen — sie sind für beide Seiten sichtbar und für beide Seiten änderbar, solange die Phase läuft.",
    },
    {
      question: "Ist das Verfahren vertraulich gegenüber Dritten?",
      answer:
        "Ja. Inhalte des Verfahrens sind vertraulich und für Außenstehende nicht einsehbar. Ob und wie sie in einem späteren Gerichtsverfahren verwendet werden dürfen, ist eine rechtliche Frage, die vom Einzelfall abhängt — klären Sie das im Zweifel anwaltlich, bevor Sie sensible Punkte einbringen.",
    },
  ],

  finalCtaTitle: "Fairness können Sie nachlesen, nicht nur glauben.",
  finalCtaText:
    "Legen Sie einen Fall an und sehen Sie sich an, wie das Verfahren mit Ihren Angaben umgeht. Bis zum Start des bezahlten Prozesses kostet das nichts.",
  finalCta: {
    label: "Kostenlos starten",
    href: "/auth/register",
  },
};
