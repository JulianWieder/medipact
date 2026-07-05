// Client-side API helpers – rufen die Next.js API-Routes auf,
// die ihrerseits über backendFetch mit dem Backend kommunizieren.

import type { MediationCase, MediationDetail, Participant, MediationNote, PhaseNoteGroup, UserRoleInfo, SystemUser, AppointmentEvent, FeedbackEntry, Invoice, InvoiceCreateInput, InvoiceUpdateInput, MediationVariantDto, PhaseStepDefaultDto, StepContent } from "./types";

// ── Mediations ────────────────────────────────────────────────────────────

export async function fetchMediations(): Promise<MediationCase[]> {
  const res = await fetch("/api/mediations/me", { cache: "no-store" });
  if (!res.ok) throw new Error("Fälle konnten nicht geladen werden");
  const data = await res.json();
  // Normalisiere: mediation_id → id
  return (data ?? []).map((item: Record<string, unknown>) => ({
    id: (item.mediation_id ?? item.id) as number,
    mediation_id: (item.mediation_id ?? item.id) as number,
    title: (item.title as string) ?? "Neue Mediation",
    mediation_type: (item.mediation_type ?? item.conflict_type ?? "nachbarschaft") as string,
    status: (item.status ?? "draft") as string,
    phase: (item.phase ?? null) as string | null,
    progress: (item.progress ?? 0) as number,
    description: (item.description ?? null) as string | null,
    role: (item.role ?? "") as string,
  }));
}

export async function fetchMediationDetail(id: number): Promise<MediationDetail> {
  const res = await fetch(`/api/mediations/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Fall konnte nicht geladen werden");
  return res.json();
}

export async function advanceMediationPhase(id: number): Promise<void> {
  const res = await fetch(`/api/mediations/${id}/advance`, { method: "POST" });
  if (!res.ok) throw new Error("Phase konnte nicht vorgerückt werden");
}

export async function updateMediationStatus(
  id: number,
  payload: { status?: string; phase?: string; title?: string; description?: string },
): Promise<void> {
  const res = await fetch(`/api/mediations/${id}/update`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Mediation konnte nicht aktualisiert werden");
}

// ── Participants ──────────────────────────────────────────────────────────

export async function fetchParticipants(mediationId: number): Promise<Participant[]> {
  const res = await fetch(`/api/mediations/${mediationId}/participants`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function inviteParty(
  mediationId: number,
  email: string,
  role: string = "other_party",
): Promise<{ invite_url: string }> {
  const res = await fetch(`/api/mediations/${mediationId}/invites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ invited_email: email, role }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? "Einladung fehlgeschlagen");
  }
  return res.json();
}

// ── Notes ─────────────────────────────────────────────────────────────────

