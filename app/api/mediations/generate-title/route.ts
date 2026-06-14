import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await backendFetch("/mediations/generate-title", {
      method: "POST",
      body,
    });

    if (!result.ok) {
      return NextResponse.json(result.data, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Generate title error:", error);
    return NextResponse.json({ error: "Titelgenerierung fehlgeschlagen" }, { status: 500 });
  }
}
