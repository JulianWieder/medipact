"use client";

import { encodeId } from "@/lib/ids";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface Mediation {
  id: string | number;
  title?: string;
  phase?: string;
  status?: "active" | "pending" | "completed" | "draft";
  progress?: number;
  conflict_type?: string;
  description?: string;
  role?: string;
  is_my_turn?: boolean;
}

interface PendingInvite {
  invite_id: number;
  mediation_id: number;
  mediation_title: string;
  mediation_type: string;
  role: string;
  expires_at: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Laufend", className: "bg-accent-100 text-accent-800" },
  pending: { label: "Ausstehend", className: "bg-amber-100 text-amber-800" },
  draft: { label: "Entwurf", className: "bg-blue-100 text-blue-800" },
  completed: {
    label: "Abgeschlossen",
    className: "bg-neutral-100 text-neutral-800",
  },
};

const fallbackStatus = { label: "Unbekannt", className: "bg-neutral-100 text-neutral-500" };

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
  const [videoModalMediationId, setVideoModalMediationId] = useState<number | null>(null);
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
              role?: string;
              is_my_turn?: boolean;
            }) => ({
              id: item.mediation_id ?? item.id,
              title: item.title ?? "Neue Mediation",
              phase: item.phase ?? "Entwurf",
              status: item.status ?? "pending",
              progress: item.progress ?? 10,
              conflict_type: item.mediation_type,
              description: item.description,
              role: item.role,
              is_my_turn: item.is_my_turn ?? false,
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

      if (body.has_video) {
        setVideoModalMediationId(body.mediation_id);
        return;
      }

      router.push(`/dashboard/${encodeId(body.mediation_id)}`);
    } catch {
      setAcceptError("Server nicht erreichbar.");
    } finally {
      setAcceptingId(null);
    }
  }

  const stats = useMemo(
    () => [
      {
        label: "Deine Eingabe",
        value: data.filter((m) => m.is_my_turn).length,
        text: "wartet auf dich",
        highlight: data.some((m) => m.is_my_turn),
        highlightColor: "text-amber-600",
        borderColor: "border-amber-300 bg-amber-50/60 ring-1 ring-amber-300",
      },
      {
        label: "Warte auf Gegenpartei",
        value: data.filter((m) => m.status === "active" && !m.is_my_turn).length,
        text: "Ball liegt bei der anderen Seite",
        highlight: false,
        highlightColor: "text-neutral-900",
        borderColor: "",
      },
      {
        label: "Ausstehend",
        value: data.filter((m) => m.status === "pending" || m.status === "draft").length,
        text: "noch nicht gestartet",
        highlight: false,
        highlightColor: "text-neutral-900",
        borderColor: "",
      },
      {
        label: "Abgeschlossen",
        value: data.filter((m) => m.status === "completed").length,
        text: "beendete Verfahren",
        highlight: false,
        highlightColor: "text-neutral-900",
        borderColor: "",
      },
    ],
    [data],
  );

  if (loading) {
    return (
      <main className="app-shell pt-[73px]">
        <section className="container py-12">
          <p className="text-neutral-600">Mediationen werden geladen...</p>
        </section>
      </main>
    );
  }

  return (
    <>
    <main className="app-shell pt-[73px]">
      <section className="border-b border-neutral-200 bg-white">
        <div className="container py-12 lg:py-16">
          <div className="mb-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="eyebrow mb-4">Dashboard</p>
              <h1 className="heading-1 text-neutral-900">Meine Mediationen</h1>
              <p className="mt-5 max-w-3xl text-lg text-neutral-600">
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

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <article
                key={item.label}
                className={`app-surface p-6 ${item.borderColor}`}
              >
                <p className="eyebrow">{item.label}</p>
                <p className={`mt-3 text-4xl font-black ${item.highlightColor}`}>
                  {item.value}
                </p>
                <p className="mt-2 text-sm font-semibold text-neutral-600">
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
              <h2 className="text-xl font-bold text-neutral-900">
                Eingehende Mediationsanfragen
              </h2>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                {invites.length}
              </span>
            </div>
            <p className="mb-6 text-sm text-neutral-600">
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
                      <span className="text-xs text-neutral-500">
                        {typeLabel[invite.mediation_type] ?? invite.mediation_type}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-neutral-900">
                      {invite.mediation_title}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-600">
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

            <div className="mt-6 border-t border-neutral-200" />
          </div>
        )}

        {/* ── Meine Mediationen ─────────────────────────────────────── */}
        <div className="space-y-6">
          {data.length === 0 ? (
            <div className="app-surface border border-dashed border-neutral-300 p-12 text-center">
              <p className="text-lg text-neutral-600">
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
              const config = statusConfig[status] ?? fallbackStatus;
              const isActive = status === "active";
              const waitingForOther = isActive && !mediation.is_my_turn;

              return (
                <Link
                  key={`mediation-${mediation.id}`}
                  href={`/dashboard/${encodeId(Number(mediation.id))}`}
                  className={`app-surface block border p-6 transition hover:shadow-md lg:p-8 ${
                    mediation.is_my_turn
                      ? "border-amber-300 hover:border-amber-400"
                      : waitingForOther
                      ? "border-neutral-200 hover:border-neutral-300"
                      : "border-neutral-200 hover:border-accent-200"
                  }`}
                >
                  <div className="grid gap-8 md:grid-cols-[1fr_auto]">
                    <div>
                      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div>
                          <h2 className="heading-2 text-neutral-900">
                            {mediation.title ||
                              mediation.conflict_type ||
                              "Neue Mediation"}
                          </h2>

                          <p className="mt-3 text-neutral-600">
                            Phase:{" "}
                            <span className="font-semibold text-neutral-900">
                              {mediation.phase || "Entwurf"}
                            </span>
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`inline-flex w-fit items-center rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wide ${config.className}`}
                          >
                            {config.label}
                          </span>
                          {mediation.is_my_turn && (
                            <span className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-700">
                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                              Deine Eingabe
                            </span>
                          )}
                          {waitingForOther && (
                            <span className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                              <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                              </svg>
                              Warte auf Gegenpartei
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-sm font-semibold text-neutral-600">
                            Fortschritt
                          </p>
                          <span className="text-sm font-bold text-neutral-900">
                            {mediation.progress ?? 0}%
                          </span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-neutral-200">
                          <div
                            className="h-full rounded-full bg-accent-600 transition-all duration-500"
                            style={{ width: `${mediation.progress ?? 0}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <span className={`whitespace-nowrap ${mediation.is_my_turn ? "btn btn-primary" : waitingForOther ? "btn btn-secondary" : "btn btn-primary"}`}>
                        {mediation.is_my_turn ? "Eingabe machen →" : waitingForOther ? "Ansehen" : "Fortsetzen"}
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

    {videoModalMediationId !== null && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/70 p-4">
        <div className="app-surface w-full max-w-2xl p-6">
          <p className="eyebrow mb-2">Einladung angenommen</p>
          <h2 className="heading-3 mb-3 text-neutral-900">
            Die andere Seite hat dir eine persönliche Video-Botschaft hinterlassen
          </h2>
          <div className="mt-4 overflow-hidden rounded-2xl bg-neutral-900">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              src={`/api/mediations/${videoModalMediationId}/invites/me/video`}
              className="aspect-video w-full"
              controls
              autoPlay
            />
          </div>
          <button
            type="button"
            onClick={() => {
              const id = videoModalMediationId;
              setVideoModalMediationId(null);
              router.push(`/dashboard/${encodeId(id as number)}`);
            }}
            className="btn btn-primary mt-6"
          >
            Weiter zur Mediation →
          </button>
        </div>
      </div>
    )}
    </>
  );
}
