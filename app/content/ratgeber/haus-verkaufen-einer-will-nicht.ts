// Ziel-Suchbegriffe (GSC 14.10.2026, fünfter Export in Folge ohne passende
// Seite): "trennung haus verkaufen" (10 Impr, Pos 97), "haus verkaufen
// trennung" (7), "erbengemeinschaft grundstück einer will nicht verkaufen"
// (10, Pos 86).
//
// Zuständigkeit: haus-bei-scheidung beantwortet "welche Wege gibt es mit dem
// Haus" (Übernahme, Verkauf, Vermietung). Dieser Artikel beantwortet nur den
// Blockade-Fall: ein Miteigentümer will verkaufen, der andere nicht – gleich,
// ob nach Trennung oder in der Erbengemeinschaft. Erb-Spezifika (Mehrheiten,
// Verwaltung) bleiben in erbengemeinschaft-blockade und werden verlinkt.
//
// Rechtliches (Teilungsversteigerung, Zustimmungserfordernis bei
// Zugewinngemeinschaft, einstweilige Einstellung) bewusst allgemein und ohne
// Fristen formuliert. Vor Veröffentlichung juristisch gegenlesen.

import type { RatgeberArticle } from "./types";

export const article: RatgeberArticle = {
  slug: "haus-verkaufen-einer-will-nicht",
  category: "Trennung & Scheidung",
  title: "Haus verkaufen, aber einer will nicht: Was Miteigentümer tun können",
  metaTitle: "Haus verkaufen, einer will nicht: Was tun? | medipact",
  description:
    "Nach Trennung oder Erbfall will einer das Haus verkaufen, der andere nicht. Die Wege aus der Blockade, die Teilungsversteigerung und wie man sich einigt.",
  eyebrow: "Ratgeber · Trennung & Erbe",
  updated: "2026-10-16",
  published: "2026-10-16",
  readingMinutes: 8,
  intro:
    "Ein Haus, zwei oder mehr Eigentümer, und einer will verkaufen, während der andere nicht will: Das passiert nach einer Trennung ebenso wie in einer Erbengemeinschaft. Solange niemand nachgibt, steht alles still – die Raten laufen weiter, das Haus steht leer oder wird nur von einem genutzt, und jeder Monat verschärft den Streit. Dieser Artikel zeigt, welche Wege es aus der Blockade gibt, warum der gerichtliche Weg fast immer der teuerste ist und wie eine Einigung aussehen kann, mit der beide leben.",
  blocks: [
    { type: "heading", text: "Warum einer allein nicht verkaufen kann" },
    {
      type: "paragraph",
      text: "Gehört ein Haus mehreren Personen, kann es nur verkauft werden, wenn alle Eigentümer zustimmen. Das gilt für Ehepaare, die beide im Grundbuch stehen, genauso wie für Geschwister in einer Erbengemeinschaft. Wer nicht unterschreibt, blockiert den freihändigen Verkauf – auch dann, wenn er nur einen kleinen Anteil hält.",
    },
    {
      type: "paragraph",
      text: "Umgekehrt kann aber auch niemand dauerhaft gezwungen werden, Miteigentümer zu bleiben. Jeder Beteiligte kann grundsätzlich verlangen, dass die Gemeinschaft aufgelöst wird. Lässt sich das nicht einvernehmlich regeln, bleibt am Ende die Teilungsversteigerung. Genau diese Spannung – keiner kann allein verkaufen, aber jeder kann die Versteigerung beantragen – bestimmt, wie Verhandlungen in dieser Lage verlaufen.",
    },
    { type: "heading", text: "Die vier Wege aus der Blockade" },
    {
      type: "table",
      caption: "Wege, wenn ein Miteigentümer das Haus verkaufen will und der andere nicht",
      headers: ["Weg", "Was passiert", "Wann er passt"],
      rows: [
        [
          "Übernahme",
          "Einer behält das Haus und zahlt den anderen aus; die Bank muss die Finanzierung auf ihn allein umstellen.",
          "wenn einer im Haus bleiben will und es sich allein leisten kann",
        ],
        [
          "Gemeinsamer Verkauf",
          "Das Haus wird freihändig zum Marktpreis verkauft, der Erlös nach Anteilen geteilt.",
          "wenn keiner das Haus halten kann oder will",
        ],
        [
          "Aufschub mit Regeln",
          "Verkauf erst zu einem vereinbarten Zeitpunkt, etwa wenn die Kinder aus der Schule sind; bis dahin klare Absprachen zu Nutzung, Miete und Kosten.",
          "wenn der Zeitpunkt der eigentliche Streitpunkt ist",
        ],
        [
          "Teilungsversteigerung",
          "Ein Miteigentümer beantragt die Versteigerung beim Amtsgericht; der Erlös wird nach Abzug der Kosten verteilt.",
          "wenn jede Einigung gescheitert ist",
        ],
      ],
    },
    { type: "heading", text: "Teilungsversteigerung: das Druckmittel, das beiden schadet" },
    {
      type: "paragraph",
      text: "Die Teilungsversteigerung wird oft als Drohung eingesetzt, weil sie den Blockierenden zum Handeln zwingt. Sie ist aber für beide Seiten meist ein Verlustgeschäft. Bei einer Zwangsversteigerung bieten Interessenten in der Regel vorsichtiger als bei einem normalen Verkauf: Sie können das Haus oft nicht vorher von innen besichtigen, und die Käuferschicht ist kleiner. Dazu kommen Gerichtskosten, ein Gutachten und ein Verfahren, das sich über Monate bis Jahre hinziehen kann.",
    },
    {
      type: "list",
      items: [
        "Der Erlös liegt häufig unter dem, was ein freihändiger Verkauf gebracht hätte – den Verlust tragen alle Eigentümer anteilig.",
        "Das Verfahren kann auf Antrag zeitweise ausgesetzt werden, etwa wenn das Wohl gemeinsamer Kinder betroffen ist. Schnell geht es deshalb oft nicht.",
        "Bei Ehegatten im gesetzlichen Güterstand kann für den Antrag die Zustimmung des anderen erforderlich sein, wenn das Haus nahezu das gesamte Vermögen ausmacht. Das sollte vorab geprüft werden.",
        "Jeder Miteigentümer darf selbst mitbieten. Wer das Haus behalten will, kann es so ersteigern – zahlt dann aber oft mehr als bei einer verhandelten Übernahme.",
      ],
    },
    {
      type: "callout",
      text: "Wer mit der Teilungsversteigerung droht, gewinnt selten Geld, sondern Zeitdruck. Sinnvoll ist die Drohung nur, wenn beide verstehen, was sie kostet – dann wird sie oft zum Anlass, doch zu verhandeln.",
    },
    { type: "heading", text: "Worum es in Wahrheit meistens geht" },
    {
      type: "paragraph",
      text: "Wer nicht verkaufen will, hat dafür fast immer einen Grund, der mit dem Haus selbst wenig zu tun hat. Nach einer Trennung ist es oft die Angst, den Kindern das Zuhause zu nehmen, oder das Gefühl, mit dem Verkauf das Scheitern der Beziehung zu besiegeln. In Erbengemeinschaften ist es häufig das Elternhaus, an dem Erinnerungen hängen – oder der Eindruck, dass ein Geschwister sich schon lange um nichts gekümmert hat und jetzt nur an das Geld will.",
    },
    {
      type: "paragraph",
      text: "Solange über den Preis gestritten wird, bleiben diese Gründe unausgesprochen. Eine Einigung wird erst möglich, wenn sie auf dem Tisch liegen: Ein Aufschub bis zum Schulabschluss, ein Vorkaufsrecht, ein Erinnerungsstück aus dem Haus oder eine faire Anrechnung bisher getragener Kosten lösen oft mehr als ein weiteres Wertgutachten.",
    },
    { type: "heading", text: "Fünf Fragen, die vor jeder Verhandlung geklärt sein sollten" },
    {
      type: "list",
      items: [
        "Was ist das Haus wert? Ein gemeinsam beauftragtes Gutachten verhindert, dass jeder mit seiner eigenen Zahl argumentiert.",
        "Wer zahlt seit der Trennung oder dem Erbfall Kredit, Grundsteuer, Versicherung und Reparaturen – und wie wird das angerechnet?",
        "Wer nutzt das Haus, und steht dafür ein Ausgleich im Raum?",
        "Kann einer das Haus tatsächlich übernehmen? Eine Finanzierungszusage der Bank klärt das schneller als jede Diskussion.",
        "Gibt es einen Zeitpunkt, zu dem ein Verkauf für alle akzeptabel wäre?",
      ],
    },
    {
      type: "cta",
      text: "Den Verlauf festhalten: Zahlungen, Absprachen, Ablehnungen – im kostenlosen Konflikt-Logbuch",
      href: "/konflikt-logbuch",
    },
    { type: "heading", text: "Wie eine Einigung zustande kommt" },
    {
      type: "paragraph",
      text: "In einer Mediation werden genau diese Fragen der Reihe nach geklärt: erst die Fakten, dann die Interessen hinter den Positionen, dann die Optionen. Das Ergebnis ist eine schriftliche Vereinbarung – etwa über Übernahme und Auszahlungsbetrag, über den Verkaufszeitpunkt oder über die Aufteilung der laufenden Kosten bis dahin. Geht es um Eigentum am Haus, muss die Übertragung anschließend notariell beurkundet werden; die Mediation liefert den Inhalt, der Notar die Form.",
    },
    {
      type: "paragraph",
      text: "Nach einer Trennung lässt sich die Frage nach dem Haus meist nicht losgelöst von Unterhalt und Zugewinn klären – sie gehört in die Scheidungsfolgenvereinbarung. In der Erbengemeinschaft ist das Haus oft nur der größte Posten der gesamten Auseinandersetzung.",
    },
    {
      type: "cta",
      text: "Trennung: Haus, Unterhalt und Vermögen in einem Verfahren regeln",
      href: "/scheidungsmediation",
    },
    {
      type: "cta",
      text: "Erbengemeinschaft: das Elternhaus gemeinsam regeln",
      href: "/konflikte/erbschaft",
    },
  ],
  faq: [
    {
      question: "Kann ich das Haus verkaufen, wenn mein Ex-Partner nicht zustimmt?",
      answer:
        "Freihändig nicht, wenn Sie beide im Grundbuch stehen – für den Verkauf müssen alle Eigentümer unterschreiben. Möglich ist eine Teilungsversteigerung beim Amtsgericht. Sie bringt in der Regel aber weniger ein als ein normaler Verkauf und dauert lange, deshalb lohnt sich fast immer zuerst ein Einigungsversuch.",
    },
    {
      question: "Was tun, wenn ein Erbe das Haus nicht verkaufen will?",
      answer:
        "Jeder Erbe kann die Auseinandersetzung der Erbengemeinschaft verlangen, notfalls über eine Teilungsversteigerung. Bevor es so weit kommt, hilft es, den Grund für die Ablehnung zu klären: Oft geht es um Erinnerungen, um bisher getragene Kosten oder um das Gefühl, übergangen zu werden – und nicht um den Preis.",
    },
    {
      question: "Was ist eine Teilungsversteigerung?",
      answer:
        "Eine Zwangsversteigerung, mit der eine Eigentümergemeinschaft aufgelöst wird, wenn sich die Miteigentümer nicht einigen. Jeder Miteigentümer kann sie beim Amtsgericht beantragen. Der Erlös wird nach Abzug der Kosten nach Anteilen verteilt.",
    },
    {
      question: "Kann einer den anderen aus dem gemeinsamen Haus auszahlen?",
      answer:
        "Ja, das ist der häufigste Weg, wenn einer im Haus bleiben will. Dafür braucht es eine Einigung über den Wert und meist eine neue Finanzierung, bei der die Bank den Ausscheidenden aus dem Kredit entlässt. Die Übertragung des Anteils wird notariell beurkundet.",
    },
    {
      question: "Wer zahlt die Raten, solange über den Verkauf gestritten wird?",
      answer:
        "Gegenüber der Bank haften in der Regel alle Kreditnehmer weiter, auch nach einer Trennung. Wie die Zahlungen untereinander ausgeglichen werden, ist eine der wichtigsten Fragen der Einigung – deshalb sollte jede Zahlung ab dem Zeitpunkt der Trennung oder des Erbfalls dokumentiert werden.",
    },
  ],
  related: [
    { label: "Muss ich bei Trennung das Haus verkaufen?", href: "/ratgeber/haus-bei-scheidung" },
    { label: "Erbengemeinschaft: Einer blockiert – was jetzt?", href: "/ratgeber/erbengemeinschaft-blockade" },
    { label: "Scheidungsfolgenvereinbarung (Scheidungsvertrag)", href: "/ratgeber/scheidungsfolgenvereinbarung" },
    { label: "Vermögen aufteilen bei Scheidung", href: "/ratgeber/vermoegensauseinandersetzung" },
    { label: "Geschwister streiten ums Erbe – was tun?", href: "/ratgeber/geschwister-streiten-ums-erbe" },
    { label: "Kostenrechner: Gericht oder Mediation?", href: "/kostenrechner" },
  ],
};
