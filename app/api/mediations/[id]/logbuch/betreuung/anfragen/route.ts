import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/mediations/[id]/logbuch/betreuung/anfragen – alle offenen Absprachen
// dieses Kalenders, unabhängig vom angezeigten Monat. Ohne diesen Weg findet
// man eine Bitte der Gegenseite nur beim Blättern (routers/kalender.py).
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await backendFetch(
    `/mediations/${id}/logbuch/betreuung/anfragen`,
  );
  return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
}
