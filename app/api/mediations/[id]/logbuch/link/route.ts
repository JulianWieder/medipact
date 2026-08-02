import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/mediations/[id]/logbuch/link – ganzes Logbuch mit einem Fall
// verknüpfen (Body: { mediation_id: number | null, apply_to_existing?: boolean }).
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const result = await backendFetch(`/mediations/${id}/logbuch/link`, {
      method: "POST",
      body,
    });
    if (!result.ok) {
      return NextResponse.json(result.data, { status: result.status });
    }
    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Logbuch link error:", error);
    return NextResponse.json(
      { error: "Verknüpfung konnte nicht gespeichert werden" },
      { status: 500 },
    );
  }
}
