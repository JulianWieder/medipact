"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

// Privatpersonen-Registrierung (öffentlich, ohne Domain-Beschränkung).
function RegisterPrivateContent() {
  // callbackUrl (z.B. Einladungslink) bis zum Login weiterreichen.
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get("callbackUrl") ?? "";
  const callbackUrl =
    rawCallbackUrl.startsWith("/") && !rawCallbackUrl.startsWith("//")
      ? rawCallbackUrl
      : "";
  const loginHref = callbackUrl
    ? `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/auth/login";
  // E-Mail-Vorbelegung aus Einladungs-Redirect (Login-Seite → Registrierung)
  const prefillEmail = searchParams.get("email") ?? "";
  const [form, setForm] = useState({ name: "", email: prefillEmail, password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name ist erforderlich";
    if (!form.email) e.email = "E-Mail ist erforderlich";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Ungültige E-Mail-Adresse";
    if (!form.password) e.password = "Passwort ist erforderlich";
    else if (form.password.length < 8) e.password = "Mindestens 8 Zeichen";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwörter stimmen nicht überein";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setLoading(true);
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); setLoading(false); return; }
    setErrors({});
    try {
      const res = await fetch("/api/register-private", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setErrors({ general: data.error ?? "Registrierung fehlgeschlagen" }); setLoading(false); return; }
      setRegisteredEmail(form.email);
    } catch {
      setErrors({ general: "Backend nicht erreichbar" });
    } finally {
      setLoading(false);
    }
  }

  if (registeredEmail) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <div className="mb-3 text-4xl">✉️</div>
          <h1 className="mb-2 text-xl font-bold text-neutral-900">Fast geschafft</h1>
          <p className="text-sm text-neutral-600">Bestätige deine Adresse <strong>{registeredEmail}</strong> über den Link in der E-Mail.</p>
          <Link href={loginHref} className="mt-6 inline-block text-sm text-accent-600 hover:underline">→ Zum Login</Link>
        </div>
      </div>
    );
  }

  const F = (key: keyof typeof form, label: string, type = "text") => (
    <div>
      <label className="mb-1 block text-xs font-semibold text-neutral-600">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
      />
      {errors[key] && <p className="mt-1 text-xs text-red-600">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-600">Privatperson</p>
        <h1 className="mb-1 text-2xl font-bold text-neutral-900">Konto erstellen</h1>
        <p className="mb-6 text-sm text-neutral-500">Für private Mediationen. Danach bestätigst du deine E-Mail-Adresse.</p>
        {errors.general && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errors.general}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {F("name", "Name")}
          {F("email", "E-Mail", "email")}
          {F("password", "Passwort", "password")}
          {F("confirmPassword", "Passwort bestätigen", "password")}
          <button type="submit" disabled={loading} className="w-full rounded-full bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-50">
            {loading ? "Wird erstellt …" : "Konto erstellen"}
          </button>
        </form>
        <p className="mt-5 text-center text-xs text-neutral-400">
          <Link
            href={callbackUrl ? `/auth/register?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/auth/register"}
            className="text-accent-600 hover:underline"
          >← Zurück zur Auswahl</Link>
          <span className="mx-2">·</span>
          <Link href={loginHref} className="text-accent-600 hover:underline">Einloggen</Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPrivatePage() {
  return (
    <Suspense fallback={null}>
      <RegisterPrivateContent />
    </Suspense>
  );
}
