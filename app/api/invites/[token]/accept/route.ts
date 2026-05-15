import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// POST /api/invites/[token]/accept
// Numeric token  -> In-App accept by invite ID  (POST /invites/{id}/accept-direct)
// String token   -> E-Mail-link accept by token (POST /invites/{token}/accept)
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  const isNumeric = /^\d+$/.test(token);
  const path = isNumeric
    ? `/invites/${token}/accept-direct`
    : `/invites/${token}/accept`;

  const result = await backendFetch<{ mediation_id: number; status: string }>(
    path,
    { method: "POST" },
  );

  console.log(`[accept] ${path} → ${result.status}`, JSON.stringify(result.data));

  return NextResponse.json(
    result.data ?? { error: `Backend-Fehler ${result.status}` },
    { status: result.ok ? 200 : result.status },
  );
}
