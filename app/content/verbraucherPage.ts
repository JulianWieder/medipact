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
  ],

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
