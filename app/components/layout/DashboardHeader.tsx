import { auth } from "@/auth";
import DashboardHeaderClient from "./DashboardHeaderClient";

export async function DashboardHeader() {
  const session = await auth();

  const username =
    session?.user?.name ||
    session?.user?.email?.split("@")[0] ||
    "Benutzer";

  const email = session?.user?.email ?? "";

  return (
    <DashboardHeaderClient
      username={username}
      email={email}
      // Ablaufzeitpunkt der Session (rollend, wird bei jeder Anfrage neu
      // gesetzt) — der Countdown im Header startet damit.
      sessionExpiresAt={session?.expires ?? null}
    />
  );
}
