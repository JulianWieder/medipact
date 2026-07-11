import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/mediations/dashboard — Eingriffs-Signale + Neuigkeiten fürs Workspace-Dashboard
export async function GET() {
  const result = await backendFetch("/mediations/dashboard/uebersicht", { method: "GET" });
  if (!result.ok) return NextResponse.json(result.data, { status: result.status });
  return NextResponse.json(result.data);
}
