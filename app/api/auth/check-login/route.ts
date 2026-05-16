import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";

/**
 * Prüft Credentials gegen das Backend und gibt den genauen Fehlercode zurück,
 * ohne eine NextAuth-Session zu erstellen. Wird vom Login-Formular aufgerufen,
 * um z. B. "E-Mail nicht bestätigt" von "falsches Passwort" zu unterscheiden.
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.status === 403) {
      return NextResponse.json({ error: "EMAIL_NOT_VERIFIED" }, { status: 403 });
    }

    if (!res.ok) {
      return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
    }

    // Credentials korrekt – kein Token zurückgeben, nur OK-Status
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "BACKEND_UNREACHABLE" }, { status: 502 });
  }
}
