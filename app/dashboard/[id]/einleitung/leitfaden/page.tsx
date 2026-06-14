import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { decodeId, encodeId } from "@/lib/ids";
import LeitfadenClient from "./LeitfadenClient";

type PageProps = { params: Promise<{ id: string }> };

export default async function LeitfadenPage({ params }: PageProps) {
  const { id } = await params;

  const numericId = decodeId(id);
  if (!numericId) redirect("/dashboard");

  const session = await auth();

  const role = session?.user?.role ?? "party";

  // Nicht-Mediatoren/Admins direkt weiterleiten
  if (role !== "mediator" && role !== "admin") {
    redirect(`/dashboard/${encodeId(numericId)}/einleitung`);
  }

  return <LeitfadenClient mediationId={numericId.toString()} />;
}
