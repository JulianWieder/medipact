import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/mediations/[id]/logbuch/betreuung/verlauf?limit=… – die letzten
// Absprache-Ereignisse über ALLE Termine. Der Verlauf je einzelnem Termin liegt
// unter …/termine/[terminId]/verlauf.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const limit = request.nextUrl.searchParams.get("limit") ?? "50";
  const result = await backendFetch(
    `/mediations/${id}/logbuch/betreuung/verlauf?limit=${encodeURIComponent(limit)}`,
  );
  return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
}
