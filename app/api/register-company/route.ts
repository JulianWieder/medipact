import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";

// Öffentliche Firmenkunden-Registrierung: legt Unternehmen + Firmen-Admin an.
// Keine Domain-Beschränkung (Firmenkunden nutzen ihre eigenen Adressen).
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company_name, name, email, password, plan, billing_email, position } = body ?? {};
    if (!company_name || !name || !email || !password) {
      return NextResponse.json(
        { error: "Firmenname, Name, E-Mail und Passwort sind erforderlich" },
        { status: 400 },
      );
    }
    const res = await fetch(`${API_BASE_URL}/auth/register-company`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_name, name, email, password, plan, billing_email, position }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return NextResponse.json(
        { error: data?.detail ?? "Registrierung fehlgeschlagen" },
        { status: res.status },
      );
    }
    return NextResponse.json({ success: true, email: data?.email }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Backend nicht erreichbar" }, { status: 502 });
  }
}
