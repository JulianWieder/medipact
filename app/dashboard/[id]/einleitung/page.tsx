import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMediation } from "@/lib/mediations";
import PhaseNotesClient from "../_shared/PhaseNotesClient";
import { decodeId } from "@/lib/ids";

type PageProps = { params: Promise<{ id: string }> };

// Die Einleitung läuft jetzt – wie alle anderen Phasen – block-basiert über den
// PhaseNotesClient und ist damit im Workflow Manager gestaltbar. Der frühere
// fest verdrahtete EinleitungClient dient als inhaltliches Vorbild für die
// Standard-Schritte (siehe Seed-Migration seed_einleitung_blocks).
export default async function EinleitungPage({ params }: PageProps) {
  const { id } = await params;
  const numericId = decodeId(id);
  if (!numericId) return redirect("/dashboard");

  const [mediationResult, session] = await Promise.all([
    getMediation(numericId.toString()),
    auth(),
  ]);

  if (!mediationResult.ok) return redirect("/dashboard");

  return (
    <PhaseNotesClient
      mediationId={numericId.toString()}
      phaseKey="einleitung"
      currentUserName={session?.user?.name ?? ""}
    />
  );
}
