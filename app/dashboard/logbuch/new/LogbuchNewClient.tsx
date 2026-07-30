"use client";

// ── Streit anlegen: Einstieg ins kostenlose Konflikt-Logbuch ────────────────
//
// EIN Logbuch statt 6 "Produkt"-Karten (Nutzer-Feedback): Die Nutzer:in legt
// ein Logbuch an und ordnet den Konflikt nur grob einem Bereich zu (kompakte
// Chips). Der Bereich (mediation_type) bleibt intern wichtig – er bestimmt
// die Intake-Vorlage und die spätere Umwandlung in eine Mediation.
// mode="logbuch"; die weitere Aufnahme (logbuch_intake) läuft über
// WorkflowManager-Blöcke im Logbuch selbst.

import { encodeId } from "@/lib/ids";
import { Reveal } from "@/app/components/ui/motion";
import Link from "next/link";
import Icon from "@/app/components/ui/Icon";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TYPES: { type: string; title: string; hint: string; icon: string; business?: boolean }[] = [
  { type: "trennung", title: "Trennung & Familie", hint: "Partnerschaft, Trennung, Umgang", icon: "💔" },
  { type: "erbschaft", title: "Erbschaft", hint: "Erbengemeinschaft, Nachlass, Immobilie", icon: "📜" },
  { type: "nachbarschaft", title: "Nachbarschaft", hint: "Lärm, Grenze, Garten, Parken", icon: "🏡" },
  { type: "verbraucher", title: "Verbraucher & Handwerker", hint: "Mängel, Rechnungen, Leistungen", icon: "🧾" },
  { type: "odr", title: "Geschäft & Arbeit", hint: "Team, Gesellschafter, Kunden, B2B", icon: "🏢", business: true },
];

export default function LogbuchNewClient() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const selectedMeta = TYPES.find((t) => t.type === selected) ?? null;

  const handleCreate = async () => {
    if (!selectedMeta) return;
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/mediations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediation_type: selectedMeta.type,
          mode: "logbuch",
          title: selectedMeta.business
            ? `Falldokumentation – ${selectedMeta.title}`
            : `Logbuch – ${selectedMeta.title}`,
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
      setCreating(false);
    }
  };

  return (
    <main className="app-shell pt-[73px]">
      <div className="mx-auto max-w-3xl px-6 py-14 lg:px-8">
        <Link href="/dashboard" className="btn btn-ghost mb-6">
          ← Zurück zum Dashboard
        </Link>

        <span className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-700">
          Kostenlos
        </span>
        <h1 className="heading-1 mt-4 text-neutral-900">Ihr Konflikt-Logbuch</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-600">
          Halten Sie fest, was passiert: Vorkommnisse, Gespräche, E-Mails,
          Nachrichten, Telefonate und Ihre Gedanken. Vertraulich, kostenlos,
          jederzeit in eine Mediation umwandelbar.
        </p>

        <Reveal className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
          <p className="text-sm font-semibold text-neutral-800">
            Wohin gehört Ihr Konflikt am ehesten?
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            Nur eine grobe Einordnung – alles Weitere halten Sie im Logbuch fest.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t.type}
                type="button"
                onClick={() => setSelected(t.type)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                  selected === t.type
                    ? "border-accent-500 bg-accent-50 font-semibold text-accent-700 ring-2 ring-accent-200"
                    : "border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400"
                }`}
              >
                <Icon name={t.icon} size={16} />
                {t.title}
              </button>
            ))}
          </div>

          {selectedMeta && (
            <p className="mt-3 text-xs text-neutral-500">
              {selectedMeta.hint}
              {selectedMeta.business &&
                " – als sachliche Falldokumentation, ohne Journal-Funktionen."}
            </p>
          )}

          <button
            type="button"
            onClick={handleCreate}
            disabled={!selectedMeta || creating}
            className="btn btn-primary mt-6 disabled:opacity-50"
          >
            {creating
              ? "Logbuch wird angelegt …"
              : selectedMeta?.business
                ? "Falldokumentation anlegen →"
                : "Logbuch anlegen →"}
          </button>
          {!selectedMeta && (
            <p className="mt-2 text-xs text-neutral-400">
              Bitte zuerst einen Bereich wählen.
            </p>
          )}
        </Reveal>

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
