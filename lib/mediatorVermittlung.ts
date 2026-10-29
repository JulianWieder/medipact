/**
 * Zusatzbaustein „Mediator:in vermitteln" (/mediator-finden, /fuer-mediatoren).
 *
 * Das Online-Verfahren bleibt das Hauptangebot. Dieser Baustein ist der
 * zusätzliche Weg für alle, die eine klassische Mediation mit einer
 * persönlichen Mediatorin oder einem Mediator wollen (vor Ort oder per Video).
 * medipact vermittelt, die Mediation führt die externe Mediatorin.
 *
 * Seit 29.10.2026 fuehrt jeder Kunden-Einstieg in das digitale
 * Starterpaket (starterpaketUrl): Registrierung bzw. Login, danach der
 * Start-Flow in kerno mit Paket "starter". Die frühere reine Anfrage
 * (/dashboard/anfragen) verlinkt die Website nicht mehr.
 * Profile legt das medipact-Team an; die Aufnahme in den Pool bleibt eine
 * Mail, die ist kein Selbstbedienungsweg.
 */

import { REGISTRIEREN_URL } from "@/lib/nutzerbereich";

/**
 * Das digitale Starterpaket – EINE Quelle für alle Seiten (Startseite,
 * /preise, /mediator-finden, Profilseiten, /fuer-mediatoren, Hinweis auf den
 * Konflikt-Seiten). Entschieden am 29.10.2026:
 *
 * 1. Bezahlt wird wie im Online-Verfahren: STARTPAKET_PREIS pro Fall,
 *    GETEILT zwischen den Seiten (korrigiert am 29.10.2026), und erst wenn
 *    die andere Seite der Einladung zugestimmt hat.
 * 2. Digital mit beiden Seiten: Einleitung, Themensammlung, Interessen
 *    (STARTPAKET_PHASEN). Ohne die Gegenseite gibt es keine Interessenphase.
 * 3. Übergabe: bis zu KENNENLERN_ANZAHL Kennenlerngespräche à
 *    KENNENLERN_MINUTEN Minuten. Zur Wahl stehen die auf der Website
 *    vorgemerkten Profile und die Angebote, die Mediator:innen nach der
 *    Interessenphase abgeben.
 * 4. Vor der Übergabe stimmen beide Seiten zu (Datenschutz). Danach
 *    entscheiden sie: über medipact weiter (Sitzungen zum Stundensatz, über
 *    medipact abgerechnet), direkt mit der Mediatorin (sie rechnet selbst
 *    ab, medipact übergibt nur die Ergebnisse) oder pausieren.
 *
 * Das Online-Verfahren bleibt das Hauptangebot, das Starterpaket steht
 * daneben. In kerno heißt das Paket "starter" (app/pricing.py) – Preis und
 * Phasen dort gemeinsam mit diesen Werten ändern.
 */
export const KENNENLERN_ANZAHL = 3;
export const KENNENLERN_MINUTEN = 20;

export const STARTPAKET_NAME = "Digitales Starterpaket";

/** Festpreis des Starterpakets pro Fall – geteilt zwischen den Seiten. */
export const STARTPAKET_PREIS = "189 €";
/** Anteil je Seite bei zwei Beteiligten. */
export const STARTPAKET_ANTEIL = "94,50 €";
/** Wie der Preis fällig wird – ein Satz für alle Seiten. */
export const STARTPAKET_ZAHLUNG = `${STARTPAKET_PREIS} pro Fall, geteilt: ${STARTPAKET_ANTEIL} je Seite. Gezahlt wird erst, wenn die andere Seite Ihrer Einladung zugestimmt hat.`;
/** Für JSON-LD (Offer.price). */
export const STARTPAKET_PREIS_EUR = "189";

export const STARTPAKET_PHASEN = [
  {
    title: "Einladen und Einleitung",
    text: "Sie laden die andere Seite ein. Sagt sie zu, teilen Sie sich den Preis – dann klären Sie gemeinsam Anliegen, Ablauf und Vertraulichkeit.",
  },
  {
    title: "Themen sammeln",
    text: "Beide Seiten schreiben getrennt auf, was geklärt werden muss. Klare Fragen führen Sie durch, jede Seite in ihrem Tempo.",
  },
  {
    title: "Interessen herausarbeiten",
    text: "Was steckt hinter den Positionen? Bedürfnisse, Sorgen und das, was wirklich zählt – für beide Seiten gegenübergestellt.",
  },
  {
    title: "Übergabe an Ihre Mediatorin",
    text: `Beide Seiten stimmen der Übergabe zu. Dann bis zu ${KENNENLERN_ANZAHL} Kennenlerngespräche à ${KENNENLERN_MINUTEN} Minuten – die Person Ihrer Wahl übernimmt mit allem, was Sie erarbeitet haben.`,
  },
];

export const STARTPAKET_PUNKTE = [
  "Einleitung, Themensammlung und Interessen digital – mit beiden Seiten",
  `Bis zu ${KENNENLERN_ANZAHL} Kennenlerngespräche à ${KENNENLERN_MINUTEN} Minuten mit Mediator:innen Ihrer Wahl`,
  "Vorauswahl aus geprüften Profilen und Angebote passender Mediator:innen",
  "Übergabe der Ergebnisse an die Mediatorin, die Sie wählen – nur mit Zustimmung beider Seiten",
];

/** Was nach der Übergabe passiert – ein Satz für alle Seiten. */
export const STARTPAKET_DANACH =
  "Danach entscheiden Sie: über medipact weiter, die Sitzungen zum Stundensatz aus dem Profil geteilt abgerechnet – oder direkt mit Ihrer Mediatorin, die selbst abrechnet und von uns nur Ihre Ergebnisse bekommt. Oder Sie pausieren. Weitere Kosten entstehen erst, wenn Sie weitermachen.";

/** Ein Satz für Teaser und Meta-Beschreibungen. */
export const STARTPAKET_KURZ = `${STARTPAKET_NAME} für ${STARTPAKET_PREIS}: Themen und Interessen digital klären, dann bis zu ${KENNENLERN_ANZAHL} Mediator:innen kennenlernen`;

/** Höchstzahl vorgemerkter Profile – so viele, wie es Kennenlerngespräche gibt. */
export const MERKLISTE_MAX = KENNENLERN_ANZAHL;

/**
 * Starterpaket buchen. Registrierung bzw. Login, danach der Start-Flow in
 * kerno mit vorgewähltem Paket; `wunsch` trägt die auf der Website
 * vorgemerkten Profile (Slugs) in den Fall.
 */
export function starterpaketUrl(wunsch: string[] = []): string {
  const params = new URLSearchParams({ paket: "starter" });
  if (wunsch.length) params.set("wunsch", wunsch.slice(0, MERKLISTE_MAX).join(","));
  const ziel = `/dashboard/mediation/new?${params.toString()}`;
  return `${REGISTRIEREN_URL}?callbackUrl=${encodeURIComponent(ziel)}`;
}

export const STARTERPAKET_URL = starterpaketUrl();

/** Mediator:innen: Interesse an der Aufnahme in den Pool. */
export const MEDIATOREN_POOL_URL =
  "mailto:hallo@medipact.de?subject=" +
  encodeURIComponent("Aufnahme in den medipact-Mediatorenpool") +
  "&body=" +
  encodeURIComponent(
    "Name:\nAusbildung / Zertifizierung:\nSchwerpunkte:\nVor Ort (Region) und/oder per Video:\nWebsite oder Profil:\n",
  );
