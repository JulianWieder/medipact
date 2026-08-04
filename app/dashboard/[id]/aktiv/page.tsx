import { redirect } from "next/navigation";
import { getMediation } from "@/lib/mediations";
import { decodeId, encodeId } from "@/lib/ids";

type PageProps = { params: Promise<{ id: string }> };

/**
 * /dashboard/[id]/aktiv ist ein Einstiegs-Redirect auf die AKTUELLE Phase.
 *
 * Früher landete hier jeder pauschal auf "einleitung" — mit dem Kommentar
 * „The DB has no phase column". Das stimmt seit langem nicht mehr:
 * mediations.phase existiert und wird beim Start und bei jedem Phasenwechsel
 * gesetzt. Der feste Redirect warf damit jeden, der über diesen Link kam,
 * zurück an den Anfang des Verfahrens.
 *
 * Die Tabelle Phase → Route steht bewusst hier UND in ../page.tsx
 * nebeneinander: beides sind Server Components mit je drei Zeilen Logik, und
 * ein gemeinsames Modul für sieben Einträge verschleiert mehr, als es spart.
 * Kommt eine Phase dazu, müssen beide angefasst werden.
 */
const PHASE_ROUTE: Record<string, string> = {
  // "einladung" ist die Vor-Phase mit dem Bezahl-Schritt und wird von der
  // Einleitungs-Seite mitgerendert — einen eigenen Ordner gibt es nicht.
  einladung: "einleitung",
  einleitung: "einleitung",
  themensammlung: "themensammlung",
  interessen: "interessen",
  optionen: "optionen",
  verhandlung: "verhandlung",
  abschluss: "abschluss",
};

export default async function AktivPage({ params }: PageProps) {
  const { id } = await params;

  const numericId = decodeId(id);
  if (!numericId) redirect("/dashboard");

  const result = await getMediation(numericId.toString());
  if (!result.ok) redirect("/dashboard");

  const phase = (result.data as { phase?: string | null })?.phase ?? null;
  const target = (phase && PHASE_ROUTE[phase]) || null;
  const base = `/dashboard/${encodeId(numericId)}`;

  // Noch keine Phase gesetzt = der Fall ist in der Vorbereitung. Dann gehört
  // der Nutzer auf die Fall-Seite (Beteiligte verbinden) und nicht in die
  // Einleitung — dort liefe er direkt in die Paywall.
  redirect(target ? `${base}/${target}` : base);
}
