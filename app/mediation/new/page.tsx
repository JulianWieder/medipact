"use client";

import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

interface MediationType {
  id: string;
  title: string;
  description: string;
  emoji: string;
  href: string;
  features: string[];
}

export default function NewMediationPage() {
  const mediationTypes: MediationType[] = [
    {
      id: "trennung",
      title: "Trennung & Unterhalt",
      description:
        "Regeln Sie Sorgerecht, Unterhalt und Vermögensaufteilung fair und selbstbestimmt.",
      emoji: "💔",
      href: "/mediation/new/trennung",
      features: ["Sorgerecht", "Kindesunterhalt", "Vermögensaufteilung"],
    },
    {
      id: "erbschaft",
      title: "Erbschafts-Konflikt",
      description:
        "Finden Sie einvernehmliche Lösungen bei der Erbverteilung und Testament-Streitigkeiten.",
      emoji: "💎",
      href: "/mediation/new/erbschaft",
      features: ["Testament", "Erbverteilung", "Verwandtenkonflikte"],
    },
    {
      id: "nachbarschaft",
      title: "Nachbarschafts-Streit",
      description:
        "Lösen Sie Lärm-, Grenz- und Nutzungskonflikte mit Ihren Nachbarn dauerhaft.",
      emoji: "🏘️",
      href: "/mediation/new/nachbarschaft",
      features: ["Lärm", "Grenzfragen", "Nutzungsrechte"],
    },
    {
      id: "geschaeftspartner",
      title: "Geschäftspartner-Konflikt",
      description:
        "Regeln Sie Unstimmigkeiten und Auflösungen von Geschäftsbeziehungen professionell.",
      emoji: "🤝",
      href: "/mediation/new/geschaeftspartner",
      features: ["Gewinnverteilung", "Ausstieg", "Differenzen"],
    },
    {
      id: "familie",
      title: "Familienkonflikt",
      description:
        "Heilen Sie Familienbande durch strukturierte Kommunikation und gegenseitiges Verständnis.",
      emoji: "👨‍👩‍👧‍👦",
      href: "/mediation/new/familie",
      features: ["Konflikte", "Missverständnisse", "Entfremdung"],
    },
    {
      id: "arbeit",
      title: "Arbeitskonflikt",
      description:
        "Klären Sie Missverständnisse zwischen Arbeitnehmer und Arbeitgeber konstruktiv.",
      emoji: "💼",
      href: "/mediation/new/arbeit",
      features: ["Mobbing", "Kündigung", "Arbeitsbedingungen"],
    },
  ];

  return (
    <>
      <Header
        logoText="medipact"
        ctaText="Dashboard"
        ctaLink="/dashboard"
        isDark={false}
      />

      <main className="min-h-screen bg-white pt-[73px]">
        {/* Hero Section */}
        <section className="border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 mb-6"
              >
                ← Zurück zum Dashboard
              </Link>

              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl mb-4">
                Neue Mediation starten
              </h1>
              <p className="text-xl text-slate-600 leading-8">
                Wählen Sie die Art des Konflikts, den Sie lösen möchten. Unser
                KI-Mediator führt Sie dann Schritt für Schritt zu einer fairen
                Einigung.
              </p>
            </div>
          </div>
        </section>

        {/* Mediation Types Grid */}
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mediationTypes.map((type) => (
              <Link
                key={type.id}
                href={type.href}
                className="group rounded-2xl border border-slate-200 bg-white p-8 transition hover:shadow-lg hover:border-emerald-300 hover:scale-[1.02]"
              >
                <div className="mb-6 text-5xl">{type.emoji}</div>

                <h3 className="text-xl font-black text-slate-900 mb-3">
                  {type.title}
                </h3>

                <p className="text-slate-600 leading-relaxed mb-6">
                  {type.description}
                </p>

                <div className="space-y-2 mb-6 pb-6 border-b border-slate-200">
                  {type.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-sm text-slate-600"
                    >
                      <span className="text-emerald-500">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
                  Mediation starten
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Info Section */}
        <section className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">
            <h2 className="text-3xl font-black text-slate-900 mb-12">
              So funktioniert es
            </h2>

            <div className="grid gap-8 md:grid-cols-2">
              {[
                {
                  num: "01",
                  title: "Konflikt beschreiben",
                  text: "Sie teilen die Details des Konflikts mit. Dies bleibt vollständig anonym und vertraulich.",
                },
                {
                  num: "02",
                  title: "Beide Seiten befragen",
                  text: "Der KI-Mediator stellt gezielte Fragen an beide Parteien, um die echten Interessen zu verstehen.",
                },
                {
                  num: "03",
                  title: "Optionen entwickeln",
                  text: "Basierend auf den Antworten entwickelt die KI kreative Lösungsvorschläge für die Zukunft.",
                },
                {
                  num: "04",
                  title: "Vereinbarung treffen",
                  text: "Sie bewerten die Optionen und finden gemeinsam eine rechtlich bindende Lösung.",
                },
              ].map((step) => (
                <div
                  key={step.num}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-lg font-black text-emerald-600">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-600">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">
          <h2 className="text-3xl font-black text-slate-900 mb-12">
            Häufige Fragen
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "Brauche ich schon einen Anwalt?",
                a: "Nein. Die Mediation ist ein eigenständiger Prozess. Bei Bedarf können Sie jederzeit einen Anwalt hinzuziehen oder später zum Rechtsweg wechseln.",
              },
              {
                q: "Muss die andere Partei zustimmen?",
                a: "Die Mediation funktioniert am besten, wenn beide Seiten kooperativ sind. Wenn Ihre Konfliktpartei nicht mitmachen möchte, können wir das später klären.",
              },
              {
                q: "Wie lange dauert eine Mediation?",
                a: "Je nach Komplexität 2-8 Wochen. Das ist deutlich schneller als ein Gerichtsverfahren, das oft Jahre dauert.",
              },
              {
                q: "Was kostet eine Mediation?",
                a: "Das hängt von der Art und Dauer ab. Sie erhalten vor Beginn ein transparentes Angebot.",
              },
              {
                q: "Ist das Ergebnis bindend?",
                a: "Ja. Die von der KI erstellte Vereinbarung ist nach Unterzeichnung durch beide Parteien rechtlich bindend.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-slate-300 transition"
              >
                <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-slate-200 bg-gradient-to-r from-emerald-600 to-emerald-700 py-16">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <h2 className="text-3xl font-black text-white sm:text-4xl mb-4">
              Bereit, Ihren Konflikt zu lösen?
            </h2>
            <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
              Wählen Sie oben Ihre Konflikt-Kategorie und starten Sie noch
              heute. Finden Sie faire Lösungen am Verhandlungstisch, nicht im
              Gerichtssaal.
            </p>
            <Link
              href="#top"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-10 py-4 text-base font-bold text-emerald-600 transition hover:bg-slate-50 hover:scale-[1.02]"
            >
              Jetzt Mediation starten
            </Link>
          </div>
        </section>
      </main>

      <Footer
        brandName="medipact"
        tagline="Konflikte lösen, nicht eskalieren."
        isDark={false}
        email="hallo@medipact.de"
      />
    </>
  );
}
