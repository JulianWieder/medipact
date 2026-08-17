// app/content/arbeitsplatzPage.ts
//
// Positionierung nach docs/konzept_trennung_arbeitsverhaeltnis.md (10.08.2026):
// Der Wettbewerber ist NICHT das Urteil, sondern der Gütetermin (§ 54 ArbGG,
// vorrangig und kurzfristig nach § 61a ArbGG) in Verbindung mit § 12a ArbGG —
// in erster Instanz trägt jede Seite ihre Anwaltskosten selbst. Gegen dieses
// Angebot gewinnt kein Verfahren mit dem Versprechen "schneller und günstiger".
//
// Diese Seite argumentiert deshalb bewusst NICHT über Preis und Tempo, sondern
// über die Fenster, in denen der Gütetermin gar nicht stattfindet: vor der
// Kündigung (der Kern), Aufhebungsvertrag, Kleinbetrieb, Restrukturierung.
//
// Zwei Aussagen sind Pflicht und dürfen bei Textänderungen nicht wegfallen:
// die Drei-Wochen-Frist des § 4 KSchG und das Sperrzeit-Risiko nach
// §§ 159, 158 SGB III. Beides steht unten in `note` und in den FAQs.

import { arbeitsplatzFacts } from "@/app/components/ui/DidYouKnowSection";

