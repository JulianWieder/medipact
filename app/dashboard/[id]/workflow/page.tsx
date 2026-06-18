import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMediation } from "@/lib/mediations";
import WorkflowClient from "./WorkflowClient";
import { decodeId } from "@/lib/ids";

type PageProps = { params: Promise<{ id: string }> };

export default async function WorkflowPage({ params }: PageProps) {
  const { id } = await params;
  const numericId = decodeId(id);
  if (!numericId) return redirect("/dashboard");

  const [mediationResult, session] = await Promise.all([
    getMediation(numericId.toString()),
    auth(),
  ]);

  if (!mediationResult.ok) return redirect("/dashboard");

  return (
    <WorkflowClient
      mediationId={numericId.toString()}
      userRole={session?.user?.role ?? "party"}
    />
  );
}
