import { redirect } from "next/navigation";
import { getMediation } from "@/lib/mediations";
import { decodeId, encodeId } from "@/lib/ids";

type PageProps = { params: Promise<{ id: string }> };

/**
 * /dashboard/[id]/aktiv is an entry redirect.
 * The DB has no phase column, so we always land on einleitung.
 * Future: once the backend tracks phase, read it here and redirect accordingly.
 */
export default async function AktivPage({ params }: PageProps) {
  const { id } = await params;

  const numericId = decodeId(id);
  if (!numericId) redirect("/dashboard");

  const result = await getMediation(numericId.toString());
  if (!result.ok) redirect("/dashboard");
  redirect(`/dashboard/${encodeId(numericId)}/einleitung`);
}
