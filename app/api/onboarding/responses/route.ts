import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// PUT /api/onboarding/responses → Backend: PUT /onboarding/responses
// Legt die Antwort auf einen Block an oder aktualisiert sie.
//
// Die Methode MUSS PUT sein – die Route exportiert nur PUT, ein PATCH liefe in
// ein stilles 405 (derselbe Stolperstein wie bei billing-address).
export async function PUT(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Ungültiger Request-Body" }, { status: 400 });
  }
  const result = await backendFetch("/onboarding/responses", {
    method: "PUT",
    body,
  });
  return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
}
