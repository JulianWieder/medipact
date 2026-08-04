"use client";

import { useState } from "react";

// ── Block-Renderer des Nutzer-Onboardings ───────────────────────────────────
//
// Bewusst NICHT StepBlocks.tsx wiederverwendet: der Fall-Renderer ist von
// mediationId, Teilnehmern, Paywall und Phasen-Kontext durchzogen. Beim
// Onboarding gibt es nichts davon — es gibt genau eine Person und keinen Fall.
// Ein Umbau von StepBlocks auf "Fall optional" hätte den heikelsten Renderer
// der App angefasst, um einen Kontext zu unterstützen, den er nie braucht.
//
// Preis dafür: die gemeinsamen Blocktypen (textausgabe, frage, auswahl …) sind
// hier ein zweites Mal gerendert. Das ist Absicht — die Onboarding-Variante
// darf sich unabhängig entwickeln (z.B. keine „andere Partei"-Hinweise).
//
// Neuen Blocktyp ergänzen: hier einen case hinzufügen, in blockTypes.ts die
// Registry und in WorkflowManager den Konfig-Editor.

export type OnboardingBlock = {
  id: string;
  type: string;
  config?: Record<string, unknown>;
};

const INPUT =
  "w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-accent-500 focus:ring-4 focus:ring-accent-100";

function cfg(c: Record<string, unknown> | undefined, key: string): string {
  const v = c?.[key];
  return typeof v === "string" ? v : "";
}

function cfgList(c: Record<string, unknown> | undefined, key: string): string[] {
  const v = c?.[key];
  return Array.isArray(v) ? v.map((x) => String(x)) : [];
}

function isRequired(c: Record<string, unknown> | undefined): boolean {
  return c?.required === true;
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  if (!children) return null;
  return (
    <p className="mb-2 text-sm font-semibold text-neutral-900">
      {children}
      {required && <span className="ml-1 text-accent-600">*</span>}
    </p>
  );
}

/**
 * Ein einzelner Block mit seinem aktuellen Wert.
 *
 * `onChange` meldet jede Änderung sofort nach oben (der Flow speichert
 * debounced). Bewusst kein „Speichern"-Knopf pro Block: das Onboarding ist
 * eine Strecke, kein Formular — wer zwischendurch abbricht, soll den Stand
 * beim nächsten Login wiederfinden.
 */
