import { NextResponse } from "next/server";
import { getMyMediations } from "@/lib/mediations";

export async function GET() {
  const result = await getMyMediations();

  if (!result.ok) {
    return NextResponse.json(result.data, { status: result.status });
  }

  return NextResponse.json(result.data);
}
