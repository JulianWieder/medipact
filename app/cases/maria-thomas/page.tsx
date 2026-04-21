"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function MariaThomas() {
  return (
    <>
      <Header
        logoText="medipact"
        ctaText="Jetzt starten"
        ctaLink="#cta"
        isDark={false}
      />

      <main className="min-h-screen bg-white text-slate-900 pt-[73px]">
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden bg-white py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium tracking-wide text-slate-500 uppercase">
                Fallbeispiel
              </div>

              <h1 className="mt-8 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Maria & Thomas
                <span className="block bg-gradient-to-r from-emerald-500 to-slate-700 bg-clip-text text-transparent">
                  {" "}
                  Trennung mit 2 Kindern
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                Verheiratet 12 Jahre. 2 Kinder (7 & 9). Thomas wollte Trennung,
                Maria wollte kämpfen. Mit Mediation: Lösung in 5 Monaten statt 3
                Jahre Gericht.
              </p>
            </div>
          </div>
        </section>

        {/* ===== DIE SITUATION ===== */}
        <section className="bg-gradient-to-br from-emerald-50 to-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700 mb-4">
                  Die Ausgangssituation
                </div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl mb-6">
                  "Ich wollte die Kinder nicht verlieren"
                </h2>

                <div className="space-y-6">
                  <div>
                    <p className="font-bold text-slate-900 mb-2">
                      Maria, 38, Teilzeit-Krankenschwester
                    </p>
                    <p className="text-slate-700">
                      "Ich habe Thomas geheiratet, wollte immer mit ihm zusammen
                      sein. Als er mir sagte, dass er mich nicht mehr liebt,
                      habe ich komplett zusammengebrochen. Die Kinder waren mein
                      Fokus – ich konnte mir nicht vorstellen, sie nur jeden 2.
                      und 4. Samstag zu sehen. Ich war bereit zu kämpfen, wenn
                      nötig vor Gericht."
                    </p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900 mb-2">
                      Thomas, 40, IT-Projektmanager
                    </p>
                    <p className="text-slate-700">
                      "Ich liebe meine Kinder. Aber die Ehe war vorbei. Ich
                      wollte nicht vor Gericht mit Maria kämpfen – das wäre für
                      alle furchtbar. Ich brauchte eine Lösung, die für die
                      Kinder funktioniert. Maria wollte aber nicht mit mir
                      reden."
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
                    <li>• Verheiratet: 12 Jahre</li>
                    <li>• Kinder: Emma (9), Felix (7)</li>
                    <li>
                      • Gemeinsames Haus: €600.000 (noch Hypothek €400.000)
                    </li>
                    <li>• Ersparnisse: €80.000 (geteilt)</li>
                    <li>• Maria verdient: €2.500/Monat</li>
                    <li>• Thomas verdient: €3.500/Monat</li>
                  </ul>
                </article>

                <article className="rounded-[1.75rem] border border-red-200 bg-red-50 p-6">
                  <h3 className="font-bold text-red-900 mb-2">
                    ❌ Ohne Mediation (Gericht)
                  </h3>
                  <ul className="space-y-2 text-sm text-red-700">
                    <li>• 3 Jahre Verfahren</li>
                    <li>• 2 Anwälte: €20.000 pro Seite</li>
                    <li>• Psychologische Gutachter: €5.000</li>
                    <li>• Immobilien-Gutachter: €2.000</li>
                    <li>• Gerichtskosten: €5.000</li>
                    <li>
                      • <strong>Total: €52.000+</strong>
                    </li>
                    <li className="pt-2 border-t border-red-300">
                      Emma & Felix: Loyalitätskonflikte, Schulnoten fallen,
                      Angststörungen
                    </li>
                  </ul>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* ===== DER WEG ZUR MEDIATION ===== */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl mb-12 text-center">
              Der Weg zur Mediation
            </h2>

            <div className="space-y-4">
              {[
                {
                  num: "1",
                  title: "Der Tiefpunkt",
                  desc: 'Maria und Thomas sprechen nicht miteinander. Ein Anwalt-Freund von Thomas sagt: "Gericht wird ein Desaster für alle. Versucht Mediation."',
                },
                {
                  num: "2",
                  title: "Erste Skepsis",
                  desc: 'Maria ist skeptisch. "Wie soll das funktionieren? Thomas will die Ehe beenden!" Aber Thomas verspricht: "Es geht nicht darum, die Ehe zu retten. Es geht darum, fair für die Kinder zu regeln."',
                },
                {
                  num: "3",
                  title: "Der Anruf bei medipact",
                  desc: "Thomas kontaktiert medipact. Der Mediator erklärt das Konzept. Beide vereinbaren ein Treffen – getrennt zuerst, dann zusammen.",
                },
                {
                  num: "4",
                  title: "Erstes Gespräch",
                  desc: 'Der Mediator führt getrennte Gespräche mit Maria und Thomas. Maria kann endlich ihre Angst aussprechen: "Ich verliere die Kinder!" Mediator: "Das ist nicht das Ziel. Es geht darum, dass Emma und Felix BEIDE Eltern haben."',
                },
              ].map((step) => (
                <article
                  key={step.num}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-8 hover:border-emerald-200 hover:shadow-lg transition"
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

        {/* ===== DER MEDIATIONS-PROZESS ===== */}
        <section className="bg-gradient-to-br from-emerald-50 to-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl mb-12 text-center">
              Der Mediations-Prozess (5 Monate)
            </h2>

            <div className="space-y-4">
              {[
                {
                  month: "Monat 1",
                  title: "Interessen klären",
                  desc: 'Was brauchen Maria, Thomas und die Kinder wirklich? Nicht "Ich will das Haus" sondern "Ich brauche Stabilität für die Kinder."',
                },
                {
                  month: "Monat 2",
                  title: "Kindeswohl im Fokus",
                  desc: "Emma und Felix brauchen: Beide Eltern regelmäßig sehen. Ein sicherer Zuhause-Ort. Keine Loyalitätskonflikte. Mediator arbeitet mit Harvard-Prinzip.",
                },
                {
                  month: "Monat 3",
                  title: "Sorgerecht & Umgang",
                  desc: "Gemeinsames Sorgerecht bleibt (beide entscheiden Schulen, Arzt, Religion). Emma & Felix leben hauptsächlich bei Maria. Umgang: Thomas hat Montag, Mittwoch, Freitag 17:00–20:00 + jedes 2. Wochenende.",
                },
                {
                  month: "Monat 4",
                  title: "Finanzen transparent",
                  desc: "Unterhalt nach Düsseldorfer Tabelle: Thomas zahlt €450/Monat für beide Kinder. Haus: Maria bleibt wohnen (Thomas bekommt €100k Ausgleich aus Ersparnissen). Hypothek: beide Namen, Maria zahlt (Thomas unterstützt).",
                },
                {
                  month: "Monat 5",
                  title: "Schriftliche Vereinbarung",
                  desc: "Alles dokumentiert. Rechtlich bindend. Beide unterschreiben. Fertig – keine Gericht!",
                },
              ].map((step) => (
                <article
                  key={step.month}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-8"
                >
                  <div className="flex gap-4">
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-lg px-4 py-2 font-bold text-center min-w-fit">
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

        {/* ===== DAS ERGEBNIS ===== */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl mb-12 text-center">
              Das Ergebnis
            </h2>

            <div className="grid gap-8 md:grid-cols-2">
              <article className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-8">
                <h3 className="text-2xl font-black text-emerald-700 mb-4">
                  ✅ Mit Mediation
                </h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>{" "}
                    <span>
                      <strong>€499</strong> Kosten (statt €52k)
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>{" "}
                    <span>
                      <strong>5 Monate</strong> (statt 3 Jahre)
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>{" "}
                    <span>Gemeinsames Sorgerecht bleibt</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>{" "}
                    <span>Thomas hat beide Kinder regelmäßig</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>{" "}
                    <span>Maria behält das Haus</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>{" "}
                    <span>Emma & Felix: Keine Gerichts-Trauma</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>{" "}
                    <span>Maria & Thomas: Respekt bleibt</span>
                  </li>
                </ul>
              </article>

              <article className="rounded-[1.75rem] border border-red-200 bg-red-50 p-8">
                <h3 className="text-2xl font-black text-red-700 mb-4">
                  ❌ Ohne Mediation (Gericht)
                </h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>
                      <strong>€52k+</strong> Kosten
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>
                      <strong>3 Jahre</strong> Verfahren
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>Gericht bestimmt Sorgerecht (nicht beide)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>Umgangsrecht starr: "2. & 4. Samstag"</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>Haus-Verkauf unter Druck</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>Emma & Felix: Psychologische Gutachter, Angst</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>Maria & Thomas: Dauerhass</span>
                  </li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* ===== ZITATE ===== */}
        <section className="bg-gradient-to-br from-emerald-50 to-white py-24">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl mb-12 text-center">
              Was sie sagen
            </h2>

            <div className="space-y-8">
              <blockquote className="rounded-[1.75rem] border border-emerald-200 bg-white p-8">
                <p className="text-lg italic text-slate-700 mb-4">
                  "Ich hätte nie gedacht, dass Thomas und ich ohne Krieg eine
                  Lösung finden. Der Mediator hat uns nicht geraten, sondern hat
                  uns Fragen gestellt, die uns selbst zum Nachdenken brachten.
                  Und die Kinder – Emma und Felix sind so entspannt. Sie sehen
                  Papa regelmäßig, sie wissen, dass beide sie lieben."
                </p>
                <p className="font-bold text-slate-900">— Maria</p>
              </blockquote>

              <blockquote className="rounded-[1.75rem] border border-emerald-200 bg-white p-8">
                <p className="text-lg italic text-slate-700 mb-4">
                  "Maria war anfangs wütend auf mich. Mediation hat uns beide
                  geholfen zu sehen: Es geht nicht um unsere Ehe. Es geht darum,
                  dass Emma und Felix eine gute Zukunft haben. Jetzt
                  respektieren wir uns – nicht mehr als Partner, aber als
                  Co-Eltern. Das ist wichtig für die Kinder."
                </p>
                <p className="font-bold text-slate-900">— Thomas</p>
              </blockquote>
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section
          id="cta"
          className="border-t border-slate-100 bg-gradient-to-br from-emerald-900 to-slate-900 py-24"
        >
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl mb-6">
              Eure Geschichte könnte ähnlich sein
            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300">
              €499. Fair. Schnell. Ohne Gericht. Eure Kinder verdienen eine
              Lösung, bei der beide Eltern noch respektieren – nicht kämpfen.
            </p>

            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="mailto:hallo@medipact.de?subject=Mediation%20wie%20Maria%20&%20Thomas"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-4 text-sm font-bold text-white transition hover:scale-[1.02]"
              >
                Mediation starten
              </a>
              <a
                href="mailto:hallo@medipact.de?subject=Fragen"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
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
