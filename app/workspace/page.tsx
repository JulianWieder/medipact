import { auth } from "@/auth";
import { redirect } from "next/navigation";
import WorkspaceClient from "./WorkspaceClient";

export default async function WorkspacePage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/workspace");

  const userEmail = session.user.email ?? undefined;

  return <WorkspaceClient userEmail={userEmail} />;
}
