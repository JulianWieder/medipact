import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";

// Öffentliche Anmeldung (kein Login) – schlanker Proxy auf das Backend, damit
// die Backend-URL nicht im Client landet. Die eigentliche Validierung und das
// Rate-Limiting passieren im FastAPI-Endpunkt /newsletter/subscribe.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const source =
      typeof body?.source === "string" ? body.source.trim() : undefined;

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json(
        { error: "Bitte eine gültige E-Mail-Adresse angeben." },
        { status: 400 },
      );
    }

    // X-Forwarded-For durchreichen, damit das Backend-Rate-Limit die echte
    // Client-IP sieht (Next.js läuft hinter nginx als lokaler Proxy).
    const forwardedFor =
      request.headers.get("x-forwarded-for") ??
      request.headers.get("x-real-ip") ??
      "";

    const res = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(forwardedFor ? { "X-Forwarded-For": forwardedFor } : {}),
      },
      body: JSON.stringify({ email, source }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.detail ?? "Anmeldung fehlgeschlagen." },
        { status: res.status },
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Backend nicht erreichbar" },
      { status: 502 },
    );
  }
}
