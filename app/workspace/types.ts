// ── Workspace Types ───────────────────────────────────────────────────────

export type WorkspaceSection = "dashboard" | "faelle" | "benutzer" | "kalender" | "rechnungen" | "workflows" | "admin" | "einstellungen";

export interface WorkspaceNavItem {
  id: WorkspaceSection;
  label: string;
  icon: string;
}

export const WORKSPACE_NAV: WorkspaceNavItem[] = [
  { id: "dashboard", label: "Übersicht", icon: "⊞" },
  { id: "faelle", label: "Meine Fälle", icon: "⚖" },
  { id: "benutzer", label: "Benutzer", icon: "👥" },
  { id: "kalender", label: "Kalender", icon: "📅" },
  { id: "rechnungen", label: "Rechnungen", icon: "🧾" },
  { id: "workflows", label: "Workflow Manager", icon: "🧭" },
  // Nur für echte Administratoren sichtbar (siehe WorkspaceSidebar / is_superadmin).
  { id: "admin", label: "Administration", icon: "🛡" },
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
  /**
   * "mediation" oder "logbuch". Konflikt-Logbücher sind KEINE Fälle: sie
   * werden in keiner Fall-Liste geführt (Backend filtert /mediations/all,
   * fetchMediations() filtert die eigene /me-Liste). Was aus einem Logbuch
   * zum Fall gehört, wird verknüpft und erscheint im Reiter „Logbuch" des
   * Falls.
   */
  mode?: string;
  /** Zuordnung zu einer Mediations-Variante (MediationVariant.key) — null = Basis-Workflow. */
  variant_key?: string | null;
}

// ── Workflow-Designer (Backend: mediation_variants + phase_step_defaults) ──

/** Sichtbarkeitsbedingung eines Schritts/Blocks gegen die Fall-Flags. */
export interface VisibleIf {
  all?: { flag: string; eq: string | number | boolean }[];
}

/** Ein einzelner Block im Seitenaufbau eines Schritts (siehe blockTypes.ts). */
export interface StepBlockDto {
  id: string;
  type: string;
  config: Record<string, unknown>;
  visible_if?: unknown | null;
}

/**
 * Gespeicherter Inhalt/Antwort je Block eines Falls (Backend:
 * mediation_block_responses). Getrennt nach Autor (Partei/Mediator/KI), damit
 * die Beiträge am Ende ausgewertet werden können.
 */
export interface BlockResponseDto {
  id: number;
  phase: string;
  step_key: string;
  block_id: string;
  block_type: string | null;
  author_key: string;
  author_source: "user" | "mediator" | "ai" | string;
  author_participant_id: number | null;
  value: unknown;
  submitted: boolean;
  updated_at: string | null;
}

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
  /** true = globaler Schritt (mediation_type "*"), gilt in allen Mediationsarten. */
  shared?: boolean;
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
  /**
   * Neuer dynamischer Seitenaufbau: geordnete Block-Liste (siehe blockTypes.ts).
   * null/[] = noch nicht als Blöcke definiert -> Fallback auf content_types +
   * Einzelfelder. Sobald gesetzt, ist dies die maßgebliche Quelle.
   */
  blocks: StepBlockDto[] | null;
  /** Sichtbarkeitsbedingung gegen die Fall-Flags (Eskalation/Segmentierung). null = immer sichtbar. */
  visible_if: VisibleIf | null;
  /** Vom Mediator hinterlegte Video-URL — nur relevant wenn "video" in content_types. */
  video_url: string | null;
  /** Meeting-/Call-Link — nur relevant wenn "videokonferenz" in content_types. */
  meeting_url: string | null;
  /** Konkreter Frage-/Quiz-Inhalt — nur relevant wenn "frage" in content_types. */
  question: string | null;
  /** Vorlagentext — nur relevant wenn "vertrag" in content_types. */
  contract_template: string | null;
  /** Quell-Phase der anzuzeigenden Ergebnisse — nur relevant wenn "ergebnis" in content_types. */
  result_source_phase: string | null;
  /** Fragebogen-Anlass — nur relevant wenn "feedback" in content_types. */
  feedback_occasion: "after_videocall" | "before_contract" | null;
  required_roles: string[] | null;
  /**
   * Fortschritts-Sperre: wann gibt dieser Schritt den nächsten frei?
   * "self" (Standard) = die eigene Abgabe genügt, "all" = alle nötigen
   * Parteien müssen abgegeben haben, "none" = sperrt nie (optionaler Schritt).
   * Das Backend liefert nie null (NULL wird als "self" serialisiert).
   */
  gate_mode: GateMode;
  position: number;
  enabled: boolean;
}

