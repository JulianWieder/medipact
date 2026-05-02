"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

interface Mediation {
  id: string;
  title: string;
  phase: string;
  status: "active" | "pending" | "completed";
  progress: number;
}

const statusConfig = {
  active: {
    label: "Laufend",
    className: "bg-emerald-100 text-emerald-800",
  },
  pending: {
    label: "Ausstehend",
    className: "bg-amber-100 text-amber-800",
  },
  completed: {
    label: "Abgeschlossen",
    className: "bg-slate-100 text-slate-800",
  },
};

export default function DashboardClient({
  mediations,
}: {
  mediations: Mediation[];
}) {
  const [data] = useState(mediations ?? []);

  const stats = useMemo(
    () => [
      { label: "Gesamt", value: data.length, text: "Mediationen" },
      {
        label: "Laufend",
        value: data.filter((m) => m.status === "active").length,
        text: "aktive Verfahren",
      },
      {
        label: "Abgeschlossen",
        value: data.filter((m) => m.status === "completed").length,
        text: "beendete Verfahren",
      },
    ],
    [data],
  );

  return (
    <main className="app-shell pt-[73px]">
      <section className="border-b border-slate-200 bg-white">
        <div className="container py-12 lg:py-16">
          <div className="mb-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="eyebrow mb-4">Dashboard</p>
              <h1 className="heading-1 text-slate-900">Meine Mediationen</h1>
              <p className="mt-5 max-w-3xl text-lg text-slate-600">
                Übersicht Ihrer laufenden und abgeschlossenen Konflikte.
              </p>
            </div>

            <Link
              href="/dashboard/mediation/new"
              className="btn btn-primary h-fit"
            >
              + Neue Mediation
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((item) => (
              <article key={item.label} className="app-surface p-6">
                <p className="eyebrow">{item.label}</p>
                <p className="mt-3 text-4xl font-black text-slate-900">
                  {item.value}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-600">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-12 lg:py-16">
        <div className="space-y-6">
          {data.length === 0 ? (
            <div className="app-surface border border-dashed border-slate-300 p-12 text-center">
              <p className="text-lg text-slate-600">
                Sie haben noch keine Mediationen gestartet.
              </p>

              <Link
                href="/dashboard/mediation/new"
                className="btn btn-primary mt-6"
              >
                Neue Mediation starten
              </Link>
            </div>
          ) : (
            data.map((mediation) => {
              const config = statusConfig[mediation.status];

              return (
                <Link
                  key={mediation.id}
                  href={`/dashboard/${mediation.id}`}
                  className="app-surface block border border-slate-200 p-6 transition hover:border-emerald-200 hover:shadow-md lg:p-8"
                >
                  <div className="grid gap-8 md:grid-cols-[1fr_auto]">
                    <div>
                      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div>
                          <h2 className="heading-2 text-slate-900">
                            {mediation.title}
                          </h2>

                          <p className="mt-3 text-slate-600">
                            Phase:{" "}
                            <span className="font-semibold text-slate-900">
                              {mediation.phase}
                            </span>
                          </p>
                        </div>

                        <span
                          className={`inline-flex w-fit items-center rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wide ${config.className}`}
                        >
                          {config.label}
                        </span>
                      </div>

                      <div className="mt-6">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-600">
                            Fortschritt
                          </p>
                          <span className="text-sm font-bold text-slate-900">
                            {mediation.progress}%
                          </span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                            style={{ width: `${mediation.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <span className="btn btn-primary whitespace-nowrap">
                        Fortsetzen
                      </span>

                      <button
                        type="button"
                        className="btn btn-secondary whitespace-nowrap"
                        onClick={(event) => event.preventDefault()}
                      >
                        Phase weiter
                      </button>

                      <button
                        type="button"
                        className="btn btn-secondary whitespace-nowrap"
                        onClick={(event) => event.preventDefault()}
                      >
                        Abschließen
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
