import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { backendFetch } from "@/lib/backend";
import KalenderSeite from "./KalenderSeite";

// ── Der Kalender als eigene Seite ───────────────────────────────────────────
//
// Bisher lag der Betreuungskalender im Konflikt-Logbuch vergraben und war nur
// bei Trennungsfällen überhaupt sichtbar. Wer wissen wollte, wann das Kind bei
// wem ist, musste erst ein Logbuch öffnen – ein Werkzeug für Konfliktdoku, um
// einen Wochenplan zu lesen.
//
// Diese Seite dreht das um: der Kalender ist das Ziel, das Logbuch nur einer
// von mehreren Einbauorten. Die ID kommt nicht aus der URL, sondern vom
// Backend (`/kalender/mein`) – dieselbe Komponente lässt sich damit später an
// eine andere Datenquelle hängen, ohne dass die Adresse sich ändert.
export const metadata = {
  title: "Kalender",
  robots: { index: false, follow: false },
};

type MeinKalender = {
  mediation_id: number | null;
  rolle: string | null;
  titel: string | null;
  offene_anfragen?: number;
  wartet_auf_mich?: number;
};

export default async function KalenderPage({
  searchParams,
}: {
  searchParams: Promise<{ datum?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/dashboard/kalender");

  const { datum } = await searchParams;
  const result = await backendFetch<MeinKalender>("/kalender/mein");
  const daten = result.ok ? result.data : null;

  return (
    <KalenderSeite
      mediationId={daten?.mediation_id ? String(daten.mediation_id) : null}
      // Der Kind-Zugang darf sehen, nicht ändern. Das Backend erzwingt es
      // ohnehin – hier geht es darum, keine Knöpfe zu zeigen, die im 403 enden.
      nurLesen={daten?.rolle === "kind"}
      startDatum={datum ?? null}
    />
  );
}
