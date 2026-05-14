import { NextRequest, NextResponse } from "next/server";
import { updateMediation } from "@/lib/mediations";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await updateMediation(id, body);

    if (!result.ok) {
      return NextResponse.json(result.data, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Mediation update error:", error);
    return NextResponse.json(
      { error: "Mediation konnte nicht aktualisiert werden" },
      { status: 500 },
    );
  }
}
