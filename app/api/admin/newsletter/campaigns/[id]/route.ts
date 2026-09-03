import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/admin/newsletter/campaigns/[id] – inkl. fehlgeschlagener Zustellungen
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await backendFetch(`/newsletter/campaigns/${id}`);
  if (!result.ok) return NextResponse.json(result.data, { status: result.status });
  return NextResponse.json(result.data);
}

// PATCH /api/admin/newsletter/campaigns/[id] – nur Entwürfe sind änderbar
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const result = await backendFetch(`/newsletter/campaigns/${id}`, {
      method: "PATCH",
      body,
    });
    if (!result.ok) return NextResponse.json(result.data, { status: result.status });
    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json(
      { error: "Entwurf konnte nicht gespeichert werden" },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/newsletter/campaigns/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await backendFetch(`/newsletter/campaigns/${id}`, {
    method: "DELETE",
  });
  if (!result.ok) return NextResponse.json(result.data, { status: result.status });
  return NextResponse.json(result.data);
}
