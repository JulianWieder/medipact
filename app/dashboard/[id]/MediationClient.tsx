"use client";

import { useState } from "react";

type Props = {
  mediationId: string;
};

type Participant = {
  id: string;
  name: string;
  role: "initiator" | "other_party" | "mediator";
  status: "active" | "invited" | "pending";
};

const roleLabel = {
  initiator: "Antragsteller",
  other_party: "Andere Seite",
  mediator: "Mediator",
};

const statusLabel = {
  active: "Aktiv",
  invited: "Eingeladen",
  pending: "Ausstehend",
};
export default function MediationClient({ mediationId }: Props) {
  const [inviteUrl, setInviteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const [participants, setParticipants] = useState<Participant[]>([]);

  const hasOtherParty = participants.some(
    (participant) => participant.role === "other_party",
  );

  const isReady = hasOtherParty;

  async function createInvite() {
    setLoading(true);
    setError("");
    setCopied(false);

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invited_email: trimmedEmail,
        }),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        const raw = errorBody?.detail ?? errorBody?.error;
        const detail = Array.isArray(raw)
          ? raw.map((e: { msg?: string }) => e.msg ?? JSON.stringify(e)).join(", ")
          : (raw ?? "Unbekannter Fehler");
        console.error("Invite error:", res.status, errorBody);
        setError(`Einladung fehlgeschlagen (${res.status}): ${detail}`);
        return;
      }

      const data = await res.json();
      setInviteUrl(data.invite_url);
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setLoading(false);
    }
  }

  async function copyInviteLink() {
    if (!inviteUrl) return;

    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <main className="app-shell pt-[73px]">
      <section className="container py-12">
        <div className="app-surface p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="eyebrow mb-3">Mediation vorbereiten</p>

              <h1 className="heading-2 text-slate-900">Beteiligte verbinden</h1>

              <p className="mt-4 max-w-2xl text-slate-600">
                Beide Seiten müssen dem Verfahren zugeordnet sein, bevor die
                Mediation starten kann.
              </p>
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
                    <p className="font-semibold text-slate-900">
                      {person.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {roleLabel[person.role]}
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {statusLabel[person.status]}
                  </span>
                </div>
              </div>
            ))}

            {!hasOtherParty && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <p className="font-semibold text-slate-900">Andere Seite</p>

                <p className="mt-1 text-sm text-slate-500">
                  Noch nicht verbunden
                </p>
              </div>
            )}
          </div>

          {!isReady && (
            <div className="mt-10 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-800">
                    Nächster Schritt
                  </p>

                  <h2 className="mt-2 text-xl font-bold text-slate-900">
                    Andere Seite einladen
                  </h2>

                  <p className="mt-2 max-w-xl text-sm text-slate-600">
                    Erstelle einen sicheren Einladungslink. Die andere Seite
                    kann damit dem Verfahren beitreten.
                  </p>
                </div>

                {!inviteUrl && (
                  <div className="w-full max-w-md">
                    <label
                      htmlFor="invite-email"
                      className="text-sm font-semibold text-slate-900"
                    >
                      E-Mail-Adresse
                    </label>

                    <input
                      id="invite-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
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
                      <p className="text-sm font-semibold text-slate-900">
                        Einladung ist bereit
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Kopiere den Link und sende ihn an die andere Seite.
                      </p>
                    </div>

                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Aktiv
                    </span>
                  </div>

                  <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="break-all font-mono text-sm text-slate-700">
                      {inviteUrl}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={copyInviteLink}
                      className="btn btn-primary"
                    >
                      {copied ? "Kopiert ✓" : "Link kopieren"}
                    </button>

                    <button
                      type="button"
                      onClick={() => window.open(inviteUrl, "_blank")}
                      className="btn btn-secondary"
                    >
                      Link öffnen
                    </button>

                    <button
                      type="button"
                      onClick={createInvite}
                      disabled={loading}
                      className="btn btn-ghost disabled:cursor-not-allowed disabled:opacity-60"
                    >
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
