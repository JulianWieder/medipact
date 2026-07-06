import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/mediations/mediators – alle Nutzer mit Rolle 'mediator' (nur Admin/Mediator)
export async function GET() {
  const result = await backendFetch<unknown>(`/mediations/mediators`, { method: "GET" });
  return NextResponse.json(result.data, { status: result.status });
}
