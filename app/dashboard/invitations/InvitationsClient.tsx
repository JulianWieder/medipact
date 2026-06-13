"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  token: string;
};

export default function InvitationsClient({ token }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function acceptInvite() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/invites/${token}/accept`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.detail ??
            data.error ??
            "Einladung konnte nicht angenommen werden.",
        );
        return;
      }

      router.push(`/dashboard/${data.mediation_id}`);
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <main className="app-shell pt-[73px]">
        <section className="container py-12">
          <div className="app-surface p-8">
            <p className="eyebrow mb-3">Einladungen</p>
            <h1 className="heading-2 text-slate-900">
              Keine Einladung gefunden
            </h1>
            <p className="mt-4 text-slate-600">
              Der Einladungslink enthält keinen gültigen Token.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell pt-[73px]">
      <section className="container py-12">
        <div className="app-surface p-8">
          <p className="eyebrow mb-3">Einladung erhalten</p>

          <h1 className="heading-2 text-slate-900">
            Du wurdest zu einer Mediation eingeladen
          </h1>

          <p className="mt-4 max-w-2xl text-slate-600">
            Nimm die Einladung an, um dem Verfahren beizutreten und die nächsten
            Schritte zu sehen.
          </p>

          <div className="card-muted mt-8">
            <p className="text-sm font-semibold text-slate-900">
              Einladungstoken
            </p>

            <p className="mt-3 break-all font-mono text-sm text-slate-600">
              {token}
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          )}

          <button
            type="button"
            onClick={acceptInvite}
            disabled={loading}
            className="btn btn-primary mt-8 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Einladung wird angenommen..." : "Einladung annehmen"}
          </button>
        </div>
      </section>
    </main>
  );
}
