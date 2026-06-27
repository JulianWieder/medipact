"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <main className="app-shell pt-[73px]">
        <section className="section section-muted">
          <div className="container max-w-md">
            <Card className="p-8">
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                <div className="mb-3 text-4xl">⚠️</div>
                <p className="font-semibold text-red-900">
                  Ungültiger oder abgelaufener Link
                </p>
                <p className="mt-2 text-sm text-red-800">
                  Der Passwort-Reset-Link ist ungültig oder abgelaufen.
                  Bitte fordere einen neuen Link an.
                </p>
                <Link
                  href="/auth/forgot-password"
                  className="mt-4 inline-block font-semibold text-red-600 transition hover:text-red-700"
                >
                  Neuen Reset-Link anfordern
                </Link>
              </div>
            </Card>
          </div>
        </section>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Passwort erforderlich");
      return;
    }

    if (password.length < 8) {
      setError("Passwort muss mindestens 8 Zeichen lang sein");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwörter stimmen nicht überein");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          data.detail || "Fehler beim Zurücksetzen des Passworts"
        );
        return;
      }

      setSuccess(true);
    } catch {
      setError("Server nicht erreichbar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell pt-[73px]">
      <section className="section section-muted">
        <div className="container max-w-md">
          <div className="mb-10 space-y-3 text-center">
            <div className="eyebrow justify-center">Passwort zurücksetzen</div>

            <h1 className="text-4xl font-black tracking-tight text-neutral-900">
              Neues Passwort setzen
            </h1>

            <p className="text-lg leading-8 text-neutral-600">
              Wähle ein sicheres Passwort für dein Konto.
            </p>
          </div>

          <Card className="p-8">
            {success ? (
              <div className="space-y-6 text-center">
                <div className="rounded-2xl border border-accent-200 bg-accent-50 p-6">
                  <div className="mb-3 text-4xl">✅</div>
                  <p className="text-lg font-semibold text-accent-900">
                    Passwort aktualisiert!
                  </p>
                  <p className="mt-2 text-sm text-accent-800">
                    Dein Passwort wurde erfolgreich zurückgesetzt.
                    Du kannst dich jetzt mit deinem neuen Passwort anmelden.
                  </p>
                </div>

                <Link
                  href="/auth/login"
                  className="inline-block font-semibold text-accent-600 transition hover:text-accent-700"
                >
                  Zur Anmeldung
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-neutral-900"
                  >
                    Neues Passwort
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Mindestens 8 Zeichen"
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 pr-24 text-neutral-900 placeholder-neutral-400 transition focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-neutral-500 transition hover:text-neutral-700"
                    >
                      {showPassword ? "Verbergen" : "Zeigen"}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-semibold text-neutral-900"
                  >
                    Passwort wiederholen
                  </label>

                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Passwort wiederholen"
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 pr-24 text-neutral-900 placeholder-neutral-400 transition focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-neutral-500 transition hover:text-neutral-700"
                    >
                      {showPassword ? "Verbergen" : "Zeigen"}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Wird aktualisiert..." : "Passwort aktualisieren"}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main className="app-shell pt-[73px]">
        <section className="section section-muted">
          <div className="container max-w-md">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-accent-600 border-r-transparent" />
          </div>
        </section>
      </main>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
