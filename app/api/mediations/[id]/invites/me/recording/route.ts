import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/mediations/[id]/invites/me/recording
// Liefert der eingeladenen Person nach Annahme den Google-Meet-Aufnahme-Link
// + Transkript ihrer persönlichen Botschaft (Aufnahme liegt in Google Drive).
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const result = await backendFetch<unknown>(
    `/mediations/${id}/invites/me/recording`,
    { method: "GET" },
  );

  return NextResponse.json(result.data, { status: result.status });
}
