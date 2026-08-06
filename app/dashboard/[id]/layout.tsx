import MediationChat from "@/app/components/mediation/MediationChat";
import { decodeId } from "@/lib/ids";

/**
 * Layout für alle Seiten eines Falls (Übersicht + alle Phasen-Seiten).
 * Mountet den schwebenden Fall-Chat, damit die Teilnehmer sich jederzeit —
 * auch außerhalb der vorgegebenen Workflow-Schritte — austauschen können.
 * Das Widget blendet sich selbst aus, solange der Fall nicht freigeschaltet
 * ist (402) oder der Nutzer keinen Zugriff hat (403).
 *
 * WICHTIG: `params.id` ist der kodierte URL-Hash (lib/ids.ts), NICHT die
 * Datenbank-ID. Er muss vor jedem Backend-Aufruf durch `decodeId`. Genau das
 * fehlte hier: der Chat schickte den Hash an /mediations/<id>/chat, FastAPI
 * erwartet dort ein int und antwortete auf JEDEN Request mit 422 — der Chat
 * war für alle Teilnehmer komplett tot (Mediator-Ansicht im Workspace nicht,
 * die übergibt die numerische fall.id).
 */
export default async function MediationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = decodeId(id);
  return (
    <>
      {children}
      {numericId && <MediationChat mediationId={numericId} variant="floating" />}
    </>
  );
}
