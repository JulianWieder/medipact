"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Firmenkunden-Registrierung, mehrstufig (granular):
//   1. Firma       – Firmenname, Rechnungs-E-Mail (optional)
//   2. Ansprechpartner – Name, Position, E-Mail, Passwort (= Firmen-Admin-Zugang)
//   3. Tarif       – Business-Abo wählen (Preise aus pricing.py)
// Danach E-Mail-Bestätigung → Firmen-Onboarding aus dem Dashboard.

type AboPlan = {
  key: string;
  label: string;
  base_eur: number;
  per_mediator_eur: number;
  included_mediators: number;
  max_mediators: number | null;
};

const STEP_LABELS = ["Firma", "Ansprechpartner", "Tarif"];

export default function RegisterCompanyPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    company_name: "",
    billing_email: "",
    name: "",
    position: "",
    email: "",
    password: "",
    confirmPassword: "",
    plan: "starter",
  });
  const [plans, setPlans] = useState<AboPlan[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/register-company/plans", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: AboPlan[]) => {
        setPlans(data ?? []);
        if (data?.length) setForm((f) => ({ ...f, plan: data[0].key }));
      })
      .catch(() => {});
  }, []);

  function set(key: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [key]: v }));
  }

  function validateStep(s: number) {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!form.company_name.trim()) e.company_name = "Firmenname ist erforderlich";
      if (form.billing_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.billing_email))
        e.billing_email = "Ungültige E-Mail-Adresse";
    }
    if (s === 1) {
      if (!form.name.trim()) e.name = "Name ist erforderlich";
      if (!form.email) e.email = "E-Mail ist erforderlich";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Ungültige E-Mail-Adresse";
      if (!form.password) e.password = "Passwort ist erforderlich";
      else if (form.password.length < 8) e.password = "Mindestens 8 Zeichen";
      if (form.password !== form.confirmPassword) e.confirmPassword = "Passwörter stimmen nicht überein";
    }
    return e;
  }

  function next() {
    const e = validateStep(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep((s) => s + 1);
  }
  function back() { setErrors({}); setStep((s) => Math.max(0, s - 1)); }

  async function submit() {
    setLoading(true);
    setErrors({});
    try {
      const res = await fetch("/api/register-company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: form.company_name,
          billing_email: form.billing_email || null,
          name: form.name,
          position: form.position || null,
          email: form.email,
          password: form.password,
          plan: form.plan,
        }),
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
          <h1 className="mb-2 text-xl font-bold text-neutral-900">Unternehmen registriert</h1>
          <p className="text-sm text-neutral-600">
            Bestätige deine Adresse <strong>{registeredEmail}</strong> über den Link in der E-Mail.
            Danach führt dich das Onboarding im Dashboard durch die Einrichtung.
          </p>
          <Link href="/auth/login" className="mt-6 inline-block text-sm text-accent-600 hover:underline">→ Zum Login</Link>
        </div>
      </div>
    );
  }

  const F = (key: keyof typeof form, label: string, type = "text", placeholder = "") => (
    <div>
      <label className="mb-1 block text-xs font-semibold text-neutral-600">{label}</label>
      <input
        type={type}
        value={form[key]}
        placeholder={placeholder}
        onChange={(e) => set(key, e.target.value)}
        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
      />
      {errors[key] && <p className="mt-1 text-xs text-red-600">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center p-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-600">Für Unternehmen</p>
        <h1 className="mb-4 text-2xl font-bold text-neutral-900">Unternehmen registrieren</h1>

        {/* Stepper */}
        <div className="mb-6 flex items-center gap-2">
          {STEP_LABELS.map((l, i) => (
            <div key={l} className="flex flex-1 items-center gap-2">
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${i < step ? "bg-accent-500 text-white" : i === step ? "bg-accent-100 text-accent-700 ring-2 ring-accent-400" : "bg-neutral-100 text-neutral-400"}`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-xs ${i === step ? "font-semibold text-neutral-800" : "text-neutral-400"}`}>{l}</span>
              {i < STEP_LABELS.length - 1 && <div className={`h-0.5 flex-1 rounded ${i < step ? "bg-accent-400" : "bg-neutral-100"}`} />}
            </div>
          ))}
        </div>

        {errors.general && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errors.general}</div>}

        {step === 0 && (
          <div className="space-y-4">
            {F("company_name", "Firmenname", "text", "Muster GmbH")}
            {F("billing_email", "Rechnungs-E-Mail (optional)", "email", "rechnung@firma.de")}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-neutral-500">Diese Person wird der Firmen-Admin und richtet euren Zugang ein.</p>
            {F("name", "Name", "text", "Max Mustermann")}
            {F("position", "Position (optional)", "text", "z.B. HR-Leitung")}
            {F("email", "E-Mail", "email", "admin@firma.de")}
            {F("password", "Passwort", "password")}
            {F("confirmPassword", "Passwort bestätigen", "password")}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm text-neutral-500">Wähle euer Business-Abo. Interne Fälle sind im Abo enthalten.</p>
            {plans.length === 0 && <p className="text-sm text-neutral-400">Tarife werden geladen …</p>}
            {plans.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => set("plan", p.key)}
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${form.plan === p.key ? "border-accent-400 bg-accent-50 ring-1 ring-accent-300" : "border-neutral-200 hover:border-accent-200"}`}
              >
                <div>
                  <div className="text-sm font-semibold text-neutral-900">{p.label}</div>
                  <div className="text-xs text-neutral-500">
                    inkl. {p.included_mediators} Mediator{p.included_mediators === 1 ? "" : "en"}
                    {p.max_mediators ? ` · max. ${p.max_mediators}` : " · unbegrenzt"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-neutral-900">{p.base_eur.toFixed(0)} € <span className="text-xs font-normal text-neutral-400">/ Monat</span></div>
                  <div className="text-[10px] text-neutral-400">+ {p.per_mediator_eur.toFixed(0)} € je weiterer</div>
                </div>
              </button>
            ))}
            <p className="pt-1 text-[11px] text-neutral-400">Preise sind vorläufig und können sich ändern.</p>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <button onClick={step === 0 ? undefined : back} className={`rounded-full px-4 py-2 text-sm ${step === 0 ? "invisible" : "text-neutral-500 hover:bg-neutral-100"}`}>Zurück</button>
          {step < 2 ? (
            <button onClick={next} className="rounded-full bg-accent-500 px-6 py-2 text-sm font-semibold text-white hover:bg-accent-600">Weiter</button>
          ) : (
            <button onClick={submit} disabled={loading} className="rounded-full bg-accent-500 px-6 py-2 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-50">
              {loading ? "Wird registriert …" : "Unternehmen registrieren"}
            </button>
          )}
        </div>

        <p className="mt-5 text-center text-xs text-neutral-400">
          <Link href="/auth/register" className="text-accent-600 hover:underline">← Zurück zur Auswahl</Link>
          <span className="mx-2">·</span>
          <Link href="/auth/login" className="text-accent-600 hover:underline">Einloggen</Link>
        </p>
      </div>
    </div>
  );
}
