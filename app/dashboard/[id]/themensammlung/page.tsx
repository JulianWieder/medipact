import { redirect } from "next/navigation";
import { getMediation } from "@/lib/mediations";
import PhaseClient from "../_shared/PhaseClient";

type PageProps = { params: Promise<{ id: string }> };

export default async function ThemensammlungPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getMediation(id);
  if (!result.ok) redirect("/dashboard");
  return <PhaseClient mediationId={id} phaseKey="themensammlung" />;
}
