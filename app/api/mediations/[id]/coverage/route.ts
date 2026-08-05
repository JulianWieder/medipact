import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/mediations/[id]/coverage – Anteil einer anderen Partei freiwillig
// übernehmen (gebündelt in den eigenen, noch offenen Betrag) oder widerrufen.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let body: { participant_id?: number; cover?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }
  if (typeof body.participant_id !== "number") {
    return NextResponse.json({ error: "participant_id fehlt" }, { status: 400 });
  }
  const result = await backendFetch<unknown>(`/mediations/${id}/coverage`, {
    method: "POST",
    body: { participant_id: body.participant_id, cover: body.cover !== false },
  });
  return NextResponse.json(result.data, { status: result.status });
}
