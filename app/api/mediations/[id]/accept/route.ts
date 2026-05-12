import { NextRequest, NextResponse } from "next/server";
import { acceptInvite } from "@/lib/mediations";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const result = await acceptInvite(token);
  return NextResponse.json(result.data, { status: result.status });
}
