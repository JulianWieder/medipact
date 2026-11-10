import type { RatgeberArticle } from "./types";

// 09.11.2026: von ~830 auf ~1.700 Wörter ausgebaut. Abgrenzung im Cluster:
//   wirtschaftsmediation      = Konflikte ZWISCHEN Unternehmen und unter
//                               Gesellschaftern (B2B, Verträge, Nachfolge)
//   mediation-im-unternehmen  = Konflikte IM Betrieb aus Sicht von HR/Führung
//   mediation-am-arbeitsplatz = Konflikte im Betrieb aus Sicht der Betroffenen
// Teamkonflikte werden hier deshalb nur noch verwiesen, nicht ausgeführt.
// Stundensätze wie in mediation-kosten.ts (Sekundärquellen, dort gepflegt).
export const article: RatgeberArticle = {
  slug: "wirtschaftsmediation",
  category: "Wirtschaftsmediation",
  title: "Wirtschaftsmediation: Konflikte im Unternehmen lösen",
  metaTitle: "Wirtschaftsmediation: Ablauf, Kosten & Beispiele | medipact",
  description:
    "Wirtschaftsmediation erklärt: Wann sich Mediation bei Gesellschafterstreit, Teamkonflikten und B2B-Streit lohnt, wie sie abläuft und was sie kostet.",
  eyebrow: "Ratgeber · Wirtschaftsmediation",
  updated: "2026-11-09",
  readingMinutes: 9,
  intro:
    "Man hat die Firma zusammen aufgebaut, Nächte durchgearbeitet, den ersten großen Auftrag gefeiert. Jetzt gehen E-Mails nur noch in Kopie an den Anwalt. Oder: Der Lieferant, mit dem man seit zehn Jahren arbeitet, schickt statt eines Anrufs eine Mahnung. Konflikte gehören zum Geschäftsleben – zwischen Gesellschaftern, im Team oder mit Geschäftspartnern. Werden sie nicht gelöst, kosten sie Zeit, Geld und oft die Geschäftsbeziehung. Wirtschaftsmediation bietet einen strukturierten Weg, solche Konflikte schnell, vertraulich und ohne Gericht zu klären.",
  blocks: [
    { type: "heading", text: "Was ist Wirtschaftsmediation?" },
    {
      type: "paragraph",
      text: "Wirtschaftsmediation ist die Anwendung des Mediationsverfahrens auf Konflikte im geschäftlichen Umfeld. Eine allparteiliche dritte Person – der Mediator – unterstützt die Beteiligten dabei, selbst eine Lösung zu erarbeiten, die wirtschaftlich tragfähig ist und die Zusammenarbeit erhält. Wie jede Mediation ist sie freiwillig, vertraulich und ergebnisoffen.",
    },
    {
      type: "paragraph",
      text: "Der entscheidende Unterschied zum Rechtsstreit: Vor Gericht geht es darum, wer Recht bekommt. In der Wirtschaftsmediation geht es darum, was für beide Seiten wirtschaftlich sinnvoll ist – und wie man weiter miteinander arbeiten kann.",
    },
    { type: "heading", text: "Typische Einsatzfelder" },
    {
      type: "list",
      items: [
        "Gesellschafterstreit: unterschiedliche Vorstellungen über Strategie, Gewinnverwendung oder Rollen in der Geschäftsführung.",
        "B2B-Streitigkeiten: Streit mit Kunden oder Lieferanten über Leistungen, Qualität, Termine oder Zahlungen.",
        "Projektkonflikte: Ein Projekt läuft aus dem Ruder, und beide Seiten geben einander die Schuld an Verzug und Mehrkosten.",
        "Nachfolge und Übergabe: Konflikte bei der Unternehmensnachfolge, gerade in Familienunternehmen.",
        "Vertragsverhandlungen: festgefahrene Verhandlungen, die neu strukturiert werden müssen.",
        "Konflikte im Team: Spannungen zwischen Mitarbeitenden oder zwischen Führungskraft und Team – dazu gibt es einen eigenen Ratgeber zur [Mediation im Unternehmen](/ratgeber/mediation-im-unternehmen).",
      ],
    },
    { type: "heading", text: "Warum Geschäftskonflikte selten nur geschäftlich sind" },
    {
      type: "paragraph",
      text: "In Schriftsätzen steht, es gehe um eine Vertragsauslegung oder eine Gewinnverteilung. Am Tisch zeigt sich fast immer etwas anderes. Der Mitgründer, der sich seit dem Einstieg des Investors übergangen fühlt. Die Tochter, die seit Jahren die Arbeit macht, während der Vater die Entscheidungen nicht abgibt. Der Dienstleister, der sich als Partner verstanden hat und jetzt wie ein austauschbarer Zulieferer behandelt wird.",
    },
    {
      type: "paragraph",
      text: "Das sind keine weichen Themen neben dem eigentlichen Streit – sie sind der Grund, warum der Streit sich nicht lösen lässt. Ein Gericht darf darüber nicht verhandeln, weil Kränkung kein Anspruch ist. Eine Mediation darf es. Und häufig wird die Zahl, um die monatelang gerungen wurde, in dem Moment verhandelbar, in dem einmal ausgesprochen ist, worum es wirklich ging.",
    },
    {
      type: "callout",
      text: "Wer um Prozentpunkte kämpft, kämpft oft um Anerkennung. Solange das nicht auf dem Tisch liegt, hilft auch die beste Rechnung nicht.",
    },
    { type: "heading", text: "Warum Mediation statt Gericht?" },
    {
      type: "paragraph",
      text: "Ein Gerichtsverfahren zwischen Geschäftspartnern hat fast immer einen hohen Preis, der über die reinen Verfahrenskosten hinausgeht: Es dauert oft Jahre, bindet Führungszeit, ist öffentlich – und am Ende ist die Geschäftsbeziehung in der Regel zerstört. Für laufende Verträge, gemeinsame Gesellschaften oder wichtige Lieferbeziehungen ist das oft der teuerste Ausgang.",
    },
    {
      type: "list",
      items: [
        "Schnelligkeit: Viele Wirtschaftsmediationen sind in wenigen Wochen abgeschlossen.",
        "Vertraulichkeit: Interna, Zahlen und der Konflikt selbst bleiben nicht öffentlich.",
        "Beziehungserhalt: Die Zusammenarbeit kann weitergehen, statt vor Gericht zu enden.",
        "Wirtschaftlichkeit: Planbare Kosten statt streitwertabhängiger Prozessrisiken.",
        "Eigene Lösung: Das Ergebnis passt zum Geschäft – kein Urteil nach Schema F.",
      ],
    },
    {
      type: "table",
      caption:
        "Wirtschaftsmediation, Schiedsverfahren und staatliches Gericht im Vergleich für Geschäftskonflikte",
      headers: ["Merkmal", "Mediation", "Schiedsverfahren", "Staatliches Gericht"],
      rows: [
        [
          "Wer entscheidet",
          "Die Parteien selbst",
          "Schiedsrichter, die die Parteien bestimmt haben",
          "Das Gericht",
        ],
        [
          "Vertraulichkeit",
          "Ja",
          "Ja",
          "Nein, die Verhandlung ist grundsätzlich öffentlich",
        ],
        [
          "Mögliche Ergebnisse",
          "Alles, worauf sich beide einigen – auch neue Verträge, Ratenpläne, geänderte Zusammenarbeit",
          "Entscheidung über die geltend gemachten Ansprüche",
          "Entscheidung über die geltend gemachten Ansprüche",
        ],
        [
          "Geschäftsbeziehung danach",
          "Kann fortbestehen",
          "Meist belastet",
          "Meist beendet",
        ],
      ],
    },
    {
      type: "callout",
      text: "Faustregel: Je wichtiger die künftige Zusammenarbeit und je vertraulicher das Thema, desto stärker sprechen die Argumente für Mediation statt Prozess.",
    },
    { type: "heading", text: "Wie läuft eine Wirtschaftsmediation ab?" },
    {
      type: "paragraph",
      text: "Der Ablauf folgt dem bewährten Phasenmodell der Mediation: Nach der Auftragsklärung sammeln die Beteiligten die strittigen Themen, arbeiten die dahinterliegenden Interessen heraus – etwa Liquidität, Planungssicherheit, Reputation oder Anerkennung – und entwickeln dann Lösungsoptionen, die verhandelt und in einer verbindlichen Abschlussvereinbarung festgehalten werden.",
    },
    {
      type: "paragraph",
      text: "Besonderheit im Geschäftskontext: Häufig sitzen nicht nur zwei Personen am Tisch, sondern Organisationen. Dann ist wichtig, dass die Verhandelnden entscheidungsbefugt sind und interne Abstimmungen eingeplant werden. Auch die rechtliche Prüfung der Abschlussvereinbarung – etwa durch Anwälte oder Steuerberater – gehört bei wirtschaftlichen Konflikten zum guten Standard.",
    },
    { type: "heading", text: "Ein Beispiel: Wenn zwei Gesellschafter nicht mehr miteinander reden" },
    {
      type: "paragraph",
      text: "Zwei Gründer halten je die Hälfte einer GmbH. Einer will wachsen und Investoren aufnehmen, der andere das Unternehmen klein und profitabel halten. Seit einem Jahr blockieren sie sich in jeder Gesellschafterversammlung, die Mitarbeitenden wissen längst, dass sie besser beide einzeln fragen. Auf dem Papier ist es ein Streit über die Strategie. In der Mediation zeigt sich: Der eine fürchtet, im eigenen Unternehmen nichts mehr zu sagen zu haben; der andere hat sein privates Vermögen in der Firma gebunden und kann sich kein Risiko mehr leisten.",
    },
    {
      type: "paragraph",
      text: "Damit liegen plötzlich Lösungen auf dem Tisch, die im Rechtsstreit nie vorkommen würden: eine klare Aufteilung der Zuständigkeiten, eine Ausschüttungsregel, die den einen absichert, ein vereinbarter Weg für den Fall, dass einer aussteigen will. Wie ein solcher Fall bei medipact ablaufen kann, zeigt das [Fallbeispiel Gesellschafterstreit](/cases/gesellschafter-streit); für Streit zwischen Unternehmen das [Fallbeispiel B2B-Projektstreit](/cases/b2b-projektstreit).",
    },
    { type: "heading", text: "Mediationsklausel, Fristen und Verbindlichkeit" },
    {
      type: "paragraph",
      text: "Viele Verträge enthalten eine Mediationsklausel: Die Parteien verpflichten sich, vor einer Klage zunächst eine Mediation zu versuchen. Eine solche Klausel kann dazu führen, dass eine Klage vorerst unzulässig ist, solange dieser Versuch nicht unternommen wurde. Es lohnt sich deshalb, im Konfliktfall zuerst in den Vertrag zu schauen – und bei neuen Verträgen eine Klausel aufzunehmen, solange man sich noch gut versteht.",
    },
    {
      type: "paragraph",
      text: "Die Sorge, während der Gespräche Ansprüche zu verlieren, ist bei der Verjährung meist unbegründet: Solange über einen Anspruch verhandelt wird, ist die Verjährung nach § 203 BGB gehemmt, und eine Mediation gilt als solche Verhandlung. Vertragliche Ausschlussfristen und kurze gesetzliche Klagefristen sind ein anderes Thema – sie sollten vor Beginn anwaltlich geprüft und am besten in der Mediationsvereinbarung ausdrücklich geregelt werden.",
    },
    {
      type: "paragraph",
      text: "Die Abschlussvereinbarung ist ein Vertrag und damit bindend. Soll sie notfalls ohne neuen Prozess durchsetzbar sein, kann sie als notarielle Urkunde oder als Anwaltsvergleich gestaltet werden. Dieser Artikel ersetzt keine Rechtsberatung; bei wirtschaftlich bedeutsamen Regelungen gehört die Prüfung durch Ihre Berater dazu.",
    },
    { type: "heading", text: "Was kostet eine Wirtschaftsmediation?" },
    {
      type: "paragraph",
      text: "Klassisch wird nach Stundensatz abgerechnet. In der Wirtschaftsmediation sind etwa 250 bis 400 Euro pro Stunde verbreitet, bei komplexen Verfahren auch mehr; für mehrtägige Verfahren werden häufig Tagessätze vereinbart. Üblich ist, dass die Parteien die Kosten teilen. Entscheidend für die Gesamtsumme ist weniger der Stundensatz als die Zahl der Sitzungen. Die Einordnung aller Preismodelle finden Sie im Artikel [Was kostet eine Mediation?](/ratgeber/mediation-kosten).",
    },
    {
      type: "paragraph",
      text: "Die ehrlichere Rechnung stellt die Mediation aber nicht dem Stundensatz gegenüber, sondern der Alternative: Führungszeit über Jahre, Anwalts- und Gerichtskosten nach Streitwert, ein blockiertes Unternehmen oder ein verlorener Kunde. Mit dem [Kostenrechner](/kostenrechner?art=odr) können Sie beide Wege für Ihren Streitwert überschlagen.",
    },
    { type: "heading", text: "Wirtschaftsmediation online mit medipact" },
    {
      type: "paragraph",
      text: "medipact führt beide Seiten strukturiert und schriftlich durch das Verfahren – im eigenen Tempo, ohne Terminfindung quer durch volle Kalender und zu einem transparenten, planbaren Preis. Gerade bei Geschäftskonflikten hilft die schriftliche Struktur, sachlich zu bleiben und Ergebnisse nachvollziehbar festzuhalten.",
    },
    {
      type: "paragraph",
      text: "Das schriftliche Format hat einen zweiten Vorteil, der im Geschäftsleben oft unterschätzt wird: Niemand muss vor dem anderen das Gesicht wahren. Wer in Ruhe formulieren kann, was ihm wichtig ist, muss nicht im Besprechungsraum Stärke zeigen. Das macht es leichter, den ersten Schritt zu gehen.",
    },
    {
      type: "cta",
      text: "Mehr zu Geschäftskonflikten bei medipact",
      href: "/konflikte/odr",
    },
  ],
  faq: [
    {
      question: "Was ist Wirtschaftsmediation?",
      answer:
        "Wirtschaftsmediation ist ein strukturiertes, vertrauliches Verfahren, in dem ein neutraler Mediator Unternehmen oder Geschäftspartner dabei unterstützt, einen Konflikt selbst zu lösen – ohne Gericht und mit Blick auf die weitere Zusammenarbeit.",
    },
    {
      question: "Wann lohnt sich eine Wirtschaftsmediation?",
      answer:
        "Immer dann, wenn die Geschäftsbeziehung weitergehen soll, Vertraulichkeit wichtig ist oder ein Prozess unverhältnismäßig teuer und langwierig wäre – etwa bei Gesellschafterstreit, Team-Konflikten oder Streit mit Geschäftspartnern.",
    },
    {
      question: "Ist das Ergebnis einer Wirtschaftsmediation bindend?",
      answer:
        "Ja, die Abschlussvereinbarung ist ein Vertrag und damit bindend. Bei wirtschaftlich bedeutsamen Regelungen empfiehlt sich zusätzlich eine anwaltliche oder steuerliche Prüfung vor der Unterschrift.",
    },
    {
      question: "Was kostet eine Wirtschaftsmediation?",
      answer:
        "Klassisch wird meist nach Stundensatz abgerechnet, der bei Wirtschaftsmediationen über dem privater Verfahren liegt – verbreitet sind etwa 250 bis 400 Euro pro Stunde. Online-Verfahren wie medipact bieten dagegen transparente, planbare Preise.",
    },
    {
      question: "Was ist eine Mediationsklausel?",
      answer:
        "Eine Mediationsklausel ist eine Vertragsregelung, nach der die Parteien im Streitfall zuerst eine Mediation versuchen, bevor sie klagen. Sie kann eine vorschnelle Klage vorerst unzulässig machen und sorgt dafür, dass der Weg zur Einigung schon vereinbart ist.",
    },
    {
      question: "Verjähren Ansprüche während einer Wirtschaftsmediation?",
      answer:
        "In der Regel nicht: Während Verhandlungen über einen Anspruch ist die Verjährung nach § 203 BGB gehemmt, und eine Mediation gilt als Verhandlung. Vertragliche Ausschlussfristen und Klagefristen sollten Sie trotzdem vorab prüfen lassen.",
    },
  ],
  related: [
    { label: "Kostenrechner: Gericht oder Einigung?", href: "/kostenrechner?art=odr" },
    { label: "Kündigung ohne Gericht klären", href: "/ratgeber/kuendigung-ohne-gericht" },
    { label: "Geschäftskonflikte lösen mit medipact", href: "/konflikte/odr" },
    { label: "Fallbeispiel: Gesellschafterstreit", href: "/cases/gesellschafter-streit" },
    { label: "Fallbeispiel: B2B-Projektstreit", href: "/cases/b2b-projektstreit" },
    { label: "Fallbeispiel: Unternehmen geerbt", href: "/cases/unternehmen-geerbt" },
    { label: "Online Dispute Resolution (ODR): Streit digital beilegen", href: "/ratgeber/online-dispute-resolution" },
    { label: "Mediation im Unternehmen & Teamkonflikte", href: "/ratgeber/mediation-im-unternehmen" },
    { label: "Mediation als Konfliktlösung – der Leitfaden", href: "/ratgeber/mediation-als-konfliktloesung" },
    { label: "Was kostet eine Mediation?", href: "/ratgeber/mediation-kosten" },
    { label: "Die 5 Phasen der Mediation", href: "/ratgeber/5-phasen-der-mediation" },
    { label: "Konfliktarten: die 6 Arten im Überblick", href: "/ratgeber/konfliktarten" },
  ],
};
