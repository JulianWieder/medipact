"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function MarieSophie() {
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
                Marie & Sophie
                <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  Testament-Konflikt
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                Mutter verstorben. Testament: €500k geht an Sophie, Marie erhält
                nur €50k. Marie fühlt sich betrogen. Mediation führt zu fairer
                Lösung – ohne 3 Jahre Gerichtsstreit.
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
                      Marie, 28, Grafikerin
                    </p>
                    <p className="text-slate-700">
                      "Ich war Mamas Lieblingskind! Oder? Das Testament sagt:
                      Nein. Sophie bekommt €500k, ich nur €50k. Warum? Mutter
                      hat mir kurz vor ihrem Tod nichts gesagt. Ich glaube, das
                      Testament ist falsch. Ich werde vor Gericht kämpfen."
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 mb-2">
                      Sophie, 31, Anwältin
                    </p>
                    <p className="text-slate-700">
                      "Mutter hat mir alles vermacht, weil sie wusste, dass ich
                      ihre Schulden bezahlen muss. Die Pflege in den letzten 2
                      Jahren hat €200k gekostet! Ich bin nicht reicher – ich bin
                      reicher verschuldet. Aber Marie glaubt, ich bin die Böse."
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
                    <li>• Testament: Sophie €500k, Marie €50k</li>
                    <li>• Pflegekosten (2 Jahre): €200k</li>
                    <li>• Schulden der Mutter: €50k</li>
                    <li>• Streit-Kosten erwartet: €40k+</li>
                    <li>• Dauer vor Gericht: 3+ Jahre</li>
                  </ul>
                </article>

                <article className="rounded-[1.75rem] border border-red-200 bg-red-50 p-6">
                  <h3 className="font-bold text-red-900 mb-2">
                    ❌ Ohne Mediation (Gericht)
                  </h3>
                  <ul className="space-y-2 text-sm text-red-700">
                    <li>• 3+ Jahre Streit</li>
                    <li>
                      • Psychologische Gutachter (Testierfähigkeit): €5.000
                    </li>
                    <li>• 2 Anwälte: €20.000</li>
                    <li>• Gerichtskosten: €3.000</li>
                    <li>
                      • <strong>Total: €28.000+</strong>
                    </li>
                    <li className="pt-2 border-t border-red-300">
                      Marie & Sophie: Lebenslange Feindschaft
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
                  title: "Zahlen transparent",
                  desc: "Pflegekosten, Schulden werden offen diskutiert. Sophie zeigt Rechnungen. Marie versteht die Realität.",
                },
                {
                  month: "Monat 2",
                  title: "Faire Lösung",
                  desc: "Nach Schulden & Pflege-Kosten bleibt: €250k. Aufteilung: Sophie €175k (weil sie pflegte), Marie €75k (faire Ausgleich).",
                },
                {
                  month: "Monat 3",
                  title: "Versöhnung",
                  desc: "Beide unterschreiben. Marie versteht: Mutter wollte nicht ungerecht sein, nur praktisch. Schwesterliche Beziehung bleibt.",
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
                  <li>✓ €800 Kosten (statt €28k)</li>
                  <li>✓ 3 Monate (statt 3 Jahre)</li>
                  <li>✓ Marie erhält €75k (statt €50k + Streit)</li>
                  <li>✓ Sophie zahlt Schulden fair</li>
                  <li>✓ Pflegeleistung anerkannt</li>
                  <li>✓ Schwestern-Beziehung erhalten</li>
                </ul>
              </article>

              <article className="rounded-2xl border border-red-300 bg-red-50 p-8">
                <h3 className="text-2xl font-black text-red-900 mb-4">
                  ❌ Ohne Mediation
                </h3>
                <ul className="space-y-3 text-slate-700">
                  <li>✗ €28k+ Kosten</li>
                  <li>✗ 3 Jahre Streit</li>
                  <li>✗ Marie gewinnt möglicherweise – oder nicht</li>
                  <li>✗ Sophie zahlt unabhängig weiter Schulden</li>
                  <li>✗ Gericht ignoriert Pflege-Realität</li>
                  <li>✗ Schwestern sprechen nie wieder</li>
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
                "Ich dachte, Mutter liebte mich nicht. Das Testament bewies es.
                Aber Mediation hat mir gezeigt: Mutter liebte uns beide – nur
                auf unterschiedliche Weise. Sophie hat Mutter gepflegt, kostet
                Geld. Das ist fair. Ich bin nicht betrogen. Ich bin verstanden."
              </p>
              <p className="font-bold text-slate-900">— Marie</p>
            </blockquote>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="section-amber-dark">
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl mb-6">
              €800. Vertrauen wiederherstellen.
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-orange-100">
              Testament-Streit ist emotional. Mediation hilft, die Wahrheit zu
              sehen – und Geschwister zu retten.
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
