// Ziel-Suchbegriffe: "muss ich bei scheidung das haus verkaufen", "haus bei
// scheidung", "wer bekommt das haus bei scheidung", "hausübernahme scheidung".
//
// 12.08.2026 – ergänzt um den Verkaufs-Ablauf. Anlass: GSC zeigt "trennung haus
// verkaufen" (10 Impr.) und "haus verkaufen trennung" (7 Impr.) auf Position 97,
// obwohl diese Seite thematisch exakt passt. Die Begriffe fehlten nicht — der
// Artikel beantwortete nur die Frage "muss ich verkaufen?" (Antwort: nein) und
// behandelte den Verkauf als eine von vier Optionen. Wer "trennung haus
// verkaufen" sucht, hat die Entscheidung aber schon getroffen und will wissen,
// WIE das abläuft: Makler, Zeitpunkt, Erlösverteilung, Vorfälligkeit. Das war
// hier nicht beantwortet. Kein Slug-Umzug — der letzte liegt erst zwei Wochen
// zurück, und der Slug trägt die Begriffe bereits.
// Belege: docs/gsc-analyse-2026-08-12.md, Abschnitt 5.
//
// Suchsprache-Artikel. Hohe Suchintention, weil an der Immobilie die meisten
// einvernehmlichen Trennungen kippen — sie ist meist der größte Posten und
// gleichzeitig emotional aufgeladen.
//
// Der wichtigste Praxis-Punkt, den fast alle Ratgeber auslassen: Die interne
// Einigung ändert NICHTS an der Haftung gegenüber der Bank. Das gehört
// prominent in den Text.
//
// Steuer- und Kreditfragen nur benennen, nicht durchrechnen — je nach
// Fallkonstellation völlig unterschiedlich. Vor Veröffentlichung juristisch
// und steuerlich gegenlesen.

import type { RatgeberArticle } from "./types";

