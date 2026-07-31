// Ziel-Suchbegriffe: "nachbar laut was tun", "nachbar lärmt nachts", "was tun
// gegen laute nachbarn", "ruhestörung nachbar".
//
// Suchsprache-Artikel mit sehr hoher Suchintention und akutem Anlass. Deshalb
// als Eskalationsleiter aufgebaut: Der Leser will wissen, was er HEUTE tun
// kann, nicht was Mediation ist.
//
// ZWEI WICHTIGE EHRLICHKEITSPUNKTE:
// 1. Ruhezeiten sind Landes- und Gemeindesache — keine bundeseinheitlichen
//    Uhrzeiten behaupten. Der Text nennt nur die verbreitete Nachtruhe und
//    verweist im Übrigen auf die Gemeinde.
// 2. In mehreren Bundesländern ist ein Schlichtungsversuch vor einer
//    Nachbarklage PFLICHT — dafür braucht es aber eine staatlich anerkannte
//    Gütestelle. medipact ist das nicht, und das muss dranstehen. Nichts
//    behaupten, was den Nutzer vor Gericht auflaufen lässt.
//
// Preise aus backend/app/pricing.py: nachbarschaft = 49 € "per_party".

import type { RatgeberArticle } from "./types";

export const article: RatgeberArticle = {
  slug: "nachbar-laerm-was-tun",
  category: "Nachbarschaft",
  title: "Der Nachbar ist zu laut – was kann ich tun?",
  metaTitle: "Nachbar zu laut: Was kann ich tun? | medipact",
  description:
    "Vom Gespräch bis zur Klage: die sinnvolle Reihenfolge bei Lärm vom Nachbarn – und warum das Lärmprotokoll der wichtigste Schritt ist.",
  eyebrow: "Ratgeber · Nachbarschaft",
  updated: "2026-07-31",
  published: "2026-07-31",
  readingMinutes: 8,
  intro:
    "Wer nachts nicht schlafen kann, sucht keine Rechtsberatung, sondern Ruhe. Die gute Nachricht: In den meisten Fällen ist die Lösung nicht juristisch. Die schlechte: Die Reihenfolge der Schritte entscheidet darüber, ob es in zwei Wochen erledigt ist oder in zwei Jahren vor Gericht. Dieser Artikel zeigt die Reihenfolge.",
  blocks: [
    {
      type: "heading",
      text: "Zuerst: dokumentieren, bevor Sie irgendetwas anderes tun",
    },
    {
      type: "paragraph",
      text: "Das klingt nach dem langweiligsten Rat der Welt, und es ist trotzdem der wichtigste. Ohne Aufzeichnung steht später Aussage gegen Aussage – gegenüber dem Vermieter, gegenüber der Behörde und erst recht vor Gericht. Mit Aufzeichnung ändert sich die Verhandlungsposition sofort, oft schon im Gespräch.",
    },
    {
      type: "list",
      items: [
        "Datum und Uhrzeit, Beginn und Ende – möglichst auf die Minute.",
        "Art des Geräuschs: Musik, Schritte, Bohren, Bass, Hundegebell, Stimmen.",
        "Wie es sich auswirkt: In welchem Raum hören Sie es, konnten Sie schlafen, mussten Sie das Zimmer wechseln?",
        "Was Sie unternommen haben: geklingelt, angerufen, nichts – und wie reagiert wurde.",
        "Zeugen, wenn jemand mitbekommen hat.",
      ],
    },
    {
      type: "callout",
      text: "Führen Sie das über mindestens zwei bis vier Wochen. Ein einzelner Eintrag beweist einen schlechten Abend, eine lückenlose Reihe beweist ein Muster – und nur das Muster ist rechtlich relevant. Im kostenlosen Konflikt-Logbuch von medipact können Sie das strukturiert und mit Zeitstempel festhalten.",
    },
    {
      type: "cta",
      text: "Lärm kostenlos dokumentieren – im Konflikt-Logbuch",
      href: "/konflikt-logbuch",
    },
    {
      type: "heading",
      text: "Die Reihenfolge, die funktioniert",
    },
    {
      type: "table",
      caption: "Sinnvolle Reihenfolge der Schritte bei Lärmbelästigung durch Nachbarn",
      headers: ["Schritt", "Wann", "Erfolgsaussicht"],
      rows: [
        [
          "Gespräch suchen",
          "sofort, aber nicht im Ärger und nicht nachts",
          "Löst den größten Teil aller Fälle",
        ],
        [
          "Schriftlich und freundlich",
          "wenn das Gespräch nichts ändert",
          "Wirkt oft, weil es Ernsthaftigkeit signalisiert",
        ],
        [
          "Vermieter einschalten",
          "wenn Sie oder der Nachbar zur Miete wohnen",
          "Gut – der Vermieter hat Mittel, die Sie nicht haben",
        ],
        [
          "Mediation oder Schlichtung",
          "wenn die Fronten verhärtet sind",
          "Hoch, weil beide Seiten weiter Nachbarn bleiben",
        ],
        [
          "Ordnungsamt oder Polizei",
          "bei akuter nächtlicher Störung",
          "Sofortwirkung, aber belastet das Verhältnis dauerhaft",
        ],
        [
          "Klage",
          "zuletzt",
          "Dauert, kostet, und Sie wohnen danach weiter nebeneinander",
        ],
      ],
    },
    {
      type: "heading",
      text: "Zum Gespräch: der häufigste Fehler",
    },
    {
      type: "paragraph",
      text: "Die meisten klingeln in dem Moment, in dem sie sich am meisten ärgern – also nachts, wütend, im Bademantel. Das erzeugt zuverlässig eine Abwehrreaktion, und aus einem Lärmproblem wird ein Personenkonflikt. Ab dann geht es nicht mehr um Dezibel, sondern darum, wer sich zuerst im Ton vergriffen hat.",
    },
    {
      type: "paragraph",
      text: "Wirksamer ist das Gespräch am nächsten Tag, sachlich, mit einer konkreten Bitte statt eines Vorwurfs. Viele Menschen unterschätzen schlicht, wie hellhörig ein Haus ist – sie hören ihren eigenen Lärm nicht so, wie er bei Ihnen ankommt.",
    },
    {
      type: "heading",
      text: "Ruhezeiten: worauf Sie sich berufen können",
    },
    {
      type: "paragraph",
      text: "Weit verbreitet ist eine allgemeine Nachtruhe von 22 bis 6 Uhr. Darüber hinaus sind Ruhezeiten aber Sache der Länder und Gemeinden – Mittagsruhe, Sonn- und Feiertagsregelungen und die Zeiten für Gartengeräte unterscheiden sich erheblich. Werfen Sie einen Blick in die Ortssatzung Ihrer Gemeinde, bevor Sie sich auf eine Uhrzeit berufen.",
    },
    {
      type: "paragraph",
      text: "Wichtig für die Einordnung: Ruhezeit heißt nicht Stille. Auch tagsüber gilt eine Grenze, wenn die Beeinträchtigung wesentlich ist. Umgekehrt gilt für Kinderlärm ein besonderer Schutz – er ist grundsätzlich hinzunehmen, und ein Vorgehen dagegen hat kaum Aussicht auf Erfolg.",
    },
    {
      type: "heading",
      text: "Wenn Sie zur Miete wohnen",
    },
    {
      type: "paragraph",
      text: "Dann ist der Vermieter Ihr wirksamster Hebel. Er ist verpflichtet, Ihnen die Wohnung in vertragsgemäßem Zustand zu überlassen, und andauernder Lärm kann eine Mietminderung rechtfertigen. Er hat gegenüber dem störenden Mieter Mittel, die Ihnen nicht zur Verfügung stehen – bis hin zur Kündigung.",
    },
    {
      type: "paragraph",
      text: "Melden Sie den Mangel schriftlich und legen Sie Ihr Protokoll bei. Eine Minderung sollten Sie allerdings erst nach Beratung vornehmen: Wer zu viel mindert, riskiert Zahlungsverzug und im schlimmsten Fall die eigene Kündigung.",
    },
    {
      type: "heading",
      text: "Warum Mediation hier besonders gut passt",
    },
    {
      type: "paragraph",
      text: "Der entscheidende Unterschied zu fast allen anderen Konflikten: Sie können den Streit gewinnen und trotzdem verlieren. Nach dem Urteil wohnen Sie weiter Wand an Wand, jahrelang, und jede Begegnung im Treppenhaus ist eine Fortsetzung des Verfahrens. Ein Gericht kann eine Unterlassung anordnen; ein erträgliches Nebeneinander kann es nicht anordnen.",
    },
    {
      type: "paragraph",
      text: "In der Praxis führen Nachbarschaftsverfahren deshalb überdurchschnittlich oft zu Vereinbarungen, die ein Gericht gar nicht treffen könnte: feste Ruhezeiten für Instrumente, ein Teppich im Flur, die Ankündigung von Feiern, eine Absprache über den Hund am Wochenende. Das sind Lösungen, keine Urteile.",
    },
    {
      type: "paragraph",
      text: "Bei medipact läuft das schriftlich und online – niemand muss dem Nachbarn gegenübersitzen, was gerade bei verhärteten Fronten die Hemmschwelle senkt. Der Fall kostet 49 € pro Partei.",
    },
    {
      type: "cta",
      text: "Was würde der Streit vor Gericht kosten?",
      href: "/kostenrechner?art=nachbarschaft",
    },
    {
      type: "callout",
      text: "Wichtig vor einer Klage: In mehreren Bundesländern muss bei Nachbarstreitigkeiten zunächst ein Schlichtungsversuch vor einer staatlich anerkannten Gütestelle unternommen werden, sonst ist die Klage unzulässig. medipact ist keine solche anerkannte Gütestelle – eine Mediation bei uns ersetzt diesen Pflichtversuch also nicht. Erkundigen Sie sich bei Ihrem Amtsgericht oder Schiedsamt, ob das in Ihrem Bundesland gilt.",
    },
    {
      type: "cta",
      text: "Nachbarschaftsstreit klären – 49 € pro Partei",
      href: "/konflikte/nachbarschaft",
    },
  ],
  faq: [
    {
      question: "Was kann ich tun, wenn der Nachbar zu laut ist?",
      answer:
        "Zuerst dokumentieren: Datum, Uhrzeit, Art und Dauer des Lärms über mehrere Wochen. Dann das sachliche Gespräch suchen – nicht nachts im Ärger, sondern am nächsten Tag mit einer konkreten Bitte. Bleibt es dabei, folgen schriftliche Aufforderung, Vermieter, Schlichtung oder Mediation und erst zuletzt der Rechtsweg.",
    },
    {
      question: "Ab wann gilt Ruhestörung?",
      answer:
        "Verbreitet ist eine allgemeine Nachtruhe von 22 bis 6 Uhr. Mittagsruhe sowie Regeln für Sonntage und Gartengeräte sind aber Sache der Länder und Gemeinden und unterscheiden sich deutlich – maßgeblich ist die Satzung Ihrer Gemeinde. Auch außerhalb der Ruhezeiten gilt eine Grenze, wenn die Beeinträchtigung wesentlich ist.",
    },
    {
      question: "Wie führe ich ein Lärmprotokoll richtig?",
      answer:
        "Notieren Sie zu jedem Vorfall Datum, Beginn und Ende, die Art des Geräuschs, in welchem Raum Sie es wahrnehmen, wie es sich auswirkt und was Sie unternommen haben. Führen Sie das lückenlos über mindestens zwei bis vier Wochen – erst ein erkennbares Muster ist rechtlich verwertbar, ein Einzeleintrag nicht.",
    },
    {
      question: "Kann ich die Miete mindern, wenn der Nachbar dauernd laut ist?",
      answer:
        "Grundsätzlich kann anhaltender Lärm ein Mietmangel sein. Melden Sie ihn zuerst schriftlich beim Vermieter und legen Sie Ihr Protokoll bei. Mit der Minderung selbst sollten Sie warten, bis Sie sich beraten lassen haben: Wer zu viel mindert, gerät in Zahlungsverzug und riskiert die eigene Kündigung.",
    },
    {
      question: "Muss ich vor einer Klage einen Schlichtungsversuch machen?",
      answer:
        "In mehreren Bundesländern ja – bei Nachbarstreitigkeiten ist dort zunächst ein Einigungsversuch vor einer staatlich anerkannten Gütestelle vorgeschrieben, sonst ist die Klage unzulässig. Ob das für Sie gilt, erfahren Sie bei Ihrem Amtsgericht oder Schiedsamt. Eine Mediation bei medipact ersetzt diesen Pflichtversuch nicht.",
    },
  ],
  related: [
    { label: "Wie hoch darf die Hecke des Nachbarn sein?", href: "/ratgeber/hecke-nachbar-hoehe" },
    { label: "Nachbarschaftsstreit schlichten", href: "/ratgeber/nachbarschaftsstreit-was-tun" },
    { label: "Konflikt dokumentieren: Streit-Tagebuch führen", href: "/ratgeber/konflikt-dokumentieren" },
    { label: "Nachbarschaft: Mediation im Überblick", href: "/konflikte/nachbarschaft" },
  ],
};
