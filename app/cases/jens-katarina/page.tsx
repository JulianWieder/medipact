"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function JensKatarina() {
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
        <section className="relative overflow-hidden bg-white py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium tracking-wide text-slate-500 uppercase">
                Fallbeispiel
              </div>
              <h1 className="mt-8 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Jens & Katarina
                <span className="block bg-gradient-to-r from-orange-500 to-slate-700 bg-clip-text text-transparent">
                  {" "}
                  Internationale Trennung
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                Verheiratet 8 Jahre. Katarina ist Schweizerin, will zurück in
                die Schweiz. 1 Kind (5). Fragen: Welches Recht? Welcher Ort?
                Visum? Vermögen in 2 Ländern? Mit Mediation: Lösung in 9
                Monaten, rechtsgültig in beiden Ländern.
              </p>
            </div>
          </div>
        </section>

        {/* SITUATION */}
        <section className="bg-gradient-to-br from-orange-50 to-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-700 mb-4">
                  Die Ausgangssituation
                </div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl mb-6">
                  "Ich will nach Hause – mit Kind!"
                </h2>
                <div className="space-y-6">
                  <div>
                    <p className="font-bold text-slate-900 mb-2">
                      Jens, 36, Deutscher, Architekt
                    </p>
                    <p className="text-slate-700">
                      "Katarina möchte zurück in die Schweiz – ihre Heimat. Aber
                      unser Kind lebt hier! Zwei Länder, zwei Rechtssysteme...
                      Das wird kompliziert. Gericht wo? Deutsches oder Schweizer
                      Recht? Das wird ein Albtraum!"
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 mb-2">
                      Katarina, 34, Schweizerin, Grafikerin
                    </p>
                    <p className="text-slate-700">
                      "Ich liebe die Schweiz. Ich möchte Lucas dorthin mitnehmen
                      – nähe zur Familie, bessere Schulen. Aber Jens... ich will
                      nicht, dass er seinen Papa verliert. Und ich will nicht,
                      dass zwei Länder kämpfen. Mediation ist die Lösung."
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid gap-5">
                <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
                  <h3 className="font-bold text-slate-900 mb-2">
                    📊 Die Komplexität
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Länder: Deutschland & Schweiz</li>
                    <li>• Kind: 5 Jahre (Lucas)</li>
                    <li>• Vermögen in Deutschland: Haus (€400k)</li>
                    <li>• Vermögen in Schweiz: Ersparnisse (CHF 80k)</li>
                    <li>• Jens: €3.200 Einkommen</li>
                    <li>• Katarina: CHF 3.500 Einkommen</li>
                  </ul>
                </article>

                <article className="rounded-[1.75rem] border border-red-200 bg-red-50 p-6">
                  <h3 className="font-bold text-red-900 mb-2">
                    ❌ Ohne Mediation (Gericht)
                  </h3>
                  <ul className="space-y-2 text-sm text-red-700">
                    <li>• 2+ Jahre (2 Länder!)</li>
                    <li>• 2 Anwälte in DE: €20.000</li>
                    <li>• 2 Anwälte in CH: CHF 25.000</li>
                    <li>• Internationale Verfahren: Hague-Konvention</li>
                    <li>
                      • <strong>Total: €60.000+</strong>
                    </li>
                    <li className="pt-2 border-t border-red-300">
                      Lucas: Ängstlich, wo ist sein Zuhause?
                    </li>
                  </ul>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* PROZESS */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl mb-12 text-center">
              Der Mediations-Prozess (9 Monate)
            </h2>
            <div className="space-y-4">
              {[
                {
                  month: "Monat 1",
                  title: "Rechtliche Grundlagen klären",
                  desc: "Welches Recht gilt? (Deutsches oder Schweizer?) Hague Kindesentführungs-Abkommen: Katarina darf Lucas nicht einfach mitnehmen. Mediation muss Lösung sein.",
                },
                {
                  month: "Monat 2-3",
                  title: "Interessen analysieren",
                  desc: 'Katarina: "Heimat, Familie, Schulen." Jens: "Ständiger Vater-Sohn-Kontakt." Lucas: "Beide Eltern, aber wo lebe ich?"',
                },
                {
                  month: "Monat 4-5",
                  title: "Lösung gestalten",
                  desc: "Lucas zieht mit Katarina in die Schweiz. Jens hat: Schulferien (6 Wochen) + Monatsbesuche (4 Tage/Monat). Videotelefonie wöchentlich.",
                },
                {
                  month: "Monat 6",
                  title: "Finanzen regeln",
                  desc: "Unterhalt: Jens zahlt Lucas monatlich (in CHF, faire Berechnung). Haus in Deutschland: Verkauf – Erlös geteilt.",
                },
                {
                  month: "Monat 7-8",
                  title: "Anerkennung in beiden Ländern",
                  desc: "Vereinbarung muss in DE UND CH rechtsgültig sein. Mediator koordiniert mit Anwälten in beiden Ländern.",
                },
                {
                  month: "Monat 9",
                  title: "Schriftliche, bi-nationale Vereinbarung",
                  desc: "Signed & sealed. Lucas & Katarina: Schweiz. Jens: Regelmäßiger Kontakt. Alle: Klarheit.",
                },
              ].map((step) => (
                <article
                  key={step.month}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-8"
                >
                  <div className="flex gap-4">
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg px-4 py-2 font-bold text-center min-w-fit">
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
          </div>
        </section>

        {/* ERGEBNIS */}
        <section className="bg-gradient-to-br from-orange-50 to-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl mb-12 text-center">
              Das Ergebnis
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <article className="rounded-[1.75rem] border border-orange-200 bg-orange-50 p-8">
                <h3 className="text-2xl font-black text-orange-700 mb-4">
                  ✅ Mit Mediation
                </h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex gap-2">
                    <span className="text-orange-600 font-bold">✓</span>{" "}
                    <span>
                      <strong>€1.200</strong> Kosten (statt €60k)
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-600 font-bold">✓</span>{" "}
                    <span>
                      <strong>9 Monate</strong> (statt 2+ Jahre)
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-600 font-bold">✓</span>{" "}
                    <span>Lucas: Mutter in Schweiz, Vater regelmäßig</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-600 font-bold">✓</span>{" "}
                    <span>Katarina: Heimat, Familie nah</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-600 font-bold">✓</span>{" "}
                    <span>Jens: Ständiger Sohn-Kontakt</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-600 font-bold">✓</span>{" "}
                    <span>In beiden Ländern rechtsgültig</span>
                  </li>
                </ul>
              </article>

              <article className="rounded-[1.75rem] border border-red-200 bg-red-50 p-8">
                <h3 className="text-2xl font-black text-red-700 mb-4">
                  ❌ Ohne Mediation
                </h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>
                      <strong>€60k+</strong> Kosten
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>
                      <strong>2+ Jahre</strong> Verfahren
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>Lucas: Unsicherheit, Angst</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>Katarina & Jens: Internationale Konflikte</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>Risiko: Hague-Verfahren (Kind-Entführung?)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>Unklar: Welches Urteil gilt wo?</span>
                  </li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* ZITATE */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <blockquote className="rounded-[1.75rem] border border-orange-200 bg-white p-8">
              <p className="text-lg italic text-slate-700 mb-4">
                "Zwei Länder, eine Kind – das hätte ein Desaster sein können.
                Aber Mediation hat allen geholfen zu sehen: Wir alle lieben
                Lucas. Jetzt lebt Lucas mit mir in der Schweiz, sieht seinen
                Papa regelmäßig, und wir alle respektieren die Lösung.
                Deutschland und Schweiz – egal. Mediation funktionierte!"
              </p>
              <p className="font-bold text-slate-900">— Katarina & Jens</p>
            </blockquote>
          </div>
        </section>

        {/* CTA */}
        <section
          id="cta"
          className="border-t border-slate-100 bg-gradient-to-br from-emerald-900 to-slate-900 py-24"
        >
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl mb-6">
              €1.200. Grenzen egal.
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300">
              Internationale Trennung? Mediation funktioniert in beiden Ländern
              – rechtsgültig und respektvoll.
            </p>
            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="mailto:hallo@medipact.de?subject=International-Mediation"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-4 text-sm font-bold text-white transition hover:scale-[1.02]"
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
