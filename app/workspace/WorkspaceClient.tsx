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
import { cn } from "./ui";
import { fetchUserRole } from "./api";

type Tab = "liste" | "einzelansicht";

interface WorkspaceClientProps {
  userEmail?: string;
}

export default function WorkspaceClient({ userEmail }: WorkspaceClientProps) {
  const [section, setSection] = useState<WorkspaceSection>("dashboard");
  const [tab, setTab] = useState<Tab>("liste");

  const [selectedFall, setSelectedFall] = useState<MediationCase | null>(null);
  const [selectedPartei, setSelectedPartei] = useState<ParticipantWithCase | null>(null);

  // Nutzerrolle: bestimmt ob Admin-Ansicht (alle Fälle) oder eigene Fälle
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRoleLabel, setUserRoleLabel] = useState("Mediator / Admin");

  // Phasenwechsel: Fall neu laden
  const [fallRefresh, setFallRefresh] = useState(0);

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
              <p className="text-sm text-slate-400">Keinen Fall ausgewählt.</p>
              <button
                onClick={() => setTab("liste")}
                className="mt-4 text-xs text-teal-600 hover:underline"
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
              <p className="text-sm text-slate-400">Keine Partei ausgewählt.</p>
              <button
                onClick={() => setTab("liste")}
                className="mt-4 text-xs text-teal-600 hover:underline"
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
        <p className="text-sm text-slate-400">Keine Auswahl getroffen.</p>
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
      <div className="p-6 text-sm text-slate-400 italic">
        Dieser Bereich ist in Vorbereitung.
      </div>
    );
  }

  // ── Dashboard ───────────────────────────────────────────────────────────
  if (section === "dashboard") {
    return (
      <div className="flex h-full bg-[#f8fafc] text-slate-900">
        <WorkspaceSidebar active={section} onSelect={handleSelectSection} userEmail={userEmail} />
        <div className="flex-1 overflow-auto p-6">
          <WorkspaceDashboard
            isAdmin={isAdmin}
            onSelectFall={(m) => {
              setSelectedFall(m);
              setSection("faelle");
              setTab("einzelansicht");
            }}
          />
        </div>
      </div>
    );
  }

  // ── Einstellungen ───────────────────────────────────────────────────────
  if (section === "einstellungen") {
    return (
      <div className="flex h-full bg-[#f8fafc] text-slate-900">
        <WorkspaceSidebar active={section} onSelect={handleSelectSection} userEmail={userEmail} />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-lg">
            <p className="eyebrow mb-2">Workspace</p>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Einstellungen</h2>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                Angemeldet als
              </div>
              <div className="text-sm text-slate-700">{userEmail ?? "–"}</div>
              <div className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                Rolle
              </div>
              <div className="text-sm text-slate-700">{userRoleLabel}</div>
              <div className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                Workspace Version
              </div>
              <div className="text-sm text-slate-500">medipact workspace v1.0</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Standard: Liste + Einzelansicht ─────────────────────────────────────
  return (
    <div className="flex h-full bg-[#f8fafc] text-slate-900">
      <WorkspaceSidebar active={section} onSelect={handleSelectSection} userEmail={userEmail} />

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <div className="flex h-12 shrink-0 items-center border-b border-slate-200 bg-white px-4 gap-4">
          {/* Tab-Toggle */}
          <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => setTab("liste")}
              className={cn(
                "px-3 py-1 text-sm rounded-md transition font-medium",
                tab === "liste"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              Liste
            </button>
            <button
              onClick={() => setTab("einzelansicht")}
              className={cn(
                "px-3 py-1 text-sm rounded-md transition font-medium",
                tab === "einzelansicht"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              Einzelansicht
            </button>
          </div>

          {/* Breadcrumb */}
          <span className="text-sm font-semibold text-slate-600">{sectionLabel}</span>
          {selectedFall && section === "faelle" && (
            <>
              <span className="text-slate-300">·</span>
              <span className="text-sm text-slate-500 truncate max-w-xs">{selectedFall.title}</span>
            </>
          )}
          {selectedPartei && section === "parteien" && (
            <>
              <span className="text-slate-300">·</span>
              <span className="text-sm text-slate-500">{selectedPartei.name}</span>
            </>
          )}
        </div>

        {/* Body: Split */}
        <div className="flex flex-1 overflow-hidden">
          {/* Liste (links) */}
          <div
            className={cn(
              "overflow-auto border-r border-slate-200 bg-white",
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
              "overflow-auto flex-1 bg-[#f8fafc]",
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