"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function AlexaDavid() {
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
                Alexa & David
                <span className="block bg-gradient-to-r from-orange-500 to-slate-700 bg-clip-text text-transparent">
                  {" "}
                  Mit neuem Partner & Stiefkind
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                Verheiratet 6 Jahre. 2 Kinder (4 & 6). Alexa hat neue
                Partnerschaft mit Stiefkind. Die Fragen: Wer macht was? Wie
                funktioniert das für alle? Lösung in 4 Monaten ohne Gericht.
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
                  "Ist mein neuer Partner ein Problem?"
                </h2>
                <div className="space-y-6">
                  <div>
                    <p className="font-bold text-slate-900 mb-2">
                      Alexa, 35, Sozialarbeiterin
                    </p>
                    <p className="text-slate-700">
                      "Ich liebe David noch, aber wir passen nicht zusammen.
                      Dann habe ich Martin kennengelernt – er hat ein Kind (8),
                      und wir wollen zusammenwohnen. Aber ich hatte Angst: Wird
                      David das verstehen? Was ist mit unseren Kindern?"
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 mb-2">
                      David, 37, Handwerker
                    </p>
                    <p className="text-slate-700">
                      "Ich wollte das nicht hören – Alexa hat einen neuen
                      Freund! Mein erster Gedanke war: Ich verliere meine
                      Kinder. Aber dann habe ich realisiert – Alexa will nicht
                      egoistisch sein. Sie sucht wirklich eine Lösung, die für
                      alle funktioniert. Gericht war das Gegenteil."
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
                    <li>• Verheiratet: 6 Jahre</li>
                    <li>• Kinder: Sophie (6), Leon (4)</li>
                    <li>• Alexa verdient: €2.200/Monat</li>
                    <li>• David verdient: €2.800/Monat</li>
                    <li>• Wohnung gemeinsam: €1.200 Miete</li>
                    <li>• Martins Kind: 8 Jahre (bei Mutter Wochenende)</li>
                  </ul>
                </article>

                <article className="rounded-[1.75rem] border border-red-200 bg-red-50 p-6">
                  <h3 className="font-bold text-red-900 mb-2">
                    ❌ Ohne Mediation (Gericht)
                  </h3>
                  <ul className="space-y-2 text-sm text-red-700">
                    <li>• 2+ Jahre Sorgerechtsstreit</li>
                    <li>• Psychologische Gutachter: €5.000</li>
                    <li>• 2 Anwälte: €25.000</li>
                    <li>• Gerichtskosten: €3.000</li>
                    <li>
                      • <strong>Total: €33.000+</strong>
                    </li>
                    <li className="pt-2 border-t border-red-300">
                      Sophie & Leon: Angst, "Magst du Martin mehr als mich?" –
                      Loyalitätskonflikte
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
              Der Mediations-Prozess (4 Monate)
            </h2>
            <div className="space-y-4">
              {[
                {
                  month: "Monat 1",
                  title: "Alle Beteiligten verstehen",
                  desc: "Nicht nur Alexa & David, sondern auch Martin. Was sind die Ängste? Was brauchen die Kinder?",
                },
                {
                  month: "Monat 2",
                  title: "Rollen klären",
                  desc: 'Ist Martin eine "Quasi-Elternfigur"? Wie stellt sich David das vor? Sophie & Leon: Können sie Martin lieben, ohne Daddy zu vergessen?',
                },
                {
                  month: "Monat 3",
                  title: "Umgang regeln",
                  desc: "Sophie & Leon: Hauptsächlich bei Alexa/Martin (Mo-Fr). David hat Mi + jedes 2. Wochenende. Martins Kind: Nur am Samstag-Sonntag – keine Konfusion für Alexas Kinder.",
                },
                {
                  month: "Monat 4",
                  title: "Schriftliche Vereinbarung",
                  desc: 'Alle verstehen die Rollen. Unterhaltsregel: David zahlt €400/Monat. Regelungen für "Was wenn?" (Martins Kind möchte öfter da sein, etc.)',
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
                      <strong>€499</strong> (statt €33k)
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-600 font-bold">✓</span>{" "}
                    <span>
                      <strong>4 Monate</strong> (statt 2 Jahre)
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-600 font-bold">✓</span>{" "}
                    <span>Sophie & Leon: Beide Eltern, klare Rollen</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-600 font-bold">✓</span>{" "}
                    <span>Martin: Klare Rolle, keine Verwirrung</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-600 font-bold">✓</span>{" "}
                    <span>David: Regelmäßiger Umgang bleibt</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-600 font-bold">✓</span>{" "}
                    <span>Alle 4 respektieren sich</span>
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
                      <strong>€33k+</strong> Kosten
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>
                      <strong>2 Jahre</strong> Verfahren
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>Sophie & Leon: Psychologische Gutachter</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>Hass zwischen Alexa & David</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>Martins Rolle: Ungeklärt & konfus</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">✗</span>{" "}
                    <span>Neue Partnerschaft scheitert unter Druck</span>
                  </li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* ZITATE */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl mb-12 text-center">
              Was sie sagen
            </h2>
            <div className="space-y-8">
              <blockquote className="rounded-[1.75rem] border border-orange-200 bg-white p-8">
                <p className="text-lg italic text-slate-700 mb-4">
                  "Ich hatte Angst, dass David alles kompliziert macht. Aber
                  Mediation hat ihm geholfen zu sehen: Es geht nicht um mich
                  oder Martin. Es geht um Sophie und Leon. Jetzt unterstützt
                  David sogar, dass Martin eine gute Rolle in ihrem Leben hat –
                  nicht als Vater, aber als wichtiger Erwachsener."
                </p>
                <p className="font-bold text-slate-900">— Alexa</p>
              </blockquote>

              <blockquote className="rounded-[1.75rem] border border-orange-200 bg-white p-8">
                <p className="text-lg italic text-slate-700 mb-4">
                  "Ich war wütend auf Martin. Aber der Mediator hat mir geholfen
                  zu verstehen: Martin ist nicht der Feind. Er liebt Alexa, und
                  er wird gut zu Sophie und Leon sein. Das ist besser als ein
                  Krieg vor Gericht, der meine Beziehung zu den Kindern
                  zerstört."
                </p>
                <p className="font-bold text-slate-900">— David</p>
              </blockquote>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          id="cta"
          className="border-t border-slate-100 bg-gradient-to-br from-emerald-900 to-slate-900 py-24"
        >
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl mb-6">
              €499. Fair. Für alle.
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300">
              Neue Partner, Stiefkinder, komplexe Rollen – Mediation findet
              faire Lösungen, die für alle funktionieren.
            </p>
            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="mailto:hallo@medipact.de?subject=Mediation"
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
