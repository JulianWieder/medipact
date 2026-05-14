import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/mediations/[id]/notes?phase=einleitung
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const phase = request.nextUrl.searchParams.get("phase") ?? "";

  const result = await backendFetch(`/mediations/${id}/notes?phase=${phase}`);

  if (!result.ok) {
    return NextResponse.json(result.data, { status: result.status });
  }

  return NextResponse.json(result.data);
}

// POST /api/mediations/[id]/notes
// Body: { phase: string, participant_id: string, content: string }
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const result = await backendFetch(`/mediations/${id}/notes`, {
      method: "POST",
      body,
    });

    if (!result.ok) {
      return NextResponse.json(result.data, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Notes save error:", error);
    return NextResponse.json(
      { error: "Notiz konnte nicht gespeichert werden" },
      { status: 500 },
    );
  }
}
