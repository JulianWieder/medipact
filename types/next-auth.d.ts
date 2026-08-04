import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    backendAccessToken?: string;
    /** Gesetzt, wenn das Backend-Token nicht erneuert werden konnte — Nutzer muss sich neu einloggen. */
    error?: string;
    user: {
      role?: string;
      /**
       * Einmaliges Nutzer-Onboarding abgeschlossen? Steht im JWT, damit die
       * Middleware ohne Backend-Call entscheiden kann (siehe middleware.ts).
       * Nach dem Abschluss aktualisiert der Client die Session per update().
       */
      onboardingCompleted?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    backendAccessToken?: string;
    backendRefreshToken?: string;
    backendAccessTokenExpires?: number | null;
    role?: string;
    onboardingCompleted?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendAccessToken?: string;
    backendRefreshToken?: string;
    backendAccessTokenExpires?: number | null;
    refreshError?: string;
    role?: string;
    onboardingCompleted?: boolean;
  }
}
