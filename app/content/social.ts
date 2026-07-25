// ── Social-Profile (Single Source of Truth) ─────────────────────────────────
//
// Wird an zwei Stellen verwendet:
//   1. Footer.tsx  → sichtbare Icon-Links
//   2. layout.tsx  → Organization-JSON-LD (`sameAs`)
//
// Warum zusammengelegt: vorher behauptete das Schema ein Twitter-Profil
// (`sameAs: https://twitter.com/medipact_de`), während die Footer-Links auf
// `#` zeigten. Ein `sameAs` auf ein Profil, das nicht existiert oder nicht
// verlinkt ist, ist ein kaputtes Entity-Signal — Google kann die Marke dann
// nicht mit einem echten Profil zusammenführen.
//
// Die Liste ist bewusst leer: lieber gar kein Profil-Signal als ein falsches.
//
// TODO(Julian): sobald ein Profil wirklich existiert und öffentlich ist, hier
// eintragen — Footer-Icon und `sameAs` erscheinen dann automatisch.
// Beispiel:
//   { name: "LinkedIn", url: "https://www.linkedin.com/company/medipact" },

export type SocialNetwork = "Twitter" | "LinkedIn";

export type SocialProfile = {
  name: SocialNetwork;
  /** Absolute, öffentlich erreichbare Profil-URL. */
  url: string;
};

export const socialProfiles: SocialProfile[] = [];
