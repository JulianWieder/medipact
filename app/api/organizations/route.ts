import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/organizations – Mandanten (Admin: alle, Mediator: eigener)
export async function GET() {
  const result = await backendFetch<unknown>(`/organizations`, { method: "GET" });
  return NextResponse.json(result.data, { status: result.status });
}

// POST /api/organizations – neuen Mandanten anlegen (nur Admin)
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }
  const result = await backendFetch<unknown>(`/organizations`, {
    method: "POST",
    body,
  });
  return NextResponse.json(result.data, { status: result.status });
}
