import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/mediations/[id]/logbuch/kinder – Kinder des Kalenders.
// Sichtbar für alle Beteiligten (auch den Kind-Zugang): ein Kind ist kein
// Inhalt, den man voreinander verbergen könnte. Siehe routers/kalender.py.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await backendFetch(`/mediations/${id}/logbuch/kinder`);
  return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
}

// POST /api/mediations/[id]/logbuch/kinder – Kind anlegen
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const result = await backendFetch(`/mediations/${id}/logbuch/kinder`, {
      method: "POST",
      body,
    });
    return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
  } catch (error) {
    console.error("Kind anlegen fehlgeschlagen:", error);
    return NextResponse.json(
      { error: "Kind konnte nicht angelegt werden" },
      { status: 500 },
    );
  }
}
