// app/content/fuerMediatorenPage.ts
//
// Landingpage für den Mediatorenpool (/fuer-mediatoren): Sie gewinnt
// Mediatorinnen und Mediatoren für die Vermittlung über /mediator-finden.
//
// Zielgruppe ist NICHT die Streitpartei, sondern die Mediatorin. Ihre Fragen
// sind: „Bekomme ich darüber Anfragen?", „Was kostet mich das?" und „Bleibe
// ich selbstständig?". Genau die beantwortet die Seite.
//
// Das Kundenmodell (Starterpaket, Kennenlerngespräche, Abrechnung über
// medipact) steht in lib/mediatorVermittlung.ts. Profile legt das
// medipact-Team an (Entscheidung 29.10.2026), keine Selbstregistrierung.
//
// Bewusst offen gelassen, bis entschieden: Konditionen (Anteil von medipact,
// Vergütung der Kennenlerngespräche, Auszahlung) und Aufnahmekriterien über
// die Ausbildung hinaus. Nichts davon hier ausschreiben, bevor es feststeht.

import { KENNENLERN_MINUTEN, MEDIATOREN_POOL_URL } from "@/lib/mediatorVermittlung";

export const fuerMediatorenPageContent = {
  eyebrow: "Für Mediatorinnen und Mediatoren",
  title: "Mediieren statt akquirieren.",
  titleHighlight: "Anfragen, die zu Ihnen passen.",
  intro:
    "Über medipact finden Menschen, die eine Mediation suchen, Ihr Profil — vor Ort oder per Video. Wenn sie Sie zum Kennenlernen buchen, haben sie bezahlt und mit der Gegenseite Einleitung, Themen und Interessen bereits digital erarbeitet. Entscheiden sie sich für Sie, übernehmen Sie den vorbereiteten Fall und führen die Mediation in eigener Verantwortung weiter.",

  primaryCta: {
    label: "Interesse melden",
    href: MEDIATOREN_POOL_URL,
  },

  secondaryCta: {
    label: "Was Kund:innen sehen",
    href: "/mediator-finden",
  },

  featuresTitle: "Was Sie davon haben",
  featuresIntro:
    "Die Vermittlung nimmt Ihnen den Teil ab, für den die meisten Mediatorinnen keine Zeit haben: passende Anfragen finden, vorsortieren und den ersten Termin festmachen.",

  features: [
    {
      title: "Ihr Profil im Verzeichnis",
      text: "Mit Foto, Schwerpunkten, Region und Honorar auf medipact.de/mediator-finden – unter Vorname und Initial, mit vollem Namen nur, wenn Sie es möchten. Das Profil legen wir nach dem Kennenlernen mit Ihnen gemeinsam an. Kund:innen merken Sie dort vor, oder Sie geben auf passende Fälle ein Angebot ab.",
    },
    {
      title: "Vorbereitete Fälle statt Erstgespräch bei null",
      text: `Kund:innen buchen ein Kennenlerngespräch von ${KENNENLERN_MINUTEN} Minuten aus Ihren freien Terminen. Vorher sehen Sie den anonymisierten Fall; nach der Wahl übernehmen Sie Themen und Interessen beider Seiten. Bestätigung und Erinnerung verschickt das System, nicht Sie.`,
    },
    {
      title: "Sie bleiben selbstständig",
      text: "Die Mediation führen Sie in eigener Verantwortung, nach Ihrer Methode und zu Ihrem Stundensatz aus dem Profil. Die Abrechnung mit den Kund:innen übernimmt medipact.",
    },
    {
      title: "Ein eigener Zugang, nur für Ihre Fälle",
      text: "Sie sehen die Ihnen zugeordneten Anfragen, Termine und die Unterlagen, die Kund:innen zur Vorbereitung hochladen — und nichts darüber hinaus.",
    },
  ],

  processTitle: "So kommen Sie in den Pool",
  process: [
    {
      title: "Interesse melden",
      text: "Kurz zu Ausbildung, Schwerpunkten und ob Sie vor Ort, per Video oder beides anbieten.",
    },
    {
      title: "Kennenlerngespräch",
      text: "Wir sprechen über Ihre Arbeitsweise, die Konfliktarten, in denen Sie zu Hause sind, und die Konditionen der Vermittlung.",
    },
    {
      title: "Zugang, Profil und Termine",
      text: "Das medipact-Team legt Ihren Zugang und Ihr Profil an. Sie hinterlegen freie Termine für Kennenlerngespräche — so viele oder so wenige, wie Sie möchten — und geben das Profil frei. Dann erscheint es im Verzeichnis.",
    },
    {
      title: "Anfragen erhalten",
      text: "Kund:innen merken Sie über Ihr Profil vor, oder Sie geben auf einen anonymisierten Fall ein Angebot ab. Vor dem Kennenlernen prüfen Sie, ob eine Kollision besteht.",
    },
  ],

  trustTitle: "Wie wir zusammenarbeiten",
  trustPoints: [
    {
      title: "Keine Exklusivität",
      text: "Sie arbeiten weiter mit Ihren eigenen Mandantinnen und Mandanten und in anderen Netzwerken. medipact ist ein zusätzlicher Weg zu Ihnen, kein Arbeitgeber.",
    },
    {
      title: "Vertraulichkeit bleibt bei Ihnen",
      text: "Was in der Mediation besprochen wird, erfahren wir nicht. Unterlagen, die Kund:innen hochladen, sind nur für die zugeordnete Mediatorin sichtbar.",
    },
    {
      title: "Wir verweisen ehrlich",
      text: "Anfragen, die im Online-Verfahren von medipact besser aufgehoben sind, leiten wir dorthin. Was bei Ihnen ankommt, sucht ausdrücklich eine persönliche Mediation.",
    },
  ],

  faqTitle: "Was Mediatorinnen uns fragen",
  faqs: [
    {
      question: "Welche Voraussetzungen muss ich mitbringen?",
      answer:
        "Eine abgeschlossene Mediationsausbildung und Erfahrung in mindestens einem der Bereiche Trennung und Scheidung, Erbschaft, Nachbarschaft oder Team und Organisation. Alles Weitere klären wir im Kennenlerngespräch.",
    },
    {
      question: "Was kostet mich die Vermittlung?",
      answer:
        "Die Konditionen besprechen wir im Kennenlerngespräch, bevor Sie Anfragen erhalten. Es gibt keine Kosten, nur um in den Pool aufgenommen zu werden.",
    },
    {
      question: "Wie viele Anfragen bekomme ich?",
      answer:
        "Das hängt von Ihrer Region, Ihren Schwerpunkten und davon ab, wie viele Termine Sie anbieten. Eine Mindestzahl können und wollen wir nicht versprechen — Sie entscheiden, wie viele Kennenlerngespräche Sie freigeben.",
    },
    {
      question: "Kann ich eine Anfrage ablehnen?",
      answer:
        "Ja. Wenn ein Fall nicht zu Ihnen passt, etwa wegen Befangenheit oder Vorbefassung, sagen Sie es uns, und wir ordnen neu zu.",
    },
    {
      question: "Muss ich das Online-Verfahren von medipact nutzen?",
      answer:
        "Nein. Einleitung, Themen und Interessen haben die Parteien vorher digital erarbeitet – das übernehmen Sie als Vorbereitung. Ab dann führen Sie die Mediation in Ihrer Praxis oder per Video, wie Sie es gewohnt sind. Die Ergebnisse können Sie im medipact-Workspace weiterführen, müssen es aber nicht.",
    },
  ],

  finalCtaTitle: "Lernen wir uns kennen.",
  finalCtaText:
    "Schreiben Sie uns kurz zu Ausbildung, Schwerpunkten und Region. Wir melden uns für ein Kennenlerngespräch.",
  finalPrimaryCta: {
    label: "Interesse melden",
    href: MEDIATOREN_POOL_URL,
  },
  finalCta: {
    label: "Die Kundenseite ansehen",
    href: "/mediator-finden",
  },
};
