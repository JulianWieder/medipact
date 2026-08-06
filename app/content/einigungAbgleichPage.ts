// app/content/einigungAbgleichPage.ts
//
// Die Mechanismus-Seite des Clusters.
//
// Warum sie existiert: Der gewichtete Abgleich ist der einzige Teil des
// Produkts, den kein Wettbewerber so hat — und er wurde bis dahin NIRGENDS
// beworben. Er stand nur im Produkt selbst (AbgleichBlock.tsx) und in einem
// Nebensatz auf /methode. Genau dieser Mechanismus trägt das
// Intelligenz-Argument, ohne dass das Wort fallen muss: Wer erklären kann,
// wie gerechnet wird, muss nicht behaupten, dass gerechnet wird.
//
// WICHTIG bei Änderungen: Jede Aussage hier muss dem tatsächlichen Verhalten
// in app/dashboard/[id]/_shared/AbgleichBlock.tsx entsprechen — insbesondere
// (a) das begrenzte Gewichtungs-Kontingent, (b) dass fremde Gewichtungen erst
// sichtbar werden, wenn ALLE gewichtet haben, und (c) dass die Zustimmung per
// Signatur an Punkten UND Gewichtungen hängt. Ändert sich der Mechanismus,
// ändert sich diese Seite mit.

