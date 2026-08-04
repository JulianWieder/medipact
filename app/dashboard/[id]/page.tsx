import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMediation } from "@/lib/mediations";
import MediationClient from "./MediationClient";
import { decodeId } from "@/lib/ids";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * Phase des Falls → Route, unter der sie gerendert wird.
 *
 * Nicht jede Phase hat einen gleichnamigen Ordner: "einladung" ist die
 * Vor-Phase mit dem Bezahl-Schritt (Block "fall_freischaltung") und wird von
 * /dashboard/[id]/einleitung mitgerendert — ein Redirect auf
 * /dashboard/<id>/einladung liefe in einen 404. Deshalb diese Tabelle statt
 * `redirect(.../${phase})`.
 *
 * Phasen, die hier FEHLEN (null, "draft"), bedeuten: der Fall ist noch in der
 * Vorbereitung, diese Seite ist der richtige Ort — kein Redirect.
 */
const PHASE_ROUTE: Record<string, string> = {
  einladung: "einleitung",
  einleitung: "einleitung",
  themensammlung: "themensammlung",
  interessen: "interessen",
  optionen: "optionen",
  verhandlung: "verhandlung",
  abschluss: "abschluss",
};

export default async function MediationPage({ params }: PageProps) {
  const { id } = await params;

  const numericId = decodeId(id);
  if (!numericId) redirect("/dashboard");

  const [result, session] = await Promise.all([
    getMediation(numericId.toString()),
    auth(),
  ]);

  if (!result.ok) {
    redirect("/dashboard");
  }

  // Konflikt-Logbücher haben eine eigene, kostenlose Ansicht.
  if ((result.data as { mode?: string })?.mode === "logbuch") {
    redirect(`/dashboard/logbuch/${id}`);
  }

  // ── Wiedereinstieg: an der aktuellen Phase weitermachen ───────────────────
  //
  // Diese Seite ist die VORBEREITUNG eines Falls (Beteiligte verbinden,
  // Mediation starten). Sobald das Verfahren läuft, hat hier niemand mehr
  // etwas zu tun — wer sich neu anmeldet, landete bisher trotzdem wieder auf
  // dieser Checkliste, weil das Dashboard immer auf /dashboard/<id> verlinkt
  // und nur die eingeladene Partei weitergeleitet wurde (und auch die erst
  // nach der Zahlung, clientseitig in MediationClient).
  //
  // Jetzt serverseitig und für ALLE Rollen: die Phase des Falls entscheidet.
  // Bewusst ABGELEITET aus mediations.phase statt aus einem gespeicherten
  // „zuletzt besucht" — ein gespeicherter Stand kann auf eine Phase zeigen,
  // die es nicht mehr gibt, diese Rechnung nie.
  const phase = (result.data as { phase?: string | null })?.phase ?? null;
  const organizationId =
    (result.data as { organization_id?: number | null })?.organization_id ?? null;
  const target = phase ? PHASE_ROUTE[phase] : undefined;
  if (target) {
    // Abo-Fälle (Firmen-Abo) haben einen eigenen, schlanken Business-Start
    // (Grundkonfiguration + Rahmen + Kurz-Intake) VOR der Einleitung. Diese
    // Ausnahme stand bisher nur clientseitig in MediationClient und griff
    // deshalb nicht, sobald hier serverseitig umgeleitet wird.
    if (organizationId != null && target === "einleitung") {
      redirect(`/dashboard/${id}/start`);
    }
    redirect(`/dashboard/${id}/${target}`);
  }

  return (
    <MediationClient
      mediationId={numericId.toString()}
      userRole={session?.user?.role ?? "party"}
      currentUserName={session?.user?.name ?? ""}
      initialIsPaid={result.data?.is_paid ?? false}
      initialOrganizationId={(result.data as { organization_id?: number | null })?.organization_id ?? null}
      mediationType={(result.data as { mediation_type?: string })?.mediation_type ?? ""}
    />
  );
}
