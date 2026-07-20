"use client";

// ── Streit anlegen: Einstieg ins kostenlose Konflikt-Logbuch ────────────────
//
// Zusätzlich zu "Mediation starten": Nutzer:innen legen einen Streit an und
// dokumentieren erst einmal nur – Vorkommnisse, Gedanken, Gespräche, E-Mails,
// WhatsApp, Telefonate. Kostenlos, ohne Gegenseite. Der Fall wird mit
// mode="logbuch" angelegt; die weitere Aufnahme (logbuch_intake) läuft über
// WorkflowManager-Blöcke im Logbuch selbst.

import { encodeId } from "@/lib/ids";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TYPES: { type: string; title: string; description: string; icon: string }[] = [
  {
    type: "nachbarschaft",
    title: "Nachbarschaft",
    description: "Lärm, Grenze, Garten, Parken – Ärger nebenan.",
    icon: "🏡",
  },
  {
    type: "wg",
    title: "WG & Mitbewohner",
    description: "Putzplan, Kosten, Lautstärke, Auszug.",
    icon: "🛋️",
  },
  {
    type: "verbraucher",
    title: "Verbraucher & Handwerker",
    description: "Mängel, Rechnungen, nicht erbrachte Leistungen.",
    icon: "🧾",
  },
  {
    type: "trennung",
    title: "Trennung & Familie",
    description: "Konflikte in Partnerschaft, Trennung, Umgang.",
    icon: "💔",
  },
  {
    type: "erbschaft",
    title: "Erbschaft",
    description: "Streit in der Erbengemeinschaft, Nachlass, Immobilie.",
    icon: "📜",
  },
  {
    type: "odr",
    title: "Geschäft & Arbeit",
    description: "Team, Gesellschafter, Kunden, Lieferanten (B2B).",
    icon: "🏢",
  },
];

export default function LogbuchNewClient() {
  const router = useRouter();
  const [creating, setCreating] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleCreate = async (type: string, title: string) => {
    setCreating(type);
    setError("");
    try {
      const res = await fetch("/api/mediations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediation_type: type,
          mode: "logbuch",
          title: `Logbuch – ${title}`,
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setError(body?.detail ?? body?.error ?? `Fehler (${res.status})`);
        return;
      }
      const id = body?.mediation_id ?? body?.id;
      router.push(`/dashboard/logbuch/${encodeId(Number(id))}?neu=1`);
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setCreating(null);
    }
  };

  return (
    <main className="app-shell pt-[73px]">
      <div className="mx-auto max-w-5xl px-6 py-14 lg:px-8">
        <Link href="/dashboard" className="btn btn-ghost mb-6">
          ← Zurück zum Dashboard
        </Link>

        <span className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-700">
          Kostenlos
        </span>
        <h1 className="heading-1 mt-4 text-neutral-900">
          Einen Streit anlegen &amp; dokumentieren
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-600">
          Noch keine Mediation – aber ein Konflikt, der Sie beschäftigt? Legen
          Sie ein Konflikt-Logbuch an und halten Sie fest, was passiert:
          Vorkommnisse, Gespräche, E-Mails, WhatsApp-Nachrichten, Telefonate und
          Ihre Gedanken. Vertraulich, kostenlos, jederzeit in eine Mediation
          umwandelbar.
        </p>

        <p className="mt-10 text-sm font-semibold uppercase tracking-wide text-neutral-400">
          Worum geht es?
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TYPES.map((t) => (
            <button
              key={t.type}
              type="button"
              onClick={() => handleCreate(t.type, t.title)}
              disabled={creating !== null}
              className="rounded-2xl border border-neutral-200 bg-white p-6 text-left transition hover:border-accent-400 hover:shadow-lg disabled:opacity-50"
            >
              <span className="text-2xl">{t.icon}</span>
              <h2 className="heading-3 mt-3 mb-1 text-neutral-900">{t.title}</h2>
              <p className="text-sm text-neutral-600">{t.description}</p>
              {creating === t.type && (
                <p className="mt-3 text-sm font-semibold text-accent-600">
                  Logbuch wird angelegt …
                </p>
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <p className="mt-10 text-sm text-neutral-500">
          Sie möchten direkt loslegen?{" "}
          <Link href="/dashboard/mediation/new" className="font-semibold text-accent-600 hover:text-accent-700">
            Stattdessen eine Mediation starten →
          </Link>
        </p>
      </div>
    </main>
  );
}
