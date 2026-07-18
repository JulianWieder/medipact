import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMediation } from "@/lib/mediations";
import { decodeId } from "@/lib/ids";
import AufklaerungClient from "./AufklaerungClient";

// Aufklärungs-Intro für die eingeladene Partei: Situation, was Mediation
// ist, Ablauf auf medipact, Erklär-Video — VOR Rechnungsdaten/Zahlung.
// Die Fall-Seite (MediationClient) leitet other_party ohne Bestätigung
// hierher; der Client leitet nach Bestätigung zurück zur Checkliste.
export default async function IntroPage({
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

  return <AufklaerungClient mediationId={numericId.toString()} />;
}
