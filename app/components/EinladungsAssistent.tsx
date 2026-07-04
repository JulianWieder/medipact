"use client";

import { useState } from "react";
import Link from "next/link";

// ── Gegenseite-Einladungs-Assistent ─────────────────────────────────────────
//
// Löst den größten Pain-Point beim Start einer Mediation: "Wie bringe ich meinen
// Konfliktpartner dazu mitzumachen?" Zwei Hebel:
//  1. Eine vorwurfsfreie, lösungsorientierte E-Mail-Vorlage zum Kopieren.
//  2. Der Hinweis, dass die Einladung neutral über medipact läuft — keine
//     unangenehme Konfrontation.
// Die H2 ist bewusst als W-Frage formuliert (Featured-Snippet / KI-Antworten).

const EMAIL_TEMPLATE = `Betreff: Vorschlag, unsere Situation gemeinsam zu klären

Hallo [Name],

ich würde unsere offene Situation gern lösen – fair und ohne Streit. Ich bin auf medipact gestoßen, eine Online-Plattform, die beide Seiten strukturiert und neutral durch ein klärendes Gespräch führt. Das Ganze ist unverbindlich und vertraulich.

Wärst du bereit, dir das gemeinsam mit mir anzusehen? Mir ist wichtig, dass wir beide gehört werden und am Ende eine Lösung finden, mit der wir beide gut leben können.

Viele Grüße
[Dein Name]`;

export function EinladungsAssistent() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(EMAIL_TEMPLATE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard nicht verfügbar – Nutzer kann den Text manuell markieren.
    }
  }

  return (
    <section className="section section-muted border-y border-neutral-200 scroll-mt-20" id="gegenseite-einladen">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <div className="eyebrow mb-4">Der erste Schritt</div>
          <h2 className="heading-2">Wie überzeuge ich die Gegenseite von einer Mediation?</h2>
          <p className="mt-5 text-lg leading-8 text-neutral-600">
            Die größte Hürde ist fast immer dieselbe Frage: „Wie bringe ich die andere Seite dazu,
            mitzumachen?“ Zwei Dinge nehmen Ihnen diese Sorge ab.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* E-Mail-Vorlage */}
          <div className="flex flex-col rounded-3xl border border-neutral-200 bg-white p-7">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-bold text-neutral-900">Fertige Einladungs-Vorlage</h3>
              <button
                type="button"
                onClick={copy}
                className="shrink-0 rounded-full bg-accent-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-accent-700"
              >
                {copied ? "Kopiert ✓" : "Text kopieren"}
              </button>
            </div>
            <p className="mt-2 text-sm text-neutral-500">
              Ohne Vorwürfe, lösungsorientiert formuliert. Kopieren, Namen einsetzen, abschicken.
            </p>
            <pre className="mt-4 flex-1 whitespace-pre-wrap rounded-2xl bg-neutral-50 p-5 font-sans text-sm leading-relaxed text-neutral-700">
              {EMAIL_TEMPLATE}
            </pre>
          </div>

          {/* Neutrale Kontaktaufnahme */}
          <div className="flex flex-col rounded-3xl border border-neutral-200 bg-white p-7">
            <h3 className="text-lg font-bold text-neutral-900">
              Oder: die Einladung neutral über medipact
            </h3>
            <p className="mt-3 leading-7 text-neutral-600">
              Sie müssen das unangenehme Gespräch nicht selbst führen. Wenn Sie Ihren Fall
              angelegt haben, wird die andere Seite über medipact eingeladen – sachlich und
              neutral, nicht als Konfrontation, sondern als Angebot zur gemeinsamen Klärung.
            </p>
            <ul className="mt-5 space-y-3 text-sm text-neutral-700">
              <li className="flex gap-3">
                <span className="mt-0.5 font-bold text-accent-600">✓</span>
                <span>Kein öffentlicher Druck, keine bloßstellende Konfrontation.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 font-bold text-accent-600">✓</span>
                <span>Die andere Seite entscheidet in Ruhe und freiwillig.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 font-bold text-accent-600">✓</span>
                <span>Vertraulich – nichts wird ohne Zustimmung weitergegeben.</span>
              </li>
            </ul>
            <div className="mt-auto pt-6">
              <Link href="/auth/register" className="btn btn-primary">
                Fall anlegen &amp; einladen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
