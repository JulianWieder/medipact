"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

const modules = [
  {
    title: "Interessen statt Paragraphen",
    text: "Medipact analysiert die Konfliktthemen tiefgreifend, um die tatsächlichen Interessen hinter verhärteten Positionen zu finden – etwas, das im Gerichtssaal oft verloren geht.",
  },
  {
    title: "Zukunftsorientierte Optionen",
    text: "Basierend auf der Interessenlandkarte entwickelt die KI kreative Lösungen für die Zukunft, statt nur über die Fehler der Vergangenheit zu urteilen.",
  },
  {
    title: "Emotionsfreie Moderation",
    text: "Die KI führt beide Parteien ohne Bias und emotionale Belastung durch den Prozess. Das Harvard-Prinzip wird konsequent und neutral angewendet.",
  },
  {
    title: "Rechtssichere Einigung",
    text: "Am Ende steht kein fremdbestimmtes Urteil, sondern eine von Ihnen selbst gestaltete, rechtlich bindende Vereinbarung – bereit zur Unterschrift.",
  },
];

const trustPoints = [
  {
    title: "Echte Neutralität",
    text: "KI hat keinen Bias. Sie bleibt konsequent sachlich und provoziert nicht – ein entscheidender Vorteil gegenüber menschlich geführten Debatten.",
  },
  {
    title: "Selbstbestimmung",
    text: 'Das Harvard-Prinzip "Interessen statt Positionen" erlaubt Lösungen, die ein Gericht gesetzlich gar nicht anordnen könnte.',
  },
  {
    title: "Kein Risiko",
    text: "Sollte die KI-Mediation nicht ausreichen, können Sie jederzeit einen menschlichen Mediator hinzuziehen oder den Rechtsweg wählen.",
  },
];

const workflowSteps = [
  {
    num: "01",
    title: "Registrierung & Start",
    text: "Sicher und anonym. Sie schaffen den Rahmen für eine Lösung, ohne sich sofort persönlich gegenübertreten zu müssen.",
  },
  {
    num: "02",
    title: "Wahre Interessen teilen",
    text: "Die KI stellt gezielte Fragen, um herauszufinden, was Ihnen wirklich wichtig ist – jenseits von rechtlichen Forderungen.",
  },
  {
    num: "03",
    title: "Lösungsraum visualisieren",
    text: "Die KI macht sichtbar, wo Gemeinsamkeiten liegen und wo Prioritäten unterschiedlich sind. So wird der Weg für Einigungen frei.",
  },
  {
    num: "04",
    title: "Optionen bewerten",
    text: "Sie erhalten Vorschläge, die beide Seiten erfüllen. Sie bewerten diese, die KI optimiert den Konsens schrittweise.",
  },
  {
    num: "05",
    title: "Einigung fixieren",
    text: "Sobald ein Konsens gefunden ist, erstellt die KI die schriftliche, rechtlich bindende Vereinbarung für beide Parteien.",
  },
  {
    num: "06",
    title: "Optionaler Support",
    text: "Bei Bedarf springt ein zertifizierter Mediator ein, um bei besonders emotionalen Hürden menschlich zu unterstützen.",
  },
];

const faqs = [
  {
    q: "Warum ist Mediation besser als ein Gerichtsverfahren?",
    a: "Ein Richter entscheidet nach Gesetz über Ihren Kopf hinweg. In der Mediation entscheiden Sie selbst über Ihre Zukunft und finden Lösungen, die für beide Seiten funktionieren.",
  },
  {
    q: "Ist das Ergebnis rechtlich bindend?",
    a: "Ja. Die von der KI generierte Vereinbarung ist nach der Unterzeichnung durch beide Parteien ein rechtlich bindendes Dokument.",
  },
  {
    q: "Was passiert bei hochstrittigen Konflikten?",
    a: "Sie können jederzeit auf das Hybrid-Modell upgraden. Ein menschlicher Mediator hilft dann gezielt bei den emotionalen Blockaden.",
  },
  {
    q: "Wie lange dauert der Prozess?",
    a: "Während Gerichtsverfahren Jahre dauern können, führt KI-Mediation oft schon in 2 bis 8 Wochen zu einem Ergebnis.",
  },
  {
    q: "Was ist das Harvard-Prinzip?",
    a: "Es ist der Goldstandard der Konfliktlösung: Man konzentriert sich auf das, was die Menschen wirklich brauchen (Interessen), statt auf das, was sie fordern (Positionen).",
  },
];

