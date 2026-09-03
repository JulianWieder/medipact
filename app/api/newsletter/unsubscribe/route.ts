import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";

// Abmeldung per Token aus der Mail – ohne Login, ein Klick.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const token = typeof body?.token === "string" ? body.token.trim() : "";

    if (!token) {
      return NextResponse.json(
        { error: "Kein Abmeldecode übergeben." },
        { status: 400 },
      );
    }

    const forwardedFor =
      request.headers.get("x-forwarded-for") ??
      request.headers.get("x-real-ip") ??
      "";

    const res = await fetch(`${API_BASE_URL}/newsletter/unsubscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(forwardedFor ? { "X-Forwarded-For": forwardedFor } : {}),
      },
      body: JSON.stringify({ token }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.detail ?? "Abmeldung fehlgeschlagen." },
        { status: res.status },
      );
    }

    return NextResponse.json({ success: true, email: data?.email ?? null });
  } catch {
    return NextResponse.json({ error: "Backend nicht erreichbar" }, { status: 502 });
  }
}
