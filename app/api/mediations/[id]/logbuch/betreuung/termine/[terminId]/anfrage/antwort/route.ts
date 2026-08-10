import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/mediations/[id]/logbuch/betreuung/termine/[terminId]/anfrage/antwort –
// zustimmen, ablehnen oder einen Gegenvorschlag machen (nur die Gegenseite)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; terminId: string }> },
) {
  const { id, terminId } = await params;
  try {
    const body = await request.json();
    const result = await backendFetch(
      `/mediations/${id}/logbuch/betreuung/termine/${terminId}/anfrage/antwort`,
      { method: "POST", body },
    );
    return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
  } catch (error) {
    console.error("Betreuung Antwort error:", error);
    return NextResponse.json({ error: "Antwort fehlgeschlagen" }, { status: 500 });
  }
}
