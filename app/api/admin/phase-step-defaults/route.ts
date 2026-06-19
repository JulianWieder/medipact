import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/admin/phase-step-defaults?mediation_type=...&phase=...
export async function GET(request: NextRequest) {
  const mediationType = request.nextUrl.searchParams.get("mediation_type") ?? "";
  const phase = request.nextUrl.searchParams.get("phase") ?? "";

  const result = await backendFetch(
    `/admin/phase-step-defaults?mediation_type=${encodeURIComponent(mediationType)}&phase=${encodeURIComponent(phase)}`,
  );

  if (!result.ok) {
    return NextResponse.json(result.data, { status: result.status });
  }

  return NextResponse.json(result.data);
}

// POST /api/admin/phase-step-defaults
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await backendFetch(`/admin/phase-step-defaults`, {
      method: "POST",
      body,
    });

    if (!result.ok) {
      return NextResponse.json(result.data, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Phase step default create error:", error);
    return NextResponse.json(
      { error: "Schritt konnte nicht angelegt werden" },
      { status: 500 },
    );
  }
}
