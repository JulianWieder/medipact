import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/admin/phase-step-defaults/reorder
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await backendFetch(`/admin/phase-step-defaults/reorder`, {
      method: "POST",
      body,
    });

    if (!result.ok) {
      return NextResponse.json(result.data, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Phase step default reorder error:", error);
    return NextResponse.json(
      { error: "Reihenfolge konnte nicht gespeichert werden" },
      { status: 500 },
    );
  }
}
