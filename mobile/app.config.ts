import type { ConfigContext, ExpoConfig } from "expo/config";

// ── Ein Projekt, zwei Store-Apps ───────────────────────────────────────────
//
// Expo reicht den Inhalt von app.json als `config` herein; hier wird er je
// nach MEDIPACT_APP überschrieben. app.json bleibt damit die gemeinsame Basis
// (SDK-Einstellungen, Orientierung, Schema) und muss nur einmal gepflegt
// werden.
//
// Bauen:
//   MEDIPACT_APP=logbuch  eas build -p android --profile production
//   MEDIPACT_APP=kalender eas build -p android --profile production-kalender
//
// WICHTIG: Paket-ID und Slug MÜSSEN sich unterscheiden. Beides ist im Store
// unveränderlich – eine einmal veröffentlichte `de.medipact.kalender` lässt
// sich nie wieder umbenennen, und zwei Apps mit derselben ID überschreiben
// sich auf dem Gerät gegenseitig.

type Variante = "logbuch" | "kalender";

const variante: Variante =
  process.env.MEDIPACT_APP === "kalender" ? "kalender" : "logbuch";

const profile = {
  logbuch: {
    name: "medipact Logbuch",
    slug: "medipact-logbuch",
    paket: "de.medipact.logbuch",
    // Zwei Apps dürfen sich NICHT dasselbe URL-Schema teilen: unter iOS
    // entscheidet dann die Installationsreihenfolge, welche einen Link
    // bekommt – nicht reproduzierbar, nicht debugbar.
    schema: "medipact",
    icon: "./assets/icon-logbuch.png",
    adaptiv: "./assets/adaptive-logbuch.png",
  },
  kalender: {
    name: "medipact Kalender",
    slug: "medipact-kalender",
    paket: "de.medipact.kalender",
    schema: "medipact-kalender",
    icon: "./assets/icon-kalender.png",
    adaptiv: "./assets/adaptive-kalender.png",
  },
}[variante];

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: profile.name,
  slug: profile.slug,
  scheme: profile.schema,
  icon: profile.icon,
  // Der Splash ist für beide gleich: eine Wortmarke auf weißem Grund. Zwei
  // Startbilder wären Pflege ohne Gegenwert – sichtbar ist er unter zwei
  // Sekunden.
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    ...config.ios,
    bundleIdentifier: profile.paket,
    // Bewusst false, auch für den Kalender: `supportsTablet: true` verpflichtet
    // zu eigenen iPad-Screenshots in jeder Größe UND dazu, dass die App auf
    // dem iPad wirklich gut aussieht. Beides ist für Version 1 Aufwand ohne
    // Nutzer. Später ein Einzeiler.
    supportsTablet: false,
    infoPlist: {
      // OHNE diese Sätze lehnt Apple ab, sobald ein Modul die Berechtigung
      // anfragt – und expo-image-picker ist über package.json in BEIDEN
      // Varianten mit im Bundle, auch wenn der Kalender ihn nie aufruft.
      // Die Texte müssen den konkreten Zweck nennen; "wird für die App
      // benötigt" ist ein bekannter Ablehnungsgrund.
      NSPhotoLibraryUsageDescription:
        "Damit du Belege oder Fotos an einen Eintrag in deinem Logbuch anhängen kannst.",
      NSCameraUsageDescription:
        "Damit du ein Foto direkt aufnehmen und an einen Eintrag anhängen kannst.",
      // Erspart bei JEDEM Upload den Fragebogen zur Exportkontrolle. Die App
      // nutzt ausschließlich HTTPS – das fällt unter die Standardausnahme.
      ITSAppUsesNonExemptEncryption: false,
    },
    // Apple verweigert die Annahme, wenn die Nutzung der „Required Reason
    // APIs" nicht deklariert ist. Für die Expo-eigenen Module schreibt der
    // Build das selbst; hier stehen die, die über den Dateizugriff und den
    // SecureStore hereinkommen.
    privacyManifests: {
      NSPrivacyAccessedAPITypes: [
        {
          NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryFileTimestamp",
          NSPrivacyAccessedAPITypeReasons: ["C617.1"],
        },
        {
          NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryUserDefaults",
          NSPrivacyAccessedAPITypeReasons: ["CA92.1"],
        },
        {
          NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryDiskSpace",
          NSPrivacyAccessedAPITypeReasons: ["E174.1"],
        },
      ],
      // Nichts wird für Werbung oder Tracking verwendet – das ist bei einer
      // Mediations-App kein Detail, sondern das Versprechen.
      NSPrivacyTracking: false,
    },
  },
  android: {
    ...config.android,
    package: profile.paket,
    adaptiveIcon: {
      // Android schneidet das Symbol je nach Hersteller rund, quadratisch oder
      // als Kleeblatt zu. Der Vordergrund muss deshalb Luft am Rand haben –
      // die Bilder in assets/ sind entsprechend auf 66 % geschrumpft.
      foregroundImage: profile.adaptiv,
      backgroundColor: "#011018",
    },
  },
  extra: {
    ...config.extra,
    variante,
  },
});
