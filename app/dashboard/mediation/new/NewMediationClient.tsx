"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewMediationClient() {
  const router = useRouter();
  const [mediationType, setMediationType] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [role, setRole] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!mediationType) {
      alert("Bitte wählen Sie eine Art der Mediation aus.");
      return;
    }

    setIsSaving(true);

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Bitte einloggen");
      router.push("/auth/login");
      return;
    }

    const res = await fetch("http://127.0.0.1:8000/mediations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mediation_type: mediationType,
        description,
        priority,
        role,
        status: "draft",
      }),
    });

    if (!res.ok) {
      console.error("Mediation konnte nicht gespeichert werden", res.status);
      alert("Mediation konnte nicht gespeichert werden.");
      setIsSaving(false);
      return;
    }

    const mediation = await res.json();

    router.push(
      `/dashboard/mediation/new/${mediationType}?mediationId=${mediation.id}`,
    );
  };

  return (
    <main className="app-shell pt-[73px]">
      <section className="border-b border-slate-200 bg-white">
        <div className="container py-12 lg:py-16">
          <Link href="/dashboard" className="btn btn-ghost mb-6">
            ← Zurück zum Dashboard
          </Link>

          <p className="eyebrow mb-3">Neue Mediation</p>

          <h1 className="heading-1 text-slate-900">Worum geht es?</h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Wählen Sie zunächst den passenden Bereich. Die konkreten Fragen
            folgen danach Schritt für Schritt.
          </p>
        </div>
      </section>

      <section className="container py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <form
            onSubmit={handleSubmit}
            className="app-surface border border-slate-200 p-8"
          >
            <div className="grid gap-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Art der Mediation
                </label>
                <select
                  value={mediationType}
                  onChange={(e) => setMediationType(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500"
                >
                  <option value="">Bitte auswählen</option>
                  <option value="trennung">Trennung & Unterhalt</option>
                  <option value="erbschaft">Erbschafts-Konflikt</option>
                  <option value="nachbarschaft">Nachbarschafts-Konflikt</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Kurze Beschreibung des Konflikts (optional)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="z. B. Trennung mit Kind; Geruchsbelästigung durch Nachbarn; Streit um Erbe "
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Was ist gerade am wichtigsten?
                </label>
                <textarea
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  placeholder="z. B. Betreuung, Geld, Wohnung, Kommunikation oder ein konkreter nächster Schritt."
                  className="min-h-28 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Ihre Rolle
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500"
                >
                  {" "}
                  <option value="">Bitte auswählen</option>
                  <option value="beteiligte-person">
                    Ich bin selbst beteiligt
                  </option>
                  <option value="vertretung">
                    Ich handle für eine beteiligte Person
                  </option>
                </select>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                <Link href="/dashboard" className="btn btn-secondary">
                  Abbrechen
                </Link>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-primary"
                >
                  {isSaving ? "Wird gespeichert..." : "Mediation starten →"}
                </button>
              </div>
            </div>
          </form>

          <aside className="app-accent-soft h-fit p-6">
            <h2 className="heading-3 mb-3">Erste Einordnung</h2>
            <p className="text-sm leading-6 text-slate-700">
              In den nächsten Schritten geht es ausschließlich um eine erste
              Orientierung. Weitere Details wie beteiligte Personen, Ziele,
              vorhandene Unterlagen und konkrete Streitpunkte werden im nächsten
              Schritt gezielt abgefragt – abgestimmt auf die gewählte
              Mediationsart. Die Klärung wird erfahrungsgemäß noch ein paar
              Wochen dauern.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
