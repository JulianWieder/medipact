// app/content/mediatorFindenPage.ts
//
// Landingpage für den Zusatzbaustein „Mediator:in vermitteln" (/mediator-finden).
//
// ZUSÄTZLICH, NICHT STATTDESSEN — bitte vor Änderungen lesen:
// Das Online-Verfahren bleibt das Hauptangebot, Startseite und Konflikt-Seiten
// verkaufen weiter nur das. Diese Seite ist für Menschen, die ausdrücklich
// eine klassische Mediation mit einer persönlichen Mediatorin wollen. Sie
// stellt deshalb beide Wege ehrlich nebeneinander (Vergleich) und schickt
// zurück ins Online-Verfahren, wo das besser passt — sie soll dem
// Kernprodukt keine Fälle abziehen, die dort gut aufgehoben wären.
//
// Das Modell (Startpaket, Kennenlerngespräche, Abrechnung) steht EINMAL in
// lib/mediatorVermittlung.ts – Zahlen hier nur aus den Konstanten dort.
//
// Bewusst NICHT im Text:
//   - „zertifiziert": geschützte Bezeichnung (ZMediatAusbV). Erst verwenden,
//     wenn der Pool ausschließlich aus zertifizierten Mediator:innen besteht.
//     Im Profil steht es nur, wenn die Mediatorin es selbst angibt und wir
//     es vor der Freigabe geprüft haben.
//   - Ein Preis für das Startpaket, solange STARTPAKET_PREIS null ist.

import {
  KENNENLERN_ANZAHL,
  KENNENLERN_MINUTEN,
  MEDIATOR_ANFRAGE_URL,
} from "@/lib/mediatorVermittlung";

