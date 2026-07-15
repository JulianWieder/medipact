import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/mediations/[id]/chat?after=<letzte Nachricht-ID> — Fall-Chat (Polling)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const after = request.nextUrl.searchParams.get("after") ?? "0";

  const result = await backendFetch(`/mediations/${id}/chat?after=${after}`);

  if (!result.ok) {
    return NextResponse.json(result.data, { status: result.status });
  }

  return NextResponse.json(result.data);
}

// POST /api/mediations/[id]/chat — Nachricht senden
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const result = await backendFetch(`/mediations/${id}/chat`, {
      method: "POST",
      body,
    });

    if (!result.ok) {
      return NextResponse.json(result.data, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Chat send error:", error);
    return NextResponse.json(
      { error: "Nachricht konnte nicht gesendet werden" },
      { status: 500 },
    );
  }
}
