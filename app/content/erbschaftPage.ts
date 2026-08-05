// app/content/erbschaftPage.ts

import { erbschaftFacts } from "@/app/components/ui/DidYouKnowSection";

export const erbschaftPageContent = {
  eyebrow: "Erbschafts-Konflikt",
  title: "Wenn ein Nachlass zur Belastungsprobe wird.",
  titleHighlight: "Kläre Erbe, Familie und Gerechtigkeit.",
  intro:
    "Erbschaften sind selten nur eine Vermögensfrage. Oft treffen Trauer, Erwartungen, alte Rollen und unterschiedliche Vorstellungen von Fairness aufeinander.",

  primaryCta: {
    label: "Erbschaftskonflikt einschätzen",
    href: "#cta",
  },

  secondaryCta: {
    label: "Zur Übersicht",
    href: "/konflikte",
  },

  featuresTitle: "Typische Herausforderungen",
  featuresIntro:
    "Erbschaftskonflikte eskalieren häufig, weil sachliche und emotionale Themen untrennbar vermischt sind.",

  features: [
    {
      title: "Unterschiedliche Erwartungen",
      text: "Einige wollen verkaufen, andere behalten. Einige fühlen sich benachteiligt, andere übergangen.",
    },
    {
      title: "Alte Familienmuster",
      text: "Konflikte aus der Vergangenheit tauchen wieder auf und blockieren sachliche Entscheidungen.",
    },
    {
      title: "Immobilien oder Unternehmen",
      text: "Besonders schwierig wird es, wenn Vermögen nicht einfach teilbar ist oder Verantwortung damit verbunden ist.",
    },
    {
      title: "Einer hat gepflegt, alle erben gleich",
      text: "Wer die Eltern jahrelang versorgt hat, empfindet eine rechnerisch gleiche Teilung selten als gerecht. Rechtlich ist der Ausgleichsanspruch eng begrenzt – als Thema bleibt er trotzdem im Raum.",
    },
    {
      title: "Niemand kennt den vollständigen Nachlass",
      text: "Konten, Lebensversicherungen, Schenkungen zu Lebzeiten, Schulden: Solange die Aufstellung unvollständig ist, hält jede Seite die andere für unehrlich – und keine Verteilung wird akzeptiert.",
    },
    {
      title: "Eine Blockade genügt",
      text: "In einer Erbengemeinschaft müssen wesentliche Entscheidungen gemeinsam getroffen werden. Ein einzelner Miterbe, der nicht reagiert oder nicht zustimmt, legt den gesamten Nachlass still – manchmal über Jahre.",
    },
  ],

  // Vertiefungs-Abschnitt zur Ziel-Suchphrase "Erbschaftsmediation" /
  // "Erbauseinandersetzung". Die Seite hatte rund 490 Wörter eigenen Text
  // und bestand fast nur aus dem Template-Skelett; sie rankte deshalb
  // unterhalb der Sichtbarkeit.
  //
  // Zuständigkeitsgrenze: Diese Seite besitzt die Verfahrensspur (was wird
  // in einer Erbauseinandersetzung geklärt). Die Einzelthemen — Blockade in
  // der Erbengemeinschaft, Pflichtteil, Geschwisterstreit — gehören den
  // Ratgeber-Artikeln und werden nur verlinkt, nicht wiederholt.
  deepDive: {
    eyebrow: "Erbschaftsmediation im Detail",
    title: "Erbschaftsmediation: Was sich in einer Erbauseinandersetzung klären lässt",
    intro:
      "Eine Erbengemeinschaft entsteht automatisch und ist auf Auflösung angelegt – nur sagt das Gesetz nicht, wie. Genau in dieser Lücke entstehen die Konflikte: Alle müssen zustimmen, niemand muss etwas anbieten. Die Mediation erarbeitet die Auseinandersetzungsvereinbarung, mit der sich die Gemeinschaft auflösen lässt. Diese Themen stehen dabei fast immer an.",
    items: [
      {
        title: "Die Immobilie im Nachlass",
        text: "Verkaufen, dass einer übernimmt und die anderen auszahlt, oder gemeinsam vermieten: Jede Variante ist rechnerisch darstellbar. Der Streit entsteht meist nicht an der Variante, sondern am Wert – und daran, dass für einen der Erben ein Elternhaus kein Vermögensgegenstand ist.",
      },
      {
        title: "Bewertung und Verkehrswert",
        text: "Zwei Parteien, zwei Gutachten, zwei Ergebnisse – so beginnen die meisten teuren Erbstreitigkeiten. In der Mediation wird zuerst die Bewertungsgrundlage vereinbart und erst danach bewertet. Das dreht die Reihenfolge um, die vor Gericht üblich ist, und spart in der Regel ein Gutachten.",
      },
      {
        title: "Vorempfänge und Schenkungen zu Lebzeiten",
        text: "Wer schon zu Lebzeiten das Grundstück bekommen hat, sieht das anders als die Geschwister. Ob rechtlich angerechnet wird, hängt an Anordnungen, die selten dokumentiert sind. Verhandelbar ist dagegen, wie die Beteiligten es untereinander gewichten wollen.",
      },
      {
        title: "Pflege und Verantwortung",
        text: "Der gesetzliche Ausgleich für Pflegeleistungen ist eng gefasst und deckt selten ab, was tatsächlich geleistet wurde. In einer Vereinbarung lässt sich das berücksichtigen – nicht, weil ein Anspruch besteht, sondern weil die anderen Erben es als fair anerkennen.",
      },
      {
        title: "Unternehmen, Hof oder Beteiligungen",
        text: "Hier hängt an der Verteilung nicht nur Vermögen, sondern die Frage, wer künftig arbeitet und haftet. Eine Teilungsversteigerung wäre hier besonders zerstörerisch, weil sie den Wert vernichtet, den sie verteilen soll.",
      },
      {
        title: "Hausrat und Erinnerungsstücke",
        text: "Der am häufigsten unterschätzte Punkt: Um die Uhr des Vaters wird härter gestritten als um das Depot. Weil sich der Wert nicht rechnen lässt, braucht es ein Verfahren – etwa abwechselndes Wählen – statt einer Bewertung.",
      },
    ],
    bulletsTitle: "Wann Erbschaftsmediation der bessere erste Schritt ist",
    bullets: [
      "Die Erbengemeinschaft ist blockiert, weil eine Person nicht zustimmt oder nicht reagiert.",
      "Es geht um eine Immobilie, die niemand verlieren, aber auch niemand allein tragen will.",
      "Die Beteiligten sind Geschwister und wollen danach noch miteinander reden können.",
      "Über den Wert des Nachlasses herrscht Uneinigkeit, nicht über die Quote.",
      "Eine Teilungsversteigerung steht im Raum – und beide Seiten wissen, was das bedeutet.",
      "Der eigentliche Streit ist alt und hat mit dem Nachlass nur den Anlass gemeinsam.",
    ],
    note:
      "Die Alternative zur Einigung heißt Teilungsversteigerung – ein Verfahren, bei dem der Nachlass regelmäßig unter Wert verwertet wird und am Ende alle weniger haben. Genau deshalb lohnt sich der Versuch einer Vereinbarung fast immer, selbst wenn die Fronten verhärtet sind. Mediation ersetzt dabei keine Rechtsberatung: Ob Ansprüche bestehen und ob Fristen laufen, klären Sie anwaltlich – wie die Beteiligten miteinander umgehen wollen, klärt die Mediation.",
    links: [
      { label: "Ratgeber: Erbstreit lösen ohne Gericht", href: "/ratgeber/erbstreit-loesen-ohne-gericht" },
      { label: "Ratgeber: Erbengemeinschaft blockiert – was tun?", href: "/ratgeber/erbengemeinschaft-blockade" },
      { label: "Ratgeber: Pflichtteil einfordern", href: "/ratgeber/pflichtteil-einfordern" },
      { label: "Ratgeber: Die 5 Phasen der Mediation", href: "/ratgeber/5-phasen-der-mediation" },
      { label: "Kostenrechner: Gericht oder Mediation?", href: "/kostenrechner" },
    ],
  },

  processTitle: "Wie medipact unterstützt",
  process: [
    {
      title: "Interessen sichtbar machen",
      text: "Es wird geklärt, was den Beteiligten wirklich wichtig ist – Geld, Sicherheit, Anerkennung oder Verantwortung.",
    },
    {
      title: "Gespräch strukturieren",
      text: "Ein neutraler Rahmen hilft, aus Vorwürfen wieder konkrete Entscheidungsfragen zu machen.",
    },
    {
      title: "Lösung vorbereiten",
      text: "Ziel ist eine tragfähige Grundlage für Verteilung, Verkauf, Ausgleich oder weitere rechtliche Schritte.",
    },
  ],

  trustTitle: "Warum Mediation bei Erbschaft hilft",
  trustPoints: [
    {
      title: "Familie schützen",
      text: "Eine Einigung kann verhindern, dass der Konflikt Beziehungen dauerhaft zerstört.",
    },
    {
      title: "Kosten senken",
      text: "Außergerichtliche Klärung kann langwierige und teure Auseinandersetzungen vermeiden.",
    },
    {
      title: "Fairness klären",
      text: "Nicht jede faire Lösung ist rein rechnerisch. Mediation macht Interessen verhandelbar.",
    },
  ],

  didYouKnowFacts: erbschaftFacts,

  faqTitle: "Häufige Fragen zur Erbschaftsmediation",
  faqs: [
    {
      question: "Was kostet eine Mediation im Erbstreit?",
      answer:
        "Bei medipact kostet die Erbschaftsmediation pauschal 399 € für den gesamten Fall – anders als bei anderen Konfliktarten zahlt nur die Partei, die den Fall anlegt; für die übrigen Erben entstehen keine Kosten. Zum Vergleich: Anwalts- und Gerichtskosten in einer Erbauseinandersetzung richten sich nach dem Nachlasswert und erreichen bei Immobilien schnell einen fünfstelligen Betrag.",
    },
    {
      question: "Wie läuft eine Mediation ab, wenn die Erben nicht mehr miteinander sprechen?",
      answer:
        "Genau dafür ist das Online-Verfahren gemacht. Jede Seite schildert ihre Sicht zunächst getrennt und schriftlich – niemand muss dem anderen gegenübersitzen, solange das nicht geht. Erst wenn die Positionen und die dahinterliegenden Interessen erfasst sind, wird zusammengeführt. Bei stark eskalierten Fällen bleibt das Verfahren als Shuttle-Mediation durchgehend getrennt.",
    },
    {
      question: "Kann Mediation eine Erbengemeinschaft auflösen?",
      answer:
        "Die Mediation erarbeitet die Auseinandersetzungsvereinbarung, mit der sich die Erbengemeinschaft auflösen lässt – wer welchen Gegenstand übernimmt, wie eine Immobilie behandelt wird, welche Ausgleichszahlungen fließen. Die Umsetzung selbst erfordert je nach Vermögen zusätzliche Schritte, etwa eine notarielle Beurkundung bei Grundstücken. Die Alternative wäre eine Teilungsversteigerung, bei der regelmäßig alle verlieren.",
    },
    {
      question: "Eignet sich Mediation auch beim Pflichtteil?",
      answer:
        "Ja, und gerade dort ist sie oft der bessere Weg. Beim Pflichtteil geht es formal um einen Geldanspruch, tatsächlich meistens um Anerkennung und um die Frage, warum jemand enterbt wurde. Ein Prozess klärt nur den Betrag – und macht den Riss endgültig. In der Mediation lassen sich Auskunft, Bewertung und Zahlungsmodalitäten gemeinsam regeln, oft mit Ratenzahlung statt Zwangsverkauf.",
    },
    {
      question: "Ist das Ergebnis rechtlich bindend?",
      answer:
        "Die Abschlussvereinbarung ist ein bindender Vertrag zwischen den Erben. Sobald Grundstücke betroffen sind oder eine Erbengemeinschaft formal auseinandergesetzt wird, ist zusätzlich eine notarielle Beurkundung erforderlich. Lassen Sie die Vereinbarung vor der Unterschrift anwaltlich prüfen – das ist überschaubar teuer und verhindert spätere Streitigkeiten.",
    },
    {
      question: "Was, wenn die Fristen für den Pflichtteil laufen?",
      answer:
        "Fristen laufen unabhängig von einer Mediation weiter. Wenn eine Verjährung droht, klären Sie das vorab anwaltlich – nötigenfalls wird der Anspruch fristwahrend geltend gemacht und parallel mediiert. Die Mediation ersetzt keine Rechtsberatung; sie klärt, wie die Beteiligten miteinander umgehen wollen, nicht, welche Ansprüche formal bestehen.",
    },
  ],

  finalCtaTitle: "Erbe klären, bevor Familie zerbricht.",
  finalCtaText:
    "Beschreiben Sie kurz den Konflikt und finden Sie heraus, welcher nächste Schritt sinnvoll ist.",
  finalCta: {
    label: "Jetzt starten",
    href: "/kontakt",
  },
};
