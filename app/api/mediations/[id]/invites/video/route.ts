import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const API_BASE_URL = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";

// POST /api/mediations/[id]/invites/video
// Proxies a recorded/uploaded invite video (multipart/form-data) to the
// FastAPI backend. Kept separate from lib/backend.ts's backendFetch because
// that helper only supports JSON bodies.
export async function POST(
  request: NextRequest,
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

  let incomingForm: FormData;
  try {
    incomingForm = await request.formData();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  const file = incomingForm.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Keine Videodatei übermittelt" }, { status: 400 });
  }

  const forwardForm = new FormData();
  forwardForm.append("file", file, file.name || "invite-video.webm");

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/mediations/${id}/invites/video`, {
      method: "POST",
      headers: { Authorization: `Bearer ${session.backendAccessToken}` },
      body: forwardForm,
      cache: "no-store",
    });
  } catch (err) {
    console.error("Invite video upload: backend nicht erreichbar", err);
    return NextResponse.json({ error: "Backend nicht erreichbar" }, { status: 503 });
  }

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
