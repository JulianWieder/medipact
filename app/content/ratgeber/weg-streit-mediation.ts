// Ziel-Suchbegriffe: "weg streit mediation", "streit eigentümergemeinschaft",
// "konflikt mit verwalter weg", "beschlussanfechtung vermeiden".
//
// Longtail zum Pillar nachbarschaftsstreit-was-tun. Eigene URL, weil die
// Suchintention klar abgegrenzt ist (Wohnungseigentum, Verwalter, Beschlüsse)
// und das Publikum ein anderes ist – oft Beirat oder Verwaltung, nicht der
// einzelne genervte Nachbar.
//
// ACHTUNG WEG-Recht: Beschlussfassung, Anfechtungsfristen und die Rolle des
// Verwalters sind stark geregelt und wurden zuletzt umfassend reformiert.
// Der Text nennt bewusst KEINE Fristen, Quoren oder Paragrafen und verweist
// auf anwaltliche Prüfung. Vor Veröffentlichung juristisch gegenlesen.
//
// Preise aus backend/app/pricing.py: nachbarschaft = 49 € "per_party".
// Für Verwaltungen mit laufendem Bedarf sind die Business-Tarife der
// passendere Verweis (/preise).

import type { RatgeberArticle } from "./types";

export const article: RatgeberArticle = {
  slug: "weg-streit-mediation",
  category: "Nachbarschaft",
  title: "Streit in der Eigentümergemeinschaft lösen",
  metaTitle: "WEG-Streit: Was tun bei Beschluss & Verwalter? | medipact",
  description:
    "Konflikt in der Eigentümergemeinschaft: Beschlüsse, Kosten, Verwalter, Sondernutzung. Wie Mediation Anfechtungsklagen vermeidet – Ablauf, Kosten, Grenzen.",
  eyebrow: "Ratgeber · Nachbarschaft",
  updated: "2026-07-27",
  readingMinutes: 8,
  intro:
    "Ein Streit in der Eigentümergemeinschaft hat eine Besonderheit: Er endet nicht, wenn er entschieden ist. Wer eine Beschlussanfechtung gewinnt, wohnt danach weiter im selben Haus wie die überstimmte Mehrheit – und die nächste Eigentümerversammlung kommt bestimmt. Dieser Artikel zeigt, wie sich WEG-Konflikte klären lassen, bevor sie zur Klage werden.",
  blocks: [
    {
      type: "heading",
      text: "Warum WEG-Konflikte so zäh sind",
    },
    {
      type: "paragraph",
      text: "In einer Eigentümergemeinschaft treffen drei Dinge zusammen, die einzeln schon konfliktträchtig sind: geteiltes Eigentum, gemeinsame Kosten und eine Zwangsgemeinschaft, aus der man nur durch Verkauf herauskommt. Dazu kommt, dass Entscheidungen förmlich in Versammlungen fallen – einem Format, in dem sich Fronten öffentlich verhärten und niemand vor den anderen nachgeben will.",
    },
    {
      type: "paragraph",
      text: "Typisch ist deshalb, dass ein einzelner Sachpunkt zum Stellvertreterkonflikt wird. Es geht formal um den Kostenverteilungsschlüssel für eine Sanierung, tatsächlich um ein Lager, das sich seit Jahren gebildet hat – Selbstnutzer gegen Vermieter, Erdgeschoss gegen Dachgeschoss, alteingesessen gegen neu eingezogen.",
    },
    {
      type: "list",
      items: [
        "Sanierung und Instandhaltung: Ob, wann, wie teuer – und wer davon überhaupt profitiert.",
        "Kostenverteilung: Aufzug, Balkone, Tiefgarage, Heizung – der Schlüssel wirkt für einen Teil immer ungerecht.",
        "Bauliche Veränderungen: Wallbox, Balkonkraftwerk, Markise, Dachfenster, Barrierefreiheit.",
        "Sondernutzung: Gartenanteile, Stellplätze, Kellerräume, Fahrradabstellplätze.",
        "Nutzung und Hausordnung: Kurzzeitvermietung, Gewerbe in der Wohnung, Lärm, Tierhaltung.",
        "Verwaltung: Abrechnungen, Erreichbarkeit, Vergabe von Aufträgen, Vertrauensverlust.",
      ],
    },
    {
      type: "heading",
      text: "Was eine Beschlussanfechtung wirklich kostet",
    },
    {
      type: "paragraph",
      text: "Die Anfechtung eines Beschlusses ist an enge Fristen und formale Anforderungen gebunden und gehört in anwaltliche Hände. Was dabei häufig unterschätzt wird: Die Kosten treffen am Ende oft die Gemeinschaft und damit auch die Anfechtenden selbst, und der eigentliche Konflikt ist danach nicht gelöst. Ein aufgehobener Beschluss bedeutet nur, dass erneut entschieden werden muss – im selben Klima, mit denselben Lagern.",
    },
    {
      type: "paragraph",
      text: "Dazu kommt der Zeitfaktor. Während ein Verfahren läuft, wird meist nicht saniert. Bei Instandhaltungsstau kostet jede Verzögerung Geld: Schäden werden größer, Handwerkerpreise steigen, und die Rücklage reicht am Ende nicht mehr. Der Streit ist damit nicht nur unangenehm, sondern rechnet sich für niemanden.",
    },
    {
      type: "heading",
      text: "Was Mediation in der WEG leisten kann",
    },
    {
      type: "paragraph",
      text: "Mediation ersetzt weder die Eigentümerversammlung noch das Beschlussverfahren – beides bleibt der formale Weg. Sie setzt davor an: Sie klärt, was die Lager tatsächlich brauchen, damit in der Versammlung ein beschlussfähiger, tragfähiger Vorschlag auf dem Tisch liegt statt einer Konfrontation.",
    },
    {
      type: "list",
      items: [
        "Vorbereitung strittiger Beschlüsse: Positionen vorher klären, damit die Versammlung entscheidet statt streitet.",
        "Zwei Lager zusammenbringen: Selbstnutzer und Kapitalanleger haben unterschiedliche, aber vereinbare Interessen.",
        "Verwalterkonflikte: Erwartungen an Erreichbarkeit, Abrechnung und Auftragsvergabe explizit machen.",
        "Einzelne gegen Gemeinschaft: Wenn eine Partei blockiert, ohne dass jemand nach dem Grund gefragt hat.",
        "Nach der Eskalation: Wenn bereits angefochten wurde und das Klima im Haus vergiftet ist.",
      ],
    },
    {
      type: "callout",
      text: "Der praktische Hebel liegt fast immer in der Kostenfrage. Widerstand gegen eine Sanierung ist selten grundsätzlich, sondern eine Frage der Liquidität. Sobald über Stufenmodelle, Sonderumlagen in Raten oder eine zeitliche Streckung gesprochen wird, löst sich ein Teil der Blockade oft von selbst.",
    },
    {
      type: "heading",
      text: "Ablauf: WEG-Konflikt online klären",
    },
    {
      type: "list",
      items: [
        "Getrennte Fallaufnahme: Jede beteiligte Partei schildert ihre Sicht schriftlich – kein gemeinsamer Termin nötig.",
        "Sachlage sortieren: Was ist beschlossen, was ist strittig, was ist reine Wahrnehmung?",
        "Interessen klären: Werterhalt, Liquidität, Nutzbarkeit, Ruhe, Verlässlichkeit der Verwaltung.",
        "Optionen entwickeln: Varianten mit unterschiedlicher Kostenverteilung und Zeitschiene.",
        "Ergebnis: ein abgestimmter Vorschlag, der als Beschlussvorlage in die Versammlung geht.",
      ],
    },
    {
      type: "paragraph",
      text: "Bei medipact läuft das vollständig online und asynchron – was bei einer Eigentümergemeinschaft besonders praktisch ist, weil die Beteiligten selten am selben Ort wohnen und Vermieter oft gar nicht vor Ort sind. Der Fall kostet 49 € pro Partei. Verwaltungen mit laufendem Bedarf über mehrere Objekte nutzen die Business-Tarife mit festem Fallkontingent.",
    },
    {
      type: "heading",
      text: "Wie verbindlich ist das Ergebnis?",
    },
    {
      type: "paragraph",
      text: "Hier ist eine klare Unterscheidung wichtig: Eine Mediationsvereinbarung bindet die Beteiligten, die sie geschlossen haben – sie ersetzt aber keinen Beschluss der Gemeinschaft. Was die Gemeinschaft als Ganzes verpflichtet, muss weiterhin ordnungsgemäß beschlossen werden. Die Mediation liefert die abgestimmte Vorlage; die Wirksamkeit stellt erst der Beschluss her.",
    },
    {
      type: "callout",
      text: "Mediation ersetzt keine Rechtsberatung. Ob ein Beschluss ordnungsgemäßer Verwaltung entspricht, welche Mehrheit erforderlich ist und welche Fristen laufen, ist eine juristische Frage – gerade bei Anfechtungen sind die Fristen kurz. Klären Sie das parallel anwaltlich.",
    },
    {
      type: "heading",
      text: "Wann der Rechtsweg der richtige Weg ist",
    },
    {
      type: "list",
      items: [
        "Eine Anfechtungsfrist läuft und lässt sich nicht anders sichern – dann zuerst fristwahrend handeln.",
        "Es besteht Verdacht auf Untreue oder unrichtige Abrechnungen durch die Verwaltung.",
        "Ein Beschluss ist offensichtlich nichtig und muss festgestellt werden.",
        "Eine Partei verweigert dauerhaft jede Mitwirkung, auch an einem formlosen Vorgespräch.",
      ],
    },
    {
      type: "paragraph",
      text: "In allen anderen Fällen lohnt der Versuch vor der Versammlung mehr als der Streit danach. Eine Eigentümergemeinschaft ist auf Jahrzehnte angelegt – die Frage ist nicht, wer diesen einen Beschluss gewinnt, sondern ob im nächsten Jahr überhaupt noch etwas entschieden werden kann.",
    },
    {
      type: "cta",
      text: "WEG-Konflikt klären, bevor angefochten wird – ab 49 € pro Partei",
      href: "/konflikte/nachbarschaft",
    },
  ],
  faq: [
    {
      question: "Kann man einen Streit in der Eigentümergemeinschaft ohne Gericht lösen?",
      answer:
        "In den meisten Fällen ja. Eine Mediation klärt vor der Eigentümerversammlung, was die Lager tatsächlich brauchen, und erarbeitet daraus eine abgestimmte Beschlussvorlage. Der formale Beschluss bleibt notwendig – aber er wird beschlussfähig, statt in einer Konfrontation zu enden, die anschließend angefochten wird.",
    },
    {
      question: "Ersetzt eine Mediation den Beschluss der Eigentümergemeinschaft?",
      answer:
        "Nein. Eine Mediationsvereinbarung bindet nur die Beteiligten, die sie geschlossen haben. Was die Gemeinschaft als Ganzes verpflichtet, muss weiterhin ordnungsgemäß beschlossen werden. Die Mediation liefert die abgestimmte Vorlage, die Wirksamkeit stellt erst der Beschluss her – prüfen Sie Mehrheiten und Formalien anwaltlich.",
    },
    {
      question: "Was kostet eine Mediation im WEG-Streit?",
      answer:
        "Bei medipact kostet der Fall 49 € pro beteiligter Partei als einmalige Pauschale für den geführten Online-Prozess. Für Hausverwaltungen mit laufendem Bedarf über mehrere Objekte gibt es Business-Tarife mit festem Fallkontingent pro Monat. Anwalts- und Gerichtskosten einer Beschlussanfechtung liegen regelmäßig deutlich darüber.",
    },
    {
      question: "Lohnt sich Mediation, wenn bereits angefochten wurde?",
      answer:
        "Oft ja – parallel zum laufenden Verfahren. Eine gewonnene Anfechtung bedeutet nur, dass erneut entschieden werden muss, im selben Klima und mit denselben Lagern. Wichtig ist die Reihenfolge: Fristen zuerst anwaltlich sichern, dann inhaltlich verhandeln. Beides schließt sich nicht aus.",
    },
    {
      question: "Funktioniert das auch, wenn die Eigentümer über ganz Deutschland verteilt wohnen?",
      answer:
        "Gerade dann. Das Verfahren läuft vollständig online und asynchron: Jede Partei bearbeitet ihren Teil im eigenen Tempo, es gibt keinen gemeinsamen Termin, der erst gefunden werden muss. Das ist bei Eigentümergemeinschaften mit vielen Kapitalanlegern häufig der einzige praktikable Weg.",
    },
  ],
  related: [
    { label: "Der Nachbar ist zu laut – was tun?", href: "/ratgeber/nachbar-laerm-was-tun" },
    { label: "Nachbarschaftsstreit schlichten", href: "/ratgeber/nachbarschaftsstreit-was-tun" },
    { label: "Nachbarschaft: Mediation im Überblick", href: "/konflikte/nachbarschaft" },
    { label: "Gericht oder Mediation?", href: "/ratgeber/gericht-oder-mediation" },
    { label: "Preise & Business-Tarife", href: "/preise" },
  ],
};
