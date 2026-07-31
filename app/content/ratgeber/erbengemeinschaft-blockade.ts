// Ziel-Suchbegriffe: "erbengemeinschaft einer blockiert", "erbengemeinschaft
// auflösen", "miterbe verweigert zustimmung", "erbengemeinschaft blockade lösen".
//
// Suchsprache-Artikel mit klar handlungsorientierter Intention: Wer so sucht,
// steckt fest und will Optionen. Deshalb ist der Artikel als Wegetabelle
// aufgebaut, nicht als Erklärstück.
//
// Abgrenzung zu geschwister-streiten-ums-erbe: dort die Beziehungsebene, hier
// die Mechanik der Blockade und die konkreten Auswege. Bewusst KEINE
// Wiederholung der Muster-Liste.
//
// Der Erbteilsverkauf wird ehrlich dargestellt: er löst die Blockade für den
// Verkäufer, ist aber wirtschaftlich meist schlecht. Vor Veröffentlichung
// juristisch gegenlesen.

import type { RatgeberArticle } from "./types";

export const article: RatgeberArticle = {
  slug: "erbengemeinschaft-blockade",
  category: "Familie & Erbe",
  title: "Erbengemeinschaft: Einer blockiert – was jetzt?",
  metaTitle: "Erbengemeinschaft: Einer blockiert. Was tun? | medipact",
  description:
    "Ein Miterbe verweigert die Zustimmung und nichts geht voran. Die vier Auswege aus der Blockade – mit ihren echten Kosten und Folgen.",
  eyebrow: "Ratgeber · Familie & Erbe",
  updated: "2026-07-31",
  published: "2026-07-31",
  readingMinutes: 8,
  intro:
    "Eine Erbengemeinschaft ist auf Auflösung angelegt, aber sie löst sich nicht von selbst auf. Solange ein Miterbe nicht mitzieht, steht alles still – oft über Jahre, während Kosten weiterlaufen und der Nachlass an Wert verliert. Dieser Artikel zeigt die vier Wege heraus und was jeder davon wirklich kostet.",
  blocks: [
    {
      type: "heading",
      text: "Warum ein Einzelner alles aufhalten kann",
    },
    {
      type: "paragraph",
      text: "Der Nachlass gehört den Erben gemeinsam, nicht anteilig aufgeteilt. Niemand besitzt „sein Drittel“ des Hauses, das er verkaufen könnte. Über wesentliche Fragen – Verkauf, Auflösung von Konten, Verteilung – muss gemeinsam entschieden werden. Wer nicht zustimmt, muss dafür keinen Grund nennen.",
    },
    {
      type: "paragraph",
      text: "Das Gesetz gibt zwar jedem Miterben das Recht, jederzeit die Auseinandersetzung zu verlangen. Nur: Dieses Verlangen zwingt niemanden zur Zustimmung. Es eröffnet lediglich den Weg, sie gerichtlich zu ersetzen – und dieser Weg ist lang.",
    },
    {
      type: "callout",
      text: "Aussitzen ist keine Option. Die Gemeinschaft besteht weiter, Grundsteuer, Versicherung und Instandhaltung laufen weiter, leerstehende Immobilien verlieren an Wert. Wer wartet, verhandelt in zwei Jahren über einen kleineren Nachlass.",
    },
    {
      type: "heading",
      text: "Die vier Wege heraus",
    },
    {
      type: "table",
      caption: "Auswege aus einer blockierten Erbengemeinschaft im Vergleich",
      headers: ["Weg", "Wie lange", "Was es kostet"],
      rows: [
        [
          "Einigung – notfalls mit Vermittlung",
          "Wochen bis wenige Monate",
          "Am günstigsten; bei medipact 399 € pauschal pro Fall",
        ],
        [
          "Eigenen Erbteil verkaufen",
          "Monate",
          "Deutlicher Abschlag auf den rechnerischen Wert; Miterben haben ein Vorkaufsrecht",
        ],
        [
          "Teilungsversteigerung der Immobilie",
          "oft ein bis zwei Jahre",
          "Verfahrenskosten plus Erlös meist unter Marktwert – alle verlieren",
        ],
        [
          "Klage auf Auseinandersetzung",
          "Jahre",
          "Anwalts- und Gerichtskosten nach Nachlasswert, Gutachten zusätzlich",
        ],
      ],
    },
    {
      type: "heading",
      text: "Weg 1: die Blockade verstehen, bevor man sie bekämpft",
    },
    {
      type: "paragraph",
      text: "Blockaden haben fast immer einen Grund, der selten offen ausgesprochen wird. Wer ihn kennt, findet oft eine Lösung, die nichts kostet.",
    },
    {
      type: "list",
      items: [
        "Misstrauen: Der Blockierende glaubt, nicht alles zu wissen. Abhilfe schafft Transparenz, nicht Druck.",
        "Bindung: An dem Haus hängen Erinnerungen. Ein Zeitplan mit Abschiedsfrist wirkt hier mehr als jedes Angebot.",
        "Geld: Er könnte übernehmen, aber die Finanzierung steht nicht. Stundung oder Ratenzahlung löst das.",
        "Ungesehene Leistung: Pflege oder Instandhaltung wurde nie anerkannt. Die Anerkennung ist oft billiger als der Streit.",
        "Ohnmacht: Wer sich übergangen fühlt, blockiert, weil es die einzige Macht ist, die er hat. Beteiligung nimmt dem den Sinn.",
      ],
    },
    {
      type: "callout",
      text: "Der letzte Punkt erklärt die meisten hartnäckigen Fälle. Eine Blockade ist häufig kein Verhandlungsziel, sondern ein Symptom. Wer den Blockierenden ernsthaft in die Entscheidung einbezieht, verliert oft schneller die Blockade als über jeden Rechtsweg.",
    },
    {
      type: "heading",
      text: "Weg 2: den eigenen Erbteil verkaufen",
    },
    {
      type: "paragraph",
      text: "Jeder Miterbe kann über seinen Anteil am Nachlass als Ganzes verfügen und ihn verkaufen – dafür braucht er die Zustimmung der anderen nicht. Das ist der einzige Weg, der ohne Mitwirkung der Blockierenden funktioniert. Der Kaufvertrag muss notariell beurkundet werden, und die übrigen Miterben haben ein Vorkaufsrecht.",
    },
    {
      type: "paragraph",
      text: "Ehrlich gesagt ist das aber selten ein gutes Geschäft. Gewerbliche Aufkäufer zahlen deutliche Abschläge auf den rechnerischen Wert, weil sie das Blockaderisiko übernehmen. Für die verbleibende Familie kommt hinzu, dass sie es danach mit einem professionellen Miterben zu tun hat – der die Auseinandersetzung meist konsequenter betreibt als der Verwandte zuvor.",
    },
    {
      type: "heading",
      text: "Weg 3 und 4: die gerichtlichen Wege",
    },
    {
      type: "paragraph",
      text: "Bei Immobilien führt der Weg über die Teilungsversteigerung: Ein Miterbe beantragt sie, das Objekt wird versteigert, der Erlös tritt an die Stelle der Immobilie. Sie funktioniert, aber sie ist teuer. Erlöse liegen regelmäßig unter dem freien Marktwert, und die Verfahrenskosten trägt am Ende der Nachlass – also alle.",
    },
    {
      type: "paragraph",
      text: "Die Auseinandersetzungsklage ist noch aufwendiger, weil ein vollständiger, teilungsreifer Plan vorgelegt werden muss. In der Praxis dauert das Jahre. Beide Wege sind sinnvoll, wenn wirklich nichts anderes mehr geht – als erste Reaktion auf eine Blockade sind sie meist die teuerste denkbare Antwort.",
    },
    {
      type: "cta",
      text: "Kostenrisiko des Erbstreits berechnen",
      href: "/kostenrechner?art=erbschaft",
    },
    {
      type: "heading",
      text: "Was ein strukturiertes Verfahren hier leistet",
    },
    {
      type: "paragraph",
      text: "Die meisten Blockaden lösen sich, wenn drei Dinge passieren: vollständige Transparenz über den Nachlass, eine von allen akzeptierte Bewertung und ein Verteilungsvorschlag, der die Interessen jedes Beteiligten aufnimmt statt nur Quoten zu rechnen.",
    },
    {
      type: "paragraph",
      text: "Bei medipact läuft das schriftlich und online, ohne gemeinsame Termine. Gerade bei Erbengemeinschaften mit mehreren Beteiligten an verschiedenen Orten ist das der praktische Vorteil: Niemand muss anreisen, jeder arbeitet in seinem Tempo. Der Fall kostet pauschal 399 €, gezahlt von der anlegenden Partei – für alle anderen Miterben entstehen keine Kosten.",
    },
    {
      type: "callout",
      text: "Dieser Artikel ersetzt keine Rechtsberatung. Ob ein Erbteilsverkauf, eine Teilungsversteigerung oder eine Klage in Ihrem Fall sinnvoll ist, hängt von der Zusammensetzung des Nachlasses und Ihrer Quote ab. Lassen Sie das prüfen, bevor Sie einen dieser Wege einschlagen.",
    },
    {
      type: "cta",
      text: "Erbengemeinschaft auflösen – strukturiert und online",
      href: "/konflikte/erbschaft",
    },
  ],
  faq: [
    {
      question: "Was tun, wenn ein Miterbe die Erbengemeinschaft blockiert?",
      answer:
        "Zuerst herausfinden, warum blockiert wird – meist steckt Misstrauen, fehlende Finanzierung oder das Gefühl dahinter, übergangen worden zu sein. Diese Gründe lassen sich oft ohne Verfahren ausräumen. Bleibt es bei der Blockade, sind der Verkauf des eigenen Erbteils, die Teilungsversteigerung und die Auseinandersetzungsklage die Auswege.",
    },
    {
      question: "Kann ich meinen Erbteil verkaufen, ohne die anderen zu fragen?",
      answer:
        "Ja. Jeder Miterbe kann über seinen Anteil am Nachlass als Ganzes verfügen, ohne dass die übrigen zustimmen müssen. Der Vertrag muss notariell beurkundet werden, und die Miterben haben ein Vorkaufsrecht. Wirtschaftlich ist das meist ungünstig: Gewerbliche Aufkäufer zahlen deutliche Abschläge auf den rechnerischen Wert.",
    },
    {
      question: "Wie lange dauert eine Teilungsversteigerung?",
      answer:
        "Von der Antragstellung bis zum Zuschlag vergeht häufig ein bis zwei Jahre, in komplizierten Fällen länger. In dieser Zeit laufen Grundsteuer, Versicherung und Instandhaltung weiter zulasten des Nachlasses. Der erzielte Erlös liegt zudem regelmäßig unter dem freien Marktwert – deshalb ist sie das letzte Mittel.",
    },
    {
      question: "Muss ich der Auflösung der Erbengemeinschaft zustimmen?",
      answer:
        "Jeder Miterbe kann die Auseinandersetzung jederzeit verlangen, aber niemand kann zur Zustimmung zu einem konkreten Vorschlag gezwungen werden. Verweigert jemand die Mitwirkung, muss die Zustimmung gerichtlich ersetzt oder die Immobilie versteigert werden – beides dauert und kostet den Nachlass Geld.",
    },
    {
      question: "Löst sich eine Erbengemeinschaft irgendwann von selbst auf?",
      answer:
        "Nein. Sie besteht fort, bis der Nachlass auseinandergesetzt ist – theoretisch über Generationen. Stirbt ein Miterbe, rücken dessen Erben nach, und die Gemeinschaft wird größer und schwerer zu einigen. Warten verschlechtert die Ausgangslage deshalb regelmäßig, statt sie zu verbessern.",
    },
  ],
  related: [
    { label: "Geschwister streiten ums Erbe – was tun?", href: "/ratgeber/geschwister-streiten-ums-erbe" },
    { label: "Erbstreit lösen ohne Gericht", href: "/ratgeber/erbstreit-loesen-ohne-gericht" },
    { label: "Pflichtteil einfordern", href: "/ratgeber/pflichtteil-einfordern" },
    { label: "Erbschaft & Familie: Mediation im Überblick", href: "/konflikte/erbschaft" },
  ],
};
