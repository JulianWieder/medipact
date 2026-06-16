import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMediation } from "@/lib/mediations";
import MediationClient from "./MediationClient";
import { decodeId } from "@/lib/ids";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MediationPage({ params }: PageProps) {
  const { id } = await params;

  const numericId = decodeId(id);
  if (!numericId) redirect("/dashboard");

  const [result, session] = await Promise.all([
    getMediation(numericId.toString()),
    auth(),
  ]);

  if (!result.ok) {
    redirect("/dashboard");
  }

  return (
    <MediationClient
      mediationId={numericId.toString()}
      userRole={session?.user?.role ?? "party"}
      currentUserName={session?.user?.name ?? ""}
      initialIsPaid={result.data.is_paid ?? false}
    />
  );
}
