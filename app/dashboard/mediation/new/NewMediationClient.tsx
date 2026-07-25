"use client";

// ── Typ-Auswahl "Neue Mediation" ─────────────────────────────────────────────
//
// Zweistufig statt 9 flacher Karten (Nutzer-Feedback: ODR-Auswahl zu viel):
//   1. Privat oder Geschäftlich?
//   2a. Privat: die 5 privaten Konfliktarten.
//   2b. Geschäftlich: EIN unspezifischer Einstieg (type "odr" = allgemeines
//       Verfahren) im Fokus; die 3 Spezialverfahren (schlichtung/ecommerce/
//       b2b) nur optional aufklappbar. Granularer wird es ohnehin in der
//       Fallaufnahme danach.
// Typen/Registry/Backend unverändert – nur die Auswahl-UI.

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { mediationRegistry } from "@/lib/mediation-types/registry";

type Category = "privat" | "business";

const PRIVATE_TYPES = ["trennung", "erbschaft", "nachbarschaft", "wg", "verbraucher"] as const;

// Spezialverfahren ohne "ODR –"-Jargon; der allgemeine Einstieg ist "odr".
const BUSINESS_SPECIAL: { type: string; title: string; description: string }[] = [
  {
    type: "schlichtung",
    title: "Online-Schlichtung",
    description:
      "Beide Seiten werden angehört, dann erarbeitet die neutrale Stelle einen konkreten Lösungsvorschlag (Schlichterspruch).",
  },
  {
    type: "ecommerce",
    title: "E-Commerce & Plattform",
    description:
      "Streit um Online-Käufe, Rücksendungen, Bewertungen oder Plattform-Konten digital beilegen.",
  },
  {
    type: "b2b",
    title: "B2B-Vertragsstreit",
    description:
      "Vertrags- und Zahlungsstreitigkeiten zwischen Unternehmen klären, ohne die Geschäftsbeziehung zu zerstören.",
  },
];

