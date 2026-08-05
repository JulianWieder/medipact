import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  // Body ist optional: ohne ihn geht es um den eigenen Anteil, mit
  // `for_participant_id` um die separate Übernahme eines fremden Anteils.
  let body: unknown = undefined;
  try {
    body = await req.json();
  } catch {
    /* kein Body – dann der eigene Anteil */
  }
  const result = await backendFetch(`/mediations/${id}/pay/paypal/create-order`, {
    method: "POST",
    ...(body ? { body } : {}),
  });
  if (!result.ok) return NextResponse.json(result.data, { status: result.status });
  return NextResponse.json(result.data);
}
