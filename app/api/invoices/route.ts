import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// Proxy für das Workspace-Rechnungsmodul (siehe app/workspace/components/RechnungenListe.tsx).
// Backend-Endpoint: backend/app/routers/invoices.py (GET/POST /invoices).
// Response-Struktur: siehe Invoice-Interface in app/workspace/types.ts.
export async function GET() {
  const result = await backendFetch("/invoices", { method: "GET" });
  if (!result.ok) return NextResponse.json(result.data, { status: result.status });
  return NextResponse.json(result.data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const result = await backendFetch("/invoices", { method: "POST", body });
  if (!result.ok) return NextResponse.json(result.data, { status: result.status });
  return NextResponse.json(result.data, { status: 201 });
}
