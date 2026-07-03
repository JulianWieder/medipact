// ── Workspace Types ───────────────────────────────────────────────────────

export type WorkspaceSection = "dashboard" | "faelle" | "parteien" | "kalender" | "rechnungen" | "workflows" | "einstellungen";

export interface WorkspaceNavItem {
  id: WorkspaceSection;
  label: string;
  icon: string;
}

export const WORKSPACE_NAV: WorkspaceNavItem[] = [
  { id: "dashboard", label: "Übersicht", icon: "⊞" },
  { id: "faelle", label: "Meine Fälle", icon: "⚖" },
  { id: "parteien", label: "Parteien", icon: "👥" },
  { id: "kalender", label: "Kalender", icon: "📅" },
  { id: "rechnungen", label: "Rechnungen", icon: "🧾" },
  { id: "workflows", label: "Workflow Manager", icon: "🧭" },
  { id: "einstellungen", label: "Einstellungen", icon: "⚙" },
];

// ── Mediation ─────────────────────────────────────────────────────────────

export interface MediationCase {
  id: number;
  mediation_id?: number;
  title: string;
  mediation_type: "trennung" | "erbschaft" | "nachbarschaft" | string;
  status: "draft" | "active" | "pending" | "completed" | string;
  phase: string | null;
  progress?: number;
  description?: string | null;
  priority?: string | null;
  role?: string;
  /** Zuordnung zu einer Mediations-Variante (MediationVariant.key) — null = Basis-Workflow. */
  variant_key?: string | null;
}

// ── Workflow-Designer (Backend: mediation_variants + phase_step_defaults) ──

export interface MediationVariantDto {
  id: number;
  mediation_type: string;
  key: string;
  label: string;
  description: string;
  position: number;
  enabled: boolean;
}

export interface PhaseStepDefaultDto {
  id: number;
  mediation_type: string;
  phase: string;
  step_key: string;
  /** null = Standard-Schritt des Basistyps; sonst key der Variante. */
  variant_key: string | null;
  title: string;
  description: string;
  placeholder: string;
  reflection_mode: string | null;
  /** Inhaltsarten der Karte (siehe CONTENT_TYPES). null = noch nicht klassifiziert. */
  content_types: string[] | null;
  /** Vom Mediator hinterlegte Video-URL — nur relevant wenn "video" in content_types. */
  video_url: string | null;
  /** Fragebogen-Anlass — nur relevant wenn "feedback" in content_types. */
  feedback_occasion: "after_videocall" | "before_contract" | null;
  required_roles: string[] | null;
  position: number;
  enabled: boolean;
}

// ── Inhaltsarten pro Workflow-Karte ───────────────────────────────────────
//
// Abgeleitet aus den real existierenden Bausteinen im Teilnehmer-Flow
// (EinleitungClient.tsx): Content-Schritte kombinieren heute Lernvideo +
// Texteingabe + Reflexion/Frage; dazu kommen die fixen Rahmen-Schritte
// Terminvereinbarung, Videocall, Feedback-Fragebogen und Vertrag.
// Mehrfachauswahl pro Karte ist ausdrücklich erlaubt.

export interface ContentTypeDef {
  id: string;
  label: string;
  /** Kurzform für die Badges auf den Karten-Nodes. */
  short: string;
  icon: string;
  badge: string;
}

