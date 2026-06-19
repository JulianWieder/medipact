import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// DELETE /api/mediations/[id]/custom-steps/[stepKey]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; stepKey: string }> },
) {
  const { id, stepKey } = await params;

  const result = await backendFetch(
    `/mediations/${id}/custom-steps/${encodeURIComponent(stepKey)}`,
    { method: "DELETE" },
  );

  if (!result.ok) {
    return NextResponse.json(result.data, { status: result.status });
  }

  return NextResponse.json(result.data);
}
