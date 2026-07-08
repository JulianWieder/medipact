import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/organizations/plans – alle Abo-Pläne inkl. Konditionen
export async function GET() {
  const result = await backendFetch<unknown>(`/organizations/plans`, { method: "GET" });
  return NextResponse.json(result.data, { status: result.status });
}
