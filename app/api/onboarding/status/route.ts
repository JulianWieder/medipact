import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/onboarding/status → Backend: GET /onboarding/status
//
// Schlanke Variante ohne Blöcke und Antworten – für Header-Badge und die
// Prüfung nach dem Login. Wird pro Seitenaufruf angefragt, deshalb bewusst
// klein gehalten.
export async function GET() {
  const result = await backendFetch("/onboarding/status");
  return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
}
