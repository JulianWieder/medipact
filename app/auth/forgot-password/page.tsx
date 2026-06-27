"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("E-Mail-Adresse erforderlich");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.detail || "Fehler beim Senden der Reset-E-Mail");
        return;
      }

      setSubmitted(true);
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
              Passwort vergessen?
            </h1>

            <p className="text-lg leading-8 text-neutral-600">
              Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen.
            </p>
          </div>

          <Card className="p-8">
            {submitted ? (
              <div className="space-y-6 text-center">
                <div className="rounded-2xl border border-accent-200 bg-accent-50 p-6">
                  <div className="mb-3 text-4xl">✅</div>
                  <p className="text-lg font-semibold text-accent-900">
                    E-Mail versendet!
                  </p>
                  <p className="mt-2 text-sm text-accent-800">
                    Falls ein Account mit dieser E-Mail existiert, erhältst du einen Reset-Link.
                    Bitte überprüfe dein Postfach (und Spam-Ordner).
                  </p>
                </div>

                <div className="pt-4">
                  <Link
                    href="/auth/login"
                    className="text-sm font-semibold text-accent-600 transition hover:text-accent-700"
                  >
                    Zurück zum Login
                  </Link>
                </div>
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
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-neutral-900"
                  >
                    E-Mail-Adresse
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="deine@email.de"
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 placeholder-neutral-400 transition focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/10"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Wird versendet..." : "Reset-Link anfordern"}
                </Button>
              </form>
            )}
          </Card>

          <div className="mt-8 text-center">
            <p className="text-neutral-600">
              Du kennst dein Passwort noch?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-accent-600 transition hover:text-accent-700"
              >
                Hier anmelden
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
