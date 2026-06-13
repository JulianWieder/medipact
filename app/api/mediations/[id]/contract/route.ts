import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const result = await backendFetch(`/mediations/${id}/contract`, {
      method: "GET",
    });

    if (!result.ok) {
      return NextResponse.json(result.data, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Contract GET error:", error);
    return NextResponse.json({ error: "Fehler beim Laden des Vertrags" }, { status: 500 });
  }
}
