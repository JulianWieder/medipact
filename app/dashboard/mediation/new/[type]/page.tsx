import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getConfig } from "@/lib/mediation-types/registry";
import { mediationRegistry } from "@/lib/mediation-types/registry";
import { MediationType } from "@/lib/mediation-types/types";
import NewMediationWizard from "@/app/components/mediation/NewMediationWizard";

export function generateStaticParams() {
  return Object.keys(mediationRegistry).map((type) => ({ type }));
}

export default async function NewMediationByTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/login");
  }

  const { type } = await params;
  const config = getConfig(type as MediationType);

  return <NewMediationWizard config={config} />;
}
