// app/content/aboutPage.ts
//
// /about — die Seite, die erklärt, warum es medipact gibt und was es heute ist.
//
// Warum sie neu geschrieben wurde (06.08.2026): Der alte Stand war noch aus
// der Zeit vor dem /einigung-Cluster. Er behauptete Haltung ("Wir lösen
// Konflikte nicht weich, wir lösen sie klar") ohne einen einzigen prüfbaren
// Satz darunter, verlinkte fünfmal auf /kontakt statt auf den Produktweg, und
// kannte drei Konfliktarten, obwohl es längst fünf sind. Ein `perspectivesSection`
// mit Erbe/Nachbarschaft/Trennung stand im Objekt, wurde von
// MarketingPageTemplate aber gar nicht gerendert — toter Inhalt, der beim Lesen
// des Files Vollständigkeit vorspiegelte. Er ist ersatzlos entfernt; die
// Konfliktarten stehen jetzt dort, wo das Template sie auch anzeigt.
//
// Ton wie im /einigung-Cluster: Es wird beschrieben, WAS passiert, mit Zahlen
// und benannten Grenzen. Das Wort "KI" fällt hier bewusst NICHT — es steht
// ausschließlich auf /einigung/gleichbehandlung, wo Transparenz darüber Teil
// des Vertrauens ist. Wer im Streit steckt, will nicht von einem Algorithmus
// beurteilt werden; die Intelligenz muss aus dem Mechanismus hervorgehen.
//
// Alle Preise unten stammen aus backend/app/pricing.py (Stand 10.08.2026) und
// müssen bei einer Preisänderung dort UND hier nachgezogen werden:
//   nachbarschaft/verbraucher 49 € per_party · trennung 399 € per_party
//   (Hybrid 499 €, Vollservice 899 € — nur trennung) · erbschaft 399 € once
//   · ODR-Familie gestaffelt: odr 1.900 €, b2b 1.200 €, schlichtung und
//   ecommerce je 399 € (alle once) · Add-ons 79/49/29 € · Logbuch-Premium
//   14,95 €.

import { mediationsgesetzFacts } from "@/app/components/ui/DidYouKnowSection";

