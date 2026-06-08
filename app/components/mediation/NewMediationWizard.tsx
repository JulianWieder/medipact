"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { NewMediationConfig } from "@/lib/mediation-types/types";

interface Props {
  config: NewMediationConfig;
}

export default function NewMediationWizard({ config }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mediationId = searchParams.get("mediationId");

  const [title, setTitle] = useState("");

  // Build formData state dynamically from config.formFields
  const [formData, setFormData] = useState<Record<string, string>>(() =>
    Object.fromEntries(config.formFields.map((f) => [f.id, ""]))
  );

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    if (!mediationId) {
      setError("Keine Mediations-ID gefunden.");
      return;
    }

    setIsSaving(true);
    setError("");

    // Build description: first textarea value + other non-priority fields as "Label: value"
    const priorityField = config.formFields.find((f) => f.mapTo === "priority");
    const descriptionParts: string[] = [];

    for (const field of config.formFields) {
      const value = formData[field.id];
      if (!value) continue;
      if (field.mapTo === "priority") continue;

      if (field === config.formFields[0]) {
        // First field goes as-is (main description textarea)
        descriptionParts.push(value);
      } else {
        descriptionParts.push(`${field.label}: ${value}`);
      }
    }

    const description = descriptionParts.join(" | ");
    const priority = priorityField ? formData[priorityField.id] : undefined;

    try {
      const res = await fetch(`/api/mediations/${mediationId}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || undefined,
          description: description || undefined,
          priority: priority || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);

        if (res.status === 401 && err?.reauth) {
          setError("Deine Sitzung ist abgelaufen. Du wirst zum Login weitergeleitet …");
          await signIn(undefined, { callbackUrl: window.location.pathname + window.location.search });
          return;
        }

        setError(err?.error ?? `Fehler (${res.status})`);
        return;
      }

      router.push(`/dashboard/${mediationId}`);
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="app-shell pt-[73px]">
      {/* Header section */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container py-12 lg:py-16">
          <Link href="/dashboard/mediation/new" className="btn btn-ghost mb-8">
            ← Zurück zur Auswahl
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <p className="eyebrow mb-4">Neue Mediation</p>

              <h1 className="heading-1 text-slate-900">{config.mainHeading}</h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                {config.mainDescription}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {config.topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <aside className="app-surface border border-slate-200 p-6">
              <p className="eyebrow mb-3">Hinweis</p>
              <h2 className="heading-3 mb-3">{config.disclaimer.title}</h2>
              <p className="text-sm leading-6 text-slate-600">
                {config.disclaimer.text}
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* Form section */}
      <section className="section section-muted">
        <div className="container max-w-4xl">
          <div className="app-surface border border-slate-200 p-8 lg:p-10">
            <p className="eyebrow mb-4">Start</p>

            <h2 className="heading-2 text-slate-900 mb-4">
              Worum geht es konkret?
            </h2>

            <p className="mb-8 text-slate-600 leading-7">
              Beschreiben Sie die Situation sachlich. Noch keine Bewertung, kein
              Urteil, keine Lösung erzwingen. Erst Fakten, dann Interessen, dann
              Optionen.
            </p>

            <div className="grid gap-6">
              {/* Titel */}
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-800">
                  Titel der Mediation <span className="text-emerald-600">*</span>
                </span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="z.B. Trennung Familie Müller"
                  className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-slate-800 outline-none transition focus:border-emerald-500"
                />
              </label>

              <div className="border-t border-slate-100" />

              {/* Render date fields in pairs */}
              {renderFields(config.formFields, formData, handleChange)}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                <Link
                  href="/dashboard/mediation/new"
                  className="btn btn-secondary"
                >
                  Abbrechen
                </Link>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Wird gespeichert..." : "Speichern"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Relevant data section */}
      <section className="container py-12 lg:py-16">
        <div className="mb-8">
          <p className="eyebrow mb-4">Relevante Daten</p>
          <h2 className="heading-2 text-slate-900">
            Was für diese Mediation geklärt werden sollte
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {config.relevantData.map((group) => (
            <article
              key={group.title}
              className="app-surface border border-slate-200 p-6"
            >
              <h3 className="heading-3 mb-4">{group.title}</h3>

              <ul className="space-y-3">
                {group.fields.map((field) => (
                  <li
                    key={field}
                    className="flex gap-3 text-sm leading-6 text-slate-600"
                  >
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                    <span>{field}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Steps section */}
      <section className="section section-muted">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-3">
            {config.steps.map((step) => (
              <article
                key={step.num}
                className="app-surface border border-slate-200 p-6"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-lg font-black text-emerald-700">
                  {step.num}
                </div>

                <h2 className="heading-3 mb-3">{step.title}</h2>

                <p className="text-sm leading-6 text-slate-600">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

// ─── Field rendering helper ───────────────────────────────────────────────────

import { FormField } from "@/lib/mediation-types/types";

function renderFields(
  fields: FormField[],
  formData: Record<string, string>,
  onChange: (id: string, value: string) => void
) {
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < fields.length) {
    const field = fields[i];

    // Group consecutive date fields side by side (max 2 per row)
    if (field.type === "date" && i + 1 < fields.length && fields[i + 1].type === "date") {
      elements.push(
        <div key={`date-pair-${i}`} className="grid gap-6 md:grid-cols-2">
          {renderSingleField(field, formData[field.id], onChange)}
          {renderSingleField(fields[i + 1], formData[fields[i + 1].id], onChange)}
        </div>
      );
      i += 2;
    } else {
      elements.push(renderSingleField(field, formData[field.id], onChange));
      i += 1;
    }
  }

  return elements;
}

function renderSingleField(
  field: FormField,
  value: string,
  onChange: (id: string, value: string) => void
): React.ReactNode {
  const baseClass =
    "w-full rounded-2xl border border-slate-300 bg-white p-4 text-slate-800 outline-none transition focus:border-emerald-500";

  if (field.type === "textarea") {
    return (
      <label key={field.id} className="block">
        <span className="mb-2 block text-sm font-bold text-slate-800">
          {field.label}
        </span>
        <textarea
          value={value}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={`min-h-40 ${baseClass}`}
          placeholder={field.placeholder}
        />
      </label>
    );
  }

  if (field.type === "date") {
    return (
      <label key={field.id} className="block">
        <span className="mb-2 block text-sm font-bold text-slate-800">
          {field.label}
        </span>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={baseClass}
        />
      </label>
    );
  }

  // default: text
  return (
    <label key={field.id} className="block">
      <span className="mb-2 block text-sm font-bold text-slate-800">
        {field.label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(field.id, e.target.value)}
        className={baseClass}
        placeholder={field.placeholder}
      />
    </label>
  );
}