export async function fetchNotes(
  mediationId: number,
  phase: string,
  step: string = "",
): Promise<MediationNote[]> {
  const params = new URLSearchParams({ phase, step });
  const res = await fetch(`/api/mediations/${mediationId}/notes?${params}`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

// ── Admin: alle Fälle ─────────────────────────────────────────────────────

/** Gibt ALLE Mediationen zurück (ohne Teilnehmerfilter). Nur für Mediatoren/Admins. */
export async function fetchAllMediations(): Promise<MediationCase[]> {
  const res = await fetch("/api/admin/mediations", { cache: "no-store" });
  if (res.status === 403) return fetchMediations(); // Fallback: kein Admin
  if (!res.ok) throw new Error("Fälle konnten nicht geladen werden");
  const data = await res.json();
  return (data ?? []).map((item: Record<string, unknown>) => ({
    id: (item.mediation_id ?? item.id) as number,
    mediation_id: (item.mediation_id ?? item.id) as number,
    title: (item.title as string) ?? "Neue Mediation",
    mediation_type: (item.mediation_type ?? "nachbarschaft") as string,
    status: (item.status ?? "draft") as string,
    phase: (item.phase ?? null) as string | null,
    progress: (item.progress ?? 0) as number,
    description: (item.description ?? null) as string | null,
    role: (item.role ?? "mediator") as string,
    variant_key: (item.variant_key ?? null) as string | null,
  }));
}

// ── Alle Notizen eines Falls ──────────────────────────────────────────────

/** Alle Notizen aller Phasen für einen Fall – für Mediatorenübersicht. */
export async function fetchAllNotes(mediationId: number): Promise<PhaseNoteGroup[]> {
  const res = await fetch(`/api/mediations/${mediationId}/notes/all`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

// ── Nutzerrolle ───────────────────────────────────────────────────────────

/** Gibt Rolle und Admin-Status des eingeloggten Nutzers zurück. */
export async function fetchUserRole(): Promise<UserRoleInfo | null> {
  const res = await fetch("/api/auth/me/role", { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

// ── Step status ───────────────────────────────────────────────────────────

export async function fetchStepStatus(
  mediationId: number,
  phase: string,
  step: string,
): Promise<{
  participants: { participant_id: string; name: string; role: string; submitted: boolean }[];
  all_submitted: boolean;
}> {
  const params = new URLSearchParams({ phase, step });
  const res = await fetch(`/api/mediations/${mediationId}/step-status?${params}`, {
    cache: "no-store",
  });
  if (!res.ok) return { participants: [], all_submitted: false };
  return res.json();
}

// ── Workflow-Regeln (wer muss welchen Schritt abschließen) ────────────────

export interface WorkflowRule {
  phase: string;
  step: string;
  required_roles: string[] | null;
  skip: boolean;
}

export interface WorkflowRulesResponse {
  default_required_roles: string[];
  available_roles: string[];
  rules: WorkflowRule[];
}

export async function fetchWorkflowRules(mediationId: number): Promise<WorkflowRulesResponse | null> {
  const res = await fetch(`/api/mediations/${mediationId}/workflow-rules`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function saveWorkflowRule(
  mediationId: number,
  rule: { phase: string; step: string; required_roles: string[]; skip: boolean },
): Promise<boolean> {
  const res = await fetch(`/api/mediations/${mediationId}/workflow-rules`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rule),
  });
  return res.ok;
}

export async function deleteWorkflowRule(
  mediationId: number,
  phase: string,
  step: string,
): Promise<boolean> {
  const params = new URLSearchParams({ phase, step });
  const res = await fetch(`/api/mediations/${mediationId}/workflow-rules?${params}`, {
    method: "DELETE",
  });
  return res.ok;
}

// ── Admin: alle Nutzer ────────────────────────────────────────────────────

/** Alle registrierten Nutzer - nur fuer Admins/Mediatoren. */
export async function fetchAllUsers(): Promise<SystemUser[]> {
  const res = await fetch("/api/admin/users", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

/** Ändert die Rolle eines Nutzers. Nur für echte Administratoren (Backend prüft). */
export async function updateUserRole(userId: number, role: string): Promise<SystemUser> {
  const res = await fetch(`/api/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? "Rolle konnte nicht geändert werden");
  }
  return res.json();
}

/** Löscht einen Nutzer. Nur für echte Administratoren (Backend prüft). */
export async function deleteUser(userId: number): Promise<void> {
  const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? "Nutzer konnte nicht gelöscht werden");
  }
}

// ── Kalender / Termine ────────────────────────────────────────────────────

/** Alle Terminslots über alle Mediationen des eingeloggten Nutzers. */
export async function fetchAllAppointments(): Promise<AppointmentEvent[]> {
  const res = await fetch("/api/appointments/all", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

// ── Feedback ──────────────────────────────────────────────────────────────

/** Alle Feedback-Einträge über alle Mediationen des eingeloggten Nutzers, chronologisch. */
export async function fetchAllFeedback(): Promise<FeedbackEntry[]> {
  const res = await fetch("/api/feedback/all", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

// ── Rechnungen ────────────────────────────────────────────────────────────
//
// Ruft /api/invoices auf (siehe app/api/invoices/route.ts), das per
// backendFetch an das medipact-api-Backend weiterleitet (GET/POST /invoices,
// PATCH /invoices/{id} in backend/app/routers/invoices.py).

export async function fetchInvoices(): Promise<Invoice[]> {
  const res = await fetch("/api/invoices", { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json().catch(() => null);
  return Array.isArray(data) ? data : [];
}

export async function createInvoice(payload: InvoiceCreateInput): Promise<Invoice> {
  const res = await fetch("/api/invoices", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? "Rechnung konnte nicht erstellt werden");
  }
  return res.json();
}

export async function updateInvoice(id: number, payload: InvoiceUpdateInput): Promise<Invoice> {
  const res = await fetch(`/api/invoices/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? "Rechnung konnte nicht aktualisiert werden");
  }
  return res.json();
}

// ── Google Meet (automatische Videokonferenz-Links) ──────────────────────

/** Erzeugt serverseitig einen neuen Google-Meet-Link (nur Mediatoren/Admins). */
export async function generateMeetLink(summary?: string): Promise<string> {
  const res = await fetch("/api/integrations/google-meet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ summary: summary ?? null }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? err?.error ?? "Meet-Link konnte nicht erzeugt werden");
  }
  const data = await res.json();
  if (!data?.meeting_url) throw new Error("Kein Meet-Link erhalten");
  return data.meeting_url as string;
}

// ── Workflow-Designer: Varianten + Standard-Schritte + Fall-Zuordnung ─────
// Nutzt die bestehenden Admin-API-Routes (Backend prüft mediator/admin).
// fetchAllMediations: siehe oben (Admin: alle Fälle).

export async function fetchVariants(mediationType: string): Promise<MediationVariantDto[]> {
  const res = await fetch(
    `/api/admin/mediation-variants?mediation_type=${encodeURIComponent(mediationType)}`,
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error("Varianten konnten nicht geladen werden");
  return res.json();
}

export async function createVariant(
  mediationType: string,
  label: string,
  description = "",
): Promise<MediationVariantDto> {
  const res = await fetch("/api/admin/mediation-variants", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mediation_type: mediationType, label, description }),
  });
  if (!res.ok) throw new Error("Variante konnte nicht angelegt werden");
  return res.json();
}

export async function fetchPhaseStepDefaults(
  mediationType: string,
  phase: string,
  variantKey?: string | null,
): Promise<PhaseStepDefaultDto[]> {
  // Ohne variantKey liefert das Backend nur Basis-Schritte (variant_key IS
  // NULL); mit variantKey ausschließlich die Zusatz-Schritte der Variante.
  let url = `/api/admin/phase-step-defaults?mediation_type=${encodeURIComponent(mediationType)}&phase=${encodeURIComponent(phase)}`;
  if (variantKey) url += `&variant_key=${encodeURIComponent(variantKey)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Schritte konnten nicht geladen werden");
  return res.json();
}

export async function createPhaseStepDefault(payload: {
  mediation_type: string;
  phase: string;
  step_key: string;
  title: string;
  variant_key?: string | null;
}): Promise<PhaseStepDefaultDto> {
  const res = await fetch("/api/admin/phase-step-defaults", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Schritt konnte nicht angelegt werden");
  return res.json();
}

export async function updatePhaseStepDefault(
  id: number,
  payload: Partial<
    Pick<
      PhaseStepDefaultDto,
      | "title"
      | "description"
      | "placeholder"
      | "reflection_mode"
      | "enabled"
      | "content_types"
      | "video_url"
      | "meeting_url"
      | "question"
      | "contract_template"
      | "result_source_phase"
      | "feedback_occasion"
    >
  >,
): Promise<PhaseStepDefaultDto> {
  const res = await fetch(`/api/admin/phase-step-defaults/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Schritt konnte nicht aktualisiert werden");
  return res.json();
}

export async function deletePhaseStepDefault(id: number): Promise<void> {
  const res = await fetch(`/api/admin/phase-step-defaults/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Schritt konnte nicht gelöscht werden");
}

export async function reorderPhaseStepDefaults(
  items: { id: number; position: number }[],
): Promise<void> {
  const res = await fetch("/api/admin/phase-step-defaults/reorder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) throw new Error("Reihenfolge konnte nicht gespeichert werden");
}

export async function setMediationVariant(
  mediationId: number,
  variantKey: string | null,
): Promise<void> {
  const res = await fetch(`/api/mediations/${mediationId}/variant`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ variant_key: variantKey }),
  });
  if (!res.ok) throw new Error("Variante konnte nicht zugeordnet werden");
}

// ── Fallbezogener Inhalt individueller Schritte ───────────────────────────
// Backend: GET/PUT /mediations/{id}/step-content (MediationStepContent).

export async function fetchStepContent(
  mediationId: number,
  phase?: string,
): Promise<StepContent[]> {
  const url = phase
    ? `/api/mediations/${mediationId}/step-content?phase=${encodeURIComponent(phase)}`
    : `/api/mediations/${mediationId}/step-content`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json().catch(() => null);
  return Array.isArray(data) ? data : [];
}

export async function saveStepContent(
  mediationId: number,
  payload: {
    phase: string;
    step_key: string;
    body_text?: string | null;
    video_url?: string | null;
    meeting_url?: string | null;
    question?: string | null;
    feedback_occasion?: "after_videocall" | "before_contract" | null;
    released?: boolean;
  },
): Promise<StepContent> {
  const res = await fetch(`/api/mediations/${mediationId}/step-content`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Inhalt konnte nicht gespeichert werden");
  return res.json();
}

// KI-Zusammenfassung der eingereichten Eingaben einer Quell-Phase (Mediator).
// Liefert einen Vorschlagstext, den der Mediator kuratiert und dann freigibt.
export async function summarizeResults(
  mediationId: number,
  sourcePhase?: string | null,
): Promise<string> {
  const res = await fetch(`/api/mediations/${mediationId}/summarize-results`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source_phase: sourcePhase ?? null }),
  });
  if (!res.ok) throw new Error("Zusammenfassung konnte nicht erstellt werden");
  const data = await res.json().catch(() => null);
  return (data?.summary as string) ?? "";
}
