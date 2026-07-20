import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/mediations/[id]/logbuch/convert – Logbuch in Mediation umwandeln
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await backendFetch(`/mediations/${id}/logbuch/convert`, {
    method: "POST",
  });
  if (!result.ok) {
    return NextResponse.json(result.data, { status: result.status });
  }
  return NextResponse.json(result.data);
}
