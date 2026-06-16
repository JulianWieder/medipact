import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const result = await backendFetch(`/mediations/${id}/appointment/confirm`, { method: "POST", body });
  if (!result.ok) return NextResponse.json(result.data, { status: result.status });
  return NextResponse.json(result.data);
}
