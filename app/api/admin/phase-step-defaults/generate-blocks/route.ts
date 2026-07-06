import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/admin/phase-step-defaults/generate-blocks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await backendFetch("/admin/phase-step-defaults/generate-blocks", {
      method: "POST",
      body,
    });
    if (!result.ok) return NextResponse.json(result.data, { status: result.status });
    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json({ error: "KI-Vorbefüllen fehlgeschlagen" }, { status: 500 });
  }
}
