import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// PATCH /api/mediations/[id]/logbuch/kinder/[childId] – Name, Geburtsdatum, Farbe
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; childId: string }> },
) {
  const { id, childId } = await params;
  try {
    const body = await request.json();
    const result = await backendFetch(
      `/mediations/${id}/logbuch/kinder/${childId}`,
      { method: "PATCH", body },
    );
    return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
  } catch (error) {
    console.error("Kind ändern fehlgeschlagen:", error);
    return NextResponse.json(
      { error: "Änderung konnte nicht gespeichert werden" },
      { status: 500 },
    );
  }
}

// DELETE /api/mediations/[id]/logbuch/kinder/[childId] – Kind entfernen.
// Die Betreuungszeiten bleiben stehen (sie sind Dokumentation), das Kind wird
// nur aus allen Zuordnungen gelöst.
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; childId: string }> },
) {
  const { id, childId } = await params;
  const result = await backendFetch(
    `/mediations/${id}/logbuch/kinder/${childId}`,
    { method: "DELETE" },
  );
  return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
}
