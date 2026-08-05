// app/content/nachbarschaftPage.ts

import { nachbarschaftFacts } from "@/app/components/ui/DidYouKnowSection";

export const nachbarschaftPageContent = {
  eyebrow: "Nachbarschafts-Streit",
  title: "Wenn der Alltag zum Konflikt wird.",
  titleHighlight: "Finde zurück zu einem normalen Miteinander.",
  intro:
    "Nachbarschaftskonflikte beginnen oft klein: Lärm, Grenzen, Parkplätze, Garten oder Hausordnung. Schwierig wird es, weil man sich nicht einfach aus dem Weg gehen kann.",

  primaryCta: {
    label: "Nachbarschaftskonflikt einschätzen",
    href: "#cta",
  },

  secondaryCta: {
    label: "Zur Übersicht",
    href: "/konflikte",
  },

  featuresTitle: "Typische Herausforderungen",
  featuresIntro:
    "Gerade weil Nachbarn dauerhaft nebeneinander leben, können kleine Auslöser schnell persönlich werden.",

  features: [
    {
      title: "Wiederkehrender Ärger",
      text: "Lärm, Müll, Parkplätze oder Grenzen tauchen immer wieder auf und belasten den Alltag.",
    },
    {
      title: "Abgebrochene Kommunikation",
      text: "Gespräche werden vermieden, aggressiv geführt oder nur noch über Beschwerden ausgetragen.",
    },
    {
      title: "Dauerhafte Nähe",
      text: "Der Konflikt verschwindet nicht von selbst, weil sich die Beteiligten regelmäßig begegnen.",
    },
    {
      title: "Recht haben hilft nicht weiter",
      text: "Selbst ein gewonnenes Urteil ändert nichts daran, dass Sie am nächsten Morgen wieder nebeneinander aufwachen. Wer den Prozess gewinnt, hat den Nachbarn trotzdem noch – jetzt nur verärgert.",
    },
    {
      title: "Der Streitwert rechtfertigt kein Verfahren",
      text: "Bei einer Hecke oder Ruhezeiten steht kein Betrag im Raum, der Anwalts- und Gerichtskosten wirtschaftlich sinnvoll macht. Der Ärger ist trotzdem real – und bleibt ohne Klärung bestehen.",
    },
    {
      title: "Beide dokumentieren gegeneinander",
      text: "Lärmprotokolle, Fotos, Zeugen: Wenn beide Seiten Beweise sammeln, ist das ein sicheres Zeichen dafür, dass niemand mehr an ein Gespräch glaubt – und dass der Konflikt gerade eskaliert.",
    },
  ],

  // Vertiefungs-Abschnitt zur Ziel-Suchphrase "Nachbarschaftsmediation".
  // Die Seite hatte rund 520 Wörter und bestand fast nur aus dem
  // Template-Skelett.
  //
  // Zuständigkeitsgrenze: Diese Seite besitzt die Verfahrensspur. Die
  // konkreten Einzelfragen — Lärm, Heckenhöhe, WEG-Beschluss — gehören den
  // Ratgeber-Artikeln und werden nur verlinkt, nicht wiederholt.
  deepDive: {
    eyebrow: "Nachbarschaftsmediation im Detail",
    title: "Nachbarschaftsmediation: Typische Streitpunkte und was sich regeln lässt",
    intro:
      "Nachbarschaftsstreit hat eine Eigenart, die ihn von fast jedem anderen Konflikt unterscheidet: Sie können ihn nicht beenden, indem Sie gewinnen. Die Beteiligten bleiben – und mit ihnen die Beziehung, in der das Urteil künftig gilt. Deshalb zielt Mediation hier nicht auf Rechtspositionen, sondern auf Regeln, mit denen beide Seiten leben können. Das sind die Themen, die dabei am häufigsten auf den Tisch kommen.",
    items: [
      {
        title: "Lärm und Ruhezeiten",
        text: "Musik, Renovierung, Kinder, Hunde, Rasenmäher. Was zumutbar ist, steht nur teilweise in Verordnungen – der Rest ist Auslegung. In der Mediation entstehen konkrete Absprachen für die Situationen, die tatsächlich stören, statt eines Verweises auf die Hausordnung.",
      },
      {
        title: "Grenzen, Hecken und Bäume",
        text: "Höhe, Abstand, Überhang, Laub: Hier gibt es Landesrecht, und es ist von Bundesland zu Bundesland verschieden. Der Streit dreht sich aber selten um den Zentimeter, sondern um Licht, Sicht und das Gefühl, übergangen worden zu sein.",
      },
      {
        title: "Parken, Zufahrt und gemeinsame Flächen",
        text: "Der Klassiker in Reihenhaussiedlungen und Mehrparteienhäusern. Weil niemand formal im Unrecht ist, lässt sich der Fall nicht entscheiden – nur vereinbaren. Eine schriftliche Nutzungsregel beendet die meisten dieser Konflikte dauerhaft.",
      },
      {
        title: "WEG: Beschlüsse und Verwaltung",
        text: "In der Eigentümergemeinschaft treffen Eigeninteresse und Gemeinschaftsentscheidung aufeinander. Wer regelmäßig überstimmt wird, blockiert irgendwann grundsätzlich. Mediation setzt hier vor der Beschlussanfechtung an, nicht danach.",
      },
      {
        title: "Tiere, Gerüche und Grillen",
        text: "Themen, bei denen Toleranzgrenzen weit auseinanderliegen und beide Seiten sich im Recht fühlen. Verhandelbar ist fast nie das Ob, aber sehr oft das Wie oft, Wann und Wo.",
      },
      {
        title: "Der alte Streit hinter dem aktuellen",
        text: "Wenn eine Hecke seit zwölf Jahren dieselbe Höhe hat und plötzlich stört, geht es nicht um die Hecke. Solche Konflikte lassen sich sachlich nicht lösen, weil das Sachthema nur der Anlass ist – die Mediation trennt beides.",
      },
    ],
    bulletsTitle: "Wann Nachbarschaftsmediation der bessere erste Schritt ist",
    bullets: [
      "Sie wohnen weiter Tür an Tür und wollen den Alltag zurück, nicht ein Urteil.",
      "Der Streitwert würde ein Gerichtsverfahren wirtschaftlich nie rechtfertigen.",
      "Gespräche enden inzwischen sofort im Vorwurf – oder finden gar nicht mehr statt.",
      "Mehrere Parteien sind betroffen, etwa im Mehrfamilienhaus oder in der WEG.",
      "Eine Seite hat bereits mit Anwalt oder Anzeige gedroht.",
      "Sie wissen, dass Sie im Recht sind – und merken, dass es nichts ändert.",
    ],
    note:
      "In einigen Bundesländern ist ein außergerichtlicher Einigungsversuch bei Nachbarschaftsstreitigkeiten sogar Voraussetzung, bevor Klage erhoben werden kann. Unabhängig davon gilt: Ein Verfahren, das den Streitwert übersteigt, ist auch dann ein schlechtes Geschäft, wenn Sie es gewinnen. Bei medipact liegt die Nachbarschaftsmediation deshalb im Einstiegstarif von 49 € pro Partei.",
    links: [
      { label: "Ratgeber: Nachbarschaftsstreit – was tun?", href: "/ratgeber/nachbarschaftsstreit-was-tun" },
      { label: "Ratgeber: Nachbar macht Lärm – was tun?", href: "/ratgeber/nachbar-laerm-was-tun" },
      { label: "Ratgeber: Wie hoch darf die Hecke sein?", href: "/ratgeber/hecke-nachbar-hoehe" },
      { label: "Ratgeber: WEG-Streit und Mediation", href: "/ratgeber/weg-streit-mediation" },
      { label: "Kostenrechner: Gericht oder Mediation?", href: "/kostenrechner" },
    ],
  },

  processTitle: "Wie medipact unterstützt",
  process: [
    {
      title: "Konflikt entladen",
      text: "Zuerst wird getrennt, was passiert ist, was interpretiert wurde und was wirklich geklärt werden muss.",
    },
    {
      title: "Gespräch ermöglichen",
      text: "Ein strukturierter Rahmen verhindert, dass alte Vorwürfe jedes Gespräch wieder blockieren.",
    },
    {
      title: "Alltagstaugliche Lösung finden",
      text: "Ziel sind konkrete Vereinbarungen, die im täglichen Zusammenleben realistisch funktionieren.",
    },
  ],

  trustTitle: "Warum Mediation bei Nachbarschaft hilft",
  trustPoints: [
    {
      title: "Praktisch",
      text: "Es geht nicht um Gewinner und Verlierer, sondern um Lösungen, mit denen alle leben können.",
    },
    {
      title: "Deeskalierend",
      text: "Mediation kann verhindern, dass aus Alltagsärger ein dauerhafter Rechtsstreit wird.",
    },
    {
      title: "Konkret",
      text: "Am Ende stehen klare Absprachen statt vager Hoffnungen auf Besserung.",
    },
  ],

  didYouKnowFacts: nachbarschaftFacts,

  faqTitle: "Häufige Fragen zur Nachbarschaftsmediation",
  faqs: [
    {
      question: "Was kostet eine Nachbarschaftsmediation?",
      answer:
        "Bei medipact kostet die Nachbarschaftsmediation 49 € pro Partei – eine einmalige Pauschale für den kompletten geführten Online-Prozess, keine Stundenabrechnung. Frei tätige Mediatorinnen und Mediatoren rechnen meist stündlich ab; die Kosten werden dann in der Regel zwischen den Nachbarn geteilt. Ein Rechtsstreit über Lärm oder eine Grenzbebauung liegt regelmäßig um ein Vielfaches darüber.",
    },
    {
      question: "Wer zahlt die Mediation bei einem Nachbarschaftsstreit?",
      answer:
        "Üblich ist die hälftige Teilung – das hält das Verfahren neutral, weil keine Seite über die Rechnung Einfluss nehmen kann. Bei medipact zahlt jede Partei ihren eigenen Anteil von 49 € direkt und bekommt eine eigene Rechnung. Manche Rechtsschutzversicherungen beteiligen sich zusätzlich an Mediationskosten oder vermitteln selbst Mediatoren – ein Blick in die Police lohnt sich vor dem Start.",
    },
    {
      question: "Ist das Ergebnis einer Nachbarschaftsmediation rechtlich bindend?",
      answer:
        "Ja. Die Abschlussvereinbarung ist ein Vertrag zwischen den Beteiligten und damit bindend. Bei Bedarf kann sie notariell beurkundet oder als Anwaltsvergleich vollstreckbar gemacht werden. Für die meisten Nachbarschaftsthemen – Ruhezeiten, Heckenhöhe, Parkregelung, Nutzung gemeinsamer Flächen – genügt die schriftliche Vereinbarung, weil beide Seiten sie selbst entwickelt haben.",
    },
    {
      question: "Muss ich vor Gericht erst zur Schlichtungsstelle?",
      answer:
        "In mehreren Bundesländern ist bei bestimmten Nachbarschaftsstreitigkeiten ein außergerichtlicher Einigungsversuch Voraussetzung für eine Klage – die Regelungen unterscheiden sich je nach Land und Streitgegenstand. Unabhängig davon gilt: Wer vorher ernsthaft eine Einigung versucht hat, steht besser da. Klären Sie die genauen Anforderungen im Zweifel mit einer Anwältin oder bei Ihrem Amtsgericht.",
    },
    {
      question: "Was, wenn mein Nachbar nicht mitmachen will?",
      answer:
        "Mediation ist freiwillig – ohne die Gegenseite geht es nicht. Erfahrungsgemäß hilft ein sachlicher, schriftlicher Vorschlag ohne Vorwürfe mehr als ein Gespräch über den Zaun: Er nimmt den Druck, sofort reagieren zu müssen. Lehnt der Nachbar ab, haben Sie den Einigungsversuch dokumentiert und können den formalen Weg gehen.",
    },
    {
      question: "Wie lange dauert eine Nachbarschaftsmediation?",
      answer:
        "Weil der Prozess online und asynchron läuft, entfällt die Terminfindung. Beide Seiten bearbeiten die strukturierte Fallaufnahme im eigenen Tempo, meist abends oder am Wochenende. Typische Nachbarschaftsthemen sind dadurch häufig innerhalb weniger Tage bis Wochen geklärt – ein Zivilverfahren über dieselbe Frage dauert oft Monate bis Jahre.",
    },
  ],

  finalCtaTitle: "Nachbarschaft klären, bevor es dauerhaft belastet.",
  finalCtaText:
    "Beschreiben Sie kurz Ihre Situation und finden Sie heraus, wie ein sinnvoller nächster Schritt aussehen kann.",
  finalCta: {
    label: "Jetzt starten",
    href: "/kontakt",
  },
};
