import { redirect } from "next/navigation";
import { getMediation } from "@/lib/mediations";

type PageProps = { params: Promise<{ id: string }> };

/**
 * /dashboard/[id]/aktiv is an entry redirect.
 * The DB has no phase column, so we always land on einleitung.
 * Future: once the backend tracks phase, read it here and redirect accordingly.
 */
export default async function AktivPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getMediation(id);
  if (!result.ok) redirect("/dashboard");
  redirect(`/dashboard/${id}/einleitung`);
}
