import { NextResponse } from "next/server";
import { kernoZugang } from "@/lib/mediatoren";

// Profilfoto einer freigegebenen Mediatorin aus kerno (lib/mediatoren.ts).
// kerno prüft selbst, ob das Profil öffentlich ist – sonst 404.
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const zugang = kernoZugang();
  if (!zugang) return new NextResponse(null, { status: 404 });
  let res: Response;
  try {
    res = await fetch(`${zugang.basis}/oeffentlich/verzeichnis/${encodeURIComponent(slug)}/foto`, {
      headers: zugang.headers,
      next: { revalidate: 300 },
    });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
  if (!res.ok) return new NextResponse(null, { status: res.status === 404 ? 404 : 502 });
  const typ = res.headers.get("content-type") ?? "";
  if (!/^image\/(jpeg|png|webp)$/.test(typ)) return new NextResponse(null, { status: 502 });
  return new NextResponse(res.body, {
    status: 200,
    headers: { "content-type": typ, "cache-control": "public, max-age=300, stale-while-revalidate=86400" },
  });
}
