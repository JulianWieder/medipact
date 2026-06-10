"use client";

import { useState } from "react";
import { WORKSPACE_NAV, WorkspaceSection } from "../types";
import { cn } from "../ui";

interface WorkspaceSidebarProps {
  active: WorkspaceSection;
  onSelect: (id: WorkspaceSection) => void;
  userEmail?: string;
}

const tooltipStyle = `
  .ws-item .ws-tooltip { opacity: 0; pointer-events: none; transition: opacity 150ms; }
  .ws-item:hover .ws-tooltip { opacity: 1; }
`;

const mainNav = WORKSPACE_NAV.filter((i) => i.id !== "einstellungen");
const bottomNav = WORKSPACE_NAV.filter((i) => i.id === "einstellungen");

export function WorkspaceSidebar({ active, onSelect, userEmail }: WorkspaceSidebarProps) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <>
      <style>{tooltipStyle}</style>
      <aside
        className={cn(
          "relative flex h-screen flex-col border-r border-slate-200 bg-white py-4 shrink-0 overflow-visible transition-all duration-300",
          collapsed ? "w-16 px-2" : "w-52 px-3",
        )}
      >
        {/* Logo */}
        <div className={cn("mb-8 flex items-center", collapsed ? "justify-center" : "px-2")}>
          {collapsed ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500 text-white text-sm font-bold">
              m
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-teal-500 text-white text-xs font-bold">
                m
              </div>
              <span className="text-sm font-semibold text-slate-800">medipact</span>
            </div>
          )}
        </div>

        {/* Haupt-Navigation */}
        <nav className="flex-1 flex flex-col gap-1">
          {mainNav.map((item) => (
            <div key={item.id} className="ws-item relative">
              <button
                onClick={() => onSelect(item.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl transition-all w-full",
                  collapsed ? "justify-center px-0 py-3" : "px-3 py-2.5",
                  active === item.id
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-700",
                )}
              >
                {active === item.id && !collapsed && (
                  <div className="absolute left-0 w-1 h-5 bg-teal-500 rounded-r-full" />
                )}
                <span className="text-lg leading-none shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span
                    className={cn(
                      "text-sm",
                      active === item.id ? "font-semibold" : "font-medium",
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </button>

              {collapsed && (
                <div className="ws-tooltip absolute left-full top-1/2 -translate-y-1/2 ml-4 z-50">
                  <div className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white whitespace-nowrap shadow-lg">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Unterer Bereich */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-1">
          {bottomNav.map((item) => (
            <div key={item.id} className="ws-item relative">
              <button
                onClick={() => onSelect(item.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl transition-all w-full",
                  collapsed ? "justify-center px-0 py-3" : "px-3 py-2.5",
                  active === item.id
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-700",
                )}
              >
                <span className="text-lg leading-none shrink-0">{item.icon}</span>
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>

              {collapsed && (
                <div className="ws-tooltip absolute left-full top-1/2 -translate-y-1/2 ml-4 z-50">
                  <div className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white whitespace-nowrap shadow-lg">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* User-Info */}
          {!collapsed && userEmail && (
            <div className="mt-3 px-3 py-2 rounded-xl bg-slate-50">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
                Mediator
              </div>
              <div className="text-xs text-slate-600 truncate">{userEmail}</div>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="absolute -right-3.5 top-8 z-50 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md text-slate-500 hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-all cursor-pointer"
          title={collapsed ? "Ausklappen" : "Einklappen"}
        >
          <span className="text-xs font-bold">{collapsed ? "›" : "‹"}</span>
        </button>
      </aside>
    </>
  );
}
