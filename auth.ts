import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const API_BASE_URL = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";

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
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.backendAccessToken = user.backendAccessToken;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      session.backendAccessToken = token.backendAccessToken as string;

      if (session.user) {
        session.user.role = token.role as string;
      }

      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
});
