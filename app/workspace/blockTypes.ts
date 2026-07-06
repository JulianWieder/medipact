// ── Block-Registry (Metadaten) ────────────────────────────────────────────
//
// Zentrale Definition ALLER "Standardmethoden", aus denen ein Schritt im
// WorkflowManager zusammengebaut wird. Ein Schritt ist eine geordnete Liste
// von Blöcken (siehe StepBlock in types.ts); jeder Block hat einen `type` (aus
// dieser Liste) und eine typ-spezifische `config`.
//
// WICHTIG – so fügst du später eine neue Methode hinzu:
//   1. Hier einen Eintrag in BLOCK_TYPES ergänzen (Label, Icon, defaultConfig …).
//   2. Im Designer (WorkflowManager: BlockConfigEditor) die Konfig-Felder rendern.
//   3. Im Teilnehmer-Renderer (StepContentBlocks) den Render-Fall ergänzen.
// KEINE Datenbank-Migration nötig – `config` ist frei (JSON). Unbekannte Typen
// werden überall tolerant übersprungen, alte Daten brechen nie.

export type BlockGroup =
  | "Anzeige"
  | "Eingabe"
  | "Gespräch & Termin"
  | "Dokument"
  | "KI"
  | "Speziell";

export const BLOCK_GROUPS: BlockGroup[] = [
  "Anzeige",
  "Eingabe",
  "Gespräch & Termin",
  "Dokument",
  "KI",
  "Speziell",
];

export interface BlockTypeDef {
  type: string;
  label: string;
  /** Kurzform für Badges auf den Karten. */
  short: string;
  icon: string;
  group: BlockGroup;
  /** Tailwind-Klassen für Badge/Chip. */
  badge: string;
  /** Startwerte für die config eines neuen Blocks dieses Typs. */
  defaultConfig: Record<string, unknown>;
  /** Erzeugt der Block im Teilnehmer-Flow Inhalt, der pro Fall gespeichert wird? */
  capturesResponse: boolean;
  /** Wer erzeugt den gespeicherten Inhalt: Teilnehmer/Mediator ("user") oder KI ("ai"). */
  responseAuthor?: "user" | "ai";
  /** Einzeiler, der im Designer als Hilfe angezeigt wird. */
  hint: string;
}

export const BLOCK_TYPES: BlockTypeDef[] = [
  // ── Anzeige (nur ausgeben, keine Eingabe) ────────────────────────────────
  {
    type: "textausgabe",
    label: "Textausgabe",
    short: "Text",
    icon: "📄",
    group: "Anzeige",
    badge: "bg-neutral-100 text-neutral-600 border-neutral-200",
    defaultConfig: { text: "" },
    capturesResponse: false,
    hint: "Zeigt den Teilnehmern einen festen Text / eine Anleitung.",
  },
  {
    type: "video",
    label: "Video abspielen",
    short: "Video",
    icon: "▶",
    group: "Anzeige",
    badge: "bg-rose-50 text-rose-600 border-rose-200",
    defaultConfig: { url: "" },
    capturesResponse: false,
    hint: "Bettet ein Video ein (YouTube/Vimeo/Datei-URL).",
  },
  {
    type: "ergebnis",
    label: "Ergebnis-Anzeige",
    short: "Ergebnis",
    icon: "◆",
    group: "Anzeige",
    badge: "bg-cyan-50 text-cyan-600 border-cyan-200",
    defaultConfig: { source_phase: "" },
    capturesResponse: false,
    hint: "Zeigt freigegebene Ergebnisse einer Phase (erst nach Mediator-Freigabe).",
  },

  // ── Eingabe (Teilnehmer erzeugt gespeicherten Inhalt) ────────────────────
  {
    type: "texteingabe",
    label: "Texteingabe",
    short: "Eingabe",
    icon: "✎",
    group: "Eingabe",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    defaultConfig: { label: "", placeholder: "" },
    capturesResponse: true,
    responseAuthor: "user",
    hint: "Freitextfeld – die Eingabe jeder Partei wird pro Block gespeichert.",
  },
  {
    type: "frage",
    label: "Frage",
    short: "Frage",
    icon: "?",
    group: "Eingabe",
    badge: "bg-violet-50 text-violet-600 border-violet-200",
    defaultConfig: { prompt: "" },
    capturesResponse: true,
    responseAuthor: "user",
    hint: "Eine konkrete Frage; die Antwort wird pro Partei gespeichert.",
  },
  {
    type: "video_aufnahme",
    label: "Video aufnehmen",
    short: "Aufnahme",
    icon: "⏺",
    group: "Eingabe",
    badge: "bg-orange-50 text-orange-600 border-orange-200",
    defaultConfig: { prompt: "" },
    capturesResponse: true,
    responseAuthor: "user",
    hint: "Teilnehmer nimmt eine Videobotschaft auf (Aufnahme + Transkript werden gespeichert).",
  },

  // ── Gespräch & Termin ────────────────────────────────────────────────────
  {
    type: "videokonferenz",
    label: "Videokonferenz",
    short: "Konferenz",
    icon: "🎥",
    group: "Gespräch & Termin",
    badge: "bg-sky-50 text-sky-600 border-sky-200",
    defaultConfig: { url: "" },
    capturesResponse: false,
    hint: "Link zum gemeinsamen Videoraum (Google Meet/Jitsi/Zoom).",
  },
  {
    type: "termin",
    label: "Terminvereinbarung",
    short: "Termin",
    icon: "📅",
    group: "Gespräch & Termin",
    badge: "bg-teal-50 text-teal-600 border-teal-200",
    defaultConfig: {},
    capturesResponse: false,
    hint: "Öffnet die Terminfindung (eigener Ablauf im Fall).",
  },
  {
    type: "feedback",
    label: "Feedback-Fragebogen",
    short: "Feedback",
    icon: "★",
    group: "Gespräch & Termin",
    badge: "bg-amber-50 text-amber-600 border-amber-200",
    defaultConfig: { occasion: "after_videocall" },
    capturesResponse: true,
    responseAuthor: "user",
    hint: "Kurzer Fragebogen; die Antworten werden pro Partei gespeichert.",
  },

  // ── Dokument ─────────────────────────────────────────────────────────────
  {
    type: "vertrag",
    label: "Vertrag / Dokument",
    short: "Vertrag",
    icon: "§",
    group: "Dokument",
    badge: "bg-indigo-50 text-indigo-600 border-indigo-200",
    defaultConfig: { template: "" },
    capturesResponse: false,
    hint: "Vertrags-/Dokumentvorlage (eigener Unterschriften-Ablauf im Fall).",
  },

  // ── KI ───────────────────────────────────────────────────────────────────
  {
    type: "ki_prompt",
    label: "KI-Prompt",
    short: "KI",
    icon: "✨",
    group: "KI",
    badge: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200",
    defaultConfig: { prompt: "", autorun: false },
    capturesResponse: true,
    responseAuthor: "ai",
    hint: "Im Schritt verankerter KI-Auftrag. Die KI-Ausgabe wird pro Fall gespeichert (Teilnehmer sehen den Prompt nicht).",
  },

  // ── Speziell ─────────────────────────────────────────────────────────────
  {
    type: "individuell",
    label: "Individuell (pro Fall)",
    short: "Individuell",
    icon: "✦",
    group: "Speziell",
    badge: "bg-pink-50 text-pink-600 border-pink-200",
    defaultConfig: {},
    capturesResponse: false,
    hint: "Platzhalter – der Inhalt wird pro Fall in der Fallansicht gepflegt.",
  },
];

