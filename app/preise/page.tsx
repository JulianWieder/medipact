import type { Metadata } from "next";
import Image from "next/image";
import preisPhoto from "../../fotos/medi_preis.jpg";

export const metadata: Metadata = {
  title: "Preise – Mediation ab €249 | medipact",
  description:
    "Transparente Preise für Mediation bei Scheidung, Nachbarschaftsstreit und Erbe. Drei Modelle – vom geführten Online-Prozess bis zur vollständig persönlich begleiteten Mediation. Alle Parteien zahlen anteilig.",
  alternates: { canonical: "https://medipact.de/preise" },
};

export default function Preise() {
  return (
    <>
      <main className="app-shell pt-[73px]">
        {/* HERO */}
        <section className="relative isolate overflow-hidden">
          <div className="relative min-h-[480px] w-full sm:min-h-[560px]">
            <Image
              src={preisPhoto}
              alt="Faire, transparente Preise bei medipact"
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

            <div className="relative flex min-h-[480px] items-center sm:min-h-[560px]">
              <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-20 lg:px-8">
                <div className="max-w-2xl">
                  <h1 className="text-5xl font-black tracking-tight text-white lg:text-6xl">
                    Transparente Preise.
                    <span className="block bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-400 bg-clip-text text-transparent pb-2">
                      Fair aufgeteilt.
                    </span>
                  </h1>
                  <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200">
                    Sie wissen vorher genau, was auf Sie zukommt. Alle
                    Parteien zahlen anteilig – keine versteckten Kosten, keine
                    Überraschungen am Ende.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DREI MODELLE */}
        <section className="section section-base">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* ONLINE-PROZESS */}
              <div className="rounded-2xl border-2 border-emerald-200 bg-white p-8 hover:shadow-xl transition">
                <div className="inline-flex items-center gap-2 rounded border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 uppercase mb-6">
                  🧭 Online-Prozess
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">
                  Schnell &
                  <span className="block text-emerald-600">Günstig</span>
                </h2>
                <p className="text-slate-600 mb-4">
                  Ein klar geführter Prozess bringt Sie Schritt für Schritt zu
                  einer Lösung – ganz in Ihrem Tempo, ohne Warteliste und ohne
                  Termindruck.
                </p>
                <p className="text-xs text-slate-500 mb-8 italic">
                  Muss nicht einvernehmlich sein – aber für sehr komplexe
                  Scheidungen oder Trennungen (z.B. mit großem Vermögen, Firma
                  oder starkem Eskalationsgrad) empfehlen wir Hybrid oder
                  Vollservice.
                </p>

                {/* Preise nach Konflikt-Typ */}
                <div className="space-y-4 mb-8 pb-8 border-b border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-900">
                      Nachbarschafts-Streit
                    </span>
                    <span className="text-lg font-bold text-emerald-600">
                      €249
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
                      €399
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 -mt-3">
                    ➜ Pro Partei (z.B. 2 Personen = je €399)
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="font-medium text-slate-900">
                      Erbschafts-Konflikt
                    </span>
                    <span className="text-lg font-bold text-emerald-600">
                      €399
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
                      €399
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
                      <strong>Geführter Prozess</strong> – Schritt für Schritt
                      zur Lösung
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
                      <strong>Verfügbar</strong> – Rund um die Uhr, von zu Hause
                      aus
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
                      <strong>Harvard-Prinzip</strong> – Bewährte Methode statt
                      Bauchgefühl
                    </span>
                  </div>
                </div>

                <a
                  href="#cta"
                  className="w-full inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition"
                >
                  Online-Prozess starten
                </a>
              </div>

              {/* HYBRID */}
              <div className="rounded-2xl border-2 border-emerald-600 bg-gradient-to-br from-emerald-50 to-white p-8 hover:shadow-xl transition relative">
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
                  Der geführte Prozess bereitet alles vor – ein echter
                  Mediator begleitet Sie persönlich durch die entscheidenden
                  Gespräche.
                </p>

                {/* Preise */}
                <div className="space-y-4 mb-8 pb-8 border-b border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-900">
                      Scheidung & Trennung
                    </span>
                    <span className="text-lg font-bold text-emerald-600">
                      €499 / Partei
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 -mt-3">
                    ➜ In der Regel €499 × 2 (beide Parteien) – 2 Std.
                    persönliche Mediation bereits enthalten
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="font-medium text-slate-900">
                      Weitere Mediator-Stunden
                    </span>
                    <span className="text-lg font-bold text-emerald-600">
                      €150 / Std.
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 -mt-3">
                    ➜ Nur falls benötigt, aufgeteilt auf alle Parteien
                  </p>

                  <div className="bg-slate-50 rounded-lg p-4 mt-4 border border-slate-200">
                    <p className="text-sm font-semibold text-slate-900 mb-2">
                      Zusätzliche Spezialisten (optional)
                    </p>
                    <p className="text-xs text-slate-700">
                      Wird es rechtlich oder emotional komplex, buchen Sie bei
                      Bedarf gezielt dazu: Rechtsanwalt ab{" "}
                      <strong>€190 / Std.</strong>, Psychologe oder Gutachter
                      ab <strong>€170 / Std.</strong> – nur wenn Sie es
                      wirklich brauchen, transparent abgerechnet.
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  <div className="flex gap-3">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="text-sm text-slate-700">
                      <strong>Hybrid-Modell</strong> – Prozess + persönliche
                      Begleitung
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
                      <strong>2 Std. inklusive</strong> – bei Scheidung von
                      Anfang an dabei
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="text-sm text-slate-700">
                      <strong>Spezialisten zubuchbar</strong> – Rechtsanwalt
                      oder Gutachter bei Bedarf, gegen Aufpreis
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="text-sm text-slate-700">
                      <strong>Persönlicher Support</strong> – Jemand ist für
                      Sie da
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

              {/* VOLLSERVICE */}
              <div className="rounded-2xl border-2 border-slate-300 bg-white p-8 hover:shadow-xl transition">
                <div className="inline-flex items-center gap-2 rounded border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 uppercase mb-6">
                  🛡️ Vollservice
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">
                  Komplett &
                  <span className="block text-emerald-600">Begleitet</span>
                </h2>
                <p className="text-slate-600 mb-8">
                  Für sehr komplexe Scheidungen und Trennungen – mit Vermögen,
                  Firma, Kindern oder hohem Konfliktniveau. Eine feste
                  Ansprechperson begleitet Sie durchgehend, von Anfang bis
                  Ende.
                </p>

                {/* Preise */}
                <div className="space-y-4 mb-8 pb-8 border-b border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-900">
                      Scheidung & Trennung
                    </span>
                    <span className="text-lg font-bold text-emerald-600">
                      €899 / Partei
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 -mt-3">
                    ➜ In der Regel €899 × 2 – 5 Std. Mediator + anwaltliche
                    Ersteinschätzung bereits enthalten
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="font-medium text-slate-900">
                      Weitere Mediator-Stunden
                    </span>
                    <span className="text-lg font-bold text-emerald-600">
                      €150 / Std.
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 -mt-3">
                    ➜ Aufgeteilt auf alle Parteien
                  </p>

                  <div className="bg-slate-50 rounded-lg p-4 mt-4 border border-slate-200">
                    <p className="text-sm font-semibold text-slate-900 mb-2">
                      Weitere Spezialisten (optional)
                    </p>
                    <p className="text-xs text-slate-700">
                      Über die inkludierte Ersteinschätzung hinaus: Rechtsanwalt
                      ab <strong>€190 / Std.</strong>, Psychologe oder Gutachter
                      ab <strong>€170 / Std.</strong> – nach Bedarf, transparent
                      abgerechnet.
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  <div className="flex gap-3">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="text-sm text-slate-700">
                      <strong>Feste Ansprechperson</strong> – durchgehend
                      dieselbe Begleitung
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="text-sm text-slate-700">
                      <strong>5 Std. Mediator inklusive</strong> – mehr Raum
                      für komplexe Themen
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="text-sm text-slate-700">
                      <strong>Anwaltliche Ersteinschätzung</strong> – bereits
                      enthalten
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="text-sm text-slate-700">
                      <strong>Bevorzugte Terminvergabe</strong> – kurze
                      Wartezeiten
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="text-sm text-slate-700">
                      <strong>Höchste Erfolgsquote</strong> – auch bei hohem
                      Eskalationsgrad
                    </span>
                  </div>
                </div>

                <a
                  href="#cta"
                  className="w-full inline-flex items-center justify-center rounded-xl bg-slate-800 px-6 py-3 text-sm font-bold text-white hover:bg-slate-900 transition"
                >
                  Vollservice starten
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* VERGLEICH TABELLE */}
        <section className="section section-muted">
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
                      Online-Prozess
                    </th>
                    <th className="text-center py-4 px-4 font-bold text-emerald-600">
                      Hybrid
                    </th>
                    <th className="text-center py-4 px-4 font-bold text-slate-700">
                      Vollservice
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      feature: "Geführter Prozess",
                      pure: "✓",
                      hybrid: "✓",
                      voll: "✓",
                    },
                    {
                      feature: "Geeignet für sehr komplexe Fälle",
                      pure: "—",
                      hybrid: "Teilweise",
                      voll: "✓",
                    },
                    {
                      feature: "Mensch-Mediator",
                      pure: "—",
                      hybrid: "✓ (2 Std. inklusive)",
                      voll: "✓ (5 Std. inklusive)",
                    },
                    {
                      feature: "Feste Ansprechperson",
                      pure: "—",
                      hybrid: "—",
                      voll: "✓",
                    },
                    {
                      feature: "Rechtsanwalt / Gutachter",
                      pure: "—",
                      hybrid: "Optional, gegen Aufpreis",
                      voll: "Ersteinschätzung inklusive",
                    },
                    {
                      feature: "Verfügbarkeit",
                      pure: "24/7",
                      hybrid: "Mo–Fr",
                      voll: "Mo–Fr, priorisiert",
                    },
                    {
                      feature: "Dauer",
                      pure: "1–2 Wochen",
                      hybrid: "2–8 Wochen",
                      voll: "4–12 Wochen",
                    },
                    {
                      feature: "Erfolgsquote",
                      pure: "85%",
                      hybrid: "95%+",
                      voll: "97%+",
                    },
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
                      <td className="text-center py-3 px-4 text-slate-700">
                        {row.voll}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section section-base">
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
                  q: "Welches Modell passt zu meinem Fall?",
                  a: "Der Online-Prozess eignet sich für unkomplizierte bis mittelschwere Fälle – er muss nicht einvernehmlich sein. Bei sehr komplexen Scheidungen oder Trennungen, etwa mit größerem Vermögen, einer Firma oder starker Eskalation, empfehlen wir Hybrid oder Vollservice mit persönlicher Begleitung.",
                },
                {
                  q: "Wie genau ist die Hybrid-Preisstruktur bei Scheidung?",
                  a: "Bei Scheidung zahlt jede Partei in der Regel €499 – also insgesamt rund €499 × 2. Darin sind die Vorbereitung und bereits 2 Stunden persönliche Mediation enthalten. Weitere Mediator-Stunden kosten €150/Std. und werden auf alle Parteien aufgeteilt.",
                },
                {
                  q: "Was kostet es, einen Rechtsanwalt oder Gutachter hinzuzuziehen?",
                  a: "Bei Bedarf buchen Sie gezielt einen Rechtsanwalt (ab €190/Std.) oder einen Psychologen bzw. Gutachter (ab €170/Std.) dazu. Im Vollservice ist eine anwaltliche Ersteinschätzung bereits enthalten. Sie zahlen nur, wenn Sie es tatsächlich nutzen – klar abgerechnet pro Stunde.",
                },
                {
                  q: "Gibt es versteckte Kosten?",
                  a: "Nein. Die Preise sind transparent. Was Sie sehen, ist was Sie zahlen. Zusatzleistungen wie Anwalt oder Gutachter sind klar ausgewiesen und werden nur auf Wunsch gebucht.",
                },
                {
                  q: "Kann ich die Mediation jederzeit abbrechen?",
                  a: "Ja. Sie können jederzeit kündigen. Bei Hybrid und Vollservice zahlen Sie nur die tatsächlich genutzten Stunden des Mediators und etwaiger Spezialisten.",
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
        <section id="cta" className="section section-strong">
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl mb-6">
              Bereit, wieder klar nach vorne zu schauen?
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-emerald-100">
              Wählen Sie Ihren Weg und starten Sie noch heute – ruhig,
              vertraulich und fair für alle Seiten.
            </p>
            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="mailto:hallo@medipact.de?subject=Online-Prozess%20starten"
                className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-sm font-bold text-emerald-600 hover:bg-emerald-50 transition"
              >
                Online-Prozess starten
              </a>
              <a
                href="mailto:hallo@medipact.de?subject=Hybrid%20starten"
                className="inline-flex items-center justify-center rounded-xl border-2 border-white bg-transparent px-8 py-4 text-sm font-bold text-white hover:bg-white/10 transition"
              >
                Hybrid starten
              </a>
              <a
                href="mailto:hallo@medipact.de?subject=Vollservice%20starten"
                className="inline-flex items-center justify-center rounded-xl border-2 border-white/60 bg-transparent px-8 py-4 text-sm font-bold text-white hover:bg-white/10 transition"
              >
                Vollservice starten
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
