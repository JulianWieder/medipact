import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMediation } from "@/lib/mediations";
import { decodeId } from "@/lib/ids";
import LogbuchClient from "./LogbuchClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function LogbuchPage({ params }: PageProps) {
  const { id } = await params;

  const numericId = decodeId(id);
  if (!numericId) redirect("/dashboard");

  const [result, session] = await Promise.all([
    getMediation(numericId.toString()),
    auth(),
  ]);

  if (!session?.user) redirect("/auth/login");
  if (!result.ok) redirect("/dashboard");

  const data = result.data as {
    mode?: string;
    mediation_type?: string;
    title?: string;
  } | null;

  // Umgewandelte Logbücher führen zur normalen Fall-Seite.
  if (data?.mode && data.mode !== "logbuch") {
    redirect(`/dashboard/${id}`);
  }

  return (
    <LogbuchClient
      mediationId={numericId.toString()}
      initialTitle={data?.title ?? "Mein Konflikt-Logbuch"}
      mediationType={data?.mediation_type ?? "nachbarschaft"}
    />
  );
}
