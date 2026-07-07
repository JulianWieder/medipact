// app/content/geschaeftPage.ts
//
// Marketing-Content für den Mediationstyp "geschaeft" (Geschäft & Organisation).
// Inhaltlich gespeist aus dem Workflow (Diagnose: Konfliktart + Glasl-Eskalation,
// Varianten "Führungskraft moderiert selbst" / "Externe Mediation") — siehe
// docs/konzept_organisationskonflikt.md und docs/faelle-phasen-inhalte.md.

export const geschaeftPageContent = {
  eyebrow: "Team- & Organisations-Konflikt",
  title: "Wenn Konflikte im Team die Arbeit lähmen.",
  titleHighlight: "Kläre Rollen, Reibung und Zusammenarbeit.",
  intro:
    "Konflikte in Organisationen sind selten reine Leistungsverweigerung. Oft stecken unklare Rollen, Verlustängste oder strukturelle Widersprüche dahinter. Medipact hilft, die Dynamik zu verstehen – und dann gezielt zu klären.",

  primaryCta: {
    label: "Team-Konflikt einschätzen",
    href: "#cta",
  },

  secondaryCta: {
    label: "Zur Übersicht",
    href: "/konflikte",
  },

  featuresTitle: "Typische Herausforderungen",
  featuresIntro:
    "Organisationskonflikte eskalieren, weil Sach-, Beziehungs- und Strukturebene sich vermischen – und weil sie im Alltag selten sauber angeschaut werden.",

  features: [
    {
      title: "Unklare Rollen & Zuständigkeiten",
      text: "Zwei Personen fühlen sich verantwortlich – oder niemand. Aus Reibung an Schnittstellen wird schnell ein persönlicher Konflikt.",
    },
    {
      title: "Strukturen, die gegeneinander arbeiten",
      text: "Gegeneinander laufende Ziele zweier Abteilungen lassen sich nicht auf der Beziehungsebene lösen. Die Diagnose macht das sichtbar.",
    },
    {
      title: "Veränderung erzeugt Widerstand",
      text: "Umstrukturierungen wecken Verlustängste um Status, Komfort und Kompetenz. Widerstand ist oft eine unbewältigte Übergangsphase – kein Boykott.",
    },
  ],

  processTitle: "Wie medipact unterstützt",
  process: [
    {
      title: "Diagnose zuerst",
      text: "Konfliktart (Sach-, Beziehungs-, Rollen- oder Strukturkonflikt) und Eskalationsstufe nach Glasl werden strukturiert erfasst – bevor irgendjemand über Lösungen spricht.",
    },
    {
      title: "Passender Weg statt Einheitslösung",
      text: "Je nach Eskalationsstufe empfiehlt der Prozess Moderation, externe Mediation – oder benennt ehrlich die Grenzen der Mediation.",
    },
    {
      title: "Verbindliche Vereinbarung",
      text: "Am Ende steht ein konkreter Plan: wer macht was bis wann, mit Follow-up-Termin – damit die Klärung im Arbeitsalltag hält.",
    },
  ],

  trustTitle: "Warum Mediation im Arbeitskontext hilft",
  trustPoints: [
    {
      title: "Zusammenarbeit erhalten",
      text: "Team und Projekt müssen weiterlaufen. Eine strukturierte Klärung schützt Arbeitsfähigkeit und Betriebsklima.",
    },
    {
      title: "Zwei Wege, ein Prozess",
      text: "Führungskräfte können selbst mediativ moderieren – oder eine externe, allparteiliche Person übernimmt. Beides ist im Prozess angelegt.",
    },
    {
      title: "Ehrlich über Grenzen",
      text: "Bei fortgeschrittener Eskalation hilft Moderation nicht mehr. Dann benennt der Prozess klar die Alternativen – von externer Mediation bis Führungsentscheidung.",
    },
  ],

  finalCtaTitle: "Klärt den Konflikt, bevor er das Team spaltet.",
  finalCtaText:
    "Beschreiben Sie kurz die Situation und finden Sie heraus, welcher Weg für Ihr Team sinnvoll ist – Moderation, Mediation oder ein klares Gespräch.",
  finalCta: {
    label: "Jetzt starten",
    href: "/kontakt",
  },
};
