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
    {
      title: "Die Kinder geraten zwischen die Fronten",
      text: "Betreuungszeiten werden zum Verhandlungspfand, Absprachen kippen kurzfristig. Kinder merken das sofort – und richten ihr Verhalten danach aus, was gerade weniger Ärger macht.",
    },
    {
      title: "Niemand hat den vollständigen Überblick",
      text: "Konten, Versicherungen, Altersvorsorge, Kredite: Oft hat sich eine Seite jahrelang darum gekümmert. Ohne gemeinsame Zahlenbasis wird jede Diskussion über Fairness zum Misstrauensgespräch.",
    },
    {
      title: "Jeder Schritt schafft Fakten",
      text: "Wer auszieht, wer das Konto trennt, wer zuerst zum Anwalt geht – vieles davon lässt sich später nur schwer korrigieren. Genau deshalb lohnt eine Klärung, bevor die ersten Entscheidungen fallen.",
    },
  ],

  // Vertiefungs-Abschnitt zur Ziel-Suchphrase "Scheidungsmediation".
  //
  // Grund: Die Seite hatte rund 530 Wörter eigenen Text — praktisch nur das
  // Template-Skelett, das wortgleich auch auf erbschaft, nachbarschaft und
  // verbraucher steht. Sie rankte deshalb unterhalb der Sichtbarkeit (0
  // Impressionen in GSC über 3 Monate), obwohl technisch alles stimmte.
  //
  // Bewusst KEINE eigene URL: /konflikte/trennung soll die Verfahrensspur
  // besitzen ("was ist Scheidungsmediation, was wird darin geregelt"). Die
  // inhaltlichen Einzelfragen — Haus, Unterhaltshöhe, Trennungsjahr,
  // Sorgerecht — gehören weiter den Ratgeber-Artikeln und werden hier nur
  // verlinkt, nicht wiederholt. Sonst kannibalisieren sich die neun
  // Trennungs-Artikel und diese Seite gegenseitig.
  deepDive: {
    eyebrow: "Scheidungsmediation im Detail",
    title: "Scheidungsmediation: Was darin geregelt wird – und was nicht",
    intro:
      "Scheidungsmediation ist kein Paartherapie-Ersatz und keine Rechtsberatung. Sie ist das Verfahren, in dem Sie die Folgen einer Trennung selbst regeln, statt sie regeln zu lassen. Am Ende steht eine Scheidungsfolgenvereinbarung – ein Dokument, das beim Familiengericht die Arbeit macht, die sonst zwei Anwälte streitig verhandeln. Diese sechs Themen kommen dabei fast immer auf den Tisch.",
    items: [
      {
        title: "Kindes- und Ehegattenunterhalt",
        text: "Die Höhe folgt Tabellen und Einkommen – darüber lässt sich wenig verhandeln. Verhandelbar ist alles drumherum: Wie wird mit Sonderbedarf umgegangen, was passiert bei Jobwechsel oder Krankheit, wann wird neu gerechnet. Genau diese Punkte fehlen in gerichtlichen Titeln meistens und führen später zurück vor Gericht.",
      },
      {
        title: "Betreuung und Umgang",
        text: "Residenz-, Wechsel- oder Nestmodell ist keine Rechtsfrage, sondern eine Alltagsfrage: Arbeitszeiten, Schulweg, Ferien, Krankheitstage. In der Mediation entsteht ein konkreter Betreuungsplan statt einer abstrakten Umgangsregelung – inklusive der Frage, wie Sie künftig miteinander kommunizieren.",
      },
      {
        title: "Die gemeinsame Immobilie",
        text: "Verkaufen, übernehmen, vermieten oder halten bis die Kinder aus dem Haus sind: Jede Variante hat steuerliche und finanzielle Folgen, die sich rechnen lassen. Die Mediation legt die Optionen nebeneinander, statt dass jede Seite nur ihre eigene durchsetzen will.",
      },
      {
        title: "Zugewinn und Altersvorsorge",
        text: "Der Versorgungsausgleich läuft grundsätzlich über das Gericht, der Zugewinn nicht. Beides hängt an einer vollständigen Vermögensaufstellung – und genau daran scheitern streitige Verfahren am häufigsten, weil Auskunft erzwungen statt gegeben wird.",
      },
      {
        title: "Schulden und laufende Verträge",
        text: "Gemeinsame Kredite, Leasing, Versicherungen, Handyverträge: Die Bank interessiert die Trennung nicht, beide bleiben in der Haftung. Wer welche Verbindlichkeit übernimmt und wie die andere Seite abgesichert wird, gehört in die Vereinbarung – nicht in eine mündliche Absprache.",
      },
      {
        title: "Wie Sie künftig miteinander umgehen",
        text: "Der am meisten unterschätzte Punkt. Wenn Kinder da sind, endet die Beziehung nicht mit der Scheidung, sie ändert nur ihre Form. Vereinbarungen darüber, wie und worüber kommuniziert wird, verhindern mehr Folgestreit als jede Unterhaltsklausel.",
      },
    ],
    bulletsTitle: "Wann Scheidungsmediation der bessere erste Schritt ist",
    bullets: [
      "Sie wollen sich trennen, aber nicht jahrelang streiten – und beide wissen das.",
      "Es gibt Kinder, und Sie werden sich zwangsläufig weiter begegnen.",
      "Eine Immobilie, ein Unternehmen oder Altersvorsorge steht im Raum.",
      "Sie wollen wissen, was Sie das kostet, bevor Sie loslaufen.",
      "Beide Seiten sind bereit, ihre Zahlen offenzulegen.",
      "Sie suchen eine Regelung, die auch in fünf Jahren noch trägt.",
    ],
    note:
      "Wichtig und oft missverstanden: Mediation ersetzt die Scheidung nicht. Eine Ehe wird in Deutschland ausschließlich durch das Familiengericht geschieden, und für den Antrag ist mindestens ein Anwalt zwingend (§ 114 FamFG). Was die Mediation ersetzt, ist der Streit über die Folgen – und damit den zweiten Anwalt und die Verfahrensdauer. Gespart wird also nicht das Gericht, sondern die Eskalation. Was das konkret bedeutet, rechnet der Kostenrechner weiter unten für Ihre Zahlen aus.",
    links: [
      { label: "Ratgeber: Die 5 Phasen der Mediation", href: "/ratgeber/5-phasen-der-mediation" },
      { label: "Ratgeber: Scheidung mit Mediator – Kosten", href: "/ratgeber/scheidung-mediator-kosten" },
      { label: "Ratgeber: Trennungsjahr nachweisen", href: "/ratgeber/trennungsjahr-nachweisen" },
      { label: "Ratgeber: Vermögen aufteilen bei Scheidung", href: "/ratgeber/vermoegensauseinandersetzung" },
      { label: "Ratgeber: Trennung von einem Narzissten", href: "/ratgeber/trennung-von-einem-narzissten" },
      { label: "Kostenrechner: Gericht oder Mediation?", href: "/kostenrechner?art=trennung" },
    ],
  },

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
