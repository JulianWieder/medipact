import { NextRequest, NextResponse } from "next/server";
import { newsletterBackend } from "@/lib/nutzerbereich";

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

    // medipact-api oder kerno, je nach KERNO_API_URL (lib/nutzerbereich.ts).
    const backend = newsletterBackend(request);

    const res = await fetch(`${backend.basis}/newsletter/unsubscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...backend.headers,
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
