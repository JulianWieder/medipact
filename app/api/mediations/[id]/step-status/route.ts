import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const phase = request.nextUrl.searchParams.get("phase") ?? "";
  const step = request.nextUrl.searchParams.get("step") ?? "";

  const result = await backendFetch(
    `/mediations/${id}/step-status?phase=${phase}&step=${step}`,
  );

  if (!result.ok) {
    return NextResponse.json(result.data, { status: result.status });
  }

  return NextResponse.json(result.data);
}
