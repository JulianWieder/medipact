import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/mediations/[id]/logbuch/betreuung/termine/[terminId]/verlauf –
// Vorgeschichte einer Absprache: wer hat wann was vorgeschlagen
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; terminId: string }> },
) {
  const { id, terminId } = await params;
  const result = await backendFetch(
    `/mediations/${id}/logbuch/betreuung/termine/${terminId}/verlauf`,
  );
  return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
}
