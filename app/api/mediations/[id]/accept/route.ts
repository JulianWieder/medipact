import { NextRequest, NextResponse } from "next/server";
import { acceptInvite } from "@/lib/mediations";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await acceptInvite(id);
  return NextResponse.json(result.data, { status: result.status });
}
