import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LeitfadenClient from "./LeitfadenClient";

type PageProps = { params: Promise<{ id: string }> };

export default async function LeitfadenPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  const role = session?.user?.role ?? "party";

  // Nicht-Mediatoren/Admins direkt weiterleiten
  if (role !== "mediator" && role !== "admin") {
    redirect(`/dashboard/${id}/einleitung`);
  }

  return <LeitfadenClient mediationId={id} />;
}
