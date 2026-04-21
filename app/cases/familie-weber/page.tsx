'use client';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function FamilieWeber() {
  return (
    <>
      <Header logoText="medipact" ctaText="Jetzt starten" ctaLink="#cta" isDark={false} />

      <main className="min-h-screen bg-white text-slate-900 pt-[73px]">
        {/* HERO */}
        <section className="section-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium tracking-wide text-amber-700 uppercase">
                Erbschafts-Fallbeispiel
              </div>
              <h1 className="mt-8 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Familie Weber
                <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  Unternehmen erben – wer führt es?
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                Vater verstorben. Metallbau-Betrieb (€1.2M Wert). 3 Kinder: Einer will das Unternehmen, die anderen wollen Geld. Ohne klare Lösung: Betrieb kollabiert, 20 Mitarbeiter ohne Job.
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
                    <p className="font-bold text-slate-900 mb-2">Thomas, 38, Geschäftsführer im Betrieb</p>
                    <p className="text-slate-700">
                      "Papa hat mir alles beigebracht. Ich führe den Betrieb seit 5 Jahren mit ihm. Ich will ihn weitermachen – aber Lisa und Martin wollen Geld. €400k pro Person! Ich kann das nicht zahlen. Der Betrieb wird verkauft, Mitarbeiter raus."
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 mb-2">Lisa, 35, Ärztin</p>
                    <p className="text-slate-700">
                      "Ich habe nichts mit der Metallbau zu tun. Warum sollte ich weniger erben als Thomas, nur weil er da arbeitet? Der Betrieb ist €1.2M wert – mein Anteil: €400k. Das ist fair."
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 mb-2">Martin, 32, Architekt</p>
                    <p className="text-slate-700">
                      "Ich bin einverstanden, dass Thomas den Betrieb hat – aber dann schuldet er mir €400k. Das ist Gesetz. Wenn er nicht zahlen kann, muss der Betrieb verkauft werden. Sorry, aber so ist es fair."
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid gap-5">
                <article className="rounded-[1.75rem] border border-amber-200 bg-white p-6">
                  <h3 className="font-bold text-slate-900 mb-2">📊 Die Zahlen</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Betrieb-Wert: €1.200.000</li>
                    <li>• Schulden: €200.000</li>
                    <li>• Rein-Vermögen: €1.000.000</li>
                    <li>• Pro Kind (zu 3): €333.000</li>
                    <li>• Mitarbeiter: 20 Personen</li>
                    <li>• Jahres-Umsatz: €3.5M</li>
                  </ul>
                </article>

                <article className="rounded-[1.75rem] border border-red-200 bg-red-50 p-6">
                  <h3 className="font-bold text-red-900 mb-2">❌ Ohne Mediation (Gericht)</h3>
                  <ul className="space-y-2 text-sm text-red-700">
                    <li>• 3–4 Jahre Verfahren</li>
                    <li>• Betriebsbewertung: €8.000</li>
                    <li>• 3 Anwälte: €25.000</li>
                    <li>• Gerichtskosten: €5.000</li>
                    <li>• <strong>Total: €38.000+</strong></li>
                    <li className="pt-2 border-t border-red-300">Betrieb wird verkauft. 20 Jobs weg.</li>
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
                { month: 'Monat 1', title: 'Betrieb fair bewerten', desc: 'Wirtschaftsprüfer bewertet Betrieb: €1M (nach Schulden). Thomas verdient €80k/Jahr.' },
                { month: 'Monat 2', title: 'Kreative Lösung', desc: 'Thomas behält Betrieb. Lisa & Martin erhalten: €200k sofort + €130k später als Darlehn vom Betrieb. Thomas zahlt aus Betrieb-Gewinnen.' },
                { month: 'Monat 3', title: 'Garantie für alle', desc: 'Vertrag: Wenn Betrieb verkauft wird, Lisa & Martin bekommen sofort ihre restlichen €130k. Thomas kann weiterarbeiten.' },
                { month: 'Monat 4', title: 'Versöhnung', desc: 'Thomas wird Alleineigentümer. Lisa & Martin sind beruhigt (Geld garantiert). 20 Jobs bleiben erhalten.' },
              ].map((step) => (
                <article key={step.month} className="rounded-[1.5rem] border border-slate-200 bg-amber-50 p-8">
                  <div className="flex gap-4">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-lg px-4 py-2 font-bold text-center min-w-fit">
                      {step.month}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                      <p className="mt-2 text-sm text-slate-700">{step.desc}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <article className="rounded-2xl border border-green-300 bg-green-50 p-8">
                <h3 className="text-2xl font-black text-green-900 mb-4">✅ Mit Mediation</h3>
                <ul className="space-y-3 text-slate-700">
                  <li>✓ €1.200 Kosten (statt €38k)</li>
                  <li>✓ 4 Monate (statt 3–4 Jahre)</li>
                  <li>✓ Thomas: Betrieb läuft, Leben sichert</li>
                  <li>✓ Lisa & Martin: Geld garantiert</li>
                  <li>✓ 20 Mitarbeiter: Jobs erhalten</li>
                  <li>✓ Geschwister: Respekt voreinander</li>
                </ul>
              </article>

              <article className="rounded-2xl border border-red-300 bg-red-50 p-8">
                <h3 className="text-2xl font-black text-red-900 mb-4">❌ Ohne Mediation</h3>
                <ul className="space-y-3 text-slate-700">
                  <li>✗ €38k+ Kosten</li>
                  <li>✗ 3–4 Jahre Streit</li>
                  <li>✗ Thomas: Betrieb wird notverkauft</li>
                  <li>✗ Lisa & Martin: Warten auf Geld</li>
                  <li>✗ 20 Mitarbeiter: Arbeitslose</li>
                  <li>✗ Geschwister: Zerbrochene Familie</li>
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
                "Ich dachte, wir verlieren den Betrieb. 20 Mitarbeiter ohne Arbeit. Aber Mediation hat uns gezeigt: Thomas kann den Betrieb führen, wir erhalten unser Geld – fair und sicher. Papa wäre stolz: Sein Lebenswerk bleibt."
              </p>
              <p className="font-bold text-slate-900">— Lisa, Thomas & Martin Weber</p>
            </blockquote>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="section-amber-dark">
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl mb-6">
              €1.200. Das Lebenswerk retten.
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-orange-100">
              Unternehmens-Erbschaften sind komplex. Mediation schafft Lösungen, die alle retten: Das Unternehmen, die Familie, die Mitarbeiter.
            </p>
            <div className="mt-12">
              <a href="mailto:hallo@medipact.de?subject=Unternehmens-Erbschaft" className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-8 py-4 text-sm font-bold text-white transition hover:scale-[1.02]">
                Mediation starten
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer brandName="medipact" tagline="Konflikte lösen, nicht eskalieren." isDark={false} email="hallo@medipact.de" phone="+49 (0) 69 12345678" />
    </>
  );
}
