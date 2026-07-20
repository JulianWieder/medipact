import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/mediations/[id]/logbuch/entries – alle Logbuch-Einträge des Falls
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await backendFetch(`/mediations/${id}/logbuch/entries`);
  if (!result.ok) {
    return NextResponse.json(result.data, { status: result.status });
  }
  return NextResponse.json(result.data);
}

// POST /api/mediations/[id]/logbuch/entries – neuen Eintrag anlegen
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const result = await backendFetch(`/mediations/${id}/logbuch/entries`, {
      method: "POST",
      body,
    });
    if (!result.ok) {
      return NextResponse.json(result.data, { status: result.status });
    }
    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("Logbuch entry create error:", error);
    return NextResponse.json(
      { error: "Eintrag konnte nicht gespeichert werden" },
      { status: 500 },
    );
  }
}