/** Siehe PhaseStepDefaultDto.gate_mode. */
export type GateMode = "self" | "all" | "none";

export const GATE_MODE_OPTIONS: { value: GateMode; label: string; hint: string }[] = [
  {
    value: "self",
    label: "Eigene Abgabe genügt",
    hint: "Wer den Schritt abgeschlossen hat, arbeitet weiter – auch wenn die andere Seite noch tippt.",
  },
  {
    value: "all",
    label: "Auf alle warten",
    hint: "Der nächste Schritt öffnet erst, wenn alle nötigen Parteien diesen Schritt abgeschlossen haben.",
  },
  {
    value: "none",
    label: "Nicht sperren",
    hint: "Optionaler Schritt: er hält niemanden auf, auch wenn er offen bleibt.",
  },
];

// ── Fallbezogener Inhalt "individueller" Schritte ─────────────────────────
//
// Backend: MediationStepContent (GET/PUT /mediations/{id}/step-content).
// Ein Schritt wird zentral als "individuell" markiert; sein tatsächlicher
// Inhalt (eigenes Video, Meeting-Link, Text, Frage, Feedback) wird pro Fall
// vom Mediator gepflegt und liegt hier.

export interface StepContent {
  phase: string;
  step_key: string;
  body_text: string | null;
  video_url: string | null;
  meeting_url: string | null;
  question: string | null;
  feedback_occasion: "after_videocall" | "before_contract" | null;
  /** Ergebnis-Schritte: erst wenn true, sehen Teilnehmer body_text. */
  released: boolean;
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
  // "individuell" markiert einen Schritt, dessen Inhalt NICHT global gepflegt
  // wird, sondern pro Fall in der Fallansicht (siehe StepContent / FallDetail).
  { id: "individuell", label: "Individuell (pro Fall befüllt)", short: "Individuell", icon: "✦", badge: "bg-teal-50 text-teal-600 border-teal-200" },
  // "ergebnis" zeigt allen Teilnehmern (Teile der) Mediations-Ergebnisse an –
  // erst nachdem der Mediator sie pro Fall freigegeben hat (StepContent.released).
  { id: "ergebnis", label: "Ergebnis-Anzeige (Freigabe)", short: "Ergebnis", icon: "◆", badge: "bg-cyan-50 text-cyan-600 border-cyan-200" },
];

export const CONTENT_TYPE_BY_ID: Record<string, ContentTypeDef> = Object.fromEntries(
  CONTENT_TYPES.map((t) => [t.id, t]),
);

/**
 * Pseudo-Mediationsart für WIEDERVERWENDBARE Schritte: ein Schritt mit
 * mediation_type "*" gilt in JEDEM Mediationstyp. Gepflegt wird er im
 * WorkflowManager im eigenen Tab „Alle Typen"; in den einzelnen Typ-Tabs
 * erscheint er als gesperrte Karte an seiner tatsächlichen Position.
 * Backend-Gegenstück: SHARED_MEDIATION_TYPE in models/phase_step_default.py.
 */
export const SHARED_MEDIATION_TYPE = "*";

/**
 * Pseudo-Mediationstyp für das NUTZER-ONBOARDING: der einmalige Durchlauf, den
 * jede Person absolviert, bevor sie Fälle bearbeiten kann. Bewusst NICHT "*" —
 * "*" heißt „gilt in jedem Mediationstyp" und würde die Schritte in jeden Fall
 * spülen. "@user" taucht in keiner Fall-Auflösung auf.
 *
 * Backend-Gegenstück: USER_ONBOARDING_TYPE in models/phase_step_default.py.
 * Ausgeliefert wird es nicht über die Fall-Endpunkte, sondern über
 * routers/user_onboarding.py.
 */
export const USER_ONBOARDING_TYPE = "@user";
export const USER_ONBOARDING_PHASE = "onboarding";

export const MEDIATION_TYPES: { id: string; label: string }[] = [
  { id: "trennung", label: "Trennung & Scheidung" },
  { id: "erbschaft", label: "Erbschaft" },
  { id: "nachbarschaft", label: "Nachbarschaft" },
  { id: "wg", label: "WG & Mitbewohner" },
  { id: "verbraucher", label: "Verbraucher & Handwerker" },
  { id: "odr", label: "ODR – Geschäft & Organisation" },
  { id: "schlichtung", label: "ODR – Online-Schlichtung" },
  { id: "ecommerce", label: "ODR – E-Commerce & Plattform" },
  { id: "b2b", label: "ODR – B2B-Vertragsstreit" },
];

export interface MediationDetail extends MediationCase {
  participants?: Participant[];
}

