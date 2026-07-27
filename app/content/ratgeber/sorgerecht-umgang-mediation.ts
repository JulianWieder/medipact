// Ziel-Suchbegriffe: "sorgerecht mediation", "umgangsregelung ohne gericht",
// "sorgerecht einigung trennung", "wechselmodell vereinbaren".
//
// Longtail im Trennungs-Cluster. Bewusst "Sorgerecht UND Umgang" in einem
// Artikel: Nutzer verwenden die Begriffe synonym, obwohl sie juristisch
// verschiedene Dinge meinen – das wird im Text einmal sauber getrennt und
// bedient damit beide Suchintentionen auf einer URL.
//
// ACHTUNG Familienrecht: elterliche Sorge, Aufenthaltsbestimmung, Umgang und
// die Rolle des Jugendamts sind stark geregelt. Der Text nennt bewusst KEINE
// Paragrafen, Fristen oder Altersgrenzen für die Kindesanhörung und verweist
// konsequent auf Jugendamt bzw. anwaltliche Prüfung.
// Vor Veröffentlichung juristisch gegenlesen.
//
// Preise aus backend/app/pricing.py: trennung = 399 € online, 499 € hybrid,
// 899 € vollservice – jeweils PRO PARTEI.

import type { RatgeberArticle } from "./types";

