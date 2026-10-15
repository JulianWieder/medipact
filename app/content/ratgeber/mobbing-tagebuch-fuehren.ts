import type { RatgeberArticle } from "./types";

// Keywords: Mobbing-Tagebuch, Mobbing-Tagebuch Vorlage, Mobbing dokumentieren,
// Mobbing beweisen, Mobbingtagebuch führen.
// 15.10.2026 – erster Artikel der Reihe "pro Konfliktart eine Anleitung mit
// Vorlage, die auf das Konflikt-Logbuch verweist". Die Vorlage steckt als
// Tabelle im Artikel (kein PDF) – abschreiben oder ins Logbuch übernehmen.
// CTA-Ziel: /konflikt-logbuch (Einstieg), zweiter CTA /konflikte/arbeitsplatz.
// Rechtliche Angaben (§ 84 BetrVG, AGG-Beschwerdestelle, § 201 StGB,
// Ausschlussfristen) vor Veröffentlichung gegenlesen.

export const article: RatgeberArticle = {
  slug: "mobbing-tagebuch-fuehren",
  category: "Mediation",
  title: "Mobbing-Tagebuch führen: Anleitung mit Vorlage",
  metaTitle: "Mobbing-Tagebuch führen: Anleitung & Vorlage | medipact",
  description:
    "Mobbing-Tagebuch richtig führen: was hineingehört, eine Vorlage zum Übernehmen, typische Fehler – und welche Schritte danach möglich sind.",
  eyebrow: "Ratgeber · Arbeitsplatz",
  updated: "2026-10-15",
  published: "2026-10-15",
  readingMinutes: 8,
  intro:
    "Wer am Arbeitsplatz gemobbt wird, erlebt selten den einen großen Vorfall. Es sind viele kleine: die nicht weitergeleitete Mail, der Spruch in der Teamrunde, das Meeting, zu dem man plötzlich nicht mehr eingeladen wird. Einzeln wirkt jeder harmlos – erst zusammen ergeben sie ein Bild. Deshalb ist ein Mobbing-Tagebuch der wichtigste erste Schritt: Es macht aus einem Gefühl eine nachvollziehbare Chronologie. Dieser Ratgeber zeigt, wie Sie es führen, damit es später trägt.",
  blocks: [
    { type: "heading", text: "Warum ohne Dokumentation fast nichts geht" },
    {
      type: "paragraph",
      text: "„Mobbing“ ist im deutschen Recht kein eigener Tatbestand. Arbeitsgerichte prüfen stattdessen, ob jemand systematisch und über längere Zeit angefeindet, schikaniert oder ausgegrenzt wurde. Das Wort „systematisch“ ist der Kern: Sie müssen nicht einen Vorfall belegen, sondern ein Muster. Und ein Muster lässt sich nur zeigen, wenn die einzelnen Vorfälle mit Datum und Inhalt festgehalten sind.",
    },
    {
      type: "paragraph",
      text: "Das gilt nicht erst vor Gericht. Auch Betriebsrat, Personalabteilung, Beschwerdestelle oder Ihre Ärztin können nur mit dem arbeiten, was Sie konkret schildern. „Die mobben mich seit Monaten“ ist schwer greifbar. „Am 12. März hat mich mein Teamleiter vor sechs Kollegen als unfähig bezeichnet – zum dritten Mal in vier Wochen“ ist es nicht.",
    },
    { type: "heading", text: "Was in ein Mobbing-Tagebuch gehört" },
    {
      type: "list",
      items: [
        "Datum und Uhrzeit des Vorfalls – und getrennt davon, wann Sie ihn notiert haben.",
        "Wer beteiligt war: Wer hat gehandelt, wer war anwesend, wer könnte es bezeugen?",
        "Was genau passiert ist – beschreibend statt wertend. Aussagen möglichst wörtlich, in Anführungszeichen.",
        "Wo es passiert ist: Büro, Besprechung, Mail, Chat, Telefon.",
        "Wie Sie reagiert haben und was danach geschah.",
        "Die Folgen für Sie: Schlafprobleme, Arztbesuch, Krankschreibung, entzogene Aufgaben.",
        "Belege: Mails, Chatnachrichten, Kalendereinträge, Arbeitsanweisungen – gesichert und im Eintrag vermerkt.",
      ],
    },
    {
      type: "callout",
      text: "Faustregel: Ein Eintrag ist gut, wenn eine fremde Person ihn ohne Ihre Erklärung versteht – und wenn er auch dann noch stimmt, wenn die Gegenseite ihn liest.",
    },
    { type: "heading", text: "Vorlage: So kann ein Eintrag aussehen" },
    {
      type: "paragraph",
      text: "Sie brauchen kein spezielles Formular. Eine Tabelle mit diesen fünf Spalten reicht – auf Papier, in einer Tabellenkalkulation oder in einem digitalen Logbuch. Die beiden Beispielzeilen sind erfunden und zeigen nur den Ton: konkret, datiert, ohne Bewertung.",
    },
    {
      type: "table",
      caption: "Vorlage für ein Mobbing-Tagebuch mit zwei erfundenen Beispieleinträgen",
      headers: ["Datum / Uhrzeit", "Was ist passiert?", "Beteiligte / Zeugen", "Folgen für mich", "Belege"],
      rows: [
        [
          "Mo, 03.03., ca. 9:40 Uhr",
          "Teamleiter M. sagt in der Teamrunde: „Das kann ja nicht mal unsere Praktikantin falsch machen.“ Danach Gelächter.",
          "M.; anwesend: K., S., T.",
          "Habe mich in der Runde nicht mehr geäußert, nachmittags Kopfschmerzen",
          "–",
        ],
        [
          "Do, 06.03.",
          "Die Einladung zum Projekt-Jour-fixe kommt nicht mehr. Kollegin K. bestätigt, dass alle anderen eingeladen sind.",
          "M.; K. als Zeugin",
          "Information zum Abgabetermin fehlte, Rückfrage beim Kunden nötig",
          "Screenshot Kalender, Chat mit K.",
        ],
      ],
    },
    { type: "heading", text: "Die häufigsten Fehler" },
    {
      type: "list",
      items: [
        "Zu spät anfangen: Viele beginnen erst, wenn sie kurz vor der Krankschreibung stehen. Rekonstruieren Sie frühere Vorfälle so genau wie möglich – und kennzeichnen Sie sie als nachträglich notiert.",
        "Bewerten statt beschreiben: „Er ist ein Tyrann“ hilft Ihnen nicht. Was er gesagt und getan hat, schon.",
        "Unbedacht Firmendaten sichern: Prüfen Sie, ob Sie dienstliche Unterlagen privat speichern dürfen. Im Zweifel notieren Sie Datum, Absender und Betreff, statt die Mail an Ihre private Adresse weiterzuleiten.",
        "Heimlich aufnehmen: Das nichtöffentlich gesprochene Wort ohne Einwilligung aufzuzeichnen ist strafbar (§ 201 StGB). Schreiben Sie stattdessen direkt nach dem Gespräch ein Gedächtnisprotokoll.",
        "Alles an verschiedenen Orten: Notizen im Handy, Zettel in der Schublade, Screenshots in der Galerie – im Ernstfall lässt sich das kaum zusammensetzen. Eine Chronologie, ein Ort.",
        "Nur die schlimmen Tage festhalten: Auch Gesprächsversuche und ruhige Phasen gehören hinein. Sie zeigen, dass Sie lösungsbereit waren.",
      ],
    },
    { type: "heading", text: "Was Sie mit dem Tagebuch tun können" },
    {
      type: "paragraph",
      text: "Das Tagebuch ist kein Selbstzweck. Es ist die Grundlage für die nächsten Schritte – und welche das sind, hängt davon ab, wie verfahren die Lage ist.",
    },
    {
      type: "list",
      items: [
        "Das direkte Gespräch – mit der Person selbst oder mit der nächsthöheren Führungskraft. Mit konkreten Vorfällen statt Pauschalvorwürfen.",
        "Die Beschwerde: Beschäftigte können sich bei der zuständigen Stelle im Betrieb beschweren, wenn sie sich benachteiligt oder ungerecht behandelt fühlen (§ 84 BetrVG). Geht es um Benachteiligung etwa wegen Geschlecht, ethnischer Herkunft oder Alter, gibt es zusätzlich die Beschwerdestelle nach dem AGG. Ein Betriebsrat kann Sie dabei unterstützen.",
        "Ärztliche und psychologische Hilfe: Ihr Tagebuch hilft auch Ihrer Ärztin oder Ihrem Therapeuten, die Belastung einzuordnen.",
        "Anwaltliche Beratung, wenn Sie über Ansprüche oder eine Trennung vom Arbeitgeber nachdenken. Achten Sie auf Ausschlussfristen in Arbeits- und Tarifverträgen – Ansprüche können schon nach wenigen Monaten verfallen.",
        "Eine Mediation, wenn beide Seiten weiter zusammenarbeiten wollen und kein starkes Machtgefälle besteht.",
      ],
    },
    { type: "heading", text: "Wann Mediation passt – und wann nicht" },
    {
      type: "paragraph",
      text: "Ehrlich gesagt: Bei echtem Mobbing mit klarem Machtgefälle ist Mediation selten der erste Weg. Wer systematisch ausgegrenzt wird, braucht zuerst Schutz – durch Arbeitgeber, Betriebsrat oder notfalls das Arbeitsgericht – und keinen Kompromiss mit der Person, die ihn ausgrenzt.",
    },
    {
      type: "paragraph",
      text: "Nicht jeder Konflikt am Arbeitsplatz ist aber Mobbing. Oft steckt ein festgefahrener Konflikt zwischen zwei Menschen dahinter, die sich gegenseitig das Leben schwer machen. Genau dort kann eine Mediation helfen – und genau dort zeigt sich der Wert Ihres Tagebuchs: Sie gehen mit Fakten statt mit Vorwürfen in das Verfahren. Bei medipact läuft eine solche Klärung schriftlich und online, ohne dass Sie der anderen Person gegenübersitzen müssen.",
    },
    {
      type: "cta",
      text: "Konflikt am Arbeitsplatz klären",
      href: "/konflikte/arbeitsplatz",
    },
    { type: "heading", text: "Digital führen: das Konflikt-Logbuch" },
    {
      type: "paragraph",
      text: "Sie können Ihr Tagebuch auf Papier führen. Digital hat es zwei Vorteile: Die Einträge sortieren sich von selbst chronologisch, und Sie haben Ihr Protokoll immer dabei – auch direkt nach der Besprechung. Das Konflikt-Logbuch von medipact ist genau dafür gebaut: kostenlos, privat und unabhängig von Ihrem Arbeitgeber. Sie erfassen Vorkommnisse, Gespräche, E-Mails, Nachrichten und Telefonate mit Datum und Wortlaut; Gedanken, die niemand lesen soll, markieren Sie als privates Journal.",
    },
    {
      type: "callout",
      text: "Führen Sie Ihr Tagebuch auf einem privaten Gerät und mit einer privaten E-Mail-Adresse – nicht auf dem Diensthandy oder dem Firmenrechner.",
    },
    {
      type: "cta",
      text: "Mobbing-Tagebuch kostenlos im Konflikt-Logbuch führen",
      href: "/konflikt-logbuch",
    },
  ],
  faq: [
    {
      question: "Wie führe ich ein Mobbing-Tagebuch richtig?",
      answer:
        "Zeitnah, chronologisch und beschreibend: Notieren Sie zu jedem Vorfall Datum, Uhrzeit, Beteiligte, Zeugen, den genauen Ablauf, wörtliche Aussagen und die Folgen für Sie. Sichern Sie Belege und führen Sie alles an einem einzigen Ort.",
    },
    {
      question: "Ist ein Mobbing-Tagebuch vor Gericht verwertbar?",
      answer:
        "Es ist die Grundlage Ihres Vortrags: Arbeitsgerichte verlangen bei Mobbing-Vorwürfen konkrete, datierte Vorfälle, und genau die liefert das Tagebuch. Zeugen und Belege ersetzt es nicht. Wie es im Einzelfall gewichtet wird, entscheidet das Gericht – lassen Sie sich anwaltlich beraten.",
    },
    {
      question: "Wie lange sollte ich ein Mobbing-Tagebuch führen?",
      answer:
        "So lange, wie die Vorfälle andauern, mindestens aber über mehrere Wochen. Erst über einen längeren Zeitraum wird sichtbar, ob es sich um ein systematisches Muster handelt oder um einzelne Konflikte.",
    },
    {
      question: "Darf ich Gespräche heimlich aufnehmen, um Mobbing zu beweisen?",
      answer:
        "Nein. Das nichtöffentlich gesprochene Wort ohne Einwilligung aufzunehmen ist nach § 201 StGB strafbar. Schreiben Sie stattdessen direkt nach dem Gespräch ein Gedächtnisprotokoll mit Datum, Anwesenden und möglichst wörtlichen Aussagen.",
    },
    {
      question: "Gibt es eine kostenlose Vorlage für ein Mobbing-Tagebuch?",
      answer:
        "Ja. Die Tabelle in diesem Ratgeber können Sie direkt übernehmen: Datum, Was ist passiert, Beteiligte und Zeugen, Folgen, Belege. Digital geht es mit dem kostenlosen Konflikt-Logbuch von medipact, das die Einträge automatisch chronologisch sortiert.",
    },
    {
      question: "Hilft Mediation bei Mobbing?",
      answer:
        "Bei echtem Mobbing mit Machtgefälle meist nicht als erster Schritt – dort geht Schutz vor Kompromiss. Bei festgefahrenen Konflikten zwischen Kolleginnen und Kollegen auf Augenhöhe kann Mediation dagegen sehr wirksam sein.",
    },
  ],
  related: [
    { label: "Zum kostenlosen Konflikt-Logbuch", href: "/konflikt-logbuch" },
    { label: "Konflikt dokumentieren: Streit-Tagebuch führen", href: "/ratgeber/konflikt-dokumentieren" },
    { label: "Mediation am Arbeitsplatz", href: "/ratgeber/mediation-am-arbeitsplatz" },
    { label: "Kündigung ohne Gericht klären", href: "/ratgeber/kuendigung-ohne-gericht" },
    { label: "Konflikt-Journal: Gefühle privat sortieren", href: "/ratgeber/konflikt-journal" },
    { label: "Arbeitsplatz: Mediation im Überblick", href: "/konflikte/arbeitsplatz" },
  ],
};
