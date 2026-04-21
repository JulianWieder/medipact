"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function Erbschaft() {
  return (
    <>
      <Header
        logoText="medipact"
        ctaText="Jetzt starten"
        ctaLink="#cta"
        isDark={false}
      />
      <main className="min-h-screen text-slate-900 pt-[73px]">
        {/* HERO - WHITE */}
        <section className="section-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium tracking-wide text-amber-700 uppercase">
                Erbschafts-Konflikt
              </div>
              <h1 className="mt-8 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Erbe teilen ohne
                <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  Die Familie zu zerstören
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                Ein Todesfall ist schmerzlich. Der Streit um Vermögen, Haus und
                Schulden danach noch schmerzlicher. Mediation hilft, das Erbe
                fair zu teilen – und die Familie zu retten.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#cta"
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-sm font-bold text-white transition hover:scale-[1.02]"
                >
                  Mediation starten
                </a>
                <a
                  href="#problem"
                  className="inline-flex items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 px-8 py-4 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
                >
                  Das Problem verstehen
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* STATS - AMBER-LIGHT */}
        <section className="section-amber-light">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Die Realität vor Gericht
                </span>
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                Erbschaftsstreite sind unter den teuersten und langwierigsten
                Gerichtsverfahren
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-4">
              {[
                {
                  num: "3–5",
                  label: "Jahre Verfahren",
                  desc: "Durchschnittliche Dauer",
                },
                {
                  num: "€40k+",
                  label: "Kosten",
                  desc: "Anwälte, Gutachter, Gericht",
                },
                {
                  num: "100%",
                  label: "Familienbruch",
                  desc: "Geschwister reden nicht mehr",
                },
                {
                  num: "50%",
                  label: "Vermögensabbau",
                  desc: "Durch Gebühren & Steuern",
                },
              ].map((stat) => (
                <article
                  key={stat.label}
                  className="rounded-2xl border border-amber-200 bg-white p-8 text-center transition hover:shadow-lg"
                >
                  <div className="bg-gradient-to-br from-amber-500 to-orange-500 bg-clip-text text-transparent text-4xl font-black">
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

        {/* PROBLEM - WHITE */}
        <section id="problem" className="section-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl mb-16">
              <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Das Kernproblem
                </span>
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {[
                {
                  icon: "🏠",
                  title: "Haus & Immobilien",
                  desc: "Wer bekommt das Haus? Wer zahlt die Hypothek ab? Wie wird der Wert aufgeteilt?",
                },
                {
                  icon: "💰",
                  title: "Vermögen & Ersparnisse",
                  desc: "Bankonten, Versicherungen, Aktien – wer erbt was? Wie werden Schulden verteilt?",
                },
                {
                  icon: "😤",
                  title: "Emotionale Belastung",
                  desc: "Trauer trifft auf Geldstreit. Das führt zu Konfrontation statt Zusammenhalt.",
                },
                {
                  icon: "⚖️",
                  title: "Rechtliche Komplexität",
                  desc: "Erbengemeinschaften, Schulden des Verstorbenen, Pflichtteil-Ansprüche – unklar.",
                },
              ].map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-8 hover:shadow-lg transition"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-700">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* LÖSUNG - AMBER-LIGHT */}
        <section className="section-amber-light">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl mb-16">
              <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Mit Mediation anders
                </span>
              </h2>
            </div>

            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <div className="rounded-xl border border-amber-200 bg-white p-6 hover:shadow-lg transition">
                  <h3 className="text-lg font-bold text-amber-900 mb-2">
                    ⏱️ 2–6 Monate statt 3–5 Jahre
                  </h3>
                  <p className="text-sm text-slate-700">
                    Mediation arbeitet schnell. Ergebnis in wenigen
                    Wochen/Monaten statt Jahren.
                  </p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-white p-6 hover:shadow-lg transition">
                  <h3 className="text-lg font-bold text-amber-900 mb-2">
                    💵 €800–€2.000 statt €40k+
                  </h3>
                  <p className="text-sm text-slate-700">
                    Ein fairer Mediator kostet Hunderte, nicht Tausende für
                    Anwälte.
                  </p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-white p-6 hover:shadow-lg transition">
                  <h3 className="text-lg font-bold text-amber-900 mb-2">
                    👨‍👩‍👧 Familie bleibt zusammen
                  </h3>
                  <p className="text-sm text-slate-700">
                    Respektvolle Lösungen statt Konfrontation. Geschwister
                    können sich danach wieder sehen.
                  </p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-white p-6 hover:shadow-lg transition">
                  <h3 className="text-lg font-bold text-amber-900 mb-2">
                    📈 Mehr Vermögen erhalten
                  </h3>
                  <p className="text-sm text-slate-700">
                    €40k Gerichtskosten sparen = jeder erbt mehr.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-amber-300 bg-white p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-amber-900 mb-6">
                  So funktioniert's
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      step: "1",
                      title: "Inventar erstellen",
                      desc: "Was hat der Verstorbene hinterlassen?",
                    },
                    {
                      step: "2",
                      title: "Fair bewerten",
                      desc: "Immobilien & Vermögen klar dokumentieren",
                    },
                    {
                      step: "3",
                      title: "Interessen klären",
                      desc: "Was braucht jedes Familienmitglied?",
                    },
                    {
                      step: "4",
                      title: "Lösungen finden",
                      desc: "Faire Aufteilung, die alle akzeptieren",
                    },
                    {
                      step: "5",
                      title: "Vereinbarung",
                      desc: "Schriftlich, rechtlich bindend, fertig",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold text-sm">
                          {item.step}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-amber-900">
                          {item.title}
                        </h4>
                        <p className="text-sm text-slate-700">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FALLBEISPIELE - WHITE */}
        <section className="section-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl mb-16">
              <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Echte Fallbeispiele
                </span>
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <a
                href="/cases/anna-klaus"
                className="group rounded-2xl border-2 border-amber-200 bg-amber-50 p-8 hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-700 transition">
                  Anna & Klaus
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  Geschwister-Streit um das Haus
                </p>
                <p className="text-xs text-amber-700 mt-4 font-semibold">
                  €800 Mediation vs €20k Gericht →
                </p>
              </a>

              <a
                href="/cases/marie-sophie"
                className="group rounded-2xl border-2 border-amber-200 bg-amber-50 p-8 hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">📜</div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-700 transition">
                  Marie & Sophie
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  Testament-Konflikt – Ungerechtigkeitsgefühl
                </p>
                <p className="text-xs text-amber-700 mt-4 font-semibold">
                  €800 Mediation vs €28k Gericht →
                </p>
              </a>

              <a
                href="/cases/familie-weber"
                className="group rounded-2xl border-2 border-amber-200 bg-amber-50 p-8 hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-700 transition">
                  Familie Weber
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  Unternehmen erben – 20 Jobs in Gefahr
                </p>
                <p className="text-xs text-amber-700 mt-4 font-semibold">
                  €1.200 Mediation vs €38k Gericht →
                </p>
              </a>
            </div>
          </div>
        </section>

        {/* VERGLEICH - AMBER-LIGHT */}
        <section className="section-amber-light">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl mb-16 text-center">
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Mediation vs. Gericht
              </span>
            </h2>

            <div className="grid gap-8 md:grid-cols-2">
              <article className="rounded-2xl border-2 border-green-300 bg-white p-8">
                <h3 className="text-2xl font-black text-green-900 mb-6">
                  ✅ Mit Mediation
                </h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>{" "}
                    <span>
                      <strong>€800–€2.000</strong>
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>{" "}
                    <span>
                      <strong>2–6 Monate</strong>
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>{" "}
                    <span>Familie bleibt zusammen</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>{" "}
                    <span>Vertraulich & privat</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>{" "}
                    <span>Alle akzeptieren Ergebnis</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>{" "}
                    <span>Mehr Vermögen bleibt</span>
                  </li>
                </ul>
              </article>

              <article className="rounded-2xl border-2 border-red-300 bg-white p-8">
                <h3 className="text-2xl font-black text-red-900 mb-6">
                  ❌ Ohne Mediation (Gericht)
                </h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>
                      <strong>€40k+</strong>
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>
                      <strong>3–5 Jahre</strong>
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>Familie zerstört</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>Öffentliche Verfahren</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>Richter entscheidet</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>50% Vermögen weg</span>
                  </li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* CTA - AMBER-DARK */}
        <section id="cta" className="section-amber-dark">
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl mb-6">
              €800. Die Familie geht vor.
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-orange-100">
              Ein Todesfall ist hart. Der Streit um Geld danach zerstört, was
              übrig ist. Mediation hilft Ihrer Familie, zusammen zu bleiben –
              und fair zu erben.
            </p>
            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="mailto:hallo@medipact.de?subject=Erbschafts-Mediation"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-8 py-4 text-sm font-bold text-white transition hover:scale-[1.02]"
              >
                Mediation starten
              </a>
              <a
                href="mailto:hallo@medipact.de?subject=Fragen-zu-Erbschaft"
                className="inline-flex items-center justify-center rounded-2xl border-2 border-white bg-transparent px-8 py-4 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Kostenloses Gespräch
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
