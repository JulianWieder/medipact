import { NextRequest, NextResponse } from "next/server";
import { createInvite } from "@/lib/mediations";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const invited_email = body.invited_email ?? body.email;
    const role = body.role ?? "other_party";
    const personal_message = body.personal_message;
    const video_token = body.video_token;

    if (!invited_email) {
      return NextResponse.json(
        { error: "invited_email fehlt" },
        { status: 400 },
      );
    }

    const result = await createInvite(id, {
      invited_email,
      role,
      personal_message,
      video_token,
    });

    if (!result.ok) {
      console.error("Backend invite error:", result.status, result.data);
      return NextResponse.json(result.data, { status: result.status });
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error("Invite API error:", error);

    return NextResponse.json(
      { error: "Invite konnte nicht erstellt werden" },
      { status: 500 },
    );
  }
}
