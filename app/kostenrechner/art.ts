import {
  KONFLIKTARTEN,
  mitPreisen,
  type Konfliktart,
  type KonfliktartInfo,
  type PreisOverlay,
} from "@/lib/kostenrecht";

/**
 * ?art= belegt die Konfliktart vor. Gesetzt wird der Parameter von den
 * Konfliktarten-Seiten (KostenrechnerHinweis) und vom Einbettungscode auf
 * /fuer-berater – ein unbekannter oder fehlender Wert fällt still auf die
 * Voreinstellung zurück, damit sich über die URL keine kaputten Zustände
 * erzeugen lassen.
 *
 * Kein Einfluss auf Indexierung: pageMetadata setzt das Canonical fest auf
 * /kostenrechner, die Parameter-Varianten kanonisieren also auf die
 * Hauptseite und verwässern sie nicht.
 */
export function artParsen(wert?: string | string[]): Konfliktart | undefined {
  const eins = Array.isArray(wert) ? wert[0] : wert;
  return KONFLIKTARTEN.some((k) => k.key === eins)
    ? (eins as Konfliktart)
    : undefined;
}

/**
 * Günstigste Konfliktart für das "ab X €" im Antwortblock. Live-Preise aus
 * GET /pricing/matrix, ohne Backend die Fallback-Werte aus KONFLIKTARTEN —
 * so steht der Satz auch im Server-HTML, nie ein hart geschriebener Preis.
 */
export function einstieg(preise?: PreisOverlay): KonfliktartInfo {
  return mitPreisen(preise).reduce((a, b) => (b.preis < a.preis ? b : a));
}
