"use client";

// ── Konflikt-Logbuch: dokumentieren, bevor mediiert wird ────────────────────
//
// Ein Fall mit mode="logbuch": Die Nutzer:in hält fortlaufend fest, was im
// Konflikt passiert – Vorkommnisse, Gedanken, Gespräche, E-Mails, WhatsApp,
// Telefonate, inkl. Fotos/Belegen (datei_upload-Block). Keine Gegenseite.
//
// Die FORM kommt aus dem WorkflowManager (Phase "logbuch"):
//   • logbuch_intake  – Grunddaten des Streits (einmalig, block_responses)
//   • logbuch_eintrag – VORLAGE des Eintrag-Formulars (Blöcke = Felder);
//     Werte landen als {block_id: wert} in mediation_log_entries.content.
//
// KI-Analyse: Nach dem Speichern wird der Eintrag automatisch analysiert
// (nächste Schritte + psychologischer Tipp), sofern Kontingent frei ist:
//   free:    1 Interpretation/Woche, 1 Datei-Upload/Woche
//   premium: 1 Tipp/Tag, Uploads unbegrenzt (einmalig 14,95 € via PayPal)
// Dünne Einträge überspringt die KI bewusst (Qualitäts-Gate, kostenlos).
//
// Upsells: "In Mediation umwandeln" (POST /logbuch/convert) + Premium-Modal.

import Link from "next/link";
import Icon from "@/app/components/ui/Icon";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Reveal } from "@/app/components/ui/motion";
import { CrossfadePanel } from "@/app/components/ui/TabSwitcher";
import { cardLift, cn } from "@/app/components/ui/premium";

interface Props {
  mediationId: string;
  initialTitle: string;
  mediationType: string;
  /** "logbuch" (eigenständig) oder "mediation" (Logbuch & Journal neben dem Fall). */
  mode?: string;
  /** Link zurück zum Fall, wenn das Logbuch an eine Mediation geknüpft ist. */
  caseHref?: string;
}

interface FlowBlock {
  id: string;
  type: string;
  config: Record<string, unknown>;
}

interface AiStep {
  titel: string;
  warum: string;
}

interface AiAnalysis {
  einschaetzung: string;
  naechste_schritte: AiStep[];
  tipp: string;
}

interface LogEntry {
  id: number;
  entry_type: string;
  occurred_at: string | null;
  title: string | null;
  content: Record<string, unknown>;
  ai_analysis: AiAnalysis | null;
  ai_analysis_at: string | null;
  created_at: string | null;
  visibility?: string;
  is_own?: boolean;
}

interface Quota {
  limit: number | null;
  period: string;
  used: number;
  remaining: number | null;
  next_available_at: string | null;
}

interface LogbuchStatus {
  plan: string;
  premium_price_eur: number;
  analyses: Quota;
  uploads: Quota;
}

const ENTRY_TYPES: { key: string; label: string; icon: string }[] = [
  { key: "vorkommnis", label: "Vorkommnis", icon: "📌" },
  { key: "gedanke", label: "Gedanke", icon: "💭" },
  { key: "gespraech", label: "Gespräch", icon: "🗣️" },
  { key: "email", label: "E-Mail", icon: "✉️" },
  { key: "whatsapp", label: "WhatsApp", icon: "💬" },
  { key: "telefonat", label: "Telefonat", icon: "📞" },
];

// Business/ODR: sachliche Falldokumentation statt persönlichem Journal.
// Gleiche entry_type-Keys (Datenmodell unverändert), nur nüchternere Labels.
const BUSINESS_TYPES = new Set(["odr", "schlichtung", "ecommerce", "b2b", "geschaeft"]);
const BUSINESS_ENTRY_LABELS: Record<string, string> = {
  vorkommnis: "Vorgang",
  gedanke: "Interne Notiz",
  gespraech: "Besprechung",
  whatsapp: "Nachricht",
};

// Journal-Ausbau: Sichtbarkeit je Eintrag (Backend: mediation_log_entries.visibility)
const VISIBILITIES: { key: string; label: string; icon: string; hint: string }[] = [
  {
    key: "personal",
    label: "Dokumentation",
    icon: "📓",
    hint: "Nur für Sie – lässt sich später in die Mediation teilen.",
  },
  {
    key: "private",
    label: "Sensibel",
    icon: "🔒",
    hint: "Streng vertraulich: sieht niemals Mediator oder Gegenseite – auch nach einer Umwandlung nicht.",
  },
  {
    key: "shared",
    label: "In Mediation geteilt",
    icon: "🤝",
    hint: "Sichtbar für alle Beteiligten des Falls (Mediator + Gegenseite).",
  },
];

function visMeta(key: string | undefined) {
  return VISIBILITIES.find((v) => v.key === (key ?? "personal")) ?? VISIBILITIES[0];
}

const INPUT_TYPES = new Set([
  "frage", "texteingabe", "auswahl", "skala", "datum", "betrag", "datei_upload",
]);

