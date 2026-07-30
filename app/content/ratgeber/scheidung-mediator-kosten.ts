// Ziel-Suchbegriff: "scheidung mediator kosten" (und Varianten wie
// "mediation scheidung kosten", "was kostet ein mediator bei scheidung").
//
// Bewusst als eigener Artikel getrennt vom allgemeinen /ratgeber/mediation-
// kosten: Der Trennungs-/Scheidungs-Cluster soll ein eigenes, sauberes
// Themensignal bekommen und nicht mit dem B2B-/Wirtschaftsmediations-Cluster
// vermischt werden. Preise stammen aus backend/app/pricing.py
// (trennung: online 399 €, hybrid 499 €, vollservice 899 € – je Partei) und
// müssen bei Preisänderungen hier UND auf /preise nachgezogen werden.
//
// Rechtliche Angaben (Gerichts-/Anwaltskosten, Verfahrenskostenhilfe) sind
// bewusst ohne konkrete Eurobeträge formuliert: Sie hängen am Verfahrenswert
// und ändern sich mit dem RVG/FamGKG. Vor Veröffentlichung gegenlesen.
//
// ACHTUNG Erfolgsquote: Die Angabe "rund 80 Prozent" (Abschnitt
// "Wie gut sind die Erfolgsaussichten?" + gleichnamige FAQ) stammt aus
// Sekundärquellen, die sich auf Erhebungen des Bundesverbands Mediation e.V.
// bzw. der BAFM berufen. Vor Veröffentlichung an der Primärquelle prüfen –
// oder den Satz streichen. Die Begründung darunter (Freiwilligkeit,
// Selbstauswahl, Haltbarkeit eigener Lösungen) trägt den Abschnitt auch
// ohne Prozentzahl.

import type { RatgeberArticle } from "./types";

