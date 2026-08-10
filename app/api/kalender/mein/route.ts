import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/kalender/mein – löst den Kalender der angemeldeten Person auf.
//
// Der Kalender hängt technisch noch am Konflikt-Logbuch (ein Buch je Person).
// Die Oberfläche soll davon nichts wissen müssen: sie fragt nach „meinem
// Kalender" und bekommt die ID. Wandern die Daten später aus der Mediation
// heraus, ändert sich nur diese eine Antwort.
export async function GET() {
  const result = await backendFetch("/kalender/mein");
  return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
}
