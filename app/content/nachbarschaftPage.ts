// app/content/nachbarschaftPage.ts

import { nachbarschaftFacts } from "@/app/components/ui/DidYouKnowSection";

export const nachbarschaftPageContent = {
  eyebrow: "Nachbarschafts-Streit",
  title: "Wenn der Alltag zum Konflikt wird.",
  titleHighlight: "Finde zurück zu einem normalen Miteinander.",
  intro:
    "Nachbarschaftskonflikte beginnen oft klein: Lärm, Grenzen, Parkplätze, Garten oder Hausordnung. Schwierig wird es, weil man sich nicht einfach aus dem Weg gehen kann.",

  primaryCta: {
    label: "Nachbarschaftskonflikt einschätzen",
    href: "#cta",
  },

  secondaryCta: {
    label: "Zur Übersicht",
    href: "/konflikte",
  },

  featuresTitle: "Typische Herausforderungen",
  featuresIntro:
    "Gerade weil Nachbarn dauerhaft nebeneinander leben, können kleine Auslöser schnell persönlich werden.",

  features: [
    {
      title: "Wiederkehrender Ärger",
      text: "Lärm, Müll, Parkplätze oder Grenzen tauchen immer wieder auf und belasten den Alltag.",
    },
    {
      title: "Abgebrochene Kommunikation",
      text: "Gespräche werden vermieden, aggressiv geführt oder nur noch über Beschwerden ausgetragen.",
    },
    {
      title: "Dauerhafte Nähe",
      text: "Der Konflikt verschwindet nicht von selbst, weil sich die Beteiligten regelmäßig begegnen.",
    },
  ],

  processTitle: "Wie medipact unterstützt",
  process: [
    {
      title: "Konflikt entladen",
      text: "Zuerst wird getrennt, was passiert ist, was interpretiert wurde und was wirklich geklärt werden muss.",
    },
    {
      title: "Gespräch ermöglichen",
      text: "Ein strukturierter Rahmen verhindert, dass alte Vorwürfe jedes Gespräch wieder blockieren.",
    },
    {
      title: "Alltagstaugliche Lösung finden",
      text: "Ziel sind konkrete Vereinbarungen, die im täglichen Zusammenleben realistisch funktionieren.",
    },
  ],

  trustTitle: "Warum Mediation bei Nachbarschaft hilft",
  trustPoints: [
    {
      title: "Praktisch",
      text: "Es geht nicht um Gewinner und Verlierer, sondern um Lösungen, mit denen alle leben können.",
    },
    {
      title: "Deeskalierend",
      text: "Mediation kann verhindern, dass aus Alltagsärger ein dauerhafter Rechtsstreit wird.",
    },
    {
      title: "Konkret",
      text: "Am Ende stehen klare Absprachen statt vager Hoffnungen auf Besserung.",
    },
  ],

  didYouKnowFacts: nachbarschaftFacts,

  finalCtaTitle: "Nachbarschaft klären, bevor es dauerhaft belastet.",
  finalCtaText:
    "Beschreiben Sie kurz Ihre Situation und finden Sie heraus, wie ein sinnvoller nächster Schritt aussehen kann.",
  finalCta: {
    label: "Jetzt starten",
    href: "/kontakt",
  },
};
