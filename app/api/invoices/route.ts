import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// Proxy für das Workspace-Rechnungsmodul (siehe app/workspace/components/RechnungenListe.tsx).
// Erwartet vom medipact-api-Backend einen GET /invoices Endpoint, der alle
// Rechnungen liefert, auf die der eingeloggte Nutzer (Mediator/Admin) Zugriff
// hat. Response-Struktur: siehe Invoice-Interface in app/workspace/types.ts.
//
// Dieser Endpoint existiert im Backend noch nicht — bis er ergänzt ist,
// liefert backendFetch hier vermutlich 404, und die UI zeigt einen
// entsprechenden Hinweis statt einer leeren Liste.
export async function GET() {
  const result = await backendFetch("/invoices", { method: "GET" });
  if (!result.ok) return NextResponse.json(result.data, { status: result.status });
  return NextResponse.json(result.data);
}