function cfgStr(c: Record<string, unknown>, k: string): string {
  const v = c?.[k];
  return typeof v === "string" ? v : "";
}
function cfgNum(c: Record<string, unknown>, k: string, fb: number): number {
  const v = c?.[k];
  return typeof v === "number" && !Number.isNaN(v) ? v : fb;
}
function cfgArr(c: Record<string, unknown>, k: string): string[] {
  const v = c?.[k];
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function formatDate(iso: string | null): string {
  if (!iso) return "ohne Datum";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "ohne Datum";
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
}

function formatEuro(v: number): string {
  return v.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

// Wert eines datei_upload-Blocks: {url, name}
interface FileValue {
  url: string;
  name?: string;
}
function asFileValue(v: unknown): FileValue | null {
  if (typeof v === "object" && v !== null && typeof (v as FileValue).url === "string") {
    return v as FileValue;
  }
  return null;
}
function isImageFile(f: FileValue): boolean {
  return /\.(png|jpe?g|gif|webp|heic|heif|bmp|svg)(\?|$)/i.test(f.name || f.url);
}

// ── Ein Formularfeld je WFM-Block (kompakte Formular-Variante) ──────────────
function BlockField({
  block,
  value,
  onChange,
  uploading,
  onUploadFile,
}: {
  block: FlowBlock;
  value: unknown;
  onChange: (v: unknown) => void;
  uploading?: boolean;
  onUploadFile?: (f: File) => void;
}) {
  const c = block.config ?? {};
  const label = cfgStr(c, "prompt") || cfgStr(c, "label");
  const str = typeof value === "string" ? value : "";

  if (block.type === "datum") {
    return (
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-neutral-800">{label}</span>
        <input
          type="date"
          value={str}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none transition focus:border-accent-500"
        />
        {cfgStr(c, "help") && (
          <span className="mt-1 block text-xs text-neutral-400">{cfgStr(c, "help")}</span>
        )}
      </label>
    );
  }

  if (block.type === "datei_upload") {
    const file = asFileValue(value);
    return (
      <div>
        {label && (
          <span className="mb-1.5 block text-sm font-semibold text-neutral-800">{label}</span>
        )}
        {file && (
          <div className="mb-2 flex items-center gap-2 text-sm">
            <a
              href={file.url}
              target="_blank"
              rel="noreferrer"
              className="break-all font-semibold text-accent-700 underline"
            >
              📎 {file.name || "Datei"}
            </a>
            <span className="text-emerald-600">✓</span>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-xs font-semibold text-neutral-400 hover:text-red-500"
            >
              Entfernen
            </button>
          </div>
        )}
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-700 transition hover:border-accent-400 hover:text-accent-700">
          {uploading ? "Lädt hoch …" : file ? "Andere Datei wählen" : "📎 Foto oder Datei anhängen"}
          <input
            type="file"
            accept={cfgStr(c, "accept") || undefined}
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f && onUploadFile) onUploadFile(f);
              e.target.value = "";
            }}
          />
        </label>
      </div>
    );
  }

  if (block.type === "auswahl") {
    const opts = cfgArr(c, "options");
    const multi = c.multi === true;
    const selected: string[] = Array.isArray(value)
      ? (value as string[])
      : typeof value === "string" && value ? [value] : [];
    const toggle = (opt: string) => {
      if (multi) {
        onChange(selected.includes(opt) ? selected.filter((o) => o !== opt) : [...selected, opt]);
      } else {
        onChange(selected.includes(opt) ? "" : opt);
      }
    };
    return (
      <div>
        <span className="mb-1.5 block text-sm font-semibold text-neutral-800">{label}</span>
        <div className="flex flex-wrap gap-2">
          {opts.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => toggle(o)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                selected.includes(o)
                  ? "border-accent-500 bg-accent-50 font-semibold text-accent-700"
                  : "border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "skala") {
    const min = cfgNum(c, "min", 1);
    const max = cfgNum(c, "max", 10);
    const val = typeof value === "number" ? value : Math.round((min + max) / 2);
    return (
      <div>
        <span className="mb-1.5 block text-sm font-semibold text-neutral-800">
          {label}
          {typeof value === "number" && (
            <span className="ml-2 font-bold text-accent-600">{value}</span>
          )}
        </span>
        <input
          type="range"
          min={min}
          max={max}
          value={val}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-accent-600"
        />
        <div className="mt-0.5 flex justify-between text-xs text-neutral-400">
          <span>{cfgStr(c, "minLabel") || min}</span>
          <span>{cfgStr(c, "maxLabel") || max}</span>
        </div>
      </div>
    );
  }

  if (block.type === "betrag") {
    return (
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-neutral-800">{label}</span>
        <span className="flex items-center gap-2">
          <input
            type="number"
            step="0.01"
            value={typeof value === "number" ? value : ""}
            onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
            className="w-44 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-accent-500"
          />
          <span className="text-sm text-neutral-500">{cfgStr(c, "currency") || "€"}</span>
        </span>
      </label>
    );
  }

  // frage / texteingabe (Default: Freitext)
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-neutral-800">{label}</span>
      <textarea
        value={str}
        onChange={(e) => onChange(e.target.value)}
        placeholder={cfgStr(c, "placeholder") || "Schreiben Sie frei …"}
        rows={3}
        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm leading-6 text-neutral-800 outline-none transition focus:border-accent-500"
      />
    </label>
  );
}

