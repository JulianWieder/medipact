// Ziel-Suchbegriffe: "scheidung ohne anwalt", "scheidung ohne anwalt möglich",
// "einvernehmliche scheidung ohne anwalt", "scheidung ohne anwalt kosten",
// "brauche ich einen anwalt für die scheidung".
//
// 12.08.2026 – neu. Siehe docs/kaufabsicht-scheidung.md. Hohe Nachfrage,
// eindeutige Sparabsicht — und die ehrliche Antwort spricht für das Angebot.
//
// HALTUNG DIESES ARTIKELS: Nicht versprechen, den Anwalt einzusparen. Der
// Anwaltszwang nach § 114 FamFG lässt sich nicht wegargumentieren, und wer das
// versucht, verliert genau die Leser, die rechnen können. Stattdessen den
// eigentlichen Kostenhebel zeigen: den Verfahrenswert. Er steigt mit jedem
// Streitpunkt, der ins Verfahren getragen wird. Nicht der Anwalt macht die
// Scheidung teuer, sondern die Uneinigkeit — dasselbe Argument wie in
// scheidungsfolgenvereinbarung.ts.
//
// ACHTUNG VOR VERÖFFENTLICHUNG: § 114 FamFG, § 43 FamGKG, § 114 ff. ZPO
// (Verfahrenskostenhilfe) und die Aussagen zum Versorgungsausgleich
// juristisch gegenlesen lassen. Keine konkreten Gebührenbeträge behaupten —
// der Artikel nennt bewusst nur Größenordnungen und Mechanik.

import type { RatgeberArticle } from "./types";

