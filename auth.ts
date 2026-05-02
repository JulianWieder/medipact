import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
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

        const res = await fetch("http://127.0.0.1:8000/auth/login", {
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
          id: email,
          name: email,
          email,
          accessToken: data.access_token,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
});
