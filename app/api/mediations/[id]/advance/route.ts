import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { backendFetch } from "@/lib/backend";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requireAuth();

  if (!authResult.ok) {
    return authResult.response;
  }

  const { id } = await params;

  const result = await backendFetch(`/mediations/${id}/advance`, {
    method: "POST",
  });

  return NextResponse.json(result.data, { status: result.status });
}
