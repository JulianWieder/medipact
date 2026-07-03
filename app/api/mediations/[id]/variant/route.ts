import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// PUT /api/mediations/[id]/variant → Backend: PUT /mediations/{id}/variant
// Ordnet einem Fall eine Mediations-Variante zu (variant_key) oder entfernt
// sie (variant_key: null). Nur Mediatoren/Admins (prüft das Backend).
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const result = await backendFetch(`/mediations/${id}/variant`, {
      method: "PUT",
      body,
    });

    if (!result.ok) {
      return NextResponse.json(result.data, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Mediation variant assign error:", error);
    return NextResponse.json(
      { error: "Variante konnte nicht zugeordnet werden" },
      { status: 500 },
    );
  }
}
