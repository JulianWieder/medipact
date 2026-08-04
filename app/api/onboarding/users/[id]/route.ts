import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// GET /api/onboarding/users/[id] → Backend: GET /onboarding/users/{id}
//
// Onboarding-Stand und Antworten EINER Person. Die Rechteprüfung (Admin: alle,
// firm_admin: eigener Mandant, Mediator: nur Personen aus den eigenen Fällen)
// passiert ausschließlich im Backend — hier bewusst keine zweite, die
// auseinanderlaufen könnte.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await backendFetch(`/onboarding/users/${encodeURIComponent(id)}`);
  return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
}
