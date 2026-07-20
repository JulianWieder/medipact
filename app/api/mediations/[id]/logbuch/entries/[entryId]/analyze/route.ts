import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/mediations/[id]/logbuch/entries/[entryId]/analyze
// KI-Analyse eines Eintrags: nächste Schritte + psychologischer Tipp.
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; entryId: string }> },
) {
  const { id, entryId } = await params;
  const result = await backendFetch(
    `/mediations/${id}/logbuch/entries/${entryId}/analyze`,
    { method: "POST" },
  );
  return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
}
