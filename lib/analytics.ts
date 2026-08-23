/**
 * Duenne Huelle um gtag.
 *
 * Alles hier ist bewusst still: Ohne Einwilligung laedt
 * `app/components/Analytics.tsx` gar kein Google-Tag, `window.gtag` existiert
 * dann nicht — und `trackEvent` tut schlicht nichts. Kein Puffer, keine
 * Nachmeldung nach spaeterer Zustimmung: Was ohne Einwilligung passiert,
 * wird nicht gemessen. Das ist die Bedingung dafuer, dass die Messung ueberall
 * im Code aufgerufen werden darf, ohne dass jede Stelle den Consent kennt.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type EventParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

/**
 * Freie Betraege zerfasern die GA4-Berichte in hunderte Auspraegungen — fuer
 * die Auswertung zaehlt die Groessenordnung, nicht der Euro.
 */
export function betragsStufe(betrag: number): string {
  if (!Number.isFinite(betrag) || betrag <= 0) return "keine";
  if (betrag < 2500) return "unter_2500";
  if (betrag < 5000) return "2500_5000";
  if (betrag < 10000) return "5000_10000";
  if (betrag < 25000) return "10000_25000";
  return "ueber_25000";
}
