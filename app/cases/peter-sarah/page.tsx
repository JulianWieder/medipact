"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function PeterSarah() {
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
                Peter & Sarah
                <span className="block bg-gradient-to-r from-purple-500 to-slate-700 bg-clip-text text-transparent">
                  {" "}
                  Hohes Vermögen, komplexe Aufteilung
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                Verheiratet 20 Jahre. Kein Kind. Vermögen: Haus (€800k),
                Ersparnisse (€300k), Rentenpunkte. Gericht kostet €80k+.
                Mediation: €1.500, schneller, transparenter.
              </p>
            </div>
          </div>
        </section>

        {/* SITUATION */}
        <section className="bg-gradient-to-br from-purple-50 to-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.25em] text-purple-700 mb-4">
                  Die Ausgangssituation
                </div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl mb-6">
                  "Wie teilen wir eine Million?"
                </h2>
                <div className="space-y-6">
                  <div>
                    <p className="font-bold text-slate-900 mb-2">
                      Peter, 55, Geschäftsführer
                    </p>
                    <p className="text-slate-700">
                      "Unsere Ehe ist zu Ende. Aber wir haben viel zusammen
                      aufgebaut. Wie teilen wir das fair? Immobilien-Gutachter,
                      Rentengutachter, Steuern – das wird eine Katastrophe vor
                      Gericht. Und wir sind beide zu intelligent dafür."
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 mb-2">
                      Sarah, 52, Unternehmensberaterin
                    </p>
                    <p className="text-slate-700">
                      "Ich verdiene genauso wie Peter. Ich möchte keine
                      Unterhalts-Schlacht. Ich möchte wissen: Wer bekommt das
                      Haus? Wie wird die Rente geteilt? Transparent. Fair.
                      Schnell. Gericht ist dafür zu langsam."
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid gap-5">
                <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
                  <h3 className="font-bold text-slate-900 mb-2">📊 Vermögen</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Haus: €800.000 (Hypothek: €200k)</li>
                    <li>• Ersparnisse: €300.000</li>
                    <li>• Rentenpunkte: 50 Jahre Erwerbstätigkeit</li>
                    <li>• Betriebliche Altersvorsorge (Peter)</li>
                    <li>
                      • <strong>Gesamtvermögen: ~€1.1M</strong>
                    </li>
                  </ul>
                </article>

                <article className="rounded-[1.75rem] border border-red-200 bg-red-50 p-6">
                  <h3 className="font-bold text-red-900 mb-2">
                    ❌ Ohne Mediation (Gericht)
                  </h3>
                  <ul className="space-y-2 text-sm text-red-700">
                    <li>• 4 Jahre Verfahren</li>
                    <li>• Immobilien-Gutachter: €3.000</li>
                    <li>• Rentengutachter: €2.000</li>
                    <li>• 2 Anwälte: €30.000</li>
                    <li>• Gerichtskosten: €5.000</li>
                    <li>• Steuerberatung: €5.000</li>
                    <li>
                      • <strong>Total: €45.000+</strong>
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
              Der Mediations-Prozess (8 Monate)
            </h2>
            <div className="space-y-4">
              {[
                {
                  month: "Monat 1-2",
                  title: "Vermögens-Inventar",
                  desc: "Alle Konten, Versicherungen, Schulden aufgelistet. Transparent für beide. Erste Bewertung der Immobilie.",
                },
                {
                  month: "Monat 3",
                  title: "Immobilien-Gutachter",
                  desc: "Ein gemeinsamer Gutachter (nicht zwei!). Kostet weniger, beide vertrauen darauf. Ergebnis: €850.000.",
                },
                {
                  month: "Monat 4",
                  title: "Rentenpunkte teilen",
                  desc: "Versorgungsausgleich nach Gesetz. Mediator erklärt: Sarah bekommt 50% der während Ehe erworbenen Punkte – ca. €200k Äquivalent.",
                },
                {
                  month: "Monat 5-6",
                  title: "Steuern optimieren",
                  desc: "Steuerberater berät: Lieber Schenkung als Verkauf? Welche Strategie spart Steuern? Sparpotenzial: €20k.",
                },
                {
                  month: "Monat 7-8",
                  title: "Finale Aufteilung & Vereinbarung",
                  desc: "Haus: Verkauf. Ertrag: €650k (nach Hypothek). Geteilt: 50/50 = €325k pro Person. Ersparnisse: €300k = €150k pro Person. Total pro Person: €475k.",
                },
              ].map((step) => (
                <article
                  key={step.month}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-8"
                >
                  <div className="flex gap-4">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg px-4 py-2 font-bold text-center min-w-fit">
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
        <section className="bg-gradient-to-br from-purple-50 to-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl mb-12 text-center">
              Das Ergebnis
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <article className="rounded-[1.75rem] border border-purple-200 bg-purple-50 p-8">
                <h3 className="text-2xl font-black text-purple-700 mb-4">
                  ✅ Mit Mediation
                </h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex gap-2">
                    <span className="text-purple-600 font-bold">✓</span>{" "}
                    <span>
                      <strong>€1.500</strong> (statt €45k)
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-600 font-bold">✓</span>{" "}
                    <span>
                      <strong>8 Monate</strong> (statt 4 Jahre)
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-600 font-bold">✓</span>{" "}
                    <span>€20k Steuern gespart durch Optimierung</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-600 font-bold">✓</span>{" "}
                    <span>Jeder erhält: €475.000</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-600 font-bold">✓</span>{" "}
                    <span>Beide verstehen alle Entscheidungen</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-600 font-bold">✓</span>{" "}
                    <span>Netto-Vorteil: €43.500 pro Person!</span>
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
                      <strong>€45k+</strong> Kosten
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>
                      <strong>4 Jahre</strong> Verfahren
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>Haus-Verkauf unter Zeitdruck</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>Jeder erhält: ~€440.000 (wegen Kosten)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>Steueroptimierung vergessen</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>Netto-Verlust: €35k pro Person</span>
                  </li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* ZITATE */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <blockquote className="rounded-[1.75rem] border border-purple-200 bg-white p-8">
              <p className="text-lg italic text-slate-700 mb-4">
                "Wir sind beide intelligent. Gericht wäre ein Insult für unsere
                Intelligenz. Mediation war professionell, fair und sparte uns
                €87.000 pro Person! Das ist nicht zu glauben."
              </p>
              <p className="font-bold text-slate-900">
                — Peter & Sarah (gemeinsam)
              </p>
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
              €1.500. Sparen Sie €87.000.
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300">
              Komplexes Vermögen? Mediation mit Experten ist transparenter,
              schneller und kostengünstiger als Gericht.
            </p>
            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="mailto:hallo@medipact.de?subject=Vermögens-Mediation"
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
