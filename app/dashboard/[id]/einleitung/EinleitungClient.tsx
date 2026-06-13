"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PHASES, getPhaseIndex } from "../_shared/phaseData";

// ── Typen ──────────────────────────────────────────────────────────────────────

type Props = {
  mediationId: string;
  currentUserName: string;
};

type Participant = {
  id: string;
  name: string;
  role: string;
  invitationStatus: "accepted" | "pending";
};

type StepStatus = {
  participants: { participant_id: string; submitted: boolean }[];
  all_submitted: boolean;
};

type StepMode = "input" | "waiting" | "reflection" | "done";
type SaveState = "idle" | "saving" | "saved" | "error";

// ── Schritt-Definitionen ───────────────────────────────────────────────────────

const CONTENT_STEPS = [
  {
    key: "einleitung",
    number: 1,
    title: "Regeln festlegen",
    description:
      "Jede Partei formuliert ihre Erwartungen an das Verfahren. Was ist dir wichtig? Welche Regeln sollen gelten?",
    placeholder: "z.B. Keine Unterbrechungen …",
  },
  {
    key: "einleitung_rollen",
    number: 2,
    title: "Rollen klären",
    description:
      "Welche Rolle übernimmt jede Person in dieser Mediation? Hier werden Zuständigkeiten und Erwartungen transparent gemacht.",
    placeholder: "z.B. Ich sehe meine Rolle als …",
  },
  {
    key: "einleitung_vertrauen",
    number: 3,
    title: "Vertrauen schaffen",
    description:
      "Was braucht ihr, um offen sprechen zu können? Notiert, was euch hilft, Vertrauen in den Prozess aufzubauen.",
    placeholder: "z.B. Vertraulichkeit über alles, was hier gesprochen wird …",
  },
  {
    key: "einleitung_ziel",
    number: 4,
    title: "Ziel der Mediation definieren",
    description:
      "Was soll am Ende dieser Mediation erreicht sein? Jede Partei formuliert ihr persönliches Ziel für den Prozess.",
    placeholder: "z.B. Eine faire Lösung für beide Seiten finden …",
  },
] as const;

type ContentStepKey = (typeof CONTENT_STEPS)[number]["key"];

// Alle Schritte inkl. Intro und Vertrag
type PhaseStep = "intro" | ContentStepKey | "contract";

const PHASE_STEPS: PhaseStep[] = [
  "intro",
  ...CONTENT_STEPS.map((s) => s.key as ContentStepKey),
  "contract",
];

const roleLabel: Record<string, string> = {
  initiator: "Antragsteller",
  other_party: "Andere Seite",
  mediator: "Mediator",
  owner: "Antragsteller",
};

// ── Hilfsfunktionen ────────────────────────────────────────────────────────────

function parseItems(raw: string): string[] {
  if (!raw || raw.trim() === "") return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed))
      return parsed.filter((s) => typeof s === "string" && s.trim() !== "");
  } catch {
    return raw.split("\n").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

// ── Sub-Komponenten ────────────────────────────────────────────────────────────

function StepBadge({ index, label, status }: { index: number; label: string; status: "done" | "active" | "locked" }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
          status === "done"
            ? "bg-emerald-500 text-white"
            : status === "active"
            ? "bg-emerald-600 text-white ring-4 ring-emerald-100"
            : "bg-slate-200 text-slate-400"
        }`}
      >
        {status === "done" ? (
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          index + 1
        )}
      </div>
      <span
        className={`max-w-[72px] text-center text-[10px] font-medium leading-tight ${
          status === "active" ? "text-emerald-700" : status === "done" ? "text-emerald-600" : "text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function WaitingBanner({ waitingFor }: { waitingFor: string[] }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-8 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
        <svg className="h-6 w-6 animate-pulse text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-amber-800">Deine Eingabe ist eingegangen.</p>
        <p className="mt-1 text-sm text-amber-700">
          Warte auf:{" "}
          <span className="font-medium">{waitingFor.join(", ")}</span>
        </p>
      </div>
    </div>
  );
}

