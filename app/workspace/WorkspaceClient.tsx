"use client";

import { useState, useEffect } from "react";
import type { WorkspaceSection, MediationCase, ParticipantWithCase } from "./types";
import { WORKSPACE_NAV } from "./types";
import { WorkspaceSidebar } from "./components/WorkspaceSidebar";
import { WorkspaceDashboard } from "./components/WorkspaceDashboard";
import { FaelleListe } from "./components/FaelleListe";
import { FallDetail } from "./components/FallDetail";
import { ParteienListe } from "./components/ParteienListe";
import { ParteiDetail } from "./components/ParteiDetail";
import { Kalender } from "./components/Kalender";
import { cn } from "./ui";
import { fetchUserRole } from "./api";

// ── Mediator-Qualitätsleitfaden ────────────────────────────────────────────
const LEITFADEN_SECTIONS = [
  {
    title: "Deine Rolle",
    content: "Du steuerst den Prozess – nicht das Ergebnis. Die Parteien sind die Experten ihres Konflikts. Deine Aufgabe ist es, ihnen Raum zu geben, gehört zu werden und selbst Lösungen zu entwickeln.",
    type: "text" as const,
  },
  {
    title: "Haltung",
    content: [
      "Allparteilichkeit – keine Seite bevorzugen, beide Perspektiven ernst nehmen",
      "Neutralität – eigene Meinungen und Werturteile zurückhalten",
      "Vertraulichkeit – alles Besprochene bleibt im Raum",
      "Eigenverantwortung – Lösungen kommen von den Parteien, nicht von dir",
    ],
    type: "list" as const,
  },
  {
    title: "Qualitätssignale im Gespräch",
    content: [
      "Die Parteien sprechen mehr als du",
      "Lösungsideen entstehen bei den Parteien selbst",
      "Die Atmosphäre wird im Verlauf offener",
      "Positionen weichen Interessen und Bedürfnissen",
    ],
    type: "list" as const,
  },
  {
    title: "Eskalation früh erkennen",
    content: "Sobald Gespräche persönlich werden, Vorwürfe auftauchen oder eine Partei dominiert – unterbreche, benenne die Dynamik und lenke zurück. Ein kurzer Moment der Unterbrechung ist besser als ein entgleistes Gespräch.",
    type: "text" as const,
  },
  {
    title: "Psychologisch entscheidend",
    content: "Menschen im Konflikt sind defensiv und positionsorientiert. Deine Hauptaufgabe in jeder Phase ist es, Sicherheit herzustellen – nur so werden die Parteien gesprächsfähig und offen für Lösungen.",
    type: "text" as const,
    highlight: true,
  },
];

function LeitfadenModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white px-6 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-600">Mediator-Leitfaden</p>
            <h2 className="text-lg font-semibold text-neutral-900">Qualitätsstandards</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition"
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          <p className="text-sm text-neutral-500 mb-5">
            Lies diesen Leitfaden bevor du eine Mediation leitest. Die Parteien sehen diese Seite nicht.
          </p>
          {LEITFADEN_SECTIONS.map((section, i) => (
            <div
              key={i}
              className={`rounded-xl border p-4 ${
                section.highlight
                  ? "border-accent-200 bg-accent-50"
                  : "border-neutral-100 bg-neutral-50"
              }`}
            >
              <h3 className="mb-2 text-sm font-bold text-neutral-800">{section.title}</h3>
              {section.type === "list" ? (
                <ul className="space-y-1.5">
                  {(section.content as string[]).map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-neutral-600">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-neutral-600 leading-relaxed">{section.content as string}</p>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-neutral-100 bg-white px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full bg-accent-500 px-6 py-2 text-sm font-semibold text-white hover:bg-accent-600 transition"
          >
            Verstanden – Workspace öffnen →
          </button>
        </div>
      </div>
    </div>
  );
}

type Tab = "liste" | "einzelansicht";

interface WorkspaceClientProps {
  userEmail?: string;
}

export default function WorkspaceClient({ userEmail }: WorkspaceClientProps) {
  const [showLeitfaden, setShowLeitfaden] = useState(true);
  const [section, setSection] = useState<WorkspaceSection>("dashboard");
  const [tab, setTab] = useState<Tab>("liste");

  const [selectedFall, setSelectedFall] = useState<MediationCase | null>(null);
  const [selectedPartei, setSelectedPartei] = useState<ParticipantWithCase | null>(null);

  // Nutzerrolle: bestimmt ob Admin-Ansicht (alle Fälle) oder eigene Fälle
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRoleLabel, setUserRoleLabel] = useState("Mediator / Admin");

  // Phasenwechsel: Fall neu laden
  const [fallRefresh, setFallRefresh] = useState(0);

  // Sprung in die Kalender-Tagesansicht (z.B. via Termin-Klick im Dashboard)
  const [kalenderDate, setKalenderDate] = useState<Date | null>(null);

  function handleSelectTermin(date: Date) {
    setKalenderDate(date);
    setSection("kalender");
  }

  useEffect(() => {
    fetchUserRole().then((info) => {
      if (info) {
        setIsAdmin(info.is_admin);
        const labels: Record<string, string> = {
          admin: "Admin",
          mediator: "Mediator",
          party: "Partei",
        };
        setUserRoleLabel(labels[info.role] ?? info.role);
      }
    });
  }, []);

  function handleSelectSection(id: WorkspaceSection) {
    setSection(id);
    setTab("liste");
    setSelectedFall(null);
    setSelectedPartei(null);
    setKalenderDate(null);
  }

  function handlePhaseAdvanced() {
    setFallRefresh((n) => n + 1);
  }

  const sectionLabel = WORKSPACE_NAV.find((i) => i.id === section)?.label ?? "";

  // ── Render Einzelansicht ────────────────────────────────────────────────
  function renderEinzelansicht() {
    if (section === "faelle") {
      if (!selectedFall) {
        return (
          <div className="flex h-full items-center justify-center p-8">
            <div className="text-center">
              <div className="text-4xl mb-3">⚖</div>
              <p className="text-sm text-neutral-400">Keinen Fall ausgewählt.</p>
              <button
                onClick={() => setTab("liste")}
                className="mt-4 text-xs text-accent-600 hover:underline"
              >
                → Zur Fallliste
              </button>
            </div>
          </div>
        );
      }
      return (
        <FallDetail
          key={`${selectedFall.id}-${fallRefresh}`}
          fall={selectedFall}
          onPhaseAdvanced={handlePhaseAdvanced}
        />
      );
    }

    if (section === "parteien") {
      if (!selectedPartei) {
        return (
          <div className="flex h-full items-center justify-center p-8">
            <div className="text-center">
              <div className="text-4xl mb-3">👥</div>
              <p className="text-sm text-neutral-400">Keine Partei ausgewählt.</p>
              <button
                onClick={() => setTab("liste")}
                className="mt-4 text-xs text-accent-600 hover:underline"
              >
                → Zur Parteienliste
              </button>
            </div>
          </div>
        );
      }
      return <ParteiDetail partei={selectedPartei} />;
    }

    return (
      <div className="flex h-full items-center justify-center p-8">
        <p className="text-sm text-neutral-400">Keine Auswahl getroffen.</p>
      </div>
    );
  }

  // ── Render Liste ────────────────────────────────────────────────────────
  function renderListe() {
    if (section === "faelle") {
      return (
        <FaelleListe
          isAdmin={isAdmin}
          selectedId={selectedFall?.id}
          onSelect={(m) => {
            setSelectedFall(m);
            setTab("einzelansicht");
          }}
        />
      );
    }
    if (section === "parteien") {
      return (
        <ParteienListe
          isAdmin={isAdmin}
          selectedId={selectedPartei?.id}
          onSelect={(p) => {
            setSelectedPartei(p);
            setTab("einzelansicht");
          }}
        />
      );
    }
    return (
      <div className="p-6 text-sm text-neutral-400 italic">
        Dieser Bereich ist in Vorbereitung.
      </div>
    );
  }

  // ── Dashboard ───────────────────────────────────────────────────────────
  if (section === "dashboard") {
    return (
      <>
        {showLeitfaden && <LeitfadenModal onClose={() => setShowLeitfaden(false)} />}
        <div className="flex h-full bg-neutral-50 text-neutral-900">
          <WorkspaceSidebar active={section} onSelect={handleSelectSection} userEmail={userEmail} />
          <div className="flex-1 overflow-auto p-6">
            <WorkspaceDashboard
              isAdmin={isAdmin}
              onSelectFall={(m) => {
                setSelectedFall(m);
                setSection("faelle");
                setTab("einzelansicht");
              }}
              onSelectTermin={handleSelectTermin}
            />
          </div>
        </div>
      </>
    );
  }

  // ── Einstellungen ───────────────────────────────────────────────────────
  if (section === "einstellungen") {
    return (
      <div className="flex h-full bg-neutral-50 text-neutral-900">
        <WorkspaceSidebar active={section} onSelect={handleSelectSection} userEmail={userEmail} />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-lg">
            <p className="eyebrow mb-2">Workspace</p>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Einstellungen</h2>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">
                Angemeldet als
              </div>
              <div className="text-sm text-neutral-700">{userEmail ?? "–"}</div>
              <div className="mt-4 text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">
                Rolle
              </div>
              <div className="text-sm text-neutral-700">{userRoleLabel}</div>
              <div className="mt-4 text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">
                Workspace Version
              </div>
              <div className="text-sm text-neutral-500">medipact workspace v1.0</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Kalender ────────────────────────────────────────────────────────────
  if (section === "kalender") {
    return (
      <div className="flex h-full bg-neutral-50 text-neutral-900">
        <WorkspaceSidebar active={section} onSelect={handleSelectSection} userEmail={userEmail} />
        <div className="flex-1 overflow-auto p-6">
          <Kalender isAdmin={isAdmin} jumpToDate={kalenderDate} />
        </div>
      </div>
    );
  }

  // ── Standard: Liste + Einzelansicht ─────────────────────────────────────
  return (
    <div className="flex h-full bg-neutral-50 text-neutral-900">
      <WorkspaceSidebar active={section} onSelect={handleSelectSection} userEmail={userEmail} />

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <div className="flex h-12 shrink-0 items-center border-b border-neutral-200 bg-white px-4 gap-4">
          {/* Tab-Toggle */}
          <div className="flex items-center gap-0.5 bg-neutral-100 rounded-lg p-0.5">
            <button
              onClick={() => setTab("liste")}
              className={cn(
                "px-3 py-1 text-sm rounded-md transition font-medium",
                tab === "liste"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700",
              )}
            >
              Liste
            </button>
            <button
              onClick={() => setTab("einzelansicht")}
              className={cn(
                "px-3 py-1 text-sm rounded-md transition font-medium",
                tab === "einzelansicht"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700",
              )}
            >
              Einzelansicht
            </button>
          </div>

          {/* Breadcrumb */}
          <span className="text-sm font-semibold text-neutral-600">{sectionLabel}</span>
          {selectedFall && section === "faelle" && (
            <>
              <span className="text-neutral-300">·</span>
              <span className="text-sm text-neutral-500 truncate max-w-xs">{selectedFall.title}</span>
            </>
          )}
          {selectedPartei && section === "parteien" && (
            <>
              <span className="text-neutral-300">·</span>
              <span className="text-sm text-neutral-500">{selectedPartei.name}</span>
            </>
          )}
        </div>

        {/* Body: Split */}
        <div className="flex flex-1 overflow-hidden">
          {/* Liste (links) */}
          <div
            className={cn(
              "overflow-auto border-r border-neutral-200 bg-white",
              tab === "einzelansicht" && (selectedFall || selectedPartei)
                ? "hidden xl:block xl:w-72 shrink-0"
                : "flex-1",
            )}
          >
            {renderListe()}
          </div>

          {/* Einzelansicht (rechts) */}
          <div
            className={cn(
              "overflow-auto flex-1 bg-neutral-50",
              tab === "liste" && !selectedFall && !selectedPartei ? "hidden xl:block" : "block",
            )}
          >
            <div className="p-5">{renderEinzelansicht()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}