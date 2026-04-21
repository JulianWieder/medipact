"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function AnnaKlaus() {
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
        <section className="section-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium tracking-wide text-amber-700 uppercase">
                Erbschafts-Fallbeispiel
              </div>
              <h1 className="mt-8 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Anna & Klaus
                <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  Geschwister-Streit um das Haus
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                Eltern verstorben. Ein Haus, zwei Geschwister, zwei völlig
                unterschiedliche Vorstellungen. Ohne Mediation: 2 Jahre Streit,
                €30k+ Kosten. Mit Mediation: Fair gelöst in 3 Monaten.
              </p>
            </div>
          </div>
        </section>

        {/* SITUATION */}
        <section className="section-amber-light">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl mb-6">
                  <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Die Situation
                  </span>
                </h2>
                <div className="space-y-6">
                  <div>
                    <p className="font-bold text-slate-900 mb-2">
                      Anna, 32, Krankenpflegerin
                    </p>
                    <p className="text-slate-700">
                      "Unsere Eltern sind beide gestorben – erst Mama, 3 Jahre
                      später Papa. Das Haus ist alles, was mir von ihnen bleibt.
                      Ich möchte es behalten, für meine Familie. Klaus war immer
                      egoistisch – warum sollte er jetzt die Hälfte bekommen,
                      nur weil es Gesetz ist?"
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 mb-2">
                      Klaus, 35, Manager
                    </p>
                    <p className="text-slate-700">
                      "Ich habe kein Interesse am Haus. Aber es ist auch mein
                      Erbe! Anna kann es haben, aber dann muss sie mich
                      ausbezahlen – €150k. Das ist fair. Aber Anna will zahlen
                      und zahlen... das wird nicht funktionieren. Gericht muss
                      entscheiden."
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid gap-5">
                <article className="rounded-[1.75rem] border border-amber-200 bg-white p-6">
                  <h3 className="font-bold text-slate-900 mb-2">
                    📊 Die Zahlen
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Haus-Wert: €300.000</li>
                    <li>• Hypothek: €0 (abbezahlt)</li>
                    <li>• Erbengemeinschaft: Anna & Klaus je 50%</li>
                    <li>• Klaus Anteil: €150.000</li>
                    <li>• Anna Einkommen: €2.500/Monat</li>
                    <li>• Klaus Einkommen: €3.500/Monat</li>
                  </ul>
                </article>

                <article className="rounded-[1.75rem] border border-red-200 bg-red-50 p-6">
                  <h3 className="font-bold text-red-900 mb-2">
                    ❌ Ohne Mediation (Gericht)
                  </h3>
                  <ul className="space-y-2 text-sm text-red-700">
                    <li>• 2 Jahre Verfahren</li>
                    <li>• Immobilien-Gutachter: €2.000</li>
                    <li>• 2 Anwälte: €15.000</li>
                    <li>• Gerichtskosten: €3.000</li>
                    <li>
                      • <strong>Total: €20.000+</strong>
                    </li>
                    <li className="pt-2 border-t border-red-300">
                      Anna & Klaus: Sprechen 3 Jahre nicht miteinander
                    </li>
                  </ul>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* LÖSUNG */}
        <section className="section-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl mb-12 text-center">
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Mit Mediation
              </span>
            </h2>

            <div className="space-y-4">
              {[
                {
                  month: "Monat 1",
                  title: "Haus fair bewerten",
                  desc: "Ein Gutachter bestätigt: €300k. Klaus Anteil = €150k.",
                },
                {
                  month: "Monat 2",
                  title: "Finanzierung klären",
                  desc: "Anna kann €150k nicht sofort zahlen. Lösung: €2.500/Monat über 60 Monate. Klaus akzeptiert das.",
                },
                {
                  month: "Monat 3",
                  title: "Schriftliche Vereinbarung",
                  desc: "Klaus tritt aus Erbengemeinschaft aus. Anna wird Alleineigentümerin. Zahlungsplan rechtlich bindend.",
                },
              ].map((step) => (
                <article
                  key={step.month}
                  className="rounded-[1.5rem] border border-slate-200 bg-amber-50 p-8"
                >
                  <div className="flex gap-4">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-lg px-4 py-2 font-bold text-center min-w-fit">
                      {step.month}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-700">{step.desc}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <article className="rounded-2xl border border-green-300 bg-green-50 p-8">
                <h3 className="text-2xl font-black text-green-900 mb-4">
                  ✅ Mit Mediation
                </h3>
                <ul className="space-y-3 text-slate-700">
                  <li>✓ €800 Kosten (statt €20k)</li>
                  <li>✓ 3 Monate (statt 2 Jahre)</li>
                  <li>✓ Anna behält das Haus</li>
                  <li>✓ Klaus erhält €150k fair</li>
                  <li>✓ Anna: Bezahlbar in Raten</li>
                  <li>✓ Geschwister-Beziehung bleibt</li>
                </ul>
              </article>

              <article className="rounded-2xl border border-red-300 bg-red-50 p-8">
                <h3 className="text-2xl font-black text-red-900 mb-4">
                  ❌ Ohne Mediation
                </h3>
                <ul className="space-y-3 text-slate-700">
                  <li>✗ €20k+ Kosten</li>
                  <li>✗ 2 Jahre Streit</li>
                  <li>✗ Haus möglicherweise Verkauf unter Druck</li>
                  <li>✗ Klaus wartet, wird ungeduldig</li>
                  <li>✗ Anna: Finanzielle Last unklar</li>
                  <li>✗ Geschwister-Bruch (dauerhaft)</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* ZITAT */}
        <section className="section-amber-light">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <blockquote className="rounded-[1.75rem] border border-amber-200 bg-white p-8">
              <p className="text-lg italic text-slate-700 mb-4">
                "Ich dachte, Klaus und ich kämpfen jetzt 2 Jahre vor Gericht.
                Mediation hat uns gezeigt: Wir wollen beide fair behandelt
                werden. Anna behält das Haus ihrer Eltern, Klaus bekommt sein
                Geld. Und wir sind wieder Geschwister statt Feinde."
              </p>
              <p className="font-bold text-slate-900">— Anna & Klaus</p>
            </blockquote>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="section-amber-dark">
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl mb-6">
              €800. Familie retten.
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-orange-100">
              Erbschaftsstreit ist schmerzhaft. Mediation hilft Geschwistern,
              fair zu teilen – und die Beziehung zu retten.
            </p>
            <div className="mt-12">
              <a
                href="mailto:hallo@medipact.de?subject=Erbschafts-Mediation"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-8 py-4 text-sm font-bold text-white transition hover:scale-[1.02]"
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
