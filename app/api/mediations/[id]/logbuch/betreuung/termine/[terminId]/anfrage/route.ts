import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/mediations/[id]/logbuch/betreuung/termine/[terminId]/anfrage –
// um Tausch, Absage oder Verschiebung eines geteilten Termins bitten
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; terminId: string }> },
) {
  const { id, terminId } = await params;
  try {
    const body = await request.json();
    const result = await backendFetch(
      `/mediations/${id}/logbuch/betreuung/termine/${terminId}/anfrage`,
      { method: "POST", body },
    );
    return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
  } catch (error) {
    console.error("Betreuung Anfrage error:", error);
    return NextResponse.json({ error: "Anfrage fehlgeschlagen" }, { status: 500 });
  }
}

// DELETE …/anfrage – die eigene, noch offene Anfrage zurückziehen
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; terminId: string }> },
) {
  const { id, terminId } = await params;
  const result = await backendFetch(
    `/mediations/${id}/logbuch/betreuung/termine/${terminId}/anfrage`,
    { method: "DELETE" },
  );
  return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
}
