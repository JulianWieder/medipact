"use client";

import { hashId } from "@/lib/ids";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
// Die konkreten Inhalts-Schritte (Regeln, Rollen, Vertrauen, Ziel, ggf. weitere
// custom Schritte) kommen nicht mehr aus einer statischen Liste, sondern aus dem
// gemeinsamen Backend-Endpoint GET /mediations/{id}/phase-steps?phase=einleitung
// (phase_step_defaults pro Mediationstyp + pro Fall hinzugefügte custom Steps).
// Die fixen Rahmen-Schritte (Intro, Termin, Videocall, Feedback, Vertrag) bleiben
// hier fest verdrahtet, da sie eigene, nicht konfigurierbare UI-Blöcke haben.

type ContentStepKey = string;

type ContentStepDef = {
  key: ContentStepKey;
  number: number;
  title: string;
  description: string;
  placeholder: string;
};

type PhaseStepFromAPI = {
  key: string;
  title: string;
  description: string;
  placeholder: string;
  reflection_mode: "simple" | "interactive" | null;
  custom: boolean;
};

// Alle Schritte inkl. Intro, Terminvereinbarung, Video-Call, Feedback und Vertrag
type FeedbackOccasion = "after_videocall" | "before_contract";
type PhaseStep = "intro" | "terminvereinbarung" | "videocall" | "feedback_after_videocall" | ContentStepKey | "feedback_before_contract" | "contract";

const FIXED_PHASE_STEPS_PREFIX: PhaseStep[] = [
  "intro",
  "terminvereinbarung",
  "videocall",
  "feedback_after_videocall",
];
const FIXED_PHASE_STEPS_SUFFIX: PhaseStep[] = ["feedback_before_contract", "contract"];

// ── Feedback-Fragen ────────────────────────────────────────────────────────────

type QuestionType = "scale10" | "choice" | "emoji5" | "text";

type FeedbackQuestion = {
  id: string;
  label: string;
  type: QuestionType;
  options?: string[];
  required?: boolean;
};

const FEEDBACK_QUESTIONS: Record<FeedbackOccasion, FeedbackQuestion[]> = {
  // Phase 1 ist auch eine "Verkaufsphase": Wir wollen hier verstehen, wie nah
  // die Person am Absprung ist, wie eskaliert die Situation wirklich ist und
  // wie viel Vertrauen in den Prozess schon da ist – nicht nur, ob das Format
  // technisch verstanden wurde.
  after_videocall: [
    {
      id: "einigung_wahrscheinlichkeit",
      label: "Wie wahrscheinlich ist eine außergerichtliche Einigung? (0 = sehr unwahrscheinlich, 10 = sehr wahrscheinlich)",
      type: "scale10",
      required: true,
    },
    {
      id: "vertrauen_in_prozess",
      label: "Wie sehr vertrauen Sie aktuell darauf, dass Mediation hier wirklich helfen kann? (0 = gar nicht, 10 = voll und ganz)",
      type: "scale10",
      required: true,
    },
    {
      id: "konfliktintensitaet",
      label: "Wie eskaliert ist der Konflikt aus Ihrer Sicht aktuell? (0 = kaum gespannt, 10 = vollständig zerrüttet)",
      type: "scale10",
      required: true,
    },
    {
      id: "eigene_offenheit",
      label: "Wie offen sind Sie, auch Ihre eigenen Anteile am Konflikt zu reflektieren?",
      type: "choice",
      options: ["Sehr offen", "Eher offen", "Eher zurückhaltend", "Noch nicht bereit dazu"],
      required: true,
    },
    {
      id: "mediation_verstanden",
      label: "Haben Sie das Mediationsprinzip verstanden?",
      type: "choice",
      options: ["Ja, vollständig", "Teilweise", "Nein, noch nicht"],
      required: true,
    },
    {
      id: "online_verstanden",
      label: "Haben Sie das Online-Format (Video-Mediation) verstanden?",
      type: "choice",
      options: ["Ja", "Teilweise", "Nein"],
      required: true,
    },
    {
      id: "gefuehl",
      label: "Wie fühlen Sie sich nach dem Gespräch?",
      type: "emoji5",
      required: true,
    },
    {
      id: "groesste_sorge",
      label: "Was ist Ihre größte Sorge bei diesem Prozess? (optional)",
      type: "text",
      required: false,
    },
    {
      id: "hindernisse",
      label: "Was hindert Sie noch? (optional)",
      type: "text",
      required: false,
    },
  ],
  // Vor dem Vertragsabschluss geht es ums "Closing": Wie sicher ist die
  // Unterschrift, wie fair wird das Ergebnis wahrgenommen, und gibt es noch
  // unausgesprochene Zweifel, die den Abschluss gefährden könnten?
  before_contract: [
    {
      id: "einigung_wahrscheinlichkeit",
      label: "Wie wahrscheinlich ist eine außergerichtliche Einigung? (0 = sehr unwahrscheinlich, 10 = sehr wahrscheinlich)",
      type: "scale10",
      required: true,
    },
    {
      id: "abschlusssicherheit",
      label: "Wie sicher fühlen Sie sich, die Vereinbarung jetzt zu unterschreiben? (0 = sehr unsicher, 10 = sehr sicher)",
      type: "scale10",
      required: true,
    },
    {
      id: "fairness_eindruck",
      label: "Empfinden Sie die gegenseitigen Zugeständnisse als fair?",
      type: "choice",
      options: ["Ja, klar fair", "Eher ja", "Unsicher", "Eher nicht fair"],
      required: true,
    },
    {
      id: "bereit_phase2",
      label: "Fühlen Sie sich bereit für Phase 2?",
      type: "choice",
      options: ["Ja, ich bin bereit", "Unsicher", "Nein, ich brauche mehr Zeit"],
      required: true,
    },
    {
      id: "gehoert_gefuehl",
      label: "Haben Sie sich in diesem Prozess gehört gefühlt?",
      type: "emoji5",
      required: true,
    },
    {
      id: "weiterer_termin",
      label: "Brauchen Sie einen weiteren Termin vor dem Vertragsabschluss?",
      type: "choice",
      options: ["Ja, bitte", "Nein, es ist gut so"],
      required: true,
    },
    {
      id: "restzweifel",
      label: "Gibt es noch unausgesprochene Zweifel oder offene Themen? (optional)",
      type: "text",
      required: false,
    },
    {
      id: "hindernisse",
      label: "Was hindert Sie noch? (optional)",
      type: "text",
      required: false,
    },
  ],
};

const roleLabel: Record<string, string> = {
  initiator: "Antragsteller",
  other_party: "Andere Seite",
  mediator: "Mediator",
  owner: "Antragsteller",
};

// ── Emotionale Schritt-Inhalte ─────────────────────────────────────────────────

const STEP_CONTENT: Record<
  ContentStepKey | "intro" | "videocall",
  { videoTitle: string; videoDuration: string; emotional: string; sub?: string }
