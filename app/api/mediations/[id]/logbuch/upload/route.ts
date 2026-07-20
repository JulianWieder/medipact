import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const API_BASE_URL = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";

// POST /api/mediations/[id]/logbuch/upload  (multipart/form-data mit "file")
// Leitet den Logbuch-Datei-Upload roh ans Backend weiter (backendFetch ist JSON-only).
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user || !session.backendAccessToken) {
    return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
  }

  const incoming = await request.formData();
  const file = incoming.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Keine Datei" }, { status: 400 });
  }

  const forward = new FormData();
  forward.append("file", file, file.name);

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/mediations/${id}/logbuch/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${session.backendAccessToken}` },
      body: forward,
    });
  } catch {
    return NextResponse.json({ error: "Backend nicht erreichbar" }, { status: 503 });
  }

  const data = await res.json().catch(() => ({ error: "Upload fehlgeschlagen" }));
  return NextResponse.json(data, { status: res.status });
}