export const article: RatgeberArticle = {
  slug: "haus-bei-scheidung",
  category: "Trennung & Scheidung",
  title: "Muss ich bei Trennung oder Scheidung das Haus verkaufen?",
  metaTitle: "Haus verkaufen bei Scheidung oder Trennung | medipact",
  description:
    "Haus verkaufen bei Trennung oder Scheidung: Ablauf, Erlösverteilung und Vorfälligkeit – oder doch auszahlen? Die vier Wege und warum die Bank entscheidet.",
  eyebrow: "Ratgeber · Trennung & Scheidung",
  updated: "2026-07-31",
  published: "2026-07-31",
  readingMinutes: 11,
  intro:
    "Nein, Sie müssen nicht verkaufen. Niemand kann Sie dazu zwingen, solange Sie sich einigen. Zwangsläufig wird ein Verkauf erst, wenn Sie sich nicht einigen – dann entscheidet am Ende ein Verfahren, das für beide Seiten das schlechteste Ergebnis bringt. Dieser Artikel zeigt die vier realistischen Wege und die eine Hürde, die fast immer unterschätzt wird.",
  blocks: [
    {
      type: "paragraph",
      text: "Meistens gehört das Haus beiden je zur Hälfte. Damit gilt: Keiner kann allein verkaufen, und keiner kann den anderen zum Verkauf zwingen. Diese Blockade ist zunächst ein Schutz – sie wird nur dann zum Problem, wenn die Einigung ausbleibt.",
    },
    {
      type: "heading",
      text: "Die vier Wege",
    },
    {
      type: "table",
      caption: "Möglichkeiten für die gemeinsame Immobilie bei Trennung und Scheidung",
      headers: ["Weg", "Passt, wenn", "Der Haken"],
      rows: [
        [
          "Einer übernimmt",
          "eine Seite bleiben will und die Finanzierung allein tragen kann",
          "Die Bank muss die andere Person aus dem Darlehen entlassen – sie muss das nicht tun",
        ],
        [
          "Gemeinsam verkaufen",
          "beide neu anfangen wollen oder die Rate allein nicht tragbar ist",
          "Vorfälligkeitsentschädigung bei laufendem Zins; Verkauf braucht Zeit",
        ],
        [
          "Gemeinsam behalten und vermieten",
          "der Markt gerade schlecht ist oder die Kinder Ruhe brauchen",
          "Sie bleiben wirtschaftlich verbunden – jede Reparatur wird neu verhandelt",
        ],
        [
          "Teilungsversteigerung",
          "gar nichts anderes mehr geht",
          "Erlöse liegen regelmäßig unter dem Marktwert – beide verlieren Geld",
        ],
      ],
    },
    {
      type: "callout",
      text: "Die Teilungsversteigerung ist kein Weg, sondern das Ergebnis einer gescheiterten Einigung. Sie wird oft als Drohmittel eingesetzt – wer sie durchzieht, schadet sich meist selbst mit, weil im Versteigerungstermin selten der Marktpreis erzielt wird.",
    },
    {
      type: "heading",
      text: "Der Punkt, der die meisten Einigungen kippt: die Bank",
    },
    {
      type: "paragraph",
      text: "Wenn beide den Darlehensvertrag unterschrieben haben, haften auch beide – und zwar jeder für die volle Summe. Was Sie untereinander vereinbaren, interessiert die Bank nicht. Der Satz „Du übernimmst das Haus, dann übernimmst du auch den Kredit“ ist wirtschaftlich nur dann etwas wert, wenn die Bank der Entlassung aus der Haftung ausdrücklich zustimmt.",
    },
    {
      type: "paragraph",
      text: "Das tut sie nur, wenn die verbleibende Person die Rate allein tragen kann – nach ihren Maßstäben, nicht nach Ihren. Fällt diese Prüfung negativ aus, bleibt die ausgezogene Person mit in der Haftung, obwohl sie das Haus nicht mehr nutzt und ihren Anteil vielleicht schon übertragen hat.",
    },
    {
      type: "callout",
      text: "Klären Sie die Frage der Haftungsentlassung mit der Bank, BEVOR Sie eine Vereinbarung unterschreiben – nicht danach. Eine Einigung, die an der Bank scheitert, muss komplett neu verhandelt werden, meist unter deutlich schlechterer Stimmung.",
    },
    {
      type: "heading",
      text: "Wenn Sie verkaufen: so läuft es ab",
    },
    {
      type: "paragraph",
      text: "Haben Sie sich für den gemeinsamen Verkauf entschieden, ist der schwierige Teil nicht der Markt, sondern die Reihenfolge der Entscheidungen. Fast alle Verkäufe in Trennungssituationen geraten an denselben drei Stellen ins Stocken: bei der Wahl des Maklers, beim Mindestpreis und bei der Frage, wer bis zum Auszug die Rate zahlt. Wer diese drei Punkte vorab schriftlich klärt, verkauft schneller und teurer.",
    },
    {
      type: "list",
      items: [
        "Einen gemeinsamen Makler beauftragen, nicht jeder seinen eigenen. Zwei Makler mit demselben Objekt schaden dem Preis: Interessenten sehen dieselbe Immobilie doppelt inseriert und lesen daraus Verkaufsdruck.",
        "Vorher einen Mindestpreis vereinbaren, unter dem nicht verkauft wird – schriftlich, mit einem Datum, ab dem er neu verhandelt wird. Ohne diese Grenze wird jedes Gebot zur neuen Verhandlung zwischen Ihnen beiden.",
        "Festlegen, wer bis zum Notartermin in der Immobilie wohnt, wer die Rate zahlt und wer die laufenden Kosten trägt. Wird das offengelassen, entsteht in genau der Zeit Streit, in der Sie gemeinsam auftreten müssten.",
        "Klären, wer für Besichtigungen zuständig ist. Ein Haus, in dem sichtbar Konflikt herrscht, verkauft sich schlechter – Interessenten spüren das und rechnen es in ihr Gebot ein.",
        "Die Vorfälligkeitsentschädigung vorab bei der Bank abfragen, nicht schätzen. Bei laufender Zinsbindung kann sie einen fünfstelligen Betrag erreichen und die gesamte Rechnung umwerfen.",
      ],
    },
    {
      type: "paragraph",
      text: "Beim Erlös gilt eine feste Reihenfolge, und sie ist der Grund, warum der Betrag am Ende oft kleiner ausfällt als gedacht: Zuerst wird das Darlehen abgelöst, dann kommen Vorfälligkeitsentschädigung, Maklercourtage und Notarkosten. Erst was danach übrig bleibt, wird zwischen Ihnen aufgeteilt – im Regelfall hälftig, wenn Sie je zur Hälfte im Grundbuch stehen. Ungleiche Beiträge zum Kauf, etwa Eigenkapital nur von einer Seite oder Zahlungen aus einer Erbschaft, ändern daran nichts automatisch. Sie müssen ausdrücklich vereinbart werden, sonst fallen sie unter den Tisch.",
    },
    {
      type: "callout",
      text: "Der Zeitpunkt ist keine reine Marktfrage. Ein Verkauf innerhalb der zehnjährigen Spekulationsfrist kann Einkommensteuer auslösen, wenn die Immobilie nicht durchgehend selbst genutzt wurde – und die Eigennutzung endet für die ausgezogene Person mit dem Auszug. Lassen Sie das vor dem Inserat steuerlich prüfen, nicht nach dem Notartermin.",
    },
    {
      type: "heading",
      text: "Was die Übernahme kostet",
    },
    {
      type: "paragraph",
      text: "Wer übernimmt, zahlt der anderen Seite deren Anteil aus. Grundlage ist der Verkehrswert abzüglich der noch offenen Darlehen. Der Streit entzündet sich fast nie an dieser Rechnung, sondern am Wert selbst: Die übernehmende Seite sieht Renovierungsstau, die andere sieht die Lage.",
    },
    {
      type: "list",
      items: [
        "Einigen Sie sich zuerst darauf, WER bewertet – danach über das Ergebnis zu streiten wird deutlich seltener.",
        "Zwei Parteigutachten führen fast immer zu einem dritten, gerichtlich bestellten. Das kostet Zeit und Geld.",
        "Ein gemeinsam beauftragter Gutachter ist billiger als zwei gegenläufige und wird von beiden eher akzeptiert.",
        "Bei der Übertragung zwischen Ehegatten im Rahmen der Scheidungsauseinandersetzung fällt in der Regel keine Grunderwerbsteuer an – prüfen lassen.",
        "Bei einem Verkauf innerhalb der Spekulationsfrist kann Einkommensteuer anfallen; bei durchgehender Eigennutzung meist nicht.",
      ],
    },
    {
      type: "heading",
      text: "Wenn Kinder im Haus leben",
    },
    {
      type: "paragraph",
      text: "Dann verschiebt sich die Frage. Sie lautet nicht mehr nur „Was ist wirtschaftlich optimal?“, sondern auch „Was hält die Kinder in ihrer Schule und ihrem Umfeld?“. Viele Paare wählen deshalb bewusst eine Zwischenlösung: gemeinsames Eigentum für einige Jahre, klare Regeln zu Kosten und Instandhaltung, Verkauf zu einem vereinbarten späteren Zeitpunkt.",
    },
    {
      type: "paragraph",
      text: "Solche Lösungen sind gut – aber nur, wenn sie vollständig durchgeschrieben sind. Wer trägt die Rate, wer die Nebenkosten, wer entscheidet über eine neue Heizung, was passiert bei Jobverlust, was bei einer neuen Partnerschaft im Haus? Ungeregelte Zwischenlösungen sind die häufigste Ursache dafür, dass ein Jahr später doch alles vor Gericht landet.",
    },
    {
      type: "heading",
      text: "Warum das kein Fall für zwei Anwälte ist",
    },
    {
      type: "paragraph",
      text: "Bei der Immobilie geht es um Bewertung, Finanzierbarkeit und Zeitpunkt – also um Zahlen und Rechenwege, nicht um Rechtsfragen. Zwei gegnerische Anwälte führen hier regelmäßig dazu, dass jede Seite ein eigenes Gutachten beibringt und die Positionen sich verhärten, obwohl die wirtschaftlichen Interessen erstaunlich oft parallel laufen: Beide wollen den bestmöglichen Wert und keine Zwangsversteigerung.",
    },
    {
      type: "paragraph",
      text: "Bei medipact wird dieser Teil strukturiert online abgearbeitet: Zahlen und Unterlagen zusammentragen, Bewertungsfrage klären, Szenarien durchrechnen, Ergebnis schriftlich festhalten. Die Vereinbarung lassen Sie anschließend anwaltlich prüfen und – wenn Eigentum übertragen wird – notariell beurkunden.",
    },
    {
      type: "cta",
      text: "Was kostet der Streit vor Gericht? Jetzt vergleichen",
      href: "/kostenrechner?art=trennung",
    },
    {
      type: "callout",
      text: "Dieser Artikel ersetzt keine Rechts- oder Steuerberatung. Ob eine Übertragung steuerfrei bleibt, ob eine Vorfälligkeitsentschädigung anfällt und wie der Zugewinnausgleich die Immobilie erfasst, hängt am Einzelfall. Lassen Sie das prüfen, bevor Sie unterschreiben.",
    },
    {
      type: "cta",
      text: "Immobilie und Trennung gemeinsam regeln",
      href: "/konflikte/trennung",
    },
  ],
  faq: [
    {
      question: "Muss ich bei einer Scheidung das Haus verkaufen?",
      answer:
        "Nein. Solange Sie sich einigen, bestimmen Sie selbst, was mit der Immobilie geschieht – Übernahme durch eine Seite, Verkauf, gemeinsames Behalten oder eine Zwischenlösung. Zum Verkauf kommt es zwangsweise erst, wenn keine Einigung zustande kommt und ein Miteigentümer die Teilungsversteigerung betreibt.",
    },
    {
      question: "Wer bekommt das Haus bei der Scheidung?",
      answer:
        "Das Eigentum ändert sich durch die Scheidung nicht. Gehört die Immobilie beiden je zur Hälfte, bleibt das so, bis Sie etwas anderes vereinbaren und notariell beurkunden lassen. Wer während der Trennung darin wohnen darf, ist eine davon getrennte Frage und richtet sich vor allem danach, wer die Wohnung dringender braucht.",
    },
    {
      question: "Komme ich aus dem gemeinsamen Kredit heraus, wenn der andere das Haus übernimmt?",
      answer:
        "Nur wenn die Bank Sie ausdrücklich aus der Haftung entlässt. Ihre interne Vereinbarung bindet die Bank nicht. Sie prüft, ob die übernehmende Person das Darlehen allein tragen kann, und stimmt nur dann zu. Klären Sie das unbedingt vor Abschluss einer Vereinbarung – sonst haften Sie weiter für ein Haus, das Ihnen nicht mehr gehört.",
    },
    {
      question: "Wie wird der Erlös aus dem Hausverkauf bei einer Trennung aufgeteilt?",
      answer:
        "In einer festen Reihenfolge: Zuerst wird das Darlehen abgelöst, dann werden Vorfälligkeitsentschädigung, Maklercourtage und Notarkosten abgezogen. Was übrig bleibt, wird nach den Anteilen im Grundbuch geteilt – bei je 50 % also hälftig. Ungleiche Beiträge zum Kauf, etwa Eigenkapital nur von einer Seite, werden dabei nicht automatisch berücksichtigt; sie müssen ausdrücklich vereinbart werden.",
    },
    {
      question: "Sollten wir das Haus vor oder nach der Scheidung verkaufen?",
      answer:
        "Rechtlich spielt der Zeitpunkt der Scheidung für den Verkauf keine Rolle – Sie können jederzeit gemeinsam verkaufen. Wirtschaftlich zählen zwei andere Fragen: ob die Zehnjahresfrist für die Spekulationssteuer abgelaufen ist und wie hoch eine Vorfälligkeitsentschädigung bei laufender Zinsbindung ausfällt. Beides sollte vor dem Inserat geklärt sein, weil es die Rechnung erheblich verändern kann.",
    },
    {
      question: "Was ist eine Teilungsversteigerung?",
      answer:
        "Ein gerichtliches Verfahren, mit dem ein Miteigentümer die Aufhebung der Gemeinschaft erzwingen kann, wenn keine Einigung zustande kommt. Die Immobilie wird versteigert und der Erlös geteilt. In der Praxis liegen die Erlöse regelmäßig unter dem freien Marktwert, sodass beide Seiten verlieren – deshalb ist es das letzte und nicht das erste Mittel.",
    },
    {
      question: "Wie wird der Wert der Immobilie ermittelt?",
      answer:
        "Am besten durch einen gemeinsam beauftragten Sachverständigen. Zwei getrennt beauftragte Parteigutachten führen fast immer zu abweichenden Werten und damit zu einem dritten, gerichtlich bestellten Gutachten. Sich zuerst auf die Person des Gutachters zu einigen und danach über das Ergebnis zu sprechen, spart Zeit, Geld und Nerven.",
    },
  ],
  related: [
    { label: "Scheidungsfolgenvereinbarung: Inhalt und Kosten", href: "/ratgeber/scheidungsfolgenvereinbarung" },
    { label: "Was steht mir bei der Scheidung zu?", href: "/ratgeber/was-steht-mir-bei-der-scheidung-zu" },
    { label: "Wer muss bei einer Trennung aus der Wohnung?", href: "/ratgeber/wer-muss-aus-der-wohnung" },
    { label: "Vermögen aufteilen bei Scheidung", href: "/ratgeber/vermoegensauseinandersetzung" },
    { label: "Trennung & Scheidung: Mediation im Überblick", href: "/konflikte/trennung" },
  ],
};
