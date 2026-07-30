// Client-side API helpers – rufen die Next.js API-Routes auf,
// die ihrerseits über backendFetch mit dem Backend kommunizieren.

import type { MediationCase, MediationDetail, Participant, MediationNote, PhaseNoteGroup, UserRoleInfo, SystemUser, SystemUserWithCases, AppointmentEvent, FeedbackEntry, Invoice, InvoiceCreateInput, InvoiceUpdateInput, MediationVariantDto, PhaseStepDefaultDto, StepContent, BlockResponseDto, Organization, AboPlan, DashboardUebersicht } from "./types";

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

export type MediatorOption = { user_id: number; name: string; email: string };

export async function fetchMediators(): Promise<MediatorOption[]> {
  const res = await fetch("/api/mediations/mediators", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function setMediationMediator(
  mediationId: number,
  userId: number,
): Promise<void> {
  const res = await fetch(`/api/mediations/${mediationId}/mediator`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? "Mediator konnte nicht zugeordnet werden");
  }
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

/** Nutzer inkl. ihrer Fälle in EINER Antwort – Datenbasis des Benutzer-
 * Bereichs (ersetzt die N+1-Ladelogik: Teilnehmer pro Fall einzeln). */
export async function fetchUsersOverview(): Promise<SystemUserWithCases[]> {
  const res = await fetch("/api/admin/users-overview", { cache: "no-store" });
  if (!res.ok) throw new Error("Nutzer konnten nicht geladen werden");
  return res.json();
}

/** Alle registrierten Nutzer - nur fuer Admins/Mediatoren. */
export async function fetchAllUsers(): Promise<SystemUser[]> {
  const res = await fetch("/api/admin/users", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

/** Rollen fürs Benutzermanager-Dropdown – dynamisch vom Backend (Single Source
 * ALLOWED_ROLES). ``assignable`` = was der aktuelle Nutzer vergeben darf,
 * ``labels`` = Anzeige-Labels aller bekannten Rollen. */
export async function fetchAssignableRoles(): Promise<{
  assignable: { id: string; label: string }[];
  labels: Record<string, string>;
}> {
  const res = await fetch("/api/admin/roles", { cache: "no-store" });
  if (!res.ok) return { assignable: [], labels: {} };
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

/** Legt ein Firmen-Mitglied (Mediator/Mitarbeiter) im eigenen Unternehmen an.
 * Firmen-Admin: eigene Org (organizationId ignoriert). Globaler Admin: organizationId erforderlich. */
export async function createOrgMember(payload: {
  name: string;
  email: string;
  role: string;
  organization_id?: number | null;
}): Promise<SystemUser & { invited?: boolean }> {
  const res = await fetch("/api/admin/org-members", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? "Mitglied konnte nicht angelegt werden");
  }
  return res.json();
}

/** Legt einen Firmen-Fall an (ODR-Track: Online Dispute Resolution, Default
 * mediation_type="odr"; alternativ schlichtung/ecommerce/b2b – z. B. für
 * digitalisierte Massen-ODR im Firmen-Abo). Das Backend stempelt automatisch
 * die Org des Firmen-Admins + schaltet über das Firmen-Abo frei. Der Ersteller
 * wird als Beobachter (Manager) geführt. */
export async function createMediationCase(payload: {
  title: string;
  description?: string;
  priority?: string;
  mediationType?: "odr" | "schlichtung" | "ecommerce" | "b2b";
}): Promise<{ id: number; mediation_id: number }> {
  const res = await fetch("/api/mediations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: payload.title,
      description: payload.description ?? null,
      priority: payload.priority ?? null,
      mediation_type: payload.mediationType ?? "odr",
      role: "observer",
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? "Fall konnte nicht angelegt werden");
  }
  const data = await res.json();
  const id = (data.id ?? data.mediation_id) as number;
  return { id, mediation_id: (data.mediation_id ?? id) as number };
}

// ── Mandanten (Organizations) ─────────────────────────────────────────────

/** Alle Mandanten (Admin) bzw. eigener Mandant (Mediator). */
export async function fetchOrganizations(): Promise<Organization[]> {
  const res = await fetch("/api/organizations", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

/** Mandant inkl. Mitgliederliste. */
export async function fetchOrganization(orgId: number): Promise<Organization> {
  const res = await fetch(`/api/organizations/${orgId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Mandant konnte nicht geladen werden");
  return res.json();
}

/** Alle Abo-Pläne inkl. Konditionen. */
export async function fetchAboPlans(): Promise<AboPlan[]> {
  const res = await fetch("/api/organizations/plans", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function createOrganization(name: string, plan: string): Promise<Organization> {
  const res = await fetch("/api/organizations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, plan }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? "Mandant konnte nicht angelegt werden");
  }
  return res.json();
}

export async function updateOrganization(
  orgId: number,
  payload: { name?: string; plan?: string; billing_email?: string; is_active?: boolean },
): Promise<Organization> {
  const res = await fetch(`/api/organizations/${orgId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? "Mandant konnte nicht geändert werden");
  }
  return res.json();
}

export async function deleteOrganization(orgId: number): Promise<void> {
  const res = await fetch(`/api/organizations/${orgId}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? "Mandant konnte nicht gelöscht werden");
  }
}

export async function addOrganizationMember(orgId: number, userId: number): Promise<Organization> {
  const res = await fetch(`/api/organizations/${orgId}/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? "Nutzer konnte nicht zugeordnet werden");
  }
  return res.json();
}

export async function removeOrganizationMember(orgId: number, userId: number): Promise<void> {
  const res = await fetch(`/api/organizations/${orgId}/members/${userId}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? "Zuordnung konnte nicht gelöst werden");
  }
}

// ── Firmen-Onboarding-Finalisierung (Vertrag + Zahlung, unternehmensweit) ──

export interface OrgOnboardingStatus {
  organization_id: number;
  plan: string;
  plan_label: string;
  amount_eur: number;
  currency: string;
  contract_signed: boolean;
  contract_signer_name: string | null;
  paid: boolean;
  payment_method: string | null;
  complete: boolean;
}

export async function fetchOrgOnboarding(orgId: number): Promise<OrgOnboardingStatus | null> {
  const res = await fetch(`/api/organizations/${orgId}/onboarding`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function signOrgContract(orgId: number, signerName: string): Promise<Organization> {
  const res = await fetch(`/api/organizations/${orgId}/onboarding/sign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ signer_name: signerName }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? "Vertrag konnte nicht unterschrieben werden");
  }
  return res.json();
}

export async function createOrgOnboardingOrder(orgId: number): Promise<{ order_id: string; amount_eur: number; currency: string }> {
  const res = await fetch(`/api/organizations/${orgId}/onboarding/paypal/create-order`, { method: "POST" });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? "PayPal-Order konnte nicht angelegt werden");
  }
  return res.json();
}

