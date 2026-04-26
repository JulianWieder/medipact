"use client";

import Link from "next/link";
import { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email) {
      setError("E-Mail ist erforderlich");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Passwort ist erforderlich");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      window.location.href = "/dashboard";
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <main className="app-shell pt-[73px]">
        <section className="section section-muted">
          <div className="container max-w-md">
            <div className="mb-10 space-y-3 text-center">
              <div className="eyebrow justify-center">Login</div>

              <h1 className="text-4xl font-black tracking-tight text-slate-900">
                Willkommen zurück
              </h1>

              <p className="text-lg leading-8 text-slate-600">
                Melden Sie sich an, um Ihre Mediation fortzusetzen.
              </p>
            </div>

            <Card className="p-8">
              {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-900"
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
                    placeholder="kontakt@beispiel.de"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-900"
                  >
                    Passwort
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
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-24 text-slate-900 placeholder-slate-400 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 transition hover:text-slate-700"
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
                  {loading ? "Wird angemeldet..." : "Anmelden"}
                </Button>

                <div className="text-center">
                  <Link
                    href="#"
                    className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
                  >
                    Passwort vergessen?
                  </Link>
                </div>
              </form>
            </Card>

            <div className="mt-8 text-center">
              <p className="text-slate-600">
                Noch kein Konto?{" "}
                <Link
                  href="/auth/register"
                  className="font-semibold text-emerald-600 transition hover:text-emerald-700"
                >
                  Hier registrieren
                </Link>
              </p>
            </div>

            <Card variant="muted" className="mt-8">
              <h3 className="heading-3 mb-2">Hinweis </h3>
              <p className="text-sm text-slate-600">
                Bald werden wir den richtigen Zugang freischalten. Bitte wendne
                sie sich an hallo@medipact.de , wenn sie informiert werden
                möchten möchten{" "}
              </p>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
