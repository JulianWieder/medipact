import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/mediations/packages/[type]
// Angebotene Pakete + Grundpreise für einen Konflikttyp (Paketwahl im Wizard).
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ type: string }> },
) {
  const { type } = await params;
  const result = await backendFetch<unknown>(`/mediations/packages/${type}`, {
    method: "GET",
  });
  return NextResponse.json(result.data, { status: result.status });
}
