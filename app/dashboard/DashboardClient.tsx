"use client";

import { encodeId } from "@/lib/ids";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PremiumHero, PillButton, ArrowLink, ThinProgressBar, OutlinePill, PremiumCard } from "@/app/components/ui/premium";

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
  active: { label: "Laufend", className: "border-accent-300 text-accent-700" },
  pending: { label: "Ausstehend", className: "border-amber-300 text-amber-700" },
  draft: { label: "Entwurf", className: "border-sky-300 text-sky-700" },
  completed: {
    label: "Abgeschlossen",
    className: "border-neutral-300 text-neutral-600",
  },
};

const fallbackStatus = { label: "Unbekannt", className: "border-neutral-300 text-neutral-500" };

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
        sub: "wartet auf dich",
        highlight: data.some((m) => m.is_my_turn),
      },
      {
        label: "Warte auf Gegenpartei",
        value: data.filter((m) => m.status === "active" && !m.is_my_turn).length,
        sub: "Ball liegt bei der anderen Seite",
      },
      {
        label: "Ausstehend",
        value: data.filter((m) => m.status === "pending" || m.status === "draft").length,
        sub: "noch nicht gestartet",
      },
      {
        label: "Abgeschlossen",
        value: data.filter((m) => m.status === "completed").length,
        sub: "beendete Verfahren",
      },
    ],
    [data],
  );

  if (loading) {
    return (
      <main className="app-shell pt-[73px]">
        <section className="container flex h-[60vh] items-center justify-center">
          <p className="text-sm font-light text-neutral-400">Mediationen werden geladen…</p>
        </section>
      </main>
    );
  }

  return (
    <>
    <main className="app-shell pt-[73px]">
      <PremiumHero
        variant="bleed"
        eyebrow="Dashboard"
        title="Meine Mediationen"
        subtitle="Übersicht Ihrer laufenden und abgeschlossenen Konflikte."
        stats={stats}
        action={
          <PillButton href="/dashboard/mediation/new" tone="light">
            Neue Mediation
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </PillButton>
        }
      />

      <section className="container py-16 lg:py-20">
        {/* ── Eingehende Mediationsanfragen ─────────────────────────── */}
        {invites.length > 0 && (
          <div className="mb-14">
            <div className="mb-1 flex items-center gap-3">
              <h2 className="font-display text-xl font-medium text-neutral-900">
                Eingehende Mediationsanfragen
              </h2>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold text-white">
                {invites.length}
              </span>
            </div>
            <p className="mb-6 text-sm font-light text-neutral-500">
              Du wurdest zu folgenden Mediationsverfahren eingeladen. Nimm die
              Einladung an, um beizutreten.
            </p>

            <div className="space-y-3">
              {invites.map((invite) => (
                <div
                  key={invite.invite_id}
                  className="flex flex-col gap-4 rounded-2xl border border-amber-200/70 bg-amber-50/30 p-6 transition-shadow duration-300 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="mb-1.5 flex items-center gap-2">
                      <OutlinePill label="Einladung" className="border-amber-300/70 text-amber-700" />
                      <span className="text-xs text-neutral-500">
                        {typeLabel[invite.mediation_type] ?? invite.mediation_type}
                      </span>
                    </div>
                    <h3 className="font-display text-base font-medium text-neutral-900">
                      {invite.mediation_title}
                    </h3>
                    <p className="mt-1 text-sm font-light text-neutral-500">
                      Deine Rolle:{" "}
                      <span className="font-medium text-neutral-700">
                        {roleLabel[invite.role] ?? invite.role}
                      </span>
                    </p>
                  </div>

                  <PillButton
                    onClick={() => acceptInvite(invite)}
                    disabled={acceptingId === invite.invite_id}
                  >
                    {acceptingId === invite.invite_id
                      ? "Wird angenommen…"
                      : "Einladung annehmen"}
                  </PillButton>
                </div>
              ))}
            </div>

            {acceptError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-700">{acceptError}</p>
              </div>
            )}

            <div className="mt-10 hairline" />
          </div>
        )}

        {/* ── Meine Mediationen ─────────────────────────────────────── */}
        <div className="space-y-3">
          {data.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 p-16 text-center">
              <p className="text-lg font-light text-neutral-500">
                Sie haben noch keine Mediationen gestartet.
              </p>

              <PillButton href="/dashboard/mediation/new" className="mt-6">
                Neue Mediation starten →
              </PillButton>
            </div>
          ) : (
            data.map((mediation) => {
              const status = mediation.status ?? "pending";
              const config = statusConfig[status] ?? fallbackStatus;
              const isActive = status === "active";
              const waitingForOther = isActive && !mediation.is_my_turn;

              return (
                <PremiumCard
                  key={`mediation-${mediation.id}`}
                  href={`/dashboard/${encodeId(Number(mediation.id))}`}
                  emphasis={mediation.is_my_turn ? "amber" : "neutral"}
                >
                  <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div>
                          <h2 className="font-display text-2xl font-medium tracking-tight text-neutral-900">
                            {mediation.title ||
                              mediation.conflict_type ||
                              "Neue Mediation"}
                          </h2>

                          <p className="mt-2.5 text-sm font-light text-neutral-500">
                            Phase:{" "}
                            <span className="font-medium text-neutral-700">
                              {mediation.phase || "Entwurf"}
                            </span>
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <OutlinePill label={config.label} className={config.className} />
                          {mediation.is_my_turn && (
                            <OutlinePill
                              label="Deine Eingabe"
                              className="border-amber-300 text-amber-700"
                              dot="animate-pulse bg-amber-500"
                            />
                          )}
                          {waitingForOther && (
                            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
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
                          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                            Fortschritt
                          </p>
                          <span className="text-sm font-semibold text-neutral-900">
                            {mediation.progress ?? 0}%
                          </span>
                        </div>

                        <ThinProgressBar value={mediation.progress ?? 0} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 md:items-end">
                      <ArrowLink>
                        {mediation.is_my_turn ? "Eingabe machen" : waitingForOther ? "Ansehen" : "Fortsetzen"}
                      </ArrowLink>
                    </div>
                  </div>
                </PremiumCard>
              );
            })
          )}
        </div>
      </section>
    </main>

    {videoModalMediationId !== null && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/80 p-4 backdrop-blur-sm">
        <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">
          <p className="eyebrow mb-3">Einladung angenommen</p>
          <h2 className="font-display text-xl font-medium text-neutral-900">
            Die andere Seite hat dir eine persönliche Video-Botschaft hinterlassen
          </h2>
          <div className="mt-5 overflow-hidden rounded-2xl bg-neutral-900">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              src={`/api/mediations/${videoModalMediationId}/invites/me/video`}
              className="aspect-video w-full"
              controls
              autoPlay
            />
          </div>
          <PillButton
            onClick={() => {
              const id = videoModalMediationId;
              setVideoModalMediationId(null);
              router.push(`/dashboard/${encodeId(id as number)}`);
            }}
            className="mt-6"
          >
            Weiter zur Mediation →
          </PillButton>
        </div>
      </div>
    )}
    </>
  );
}