// ── Participants ──────────────────────────────────────────────────────────

export interface Participant {
  id: string;
  /** users.id der Person hinter dieser Teilnahme.
   *  Fehlt bei noch offenen Einladungen — dort gibt es noch kein Konto.
   *  Gebraucht für alles, was an der PERSON hängt statt am Fall, v.a. das
   *  Nutzer-Onboarding (GET /onboarding/users/{user_id}). */
  user_id?: number;
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
  /** Anzeigename vom Backend (Workspace-Labels, z.B. "Onboarding"). */
  phase_label?: string;
  notes: {
    participant_id: string;
    participant_name: string;
    step: string;
    content: string;
    submitted: boolean;
  }[];
  /** Antworten aus dynamischen Block-Schritten – inkl. Mediator- und KI-Beiträgen. */
  block_responses?: {
    step_key: string;
    step_title: string;
    block_id: string;
    block_type: string | null;
    author_source: "user" | "mediator" | "ai";
    author_name: string;
    value: unknown;
    submitted: boolean;
    updated_at: string | null;
  }[];
}

// ── System User (alle Nutzer für Admin) ───────────────────────────────────

export interface SystemUser {
  id: number;
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
  /** Mandanten-Zuordnung (organizations.id); null = kein Mandant. */
  organization_id?: number | null;
}

/** Fall-Referenz eines Nutzers aus GET /auth/users/overview. */
export interface UserCaseRef {
  mediation_id: number;
  title: string;
  mediation_type: string;
  status: string;
  phase: string | null;
  participant_role: string;
  invitation_status: string;
  /** Wer den Fall leitet – null, wenn der Nutzer selbst Owner/Mediator ist. */
  mediator_name: string | null;
}

/** Nutzer inkl. seiner Fälle – Datenbasis des Benutzer-Bereichs. */
export interface SystemUserWithCases extends SystemUser {
  cases: UserCaseRef[];
}

// ── Mandanten (Organizations) ──────────────────────────────────────────────

export interface Organization {
  id: number;
  name: string;
  plan: string;
  plan_label: string;
  is_active?: boolean;
  billing_email?: string | null;
  onboarding_complete?: boolean;
  // Abo-Modell: unternehmensweite Grundkonfiguration vorgenommen + akzeptiert.
  base_config_accepted?: boolean;
  mediator_count: number;
  monthly_price_eur: number;
  created_at: string | null;
  members?: { id: number; name: string; email: string; role: string }[];
}

export interface AboPlan {
  key: string;
  label: string;
  base_eur: number;
  per_mediator_eur: number;
  included_mediators: number;
  max_mediators: number | null;
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
  /** Strenger als is_admin: nur echte Administratoren (role == "admin"). */
  is_superadmin?: boolean;
  /** Firmen-Admin: eingeschränkter, auf das eigene Unternehmen begrenzter Zugriff. */
  is_firm_admin?: boolean;
  /** Zugeordnetes Unternehmen (organizations.id); null = kein Unternehmen. */
  organization_id?: number | null;
  email: string;
  name: string;
}

// ── Phases ────────────────────────────────────────────────────────────────

export const PHASES: { id: string; label: string; short: string }[] = [
  // "einladung" ist die Vor-Phase (Einladung an die Gegenseite), die vor Start
  // der eigentlichen Mediation läuft. Sie gehört NICHT zu den 6 Teilnehmer-
  // Mediationsphasen, ist aber hier im Designer konfigurierbar (z.B. Video der
  // Einladungs-Botschaft an/aus/Pflicht). Nicht mit "einleitung" verwechseln.
  { id: "einladung", label: "Onboarding", short: "0" },
  { id: "einleitung", label: "Einleitung", short: "1" },
  { id: "themensammlung", label: "Themensammlung", short: "2" },
  { id: "interessen", label: "Interessen", short: "3" },
  { id: "optionen", label: "Optionen", short: "4" },
  { id: "verhandlung", label: "Verhandlung", short: "5" },
  { id: "abschluss", label: "Abschluss", short: "6" },
];

/** Phasen im WorkflowManager-Designer: die Teilnehmer-Phasen (PHASES) plus
 *  "logbuch" – das kostenlose Konflikt-Logbuch (Streit dokumentieren, bevor
 *  eine Mediation gestartet wird). Enthält die Schritte logbuch_intake
 *  (geführtes Anlegen) und logbuch_eintrag (VORLAGE: die Blöcke sind die
 *  Felder des Eintrag-Formulars). Bewusst NICHT in PHASES, damit das Logbuch
 *  nirgends als Verfahrens-Phase (Stepper/Fortschritt) auftaucht. */
