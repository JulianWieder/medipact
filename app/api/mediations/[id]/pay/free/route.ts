import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/mediations/[id]/pay/free
// Schaltet den eigenen Anteil ohne Zahlung frei, wenn er 0 € beträgt (Voll-Rabatt).
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await backendFetch<unknown>(`/mediations/${id}/pay/free`, {
    method: "POST",
  });
  return NextResponse.json(result.data, { status: result.status });
}
