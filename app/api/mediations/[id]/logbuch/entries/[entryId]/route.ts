import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// PATCH /api/mediations/[id]/logbuch/entries/[entryId] – Eintrag ändern
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; entryId: string }> },
) {
  const { id, entryId } = await params;
  try {
    const body = await request.json();
    const result = await backendFetch(
      `/mediations/${id}/logbuch/entries/${entryId}`,
      { method: "PATCH", body },
    );
    if (!result.ok) {
      return NextResponse.json(result.data, { status: result.status });
    }
    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Logbuch entry update error:", error);
    return NextResponse.json(
      { error: "Eintrag konnte nicht aktualisiert werden" },
      { status: 500 },
    );
  }
}

// DELETE /api/mediations/[id]/logbuch/entries/[entryId] – Eintrag löschen
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; entryId: string }> },
) {
  const { id, entryId } = await params;
  const result = await backendFetch(
    `/mediations/${id}/logbuch/entries/${entryId}`,
    { method: "DELETE" },
  );
  if (!result.ok) {
    return NextResponse.json(result.data, { status: result.status });
  }
  return NextResponse.json(result.data);
}
