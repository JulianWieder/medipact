"use client";

import Link from "next/link";
import { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function GeschaeftspartnerMediationPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    beschreibung: "",
    unternehmenstyp: "",
    duration: "",
    konflikttyp: "",
  });
  const [inviteData, setInviteData] = useState({
    name: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChangeForm = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleChangeInvite = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInviteData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmitStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newErrors: Record<string, string> = {};
    if (!formData.beschreibung.trim())
      newErrors.beschreibung = "Bitte beschreiben Sie den Konflikt";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setStep(2);
      setLoading(false);
    }, 800);
  };

  const handleSubmitStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newErrors: Record<string, string> = {};
    if (!inviteData.name.trim()) newErrors.name = "Name ist erforderlich";
    if (!inviteData.email) newErrors.email = "E-Mail ist erforderlich";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteData.email))
      newErrors.email = "Ungültige E-Mail";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2500);
    }, 1000);
  };

  if (success) {
    return (
      <>
        <Header
          logoText="medipact"
          ctaText="Dashboard"
          ctaLink="/dashboard"
          isDark={false}
        />
        <main className="min-h-screen bg-slate-50 pt-[73px] flex items-center justify-center">
          <div className="mx-auto max-w-md px-6 text-center py-20">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-black text-slate-900 mb-4">
              Geschäftsmediation gestartet!
            </h1>
            <p className="text-lg text-slate-600 mb-6">
              Einladung an <strong>{inviteData.name}</strong> versendet.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <p className="text-sm text-emerald-900">
                💡 Professionelle Lösung ohne Rechtsstreit.
              </p>
            </div>
          </div>
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

  return (
    <>
      <Header
        logoText="medipact"
        ctaText="Dashboard"
        ctaLink="/dashboard"
        isDark={false}
      />

      <main className="min-h-screen bg-slate-50 pt-[73px]">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
            <Link
              href="/mediation/new"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 mb-6"
            >
              ← Zurück zur Übersicht
            </Link>

            <div className="space-y-4">
              <div className="text-5xl">🤝</div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Geschäftspartner-Konflikt
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl">
                Regeln Sie Unstimmigkeiten und Auflösungen von
                Geschäftsbeziehungen professionell – ohne Gerichtsverfahren und
                Unternehmensschaden.
              </p>
            </div>

            <div className="mt-10">
              <p className="text-sm font-semibold text-slate-600 mb-3">
                Schritt {step} von 2
              </p>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-500"
                  style={{ width: step === 1 ? "50%" : "100%" }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
          {step === 1 && (
            <form onSubmit={handleSubmitStep1} className="space-y-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-8">
                <h2 className="text-2xl font-black text-slate-900 mb-6">
                  Der Geschäftskonflikt
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Beschreiben Sie den Konflikt
                    </label>
                    <textarea
                      name="beschreibung"
                      value={formData.beschreibung}
                      onChange={handleChangeForm}
                      placeholder="z.B. Mein Geschäftspartner und ich haben unterschiedliche Vorstellungen für die Zukunft. Ich möchte das Unternehmen erweitern, er will konservativ bleiben. Dazu kommt, dass die Gewinnverteilung umstritten ist..."
                      rows={6}
                      className={`w-full rounded-2xl border px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10 ${
                        errors.beschreibung
                          ? "border-red-300 bg-red-50 focus:border-red-500"
                          : "border-slate-200 bg-white focus:border-emerald-500"
                      }`}
                    />
                    {errors.beschreibung && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.beschreibung}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Art des Unternehmens
                    </label>
                    <select
                      name="unternehmenstyp"
                      value={formData.unternehmenstyp}
                      onChange={handleChangeForm}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    >
                      <option value="">-- Bitte wählen --</option>
                      <option value="gmbh">GmbH</option>
                      <option value="ug">UG</option>
                      <option value="ohg">OHG / Partnerschaft</option>
                      <option value="freiberufler">
                        Freiberufler-Kooperation
                      </option>
                      <option value="sonstiges">Sonstiges</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Dauer der Partnerschaft
                    </label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleChangeForm}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    >
                      <option value="">-- Bitte wählen --</option>
                      <option value="<1">Weniger als 1 Jahr</option>
                      <option value="1-5">1 - 5 Jahre</option>
                      <option value="5-10">5 - 10 Jahre</option>
                      <option value="10+">Über 10 Jahre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Hauptkonflikt-Typ
                    </label>
                    <select
                      name="konflikttyp"
                      value={formData.konflikttyp}
                      onChange={handleChangeForm}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    >
                      <option value="">-- Bitte wählen --</option>
                      <option value="gewinn">Gewinnverteilung</option>
                      <option value="strategie">Geschäftsstrategie</option>
                      <option value="ausstieg">Ausstieg eines Partners</option>
                      <option value="aufgaben">Aufgabenverteilung</option>
                      <option value="schulden">Schulden / Finanzen</option>
                      <option value="sonstiges">Sonstiges</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                <h3 className="font-bold text-emerald-900 mb-2">
                  ℹ️ Professionelle Lösung
                </h3>
                <p className="text-sm text-emerald-800">
                  Mit KI-gestützter Mediation finden Sie schnell und diskret zu
                  einer Lösung, die das Unternehmen und die Beziehung erhält.
                </p>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/mediation/new"
                  className="flex-1 inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-900 transition hover:bg-slate-50"
                >
                  Abbrechen
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-8 py-4 text-base font-bold text-white transition hover:bg-emerald-700 hover:scale-[1.01] disabled:opacity-50"
                >
                  {loading ? "Wird gespeichert..." : "Weiter zu Schritt 2"}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmitStep2} className="space-y-8">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">✅</div>
                  <div>
                    <h3 className="font-bold text-emerald-900 mb-1">
                      Ihre Angaben gespeichert
                    </h3>
                    <p className="text-sm text-emerald-800">
                      Laden Sie jetzt Ihren Geschäftspartner ein, damit dieser
                      auch seine Perspektive schildert.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8">
                <h2 className="text-2xl font-black text-slate-900 mb-6">
                  Schritt 2: Geschäftspartner einladen
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Name des Geschäftspartners
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={inviteData.name}
                      onChange={handleChangeInvite}
                      placeholder="z.B. Thomas Wagner"
                      className={`w-full rounded-2xl border px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10 ${errors.name ? "border-red-300 bg-red-50 focus:border-red-500" : "border-slate-200 bg-white focus:border-emerald-500"}`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      E-Mail-Adresse
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={inviteData.email}
                      onChange={handleChangeInvite}
                      placeholder="thomas.wagner@beispiel.de"
                      className={`w-full rounded-2xl border px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10 ${errors.email ? "border-red-300 bg-red-50 focus:border-red-500" : "border-slate-200 bg-white focus:border-emerald-500"}`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  Der Prozess
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      num: "1",
                      title: "Diskrete Einladung",
                      text: "Ihr Partner erhält eine Einladung zur Mediation",
                    },
                    {
                      num: "2",
                      title: "Neutrale Befragung",
                      text: "Beide Seiten schildern ihre Perspektive anonym",
                    },
                    {
                      num: "3",
                      title: "Gemeinsame Lösung",
                      text: "KI findet Kompromisse, die beiden Seiten dienen",
                    },
                    {
                      num: "4",
                      title: "Rechtlich bindend",
                      text: "Die Vereinbarung ist vertraglich bindend",
                    },
                  ].map((item) => (
                    <div key={item.num} className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-600">
                        {item.num}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">
                          {item.title}
                        </h4>
                        <p className="text-sm text-slate-600">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-900 transition hover:bg-slate-50"
                >
                  Zurück
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-8 py-4 text-base font-bold text-white transition hover:bg-emerald-700 hover:scale-[1.01] disabled:opacity-50"
                >
                  {loading ? "Wird versendet..." : "Einladung versendet"}
                </button>
              </div>
            </form>
          )}
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
