// Client-side API helpers – rufen die Next.js API-Routes auf,
// die ihrerseits über backendFetch mit dem Backend kommunizieren.

import type { MediationCase, MediationDetail, Participant, MediationNote, PhaseNoteGroup, UserRoleInfo, SystemUser, AppointmentEvent, FeedbackEntry, Invoice, InvoiceCreateInput, InvoiceUpdateInput } from "./types";

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
