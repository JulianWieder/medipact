"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { encodeId } from "@/lib/ids";

type Props = {
  token: string;
};

export default function InvitationsClient({ token }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mediationId, setMediationId] = useState<number | null>(null);
  const [hasVideo, setHasVideo] = useState(false);

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

      if (data.has_video) {
        setMediationId(data.mediation_id);
        setHasVideo(true);
        return;
      }

      router.push(`/dashboard/${encodeId(data.mediation_id)}`);
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

  if (hasVideo && mediationId !== null) {
    return (
      <main className="app-shell pt-[73px]">
        <section className="container py-12">
          <div className="app-surface p-8">
            <p className="eyebrow mb-3">Einladung angenommen</p>
            <h1 className="heading-2 text-slate-900">
              Die andere Seite hat dir eine persönliche Video-Botschaft hinterlassen
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600">
              Schau dir die Nachricht an, bevor es weitergeht.
            </p>

            <div className="mt-8 overflow-hidden rounded-2xl bg-slate-900">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                src={`/api/mediations/${mediationId}/invites/me/video`}
                className="aspect-video w-full"
                controls
                autoPlay
              />
            </div>

            <button
              type="button"
              onClick={() => router.push(`/dashboard/${encodeId(mediationId)}`)}
              className="btn btn-primary mt-8"
            >
              Weiter zur Mediation →
            </button>
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
