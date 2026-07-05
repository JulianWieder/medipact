import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/integrations/google-meet
// Erzeugt über das Backend (zentrales Google-Konto) einen neuen Meet-Link.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = await backendFetch(`/integrations/google-meet/link`, {
      method: "POST",
      body,
    });

    if (!result.ok) {
      return NextResponse.json(result.data, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Google Meet link error:", error);
    return NextResponse.json(
      { error: "Meet-Link konnte nicht erzeugt werden" },
      { status: 500 },
    );
  }
}

// GET /api/integrations/google-meet — meldet, ob Google Meet verbunden ist.
export async function GET() {
  const result = await backendFetch(`/integrations/google-meet/status`);
  if (!result.ok) {
    return NextResponse.json(result.data, { status: result.status });
  }
  return NextResponse.json(result.data);
}