export const aboutPageContent = {
  eyebrow: "Über medipact",
  title: "Eine Klärung sollte nicht daran scheitern,",
  titleHighlight: "dass sie zu teuer ist.",
  intro:
    "Die meisten Konflikte, die Menschen jahrelang mit sich herumtragen, sind für einen Anwalt zu klein und für den Küchentisch zu groß. Mediation wäre der richtige Weg — sie kostet aber Stundensätze, weil jede Sitzung von Hand neu aufgebaut wird. medipact ist der Versuch, genau diese Arbeit zu standardisieren: derselbe Ablauf für jeden Fall, dafür ein Preis, der vorher feststeht.",

  primaryCta: {
    label: "Kostenlos starten",
    href: "/auth/register",
  },

  secondaryCta: {
    label: "Warum das zum Festpreis geht",
    href: "/einigung",
  },

  featuresTitle: "Sechs Entscheidungen, die medipact prägen",
  featuresIntro:
    "Keine davon ist ein Versprechen, das jemand einhalten muss. Es sind Eigenschaften des Verfahrens — sie gelten auch dann, wenn niemand hinschaut.",

  features: [
    {
      title: "Der Preis steht vor dem ersten Schritt",
      text: "Festpreis statt Stundensatz, keine Nachberechnung, wenn ein Thema länger dauert als gedacht. Das ist keine Rabattaktion, sondern eine Folge davon, wie der Prozess gebaut ist: Was in jedem Fall gleich läuft, muss nicht in jedem Fall neu bezahlt werden.",
    },
    {
      title: "Kein Sieger, kein Verlierer",
      text: "Der Maßstab ist nicht, wer recht hat, sondern ob eine Vereinbarung hält. Wer nach einem Erbstreit noch Geschwister bleiben will oder nach einer Trennung noch gemeinsam Eltern ist, braucht kein Urteil, sondern eine Lösung, mit der beide weiterleben können.",
    },
    {
      title: "Gleiche Schritte für beide Seiten",
      text: "Niemand bekommt eine andere Reihenfolge, andere Fragen oder mehr Zeit. Wer den Fall angelegt hat, hat im Verfahren keinen Vorsprung. Neutralität ist hier keine Haltung, die gelingen muss, sondern eine Eigenschaft des Ablaufs.",
    },
    {
      title: "Vertraulich bis auf Feldebene",
      text: "Bei jedem Eingabefeld steht, ob es geteilt wird. Private Notizen erreichen die Gegenseite nicht — auch nicht in zusammengefasster Form. Ohne einen Ort für unfertige Gedanken schreibt niemand ehrlich, und ohne Ehrlichkeit gibt es nichts zu klären.",
    },
    {
      title: "Wir benennen, was wir nicht können",
      text: "Machtungleichgewicht, Drohung oder Gewalt, rechtlich komplexe Konstellationen und Eskalation im laufenden Verfahren gehören in menschliche Hände. Diese Grenzen stehen auf einer eigenen Seite und nicht im Kleingedruckten — ein Verfahren, das seine Grenzen verschweigt, ist kein gutes Verfahren.",
    },
    {
      title: "Der Rechtsweg bleibt offen",
      text: "Eine Mediation schließt nichts aus und ersetzt nichts, was ein Gericht tun muss: Eine Scheidung bleibt ein gerichtliches Verfahren. Kommt keine Einigung zustande, steht Ihnen jeder andere Weg unverändert offen — dann mit einem dokumentierten Einigungsversuch in der Hand.",
    },
  ],

  deepDive: {
    eyebrow: "Der Stand heute",
    title: "Was medipact inzwischen ist",
    intro:
      "Angefangen hat es mit einem Ablauf für private Trennungskonflikte. Heute reicht die Plattform vom kostenlosen Mitschreiben eines Streits bis zur Streitbeilegung im Volumen für Unternehmen — mit demselben Verfahren dahinter, weil Konflikte am Küchentisch und im Konferenzraum denselben Mustern folgen.",
    items: [
      {
        title: "Fünf Konfliktarten",
        text: "Trennung und Scheidung, Nachbarschaft, Verbraucher- und Handwerkerstreit, Erbe und Familie, Unternehmen und ODR. Jede Art hat eigene Einstiegsfragen und eigene Themenlisten, weil ein Zaunstreit und eine Vermögensaufteilung nicht dieselben ersten Fragen brauchen.",
      },
      {
        title: "Das Konflikt-Logbuch — kostenlos",
        text: "Wer noch nicht bereit für eine Mediation ist, dokumentiert erst einmal: Vorkommnisse, Gespräche, Nachrichten und Telefonate mit Datum und Belegen. Die Gegenseite sieht davon nichts; geteilt wird später nur, was Sie ausdrücklich freigeben. Es gibt Konflikte, in denen die eigene Chronologie schon der ganze nötige Schritt ist.",
      },
      {
        title: "Der Einigungsprozess in sechs Schritten",
        text: "Themen ordnen, Vorwürfe in Anliegen übersetzen, Forderungen von Interessen trennen, Optionen entwickeln, gegenrechnen, Vereinbarung festhalten. Beide Seiten arbeiten asynchron — kein gemeinsamer Kalender, keine bezahlte Wartezeit, keine Anfahrt.",
      },
      {
        title: "Der gewichtete Abgleich",
        text: "Bei strittigen Punkten gewichtet jede Seite für sich, wie wichtig ihr der einzelne Punkt ist. Der Vorschlag entsteht aus diesen Gewichtungen — nicht aus dem Bauchgefühl eines Dritten und nicht aus Verhandlungsgeschick. Wer den Punkt lauter vertritt, gewinnt ihn dadurch nicht.",
      },
      {
        title: "Menschliche Mediation, wenn sie gebraucht wird",
        text: "Bei den Einstiegstarifen sind eine moderierte Videositzung, eine geprüfte Abschlussvereinbarung und Express-Bearbeitung einzeln zubuchbar statt Voraussetzung. Bei Trennungen gibt es stattdessen die durchgehend begleiteten Pakete Hybrid und Vollservice.",
      },
      {
        title: "Der Prozesskostenrechner",
        text: "Was ein Gerichtsverfahren bei Ihrem Streitwert nach GKG und RVG realistisch kostet, gegen den Festpreis gestellt — inklusive Sorge- und Umgangsverfahren, bei denen der Verfahrenswert gedeckelt ist, die Kosten aber nicht. Ohne Anmeldung und ohne Kontaktformular.",
      },
    ],
    bulletsTitle: "Was das kostet",
    bullets: [
      "Nachbarschaft sowie Verbraucher- und Handwerkerstreit: 49 € pro Partei.",
      "Trennung und Scheidung: 399 € pro Partei, mit Begleitung 499 € (Hybrid) oder 899 € (Vollservice).",
      "Erbstreit: 399 € einmalig für den Fall, nicht pro Kopf.",
      "Unternehmenskonflikte: 1.900 € bei Gesellschaftern, Nachfolge und Team, 1.200 € beim B2B-Vertragsstreit, 399 € bei Schlichtung und E-Commerce — jeweils einmalig für den Fall.",
      "Zu den Einstiegstarifen zubuchbar: Videositzung 79 €, geprüfte Abschlussvereinbarung 49 €, Express-Bearbeitung 29 €.",
      "Konflikt-Logbuch: kostenlos, Premium-Funktionen 14,95 €.",
      "Fall anlegen und Situation schildern kostet nichts — bezahlt wird erst, wenn das Verfahren startet.",
    ],
    note:
      "medipact ist keine Rechtsberatung und ersetzt keine. Bei rechtlich komplexen Themen — Grundbesitz, Pflichtteil, Gesellschaftsanteilen — sollte eine Vereinbarung zusätzlich anwaltlich oder notariell geprüft werden. Wo das Verfahren an seine Grenze kommt, steht ausdrücklich auf einer eigenen Seite.",
    links: [
      { label: "Der Einigungsprozess", href: "/einigung" },
      { label: "Wie weit kommt man ohne Mediator?", href: "/einigung/ohne-mediator" },
      { label: "Neutralität, Daten und Technik", href: "/einigung/gleichbehandlung" },
      { label: "Der Ablauf in sechs Schritten", href: "/methode" },
      { label: "Preise und Pakete", href: "/preise" },
      { label: "Kostenrechner: Gericht oder Mediation?", href: "/kostenrechner" },
    ],
  },

  processTitle: "Vom ersten Eintrag bis zur Vereinbarung",
  process: [
    {
      title: "Mitschreiben, solange nichts entschieden ist",
      text: "Im kostenlosen Konflikt-Logbuch halten Sie fest, was vorfällt — ohne dass die andere Seite davon erfährt und ohne sich auf irgendetwas festzulegen. Viele Konflikte werden dadurch überhaupt erst greifbar: Aus diffusem Dauerärger werden belegbare Punkte.",
    },
    {
      title: "Fall anlegen und die Gegenseite einladen",
      text: "Sie schildern die Situation zuerst allein. Die Einladung an die andere Seite ist sachlich formuliert und enthält die Vorwürfe nicht, mit denen ein solches Gespräch sonst beginnt. Bis hierhin kostet nichts.",
    },
    {
      title: "Geführt austauschen statt frei streiten",
      text: "Beide Seiten gehen dieselben Schritte, jeweils dann, wenn es passt. Antworten und Gewichtungen werden erst gegenübergestellt, wenn beide geliefert haben — niemand kann sich an der anderen Seite ausrichten.",
    },
    {
      title: "Die Vereinbarung entsteht unterwegs",
      text: "Wer macht was bis wann steht am Ende da, weil es während des Verfahrens entstanden ist, und nicht weil es jemand hinterher gegen Honorar aufsetzt. Beide Seiten bestätigen dasselbe Dokument.",
    },
  ],

  comparisonTitle: "Der bessere erste Schritt vor der Eskalation",
  comparisonIntro:
    "medipact ist kein Kampfmodus und keine Rechtsdurchsetzung. Es ist der Weg, der offen bleibt, solange beide Seiten noch etwas voneinander wollen.",
  comparisonPlans: [
    {
      title: "medipact",
      status: "Festpreis, ab 49 €",
      features: [
        "Preis steht vor dem Start fest",
        "beide Seiten arbeiten asynchron",
        "Ergebnis wird gemeinsam beschlossen",
        "Vereinbarung entsteht im Verfahren",
        "menschlicher Mediator zubuchbar",
        "Rechtsweg bleibt offen",
      ],
      featured: true,
    },
    {
      title: "Anwaltlicher Streit",
      status: "Positionsgetrieben",
      features: [
        "Kommunikation läuft über Dritte",
        "Kosten hängen am Streitwert",
        "Verhandlung um Positionen, nicht Interessen",
        "richtig und nötig bei klaren Rechtsfragen",
      ],
    },
    {
      title: "Gerichtsverfahren",
      status: "Fremdbestimmt",
      features: [
        "ein Richter entscheidet, nicht Sie",
        "dauert in der Regel Monate bis Jahre",
        "belastet die Beziehung zusätzlich",
        "unverzichtbar, wenn keine Einigung möglich ist",
      ],
    },
  ],

  trustTitle: "Warum Sie das nachprüfen können, statt es zu glauben",
  trustPoints: [
    {
      title: "Nachlesbar statt nachverhandelbar",
      text: "Jeder Schritt, jede Zusage und jede Änderung ist dokumentiert und für beide Seiten einsehbar. Zustimmungen hängen an den Inhalten, auf die sie sich beziehen: Ändert sich der Inhalt, verfällt die Zustimmung.",
    },
    {
      title: "Offen darüber, was die Technik tut",
      text: "Wo Software Formulierungen versachlicht, Themen sortiert oder Optionen vorschlägt, steht das auf einer eigenen Seite — mit den Stellen, an denen ausdrücklich nichts automatisch entschieden wird. Verbindlich wird nur, wozu beide Seiten zugestimmt haben.",
    },
    {
      title: "Sie behalten die Entscheidung",
      text: "medipact entscheidet nicht über Sie. Die Plattform strukturiert den Weg zu einer Lösung; ob und was vereinbart wird, bestimmen ausschließlich die Beteiligten — im Zweifel mit anwaltlicher Prüfung.",
    },
  ],

  didYouKnowFacts: mediationsgesetzFacts,

  faqTitle: "Häufige Fragen zu medipact",
  faqs: [
    {
      question: "Was ist medipact genau?",
      answer:
        "Eine Plattform für strukturierte Online-Mediation. Beide Seiten gehen denselben Ablauf in sechs Schritten durch — jeweils dann, wenn es ihnen passt —, und am Ende steht eine Vereinbarung, die während des Verfahrens entstanden ist. Menschliche Mediation ist zubuchbar, nicht Voraussetzung.",
    },
    {
      question: "Ersetzt das einen Mediator?",
      answer:
        "Teilweise, und nicht in jedem Fall. Der Prozess übernimmt die standardisierbare Arbeit: Themen ordnen, versachlichen, Interessen herausarbeiten, Optionen gewichten, die Vereinbarung erzeugen. Wo Urteilsvermögen gefragt ist — Machtungleichgewicht, Eskalation, rechtlich heikle Konstellationen — übernimmt ein Mensch. Wo diese Grenze genau verläuft, steht auf der Seite „Wie weit kommt man ohne Mediator?“.",
    },
    {
      question: "Ist medipact eine Rechtsberatung?",
      answer:
        "Nein, und es soll auch keine sein. Es gibt keine Einschätzung der Rechtslage, keine Erfolgsprognose und kein Urteil darüber, welche Seite angemessener argumentiert. Eine Mediation klärt, worauf Sie sich einigen können — nicht, wer vor Gericht gewinnen würde.",
    },
    {
      question: "Ist das Ergebnis rechtlich bindend?",
      answer:
        "Die Abschlussvereinbarung ist ein bindender Vertrag zwischen den Beteiligten. Bei rechtlich komplexen Themen — etwa Grundbesitz, Pflichtteil oder Gesellschaftsanteilen — sollte sie zusätzlich anwaltlich oder notariell geprüft werden. Eine Scheidung selbst bleibt in jedem Fall ein gerichtliches Verfahren.",
    },
    {
      question: "Wofür ist medipact nicht geeignet?",
      answer:
        "Für Fälle mit Drohung, Gewalt oder Angst, für ausgeprägtes Machtungleichgewicht zwischen den Beteiligten, für rechtlich komplexe Konstellationen ohne anwaltliche Begleitung und für Konflikte, in denen eine Seite gar nicht verhandeln will. Ein strukturierter Ablauf hilft in diesen Situationen nicht — dort braucht es Menschen, im Zweifel auch ein Gericht.",
    },
    {
      question: "Wer steckt hinter medipact?",
      answer:
        "medipact wurde von Julian Wieder gegründet. Die verantwortliche Stelle, vollständige Anbieterangaben und die Kontaktdaten stehen im Impressum, die Details zur Datenverarbeitung in der Datenschutzerklärung.",
    },
    {
      question: "Was passiert mit meinen Daten?",
      answer:
        "Die Verarbeitung erfolgt DSGVO-konform und verschlüsselt; Ihre Inhalte werden nicht zum Training öffentlicher Modelle verwendet. Was im Einzelnen verarbeitet und wie lange gespeichert wird, steht vollständig in der Datenschutzerklärung — nicht nur zusammengefasst.",
    },
    {
      question: "Gibt es medipact auch für Unternehmen?",
      answer:
        "Ja. Neben Einzelfällen — Gesellschafterstreit, Teamkonflikte, B2B-Vertragsstreit — gibt es Online Dispute Resolution im Firmen-Abo für Unternehmen, die viele gleichartige Kundenkonflikte in einem System klären wollen.",
    },
  ],

  relatedCases: [
    { label: "Fallbeispiele lesen", href: "/cases" },
    { label: "Konfliktarten im Überblick", href: "/konflikte" },
    { label: "Ratgeber", href: "/ratgeber" },
    { label: "Für Unternehmen und ODR", href: "/konflikte/odr" },
    { label: "Impressum", href: "/impressum" },
  ],

  finalCtaTitle: "Sehen Sie sich das Verfahren an, bevor Sie es bezahlen.",
  finalCtaText:
    "Account anlegen und den Konflikt schildern kostet nichts. Sie sehen die Struktur, bevor Sie sich für ein Paket entscheiden — und wenn es dabei bleibt, dass Sie nur mitschreiben wollen, ist das auch ein Ergebnis.",
  finalCta: {
    label: "Fragen? Zum Kontakt",
    href: "/kontakt",
  },
};
