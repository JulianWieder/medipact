import { NextRequest, NextResponse } from "next/server";

// Veraltet: dieser Endpoint markierte die Mediation direkt als bezahlt, ohne
// echte Zahlung zu prüfen. Ersetzt durch den PayPal-Flow unter
// /api/mediations/[id]/pay/paypal/create-order und .../capture-order.
export async function POST(_request: NextRequest) {
  return NextResponse.json(
    { error: "Veraltet - bitte den PayPal-Zahlungsfluss verwenden." },
    { status: 410 },
  );
}
