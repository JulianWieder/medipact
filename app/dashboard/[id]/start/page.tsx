import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMediation } from "@/lib/mediations";
import { decodeId, encodeId } from "@/lib/ids";
import AboStartClient from "./AboStartClient";

// Schlanker Business-Start für Beteiligte in ABO-Fällen (organization_id gesetzt):
// Grundkonfiguration des Unternehmens ansehen + Rahmen akzeptieren + kurzes
// Intake — ohne Paketwahl, ohne Zahlung (Fall ist über das Firmen-Abo bezahlt).
// B2C-Fälle haben hier nichts verloren -> zurück zur Fall-Seite.
export default async function AboStartPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = decodeId(id);
  if (!numericId) redirect("/dashboard");

  const [result, session] = await Promise.all([
    getMediation(numericId.toString()),
    auth(),
  ]);
  if (!session?.user) redirect("/auth/login");
  if (!result.ok) redirect("/dashboard");

  const organizationId = (result.data as { organization_id?: number | null })
    ?.organization_id ?? null;
  if (!organizationId) {
    redirect(`/dashboard/${encodeId(numericId)}`);
  }

  return (
    <AboStartClient
      mediationId={numericId.toString()}
      organizationId={organizationId}
    />
  );
}
