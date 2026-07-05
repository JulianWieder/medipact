import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/mediations/[id]/invite-settings
// Liefert der Einladungsseite den Video-Modus (optional|required|off) für die
// Mediationsart dieses Falls. Für Teilnehmer zugänglich.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await backendFetch(`/mediations/${id}/invite-settings`);
  return NextResponse.json(result.data, { status: result.status });
}
