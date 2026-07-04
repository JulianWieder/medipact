import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/mediations/[id]/summarize-results
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json().catch(() => ({}));
    const result = await backendFetch(`/mediations/${id}/summarize-results`, {
      method: "POST",
      body,
    });

    if (!result.ok) {
      return NextResponse.json(result.data, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Summarize results error:", error);
    return NextResponse.json(
      { error: "Zusammenfassung konnte nicht erstellt werden" },
      { status: 500 },
    );
  }
}
