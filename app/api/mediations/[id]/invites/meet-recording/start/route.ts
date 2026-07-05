import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/mediations/[id]/invites/meet-recording/start
// Legt im Backend einen Google-Meet-Raum an, der die Einladungs-Botschaft
// automatisch aufnimmt, und gibt token + join_url zurück.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: { kind?: string };
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const result = await backendFetch<unknown>(
    `/mediations/${id}/invites/meet-recording/start`,
    { method: "POST", body: { kind: body.kind ?? "video" } },
  );

  return NextResponse.json(result.data, { status: result.status });
}
