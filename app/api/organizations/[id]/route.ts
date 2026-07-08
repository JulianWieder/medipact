import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/organizations/[id] – Mandant inkl. Mitglieder
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await backendFetch<unknown>(`/organizations/${id}`, { method: "GET" });
  return NextResponse.json(result.data, { status: result.status });
}

// PATCH /api/organizations/[id] – Name/Plan ändern (nur Admin)
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
  const result = await backendFetch<unknown>(`/organizations/${id}`, {
    method: "PATCH",
    body,
  });
  return NextResponse.json(result.data, { status: result.status });
}

// DELETE /api/organizations/[id] – Mandant löschen (nur Admin)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await backendFetch<unknown>(`/organizations/${id}`, {
    method: "DELETE",
  });
  return NextResponse.json(result.data, { status: result.status });
}
