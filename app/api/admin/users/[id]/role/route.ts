import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// PATCH /api/admin/users/[id]/role → Backend: PATCH /auth/users/{id}/role
// Nur für Administratoren (Backend prüft role == "admin").
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const result = await backendFetch(`/auth/users/${id}/role`, {
      method: "PATCH",
      body,
    });
    if (!result.ok) return NextResponse.json(result.data, { status: result.status });
    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json(
      { error: "Rolle konnte nicht geändert werden" },
      { status: 500 },
    );
  }
}
