import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/admin/invite-settings?mediation_type=...
export async function GET(request: NextRequest) {
  const mediationType = request.nextUrl.searchParams.get("mediation_type") ?? "";
  const result = await backendFetch(
    `/admin/invite-settings?mediation_type=${encodeURIComponent(mediationType)}`,
  );
  return NextResponse.json(result.data, { status: result.status });
}

// PUT /api/admin/invite-settings  { mediation_type, video_mode }
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await backendFetch(`/admin/invite-settings`, { method: "PUT", body });
    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error("Invite settings update error:", error);
    return NextResponse.json(
      { error: "Einstellung konnte nicht gespeichert werden" },
      { status: 500 },
    );
  }
}
