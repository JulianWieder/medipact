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
  | "Dokument & Medien"
  | "KI"
  | "Ablauf & Layout"
  | "Bezahlung"
  | "Speziell";

export const BLOCK_GROUPS: BlockGroup[] = [
  "Anzeige",
  "Eingabe",
  "Gespräch & Termin",
  "Dokument & Medien",
  "KI",
  "Ablauf & Layout",
  "Bezahlung",
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
    group: "Dokument & Medien",
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

  // ── Eingabe (strukturiert – stark für die Auswertung) ────────────────────
  {
    type: "auswahl",
    label: "Auswahl",
    short: "Auswahl",
    icon: "☑",
    group: "Eingabe",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    defaultConfig: { prompt: "", options: [], multi: false },
    capturesResponse: true,
    responseAuthor: "user",
    hint: "Feste Antwortoptionen (einfach oder mehrfach) – gut vergleichbar.",
  },
  {
    type: "skala",
    label: "Skala / Bewertung",
    short: "Skala",
    icon: "⚖",
    group: "Eingabe",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    defaultConfig: { prompt: "", min: 1, max: 10, minLabel: "", maxLabel: "" },
    capturesResponse: true,
    responseAuthor: "user",
    hint: "Bewertung auf einer Skala, z.B. Wichtigkeit von 1 bis 10.",
  },
  {
    type: "ranking",
    label: "Prioritäten-Ranking",
    short: "Ranking",
    icon: "↕",
    group: "Eingabe",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    defaultConfig: { prompt: "", options: [] },
    capturesResponse: true,
    responseAuthor: "user",
    hint: "Vorgegebene Punkte in eine persönliche Reihenfolge bringen.",
  },
  {
    type: "liste",
    label: "Listensammlung",
    short: "Liste",
    icon: "➕",
    group: "Eingabe",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    defaultConfig: { prompt: "", placeholder: "" },
    capturesResponse: true,
    responseAuthor: "user",
    hint: "Teilnehmer fügt beliebig viele Punkte zu einer Liste hinzu (z.B. Themen).",
  },
  {
    type: "betrag",
    label: "Betrag / Zahl",
    short: "Betrag",
    icon: "€",
    group: "Eingabe",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    defaultConfig: { label: "", currency: "€" },
    capturesResponse: true,
    responseAuthor: "user",
    hint: "Strukturierter Zahlenwert (z.B. Vermögenswert, Betrag).",
  },
  {
    type: "vertrauliche_notiz",
    label: "Vertrauliche Notiz (nur Mediator)",
    short: "Vertraulich",
    icon: "🔒",
    group: "Eingabe",
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    defaultConfig: { prompt: "" },
    capturesResponse: true,
    responseAuthor: "user",
    hint: "Eingabe, die nur der Mediator sieht – nicht die Gegenseite (Einzelgespräch).",
  },

  // ── Dokument & Medien ────────────────────────────────────────────────────
  {
    type: "datei_upload",
    label: "Datei-Upload",
    short: "Upload",
    icon: "📎",
    group: "Dokument & Medien",
    badge: "bg-indigo-50 text-indigo-600 border-indigo-200",
    defaultConfig: { prompt: "", accept: "" },
    capturesResponse: true,
    responseAuthor: "user",
    hint: "Teilnehmer lädt eine Datei hoch (Belege, Fotos, Unterlagen).",
  },
  {
    type: "bild",
    label: "Bild anzeigen",
    short: "Bild",
    icon: "🖼",
    group: "Dokument & Medien",
    badge: "bg-indigo-50 text-indigo-600 border-indigo-200",
    defaultConfig: { url: "", caption: "" },
    capturesResponse: false,
    hint: "Zeigt ein Bild (URL), z.B. Foto des Streitgegenstands.",
  },
  {
    type: "zustimmung",
    label: "Zustimmung / Bestätigung",
    short: "Zustimmung",
    icon: "✔",
    group: "Dokument & Medien",
    badge: "bg-indigo-50 text-indigo-600 border-indigo-200",
    defaultConfig: { text: "" },
    capturesResponse: true,
    responseAuthor: "user",
    hint: "Ankreuzbare Bestätigung (Regeln akzeptieren, Einverständnis).",
  },
  {
    type: "unterschrift",
    label: "Kurz-Unterschrift",
    short: "Signatur",
    icon: "✍",
    group: "Dokument & Medien",
    badge: "bg-indigo-50 text-indigo-600 border-indigo-200",
    defaultConfig: { statement: "" },
    capturesResponse: true,
    responseAuthor: "user",
    hint: "Bestätigung per getipptem Namen (leichtgewichtige Unterschrift).",
  },

  // ── KI (Analyse-Varianten – laufen serverseitig, für Teilnehmer unsichtbar) ─
  {
    type: "ki_zusammenfassung",
    label: "KI: Zusammenfassung",
    short: "KI-Summe",
    icon: "✨",
    group: "KI",
    badge: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200",
    defaultConfig: {
      prompt:
        "Fasse die Eingaben aller Parteien neutral und ausgewogen zusammen. Nenne die Kernpunkte jeder Seite, ohne zu werten.",
      autorun: false,
    },
    capturesResponse: true,
    responseAuthor: "ai",
    hint: "Fasst die Eingaben beider Parteien neutral zusammen.",
  },
  {
    type: "ki_reframing",
    label: "KI: Reframing / Deeskalation",
    short: "KI-Reframe",
    icon: "✨",
    group: "KI",
    badge: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200",
    defaultConfig: {
      prompt:
        "Formuliere belastende oder vorwurfsvolle Aussagen in eine gewaltfreie, sachliche und lösungsorientierte Sprache um, ohne den Inhalt zu verfälschen.",
      autorun: false,
    },
    capturesResponse: true,
    responseAuthor: "ai",
    hint: "Formuliert Aussagen neutral/gewaltfrei um (NVC).",
  },
  {
    type: "ki_interessen",
    label: "KI: Interessen aus Positionen",
    short: "KI-Interessen",
    icon: "✨",
    group: "KI",
    badge: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200",
    defaultConfig: {
      prompt:
        "Leite aus den geäußerten Positionen die dahinterliegenden Interessen und Bedürfnisse jeder Partei ab.",
      autorun: false,
    },
    capturesResponse: true,
    responseAuthor: "ai",
    hint: "Leitet die Interessen hinter den Positionen ab.",
  },
  {
    type: "ki_optionen",
    label: "KI: Lösungsoptionen",
    short: "KI-Optionen",
    icon: "✨",
    group: "KI",
    badge: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200",
    defaultConfig: {
      prompt:
        "Erarbeite auf Basis der Eingaben mehrere faire, umsetzbare Lösungsoptionen, die die Interessen beider Seiten berücksichtigen.",
      autorun: false,
    },
    capturesResponse: true,
    responseAuthor: "ai",
    hint: "Generiert faire Lösungsoptionen (Optionen-Phase).",
  },
  {
    type: "ki_gemeinsamkeiten",
    label: "KI: Gemeinsamkeiten & Konfliktpunkte",
    short: "KI-Analyse",
    icon: "✨",
    group: "KI",
    badge: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200",
    defaultConfig: {
      prompt:
        "Identifiziere Übereinstimmungen und verbleibende Konfliktpunkte zwischen den Parteien. Markiere, wo eine Einigung nahe liegt.",
      autorun: false,
    },
    capturesResponse: true,
    responseAuthor: "ai",
    hint: "Findet Gemeinsamkeiten und Reibungspunkte – speist die Auswertung.",
  },

  // ── Ablauf & Layout ──────────────────────────────────────────────────────
  {
    type: "hinweis",
    label: "Hinweis-Box",
    short: "Hinweis",
    icon: "ℹ",
    group: "Ablauf & Layout",
    badge: "bg-blue-50 text-blue-600 border-blue-200",
    defaultConfig: { text: "", variant: "info" },
    capturesResponse: false,
    hint: "Hervorgehobener Hinweis (Info / Warnung / Erfolg).",
  },
  {
    type: "akkordeon",
    label: "Ausklappbarer Abschnitt",
    short: "Akkordeon",
    icon: "▾",
    group: "Ablauf & Layout",
    badge: "bg-blue-50 text-blue-600 border-blue-200",
    defaultConfig: { title: "", text: "" },
    capturesResponse: false,
    hint: "Zusatzinfo/FAQ, die die Teilnehmer bei Bedarf aufklappen.",
  },
  {
    type: "gate",
    label: "Wartepunkt / Gate",
    short: "Gate",
    icon: "⏸",
    group: "Ablauf & Layout",
    badge: "bg-blue-50 text-blue-600 border-blue-200",
    defaultConfig: { text: "" },
    capturesResponse: false,
    hint: "Hinweis, dass es erst weitergeht, wenn beide Parteien bestätigt haben.",
  },

  // ── Bezahlung (kostenpflichtige Bonus-Leistungen, z.B. Gutachter) ────────
  {
    type: "bezahlung",
    label: "Bonus-Leistung (kostenpflichtig)",
    short: "Bonus €",
    icon: "💳",
    group: "Bezahlung",
    badge: "bg-amber-100 text-amber-700 border-amber-300",
    defaultConfig: { title: "", description: "", price: 0, currency: "EUR", unlock_text: "" },
    capturesResponse: false,
    hint: "Kostenpflichtiger Zusatz (z.B. Gutachter). Inhalt wird erst nach Zahlung freigeschaltet.",
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
