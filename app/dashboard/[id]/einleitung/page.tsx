import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMediation } from "@/lib/mediations";
import EinleitungClient from "./EinleitungClient";
import { decodeId } from "@/lib/ids";

type PageProps = { params: Promise<{ id: string }> };

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
    <EinleitungClient
      mediationId={numericId.toString()}
      currentUserName={session?.user?.name ?? ""}
    />
  );
}
