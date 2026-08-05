// app/content/verbraucherPage.ts

import { nachbarschaftFacts } from "@/app/components/ui/DidYouKnowSection";

export const verbraucherPageContent = {
  eyebrow: "Verbraucher- & Handwerker-Streit",
  title: "Wenn Rechnung und Leistung nicht zusammenpassen.",
  titleHighlight: "Einigt euch, ohne vor Gericht zu ziehen.",
  intro:
    "Strittige Rechnungen, Mängel oder nicht erbrachte Leistungen: Bei kleinen Streitwerten lohnt der Gang vor Gericht selten – ungelöst bleibt der Ärger trotzdem.",

  primaryCta: {
    label: "Streitfall einschätzen",
    href: "#cta",
  },

  secondaryCta: {
    label: "Zur Übersicht",
    href: "/konflikte",
  },

  featuresTitle: "Typische Herausforderungen",
  featuresIntro:
    "Zwischen Kunde und Anbieter stehen oft Missverständnisse, Zeitdruck und verhärtete Fronten.",

  features: [
    {
      title: "Strittige Rechnung",
      text: "Der Endpreis liegt deutlich über dem Kostenvoranschlag – und keiner will nachgeben.",
    },
    {
      title: "Mängel & Nachbesserung",
      text: "Die Leistung hat Mängel, aber Fristen, Gewährleistung und Zuständigkeit sind umstritten.",
    },
    {
      title: "Blockierte Kommunikation",
      text: "Auf Reklamationen kommt keine Antwort mehr – oder nur noch Druck über Mahnungen.",
    },
    {
      title: "Der Streitwert trägt kein Verfahren",
      text: "Bei drei- bis vierstelligen Beträgen steht das Prozesskostenrisiko in keinem Verhältnis zur Forderung. Viele Kunden geben deshalb auf – und viele Betriebe schreiben ab, obwohl sie im Recht wären.",
    },
    {
      title: "Wort steht gegen Wort",
      text: "Was mündlich vereinbart wurde, lässt sich später kaum belegen. Ohne schriftlichen Auftrag wird aus einer Sachfrage schnell eine Glaubwürdigkeitsfrage – und die eskaliert.",
    },
    {
      title: "Die Bewertung als Druckmittel",
      text: "Öffentliche Rezensionen und Gegendarstellungen verschärfen den Konflikt, statt ihn zu lösen. Für Betriebe steht dabei oft mehr auf dem Spiel als die strittige Rechnung.",
    },
  ],

  // Vertiefungs-Abschnitt zur Ziel-Suchphrase "Streit mit dem Handwerker" /
  // "Verbrauchermediation". Die Seite hatte rund 490 Wörter und bestand
  // fast nur aus dem Template-Skelett.
  //
  // Anders als bei Trennung und Erbe gibt es hier kaum konkurrierende
  // Ratgeber-Artikel — diese Seite darf das Thema deshalb breiter besetzen.
  deepDive: {
    eyebrow: "Verbraucherstreit im Detail",
    title: "Streit mit Handwerker oder Anbieter: Was sich außergerichtlich klären lässt",
    intro:
      "Verbraucherstreitigkeiten haben ein wirtschaftliches Problem: Die Forderung ist zu klein für ein Gerichtsverfahren und zu groß, um sie einfach abzuschreiben. Genau deshalb bleiben so viele ungelöst – nicht weil die Rechtslage unklar wäre, sondern weil sich der Weg dorthin nicht rechnet. Das sind die Fälle, in denen eine strukturierte Einigung fast immer die bessere Rechnung ist.",
    items: [
      {
        title: "Rechnung über dem Kostenvoranschlag",
        text: "Ein Kostenvoranschlag ist keine Festpreiszusage – erhebliche Überschreitungen muss der Betrieb aber ankündigen. Zwischen diesen beiden Sätzen liegt der gesamte Streit. Verhandelbar ist meist nicht das Ob, sondern welcher Anteil der Mehrkosten tatsächlich vereinbart war.",
      },
      {
        title: "Mängel und Nachbesserung",
        text: "Der Betrieb hat grundsätzlich das Recht, selbst nachzubessern – der Kunde nicht das Recht, sofort zu mindern. Wenn das Vertrauen weg ist, will aber niemand denselben Handwerker nochmal im Haus. Genau diesen Punkt löst kein Gesetz, sondern eine Absprache.",
      },
      {
        title: "Verzug und nicht erbrachte Leistung",
        text: "Termine platzen, Material fehlt, die Baustelle steht. Ob daraus ein Schaden folgt, hängt an Fristsetzungen, die im Alltag selten sauber gesetzt werden. In der Mediation wird geklärt, wie es weitergeht – während vor Gericht monatelang nichts weitergeht.",
      },
      {
        title: "Strittige Zusatzarbeiten",
        text: "„Das war doch im Preis drin.“ – „Das haben Sie extra bestellt.“ Ohne schriftlichen Nachtrag steht Wort gegen Wort. Eine Einigung über den strittigen Anteil ist fast immer günstiger als ein Beweisverfahren über dieselbe Summe.",
      },
      {
        title: "Gekaufte Ware, Reise, Vertrag",
        text: "Auch außerhalb des Handwerks gilt dieselbe Logik: Gewährleistung, Rücktritt, Minderung oder Kündigung sind rechtlich geregelt, aber teuer durchzusetzen. Online Dispute Resolution setzt genau bei diesen kleinen Streitwerten an.",
      },
      {
        title: "Wenn schon gemahnt wird",
        text: "Sobald Mahnbescheid oder Inkasso im Spiel sind, verhärten sich die Fronten schnell. Eine Einigung ist auch dann noch möglich – und meist der einzige Weg, bei dem beide Seiten weniger verlieren als im streitigen Verfahren.",
      },
    ],
    bulletsTitle: "Wann sich eine außergerichtliche Klärung lohnt",
    bullets: [
      "Die strittige Summe liegt im drei- bis vierstelligen Bereich.",
      "Beide Seiten haben ein Interesse daran, dass die Arbeit fertig wird.",
      "Es gibt keinen schriftlichen Auftrag, an dem sich der Streit entscheiden ließe.",
      "Der Betrieb will die öffentliche Bewertung nicht riskieren, der Kunde nicht das Kostenrisiko.",
      "Eine Seite hat bereits Anwalt, Mahnbescheid oder Inkasso angekündigt.",
      "Sie wollen den Fall abschließen, statt ihn über Monate offen zu halten.",
    ],
    note:
      "Für viele Branchen gibt es zusätzlich staatlich anerkannte Verbraucherschlichtungsstellen, die für Verbraucher meist kostenlos sind – ein Blick lohnt sich, bevor Sie etwas anderes starten. Sie sind allerdings an Zuständigkeiten und Verfahrensordnungen gebunden und nicht für jeden Fall offen, und eine Teilnahme des Unternehmens ist häufig freiwillig. Wo das nicht passt, ist eine Mediation der schnellere Weg: bei medipact im Einstiegstarif von 49 € pro Partei.",
    links: [
      { label: "Ratgeber: Online Dispute Resolution", href: "/ratgeber/online-dispute-resolution" },
      { label: "Ratgeber: Akuter Konflikt – was tun?", href: "/ratgeber/akuter-konflikt-was-tun" },
      { label: "Ratgeber: Die 5 Phasen der Mediation", href: "/ratgeber/5-phasen-der-mediation" },
      { label: "Ratgeber: Was kostet ein Mediator?", href: "/ratgeber/mediation-kosten" },
      { label: "Kostenrechner: Gericht oder Mediation?", href: "/kostenrechner" },
    ],
  },

  processTitle: "Wie medipact unterstützt",
  process: [
    {
      title: "Sachverhalt klären",
      text: "Auftrag, Leistung, Belege und Forderungen werden strukturiert erfasst – Fakten statt Vorwürfe.",
    },
    {
      title: "Gespräch ermöglichen",
      text: "Ein neutraler, strukturierter Rahmen bringt beide Seiten zurück an einen Tisch.",
    },
    {
      title: "Faire Einigung finden",
      text: "Ziel ist eine konkrete Lösung: Minderung, Nachbesserung oder Erstattung – schriftlich festgehalten.",
    },
  ],

  trustTitle: "Warum Mediation bei Verbraucherstreit hilft",
  trustPoints: [
    {
      title: "Wirtschaftlich",
      text: "Deutlich günstiger und schneller als Anwalt und Gericht – gerade bei kleinen Streitwerten.",
    },
    {
      title: "Beziehungsschonend",
      text: "Gut gelöste Konflikte erhalten die Geschäftsbeziehung – wichtig bei Handwerkern vor Ort.",
    },
    {
      title: "Verbindlich",
      text: "Am Ende steht eine klare, dokumentierte Vereinbarung statt eines offenen Dauerstreits.",
    },
  ],

  didYouKnowFacts: nachbarschaftFacts,

  faqTitle: "Häufige Fragen zum Verbraucher- und Handwerkerstreit",
  faqs: [
    {
      question: "Was kostet die Mediation bei einem Handwerkerstreit?",
      answer:
        "Bei medipact kostet der Fall 49 € pro Partei – eine einmalige Pauschale für den kompletten geführten Online-Prozess. Das ist bewusst so kalkuliert, dass sich das Verfahren auch bei kleinen Streitwerten rechnet, bei denen ein Anwalt wirtschaftlich keinen Sinn ergibt und viele Verbraucher deshalb aufgeben.",
    },
    {
      question: "Lohnt sich Mediation bei einem kleinen Streitwert?",
      answer:
        "Gerade dann. Bei Beträgen im niedrigen dreistelligen Bereich übersteigen Anwalts- und Gerichtskosten schnell den Streitwert – der Streit lohnt sich rechnerisch nicht, obwohl man im Recht ist. Ein strukturiertes Verfahren für 49 € pro Seite verschiebt diese Rechnung: Es bleibt wirtschaftlich sinnvoll, auf einer Lösung zu bestehen.",
    },
    {
      question: "Ist die Einigung rechtlich bindend?",
      answer:
        "Ja. Die Abschlussvereinbarung ist ein Vertrag zwischen den Beteiligten – etwa über Nachbesserung bis zu einem Datum, eine Minderung des Rechnungsbetrags oder einen Zahlungsplan. Bei Bedarf kann sie als Anwaltsvergleich vollstreckbar gemacht werden. Der Rechtsweg bleibt offen, falls keine Einigung zustande kommt.",
    },
    {
      question: "Was ist der Unterschied zu einer Verbraucherschlichtungsstelle?",
      answer:
        "Eine Schlichtungsstelle erarbeitet nach Anhörung beider Seiten einen eigenen Lösungsvorschlag, den Sie annehmen oder ablehnen können. In der Mediation entwickeln die Beteiligten die Lösung selbst – das dauert oft kürzer und passt besser, wenn die Geschäftsbeziehung fortbestehen soll. medipact bildet beide Verfahrensarten online ab.",
    },
    {
      question: "Verjähren meine Gewährleistungsansprüche während der Mediation?",
      answer:
        "Fristen laufen unabhängig vom Mediationsverfahren weiter. Wenn eine Verjährung absehbar ist, klären Sie das vorab – nötigenfalls wird der Anspruch fristwahrend geltend gemacht und parallel mediiert. Die Mediation ersetzt keine Rechtsberatung, sondern klärt die Lösung zwischen den Beteiligten.",
    },
    {
      question: "Was, wenn der Handwerksbetrieb nicht mitmacht?",
      answer:
        "Teilnahme ist freiwillig. Erfahrungsgemäß steigt die Bereitschaft, wenn der Vorschlag sachlich formuliert ist und den wirtschaftlichen Vorteil benennt: Ein Verfahren für 49 € kostet den Betrieb weniger Zeit und Reputation als eine Klage oder eine öffentliche Bewertung. Lehnt er ab, haben Sie den Einigungsversuch dokumentiert.",
    },
  ],

  finalCtaTitle: "Den Streit beilegen, bevor er teuer wird.",
  finalCtaText:
    "Beschreiben Sie kurz Ihren Fall und finden Sie heraus, wie ein sinnvoller nächster Schritt aussehen kann.",
  finalCta: {
    label: "Jetzt starten",
    href: "/kontakt",
  },
};
