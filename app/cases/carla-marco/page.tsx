"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function CarlaMarco() {
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
                Carla & Marco
                <span className="block bg-gradient-to-r from-red-500 to-slate-700 bg-clip-text text-transparent">
                  Mit Unternehmen
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                Verheiratet 10 Jahre. Zusammen Firma gegründet (GmbH, €500k
                Wert). Marco will raus, Carla will weitermachen. Lösung:
                Abfindung + Firma läuft weiter.
              </p>
            </div>
          </div>
        </section>

        {/* SITUATION */}
        <section className="bg-gradient-to-br from-red-50 to-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl mb-6">
                  "Wir bauen eine Firma auf – dann Trennung"
                </h2>
                <div className="space-y-6">
                  <div>
                    <p className="font-bold text-slate-900 mb-2">
                      Carla, 38, Geschäftsführerin
                    </p>
                    <p className="text-slate-700">
                      "Wir gründeten die Firma zusammen. Aber unsere Ehe
                      funktioniert nicht. Ich möchte die Firma weitermachen –
                      das ist mein Baby! Aber Marco will raus und sein Geld."
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 mb-2">
                      Marco, 40, technischer Gründer
                    </p>
                    <p className="text-slate-700">
                      "Ich bin erschöpft. Ich möchte raus und mein Kapital
                      zurück. Aber ich will nicht, dass die Firma stirbt und
                      unsere Mitarbeiter ihren Job verlieren."
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
                    <li>• GmbH-Wert: €500.000</li>
                    <li>• Carla & Marco: Je 50% Anteile</li>
                    <li>• Schulden: €100.000</li>
                    <li>• 5 Mitarbeiter</li>
                    <li>• Jahresumsatz: €800.000</li>
                  </ul>
                </article>

                <article className="rounded-[1.75rem] border border-red-200 bg-red-50 p-6">
                  <h3 className="font-bold text-red-900 mb-2">
                    ❌ Ohne Mediation
                  </h3>
                  <ul className="space-y-2 text-sm text-red-700">
                    <li>• 3+ Jahre Verfahren</li>
                    <li>• Gutachter + Anwälte: €37.000</li>
                    <li>• Firma: Mitarbeiter gehen, Umsatz fällt</li>
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
              Der Mediations-Prozess
            </h2>
            <div className="space-y-4">
              <article className="rounded-[1.5rem] border border-slate-200 bg-white p-8">
                <h3 className="text-lg font-bold text-slate-900">
                  Monat 1: Firma fair bewerten
                </h3>
                <p className="mt-2 text-sm text-slate-700">
                  Ein Wirtschaftsprüfer bewertet die GmbH auf €500k. Marco hat
                  50% = €250k Anspruch (nach Schulden = €200k netto).
                </p>
              </article>

              <article className="rounded-[1.5rem] border border-slate-200 bg-white p-8">
                <h3 className="text-lg font-bold text-slate-900">
                  Monat 2-3: Übergangsplan
                </h3>
                <p className="mt-2 text-sm text-slate-700">
                  Wie läuft die Firma ohne Marco? Lösung: Marco hilft 3 Monate,
                  dann raus.
                </p>
              </article>

              <article className="rounded-[1.5rem] border border-slate-200 bg-white p-8">
                <h3 className="text-lg font-bold text-slate-900">
                  Monat 4-5: Finanzierung strukturieren
                </h3>
                <p className="mt-2 text-sm text-slate-700">
                  Carla zahlt Marco in Raten (€200k über 4 Jahre = €5k/Monat).
                  Fair für beide.
                </p>
              </article>

              <article className="rounded-[1.5rem] border border-slate-200 bg-white p-8">
                <h3 className="text-lg font-bold text-slate-900">
                  Monat 6: Schriftliche Vereinbarung
                </h3>
                <p className="mt-2 text-sm text-slate-700">
                  Marco aus Geschäftsführung & Anteile. Carla: Alleinige
                  Geschäftsführerin. Firma läuft stabil weiter.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ERGEBNIS */}
        <section className="bg-gradient-to-br from-red-50 to-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl mb-12 text-center">
              Das Ergebnis
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <article className="rounded-[1.75rem] border border-red-200 bg-red-50 p-8">
                <h3 className="text-2xl font-black text-red-700 mb-4">
                  ✅ Mit Mediation
                </h3>
                <ul className="space-y-3 text-slate-700">
                  <li>✓ €600 Kosten (statt €37k)</li>
                  <li>✓ 6 Monate (statt 3 Jahre)</li>
                  <li>✓ Marco: €200k Abfindung</li>
                  <li>✓ Carla: Firma läuft weiter</li>
                  <li>✓ Mitarbeiter: Ihre Jobs bleiben</li>
                  <li>✓ Beide sparen €36.400</li>
                </ul>
              </article>

              <article className="rounded-[1.75rem] border border-red-200 bg-red-50 p-8">
                <h3 className="text-2xl font-black text-red-700 mb-4">
                  ❌ Ohne Mediation
                </h3>
                <ul className="space-y-3 text-slate-700">
                  <li>✗ €37k+ Kosten</li>
                  <li>✗ 3 Jahre Verfahren</li>
                  <li>✗ Marco: Lange wartend</li>
                  <li>✗ Carla: Firma instabil</li>
                  <li>✗ Mitarbeiter: Gehen weg</li>
                  <li>✗ Firma möglicherweise Konkurs</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* ZITAT */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <blockquote className="rounded-[1.75rem] border border-red-200 bg-white p-8">
              <p className="text-lg italic text-slate-700 mb-4">
                "Mediation rettete unsere Firma. Jetzt bin ich
                Alleingeschäftsführerin, Marco ist raus mit seiner Abfindung,
                und unsere Mitarbeiter haben ihre Jobs."
              </p>
              <p className="font-bold text-slate-900">— Carla</p>
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
              €600. Die Firma überlebt.
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300">
              Gründer-Trennung? Mediation rettet die Firma + beide Gründer
              erhalten ihre Anteile.
            </p>
            <div className="mt-12">
              <a
                href="mailto:hallo@medipact.de?subject=Gründer-Mediation"
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
