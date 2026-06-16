"use client";

import { hashId } from "@/lib/ids";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  mediationId: string;
  userRole: string;
  currentUserName?: string;
  initialIsPaid?: boolean;
};

type Participant = {
  id: string;
  name: string;
  role: string;
  invitationStatus: "accepted" | "pending";
};

const roleLabel: Record<string, string> = {
  initiator: "Antragsteller",
  other_party: "Andere Seite",
  mediator: "Mediator",
  owner: "Antragsteller",
};

export default function MediationClient({ mediationId, currentUserName, initialIsPaid = false }: Props) {
  const router = useRouter();
  const [inviteUrl, setInviteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isPaid, setIsPaid] = useState(initialIsPaid);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    async function loadParticipants() {
      try {
        const res = await fetch(`/api/mediations/${mediationId}/participants`);
        if (res.ok) {
          const data: Participant[] = await res.json();
          setParticipants(data);

          // Andere Partei direkt zur emotionalen Einleitung weiterleiten
          if (currentUserName) {
            const me = data.find((p) => p.name === currentUserName);
            if (me?.role === "other_party") {
              router.replace(`/dashboard/${hashId(mediationId)}/einleitung`);
              return;
            }
          }
        }
      } catch {
        // Fehler beim Laden still ignorieren
      }
    }
    loadParticipants();
  }, [mediationId, currentUserName, router]);

  const hasOtherParty = participants.some(
    (p) => p.role === "other_party" && p.invitationStatus === "accepted",
  );

  async function createInvite() {
    setLoading(true);
    setError("");

    const trimmedEmail = email.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (!isValidEmail) {
      setError("Bitte gib eine gültige E-Mail-Adresse ein.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/mediations/${mediationId}/invites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invited_email: trimmedEmail }),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        const raw = errorBody?.detail ?? errorBody?.error;
        const detail = Array.isArray(raw)
          ? raw.map((e: { msg?: string }) => e.msg ?? JSON.stringify(e)).join(", ")
          : (raw ?? "Unbekannter Fehler");
        setError(`Einladung fehlgeschlagen (${res.status}): ${detail}`);
        return;
      }

      const data = await res.json();
      setInviteUrl(data.invite_url);

      const participantsRes = await fetch(`/api/mediations/${mediationId}/participants`);
      if (participantsRes.ok) {
        setParticipants(await participantsRes.json());
      }
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setLoading(false);
    }
  }

  async function payNow() {
    setPaying(true);
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/pay`, {
        method: "POST",
      });
      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        const raw = errorBody?.detail ?? errorBody?.error;
        const detail = Array.isArray(raw)
          ? raw.map((e: { msg?: string }) => e.msg ?? JSON.stringify(e)).join(", ")
          : (raw ?? "Unbekannter Fehler");
        setError(`Zahlung fehlgeschlagen (${res.status}): ${detail}`);
        return;
      }
      setIsPaid(true);
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setPaying(false);
    }
  }

  async function startMediation() {
    setAdvancing(true);
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active", phase: "einleitung" }),
      });
      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        const raw = errorBody?.detail ?? errorBody?.error;
        const detail = Array.isArray(raw)
          ? raw.map((e: { msg?: string }) => e.msg ?? JSON.stringify(e)).join(", ")
          : (raw ?? "Unbekannter Fehler");
        setError(`Fehler beim Starten (${res.status}): ${detail}`);
        return;
      }
      router.push(`/dashboard/${hashId(mediationId)}/einleitung`);
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setAdvancing(false);
    }
  }

  async function copyInviteLink() {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="app-shell pt-[73px]">
      <section className="container py-12">
        <div className="app-surface p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="eyebrow mb-3">Mediation vorbereiten</p>
              <h1 className="heading-2 text-slate-900">Beteiligte</h1>
              <p className="mt-4 max-w-2xl text-slate-600">
                Damit die Mediation starten kann, müssen alle Beteiligten dem
                Verfahren beitreten.
              </p>
            </div>
            <div className="mt-8 space-y-3">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="card-muted flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-900">{participant.name}</p>
                    <p className="text-sm text-slate-500">{participant.role}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      participant.invitationStatus === "accepted"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {participant.invitationStatus === "accepted"
                      ? "Verbunden"
                      : "Wartet auf Bestätigung"}
                  </span>
                </div>
              ))}
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
              ID: {mediationId}
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {participants.map((person) => (
              <div
                key={person.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{person.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{roleLabel[person.role]}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      person.invitationStatus === "accepted"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {person.invitationStatus === "accepted" ? "Verbunden" : "Wartet auf Bestätigung"}
                  </span>
                </div>
              </div>
            ))}

            {!hasOtherParty && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <p className="font-semibold text-slate-900">Andere Seite</p>
                <p className="mt-1 text-sm text-slate-500">Noch nicht verbunden</p>
              </div>
            )}
          </div>

          {/* Bereit zum Starten: erst bezahlen, dann starten */}
          {hasOtherParty && !isPaid && (
            <div className="mt-10 rounded-3xl border-2 border-emerald-400 bg-white p-8 shadow-lg shadow-emerald-100/60">
              <div className="text-center">
                <p className="text-sm font-semibold text-emerald-800 mb-1">Alle Beteiligten sind verbunden</p>
                <h2 className="text-xl font-bold text-slate-900">Mediation freischalten</h2>
                <p className="mt-2 max-w-xl mx-auto text-sm text-slate-600">
                  Bevor Phase 1 startet, ist eine einmalige Zahlung erforderlich.
                </p>

                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mt-6 mb-2">
                  Vollständiger Zugang
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-extrabold text-slate-900 tracking-tight">79</span>
                  <span className="text-2xl font-bold text-slate-900">€</span>
                </div>
                <p className="text-slate-400 text-sm mt-1">
                  einmalig · pro Mediationsfall · inkl. MwSt.
                </p>

                {/* TODO: Stripe-Checkout hier integrieren */}
                <button
                  type="button"
                  onClick={payNow}
                  disabled={paying}
                  className="mt-6 w-full max-w-sm mx-auto block rounded-2xl bg-emerald-600 px-6 py-4 text-base font-bold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {paying ? "Wird verarbeitet..." : "Jetzt bezahlen & Phase 1 starten →"}
                </button>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
                  {["🔒 SSL-verschlüsselt", "⚡ Sofortiger Zugang", "📞 Support inklusive"].map(
                    (badge) => (
                      <span key={badge} className="text-xs text-slate-400">
                        {badge}
                      </span>
                    )
                  )}
                </div>
              </div>
              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-700">{error}</p>
                </div>
              )}
            </div>
          )}

          {hasOtherParty && isPaid && (
            <div className="mt-10 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-800">Zahlung erhalten</p>
                  <h2 className="mt-2 text-xl font-bold text-slate-900">Mediation starten</h2>
                  <p className="mt-2 max-w-xl text-sm text-slate-600">
                    Alle Parteien haben dem Verfahren beigetreten. Du kannst die Mediation jetzt starten.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={startMediation}
                  disabled={advancing}
                  className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {advancing ? "Wird gestartet..." : "Weiter →"}
                </button>
              </div>
              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-700">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Einladung erstellen */}
          {!hasOtherParty && (
            <div className="mt-10 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-800">Nächster Schritt</p>
                  <h2 className="mt-2 text-xl font-bold text-slate-900">Andere Seite einladen</h2>
                  <p className="mt-2 max-w-xl text-sm text-slate-600">
                    Erstelle einen sicheren Einladungslink. Die andere Seite kann damit dem Verfahren beitreten.
                  </p>
                </div>

                {!inviteUrl && (
                  <div className="w-full max-w-md">
                    <label htmlFor="invite-email" className="text-sm font-semibold text-slate-900">
                      E-Mail-Adresse
                    </label>
                    <input
                      id="invite-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    />
                    <button
                      type="button"
                      onClick={createInvite}
                      disabled={loading || !email.trim()}
                      className="btn btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? "Wird erstellt..." : "Einladung erstellen"}
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-700">{error}</p>
                </div>
              )}

              {inviteUrl && (
                <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Einladung ist bereit</p>
                      <p className="mt-1 text-sm text-slate-500">Kopiere den Link und sende ihn an die andere Seite.</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Aktiv</span>
                  </div>
                  <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="break-all font-mono text-sm text-slate-700">{inviteUrl}</p>
                  </div>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button type="button" onClick={copyInviteLink} className="btn btn-primary">
                      {copied ? "Kopiert ✓" : "Link kopieren"}
                    </button>
                    <button type="button" onClick={() => window.open(inviteUrl, "_blank")} className="btn btn-secondary">
                      Link öffnen
                    </button>
                    <button type="button" onClick={createInvite} disabled={loading} className="btn btn-ghost disabled:cursor-not-allowed disabled:opacity-60">
                      Neu erstellen
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
