import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/admin/mediations → Backend: GET /mediations/all
// Nur für Nutzer mit Rolle "mediator" oder "admin" zugänglich.
export async function GET() {
  const result = await backendFetch("/mediations/all");

  if (!result.ok) {
    return NextResponse.json(result.data, { status: result.status });
  }

  return NextResponse.json(result.data);
}
