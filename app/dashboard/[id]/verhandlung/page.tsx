import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMediation } from "@/lib/mediations";
import PhaseNotesClient from "../_shared/PhaseNotesClient";
import { decodeId } from "@/lib/ids";

type PageProps = { params: Promise<{ id: string }> };

export default async function VerhandlungPage({ params }: PageProps) {
  const { id } = await params;

  const numericId = decodeId(id);
  if (!numericId) redirect("/dashboard");

  const [mediationResult, session] = await Promise.all([
    getMediation(numericId.toString()),
    auth(),
  ]);
  if (!mediationResult.ok) redirect("/dashboard");
  return (
    <PhaseNotesClient
      mediationId={numericId.toString()}
      phaseKey="verhandlung"
      currentUserName={session?.user?.name ?? ""}
    />
  );
}
