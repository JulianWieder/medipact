import { NextRequest, NextResponse } from "next/server";

// PayPal-Webhook -> FastAPI (/paypal/webhook).
//
// Warum über Next.js: Der produktive Webserver ist der mailcow-nginx-Container,
// und das Backend lauscht nur auf 127.0.0.1:8000 des Hosts. Aus dem Container
// ist es nicht erreichbar, Next.js (läuft auf dem Host) dagegen schon.
// Webhook-URL im PayPal-Dashboard: https://medipact.de/api/paypal/webhook
//
// Der Body wird UNVERÄNDERT als Text weitergereicht: die Signaturprüfung im
// Backend schlägt fehl, sobald das JSON neu serialisiert wird. Ohne Login, die
// Echtheit prüft das Backend über die PAYPAL-*-Header bei PayPal.

const API_BASE_URL = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const raw = await request.text();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  request.headers.forEach((value, key) => {
    if (key.toLowerCase().startsWith("paypal-")) headers[key.toUpperCase()] = value;
  });

  try {
    const res = await fetch(`${API_BASE_URL}/paypal/webhook`, {
      method: "POST",
      headers,
      body: raw,
      cache: "no-store",
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PayPal-Webhook-Weiterleitung fehlgeschlagen:", error);
    // 502 -> PayPal wiederholt die Zustellung später.
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
