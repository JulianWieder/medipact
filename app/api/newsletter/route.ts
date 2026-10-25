import { NextRequest, NextResponse } from "next/server";
import { newsletterBackend } from "@/lib/nutzerbereich";

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

    // medipact-api oder kerno, je nach KERNO_API_URL (lib/nutzerbereich.ts).
    const backend = newsletterBackend(request);

    const res = await fetch(`${backend.basis}/newsletter/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...backend.headers,
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
