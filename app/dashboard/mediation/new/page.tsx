import { auth } from "@/auth";
import { redirect } from "next/navigation";
import NewMediationClient from "./NewMediationClient";

export default async function NewMediationPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return <NewMediationClient />;
}
