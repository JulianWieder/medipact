import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/mediations/[id]/logbuch/betreuung/rules – Serienregeln des Betreuungskalenders
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await backendFetch(`/mediations/${id}/logbuch/betreuung/rules`);
  return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
}

// POST /api/mediations/[id]/logbuch/betreuung/rules – neue Serienregel
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const result = await backendFetch(`/mediations/${id}/logbuch/betreuung/rules`, {
      method: "POST",
      body,
    });
    return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
  } catch (error) {
    console.error("Betreuung rule create error:", error);
    return NextResponse.json(
      { error: "Regel konnte nicht angelegt werden" },
      { status: 500 },
    );
  }
}
