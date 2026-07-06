import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const API_BASE_URL = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";

// GET /api/mediations/[id]/block-file?token=...
// Streamt eine hochgeladene Datei roh vom Backend (mit Auth-Token).
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = request.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "token fehlt" }, { status: 400 });

  const session = await auth();
  if (!session?.user || !session.backendAccessToken) {
    return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
  }

  let res: Response;
  try {
    res = await fetch(
      `${API_BASE_URL}/mediations/${id}/block-file?token=${encodeURIComponent(token)}`,
      {
        headers: { Authorization: `Bearer ${session.backendAccessToken}` },
        cache: "no-store",
      },
    );
  } catch {
    return NextResponse.json({ error: "Backend nicht erreichbar" }, { status: 503 });
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: "Datei nicht verfügbar" }));
    return NextResponse.json(data, { status: res.status });
  }

  const headers = new Headers();
  const ct = res.headers.get("content-type");
  const cd = res.headers.get("content-disposition");
  if (ct) headers.set("content-type", ct);
  if (cd) headers.set("content-disposition", cd);
  return new NextResponse(res.body, { status: 200, headers });
}
