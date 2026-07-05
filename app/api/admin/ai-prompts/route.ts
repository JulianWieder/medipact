import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/admin/ai-prompts — alle KI-Prompts (effektiv + Default + Platzhalter).
export async function GET() {
  const result = await backendFetch(`/admin/ai-prompts`);
  return NextResponse.json(result.data, { status: result.status });
}
