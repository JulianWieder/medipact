// app/content/eignungscheck.ts
//
// Kostenloser Kurz-Check "Ist Mediation das Richtige?" (/eignungscheck),
// angelehnt an das Eskalationsmodell nach Friedrich Glasl, als Einstieg in
// den Paar-Check (beide Seiten, in kerno). Stand 03.11.2026.
//
// Der Paar-Check ist im Starterpaket enthalten (Julian 03.11.2026) und
// einzeln für 20 € buchbar. Er führt NICHT direkt in ein Einigungs-
// verfahren: Nach dem Check kommt das Starterpaket (verstehen, Mediator:in
// finden, klären, ob eine Lösung möglich ist), erst danach die Einigung.
//
// Auswertung (app/eignungscheck/EignungsCheck.tsx): Jede Antwort trägt die
// Glasl-Stufe, für die sie typisch ist (0 = kein Signal). Es zählt die
// HÖCHSTE ausgelöste Stufe, nicht die Summe – ein einziges Ultimatum wiegt
// mehr als drei holprige Gespräche. `ausschluss` (Gewalt/Angst) setzt das
// Ergebnis unabhängig davon auf Rot und zeigt die Hilfetelefone.
//
// Die Zuordnung ist eine Orientierung in Anlehnung an Glasl, kein
// validiertes Diagnoseinstrument – so steht es auch auf der Seite.
// Stufennamen nach Glasl (Konfliktmanagement, 1980 ff.); die Erklärungen
// sind eigene Worte. Preise unten mit kerno (app/pricing.py) abgleichen.

import { REGISTRIEREN_URL } from "@/lib/nutzerbereich";
import {
  STARTERPAKET_URL,
  STARTPAKET_NAME,
  STARTPAKET_PREIS,
} from "@/lib/mediatorVermittlung";

/** Paar-Check: beide Seiten machen den Check, danach Abgleich. */
export const PAARCHECK_PREIS = "20 €";
export const PAARCHECK_PREIS_EUR = "20";

/** Start des Paar-Checks in kerno: Typ `eignungscheck` im Start-Flow. */
export const PAARCHECK_URL = `${REGISTRIEREN_URL}?callbackUrl=${encodeURIComponent(
  "/dashboard/mediation/new/eignungscheck",
)}`;
/** Starterpaket buchen – der Paar-Check ist darin enthalten. */
export const STARTERPAKET_MIT_CHECK_URL = STARTERPAKET_URL;

export type CheckAntwort = {
  text: string;
  /** Glasl-Stufe, für die die Antwort typisch ist; 0 = kein Signal. */
  stufe: number;
  /** Gewalt oder Angst: harter Ausschluss, Ergebnis immer Rot + Hilfe. */
  ausschluss?: boolean;
};

export type CheckFrage = {
  /** Kurzlabel über der Frage. */
  signal: string;
  frage: string;
  hinweis?: string;
  antworten: CheckAntwort[];
};

