import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/organizations/[id]/onboarding – Onboarding-Status (Vertrag/Zahlung)
export async function GET(_r: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await backendFetch<unknown>(`/organizations/${id}/onboarding`, { method: "GET" });
  return NextResponse.json(result.data, { status: result.status });
}
