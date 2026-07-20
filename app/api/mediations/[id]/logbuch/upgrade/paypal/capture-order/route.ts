import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST – genehmigte PayPal-Order erfassen → Logbuch wird Premium.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const result = await backendFetch(
    `/mediations/${id}/logbuch/upgrade/paypal/capture-order`,
    { method: "POST", body },
  );
  return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
}
