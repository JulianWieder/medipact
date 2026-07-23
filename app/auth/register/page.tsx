"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Icon from "@/app/components/ui/Icon";

// Verzweigter Registrierungs-Einstieg: Privatperson vs. Unternehmen.
// Interne Mitarbeiter (medipact/mandexis) registrieren separat über
// /auth/register/intern (domain-beschränkt).
function RegisterChoiceContent() {
  // callbackUrl (z.B. Einladungslink) durch den gesamten Registrierungs-Flow
  // weiterreichen, damit Eingeladene nach dem Login wieder bei ihrer
  // Einladung landen.
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get("callbackUrl") ?? "";
  const callbackUrl =
    rawCallbackUrl.startsWith("/") && !rawCallbackUrl.startsWith("//")
      ? rawCallbackUrl
      : "";
  const withCallback = (href: string) =>
    callbackUrl ? `${href}?callbackUrl=${encodeURIComponent(callbackUrl)}` : href;

  const cards = [
    {
      href: withCallback("/auth/register/privat"),
      badge: "Privat",
      title: "Als Privatperson",
      text: "Für private Konflikte – z.B. Trennung, Erbschaft oder Nachbarschaft. Du startest eine eigene Mediation und lädst die Gegenseite ein.",
      icon: "🧑",
    },
    {
      href: withCallback("/auth/register-company"),
      badge: "Abo-Modell",
      title: "Als Unternehmen (Abo)",
      text: "Für Firmen im Abo-Modell: einmal Grundkonfiguration festlegen, dann interne Fälle ohne Einzelzahlung – mit eigenen Mediatoren über euren Firmen-Zugang.",
      icon: "🏢",
    },
  ];

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center p-6">
      <div className="mb-8 text-center">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-600">Konto erstellen</p>
        <h1 className="text-2xl font-bold text-neutral-900">Wie möchtest du medipact nutzen?</h1>
        <p className="mt-1 text-sm text-neutral-500">Wähle deinen Weg – du kannst das später nicht mehr ändern.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-accent-300 hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between">
              <span><Icon name={c.icon} size={30} /></span>
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                {c.badge}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-neutral-900">{c.title}</h2>
            <p className="mt-1 flex-1 text-sm text-neutral-500">{c.text}</p>
            <span className="mt-4 text-sm font-semibold text-accent-600 group-hover:underline">Weiter →</span>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center text-xs text-neutral-400">
        <span>
          Mitarbeiter:in von medipact?{" "}
          <Link href="/auth/register/intern" className="text-accent-600 hover:underline">Interne Anmeldung</Link>
        </span>
        <span className="mx-2">·</span>
        <span>
          Schon ein Konto?{" "}
          <Link href={withCallback("/auth/login")} className="text-accent-600 hover:underline">Einloggen</Link>
        </span>
      </div>
    </div>
  );
}

export default function RegisterChoicePage() {
  return (
    <Suspense fallback={null}>
      <RegisterChoiceContent />
    </Suspense>
  );
}
