/**
 * Sitzungsdauer an EINER Stelle.
 *
 * Zwei Seiten müssen sich einig sein, sonst zeigt der Countdown im Header
 * etwas anderes an, als das Cookie tatsächlich tut:
 *   - auth.ts    → `session.maxAge` (Server: wann das JWT-Cookie ungültig wird)
 *   - SessionTimer → der sichtbare Countdown und der automatische Logout
 */
export const SESSION_MAX_AGE_SECONDS = 60 * 60; // 1 Stunde Inaktivität

/**
 * Schlüssel im localStorage, unter dem der Ablaufzeitpunkt (ms seit Epoch)
 * liegt. Bewusst geteilt: wer in Tab A weiterarbeitet, soll in Tab B nicht
 * ausgeloggt werden.
 */
export const SESSION_DEADLINE_STORAGE_KEY = "medipact:session-deadline";
