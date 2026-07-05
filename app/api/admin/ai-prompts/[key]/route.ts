import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

// PUT /api/admin/ai-prompts/[key] — Prompt-Text überschreiben.
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;
  const body = await request.json().catch(() => ({}));
  const result = await backendFetch(`/admin/ai-prompts/${encodeURIComponent(key)}`, {
    method: "PUT",
    body,
  });
  return NextResponse.json(result.data, { status: result.status });
}

// DELETE /api/admin/ai-prompts/[key] — auf Code-Default zurücksetzen.
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;
  const result = await backendFetch(`/admin/ai-prompts/${encodeURIComponent(key)}`, {
    method: "DELETE",
  });
  return NextResponse.json(result.data, { status: result.status });
}
