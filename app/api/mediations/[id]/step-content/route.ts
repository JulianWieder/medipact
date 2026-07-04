import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/mediations/[id]/step-content?phase=...
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const phase = request.nextUrl.searchParams.get("phase");

  const query = phase ? `?phase=${encodeURIComponent(phase)}` : "";
  const result = await backendFetch(`/mediations/${id}/step-content${query}`);

  if (!result.ok) {
    return NextResponse.json(result.data, { status: result.status });
  }

  return NextResponse.json(result.data);
}

// PUT /api/mediations/[id]/step-content
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const result = await backendFetch(`/mediations/${id}/step-content`, {
      method: "PUT",
      body,
    });

    if (!result.ok) {
      return NextResponse.json(result.data, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Step content save error:", error);
    return NextResponse.json(
      { error: "Inhalt konnte nicht gespeichert werden" },
      { status: 500 },
    );
  }
}
