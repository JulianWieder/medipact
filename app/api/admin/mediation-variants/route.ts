import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/admin/mediation-variants?mediation_type=...
export async function GET(request: NextRequest) {
  const mediationType = request.nextUrl.searchParams.get("mediation_type") ?? "";

  const result = await backendFetch(
    `/admin/mediation-variants?mediation_type=${encodeURIComponent(mediationType)}`,
  );

  if (!result.ok) {
    return NextResponse.json(result.data, { status: result.status });
  }

  return NextResponse.json(result.data);
}

// POST /api/admin/mediation-variants
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await backendFetch(`/admin/mediation-variants`, {
      method: "POST",
      body,
    });

    if (!result.ok) {
      return NextResponse.json(result.data, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Mediation variant create error:", error);
    return NextResponse.json(
      { error: "Variante konnte nicht angelegt werden" },
      { status: 500 },
    );
  }
}
