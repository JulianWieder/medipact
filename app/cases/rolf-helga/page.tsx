"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function RolfHelga() {
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
                Rolf & Helga
                <span className="block bg-gradient-to-r from-green-500 to-slate-700 bg-clip-text text-transparent">
                  {" "}
                  Nach 38 Jahren Ehe
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                Verheiratet 38 Jahre. Beide 62 Jahre. Rolf: Beamten-Pension.
                Helga: Teilzeit, niedrige Rente. Frage: Wie ist Helga im Alter
                abgesichert? Mit Mediation: Klare Antwort in 6 Monaten statt 2
                Jahre Gericht.
              </p>
            </div>
          </div>
        </section>

        {/* SITUATION */}
        <section className="bg-gradient-to-br from-green-50 to-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.25em] text-green-700 mb-4">
                  Die Ausgangssituation
                </div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl mb-6">
                  "Im Alter noch Streit?"
                </h2>
                <div className="space-y-6">
                  <div>
                    <p className="font-bold text-slate-900 mb-2">
                      Rolf, 62, ehemaliger Polizist (Beamte)
                    </p>
                    <p className="text-slate-700">
                      "Helga war 25 Jahre zuhause für die Kinder. Jetzt wollen
                      wir uns trennen. Ich verdiene €3.500/Monat, Helga verdient
                      nur €1.800. Wie regeln wir das? Ich möchte nicht vor
                      Gericht kämpfen – das schadet uns beiden im Alter."
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 mb-2">
                      Helga, 60, Teilzeit-Angestellte
                    </p>
                    <p className="text-slate-700">
                      "Ich habe meine Karriere für die Familie geopfert. Jetzt
                      habe ich niedrige Rentenpunkte. Im Alter – mit nur
                      €800/Monat – wie lebe ich? Gericht verspricht Sicherheit,
                      aber dauert Jahre. Ich brauche Klarheit JETZT für meine
                      Planung."
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid gap-5">
                <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
                  <h3 className="font-bold text-slate-900 mb-2">
                    📊 Die Zahlen
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Verheiratet: 38 Jahre (!)</li>
                    <li>• Rolf: Beamten-Pension €3.500/Monat</li>
                    <li>• Helga: Rente (später) ~€800/Monat</li>
                    <li>• Haus: Abbezahlt (€400k Wert)</li>
                    <li>• Ersparnisse: €120.000</li>
                  </ul>
                </article>

                <article className="rounded-[1.75rem] border border-red-200 bg-red-50 p-6">
                  <h3 className="font-bold text-red-900 mb-2">
                    ❌ Ohne Mediation (Gericht)
                  </h3>
                  <ul className="space-y-2 text-sm text-red-700">
                    <li>• 2+ Jahre Verfahren</li>
                    <li>• Rentengutachter: €2.000</li>
                    <li>• Beamten-Pension-Spezialist: €1.500</li>
                    <li>• 2 Anwälte: €20.000</li>
                    <li>• Gerichtskosten: €3.000</li>
                    <li>
                      • <strong>Total: €26.500+</strong>
                    </li>
                    <li className="pt-2 border-t border-red-300">
                      Helga: "Was wenn Rolf bis 67 arbeitet? Ändert sich meine
                      Rente?"
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
              Der Mediations-Prozess (6 Monate)
            </h2>
            <div className="space-y-4">
              {[
                {
                  month: "Monat 1",
                  title: "Rentenpunkte analysieren",
                  desc: "Wie viele Punkte hat Rolf? Helga? Versorgungsausgleichsgesetz (VAG): Rolf gibt 50% seiner während Ehe erworbenen Punkte an Helga.",
                },
                {
                  month: "Monat 2",
                  title: "Beamten-Pension klären",
                  desc: "Spezial-Frage: Rolf ist Beamter – das ist anders als normale Rente! Mediator mit Experte klären: Wie wird Helga berücksichtigt?",
                },
                {
                  month: "Monat 3",
                  title: "Helga im Alter abgesichert?",
                  desc: "Mit Versorgungsausgleich erhält Helga ~€1.200/Monat statt €800. Plus: Ausgleich aus Ersparnissen = €60k. Haus: Helga bleibt wohnen (Rolf erhält Ausgleich).",
                },
                {
                  month: "Monat 4-5",
                  title: "Was wenn Szenarien",
                  desc: "Was wenn Rolf länger arbeitet? Zahl wird angepasst. Was wenn Rolf früher stirbt? Hinterbliebenenversorgung für Helga klar.",
                },
                {
                  month: "Monat 6",
                  title: "Schriftliche Vereinbarung",
                  desc: "Rechtlich bindend. Helga weiß: Im Alter habe ich €1.200 + Haus. Das ist fair und sicher.",
                },
              ].map((step) => (
                <article
                  key={step.month}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-8"
                >
                  <div className="flex gap-4">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg px-4 py-2 font-bold text-center min-w-fit">
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
        <section className="bg-gradient-to-br from-green-50 to-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl mb-12 text-center">
              Das Ergebnis
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <article className="rounded-[1.75rem] border border-green-200 bg-green-50 p-8">
                <h3 className="text-2xl font-black text-green-700 mb-4">
                  ✅ Mit Mediation
                </h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>{" "}
                    <span>
                      <strong>€800</strong> (statt €26.500)
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>{" "}
                    <span>
                      <strong>6 Monate</strong> (statt 2+ Jahre)
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>{" "}
                    <span>Helga: €1.200/Monat im Alter (sicher!)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>{" "}
                    <span>Helga: Haus bleibt ihr</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>{" "}
                    <span>Beide sparen zusammen €25.700</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>{" "}
                    <span>"Was wenn" Szenarien geklärt</span>
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
                      <strong>€26.500+</strong> Kosten
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
                    <span>Helga: Unsicherheit über ihre Altersversorgung</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>Rolf: Jahrelange Spannung</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>Haus-Verkauf möglich (wer zahlt Kosten?)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>Im Alter noch emotionale Belastung</span>
                  </li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* ZITATE */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <blockquote className="rounded-[1.75rem] border border-green-200 bg-white p-8">
              <p className="text-lg italic text-slate-700 mb-4">
                "Im Alter noch Streit vor Gericht? Das ist das Letzte, was wir
                wollten. Mediation hat uns beide beruhigt. Jetzt weiß Helga,
                dass sie im Alter versorgt ist. Und ich weiß, dass das fair ist.
                Im Alter ist Respekt wichtiger als Kampf."
              </p>
              <p className="font-bold text-slate-900">— Rolf & Helga</p>
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
              €800. Im Alter in Frieden.
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300">
              Langjährige Ehen, komplexe Rentenverhältnisse – Mediation bietet
              Sicherheit und Klarheit für das Alter.
            </p>
            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="mailto:hallo@medipact.de?subject=Renten-Mediation"
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
