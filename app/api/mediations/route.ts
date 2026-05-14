import { NextRequest, NextResponse } from "next/server";
import { createMediation } from "@/lib/mediations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createMediation({
      title: body.title,
      mediation_type: body.mediation_type,
      description: body.description,
      priority: body.priority,
      role: body.role,
    });

    if (!result.ok) {
      console.error("Backend createMediation error:", result.status, result.data);
      return NextResponse.json(result.data, { status: result.status });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("Mediation create error:", error);
    return NextResponse.json(
      { error: "Mediation konnte nicht erstellt werden" },
      { status: 500 },
    );
  }
}
