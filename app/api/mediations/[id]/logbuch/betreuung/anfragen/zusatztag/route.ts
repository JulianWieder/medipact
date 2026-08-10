import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/mediations/[id]/logbuch/betreuung/anfragen/zusatztag –
// einen zusätzlichen Betreuungstag erbitten. Der Termin entsteht sofort,
// wird aber erst mit der Zustimmung verbindlich.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const result = await backendFetch(
      `/mediations/${id}/logbuch/betreuung/anfragen/zusatztag`,
      { method: "POST", body },
    );
    return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
  } catch (error) {
    console.error("Betreuung Zusatztag error:", error);
    return NextResponse.json(
      { error: "Anfrage konnte nicht gestellt werden" },
      { status: 500 },
    );
  }
}
