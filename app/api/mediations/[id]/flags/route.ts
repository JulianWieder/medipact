import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/mediations/[id]/flags
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await backendFetch(`/mediations/${id}/flags`);
  if (!result.ok) return NextResponse.json(result.data, { status: result.status });
  return NextResponse.json(result.data);
}

// PUT /api/mediations/[id]/flags  { flags: {...} }
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const result = await backendFetch(`/mediations/${id}/flags`, { method: "PUT", body });
    if (!result.ok) return NextResponse.json(result.data, { status: result.status });
    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json({ error: "Flags konnten nicht gesetzt werden" }, { status: 500 });
  }
}