export const einigungAbgleichPageContent = {
  eyebrow: "Abgleich & Tausch",
  title: "Wo sonst verhandelt wird,",
  titleHighlight: "wird hier gerechnet.",
  intro:
    "Am Ende jeder Mediation bleiben ein paar Punkte übrig, bei denen beide Seiten etwas anderes wollen. Üblicherweise entscheidet dort, wer besser verhandelt, länger durchhält oder den teureren Anwalt hat. Bei uns entscheidet, wem was wirklich wichtig ist — und das lässt sich messen, ohne dass es jemand einschätzen muss.",

  primaryCta: {
    label: "Kostenlos starten",
    href: "/auth/register",
  },

  secondaryCta: {
    label: "Zum Einigungsprozess",
    href: "/einigung",
  },

  featuresTitle: "Warum Verhandeln so oft schiefgeht",
  featuresIntro:
    "Die vier Muster, an denen Einigungen scheitern — und zwar unabhängig davon, ob es um einen Zaun oder um Gesellschaftsanteile geht.",

  features: [
    {
      title: "Alles ist angeblich unverzichtbar",
      text: "Solange jede Seite jeden Punkt für existenziell erklärt, gibt es nichts zu tauschen. Das ist keine Bosheit, sondern Verhandlungslogik: Wer früh nachgibt, verliert. Genau deshalb kommen Gespräche zum Stillstand, in denen beide Seiten eigentlich einigungsbereit sind.",
    },
    {
      title: "Wer zuerst nachgibt, verliert doppelt",
      text: "Ein Zugeständnis wird selten mit einem Gegenzugeständnis beantwortet, sondern als neuer Ausgangspunkt behandelt. Deshalb hält jede Seite so lange fest, bis niemand mehr weiß, was wem wirklich wichtig war.",
    },
    {
      title: "Ausdauer schlägt Argument",
      text: "In langen Verhandlungen gewinnt oft, wer mehr Zeit, mehr Geld oder weniger zu verlieren hat. Das Ergebnis ist dann nicht fair, es ist nur beendet — und hält entsprechend selten.",
    },
    {
      title: "Beide reden über Positionen, nicht über Wert",
      text: "Zwei Seiten streiten über denselben Gegenstand, meinen aber Unterschiedliches damit. Solange niemand das Ausmaß der Wichtigkeit sichtbar macht, sieht ein lösbarer Konflikt aus wie ein unlösbarer.",
    },
  ],

  deepDive: {
    eyebrow: "Der Mechanismus",
    title: "Vier Schritte, und keiner davon ist Verhandlungsgeschick",
    intro:
      "Der Abgleich greift erst, wenn der eigentliche Mediationsprozess seine Arbeit getan hat: Themen sind sortiert, Interessen geklärt, das meiste ist einvernehmlich. Übrig bleibt eine überschaubare Liste echter Gegensätze. Für genau diese Liste ist der Abgleich gebaut.",
    items: [
      {
        title: "1 — Nur die strittigen Punkte kommen hinein",
        text: "Was beide Seiten bereits gleich sehen, taucht im Abgleich gar nicht erst auf. Das klingt banal, ist aber der Grund, warum die Liste kurz bleibt und die Gewichtung überhaupt aussagekräftig wird. In einer freien Verhandlung wird dagegen alles wieder aufgemacht, sobald ein Punkt strittig ist.",
      },
      {
        title: "2 — Jede Seite gewichtet für sich, mit begrenztem Kontingent",
        text: "Sie geben für jeden strittigen Punkt an, wie wichtig er Ihnen ist. Entscheidend: Sie können nicht alles für unverzichtbar erklären. Das Kontingent ist begrenzt, und das ist Absicht — wäre alles unverzichtbar, gäbe es nichts zu tauschen und der Abgleich liefe leer. Diese eine Einschränkung erzwingt genau die Ehrlichkeit, die in freien Verhandlungen niemand freiwillig aufbringt.",
      },
      {
        title: "3 — Die Gewichtung der Gegenseite bleibt verborgen",
        text: "Solange nicht beide Seiten fertig gewichtet haben, sieht niemand die Zahlen der anderen. Sonst würde sich die zweite Seite an der ersten orientieren — und die Gewichtung wäre wertlos, weil sie dann Taktik abbildet statt Wichtigkeit. Erst wenn alle geliefert haben, wird gegenübergestellt.",
      },
      {
        title: "4 — Aus beiden Gewichtungen entsteht ein Vorschlag",
        text: "Wo eine Seite deutlich stärker gewichtet als die andere, entscheidet diese Gewichtung. Wo beide gleich stark ziehen, wird getauscht: Sie bekommen den Punkt, der Ihnen wichtiger ist, die andere Seite den, der ihr wichtiger ist. Das Ergebnis ist kein Kompromiss, bei dem beide gleich viel verlieren, sondern ein Tausch, bei dem beide das Wichtigere behalten.",
      },
    ],
    bulletsTitle: "Was dieser Mechanismus verändert",
    bullets: [
      "Nachgeben wird nicht bestraft: Wer einen Punkt niedrig gewichtet, bekommt dafür an anderer Stelle mehr Gewicht.",
      "Ausdauer nützt nichts mehr — die Zahlen stehen fest, sobald beide geliefert haben.",
      "Beide Seiten müssen sich entscheiden, was ihnen wirklich wichtig ist. Das ist unbequem und genau der Punkt.",
      "Der Vorschlag ist nachvollziehbar: Man sieht, warum er so aussieht, und nicht nur, dass er so aussieht.",
      "Niemand muss die Gegenseite einschätzen — sie sagt es selbst, unter einer Regel, die Übertreibung teuer macht.",
      "Es braucht keinen Dritten, der entscheidet, was angemessen ist.",
    ],
    note:
      "Fachlich heißt dieses Prinzip Logrolling: Statt jeden strittigen Punkt einzeln zu halbieren, wird über mehrere Punkte hinweg getauscht. Es ist seit Jahrzehnten Standard in der Verhandlungsforschung und Kern des Harvard-Konzepts — nur wird es in der Praxis fast nie angewendet, weil es voraussetzt, dass beide Seiten ihre Prioritäten offenlegen. Genau das leistet das begrenzte Kontingent.",
    links: [
      { label: "Der Einigungsprozess im Überblick", href: "/einigung" },
      { label: "Warum beide Seiten gleich behandelt werden", href: "/einigung/gleichbehandlung" },
      { label: "Wie weit kommt man ohne Mediator?", href: "/einigung/ohne-mediator" },
      { label: "Ratgeber: Die 5 Phasen der Mediation", href: "/ratgeber/5-phasen-der-mediation" },
    ],
  },

  processTitle: "Was danach passiert",
  process: [
    {
      title: "Der Vorschlag steht für beide sichtbar",
      text: "Beide Seiten sehen dasselbe Ergebnis, dieselben Gewichtungen und dieselbe Herleitung. Es gibt keine Version für die eine und eine für die andere Seite.",
    },
    {
      title: "Zustimmung, die an den Zahlen hängt",
      text: "Die Zustimmung wird an die strittigen Punkte und an alle Gewichtungen gebunden. Ändert jemand hinterher seine Gewichtung, passt die Zustimmung nicht mehr und muss erneuert werden. Niemand kann einer Rechnung zustimmen und danach die Zahlen tauschen.",
    },
    {
      title: "Aus dem Vorschlag wird die Vereinbarung",
      text: "Was beide bestätigt haben, geht direkt in die Abschlussvereinbarung ein — ohne dass es jemand neu formulieren müsste.",
    },
  ],

  trustTitle: "Grenzen des Verfahrens",
  trustPoints: [
    {
      title: "Es ersetzt kein Urteil über Angemessenheit",
      text: "Der Abgleich zeigt, was beiden Seiten wichtig ist. Er sagt nicht, ob ein Ergebnis rechtlich zulässig oder wirtschaftlich klug ist. Diese Bewertung bleibt bei Ihnen — und bei rechtlich heiklen Themen bei einem Anwalt.",
    },
    {
      title: "Es setzt zwei verhandlungsfähige Seiten voraus",
      text: "Gewichtung funktioniert nur, wenn beide Seiten frei angeben können, was ihnen wichtig ist. Wo eine Seite unter Druck steht, misst der Abgleich diesen Druck mit — nicht die Wichtigkeit.",
    },
    {
      title: "Der Vorschlag ist ein Vorschlag",
      text: "Niemand ist an das Ergebnis gebunden, bevor er zugestimmt hat. Lehnen Sie ab, wird weiterverhandelt oder das Verfahren endet ohne Einigung.",
    },
  ],

  faqTitle: "Häufige Fragen zum Abgleich",
  faqs: [
    {
      question: "Kann ich nicht einfach alles als sehr wichtig einstufen?",
      answer:
        "Nein, und das ist der entscheidende Punkt. Das Gewichtungs-Kontingent ist begrenzt: Wer einen Punkt hoch gewichtet, hat für die übrigen weniger übrig. Wäre alles unverzichtbar, gäbe es nichts zu tauschen und der Abgleich liefe leer — die Begrenzung ist kein technisches Limit, sondern der Mechanismus selbst.",
    },
    {
      question: "Sehe ich, wie die andere Seite gewichtet hat?",
      answer:
        "Erst dann, wenn beide Seiten fertig sind. Vorher bleiben die Zahlen der Gegenseite verborgen. Sonst würde sich die zweite Seite an der ersten ausrichten, und die Gewichtung würde Taktik abbilden statt Wichtigkeit.",
    },
    {
      question: "Was passiert, wenn beide denselben Punkt gleich hoch gewichten?",
      answer:
        "Dann entscheidet der Abgleich diesen Punkt nicht, sondern verrechnet ihn über die anderen: Wo beide gleich stark ziehen, wird getauscht. Bleibt ein echter Gleichstand bestehen, ist das ein Punkt, über den weiter gesprochen werden muss — und dann wissen beide Seiten wenigstens, dass es genau dieser eine ist.",
    },
    {
      question: "Kann ich meine Gewichtung nachträglich ändern?",
      answer:
        "Ja, aber nicht folgenlos. Die Zustimmung zum Vorschlag hängt per Signatur an den strittigen Punkten und an allen Gewichtungen. Ändert jemand seine Gewichtung, passt die bereits erteilte Zustimmung nicht mehr und muss erneuert werden.",
    },
    {
      question: "Ist das nicht einfach ein Algorithmus, der über meinen Streit entscheidet?",
      answer:
        "Entschieden wird ausschließlich aus Ihren eigenen Angaben und denen der Gegenseite — es gibt keine Bewertung von außen, keine Empfehlung und kein Urteil darüber, wer recht hat. Der Vorschlag ist die Auswertung von zwei Gewichtungen und wird erst verbindlich, wenn beide Seiten ihm zustimmen.",
    },
    {
      question: "Funktioniert das auch bei Geld?",
      answer:
        "Ja, und dort besonders gut. Geldfragen sind selten nur Geldfragen: Wann gezahlt wird, in welchen Raten, ob eine Summe als Ausgleich oder als Anerkennung verstanden wird — das sind mehrere Punkte, über die getauscht werden kann, statt einen Betrag stur zu halbieren.",
    },
  ],

  finalCtaTitle: "Der Abgleich steht am Ende. Der Anfang ist kostenlos.",
  finalCtaText:
    "Fall anlegen, Konflikt schildern, Gegenseite einladen — bis dahin zahlen Sie nichts. Erst danach beginnt der bezahlte Prozess, zum Festpreis.",
  finalCta: {
    label: "Kostenlos starten",
    href: "/auth/register",
  },
};
