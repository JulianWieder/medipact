import { redirect } from "next/navigation";
import { getMediation } from "@/lib/mediations";
import AktivClient from "./AktivClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AktivPage({ params }: PageProps) {
  const { id } = await params;

  const result = await getMediation(id);

  if (!result.ok) {
    redirect("/dashboard");
  }

  const phase = (result.data?.phase as string) ?? "einleitung";

  return <AktivClient mediationId={id} initialPhase={phase} />;
}
