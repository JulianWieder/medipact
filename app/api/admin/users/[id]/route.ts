import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// DELETE /api/admin/users/[id] → Backend: DELETE /auth/users/{id}
// Nur für Administratoren (Backend prüft role == "admin").
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await backendFetch(`/auth/users/${id}`, { method: "DELETE" });
  if (!result.ok) return NextResponse.json(result.data, { status: result.status });
  return NextResponse.json(result.data);
}
