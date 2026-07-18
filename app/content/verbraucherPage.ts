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

  finalCtaTitle: "Den Streit beilegen, bevor er teuer wird.",
  finalCtaText:
    "Beschreiben Sie kurz Ihren Fall und finden Sie heraus, wie ein sinnvoller nächster Schritt aussehen kann.",
  finalCta: {
    label: "Jetzt starten",
    href: "/kontakt",
  },
};
