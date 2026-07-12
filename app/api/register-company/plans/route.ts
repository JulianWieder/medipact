import { NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";

// Öffentliche Business-Tarife für die Unternehmens-Registrierung.
export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/plans`, { cache: "no-store" });
    const data = await res.json().catch(() => []);
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch {
    return NextResponse.json([], { status: 502 });
  }
}
