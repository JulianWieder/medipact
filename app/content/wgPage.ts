// app/content/wgPage.ts

import { nachbarschaftFacts } from "@/app/components/ui/DidYouKnowSection";

export const wgPageContent = {
  eyebrow: "WG- & Mitbewohner-Konflikt",
  title: "Wenn Zusammenwohnen zum Dauerstreit wird.",
  titleHighlight: "Klärt es, bevor die WG zerbricht.",
  intro:
    "WG-Konflikte drehen sich selten nur um den Abwasch: Putzen, Kosten, Lärm, Gäste oder ein geplanter Auszug. Schwierig wird es, weil man sich Küche, Bad und Alltag teilt.",

  primaryCta: {
    label: "WG-Konflikt einschätzen",
    href: "#cta",
  },

  secondaryCta: {
    label: "Zur Übersicht",
    href: "/konflikte",
  },

  featuresTitle: "Typische Herausforderungen",
  featuresIntro:
    "Gerade weil Mitbewohner sich täglich begegnen, werden kleine Auslöser schnell persönlich.",

  features: [
    {
      title: "Ungleiche Lasten",
      text: "Putzplan, Einkäufe oder Nebenkosten: Wenn sich Aufwand und Kosten ungleich anfühlen, kippt die Stimmung.",
    },
    {
      title: "Passive Eskalation",
      text: "Statt offener Worte gibt es Zettel, Sticker im Gruppenchat und demonstratives Schweigen in der Küche.",
    },
    {
      title: "Geteilter Alltag",
      text: "Man kann sich nicht aus dem Weg gehen – ungelöste Konflikte belasten jeden einzelnen Tag.",
    },
  ],

  processTitle: "Wie medipact unterstützt",
  process: [
    {
      title: "Themen sortieren",
      text: "Zuerst wird getrennt, was einmalig war, was System hat und was wirklich geklärt werden muss.",
    },
    {
      title: "Gespräch ermöglichen",
      text: "Ein strukturierter Rahmen verhindert, dass alte Vorwürfe jedes WG-Gespräch wieder sprengen.",
    },
    {
      title: "Faire Regeln finden",
      text: "Ziel sind konkrete, alltagstaugliche Vereinbarungen – vom Putzplan bis zur Kostenaufteilung.",
    },
  ],

  trustTitle: "Warum Mediation in der WG hilft",
  trustPoints: [
    {
      title: "Niedrigschwellig",
      text: "Komplett online, ohne Behörden oder Anwälte – und günstiger als ein zerbrochener Mietvertrag.",
    },
    {
      title: "Fair",
      text: "Alle Mitbewohner kommen gleichberechtigt zu Wort, nicht nur die Lautesten.",
    },
    {
      title: "Konkret",
      text: "Am Ende stehen klare Absprachen statt vager Hoffnungen auf Besserung.",
    },
  ],

  didYouKnowFacts: nachbarschaftFacts,

  finalCtaTitle: "WG-Frieden wiederherstellen, bevor jemand auszieht.",
  finalCtaText:
    "Beschreibt kurz eure Situation und findet heraus, wie ein sinnvoller nächster Schritt aussehen kann.",
  finalCta: {
    label: "Jetzt starten",
    href: "/kontakt",
  },
};