export async function payOrgOnboarding(
  orgId: number,
  method: "invoice" | "paypal",
  orderId?: string,
): Promise<Organization> {
  const res = await fetch(`/api/organizations/${orgId}/onboarding/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ method, order_id: orderId ?? null }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? "Zahlung konnte nicht erfasst werden");
  }
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

// ── KI-Prompts (im Workflow Manager editierbar) ──────────────────────────

export interface AiPromptDto {
  key: string;
  label: string;
  placeholders: string[];
  default: string;
  template: string;
  is_custom: boolean;
}

export async function fetchAiPrompts(): Promise<AiPromptDto[]> {
  const res = await fetch("/api/admin/ai-prompts", { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json().catch(() => null);
  return Array.isArray(data) ? data : [];
}

export async function saveAiPrompt(key: string, template: string): Promise<AiPromptDto> {
  const res = await fetch(`/api/admin/ai-prompts/${encodeURIComponent(key)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ template }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? "Prompt konnte nicht gespeichert werden");
  }
  return res.json();
}

export async function resetAiPrompt(key: string): Promise<AiPromptDto> {
  const res = await fetch(`/api/admin/ai-prompts/${encodeURIComponent(key)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Prompt konnte nicht zurückgesetzt werden");
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
  includeShared = false,
): Promise<PhaseStepDefaultDto[]> {
  // Ohne variantKey liefert das Backend nur Basis-Schritte (variant_key IS
  // NULL); mit variantKey ausschließlich die Zusatz-Schritte der Variante.
  // includeShared mischt zusätzlich die globalen Schritte (mediation_type "*")
  // in die Basis-Liste – erkennbar am Feld `shared`.
  let url = `/api/admin/phase-step-defaults?mediation_type=${encodeURIComponent(mediationType)}&phase=${encodeURIComponent(phase)}`;
  if (variantKey) url += `&variant_key=${encodeURIComponent(variantKey)}`;
  if (includeShared) url += "&include_shared=true";
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
  blocks?: import("./types").StepBlockDto[];
  description?: string;
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
      | "blocks"
      | "visible_if"
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

/** Lässt die KI einen Titel + eine Blockliste als Startpunkt für einen Schritt generieren. */
export async function generateStepBlocks(payload: {
  mediation_type: string;
  phase: string;
  title?: string;
  instruction?: string;
}): Promise<{ title?: string; blocks: import("./types").StepBlockDto[] }> {
  const res = await fetch("/api/admin/phase-step-defaults/generate-blocks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("KI-Vorbefüllen fehlgeschlagen");
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

// ── Fall-Flags (Eskalation/Segmentierung) ──────────────────────────────────

export async function fetchCaseFlags(mediationId: number): Promise<Record<string, unknown>> {
  const res = await fetch(`/api/mediations/${mediationId}/flags`, { cache: "no-store" });
  if (!res.ok) return {};
  const data = await res.json().catch(() => null);
  return (data?.flags as Record<string, unknown>) ?? {};
}

/** Merged Flags in den Fall (nur Mediator/Owner). value=null entfernt ein Flag. */
export async function setCaseFlags(
  mediationId: number,
  flags: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const res = await fetch(`/api/mediations/${mediationId}/flags`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ flags }),
  });
  if (!res.ok) throw new Error("Flags konnten nicht gesetzt werden");
  const data = await res.json().catch(() => null);
  return (data?.flags as Record<string, unknown>) ?? {};
}

// ── Block-Antworten (pro Fall gespeicherter Block-Inhalt) ───────────────────

/** Lädt die gespeicherten Block-Antworten eines Falls (optional gefiltert). */
export async function fetchBlockResponses(
  mediationId: number,
  opts?: { phase?: string; stepKey?: string },
): Promise<BlockResponseDto[]> {
  const params = new URLSearchParams();
  if (opts?.phase) params.set("phase", opts.phase);
  if (opts?.stepKey) params.set("step_key", opts.stepKey);
  const qs = params.toString();
  const res = await fetch(
    `/api/mediations/${mediationId}/block-responses${qs ? `?${qs}` : ""}`,
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error("Block-Antworten konnten nicht geladen werden");
  return res.json();
}

/** Legt den Beitrag des aktuellen Autors zu einem Block an oder aktualisiert ihn. */
export async function saveBlockResponse(
  mediationId: number,
  payload: {
    phase: string;
    step_key: string;
    block_id: string;
    block_type?: string;
    value: unknown;
    submitted?: boolean;
    as_ai?: boolean;
  },
): Promise<BlockResponseDto> {
  const res = await fetch(`/api/mediations/${mediationId}/block-responses`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Block-Antwort konnte nicht gespeichert werden");
  return res.json();
}

/** Lädt eine Datei für einen Datei-Upload-Block hoch. */
export async function uploadBlockFile(
  mediationId: number,
  file: File,
): Promise<{ url: string; name: string }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`/api/mediations/${mediationId}/block-upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error("Datei konnte nicht hochgeladen werden");
  return res.json();
}

/** Führt einen KI-Block serverseitig aus (nur Mediator/Owner) und speichert die Ausgabe. */
export async function runBlockAi(
  mediationId: number,
  payload: { phase: string; step_key: string; block_id: string },
): Promise<{ value: string }> {
  const res = await fetch(`/api/mediations/${mediationId}/block-ai/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("KI-Block konnte nicht ausgeführt werden");
  return res.json();
}

// ── Bonus-Leistungen (kostenpflichtige Bonus-Blöcke) ────────────────────────

export interface BonusPurchaseDto {
  block_id: string;
  step_key: string;
  title: string;
  amount: number;
  currency: string;
  paid: boolean;
}

export async function fetchBonusPurchases(mediationId: number): Promise<BonusPurchaseDto[]> {
  const res = await fetch(`/api/mediations/${mediationId}/bonus-purchases`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function createBonusOrder(
  mediationId: number,
  blockId: string,
): Promise<{ order_id: string; amount: number }> {
  const res = await fetch(`/api/mediations/${mediationId}/bonus/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ block_id: blockId }),
  });
  if (!res.ok) throw new Error("Bonus-Order konnte nicht erstellt werden");
  return res.json();
}

export async function captureBonusOrder(
  mediationId: number,
  blockId: string,
  orderId: string,
): Promise<{ paid: boolean }> {
  const res = await fetch(`/api/mediations/${mediationId}/bonus/capture-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ block_id: blockId, order_id: orderId }),
  });
  if (!res.ok) throw new Error("Bonus-Zahlung konnte nicht abgeschlossen werden");
  return res.json();
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

// ── Workspace-Dashboard: Eingriffs-Signale + Neuigkeiten ────────────────────

/** Aggregierte Dashboard-Übersicht: pro Fall Eingriffs-Signale + Neuigkeiten-Feed. */
export async function fetchDashboardUebersicht(): Promise<DashboardUebersicht | null> {
  const res = await fetch("/api/mediations/dashboard", { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}
