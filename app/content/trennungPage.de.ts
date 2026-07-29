// app/content/trennungPage.de.ts
//
// German source content for /konflikte/trennung. This is the same object
// that used to live directly in trennungPage.ts. Structure (keys, shape,
// referenced types) must stay identical across every locale file so
// MarketingPageTemplate never needs to change when a language is added.

import { trennungFacts } from "@/app/components/ui/DidYouKnowSection";

export const trennungPageContent = {
  eyebrow: "Trennung & Unterhalt",

  // Die H1 trägt bewusst das Keyword an erster Stelle. Vorher stand hier nur
  // der Claim ("Wenn die Beziehung endet, beginnen die offenen Fragen.") —
  // emotional stark, aber ohne ein einziges Suchwort. Das Wort
  // "Scheidungsmediation" kam auf der ganzen Seite nur in einer
  // FAQ-Zwischenüberschrift vor. Der Claim lebt jetzt im Highlight weiter.
  title: "Scheidungsmediation online.",
  titleHighlight:
    "Wenn die Beziehung endet, beginnen die offenen Fragen. Klärt sie fair – statt vor Gericht.",

  intro:
    "Trennung und Scheidung bedeuten nicht nur emotionale Belastung, sondern auch konkrete Entscheidungen: Unterhalt, Betreuung, Finanzen. Genau dafür ist Scheidungsmediation da – ein strukturiertes Verfahren, das beide Seiten zu einer tragfähigen Regelung führt, auch wenn die Vorstellungen weit auseinanderliegen.",

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
      text: "Sie strukturieren gemeinsam, welche Themen wirklich geklärt werden müssen – sachlich und emotional.",
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

  faqTitle: "Häufige Fragen zur Trennungs- und Scheidungsmediation",
  faqs: [
    {
      question: "Was kostet eine Mediation bei Trennung und Scheidung?",
      answer:
        "Bei medipact kostet die Trennungsmediation pauschal 399 € pro Partei im reinen Online-Verfahren, 499 € in der Hybrid-Variante mit Video-Terminen und 899 € im Vollservice. Der Preis ist unabhängig davon, wie viele Themen Sie klären – es gibt keine Stundenabrechnung, die mit jeder Eskalation teurer wird. Details im Kostenüberblick.",
    },
    {
      question: "Ersetzt die Mediation Anwalt und Gericht?",
      answer:
        "Nein. Geschieden wird in Deutschland ausschließlich durch das Familiengericht, und dafür ist anwaltliche Vertretung erforderlich. Die Mediation klärt die Folgen – Unterhalt, Betreuung, Vermögen, Wohnung – und hält sie in einer Vereinbarung fest, die notariell beurkundet werden kann. Das Gerichtsverfahren wird dadurch deutlich kürzer und günstiger, entfällt aber nicht.",
    },
    {
      question: "Ist die Vereinbarung rechtlich bindend?",
      answer:
        "Die Abschlussvereinbarung ist ein bindender Vertrag. Für bestimmte Regelungen – etwa zum Versorgungsausgleich, zu Immobilien oder zum nachehelichen Unterhalt – ist zusätzlich eine notarielle Beurkundung erforderlich, damit sie wirksam ist. Lassen Sie die Vereinbarung vor der Unterschrift anwaltlich prüfen.",
    },
    {
      question: "Funktioniert Mediation, wenn wir kaum noch miteinander reden können?",
      answer:
        "Genau dafür ist das Online-Verfahren gemacht. Jede Seite bearbeitet die strukturierte Fallaufnahme zunächst getrennt und schriftlich – Sie müssen sich nicht gegenübersitzen, solange das noch nicht geht. Wer aufschreibt statt im Affekt zu antworten, formuliert überlegter. Erst danach wird zusammengeführt.",
    },
    {
      question: "Wie gut sind die Erfolgsaussichten?",
      answer:
        "Erhebungen von Mediationsverbänden berichten für Familien- und Scheidungsmediation regelmäßig Einigungsquoten um die 80 Prozent. Entscheidend ist die Freiwilligkeit: Wer sich auf eine Mediation einlässt, sucht bereits eine Lösung statt eines Urteils. Selbst entwickelte Regelungen werden zudem seltener nachverhandelt als gerichtlich verfügte.",
    },
    {
      question: "Wann ist Mediation bei einer Trennung nicht der richtige Weg?",
      answer:
        "Wenn Gewalt, Drohung oder Stalking Teil der Beziehungsgeschichte sind, wenn eine Seite Angst hat, offen zu sprechen, oder wenn der begründete Verdacht besteht, dass Vermögen verschwiegen wird. In diesen Fällen braucht es einen geschützten rechtlichen Rahmen, keinen gemeinsamen Verhandlungstisch.",
    },
  ],

  finalCtaTitle: "Klär die wichtigsten Fragen, bevor es eskaliert.",
  finalCtaText:
    "Beschreiben Sie kurz Ihre Situation und erhalten Sie eine erste Einschätzung, wie Sie vorgehen können.",

  finalCta: {
    label: "Jetzt starten",
    href: "/kontakt",
  },
};
