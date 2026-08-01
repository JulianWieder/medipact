import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/mediations/[id]/logbuch/betreuung/termine/[terminId]/tausch –
// Betreuungszeiten-Tausch anfragen (nur geteilte Termine)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; terminId: string }> },
) {
  const { id, terminId } = await params;
  try {
    const body = await request.json();
    const result = await backendFetch(
      `/mediations/${id}/logbuch/betreuung/termine/${terminId}/tausch`,
      { method: "POST", body },
    );
    return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
  } catch (error) {
    console.error("Betreuung swap request error:", error);
    return NextResponse.json(
      { error: "Tausch-Anfrage fehlgeschlagen" },
      { status: 500 },
    );
  }
}
