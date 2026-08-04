import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/onboarding/steps → Backend: GET /onboarding/steps
//
// Liefert Schritte, eigene Antworten, Profilwerte und den Wiedereinstiegspunkt
// (resume_step_key) in EINEM Aufruf. Bewusst nicht aufgeteilt: die Seite
// braucht immer alle Teile, und getrennte Requests waren im Fall-Flow schon
// die Ursache für flackernde Zwischenzustände.
export async function GET() {
  const result = await backendFetch("/onboarding/steps");
  return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
}
