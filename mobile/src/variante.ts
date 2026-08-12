// ── Zwei Store-Apps aus einer Codebasis ────────────────────────────────────
//
// „medipact Logbuch" und „medipact Kalender" sind im Play Store / App Store
// zwei getrennte Einträge mit eigenem Namen, eigenem Symbol und eigener
// Paket-ID – aber sie teilen sich diesen Ordner.
//
// Warum nicht zwei Projekte? Weil der Kalender (CareCalendarScreen, 800
// Zeilen), der Login, der API-Client und das gesamte UI-Set in beiden
// steckten. Zwei Ordner heißt: jede Korrektur am Betreuungskalender muss
// zweimal gemacht werden, und beim ersten Mal, wo sie es nicht wird, laufen
// die Apps auseinander – zulasten genau der Eltern, die je eine davon haben.
//
// Umgeschaltet wird beim BAUEN über die Umgebungsvariable MEDIPACT_APP
// (siehe app.config.ts und eas.json). Zur Laufzeit steht das Ergebnis in
// expoConfig.extra.variante.
import Constants from "expo-constants";

export type Variante = "logbuch" | "kalender";

export const VARIANTE: Variante =
  (Constants.expoConfig?.extra?.variante as Variante | undefined) ?? "logbuch";

export const istKalenderApp = VARIANTE === "kalender";
