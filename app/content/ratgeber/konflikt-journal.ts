import type { RatgeberArticle } from "./types";

// Keywords: Konflikt-Journal, Tagebuch bei Streit, Gedanken aufschreiben,
// Journaling Konflikt, Gefühle sortieren Streit, privates Konflikttagebuch.
// CTA-Ziel: /konflikt-logbuch (Journal-Funktion: private Einträge, die nie
// jemand außer der Autor:in sieht – auch nicht in einer späteren Mediation).

export const article: RatgeberArticle = {
  slug: "konflikt-journal",
  category: "Mediation",
  title: "Konflikt-Journal: Warum Aufschreiben hilft, wenn es kracht",
  metaTitle: "Konflikt-Journal führen: Gedanken & Gefühle sortieren | medipact",
  description:
    "Ein Konflikt-Journal hilft, Gefühle zu sortieren und klarer zu entscheiden. So führen Sie es richtig – privat, ehrlich und getrennt von der Faktendokumentation.",
  eyebrow: "Ratgeber · Mediation",
  updated: "2026-07-21",
  readingMinutes: 7,
  intro:
    "In einem Konflikt gibt es zwei Ebenen: das, was passiert – und das, was es mit Ihnen macht. Für die Fakten gibt es das Streit-Tagebuch. Für alles andere gibt es das Konflikt-Journal: einen streng privaten Ort für Wut, Zweifel, Ängste und die Gedanken, die Sie (noch) niemandem zeigen wollen. Dieser Ratgeber erklärt, warum genau diese Trennung so wirksam ist und wie Sie ein Journal führen, das Ihnen wirklich hilft.",
  blocks: [
    { type: "heading", text: "Was ein Konflikt-Journal ist – und was es nicht ist" },
    {
      type: "paragraph",
      text: "Ein Konflikt-Journal ist kein Beweismittel und keine Chronologie. Es ist der Ort, an dem Sie ungefiltert ehrlich sein dürfen: über Ihre Wut, Ihre Anteile am Streit, Ihre Angst vor der Eskalation – und auch über Zweifel, ob Sie überhaupt richtig liegen. Genau deshalb gehört es strikt getrennt von der Dokumentation, die Sie später vielleicht einem Mediator, Anwalt oder Gericht zeigen: Wer beim Schreiben schon an Leser denkt, schreibt nicht mehr ehrlich.",
    },
    {
      type: "paragraph",
      text: "Die Wirkung ist gut belegt: Wer belastende Erlebnisse strukturiert aufschreibt, grübelt weniger, schläft besser und trifft klarere Entscheidungen. Im Konflikt kommt ein zweiter Effekt dazu – das Journal macht sichtbar, wie sich Ihre Sicht über Wochen verändert. Das schützt vor zwei typischen Fehlern: im Affekt zu eskalieren und aus Erschöpfung klein beizugeben.",
    },
    { type: "heading", text: "Journal und Streit-Tagebuch: die zwei Spuren" },
    {
      type: "list",
      items: [
        "Dokumentation (Streit-Tagebuch): Fakten, Daten, Zitate, Belege – sachlich geschrieben, damit Dritte den Verlauf nachvollziehen können. Diese Einträge können Sie später teilen.",
        "Journal (privat): Gefühle, Vermutungen, Selbstzweifel, harte Urteile über die Gegenseite – alles darf hinein, weil es niemand außer Ihnen liest.",
        "Die Trennung entlastet beide Seiten: Die Dokumentation bleibt glaubwürdig (keine Wutausbrüche zwischen den Fakten), das Journal bleibt ehrlich (keine Selbstzensur).",
      ],
    },
    {
      type: "callout",
      text: "Im medipact Konflikt-Logbuch wählen Sie das pro Eintrag: „Dokumentation“ für Fakten – „Journal (privat)“ für alles, was nur Sie lesen sollen. Journal-Einträge bleiben auch dann ausschließlich für Sie sichtbar, wenn aus dem Logbuch später eine Mediation wird.",
    },
    { type: "heading", text: "So führen Sie Ihr Konflikt-Journal" },
    {
      type: "list",
      items: [
        "Schreiben Sie zeitnah – am besten am selben Tag, solange Gefühl und Erinnerung frisch sind.",
        "Beginnen Sie mit dem Gefühl, nicht mit dem Vorwurf: „Ich war nach dem Anruf zwei Stunden aufgewühlt“ sagt mehr als „Er war wieder unmöglich“.",
        "Fragen Sie sich am Ende jedes Eintrags: Was brauche ich eigentlich? Was wäre morgen ein kleiner guter Schritt?",
        "Notieren Sie auch Ihren eigenen Anteil – das ist unangenehm, aber genau daraus entsteht später Verhandlungsspielraum.",
        "Lesen Sie alle zwei bis drei Wochen zurück: Wird es besser oder schlimmer? Wiederholen sich Muster? Das ist die ehrlichste Eskalations-Anzeige, die es gibt.",
      ],
    },
    { type: "heading", text: "Wenn Sie unsicher sind, ob der Konflikt eskaliert" },
    {
      type: "paragraph",
      text: "Viele Konflikte sind lange in der Schwebe: noch kein offener Krieg, aber auch kein Frieden. Genau hier ist die Kombination aus Journal und Dokumentation am stärksten. Die Dokumentation sammelt nüchtern, was passiert – falls Sie später doch handeln müssen. Das Journal beantwortet parallel die wichtigere Frage: Wie sehr belastet mich das wirklich? Wenn die Einträge über Wochen häufiger, länger und dunkler werden, ist das ein klares Signal, aktiv zu werden – etwa mit einem klärenden Gespräch oder einer Mediation.",
    },
    { type: "heading", text: "Privatsphäre: die Grundbedingung" },
    {
      type: "paragraph",
      text: "Ein Journal funktioniert nur, wenn es garantiert privat ist. Ein Notizbuch in der gemeinsamen Wohnung oder eine Notiz-App auf dem Familien-Tablet sind es nicht. Achten Sie auf einen Ort, den nur Sie erreichen – und bei digitalen Werkzeugen darauf, was mit den Einträgen passiert, wenn andere Personen in den Fall einbezogen werden. Im medipact Logbuch gilt: Journal-Einträge sieht niemals ein Mediator und niemals die Gegenseite – ohne Ausnahme.",
    },
    {
      type: "cta",
      text: "Kostenloses Konflikt-Logbuch mit privatem Journal starten",
      href: "/konflikt-logbuch",
    },
  ],
  faq: [
    {
      question: "Was ist der Unterschied zwischen Konflikt-Journal und Streit-Tagebuch?",
      answer:
        "Das Streit-Tagebuch dokumentiert Fakten für Dritte: Daten, Vorfälle, Zitate, Belege. Das Konflikt-Journal ist privat und hält Gefühle, Gedanken und Zweifel fest – es wird niemals geteilt und darf deshalb völlig ehrlich sein.",
    },
    {
      question: "Hilft ein Journal wirklich bei Konflikten?",
      answer:
        "Ja. Strukturiertes Schreiben über belastende Erlebnisse reduziert nachweislich Grübeln und Stress. Im Konflikt zeigt das Journal zusätzlich, ob die Belastung über Wochen zu- oder abnimmt – die beste Grundlage für die Entscheidung, ob Sie handeln müssen.",
    },
    {
      question: "Kann jemand meine Journal-Einträge im medipact Logbuch lesen?",
      answer:
        "Nein. Einträge mit der Sichtbarkeit „Journal (privat)“ sieht ausschließlich die Person, die sie geschrieben hat – auch nach einer Umwandlung des Logbuchs in eine Mediation weder Mediator noch Gegenseite.",
    },
    {
      question: "Wie oft sollte ich in mein Konflikt-Journal schreiben?",
      answer:
        "Immer, wenn etwas Sie beschäftigt – ideal ist zeitnah am selben Tag. Es gibt keine Pflichtfrequenz: In ruhigen Phasen reicht ein Eintrag pro Woche, in akuten Phasen hilft tägliches Schreiben.",
    },
  ],
  related: [
    { label: "Konflikt dokumentieren: das Streit-Tagebuch", href: "/ratgeber/konflikt-dokumentieren" },
    { label: "Schwelender Konflikt: beobachten, bevor es eskaliert", href: "/ratgeber/schwelender-konflikt" },
    { label: "Akuter Konflikt: was jetzt zu tun ist", href: "/ratgeber/akuter-konflikt-was-tun" },
    { label: "Das kostenlose Konflikt-Logbuch", href: "/konflikt-logbuch" },
  ],
};
