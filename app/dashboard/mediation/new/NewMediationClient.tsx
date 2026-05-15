"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { mediationRegistry } from "@/lib/mediation-types/registry";

export default function NewMediationClient() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState("");

  const handleCreate = async (type: string) => {
    setIsCreating(type);

    try {
      const res = await fetch("/api/mediations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediation_type: type }),
      });

      if (!res.ok) {
        console.error("Mediation konnte nicht erstellt werden.", res.status);
        return;
      }

      const mediation = await res.json();
      const mediationId =
        mediation.mediation_id ??
        mediation.id ??
        mediation.data?.mediation_id ??
        mediation.data?.id;

      if (!mediationId) {
        console.error("Keine Mediation-ID erhalten:", mediation);
        return;
      }

      router.push(
        `/dashboard/mediation/new/${type}?mediationId=${mediationId}`
      );
    } catch (error) {
      console.error("Server nicht erreichbar.", error);
    } finally {
      setIsCreating("");
    }
  };

  return (
    <main className="app-shell pt-[73px]">
      <section className="border-b border-slate-200 bg-white">
        <div className="container py-12 lg:py-16">
          <Link href="/dashboard" className="btn btn-ghost mb-6">
            ← Zurück zum Dashboard
          </Link>

          <p className="eyebrow mb-3">Neue Mediation</p>

          <h1 className="heading-1 text-slate-900">Worum geht es?</h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Wählen Sie zunächst den passenden Bereich. Die konkreten Fragen
            folgen danach Schritt für Schritt.
          </p>
        </div>
      </section>

      <section className="container py-12 lg:py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.values(mediationRegistry).map((config) => (
            <button
              key={config.type}
              onClick={() => handleCreate(config.type)}
              disabled={!!isCreating}
              className="app-surface border border-slate-200 p-6 text-left transition hover:border-emerald-500 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              <h2 className="heading-3 mb-2">{config.title}</h2>
              <p className="text-sm leading-6 text-slate-600">
                {config.description}
              </p>
              {isCreating === config.type && (
                <p className="mt-3 text-sm font-semibold text-emerald-600">
                  Wird erstellt…
                </p>
              )}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
