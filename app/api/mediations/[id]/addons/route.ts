import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// PUT /api/mediations/[id]/addons – Add-on-Auswahl der eigenen Partei setzen
// (Einstiegs-Tarif Nachbarschaft/WG/Verbraucher; ersetzt die bisherige Auswahl).
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let body: { keys?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }
  const result = await backendFetch<unknown>(`/mediations/${id}/addons`, {
    method: "PUT",
    body: { keys: body.keys ?? [] },
  });
  return NextResponse.json(result.data, { status: result.status });
}
