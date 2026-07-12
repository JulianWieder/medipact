import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/admin/org-members → Backend: POST /auth/org-members
// Firmen-Admin (eigene Org) oder globaler Admin. Backend erzwingt Tenant-Scope.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await backendFetch("/auth/org-members", { method: "POST", body });
    if (!result.ok) return NextResponse.json(result.data, { status: result.status });
    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json(
      { error: "Mitglied konnte nicht angelegt werden" },
      { status: 500 },
    );
  }
}
