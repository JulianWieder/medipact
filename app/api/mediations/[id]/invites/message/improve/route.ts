import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/mediations/[id]/invites/message/improve
// Lässt einen (oft aus der Video-Transkription stammenden) Nachrichtentext per
// Claude glätten -- ausgelöst durch den "Mit KI verbessern"-Button im Einladungsformular.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: { text?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  if (!body.text || !body.text.trim()) {
    return NextResponse.json({ error: "text fehlt" }, { status: 400 });
  }

  const result = await backendFetch<{ text: string }>(
    `/mediations/${id}/invites/message/improve`,
    {
      method: "POST",
      body: { text: body.text },
    },
  );

  return NextResponse.json(result.data, { status: result.status });
}
