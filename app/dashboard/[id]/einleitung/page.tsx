import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMediation } from "@/lib/mediations";
import EinleitungClient from "./EinleitungClient";

type PageProps = { params: Promise<{ id: string }> };

export default async function EinleitungPage({ params }: PageProps) {
  const { id } = await params;

  const [mediationResult, session] = await Promise.all([
    getMediation(id),
    auth(),
  ]);

  if (!mediationResult.ok) redirect("/dashboard");

  return (
    <EinleitungClient
      mediationId={id}
      currentUserName={session?.user?.name ?? ""}
    />
  );
}
