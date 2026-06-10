import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/auth/me/role → Backend: GET /auth/me/role
// Gibt Rolle und Admin-Status des eingeloggten Nutzers zurück.
export async function GET() {
  const result = await backendFetch("/auth/me/role");

  if (!result.ok) {
    return NextResponse.json(result.data, { status: result.status });
  }

  return NextResponse.json(result.data);
}
