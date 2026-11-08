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
// 08.11.2026 – Ausbau zur Pillar-Seite. GSC 07.08.–06.11.: 403 Impr, Pos 59,
// verteilt auf 20+ Varianten ("erbengemeinschaft haus verkaufen einer will
// nicht", "zwei eigentümer einer will nicht verkaufen", "2 eigentümer 1 will
// nicht", "miteigentümer will nicht verkaufen", "scheidung haus verkaufen
// einer will nicht", "haus verkaufen bei streit", "haushälfte verkaufen",
// "elternhaus verkaufen anderer wohnort"). Gliederung nach Konstellation,
// die Varianten stehen wörtlich als FAQ-Fragen (FAQPage-JSON-LD automatisch).
// Erb-Detailfragen bleiben trotzdem in erbengemeinschaft-blockade bzw. der
// Erb-Zielseite erbstreit-loesen-ohne-gericht.
//
// Rechtliches (Teilungsversteigerung, Zustimmungserfordernis bei
// Zugewinngemeinschaft, einstweilige Einstellung) bewusst allgemein und ohne
// Fristen formuliert. Vor Veröffentlichung juristisch gegenlesen.

import type { RatgeberArticle } from "./types";

export const article: RatgeberArticle = {
  slug: "haus-verkaufen-einer-will-nicht",
  category: "Trennung & Scheidung",
  title: "Haus verkaufen, aber einer will nicht: Was Miteigentümer tun können",
  metaTitle: "Haus verkaufen, einer will nicht: Optionen für Miteigentümer",
  description:
    "Haus verkaufen, aber einer will nicht? Optionen für Erbengemeinschaft, Scheidung und Miteigentümer: Einigung, Auszahlung, Anteilsverkauf, Versteigerung.",
  eyebrow: "Ratgeber · Trennung & Erbe",
  updated: "2026-11-08",
  published: "2026-10-16",
  readingMinutes: 14,
  intro:
    "Ein Haus, zwei oder mehr Eigentümer, und einer will verkaufen, während der andere nicht will: Das passiert in der Erbengemeinschaft ebenso wie nach einer Trennung oder unter Miteigentümern, die gemeinsam gekauft haben. Solange niemand nachgibt, steht alles still – die Raten laufen weiter, das Haus steht leer oder wird nur von einem genutzt, und jeder Monat verschärft den Streit. Dieser Ratgeber zeigt für jede Konstellation, welche Wege es aus der Blockade gibt – Einigung, Auszahlung, Verkauf des eigenen Anteils, Teilungsversteigerung –, was sie kosten und wie eine Einigung aussehen kann, mit der alle leben.",
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
    {
      type: "callout",
      text: "Hinweis: Dieser Ratgeber gibt einen allgemeinen Überblick und ersetzt keine Rechtsberatung. Ob und wie die beschriebenen Wege in Ihrem Fall gehen, hängt vom Grundbuch, vom Güterstand, vom Testament und von Fristen ab. Lassen Sie das vor wichtigen Schritten anwaltlich oder notariell prüfen.",
    },
    { type: "heading", text: "Die fünf Wege aus der Blockade" },
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
          "Verkauf des eigenen Anteils",
          "Ein Miteigentümer verkauft nur seinen Anteil (bzw. als Miterbe seinen Erbteil) an einen Dritten; die übrigen bleiben Eigentümer.",
          "wenn jemand schnell aussteigen will und einen Abschlag in Kauf nimmt",
        ],
        [
          "Teilungsversteigerung",
          "Ein Miteigentümer beantragt die Versteigerung beim Amtsgericht; der Erlös wird nach Abzug der Kosten verteilt.",
          "wenn jede Einigung gescheitert ist",
        ],
      ],
    },
    { type: "heading", text: "Erbengemeinschaft: Haus verkaufen, wenn einer nicht will" },
    {
      type: "paragraph",
      text: "Erben mehrere Geschwister das Elternhaus, gehört es ihnen als Erbengemeinschaft gemeinsam – nicht jedem ein bestimmter Teil des Hauses, sondern allen zusammen das Ganze. Über die laufende Verwaltung (Reparaturen, Vermietung, Nebenkosten) entscheidet die Mehrheit nach Erbquoten. Für den Verkauf müssen dagegen alle zustimmen. Ein einzelner Erbe kann den Verkauf also blockieren, aber nicht verhindern, dass die Erbengemeinschaft irgendwann aufgelöst wird.",
    },
    {
      type: "list",
      items: [
        "Erbteil verkaufen: Jeder Miterbe kann seinen gesamten Anteil am Nachlass notariell an einen Dritten verkaufen, ohne dass die anderen zustimmen müssen. Die Miterben haben dann ein gesetzliches Vorkaufsrecht und können den Anteil zu denselben Bedingungen selbst übernehmen.",
        "Auszahlung: Ein Erbe übernimmt das Haus und zahlt die anderen nach ihrer Quote aus. Das ist der häufigste Weg, wenn jemand das Elternhaus halten will.",
        "Teilungsversteigerung: Jeder Miterbe kann sie beantragen, wenn keine Einigung gelingt – mit den unten beschriebenen Nachteilen.",
      ],
    },
    {
      type: "paragraph",
      text: "Ein häufiger Sonderfall: Die Erben wohnen weit auseinander, und keiner kann sich vor Ort um das Elternhaus kümmern. Dann blockiert oft nicht der Unwille, sondern die Organisation. Hilfreich ist, früh festzulegen, wer Ansprechpartner für Makler, Handwerker und Behörden ist, und dafür eine schriftliche Vollmacht der anderen zu erteilen. Den Notartermin für den Verkauf müssen nicht alle gemeinsam wahrnehmen; Vollmachten oder nachträgliche Genehmigungen sind möglich.",
    },
    {
      type: "paragraph",
      text: "Wie man mit einem Miterben umgeht, der jede Entscheidung blockiert, beschreibt [Erbengemeinschaft: Einer blockiert](/ratgeber/erbengemeinschaft-blockade). Welche außergerichtlichen Wege es für den ganzen Nachlass gibt, steht im Ratgeber [Erbstreit ohne Gericht lösen](/ratgeber/erbstreit-loesen-ohne-gericht).",
    },
    { type: "heading", text: "Scheidung und Trennung: Haus verkaufen, wenn einer nicht will" },
    {
      type: "paragraph",
      text: "Stehen beide Ehepartner im Grundbuch, gilt nach der Trennung dasselbe wie für alle Miteigentümer: Verkaufen geht nur gemeinsam, die Auflösung der Gemeinschaft kann aber jeder verlangen. Drei Besonderheiten machen die Lage nach einer Trennung trotzdem eigen.",
    },
    {
      type: "list",
      items: [
        "Zustimmung des Ehepartners: Im gesetzlichen Güterstand braucht ein Ehegatte für Geschäfte über sein Vermögen im Ganzen die Zustimmung des anderen. Ist das Haus nahezu das gesamte Vermögen, kann das auch für den Antrag auf Teilungsversteigerung gelten.",
        "Nutzung und Ausgleich: Wohnt einer weiter im Haus, kann der Ausgezogene unter Umständen eine Nutzungsentschädigung verlangen. Umgekehrt zählt, wer seit der Trennung Kredit, Grundsteuer und Reparaturen bezahlt.",
        "Kinder: Leben gemeinsame Kinder im Haus, kann eine Teilungsversteigerung auf Antrag zeitweise eingestellt werden. Der Zeitpunkt des Verkaufs ist deshalb oft der eigentliche Streitpunkt.",
      ],
    },
    {
      type: "paragraph",
      text: "Weil das Haus mit Zugewinn und Unterhalt zusammenhängt, lässt es sich nach einer Trennung selten isoliert lösen. Welche Möglichkeiten es grundsätzlich gibt, zeigt [Muss ich bei Trennung das Haus verkaufen?](/ratgeber/haus-bei-scheidung); verbindlich geregelt wird es meist in der [Scheidungsfolgenvereinbarung](/ratgeber/scheidungsfolgenvereinbarung).",
    },
    { type: "heading", text: "Zwei Eigentümer, einer will nicht verkaufen: Miteigentum allgemein" },
    {
      type: "paragraph",
      text: "Auch ohne Erbe oder Ehe stehen oft zwei Namen im Grundbuch: bei unverheirateten Paaren, bei Geschwistern, die gemeinsam gekauft haben, oder bei Freunden mit einer gemeinsamen Ferienwohnung. Rechtlich ist das meist eine Bruchteilsgemeinschaft – jedem gehört ein ideeller Anteil, etwa die Hälfte. Jeder kann verlangen, dass die Gemeinschaft aufgehoben wird, sofern das nicht vertraglich ausgeschlossen wurde. Ein Grund ist dafür nicht nötig.",
    },
    {
      type: "paragraph",
      text: "Für die Praxis heißt das: Bei zwei Eigentümern, von denen einer nicht verkaufen will, stehen dieselben Wege offen wie oben – Auszahlung, gemeinsamer Verkauf, Aufschub mit Regeln, Verkauf des eigenen Anteils oder Teilungsversteigerung. Was fehlt, ist meist nur eine Struktur, in der beide ihre Gründe offenlegen.",
    },
    { type: "heading", text: "Haushälfte verkaufen: Geht das ohne Zustimmung?" },
    {
      type: "paragraph",
      text: "Ja. Den eigenen Miteigentumsanteil – etwa eine Haushälfte – darf jeder Miteigentümer ohne Zustimmung der anderen verkaufen; nötig ist nur ein notarieller Kaufvertrag. Ein Vorkaufsrecht der übrigen Miteigentümer besteht bei der Bruchteilsgemeinschaft nur, wenn es vereinbart und im Grundbuch eingetragen ist (anders bei Erbteilen, siehe oben).",
    },
    {
      type: "paragraph",
      text: "Der Haken ist der Preis. Wer eine Haushälfte kauft, bekommt kein Haus, sondern einen Anteil an einem Haus, das er nicht allein nutzen kann – und einen Miteigentümer, mit dem er sich einigen muss. Entsprechend klein ist der Kreis der Interessenten, und der Erlös liegt in der Regel deutlich unter der Hälfte des Verkehrswerts. Für den Verbleibenden ist das oft ebenfalls schlecht: Er hat danach einen fremden Miteigentümer, der seinerseits die Teilungsversteigerung beantragen kann.",
    },
    { type: "heading", text: "Teilungsversteigerung: Ablauf, Nachteile und Kosten" },
    {
      type: "list",
      items: [
        "Antrag: Ein Miteigentümer beantragt die Versteigerung beim Amtsgericht, in dessen Bezirk das Haus liegt. Ein Urteil oder eine Zustimmung der anderen braucht er dafür grundsätzlich nicht.",
        "Anordnung: Das Gericht ordnet die Versteigerung an und stellt den Beschluss den übrigen Eigentümern zu. Diese können beantragen, das Verfahren zeitweise einzustellen.",
        "Gutachten: Ein Sachverständiger ermittelt den Verkehrswert. Wird ihm der Zutritt verweigert, schätzt er von außen – mit entsprechenden Abschlägen.",
        "Versteigerungstermin: Jeder, auch jeder Miteigentümer, kann bieten. Im ersten Termin gelten Mindestgrenzen für den Zuschlag, in einem weiteren Termin entfallen sie.",
        "Erlös: Nach Abzug der Verfahrenskosten steht der Erlös allen bisherigen Eigentümern gemeinsam zu. Über die Aufteilung müssen sie sich dann noch einigen – sonst wird das Geld hinterlegt und der Streit geht weiter.",
      ],
    },
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
      type: "paragraph",
      text: "Zu den Kosten: Gerichtsgebühren und das Verkehrswertgutachten richten sich nach dem Wert des Hauses. Wer den Antrag stellt, muss einen Kostenvorschuss leisten; am Ende werden die Verfahrenskosten vorab aus dem Erlös bezahlt und damit von allen getragen. Anwälte, die sich die Beteiligten nehmen, zahlt jede Seite selbst. Hinzu kommt der eigentliche Verlust – die Differenz zwischen Versteigerungserlös und dem Preis, den ein freier Verkauf gebracht hätte. Wie sich Gerichts- und Einigungskosten in Ihrem Fall unterscheiden, zeigt der [Kostenrechner](/kostenrechner).",
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
    { type: "heading", text: "Mediation als Alternative zur Teilungsversteigerung" },
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
      text: "Versteigerung oder Einigung? Kosten im Kostenrechner vergleichen",
      href: "/kostenrechner",
    },
    {
      type: "cta",
      text: "Mediator:in finden und im Kennenlerngespräch prüfen, ob es passt",
      href: "/mediator-finden",
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
      question: "Erbengemeinschaft: Haus verkaufen, einer will nicht – was tun?",
      answer:
        "Für den Verkauf müssen alle Erben zustimmen, ein Einzelner kann ihn also blockieren. Auflösen lässt sich die Erbengemeinschaft trotzdem: durch Auszahlung des Blockierenden, durch Verkauf eines Erbteils oder notfalls durch Teilungsversteigerung. Vorher lohnt es sich, den Grund der Ablehnung zu klären – oft geht es um Erinnerungen oder getragene Kosten, nicht um den Preis.",
    },
    {
      question: "Zwei Eigentümer, einer will nicht verkaufen – was nun?",
      answer:
        "Bei zwei Eigentümern kann keiner allein verkaufen, aber jeder kann die Aufhebung der Gemeinschaft verlangen. Die Wege sind: der andere übernimmt und zahlt aus, gemeinsamer Verkauf zu einem späteren Zeitpunkt, Verkauf des eigenen Anteils an einen Dritten oder als letztes Mittel die Teilungsversteigerung beim Amtsgericht.",
    },
    {
      question: "Miteigentümer will nicht verkaufen: Kann ich meine Haushälfte verkaufen?",
      answer:
        "Ja, den eigenen Miteigentumsanteil dürfen Sie ohne Zustimmung des anderen notariell verkaufen. Weil der Käufer nur einen Anteil und einen fremden Miteigentümer bekommt, gibt es wenige Interessenten, und der Preis liegt meist deutlich unter dem halben Verkehrswert.",
    },
    {
      question: "Scheidung: Haus verkaufen, einer will nicht – was gilt?",
      answer:
        "Stehen beide im Grundbuch, geht ein Verkauf nur gemeinsam. Jeder kann aber die Teilungsversteigerung beantragen; im gesetzlichen Güterstand kann dafür die Zustimmung des anderen nötig sein, wenn das Haus fast das ganze Vermögen ist. Leben Kinder im Haus, kann das Verfahren zeitweise eingestellt werden. Meist wird das Haus deshalb zusammen mit Zugewinn und Unterhalt geregelt.",
    },
    {
      question: "Haus verkaufen bei Streit: Wie geht das?",
      answer:
        "Am günstigsten über eine Einigung, die zuerst die Fakten klärt: ein gemeinsames Wertgutachten, eine Aufstellung der bisher getragenen Kosten und eine Finanzierungsauskunft der Bank. Danach lassen sich Übernahme, gemeinsamer Verkauf oder ein Aufschub verhandeln – mit einer neutralen Person oft schneller als direkt. Die Teilungsversteigerung bleibt das teuerste Mittel.",
    },
    {
      question: "Wie verkauft man das Elternhaus, wenn die Erben an anderen Orten wohnen?",
      answer:
        "Am einfachsten, indem die Erben eine Person vor Ort oder einen Makler beauftragen und dieser Person eine schriftliche Vollmacht erteilen. Beim Notartermin müssen nicht alle anwesend sein, Vollmachten oder nachträgliche Genehmigungen genügen. Wichtig ist, vorher gemeinsam festzulegen, zu welchem Mindestpreis verkauft werden darf.",
    },
    {
      question: "Was kostet eine Teilungsversteigerung?",
      answer:
        "Gerichtsgebühren und das Verkehrswertgutachten richten sich nach dem Wert des Hauses und werden vorab aus dem Erlös bezahlt; wer den Antrag stellt, muss einen Vorschuss leisten. Anwaltskosten trägt jede Seite selbst. Der größte Posten ist oft unsichtbar: der Mindererlös gegenüber einem freien Verkauf, den alle anteilig tragen.",
    },
    {
      question: "Kann ich das Haus verkaufen, wenn mein Ex-Partner nicht zustimmt?",
      answer:
        "Freihändig nicht, wenn Sie beide im Grundbuch stehen – für den Verkauf müssen alle Eigentümer unterschreiben. Möglich ist eine Teilungsversteigerung beim Amtsgericht. Sie bringt in der Regel aber weniger ein als ein normaler Verkauf und dauert lange, deshalb lohnt sich fast immer zuerst ein Einigungsversuch.",
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
    { label: "Erbstreit ohne Gericht lösen", href: "/ratgeber/erbstreit-loesen-ohne-gericht" },
    { label: "Erbschaft & Familie: Mediation im Überblick", href: "/konflikte/erbschaft" },
    { label: "Scheidungsfolgenvereinbarung (Scheidungsvertrag)", href: "/ratgeber/scheidungsfolgenvereinbarung" },
    { label: "Vermögen aufteilen bei Scheidung", href: "/ratgeber/vermoegensauseinandersetzung" },
    { label: "Geschwister streiten ums Erbe – was tun?", href: "/ratgeber/geschwister-streiten-ums-erbe" },
    { label: "Kostenrechner: Gericht oder Mediation?", href: "/kostenrechner" },
  ],
};