// ── KI-Analyse-Karte unter einem Eintrag ────────────────────────────────────
// showTip=false (Business): nur sachliche Einschätzung + nächste Schritte,
// keine psychologische "Für Sie persönlich"-Karte.
function AnalysisCard({ analysis, showTip = true }: { analysis: AiAnalysis; showTip?: boolean }) {
  return (
    <div className="mt-4 rounded-2xl border border-violet-200 bg-violet-50/60 p-4 sm:p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-violet-600">
        ✨ KI-Einschätzung
      </p>
      {analysis.einschaetzung && (
        <p className="mt-2 text-sm leading-6 text-neutral-700">{analysis.einschaetzung}</p>
      )}
      {analysis.naechste_schritte.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Gute nächste Schritte
          </p>
          <ol className="mt-1.5 space-y-2">
            {analysis.naechste_schritte.map((s, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-6">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[11px] font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-neutral-800">
                  <span className="font-semibold">{s.titel}</span>
                  {s.warum && <span className="text-neutral-600"> – {s.warum}</span>}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
      {showTip && analysis.tipp && (
        <div className="mt-3 rounded-xl bg-white/70 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
            💚 Für Sie persönlich
          </p>
          <p className="mt-1 text-sm leading-6 text-neutral-700">{analysis.tipp}</p>
        </div>
      )}
      <p className="mt-3 text-[11px] leading-4 text-neutral-400">
        Automatisch erstellte Einschätzung – ersetzt keine Rechtsberatung und keine
        psychologische Beratung.
      </p>
    </div>
  );
}

export default function LogbuchClient({
  mediationId,
  initialTitle,
  mediationType,
  mode = "logbuch",
  caseHref,
}: Props) {
  // Verknüpfter Modus: das Logbuch läuft NEBEN einer Mediation weiter –
  // Einträge können einzeln in den Fall gepusht werden (visibility=shared).
  const isLinked = mode !== "logbuch";
  // Business/ODR: Falldokumentation statt Journal – kein Sensibel-Schalter,
  // kein psychologischer KI-Tipp, sachliche Labels.
  const isBusiness = BUSINESS_TYPES.has(mediationType);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNew = searchParams.get("neu") === "1";

  const [intakeBlocks, setIntakeBlocks] = useState<FlowBlock[]>([]);
  const [entryBlocks, setEntryBlocks] = useState<FlowBlock[]>([]);
  const [intakeValues, setIntakeValues] = useState<Record<string, unknown>>({});
  // Intake ist jetzt sekundär: standardmäßig eingeklappt, unter dem Composer.
  const [intakeOpen, setIntakeOpen] = useState(false);
  // Composer zusammengeklappt, bis man aktiv einen Eintrag festhalten will.
  const [composerOpen, setComposerOpen] = useState(isNew);
  const [intakeSaving, setIntakeSaving] = useState(false);
  const [intakeSaved, setIntakeSaved] = useState(false);

  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<LogbuchStatus | null>(null);

  // Composer (neuer/bearbeiteter Eintrag)
  const [entryType, setEntryType] = useState("vorkommnis");
  const [entryVisibility, setEntryVisibility] = useState("personal");
  const [viewFilter, setViewFilter] = useState("alle");
  const [entryValues, setEntryValues] = useState<Record<string, unknown>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [entrySaving, setEntrySaving] = useState(false);
  const [uploadingBlocks, setUploadingBlocks] = useState<Record<string, boolean>>({});

  // KI-Analyse
  const [analyzingId, setAnalyzingId] = useState<number | null>(null);
  const [aiNotice, setAiNotice] = useState<{ entryId: number; text: string; upsell: boolean } | null>(null);

  // Premium-Upgrade
  const [premiumOpen, setPremiumOpen] = useState(false);
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  // Gemounteter DOM-Knoten statt "schon gerendert"-Flag: das Premium-Modal
  // mountet den Container bei jedem Öffnen neu – mit einem booleschen Flag
  // bräche der Effect ab und der Bezahl-Button bliebe unsichtbar.
  const paypalMountedNodeRef = useRef<HTMLElement | null>(null);
  const [paypalRetry, setPaypalRetry] = useState(0);

  const [converting, setConverting] = useState(false);
  const [confirmConvert, setConfirmConvert] = useState(false);
  const [error, setError] = useState("");

  const isPremium = status?.plan === "premium";

  // ── Laden: WFM-Vorlagen + Intake-Antworten + Einträge + Status ──
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [stepsRes, respRes, entriesRes, statusRes] = await Promise.all([
          fetch(`/api/mediations/${mediationId}/phase-steps?phase=logbuch`, { cache: "no-store" }),
          fetch(
            `/api/mediations/${mediationId}/block-responses?phase=logbuch&step_key=logbuch_intake`,
            { cache: "no-store" },
          ),
          fetch(`/api/mediations/${mediationId}/logbuch/entries`, { cache: "no-store" }),
          fetch(`/api/mediations/${mediationId}/logbuch/status`, { cache: "no-store" }),
        ]);
        if (cancelled) return;

        if (stepsRes.ok) {
          const data = await stepsRes.json();
          const steps: { key?: string; blocks?: FlowBlock[] }[] = data.steps ?? [];
          setIntakeBlocks(steps.find((s) => s.key === "logbuch_intake")?.blocks ?? []);
          setEntryBlocks(steps.find((s) => s.key === "logbuch_eintrag")?.blocks ?? []);
        }
        if (respRes.ok) {
          const rows: { block_id: string; value: unknown }[] = await respRes.json();
          const map: Record<string, unknown> = {};
          for (const r of rows ?? []) map[r.block_id] = r.value;
          setIntakeValues(map);
          if (Object.keys(map).length > 0) setIntakeSaved(true);
        }
        if (entriesRes.ok) {
          const loaded: LogEntry[] = await entriesRes.json();
          setEntries(loaded);
          // Leeres Logbuch: Composer direkt offen, damit man sofort loslegt.
          if (loaded.length === 0) setComposerOpen(true);
        }
        if (statusRes.ok) {
          setStatus(await statusRes.json());
        }
      } catch {
        setError("Server nicht erreichbar.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [mediationId]);

  const refreshStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/mediations/${mediationId}/logbuch/status`, { cache: "no-store" });
      if (res.ok) setStatus(await res.json());
    } catch {
      /* Anzeige bleibt beim letzten Stand */
    }
  }, [mediationId]);

  const intakeInputs = useMemo(
    () => intakeBlocks.filter((b) => INPUT_TYPES.has(b.type)),
    [intakeBlocks],
  );
  const intakeIntro = useMemo(
    () => intakeBlocks.find((b) => b.type === "textausgabe"),
    [intakeBlocks],
  );
  const entryInputs = useMemo(
    () => entryBlocks.filter((b) => INPUT_TYPES.has(b.type)),
    [entryBlocks],
  );
  // Erster datum-Block der Vorlage = Ereignis-Datum (occurred_at).
  const dateBlockId = useMemo(
    () => entryInputs.find((b) => b.type === "datum")?.id ?? null,
    [entryInputs],
  );

  // ── Datei-Upload für datei_upload-Blöcke im Composer ──
  const uploadFile = useCallback(
    async (block: FlowBlock, file: File) => {
      setUploadingBlocks((s) => ({ ...s, [block.id]: true }));
      setError("");
      try {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch(`/api/mediations/${mediationId}/logbuch/upload`, {
          method: "POST",
          body: form,
        });
        const body = await res.json().catch(() => null);
        if (!res.ok) {
          if (res.status === 402) setPremiumOpen(true);
          setError(body?.detail ?? body?.error ?? `Upload fehlgeschlagen (${res.status})`);
          return;
        }
        setEntryValues((s) => ({ ...s, [block.id]: { url: body.url, name: body.name } }));
        if (body.uploads) {
          setStatus((prev) => (prev ? { ...prev, uploads: body.uploads } : prev));
        }
      } catch {
        setError("Upload fehlgeschlagen – Server nicht erreichbar.");
      } finally {
        setUploadingBlocks((s) => ({ ...s, [block.id]: false }));
      }
    },
    [mediationId],
  );

  // ── KI-Analyse eines Eintrags ──
  const analyzeEntry = useCallback(
    async (entryId: number, premium: boolean) => {
      setAnalyzingId(entryId);
      setAiNotice(null);
      try {
        const res = await fetch(
          `/api/mediations/${mediationId}/logbuch/entries/${entryId}/analyze`,
          { method: "POST" },
        );
        const body = await res.json().catch(() => null);
        if (!res.ok) {
          setAiNotice({
            entryId,
            text: body?.detail ?? body?.error ?? "Die KI-Analyse ist gerade nicht verfügbar.",
            upsell: false,
          });
          return;
        }
        if (body.status === "done" && body.analysis) {
          setEntries((prev) =>
            prev.map((e) =>
              e.id === entryId
                ? { ...e, ai_analysis: body.analysis, ai_analysis_at: new Date().toISOString() }
                : e,
            ),
          );
          if (body.analyses) {
            setStatus((prev) => (prev ? { ...prev, analyses: body.analyses } : prev));
          }
        } else if (body.status === "quota_exhausted") {
          const next = body.analyses?.next_available_at;
          const when = next ? ` Die nächste gibt es ab ${formatDate(next)}.` : "";
          setAiNotice({
            entryId,
            text: premium
              ? `Ihr heutiger KI-Tipp ist bereits verbraucht.${when}`
              : `Ihre kostenlose KI-Interpretation dieser Woche ist bereits verbraucht.${when}`,
            upsell: !premium,
          });
        } else if (body.status === "skipped") {
          setAiNotice({
            entryId,
            text: body.reason ?? "Für diesen Eintrag gibt es diesmal keine Empfehlung.",
            upsell: false,
          });
        }
      } catch {
        setAiNotice({ entryId, text: "Server nicht erreichbar.", upsell: false });
      } finally {
        setAnalyzingId(null);
      }
    },
    [mediationId],
  );

  // ── Intake speichern (block_responses + Fallbeschreibung) ──
  const saveIntake = useCallback(async () => {
    setIntakeSaving(true);
    setError("");
    try {
      await Promise.all(
        intakeInputs
          .filter((b) => intakeValues[b.id] !== undefined)
          .map((b) =>
            fetch(`/api/mediations/${mediationId}/block-responses`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                phase: "logbuch",
                step_key: "logbuch_intake",
                block_id: b.id,
                block_type: b.type,
                value: intakeValues[b.id],
                submitted: true,
              }),
            }),
          ),
      );
      // map_to=description → Fallbeschreibung nachziehen
      const descBlock = intakeInputs.find((b) => cfgStr(b.config, "map_to") === "description");
      const desc = descBlock ? intakeValues[descBlock.id] : undefined;
      if (typeof desc === "string" && desc.trim()) {
        await fetch(`/api/mediations/${mediationId}/update`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: desc }),
        });
      }
      setIntakeSaved(true);
      setIntakeOpen(false);
    } catch {
      setError("Grunddaten konnten nicht gespeichert werden.");
    } finally {
      setIntakeSaving(false);
    }
  }, [intakeInputs, intakeValues, mediationId]);

  // ── Eintrag speichern (neu oder bearbeitet) → danach automatisch analysieren ──
  const saveEntry = useCallback(async () => {
    setEntrySaving(true);
    setError("");
    const occurred = dateBlockId ? entryValues[dateBlockId] : null;
    const payload = {
      entry_type: entryType,
      occurred_at: typeof occurred === "string" && occurred ? occurred : null,
      content: entryValues,
      visibility: entryVisibility,
    };
    try {
      const url = editingId
        ? `/api/mediations/${mediationId}/logbuch/entries/${editingId}`
        : `/api/mediations/${mediationId}/logbuch/entries`;
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setError(body?.detail ?? body?.error ?? `Fehler (${res.status})`);
        return;
      }
      const wasNew = !editingId;
      if (editingId) {
        setEntries((prev) => prev.map((e) => (e.id === editingId ? body : e)));
      } else {
        setEntries((prev) => [body, ...prev]);
      }
      setEntryValues({});
      setEditingId(null);
      setEntryType("vorkommnis");
      setEntryVisibility("personal");
      setComposerOpen(false);
      // Automatische KI-Analyse direkt nach dem Speichern eines NEUEN Eintrags.
      if (wasNew && body?.id) {
        void analyzeEntry(body.id, status?.plan === "premium");
      }
    } catch {
      setError("Eintrag konnte nicht gespeichert werden.");
    } finally {
      setEntrySaving(false);
    }
  }, [dateBlockId, editingId, entryType, entryValues, entryVisibility, mediationId, analyzeEntry, status]);

  const deleteEntry = useCallback(
    async (id: number) => {
      if (!window.confirm("Diesen Eintrag wirklich löschen?")) return;
      const res = await fetch(`/api/mediations/${mediationId}/logbuch/entries/${id}`, {
        method: "DELETE",
      });
      if (res.ok) setEntries((prev) => prev.filter((e) => e.id !== id));
    },
    [mediationId],
  );

  // Eintrag in die Mediation pushen / wieder zurückziehen (nur eigene).
  const changeVisibility = useCallback(
    async (entry: LogEntry, visibility: string) => {
      setError("");
      try {
        const res = await fetch(
          `/api/mediations/${mediationId}/logbuch/entries/${entry.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ visibility }),
          },
        );
        const body = await res.json().catch(() => null);
        if (!res.ok) {
          setError(body?.detail ?? body?.error ?? `Fehler (${res.status})`);
          return;
        }
        setEntries((prev) =>
          prev.map((e) => (e.id === entry.id ? { ...e, ...body } : e)),
        );
      } catch {
        setError("Server nicht erreichbar.");
      }
    },
    [mediationId],
  );

  const startEdit = useCallback((entry: LogEntry) => {
    setEditingId(entry.id);
    setEntryType(entry.entry_type);
    setEntryVisibility(entry.visibility ?? "personal");
    setEntryValues(entry.content ?? {});
    setComposerOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ── Upsell: in Mediation umwandeln ──
  const convert = useCallback(async () => {
    setConverting(true);
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/logbuch/convert`, {
        method: "POST",
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setError(body?.detail ?? body?.error ?? `Fehler (${res.status})`);
        return;
      }
      router.push(`/dashboard/mediation/new/${body.mediation_type}?mediationId=${mediationId}`);
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setConverting(false);
    }
  }, [mediationId, router]);

  // Nach einer fehlgeschlagenen Zahlung ist die genehmigte Order verbraucht –
  // die Buttons müssen neu aufgebaut werden, sonst hängt der Nutzer fest.
  function resetPaypalButtons() {
    paypalMountedNodeRef.current = null;
    if (paypalContainerRef.current) paypalContainerRef.current.innerHTML = "";
    setPaypalRetry((n) => n + 1);
  }

  // ── PayPal-Buttons im Premium-Modal ──
  useEffect(() => {
    if (!premiumOpen || isPremium) {
      if (paypalContainerRef.current) paypalContainerRef.current.innerHTML = "";
      paypalMountedNodeRef.current = null;
      return;
    }
    if (
      paypalMountedNodeRef.current &&
      paypalMountedNodeRef.current === paypalContainerRef.current
    ) {
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) {
      setError("PayPal ist noch nicht konfiguriert (NEXT_PUBLIC_PAYPAL_CLIENT_ID fehlt).");
      return;
    }

    function renderButtons() {
      const container = paypalContainerRef.current;
      if (!window.paypal || !container) return;
      if (paypalMountedNodeRef.current === container) return;
      paypalMountedNodeRef.current = container;
      container.innerHTML = "";
      window.paypal
        .Buttons({
          style: { layout: "vertical", color: "gold", label: "paypal" },
          createOrder: async () => {
            setError("");
            const res = await fetch(
              `/api/mediations/${mediationId}/logbuch/upgrade/paypal/create-order`,
              { method: "POST" },
            );
            const data = await res.json().catch(() => null);
            if (!res.ok) {
              throw new Error(data?.detail ?? "Order konnte nicht erstellt werden");
            }
            return data.order_id;
          },
          onApprove: async (data: { orderID: string }) => {
            setError("");
            try {
              const res = await fetch(
                `/api/mediations/${mediationId}/logbuch/upgrade/paypal/capture-order`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ order_id: data.orderID }),
                },
              );
              const body = await res.json().catch(() => null);
              if (!res.ok) {
                setError(
                  `Zahlung fehlgeschlagen: ${body?.detail ?? body?.error ?? "Unbekannter Fehler"}`,
                );
                resetPaypalButtons();
                return;
              }
              setPremiumOpen(false);
              await refreshStatus();
            } catch {
              setError("Server nicht erreichbar.");
              resetPaypalButtons();
            }
          },
          onError: () => {
            setError("PayPal hat einen Fehler gemeldet. Bitte versuchen Sie es erneut.");
            resetPaypalButtons();
          },
        })
        .render(container)
        .catch(() => {
          paypalMountedNodeRef.current = null;
          setError("Der PayPal-Button konnte nicht geladen werden. Bitte Seite neu laden.");
        });
    }

    const existing = document.getElementById("paypal-sdk") as HTMLScriptElement | null;
    if (window.paypal) {
      renderButtons();
    } else if (existing) {
      existing.addEventListener("load", renderButtons);
    } else {
      const script = document.createElement("script");
      script.id = "paypal-sdk";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR`;
      script.addEventListener("load", renderButtons);
      script.addEventListener("error", () =>
        setError("Das PayPal-SDK konnte nicht geladen werden (Netzwerk oder Adblocker?)."),
      );
      document.body.appendChild(script);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [premiumOpen, isPremium, mediationId, refreshStatus, paypalRetry]);

  const typeMeta = (key: string) => {
    const base = ENTRY_TYPES.find((t) => t.key === key) ?? ENTRY_TYPES[0];
    return isBusiness && BUSINESS_ENTRY_LABELS[base.key]
      ? { ...base, label: BUSINESS_ENTRY_LABELS[base.key] }
      : base;
  };

  const blockLabel = (blockId: string): string => {
    const b = entryInputs.find((x) => x.id === blockId);
    if (!b) return "";
    return cfgStr(b.config, "prompt") || cfgStr(b.config, "label");
  };

  const premiumPrice = formatEuro(status?.premium_price_eur ?? 14.95);

  const quotaLine = useMemo(() => {
    if (!status) return null;
    if (isPremium) {
      const a = status.analyses;
      return a.remaining === 0
        ? "Premium · Ihr heutiger KI-Tipp ist verbraucht – der nächste kommt morgen."
        : `Premium · Heute noch ${a.remaining} KI-Tipp verfügbar · Uploads unbegrenzt`;
    }
    const a = status.analyses;
    const u = status.uploads;
    const first =
      a.remaining === 0
        ? `KI-Interpretation diese Woche verbraucht${a.next_available_at ? ` (wieder ab ${formatDate(a.next_available_at)})` : ""}`
        : `Diese Woche noch ${a.remaining} kostenlose KI-Interpretation`;
    const second =
      u.remaining === 0 ? "Datei-Upload diese Woche verbraucht" : `noch ${u.remaining} Datei-Upload`;
    return `${first} · ${second}`;
  }, [status, isPremium]);

  const filteredEntries = useMemo(
    () =>
      viewFilter === "alle"
        ? entries
        : entries.filter((e) => (e.visibility ?? "personal") === viewFilter),
    [entries, viewFilter],
  );

  return (
    <main className="app-shell pt-[73px]">
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        {/* Kopf */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link href={caseHref ?? "/dashboard"} className="btn btn-ghost mb-4 -ml-3">
              ← {isLinked ? "Zum Fall" : "Dashboard"}
            </Link>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                  isPremium
                    ? "border-violet-300 bg-violet-50 text-violet-700"
                    : "border-accent-200 bg-accent-50 text-accent-700"
                }`}
              >
                {isLinked
                  ? isBusiness
                    ? "Falldokumentation zum Fall"
                    : "Logbuch & Journal zum Fall"
                  : isBusiness
                    ? isPremium
                      ? "Falldokumentation · Premium"
                      : "Falldokumentation · kostenlos"
                    : isPremium
                      ? "Konflikt-Logbuch · Premium"
                      : "Konflikt-Logbuch · kostenlos"}
              </span>
            </div>
            <h1 className="heading-1 mt-3 text-neutral-900">{initialTitle}</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
              {isBusiness ? (
                <>
                  Dokumentieren Sie den Vorgang lückenlos – Vorgänge,
                  Besprechungen, E-Mails, Nachrichten, Telefonate, Belege. Nach
                  jedem Eintrag schlägt die KI sachliche nächste Schritte vor.
                  Standardmäßig sieht Ihre Dokumentation niemand außer Ihnen.
                </>
              ) : (
                <>
                  Halten Sie fest, was passiert – Vorkommnisse, Gespräche,
                  E-Mails, WhatsApp, Telefonate, Gedanken, Fotos. Nach jedem
                  Eintrag schlägt Ihnen die KI gute nächste Schritte vor.
                  Standardmäßig sieht das niemand außer Ihnen – und sensible
                  Einträge (🔒) bleiben in jedem Fall privat, selbst in einer
                  späteren Mediation.
                </>
              )}
              {isLinked &&
                " Einzelne Einträge können Sie gezielt in die Mediation teilen."}
            </p>
          </div>
          {!isLinked && (
            <button
              type="button"
              onClick={() => setConfirmConvert(true)}
              className="btn btn-primary"
            >
              In Mediation umwandeln →
            </button>
          )}
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="mt-12 text-neutral-400">Ihr Logbuch wird geladen …</p>
        ) : (
          <>
            {/* ── Neuer Eintrag (Vorlage: logbuch_eintrag) ── */}
            <section className="mt-8">
              {!composerOpen ? (
                <button
                  type="button"
                  onClick={() => setComposerOpen(true)}
                  className="flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-accent-300 bg-accent-50/40 px-6 py-5 text-left transition hover:border-accent-400 hover:bg-accent-50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-500 text-lg font-bold text-white">
                    +
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-neutral-900">
                      Neuen Eintrag festhalten
                    </span>
                    <span className="mt-0.5 block text-xs text-neutral-500">
                      Was ist passiert? Vorkommnis, Gespräch, Nachricht, Gedanke …
                    </span>
                  </span>
                </button>
              ) : (
                <div className="rounded-2xl border-2 border-accent-200 bg-accent-50/40 p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="heading-3 text-neutral-900">
                        {editingId ? "Eintrag bearbeiten" : "Was ist passiert?"}
                      </h2>
                      <p className="mt-1 text-sm text-neutral-500">
                        Dokumentieren Sie zeitnah – so bleibt Ihre Chronologie
                        belastbar. Nach dem Speichern prüft die KI, was jetzt ein
                        guter nächster Schritt wäre.
                      </p>
                    </div>
                    {!editingId && entries.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setComposerOpen(false);
                          setEntryValues({});
                          setEntryType("vorkommnis");
                          setEntryVisibility("personal");
                        }}
                        className="shrink-0 text-sm font-semibold text-neutral-400 transition hover:text-neutral-600"
                      >
                        Schließen
                      </button>
                    )}
                  </div>

                  {quotaLine && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                          isPremium
                            ? "bg-violet-100 text-violet-700"
                            : "bg-white text-neutral-500 ring-1 ring-neutral-200"
                        }`}
                      >
                        ✨ {quotaLine}
                      </span>
                      {!isPremium && (
                        <button
                          type="button"
                          onClick={() => setPremiumOpen(true)}
                          className="rounded-full bg-violet-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-violet-700"
                        >
                          Premium: 1 Tipp pro Tag – einmalig {premiumPrice}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Eintragsart */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {ENTRY_TYPES.map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => setEntryType(t.key)}
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          entryType === t.key
                            ? "border-accent-500 bg-white font-semibold text-accent-700 ring-2 ring-accent-200"
                            : "border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400"
                        }`}
                      >
                        {t.icon} {typeMeta(t.key).label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 space-y-5">
                    {entryInputs.map((b) => (
                      <BlockField
                        key={b.id}
                        block={b}
                        value={entryValues[b.id]}
                        onChange={(v) => setEntryValues((s) => ({ ...s, [b.id]: v }))}
                        uploading={uploadingBlocks[b.id] === true}
                        onUploadFile={
                          b.type === "datei_upload" ? (f) => uploadFile(b, f) : undefined
                        }
                      />
                    ))}
                  </div>

                  {/* Sensibel-Schalter (ersetzt die Sichtbarkeits-Vorwahl).
                      Ohne Haken bleibt der Eintrag privat ("personal") und kann
                      später gezielt in die Mediation geteilt werden. Mit Haken
                      wird er "private" = niemals teilbar. Ein bereits geteilter
                      ("shared") Eintrag bleibt beim Bearbeiten geteilt.
                      Business: kein Journal → Schalter entfällt komplett. */}
                  {!isBusiness && (
                  <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200 bg-white/70 p-3.5">
                    <input
                      type="checkbox"
                      checked={entryVisibility === "private"}
                      onChange={(e) =>
                        setEntryVisibility(
                          e.target.checked
                            ? "private"
                            : entryVisibility === "private"
                              ? "personal"
                              : entryVisibility,
                        )
                      }
                      className="mt-0.5 h-4 w-4 shrink-0 accent-neutral-900"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-neutral-800">
                        🔒 Sensibel – nur für mich
                      </span>
                      <span className="mt-0.5 block text-xs leading-5 text-neutral-500">
                        Bleibt streng vertraulich: niemals sichtbar für Mediator
                        oder Gegenseite – auch nach einer Umwandlung in eine
                        Mediation nicht. Ohne Haken bleibt der Eintrag privat,
                        lässt sich aber später gezielt in die Mediation teilen.
                      </span>
                    </span>
                  </label>
                  )}

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={saveEntry}
                      disabled={entrySaving}
                      className="btn btn-primary disabled:opacity-50"
                    >
                      {entrySaving
                        ? "Wird gespeichert …"
                        : editingId
                          ? "Änderungen speichern"
                          : "Eintrag speichern"}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEntryValues({});
                          setEntryType("vorkommnis");
                          setEntryVisibility("personal");
                        }}
                        className="btn btn-ghost"
                      >
                        Abbrechen
                      </button>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* ── Streit im Überblick (sekundär, einklappbar) ── */}
            <section className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              <button
                type="button"
                onClick={() => setIntakeOpen((o) => !o)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-neutral-50"
              >
                <span className="flex items-center gap-2.5">
                  <Icon name="📓" size={18} />
                  <span className="text-sm font-semibold text-neutral-800">
                    Ihr Streit im Überblick
                  </span>
                  {intakeSaved && (
                    <span className="text-xs font-medium text-emerald-600">
                      ✓ hinterlegt
                    </span>
                  )}
                </span>
                <span className="text-xs text-neutral-400">
                  {intakeOpen ? "Zuklappen ▲" : "Aufklappen ▼"}
                </span>
              </button>
              {intakeOpen && (
                <div className="space-y-5 border-t border-neutral-100 px-5 pb-6 pt-5">
                  {intakeIntro && (
                    <p className="whitespace-pre-wrap text-sm leading-7 text-neutral-600">
                      {cfgStr(intakeIntro.config, "text")}
                    </p>
                  )}
                  {intakeInputs.map((b) => (
                    <BlockField
                      key={b.id}
                      block={b}
                      value={intakeValues[b.id]}
                      onChange={(v) => setIntakeValues((s) => ({ ...s, [b.id]: v }))}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={saveIntake}
                    disabled={intakeSaving}
                    className="btn btn-primary disabled:opacity-50"
                  >
                    {intakeSaving ? "Wird gespeichert …" : "Grunddaten speichern"}
                  </button>
                </div>
              )}
            </section>

            {/* ── Chronologie ── */}
            <section className="mt-10">
              <h2 className="heading-3 text-neutral-900">
                Chronologie
                {entries.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-neutral-400">
                    {entries.length} {entries.length === 1 ? "Eintrag" : "Einträge"}
                  </span>
                )}
              </h2>

              {entries.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    { key: "alle", label: "Alle", icon: "" },
                    ...VISIBILITIES.filter(
                      (v) =>
                        // Business: kein Journal-Filter; "geteilt" nur im
                        // verknüpften Modus sinnvoll.
                        (!isBusiness || v.key !== "private") &&
                        (isLinked || v.key !== "shared"),
                    ),
                  ].map(
                    (v) => (
                      <button
                        key={v.key}
                        type="button"
                        onClick={() => setViewFilter(v.key)}
                        className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                          viewFilter === v.key
                            ? "border-accent-500 bg-accent-50 text-accent-700"
                            : "border-neutral-300 bg-white text-neutral-500 hover:border-neutral-400"
                        }`}
                      >
                        {v.icon ? `${v.icon} ` : ""}{v.label}
                      </button>
                    ),
                  )}
                </div>
              )}

              {entries.length === 0 ? (
                <p className="mt-4 rounded-2xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
                  Noch keine Einträge. Halten Sie oben das erste Vorkommnis fest.
                </p>
              ) : filteredEntries.length === 0 ? (
                <p className="mt-4 rounded-2xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
                  Keine Einträge in dieser Ansicht.
                </p>
              ) : (
                /* Ansichts-Filter wechselt per Crossfade (wie die ThemenTabs
                   auf der Landing) statt hart umzuspringen. */
                <CrossfadePanel activeKey={viewFilter}>
                <ol className="mt-5 space-y-4">
                  {filteredEntries.map((entry) => {
                    const meta = typeMeta(entry.entry_type);
                    const vis = visMeta(entry.visibility);
                    const own = entry.is_own !== false;
                    const fields = Object.entries(entry.content ?? {}).filter(
                      ([, v]) => v !== undefined && v !== null && v !== "",
                    );
                    return (
                      /* Kein Reveal je Eintrag: zwischen <ol> und <li> darf
                         kein <div> stehen. Die Liste als Ganzes crossfadet
                         beim Filterwechsel, das reicht. */
                      <li
                        key={entry.id}
                        className={cn(
                          "rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 hover:border-accent-200",
                          cardLift,
                        )}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <span><Icon name={meta.icon} size={19} /></span>
                            <span className="text-sm font-bold text-neutral-900">{meta.label}</span>
                            <span className="text-sm text-neutral-400">·</span>
                            <span className="text-sm text-neutral-500">
                              {formatDate(entry.occurred_at ?? entry.created_at)}
                            </span>
                            <span
                              title={vis.hint}
                              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                (entry.visibility ?? "personal") === "private"
                                  ? "bg-neutral-900 text-white"
                                  : (entry.visibility ?? "personal") === "shared"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-neutral-100 text-neutral-500"
                              }`}
                            >
                              {vis.icon} {vis.label}
                            </span>
                          </div>
                          {own && (
                            <div className="flex gap-2 text-xs">
                              {isLinked && (entry.visibility ?? "personal") === "personal" && (
                                <button
                                  type="button"
                                  onClick={() => changeVisibility(entry, "shared")}
                                  className="font-semibold text-emerald-600 transition hover:text-emerald-700"
                                >
                                  🤝 In Mediation teilen
                                </button>
                              )}
                              {isLinked && (entry.visibility ?? "personal") === "shared" && (
                                <button
                                  type="button"
                                  onClick={() => changeVisibility(entry, "personal")}
                                  className="font-semibold text-neutral-400 transition hover:text-neutral-600"
                                >
                                  Nicht mehr teilen
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => startEdit(entry)}
                                className="font-semibold text-neutral-400 transition hover:text-accent-600"
                              >
                                Bearbeiten
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteEntry(entry.id)}
                                className="font-semibold text-neutral-400 transition hover:text-red-500"
                              >
                                Löschen
                              </button>
                            </div>
                          )}
                        </div>
                        <dl className="mt-3 space-y-2.5">
                          {fields.map(([blockId, v]) => {
                            const label = blockLabel(blockId);
                            if (dateBlockId && blockId === dateBlockId) return null;
                            const file = asFileValue(v);
                            return (
                              <div key={blockId}>
                                {label && (
                                  <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                                    {label}
                                  </dt>
                                )}
                                <dd className="mt-0.5 whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                                  {file ? (
                                    <span className="block">
                                      {isImageFile(file) && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                          src={file.url}
                                          alt={file.name || "Foto"}
                                          className="mb-1.5 max-h-56 rounded-xl border border-neutral-200 object-cover"
                                        />
                                      )}
                                      <a
                                        href={file.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="break-all font-semibold text-accent-700 underline"
                                      >
                                        📎 {file.name || "Datei"}
                                      </a>
                                    </span>
                                  ) : Array.isArray(v) ? (
                                    (v as string[]).join(", ")
                                  ) : (
                                    String(v)
                                  )}
                                </dd>
                              </div>
                            );
                          })}
                        </dl>

                        {/* KI-Analyse */}
                        {entry.ai_analysis ? (
                          <AnalysisCard analysis={entry.ai_analysis} showTip={!isBusiness} />
                        ) : analyzingId === entry.id ? (
                          <div className="mt-4 rounded-2xl border border-violet-200 bg-violet-50/60 p-4 text-sm text-violet-700">
                            ✨ Die KI prüft, was jetzt ein guter nächster Schritt wäre …
                          </div>
                        ) : (
                          <div className="mt-4">
                            {aiNotice?.entryId === entry.id && (
                              <div className="mb-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                {aiNotice.text}
                                {aiNotice.upsell && (
                                  <button
                                    type="button"
                                    onClick={() => setPremiumOpen(true)}
                                    className="ml-2 font-bold text-violet-700 underline"
                                  >
                                    Mit Premium täglich einen Tipp erhalten →
                                  </button>
                                )}
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => analyzeEntry(entry.id, isPremium)}
                              disabled={analyzingId !== null}
                              className="text-sm font-semibold text-violet-600 transition hover:text-violet-700 disabled:opacity-50"
                            >
                              ✨ KI-Einschätzung zu diesem Eintrag anfordern
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ol>
                </CrossfadePanel>
              )}
            </section>

            {/* ── Premium-Upsell (nur free) ── */}
            {!isPremium && (
              <Reveal className="mt-10 rounded-2xl border border-violet-200 bg-violet-50/50 p-6 sm:p-8">
                <h2 className="font-display text-xl font-medium text-neutral-900">
                  Mehr Unterstützung mit Logbuch-Premium
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-600">
                  Einmalig {premiumPrice} für dieses Logbuch – kein Abo: ein
                  KI-Tipp mit konkreten nächsten Schritten pro Tag statt pro
                  Woche und unbegrenzte Foto- und Datei-Uploads für Ihre
                  Beweis-Dokumentation.
                </p>
                <button
                  type="button"
                  onClick={() => setPremiumOpen(true)}
                  className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700"
                >
                  Premium freischalten – einmalig {premiumPrice}
                </button>
              </Reveal>
            )}

            {/* ── Upsell Mediation (nur eigenständiges Logbuch) ── */}
            {!isLinked && (
            <Reveal className="mt-8 rounded-2xl bg-neutral-900 p-6 text-white sm:p-8">
              <h2 className="font-display text-xl font-medium">
                Bereit, den Konflikt wirklich zu lösen?
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-300">
                Wandeln Sie Ihr Logbuch in eine Mediation um: Ihre Dokumentation
                bleibt erhalten und gibt dem Verfahren einen sauberen Startpunkt.
                Erst danach fallen die üblichen Kosten an – Ihr Logbuch bleibt
                kostenlos.
              </p>
              <button
                type="button"
                onClick={() => setConfirmConvert(true)}
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-neutral-900 transition hover:bg-accent-50"
              >
                In Mediation umwandeln →
              </button>
            </Reveal>
            )}
          </>
        )}
      </div>

      {/* Premium-Modal */}
      {premiumOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">
            <h2 className="font-display text-xl font-medium text-neutral-900">
              Logbuch-Premium freischalten
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Einmalig {premiumPrice} für dieses Logbuch – kein Abo.
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-neutral-700">
              <li className="flex gap-2">
                <span className="text-violet-600">✓</span>
                Jeden Tag eine KI-Einschätzung mit konkreten nächsten Schritten
                (statt einmal pro Woche)
              </li>
              <li className="flex gap-2">
                <span className="text-violet-600">✓</span>
                Unbegrenzte Foto- und Datei-Uploads für Ihre Beweis-Dokumentation
              </li>
              <li className="flex gap-2">
                <span className="text-violet-600">✓</span>
                Gilt dauerhaft für dieses Logbuch – Ihre Dokumentation bleibt
                auch bei einer späteren Umwandlung in eine Mediation erhalten
              </li>
            </ul>
            <div ref={paypalContainerRef} className="mt-6 min-h-[45px]" />
            <button
              type="button"
              onClick={() => setPremiumOpen(false)}
              className="btn btn-ghost mt-4 w-full"
            >
              Vielleicht später
            </button>
          </div>
        </div>
      )}

      {/* Bestätigung Umwandlung */}
      {confirmConvert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <h2 className="font-display text-xl font-medium text-neutral-900">
              Logbuch in Mediation umwandeln?
            </h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Ihr Fall durchläuft danach den normalen Start (Fallaufnahme,
              Paketwahl, Einladung der Gegenseite). Alle Logbuch-Einträge
              bleiben erhalten – und bleiben privat: Mediator oder Gegenseite
              sehen nur Einträge, die Sie später ausdrücklich in die Mediation
              teilen.
              {!isBusiness &&
                " Sensible Einträge (🔒) bleiben immer nur für Sie sichtbar."}{" "}
              Kosten entstehen erst mit der Freischaltung der Mediation.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={convert}
                disabled={converting}
                className="btn btn-primary disabled:opacity-50"
              >
                {converting ? "Wird umgewandelt …" : "Ja, umwandeln"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmConvert(false)}
                className="btn btn-ghost"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
