// Ziel-Suchbegriffe: "trennungsvereinbarung", "trennungsvereinbarung muster",
// "trennungsvereinbarung kosten", "trennungsvereinbarung notar",
// "trennungsvereinbarung ohne notar".
//
// 12.08.2026 – neu, zusammen mit scheidungsfolgenvereinbarung.ts. Siehe
// docs/kaufabsicht-scheidung.md. Die Trennungsvereinbarung kommt zeitlich
// VORHER und ist der natürliche Einstieg ins Trennungsjahr — wer sie sucht,
// hat sich gerade getrennt und steht am Anfang, nicht am Ende.
//
// INHALTLICHER KERN: Der Verzicht auf künftigen Trennungsunterhalt ist
// unwirksam. Das steht in kaum einem Muster, wird laufend falsch vereinbart,
// und es ist der Punkt, an dem selbstgebaute Vereinbarungen platzen. Er trägt
// den Artikel — nicht die Aufzählung der Regelungspunkte.
//
// ACHTUNG VOR VERÖFFENTLICHUNG: Paragrafen (§ 1361 BGB, § 1361b BGB,
// § 1566 BGB, § 1614 BGB) juristisch gegenlesen lassen.

import type { RatgeberArticle } from "./types";

export const article: RatgeberArticle = {
  slug: "trennungsvereinbarung",
  category: "Trennung & Scheidung",
  title: "Trennungsvereinbarung: was hineingehört – und was nicht wirksam ist",
  metaTitle: "Trennungsvereinbarung: Inhalt, Form & Kosten | medipact",
  description:
    "Was in eine Trennungsvereinbarung gehört, wann der Notar nötig ist, was sie kostet – und warum ein Verzicht auf Trennungsunterhalt unwirksam ist.",
  eyebrow: "Ratgeber · Trennung & Scheidung",
  updated: "2026-08-12",
  published: "2026-08-12",
  readingMinutes: 9,
  intro:
    "Direkt nach einer Trennung ist vieles gleichzeitig offen: Wer bleibt in der Wohnung, wer zahlt welche Rechnung, wann sind die Kinder bei wem, was passiert mit dem gemeinsamen Konto. Eine Trennungsvereinbarung hält das schriftlich fest, solange beide noch miteinander reden. Dieser Artikel zeigt, was hineingehört, was Sie sich sparen können – und die eine Regelung, die viele vereinbaren, obwohl sie unwirksam ist.",
  blocks: [
    {
      type: "paragraph",
      text: "Eine Trennungsvereinbarung ist kein Pflichtdokument. Sie ist ein praktisches: Sie regelt die Zeit zwischen Auszug und Scheidung – meist also das Trennungsjahr. Ihr Wert liegt weniger in der juristischen Durchsetzbarkeit als darin, dass Sie beide sich einmal hinsetzen und die Fragen beantworten, über die Sie sonst monatelang in Kurznachrichten streiten.",
    },
    {
      type: "callout",
      text: "Der beste Zeitpunkt ist der früheste. In den ersten Wochen nach der Trennung ist die Bereitschaft, sich zu einigen, fast immer höher als ein halbes Jahr später – wenn beide Seiten Beratung eingeholt und Positionen aufgebaut haben.",
    },
    {
      type: "heading",
      text: "Was hineingehört",
    },
    {
      type: "list",
      items: [
        "Der Trennungszeitpunkt: das Datum, ab dem Sie getrennt leben. Daran hängt das Trennungsjahr und damit der frühestmögliche Scheidungsantrag.",
        "Ehewohnung: Wer bleibt, wer zieht aus, bis wann – und wer zahlt in der Zwischenzeit Miete oder Rate.",
        "Hausrat: Wer nimmt was mit. Klingt kleinlich, ist erfahrungsgemäß der häufigste Auslöser für Eskalation nach dem Auszug.",
        "Trennungsunterhalt: Höhe, Fälligkeit, Zahlungsweg – und ab wann.",
        "Kindesunterhalt: meist entlang der Düsseldorfer Tabelle, mit klarer Regelung für Sonderbedarf wie Klassenfahrt oder Zahnspange.",
        "Betreuung und Umgang: Wo leben die Kinder, wie ist der Wechsel geregelt, wie werden Ferien aufgeteilt.",
        "Konten, Karten und Schulden: Auflösung von Gemeinschaftskonten, Umgang mit Dispo und laufenden Krediten, Kündigung gemeinsamer Verträge.",
        "Steuerliches: Wechsel der Steuerklassen zum Jahreswechsel, gemeinsame Veranlagung für das Trennungsjahr, Ausgleich eines dadurch entstehenden Nachteils.",
      ],
    },
    {
      type: "paragraph",
      text: "Der letzte Punkt wird fast immer vergessen und kostet Geld: Für das Jahr der Trennung ist eine gemeinsame Veranlagung noch möglich und meistens günstiger. Wer sie verweigert, obwohl die andere Seite den steuerlichen Nachteil ausgleicht, handelt sich Streit ein, der sich mit zwei Sätzen in der Vereinbarung vermeiden lässt.",
    },
    {
      type: "heading",
      text: "Die Regelung, die nicht hält: Verzicht auf Trennungsunterhalt",
    },
    {
      type: "paragraph",
      text: "Das ist der wichtigste Punkt dieses Artikels, und er steht in kaum einem Muster: Auf künftigen Trennungsunterhalt kann man nicht wirksam verzichten. Eine entsprechende Klausel ist nichtig – auch dann, wenn beide sie unterschrieben haben, auch dann, wenn sie notariell beurkundet wurde, und auch dann, wenn sie fair gemeint war.",
    },
    {
      type: "paragraph",
      text: "Der Grund liegt in der Systematik: Der Trennungsunterhalt nach § 1361 BGB soll die wirtschaftlich schwächere Seite in einer Phase absichern, in der die Ehe rechtlich noch besteht. Über die Verweisungskette in § 1361 Abs. 4 BGB gilt hier das Verzichtsverbot des § 1614 BGB. Beim nachehelichen Unterhalt ist das anders – dort sind Verzichte grundsätzlich möglich, wenn auch nicht grenzenlos.",
    },
    {
      type: "callout",
      text: "Was stattdessen geht: die Höhe konkret vereinbaren, auch niedriger als der rechnerische Anspruch, solange die Vereinbarung nicht auf einen verdeckten Vollverzicht hinausläuft. Auch eine Regelung, wie Wohnvorteil oder übernommene Kreditraten angerechnet werden, ist zulässig und in der Praxis oft der eigentliche Hebel.",
    },
    {
      type: "heading",
      text: "Braucht die Vereinbarung einen Notar?",
    },
    {
      type: "paragraph",
      text: "Meistens nicht. Der übliche Inhalt einer Trennungsvereinbarung – Wohnung, Hausrat, Trennungsunterhalt, Umgang, Konten – ist formfrei; Schriftform mit beiden Unterschriften genügt und ist trotzdem dringend zu empfehlen, schon zur Beweissicherung.",
    },
    {
      type: "paragraph",
      text: "Zum Notar müssen Sie, sobald Sie über die Trennungszeit hinausgreifen: bei der Übertragung von Grundeigentum, bei Regelungen zum Zugewinnausgleich oder zum Versorgungsausgleich und beim nachehelichen Unterhalt, solange die Scheidung nicht rechtskräftig ist. Wer solche Punkte in die Trennungsvereinbarung aufnimmt, schreibt in Wahrheit bereits eine Scheidungsfolgenvereinbarung – und dann gelten deren Formvorschriften.",
    },
    {
      type: "table",
      caption: "Trennungsvereinbarung und Scheidungsfolgenvereinbarung im Vergleich",
      headers: ["", "Trennungsvereinbarung", "Scheidungsfolgenvereinbarung"],
      rows: [
        ["Zeitraum", "ab Trennung bis zur Scheidung", "die Zeit nach der Ehe"],
        [
          "Typischer Inhalt",
          "Wohnung, Hausrat, Trennungsunterhalt, Umgang, Konten",
          "Zugewinn, Versorgungsausgleich, nachehelicher Unterhalt, Immobilie",
        ],
        ["Form", "in der Regel formfrei, Schriftform empfohlen", "meist notariell beurkundet"],
        ["Unterhaltsverzicht", "unwirksam", "im Rahmen der Grenzen möglich"],
      ],
    },
    {
      type: "heading",
      text: "Der Trennungszeitpunkt ist mehr als ein Datum",
    },
    {
      type: "paragraph",
      text: "Halten Sie ihn ausdrücklich fest. Das Trennungsjahr nach § 1566 BGB beginnt mit dem Getrenntleben, und wenn später Uneinigkeit darüber entsteht, wann das war, verschiebt sich der Scheidungsantrag – im ungünstigen Fall um Monate. Getrenntleben ist übrigens auch innerhalb derselben Wohnung möglich, wenn keine häusliche Gemeinschaft mehr besteht: getrennte Räume, getrennte Wirtschaft, keine Versorgungsleistungen füreinander.",
    },
    {
      type: "cta",
      text: "Wie Sie das Trennungsjahr sauber nachweisen",
      href: "/ratgeber/trennungsjahr-nachweisen",
    },
    {
      type: "heading",
      text: "Was eine Trennungsvereinbarung kostet",
    },
    {
      type: "paragraph",
      text: "Ohne Notar entstehen nur die Kosten der Beratung, die Sie in Anspruch nehmen. Lassen Sie eine Kanzlei die Vereinbarung entwerfen, richtet sich das Honorar nach dem Gegenstandswert – und der ist bei einer Trennungsvereinbarung schon deshalb nicht klein, weil Unterhalt kapitalisiert einfließt. Wird beurkundet, kommen Notargebühren nach dem Geschäftswert hinzu.",
    },
    {
      type: "paragraph",
      text: "Der größere Posten ist auch hier nicht das Dokument, sondern der Weg dorthin. Wenn zwei Kanzleien über Wochen Entwürfe austauschen, entstehen Gebühren auf beiden Seiten – für einen Vertrag, der die nächsten zwölf Monate regelt und danach ohnehin von der Scheidungsfolgenvereinbarung abgelöst wird.",
    },
    {
      type: "heading",
      text: "Wie medipact hier hilft",
    },
    {
      type: "paragraph",
      text: "Der medipact-Prozess führt beide Seiten getrennt und schriftlich durch genau die Punkte, die oben stehen – ohne gemeinsamen Termin, im eigenen Tempo und zum Festpreis pro Partei. Am Ende steht eine schriftliche Vereinbarung, die Sie anwaltlich prüfen und, falls Sie über die Trennungszeit hinausgehende Punkte aufnehmen, notariell beurkunden lassen.",
    },
    {
      type: "paragraph",
      text: "Der praktische Vorteil in dieser Phase ist die Asynchronität: Sie müssen sich nicht gegenübersitzen, während die Trennung noch frisch ist. Beide Seiten antworten, wenn sie es können – und nicht unter dem Druck eines laufenden Gesprächs.",
    },
    {
      type: "cta",
      text: "Trennung strukturiert und fair regeln",
      href: "/konflikte/trennung",
    },
    {
      type: "callout",
      text: "Dieser Artikel ersetzt keine Rechts- oder Steuerberatung. Ob eine Unterhaltsregelung in Ihrer Konstellation trägt, welche Anrechnungen zulässig sind und wie die gemeinsame Veranlagung sich auswirkt, hängt am Einzelfall. Lassen Sie die Vereinbarung prüfen, bevor Sie unterschreiben.",
    },
  ],
  faq: [
    {
      question: "Muss eine Trennungsvereinbarung notariell beurkundet werden?",
      answer:
        "In der Regel nicht. Die üblichen Inhalte – Ehewohnung, Hausrat, Trennungsunterhalt, Umgang mit den Kindern, Konten – sind formfrei; Schriftform mit beiden Unterschriften genügt und ist zur Beweissicherung dringend zu empfehlen. Beurkundungspflichtig wird es erst, wenn Grundeigentum übertragen oder Zugewinnausgleich, Versorgungsausgleich oder nachehelicher Unterhalt geregelt werden.",
    },
    {
      question: "Kann man auf Trennungsunterhalt verzichten?",
      answer:
        "Nein, ein Verzicht auf künftigen Trennungsunterhalt ist unwirksam – auch bei notarieller Beurkundung und auch dann, wenn beide Seiten einverstanden waren. Möglich ist dagegen, die Höhe konkret zu vereinbaren oder zu regeln, wie Wohnvorteil und übernommene Kreditraten angerechnet werden, solange daraus kein verdeckter Vollverzicht wird.",
    },
    {
      question: "Was ist der Unterschied zur Scheidungsfolgenvereinbarung?",
      answer:
        "Der Zeitraum. Die Trennungsvereinbarung regelt die Zeit von der Trennung bis zur Scheidung, die Scheidungsfolgenvereinbarung die Zeit danach – also Zugewinn, Versorgungsausgleich und nachehelichen Unterhalt. Eine Trennungsvereinbarung kann bestimmen, dass einzelne Regelungen fortgelten; sobald sie nacheheliche Punkte enthält, gelten allerdings die strengeren Formvorschriften.",
    },
    {
      question: "Brauchen wir überhaupt eine Trennungsvereinbarung?",
      answer:
        "Rechtlich vorgeschrieben ist sie nicht. Praktisch lohnt sie sich, sobald es gemeinsame Kinder, eine gemeinsame Wohnung, gemeinsame Konten oder ein deutliches Einkommensgefälle gibt. Sie schafft für das Trennungsjahr Planbarkeit und verhindert, dass jede Einzelfrage neu verhandelt wird – was die spätere Scheidung erfahrungsgemäß deutlich einfacher macht.",
    },
    {
      question: "Ab wann gilt man als getrennt lebend?",
      answer:
        "Sobald die häusliche Gemeinschaft aufgehoben ist und mindestens eine Seite sie erkennbar nicht fortsetzen will. Das ist auch innerhalb derselben Wohnung möglich: getrennte Räume, getrennte Wirtschaft, keine Versorgungsleistungen füreinander. Halten Sie das Datum schriftlich fest – am Trennungsjahr nach § 1566 BGB hängt der frühestmögliche Scheidungsantrag.",
    },
  ],
  related: [
    { label: "Kostenrechner: Gericht oder Einigung?", href: "/kostenrechner?art=trennung" },
    { label: "Scheidungsfolgenvereinbarung: Inhalt und Kosten", href: "/ratgeber/scheidungsfolgenvereinbarung" },
    { label: "Trennungsjahr nachweisen", href: "/ratgeber/trennungsjahr-nachweisen" },
    { label: "Wer muss bei einer Trennung aus der Wohnung?", href: "/ratgeber/wer-muss-aus-der-wohnung" },
    { label: "Was steht mir bei der Scheidung zu?", href: "/ratgeber/was-steht-mir-bei-der-scheidung-zu" },
    { label: "Sorgerecht und Umgangsrecht regeln", href: "/ratgeber/sorgerecht-und-umgangsrecht" },
    { label: "Ich will mich trennen – die ersten Schritte", href: "/ratgeber/ich-will-mich-trennen" },
    { label: "Trennung & Scheidung: Mediation im Überblick", href: "/konflikte/trennung" },
  ],
};
