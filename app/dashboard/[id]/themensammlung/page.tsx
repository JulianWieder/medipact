import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMediation } from "@/lib/mediations";
import PhaseNotesClient from "../_shared/PhaseNotesClient";

type PageProps = { params: Promise<{ id: string }> };

export default async function ThemensammlungPage({ params }: PageProps) {
  const { id } = await params;
  const [mediationResult, session] = await Promise.all([
    getMediation(id),
    auth(),
  ]);
  if (!mediationResult.ok) redirect("/dashboard");
  return (
    <PhaseNotesClient
      mediationId={id}
      phaseKey="themensammlung"
      currentUserName={session?.user?.name ?? ""}
    />
  );
}
