import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

export async function GET() {
  const result = await backendFetch("/mediations/feedback/all", { method: "GET" });
  if (!result.ok) return NextResponse.json(result.data, { status: result.status });
  return NextResponse.json(result.data);
}
