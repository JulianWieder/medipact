import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/organizations/[id]/onboarding/paypal/create-order – PayPal-Order anlegen
export async function POST(_r: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await backendFetch<unknown>(`/organizations/${id}/onboarding/paypal/create-order`, { method: "POST", body: {} });
  return NextResponse.json(result.data, { status: result.status });
}
