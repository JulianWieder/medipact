// app/content/einigungPage.ts
//
// Parent-Seite des /einigung-Clusters.
//
// Warum es diese Seite gibt: /methode trug bis dahin fünf Jobs gleichzeitig
// (Ablauf, Phasen, Harvard, KI-Rollen, Methodenvarianten). Das Argument, das
// den Preis überhaupt erklärt — der Einigungsprozess ist standardisiert, nicht
// pro Termin improvisiert — stand dort nirgends als eigener Gedanke, sondern
// verteilt in Nebensätzen. Auf der Landing wiederum stand viermal "ab 49 €"
// ohne ein einziges Mal das Warum.
//
// Ton: Es wird beschrieben, WAS das System tut (ordnen, versachlichen,
// gewichten, gegenrechnen, festhalten). Das Wort "KI" fällt hier bewusst
// nicht — es steht nur auf /einigung/gleichbehandlung, wo es hingehört
// (Transparenz, Grenzen, Datenschutz). Grund: Wer im Streit steckt, will
// nicht von einem Algorithmus beurteilt werden. Die Intelligenz muss aus dem
// Mechanismus hervorgehen, nicht aus dem Adjektiv — dieselbe Entscheidung
// wie beim Palantir-Umbau der Landing am 25.07.2026.

import { mediationsgesetzFacts } from "@/app/components/ui/DidYouKnowSection";

