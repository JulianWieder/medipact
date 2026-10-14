/**
 * Zentrale Links auf das eigenständige Konflikt-Logbuch (seit Okt. 2026
 * unter logbuch.medipact.de, getrennt von medipact).
 *
 * Die QR-Codes in public/logbuch/ sind fest gedruckt:
 *   qr-web.svg → https://logbuch.medipact.de/
 *   qr-app.svg → https://medipact.de/logbuch-app (Weiterleitung, app/logbuch-app/route.ts)
 * Deshalb hier nur die Ziel-URLs pflegen – die QR-Codes bleiben gültig.
 */
export const LOGBUCH_WEB_URL = "https://logbuch.medipact.de/";

/** App-Store-Link der iOS-App "medipact Logbuch" (de.medipact.logbuch).
 *  Leer = App noch nicht live → Hinweise zeigen "bald im App Store". */
export const LOGBUCH_APP_STORE_URL = "";

/** Google-Play-Link, sobald die Android-App live ist. */
export const LOGBUCH_PLAY_STORE_URL = "";

/** Stabile Kurz-URL hinter dem App-QR-Code. */
export const LOGBUCH_APP_REDIRECT_PATH = "/logbuch-app";