> = {
  intro: {
    videoTitle: "Was ist Online-Mediation – und warum funktioniert sie?",
    videoDuration: "ca. 3 Min.",
    emotional:
      "Du bist hier, weil etwas schiefgelaufen ist. Vielleicht fühlst du Frustration, Erschöpfung, vielleicht auch Hoffnung, dass sich endlich etwas ändert. All das ist vollkommen in Ordnung.",
    sub: "Mediation gibt dir den Raum, gehört zu werden – ohne Urteil, ohne Druck. Dieser Prozess funktioniert nur, wenn alle freiwillig und in ihrem eigenen Tempo mitgehen. Nimm dir einen Moment. Atme durch.",
  },
  videocall: {
    videoTitle: "Wie du dich auf das erste Gespräch vorbereitest",
    videoDuration: "ca. 2 Min.",
    emotional:
      "Zum ersten Mal seid ihr alle im selben Raum – digital, aber gemeinsam. Das erste Gespräch setzt den Ton für alles, was folgt.",
    sub: "Wenn du bereit bist, tritt dem Raum bei. Du kannst dein Mikrofon zunächst stummschalten und einfach ankommen. Es gibt keinen Druck, sofort zu reden.",
  },
  einleitung: {
    videoTitle: "Warum gemeinsame Regeln den Unterschied machen",
    videoDuration: "ca. 2 Min.",
    emotional:
      "In einem Konflikt verlieren wir oft das Gefühl von Kontrolle. Gemeinsame Regeln geben Sicherheit – sie schaffen den Rahmen, in dem echter Dialog erst möglich wird.",
    sub: "Was brauchst du, damit du dich sicher genug fühlst, ehrlich zu sein? Formuliere es konkret. Nicht für die andere Seite – für dich.",
  },
  einleitung_rollen: {
    videoTitle: "Rollen in Konflikten – wer bist du wirklich in dieser Situation?",
    videoDuration: "ca. 2 Min.",
    emotional:
      "Wir spielen in Konflikten oft Rollen, die wir nicht bewusst gewählt haben: Täter, Opfer, Retter. Hier hast du die Chance, innezuhalten und zu fragen: Wer möchte ich in diesem Prozess sein?",
    sub: "Es geht nicht darum, eine \"Rolle\" zu besetzen. Es geht darum, transparent zu machen, wie du dich siehst – und was du von anderen brauchst.",
  },
  einleitung_vertrauen: {
    videoTitle: "Vertrauen aufbauen – auch wenn es verletzt wurde",
    videoDuration: "ca. 2 Min.",
    emotional:
      "Vertrauen entsteht nicht auf Knopfdruck, besonders wenn es beschädigt wurde. Aber für diesen Prozess braucht ihr kein vollständiges Vertrauen – nur genug, um heute ehrlich sprechen zu können.",
    sub: "Was ist dein Minimum? Was brauchst du, damit du dich wenigstens ein Stück weit öffnen kannst?",
  },
  einleitung_ziel: {
    videoTitle: "Vom Problem zur Lösung – wie du dein Ziel findest",
    videoDuration: "ca. 2 Min.",
    emotional:
      "Wir wissen im Konflikt oft sehr genau, was wir nicht wollen. Aber was willst du wirklich? Stell dir vor, dieser Prozess ist gelungen – wie fühlt sich das an, und was ist dann anders?",
    sub: "Formuliere dein Ziel positiv. Nicht was aufhören soll, sondern was stattdessen sein soll. Das ist oft der schwierigere, aber wichtigere Teil.",
  },
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

// ── Jitsi-Komponente ──────────────────────────────────────────────────────────
// Hinweis: Räume auf meet.jit.si sind öffentlich aber durch UUID-basierte Namen
// effektiv privat. Für Produktion: selbst gehostete Jitsi-Instanz empfohlen.

declare global {
  interface Window {
    JitsiMeetExternalAPI: new (domain: string, options: Record<string, unknown>) => {
      dispose: () => void;
    };
  }
}

function JitsiCall({
  roomName,
  displayName,
}: {
  roomName: string;
  displayName: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{ dispose: () => void } | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    function initJitsi() {
      if (!containerRef.current || !window.JitsiMeetExternalAPI) return;
      apiRef.current = new window.JitsiMeetExternalAPI("meet.jit.si", {
        roomName,
        parentNode: containerRef.current,
        userInfo: { displayName },
        width: "100%",
        height: "100%",
        configOverwrite: {
          startWithAudioMuted: true,
          prejoinPageEnabled: false,
          disableDeepLinking: true,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          TOOLBAR_BUTTONS: [
            "microphone",
            "camera",
            "desktop",
            "fullscreen",
            "hangup",
            "chat",
            "raisehand",
            "tileview",
            "settings",
          ],
        },
      });
    }

    if (window.JitsiMeetExternalAPI) {
      initJitsi();
    } else {
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = initJitsi;
      document.body.appendChild(script);
      scriptRef.current = script;
    }

    return () => {
      apiRef.current?.dispose();
      apiRef.current = null;
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, [roomName, displayName]);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden rounded-2xl border border-neutral-200 shadow-sm h-[300px] sm:h-[520px]"
    />
  );
}

// ── Sub-Komponenten ────────────────────────────────────────────────────────────

function IntroVideo() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-neutral-200 shadow-sm"
      style={{ aspectRatio: "1920/1080" }}
    >
      <iframe
        src="https://share.synthesia.io/embeds/videos/ecc6e794-b1df-4c8e-85ca-f137b90c3f2f"
        loading="lazy"
        title="Synthesia video player - Frieden durch Mediation: Der Weg zur Einigung"
        allowFullScreen
        allow="encrypted-media; fullscreen; microphone; screen-wake-lock;"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          border: "none",
          padding: 0,
          margin: 0,
        }}
      />
    </div>
  );
}

function VideoPlaceholder({ title, duration }: { title: string; duration?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-neutral-900 aspect-video flex items-center justify-center group cursor-pointer select-none">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-900/50 via-neutral-900/60 to-neutral-900" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm border border-white/25 group-hover:bg-white/25 group-hover:scale-110 transition-all duration-200 shadow-lg">
          <svg className="h-7 w-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-snug max-w-xs">{title}</p>
          {duration && <p className="mt-1 text-white/50 text-xs">{duration}</p>}
        </div>
      </div>
      <div className="absolute top-3 right-3">
        <span className="rounded-full bg-accent-500/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white shadow">
          Video folgt bald
        </span>
      </div>
    </div>
  );
}

