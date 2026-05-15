// DEPRECATED: migrated to app/dashboard/mediation/new/[type]/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getConfig } from "@/lib/mediation-types/registry";
import NewMediationWizard from "@/components/mediation/NewMediationWizard";

export default async function NachbarschaftPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");
  const config = getConfig("nachbarschaft");
  return <NewMediationWizard config={config} />;
}