export const article: RatgeberArticle = {
  slug: "scheidung-mediator-kosten",
  category: "Trennung & Scheidung",
  title: "Scheidung mit Mediator: Was kostet das?",
  metaTitle: "Scheidung Mediator Kosten: Preise im Überblick | medipact",
  description:
    "Was kostet ein Mediator bei der Scheidung? Preismodelle, wer zahlt, Vergleich zum Anwalt – und warum Online-Mediation ab 399 € pro Partei so oft gelingt.",
  eyebrow: "Ratgeber · Trennung & Scheidung",
  updated: "2026-07-27",
  readingMinutes: 10,
  intro:
    "Eine Scheidung mit Mediator kostet in der Regel deutlich weniger als zwei Anwälte plus Gerichtsverfahren – vor allem, weil weniger gestritten und schneller entschieden wird. Online geführt wird sie noch einmal deutlich günstiger, ohne dass inhaltlich weniger geklärt wird. Dieser Artikel zeigt, welche Preismodelle üblich sind, womit Sie insgesamt rechnen müssen, wer bezahlt, wie gut die Erfolgsaussichten stehen und wann sich Mediation nicht mehr lohnt.",
  blocks: [
    {
      type: "heading",
      text: "Was kostet ein Mediator bei einer Scheidung?",
    },
    {
      type: "paragraph",
      text: "Mediatorinnen und Mediatoren rechnen bei Trennung und Scheidung meist nach Stundensatz ab. Die Höhe hängt von Qualifikation, Region und Komplexität ab – in Großstädten liegt sie spürbar über dem Niveau ländlicher Regionen. Bezahlt wird die gemeinsame Sitzung, nicht jede Partei einzeln: Anders als beim Anwalt teilen sich die beiden Seiten in der Regel eine Rechnung.",
    },
    {
      type: "paragraph",
      text: "Neben dem Stundensatz gibt es zwei weitere Modelle. Bei der Pauschale zahlen Sie einen festen Preis für das gesamte Verfahren – das macht die Kosten planbar und nimmt den Druck, in jeder Sitzung auf die Uhr zu schauen. Bei der Online-Mediation entfallen Raum- und Anfahrtskosten, weshalb sie meist am günstigsten ist.",
    },
    {
      type: "list",
      items: [
        "Stundensatz: Abrechnung nach tatsächlichem Zeitaufwand, meist geteilt durch beide Parteien.",
        "Pauschale: Fester Preis für das komplette Verfahren – kalkulierbar, keine Überraschungen.",
        "Online-Mediation: Günstigste Variante, weil Anfahrt, Raum und Terminkoordination wegfallen.",
        "Zusatzkosten: Notar bei Beurkundung, Gutachten bei Immobilienbewertung, anwaltliche Prüfung der Vereinbarung.",
      ],
    },
    {
      type: "heading",
      text: "Womit muss man insgesamt rechnen?",
    },
    {
      type: "paragraph",
      text: "Die Gesamtkosten ergeben sich aus Preismodell mal Umfang. Entscheidend ist, wie viele Streitpunkte offen sind: Geht es nur um die Aufteilung des Hausrats, ist eine Mediation oft in wenigen Sitzungen erledigt. Kommen Kinder, eine gemeinsame Immobilie, Unterhalt und Altersvorsorge zusammen, braucht es mehr Zeit – und die Kosten steigen entsprechend.",
    },
    {
      type: "paragraph",
      text: "Bei medipact läuft die Trennungs- und Scheidungsmediation als geführter Online-Prozess zum Pauschalpreis: 399 € pro Partei im reinen Online-Verfahren, 499 € pro Partei in der Hybrid-Variante mit Video-Terminen und 899 € pro Partei im Vollservice mit persönlicher Begleitung. Der Preis ist unabhängig davon, wie viele Themen Sie klären – es gibt keine Stundenabrechnung, die mit jeder Eskalation teurer wird.",
    },
    {
      type: "callout",
      text: "Faustregel: Klären Sie vor dem Start drei Dinge schriftlich – wie abgerechnet wird, ob das Erstgespräch kostenlos ist und ob es eine Obergrenze gibt. Seriöse Anbieter beantworten das ohne Zögern.",
    },
    {
      type: "heading",
      text: "Warum Online-Mediation bei der Scheidung so viel günstiger ist",
    },
    {
      type: "paragraph",
      text: "Der Preisunterschied zur klassischen Präsenzmediation entsteht nicht dadurch, dass online weniger gearbeitet wird – sondern dadurch, dass die teuersten Bestandteile eines Verfahrens wegfallen. Kein Besprechungsraum, keine Anfahrt, vor allem aber kein Terminfindungs-Marathon: Bei einer Präsenzmediation müssen zwei zerstrittene Menschen und eine Mediatorin regelmäßig denselben Werktagvormittag freischaufeln. Genau dieser Aufwand macht Verfahren lang und damit teuer.",
    },
    {
      type: "paragraph",
      text: "Bei medipact läuft der Prozess deshalb asynchron: Jede Seite bearbeitet die strukturierte Fallaufnahme im eigenen Tempo – abends, am Wochenende, in Ruhe. Die Struktur, die sonst die Mediatorin in der Sitzung herstellen müsste, steckt im geführten Verfahren selbst. Das spart Sitzungsstunden, ohne dass Inhalte verloren gehen, und macht eine Pauschale von 399 € pro Partei überhaupt erst möglich.",
    },
    {
      type: "heading",
      text: "Was Online-Mediation bei einer Trennung zusätzlich leistet",
    },
    {
      type: "paragraph",
      text: "Der Kostenvorteil ist nur die eine Seite. Für Trennungssituationen hat das Online-Format auch inhaltliche Vorteile, die eine Präsenzsitzung so nicht bietet:",
    },
    {
      type: "list",
      items: [
        "Kein gemeinsamer Raum nötig: Sie müssen sich nicht gegenübersitzen, solange das noch nicht geht. Das senkt die Hemmschwelle, überhaupt anzufangen.",
        "Schriftlichkeit entschärft: Wer seine Sicht aufschreibt statt sie im Affekt zu sagen, formuliert überlegter. Sätze, die man später bereut, entstehen seltener.",
        "Ortsunabhängig: Ist eine Person bereits weggezogen oder arbeitet im Ausland, ändert das am Verfahren nichts.",
        "Kompatibel mit Kinderbetreuung und Schichtdienst: Sie brauchen keinen freien Vormittag, sondern eine ruhige halbe Stunde.",
        "Alles ist dokumentiert: Zahlen, Vorschläge und Zwischenstände stehen nachlesbar an einem Ort statt in Erinnerungsfetzen aus drei Sitzungen.",
        "Tempo: Ohne Terminabsprachen entsteht die Vereinbarung oft in Tagen bis wenigen Wochen – nicht über Monate verteilt.",
      ],
    },
    {
      type: "callout",
      text: "Online heißt nicht anonym: Es gibt weiterhin eine feste Mediatorin oder einen festen Mediator, die den Prozess führen und bei Bedarf Video-Termine ansetzen. Die Hybrid-Variante (499 € pro Partei) kombiniert den Online-Prozess bewusst mit gemeinsamen Video-Sitzungen.",
    },
    {
      type: "heading",
      text: "Wie gut sind die Erfolgsaussichten?",
    },
    {
      type: "paragraph",
      // TODO(Julian): Zahl vor Veröffentlichung an der Primärquelle prüfen
      // (Bundesverband Mediation e.V. / BAFM). Sie kursiert vor allem über
      // Sekundärquellen. Im Zweifel den Satz streichen – die folgende
      // Begründung trägt den Abschnitt auch ohne Prozentangabe.
      text: "Mediation hat einen Ruf, der nicht recht zu ihrem Preis passt: Erhebungen von Mediationsverbänden berichten für Familien- und Scheidungsmediation regelmäßig Einigungsquoten im Bereich von rund 80 Prozent. Das klingt hoch – hat aber nachvollziehbare Gründe und gilt unter einer klaren Bedingung: Beide Seiten müssen sich freiwillig darauf einlassen.",
    },
    {
      type: "list",
      items: [
        "Selbstauswahl: Wer sich für eine Mediation entscheidet, will bereits eine Lösung statt eines Urteils. Diese Grundhaltung entscheidet mehr als jede Methode.",
        "Eigene Lösungen halten besser: Eine Regelung, die beide selbst entwickelt haben, wird seltener nachverhandelt oder gerichtlich angegriffen als eine, die jemand von außen verfügt hat.",
        "Kein Alles-oder-nichts: Vor Gericht gewinnt eine Seite Punkt für Punkt. In der Mediation lassen sich Pakete schnüren – wer beim Hausrat nachgibt, bekommt bei der Ferienregelung etwas zurück.",
        "Auch Teilerfolge zählen: Selbst wenn nicht alles geklärt wird, bleibt der Rest kleiner, günstiger und weniger eskaliert für das Gerichtsverfahren übrig.",
      ],
    },
    {
      type: "paragraph",
      text: "Genau darin liegt der eigentliche Punkt: Sie setzen einen überschaubaren Pauschalbetrag ein, um eine realistische Chance auf eine vollständige Einigung zu bekommen – und selbst im ungünstigen Fall ist der Betrag klein im Verhältnis zu dem, was eine streitige Auseinandersetzung über mehrere Punkte kostet. Das Risiko-Ertrags-Verhältnis ist ungewöhnlich günstig, und es ist von vornherein bekannt: Sie wissen vor dem Start, was Sie maximal zahlen.",
    },
    {
      type: "heading",
      text: "Scheidung mit Mediator oder mit Anwalt – was ist günstiger?",
    },
    {
      type: "paragraph",
      text: "Der zentrale Kostenunterschied liegt nicht im Stundensatz, sondern in der Struktur. Anwalts- und Gerichtskosten richten sich nach dem Verfahrenswert, der sich vor allem aus Einkommen und Vermögen beider Ehepartner ergibt. Je mehr Streitpunkte Sie zusätzlich gerichtlich klären lassen (Unterhalt, Zugewinn, Sorge- und Umgangsrecht), desto höher der Wert – und desto teurer wird das Verfahren. Die Kosten wachsen also mit dem Streit.",
    },
    {
      type: "paragraph",
      text: "In der Mediation ist es umgekehrt: Sie erarbeiten eine gemeinsame Regelung, die anschließend als Scheidungsfolgenvereinbarung notariell beurkundet werden kann. Vor Gericht bleibt dann meist nur die Scheidung selbst zu vollziehen – ein deutlich schlankeres Verfahren als ein streitiges. Hinzu kommt: Eine Mediation dauert in der Regel Wochen, ein streitiges Scheidungsverfahren über mehrere Punkte kann sich über Jahre ziehen.",
    },
    {
      type: "list",
      items: [
        "Anwalt und Gericht: Kosten richten sich nach dem Verfahrenswert und steigen mit jedem zusätzlichen Streitpunkt.",
        "Zwei Anwälte: Bei einer streitigen Scheidung braucht in der Regel jede Seite eigene Vertretung – die Kosten fallen doppelt an.",
        "Mediation: Ein Verfahren, geteilte oder pauschale Kosten, planbarer Rahmen.",
        "Notar: Für die Beurkundung der Scheidungsfolgenvereinbarung fallen separate Gebühren an – auch sie richten sich nach dem Gegenstandswert.",
      ],
    },
    {
      type: "table",
      caption:
        "Scheidungsmediation und streitiges Gerichtsverfahren im Vergleich: Kostenlogik, Dauer, Öffentlichkeit und Verbindlichkeit",
      headers: ["Merkmal", "Mediation", "Streitiges Verfahren"],
      rows: [
        [
          "Kostenlogik",
          "Pauschale oder Stundensatz – bei medipact 399 € pro Partei, vorab bekannt",
          "Abhängig vom Verfahrenswert; steigt mit jedem zusätzlichen Streitpunkt",
        ],
        [
          "Anzahl der Verfahren",
          "Ein Verfahren für beide Seiten",
          "In der Regel eigene anwaltliche Vertretung je Seite",
        ],
        [
          "Dauer",
          "Tage bis wenige Wochen, weil asynchron und ohne Terminfindung",
          "Monate bis Jahre, je nach Streitpunkten und Instanzen",
        ],
        [
          "Wer entscheidet",
          "Die Beteiligten selbst, begleitet von einer neutralen Person",
          "Das Familiengericht",
        ],
        [
          "Öffentlichkeit",
          "Vertraulich, Verschwiegenheitspflicht nach § 4 MediationsG",
          "Gerichtsverfahren mit Akte, Zeugen und Terminen",
        ],
        [
          "Ergebnis",
          "Vereinbarung, notariell beurkundbar oder als Anwaltsvergleich vollstreckbar",
          "Gerichtliche Entscheidung, anfechtbar über Rechtsmittel",
        ],
        [
          "Haltbarkeit",
          "Selbst entwickelte Regelungen werden seltener nachverhandelt",
          "Häufiger Abänderungsanträge, besonders bei Unterhalt und Umgang",
        ],
      ],
    },
    {
      type: "callout",
      text: "Wichtig: Mediation ersetzt keine Rechtsberatung. Die Mediatorin ist allparteilich und berät keine Seite einseitig. Lassen Sie die Vereinbarung vor der Unterschrift anwaltlich prüfen – das ist überschaubar teuer und verhindert spätere Streitigkeiten.",
    },
    {
      type: "heading",
      text: "Checkliste: Welche Unterlagen brauche ich für die Mediation?",
    },
    {
      type: "paragraph",
      text: "Je vollständiger die Zahlen zu Beginn vorliegen, desto kürzer – und damit günstiger – wird das Verfahren. Ein großer Teil der Zeit geht sonst dafür drauf, fehlende Belege nachzureichen. Sammeln Sie deshalb vorab:",
    },
    {
      type: "list",
      items: [
        "Einkommen: Gehaltsabrechnungen der letzten zwölf Monate, bei Selbstständigkeit die letzten Steuerbescheide und die aktuelle BWA.",
        "Steuer: Steuerbescheide beider Seiten, aktuelle Steuerklassen.",
        "Immobilien: Grundbuchauszug, Kaufvertrag, aktueller Darlehensstand, falls vorhanden eine Wertermittlung.",
        "Konten und Vermögen: Kontostände zum Trennungszeitpunkt, Depots, Bausparverträge, Lebensversicherungen.",
        "Schulden: Kreditverträge, Restsalden, wer Darlehensnehmer ist.",
        "Altersvorsorge: Renteninformationen beider Seiten, betriebliche Altersvorsorge, private Verträge.",
        "Kinder: Betreuungszeiten im Ist-Zustand, Kita- und Schulkosten, laufende Sonderausgaben.",
        "Laufende Kosten: Miete oder Wohnkosten beider Haushalte, Versicherungen, Unterhaltszahlungen an Dritte.",
      ],
    },
    {
      type: "callout",
      text: "Vollständigkeit ist keine Formalie, sondern Vertrauensgrundlage: Sobald eine Seite den Eindruck bekommt, dass Zahlen zurückgehalten werden, ist die Mediation faktisch beendet. Legen Sie lieber zu viel offen als zu wenig.",
    },
    {
      type: "heading",
      text: "Wer trägt die Kosten der Scheidungsmediation?",
    },
    {
      type: "paragraph",
      text: "Üblich ist die hälftige Teilung. Das ist nicht nur fair, es hat auch einen inhaltlichen Grund: Wer bezahlt, hat das Gefühl, Anspruch auf ein bestimmtes Ergebnis zu haben – bei geteilten Kosten fällt dieser Hebel weg. Möglich sind aber auch andere Verteilungen, etwa nach Einkommensverhältnis, wenn ein Partner deutlich mehr verdient. Wichtig ist nur, dass die Regelung vorab feststeht und schriftlich festgehalten wird.",
    },
    {
      type: "paragraph",
      text: "Bei medipact zahlt jede Partei ihren eigenen Anteil direkt – jede Seite bekommt eine eigene Rechnung. Damit entfällt die unangenehme Situation, dass eine Person auslegt und später beim Ex-Partner Geld eintreiben muss.",
    },
    {
      type: "heading",
      text: "Gibt es finanzielle Unterstützung?",
    },
    {
      type: "paragraph",
      text: "Für das gerichtliche Scheidungsverfahren gibt es bei geringem Einkommen Verfahrenskostenhilfe. Für eine private Mediation greift sie grundsätzlich nicht; in einigen Bundesländern und Kommunen existieren jedoch geförderte Beratungs- und Mediationsangebote, teils über Familienberatungsstellen. Ein Blick auf die Seite Ihres Jugendamts oder Ihrer Kommune lohnt sich. Manche Rechtsschutzversicherungen beteiligen sich zudem an Mediationskosten – prüfen Sie Ihre Police, bevor Sie starten.",
    },
    {
      type: "heading",
      text: "Wann lohnt sich Mediation bei der Scheidung nicht?",
    },
    {
      type: "paragraph",
      text: "Mediation ist kein Sparmodell für jede Situation. Sie braucht zwei Seiten, die grundsätzlich gesprächsbereit sind und offen über Finanzen sprechen. Wo Gewalt, massive Angst oder ein starkes Machtgefälle im Raum stehen, ist ein geschützter rechtlicher Rahmen der richtige Weg – nicht ein gemeinsamer Verhandlungstisch. Auch wenn eine Seite Vermögen verschweigt oder das Verfahren nur zum Zeitgewinn nutzt, ist das investierte Geld verloren.",
    },
    {
      type: "list",
      items: [
        "Gewalt, Drohung oder Stalking sind Teil der Beziehungsgeschichte.",
        "Eine Seite hat Angst, offen zu sprechen oder Forderungen zu stellen.",
        "Es besteht der begründete Verdacht, dass Vermögen verschwiegen wird.",
        "Eine Seite will die Mediation erkennbar nur zur Verzögerung nutzen.",
      ],
    },
    {
      type: "paragraph",
      text: "In allen anderen Fällen gilt: Je früher Sie beginnen, desto günstiger wird es. Kosten entstehen in der Trennung vor allem durch Eskalation – jede zusätzliche Runde Anwaltsschriftsätze kostet Geld, das am Ende beiden Seiten fehlt.",
    },
    {
      type: "cta",
      text: "Trennung strukturiert klären – Online-Mediation ab 399 € pro Partei",
      href: "/konflikte/trennung",
    },
  ],
  faq: [
    {
      question: "Wie hoch sind die Erfolgsaussichten einer Scheidungsmediation?",
      answer:
        "Erhebungen von Mediationsverbänden berichten für Familien- und Scheidungsmediation regelmäßig Einigungsquoten um die 80 Prozent. Entscheidend ist die Freiwilligkeit: Wer sich auf eine Mediation einlässt, sucht bereits eine Lösung statt eines Urteils. Hinzu kommt, dass selbst entwickelte Regelungen seltener nachverhandelt oder gerichtlich angegriffen werden als vom Gericht verfügte.",
    },
    {
      question: "Ist Online-Mediation bei einer Scheidung genauso wirksam?",
      answer:
        "Ja, und in Trennungssituationen hat sie sogar eigene Vorteile: Sie müssen sich nicht gegenübersitzen, solange das noch schwerfällt, schriftliche Beiträge fallen überlegter aus als Sätze im Affekt, und der asynchrone Ablauf passt zu Kinderbetreuung und Schichtdienst. Es gibt weiterhin eine feste Mediatorin, die den Prozess führt und bei Bedarf Video-Termine ansetzt.",
    },
    {
      question: "Warum ist Online-Mediation so viel günstiger?",
      answer:
        "Weil die teuersten Bestandteile eines Verfahrens wegfallen: Raum, Anfahrt und vor allem die Terminfindung zwischen zwei zerstrittenen Menschen und einer Mediatorin. Die Struktur steckt im geführten Prozess statt in zusätzlichen Sitzungsstunden. Deshalb ist bei medipact eine Pauschale von 399 € pro Partei möglich – ohne dass inhaltlich weniger geklärt wird.",
    },
    {
      question: "Was kostet ein Mediator bei einer Scheidung?",
      answer:
        "Bei medipact kostet die Trennungs- und Scheidungsmediation pauschal 399 € pro Partei im Online-Verfahren, 499 € in der Hybrid-Variante und 899 € im Vollservice. Freie Mediatorinnen und Mediatoren rechnen meist stündlich ab; der Stundensatz wird in der Regel zwischen beiden Parteien geteilt. Entscheidend für die Gesamtsumme ist, wie viele Streitpunkte zu klären sind.",
    },
    {
      question: "Ist eine Scheidung mit Mediator günstiger als mit zwei Anwälten?",
      answer:
        "In den meisten Fällen ja. Anwalts- und Gerichtskosten richten sich nach dem Verfahrenswert und steigen mit jedem zusätzlich streitig verhandelten Punkt; bei einer streitigen Scheidung braucht zudem jede Seite eigene Vertretung. In der Mediation läuft ein Verfahren für beide, und die erarbeitete Scheidungsfolgenvereinbarung verkürzt das Gerichtsverfahren erheblich.",
    },
    {
      question: "Wer zahlt die Mediation bei einer Scheidung?",
      answer:
        "Üblich ist die hälftige Teilung zwischen beiden Ehepartnern – das hält die Mediation neutral, weil keine Seite über die Rechnung Einfluss auf das Ergebnis nehmen kann. Eine andere Aufteilung nach Einkommen ist möglich, sollte aber vor Beginn schriftlich vereinbart werden. Bei medipact erhält jede Partei eine eigene Rechnung und zahlt ihren Anteil direkt.",
    },
    {
      question: "Ersetzt die Mediation den Anwalt und das Gericht?",
      answer:
        "Nein. Geschieden wird in Deutschland ausschließlich durch das Familiengericht, und dafür ist anwaltliche Vertretung erforderlich. Die Mediation klärt die Folgen – Unterhalt, Vermögen, Betreuung, Wohnung – und hält sie in einer Vereinbarung fest, die notariell beurkundet werden kann. Das Gerichtsverfahren wird dadurch deutlich kürzer und günstiger, entfällt aber nicht.",
    },
    {
      question: "Übernimmt die Rechtsschutzversicherung die Mediationskosten?",
      answer:
        "Manche Tarife beteiligen sich an Mediationskosten, teils mit gedeckelten Beträgen oder nur über vermittelte Mediatoren. Verfahrenskostenhilfe gibt es dagegen für das gerichtliche Verfahren, nicht für eine private Mediation. Prüfen Sie Ihre Police vor dem Start und fragen Sie zusätzlich bei Ihrer Kommune oder Familienberatungsstelle nach geförderten Angeboten.",
    },
  ],
  related: [
    { label: "Kostenrechner: Gericht oder Mediation?", href: "/kostenrechner" },
    { label: "Trennung & Scheidung: Mediation im Überblick", href: "/konflikte/trennung" },
    { label: "Sorgerecht und Umgang ohne Gericht regeln", href: "/ratgeber/sorgerecht-umgang-mediation" },
    { label: "Scheidung ohne Rosenkrieg", href: "/ratgeber/scheidung-ohne-rosenkrieg" },
    { label: "Vermögensauseinandersetzung bei Trennung", href: "/ratgeber/vermoegensauseinandersetzung" },
    { label: "Was kostet eine Mediation? (allgemein)", href: "/ratgeber/mediation-kosten" },
    { label: "Gericht oder Mediation?", href: "/ratgeber/gericht-oder-mediation" },
    { label: "Alle Preise im Überblick", href: "/preise" },
  ],
};
