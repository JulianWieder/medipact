/**
 * Zusatzbaustein „Mediator:in vermitteln" (/mediator-finden, /fuer-mediatoren).
 *
 * Das Online-Verfahren bleibt das Hauptangebot. Dieser Baustein ist der
 * zusätzliche Weg für alle, die eine klassische Mediation mit einer
 * persönlichen Mediatorin oder einem Mediator wollen (vor Ort oder per Video).
 * medipact vermittelt, die Mediation führt die externe Mediatorin.
 *
 * Seit 25.10.2026 laeuft die Kundenanfrage in kerno (app.medipact.de,
 * Bereich „Anfragen", Vorgangsart `vermittlung`): Registrierung bzw. Login,
 * danach direkt in die Anfragen. Einrichtung dort mit
 * `scripts/vermittlung_einrichten.py --mandant medipact --fach mediation`.
 * Die Aufnahme in den Pool bleibt eine Mail, die ist kein Selbstbedienungsweg.
 */

import { REGISTRIEREN_URL } from "@/lib/nutzerbereich";

/**
 * Das Modell der persönlichen Mediation – EINE Quelle für alle Seiten
 * (/mediator-finden, Profilseiten, /preise, /fuer-mediatoren, Hinweis auf
 * den Konflikt-Seiten). Entschieden am 29.10.2026:
 *
 * 1. Bezahlt wird am Anfang: das Startpaket.
 * 2. Darin: die geführte Einleitung bei medipact und bis zu
 *    KENNENLERN_ANZAHL Kennenlerngespräche à KENNENLERN_MINUTEN Minuten mit
 *    Mediator:innen eigener Wahl.
 * 3. Danach Mediation mit der gewählten Person, abgerechnet über medipact
 *    zu ihrem Stundensatz.
 *
 * Wer etwas davon ändert, ändert es hier – die Texte lesen diese Werte.
 */
export const KENNENLERN_ANZAHL = 3;
export const KENNENLERN_MINUTEN = 15;

/**
 * Festpreis des Startpakets, z. B. "99 €". Noch nicht entschieden: Solange
 * hier null steht, zeigen die Seiten „Festpreis, vor der Buchung sichtbar".
 */
export const STARTPAKET_PREIS: string | null = null;

export const STARTPAKET_PUNKTE = [
  "Geführte Einleitung: Anliegen, Ablauf und Vertraulichkeit klären",
  `Bis zu ${KENNENLERN_ANZAHL} Kennenlerngespräche à ${KENNENLERN_MINUTEN} Minuten mit Mediator:innen Ihrer Wahl`,
  "Termine aus den freien Zeiten buchen, mit Erinnerung",
  "Unterlagen vorab teilen, nur für Ihre Mediatorin sichtbar",
];

/** Ein Satz für Teaser und Meta-Beschreibungen. */
export const STARTPAKET_KURZ = `Startpaket mit Einleitung und bis zu ${KENNENLERN_ANZAHL} Kennenlerngesprächen à ${KENNENLERN_MINUTEN} Minuten`;

/**
 * Kund:innen: Anfrage für eine persönliche Mediation. Die Registrierung
 * reicht callbackUrl an den Login weiter; wer schon ein Konto hat, wechselt
 * dort auf „Anmelden" und landet ebenfalls in den Anfragen.
 */
export const MEDIATOR_ANFRAGE_URL = `${REGISTRIEREN_URL}?callbackUrl=${encodeURIComponent("/dashboard/anfragen")}`;

/** Mediator:innen: Interesse an der Aufnahme in den Pool. */
export const MEDIATOREN_POOL_URL =
  "mailto:hallo@medipact.de?subject=" +
  encodeURIComponent("Aufnahme in den medipact-Mediatorenpool") +
  "&body=" +
  encodeURIComponent(
    "Name:\nAusbildung / Zertifizierung:\nSchwerpunkte:\nVor Ort (Region) und/oder per Video:\nWebsite oder Profil:\n",
  );
