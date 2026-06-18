import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/mediations/[id]/workflow-rules
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const result = await backendFetch(`/mediations/${id}/workflow-rules`);

  if (!result.ok) {
    return NextResponse.json(result.data, { status: result.status });
  }

  return NextResponse.json(result.data);
}

// PUT /api/mediations/[id]/workflow-rules
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const result = await backendFetch(`/mediations/${id}/workflow-rules`, {
      method: "PUT",
      body,
    });

    if (!result.ok) {
      return NextResponse.json(result.data, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Workflow rule upsert error:", error);
    return NextResponse.json(
      { error: "Workflow-Regel konnte nicht gespeichert werden" },
      { status: 500 },
    );
  }
}

// DELETE /api/mediations/[id]/workflow-rules?phase=...&step=...
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const phase = request.nextUrl.searchParams.get("phase") ?? "";
  const step = request.nextUrl.searchParams.get("step") ?? "";

  const result = await backendFetch(
    `/mediations/${id}/workflow-rules?phase=${encodeURIComponent(phase)}&step=${encodeURIComponent(step)}`,
    { method: "DELETE" },
  );

  if (!result.ok) {
    return NextResponse.json(result.data, { status: result.status });
  }

  return NextResponse.json(result.data);
}
