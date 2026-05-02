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

const participants: Participant[] = [
  {
    id: "p1",
    name: "Du",
    role: "initiator",
    status: "active",
  },
];

export default function MediationClient({ mediationId }: Props) {
  const [inviteUrl, setInviteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isReady = participants.some((p) => p.role === "other_party");

  async function createInvite() {
    setLoading(true);
    setError("");

    const res = await fetch(
      `http://127.0.0.1:8000/mediations/${mediationId}/invites`,
      { method: "POST" },
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Invite error:", res.status, errorText);
      setError(`Einladung konnte nicht erstellt werden. Status: ${res.status}`);
      setLoading(false);
      return;
    }

    const data = await res.json();

    setInviteUrl(data.invite_url);
    setLoading(false);
  }

  async function copyInviteLink() {
    await navigator.clipboard.writeText(inviteUrl);
  }

  return (
    <main className="app-shell pt-[73px]">
      <section className="container py-12">
        <div className="app-surface p-8">
          <p className="eyebrow mb-3">Mediation vorbereiten</p>

          <h1 className="heading-2 text-slate-900">Beteiligte verbinden</h1>

          <p className="mt-4 text-slate-600">
            Bevor die Mediation starten kann, müssen beide Seiten dem Verfahren
            zugeordnet sein.
          </p>

          <p className="mt-4 text-sm text-slate-500">
            Mediation-ID: {mediationId}
          </p>

          <div className="mt-8 space-y-3">
            {participants.map((person) => (
              <div key={person.id} className="card-muted">
                <p className="font-semibold text-slate-900">{person.name}</p>
                <p className="text-sm text-slate-600">{person.status}</p>
              </div>
            ))}
          </div>

          {!isReady && (
            <button
              type="button"
              onClick={createInvite}
              disabled={loading}
              className="btn btn-primary mt-8"
            >
              {loading ? "Einladung wird erstellt..." : "Andere Seite einladen"}
            </button>
          )}

          {error && (
            <p className="mt-4 text-sm font-semibold text-red-700">{error}</p>
          )}

          {inviteUrl && (
            <div className="card-muted mt-8">
              <p className="text-sm font-semibold text-slate-900">
                Einladungslink
              </p>

              <p className="mt-3 break-all text-sm text-slate-600">
                {inviteUrl}
              </p>

              <button
                type="button"
                onClick={copyInviteLink}
                className="btn btn-secondary mt-5"
              >
                Link kopieren
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