export const mediatorFindenPageContent = {
  eyebrow: "Persönliche Mediation",
  title: "Lieber mit einem Menschen am Tisch?",
  titleHighlight: "Wir vermitteln Ihnen eine Mediatorin.",
  intro:
    `Nicht jeder Konflikt soll schriftlich und Schritt für Schritt am Bildschirm geklärt werden. Manche Menschen wollen von Anfang an jemanden, der zuhört, nachfragt und das Gespräch führt — im Büro oder per Video. Dafür finden Sie hier ausgebildete Mediatorinnen und Mediatoren, deren Profile wir geprüft haben. Sie lernen bis zu ${KENNENLERN_ANZAHL} von ihnen in kurzen Gesprächen kennen und entscheiden dann, mit wem Sie die Mediation führen.`,

  primaryCta: {
    label: "Mediator:innen ansehen",
    href: "#verzeichnis",
  },

  secondaryCta: {
    label: "Oder lieber online klären",
    href: "/methode",
  },

  featuresTitle: "Für welche Konflikte wir vermitteln",
  featuresIntro:
    "Dieselben vier Bereiche wie im Online-Verfahren. Wir ordnen Ihnen eine Mediatorin zu, die in genau diesem Bereich arbeitet — nicht die, die gerade frei ist.",

  features: [
    {
      title: "Trennung und Scheidung",
      text: "Kinder, Unterhalt, Wohnung, Vermögen: Gerade wenn viel Gefühl im Raum ist, wollen viele Paare ein Gegenüber, das das Gespräch hält. Die Vereinbarung, die dabei entsteht, kann später Grundlage für die Scheidung sein.",
    },
    {
      title: "Erbschaft und Erbengemeinschaft",
      text: "Geschwister, die sich über das Elternhaus nicht einigen, ein Testament, das als ungerecht empfunden wird, ein Betrieb im Nachlass. Oft sitzen mehrere Generationen am Tisch.",
    },
    {
      title: "Nachbarschaft",
      text: "Lärm, Grenzen, Bäume, Parken. Wenn man sich weiter begegnet, hilft ein Gespräch vor Ort häufig mehr als jeder Brief — auch weil die Mediatorin sich die Lage ansehen kann.",
    },
    {
      title: "Team und Organisation",
      text: "Gesellschafter im Patt, ein Team, das nicht mehr zusammenarbeitet, eine festgefahrene Nachfolge. Hier sind Präsenztermine mit allen Beteiligten oft der schnellste Weg.",
    },
  ],

  processTitle: "So kommen Sie zu Ihrer Mediatorin",
  process: [
    {
      title: "Startpaket buchen",
      text: "Ein Festpreis, vorab online bezahlt. Darin sind die geführte Einleitung und die Kennenlerngespräche enthalten – keine weiteren Kosten, bis Sie sich für eine Mediatorin entschieden haben.",
    },
    {
      title: "Einleitung mit medipact",
      text: "Sie schildern kurz, worum es geht, wer beteiligt ist und ob vor Ort oder per Video. Wir erklären, wie die Mediation abläuft und was vertraulich bleibt. Keine langen Formulare.",
    },
    {
      title: `Bis zu ${KENNENLERN_ANZAHL} Mediator:innen kennenlernen`,
      text: `Wählen Sie im Verzeichnis bis zu ${KENNENLERN_ANZAHL} Personen und buchen Sie je ein Gespräch von ${KENNENLERN_MINUTEN} Minuten aus ihren freien Zeiten. Wer nicht selbst vergleichen möchte, lässt sich Vorschläge machen.`,
    },
    {
      title: "Entscheiden – dann beginnt die Mediation",
      text: "Mit der Person, die zu Ihnen passt, geht es weiter: Termine, Unterlagen und Nachrichten an einem Ort. Die Sitzungen rechnen wir zu ihrem Stundensatz ab, den Sie vorher im Profil sehen.",
    },
  ],

  comparisonTitle: "Persönlich oder online — was passt zu Ihnen?",
  comparisonIntro:
    "Beides ist Mediation, beides ist vertraulich. Der Unterschied liegt darin, wie das Gespräch geführt wird. Wenn Ihr Fall online besser aufgehoben ist, sagen wir Ihnen das.",
  comparisonPlans: [
    {
      title: "Persönliche Mediation",
      status: "Vermittelt über medipact",
      features: [
        "Gemeinsame Sitzungen vor Ort oder per Video",
        "Mediatorin führt das Gespräch von Anfang an",
        `Bis zu ${KENNENLERN_ANZAHL} Kennenlerngespräche im Startpaket`,
        "Sitzungen zum Stundensatz aus dem Profil, über medipact abgerechnet",
        "Passt, wenn Sie ein Gegenüber im Raum wollen",
      ],
      featured: true,
    },
    {
      title: "Online-Verfahren",
      status: "Das medipact-Verfahren",
      features: [
        "Beide Seiten arbeiten getrennt und zeitversetzt",
        "Geführter Ablauf in klaren Phasen",
        "Mediator entscheidet die strittigen Punkte per Video",
        "Festpreis für das ganze Verfahren",
        "Passt, wenn gemeinsame Termine schwierig sind",
      ],
    },
    {
      title: "Selbst suchen",
      status: "Verzeichnisse und Einzelanfragen",
      features: [
        "Profile vergleichen, ohne zu wissen, wer passt",
        "Mehrere Mediatorinnen einzeln anschreiben",
        "Auf Rückmeldung und freie Termine warten",
        "Kosten oft erst auf Nachfrage",
      ],
    },
  ],

  trustTitle: "Worauf Sie sich verlassen können",
  trustPoints: [
    {
      title: "Ausgebildete Mediatorinnen und Mediatoren",
      text: "Jede Mediatorin im Pool hat eine Mediationsausbildung abgeschlossen und arbeitet selbstständig. Wir lernen alle persönlich kennen, bevor wir sie vermitteln.",
    },
    {
      title: "Ihre Unterlagen sieht nur Ihre Mediatorin",
      text: "Was Sie zur Vorbereitung hochladen, ist ausschließlich für die Ihnen zugeordnete Mediatorin sichtbar. Mediatorinnen und Mediatoren sind gesetzlich zur Verschwiegenheit verpflichtet (§ 4 Mediationsgesetz).",
    },
    {
      title: "Ehrliche Einordnung",
      text: "Lässt sich Ihr Konflikt im Online-Verfahren schneller oder günstiger klären, sagen wir Ihnen das, bevor Sie etwas buchen. Und wenn Mediation gerade nicht der richtige Weg ist, auch.",
    },
  ],

  faqTitle: "Häufige Fragen zur persönlichen Mediation",
  faqs: [
    {
      question: "Was kostet das?",
      answer:
        `Zuerst das Startpaket zum Festpreis, den Sie vor der Buchung sehen: die geführte Einleitung und bis zu ${KENNENLERN_ANZAHL} Kennenlerngespräche à ${KENNENLERN_MINUTEN} Minuten. Danach die Sitzungen mit Ihrer Mediatorin zu ihrem Stundensatz, der im Profil steht. Wie viele Sitzungen es werden, hängt vom Konflikt ab.`,
    },
    {
      question: "Kann ich mir die Mediatorin selbst aussuchen?",
      answer:
        `Ja. Im Verzeichnis oben finden Sie die Profile unserer Mediatorinnen und Mediatoren. Sie lernen bis zu ${KENNENLERN_ANZAHL} von ihnen kennen und entscheiden dann. Möchten Sie nicht selbst vergleichen, schlägt Ihnen das medipact-Team passende Personen vor.`,
    },
    {
      question: "Vor Ort oder per Video?",
      answer:
        "Beides ist möglich. Geben Sie in der Anfrage an, was Sie bevorzugen und wo Sie wohnen. Für Termine vor Ort suchen wir eine Mediatorin in Ihrer Region.",
    },
    {
      question: "Muss die andere Seite schon zugestimmt haben?",
      answer:
        "Nein. Viele melden sich zuerst allein. Wie die andere Seite eingeladen wird und ob die ersten Sitzungen gemeinsam oder zunächst einzeln stattfinden, besprechen Sie mit Ihrer Mediatorin. Mediation bleibt für alle Beteiligten freiwillig.",
    },
    {
      question: "Was ist der Unterschied zum Online-Verfahren von medipact?",
      answer:
        "Im Online-Verfahren arbeiten beide Seiten getrennt und zeitversetzt durch einen geführten Ablauf, ein Mediator kommt für die strittigen Punkte per Video dazu. Bei der persönlichen Mediation führt die Mediatorin das Gespräch von Anfang an in gemeinsamen Sitzungen. Das Online-Verfahren hat einen Festpreis für den ganzen Fall, die persönliche Mediation wird nach Sitzungen abgerechnet.",
    },
    {
      question: "Ersetzt die Mediation eine anwaltliche Beratung?",
      answer:
        "Nein. Die Mediatorin berät keine Seite rechtlich. Eine Vereinbarung, die in der Mediation entsteht, können beide Seiten vor der Unterschrift anwaltlich prüfen lassen — bei Trennung und Erbschaft ist das meist sinnvoll.",
    },
  ],

  finalCtaTitle: "Finden Sie die Mediatorin, die zu Ihnen passt.",
  finalCtaText: `Bis zu ${KENNENLERN_ANZAHL} kurze Kennenlerngespräche, dann entscheiden Sie. Wer nicht selbst suchen möchte, bekommt von uns Vorschläge.`,
  finalPrimaryCta: {
    label: "Startpaket buchen",
    href: MEDIATOR_ANFRAGE_URL,
  },
  finalCta: {
    label: "Online-Verfahren ansehen",
    href: "/methode",
  },
};
