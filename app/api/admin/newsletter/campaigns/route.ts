import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/admin/newsletter/campaigns – alle Ausgaben (Entwürfe und versendete)
export async function GET() {
  const result = await backendFetch("/newsletter/campaigns");
  if (!result.ok) return NextResponse.json(result.data, { status: result.status });
  return NextResponse.json(result.data);
}

// POST /api/admin/newsletter/campaigns – neuen Entwurf anlegen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await backendFetch("/newsletter/campaigns", {
      method: "POST",
      body,
    });
    if (!result.ok) return NextResponse.json(result.data, { status: result.status });
    return NextResponse.json(result.data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Entwurf konnte nicht angelegt werden" },
      { status: 500 },
    );
  }
}