export default function NewMediationClient() {
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [showSpecial, setShowSpecial] = useState(false);
  const [isCreating, setIsCreating] = useState("");
  const [error, setError] = useState("");

  const handleCreate = async (type: string) => {
    setIsCreating(type);
    setError("");

    try {
      const res = await fetch("/api/mediations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediation_type: type }),
      });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 401 && body?.reauth) {
          setError("Deine Sitzung ist abgelaufen. Du wirst zum Login weitergeleitet …");
          await signIn(undefined, { callbackUrl: "/dashboard/mediation/new" });
          return;
        }

        setError(body?.error ?? `Mediation konnte nicht erstellt werden (Fehler ${res.status}).`);
        console.error("Mediation konnte nicht erstellt werden.", res.status, body);
        return;
      }

      const mediation = body;
      const mediationId =
        mediation?.mediation_id ??
        mediation?.id ??
        mediation?.data?.mediation_id ??
        mediation?.data?.id;

      if (!mediationId) {
        setError("Mediation wurde erstellt, aber es kam keine ID vom Server zurück. Bitte versuche es erneut.");
        console.error("Keine Mediation-ID erhalten:", mediation);
        return;
      }

      router.push(
        `/dashboard/mediation/new/${type}?mediationId=${mediationId}`
      );
    } catch (err) {
      setError("Server nicht erreichbar. Bitte versuche es später erneut.");
      console.error("Server nicht erreichbar.", err);
    } finally {
      setIsCreating("");
    }
  };

  return (
    <main className="app-shell pt-[73px]">
      <section className="border-b border-neutral-200 bg-white">
        <div className="container py-12 lg:py-16">
          <Link href="/dashboard" className="btn btn-ghost mb-6">
            ← Zurück zum Dashboard
          </Link>

          <p className="eyebrow mb-3">Neue Mediation</p>

          <h1 className="heading-1 text-neutral-900">
            {category === null
              ? "Privat oder geschäftlich?"
              : category === "privat"
                ? "Worum geht es?"
                : "Ihr geschäftlicher Konflikt"}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-600">
            {category === null
              ? "Zwei Fragen genügen für den Start – alles Weitere klären wir Schritt für Schritt in der Fallaufnahme."
              : category === "privat"
                ? "Wählen Sie den passenden Bereich. Die konkreten Fragen folgen danach Schritt für Schritt."
                : "Starten Sie einfach allgemein – die Details erfassen wir in der Fallaufnahme. Nur wenn Sie schon genau wissen, welches Verfahren passt, wählen Sie es direkt."}
          </p>

          {error && (
            <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          )}
        </div>
      </section>

      <section className="container py-12 lg:py-16">
        {/* ── Schritt 1: Privat oder Geschäftlich ── */}
        {category === null && (
          <div className="grid gap-6 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setCategory("privat")}
              className="app-surface border border-neutral-200 p-8 text-left transition hover:border-accent-500 hover:shadow-sm"
            >
              <h2 className="heading-3 mb-2">Privater Konflikt</h2>
              <p className="text-sm leading-6 text-neutral-600">
                Trennung &amp; Familie, Erbschaft, Nachbarschaft, WG, Streit mit
                Händlern oder Handwerkern.
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-accent-600">
                Bereich wählen →
              </span>
            </button>
            <button
              type="button"
              onClick={() => setCategory("business")}
              className="app-surface border border-neutral-200 p-8 text-left transition hover:border-accent-500 hover:shadow-sm"
            >
              <h2 className="heading-3 mb-2">Geschäftlicher Konflikt</h2>
              <p className="text-sm leading-6 text-neutral-600">
                Team &amp; Organisation, Gesellschafter, Kunden, Lieferanten,
                B2B-Verträge, E-Commerce.
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-accent-600">
                Weiter →
              </span>
            </button>
          </div>
        )}

        {/* ── Schritt 2a: Private Konfliktarten ── */}
        {category === "privat" && (
          <>
            <button
              type="button"
              onClick={() => setCategory(null)}
              className="mb-6 text-sm font-semibold text-neutral-400 transition hover:text-neutral-600"
            >
              ← Privat / Geschäftlich ändern
            </button>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {PRIVATE_TYPES.map((type) => {
                const config = mediationRegistry[type];
                return (
                  <button
                    key={type}
                    onClick={() => handleCreate(type)}
                    disabled={!!isCreating}
                    className="app-surface border border-neutral-200 p-6 text-left transition hover:border-accent-500 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <h2 className="heading-3 mb-2">{config.title}</h2>
                    <p className="text-sm leading-6 text-neutral-600">
                      {config.description}
                    </p>
                    {isCreating === type && (
                      <p className="mt-3 text-sm font-semibold text-accent-600">
                        Wird erstellt…
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ── Schritt 2b: Geschäftlich – unspezifisch starten ── */}
        {category === "business" && (
          <>
            <button
              type="button"
              onClick={() => {
                setCategory(null);
                setShowSpecial(false);
              }}
              className="mb-6 text-sm font-semibold text-neutral-400 transition hover:text-neutral-600"
            >
              ← Privat / Geschäftlich ändern
            </button>

            {/* Allgemeiner Einstieg (type "odr") im Fokus */}
            <button
              type="button"
              onClick={() => handleCreate("odr")}
              disabled={!!isCreating}
              className="app-surface block w-full border-2 border-accent-300 bg-accent-50/40 p-8 text-left transition hover:border-accent-500 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="inline-block rounded-full bg-accent-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Empfohlen
              </span>
              <h2 className="heading-3 mt-3 mb-2">Geschäftlichen Konflikt klären</h2>
              <p className="max-w-2xl text-sm leading-6 text-neutral-600">
                Der passende Einstieg für Konflikte in Teams, zwischen
                Gesellschaftern, mit Kunden oder Lieferanten. In der
                Fallaufnahme grenzen wir Ihren Fall gemeinsam ein – Sie müssen
                sich jetzt noch nicht festlegen.
              </p>
              {isCreating === "odr" && (
                <p className="mt-3 text-sm font-semibold text-accent-600">
                  Wird erstellt…
                </p>
              )}
            </button>

            {/* Spezialverfahren: optional, eingeklappt */}
            <div className="mt-8">
              <button
                type="button"
                onClick={() => setShowSpecial((s) => !s)}
                className="text-sm font-semibold text-neutral-500 transition hover:text-neutral-700"
              >
                Sie kennen das passende Verfahren bereits?{" "}
                <span className="text-accent-600">
                  {showSpecial ? "Spezialverfahren ausblenden ▲" : "Spezialverfahren anzeigen ▼"}
                </span>
              </button>

              {showSpecial && (
                <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {BUSINESS_SPECIAL.map((t) => (
                    <button
                      key={t.type}
                      onClick={() => handleCreate(t.type)}
                      disabled={!!isCreating}
                      className="app-surface border border-neutral-200 p-6 text-left transition hover:border-accent-500 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <h2 className="heading-3 mb-2">{t.title}</h2>
                      <p className="text-sm leading-6 text-neutral-600">
                        {t.description}
                      </p>
                      {isCreating === t.type && (
                        <p className="mt-3 text-sm font-semibold text-accent-600">
                          Wird erstellt…
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
