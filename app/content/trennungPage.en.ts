// app/content/trennungPage.en.ts
//
// TODO(translation): this is a structural placeholder, not a translation.
// All strings still mirror trennungPage.de.ts word-for-word. Swap the
// German text for English copy whenever translation work is scheduled —
// the shape must stay identical to trennungPage.de.ts.

import { trennungFacts } from "@/app/components/ui/DidYouKnowSection";

export const trennungPageContent = {
  eyebrow: "Trennung & Unterhalt",

  title: "Wenn die Beziehung endet, beginnen die offenen Fragen.",
  titleHighlight: "Finde eine faire Lösung ohne Eskalation.",

  intro:
    "Trennung bedeutet nicht nur emotionale Belastung, sondern auch konkrete Entscheidungen: Unterhalt, Betreuung, Finanzen. Oft wird es genau dann schwierig, wenn beide Seiten unterschiedliche Vorstellungen haben.",

  primaryCta: {
    label: "Konflikt einschätzen",
    href: "#cta",
  },

  secondaryCta: {
    label: "Zur Übersicht",
    href: "/konflikte",
  },

  featuresTitle: "Typische Herausforderungen",
  featuresIntro:
    "Diese Punkte führen häufig dazu, dass Konflikte eskalieren oder festfahren.",

  features: [
    {
      title: "Unterschiedliche Vorstellungen",
      text: "Beide Seiten haben klare Erwartungen – aber keine gemeinsame Basis, wie eine faire Lösung aussehen kann.",
    },
    {
      title: "Emotionen blockieren Gespräche",
      text: "Verletzungen und Enttäuschung machen es schwer, sachlich über Unterhalt oder Betreuung zu sprechen.",
    },
    {
      title: "Druck durch Zeit und Geld",
      text: "Finanzielle Unsicherheit und schnelle Entscheidungen erhöhen den Konfliktdruck zusätzlich.",
    },
  ],

  processTitle: "Wie medipact unterstützt",
  process: [
    {
      title: "Situation klären",
      text: "Du strukturierst gemeinsam, welche Themen wirklich geklärt werden müssen – sachlich und emotional.",
    },
    {
      title: "Gespräch ermöglichen",
      text: "Ein klarer Rahmen hilft, wieder miteinander zu sprechen – ohne Eskalation.",
    },
    {
      title: "Lösung entwickeln",
      text: "Am Ende steht eine faire, tragfähige Grundlage für Vereinbarungen.",
    },
  ],

  trustTitle: "Warum dieser Weg sinnvoll ist",
  trustPoints: [
    {
      title: "Außergerichtlich",
      text: "Konflikte können oft schneller und kostengünstiger gelöst werden als vor Gericht.",
    },
    {
      title: "Selbstbestimmt",
      text: "Die Lösung wird nicht vorgegeben, sondern gemeinsam entwickelt.",
    },
    {
      title: "Nachhaltig",
      text: "Vereinbarungen halten besser, weil beide Seiten dahinterstehen.",
    },
  ],

  didYouKnowFacts: trennungFacts,

  finalCtaTitle: "Klär die wichtigsten Fragen, bevor es eskaliert.",
  finalCtaText:
    "Beschreibe kurz deine Situation und erhalte eine erste Einschätzung, wie du vorgehen kannst.",

  finalCta: {
    label: "Jetzt starten",
    href: "/kontakt",
  },
};
