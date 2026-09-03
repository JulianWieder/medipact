import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/admin/newsletter/campaigns/[id]/test – Testversand an eine Adresse
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const result = await backendFetch(`/newsletter/campaigns/${id}/test`, {
      method: "POST",
      body,
    });
    if (!result.ok) return NextResponse.json(result.data, { status: result.status });
    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json({ error: "Testversand fehlgeschlagen" }, { status: 500 });
  }
}
