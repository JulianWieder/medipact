import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import OnboardingClient from "./OnboardingClient";

// Das einmalige Nutzer-Onboarding. Absichtlich NICHT unter /dashboard:
// die Middleware leitet /dashboard und /workspace hierher um, solange das
// Onboarding offen ist — läge die Seite selbst darunter, liefe die Umleitung
// im Kreis.
export const metadata = {
  title: "Einrichtung",
  robots: { index: false, follow: false },
};

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/onboarding");

  return (
    // useSearchParams (callbackUrl) braucht eine Suspense-Grenze, sonst
    // erzwingt Next für die ganze Route Client-Side-Rendering und meldet das
    // beim Build als Fehler.
    <Suspense fallback={null}>
      <OnboardingClient userName={session.user.name ?? ""} />
    </Suspense>
  );
}