function StepBadge({
  index,
  label,
  status,
}: {
  index: number;
  label: string;
  status: "done" | "active" | "locked";
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
          status === "done"
            ? "bg-accent-500 text-white"
            : status === "active"
            ? "bg-accent-600 text-white ring-4 ring-accent-100"
            : "bg-neutral-200 text-neutral-400"
        }`}
      >
        {status === "done" ? (
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          index + 1
        )}
      </div>
      <span
        className={`max-w-[72px] text-center text-[10px] font-medium leading-tight ${
          status === "active"
            ? "text-accent-700"
            : status === "done"
            ? "text-accent-600"
            : "text-neutral-400"
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
        <svg
          className="h-6 w-6 animate-pulse text-amber-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-amber-800">Deine Eingabe ist eingegangen.</p>
        <p className="mt-1 text-sm text-amber-700">
          Warte auf: <span className="font-medium">{waitingFor.join(", ")}</span>
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
            className="flex-1 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-accent-500 focus:ring-4 focus:ring-accent-100"
          />
          <button
            type="button"
            onClick={onAdd}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-600 text-white transition hover:bg-accent-700"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
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
              className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" />
              <span className="flex-1">{item}</span>
              {editable && onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="ml-1 rounded p-0.5 text-neutral-400 transition hover:bg-red-50 hover:text-red-500"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {items.length === 0 && !editable && (
        <p className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm italic text-neutral-400">
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
  const [contentSteps, setContentSteps] = useState<ContentStepDef[]>([]);
  const phaseSteps = useMemo<PhaseStep[]>(
    () => [
      ...FIXED_PHASE_STEPS_PREFIX,
      ...contentSteps.map((s) => s.key as ContentStepKey),
      ...FIXED_PHASE_STEPS_SUFFIX,
    ],
    [contentSteps]
  );
  const [stepModes, setStepModes] = useState<Record<PhaseStep, StepMode>>(
    () =>
      Object.fromEntries(FIXED_PHASE_STEPS_PREFIX.map((s) => [s, "input"])) as Record<
        PhaseStep,
        StepMode
      >
  );

  const [items, setItems] = useState<Record<ContentStepKey, Record<string, string[]>>>({});
  const [inputTexts, setInputTexts] = useState<Record<ContentStepKey, string>>({});

  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [advancing, setAdvancing] = useState(false);
  const [error, setError] = useState("");

  // Appointment state
  type AppointmentSlot = {
    id: number;
    proposed_datetime: string;
    votes: { participant_id: string; name: string; accepted: boolean }[];
    all_accepted: boolean;
    all_voted: boolean;
    status?: "proposed" | "reserved" | "confirmed";
  };
  const [appointmentSlots, setAppointmentSlots] = useState<AppointmentSlot[]>([]);
  const [confirmedSlot, setConfirmedSlot] = useState<AppointmentSlot | null>(null);
  const [reservedSlot, setReservedSlot] = useState<AppointmentSlot | null>(null);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [appointmentVoting, setAppointmentVoting] = useState<number | null>(null);

  // Feedback state
  const [feedbackAnswers, setFeedbackAnswers] = useState<Record<string, string | number>>({});
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [submittedFeedbackOccasions, setSubmittedFeedbackOccasions] = useState<Set<FeedbackOccasion>>(new Set());

  // Contract state
  const [contract, setContract] = useState<{
    id: number;
    text: string;
    created_at: string;
  } | null>(null);
  const [signatures, setSignatures] = useState<
    { participant_id: string; name: string; signed_name: string }[]
  >([]);
  const [allSigned, setAllSigned] = useState(false);
  const [signedName, setSignedName] = useState("");
  const [contractSigning, setContractSigning] = useState(false);

  const accepted = participants.filter((p) => p.invitationStatus === "accepted");
  const currentParticipant = participants.find((p) => p.name === currentUserName);
  const isOtherParty = currentParticipant?.role === "other_party";
  const isMediatorOrAdmin =
    currentParticipant?.role === "mediator" ||
    currentParticipant?.role === "admin" ||
    currentParticipant?.role === "owner" ||
    currentParticipant?.role === "initiator";

  // ── Initialer Datenladevorgang ─────────────────────────────────────────────

  useEffect(() => {
    async function load() {
      try {
        const pRes = await fetch(`/api/mediations/${mediationId}/participants`);
        if (!pRes.ok) return;
        const pData: Participant[] = await pRes.json();
        setParticipants(pData);

        // Konfigurierbare Inhalts-Schritte vom Backend laden (Defaults pro
        // Mediationstyp + pro Fall hinzugefügte custom Steps, bereits um
        // geskippte Schritte bereinigt).
        const stepsRes = await fetch(
          `/api/mediations/${mediationId}/phase-steps?phase=einleitung`
        );
        const stepsFromAPI: PhaseStepFromAPI[] = stepsRes.ok
          ? (await stepsRes.json()).steps ?? []
          : [];
        const nextContentSteps: ContentStepDef[] = stepsFromAPI.map((s, idx) => ({
          key: s.key,
          number: idx + 1,
          title: s.title,
          description: s.description,
          placeholder: s.placeholder || "Deine Eingabe …",
        }));
        setContentSteps(nextContentSteps);

        const notesResults = await Promise.all(
          nextContentSteps.map((step) =>
            fetch(`/api/mediations/${mediationId}/notes?phase=${step.key}`)
              .then((r) => (r.ok ? r.json() : []))
              .then(
                (
                  notes: {
                    participant_id: string;
                    content: string;
                    submitted: boolean;
                  }[]
                ) => ({ key: step.key as ContentStepKey, notes })
              )
          )
        );

        const nextItems = Object.fromEntries(
          nextContentSteps.map((s) => [
            s.key,
            Object.fromEntries(pData.map((p) => [p.id, [] as string[]])),
          ])
        ) as unknown as Record<ContentStepKey, Record<string, string[]>>;

        for (const { key, notes } of notesResults) {
          for (const n of notes) {
            if (n.participant_id in nextItems[key]) {
              nextItems[key][n.participant_id] = parseItems(n.content);
            }
          }
        }
        setItems(nextItems);
        setInputTexts(
          Object.fromEntries(nextContentSteps.map((s) => [s.key, ""])) as Record<
            ContentStepKey,
            string
          >
        );
        await refreshAllStepStates(pData, nextContentSteps);
        await refreshAppointments();

        // Bereits abgegebene Feedbacks laden
        try {
          const fbRes = await fetch(`/api/mediations/${mediationId}/feedback/me`);
          if (fbRes.ok) {
            const fbData = await fbRes.json();
            setSubmittedFeedbackOccasions(new Set(fbData.submitted_occasions ?? []));
          }
        } catch { /* ignore */ }
      } catch {
        // ignore
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediationId]);

  const refreshAppointments = useCallback(async () => {
    try {
      const res = await fetch(`/api/mediations/${mediationId}/appointment/slots`);
      if (!res.ok) return;
      const data = await res.json();
      setAppointmentSlots(data.slots ?? []);
      setConfirmedSlot(data.confirmed ?? null);
      setReservedSlot(data.reserved ?? null);
    } catch { /* ignore */ }
  }, [mediationId]);

  const refreshAllStepStates = useCallback(
    async (pData?: Participant[], csOverride?: ContentStepDef[]) => {
      const parties = pData ?? participants;
      if (parties.length === 0) return;

      const cs = csOverride ?? contentSteps;
      const localPhaseSteps: PhaseStep[] = [
        ...FIXED_PHASE_STEPS_PREFIX,
        ...cs.map((s) => s.key as ContentStepKey),
        ...FIXED_PHASE_STEPS_SUFFIX,
      ];

      const me = parties.find((p) => p.name === currentUserName);

      // "intro" und "videocall" als einfache Bestätigungsschritte prüfen
      const simpleKeys: PhaseStep[] = ["intro", "videocall"];
      const contentKeys: PhaseStep[] = cs.map((s) => s.key as ContentStepKey);
      const allKeys: PhaseStep[] = [...simpleKeys, ...contentKeys];

      // terminvereinbarung: done wenn ein Slot von allen bestätigt ist
      const apptRes = await fetch(`/api/mediations/${mediationId}/appointment/slots`).then(r => r.ok ? r.json() : null);
      if (apptRes) {
        setAppointmentSlots(apptRes.slots ?? []);
        setConfirmedSlot(apptRes.confirmed ?? null);
        setReservedSlot(apptRes.reserved ?? null);
      }
      // Die Terminvereinbarung ist optional: der Mediator entscheidet, ob ein
      // gemeinsamer Termin überhaupt nötig ist. Solange der Mediator noch
      // keine Terminvorschläge erstellt hat, gilt der Schritt automatisch als
      // erledigt (übersprungen) und blockiert den Fortschritt nicht.
      const noSlotsProposed = (apptRes?.slots?.length ?? 0) === 0;
      const apptDone = !!(apptRes?.confirmed) || noSlotsProposed;

      const statuses = await Promise.all(
        allKeys.map((key) =>
          fetch(`/api/mediations/${mediationId}/step-status?phase=${key}&step=`)
            .then((r) => (r.ok ? r.json() : null))
            .then((data: StepStatus | null) => ({ key, data }))
        )
      );

      // Statusmap für schnellen Zugriff
      const statusMap = Object.fromEntries(statuses.map(({ key, data }) => [key, data]));

      const newModes = { ...stepModes };
      // terminvereinbarung
      newModes["terminvereinbarung"] = apptDone ? "done" : "input";

      // Schritte in der richtigen Reihenfolge auswerten,
      // damit "intro" immer vor "terminvereinbarung" geprüft wird
      let firstIncomplete: PhaseStep | null = null;

      for (const phaseStep of localPhaseSteps) {
        if (phaseStep === "terminvereinbarung") {
          if (!apptDone && !firstIncomplete) firstIncomplete = "terminvereinbarung";
          continue;
        }
        if (phaseStep === "contract") continue; // wird separat behandelt

        // Feedback-Schritte: done wenn Feedback abgegeben (oder übersprungen = in submittedFeedbackOccasions)
        if (phaseStep === "feedback_after_videocall" || phaseStep === "feedback_before_contract") {
          const occasion: FeedbackOccasion = phaseStep === "feedback_after_videocall" ? "after_videocall" : "before_contract";
          const fbDone = submittedFeedbackOccasions.has(occasion);
          newModes[phaseStep] = fbDone ? "done" : "input";
          if (!fbDone && !firstIncomplete) firstIncomplete = phaseStep;
          continue;
        }

        const data: StepStatus | null = statusMap[phaseStep] ?? null;
        if (!data) continue;
        const myStatus = me
          ? data.participants.find((p) => p.participant_id === me.id)
          : null;
        const mySubmitted = myStatus?.submitted ?? false;

        if (data.all_submitted) {
          newModes[phaseStep] = "done";
        } else if (mySubmitted) {
          newModes[phaseStep] = "waiting";
          if (!firstIncomplete) firstIncomplete = phaseStep;
        } else {
          newModes[phaseStep] = "input";
          if (!firstIncomplete) firstIncomplete = phaseStep;
        }
      }

      const allContentDone = cs.every((s) => newModes[s.key] === "done");

      if (allContentDone) {
        const contractRes = await fetch(`/api/mediations/${mediationId}/contract`);
        if (contractRes.ok) {
          const cData = await contractRes.json();
          if (cData.contract) {
            setContract(cData.contract);
            setSignatures(cData.signatures ?? []);
            setAllSigned(cData.all_signed ?? false);
            newModes["contract"] = cData.all_signed ? "done" : "input";
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
    [mediationId, currentUserName, participants, contentSteps]
  );

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
        [currentParticipant.id]: [
          ...(prev[stepKey]?.[currentParticipant.id] ?? []),
          text,
        ],
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
        [currentParticipant.id]: (
          prev[stepKey]?.[currentParticipant.id] ?? []
        ).filter((_, i) => i !== index),
      },
    }));
  }

  // ── Speichern & Abschicken ─────────────────────────────────────────────────

  async function submitSimpleStep(phase: "intro" | "videocall") {
    if (!currentParticipant) return;
    setSaveState("saving");
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase,
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
      setStepModes((prev) => ({ ...prev, [phase]: "waiting" }));
      setTimeout(() => setSaveState("idle"), 2000);
      setTimeout(() => refreshAllStepStates(), 500);
    } catch {
      setSaveState("error");
    }
  }

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
        const detail = Array.isArray(raw)
          ? raw.map((e: { msg?: string }) => e.msg).join(", ")
          : (raw ?? "Unbekannter Fehler");
        setError(`Fehler (${res.status}): ${detail}`);
        setSaveState("error");
        return;
      }
      setSaveState("saved");
      setStepModes((prev) => ({ ...prev, [stepKey]: "waiting" }));
      setTimeout(() => setSaveState("idle"), 2000);
      setTimeout(() => refreshAllStepStates(), 500);
    } catch {
      setError("Server nicht erreichbar.");
      setSaveState("error");
    }
  }

  // ── Test: aktuellen Schritt überspringen ────────────────────────────────────

  function skipCurrentStep() {
    const idx = phaseSteps.indexOf(activeStep);
    const next = phaseSteps[idx + 1];
    setStepModes((prev) => ({ ...prev, [activeStep]: "done" }));
    if (next) {
      setActiveStep(next);
    } else {
      advanceToPhase2();
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
        setError(
          Array.isArray(raw)
            ? raw.map((e: { msg?: string }) => e.msg).join(", ")
            : (raw ?? "Fehler")
        );
        return;
      }
      router.push(`/dashboard/${hashId(mediationId)}/themensammlung`);
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setAdvancing(false);
    }
  }

  // ── Vertrags-Operationen ───────────────────────────────────────────────────

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
        setError(
          body?.detail ?? body?.error ?? "Unterschrift konnte nicht gespeichert werden"
        );
        return;
      }
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

  function getWaitingFor(_stepKey: PhaseStep): string[] {
    return accepted
      .filter((p) => p.name !== currentUserName)
      .map((p) => p.name);
  }

  function getPhaseStepLabel(step: PhaseStep): string {
    if (step === "intro") return "Einführung";
    if (step === "terminvereinbarung") return "Termin";
    if (step === "videocall") return "Gespräch";
    if (step === "feedback_after_videocall") return "Feedback";
    if (step === "feedback_before_contract") return "Feedback";
    if (step === "contract") return "Vertrag";
    const cs = contentSteps.find((s) => s.key === step);
    return cs ? cs.title : step;
  }

  function getPhaseStepStatus(step: PhaseStep): "done" | "active" | "locked" {
    const mode = stepModes[step];
    if (mode === "done") return "done";
    if (step === activeStep) return "active";
    if (mode === ("locked" as StepMode)) return "locked";
    const idx = phaseSteps.indexOf(step);
    const activeIdx = phaseSteps.indexOf(activeStep);
    return idx < activeIdx ? "done" : "locked";
  }

  // ── Render: Emotionaler Schritt-Header ────────────────────────────────────

  // ── Hilfsfunktion: Schritt-Inhalt mit Fallback für custom/konfigurierte Schritte ──

  function getStepContent(
    stepKey: ContentStepKey | "intro" | "videocall"
  ): { videoTitle: string; videoDuration: string; emotional: string; sub?: string } {
    const known = (STEP_CONTENT as Record<string, (typeof STEP_CONTENT)[keyof typeof STEP_CONTENT]>)[
      stepKey
    ];
    if (known) return known;
    const cs = contentSteps.find((s) => s.key === stepKey);
    return {
      videoTitle: cs?.title ?? "Dieser Schritt",
      videoDuration: "",
      emotional: cs?.description ?? "Nimm dir einen Moment Zeit, bevor du fortfährst.",
    };
  }

  function renderStepHeader(stepKey: ContentStepKey | "intro" | "videocall") {
    const content = getStepContent(stepKey);
    return (
      <div className="space-y-5 mb-8">
        {stepKey === "intro" ? (
          <IntroVideo />
        ) : (
          <VideoPlaceholder title={content.videoTitle} duration={content.videoDuration} />
        )}
        <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-5">
          <p className="text-base font-medium text-neutral-800 leading-relaxed">
            {content.emotional}
          </p>
          {content.sub && (
            <p className="mt-3 text-sm text-neutral-500 leading-relaxed">{content.sub}</p>
          )}
        </div>
      </div>
    );
  }

  // ── Render: Intro-Schritt ──────────────────────────────────────────────────

  function renderIntroStep() {
    const mode = stepModes["intro"];
    const introSubmitted = mode === "waiting" || mode === "done";

    return (
      <div className="space-y-6">
        {renderStepHeader("intro")}

        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-500 mb-3">
            In dieser Phase
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { icon: "🎥", label: "Erstes Gespräch per Video" },
              { icon: "📋", label: "Regeln festlegen" },
              { icon: "🪞", label: "Rollen klären" },
              { icon: "🤝", label: "Vertrauen schaffen" },
              { icon: "🎯", label: "Ziel definieren" },
              { icon: "📄", label: "Mediationsvertrag" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm text-blue-800">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-blue-600">
            Ihr beginnt mit einem kurzen Video-Call. Danach arbeitet ihr die schriftlichen
            Schritte durch und unterzeichnet gemeinsam einen Mediationsvertrag.
          </p>
        </div>

        {mode === "waiting" && <WaitingBanner waitingFor={getWaitingFor("intro")} />}

        {mode === "done" && (
          <div className="flex items-center gap-3 rounded-2xl border border-accent-200 bg-accent-50 px-6 py-4">
            <svg
              className="h-5 w-5 text-accent-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-semibold text-accent-800">
              Alle haben die Einführung bestätigt. Weiter zum Erstgespräch.
            </p>
          </div>
        )}

        {!introSubmitted && (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-neutral-600">
              Bestätige, dass du bereit bist, diesen Prozess zu beginnen.
            </p>
            <button
              type="button"
              onClick={() => submitSimpleStep("intro")}
              disabled={saveState === "saving"}
              className="btn btn-primary disabled:opacity-60"
            >
              {saveState === "saving" ? "Wird gespeichert…" : "Ich bin bereit →"}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Render: Video-Call-Schritt ─────────────────────────────────────────────

  function renderVideoCallStep() {
    const mode = stepModes["videocall"];
    const submitted = mode === "waiting" || mode === "done";

    // Einzigartiger Raumname auf Basis der Mediation-ID
    const jitsiRoom = `medipact-${mediationId}`;

    return (
      <div className="space-y-6">
        {renderStepHeader("videocall")}

        {/* Jitsi eingebettet */}
        <JitsiCall roomName={jitsiRoom} displayName={currentUserName} />

        {/* Hinweisbox */}
        <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
          <svg
            className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-xs text-neutral-500">
            Raum-ID:{" "}
            <code className="rounded bg-neutral-200 px-1.5 py-0.5 font-mono text-neutral-700">
              {jitsiRoom}
            </code>{" "}
            · Der Raum ist für alle Beteiligten zugänglich. Kein separater Login notwendig.
          </p>
        </div>

        {/* Abschluss-Bestätigung */}
        {!submitted && (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-neutral-600">
              Wenn das Gespräch abgeschlossen ist, bestätige es hier. Du kannst den
              Video-Raum danach jederzeit wieder öffnen.
            </p>
            <button
              type="button"
              onClick={() => submitSimpleStep("videocall")}
              disabled={saveState === "saving"}
              className="btn btn-primary disabled:opacity-60"
            >
              {saveState === "saving" ? "Wird gespeichert…" : "Gespräch abgeschlossen ✓"}
            </button>
          </div>
        )}

        {mode === "waiting" && <WaitingBanner waitingFor={getWaitingFor("videocall")} />}

        {mode === "done" && (
          <div className="flex items-center gap-3 rounded-2xl border border-accent-200 bg-accent-50 px-6 py-4">
            <svg
              className="h-5 w-5 text-accent-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-semibold text-accent-800">
              Erstes Gespräch abgeschlossen. Weiter zu Schritt 1.
            </p>
          </div>
        )}
      </div>
    );
  }

  // ── Render: Content-Schritt ────────────────────────────────────────────────

  function renderContentStep(stepDef: (typeof contentSteps)[number]) {
    if (!currentParticipant) return null;
    const mode = stepModes[stepDef.key];
    const myItems = items[stepDef.key]?.[currentParticipant.id] ?? [];

    if (mode === "waiting") {
      return (
        <div className="space-y-4">
          {renderStepHeader(stepDef.key)}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Deine Eingabe
            </p>
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
            <div className="rounded-2xl border border-accent-200 bg-accent-50 p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-accent-800">{currentUserName}</p>
                <span className="rounded-full bg-accent-200 px-2 py-0.5 text-xs font-semibold text-accent-700">
                  Du
                </span>
              </div>
              <ItemList items={myItems} editable={false} />
            </div>
            {otherParticipants.map((p) => (
              <div key={p.id} className="rounded-2xl border border-neutral-200 bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-neutral-900">{p.name}</p>
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
                    {roleLabel[p.role] ?? p.role}
                  </span>
                </div>
                <ItemList items={items[stepDef.key]?.[p.id] ?? []} editable={false} />
              </div>
            ))}
          </div>
          {mode === "done" && (
            <div className="flex items-center gap-3 rounded-xl border border-accent-200 bg-accent-50 px-5 py-3">
              <svg
                className="h-4 w-4 text-accent-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-accent-800">
                Alle Eingaben für diesen Schritt liegen vor.
              </p>
            </div>
          )}
        </div>
      );
    }

    // input mode
    return (
      <div className="space-y-6">
        {renderStepHeader(stepDef.key)}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-accent-300 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-neutral-900">{currentUserName}</p>
              <span className="rounded-full bg-accent-100 px-2.5 py-1 text-xs font-semibold text-accent-700">
                Du
              </span>
            </div>
            <ItemList
              items={myItems}
              inputValue={inputTexts[stepDef.key]}
              onInputChange={(v) =>
                setInputTexts((prev) => ({ ...prev, [stepDef.key]: v }))
              }
              onAdd={() => addItem(stepDef.key)}
              onRemove={(idx) => removeItem(stepDef.key, idx)}
              placeholder={stepDef.placeholder}
              editable={true}
            />
          </div>
          {accepted
            .filter((p) => p.id !== currentParticipant.id)
            .map((p) => (
              <div key={p.id} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-neutral-700">{p.name}</p>
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
                    {roleLabel[p.role] ?? p.role}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-100 px-4 py-3">
                  <svg
                    className="h-4 w-4 text-neutral-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <p className="text-xs text-neutral-400">Sichtbar nach deiner Abgabe</p>
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
            <p className="text-xs text-neutral-400">Mindestens einen Punkt hinzufügen</p>
          )}
        </div>
      </div>
    );
  }


  // ── Render: Phase-1-Abschluss ──────────────────────────────────────────────
  // Hinweis: Die Bezahlung erfolgt bereits vor Phase 1 (siehe MediationClient.tsx).
  // Hier ist keine Paywall mehr nötig – Phase 1 abschließen führt direkt weiter.

  function renderPhaseOneComplete() {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-accent-100 mb-5">
            <svg
              className="h-10 w-10 text-accent-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">Phase 1 ist abgeschlossen.</h2>
          <p className="mt-3 text-neutral-500 max-w-sm mx-auto leading-relaxed text-sm">
            Ihr habt gemeinsam ein Erstgespräch geführt, Regeln festgelegt, Rollen geklärt
            und einen Mediationsvertrag unterzeichnet. Das ist bereits ein bedeutender Schritt.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
            Was euch in Phase 2 erwartet
          </p>
          <div className="space-y-4">
            {[
              {
                emoji: "🎯",
                title: "Themensammlung",
                desc: "Alle Konfliktthemen kommen auf den Tisch – strukturiert, ohne Wertung, ohne Druck.",
              },
              {
                emoji: "💬",
                title: "Interessen erkunden",
                desc: "Was steckt wirklich hinter euren Positionen? Ihr lernt euch und den Konflikt neu verstehen.",
              },
              {
                emoji: "💡",
                title: "Optionen entwickeln",
                desc: "Gemeinsam entstehen Lösungsideen, auf die ihr allein nie gekommen wärt.",
              },
              {
                emoji: "✅",
                title: "Vereinbarung",
                desc: "Am Ende steht eine schriftliche Vereinbarung, die beide tragen – und die hält.",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{item.emoji}</span>
                <div>
                  <p className="font-semibold text-neutral-900 text-sm">{item.title}</p>
                  <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={advanceToPhase2}
            disabled={advancing}
            className="btn btn-primary disabled:opacity-60"
          >
            {advancing ? "Wird gestartet…" : "Weiter zu Phase 2 →"}
          </button>
        </div>
      </div>
    );
  }

  // ── Feedback-Operationen ───────────────────────────────────────────────────

  async function submitFeedback(occasion: FeedbackOccasion) {
    setFeedbackSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ occasion, answers: feedbackAnswers }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.detail ?? "Feedback konnte nicht gespeichert werden.");
        return;
      }
      setSubmittedFeedbackOccasions((prev) => new Set([...prev, occasion]));
      setFeedbackAnswers({});
      await refreshAllStepStates();
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setFeedbackSubmitting(false);
    }
  }

  function skipFeedback(occasion: FeedbackOccasion) {
    // Als lokal übersprungen markieren (kein Backend-Call)
    setSubmittedFeedbackOccasions((prev) => new Set([...prev, occasion]));
    setFeedbackAnswers({});
    setTimeout(() => refreshAllStepStates(), 50);
  }

  // ── Render: Feedback-Schritt ───────────────────────────────────────────────

  function renderFeedbackStep(occasion: FeedbackOccasion) {
    const questions = FEEDBACK_QUESTIONS[occasion];
    const title = occasion === "after_videocall"
      ? "Wie war das erste Gespräch?"
      : "Kurz innehalten – bevor ihr den Vertrag abschließt";
    const subtitle = occasion === "after_videocall"
      ? "Deine Einschätzung hilft dem Mediator, den Prozess für dich anzupassen."
      : "Deine Antworten helfen dem Mediator zu entscheiden, ob ein weiteres Gespräch sinnvoll ist.";

    const requiredQuestions = questions.filter((q) => q.required);
    const allRequiredAnswered = requiredQuestions.every(
      (q) => feedbackAnswers[q.id] !== undefined && feedbackAnswers[q.id] !== ""
    );

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-neutral-50 px-6 py-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-100">
              <svg className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">{title}</h3>
              <p className="mt-1 text-sm text-neutral-500 leading-relaxed">{subtitle}</p>
            </div>
          </div>
        </div>

        {/* Fragen */}
        <div className="space-y-5">
          {questions.map((q) => (
            <div key={q.id} className="rounded-xl border border-neutral-200 bg-white p-5">
              <p className="text-sm font-semibold text-neutral-800 mb-3 leading-snug">
                {q.label}
                {q.required && <span className="ml-1 text-violet-500">*</span>}
              </p>

              {q.type === "scale10" && (
                <div className="space-y-2">
                  <div className="flex gap-1 flex-wrap">
                    {Array.from({ length: 11 }, (_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFeedbackAnswers((prev) => ({ ...prev, [q.id]: i }))}
                        className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg text-xs sm:text-sm font-semibold transition-all
                          ${feedbackAnswers[q.id] === i
                            ? "bg-violet-600 text-white shadow-sm"
                            : "border border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-violet-300 hover:bg-violet-50"
                          }`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-neutral-400 px-0.5">
                    <span>Sehr unwahrscheinlich</span>
                    <span>Sehr wahrscheinlich</span>
                  </div>
                </div>
              )}

              {q.type === "choice" && q.options && (
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFeedbackAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all
                        ${feedbackAnswers[q.id] === opt
                          ? "bg-violet-600 text-white shadow-sm"
                          : "border border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-violet-300 hover:bg-violet-50"
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {q.type === "emoji5" && (
                <div className="flex gap-3">
                  {[
                    { emoji: "😔", label: "Belastet" },
                    { emoji: "😕", label: "Unsicher" },
                    { emoji: "😐", label: "Neutral" },
                    { emoji: "🙂", label: "Gut" },
                    { emoji: "😊", label: "Sehr gut" },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFeedbackAnswers((prev) => ({ ...prev, [q.id]: idx + 1 }))}
                      className={`flex flex-col items-center gap-1 rounded-xl p-2.5 transition-all
                        ${feedbackAnswers[q.id] === idx + 1
                          ? "bg-violet-100 ring-2 ring-violet-400 scale-110"
                          : "hover:bg-neutral-100"
                        }`}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="text-[10px] text-neutral-500">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {q.type === "text" && (
                <textarea
                  rows={3}
                  value={(feedbackAnswers[q.id] as string) ?? ""}
                  onChange={(e) => setFeedbackAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                  placeholder="Deine Gedanken …"
                  className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              )}
            </div>
          ))}
        </div>

        {/* Aktionen */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => submitFeedback(occasion)}
            disabled={feedbackSubmitting || !allRequiredAnswered}
            className="rounded-2xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {feedbackSubmitting ? "Wird gespeichert…" : "Feedback abschicken →"}
          </button>
          <button
            type="button"
            onClick={() => skipFeedback(occasion)}
            className="text-sm text-neutral-400 transition hover:text-neutral-600"
          >
            Überspringen
          </button>
        </div>
        {!allRequiredAnswered && (
          <p className="text-xs text-neutral-400">Bitte beantworte alle Pflichtfragen (*).</p>
        )}
      </div>
    );
  }

  // ── Render: Terminvereinbarung ─────────────────────────────────────────────

  async function proposeAppointments() {
    setAppointmentLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/appointment/propose`, { method: "POST" });
      if (res.ok) {
        await refreshAppointments();
      } else {
        const body = await res.json().catch(() => null);
        const detail = body?.detail ?? body?.error ?? `Fehler ${res.status}`;
        setError(`Termine konnten nicht erstellt werden: ${detail}`);
      }
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setAppointmentLoading(false);
    }
  }

  async function voteSlot(slotId: number, accepted: boolean) {
    setAppointmentVoting(slotId);
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/appointment/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot_id: slotId, accepted }),
      });
      if (res.ok) {
        await refreshAppointments();
      } else {
        const body = await res.json().catch(() => null);
        setError(body?.detail ?? body?.error ?? `Abstimmung fehlgeschlagen (${res.status})`);
      }
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setAppointmentVoting(null);
    }
  }

  function renderTerminStep() {
    const fmt = (iso: string) => {
      const d = new Date(iso);
      return d.toLocaleDateString("de-DE", {
        weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
      }) + " Uhr";
    };

    if (confirmedSlot) {
      return (
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-accent-200 bg-accent-50 px-8 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-100">
              <svg className="h-7 w-7 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-accent-800">Termin bestätigt</p>
              <p className="mt-2 text-base font-semibold text-neutral-900">{fmt(confirmedSlot.proposed_datetime)}</p>
              <p className="mt-1 text-sm text-accent-700">Alle Beteiligten haben zugestimmt.</p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-neutral-600">Ihr könnt nun mit dem nächsten Schritt fortfahren — dem gemeinsamen Erstgespräch.</p>
            <button
              type="button"
              onClick={() => { setStepModes(prev => ({ ...prev, terminvereinbarung: "done" })); setActiveStep("videocall"); }}
              className="btn btn-primary"
            >
              Weiter zum Erstgespräch →
            </button>
          </div>
        </div>
      );
    }

    if (appointmentSlots.length === 0) {
      const isOwnerOrMediator = currentParticipant?.role === "owner" ||
        currentParticipant?.role === "initiator" || isMediatorOrAdmin;
      return (
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-8 text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 mb-4">
              <svg className="h-7 w-7 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-neutral-700">Noch keine Terminvorschläge</p>
            <p className="mt-2 text-sm text-neutral-500 max-w-sm mx-auto">
              {isOwnerOrMediator
                ? "Klicke auf 'Termine vorschlagen' damit das System drei mögliche Termine für das Erstgespräch berechnet."
                : "Dein Mediator wird in Kürze Terminvorschläge für das erste gemeinsame Gespräch einstellen."}
            </p>
          </div>
          {isOwnerOrMediator && (
            <button type="button" onClick={proposeAppointments} disabled={appointmentLoading} className="btn btn-primary disabled:opacity-60">
              {appointmentLoading ? "Termine werden berechnet…" : "Termine vorschlagen"}
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <p className="text-sm text-neutral-600">
          {reservedSlot
            ? "Alle Beteiligten haben zugestimmt. Der Mediator bestätigt den Termin nun final."
            : "Wähle den Termin der für dich passt. Sobald alle Beteiligten einem Termin zugestimmt haben, wird das Erstgespräch geplant."}
        </p>
        <div className="space-y-3">
          {appointmentSlots.map((slot) => {
            const myVote = currentParticipant
              ? slot.votes.find(v => v.participant_id === currentParticipant.id)
              : null;
            const acceptedCount = slot.votes.filter(v => v.accepted).length;
            const totalVoted = slot.votes.length;
            const isVoting = appointmentVoting === slot.id;
            const isReserved = slot.status === "reserved";
            return (
              <div key={slot.id} className={`rounded-2xl border p-5 ${isReserved ? "border-amber-300 bg-amber-50" : slot.all_accepted ? "border-accent-300 bg-accent-50" : "border-neutral-200 bg-white"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-neutral-900">{fmt(slot.proposed_datetime)}</p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {acceptedCount} von {totalVoted} Beteiligten zugestimmt
                      {slot.all_accepted && " · Alle zugestimmt ✓"}
                    </p>
                    {totalVoted > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {slot.votes.map(v => (
                          <span key={v.participant_id} className={`text-xs rounded-full px-2 py-0.5 ${v.accepted ? "bg-accent-100 text-accent-700" : "bg-red-50 text-red-600"}`}>
                            {v.accepted ? "✓" : "✗"} {v.name}
                          </span>
                        ))}
                      </div>
                    )}
                    {isReserved && (
                      <p className="mt-2 text-xs font-semibold text-amber-700">
                        Wartet auf finale Bestätigung durch den Mediator.
                      </p>
                    )}
                  </div>
                  {!myVote && !isReserved && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        disabled={isVoting}
                        onClick={() => voteSlot(slot.id, true)}
                        className="rounded-full bg-accent-500 px-4 py-2 text-xs font-bold text-white hover:bg-accent-600 disabled:opacity-50 transition"
                      >
                        {isVoting ? "…" : "Zusagen"}
                      </button>
                      <button
                        type="button"
                        disabled={isVoting}
                        onClick={() => voteSlot(slot.id, false)}
                        className="rounded-full border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 transition"
                      >
                        Absagen
                      </button>
                    </div>
                  )}
                  {myVote && !isReserved && (
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${myVote.accepted ? "bg-accent-100 text-accent-700" : "bg-neutral-100 text-neutral-500"}`}>
                      {myVote.accepted ? "Zugesagt" : "Abgesagt"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <button type="button" onClick={proposeAppointments} disabled={appointmentLoading} className="text-xs text-neutral-400 hover:text-neutral-600 transition">
          {appointmentLoading ? "Wird neu berechnet…" : "↻ Neue Termine vorschlagen"}
        </button>
      </div>
    );
  }

  // ── Render: Vertrags-Schritt ───────────────────────────────────────────────

  function renderContractStep() {
    const mode = stepModes["contract"];
    if (mode === ("locked" as StepMode)) {
      return (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-8 text-center">
          <p className="text-sm text-neutral-400">
            Verfügbar, sobald alle vorherigen Schritte abgeschlossen sind.
          </p>
        </div>
      );
    }

    if (allSigned) return renderPhaseOneComplete();

    return (
      <div className="space-y-6">
        <p className="text-sm text-neutral-600">
          Euer Mediator stellt gleich den Mediationsvertrag bereit. Sobald er verfügbar ist,
          könnt ihr ihn lesen und unterzeichnen.
        </p>

        {!contract && (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-8 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
              <svg
                className="h-6 w-6 animate-pulse text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-800">Vertrag wird vorbereitet.</p>
              <p className="mt-1 text-sm text-amber-700">
                Euer Mediator prüft und stellt den Vertrag in Kürze bereit.
              </p>
            </div>
          </div>
        )}

        {contract && (
          <>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900">Mediationsvertrag</h3>
              </div>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
                {contract.text}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-neutral-900">Unterschriften</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {accepted.map((p) => {
                  const sig = signatures.find((s) => s.participant_id === p.id);
                  return (
                    <div
                      key={p.id}
                      className={`rounded-xl border p-4 ${
                        sig
                          ? "border-accent-200 bg-accent-50"
                          : "border-neutral-200 bg-neutral-50"
                      }`}
                    >
                      <p className="mb-1 text-sm font-semibold text-neutral-900">{p.name}</p>
                      <p className="mb-2 text-xs text-neutral-500">
                        {roleLabel[p.role] ?? p.role}
                      </p>
                      {sig ? (
                        <div className="flex items-center gap-1.5">
                          <svg
                            className="h-4 w-4 text-accent-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-xs font-medium text-accent-700">
                            Unterzeichnet als „{sig.signed_name}"
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400">Ausstehend</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {!mySignature && currentParticipant && (
              <div className="rounded-2xl border border-neutral-300 bg-white p-5">
                <p className="mb-3 text-sm font-semibold text-neutral-900">Deine Unterschrift</p>
                <p className="mb-4 text-xs text-neutral-500">
                  Tippe deinen vollständigen Namen und klicke „Unterzeichnen", um den Vertrag
                  zu bestätigen.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={signedName}
                    onChange={(e) => setSignedName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && signedName.trim()) signContract();
                    }}
                    placeholder="Vollständiger Name …"
                    className="flex-1 rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-accent-500 focus:ring-4 focus:ring-accent-100"
                  />
                  <button
                    type="button"
                    onClick={signContract}
                    disabled={contractSigning || !signedName.trim()}
                    className="btn btn-primary sm:shrink-0 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {contractSigning ? "Wird gespeichert…" : "Unterzeichnen"}
                  </button>
                </div>
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
      <section className="container py-4 sm:py-12">
        {/* Globaler Phasen-Stepper – nur für Initiator, nicht für andere Partei */}
        <div className={`mb-4 sm:mb-8 overflow-x-auto ${isOtherParty ? "hidden" : ""}`}>
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
                          ? "bg-accent-500 text-white"
                          : isCurrent
                          ? "bg-accent-600 text-white ring-4 ring-accent-100"
                          : "bg-neutral-200 text-neutral-500"
                      }`}
                    >
                      {isDone ? (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`max-w-[80px] text-center text-xs font-medium leading-tight ${
                        isCurrent
                          ? "text-accent-700"
                          : isDone
                          ? "text-accent-600"
                          : "text-neutral-400"
                      }`}
                    >
                      {p.shortLabel}
                    </span>
                  </div>
                  {index < PHASES.length - 1 && (
                    <div
                      className={`mx-2 mb-5 h-0.5 w-12 transition-colors ${
                        index < phaseIndex ? "bg-accent-400" : "bg-neutral-200"
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="app-surface p-4 sm:p-8">
          {isOtherParty ? (
            /* Emotionaler Header für die Gegenpartei */
            <div className="mb-6">
              <p className="eyebrow mb-3">Mediation</p>
              <h1 className="heading-2 text-neutral-900">
                {activeStep === "intro"
                  ? "Willkommen. Du bist nicht allein."
                  : activeStep === "terminvereinbarung"
                  ? "Wählt euren Gesprächstermin"
                  : activeStep === "videocall"
                  ? "Euer erstes Gespräch"
                  : activeStep === "feedback_after_videocall"
                  ? "Wie war das erste Gespräch?"
                  : activeStep === "feedback_before_contract"
                  ? "Reflexion vor dem Vertrag"
                  : activeStep === "contract"
                  ? "Euer Mediationsvertrag"
                  : contentSteps.find((s) => s.key === activeStep)?.title ?? "Nächster Schritt"}
              </h1>
              <p className="mt-2 text-sm text-neutral-500">
                Schritt {phaseSteps.indexOf(activeStep) + 1} von {phaseSteps.length}
              </p>
            </div>
          ) : (
            <>
              <p className="eyebrow mb-3">Phase 1 von {PHASES.length}</p>
              <h1 className="heading-2 text-neutral-900">Auftrags- und Einleitungsphase</h1>
              <p className="mt-2 text-sm text-neutral-500">
                Schritt {phaseSteps.indexOf(activeStep) + 1} von {phaseSteps.length}
              </p>
            </>
          )}

          {/* Phase-1-interner Stepper */}
          {/* Mobile: kompakte Fortschrittsleiste */}
          <div className="mt-4 sm:hidden">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-accent-700">
                Schritt {phaseSteps.indexOf(activeStep) + 1} von {phaseSteps.length}
              </span>
              <span className="text-xs text-neutral-400">{getPhaseStepLabel(activeStep)}</span>
            </div>
            <div className="h-1.5 rounded-full bg-neutral-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-accent-500 transition-all"
                style={{ width: `${((phaseSteps.indexOf(activeStep) + 1) / phaseSteps.length) * 100}%` }}
              />
            </div>
          </div>
          {/* Desktop: Dot-Stepper */}
          <div className="mt-6 hidden sm:block overflow-x-auto">
            <ol className="flex min-w-max items-center gap-0">
              {phaseSteps.map((step, idx) => (
                <li key={step} className="flex items-center">
                  <StepBadge
                    index={idx}
                    label={getPhaseStepLabel(step)}
                    status={getPhaseStepStatus(step)}
                  />
                  {idx < phaseSteps.length - 1 && (
                    <div
                      className={`mx-2 mb-5 h-0.5 w-8 transition-colors ${
                        getPhaseStepStatus(step) === "done" ? "bg-accent-400" : "bg-neutral-200"
                      }`}
                    />
                  )}
                </li>
              ))}
            </ol>
          </div>

          {/* Aktiver Schritt-Inhalt */}
          <div className="mt-4 sm:mt-8 rounded-xl sm:rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4 sm:p-6">
            {activeStep === "intro" && (
              <>
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-neutral-900">Willkommen</h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    Nimm dir einen Moment, bevor wir beginnen.
                  </p>
                </div>
                {renderIntroStep()}
              </>
            )}

            {activeStep === "terminvereinbarung" && (
              <>
                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-100 text-accent-700">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-bold text-neutral-900">Terminvereinbarung</h2>
                  </div>
                  <p className="mt-1 ml-11 text-sm text-neutral-500">
                    Wählt gemeinsam einen Termin für das erste Gespräch.
                  </p>
                </div>
                {renderTerminStep()}
              </>
            )}

            {activeStep === "videocall" && (
              <>
                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-100 text-accent-700">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-lg font-bold text-neutral-900">Erstgespräch</h2>
                  </div>
                  <p className="mt-1 ml-11 text-sm text-neutral-500">
                    {confirmedSlot
                      ? `Vereinbart für ${new Date(confirmedSlot.proposed_datetime).toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })} Uhr`
                      : "Euer erstes gemeinsames Gespräch per Video."}
                  </p>
                </div>
                {renderVideoCallStep()}
              </>
            )}

            {activeStep === "feedback_after_videocall" && (
              <>
                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-bold text-neutral-900">Kurzes Feedback</h2>
                  </div>
                  <p className="mt-1 ml-11 text-sm text-neutral-500">
                    Wie war das erste Gespräch für dich?
                  </p>
                </div>
                {renderFeedbackStep("after_videocall")}
              </>
            )}

            {contentSteps.map((cs) =>
              activeStep === cs.key ? (
                <div key={cs.key}>
                  <div className="mb-6">
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-100 text-sm font-bold text-accent-700">
                        {cs.number}
                      </div>
                      <h2 className="text-lg font-bold text-neutral-900">{cs.title}</h2>
                    </div>
                  </div>
                  {renderContentStep(cs)}
                </div>
              ) : null
            )}

            {activeStep === "feedback_before_contract" && (
              <>
                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-bold text-neutral-900">Reflexion vor dem Vertrag</h2>
                  </div>
                  <p className="mt-1 ml-11 text-sm text-neutral-500">
                    Kurze Einschätzung bevor ihr den Mediationsvertrag unterzeichnet.
                  </p>
                </div>
                {renderFeedbackStep("before_contract")}
              </>
            )}

            {activeStep === "contract" && (
              <>
                {!allSigned && (
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-100 text-sm font-bold text-accent-700">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-lg font-bold text-neutral-900">Mediationsvertrag</h2>
                  </div>
                )}
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
            {isMediatorOrAdmin && (
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={skipCurrentStep}
                  disabled={advancing}
                  className="text-xs text-neutral-300 hover:text-neutral-500 transition disabled:opacity-50"
                  title="Nur für Tests: Aktuellen Schritt überspringen"
                >
                  ⚡ Test: Schritt überspringen
                </button>
                <button
                  type="button"
                  onClick={advanceToPhase2}
                  disabled={advancing}
                  className="text-xs text-neutral-300 hover:text-neutral-500 transition disabled:opacity-50"
                  title="Nur für Tests: Alle Schritte überspringen und direkt zu Phase 2"
                >
                  {advancing ? "…" : "⚡ Test: Phase überspringen"}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
