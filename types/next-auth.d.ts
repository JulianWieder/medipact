import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    backendAccessToken?: string;
    /** Gesetzt, wenn das Backend-Token nicht erneuert werden konnte — Nutzer muss sich neu einloggen. */
    error?: string;
    user: {
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    backendAccessToken?: string;
    backendRefreshToken?: string;
    backendAccessTokenExpires?: number | null;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendAccessToken?: string;
    backendRefreshToken?: string;
    backendAccessTokenExpires?: number | null;
    refreshError?: string;
    role?: string;
  }
}