export const article: RatgeberArticle = {
  slug: "scheidung-ohne-anwalt",
  category: "Trennung & Scheidung",
  title: "Scheidung ohne Anwalt: Was geht, was nicht – und was es wirklich spart",
  metaTitle: "Scheidung ohne Anwalt: geht das wirklich? | medipact",
  description:
    "Einer muss einen Anwalt haben – so steht es im Gesetz. Was die Scheidung ohne zweiten Anwalt spart, wo das Risiko liegt und wo der größere Hebel ist.",
  eyebrow: "Ratgeber · Trennung & Scheidung",
  updated: "2026-08-12",
  published: "2026-08-12",
  readingMinutes: 10,
  intro:
    "Ganz ohne Anwalt geht es nicht: Der Scheidungsantrag muss von einer Anwältin oder einem Anwalt gestellt werden. Was möglich ist, ist die Scheidung mit nur einem Anwalt – und das spart tatsächlich Geld. Dieser Artikel zeigt, wie das funktioniert, welchen Preis die nicht vertretene Seite dafür zahlt, und warum der eigentliche Kostenhebel ganz woanders liegt.",
  blocks: [
    {
      type: "heading",
      text: "Die kurze Antwort",
    },
    {
      type: "paragraph",
      text: "Vor dem Familiengericht besteht Anwaltszwang (§ 114 FamFG). Wer die Scheidung beantragt, braucht dafür anwaltliche Vertretung – daran führt kein Weg vorbei. Die andere Seite kann dem Antrag jedoch ohne eigenen Anwalt zustimmen. In der Praxis heißt das: Bei einer einvernehmlichen Scheidung reicht ein Anwalt für das Verfahren, und die Anwaltskosten fallen nur einmal an statt zweimal.",
    },
    {
      type: "callout",
      text: "Verbreitetes Missverständnis: Dieser eine Anwalt ist nicht „der Anwalt für beide\". Er vertritt ausschließlich die Seite, die ihn beauftragt hat, und darf die andere Seite nicht beraten – auch nicht wohlwollend. Das ist keine Unfreundlichkeit, sondern Berufsrecht.",
    },
    {
      type: "heading",
      text: "Was die nicht vertretene Seite nicht kann",
    },
    {
      type: "paragraph",
      text: "Zustimmen zum Scheidungsantrag – das geht. Alles andere nicht. Wer ohne Anwalt im Verfahren steht, kann keine eigenen Anträge stellen: keinen Antrag zum Unterhalt, keinen zum Zugewinn, keinen zum Versorgungsausgleich, und auch keinen Rechtsmittelverzicht erklären, der das Verfahren sofort rechtskräftig werden lässt.",
    },
    {
      type: "list",
      items: [
        "Keine eigenen Anträge zu Folgesachen – wer etwas fordern will, braucht dafür Vertretung.",
        "Keine Protokollierung einer Vereinbarung im Termin, für die anwaltliche Vertretung beider Seiten vorausgesetzt wird.",
        "Keine Beratung darüber, ob das, wozu man zustimmt, überhaupt angemessen ist.",
        "Kein Rechtsmittelverzicht – die Scheidung wird erst nach Ablauf der Frist rechtskräftig.",
      ],
    },
    {
      type: "paragraph",
      text: "Daraus folgt eine klare Grenze: Das Modell mit einem Anwalt funktioniert nur, wenn Sie sich über alles einig sind. Sobald ein Punkt strittig ist, ist die nicht vertretene Seite strukturell im Nachteil – sie kann nichts beantragen und bekommt zu dem, was vorliegt, keine Einschätzung.",
    },
    {
      type: "heading",
      text: "Der Punkt, den fast alle übersehen: der Verfahrenswert",
    },
    {
      type: "paragraph",
      text: "Sämtliche Gerichts- und Anwaltsgebühren im Familienverfahren berechnen sich nicht nach Aufwand, sondern nach dem Verfahrenswert. Für die Scheidung selbst bildet er sich im Kern aus dem Nettoeinkommen beider Ehegatten über drei Monate, ergänzt um einen Anteil des Vermögens; hinzu kommt ein Wert für den Versorgungsausgleich.",
    },
    {
      type: "paragraph",
      text: "Entscheidend ist, was danach passiert: Jede Folgesache, die ins Verfahren getragen wird – Unterhalt, Zugewinn, Hausrat, Sorge –, hat einen eigenen Wert, und diese Werte addieren sich. Der Verfahrenswert steigt, und mit ihm steigen alle Gebühren, auf beiden Seiten und beim Gericht gleichzeitig.",
    },
    {
      type: "callout",
      text: "Das ist der eigentliche Hebel: Nicht der Anwalt macht die Scheidung teuer, sondern die Zahl der Streitpunkte. Wer den zweiten Anwalt einspart, aber über drei Folgesachen streitet, zahlt am Ende deutlich mehr als ein Paar, das sich vorher geeinigt hat und mit zwei Anwälten in den Termin geht.",
    },
    {
      type: "paragraph",
      text: "Umgekehrt gilt: Sind Sie sich einig, kann das Gericht den Verfahrenswert bei einvernehmlicher Scheidung herabsetzen. Einigkeit senkt die Kosten also doppelt – über den Wert und über die Zahl der beteiligten Anwälte.",
    },
    {
      type: "table",
      caption: "Was die Scheidungskosten tatsächlich treibt",
      headers: ["Faktor", "Wirkung auf die Kosten", "Beeinflussbar?"],
      rows: [
        [
          "Zahl der Streitpunkte im Verfahren",
          "sehr hoch – jede Folgesache erhöht den Verfahrenswert",
          "ja, durch Einigung vorab",
        ],
        [
          "Zweiter Anwalt",
          "spürbar, aber begrenzt – eine Gebührenrechnung mehr",
          "ja, wenn Einvernehmen besteht",
        ],
        [
          "Einkommen und Vermögen",
          "hoch – Grundlage des Verfahrenswerts",
          "nein",
        ],
        [
          "Dauer des Verfahrens",
          "indirekt – lange Verfahren entstehen durch Streit, nicht umgekehrt",
          "ja, über die Einigung",
        ],
      ],
    },
    {
      type: "heading",
      text: "Wenn das Geld nicht reicht: Verfahrenskostenhilfe",
    },
    {
      type: "paragraph",
      text: "Wer die Kosten nicht aufbringen kann, hat Anspruch auf Verfahrenskostenhilfe – der Staat übernimmt dann Gerichts- und Anwaltskosten ganz oder gegen Ratenzahlung. Geprüft werden Einkommen, Vermögen und die Erfolgsaussichten. Der Antrag wird beim Familiengericht gestellt, üblicherweise über die Kanzlei, und sollte vor Einreichung des Scheidungsantrags gestellt werden.",
    },
    {
      type: "paragraph",
      text: "Das ist der bessere Weg als der Verzicht auf Vertretung. Wer aus Kostengründen unvertreten bleibt, spart an der Stelle, an der Beratung am meisten wert wäre.",
    },
    {
      type: "heading",
      text: "Was ohnehin von Amts wegen läuft",
    },
    {
      type: "paragraph",
      text: "Der Versorgungsausgleich – die Teilung der in der Ehe erworbenen Rentenanwartschaften – wird bei Ehen ab einer bestimmten Dauer automatisch mit der Scheidung durchgeführt, ohne dass jemand ihn beantragen muss. Beide Seiten füllen dafür Fragebögen aus. Ausschließen lässt er sich nur durch eine wirksame Vereinbarung, und die ist beurkundungspflichtig.",
    },
    {
      type: "paragraph",
      text: "Das ist praktisch relevant für alle, die glauben, mit dem Verzicht auf Anwälte sei das Thema erledigt: Der Versorgungsausgleich läuft trotzdem, verlängert das Verfahren um die Auskunftsphase und erhöht den Verfahrenswert.",
    },
    {
      type: "heading",
      text: "Die ehrliche Empfehlung",
    },
    {
      type: "paragraph",
      text: "Die Frage „Brauche ich einen Anwalt?\" ist die falsche Frage. Die richtige lautet: Worüber sind wir uns noch nicht einig – und wie klären wir das, bevor es ins Verfahren geht? Denn jeder Punkt, den Sie vorher klären, verschwindet aus dem Verfahrenswert und damit aus allen Gebührenrechnungen.",
    },
    {
      type: "paragraph",
      text: "Genau dort setzt medipact an. Der geführte Online-Prozess klärt die strittigen Punkte, bevor sie zu Folgesachen werden – strukturiert, schriftlich und zum Festpreis pro Partei statt nach Gegenstandswert. Was medipact nicht tut und nicht tun kann: die Scheidung selbst durchführen. Dafür braucht es das Familiengericht und mindestens eine anwaltliche Vertretung.",
    },
    {
      type: "cta",
      text: "Was kostet der Weg über das Gericht? Jetzt vergleichen",
      href: "/kostenrechner?art=trennung",
    },
    {
      type: "callout",
      text: "Dieser Artikel ersetzt keine Rechtsberatung. Ob eine Vertretung in Ihrer Konstellation verzichtbar ist, welcher Verfahrenswert anzusetzen wäre und ob Verfahrenskostenhilfe in Betracht kommt, hängt am Einzelfall und sollte anwaltlich geklärt werden.",
    },
    {
      type: "cta",
      text: "Trennung strukturiert und fair regeln",
      href: "/konflikte/trennung",
    },
  ],
  faq: [
    {
      question: "Ist eine Scheidung ohne Anwalt möglich?",
      answer:
        "Nicht vollständig. Vor dem Familiengericht besteht Anwaltszwang (§ 114 FamFG), der Scheidungsantrag muss also anwaltlich gestellt werden. Möglich ist die Scheidung mit nur einem Anwalt: Eine Seite stellt den Antrag, die andere stimmt ohne eigene Vertretung zu. Das funktioniert allerdings nur, wenn über alle Folgen Einigkeit besteht.",
    },
    {
      question: "Kann ein Anwalt beide Ehepartner vertreten?",
      answer:
        "Nein. Der beauftragte Anwalt vertritt ausschließlich seinen Mandanten und darf die andere Seite nicht beraten – das ist berufsrechtlich ausgeschlossen. Wer dem Antrag ohne eigene Vertretung zustimmt, bekommt also keine Einschätzung dazu, ob das Ergebnis für ihn angemessen ist.",
    },
    {
      question: "Was spart die Scheidung mit nur einem Anwalt?",
      answer:
        "Es entfällt eine von zwei Anwaltsrechnungen – ein spürbarer, aber begrenzter Betrag. Der deutlich größere Hebel liegt beim Verfahrenswert: Jede strittige Folgesache erhöht ihn, und daran hängen sämtliche Gerichts- und Anwaltsgebühren. Wer sich vorher einigt, spart mehr als wer den zweiten Anwalt weglässt.",
    },
    {
      question: "Was kann die Seite ohne Anwalt im Verfahren nicht tun?",
      answer:
        "Sie kann dem Scheidungsantrag zustimmen, aber keine eigenen Anträge stellen – weder zu Unterhalt noch zu Zugewinn oder Versorgungsausgleich – und auch keinen Rechtsmittelverzicht erklären. Vereinbarungen, für die im Termin anwaltliche Vertretung beider Seiten vorausgesetzt wird, sind ebenfalls nicht protokollierbar.",
    },
    {
      question: "Was tun, wenn ich mir den Anwalt nicht leisten kann?",
      answer:
        "Verfahrenskostenhilfe beantragen, statt auf Vertretung zu verzichten. Bei entsprechenden Einkommens- und Vermögensverhältnissen übernimmt der Staat die Gerichts- und Anwaltskosten ganz oder gegen Ratenzahlung. Der Antrag läuft über das Familiengericht und sollte vor Einreichung des Scheidungsantrags gestellt werden.",
    },
    {
      question: "Läuft der Versorgungsausgleich auch ohne Antrag?",
      answer:
        "Ja, bei Ehen ab einer bestimmten Dauer wird er von Amts wegen mit der Scheidung durchgeführt; beide Seiten füllen dafür Fragebögen aus. Ausschließen lässt er sich nur durch eine wirksame Vereinbarung, die notariell beurkundet werden muss. Er verlängert das Verfahren um die Auskunftsphase und fließt in den Verfahrenswert ein.",
    },
  ],
  related: [
    { label: "Scheidungsfolgenvereinbarung: Inhalt und Kosten", href: "/ratgeber/scheidungsfolgenvereinbarung" },
    { label: "Trennungsvereinbarung: was hineingehört", href: "/ratgeber/trennungsvereinbarung" },
    { label: "Was steht mir bei der Scheidung zu?", href: "/ratgeber/was-steht-mir-bei-der-scheidung-zu" },
    { label: "Was kostet ein Mediator bei der Scheidung?", href: "/ratgeber/scheidung-mediator-kosten" },
    { label: "Kostenrechner: Gericht oder Einigung?", href: "/kostenrechner" },
    { label: "Scheidung ohne Rosenkrieg", href: "/ratgeber/scheidung-ohne-rosenkrieg" },
    { label: "Trennung & Scheidung: Mediation im Überblick", href: "/konflikte/trennung" },
  ],
};
