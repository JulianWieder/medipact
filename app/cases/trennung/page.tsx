"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useState } from "react";

const divorcesCases = [
  {
    id: "divorce-no-kids",
    title: "Scheidung ohne Kinder",
    subtitle: "Vermögensverteilung, Unterhalt, Altersvorsorge",
    icon: "💔",
    color: "blue",
    content: {
      problem:
        "Trennung ist emotional schwer genug. Vor Gericht wird es zum Vermögenskampf: Wer bekommt das Haus? Die Ersparnisse? Die Rentenschuldverpflichtung? Anwälte verdienen, Paar verliert.",
      solution:
        "Mediation: Beide arbeiten gemeinsam an fairer Vermögensverteilung. Ohne Hass, ohne Gutachter, ohne Jahre vor Gericht.",
      process: [
        "Vermögens-Inventar (Haus, Ersparnisse, Autos)",
        "Schulden klären (Hypothek, Kredite)",
        "Altersvorsorge & Rente analysieren",
        "Unterhaltsanspruch berechnen (wenn relevant)",
        "Vermögen fair aufteilen",
        "Haus: Verkaufen oder einen Partner auszahlen?",
        "Versicherungen & Kredite regeln",
        "Schriftliche Vereinbarung",
      ],
      cost: "€499 vs €20–50k+",
      duration: "2–6 Monate vs 1–3 Jahre",
      special:
        "Besondere Punkte: Versicherungs-Klausel (Lebensversicherung muss Ehepartner begünstigen?), Kreditbürgschaft aufheben, Gemeinsame Konten trennen.",
    },
  },
  {
    id: "divorce-high-assets",
    title: "Scheidung mit hohem Vermögen",
    subtitle: "Haus, Aktien, Unternehmen, Kunstsammlung",
    icon: "🏰",
    color: "purple",
    content: {
      problem:
        "Millionen-Vermögen, komplexe Vermögensverhältnisse. Gericht braucht Gutachter, Steuerberater, Immobilienmakler. Die Kosten sind absurd, die Dauer endlos. Beide Parteien verlieren.",
      solution:
        "Mediation mit Experten: Steueroptimierung, faire Aufteilung, schnell & transparent.",
      process: [
        "Komplettes Vermögens-Inventar erstellen",
        "Bewertung: Immobilien, Aktien, Kunstwerke",
        "Schulden und Leasingverpflichtungen",
        "Altersvorsorge & Rentenpunkte teilen",
        "Steuern optimieren (Schenkung vs Verkauf?)",
        "Liquidität klären (Kann einer auszahlen?)",
        "Unterhaltsanspruch (ggf. langfristig)",
        "Immobilien-Szenarios (Verkauf/Weiterbewohnung)",
        "Schriftliche Vereinbarung mit Steuerberater",
      ],
      cost: "€499–2k vs €50–200k+",
      duration: "3–12 Monate vs 2–5 Jahre",
      special:
        "Spezial-Expertise: Steueroptimierung, Immobilien-Gutachten, Aktien & Depot, Kunstsammlungen, Rentenausgleich nach Versorgungsausgleichsgesetz.",
    },
  },
  {
    id: "divorce-business",
    title: "Scheidung mit Unternehmen",
    subtitle: "Wer behält die Firma? Abfindung? Weiterbetrieb?",
    icon: "🏢",
    color: "red",
    content: {
      problem:
        "Einer der Partner hat ein Unternehmen. Gericht muss Firma bewerten, Schulden zuordnen, Unterhaltsanspruch kalkulieren. Lage: Die laufende Firma wird zur Qual. Keiner kann sich auf Geschäft konzentrieren.",
      solution:
        "Mediation: Klare Regeln, Firma bleibt operational, ein Partner übernimmt oder beide verkaufen fair.",
      process: [
        "Unternehmen bewerten (lassen durch Experten)",
        "Schulden & Kredite der Firma klären",
        "Wer will die Firma behalten?",
        "Abfindung fair berechnen",
        "Übergangsphase regeln (6–12 Monate)",
        "Kundenstamm & Verträge zuordnen",
        "Mitarbeiter & Löhne klären",
        "Unterhaltsanspruch mit Firma-Einkommen berechnen",
        "Schriftliche Vereinbarung",
      ],
      cost: "€499 vs €30–100k+",
      duration: "3–9 Monate vs 1–4 Jahre",
      special:
        "Spezial-Expertise: Business-Bewertung, Schulden-Zuordnung, Übergangsmanagement, Mitarbeiter-Übergabe, Steuern bei Firma-Weitergabe.",
    },
  },
  {
    id: "divorce-new-partner",
    title: "Trennung mit neuem Partner",
    subtitle: "Stiefkinder, neue Verpflichtungen, Verwirrung",
    icon: "👨‍👩‍👧‍👦",
    color: "green",
    content: {
      problem:
        "Eine oder beide haben neue Partner + Stiefkinder. Die Sorgerechts-Frage wird komplex: Welche Rolle spielt der neue Partner? Muss der Neue-Partner-Unterhalt zahlen? Erbt der Stiefkind? Gericht braucht Jahre für diese Fragen.",
      solution:
        "Mediation: Klare Rollen, faire Lösungen für alle Beteiligten (Kinder, Partner, neue Partner).",
      process: [
        "Originalfamilie-Struktur klären",
        "Neue Partner-Situation analysieren",
        "Kinder: Wer ist sorgeberechtigt?",
        "Neue Partner: Welche Rolle & Verpflichtung?",
        "Umgangsrecht mit biologischen Eltern",
        "Unterhalt: Wer zahlt was?",
        "Erbrecht klären (Stiefkinder?)",
        "Versicherungen & Vollmachten updaten",
        "Schriftliche Vereinbarung",
      ],
      cost: "€499 vs €25–75k+",
      duration: "3–9 Monate vs 1–3 Jahre",
      special:
        "Spezial-Punkte: Stiefkind-Rechte, Unterhalts-Verschachtelung, Versorgungsausgleich mit neuen Partnern, Erbrechtliche Konsequenzen.",
    },
  },
  {
    id: "divorce-international",
    title: "Internationale Trennung",
    subtitle: "Visum, Auswanderung, Ausland-Vermögen",
    icon: "🌍",
    color: "orange",
    content: {
      problem:
        "Einer oder beide sind nicht-deutsch, leben im Ausland oder wollen auswandern. Welches Recht gilt? Wo wird verhandelt? Gericht in Deutschland oder im Ausland? Monate oder Jahre Unklarheit.",
      solution:
        "Mediation: Klare rechtliche Basis, beide arbeiten zusammen an fairer, international gültiger Lösung.",
      process: [
        "Welches Recht gilt? (Deutsches Recht oder Zielland?)",
        "Wo findet Mediation statt?",
        "Vermögen im Ausland: Wie wird es erfasst?",
        "Währungs-Auswirkungen klären",
        "Visum & Aufenthaltsrecht-Fragen",
        "Kinder: Rückkehr-Recht oder Auswanderung?",
        "Unterhalts-Zahlung international (welche Währung?)",
        "Anerkennung der Vereinbarung im anderen Land",
        "Schriftliche, international gültige Vereinbarung",
      ],
      cost: "€499–1.5k vs €40–120k+",
      duration: "4–12 Monate vs 2–5 Jahre",
      special:
        "Spezial-Expertise: Internationales Recht, Haager Kindesentführungs-Übereinkommen, Visum-Fragen, Währungs-Risiko, Anerkennung im Zielland.",
    },
  },
  {
    id: "divorce-long-marriage",
    title: "Trennung nach langer Ehe",
    subtitle: "Rententeilung, Altersvorsorge, Versorgungsausgleich",
    icon: "👴👵",
    color: "slate",
    content: {
      problem:
        "Nach 20, 30, 40 Jahren Ehe: Rentenpunkte sind aufgebaut, Altersvorsorge ist komplex. Wer bekommt wieviel? Gericht braucht Rentengutachter, Versicherungs-Experten. Am Ende: Weniger für beide, weil Kosten so hoch.",
      solution:
        "Mediation: Fair Rentenpunkte teilen, Altersvorsorge transparent, beide haben Sicherheit im Alter.",
      process: [
        "Rentenkonto-Status beider Partner",
        "Rentenpunkte-Teilung nach Versorgungsausgleich",
        "Beamten-Pensionen klären (unterschiedlich!)",
        "Private Altersvorsorge (Sparbuch, ETFs)",
        "Lebensversicherungen & Rentenversicherungen",
        "Immobilie/Haus regeln",
        "Schenkungen aus der Ehe klären",
        "Unterhaltsanspruch (Alters-, Krankheits-, Unterhalt)",
        "Testament & Vollmacht updaten nach Scheidung",
        "Schriftliche Vereinbarung",
      ],
      cost: "€499 vs €15–40k+",
      duration: "2–8 Monate vs 1–3 Jahre",
      special:
        "Spezial-Punkte: Versorgungsausgleichsgesetz (VAG), Beamten-Pensionen, Rentenkürzung bei frühem Rücktritt, Pflegefallvorsorge, Testament nach Scheidung.",
    },
  },
];

