"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/app/components/ui/Icon";

// ── Kalender-Karte fürs Dashboard ───────────────────────────────────────────
//
// Beantwortet die zwei Fragen, die man morgens an einen Betreuungskalender
// hat: was steht als Nächstes an, und wartet etwas auf meine Antwort. Alles
// Weitere gehört auf die Kalenderseite, nicht aufs Dashboard.
//
// Die Karte holt sich alles selbst (`/api/kalender/mein` löst das eigene
// Logbuch auf) – so bleibt DashboardClient von der Kalender-Logik frei.
//
// Sie versteckt sich NUR, wenn es gar keinen Kalender gibt (kein Logbuch).
// Ein leerer Kalender ist kein Grund zum Verstecken: wer noch nichts
// eingetragen hat, sucht das Feature am dringendsten. Der frühere Zustand
// „blendet sich auch bei leerem Kalender aus" war genau der Fehler, den
// dieses Feature beheben sollte.

type Mein = {
  mediation_id: number | null;
  rolle: string | null;
  wartet_auf_mich?: number;
};

type Item = {
  key: string;
  date: string;
  planned_start: string | null;
  planned_end: string | null;
  caregiver: string | null;
  title: string | null;
  label: string | null;
  status: string;
  verbindlich: boolean;
};

function iso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function fmtTag(isoDate: string): string {
  const heute = iso(new Date());
  const morgen = iso(new Date(Date.now() + 86400000));
  if (isoDate === heute) return "Heute";
  if (isoDate === morgen) return "Morgen";
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

function fmtZeit(ts: string | null): string {
  if (!ts) return "";
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function KalenderKarte({
  // Der Außenabstand ist ein Prop, weil die Karte in zwei Kontexten steht:
  // gestapelt unter der Fallliste (Default `mt-14`) und in der Seitenspalte
  // des Dashboards, wo der Abstand vom `space-y` des Containers kommt.
  className = "mt-14",
}: {
  className?: string;
} = {}) {
  const [mein, setMein] = useState<Mein | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [geladen, setGeladen] = useState(false);

  useEffect(() => {
    let abgebrochen = false;
    (async () => {
      try {
        const res = await fetch("/api/kalender/mein", { cache: "no-store" });
        if (!res.ok) return;
        const daten: Mein = await res.json();
        if (abgebrochen) return;
        setMein(daten);
        if (!daten.mediation_id) return;

        // Die nächsten vier Wochen reichen: was weiter weg liegt, plant
        // niemand vom Dashboard aus.
        const von = iso(new Date());
        const bis = iso(new Date(Date.now() + 28 * 86400000));
        const r = await fetch(
          `/api/mediations/${daten.mediation_id}/logbuch/betreuung/termine?from=${von}&to=${bis}`,
          { cache: "no-store" },
        );
        if (!r.ok || abgebrochen) return;
        const d = await r.json();
        setItems((d.items ?? []).slice(0, 3));
      } catch {
        /* Die Karte ist Beiwerk – ein Fehler darf das Dashboard nicht stören. */
      } finally {
        if (!abgebrochen) setGeladen(true);
      }
    })();
    return () => {
      abgebrochen = true;
    };
  }, []);

  // Nur ohne Logbuch gar nichts zeigen – dann gibt es auch nichts zu öffnen.
  if (!geladen || !mein?.mediation_id) return null;
  const offen = mein.wartet_auf_mich ?? 0;

  return (
    <Link
      href="/dashboard/kalender"
      // Der Abstand kommt per `className` vom Aufrufer (Default `mt-14`): die
      // Karte blendet sich selbst aus, und ein leerer Platzhalter mit Rand
      // wäre ein Loch im Dashboard.
      className={`group relative block overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-20px_rgba(15,23,42,0.18)] ${className}`}
    >
      {/* Glanzstrich oben – dieselbe Kartensprache wie `.app-surface` auf der
          Landing und die Seitenspalten-Karten im Dashboard. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-300/70 to-transparent"
      />
      <span className="flex items-center gap-3 px-4 py-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
          <Icon name="calendar" size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-neutral-900">
            Kalender
          </span>
          <span className="mt-0.5 block text-xs font-light text-neutral-500">
            {offen > 0
              ? offen === 1
                ? "Eine Absprache wartet auf deine Antwort"
                : `${offen} Absprachen warten auf deine Antwort`
              : items.length > 0
                ? "Betreuungszeiten und Termine"
                : "Betreuungszeiten planen, tauschen und festhalten"}
          </span>
        </span>
        {offen > 0 && (
          <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
            {offen}
          </span>
        )}
        <span className="text-neutral-300 transition-transform duration-200 group-hover:translate-x-0.5">
          ›
        </span>
      </span>

      {items.length === 0 && offen === 0 && (
        <span className="block border-t border-neutral-100 px-4 py-3 text-xs font-light leading-relaxed text-neutral-400">
          Noch nichts eingetragen – lege das Wochenmuster an, dann steht hier,
          wer das Kind wann betreut.
        </span>
      )}

      {items.length > 0 && (
        <span className="block border-t border-neutral-100">
          {items.map((it) => (
            <span
              key={it.key}
              className="flex items-baseline gap-2.5 border-t border-neutral-50 px-4 py-2.5 first:border-t-0"
            >
              <span className="w-16 shrink-0 text-xs font-semibold text-neutral-500">
                {fmtTag(it.date)}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-neutral-700">
                {it.caregiver || it.title || it.label || "Betreuung"}
                {!it.verbindlich && (
                  <span className="ml-2 text-xs text-amber-700">· erbeten</span>
                )}
                {it.status === "ausgefallen" && (
                  <span className="ml-2 text-xs text-red-600">· ausgefallen</span>
                )}
              </span>
              <span className="shrink-0 text-xs font-light tabular-nums text-neutral-400">
                {fmtZeit(it.planned_start)}
                {it.planned_end ? `–${fmtZeit(it.planned_end)}` : ""}
              </span>
            </span>
          ))}
        </span>
      )}
    </Link>
  );
}
