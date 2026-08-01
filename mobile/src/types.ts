// Typen entsprechen den Antworten der FastAPI-Endpunkte (backend/app/routers).

export type User = { id: number; email: string; name: string; role: string };

export type CaseSummary = {
  mediation_id: number;
  title: string | null;
  role: string;
  status: string;
  phase: string | null;
  mediation_type: string;
  variant_key: string | null;
  mode: string; // "logbuch" | "mediation"
  is_my_turn?: boolean;
};

// Ein Formular-Block aus der WorkflowManager-Vorlage (phase-steps).
export type Block = {
  id: string;
  type: string; // "frage" | "datum" | "skala" | "textausgabe" | "datei_upload" | ...
  config: Record<string, any> | null;
  visible_if?: unknown;
};

// Antwort von GET /mediations/{id}/phase-steps?phase=... – Schritte liegen
// unter "steps", der Schlüssel heißt dort "key" (nicht step_key!).
export type PhaseStep = {
  key: string;
  title?: string | null;
  description?: string | null;
  blocks?: Block[] | null;
};

export type PhaseStepsResponse = {
  phase: string;
  mediation_type: string;
  flags: Record<string, unknown>;
  steps: PhaseStep[];
};

export type UploadValue = { url: string; name: string };
export type BlockValue = string | number | UploadValue | null;

export type AnalysisStep = { titel: string; warum: string };
export type Analysis = {
  einschaetzung: string;
  naechste_schritte: AnalysisStep[];
  tipp: string;
};

export type LogEntry = {
  id: number;
  entry_type: string;
  occurred_at: string | null;
  title: string | null;
  content: Record<string, BlockValue>;
  author_participant_id: number;
  // Journal-Ausbau: "private" (Sensibel, nur Autor:in) | "personal" (Default)
  // | "shared" (in die Mediation gepusht). is_own steuert Bearbeiten/Löschen.
  visibility: string;
  is_own?: boolean;
  ai_analysis: Analysis | null;
  ai_analysis_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type Quota = {
  limit: number | null;
  period: "day" | "week";
  used: number;
  remaining: number | null;
  next_available_at: string | null;
};

export type LogbuchStatus = {
  plan: "free" | "premium";
  premium_price_eur: number;
  analyses: Quota;
  uploads: Quota;
};

export type AnalyzeResponse = {
  status: "done" | "skipped" | "quota_exhausted";
  analysis?: Analysis;
  reason?: string;
  analyses?: Quota;
  plan?: string;
  premium_price_eur?: number;
};
