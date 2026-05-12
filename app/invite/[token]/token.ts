import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  const valid = token.length > 20;

  if (!valid) {
    return NextResponse.json(
      { valid: false, error: "Invite ungültig" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    valid: true,
    token,
    email: null,
    status: "pending",
  });
}