export const checkFragen: CheckFrage[] = [
  {
    signal: "Direkte Kommunikation",
    frage: "Können Sie mit der anderen Seite noch direkt über den Konflikt sprechen?",
    antworten: [
      { text: "Ja, wir reden – auch wenn es manchmal hakt", stufe: 1 },
      { text: "Ja, aber jedes Gespräch endet im Streit ums Rechthaben", stufe: 2 },
      { text: "Kaum noch – Reden bringt nichts, es wird einfach gehandelt", stufe: 3 },
    ],
  },
  {
    signal: "Ton der Auseinandersetzung",
    frage: "Wie würden Sie die Gespräche der letzten Wochen beschreiben?",
    antworten: [
      { text: "Angespannt, aber sachlich", stufe: 1 },
      { text: "Scharf: Jeder versucht, den anderen argumentativ zu schlagen", stufe: 2 },
      { text: "Es gibt eigentlich keine Gespräche mehr", stufe: 3 },
    ],
  },
  {
    signal: "Kommunikation über Dritte",
    frage: "Läuft der Kontakt inzwischen über andere – Anwälte, Verwaltung, Kinder, Bekannte?",
    antworten: [
      { text: "Nein, wir haben direkt Kontakt", stufe: 0 },
      { text: "Teilweise, wichtige Dinge nur noch schriftlich", stufe: 3 },
      { text: "Ja, fast nur noch über Dritte", stufe: 4 },
    ],
  },
  {
    signal: "Verbündete",
    frage: "Sammeln Sie oder die andere Seite Unterstützer, die Ihre Sicht bestätigen sollen?",
    hinweis: "Zum Beispiel Familie, Nachbarn, Kollegen, die „auf eine Seite gezogen“ werden.",
    antworten: [
      { text: "Nein", stufe: 0 },
      { text: "Ein wenig – man erzählt es eben herum", stufe: 3 },
      { text: "Ja, es haben sich Lager gebildet", stufe: 4 },
    ],
  },
  {
    signal: "Person statt Sache",
    frage: "Geht es noch um das Thema – oder um die Person?",
    antworten: [
      { text: "Um das Thema", stufe: 0 },
      { text: "Es fallen persönliche Vorwürfe", stufe: 4 },
      { text: "Die andere Seite wird bloßgestellt oder als Mensch abgewertet", stufe: 5 },
    ],
  },
  {
    signal: "Drohungen und Ultimaten",
    frage: "Gab es Drohungen oder Ultimaten („Wenn du nicht …, dann …“)?",
    antworten: [
      { text: "Nein", stufe: 0 },
      { text: "Einmal im Ärger, nicht ernst gemeint", stufe: 5 },
      { text: "Ja, mit konkreten Konsequenzen", stufe: 6 },
    ],
  },
  {
    signal: "Gezielte Schädigung",
    frage: "Versucht eine Seite, der anderen gezielt zu schaden – auch wenn es ihr selbst schadet?",
    hinweis: "Zum Beispiel Eigentum beschädigen, Ruf ruinieren, Existenz gefährden.",
    antworten: [
      { text: "Nein", stufe: 0 },
      { text: "Es gab Aktionen, die nur dazu dienten, zu treffen", stufe: 7 },
      { text: "Ja, der eigene Schaden wird dafür in Kauf genommen", stufe: 8 },
    ],
  },
  {
    signal: "Sicherheit",
    frage: "Haben Sie Angst vor der anderen Person, oder gab es Gewalt?",
    hinweis: "Diese Frage ist entscheidend. Ihre Antwort verlässt Ihren Browser nicht.",
    antworten: [
      { text: "Nein", stufe: 0 },
      { text: "Ja – ich habe Angst oder es gab Gewalt", stufe: 9, ausschluss: true },
    ],
  },
];

export type Ampel = "gruen" | "gelb" | "rot";

export function ampelFuerStufe(stufe: number): Ampel {
  if (stufe >= 7) return "rot";
  if (stufe >= 4) return "gelb";
  return "gruen";
}

export const ampelErgebnis: Record<
  Ampel,
  { label: string; phase: string; stufen: string; titel: string; text: string }
> = {
  gruen: {
    label: "Grün",
    phase: "Phase 1: Man will sich noch einigen",
    stufen: "Stufe 1–3",
    titel: "Gute Voraussetzungen für eine Mediation",
    text: "Die Positionen sind verhärtet, aber beide Seiten sehen sich noch als Gesprächspartner. In dieser Phase gelingt eine Mediation am leichtesten – oft reichen wenige, gut strukturierte Schritte. Je früher, desto weniger Porzellan geht zu Bruch.",
  },
  gelb: {
    label: "Gelb",
    phase: "Phase 2: Es geht ums Gewinnen",
    stufen: "Stufe 4–6",
    titel: "Mediation ist sinnvoll – mit klarer Führung",
    text: "Der Konflikt hat sich von der Sache gelöst: Verbündete, persönliche Angriffe oder Drohungen bestimmen das Bild. Allein finden die Beteiligten hier selten heraus. Eine Mediation mit fester Struktur und neutraler Begleitung ist genau für diese Phase gemacht.",
  },
  rot: {
    label: "Rot",
    phase: "Phase 3: Hauptsache, der andere verliert",
    stufen: "Stufe 7–9",
    titel: "Mediation ist hier nicht der richtige erste Schritt",
    text: "Wenn eine Seite der anderen gezielt schadet oder Angst im Spiel ist, fehlt die Grundlage für eine freiwillige Einigung auf Augenhöhe. Jetzt geht es zuerst um Schutz und um klare Regeln von außen.",
  },
};

/** Empfehlung bei Rot – bewusst ohne Verkaufs-CTA. */
export const rotEmpfehlungen = [
  {
    titel: "Anwaltliche Beratung",
    text: "Klärt Ihre Rechte und was Sie jetzt sichern sollten. Bei geringem Einkommen über Beratungshilfe beim Amtsgericht.",
  },
  {
    titel: "Schlichtung",
    text: "Eine Schiedsperson oder Schlichtungsstelle macht einen Vorschlag – ohne dass beide Seiten zusammenarbeiten müssen.",
  },
  {
    titel: "Gericht",
    text: "Wenn keine Einigung möglich ist, entscheidet ein Gericht verbindlich. Bei Gewalt auch über Schutzanordnungen nach dem Gewaltschutzgesetz.",
  },
];

