import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// PUT /api/mediations/[id]/logbuch/entries/[entryId]/link
// Einzelnen Eintrag mit einem Fall verknüpfen (Body: { mediation_id: number | null }).
// Bewusst getrennt vom PATCH: die Mobile-App schickt beim Bearbeiten das ganze
// Objekt und würde eine Verknüpfung sonst stillschweigend zurücksetzen.
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; entryId: string }> },
) {
  const { id, entryId } = await params;
  try {
    const body = await request.json();
    const result = await backendFetch(
      `/mediations/${id}/logbuch/entries/${entryId}/link`,
      { method: "PUT", body },
    );
    if (!result.ok) {
      return NextResponse.json(result.data, { status: result.status });
    }
    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Logbuch entry link error:", error);
    return NextResponse.json(
      { error: "Verknüpfung konnte nicht gespeichert werden" },
      { status: 500 },
    );
  }
}
