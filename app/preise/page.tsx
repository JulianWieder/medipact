"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function Preise() {
  return (
    <>
      <main className="min-h-screen text-slate-900 pt-[73px]">
        {/* HERO */}
        <section className="section-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl lg:text-6xl font-black tracking-tight">
                Transparente Preise.
                <span className="block text-emerald-600">Fair aufgeteilt.</span>
              </h1>
              <p className="mt-6 text-lg text-slate-700">
                Alle Parteien zahlen anteilig. Keine versteckten Kosten. Keine
                Überraschungen.
              </p>
            </div>
          </div>
        </section>

        {/* ZWEI MODELLE */}
        <section className="section-slate-light">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* KI-PURE */}
              <div className="rounded-2xl border-2 border-emerald-200 bg-white p-8 lg:p-10 hover:shadow-xl transition">
                <div className="inline-flex items-center gap-2 rounded border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 uppercase mb-6">
                  💡 KI-Pure
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">
                  Schnell &
                  <span className="block text-emerald-600">Günstig</span>
                </h2>
                <p className="text-slate-600 mb-8">
                  Künstliche Intelligenz löst deinen Konflikt. Sofort, ohne
                  Wartezeiten.
                </p>

                {/* Preise nach Konflikt-Typ */}
                <div className="space-y-4 mb-8 pb-8 border-b border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-900">
                      Nachbarschafts-Streit
                    </span>
                    <span className="text-lg font-bold text-emerald-600">
                      €300
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 -mt-3">
                    ➜ Aufgeteilt auf alle Parteien
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="font-medium text-slate-900">
                      Trennung & Unterhalt
                    </span>
                    <span className="text-lg font-bold text-emerald-600">
                      €499
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 -mt-3">
                    ➜ Pro Partei (z.B. 2 Personen = je €499)
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="font-medium text-slate-900">
                      Erbschafts-Konflikt
                    </span>
                    <span className="text-lg font-bold text-emerald-600">
                      €499
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 -mt-3">
                    ➜ Einmalig für den Fall
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="font-medium text-slate-900">
                      Geschäftspartner-Konflikt
                    </span>
                    <span className="text-lg font-bold text-emerald-600">
                      €499
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 -mt-3">
                    ➜ Einmalig für den Fall
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  <div className="flex gap-3">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="text-sm text-slate-700">
                      <strong>KI-basiert</strong> – Sofortlösung
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="text-sm text-slate-700">
                      <strong>Schnell</strong> – 1–2 Wochen
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="text-sm text-slate-700">
                      <strong>Verfügbar</strong> – Rund um die Uhr
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="text-sm text-slate-700">
                      <strong>Fair</strong> – Alle zahlen anteilig
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="text-sm text-slate-700">
                      <strong>Harvard-Prinzip</strong> – Wissenschaftlich
                      fundiert
                    </span>
                  </div>
                </div>

                <a
                  href="#cta"
                  className="w-full inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition"
                >
                  KI-Pure starten
                </a>
              </div>

              {/* HYBRID */}
              <div className="rounded-2xl border-2 border-emerald-600 bg-gradient-to-br from-emerald-50 to-white p-8 lg:p-10 hover:shadow-xl transition relative">
                <div className="absolute top-0 right-0 bg-emerald-600 text-white px-4 py-1.5 rounded-bl-xl text-xs font-bold uppercase">
                  Beliebt
                </div>
                <div className="inline-flex items-center gap-2 rounded border border-emerald-300 bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 uppercase mb-6">
                  👥 Hybrid
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">
                  Persönlich &
                  <span className="block text-emerald-600">Unterstützt</span>
                </h2>
                <p className="text-slate-600 mb-8">
                  KI-Vorbereitung + echter Mediator für die Verhandlung. Das
                  Beste aus beiden Welten.
                </p>

                {/* Preise */}
                <div className="space-y-4 mb-8 pb-8 border-b border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-900">
                      KI-Vorbereitung
                    </span>
                    <span className="text-lg font-bold text-emerald-600">
                      €499
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 -mt-3">
                    ➜ Einmalig (beide Parteien teilen sich)
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="font-medium text-slate-900">
                      Mediator-Stunde
                    </span>
                    <span className="text-lg font-bold text-emerald-600">
                      €150
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 -mt-3">
                    ➜ Aufgeteilt auf alle Parteien
                  </p>

                  <div className="bg-emerald-50 rounded-lg p-4 mt-4 border border-emerald-200">
                    <p className="text-sm font-semibold text-slate-900 mb-2">
                      Beispiel Scheidung:
                    </p>
                    <p className="text-xs text-slate-700">
                      €499 KI + 2h Mediator (€300) ={" "}
                      <strong>€399 pro Person</strong>
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  <div className="flex gap-3">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="text-sm text-slate-700">
                      <strong>Hybrid-Modell</strong> – KI + Mensch
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="text-sm text-slate-700">
                      <strong>Profi-Mediator</strong> – Erfahren & zertifiziert
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="text-sm text-slate-700">
                      <strong>Flexible Stunden</strong> – Nur zahlen was genutzt
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="text-sm text-slate-700">
                      <strong>Persönlicher Support</strong> – Immer für dich da
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="text-sm text-slate-700">
                      <strong>Höhere Erfolgsquote</strong> – Wenn es komplex
                      wird
                    </span>
                  </div>
                </div>

                <a
                  href="#cta"
                  className="w-full inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition"
                >
                  Hybrid starten
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* VERGLEICH TABELLE */}
        <section className="section-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-3xl font-black text-slate-900 mb-12 text-center">
              Direkt vergleichen
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="text-left py-4 px-4 font-bold text-slate-900">
                      Feature
                    </th>
                    <th className="text-center py-4 px-4 font-bold text-emerald-600">
                      KI-Pure
                    </th>
                    <th className="text-center py-4 px-4 font-bold text-emerald-600">
                      Hybrid
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "KI-Analyse", pure: "✓", hybrid: "✓" },
                    { feature: "Sofort-Lösung", pure: "✓", hybrid: "✓" },
                    { feature: "Mensch-Mediator", pure: "—", hybrid: "✓" },
                    { feature: "Persönliche Beratung", pure: "—", hybrid: "✓" },
                    { feature: "Flexible Stunden", pure: "—", hybrid: "✓" },
                    {
                      feature: "Juristische Unterstützung",
                      pure: "—",
                      hybrid: "✓",
                    },
                    { feature: "Verfügbarkeit", pure: "24/7", hybrid: "Mo–Fr" },
                    {
                      feature: "Dauer",
                      pure: "1–2 Wochen",
                      hybrid: "2–8 Wochen",
                    },
                    { feature: "Erfolgsquote", pure: "85%", hybrid: "95%+" },
                  ].map((row) => (
                    <tr
                      key={row.feature}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {row.feature}
                      </td>
                      <td className="text-center py-3 px-4 text-emerald-600">
                        {row.pure}
                      </td>
                      <td className="text-center py-3 px-4 text-emerald-600">
                        {row.hybrid}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-slate-light">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="text-3xl font-black text-slate-900 mb-12 text-center">
              Häufig gestellte Fragen
            </h2>

            <div className="space-y-4">
              {[
                {
                  q: "Wie wird die Aufteilung der Kosten berechnet?",
                  a: "Alle Parteien zahlen anteilig. Bei einer Scheidung zahlt jede Person den gleichen Anteil. Bei einer Nachbarschafts-Mediation mit 2 Parteien zahlt jede Partei 50%. Vollständige Transparenz!",
                },
                {
                  q: "Kann ich von KI-Pure auf Hybrid wechseln?",
                  a: "Ja! Wenn die KI-Lösung nicht ausreicht, können Sie jederzeit zu einem echten Mediator wechseln. Die KI-Vorbereitung spart dann Zeit.",
                },
                {
                  q: "Gibt es versteckte Kosten?",
                  a: "Nein. Die Preise sind transparent. Was Sie sehen, ist was Sie zahlen. Keine versteckten Gebühren, keine Überraschungen.",
                },
                {
                  q: "Kann ich die Mediation jederzeit abbrechen?",
                  a: "Ja. Sie können jederzeit kündigen. Bei Hybrid zahlen Sie nur die genutzten Stunden des Mediators.",
                },
              ].map((item, idx) => (
                <details
                  key={idx}
                  className="group rounded-lg border border-slate-200 bg-white p-6 hover:shadow-md transition"
                >
                  <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-900">
                    {item.q}
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <p className="mt-4 text-slate-700">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="section-emerald-dark">
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl mb-6">
              Bereit, deinen Konflikt zu lösen?
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-emerald-100">
              Wähle dein Modell und starte noch heute. Alle Parteien zahlen fair
              und transparent.
            </p>
            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="mailto:hallo@medipact.de?subject=KI-Pure%20starten"
                className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-sm font-bold text-emerald-600 hover:bg-emerald-50 transition"
              >
                KI-Pure starten
              </a>
              <a
                href="mailto:hallo@medipact.de?subject=Hybrid%20starten"
                className="inline-flex items-center justify-center rounded-xl border-2 border-white bg-transparent px-8 py-4 text-sm font-bold text-white hover:bg-white/10 transition"
              >
                Hybrid starten
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
