import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

export type PendingInvite = {
  invite_id: number;
  mediation_id: number;
  mediation_title: string;
  mediation_type: string;
  role: string;
  expires_at: string;
};

export async function GET() {
  const result = await backendFetch<PendingInvite[]>("/invites/me");

  if (!result.ok) {
    return NextResponse.json(result.data, { status: result.status });
  }

  return NextResponse.json(result.data ?? []);
}
