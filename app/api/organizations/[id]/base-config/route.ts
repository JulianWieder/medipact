import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/organizations/[id]/base-config – Grundkonfiguration (Blöcke + Werte + Akzeptanz)
export async function GET(_r: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await backendFetch<unknown>(`/organizations/${id}/base-config`, { method: "GET" });
  return NextResponse.json(result.data, { status: result.status });
}

// PUT /api/organizations/[id]/base-config – Antworten speichern (merge)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const result = await backendFetch<unknown>(`/organizations/${id}/base-config`, {
    method: "PUT",
    body,
  });
  return NextResponse.json(result.data, { status: result.status });
}
