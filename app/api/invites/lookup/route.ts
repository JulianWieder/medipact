import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";

// Public: Invite-Token prüfen → { invited_email, user_exists }.
// Von der Login-Seite genutzt, um neu Eingeladene ohne Konto direkt zur
// Registrierung zu routen.
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ detail: "Token erforderlich" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${API_BASE_URL}/invites/${encodeURIComponent(token)}/lookup`,
      { cache: "no-store" }
    );
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ detail: "Server-Fehler" }, { status: 500 });
  }
}
