import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST – PayPal-Order für Logbuch-Premium (einmalig 14,95 €) erstellen.
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await backendFetch(
    `/mediations/${id}/logbuch/upgrade/paypal/create-order`,
    { method: "POST" },
  );
  return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
}
