import { NextResponse, type NextRequest } from "next/server";
import { findeOrt } from "@/lib/geo";

// Umkreissuche im Verzeichnis (MediatorenVerzeichnis.tsx): PLZ oder Ort →
// Koordinaten. Die Geodaten bleiben auf dem Server (lib/geo.ts), der
// Browser bekommt nur den einen Treffer. Nichts wird gespeichert.
export function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").slice(0, 80);
  const ort = findeOrt(q);
  if (!ort) return NextResponse.json(null, { status: 404 });
  const plz = q.match(/\b\d{5}\b/)?.[0];
  return NextResponse.json(
    { ...ort, label: plz ? `${plz} ${ort.name}` : ort.name },
    { headers: { "cache-control": "public, max-age=86400" } },
  );
}
