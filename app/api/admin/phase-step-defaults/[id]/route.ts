import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// PATCH /api/admin/phase-step-defaults/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const result = await backendFetch(`/admin/phase-step-defaults/${id}`, {
      method: "PATCH",
      body,
    });

    if (!result.ok) {
      return NextResponse.json(result.data, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Phase step default update error:", error);
    return NextResponse.json(
      { error: "Schritt konnte nicht aktualisiert werden" },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/phase-step-defaults/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const result = await backendFetch(`/admin/phase-step-defaults/${id}`, {
    method: "DELETE",
  });

  if (!result.ok) {
    return NextResponse.json(result.data, { status: result.status });
  }

  return NextResponse.json(result.data);
}
