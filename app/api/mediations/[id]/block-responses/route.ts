import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/mediations/[id]/block-responses?phase=...&step_key=...
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const phase = request.nextUrl.searchParams.get("phase");
  const stepKey = request.nextUrl.searchParams.get("step_key");

  const qs = new URLSearchParams();
  if (phase) qs.set("phase", phase);
  if (stepKey) qs.set("step_key", stepKey);
  const query = qs.toString();

  const result = await backendFetch(
    `/mediations/${id}/block-responses${query ? `?${query}` : ""}`,
  );

  if (!result.ok) {
    return NextResponse.json(result.data, { status: result.status });
  }

  return NextResponse.json(result.data);
}

// PUT /api/mediations/[id]/block-responses
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const result = await backendFetch(`/mediations/${id}/block-responses`, {
      method: "PUT",
      body,
    });

    if (!result.ok) {
      return NextResponse.json(result.data, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Block response save error:", error);
    return NextResponse.json(
      { error: "Block-Antwort konnte nicht gespeichert werden" },
      { status: 500 },
    );
  }
}
