import { redirect } from "next/navigation";
import { getMediation } from "@/lib/mediations";
import MediationClient from "./MediationClient";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MediationPage({ params }: PageProps) {
  const { id } = await params;

  const result = await getMediation(id);

  if (!result.ok) {
    redirect("/dashboard");
  }

  return <MediationClient mediationId={id} />;
}