export const CONTENT_TYPES: ContentTypeDef[] = [
  { id: "text", label: "Texteingabe", short: "Text", icon: "✎", badge: "bg-neutral-100 text-neutral-600 border-neutral-200" },
  { id: "video", label: "Video (URL vom Mediator)", short: "Video", icon: "▶", badge: "bg-rose-50 text-rose-600 border-rose-200" },
  { id: "frage", label: "Frage / Quiz", short: "Frage", icon: "?", badge: "bg-violet-50 text-violet-600 border-violet-200" },
  { id: "videokonferenz", label: "Videokonferenz + Transkript", short: "Konferenz", icon: "🎥", badge: "bg-sky-50 text-sky-600 border-sky-200" },
  { id: "feedback", label: "Feedback-Fragebogen", short: "Feedback", icon: "★", badge: "bg-amber-50 text-amber-600 border-amber-200" },
  { id: "termin", label: "Terminvereinbarung", short: "Termin", icon: "📅", badge: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  { id: "vertrag", label: "Vertrag / Dokument", short: "Vertrag", icon: "§", badge: "bg-indigo-50 text-indigo-600 border-indigo-200" },
];

export const CONTENT_TYPE_BY_ID: Record<string, ContentTypeDef> = Object.fromEntries(
  CONTENT_TYPES.map((t) => [t.id, t]),
);

export const MEDIATION_TYPES: { id: string; label: string }[] = [
  { id: "trennung", label: "Trennung & Scheidung" },
  { id: "erbschaft", label: "Erbschaft" },
  { id: "nachbarschaft", label: "Nachbarschaft" },
];

export interface MediationDetail extends MediationCase {
  participants?: Participant[];
}

// ── Participants ──────────────────────────────────────────────────────────

export interface Participant {
  id: string;
  name: string;
  email: string;
  role: string;
  invitationStatus: "accepted" | "pending";
}

export interface ParticipantWithCase extends Participant {
  mediationId: number;
  mediationTitle: string;
  mediationType: string;
}

// ── Notes ─────────────────────────────────────────────────────────────────

export interface MediationNote {
  participant_id: string;
  content: string;
  submitted: boolean;
  participantName?: string;
  participantRole?: string;
}

export interface PhaseNoteGroup {
  phase: string;
  notes: {
    participant_id: string;
    participant_name: string;
    step: string;
    content: string;
    submitted: boolean;
  }[];
}

// ── System User (alle Nutzer für Admin) ───────────────────────────────────

export interface SystemUser {
  id: number;
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
}

// ── Appointments ─────────────────────────────────────────────────────────

export interface AppointmentEvent {
  id: number;
  mediation_id: number;
  mediation_title: string;
  mediation_type: string;
  proposed_datetime: string;
  /** proposed: noch nicht alle zugestimmt · reserved: alle zugestimmt, wartet auf Mediator · confirmed: final bestätigt */
  status?: "proposed" | "reserved" | "confirmed";
}

// ── Feedback ─────────────────────────────────────────────────────────────

export interface FeedbackEntry {
  id: number;
  mediation_id?: number;
  mediation_title?: string;
  mediation_type?: string;
  occasion: string;
  participant_id?: string | number;
  participant_name: string;
  participant_role: string;
  answers: Record<string, string | number>;
  created_at: string;
}

// ── Invoices ──────────────────────────────────────────────────────────────
//
// Backend-Response für GET /invoices (siehe backend/app/routers/invoices.py
// _serialize()). Jede Rechnung gehört zu genau einem Teilnehmer
// (participant_id) UND dem Fall (mediation_id) – bei anteiliger Zahlung
// bekommt jede Partei ihre eigene Rechnung. amount ist der Nettobetrag,
// tax_rate ein frei editierbarer Prozentsatz; tax_amount/gross_amount werden
// vom Backend daraus berechnet (keine eigenen DB-Spalten).

export interface Invoice {
  id: number;
  invoice_number: string;
  mediation_id: number;
  mediation_title: string;
  participant_id: number;
  participant_name?: string | null;
  participant_email?: string | null;
  payer_name?: string | null;
  payer_email?: string | null;
  amount: number;
  tax_rate: number;
  tax_amount: number;
  gross_amount: number;
  currency: string;
  status: "paid" | "open" | "refunded" | "failed" | string;
  paypal_order_id?: string | null;
  issued_at: string;
  paid_at?: string | null;
  pdf_url?: string | null;
}

/** Payload für POST /invoices – siehe InvoiceCreate in backend/app/routers/invoices.py. */
export interface InvoiceCreateInput {
  mediation_id: number;
  participant_id: number;
  amount: number;
  tax_rate: number;
  currency?: string;
  payer_name?: string | null;
  payer_email?: string | null;
  status?: string;
}

/** Payload für PATCH /invoices/{id} – alle Felder optional. */
export type InvoiceUpdateInput = Partial<InvoiceCreateInput> & { pdf_url?: string | null };

export const INVOICE_STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string }> = {
  paid: {
    label: "Bezahlt",
    dot: "bg-accent-500",
    badge: "bg-accent-50 text-accent-700 border-accent-200",
  },
  open: {
    label: "Offen",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  refunded: {
    label: "Erstattet",
    dot: "bg-sky-400",
    badge: "bg-sky-50 text-sky-700 border-sky-200",
  },
  failed: {
    label: "Fehlgeschlagen",
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-700 border-red-200",
  },
};

// ── User role ──────────────────────────────────────────────────────────────

export interface UserRoleInfo {
  role: string;
  is_admin: boolean;
  email: string;
  name: string;
}

// ── Phases ────────────────────────────────────────────────────────────────

export const PHASES: { id: string; label: string; short: string }[] = [
  { id: "einleitung", label: "Einleitung", short: "1" },
  { id: "themensammlung", label: "Themensammlung", short: "2" },
  { id: "interessen", label: "Interessen", short: "3" },
  { id: "optionen", label: "Optionen", short: "4" },
  { id: "verhandlung", label: "Verhandlung", short: "5" },
  { id: "abschluss", label: "Abschluss", short: "6" },
];

// ── Workflow Manager: Schritte pro Phase ────────────────────────────────────
//
// Vorlage für die einzelnen Schritte innerhalb einer Mediationsphase.
// Aktuell ein reines Frontend-Konstrukt (siehe WorkflowManager.tsx, persistiert
// per localStorage) — noch nicht mit dem Backend verbunden. Die "einleitung"
// Default-Schritte spiegeln die in FallDetail.tsx (EINLEITUNG_STEPS) aktue