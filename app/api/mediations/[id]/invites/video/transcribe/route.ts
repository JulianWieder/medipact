import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/mediations/[id]/invites/video/transcribe
// Transkribiert eine zuvor hochgeladene Einladungs-Video-Botschaft (per video_token,
// siehe .../invites/video) per Whisper im Backend und gibt den Text zurück, damit
// er direkt in ein editierbares Textfeld geladen werden kann.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: { video_token?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  if (!body.video_token) {
    return NextResponse.json({ error: "video_token fehlt" }, { status: 400 });
  }

  const result = await backendFetch<{ transcript: string }>(
    `/mediations/${id}/invites/video/transcribe`,
    {
      method: "POST",
      body: { video_token: body.video_token },
    },
  );

  return NextResponse.json(result.data, { status: result.status });
}