export const article: RatgeberArticle = {
  slug: "sorgerecht-umgang-mediation",
  category: "Trennung & Scheidung",
  title: "Sorgerecht und Umgang ohne Gericht regeln",
  metaTitle: "Sorgerecht & Umgang: Einigung statt Gericht | medipact",
  description:
    "Betreuung, Umgang, Wechselmodell: Wie Eltern nach der Trennung eine tragfähige Regelung finden – ohne Gutachten und Gericht. Ablauf, Kosten, Grenzen.",
  eyebrow: "Ratgeber · Trennung & Scheidung",
  updated: "2026-07-27",
  readingMinutes: 9,
  intro:
    "Von allen Trennungsthemen ist die Betreuung der Kinder das einzige, das nicht abgeschlossen werden kann. Vermögen wird einmal geteilt, Unterhalt einmal berechnet – die Frage, wer das Kind wann hat und wer welche Entscheidung trifft, stellt sich in den nächsten Jahren immer wieder neu. Deshalb kommt es hier weniger auf ein Ergebnis an als auf eine Regelung, die sich anpassen lässt, ohne dass jedes Mal gestritten wird.",
  blocks: [
    {
      type: "heading",
      text: "Sorgerecht und Umgang sind nicht dasselbe",
    },
    {
      type: "paragraph",
      text: "Im Alltag werden beide Begriffe synonym verwendet, sie meinen aber Verschiedenes. Die elterliche Sorge betrifft Entscheidungen: Schule, medizinische Behandlung, Aufenthalt, größere finanzielle Fragen. Der Umgang betrifft Zeit: Wer ist wann mit dem Kind zusammen. Beides kann getrennt geregelt werden – gemeinsame Sorge und trotzdem sehr unterschiedliche Betreuungsanteile sind der Normalfall, kein Widerspruch.",
    },
    {
      type: "paragraph",
      text: "Diese Unterscheidung ist praktisch wichtig, weil sich Konflikte oft an der falschen Stelle festmachen. Wer um das Sorgerecht kämpft, meint häufig eigentlich, nicht genug Zeit mit dem Kind zu haben – oder von Entscheidungen erst hinterher zu erfahren. Das sind zwei verschiedene Probleme, und sie brauchen verschiedene Lösungen.",
    },
    {
      type: "list",
      items: [
        "Elterliche Sorge: Wer entscheidet worüber, und wie werden Entscheidungen kommuniziert?",
        "Aufenthalt: Wo hat das Kind seinen Lebensmittelpunkt?",
        "Umgang: Regelmäßige Zeiten, Ferien, Feiertage, Geburtstage, Übergaben.",
        "Information: Wer erfährt wie schnell von Krankheit, Schulproblemen, Terminen?",
        "Neue Partner, Umzug, Auslandsreisen: Wie wird damit umgegangen, bevor es akut wird?",
      ],
    },
    {
      type: "heading",
      text: "Warum ein Gerichtsverfahren hier besonders teuer ist",
    },
    {
      type: "paragraph",
      text: "Die finanziellen Kosten sind dabei nicht einmal der wichtigste Punkt. In strittigen Kindschaftssachen kommen häufig Verfahrensbeistand und Sachverständigengutachten hinzu, die Verfahren ziehen sich – und in dieser Zeit leben die Kinder in einer ungeklärten Situation, in der jede Übergabe eine Verhandlung ist.",
    },
    {
      type: "paragraph",
      text: "Der schwerwiegendere Effekt ist ein anderer: Ein streitiges Verfahren zwingt beide Eltern in eine Rolle, in der sie belegen müssen, warum die andere Seite ungeeignet ist. Was dort schriftlich vorgetragen wird, lässt sich nicht zurücknehmen. Danach sollen dieselben Menschen sich noch fünfzehn Jahre lang über Elternabende und Impftermine abstimmen. Genau daran scheitert es oft.",
    },
    {
      type: "callout",
      text: "Eine Regelung ist nicht gut, weil sie gerecht zwischen den Eltern aufteilt, sondern weil sie im Alltag funktioniert. Der beste Maßstab ist nicht „Wie viele Tage bekomme ich?\", sondern „Können wir das nächstes Jahr anpassen, ohne dass es eskaliert?\"",
    },
    {
      type: "heading",
      text: "Was in einer Elternvereinbarung geregelt wird",
    },
    {
      type: "paragraph",
      text: "Der Unterschied zwischen einer Regelung, die hält, und einer, die nach drei Monaten wieder aufbricht, liegt fast immer im Detail. Vage Formulierungen wie „regelmäßiger Umgang nach Absprache\" sind keine Lösung, sondern eine Vertagung des Konflikts. Eine belastbare Elternvereinbarung ist konkret:",
    },
    {
      type: "list",
      items: [
        "Betreuungsmodell: Residenz-, Wechsel- oder Nestmodell – mit konkreten Tagen und Uhrzeiten.",
        "Ferien und Feiertage: Aufteilung im Jahresrhythmus, wer wählt in welchem Jahr zuerst.",
        "Übergaben: Wo, wann, durch wen – und was gilt, wenn ein Kind einmal nicht mitwill.",
        "Kommunikation: Über welchen Kanal, in welcher Frist wird auf Nachrichten geantwortet?",
        "Entscheidungen: Was entscheidet jeder allein, was wird gemeinsam entschieden?",
        "Ausfälle und Änderungen: Wie wird kurzfristig getauscht, wie werden ausgefallene Zeiten nachgeholt?",
        "Kosten: Wer trägt Kita, Klassenfahrt, Sportverein, Kieferorthopädie?",
        "Überprüfung: Ein fester Termin, an dem die Regelung ohne Anlass angepasst wird.",
      ],
    },
    {
      type: "paragraph",
      text: "Der letzte Punkt ist der unterschätzteste. Eine Umgangsregelung für ein dreijähriges Kind passt einem Zwölfjährigen nicht mehr. Wenn im Voraus vereinbart ist, dass jährlich neu geschaut wird, ist eine Änderung ein normaler Vorgang – und kein Angriff, der abgewehrt werden muss.",
    },
    {
      type: "heading",
      text: "Ablauf: Betreuung online klären",
    },
    {
      type: "list",
      items: [
        "Getrennte Fallaufnahme: Beide Elternteile schildern ihre Sicht schriftlich und einzeln.",
        "Ist-Zustand erfassen: Wie läuft es aktuell tatsächlich – nicht, wie es vereinbart war?",
        "Interessen klären: Verlässlichkeit, Beteiligung am Alltag, Entlastung, Nähe zur Schule.",
        "Modelle durchrechnen: Was ist mit Arbeitszeiten, Schulweg und Wohnorten realistisch?",
        "Vereinbarung: konkret, mit Kalender, Kommunikationsregeln und Überprüfungstermin.",
      ],
    },
    {
      type: "paragraph",
      text: "Bei medipact läuft der Prozess online und asynchron. Für Elternkonflikte ist das ein echter Vorteil: Sie müssen sich nicht gegenübersitzen, und wer seine Position aufschreibt statt sie im Affekt zu sagen, formuliert überlegter. Die Trennungsmediation kostet 399 € pro Partei im Online-Verfahren, 499 € in der Hybrid-Variante mit Video-Terminen und 899 € im Vollservice.",
    },
    {
      type: "heading",
      text: "Welche Rolle spielen Jugendamt und Gericht?",
    },
    {
      type: "paragraph",
      text: "Das Jugendamt bietet kostenlose Beratung zu Sorge und Umgang an – unabhängig davon, ob ein Verfahren läuft. Diese Beratung ist freiwillig, und sie ist nicht dasselbe wie eine Meldung: Wer sich beraten lässt, gerät dadurch nicht unter Beobachtung. Für viele Eltern ist das der niedrigschwelligste erste Schritt, und er kostet nichts.",
    },
    {
      type: "paragraph",
      text: "Eine Elternvereinbarung ist zunächst eine Absprache zwischen den Eltern. Soll sie gerichtlich durchsetzbar sein, kann sie dem Familiengericht zur Billigung vorgelegt werden. Ob das in Ihrem Fall sinnvoll ist, hängt vom Vertrauensverhältnis ab – und ist eine Frage, die Sie anwaltlich klären sollten. In vielen Fällen genügt eine schriftliche Vereinbarung, gerade weil beide Eltern sie selbst entwickelt haben.",
    },
    {
      type: "callout",
      text: "Mediation ersetzt keine Rechtsberatung und keine Kinderschutzmaßnahme. Wenn es Hinweise auf Gewalt oder Gefährdung des Kindes gibt, ist das kein Verhandlungsthema – wenden Sie sich an das Jugendamt oder unmittelbar an das Familiengericht.",
    },
    {
      type: "heading",
      text: "Wann Mediation nicht der richtige Weg ist",
    },
    {
      type: "list",
      items: [
        "Es besteht der Verdacht auf Gewalt gegen das Kind oder gegen einen Elternteil.",
        "Ein Elternteil hat Angst und kann seine Position nicht frei vertreten.",
        "Es geht um Kindeswohlgefährdung durch Sucht, schwere Erkrankung oder Vernachlässigung.",
        "Ein Elternteil nutzt Gespräche erkennbar nur, um Zeit zu gewinnen oder Kontakt zu verhindern.",
      ],
    },
    {
      type: "paragraph",
      text: "In allen anderen Fällen gilt: Je früher eine Struktur steht, desto weniger Anlass gibt es zu streiten. Die meisten Elternkonflikte nach einer Trennung entstehen nicht aus Bosheit, sondern aus Unklarheit – aus Absprachen, die nie konkret genug waren, um im Alltag zu tragen.",
    },
    {
      type: "cta",
      text: "Betreuung und Umgang klären – Online-Mediation ab 399 € pro Partei",
      href: "/konflikte/trennung",
    },
  ],
  faq: [
    {
      question: "Kann man Sorgerecht und Umgang ohne Gericht regeln?",
      answer:
        "Ja. Solange beide Elternteile gesprächsbereit sind, lässt sich eine Elternvereinbarung außergerichtlich erarbeiten: Betreuungsmodell, Ferien, Übergaben, Kommunikation und Kostenteilung. Soll sie gerichtlich durchsetzbar sein, kann sie dem Familiengericht zur Billigung vorgelegt werden. Ob das nötig ist, hängt vom Vertrauensverhältnis ab und sollte anwaltlich geklärt werden.",
    },
    {
      question: "Was kostet eine Mediation zum Sorgerecht?",
      answer:
        "Bei medipact ist das Teil der Trennungsmediation: 399 € pro Partei im Online-Verfahren, 499 € in der Hybrid-Variante mit Video-Terminen, 899 € im Vollservice – als Pauschale ohne Stundenabrechnung. In strittigen gerichtlichen Kindschaftssachen kommen dagegen häufig Verfahrensbeistand und Sachverständigengutachten hinzu.",
    },
    {
      question: "Was ist der Unterschied zwischen Sorgerecht und Umgangsrecht?",
      answer:
        "Die elterliche Sorge betrifft Entscheidungen – Schule, medizinische Behandlung, Aufenthalt. Der Umgang betrifft Zeit: wer wann mit dem Kind zusammen ist. Beides wird getrennt geregelt. Gemeinsame Sorge bei sehr unterschiedlichen Betreuungsanteilen ist der Normalfall und kein Widerspruch.",
    },
    {
      question: "Hilft das Jugendamt auch ohne Gerichtsverfahren?",
      answer:
        "Ja. Das Jugendamt bietet kostenlose Beratung zu Sorge und Umgang an, unabhängig von einem laufenden Verfahren und auf freiwilliger Basis. Eine Beratung ist keine Meldung – wer sie in Anspruch nimmt, gerät dadurch nicht unter Beobachtung. Für viele Eltern ist das der niedrigschwelligste erste Schritt.",
    },
    {
      question: "Was, wenn sich die Situation später ändert?",
      answer:
        "Deshalb gehört ein fester Überprüfungstermin in jede Elternvereinbarung. Eine Regelung für ein dreijähriges Kind passt einem Zwölfjährigen nicht mehr. Wenn vorab vereinbart ist, dass jährlich neu geschaut wird, ist eine Anpassung ein normaler Vorgang statt eines Angriffs, der abgewehrt werden muss.",
    },
  ],
  related: [
    { label: "Trennung & Scheidung: Mediation im Überblick", href: "/konflikte/trennung" },
    { label: "Scheidung mit Mediator: Was kostet das?", href: "/ratgeber/scheidung-mediator-kosten" },
    { label: "Scheidung ohne Rosenkrieg", href: "/ratgeber/scheidung-ohne-rosenkrieg" },
    { label: "Ich will mich trennen – was jetzt?", href: "/ratgeber/ich-will-mich-trennen" },
    { label: "Vermögensauseinandersetzung bei Trennung", href: "/ratgeber/vermoegensauseinandersetzung" },
  ],
};
