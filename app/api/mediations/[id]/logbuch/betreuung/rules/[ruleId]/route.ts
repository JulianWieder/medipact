import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// PATCH /api/mediations/[id]/logbuch/betreuung/rules/[ruleId] – Regel ändern
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; ruleId: string }> },
) {
  const { id, ruleId } = await params;
  try {
    const body = await request.json();
    const result = await backendFetch(
      `/mediations/${id}/logbuch/betreuung/rules/${ruleId}`,
      { method: "PATCH", body },
    );
    return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
  } catch (error) {
    console.error("Betreuung rule update error:", error);
    return NextResponse.json(
      { error: "Regel konnte nicht aktualisiert werden" },
      { status: 500 },
    );
  }
}

// DELETE /api/mediations/[id]/logbuch/betreuung/rules/[ruleId] – Regel löschen
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; ruleId: string }> },
) {
  const { id, ruleId } = await params;
  const result = await backendFetch(
    `/mediations/${id}/logbuch/betreuung/rules/${ruleId}`,
    { method: "DELETE" },
  );
  return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
}
