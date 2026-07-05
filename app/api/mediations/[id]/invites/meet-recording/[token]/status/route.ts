import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/mediations/[id]/invites/meet-recording/[token]/status
// Pollt den Aufnahme-Status (pending|recording|processing|ready) und liefert
// bei "ready" den Drive-Playback-Link + Transkript.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; token: string }> },
) {
  const { id, token } = await params;

  const result = await backendFetch<unknown>(
    `/mediations/${id}/invites/meet-recording/${token}/status`,
    { method: "GET" },
  );

  return NextResponse.json(result.data, { status: result.status });
}
