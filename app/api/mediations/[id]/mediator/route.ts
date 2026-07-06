import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/mediations/[id]/mediator – Mediator des Falls zuordnen/wechseln
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let body: { user_id?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }
  const result = await backendFetch<unknown>(`/mediations/${id}/mediator`, {
    method: "POST",
    body: { user_id: body.user_id },
  });
  return NextResponse.json(result.data, { status: result.status });
}
