import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// DELETE /api/konto – löscht das Konto.
//
// Ob sofort gelöscht oder nur vermerkt wird, entscheidet ausschließlich das
// Backend anhand der Datenlage. Diese Route reicht durch und trifft bewusst
// keine eigene Entscheidung: Sonst könnte ein Client mit dem falschen Flag
// eine Löschung erzwingen, die der Gegenseite ihre Fallakte wegnimmt.
export async function DELETE(request: Request) {
  const body = await request.json().catch(() => ({}));
  const result = await backendFetch("/konto", { method: "DELETE", body });
  return NextResponse.json(result.data, { status: result.ok ? 200 : result.status });
}
