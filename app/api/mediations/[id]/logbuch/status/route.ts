import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/mediations/[id]/logbuch/status – Stufe (free/premium) + Kontingente
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await backendFetch(`/mediations/${id}/logbuch/status`);
  return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
}
