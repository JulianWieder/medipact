import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/onboarding/complete → Backend: POST /onboarding/complete
//
// Das Backend lehnt mit 400 ab, wenn noch Pflichtangaben fehlen, und liefert
// dann detail.missing + detail.resume_step_key mit. Der Client springt damit
// gezielt zum fehlenden Schritt, statt nur „Fehler" anzuzeigen.
export async function POST() {
  const result = await backendFetch("/onboarding/complete", { method: "POST" });
  return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
}
