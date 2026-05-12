import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    backendAccessToken?: string;
    user: {
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    backendAccessToken?: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendAccessToken?: string;
    role?: string;
  }
}
