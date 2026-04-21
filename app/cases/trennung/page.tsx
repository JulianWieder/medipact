"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function TrennungCase() {
  return (
    <>
      <Header
        logoText="medipact"
        ctaText="Jetzt starten"
        ctaLink="#cta"
        isDark={false}
      />

      <main className="min-h-screen bg-white text-slate-900 pt-[73px]">
        {/* HERO */}
        <section
          id="top"
          className="relative overflow-hidden scroll-mt-20 bg-white py-24 lg:py-32"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium tracking-wide text-slate-500 uppercase">
                Trennung & Unterhalt
              </div>

              <h1 className="mt-8 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Trennung ohne
                <span className="block bg-gradient-to-r from-emerald-500 to-slate-700 bg-clip-text text-transparent">
                  {" "}
                  Kampf.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                Unterhaltsregelung, Vermögensverteilung, Sorgerecht – alle
                wichtigen Fragen geklärt durch strukturierte Mediation statt vor
                Gericht.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#cta"
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-4 text-sm font-bold text-white transition hover:scale-[1.02]"
                >
                  Mediation starten
                </a>
                <a
                  href="#process"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition hover:border-emerald-200 hover:bg-emerald-50"
                >
                  Wie es funktioniert
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM SECTION - Light Emerald Background */}
        <section className="bg-gradient-to-br from-emerald-50 via-white to-slate-50 py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                  Das Problem
                </div>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                  Trennung vor Gericht.
                </h2>
                <p className="mt-5 text-lg leading-8 text-slate-700">
                  Eine Trennung ist emotional belastend. Vor Gericht wird es zum
                  Kampf: Verhandlungen über Monate oder Jahre, Anwälte,
                  Gutachter – und am Ende fühlen sich beide verloren.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {[
                  {
                    title: "Jahre statt Monate",
                    text: "Gericht dauert 2–4 Jahre. Mediation: 3–12 Monate.",
                  },
                  {
                    title: "Immense Kosten",
                    text: "Anwälte, Gutachter, Gericht: €30.000–€100.000+",
                  },
                  {
                    title: "Kinder leiden",
                    text: "Jahrelange Kämpfe zerstören Beziehungen zwischen Kind und Eltern.",
                  },
                ].map((point) => (
                  <article
                    key={point.title}
                    className="rounded-[1.75rem] border border-slate-200 bg-white p-6"
                  >
                    <div className="h-1.5 w-14 rounded-full bg-gradient-to-r from-emerald-400 to-slate-500" />
                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      {point.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-700">
                      {point.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SOLUTION - White Background */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-6">
                Mediation Lösung
              </div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Trennung mit Respekt.
              </h2>
              <p className="mt-4 text-lg text-slate-700 max-w-2xl mx-auto">
                Mit medipact arbeiten Sie nicht gegeneinander, sondern zusammen
                – an einer fairen Lösung für alle. Inklusive der Kinder.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {[
                {
                  title: "1. Interessen klären",
                  desc: 'Was ist wirklich wichtig? Nicht "Ich will das Haus" sondern "Ich brauche Stabilität für die Kinder".',
                },
                {
                  title: "2. Gemeinsam Lösungen finden",
                  desc: "Statt Richter-Urteil: Ihr entwickelt Optionen zusammen, die BEIDE erfüllen.",
                },
                {
                  title: "3. Fair & transparent",
                  desc: "Alle Fakten auf dem Tisch. Unterhaltstabelle, Vermögen, Sorgerecht – alles geklärt.",
                },
                {
                  title: "4. Rechtlich bindend",
                  desc: "Die schriftliche Vereinbarung ist genauso bindend wie ein Gerichtsurteil – aber fairer.",
                },
              ].map((step, idx) => (
                <article
                  key={idx}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-8 transition hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/50"
                >
                  <div className="h-1.5 w-16 rounded-full bg-gradient-to-r from-emerald-400 to-slate-500" />
                  <h3 className="mt-6 text-lg font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-700">
                    {step.desc}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS - Dark Background */}
        <section id="process" className="bg-zinc-100 py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-6">
                Ablauf
              </div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Der Mediationsprozess
              </h2>
              <p className="mt-4 text-lg text-slate-700 max-w-2xl mx-auto">
                Strukturiert, transparent, fair.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  num: "01",
                  title: "Eröffnungsgespräch",
                  desc: "Beide teilen ihre Sicht. KI erfasst die Kernthemen.",
                },
                {
                  num: "02",
                  title: "Interessenanalyse",
                  desc: "Was braucht jeder wirklich? Was ist den Kindern wichtig?",
                },
                {
                  num: "03",
                  title: "Unterhaltsberechnung",
                  desc: "Nach Düsseldorfer Tabelle & euren Zahlen – transparent.",
                },
                {
                  num: "04",
                  title: "Vermögensverteilung",
                  desc: "Haus, Ersparnisse, Rente – alles fair aufgeteilt.",
                },
                {
                  num: "05",
                  title: "Sorgerecht & Umgang",
                  desc: "Was ist beste für die Kinder? Beide arbeiten daran.",
                },
                {
                  num: "06",
                  title: "Schriftliche Vereinbarung",
                  desc: "Fertig. Bindend. Gültig vor Gericht.",
                },
              ].map((step) => (
                <article
                  key={step.num}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-8 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/30 transition"
                >
                  <div className="grid gap-6 lg:grid-cols-[80px_1fr]">
                    <div className="flex items-start">
                      <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-bold text-white">
                        {step.num}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-700">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* KOSTEN - Light Background */}
        <section className="bg-gradient-to-br from-emerald-50 to-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-6">
                Kosten
              </div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                €499 vs. €50.000+
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Medipact KI-Pure",
                  price: "€499",
                  items: [
                    "Harvard-Prinzip",
                    "Strukturiert",
                    "Schnell",
                    "3–12 Monate",
                  ],
                  featured: true,
                },
                {
                  title: "Klassische Mediation",
                  price: "€5–15k",
                  items: [
                    "Mit Mediator",
                    "Persönliche Sitzungen",
                    "Erfahren",
                    "3–6 Monate",
                  ],
                },
                {
                  title: "Gericht",
                  price: "€50–100k+",
                  items: [
                    "2 Anwälte",
                    "Gutachter",
                    "Lange Verfahren",
                    "2–4 Jahre",
                  ],
                },
              ].map((option) => (
                <div
                  key={option.title}
                  className={`rounded-[1.75rem] border p-8 ${
                    option.featured
                      ? "border-emerald-300 bg-white shadow-lg shadow-emerald-200/30"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <h3 className="text-lg font-bold text-slate-900">
                    {option.title}
                  </h3>
                  <div className="mt-4 text-4xl font-black text-emerald-600">
                    {option.price}
                  </div>
                  <ul className="mt-8 space-y-3">
                    {option.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-sm text-slate-700"
                      >
                        <span className="text-emerald-600">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ - White Background */}
        <section id="faq" className="bg-white py-24">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-6">
                Q&A
              </div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Häufige Fragen
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "Ist die Mediation bindend?",
                  a: "Ja. Die schriftliche Vereinbarung, die beide unterzeichnen, ist rechtlich bindend – genauso wie ein Gerichtsurteil.",
                },
                {
                  q: "Was wenn wir uns nicht einigen?",
                  a: "Mediation scheitert selten (95% Erfolgsquote). Falls doch: Ihr könnt immer noch vor Gericht gehen – aber ihr spart €50k.",
                },
                {
                  q: "Was ist mit den Kindern?",
                  a: "Kinder sind im Fokus – nicht Kampf zwischen Eltern. Gemeinsamer Fokus: Was ist beste für die Kinder?",
                },
                {
                  q: "Können Anwälte dabei sein?",
                  a: "Ja. Viele lassen sich danach rechtlich beraten oder haben einen Anwalt in der Mediation dabei.",
                },
              ].map((faq) => (
                <article
                  key={faq.q}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-slate-900">{faq.q}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {faq.a}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL - Dark Emerald Background */}
        <section
          id="cta"
          className="border-t border-slate-100 bg-gradient-to-br from-emerald-900 to-slate-900 py-24"
        >
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
            <div className="inline-flex items-center rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium tracking-wide text-emerald-200 uppercase mb-8">
              <span className="mr-2">💚</span>
              Trennung mit Respekt für alle.
            </div>

            <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl mb-6">
              €499. Punkt.
            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300">
              Statt Jahren vor Gericht und €50.000+ Kosten: Strukturierte
              Mediation nach dem Harvard-Prinzip. Fair für beide Eltern. Und vor
              allem: Fair für die Kinder.
            </p>

            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="mailto:hallo@medipact.de?subject=Trennung%20Mediation"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-4 text-sm font-bold text-white transition hover:scale-[1.02]"
              >
                Mediation starten
              </a>
              <a
                href="mailto:hallo@medipact.de?subject=Mit%20Mediator%20sprechen"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
              >
                Mit Mediator sprechen
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer
        brandName="medipact"
        tagline="Konflikte lösen, nicht eskalieren."
        isDark={false}
        email="hallo@medipact.de"
        phone="+49 (0) 69 12345678"
      />
    </>
  );
}