export const DESIGNER_PHASES: { id: string; label: string; short: string }[] = [
  { id: "logbuch", label: "Logbuch (kostenlos)", short: "L" },
  ...PHASES,
];

/** Phasen im Reiter „Nutzer-Onboarding" (mediation_type "@user"). Genau eine:
 *  das Onboarding ist ein linearer Durchlauf, keine Verfahrensphase. Bewusst
 *  eine eigene Liste statt eines Eintrags in DESIGNER_PHASES — sonst stünde
 *  „Onboarding" auch in jeder Mediationsart zur Auswahl und liefe dort ins
 *  Leere. */
export const USER_ONBOARDING_PHASES: { id: string; label: string; short: string }[] = [
  { id: USER_ONBOARDING_PHASE, label: "Onboarding-Schritte", short: "◉" },
];

// ── Workflow Manager: Schritte pro Phase ────────────────────────────────────
//
// Vorlage für die einzelnen Schritte innerhalb einer Mediationsphase.
// Aktuell ein reines Frontend-Konstrukt (siehe WorkflowManager.tsx, persistiert
// per localStorage) — noch nicht mit dem Backend verbunden. Die "einleitung"
// Default-Schritte spiegeln die in FallDetail.tsx (EINLEITUNG_STEPS) aktuell
// live getrackten Schritte wider; Änderungen hier wirken sich NICHT auf das
// dortige Live-Tracking aus.
export interface PhaseStep {
  key: string;
  label: string;
}

export const DEFAULT_PHASE_STEPS: Record<string, PhaseStep[]> = {
  einleitung: [
    { key: "intro", label: "Einführung" },
    { key: "videocall", label: "Erstgespräch" },
    { key: "einleitung", label: "Regeln" },
    { key: "einleitung_rollen", label: "Rollen" },
    { key: "einleitung_vertrauen", label: "Vertrauen" },
    { key: "einleitung_ziel", label: "Ziel" },
  ],
  themensammlung: [],
  interessen: [],
  optionen: [],
  verhandlung: [],
  abschluss: [],
};

export function getPhaseIndex(phase: string | null): number {
  if (!phase) return -1;
  return PHASES.findIndex((p) => p.id === phase);
}

// ── Config maps ───────────────────────────────────────────────────────────

export const TYPE_LABEL: Record<string, string> = {
  trennung: "Trennung & Scheidung",
  erbschaft: "Erbschaftsstreit",
  nachbarschaft: "Nachbarschaftskonflikt",
  wg: "WG-Konflikt",
  verbraucher: "Verbraucherstreit",
  odr: "ODR – Geschäft & Organisation",
  schlichtung: "ODR – Online-Schlichtung",
  ecommerce: "ODR – E-Commerce & Plattform",
  b2b: "ODR – B2B-Vertragsstreit",
  geschaeft: "ODR – Geschäft & Organisation", // Altbestand vor Migration
};

export const TYPE_COLOR: Record<string, string> = {
  trennung: "bg-rose-50 text-rose-700 border-rose-200",
  erbschaft: "bg-amber-50 text-amber-700 border-amber-200",
  nachbarschaft: "bg-sky-50 text-sky-700 border-sky-200",
  wg: "bg-teal-50 text-teal-700 border-teal-200",
  verbraucher: "bg-orange-50 text-orange-700 border-orange-200",
  odr: "bg-violet-50 text-violet-700 border-violet-200",
  schlichtung: "bg-indigo-50 text-indigo-700 border-indigo-200",
  ecommerce: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  b2b: "bg-purple-50 text-purple-700 border-purple-200",
  geschaeft: "bg-violet-50 text-violet-700 border-violet-200", // Altbestand
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

// ── Workspace-Dashboard: Eingriffs-Signale + Neuigkeiten ────────────────────

export interface DashboardSignal {
  severity: "hoch" | "mittel" | "niedrig" | string;
  code: string;
  text: string;
}

export interface DashboardFall {
  id: number;
  title: string;
  mediation_type: string;
  status: string;
  phase: string | null;
  parteien: number;
  signals: DashboardSignal[];
  attention_score: number;
  letzte_aktivitaet: string | null;
  inaktiv_tage: number | null;
  naechster_termin: string | null;
}

export interface DashboardNews {
  when: string;
  kind: "eingabe" | "ki" | "feedback" | "termin" | "vertrag" | "zahlung" | "einladung" | string;
  mediation_id: number;
  mediation_title: string;
  actor: string;
  text: string;
  detail: string;
}

export interface DashboardUebersicht {
  faelle: DashboardFall[];
  neuigkeiten: DashboardNews[];
}
