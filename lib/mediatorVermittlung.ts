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
 * Festpreis des Erstgesprächs, z. B. "149 €". Noch nicht entschieden: Solange
 * hier null steht, zeigt /preise „Festpreis, vor der Buchung sichtbar" statt
 * einer Zahl. Beim Festlegen auch die FAQ in mediatorFindenPage.ts nachziehen.
 */
export const ERSTGESPRAECH_PREIS: string | null = null;

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
