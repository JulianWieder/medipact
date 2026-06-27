// ── Workspace Types ───────────────────────────────────────────────────────

export type WorkspaceSection = "dashboard" | "faelle" | "parteien" | "kalender" | "einstellungen";

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
}

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

export function getPhaseIndex(phase: string | null): number {
  if (!phase) return -1;
  return PHASES.findIndex((p) => p.id === phase);
}

// ── Config maps ───────────────────────────────────────────────────────────

export const TYPE_LABEL: Record<string, string> = {
  trennung: "Trennung & Scheidung",
  erbschaft: "Erbschaftsstreit",
  nachbarschaft: "Nachbarschaftskonflikt",
};

export const TYPE_COLOR: Record<string, string> = {
  trennung: "bg-rose-50 text-rose-700 border-rose-200",
  erbschaft: "bg-amber-50 text-amber-700 border-amber-200",
  nachbarschaft: "bg-sky-50 text-sky-700 border-sky-200",
};

export const STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string }> = {
  draft: {
    label: "Entwurf",
    dot: "bg-neutral-400",
    badge: "bg-neutral-100 text-neutral-600 border-neutral-200",
  },
  pending: {
    label: "Ausstehend",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  active: {
    label: "Aktiv",
    dot: "bg-accent-500",
    badge: "bg-accent-50 text-accent-700 border-accent-200",
  },
  completed: {
    label: "Abgeschlossen",
    dot: "bg-neutral-300",
    badge: "bg-neutral-50 text-neutral-500 border-neutral-100",
  },
};

export const ROLE_LABEL: Record<string, string> = {
  owner: "Antragsteller",
  initiator: "Antragsteller",
  other_party: "Gegenpartei",
  mediator: "Mediator",
  observer: "Beobachter",
};
