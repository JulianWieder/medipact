"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function Arbeitskonflikt() {
  return (
    <>
      <Header
        logoText="medipact"
        ctaText="Jetzt starten"
        ctaLink="#cta"
        isDark={false}
      />
      <main className="min-h-screen bg-white text-slate-900 pt-[73px]">
        <section className="relative overflow-hidden bg-white py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium tracking-wide text-slate-500 uppercase">
                Arbeitskonflikt
              </div>
              <h1 className="mt-8 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Arbeitskonflikt klären ohne
                <span className="block bg-gradient-to-r from-teal-500 to-slate-700 bg-clip-text text-transparent">
                  Richterstelle zu gehen
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                Mobbing, Diskriminierung, unfaire Kündigungen – Mediation regelt
                Konflikte schnell und vertraulich, bevor Gericht entscheidet.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#cta"
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 px-8 py-4 text-sm font-bold text-white transition hover:scale-[1.02]"
                >
                  Mediation starten
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-teal-50 to-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl mb-16 text-center">
              Die Realität vor Gericht
            </h2>
            <div className="grid gap-8 md:grid-cols-4">
              {[
                {
                  num: "1–3",
                  label: "Jahre Verfahren",
                  desc: "Durchschnittliche Dauer",
                },
                {
                  num: "€25k+",
                  label: "Kosten",
                  desc: "Anwälte, Gericht, Gericht",
                },
                {
                  num: "6–12",
                  label: "Monate Stress",
                  desc: "Emotionale Belastung",
                },
                {
                  num: "50%",
                  label: "Gewinn-Chance",
                  desc: "Ungewiss, wer gewinnt",
                },
              ].map((stat) => (
                <article
                  key={stat.label}
                  className="rounded-2xl border border-slate-200 bg-white p-8 text-center"
                >
                  <div className="text-4xl font-black text-teal-600">
                    {stat.num}
                  </div>
                  <h3 className="mt-2 font-bold text-slate-900">
                    {stat.label}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{stat.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl mb-6">
                  Mit Mediation anders
                </h2>
                <div className="space-y-4">
                  <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
                    <h3 className="font-bold text-teal-900">✅ 2–6 Wochen</h3>
                    <p className="text-sm text-teal-700">
                      Statt 1–3 Jahre vor Gericht
                    </p>
                  </div>
                  <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
                    <h3 className="font-bold text-teal-900">✅ €400–€1.200</h3>
                    <p className="text-sm text-teal-700">
                      Statt €25k+ Gerichtskosten
                    </p>
                  </div>
                  <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
                    <h3 className="font-bold text-teal-900">✅ Vertraulich</h3>
                    <p className="text-sm text-teal-700">
                      Nicht öffentlich wie vor Gericht
                    </p>
                  </div>
                  <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
                    <h3 className="font-bold text-teal-900">
                      ✅ Win-Win Lösung
                    </h3>
                    <p className="text-sm text-teal-700">
                      Beide Seiten akzeptieren das Ergebnis
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Typische Fälle
                </h3>
                <ul className="space-y-3 text-slate-700">
                  <li>✓ Mobbing am Arbeitsplatz</li>
                  <li>✓ Diskriminierung</li>
                  <li>✓ Unfaire Kündigung</li>
                  <li>✓ Lohn-Streitigkeiten</li>
                  <li>✓ Überstunden-Probleme</li>
                  <li>✓ Chef-Mitarbeiter-Konflikte</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section
          id="cta"
          className="border-t border-slate-100 bg-gradient-to-br from-teal-900 to-slate-900 py-24"
        >
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl mb-6">
              €400. Arbeit sollte Freude machen.
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300">
              Arbeitskonflikte lösen sich nicht vor Gericht. Mediation schafft
              schnelle, faire Lösungen – und gibt Ihnen Ihre Zeit zurück.
            </p>
            <div className="mt-12">
              <a
                href="mailto:hallo@medipact.de?subject=Arbeits-Mediation"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 px-8 py-4 text-sm font-bold text-white transition hover:scale-[1.02]"
              >
                Mediation starten
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
