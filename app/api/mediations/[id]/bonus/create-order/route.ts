import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/mediations/[id]/bonus/create-order  { block_id }
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const result = await backendFetch(`/mediations/${id}/bonus/create-order`, {
      method: "POST",
      body,
    });
    if (!result.ok) return NextResponse.json(result.data, { status: result.status });
    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json({ error: "Bonus-Order fehlgeschlagen" }, { status: 500 });
  }
}
