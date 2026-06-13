import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const result = await backendFetch(`/mediations/${id}/contract/sign`, {
      method: "POST",
      body,
    });

    if (!result.ok) {
      return NextResponse.json(result.data, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Contract sign error:", error);
    return NextResponse.json({ error: "Unterschrift konnte nicht gespeichert werden" }, { status: 500 });
  }
}
