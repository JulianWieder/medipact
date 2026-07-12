import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/organizations/[id]/base-config/accept – Grundkonfiguration akzeptieren
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const result = await backendFetch<unknown>(`/organizations/${id}/base-config/accept`, {
    method: "POST",
    body,
  });
  return NextResponse.json(result.data, { status: result.status });
}
