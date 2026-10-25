/**
 * Zusatzbaustein „Mediator:in vermitteln" (/mediator-finden, /fuer-mediatoren).
 *
 * Das Online-Verfahren bleibt das Hauptangebot. Dieser Baustein ist der
 * zusätzliche Weg für alle, die eine klassische Mediation mit einer
 * persönlichen Mediatorin oder einem Mediator wollen (vor Ort oder per Video).
 * medipact vermittelt, die Mediation führt die externe Mediatorin.
 *
 * Anfrage, Zuordnung, Buchung, Upload und Zahlung entstehen als Modul in
 * kerno. Bis das steht, landen beide Wege per Mail im Team-Postfach. Beim
 * Umschalten nur die beiden URLs hier ersetzen, die Seiten bleiben gleich.
 */

/**
 * Festpreis des Erstgesprächs, z. B. "149 €". Noch nicht entschieden: Solange
 * hier null steht, zeigt /preise „Festpreis, vor der Buchung sichtbar" statt
 * einer Zahl. Beim Festlegen auch die FAQ in mediatorFindenPage.ts nachziehen.
 */
export const ERSTGESPRAECH_PREIS: string | null = null;

/** Kund:innen: Anfrage für eine persönliche Mediation. */
export const MEDIATOR_ANFRAGE_URL =
  "mailto:hallo@medipact.de?subject=" +
  encodeURIComponent("Anfrage: Mediator:in vermitteln") +
  "&body=" +
  encodeURIComponent(
    "Konfliktart:\nBeteiligte (wer, wie viele):\nVor Ort (Ort/PLZ) oder per Video:\nWunschzeitraum für das Erstgespräch:\n",
  );

/** Mediator:innen: Interesse an der Aufnahme in den Pool. */
export const MEDIATOREN_POOL_URL =
  "mailto:hallo@medipact.de?subject=" +
  encodeURIComponent("Aufnahme in den medipact-Mediatorenpool") +
  "&body=" +
  encodeURIComponent(
    "Name:\nAusbildung / Zertifizierung:\nSchwerpunkte:\nVor Ort (Region) und/oder per Video:\nWebsite oder Profil:\n",
  );
