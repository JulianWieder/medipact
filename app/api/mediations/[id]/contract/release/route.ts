import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const result = await backendFetch(`/mediations/${id}/contract/release`, {
      method: "POST",
      body: {},
    });

    if (!result.ok) {
      return NextResponse.json(result.data, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Contract release error:", error);
    return NextResponse.json({ error: "Freigabe fehlgeschlagen" }, { status: 500 });
  }
}
