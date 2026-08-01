import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/mediations/[id]/logbuch/betreuung/termine?from=…&to=… –
// Kalenderansicht: expandierte Serien-Vorkommen + Einzeltermine (Plan + Ist)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const from = request.nextUrl.searchParams.get("from") ?? "";
  const to = request.nextUrl.searchParams.get("to") ?? "";
  const result = await backendFetch(
    `/mediations/${id}/logbuch/betreuung/termine?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
  );
  return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
}

// POST /api/mediations/[id]/logbuch/betreuung/termine – Einzeltermin oder
// Override (Ist-Zeiten zu einem Serien-Vorkommen) anlegen
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const result = await backendFetch(`/mediations/${id}/logbuch/betreuung/termine`, {
      method: "POST",
      body,
    });
    return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
  } catch (error) {
    console.error("Betreuung termin create error:", error);
    return NextResponse.json(
      { error: "Termin konnte nicht angelegt werden" },
      { status: 500 },
    );
  }
}
