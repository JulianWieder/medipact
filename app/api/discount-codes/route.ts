import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/discount-codes  – alle Rabattcodes (nur Admin/Mediator)
export async function GET() {
  const result = await backendFetch<unknown>(`/discount-codes`, { method: "GET" });
  return NextResponse.json(result.data, { status: result.status });
}

// POST /api/discount-codes – neuen Rabattcode anlegen
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }
  const result = await backendFetch<unknown>(`/discount-codes`, {
    method: "POST",
    body,
  });
  return NextResponse.json(result.data, { status: result.status });
}
