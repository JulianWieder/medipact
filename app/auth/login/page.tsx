"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

function LoginForm() {
  const searchParams = useSearchParams();
  const justVerified = searchParams.get("verified") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("E-Mail ist erforderlich");
      return;
    }

    if (!password) {
      setError("Passwort ist erforderlich");
      return;
    }

    setLoading(true);

    try {
      // Schritt 1: Spezifischen Fehlercode vom Backend holen
      const check = await fetch("/api/auth/check-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!check.ok) {
        const data = await check.json().catch(() => ({}));
        if (data.error === "EMAIL_NOT_VERIFIED") {
          setError("Bitte bestätige zuerst deine E-Mail-Adresse. Prüfe dein Postfach.");
        } else if (data.error === "BACKEND_UNREACHABLE") {
          setError("Server nicht erreichbar. Bitte versuche es später erneut.");
        } else {
          setError("E-Mail oder Passwort falsch");
        }
        return;
      }

      // Schritt 2: Credentials korrekt → NextAuth-Session erstellen
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("E-Mail oder Passwort falsch");
        return;
      }

      window.location.href = "/dashboard";
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
            <div className="eyebrow justify-center">Login</div>

            <h1 className="text-4xl font-black tracking-tight text-neutral-900">
              Willkommen zurück
            </h1>

            <p className="text-lg leading-8 text-neutral-600">
              Melden Sie sich an, um Ihre Mediation fortzusetzen.
            </p>
          </div>

          <Card className="p-8">
            {justVerified && !error && (
              <div className="mb-6 rounded-2xl border border-accent-200 bg-accent-50 p-4 text-sm text-accent-800 font-medium">
                ✅ E-Mail erfolgreich bestätigt! Du kannst dich jetzt anmelden.
              </div>
            )}
            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-neutral-900"
                >
                  E-Mail
                </label>

                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="julianvwieder@gmail.com"
                  className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 placeholder-neutral-400 transition focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-neutral-900"
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
                    placeholder="dein-passwort"
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
                {loading ? "Wird angemeldet..." : "Anmelden"}
              </Button>

              <div className="text-center">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-semibold text-accent-600 transition hover:text-accent-700"
                >
                  Passwort vergessen?
                </Link>
              </div>
            </form>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-neutral-600">
              Noch kein Konto?{" "}
              <Link
                href="/auth/register"
                className="font-semibold text-accent-600 transition hover:text-accent-700"
              >
                Hier registrieren
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
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
      <LoginForm />
    </Suspense>
  );
}
