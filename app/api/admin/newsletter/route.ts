import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/admin/newsletter?status=all|confirmed|pending|unsubscribed
export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status") ?? "all";
  const result = await backendFetch(
    `/newsletter/subscribers?status=${encodeURIComponent(status)}`,
  );
  if (!result.ok) return NextResponse.json(result.data, { status: result.status });
  return NextResponse.json(result.data);
}
