import MediationChat from "@/app/components/mediation/MediationChat";

/**
 * Layout für alle Seiten eines Falls (Übersicht + alle Phasen-Seiten).
 * Mountet den schwebenden Fall-Chat, damit die Teilnehmer sich jederzeit —
 * auch außerhalb der vorgegebenen Workflow-Schritte — austauschen können.
 * Das Widget blendet sich selbst aus, solange der Fall nicht freigeschaltet
 * ist (402) oder der Nutzer keinen Zugriff hat (403).
 */
export default async function MediationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      {children}
      <MediationChat mediationId={id} variant="floating" />
    </>
  );
}
