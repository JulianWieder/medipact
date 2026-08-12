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
// `manifest` steht NUR hier und nicht in app/manifest.ts. Ein Manifest im
// app-Wurzelverzeichnis würde Next in JEDE Seite verlinken – dann böte Chrome
// auch auf der Startseite an, „medipact Kalender" zu installieren. Der Kalender
// ist aber das einzige, was als App Sinn ergibt (siehe public/kalender.webmanifest).
//
// `scope` im Manifest steht trotzdem auf "/" und nicht auf "/dashboard": Läuft
// die Session ab, leitet die Middleware auf /auth/login um. Wäre das außerhalb
// des Scopes, risse der Login den Nutzer aus der installierten App in einen
// Browser-Tab – und dort bliebe er.
export const metadata = {
  title: "Kalender",
  robots: { index: false, follow: false },
  manifest: "/kalender.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Kalender",
    statusBarStyle: "default" as const,
  },
};

type MeinKalender = {
  mediation_id: number | null;
  rolle: string | null;
  titel: string | null;
  offene_anfragen?: number;
  wartet_auf_mich?: number;
  // Gesetzt, sobald aus dem Logbuch eine Mediation geworden ist. Ohne diese
  // Unterscheidung sah „umgewandelt" genauso aus wie „noch nie eines gehabt" —
  // und die Seite bot an, ein zweites Buch neben dem eigenen Verfahren
  // anzulegen.
  gesperrt?: boolean;
  fall_id?: number | null;
  fall_titel?: string | null;
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
      gesperrt={daten?.gesperrt === true}
      fallId={daten?.fall_id ?? null}
      fallTitel={daten?.fall_titel ?? null}
    />
  );
}