export const hilfetelefone = [
  { label: "Notruf", nummer: "110", tel: "110", text: "bei akuter Gefahr" },
  {
    label: "Hilfetelefon Gewalt gegen Frauen",
    nummer: "116 016",
    tel: "116016",
    text: "rund um die Uhr, kostenlos, anonym",
  },
  {
    label: "Hilfetelefon Gewalt an Männern",
    nummer: "0800 1239900",
    tel: "08001239900",
    text: "kostenlos, anonym",
  },
];

/** Die neun Stufen in drei Phasen, in eigenen Worten (Erklärteil). */
export const glaslPhasen = [
  {
    ampel: "gruen" as Ampel,
    titel: "Phase 1: Gemeinsam lösen ist noch möglich",
    text: "Beide Seiten wollen eigentlich eine Lösung, die für alle passt. Der Ton wird rauer, aber man redet noch.",
    stufen: [
      { nr: 1, name: "Verhärtung", text: "Standpunkte prallen aufeinander, man ist gereizt – aber überzeugt, dass sich das klären lässt." },
      { nr: 2, name: "Debatte", text: "Es geht ums Rechthaben. Argumente werden zugespitzt, Zwischentöne verschwinden." },
      { nr: 3, name: "Taten statt Worte", text: "Reden scheint sinnlos, also schafft man Fakten. Die Gesprächsbasis bröckelt." },
    ],
  },
  {
    ampel: "gelb" as Ampel,
    titel: "Phase 2: Einer soll gewinnen",
    text: "Es geht nicht mehr um die beste Lösung, sondern darum, nicht zu verlieren. Die andere Person wird zum Gegner.",
    stufen: [
      { nr: 4, name: "Koalitionen", text: "Man sucht Verbündete und festigt das Bild vom „schwierigen“ Gegenüber." },
      { nr: 5, name: "Gesichtsverlust", text: "Angriffe zielen auf die Person: bloßstellen, abwerten, Vertrauen zerstören." },
      { nr: 6, name: "Drohungen", text: "Ultimaten und Drohungen sollen die andere Seite zum Einlenken zwingen." },
    ],
  },
  {
    ampel: "rot" as Ampel,
    titel: "Phase 3: Beide verlieren",
    text: "Der eigene Vorteil ist zweitrangig – Hauptsache, die andere Seite verliert mehr.",
    stufen: [
      { nr: 7, name: "Begrenzte Schädigung", text: "Gezielte Schläge gegen die andere Seite, eigener Schaden wird hingenommen." },
      { nr: 8, name: "Zersplitterung", text: "Ziel ist, die Grundlagen des Gegenübers zu zerstören – wirtschaftlich, sozial, persönlich." },
      { nr: 9, name: "Gemeinsam in den Abgrund", text: "Die Vernichtung des anderen ist wichtiger als die eigene Existenz." },
    ],
  },
];

/** Vergleich der drei Angebote (Erklärteil und /preise-Hinweis). */
export const checkAngebote = [
  {
    name: "Kurz-Check",
    preis: "kostenlos",
    fuer: "Ihre eigene Sicht",
    punkte: [
      "8 Fragen, etwa 2 Minuten",
      "ohne Anmeldung, Auswertung nur in Ihrem Browser",
      "Ampel mit Einordnung nach Glasl",
    ],
  },
  {
    name: "Paar-Check",
    preis: PAARCHECK_PREIS,
    fuer: "beide Sichten",
    punkte: [
      "beide Seiten beantworten die Fragen getrennt",
      "Abgleich: Wo sehen Sie den Konflikt gleich, wo nicht?",
      "vertraulich – die andere Seite sieht nur Ampel und Abgleich",
    ],
    hervorgehoben: true,
  },
  {
    name: STARTPAKET_NAME,
    preis: `${STARTPAKET_PREIS} pro Fall`,
    fuer: "Paar-Check inklusive",
    punkte: [
      "Paar-Check für beide Seiten inklusive",
      "Mediation verstehen und passende Mediator:in finden",
      "klären, ob eine Lösung möglich ist – die Einigung kommt danach",
    ],
  },
];

