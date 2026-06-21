import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const API_BASE_URL = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";

// GET /api/mediations/[id]/invites/me/video
// Streams the personal invite video to the invited user, but only once
// the backend confirms their invite was accepted ("im System geben" beim Annehmen).
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
  }
  if (session.error === "RefreshAccessTokenError" || session.error === "RefreshTokenMissing" || !session.backendAccessToken) {
    return NextResponse.json(
      { error: "Sitzung abgelaufen – bitte neu einloggen", reauth: true },
      { status: 401 },
    );
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/mediations/${id}/invites/me/video`, {
      headers: { Authorization: `Bearer ${session.backendAccessToken}` },
      cache: "no-store",
    });
  } catch (err) {
    console.error("Invite video stream: backend nicht erreichbar", err);
    return NextResponse.json({ error: "Backend nicht erreichbar" }, { status: 503 });
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    return NextResponse.json(data ?? { error: `Fehler (${res.status})` }, { status: res.status });
  }

  return new NextResponse(res.body, {
    status: 200,
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "video/webm",
      "Cache-Control": "no-store",
    },
  });
}
