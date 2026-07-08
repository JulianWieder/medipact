import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/organizations/[id]/members – Nutzer dem Mandanten zuordnen (nur Admin)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }
  const result = await backendFetch<unknown>(`/organizations/${id}/members`, {
    method: "POST",
    body,
  });
  return NextResponse.json(result.data, { status: result.status });
}
