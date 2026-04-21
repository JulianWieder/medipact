"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function Nachbarschaft() {
  return (
    <>
      <Header
        logoText="medipact"
        ctaText="Jetzt starten"
        ctaLink="#cta"
        isDark={false}
      />
      <main className="min-h-screen bg-white text-slate-900 pt-[73px]">
        <section className="relative overflow-hidden bg-white py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium tracking-wide text-slate-500 uppercase">
                Nachbarschafts-Streit
              </div>
              <h1 className="mt-8 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Nachbar-Konflikt lösen ohne
                <span className="block bg-gradient-to-r from-blue-500 to-slate-700 bg-clip-text text-transparent">
                  Sich ständig zu begegnen
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                Lärm, Grenzen, Bäume, Parkplätze – diese alltäglichen Konflikte
                eskalieren oft vor Gericht. Mediation schafft dauerhafte
                Nachbarschaft.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#cta"
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-4 text-sm font-bold text-white transition hover:scale-[1.02]"
                >
                  Mediation starten
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-blue-50 to-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl mb-16 text-center">
              Die Realität vor Gericht
            </h2>
            <div className="grid gap-8 md:grid-cols-4">
              {[
                {
                  num: "1–3",
                  label: "Jahre Verfahren",
                  desc: "Durchschnittliche Dauer",
                },
                {
                  num: "€15k+",
                  label: "Kosten",
                  desc: "Anwälte, Gericht, Verfahren",
                },
                {
                  num: "100%",
                  label: "Zerstörte Nachbarschaft",
                  desc: "Täglich Spannungen",
                },
                {
                  num: "0",
                  label: "Lösung",
                  desc: "Nur temporärer Richterspruch",
                },
              ].map((stat) => (
                <article
                  key={stat.label}
                  className="rounded-2xl border border-slate-200 bg-white p-8 text-center"
                >
                  <div className="text-4xl font-black text-blue-600">
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

        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl mb-6">
                  Mit Mediation anders
                </h2>
                <div className="space-y-4">
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <h3 className="font-bold text-blue-900">✅ 2–4 Wochen</h3>
                    <p className="text-sm text-blue-700">
                      Statt 1–3 Jahre vor Gericht
                    </p>
                  </div>
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <h3 className="font-bold text-blue-900">✅ €300–€800</h3>
                    <p className="text-sm text-blue-700">
                      Statt €15k+ Gerichtskosten
                    </p>
                  </div>
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <h3 className="font-bold text-blue-900">
                      ✅ Nachbarschaft bleibt
                    </h3>
                    <p className="text-sm text-blue-700">
                      Respektvolle Lösungen statt Krieg
                    </p>
                  </div>
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <h3 className="font-bold text-blue-900">
                      ✅ Langfristig stabil
                    </h3>
                    <p className="text-sm text-blue-700">
                      Beide Seiten akzeptieren die Lösung
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Typische Fälle
                </h3>
                <ul className="space-y-3 text-slate-700">
                  <li>✓ Lärmbelästigung & Musik</li>
                  <li>✓ Grenzstreitigkeiten & Zäune</li>
                  <li>✓ Parkplatz-Konflikte</li>
                  <li>✓ Baum- & Ast-Streit</li>
                  <li>✓ Haustier-Probleme</li>
                  <li>✓ Wasserschaden & Haftung</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section
          id="cta"
          className="border-t border-slate-100 bg-gradient-to-br from-blue-900 to-slate-900 py-24"
        >
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl mb-6">
              €300. Gute Nachbarschaft.
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300">
              Ihr Nachbar ist nicht Ihr Feind. Mediation hilft, Konflikte fair
              zu lösen – und die Nachbarschaft zu retten.
            </p>
            <div className="mt-12">
              <a
                href="mailto:hallo@medipact.de?subject=Nachbarschafts-Mediation"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-4 text-sm font-bold text-white transition hover:scale-[1.02]"
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
