"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface Mediation {
  id: string | number;
  title?: string;
  phase?: string;
  status?: "active" | "pending" | "completed";
  progress?: number;
  conflict_type?: string;
  description?: string;
}

interface PendingInvite {
  invite_id: number;
  mediation_id: number;
  mediation_title: string;
  mediation_type: string;
  role: string;
  expires_at: string;
}

const statusConfig = {
  active: { label: "Laufend", className: "bg-emerald-100 text-emerald-800" },
  pending: { label: "Ausstehend", className: "bg-amber-100 text-amber-800" },
  completed: {
    label: "Abgeschlossen",
    className: "bg-slate-100 text-slate-800",
  },
};

const roleLabel: Record<string, string> = {
  other_party: "Gegenpartei",
  mediator: "Mediator",
  owner: "Antragsteller",
  initiator: "Antragsteller",
};

const typeLabel: Record<string, string> = {
  trennung: "Trennung & Scheidung",
  erbschaft: "Erbschaftsstreit",
  nachbarschaft: "Nachbarschaftskonflikt",
};

export default function DashboardClient() {
  const [data, setData] = useState<Mediation[]>([]);
  const [invites, setInvites] = useState<PendingInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<number | null>(null);
  const [acceptError, setAcceptError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const [mediationsRes, invitesRes] = await Promise.all([
          fetch("/api/mediations/me"),
          fetch("/api/invites/me"),
        ]);

        if (!mediationsRes.ok) {
          if (mediationsRes.status === 401) {
            router.push("/auth/login");
            return;
          }
          console.error("Fehler beim Laden", mediationsRes.status);
        } else {
          const raw = await mediationsRes.json();
          const mapped = (raw ?? []).map(
            (item: {
              id?: number;
              mediation_id?: number;
              title?: string;
              phase?: string;
              status?: string;
              progress?: number;
              mediation_type?: string;
              description?: string;
            }) => ({
              id: item.mediation_id ?? item.id,
              title: item.title ?? "Neue Mediation",
              phase: item.phase ?? "Entwurf",
              status: item.status ?? "pending",
              progress: item.progress ?? 10,
              conflict_type: item.mediation_type,
              description: item.description,
            }),
          );
          setData(mapped);
        }

        if (invitesRes.ok) {
          setInvites(await invitesRes.json());
        }
      } catch (error) {
        console.error("Server nicht erreichbar", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function acceptInvite(invite: PendingInvite) {
    setAcceptingId(invite.invite_id);
    setAcceptError("");
    try {
      const res = await fetch(`/api/invites/${invite.invite_id}/accept`, {
        method: "POST",
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        const raw = body?.detail ?? body?.error ?? "Unbekannter Fehler";
        setAcceptError(typeof raw === "string" ? raw : JSON.stringify(raw));
        return;
      }
      // Remove from invites list and navigate to the mediation
      setInvites((prev) => prev.filter((i) => i.invite_id !== invite.invite_id));
      router.push(`/dashboard/${body.mediation_id}`);
    } catch {
      setAcceptError("Server nicht erreichbar.");
    } finally {
      setAcceptingId(null);
    }
  }

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

  if (loading) {
    return (
      <main className="app-shell pt-[73px]">
        <section className="container py-12">
          <p className="text-slate-600">Mediationen werden geladen...</p>
        </section>
      </main>
    );
  }

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
        {/* ── Eingehende Mediationsanfragen ─────────────────────────── */}
        {invites.length > 0 && (
          <div className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">
                Eingehende Mediationsanfragen
              </h2>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                {invites.length}
              </span>
            </div>
            <p className="mb-6 text-sm text-slate-600">
              Du wurdest zu folgenden Mediationsverfahren eingeladen. Nimm die
              Einladung an, um beizutreten.
            </p>

            <div className="space-y-4">
              {invites.map((invite) => (
                <div
                  key={invite.invite_id}
                  className="app-surface flex flex-col gap-4 border border-amber-200 bg-amber-50/40 p-6 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                        Einladung
                      </span>
                      <span className="text-xs text-slate-500">
                        {typeLabel[invite.mediation_type] ?? invite.mediation_type}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {invite.mediation_title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Deine Rolle:{" "}
                      <span className="font-semibold">
                        {roleLabel[invite.role] ?? invite.role}
                      </span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => acceptInvite(invite)}
                    disabled={acceptingId === invite.invite_id}
                    className="btn btn-primary whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {acceptingId === invite.invite_id
                      ? "Wird angenommen..."
                      : "Einladung annehmen"}
                  </button>
                </div>
              ))}
            </div>

            {acceptError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-700">{acceptError}</p>
              </div>
            )}

            <div className="mt-6 border-t border-slate-200" />
          </div>
        )}

        {/* ── Meine Mediationen ─────────────────────────────────────── */}
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
              const status = mediation.status ?? "pending";
              const config = statusConfig[status];

              return (
                <Link
                  key={`mediation-${mediation.id}`}
                  href={`/dashboard/${mediation.id}`}
                  className="app-surface block border border-slate-200 p-6 transition hover:border-emerald-200 hover:shadow-md lg:p-8"
                >
                  <div className="grid gap-8 md:grid-cols-[1fr_auto]">
                    <div>
                      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div>
                          <h2 className="heading-2 text-slate-900">
                            {mediation.title ||
                              mediation.conflict_type ||
                              "Neue Mediation"}
                          </h2>

                          <p className="mt-3 text-slate-600">
                            Phase:{" "}
                            <span className="font-semibold text-slate-900">
                              {mediation.phase || "Entwurf"}
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
                            {mediation.progress ?? 0}%
                          </span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                            style={{ width: `${mediation.progress ?? 0}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <span className="btn btn-primary whitespace-nowrap">
                        Fortsetzen
                      </span>
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