export const eignungscheckFaqs = [
  {
    frage: "Erfährt die andere Seite meine Antworten?",
    antwort:
      "Nein. Beim kostenlosen Kurz-Check bleiben Ihre Antworten in Ihrem Browser und werden nirgends gespeichert. Beim Paar-Check sieht die andere Seite nicht Ihre einzelnen Antworten, sondern nur die Ampel und den Abgleich, wo Sie den Konflikt ähnlich oder unterschiedlich einschätzen.",
  },
  {
    frage: "Was sind die Eskalationsstufen nach Glasl?",
    antwort:
      "Der Konfliktforscher Friedrich Glasl beschreibt neun Stufen, auf denen Konflikte eskalieren, gruppiert in drei Phasen: In den ersten drei Stufen suchen beide Seiten noch eine gemeinsame Lösung, in den Stufen vier bis sechs geht es ums Gewinnen, ab Stufe sieben nehmen beide Seiten eigene Verluste in Kauf, damit die andere mehr verliert.",
  },
  {
    frage: "Ab welcher Eskalationsstufe ist Mediation sinnvoll?",
    antwort:
      "In den ersten beiden Phasen (Stufe 1 bis 6) ist Mediation in der Regel sinnvoll – früh ist sie am einfachsten, in den Stufen 4 bis 6 braucht sie eine klare, neutrale Führung. Ab Stufe 7, und immer bei Gewalt oder Angst, fehlt die Grundlage für eine freiwillige Einigung. Dann sind Schutz, anwaltliche Beratung, Schlichtung oder ein Gericht der richtige Weg.",
  },
  {
    frage: "Eskaliert jeder Konflikt automatisch weiter?",
    antwort:
      "Nein. Die Stufen beschreiben, wie Konflikte typischerweise eskalieren, nicht, dass sie es müssen. Ein Konflikt kann auf einer Stufe stehen bleiben, und mit Unterstützung lässt er sich auch wieder zurückführen. Je früher man ansetzt, desto leichter.",
  },
  {
    frage: "Warum ist ein Ergebnis auf Basis meiner Antworten nur eine Orientierung?",
    antwort:
      "Weil es nur Ihre Sicht abbildet. Die andere Seite erlebt denselben Konflikt oft auf einer anderen Stufe. Genau dafür gibt es den Paar-Check: Er stellt beide Einschätzungen nebeneinander. Der Check ersetzt keine Beratung und ist keine Diagnose.",
  },
  {
    frage: "Was kostet der Paar-Check, und was passiert danach?",
    antwort: `Der Paar-Check kostet ${PAARCHECK_PREIS}. Sie laden die andere Seite ein, beide beantworten die Fragen getrennt, danach sehen beide die Ampel und den Abgleich. Ob und wie es weitergeht, entscheiden Sie danach. Im ${STARTPAKET_NAME} (${STARTPAKET_PREIS} pro Fall) ist der Paar-Check bereits enthalten.`,
  },
];

/** Teaser-Texte (Startseite, /konflikte, /preise, Konflikt-Seiten). */
export type EignungscheckTeaserInhalt = {
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  hinweis: string;
};

export const eignungscheckTeaserDe: EignungscheckTeaserInhalt = {
  eyebrow: "Kostenloser Kurz-Check",
  title: "Ist Mediation das Richtige für Ihren Konflikt?",
  text: "8 Fragen in Anlehnung an die Eskalationsstufen nach Glasl. Am Ende steht eine Ampel: wie weit Ihr Konflikt eskaliert ist und welcher Weg jetzt passt.",
  cta: "Check starten",
  hinweis: "Ohne Anmeldung · Antworten bleiben in Ihrem Browser",
};

/** /preise: Paar-Check vorne, der kostenlose Kurz-Check nur als kleiner Link. */
export const paarcheckTeaserDe: EignungscheckTeaserInhalt = {
  eyebrow: `Paar-Check · ${PAARCHECK_PREIS}`,
  title: "Ist Mediation das Richtige für Ihren Konflikt?",
  text: "Beide Seiten beantworten dieselben Fragen getrennt, in Anlehnung an die Eskalationsstufen nach Glasl. Danach sehen beide die Ampel und den Abgleich: wo Sie den Konflikt gleich einschätzen und wo nicht. Im Starterpaket ist der Paar-Check bereits enthalten.",
  cta: `Paar-Check für ${PAARCHECK_PREIS} starten`,
  hinweis: "Vertraulich · die andere Seite sieht nur Ampel und Abgleich",
};
