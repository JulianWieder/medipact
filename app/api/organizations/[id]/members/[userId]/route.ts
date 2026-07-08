import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// DELETE /api/organizations/[id]/members/[userId] – Zuordnung lösen (nur Admin)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> },
) {
  const { id, userId } = await params;
  const result = await backendFetch<unknown>(`/organizations/${id}/members/${userId}`, {
    method: "DELETE",
  });
  return NextResponse.json(result.data, { status: result.status });
}
