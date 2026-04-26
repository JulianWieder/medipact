"use client";

import Link from "next/link";
import { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

interface Mediation {
  id: string;
  title: string;
  parties: string[];
  status: "active" | "pending" | "completed";
  progress: number;
  lastUpdate: string;
  nextStep: string;
}

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "completed":
        return "bg-slate-100 text-slate-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Laufend";
      case "pending":
        return "Ausstehend";
      case "completed":
        return "Abgeschlossen";
      default:
        return status;
    }
  };

  return (
    <>
      <Header
        logoText="medipact"
        ctaText="Abmelden"
        ctaLink="/"
        isDark={false}
      />

      <main className="min-h-screen bg-slate-50 pt-[73px]">
        {/* Hero Section */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
            <div className="flex items-center justify-between gap-8 mb-10">
              <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                  Meine Mediationen
                </h1>
                <p className="mt-4 text-lg text-slate-600 max-w-3xl">
                  Übersicht aller Ihrer laufenden und abgeschlossenen Konflikte.
                  Jeder Status gibt Ihnen eine klare Richtung für die nächsten
                  Schritte.
                </p>
              </div>
              <Link
                href="/mediation/new"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-8 py-4 text-base font-bold text-white transition hover:bg-emerald-700 hover:scale-[1.02] whitespace-nowrap h-fit"
              >
                + Neue Mediation
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6">
                <div className="text-3xl font-black text-emerald-600">3</div>
                <p className="mt-2 text-sm font-semibold text-slate-600">
                  Gesamt Mediationen
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6">
                <div className="text-3xl font-black text-amber-600">1</div>
                <p className="mt-2 text-sm font-semibold text-slate-600">
                  Ausstehend
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6">
                <div className="text-3xl font-black text-emerald-600">2</div>
                <p className="mt-2 text-sm font-semibold text-slate-600">
                  Laufend / Abgeschlossen
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mediations List */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <div className="space-y-6">
            {mediations.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                <p className="text-lg text-slate-600">
                  Sie haben noch keine Mediationen gestartet.
                </p>
                <Link
                  href="/mediation/new"
                  className="mt-6 inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  Neue Mediation starten
                </Link>
              </div>
            ) : (
              mediations.map((mediation) => (
                <div
                  key={mediation.id}
                  className="rounded-2xl border border-slate-200 bg-white p-8 transition hover:shadow-lg hover:border-emerald-200"
                >
                  <div className="grid gap-8 md:grid-cols-[1fr_auto]">
                    {/* Left Side */}
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-2xl font-black text-slate-900">
                            {mediation.title}
                          </h3>
                          <p className="mt-2 text-slate-600">
                            Konfliktparteien:{" "}
                            <span className="font-semibold">
                              {mediation.parties.join(" & ")}
                            </span>
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusColor(
                            mediation.status,
                          )}`}
                        >
                          {getStatusText(mediation.status)}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-6">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-600">
                            Fortschritt
                          </p>
                          <span className="text-sm font-bold text-slate-900">
                            {mediation.progress}%
                          </span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                            style={{ width: `${mediation.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Details */}
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase text-slate-500">
                            Nächster Schritt
                          </p>
                          <p className="mt-2 font-semibold text-slate-900">
                            {mediation.nextStep}
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase text-slate-500">
                            Zuletzt aktualisiert
                          </p>
                          <p className="mt-2 font-semibold text-slate-900">
                            {mediation.lastUpdate}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Actions */}
                    <div className="flex flex-col gap-3">
                      <Link
                        href={`/mediation/${mediation.id}`}
                        className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 hover:scale-[1.02] whitespace-nowrap"
                      >
                        Fortsetzen
                      </Link>
                      <button className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 whitespace-nowrap">
                        Details
                      </button>
                      {mediation.status === "completed" && (
                        <Link
                          href={`/mediation/${mediation.id}/agreement`}
                          className="inline-flex items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 whitespace-nowrap"
                        >
                          Vereinbarung
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
          <h2 className="text-3xl font-black text-slate-900 mb-12">
            Häufige Fragen zum Dashboard
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Wie kann ich einen Konflikt eskalieren?",
                a: "Sie können jederzeit auf das Hybrid-Modell upgraden und einen menschlichen Mediator hinzuziehen. Das machen Sie direkt über die Mediation-Details.",
              },
              {
                q: "Kann ich meine Daten exportieren?",
                a: "Ja. Am Ende der Mediation können Sie alle Dokumente und die rechtlich bindende Vereinbarung herunterladen.",
              },
              {
                q: "Wer sieht meine Daten?",
                a: "Nur Sie und Ihre Konfliktpartei sehen die Details. medipact als Mediator hat Zugriff, hält aber strikte Vertraulichkeit.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-slate-300"
              >
                <h3 className="font-bold text-slate-900">{faq.q}</h3>
                <p className="mt-3 text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer
        brandName="medipact"
        tagline="Konflikte lösen, nicht eskalieren."
        isDark={false}
        email="hallo@medipact.de"
      />
    </>
  );
}
