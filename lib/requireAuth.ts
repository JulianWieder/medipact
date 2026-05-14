/**
 * Server-side auth guard utility.
 * Use this in Next.js Route Handlers to enforce authentication.
 *
 * Usage:
 *   const authResult = await requireAuth();
 *   if (!authResult.ok) return authResult.response;
 *   // authResult.session is the NextAuth session
 */
import { auth } from "@/auth";
import { NextResponse } from "next/server";

type AuthSuccess = {
  ok: true;
  session: NonNullable<Awaited<ReturnType<typeof auth>>>;
};

type AuthFailure = {
  ok: false;
  response: NextResponse;
};

export async function requireAuth(): Promise<AuthSuccess | AuthFailure> {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 },
      ),
    };
  }

  return { ok: true, session };
}