function ItemList({
  items,
  inputValue,
  onInputChange,
  onAdd,
  onRemove,
  placeholder,
  editable,
}: {
  items: string[];
  inputValue?: string;
  onInputChange?: (v: string) => void;
  onAdd?: () => void;
  onRemove?: (idx: number) => void;
  placeholder?: string;
  editable: boolean;
}) {
  return (
    <div>
      {editable && (
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue ?? ""}
            onChange={(e) => onInputChange?.(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAdd?.();
              }
            }}
            placeholder={placeholder ?? "Punkt hinzufügen …"}
            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
          <button
            type="button"
            onClick={onAdd}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      )}
      {items.length > 0 && (
        <ul className={`space-y-1.5 ${editable ? "mt-3" : ""}`}>
          {items.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
              <span className="flex-1">{item}</span>
              {editable && onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="ml-1 rounded p-0.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {items.length === 0 && !editable && (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm italic text-slate-400">
          Wartet auf Eingabe …
        </p>
      )}
    </div>
  );
}

// ── Haupt-Komponente ───────────────────────────────────────────────────────────

export default function EinleitungClient({ mediationId, currentUserName }: Props) {
  const router = useRouter();
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeStep, setActiveStep] = useState<PhaseStep>("intro");
  const [stepModes, setStepModes] = useState<Record<PhaseStep, StepMode>>(
    () => Object.fromEntries(PHASE_STEPS.map((s) => [s, "input"])) as Record<PhaseStep, StepMode>
  );

  // items[stepKey][participantId] = string[]
  const [items, setItems] = useState<Record<ContentStepKey, Record<string, string[]>>>(
    () => Object.fromEntries(CONTENT_STEPS.map((s) => [s.key, {}])) as Record<ContentStepKey, Record<string, string[]>>
  );
  const [inputTexts, setInputTexts] = useState<Record<ContentStepKey, string>>(
    () => Object.fromEntries(CONTENT_STEPS.map((s) => [s.key, ""])) as Record<ContentStepKey, string>
  );

  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [advancing, setAdvancing] = useState(false);
  const [error, setError] = useState("");

  // Contract state
  const [contract, setContract] = useState<{ id: number; text: string; created_at: string } | null>(null);
  const [signatures, setSignatures] = useState<{ participant_id: string; name: string; signed_name: string }[]>([]);
  const [allSigned, setAllSigned] = useState(false);
  const [signedName, setSignedName] = useState("");
  const [contractGenerating, setContractGenerating] = useState(false);
  const [contractSigning, setContractSigning] = useState(false);

  const accepted = participants.filter((p) => p.invitationStatus === "accepted");
  const currentParticipant = participants.find((p) => p.name === currentUserName);
  const isMediatorOrAdmin = currentParticipant?.role === "mediator" || currentParticipant?.role === "admin";

  // ── Initialer Datenladevorgang ─────────────────────────────────────────────

  useEffect(() => {
    async function load() {
      try {
        const pRes = await fetch(`/api/mediations/${mediationId}/participants`);
        if (!pRes.ok) return;
        const pData: Participant[] = await pRes.json();
        setParticipants(pData);

        // Notizen aller Content-Schritte laden
        const notesResults = await Promise.all(
          CONTENT_STEPS.map((step) =>
            fetch(`/api/mediations/${mediationId}/notes?phase=${step.key}`)
              .then((r) => (r.ok ? r.json() : []))
              .then((notes: { participant_id: string; content: string; submitted: boolean }[]) => ({
                key: step.key as ContentStepKey,
                notes,
              }))
          )
        );

        const nextItems = Object.fromEntries(
          CONTENT_STEPS.map((s) => [s.key, Object.fromEntries(pData.map((p) => [p.id, [] as string[]]))])
        ) as unknown as Record<ContentStepKey, Record<string, string[]>>;

        for (const { key, notes } of notesResults) {
          for (const n of notes) {
            if (n.participant_id in nextItems[key]) {
              nextItems[key][n.participant_id] = parseItems(n.content);
            }
          }
        }
        setItems(nextItems);

        // Step-Stati laden, um aktiven Schritt zu bestimmen
        await refreshAllStepStates(pData);
      } catch {
        // ignore
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediationId]);

  const refreshAllStepStates = useCallback(
    async (pData?: Participant[]) => {
      const parties = pData ?? participants;
      if (parties.length === 0) return;

      const me = parties.find((p) => p.name === currentUserName);

      // Status für alle Schritte laden
      const allKeys: PhaseStep[] = ["intro", ...CONTENT_STEPS.map((s) => s.key as ContentStepKey)];
      const statuses = await Promise.all(
        allKeys.map((key) =>
          fetch(`/api/mediations/${mediationId}/step-status?phase=${key}&step=`)
            .then((r) => (r.ok ? r.json() : null))
            .then((data: StepStatus | null) => ({ key, data }))
        )
      );

      const newModes = { ...stepModes };
      let firstIncomplete: PhaseStep | null = null;

      for (const { key, data } of statuses) {
        if (!data) continue;
        const myStatus = me ? data.participants.find((p) => p.participant_id === me.id) : null;
        const mySubmitted = myStatus?.submitted ?? false;

        if (data.all_submitted) {
          newModes[key] = "done";
        } else if (mySubmitted) {
          newModes[key] = "waiting";
          if (!firstIncomplete) firstIncomplete = key;
        } else {
          newModes[key] = "input";
          if (!firstIncomplete) firstIncomplete = key;
        }
      }

      // Contract-Status
      const allContentDone = CONTENT_STEPS.every((s) => newModes[s.key] === "done");

      if (allContentDone) {
        // Vertrag laden
        const contractRes = await fetch(`/api/mediations/${mediationId}/contract`);
        if (contractRes.ok) {
          const cData = await contractRes.json();
          if (cData.contract) {
            setContract(cData.contract);
            setSignatures(cData.signatures ?? []);
            setAllSigned(cData.all_signed ?? false);
            if (cData.all_signed) {
              newModes["contract"] = "done";
            } else {
              newModes["contract"] = "input";
            }
          } else {
            newModes["contract"] = "input";
          }
        }
        if (!firstIncomplete) firstIncomplete = "contract";
      } else {
        newModes["contract"] = "locked" as StepMode;
      }

      setStepModes(newModes);
      if (firstIncomplete) {
        setActiveStep(firstIncomplete);
      } else if (allContentDone && newModes["contract"] !== "done") {
        setActiveStep("contract");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mediationId, currentUserName, participants]
  );

  // Polling when in "waiting" mode
  useEffect(() => {
    const isWaiting = stepModes[activeStep] === "waiting";
    if (isWaiting) {
      pollRef.current = setInterval(() => {
        refreshAllStepStates();
      }, 4000);
    } else {
      if (pollRef.current) clearInterval(pollRef.current);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [activeStep, stepModes, refreshAllStepStates]);

  // ── Item-Operationen ───────────────────────────────────────────────────────

  function addItem(stepKey: ContentStepKey) {
    if (!currentParticipant) return;
    const text = (inputTexts[stepKey] ?? "").trim();
    if (!text) return;
    setItems((prev) => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        [currentParticipant.id]: [...(prev[stepKey]?.[currentParticipant.id] ?? []), text],
      },
    }));
    setInputTexts((prev) => ({ ...prev, [stepKey]: "" }));
  }

  function removeItem(stepKey: ContentStepKey, index: number) {
    if (!currentParticipant) return;
    setItems((prev) => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        [currentParticipant.id]: (prev[stepKey]?.[currentParticipant.id] ?? []).filter((_, i) => i !== index),
      },
    }));
  }

  // ── Speichern & Abschicken ─────────────────────────────────────────────────

  async function submitNote(stepKey: ContentStepKey) {
    if (!currentParticipant) return;
    setSaveState("saving");
    setError("");
    try {
      const myItems = items[stepKey]?.[currentParticipant.id] ?? [];
      if (myItems.length === 0) {
        setError("Bitte mindestens einen Punkt hinzufügen.");
        setSaveState("error");
        return;
      }
      const res = await fetch(`/api/mediations/${mediationId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase: stepKey,
          step: "",
          participant_id: currentParticipant.id,
          content: JSON.stringify(myItems),
          submitted: true,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const raw = body?.detail ?? body?.error;
        const detail = Array.isArray(raw) ? raw.map((e: { msg?: string }) => e.msg).join(", ") : (raw ?? "Unbekannter Fehler");
        setError(`Fehler (${res.status}): ${detail}`);
        setSaveState("error");
        return;
      }
      setSaveState("saved");
      setStepModes((prev) => ({ ...prev, [stepKey]: "waiting" }));
      setTimeout(() => setSaveState("idle"), 2000);
      // Sofort einmal pollen
      setTimeout(() => refreshAllStepStates(), 500);
    } catch {
      setError("Server nicht erreichbar.");
      setSaveState("error");
    }
  }

  async function submitIntro() {
    if (!currentParticipant) return;
    setSaveState("saving");
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase: "intro",
          step: "",
          participant_id: currentParticipant.id,
          content: JSON.stringify(["confirmed"]),
          submitted: true,
        }),
      });
      if (!res.ok) {
        setSaveState("error");
        return;
      }
      setSaveState("saved");
      setStepModes((prev) => ({ ...prev, intro: "waiting" }));
      setTimeout(() => setSaveState("idle"), 2000);
      setTimeout(() => refreshAllStepStates(), 500);
    } catch {
      setSaveState("error");
    }
  }

  // ── Phase voranschreiten ───────────────────────────────────────────────────

  async function advanceToPhase2() {
    setAdvancing(true);
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase: "themensammlung" }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const raw = body?.detail ?? body?.error;
        setError(Array.isArray(raw) ? raw.map((e: { msg?: string }) => e.msg).join(", ") : (raw ?? "Fehler"));
        return;
      }
      router.push(`/dashboard/${mediationId}/themensammlung`);
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setAdvancing(false);
    }
  }

  // ── Vertrags-Operationen ───────────────────────────────────────────────────

  async function generateContract() {
    setContractGenerating(true);
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/contract/generate`, { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.detail ?? body?.error ?? "Vertragsgenerierung fehlgeschlagen");
        return;
      }
      const data = await res.json();
      setContract({ id: data.contract_id, text: data.text, created_at: new Date().toISOString() });
      setSignatures([]);
      setAllSigned(false);
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setContractGenerating(false);
    }
  }

  async function signContract() {
    if (!currentParticipant || !signedName.trim()) return;
    setContractSigning(true);
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/contract/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signed_name: signedName.trim() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.detail ?? body?.error ?? "Unterschrift konnte nicht gespeichert werden");
        return;
      }
      // Vertrag neu laden
      const cRes = await fetch(`/api/mediations/${mediationId}/contract`);
      if (cRes.ok) {
        const cData = await cRes.json();
        setContract(cData.contract);
        setSignatures(cData.signatures ?? []);
        setAllSigned(cData.all_signed ?? false);
      }
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setContractSigning(false);
    }
  }

  // ── Hilfswerte ─────────────────────────────────────────────────────────────

  const mySignature = currentParticipant
    ? signatures.find((s) => s.participant_id === currentParticipant.id)
    : undefined;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function getWaitingFor(_stepKey: PhaseStep): string[] {
    return accepted
      .filter((p) => p.name !== currentUserName)
      .map((p) => p.name);
  }

  function getPhaseStepLabel(step: PhaseStep): string {
    if (step === "intro") return "Einführung";
    if (step === "contract") return "Vertrag";
    const cs = CONTENT_STEPS.find((s) => s.key === step);
    return cs ? cs.title : step;
  }

  function getPhaseStepStatus(step: PhaseStep): "done" | "active" | "locked" {
    const mode = stepModes[step];
    if (mode === "done") return "done";
    if (step === activeStep) return "active";
    if (mode === ("locked" as StepMode)) return "locked";
    const idx = PHASE_STEPS.indexOf(step);
    const activeIdx = PHASE_STEPS.indexOf(activeStep);
    return idx < activeIdx ? "done" : "locked";
  }

  // ── Render: Intro-Schritt ──────────────────────────────────────────────────

  function renderIntroStep() {
    const mode = stepModes["intro"];
    const introSubmitted = mode === "waiting" || mode === "done";

    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-3 text-base font-bold text-blue-900">Willkommen zur Online-Mediation</h3>
          <div className="space-y-3 text-sm text-blue-800 leading-relaxed">
            <p>
              <strong>Online-Mediation ist anders als ein persönliches Gespräch.</strong> Ohne Körpersprache, ohne gemeinsamen Raum –
              es ist leichter, Missverständnisse zu erleben und schwerer, Nähe aufzubauen. Das ist normal und kein Zeichen des Scheiterns.
            </p>
            <p>
              <strong>Du kommst möglicherweise mit Anspannung oder emotionaler Belastung in dieses Gespräch.</strong> Das ist menschlich.
              Mediation gibt dir den Raum, gehört zu werden – ohne Urteil, ohne Druck.
            </p>
            <p>
              Bevor wir beginnen: Nimm dir einen Moment. Atme durch. Der Prozess funktioniert nur, wenn alle Beteiligten ihn freiwillig
              und in ihrem eigenen Tempo gehen.
            </p>
            <p>
              <strong>In dieser ersten Phase werdet ihr gemeinsam die Grundlagen legen:</strong> Regeln, Rollen, Vertrauen und ein gemeinsames Ziel.
              Am Ende unterzeichnen alle einen kurzen Mediationsvertrag – erst dann beginnt Phase 2.
            </p>
            <p>
              Die Eingaben der anderen Partei siehst du jeweils erst, nachdem du deine eigenen abgeschickt hast.
            </p>
          </div>
        </div>

        {mode === "waiting" && (
          <WaitingBanner waitingFor={getWaitingFor("intro")} />
        )}

        {mode === "done" && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4">
            <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-semibold text-emerald-800">Alle haben die Einführung bestätigt. Weiter zu Schritt 1.</p>
          </div>
        )}

        {!introSubmitted && (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm font-medium text-slate-700">
              Bestätige, dass du die Einführung gelesen hast und bereit bist, mit dem Prozess zu beginnen.
            </p>
            <button
              type="button"
              onClick={submitIntro}
              disabled={saveState === "saving"}
              className="btn btn-primary disabled:opacity-60"
            >
              {saveState === "saving" ? "Wird gespeichert…" : "Ich habe verstanden und bin bereit →"}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Render: Content-Schritt ────────────────────────────────────────────────

  function renderContentStep(stepDef: (typeof CONTENT_STEPS)[number]) {
    if (!currentParticipant) return null;
    const mode = stepModes[stepDef.key];
    const myItems = items[stepDef.key]?.[currentParticipant.id] ?? [];

    if (mode === "waiting") {
      return (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Deine Eingabe</p>
            <ItemList items={myItems} editable={false} />
          </div>
          <WaitingBanner waitingFor={getWaitingFor(stepDef.key)} />
        </div>
      );
    }

    if (mode === "done" || mode === "reflection") {
      const otherParticipants = accepted.filter((p) => p.id !== currentParticipant.id);
      return (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-emerald-800">{currentUserName}</p>
                <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-xs font-semibold text-emerald-700">Du</span>
              </div>
              <ItemList items={myItems} editable={false} />
            </div>
            {otherParticipants.map((p) => (
              <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                    {roleLabel[p.role] ?? p.role}
                  </span>
                </div>
                <ItemList items={items[stepDef.key]?.[p.id] ?? []} editable={false} />
              </div>
            ))}
          </div>
          {mode === "done" && (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3">
              <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-emerald-800">Alle Eingaben für diesen Schritt liegen vor.</p>
            </div>
          )}
        </div>
      );
    }

    // input mode
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-300 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">{currentUserName}</p>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Du</span>
            </div>
            <ItemList
              items={myItems}
              inputValue={inputTexts[stepDef.key]}
              onInputChange={(v) => setInputTexts((prev) => ({ ...prev, [stepDef.key]: v }))}
              onAdd={() => addItem(stepDef.key)}
              onRemove={(idx) => removeItem(stepDef.key, idx)}
              placeholder={stepDef.placeholder}
              editable={true}
            />
          </div>
          {accepted
            .filter((p) => p.id !== currentParticipant.id)
            .map((p) => (
              <div key={p.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700">{p.name}</p>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                    {roleLabel[p.role] ?? p.role}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-3">
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-xs text-slate-400">Sichtbar nach deiner Abgabe</p>
                </div>
              </div>
            ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => submitNote(stepDef.key)}
            disabled={saveState === "saving" || myItems.length === 0}
            className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saveState === "saving" ? "Wird abgeschickt…" : "Abschicken →"}
          </button>
          {myItems.length === 0 && (
            <p className="text-xs text-slate-400">Mindestens einen Punkt hinzufügen</p>
          )}
        </div>
      </div>
    );
  }

  // ── Render: Vertrags-Schritt ───────────────────────────────────────────────

  function renderContractStep() {
    const mode = stepModes["contract"];
    if (mode === ("locked" as StepMode)) {
      return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-8 text-center">
          <p className="text-sm text-slate-400">Verfügbar, sobald alle vorherigen Schritte abgeschlossen sind.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <p className="text-sm text-slate-600">
          Auf Basis eurer Eingaben wird ein Mediationsvertrag erstellt. Alle Beteiligten müssen ihn unterzeichnen, bevor Phase 2 beginnt.
        </p>

        {!contract && isMediatorOrAdmin && (
          <button
            type="button"
            onClick={generateContract}
            disabled={contractGenerating}
            className="btn btn-primary disabled:opacity-60"
          >
            {contractGenerating ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                KI generiert Vertrag…
              </span>
            ) : (
              "Mediationsvertrag generieren (KI)"
            )}
          </button>
        )}

        {!contract && !isMediatorOrAdmin && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 text-center">
            <p className="text-sm text-amber-700">Der Mediator generiert gleich den Vertrag …</p>
          </div>
        )}

        {contract && (
          <>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Mediationsvertrag</h3>
                {isMediatorOrAdmin && (
                  <button
                    type="button"
                    onClick={generateContract}
                    disabled={contractGenerating}
                    className="text-xs text-slate-400 hover:text-slate-700 disabled:opacity-50"
                  >
                    {contractGenerating ? "Generiert…" : "Neu generieren"}
                  </button>
                )}
              </div>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {contract.text}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Unterschriften</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {accepted.map((p) => {
                  const sig = signatures.find((s) => s.participant_id === p.id);
                  return (
                    <div
                      key={p.id}
                      className={`rounded-xl border p-4 ${sig ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}
                    >
                      <p className="mb-1 text-sm font-semibold text-slate-900">{p.name}</p>
                      <p className="mb-2 text-xs text-slate-500">{roleLabel[p.role] ?? p.role}</p>
                      {sig ? (
                        <div className="flex items-center gap-1.5">
                          <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-xs font-medium text-emerald-700">Unterzeichnet als „{sig.signed_name}"</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Ausstehend</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {!mySignature && currentParticipant && (
              <div className="rounded-2xl border border-slate-300 bg-white p-5">
                <p className="mb-3 text-sm font-semibold text-slate-900">Deine Unterschrift</p>
                <p className="mb-4 text-xs text-slate-500">
                  Tippe deinen vollständigen Namen und klicke „Unterzeichnen", um den Vertrag zu bestätigen.
                </p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={signedName}
                    onChange={(e) => setSignedName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && signedName.trim()) signContract();
                    }}
                    placeholder="Vollständiger Name …"
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                  <button
                    type="button"
                    onClick={signContract}
                    disabled={contractSigning || !signedName.trim()}
                    className="btn btn-primary shrink-0 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {contractSigning ? "Wird gespeichert…" : "Unterzeichnen"}
                  </button>
                </div>
              </div>
            )}

            {allSigned && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                <p className="mb-4 text-sm font-semibold text-emerald-800">
                  Alle Beteiligten haben den Vertrag unterzeichnet. Phase 1 ist abgeschlossen.
                </p>
                {isMediatorOrAdmin && (
                  <button
                    type="button"
                    onClick={advanceToPhase2}
                    disabled={advancing}
                    className="btn btn-primary disabled:opacity-60"
                  >
                    {advancing ? "Wird gestartet…" : "Phase 2 starten →"}
                  </button>
                )}
                {!isMediatorOrAdmin && (
                  <p className="text-xs text-slate-500">Der Mediator startet Phase 2.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // ── Haupt-Render ───────────────────────────────────────────────────────────

  const phaseIndex = getPhaseIndex("einleitung");

  return (
    <main className="app-shell pt-[73px]">
      <section className="container py-12">

        {/* Globaler Phasen-Stepper */}
        <div className="mb-8 overflow-x-auto">
          <ol className="flex min-w-max items-center">
            {PHASES.map((p, index) => {
              const isDone = index < phaseIndex;
              const isCurrent = index === phaseIndex;
              return (
                <li key={p.key} className="flex items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                        isDone
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                          ? "bg-emerald-600 text-white ring-4 ring-emerald-100"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isDone ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`max-w-[80px] text-center text-xs font-medium leading-tight ${
                        isCurrent ? "text-emerald-700" : isDone ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      {p.shortLabel}
                    </span>
                  </div>
                  {index < PHASES.length - 1 && (
                    <div
                      className={`mx-2 mb-5 h-0.5 w-12 transition-colors ${
                        index < phaseIndex ? "bg-emerald-400" : "bg-slate-200"
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="app-surface p-8">
          <p className="eyebrow mb-3">Phase 1 von {PHASES.length}</p>
          <h1 className="heading-2 text-slate-900">Auftrags- und Einleitungsphase</h1>
          <p className="mt-2 text-sm text-slate-500">
            Schritt {PHASE_STEPS.indexOf(activeStep) + 1} von {PHASE_STEPS.length}
          </p>

          {/* Phase-1-interner Stepper */}
          <div className="mt-6 overflow-x-auto">
            <ol className="flex min-w-max items-center gap-0">
              {PHASE_STEPS.map((step, idx) => (
                <li key={step} className="flex items-center">
                  <StepBadge
                    index={idx}
                    label={getPhaseStepLabel(step)}
                    status={getPhaseStepStatus(step)}
                  />
                  {idx < PHASE_STEPS.length - 1 && (
                    <div
                      className={`mx-2 mb-5 h-0.5 w-8 transition-colors ${
                        getPhaseStepStatus(step) === "done" ? "bg-emerald-400" : "bg-slate-200"
                      }`}
                    />
                  )}
                </li>
              ))}
            </ol>
          </div>

          {/* Aktiver Schritt-Inhalt */}
          <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
            {activeStep === "intro" && (
              <>
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-900">Einführung in die Mediation</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Bitte lies die folgenden Informationen sorgfältig durch, bevor wir beginnen.
                  </p>
                </div>
                {renderIntroStep()}
              </>
            )}

            {CONTENT_STEPS.map((cs) =>
              activeStep === cs.key ? (
                <div key={cs.key}>
                  <div className="mb-6">
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                        {cs.number}
                      </div>
                      <h2 className="text-lg font-bold text-slate-900">{cs.title}</h2>
                    </div>
                    <p className="ml-11 text-sm text-slate-500">{cs.description}</p>
                  </div>
                  {renderContentStep(cs)}
                </div>
              ) : null
            )}

            {activeStep === "contract" && (
              <>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Mediationsvertrag</h2>
                </div>
                {renderContractStep()}
              </>
            )}
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => router.push(`/dashboard/${mediationId}`)}
              className="btn btn-ghost"
            >
              ← Zurück
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
