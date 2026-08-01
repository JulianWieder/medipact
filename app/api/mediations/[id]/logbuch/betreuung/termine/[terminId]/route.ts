import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// PATCH /api/mediations/[id]/logbuch/betreuung/termine/[terminId] – Termin ändern
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; terminId: string }> },
) {
  const { id, terminId } = await params;
  try {
    const body = await request.json();
    const result = await backendFetch(
      `/mediations/${id}/logbuch/betreuung/termine/${terminId}`,
      { method: "PATCH", body },
    );
    return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
  } catch (error) {
    console.error("Betreuung termin update error:", error);
    return NextResponse.json(
      { error: "Termin konnte nicht aktualisiert werden" },
      { status: 500 },
    );
  }
}

// DELETE /api/mediations/[id]/logbuch/betreuung/termine/[terminId] – Termin löschen
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; terminId: string }> },
) {
  const { id, terminId } = await params;
  const result = await backendFetch(
    `/mediations/${id}/logbuch/betreuung/termine/${terminId}`,
    { method: "DELETE" },
  );
  return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
}
