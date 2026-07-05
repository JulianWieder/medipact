import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/mediations/[id]/discount  – Rabattcode auf eigenen Anteil anwenden
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let body: { code?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }
  const result = await backendFetch<unknown>(`/mediations/${id}/discount`, {
    method: "POST",
    body: { code: body.code ?? "" },
  });
  return NextResponse.json(result.data, { status: result.status });
}

// DELETE /api/mediations/[id]/discount – angewendeten Rabattcode entfernen
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await backendFetch<unknown>(`/mediations/${id}/discount`, {
    method: "DELETE",
  });
  return NextResponse.json(result.data, { status: result.status });
}