export const einigungPageContent = {
  eyebrow: "Der Einigungsprozess",
  title: "Einigung ist kein Zufall.",
  titleHighlight: "Sie ist konstruierbar.",
  intro:
    "Eine Mediation kostet Stundensätze, weil jede Sitzung neu aufgebaut wird: Themen sortieren, Forderungen von Interessen trennen, Optionen entwickeln, Ergebnisse festhalten. Bei medipact ist das kein Handwerk pro Termin, sondern ein Prozess, der für jeden Fall gleich läuft. Deshalb steht der Preis fest, bevor der erste Schritt getan ist.",

  primaryCta: {
    label: "Kostenlos starten",
    href: "/auth/register",
  },

  secondaryCta: {
    label: "Was der Prozess nicht kann",
    href: "/einigung/ohne-mediator",
  },

  featuresTitle: "Was der Prozess übernimmt",
  featuresIntro:
    "Nicht als Terminfolge gedacht, sondern als Fähigkeiten: Das ist die Arbeit, die in einer klassischen Mediation in jeder Sitzung von Hand entsteht — und die deshalb nach Stunden bezahlt wird.",

  features: [
    {
      title: "Themen ordnen",
      text: "Aus zwei Schilderungen wird eine gemeinsame Themenliste. Beide Seiten sehen dieselbe Liste, und keine Seite bestimmt allein die Reihenfolge. Der erste Streit einer Mediation ist fast immer der Streit darüber, worüber überhaupt gesprochen wird.",
    },
    {
      title: "Vorwürfe in Anliegen übersetzen",
      text: "Formulierungen werden versachlicht, bevor sie die Gegenseite erreichen. Der Inhalt bleibt vollständig erhalten, der Angriff nicht. Das ist der Unterschied zwischen einem Satz, auf den jemand antwortet, und einem Satz, auf den jemand zurückschießt.",
    },
    {
      title: "Forderungen von Interessen trennen",
      text: "Gezielte Fragen führen vom Was fordere ich? zum Worum geht es mir dabei? Genau an diesem Schritt scheitern Verhandlungen, die niemand moderiert: Zwei Forderungen schließen sich oft aus, zwei Interessen fast nie.",
    },
    {
      title: "Optionen gegenrechnen",
      text: "Bei den strittigen Punkten gewichtet jede Seite für sich, wie wichtig ihr der einzelne Punkt ist. Daraus entsteht ein Vorschlag — nicht aus dem Bauchgefühl eines Dritten und nicht aus Verhandlungsgeschick.",
    },
    {
      title: "Die Vereinbarung mitschreiben",
      text: "Wer macht was bis wann steht am Ende da, weil es unterwegs entstanden ist. Nicht, weil es jemand hinterher gegen Honorar aufsetzt. Beide Seiten bestätigen dasselbe Dokument.",
    },
    {
      title: "Nichts geht verloren",
      text: "Jeder Schritt, jede Zusage und jede Änderung bleibt dokumentiert und für beide Seiten einsehbar. Es gibt kein Das haben Sie damals aber anders gesagt, weil es nachlesbar ist.",
    },
  ],

  deepDive: {
    eyebrow: "Warum das den Preis verändert",
    title: "Wir haben nicht den Termin digitalisiert, sondern die Einigung.",
    intro:
      "Der Unterschied klingt klein und ist der ganze Punkt. Die meisten Online-Angebote verlegen die Sitzung ins Video: gleicher Ablauf, gleicher Aufwand, gleiche Stundenabrechnung, nur ohne Anfahrt. Standardisiert ist daran nichts — der Mediator baut in jeder Sitzung dieselbe Struktur von Hand neu auf. Bei uns ist diese Struktur das Produkt.",
    items: [
      {
        title: "Keine Zeit, die niemandem gehört",
        text: "In einer klassischen Mediation sitzen beide Seiten und der Mediator gleichzeitig am Tisch, und alle drei bezahlen diese Zeit — auch die Minuten, in denen eine Seite nachdenkt oder Unterlagen sucht. Bei uns arbeitet jede Seite dann, wenn es passt. Es gibt keine bezahlte Wartezeit, keinen gemeinsamen Terminkalender und keine Reisekosten.",
      },
      {
        title: "Der Ablauf wird nicht jedes Mal neu verhandelt",
        text: "Ein erhebliches Stück jeder Mediation geht dafür drauf, überhaupt festzulegen, wie man vorgeht: Gesprächsregeln, Reihenfolge, Vertraulichkeit, wer wann was einbringt. Dieser Teil ist zwischen zwei Fällen fast identisch — und steht bei uns schon, bevor jemand den Fall anlegt.",
      },
      {
        title: "Dokumentation entsteht nebenbei",
        text: "Protokoll, Zwischenstände und Abschlussvereinbarung sind in der klassischen Mediation Nacharbeit, die berechnet wird. Hier sind es die Eingaben selbst, nur anders angezeigt. Es gibt nichts abzutippen.",
      },
      {
        title: "Menschliche Arbeit dort, wo sie den Unterschied macht",
        text: "Ein Mediator ist wertvoll, wenn ein Gespräch kippt, wenn eine Seite dauerhaft nachgibt oder wenn eine Lösung juristisch heikel wird. Er ist teuer bezahlte Verschwendung, wenn er Termine koordiniert und Notizen sortiert. Genau diese Trennung macht den Preis.",
      },
    ],
    bulletsTitle: "Was das konkret heißt",
    bullets: [
      "Festpreis statt Stundensatz: Der Betrag steht fest, bevor der erste Schritt getan ist.",
      "Keine Nachberechnung, wenn ein Thema länger dauert als gedacht.",
      "Einstieg ab 49 € pro Partei bei Nachbarschaft und Verbraucherstreit.",
      "Fall anlegen und Konflikt schildern kostet nichts — bezahlt wird erst, wenn es losgeht.",
      "Kein Terminfindungs-Aufwand, keine Anfahrt, keine Raumkosten.",
      "Menschliche Mediation ist zubuchbar, nicht Voraussetzung.",
    ],
    note:
      "Was der Prozess nicht leistet, steht bewusst auf einer eigenen Seite und nicht im Kleingedruckten: Machtungleichgewicht, Drohung oder Gewalt, rechtlich komplexe Konstellationen und Eskalation im laufenden Verfahren gehören in menschliche Hände. Ein Verfahren, das seine eigenen Grenzen nicht benennt, ist kein gutes Verfahren.",
    links: [
      { label: "Wie weit kommt man ohne Mediator?", href: "/einigung/ohne-mediator" },
      { label: "Der gewichtete Abgleich", href: "/einigung/abgleich" },
      { label: "Neutralität, die nicht von Tagesform abhängt", href: "/einigung/gleichbehandlung" },
      { label: "Der Ablauf in sechs Schritten", href: "/methode" },
      { label: "Kostenrechner: Gericht oder Mediation?", href: "/kostenrechner" },
      { label: "Preise und Pakete", href: "/preise" },
    ],
  },

  processTitle: "Der Hebel in drei Sätzen",
  process: [
    {
      title: "Standardisiert, nicht improvisiert",
      text: "Jeder Fall durchläuft dieselben sechs Schritte. Kein Vorgespräch, in dem erst der Ablauf verhandelt wird — die Struktur steht, bevor Sie anfangen. Wie sich diese Schritte zum klassischen Fünf-Phasen-Modell verhalten, steht auf der Ablauf-Seite.",
    },
    {
      title: "Asynchron statt im Stundentakt",
      text: "Beide Seiten arbeiten, wenn es ihnen passt. Kein gemeinsamer Kalender, keine bezahlte Wartezeit, keine Anfahrt. Der Prozess läuft weiter, auch wenn eine Seite gerade nicht kann.",
    },
    {
      title: "Das Ergebnis entsteht mit",
      text: "Antworten, Optionen und Zusagen stehen am Ende als Vereinbarung da, statt nachträglich für Geld ausformuliert zu werden.",
    },
  ],

  trustTitle: "Wofür der Prozess geradesteht",
  trustPoints: [
    {
      title: "Gleiche Schritte für beide",
      text: "Niemand bekommt eine andere Reihenfolge, andere Fragen oder mehr Zeit. Neutralität ist hier keine Haltung, sondern eine Eigenschaft des Ablaufs.",
    },
    {
      title: "Nachvollziehbar statt nachverhandelbar",
      text: "Zustimmungen hängen an den Inhalten, auf die sie sich beziehen. Ändert sich der Inhalt, muss die Zustimmung erneuert werden.",
    },
    {
      title: "Der Rechtsweg bleibt offen",
      text: "Eine Mediation schließt nichts aus. Kommt keine Einigung zustande, steht Ihnen jeder andere Weg weiterhin offen — Sie haben dann einen dokumentierten Einigungsversuch.",
    },
  ],

  didYouKnowFacts: mediationsgesetzFacts,

  faqTitle: "Häufige Fragen zum Einigungsprozess",
  faqs: [
    {
      question: "Ersetzt das einen Mediator?",
      answer:
        "Teilweise, und nicht in jedem Fall. Der Prozess übernimmt die standardisierbare Arbeit: Themen ordnen, versachlichen, Interessen herausarbeiten, Optionen gewichten, die Vereinbarung erzeugen. Wo Urteilsvermögen gefragt ist — Machtungleichgewicht, Eskalation, rechtlich heikle Konstellationen — übernimmt ein Mensch. Welche Grenze wo verläuft, steht ausführlich auf der Seite Wie weit kommt man ohne Mediator?",
    },
    {
      question: "Warum ist das so viel günstiger als eine klassische Mediation?",
      answer:
        "Weil der Aufwand ein anderer ist. Ein Mediator baut in jeder Sitzung dieselbe Struktur neu auf, koordiniert Termine und schreibt hinterher zusammen — alles bezahlte Zeit. Bei uns steht die Struktur schon, beide Seiten arbeiten asynchron, und die Dokumentation entsteht aus den Eingaben selbst. Deshalb Festpreis statt Stundensatz.",
    },
    {
      question: "Was passiert, wenn wir uns nicht einigen?",
      answer:
        "Dann endet das Verfahren ohne Vereinbarung, und der Rechtsweg steht Ihnen unverändert offen. Sie haben in diesem Fall eine dokumentierte Historie des Einigungsversuchs, die in manchen Konstellationen auch für das weitere Vorgehen hilfreich ist.",
    },
    {
      question: "Ist das Ergebnis rechtlich bindend?",
      answer:
        "Die Abschlussvereinbarung ist ein bindender Vertrag zwischen den Beteiligten. Bei rechtlich komplexen Themen — etwa Grundbesitz, Pflichtteil oder Gesellschaftsanteilen — sollte sie zusätzlich anwaltlich oder notariell geprüft werden. Die Mediation ersetzt keine Rechtsberatung.",
    },
    {
      question: "Muss die andere Seite von Anfang an mitmachen?",
      answer:
        "Nein. Sie legen den Fall zuerst allein an und schildern die Situation aus Ihrer Sicht. Die Gegenseite wird erst danach eingeladen — sachlich formuliert und ohne die Vorwürfe, mit denen ein solches Gespräch sonst beginnt.",
    },
    {
      question: "Wie lange dauert ein Verfahren?",
      answer:
        "Das hängt vor allem davon ab, wie schnell beide Seiten ihre Schritte bearbeiten. Weil niemand auf einen gemeinsamen Termin warten muss, ist das Tempo Ihres: Ein Fall kann in wenigen Wochen abgeschlossen sein, wenn beide Seiten zügig arbeiten.",
    },
  ],

  finalCtaTitle: "Sehen Sie sich den Prozess an, bevor Sie ihn bezahlen.",
  finalCtaText:
    "Account anlegen und Fall beschreiben kostet nichts. Sie sehen die Struktur, bevor Sie sich für ein Paket entscheiden.",
  finalCta: {
    label: "Kostenlos starten",
    href: "/auth/register",
  },
};
