import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMediation } from "@/lib/mediations";
import MediationClient from "./MediationClient";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MediationPage({ params }: PageProps) {
  const { id } = await params;

  const [result, session] = await Promise.all([
    getMediation(id),
    auth(),
  ]);

  if (!result.ok) {
    redirect("/dashboard");
  }

  return (
    <MediationClient
      mediationId={id}
      userRole={session?.user?.role ?? "party"}
    />
  );
}
