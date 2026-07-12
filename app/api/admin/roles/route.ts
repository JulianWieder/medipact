import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/admin/roles → Backend: GET /auth/roles
// Liefert die vom aktuellen Nutzer vergebbaren Rollen + Anzeige-Labels.
export async function GET() {
  const result = await backendFetch("/auth/roles");
  if (!result.ok) return NextResponse.json(result.data, { status: result.status });
  return NextResponse.json(result.data);
}
