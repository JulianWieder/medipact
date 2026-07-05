import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// PATCH /api/discount-codes/[id] – Rabattcode ändern (z.B. deaktivieren)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }
  const result = await backendFetch<unknown>(`/discount-codes/${id}`, {
    method: "PATCH",
    body,
  });
  return NextResponse.json(result.data, { status: result.status });
}

// DELETE /api/discount-codes/[id] – Rabattcode löschen
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await backendFetch<unknown>(`/discount-codes/${id}`, {
    method: "DELETE",
  });
  return NextResponse.json(result.data, { status: result.status });
}
