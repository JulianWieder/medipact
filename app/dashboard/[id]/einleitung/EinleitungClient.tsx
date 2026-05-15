"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PHASES, getPhaseIndex } from "../_shared/phaseData";

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

type SaveState = "idle" | "saving" | "saved" | "error";

// ── Schritte der Einleitungsphase ──────────────────────────────────────────────
const EINLEITUNG_STEPS = [
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

type StepKey = (typeof EINLEITUNG_STEPS)[number]["key"];

// ── Leitfaden-Abschnitte ───────────────────────────────────────────────────────
const PHASE_INFO_SECTIONS = [
  {
    title: "Ziele der Phase",
    content: [
      "Vertrauen herstellen",
      "Neutralität sichern",
      "Erwartungen klären",
      "Gesprächsregeln definieren",
      "Freiwilligkeit bestätigen",
      "Konfliktparteien arbeitsfähig machen",
    ],
    type: "list" as const,
  },
  {
    title: "1. Begrüßung und Einführung",
    content:
      "Der Mediator erklärt Rolle, Ablauf und Prinzipien der Mediation: Freiwilligkeit, Vertraulichkeit, Eigenverantwortung, Neutralität und Allparteilichkeit. Der Mediator entscheidet nicht – er steuert den Prozess.",
    type: "text" as const,
  },
  {
    title: "2. Auftrag klären",
    content:
      "Warum sitzen die Parteien hier? Was soll erreicht werden? Welche Themen gehören in die Mediation? Wer entscheidet am Ende? Wichtig: Viele Konflikte wirken sachlich, sind aber eigentlich Beziehungskonflikte.",
    type: "text" as const,
    example: '„Geht es um eine konkrete Lösung oder auch um die zukünftige Zusammenarbeit?"',
  },
  {
    title: "3. Rahmenbedingungen festlegen",
    content: [
      "Zeitrahmen und Termine",
      "Ausreden lassen",
      "Keine Beleidigungen",
      "Ich-Botschaften verwenden",
      "Keine Drohungen",
      "Respektvoller Umgang mit Emotionen",
    ],
    type: "list" as const,
  },
  {
    title: "4. Rollen und Machtverhältnisse prüfen",
    content: [
      "Gibt es ein Machtgefälle?",
      "Spricht eine Partei dominanter?",
      "Gibt es emotionale Einschüchterung?",
      "Wer blockiert? Wer vermeidet?",
    ],
    type: "list" as const,
    note: "Sonst wird die Mediation nur eine Bühne für alte Dynamiken.",
  },
  {
    title: "5. Arbeitsbündnis schaffen",
    content:
      "Die Parteien müssen den Prozess, den Mediator und die Bereitschaft zur Mitarbeit akzeptieren. Ohne dieses Arbeitsbündnis bleibt alles oberflächlich.",
    type: "text" as const,
  },
  {
    title: "Psychologisch wichtigste Aufgabe",
    content:
      "Die emotionale Eskalation senken. In Konflikten sind Menschen oft defensiv, misstrauisch und positionsorientiert. Die Einleitungsphase soll Sicherheit erzeugen, Kontrollverlust reduzieren und Gesprächsfähigkeit herstellen.",
    type: "text" as const,
    highlight: true,
  },
];

const roleLabel: Record<string, string> = {
  initiator: "Antragsteller",
  other_party: "Andere Seite",
  mediator: "Mediator",
  owner: "Antragsteller",
};

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

// ── Teilnehmer-Karte ───────────────────────────────────────────────────────────
function ParticipantCard({
  participant,
  isMe,
  stepItems,
  inputValue,
  onInputChange,
  onAdd,
  onRemove,
}: {
  participant: Participant;
  isMe: boolean;
  stepItems: string[];
  inputValue: string;
  onInputChange: (v: string) => void;
  onAdd: () => void;
  onRemove: (idx: number) => void;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-shadow ${
        isMe ? "border-emerald-300 bg-white shadow-sm" : "border-slate-200 bg-slate-50"
      }`}
    >
      {/* Kopfzeile */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-900">{participant.name}</p>
          <p className="text-xs text-slate-500">
            {roleLabel[participant.role] ?? participant.role}
          </p>
        </div>
        {isMe && (
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            Du
          </span>
        )}
      </div>

      {isMe ? (
        <>
          {/* Eingabezeile */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAdd();
                }
              }}
              placeholder="Punkt hinzufügen …"
              className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
            <button
              type="button"
              onClick={onAdd}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-700"
              title="Hinzufügen"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Liste eigener Punkte */}
          {stepItems.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {stepItems.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  <span className="flex-1">{item}</span>
                  <button
                    type="button"
                    onClick={() => onRemove(idx)}
                    className="ml-1 rounded p-0.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    title="Entfernen"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : stepItems.length > 0 ? (
        <ul className="space-y-1.5">
          {stepItems.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm italic text-slate-400">
          Wartet auf Eingabe …
        </p>
      )}
    </div>
  );
}

// ── Haupt-Komponente ───────────────────────────────────────────────────────────
export default function EinleitungClient({ mediationId, currentUserName }: Props) {
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);

  // items[stepKey][participantId] = string[]
  const [items, setItems] = useState<Record<StepKey, Record<string, string[]>>>(() =>
    Object.fromEntries(EINLEITUNG_STEPS.map((s) => [s.key, {}])) as Record<StepKey, Record<string, string[]>>
  );
  // inputText[stepKey][participantId] = string
  const [inputText, setInputText] = useState<Record<StepKey, Record<string, string>>>(() =>
    Object.fromEntries(EINLEITUNG_STEPS.map((s) => [s.key, {}])) as Record<StepKey, Record<string, string>>
  );
  // saveStates[stepKey]
  const [saveStates, setSaveStates] = useState<Record<StepKey, SaveState>>(() =>
    Object.fromEntries(EINLEITUNG_STEPS.map((s) => [s.key, "idle"])) as Record<StepKey, SaveState>
  );

  const [advancing, setAdvancing] = useState(false);
  const [error, setError] = useState("");
  const [showGuide, setShowGuide] = useState(false);

  const currentIndex = getPhaseIndex("einleitung");
  const currentParticipant = participants.find((p) => p.name === currentUserName);

  // Alle Teilnehmer + Notizen für alle 4 Schritte laden
  useEffect(() => {
    async function load() {
      try {
        const participantsRes = await fetch(`/api/mediations/${mediationId}/participants`);
        if (!participantsRes.ok) return;
        const data: Participant[] = await participantsRes.json();
        setParticipants(data);

        const notesResults = await Promise.all(
          EINLEITUNG_STEPS.map((step) =>
            fetch(`/api/mediations/${mediationId}/notes?phase=${step.key}`)
              .then((r) => (r.ok ? r.json() : []))
              .then((notes: { participant_id: string; content: string }[]) => ({
                key: step.key as StepKey,
                notes,
              }))
          )
        );

        setItems(() => {
          const next = Object.fromEntries(
            EINLEITUNG_STEPS.map((s) => [
              s.key,
              Object.fromEntries(data.map((p) => [p.id, []])),
            ])
          ) as unknown as Record<StepKey, Record<string, string[]>>;

          for (const { key, notes } of notesResults) {
            for (const n of notes) {
              if (n.participant_id in next[key]) {
                next[key][n.participant_id] = parseItems(n.content);
              }
            }
          }
          return next;
        });

        setInputText(
          Object.fromEntries(
            EINLEITUNG_STEPS.map((s) => [
              s.key,
              Object.fromEntries(data.map((p) => [p.id, ""])),
            ])
          ) as Record<StepKey, Record<string, string>>
        );
      } catch {
        // ignore
      }
    }
    load();
  }, [mediationId]);

  function addItem(stepKey: StepKey, participantId: string) {
    const text = (inputText[stepKey]?.[participantId] ?? "").trim();
    if (!text) return;
    setItems((prev) => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        [participantId]: [...(prev[stepKey]?.[participantId] ?? []), text],
      },
    }));
    setInputText((prev) => ({
      ...prev,
      [stepKey]: { ...prev[stepKey], [participantId]: "" },
    }));
  }

  function removeItem(stepKey: StepKey, participantId: string, index: number) {
    setItems((prev) => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        [participantId]: (prev[stepKey]?.[participantId] ?? []).filter((_, i) => i !== index),
      },
    }));
  }

  async function saveStep(stepKey: StepKey) {
    if (!currentParticipant) return;
    setSaveStates((prev) => ({ ...prev, [stepKey]: "saving" }));
    setError("");

    try {
      const content = JSON.stringify(items[stepKey]?.[currentParticipant.id] ?? []);
      const res = await fetch(`/api/mediations/${mediationId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase: stepKey,
          participant_id: currentParticipant.id,
          content,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const raw = body?.detail ?? body?.error;
        const detail = Array.isArray(raw)
          ? raw.map((e: { msg?: string }) => e.msg ?? JSON.stringify(e)).join(", ")
          : (raw ?? "Unbekannter Fehler");
        setError(`Speichern fehlgeschlagen (${res.status}): ${detail}`);
        setSaveStates((prev) => ({ ...prev, [stepKey]: "error" }));
        return;
      }

      setSaveStates((prev) => ({ ...prev, [stepKey]: "saved" }));
      setTimeout(() => setSaveStates((prev) => ({ ...prev, [stepKey]: "idle" })), 2500);
    } catch {
      setError("Server nicht erreichbar.");
      setSaveStates((prev) => ({ ...prev, [stepKey]: "error" }));
    }
  }

  async function advance() {
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
        const detail = Array.isArray(raw)
          ? raw.map((e: { msg?: string }) => e.msg ?? JSON.stringify(e)).join(", ")
          : (raw ?? "Unbekannter Fehler");
        setError(`Fehler (${res.status}): ${detail}`);
        return;
      }
      router.push(`/dashboard/${mediationId}/themensammlung`);
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setAdvancing(false);
    }
  }

  const accepted = participants.filter((p) => p.invitationStatus === "accepted");

  return (
    <main className="app-shell pt-[73px]">
      <section className="container py-12">

        {/* Stepper */}
        <div className="mb-8 overflow-x-auto">
          <ol className="flex min-w-max items-center">
            {PHASES.map((p, index) => {
              const isDone = index < currentIndex;
              const isCurrent = index === currentIndex;
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
                        index < currentIndex ? "bg-emerald-400" : "bg-slate-200"
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

          {/* Mediator-Leitfaden */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowGuide((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
              <svg
                className={`h-4 w-4 transition-transform ${showGuide ? "rotate-90" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              {showGuide ? "Leitfaden ausblenden" : "Mediator-Leitfaden anzeigen"}
            </button>

            {showGuide && (
              <div className="mt-4 space-y-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                  Leitfaden · Phase 1
                </p>
                {PHASE_INFO_SECTIONS.map((section, i) => (
                  <div
                    key={i}
                    className={`rounded-xl border p-4 ${
                      section.highlight
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <h3 className="mb-2 text-sm font-bold text-slate-800">{section.title}</h3>
                    {section.type === "list" ? (
                      <ul className="space-y-1">
                        {(section.content as string[]).map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-600">{section.content as string}</p>
                    )}
                    {"example" in section && section.example && (
                      <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs italic text-slate-500">
                        {section.example}
                      </p>
                    )}
                    {"note" in section && section.note && (
                      <p className="mt-3 text-xs font-medium text-amber-700">⚠ {section.note}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Alle 4 Schritte ─────────────────────────────────────────────── */}
          <div className="mt-10 space-y-12">
            {EINLEITUNG_STEPS.map((step) => {
              const ss = saveStates[step.key];
              return (
                <div key={step.key}>
                  {/* Schritt-Kopf */}
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                      {step.number}
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">{step.title}</h2>
                  </div>
                  <p className="mb-6 ml-11 max-w-2xl text-sm text-slate-600">{step.description}</p>

                  {/* Teilnehmer-Karten */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {accepted.map((participant) => (
                      <ParticipantCard
                        key={participant.id}
                        participant={participant}
                        isMe={participant.name === currentUserName}
                        stepItems={items[step.key]?.[participant.id] ?? []}
                        inputValue={inputText[step.key]?.[participant.id] ?? ""}
                        onInputChange={(v) =>
                          setInputText((prev) => ({
                            ...prev,
                            [step.key]: { ...prev[step.key], [participant.id]: v },
                          }))
                        }
                        onAdd={() => addItem(step.key, participant.id)}
                        onRemove={(idx) => removeItem(step.key, participant.id, idx)}
                      />
                    ))}
                  </div>

                  {/* Speichern-Zeile */}
                  {currentParticipant && (
                    <div className="mt-4 ml-0 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => saveStep(step.key)}
                        disabled={ss === "saving"}
                        className="btn btn-secondary text-sm disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {ss === "saving"
                          ? "Wird gespeichert…"
                          : ss === "saved"
                          ? "Gespeichert ✓"
                          : "Speichern"}
                      </button>
                      {ss === "saved" && (
                        <span className="text-xs font-medium text-emerald-600">
                          Gespeichert.
                        </span>
                      )}
                      {ss === "error" && (
                        <span className="text-xs font-medium text-red-600">
                          Fehler beim Speichern.
                        </span>
                      )}
                    </div>
                  )}

                  {/* Trennlinie zwischen Schritten */}
                  <div className="mt-10 border-t border-slate-100" />
                </div>
              );
            })}
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => router.push(`/dashboard/${mediationId}`)}
              className="btn btn-ghost"
            >
              ← Zurück
            </button>
            <button
              type="button"
              onClick={advance}
              disabled={advancing}
              className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {advancing ? "Wird gespeichert..." : "Weiter →"}
            </button>
          </div>
        </div>

      </section>
    </main>
  );
}
in>
  );
}
