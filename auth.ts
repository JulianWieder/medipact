import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const API_BASE_URL = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";

// Anzahl Sekunden vor Ablauf, ab denen wir das Access-Token proaktiv erneuern.
const REFRESH_MARGIN_SECONDS = 60;

/**
 * Liest die "exp"-Claim (Unix-Sekunden) aus einem JWT, ohne die Signatur zu
 * prüfen — das Token kommt direkt vom eigenen Backend, eine Prüfung der
 * Signatur ist hier nicht nötig, wir wollen nur wissen, wann es abläuft.
 */
function getTokenExpiry(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8"),
    );
    return typeof decoded.exp === "number" ? decoded.exp : null;
  } catch {
    return null;
  }
}

async function refreshBackendToken(refreshToken: string): Promise<{
  backendAccessToken: string;
  backendRefreshToken: string;
  backendAccessTokenExpires: number | null;
} | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) {
      console.error("refreshBackendToken: refresh failed with status", res.status);
      return null;
    }

    const data = await res.json();

    return {
      backendAccessToken: data.access_token,
      backendRefreshToken: data.refresh_token,
      backendAccessTokenExpires: getTokenExpiry(data.access_token),
    };
  } catch (err) {
    console.error("refreshBackendToken: network error", err);
    return null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,

  pages: {
    signIn: "/auth/login",
  },

  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const email = String(credentials?.email ?? "");
        const password = String(credentials?.password ?? "");

        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        if (!res.ok) {
          return null;
        }

        const data = await res.json();

        return {
          id: String(data.user.id),
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          backendAccessToken: data.access_token,
          backendRefreshToken: data.refresh_token,
          backendAccessTokenExpires: getTokenExpiry(data.access_token),
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Initialer Login: Tokens aus authorize() übernehmen.
      if (user) {
        token.backendAccessToken = user.backendAccessToken;
        token.backendRefreshToken = user.backendRefreshToken;
        token.backendAccessTokenExpires = user.backendAccessTokenExpires;
        token.role = user.role;
        token.refreshError = undefined;
        return token;
      }

      const expires = token.backendAccessTokenExpires as number | null | undefined;
      const nowInSeconds = Math.floor(Date.now() / 1000);

      // Access-Token noch gültig (mit Sicherheitsmarge) → unverändert weiterreichen.
      if (
        typeof expires === "number" &&
        expires - REFRESH_MARGIN_SECONDS > nowInSeconds
      ) {
        return token;
      }

      // Access-Token abgelaufen oder läuft bald ab → versuchen, es per
      // Refresh-Token zu erneuern, statt den Nutzer auszusperren.
      const refreshToken = token.backendRefreshToken as string | undefined;

      if (!refreshToken) {
        token.refreshError = "RefreshTokenMissing";
        return token;
      }

      const refreshed = await refreshBackendToken(refreshToken);

      if (!refreshed) {
        // Refresh fehlgeschlagen (z. B. Refresh-Token ebenfalls abgelaufen) →
        // Nutzer muss sich neu einloggen. backendFetch erkennt das Flag und
        // beendet die Session.
        token.refreshError = "RefreshAccessTokenError";
        return token;
      }

      token.backendAccessToken = refreshed.backendAccessToken;
      token.backendRefreshToken = refreshed.backendRefreshToken;
      token.backendAccessTokenExpires = refreshed.backendAccessTokenExpires;
      token.refreshError = undefined;

      return token;
    },

    async session({ session, token }) {
      session.backendAccessToken = token.backendAccessToken as string;
      session.error = token.refreshError as string | undefined;

      if (session.user) {
        session.user.role = token.role as string;
      }

      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
});
