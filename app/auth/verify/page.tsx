"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Status = "loading" | "success" | "error" | "missing";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("missing");
      return;
    }

    async function verify() {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token!)}`, {
          method: "GET",
        });

        const data = await res.json();

        if (!res.ok) {
          setErrorMessage(data.error ?? "Verifizierung fehlgeschlagen");
          setStatus("error");
          return;
        }

        // Token verifiziert → zum Login weiterleiten mit Erfolgshinweis
        setStatus("success");
      } catch {
        setErrorMessage("Backend nicht erreichbar");
        setStatus("error");
      }
    }

    verify();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <main className="min-h-screen bg-white pt-[73px] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-accent-600 border-r-transparent mb-4" />
          <p className="text-neutral-600">E-Mail wird bestätigt…</p>
        </div>
      </main>
    );
  }

  // ── Missing token ────────────────────────────────────────────────────────
  if (status === "missing") {
    return (
      <main className="min-h-screen bg-white pt-[73px]">
        <div className="mx-auto max-w-md px-6 py-20 lg:px-8 lg:py-32">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
            <div className="mb-4 text-5xl">⚠️</div>
            <h1 className="text-2xl font-black text-amber-900 mb-3">
              Kein Token gefunden
            </h1>
            <p className="text-neutral-600 text-sm mb-6">
              Der Link ist ungültig. Bitte klicke auf den Link in der
              Bestätigungs-E-Mail.
            </p>
            <Link
              href="/auth/login"
              className="inline-block rounded-2xl bg-accent-600 px-6 py-3 text-sm font-bold text-white hover:bg-accent-700 transition"
            >
              Zur Anmeldung
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (status === "error") {
    return (
      <main className="min-h-screen bg-white pt-[73px]">
        <div className="mx-auto max-w-md px-6 py-20 lg:px-8 lg:py-32">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <div className="mb-4 text-5xl">❌</div>
            <h1 className="text-2xl font-black text-red-900 mb-3">
              Bestätigung fehlgeschlagen
            </h1>
            <p className="text-neutral-600 text-sm mb-6">
              {errorMessage || "Der Bestätigungslink ist ungültig oder abgelaufen."}
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/auth/register"
                className="inline-block rounded-2xl bg-accent-600 px-6 py-3 text-sm font-bold text-white hover:bg-accent-700 transition"
              >
                Erneut registrieren
              </Link>
              <Link
                href="/auth/login"
                className="text-sm font-semibold text-accent-600 hover:text-accent-700 transition"
              >
                Zur Anmeldung
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Success ──────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-white pt-[73px]">
      <div className="mx-auto max-w-md px-6 py-20 lg:px-8 lg:py-32">
        <div className="rounded-2xl border border-accent-200 bg-accent-50 p-8 text-center">
          <div className="mb-4 text-5xl">✅</div>
          <h1 className="text-2xl font-black text-accent-900 mb-3">
            E-Mail bestätigt!
          </h1>
          <p className="text-neutral-600 text-sm mb-6">
            Deine E-Mail-Adresse wurde erfolgreich bestätigt. Du kannst dich
            jetzt anmelden.
          </p>
          <Link
            href="/auth/login?verified=1"
            className="inline-block rounded-2xl bg-accent-600 px-6 py-3 text-sm font-bold text-white hover:bg-accent-700 transition"
          >
            Jetzt anmelden
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white pt-[73px] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-accent-600 border-r-transparent mb-4" />
            <p className="text-neutral-600">Wird geladen…</p>
          </div>
        </main>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
