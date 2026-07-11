import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// Rechnungsadresse des eingeloggten Teilnehmers für diesen Fall.
// Wird im Onboarding (MediationClient) abgefragt, weil jede zahlende Partei
// vor ihrer Zahlung die Adresse hinterlegen muss – beim Start des Falls
// entsteht daraus die Rechnung (siehe backend/app/routers/mediations.py).

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await backendFetch(`/mediations/${id}/billing-address`);
  if (!result.ok) return NextResponse.json(result.data, { status: result.status });
  return NextResponse.json(result.data);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const result = await backendFetch(`/mediations/${id}/billing-address`, {
    method: "PATCH",
    body: body ?? {},
  });
  if (!result.ok) return NextResponse.json(result.data, { status: result.status });
  return NextResponse.json(result.data);
}