export const arbeitsplatzPageContent = {
  eyebrow: "Konflikt am Arbeitsplatz",
  title: "Bevor aus dem Konflikt eine Kündigung wird.",
  titleHighlight: "Klären Sie, solange noch etwas zu klären ist.",
  intro:
    "Arbeitsplatzkonflikte werden selten offen ausgetragen. Sie zeigen sich als Krankmeldungen, als E-Mails mit vier Personen in CC, als Team, das sich sortiert – und irgendwann als Kündigung. Bis dahin hat niemand mit der anderen Seite gesprochen.",

  primaryCta: {
    label: "Konflikt einschätzen lassen",
    href: "#cta",
  },

  secondaryCta: {
    label: "Zur Übersicht",
    href: "/konflikte",
  },

  featuresTitle: "Woran Sie erkennen, dass es zu spät wird",
  featuresIntro:
    "Arbeitsplatzkonflikte eskalieren nicht laut, sondern still. Diese Signale stehen fast immer am Anfang.",

  features: [
    {
      title: "Die Kommunikation wird schriftlich",
      text: "Gespräche werden durch E-Mails ersetzt, Personen in CC gesetzt, Absprachen „zur Sicherheit“ bestätigt. Das ist kein Ordnungsbedürfnis, sondern Beweissicherung – und damit ein Eskalationsschritt.",
    },
    {
      title: "Fehlzeiten häufen sich",
      text: "Ein ungelöster Konflikt macht messbar krank. Wenn die Krankmeldungen einer Person mit einer bestimmten Konstellation korrelieren, ist der Konflikt bereits ein Kostenfaktor.",
    },
    {
      title: "Das Team wählt Seiten",
      text: "Was als Streit zwischen zwei Personen beginnt, bindet nach wenigen Wochen die halbe Abteilung. Die eigentlichen Beteiligten sind dann längst nicht mehr die einzigen Betroffenen.",
    },
    {
      title: "Die Führungskraft ist Partei geworden",
      text: "Wer im Konflikt selbst beteiligt ist, kann ihn nicht moderieren. Genau das ist der häufigste Grund, warum interne Klärungsversuche scheitern – nicht mangelnder Wille, sondern eine unmögliche Doppelrolle.",
    },
    {
      title: "Es geht nicht mehr um die Sache",
      text: "Wenn dieselbe Zuständigkeitsfrage zum dritten Mal eskaliert, ist die Zuständigkeit nicht das Problem. Sachlich lösbar ist ein Konflikt nur, solange das Sachthema noch das Thema ist.",
    },
    {
      title: "Jemand hat „Anwalt“ gesagt",
      text: "Ab diesem Punkt verändert sich der Ton auf beiden Seiten. Es lohnt sich, vorher zu klären – nicht weil ein Verfahren schlimm wäre, sondern weil danach andere Regeln gelten.",
    },
  ],

  // Die vier Zuschnitte aus dem Konzept. Bewusst offen benannt, inklusive der
  // Fälle, in denen medipact NICHT das richtige Angebot ist – ein Justiziar
  // oder Fachanwalt zerlegt ein zu breites Versprechen in zwei Sätzen.
  comparisonTitle: "Wann Mediation im Arbeitsverhältnis wirklich trägt",
  comparisonIntro:
    "Das Arbeitsgericht ist bewusst niedrigschwellig gebaut: Der Gütetermin ist bereits ein Schlichtungsversuch mit Richter, und in der ersten Instanz zahlt jede Seite ihren Anwalt selbst. Mediation gewinnt hier nicht über Preis oder Tempo – sondern dort, wo es diesen Termin gar nicht gibt.",
  comparisonPlans: [
    {
      title: "Vor der Kündigung",
      status: "Der Kern",
      featured: true,
      features: [
        "Der Konflikt eskaliert, ausgesprochen ist noch nichts",
        "Kein Streitgegenstand, keine Frist, kein Anwalt",
        "Die Zusammenarbeit ist noch eine echte Option",
        "Der Arbeitgeber vermeidet Abfindung und Neubesetzung",
      ],
    },
    {
      title: "Aufhebungsvertrag",
      status: "Beide wollen auseinander",
      features: [
        "Es gibt nichts zu klagen, nur zu verhandeln",
        "Beendigungsdatum, Zeugnis, Freistellung, Resturlaub",
        "Ergebnis ist ein Eckpunktepapier zur anwaltlichen Prüfung",
        "Sperrzeit-Risiko wird ausdrücklich benannt, nicht übergangen",
      ],
    },
    {
      title: "Kleinbetrieb",
      status: "§ 23 KSchG",
      features: [
        "Bis zehn Beschäftigte oder Wartezeit unter sechs Monaten",
        "Kündigungsschutzklage weitgehend chancenlos",
        "Mediation ist hier nicht die Alternative, sondern die einzige Option",
        "Auch für Arbeitgeber ohne eigene Personalabteilung",
      ],
    },
    {
      title: "Restrukturierung",
      status: "Firmen-Abo",
      features: [
        "Viele gleichartige Fälle gleichzeitig",
        "Ein Gerichtsverfahren wäre dasselbe Verfahren mal n",
        "Läuft über die Business-Tarife, nicht als Einzelfall",
        "Ergänzt Sozialplan und Interessenausgleich, ersetzt sie nicht",
      ],
    },
  ],

  deepDive: {
    eyebrow: "Mediation am Arbeitsplatz im Detail",
    title: "Konflikt am Arbeitsplatz: Was sich klären lässt – und was nicht",
    intro:
      "Ein Arbeitsplatzkonflikt hat eine Besonderheit, die ihn vom Nachbarschafts- oder Vertragsstreit unterscheidet: Die Parteien sind strukturell ungleich. Auf der einen Seite eine Personalabteilung mit Routine und Rechtsberatung, auf der anderen eine einzelne Person in einer existenziellen Lage. Ein Verfahren, das diese Asymmetrie nicht ausgleicht, ist kein Verfahren, sondern eine Verhandlung mit vorbestimmtem Ausgang. Das schriftliche, phasenweise Format ist hier kein Komfortmerkmal – es ist der Grund, warum niemand im Raum überfahren wird.",
    items: [
      {
        title: "Führung und Weisung",
        text: "Kritik, die nie ankommt, Ziele, die sich monatlich ändern, Entscheidungen ohne Begründung. Verhandelbar ist selten die Weisungsbefugnis, sehr oft aber, wie sie ausgeübt wird: Rhythmus, Form und Nachvollziehbarkeit von Rückmeldungen.",
      },
      {
        title: "Rollen und Zuständigkeiten",
        text: "Der häufigste Konflikt nach einer Umstrukturierung. Zwei Personen halten dieselbe Aufgabe für ihre – oder für die der anderen. Das ist der am besten lösbare Konflikttyp überhaupt, weil er sich schriftlich festhalten lässt.",
      },
      {
        title: "Mobbingvorwürfe",
        text: "Ein Vorwurf, der sowohl schwer zu beweisen als auch schwer zu entkräften ist. Mediation kann klären, was tatsächlich vorgefallen ist und wie es weitergeht – sie ersetzt aber keine arbeitsrechtliche Prüfung und ist bei klarem Machtmissbrauch oder Straftaten das falsche Instrument.",
      },
      {
        title: "Rückkehr nach längerer Abwesenheit",
        text: "Nach Krankheit, Elternzeit oder Freistellung ist die Stelle oft nicht mehr dieselbe. Wenn die Rückkehr ungeklärt beginnt, endet sie häufig in der zweiten Krankmeldung – ein Fenster, in dem strukturierte Klärung besonders viel bewirkt.",
      },
      {
        title: "Beendigung verhandeln",
        text: "Steht die Trennung fest, ist der Verhandlungsgegenstand klar benennbar: Beendigungsdatum, Abfindung, Zeugnisnote und Schlussformel (§ 109 GewO), Freistellung, Resturlaub, Wettbewerbsverbot, Sprachregelung nach außen. Vieles davon lässt sich gegeneinander tauschen – eine gute Zeugnisnote kostet den Arbeitgeber fast nichts und ist der gekündigten Person viel wert.",
      },
      {
        title: "Was medipact ausdrücklich nicht tut",
        text: "Die Wirksamkeit einer Kündigung ist eine Rechtsfrage. Sie gehört vor Gericht oder zu einer Fachanwältin, und medipact bewertet sie weder noch verhandelt es darüber. Ergebnis dieses Verfahrens ist ein Eckpunktepapier, kein unterschriftsreifer Aufhebungsvertrag.",
      },
    ],
    bulletsTitle: "Wann eine Klärung jetzt der richtige Schritt ist",
    bullets: [
      "Es ist noch nichts ausgesprochen – und genau deshalb ist noch alles möglich.",
      "Die Zusammenarbeit soll fortgesetzt werden, nur nicht so wie bisher.",
      "Interne Klärungsversuche sind gescheitert, weil alle Beteiligten Partei sind.",
      "Der Betrieb hat zehn oder weniger Beschäftigte – ein Kündigungsschutzverfahren wäre kein realistischer Weg.",
      "Beide Seiten wollen auseinander und suchen faire Konditionen statt eines Verfahrens.",
      "Eine Restrukturierung steht an und soll nicht in zwanzig Einzelverfahren enden.",
    ],
    note:
      "Zwei Fristen laufen unabhängig von jeder Mediation weiter: Gegen eine ausgesprochene Kündigung muss die Klage nach § 4 KSchG binnen drei Wochen ab Zugang beim Arbeitsgericht eingehen. Und ein Aufhebungsvertrag kann eine Sperrzeit beim Arbeitslosengeld auslösen (§ 159 SGB III, bis zu zwölf Wochen); wird die ordentliche Kündigungsfrist nicht eingehalten, kann der Anspruch zusätzlich ruhen (§ 158 SGB III). Deshalb endet dieses Verfahren mit einem Eckpunktepapier, das vor der Unterschrift anwaltlich geprüft gehört – nicht mit einem fertigen Vertrag.",
    links: [
      { label: "Ratgeber: Mediation am Arbeitsplatz", href: "/ratgeber/mediation-am-arbeitsplatz" },
      { label: "Ratgeber: Kündigung – wie es ohne Gericht weitergeht", href: "/ratgeber/kuendigung-ohne-gericht" },
      { label: "Ratgeber: Gericht oder Mediation?", href: "/ratgeber/gericht-oder-mediation" },
      { label: "Ratgeber: Mediation im Unternehmen", href: "/ratgeber/mediation-im-unternehmen" },
      { label: "Warum beide Seiten gleich behandelt werden", href: "/einigung/gleichbehandlung" },
      { label: "Kostenrechner: Gericht oder Mediation?", href: "/kostenrechner" },
    ],
  },

  processTitle: "Wie medipact unterstützt",
  process: [
    {
      title: "Getrennt schildern",
      text: "Jede Seite beschreibt die Situation im eigenen Tempo und ohne Publikum – vertrauliche Notizen bleiben vertraulich.",
    },
    {
      title: "Interessen statt Vorwürfe",
      text: "Aus „sie hört nie zu“ wird „ich brauche verlässliche Rückmeldung“. Erst damit lässt sich verhandeln.",
    },
    {
      title: "Schriftlich vereinbaren",
      text: "Am Ende stehen konkrete Absprachen zu Zusammenarbeit und Zuständigkeiten – oder ein fairer, geordneter Trennungsweg.",
    },
  ],

  trustTitle: "Warum Mediation am Arbeitsplatz wirkt",
  trustPoints: [
    {
      title: "Vertraulich",
      text: "§ 4 MediationsG verpflichtet zur Verschwiegenheit. Was hier gesagt wird, landet weder in der Personalakte noch in einer öffentlichen Verhandlung.",
    },
    {
      title: "Auf Augenhöhe",
      text: "Das schriftliche, phasenweise Format gleicht aus, was im Konferenzraum ungleich ist: Routine, Vorbereitung und Redeanteil.",
    },
    {
      title: "Anschlussfähig",
      text: "Das Verfahren kann vor, neben oder nach einer Klage laufen. Es schließt den Rechtsweg nicht – es versucht ihn zu erübrigen.",
    },
  ],

  didYouKnowFacts: arbeitsplatzFacts,

  faqTitle: "Häufige Fragen zur Mediation am Arbeitsplatz",
  faqs: [
    {
      question: "Was kostet eine Mediation am Arbeitsplatz?",
      answer:
        "Bei medipact kostet das Verfahren 399 € einmalig für den gesamten Fall – nicht pro Partei. Bezahlt wird es in aller Regel vom Arbeitgeber, der den Fall anlegt und die andere Seite einlädt. Das ist bewusst so: Eine beschäftigte Person soll nicht dafür zahlen, über ihren eigenen Arbeitsplatz zu verhandeln. Bei Restrukturierungen mit vielen gleichartigen Fällen läuft die Abrechnung über die Business-Tarife.",
    },
    {
      question: "Ich habe eine Kündigung erhalten – hilft mir Mediation noch?",
      answer:
        "Möglicherweise, aber achten Sie zuerst auf die Frist: Die Kündigungsschutzklage muss nach § 4 KSchG innerhalb von drei Wochen ab Zugang der schriftlichen Kündigung beim Arbeitsgericht eingehen. Diese Frist läuft unabhängig von jeder Mediation weiter, und sie ist nicht verlängerbar. Wenn Sie die Wirksamkeit der Kündigung angreifen wollen, klären Sie das zuerst anwaltlich oder über Gewerkschaft oder Rechtsschutz. Mediation kann parallel oder danach laufen – sie ersetzt die Fristwahrung nicht.",
    },
    {
      question: "Warum nicht einfach zum Arbeitsgericht?",
      answer:
        "Für viele Fälle ist das der richtige Weg, und das sagen wir offen: Der Gütetermin nach § 54 ArbGG findet in Kündigungssachen vorrangig und kurzfristig statt und ist selbst schon ein Schlichtungsversuch – mit Richter und ohne Zusatzkosten. Zudem gibt es in erster Instanz keine Erstattung der gegnerischen Anwaltskosten (§ 12a ArbGG). Mediation ist dort im Vorteil, wo es diesen Termin gar nicht gibt: solange nichts ausgesprochen ist, beim Aufhebungsvertrag, im Kleinbetrieb und bei Restrukturierungen.",
    },
    {
      question: "Kann ein Aufhebungsvertrag mein Arbeitslosengeld kosten?",
      answer:
        "Ja, das ist das größte Risiko in diesem Bereich. Wer an der Beendigung des Arbeitsverhältnisses mitwirkt, kann eine Sperrzeit von bis zu zwölf Wochen erhalten (§ 159 SGB III); wird die ordentliche Kündigungsfrist nicht eingehalten, kann der Anspruch zusätzlich ruhen (§ 158 SGB III). Beides kann im selben Fall zusammentreffen. Deshalb ist das Ergebnis bei medipact ein Eckpunktepapier und kein unterschriftsreifer Vertrag: Die sozialversicherungsrechtlichen Folgen gehören vor der Unterschrift geprüft.",
    },
    {
      question: "Erfährt mein Arbeitgeber, was ich in der Mediation sage?",
      answer:
        "Nein. Auch wenn der Arbeitgeber das Verfahren beauftragt und bezahlt, ist er dadurch nicht Zuhörer. § 4 MediationsG verpflichtet zur Verschwiegenheit, und vertrauliche Notizen sind im Verfahren technisch getrennt von dem, was geteilt wird. Ergebnis der Mediation ist die Vereinbarung – nicht das Protokoll des Weges dorthin.",
    },
    {
      question: "Ist die Teilnahme freiwillig?",
      answer:
        "Ja, und das ist keine Formalie, sondern die Bedingung dafür, dass das Verfahren funktioniert. Niemand kann zur Mediation verpflichtet werden, und eine Nichtteilnahme darf keine arbeitsrechtlichen Nachteile haben. Unabhängig davon bleibt das Beschwerderecht nach § 84 BetrVG bestehen: Wer sich benachteiligt fühlt, kann sich im Betrieb beschweren, ob mit oder ohne Betriebsrat.",
    },
    {
      question: "Was ist mit dem Betriebsrat?",
      answer:
        "Der Betriebsrat ist im Konflikt selbst Partei oder Interessenvertretung – er ist deshalb kein neutraler Dritter, auch wenn er vermittelt. Beides schließt sich nicht aus: Eine Mediation kann parallel laufen, und bei betriebsverfassungsrechtlichen Fragen bleibt der reguläre Weg über Betriebsvereinbarung oder Einigungsstelle unberührt.",
    },
    {
      question: "Wie lange dauert das Verfahren?",
      answer:
        "Weil der Prozess online und asynchron läuft, entfällt die Terminfindung zwischen mehreren Beteiligten – erfahrungsgemäß der größte Zeitfresser bei betrieblichen Konflikten. Typische Fälle sind innerhalb weniger Wochen geklärt. Läuft parallel eine Frist, etwa die drei Wochen nach § 4 KSchG, sollte die Fristwahrung immer zuerst geregelt werden.",
    },
  ],

  finalCtaTitle: "Klären, solange noch etwas zu klären ist.",
  finalCtaText:
    "Beschreiben Sie die Situation in wenigen Sätzen. Sie erfahren, ob eine Mediation in Ihrem Fall trägt – und wenn nicht, welcher Weg besser passt.",
  finalCta: {
    label: "Jetzt starten",
    href: "/kontakt",
  },
};