const colorStyles = {
  blue: "from-blue-500 to-blue-600",
  purple: "from-purple-500 to-purple-600",
  red: "from-red-500 to-red-600",
  green: "from-green-500 to-green-600",
  orange: "from-orange-500 to-orange-600",
  slate: "from-slate-500 to-slate-600",
};

const bgStyles = {
  blue: "bg-blue-50",
  purple: "bg-purple-50",
  red: "bg-red-50",
  green: "bg-green-50",
  orange: "bg-orange-50",
  slate: "bg-slate-50",
};

export default function DivorcesCasesPage() {
  const [expandedCase, setExpandedCase] = useState("divorce-no-kids");

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
                Scheidungs-Variationen
              </div>

              <h1 className="mt-8 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Jede Scheidung
                <span className="block bg-gradient-to-r from-emerald-500 to-slate-700 bg-clip-text text-transparent">
                  {" "}
                  ist anders.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                Mit Kindern oder ohne. Mit Vermögen oder nicht. Mit Unternehmen
                oder international – medipact hat für jede Situation eine faire
                Lösung.
              </p>
            </div>
          </div>
        </section>

        {/* ===== DIVORCES ACCORDIONS ===== */}
        <section className="bg-gradient-to-br from-slate-50 to-white py-24">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <div className="space-y-4">
              {divorcesCases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  className={`rounded-[1.75rem] border-2 transition-all duration-300 ${
                    expandedCase === caseItem.id
                      ? `border-emerald-300 shadow-lg shadow-emerald-200/30 bg-white`
                      : "border-slate-200 bg-white"
                  }`}
                >
                  {/* Header - Always Visible */}
                  <button
                    onClick={() =>
                      setExpandedCase(
                        expandedCase === caseItem.id ? "" : caseItem.id,
                      )
                    }
                    className="w-full p-8 text-left hover:bg-slate-50 transition rounded-[1.75rem]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-6">
                        <div className="text-5xl">{caseItem.icon}</div>
                        <div>
                          <h3 className="text-2xl font-black text-slate-900">
                            {caseItem.title}
                          </h3>
                          <p className="mt-2 text-slate-600">
                            {caseItem.subtitle}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`text-3xl transition-transform duration-300 ${
                          expandedCase === caseItem.id ? "rotate-180" : ""
                        }`}
                      >
                        ▼
                      </div>
                    </div>
                  </button>

                  {/* Content - Expandable */}
                  {expandedCase === caseItem.id && (
                    <div
                      className={`border-t-2 border-slate-200 p-8 ${bgStyles[caseItem.color]}`}
                    >
                      <div className="space-y-8">
                        {/* Problem */}
                        <div>
                          <h4 className="text-lg font-bold text-slate-900 mb-3">
                            🔴 Das Problem
                          </h4>
                          <p className="text-slate-700 leading-8">
                            {caseItem.content.problem}
                          </p>
                        </div>

                        {/* Solution */}
                        <div>
                          <h4 className="text-lg font-bold text-slate-900 mb-3">
                            🟢 Die Lösung
                          </h4>
                          <p className="text-slate-700 leading-8">
                            {caseItem.content.solution}
                          </p>
                        </div>

                        {/* Process */}
                        <div>
                          <h4 className="text-lg font-bold text-slate-900 mb-4">
                            ⚙️ Der Prozess
                          </h4>
                          <div className="grid gap-3 md:grid-cols-2">
                            {caseItem.content.process.map((step, idx) => (
                              <div
                                key={idx}
                                className="flex gap-3 rounded-lg bg-white p-4 border border-slate-200"
                              >
                                <div
                                  className={`flex items-center justify-center rounded-lg bg-gradient-to-br ${colorStyles[caseItem.color]} text-white font-bold w-8 h-8 flex-shrink-0 text-sm`}
                                >
                                  {idx + 1}
                                </div>
                                <p className="text-sm text-slate-700">{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Special Points */}
                        <div className="rounded-xl border-2 border-slate-300 bg-white p-6">
                          <h4 className="font-bold text-slate-900 mb-2">
                            ⭐ Spezial-Punkte
                          </h4>
                          <p className="text-sm text-slate-700">
                            {caseItem.content.special}
                          </p>
                        </div>

                        {/* Comparison */}
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="rounded-xl border-2 border-slate-200 bg-white p-6">
                            <div className="text-3xl font-black text-emerald-600 mb-2">
                              {caseItem.content.cost}
                            </div>
                            <p className="text-sm text-slate-600">
                              Mediation vs. Gericht
                            </p>
                          </div>
                          <div className="rounded-xl border-2 border-slate-200 bg-white p-6">
                            <div className="text-3xl font-black text-emerald-600 mb-2">
                              {caseItem.content.duration}
                            </div>
                            <p className="text-sm text-slate-600">
                              Dauer Mediation vs. Gericht
                            </p>
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="pt-4">
                          <a
                            href="#cta"
                            className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-r ${colorStyles[caseItem.color]} px-8 py-4 text-sm font-bold text-white transition hover:scale-[1.02]`}
                          >
                            Mediation für {caseItem.title} starten
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== VERGLEICH ===== */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Warum Mediation bei Scheidungen besser ist
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: "⏱️",
                  title: "Schneller",
                  items: [
                    "3–12 Monate",
                    "Statt 1–4 Jahre",
                    "Schnelle Lösungen",
                  ],
                },
                {
                  icon: "💰",
                  title: "Günstiger",
                  items: [
                    "€499",
                    "Statt €30–100k+",
                    "Keine versteckten Kosten",
                  ],
                },
                {
                  icon: "😌",
                  title: "Menschlicher",
                  items: [
                    "Keine Konfrontation",
                    "Respekt bleibt",
                    "Gemeinsam Lösen",
                  ],
                },
              ].map((benefit) => (
                <div
                  key={benefit.title}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-8 text-center hover:border-emerald-300 hover:shadow-lg transition"
                >
                  <div className="text-5xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    {benefit.title}
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {benefit.items.map((item) => (
                      <li key={item}>✓ {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section
          id="cta"
          className="border-t border-slate-100 bg-gradient-to-br from-emerald-900 to-slate-900 py-24"
        >
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
            <div className="inline-flex items-center rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium tracking-wide text-emerald-200 uppercase mb-8">
              <span className="mr-2">💚</span>
              Fair scheiden tut nicht weh.
            </div>

            <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl mb-6">
              €499. Eure Zukunft.
            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300">
              Egal ob einfache Scheidung oder komplexe Situation mit Kindern,
              Vermögen oder internationalem Hintergrund – medipact findet die
              faire Lösung.
            </p>

            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="mailto:hallo@medipact.de?subject=Scheidungs-Mediation"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-4 text-sm font-bold text-white transition hover:scale-[1.02]"
              >
                Mediation starten
              </a>
              <a
                href="mailto:hallo@medipact.de?subject=Fragen%20zur%20Scheidung"
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
