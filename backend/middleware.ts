// middleware.ts
import { NextResponse } from "next/server";

export async function middleware(req: Request) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);

    if (!res.ok) throw new Error();

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/backend-down", req.url));
  }
}