export function OnboardingBlock({
  block,
  value,
  onChange,
  invalid,
}: {
  block: OnboardingBlock;
  value: unknown;
  onChange: (value: unknown) => void;
  invalid?: boolean;
}) {
  const c = block.config;
  const required = isRequired(c);
  const ring = invalid ? "ring-2 ring-red-200 rounded-2xl p-3 -m-3" : "";

  switch (block.type) {
    // ── Anzeige ───────────────────────────────────────────────────────────
    case "textausgabe":
      return (
        <p className="whitespace-pre-line text-[15px] leading-relaxed text-neutral-700">
          {cfg(c, "text")}
        </p>
      );

    case "hinweis": {
      const variant = cfg(c, "variant") || "info";
      const tone =
        variant === "warnung"
          ? "border-amber-200 bg-amber-50 text-amber-900"
          : variant === "erfolg"
            ? "border-emerald-200 bg-emerald-50 text-emerald-900"
            : "border-blue-200 bg-blue-50 text-blue-900";
      return (
        <div className={`whitespace-pre-line rounded-2xl border p-4 text-sm ${tone}`}>
          {cfg(c, "text")}
        </div>
      );
    }

    case "akkordeon":
      return (
        <details className="group rounded-2xl border border-neutral-200 bg-white p-4">
          <summary className="cursor-pointer list-none text-sm font-semibold text-neutral-900">
            <span className="mr-2 inline-block transition-transform group-open:rotate-90">›</span>
            {cfg(c, "title")}
          </summary>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
            {cfg(c, "text")}
          </p>
        </details>
      );

    case "bild":
      return cfg(c, "url") ? (
        <figure>
          {/* Bewusst <img> und nicht next/image: die URL wird im Workflow
              Manager frei eingetragen und liegt oft auf einer fremden Domain,
              die in next.config nicht freigegeben ist. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cfg(c, "url")} alt={cfg(c, "caption")} className="rounded-2xl" />
          {cfg(c, "caption") && (
            <figcaption className="mt-2 text-xs text-neutral-500">{cfg(c, "caption")}</figcaption>
          )}
        </figure>
      ) : null;

    case "video":
      return cfg(c, "url") ? (
        <div className="overflow-hidden rounded-2xl border border-neutral-200">
          <video src={cfg(c, "url")} controls className="w-full" />
        </div>
      ) : null;

    // ── Onboarding-eigene Blöcke ──────────────────────────────────────────
    // Feste Feldlisten: die Werte werden serverseitig in die users-Spalten
    // gespiegelt (services/onboarding.PROFILE_MIRROR). Frei konfigurierbare
    // Felder würden diese Zuordnung brechen.
    case "stammdaten": {
      const v = (value ?? {}) as { name?: string; phone?: string };
      const set = (patch: Partial<typeof v>) => onChange({ ...v, ...patch });
      return (
        <div className={ring}>
          <Label required={required}>{cfg(c, "title") || "Deine Angaben"}</Label>
          {cfg(c, "description") && (
            <p className="mb-3 text-sm text-neutral-600">{cfg(c, "description")}</p>
          )}
          <div className="space-y-2">
            <input
              value={v.name ?? ""}
              onChange={(e) => set({ name: e.target.value })}
              placeholder="Vor- und Nachname"
              className={INPUT}
            />
            <input
              value={v.phone ?? ""}
              onChange={(e) => set({ phone: e.target.value })}
              placeholder="Telefon (optional)"
              className={INPUT}
            />
          </div>
        </div>
      );
    }

    case "rechnungsdaten": {
      const v = (value ?? {}) as { street?: string; postal_code?: string; city?: string };
      const set = (patch: Partial<typeof v>) => onChange({ ...v, ...patch });
      return (
        <div className={ring}>
          <Label required={required}>{cfg(c, "title") || "Rechnungsanschrift"}</Label>
          {cfg(c, "description") && (
            <p className="mb-3 text-sm text-neutral-600">{cfg(c, "description")}</p>
          )}
          <div className="space-y-2">
            <input
              value={v.street ?? ""}
              onChange={(e) => set({ street: e.target.value })}
              placeholder="Straße und Hausnummer"
              className={INPUT}
            />
            <div className="flex gap-2">
              <input
                value={v.postal_code ?? ""}
                onChange={(e) => set({ postal_code: e.target.value })}
                placeholder="PLZ"
                className={`${INPUT} max-w-[140px]`}
              />
              <input
                value={v.city ?? ""}
                onChange={(e) => set({ city: e.target.value })}
                placeholder="Ort"
                className={INPUT}
              />
            </div>
          </div>
        </div>
      );
    }

    // ── Eingabe ───────────────────────────────────────────────────────────
    case "texteingabe":
      return (
        <div className={ring}>
          <Label required={required}>{cfg(c, "label")}</Label>
          <textarea
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            placeholder={cfg(c, "placeholder")}
            className={INPUT}
          />
        </div>
      );

    case "frage":
      return (
        <div className={ring}>
          <Label required={required}>{cfg(c, "prompt")}</Label>
          <textarea
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            placeholder="Deine Antwort …"
            className={INPUT}
          />
        </div>
      );

    case "auswahl": {
      const options = cfgList(c, "options");
      const multi = c?.multi === true;
      const selected = Array.isArray(value)
        ? value.map(String)
        : typeof value === "string" && value
          ? [value]
          : [];
      const toggle = (opt: string) => {
        if (!multi) {
          onChange(opt);
          return;
        }
        onChange(
          selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt],
        );
      };
      return (
        <div className={ring}>
          <Label required={required}>{cfg(c, "prompt")}</Label>
          <div className="space-y-2">
            {options.map((opt) => {
              const active = selected.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggle(opt)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                    active
                      ? "border-accent-400 bg-accent-50 text-accent-900"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 flex-none items-center justify-center border text-[11px] font-bold ${
                      multi ? "rounded-md" : "rounded-full"
                    } ${active ? "border-accent-500 bg-accent-500 text-white" : "border-neutral-300"}`}
                  >
                    {active ? "✓" : ""}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    case "zustimmung": {
      const agreed = typeof value === "object" && value !== null
        ? (value as { agreed?: boolean }).agreed === true
        : value === true;
      return (
        <div className={ring}>
          <button
            type="button"
            onClick={() => onChange({ agreed: !agreed })}
            className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
              agreed
                ? "border-accent-400 bg-accent-50 text-accent-900"
                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
            }`}
          >
            <span
              className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-md border text-[11px] font-bold ${
                agreed ? "border-accent-500 bg-accent-500 text-white" : "border-neutral-300"
              }`}
            >
              {agreed ? "✓" : ""}
            </span>
            <span>
              {cfg(c, "text")}
              {required && <span className="ml-1 text-accent-600">*</span>}
            </span>
          </button>
        </div>
      );
    }

    case "datum":
      return (
        <div className={ring}>
          <Label required={required}>{cfg(c, "label")}</Label>
          <input
            type="date"
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            className={`${INPUT} max-w-[220px]`}
          />
          {cfg(c, "help") && <p className="mt-1 text-xs text-neutral-500">{cfg(c, "help")}</p>}
        </div>
      );

    case "unterschrift": {
      const v = (value ?? {}) as { name?: string };
      return (
        <div className={ring}>
          <Label required={required}>{cfg(c, "statement")}</Label>
          <input
            value={v.name ?? ""}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Vollständigen Namen tippen"
            className={`${INPUT} font-serif italic`}
          />
        </div>
      );
    }

    case "liste": {
      const items = Array.isArray(value) ? value.map(String) : [];
      return (
        <div className={ring}>
          <Label required={required}>{cfg(c, "prompt")}</Label>
          <ListInput
            items={items}
            placeholder={cfg(c, "placeholder")}
            onChange={(next) => onChange(next)}
          />
        </div>
      );
    }

    default:
      // Unbekannter Typ (z.B. ein Fall-Block, der versehentlich im Onboarding
      // gelandet ist): still überspringen statt die ganze Seite zu zerlegen —
      // genauso, wie es der Fall-Renderer mit unbekannten Typen macht.
      return null;
  }
}

function ListInput({
  items,
  placeholder,
  onChange,
}: {
  items: string[];
  placeholder: string;
  onChange: (items: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const t = draft.trim();
    if (!t) return;
    onChange([...items, t]);
    setDraft("");
  };
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={`${item}-${i}`} className="flex items-center gap-2 rounded-xl bg-neutral-50 px-3 py-2">
          <span className="flex-1 text-sm text-neutral-800">{item}</span>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="text-xs font-semibold text-neutral-400 hover:text-red-600"
          >
            Entfernen
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder || "Punkt hinzufügen …"}
          className={INPUT}
        />
        <button type="button" onClick={add} className="btn btn-secondary shrink-0 text-sm">
          Hinzufügen
        </button>
      </div>
    </div>
  );
}

/** Nur für den Einsatz in einer Leseansicht (Admin-/Mediator-Einsicht):
 *  denselben Wert schreibgeschützt als Text darstellen.
 *  Kleingeschrieben, weil es KEINE Komponente ist – ein großes O würde React
 *  und die Lint-Regeln glauben lassen, hier käme JSX zurück. */
export function onboardingValueText(block: OnboardingBlock, value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") return value.trim() || "—";
  if (typeof value === "boolean") return value ? "Ja" : "Nein";
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.length ? value.map(String).join(", ") : "—";
  if (typeof value === "object") {
    const o = value as Record<string, unknown>;
    if ("agreed" in o) return o.agreed === true ? "Bestätigt" : "Nicht bestätigt";
    if ("street" in o) {
      const parts = [o.street, [o.postal_code, o.city].filter(Boolean).join(" ")]
        .map((p) => String(p ?? "").trim())
        .filter(Boolean);
      return parts.length ? parts.join(", ") : "—";
    }
    if ("name" in o) {
      const name = String(o.name ?? "").trim();
      const phone = String(o.phone ?? "").trim();
      return [name, phone].filter(Boolean).join(" · ") || "—";
    }
  }
  return "—";
}

/** Beschriftung eines Blocks für Fehlermeldungen und Leseansichten.
 *  Spiegelt blockLabel aus blockTypes.ts, arbeitet aber auf der schlankeren
 *  OnboardingBlock-Form. */
export function onboardingBlockLabel(block: OnboardingBlock): string {
  const c = block.config ?? {};
  for (const key of ["prompt", "label", "title", "statement", "text"]) {
    const v = c[key];
    if (typeof v === "string" && v.trim()) {
      const one = v.trim().split("\n")[0];
      return one.length > 70 ? `${one.slice(0, 67)}…` : one;
    }
  }
  return block.type;
}
