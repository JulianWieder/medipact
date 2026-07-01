import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// Proxy für das manuelle Bearbeiten einer Rechnung (siehe
// app/workspace/components/RechnungFormular.tsx).
// Backend-Endpoint: backend/app/routers/invoices.py (PATCH /invoices/{id}).
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const result = await backendFetch(`/invoices/${id}`, { method: "PATCH", body });
  if (!result.ok) return NextResponse.json(result.data, { status: result.status });
  return NextResponse.json(result.data);
}
