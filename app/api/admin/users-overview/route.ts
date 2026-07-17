import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/admin/users-overview → Backend: GET /auth/users/overview
// Nutzer inkl. ihrer Fälle in einer Antwort – für den Benutzer-Bereich.
export async function GET() {
  const result = await backendFetch("/auth/users/overview");
  if (!result.ok) return NextResponse.json(result.data, { status: result.status });
  return NextResponse.json(result.data);
}