export default function MedipactLanding() {
  return (
    <>
      <Header
        logoText="medipact"
        ctaText="Jetzt starten"
        ctaLink="#cta"
        isDark={false}
      />

      <main className="min-h-screen pt-[73px]">
        {/* HERO - WEISS */}
        <section
          id="top"
          className="relative overflow-hidden bg-white scroll-mt-20"
        >
          <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium tracking-wide text-slate-500 uppercase">
                Selbstbestimmt lösen statt entscheiden lassen
              </div>

              <h1 className="mt-8 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Frieden findet man nicht im Gerichtssaal,
                <span className="block bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
                  {" "}
                  sondern am Verhandlungstisch.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                KI-basierte Mediation nach dem Harvard-Prinzip. Finden Sie
                nachhaltige Lösungen, bevor ein Gericht über Ihren Kopf hinweg
                entscheidet. Schnell, neutral und lösungsorientiert.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#cta"
                  className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-8 py-4 text-sm font-bold text-white transition hover:bg-emerald-700 hover:scale-[1.02]"
                >
                  Lösung finden
                </a>
                <a
                  href="#process"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition hover:border-emerald-200 hover:bg-emerald-50"
                >
                  Warum Mediation?
                </a>
              </div>
            </div>

            <div
              style={{
                position: "relative",
                overflow: "hidden",
                aspectRatio: "1920/1080",
              }}
              className="rounded-[2.5rem] border border-slate-200 overflow-hidden"
            >
              <iframe
                src="https://share.synthesia.io/embeds/videos/ecc6e794-b1df-4c8e-85ca-f137b90c3f2f"
                loading="lazy"
                title="Synthesia video player - Frieden durch Mediation: Der Weg zur Einigung"
                allowFullScreen
                allow="encrypted-media; fullscreen; microphone; screen-wake-lock;"
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 0,
                  border: "none",
                  padding: 0,
                  margin: 0,
                  overflow: "hidden",
                }}
              />
            </div>
          </div>
        </section>

        {/* FEATURES - HELLGRAU */}
        <section className="bg-slate-50 border-y border-slate-200 py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Mediation statt Rechtsstreit
              </h2>
              <p className="mt-4 text-lg text-slate-700 max-w-2xl mx-auto">
                Ein strukturierter Prozess, der dort Brücken baut, wo
                juristische Wege oft in der Sackgasse enden.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {modules.map((module) => (
                <article
                  key={module.title}
                  className="rounded-[2rem] border border-slate-200 bg-white p-10 transition hover:shadow-xl"
                >
                  <h3 className="text-xl font-bold text-slate-900">
                    {module.title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-slate-600">
                    {module.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* VERGLEICH - DUNKEL */}
        <section className="bg-slate-900 py-24 text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
                Warum medipact die bessere Wahl ist
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "KI-Pure Mediation",
                  status: "Lösungsorientiert",
                  features: [
                    "Fokus auf Interessen",
                    "Volle Ergebniskontrolle",
                    "Zukunftsorientiert",
                    "Rechtlich bindend",
                  ],
                  bg: "bg-slate-800/50 border-slate-700",
                },
                {
                  title: "Hybrid-Mediation",
                  status: "KI + Mensch",
                  features: [
                    "Alles von KI-Pure",
                    "Menschliche Empathie",
                    "Hilfe bei Emotionen",
                    "Jederzeit zuschaltbar",
                  ],
                  bg: "bg-emerald-900/40 border-emerald-500/50 shadow-2xl shadow-emerald-900/20",
                  featured: true,
                },
                {
                  title: "Gerichtsverfahren",
                  status: "Konfrontativ",
                  features: [
                    "Fokus auf Schuldfragen",
                    "Richter entscheidet",
                    "Vergangenheitsfokus",
                    "Dauert oft Jahre",
                  ],
                  bg: "bg-slate-800/50 border-slate-700",
                },
              ].map((plan) => (
                <div
                  key={plan.title}
                  className={`rounded-[2rem] border p-8 ${plan.bg}`}
                >
                  <h3 className="text-xl font-bold">{plan.title}</h3>
                  <div
                    className={`mt-2 text-sm font-bold uppercase tracking-wider ${plan.featured ? "text-emerald-400" : "text-slate-400"}`}
                  >
                    {plan.status}
                  </div>
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-3 text-slate-300"
                      >
                        <span className="text-emerald-500 text-lg">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WORKFLOW - WEISS */}
        <section id="process" className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16 text-slate-900">
              <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
                Von der Front zum Konsens
              </h2>
            </div>

            <div className="grid gap-4">
              {workflowSteps.map((step) => (
                <div
                  key={step.num}
                  className="group flex items-center gap-8 rounded-[2rem] border border-slate-100 bg-slate-50 p-8 transition hover:bg-white hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="hidden sm:flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl font-black text-emerald-600 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-slate-600 leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST - HELLGRAU */}
        <section className="bg-slate-50 border-y border-slate-200 py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                  Lösungen finden, statt Schuldige suchen.
                </h2>
                <p className="mt-6 text-lg text-slate-700 leading-8">
                  Ein Urteil beendet den Prozess, aber selten den Streit.
                  Mediation geht tiefer: Wir finden die Lösung, die wirklich zu
                  Ihrem Leben passt. Neutralität und wissenschaftliche Methodik
                  garantieren ein faires Ergebnis.
                </p>
              </div>
              <div className="grid gap-4">
                {trustPoints.map((p) => (
                  <div
                    key={p.title}
                    className="bg-white p-6 rounded-2xl border border-slate-200"
                  >
                    <h3 className="font-bold text-slate-900">{p.title}</h3>
                    <p className="text-sm text-slate-600 mt-2">{p.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ - WEISS */}
        <section id="faq" className="bg-white py-24">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="text-center text-3xl font-black tracking-tight text-slate-900 sm:text-5xl mb-16">
              Häufige Fragen
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-slate-200 p-8"
                >
                  <h3 className="text-lg font-bold text-slate-900">{faq.q}</h3>
                  <p className="mt-4 text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA - DUNKEL */}
        <section id="cta" className="bg-slate-900 py-24 text-center">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
              Entscheiden Sie selbst.
            </h2>
            <p className="mt-8 text-xl text-slate-300">
              Ein Gerichtsbeschluss produziert oft nur Verlierer. Finden Sie
              jetzt Ihren gemeinsamen Nenner am Verhandlungstisch.
            </p>
            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="mailto:hello@medipact.de"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-10 py-5 text-base font-bold text-white transition hover:bg-emerald-700 hover:scale-[1.02]"
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
      />
    </>
  );
}