export const BLOCK_TYPE_BY_ID: Record<string, BlockTypeDef> = Object.fromEntries(
  BLOCK_TYPES.map((b) => [b.type, b]),
);

/** Erzeugt eine stabile, eindeutige Block-id (für die Antwort-Zuordnung). */
export function newBlockId(): string {
  return `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export interface StepBlock {
  id: string;
  type: string;
  config: Record<string, unknown>;
  visible_if?: unknown | null;
}

/** Legt einen neuen Block eines Typs mit seinen Startwerten an. */
export function makeBlock(type: string): StepBlock {
  const def = BLOCK_TYPE_BY_ID[type];
  return {
    id: newBlockId(),
    type,
    config: { ...(def?.defaultConfig ?? {}) },
    visible_if: null,
  };
}

// ── Rückwärtskompatibilität: alte content_types/Felder -> Blöcke ────────────
//
// Für Bestands-/Testschritte, die noch keine `blocks` haben: aus den alten
// content_types plus den Einzelfeldern eine äquivalente Block-Liste ableiten,
// damit sie im neuen Designer sofort editierbar sind. Reihenfolge: zuerst der
// Anleitungstext (description) als Textausgabe, dann die content_types in ihrer
// gespeicherten Reihenfolge.
export interface LegacyStepFields {
  description?: string | null;
  placeholder?: string | null;
  question?: string | null;
  contract_template?: string | null;
  video_url?: string | null;
  meeting_url?: string | null;
  result_source_phase?: string | null;
  feedback_occasion?: string | null;
  content_types?: string[] | null;
}

export function deriveBlocksFromLegacy(step: LegacyStepFields): StepBlock[] {
  const blocks: StepBlock[] = [];
  const push = (type: string, config: Record<string, unknown>) =>
    blocks.push({ id: newBlockId(), type, config, visible_if: null });

  if (step.description && step.description.trim()) {
    push("textausgabe", { text: step.description });
  }
  for (const t of step.content_types ?? []) {
    switch (t) {
      case "text":
        push("texteingabe", { label: "", placeholder: step.placeholder ?? "" });
        break;
      case "video":
        push("video", { url: step.video_url ?? "" });
        break;
      case "frage":
        push("frage", { prompt: step.question ?? "" });
        break;
      case "videokonferenz":
        push("videokonferenz", { url: step.meeting_url ?? "" });
        break;
      case "feedback":
        push("feedback", { occasion: step.feedback_occasion ?? "after_videocall" });
        break;
      case "termin":
        push("termin", {});
        break;
      case "vertrag":
        push("vertrag", { template: step.contract_template ?? "" });
        break;
      case "ergebnis":
        push("ergebnis", { source_phase: step.result_source_phase ?? "" });
        break;
      case "individuell":
        push("individuell", {});
        break;
      default:
        // unbekannter Alt-Typ -> tolerant überspringen
        break;
    }
  }
  return blocks;
}
