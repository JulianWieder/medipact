import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/mediations/[id]/invites/message/generate
// Erzeugt aus einer kurzen Beschreibung des Nutzers einen professionellen
// Einladungstext, eine Überschrift und einen Fall-Titel-Vorschlag (per Claude).
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: { description?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  if (!body.description || !body.description.trim()) {
    return NextResponse.json({ error: "Bitte zuerst kurz beschreiben, worum es geht." }, { status: 400 });
  }

  const result = await backendFetch<{ message: string; subject: string; title: string }>(
    `/mediations/${id}/invites/message/generate`,
    { method: "POST", body: { description: body.description } },
  );

  return NextResponse.json(result.data, { status: result.status });
}
