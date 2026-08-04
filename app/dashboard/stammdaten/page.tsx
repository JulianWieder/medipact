import { redirect } from "next/navigation";
import { auth } from "@/auth";
import StammdatenClient from "./StammdatenClient";

// Die eigenen Angaben aus dem Nutzer-Onboarding, jederzeit änderbar.
// Erreichbar über das Nutzermenü oben rechts.
export const metadata = {
  title: "Stammdaten",
  robots: { index: false, follow: false },
};

export default async function StammdatenPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/dashboard/stammdaten");

  return <StammdatenClient email={session.user.email ?? ""} />;
}
