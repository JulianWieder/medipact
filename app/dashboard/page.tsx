"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

interface Mediation {
  id: string;
  title: string;
  parties: string[];
  status: "active" | "pending" | "completed";
  progress: number;
  lastUpdate: string;
  nextStep: string;
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

export default function DashboardPage() {
  const [mediations] = useState<Mediation[]>([
    {
      id: "1",
      title: "Erbschaftsstreit Familie Weber",
      parties: ["Petra Weber", "Klaus Weber"],
      status: "active",
      progress: 65,
      lastUpdate: "vor 2 Stunden",
      nextStep: "Interessensanalyse Phase 2",
    },
    {
      id: "2",
      title: "Nachbarschaftskonflikt",
      parties: ["Anna Schmidt", "Thomas Müller"],
      status: "pending",
      progress: 20,
      lastUpdate: "vor 1 Tag",
      nextStep: "Erste Befragung durchführen",
    },
    {
      id: "3",
      title: "Geschäftspartner-Auflösung",
      parties: ["Carla Romano", "Marco Finzi"],
      status: "completed",
      progress: 100,
      lastUpdate: "vor 5 Tagen",
      nextStep: "Vereinbarung unterzeichnet",
    },
  ]);

  const stats = useMemo(
    () => [
      {
        label: "Gesamt",
        value: mediations.length,
        text: "Mediationen",
      },
      {
        label: "Laufend",
        value: mediations.filter((item) => item.status === "active").length,
        text: "aktive Verfahren",
      },
      {
        label: "Ausstehend",
        value: mediations.filter((item) => item.status === "pending").length,
        text: "offene Starts",
      },
    ],
    [mediations],
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
                Übersicht aller laufenden und abgeschlossenen Konflikte. Jeder
                Status gibt Ihnen eine klare Richtung für die nächsten Schritte.
              </p>
            </div>

            <Link href="/mediation/new" className="btn btn-primary h-fit">
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
          {mediations.length === 0 ? (
            <div className="app-surface border border-dashed border-slate-300 p-12 text-center">
              <p className="text-lg text-slate-600">
                Sie haben noch keine Mediationen gestartet.
              </p>

              <Link href="/mediation/new" className="btn btn-primary mt-6">
                Neue Mediation starten
              </Link>
            </div>
          ) : (
            mediations.map((mediation) => {
              const config = statusConfig[mediation.status];

              return (
                <article
                  key={mediation.id}
                  className="app-surface border border-slate-200 p-6 transition hover:border-emerald-200 hover:shadow-md lg:p-8"
                >
                  <div className="grid gap-8 md:grid-cols-[1fr_auto]">
                    <div>
                      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div>
                          <h2 className="heading-2 text-slate-900">
                            {mediation.title}
                          </h2>

                          <p className="mt-3 text-slate-600">
                            Konfliktparteien:{" "}
                            <span className="font-semibold text-slate-900">
                              {mediation.parties.join(" & ")}
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

                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="app-surface-muted p-4">
                          <p className="eyebrow">Nächster Schritt</p>
                          <p className="mt-2 font-semibold text-slate-900">
                            {mediation.nextStep}
                          </p>
                        </div>

                        <div className="app-surface-muted p-4">
                          <p className="eyebrow">Zuletzt aktualisiert</p>
                          <p className="mt-2 font-semibold text-slate-900">
                            {mediation.lastUpdate}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Link
                        href={`/mediation/${mediation.id}`}
                        className="btn btn-primary whitespace-nowrap"
                      >
                        Fortsetzen
                      </Link>

                      <button className="btn btn-secondary whitespace-nowrap">
                        Details
                      </button>

                      {mediation.status === "completed" && (
                        <Link
                          href={`/mediation/${mediation.id}/agreement`}
                          className="btn border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        >
                          Vereinbarung
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      <section className="container max-w-4xl pb-20">
        <div className="app-surface p-6 lg:p-8">
          <p className="eyebrow mb-3">Hilfe</p>

          <h2 className="heading-2 text-slate-900">
            Häufige Fragen zum Dashboard
          </h2>

          <div className="mt-8 space-y-4">
            {[
              {
                q: "Wie kann ich einen Konflikt eskalieren?",
                a: "Sie können jederzeit auf das Hybrid-Modell upgraden und einen menschlichen Mediator hinzuziehen.",
              },
              {
                q: "Kann ich meine Daten exportieren?",
                a: "Ja. Am Ende der Mediation können Sie alle Dokumente und die Vereinbarung herunterladen.",
              },
              {
                q: "Wer sieht meine Daten?",
                a: "Nur die beteiligten Parteien und berechtigte Mediatorinnen oder Mediatoren sehen die Falldetails.",
              },
            ].map((faq) => (
              <article key={faq.q} className="app-surface-muted p-5">
                <h3 className="heading-3">{faq.q}</h3>
                <p className="mt-3 text-slate-600">{faq.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
