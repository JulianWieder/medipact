import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/konto/loeschung – was passiert, wenn ich jetzt lösche?
//
// Wird VOR der Bestätigung angezeigt. Die Antwort trennt die beiden Fälle
// (sofort löschbar vs. laufendes Verfahren) und liefert die Sätze gleich mit,
// die dazu auf dem Bildschirm stehen müssen.
export async function GET() {
  const result = await backendFetch("/konto/loeschung");
  return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
}
