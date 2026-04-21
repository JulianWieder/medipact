"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function TrennungKindCase() {
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
        <section
          id="top"
          className="relative overflow-hidden scroll-mt-20 bg-white py-24 lg:py-32"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium tracking-wide text-slate-500 uppercase">
                Trennung mit Kindern
              </div>

              <h1 className="mt-8 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Trennung ohne
                <span className="block bg-gradient-to-r from-emerald-500 to-slate-700 bg-clip-text text-transparent">
                  {" "}
                  Die Kinder zu verlieren.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                Sorgerecht, Umgangsrecht, Kinderunterhalt – die wichtigsten
                Entscheidungen für eure Kinder. Nicht vor Gericht, sondern
                gemeinsam. Mit Fokus auf das Kindeswohl.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#cta"
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-4 text-sm font-bold text-white transition hover:scale-[1.02]"
                >
                  Mediation starten
                </a>
                <a
                  href="#process"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition hover:border-emerald-200 hover:bg-emerald-50"
                >
                  Wie es funktioniert
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ===== STATISTIK ===== */}
        <section className="bg-gradient-to-br from-emerald-50 to-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Die Realität vor Gericht
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-4">
              {[
                {
                  num: "2–4",
                  label: "Jahre Verfahren",
                  desc: "Durchschnittliche Dauer bei Sorgerechtsstreiten",
                },
                {
                  num: "€50k+",
                  label: "Kosten",
                  desc: "Anwälte, Gutachter, Gericht, Verfahren",
                },
                {
                  num: "95%",
                  label: "Belastet",
                  desc: "Der Kinder leiden unter jahrelanger Unsicherheit",
                },
                {
                  num: "1 von 3",
                  label: "Revisionen",
                  desc: "Erste Urteile werden anfechtbar",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-8 text-center"
                >
                  <div className="text-5xl font-black bg-gradient-to-r from-emerald-500 to-slate-700 bg-clip-text text-transparent">
                    {stat.num}
                  </div>
                  <div className="mt-4 text-lg font-bold text-slate-900">
                    {stat.label}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PROBLEM ===== */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                  Das Problem
                </div>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                  Wenn Eltern vor Gericht kämpfen.
                </h2>
                <p className="mt-5 text-lg leading-8 text-slate-700">
                  Eine Trennung ist schwer. Aber wenn Kinder involviert sind,
                  wird es zum Trauma: Gerichtskämpfe, Gutachter, Psychologen,
                  Loyalitätskonflikte – und die Kinder sind in der Mitte.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {[
                  {
                    title: "Loyalitätskonflikt",
                    text: 'Kind wird zum Kriegsschauplatz. "Magst du Mama oder Papa mehr?"',
                  },
                  {
                    title: "Psychische Belastung",
                    text: "Angststörungen, Depressionen, Schlafstörungen – jahrelang.",
                  },
                  {
                    title: "Unsicherheit",
                    text: 'Kind kennt seine Zukunft nicht. "Wer hat mich?" "Wann sehe ich Papa/Mama?"',
                  },
                  {
                    title: "Gutachter-Trauma",
                    text: 'Psychologische Tests, Befragungen – Kind wird zum "Fall".',
                  },
                  {
                    title: "Schule & Entwicklung",
                    text: "Noten fallen. Freundschaften leiden. Konzentration weg.",
                  },
                  {
                    title: "Kosten-Belastung",
                    text: "Eltern geben €50k+ aus – statt in Bildung/Entwicklung des Kindes.",
                  },
                ].map((point) => (
                  <article
                    key={point.title}
                    className="rounded-[1.75rem] border border-slate-200 bg-white p-6"
                  >
                    <div className="h-1.5 w-14 rounded-full bg-gradient-to-r from-emerald-400 to-slate-500" />
                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      {point.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-700">
                      {point.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== KINDESWOHL ===== */}
        <section className="bg-gradient-to-br from-emerald-50 via-white to-slate-50 py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-6">
                Kindeswohl
              </div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Was Kinder wirklich brauchen
              </h2>
              <p className="mt-4 text-lg text-slate-700 max-w-2xl mx-auto">
                Nicht: Gerichtskampf. Sondern: Stabilität, Sicherheit, beide
                Eltern.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: "🏠",
                  title: "Stabilität",
                  desc: "Feste Wohnsituation, fester Rhythmus, feste Bezugspersonen.",
                },
                {
                  icon: "❤️",
                  title: "Beide Eltern",
                  desc: 'Regelmäßiger Kontakt zu Mama UND Papa – nicht "gerichtlich bestimmt".',
                },
                {
                  icon: "😌",
                  title: "Keine Loyalitätskonflikte",
                  desc: 'Kind muss sich nicht zwischen Eltern "entscheiden".',
                },
                {
                  icon: "🎓",
                  title: "Bildung & Entwicklung",
                  desc: "Fokus auf Schule, Freunde, Aktivitäten – nicht Gericht.",
                },
                {
                  icon: "💪",
                  title: "Psychische Gesundheit",
                  desc: "Keine Angststörungen, Depressionen, Schlafstörungen.",
                },
                {
                  icon: "🤝",
                  title: "Eltern-Zusammenarbeit",
                  desc: "Eltern arbeiten zusammen – nicht gegeneinander.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-8 text-center hover:border-emerald-300 hover:shadow-lg transition"
                >
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== LÖSUNG ===== */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-6">
                Mediation Lösung
              </div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Trennung mit Fokus auf Kinder.
              </h2>
              <p className="mt-4 text-lg text-slate-700 max-w-2xl mx-auto">
                Beide Eltern arbeiten zusammen – am besten für die Kinder.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {[
                {
                  title: "Das Kind sitzt NICHT im Gerichtssaal",
                  desc: "Keine traumatischen Verhandlungen. Keine Gutachter-Tests. Kind bleibt Kind.",
                },
                {
                  title: "Eltern entscheiden gemeinsam",
                  desc: 'Nicht Richter sagt "Mama hat Sorgerecht". Eltern sagen zusammen: "Das ist beste für unser Kind".',
                },
                {
                  title: "Umgangsrecht ist praktisch",
                  desc: 'Nicht: "Jeden 2. und 4. Samstag 14:00–18:00". Sondern: "Wir passen es an, was das Kind braucht".',
                },
                {
                  title: "Schnell = Sicherheit",
                  desc: "Nach 3–12 Monaten: Klar. Kind weiß, wo es hingehört. Nicht 2–4 Jahre Unsicherheit.",
                },
                {
                  title: "Kosten sparen = Mehr für Kinder",
                  desc: "Statt €50k Gericht: €499 Mediation. Geld für Therapie, Aktivitäten, Bildung.",
                },
                {
                  title: "Eltern-Beziehung bleibt respektvoll",
                  desc: 'Nicht: Hass vor Gericht. Sondern: "Wir sind getrennt, aber Eltern-Partner bleiben wir".',
                },
              ].map((step, idx) => (
                <article
                  key={idx}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-8 transition hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/50"
                >
                  <div className="h-1.5 w-16 rounded-full bg-gradient-to-r from-emerald-400 to-slate-500" />
                  <h3 className="mt-6 text-lg font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-700">
                    {step.desc}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PROCESS DETAILLIERT ===== */}
        <section id="process" className="bg-zinc-100 py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-6">
                Ablauf
              </div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Der Mediationsprozess mit Kindern
              </h2>
              <p className="mt-4 text-lg text-slate-700 max-w-2xl mx-auto">
                Kind-zentriert. Professionell. Fair.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  num: "01",
                  title: "Eröffnungsgespräch (getrennt)",
                  desc: "Eltern sprechen einzeln. Keine Konfrontation vor dem Kind. KI erfasst: Wer sind die Kinder? Wie alt? Wo leben? Schulen?",
                },
                {
                  num: "02",
                  title: "Interessenanalyse",
                  desc: "Was brauchen die Kinder wirklich? Stabilität? Beide Eltern? Was braucht jeder Elternteil für Bindung?",
                },
                {
                  num: "03",
                  title: "Sorgerecht klären",
                  desc: "Gemeinsames Sorgerecht oder getrennt? Wie treffen Eltern gemeinsam Entscheidungen (Schule, Arzt, Religion)?",
                },
                {
                  num: "04",
                  title: "Umgangsrecht praktisch",
                  desc: "Nicht starre Regeln. Rhythmus: Wie oft sieht Kind jeden Elternteil? Ferienzeiten? Feiertage? Flexibilität?",
                },
                {
                  num: "05",
                  title: "Kinderunterhalt berechnen",
                  desc: "Nach Düsseldorfer Tabelle, Einkommen, Besonderheiten. Transparent. Beide verstehen, wohin das Geld geht.",
                },
                {
                  num: "06",
                  title: "Schule & Aktivitäten",
                  desc: "Wer zahlt Schulgebühren? Musikunterricht? Sport? Wie werden Entscheidungen getroffen?",
                },
                {
                  num: "07",
                  title: "Kommunikation-Regeln",
                  desc: "Wie sprechen Eltern über die Kinder? Kein Badmouthing. Positive Kommunikation.",
                },
                {
                  num: "08",
                  title: "Krisenplan",
                  desc: "Was wenn Kind krank wird? Unfall? Psychische Probleme? Wie entscheiden Eltern schnell zusammen?",
                },
                {
                  num: "09",
                  title: "Dokumentation",
                  desc: "Alle Entscheidungen schriftlich. Rechtlich bindend. Beide unterschreiben.",
                },
              ].map((step) => (
                <article
                  key={step.num}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-8 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/30 transition"
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

        {/* ===== SPEZIALTHEMEN ===== */}
        <section className="bg-gradient-to-br from-emerald-50 to-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-6">
                Spezialthemen
              </div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Themen die oft vergessen werden
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {[
                {
                  title: "Psychologische Unterstützung",
                  desc: "Braucht das Kind Therapie nach der Trennung? Wer zahlt? Wie verarbeitet das Kind die Trennung emotional?",
                },
                {
                  title: "Erbrecht & Versicherung",
                  desc: "Wer erbt vom anderen Elternteil? Lebensversicherung? Invaliditätsversicherung für Unterhalt?",
                },
                {
                  title: "Religionen & Kultur",
                  desc: "Unterschiedliche Religionen? Wie wird das Kind erzogen? Beschneidung? Taufe? Festtage?",
                },
                {
                  title: "Wenn ein Elternteil ausfällt",
                  desc: "Was wenn ein Elternteil stirbt? Wer kümmert sich um das Kind? Neue Partnerschaft: Wie oft schläft Kind im neuen Partner-Haushalt?",
                },
                {
                  title: "Schulwechsel & Umzug",
                  desc: "Ein Elternteil will wegziehen? Andere Stadt? Ausland? Wie wird entschieden?",
                },
                {
                  title: "Pubertät & Volljährigkeit",
                  desc: "Ab 14/16/18 Jahren ändern sich Prioritäten. Wie flexibilisiert sich der Plan?",
                },
              ].map((topic) => (
                <article
                  key={topic.title}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-8 hover:border-emerald-300 hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-bold text-slate-900">
                    {topic.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {topic.desc}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== KOSTEN ===== */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-6">
                Kosten
              </div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                €499 vs. €100.000+
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Medipact",
                  price: "€499",
                  items: [
                    "Beide Eltern",
                    "Alle Themen",
                    "Schriftliche Vereinbarung",
                    "3–12 Monate",
                    "Kind bleibt außen vor",
                  ],
                  featured: true,
                },
                {
                  title: "Klassische Mediation",
                  price: "€5–15k",
                  items: [
                    "Mit Mediator",
                    "Längere Prozesse",
                    "Hohe Qualität",
                    "3–6 Monate",
                    "Erfahren",
                  ],
                },
                {
                  title: "Gericht + Gutachter",
                  price: "€50–100k+",
                  items: [
                    "2 Anwälte",
                    "Psychologische Gutachter",
                    "Kindesbeistand",
                    "2–4 Jahre",
                    "Kind wird befragt & getestet",
                  ],
                },
              ].map((option) => (
                <div
                  key={option.title}
                  className={`rounded-[1.75rem] border p-8 ${
                    option.featured
                      ? "border-emerald-300 bg-white shadow-lg shadow-emerald-200/30"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <h3 className="text-lg font-bold text-slate-900">
                    {option.title}
                  </h3>
                  <div className="mt-4 text-4xl font-black text-emerald-600">
                    {option.price}
                  </div>
                  <ul className="mt-8 space-y-3">
                    {option.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-sm text-slate-700"
                      >
                        <span className="text-emerald-600">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CASE BEISPIEL ===== */}
        <section className="bg-gradient-to-br from-emerald-50 to-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-6">
                Fallbeispiel
              </div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Sarah & Markus – 2 Kinder
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 md:p-12">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      Die Situation
                    </h3>
                    <p className="text-slate-700">
                      Sarah (35) und Markus (38) sind getrennt. 2 Kinder: Emma
                      (8) und Felix (5). Beide wollen die Kinder, keiner will
                      vor Gericht. Frage: Wie regeln wir das fair?
                    </p>
                  </div>

                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      Mediation in 4 Monaten
                    </h3>
                    <p className="text-slate-700 mb-4">
                      <strong>Monat 1:</strong> KI analysiert: Sarah arbeitet
                      Teilzeit (€2.500/Monat), Markus verdient €3.500. Beide
                      wollen täglich Zeit mit Kindern.
                    </p>
                    <p className="text-slate-700 mb-4">
                      <strong>Monat 2:</strong> Lösung: Gemeinsames Sorgerecht.
                      Kinder leben hauptsächlich bei Sarah, Markus hat Umgang
                      Mo/Mi/Fr + jedes 2. Wochenende. Markus zahlt €450/Monat
                      Unterhalt.
                    </p>
                    <p className="text-slate-700 mb-4">
                      <strong>Monat 3:</strong> Details: Schule (Sarah
                      entscheidet mit Markus), Arzt (Sarah), Aktivitäten (teilen
                      Kosten), Ferien (abwechselnd).
                    </p>
                    <p className="text-slate-700">
                      <strong>Monat 4:</strong> Schriftliche Vereinbarung. Beide
                      unterschreiben. Fertig.
                    </p>
                  </div>

                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      Ergebnis
                    </h3>
                    <p className="text-slate-700 mb-3">
                      ✓ Kosten: €499
                      <br />
                      ✓ Zeit: 4 Monate
                      <br />
                      ✓ Emma & Felix: Beide Eltern, Stabilität, fester Rhythmus
                      <br />✓ Sarah & Markus: Respekt bleiben, praktische Lösung
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== PSYCHOLOGISCHE ASPEKTE ===== */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-6">
                Entwicklungspsychologie
              </div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Was Kinder in verschiedenen Altern brauchen
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  age: "0–3 Jahre",
                  needs:
                    "Konstante Bezugsperson, regelmäßige Übergaben, Bindungssicherheit.",
                  concern: "Zu häufige Wechsel können Trennungsangst auslösen.",
                },
                {
                  age: "4–7 Jahre",
                  needs:
                    "Klare Struktur, verstehen können, beide Eltern regelmäßig sehen.",
                  concern: 'Schuldgefühle ("Bin ich Schuld an der Trennung?").',
                },
                {
                  age: "8–12 Jahre",
                  needs:
                    "Beide Eltern aktiv, verstehen der Situation, mitspracherecht bei Entscheidungen.",
                  concern: 'Loyalitätskonflikte ("Für wen bin ich mehr?").',
                },
                {
                  age: "13–18 Jahre",
                  needs:
                    "Respekt für Autonomie, Mitsprache, flexible Regelungen.",
                  concern:
                    "Rebellische Phase kann zu Problemen mit Umgangsregelungen führen.",
                },
                {
                  age: "Ab 18 Jahren",
                  needs: "Offene Beziehung zu beiden, eigene Wahl von Umgang.",
                  concern:
                    "Frühe Konflikte können zu lebenslanger Entfremdung führen.",
                },
              ].map((item) => (
                <div
                  key={item.age}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-8"
                >
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    {item.age}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-bold text-emerald-700 uppercase">
                        Was sie brauchen
                      </p>
                      <p className="text-sm text-slate-700 mt-1">
                        {item.needs}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-red-700 uppercase">
                        Risiko
                      </p>
                      <p className="text-sm text-slate-700 mt-1">
                        {item.concern}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FAQ AUSFÜHRLICH ===== */}
        <section id="faq" className="bg-zinc-100 py-24">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-6">
                Q&A
              </div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Häufige Fragen zum Thema Kinder
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "Was wenn das Kind nicht mit einem Elternteil mitgehen will?",
                  a: 'Das ist ein Zeichen für tiefen Konflikt. Mediation hilft herauszufinden: Warum? Was ist passiert? Oft ist es nicht das Kind, das "nein" sagt, sondern ein Elternteil, der unterbewusst das Kind gegen den anderen "dreht". Mediation adressiert das.',
                },
                {
                  q: "Können wir die Mediation später immer noch ändern?",
                  a: "Ja. Die Vereinbarung ist bindend, aber Eltern können sie jederzeit gemeinsam ändern. Wenn sich Umstände ändern (Job, Wohnort, Kind älter), können Eltern medieren und anpassen.",
                },
                {
                  q: "Was wenn ein Elternteil nicht kooperativ ist?",
                  a: "KI stellt Fragen, die helfen, dahinter zu kommen: Warum? Was braucht dieser Elternteil wirklich? Oft ist es Angst vor Bindungsverlust, nicht böser Wille. Mediation adressiert das.",
                },
                {
                  q: "Ist medipact auch gut, wenn die Trennung sehr konfliktreich war?",
                  a: "Ja. Besonders dann. Je konfliktreicher, desto wichtiger ist, schnell wieder auf eine faire Basis zu kommen – für die Kinder.",
                },
                {
                  q: "Kann ich eine Mediation ablehnen, wenn der andere Elternteil dazu drängt?",
                  a: "Ja. Mediation ist freiwillig. Aber: Vor Gericht wird es €50k+ kosten und 2–4 Jahre dauern. Mediation dauert 3–12 Monate und kostet €499. Das sollte bedacht sein.",
                },
                {
                  q: "Was wenn das Kind in die Mediation mitgenommen werden will?",
                  a: "Nein. Kinder sollten NICHT in der Mediation dabei sein. Das ist ein Raum für Erwachsene. Aber: KI/Mediator fragt nach Kind-Perspektive, und Eltern denken gemeinsam über das Wohl nach.",
                },
                {
                  q: "Wie wird sichergestellt, dass die Vereinbarung fair ist?",
                  a: "KI arbeitet mit objektiven Kriterien: Düsseldorfer Tabelle für Unterhalt, beste Praxis für Sorgerecht, Psychologie-basierte Empfehlungen. Transparent. Objektivität, nicht Gefühl.",
                },
                {
                  q: "Was wenn ich später vor Gericht gehen will – ist die Mediation-Vereinbarung gültig?",
                  a: "Ja. Beide unterschreiben, es ist rechtlich bindend. Wenn ihr später vor Gericht geht, wird das Gericht die schriftliche Vereinbarung respektieren (wenn nicht unfair).",
                },
              ].map((faq) => (
                <article
                  key={faq.q}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-slate-900">{faq.q}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {faq.a}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA FINAL ===== */}
        <section
          id="cta"
          className="border-t border-slate-100 bg-gradient-to-br from-emerald-900 to-slate-900 py-24"
        >
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
            <div className="inline-flex items-center rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium tracking-wide text-emerald-200 uppercase mb-8">
              <span className="mr-2">💚</span>
              Trennung mit Fokus auf die Zukunft.
            </div>

            <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl mb-6">
              €499. Eure Kinder verdienen es.
            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300">
              Nicht: Jahre Gerichtskampf. Sondern: Schnelle, faire,
              professionelle Lösung. Mit Fokus darauf, dass eure Kinder sich
              geliebt fühlen – von beiden Eltern.
            </p>

            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="mailto:hallo@medipact.de?subject=Trennung%20mit%20Kindern"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-4 text-sm font-bold text-white transition hover:scale-[1.02]"
              >
                Mediation starten
              </a>
              <a
                href="mailto:hallo@medipact.de?subject=Fragen%20zur%20Mediation"
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
