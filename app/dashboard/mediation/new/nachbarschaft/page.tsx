"use client";

import Link from "next/link";
import { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

interface Neighbor {
  id: string;
  name: string;
  email: string;
}

export default function NachbarschaftMediationPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    beschreibung: "",
    konfliktTyp: "",
    dauer: "mittel",
    nachbarnAnzahl: "1",
  });
  const [neighbors, setNeighbors] = useState<Neighbor[]>([
    { id: "1", name: "", email: "" },
  ]);
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

  const handleChangeNeighbor = (id: string, field: string, value: string) => {
    setNeighbors((prev) =>
      prev.map((n) => (n.id === id ? { ...n, [field]: value } : n)),
    );
    if (errors[`neighbor-${id}-${field}`])
      setErrors((prev) => ({ ...prev, [`neighbor-${id}-${field}`]: "" }));
  };

  const addNeighbor = () => {
    const newId = String(neighbors.length + 1);
    setNeighbors((prev) => [...prev, { id: newId, name: "", email: "" }]);
  };

  const removeNeighbor = (id: string) => {
    setNeighbors((prev) => prev.filter((n) => n.id !== id));
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
    neighbors.forEach((n) => {
      if (!n.name.trim())
        newErrors[`neighbor-${n.id}-name`] = "Name erforderlich";
      if (!n.email) newErrors[`neighbor-${n.id}-email`] = "E-Mail erforderlich";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n.email))
        newErrors[`neighbor-${n.id}-email`] = "Ungültige E-Mail";
    });

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
              Nachbarschaftsmediation gestartet!
            </h1>
            <p className="text-lg text-slate-600 mb-6">
              Einladungen an {neighbors.length} Nachbarn versendet.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <p className="text-sm text-emerald-900">
                💡 Alle werden benachrichtigt, wenn jemand antwortet.
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
              <div className="text-5xl">🏘️</div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Nachbarschafts-Streit
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl">
                Regeln Sie Nachbarschaftskonflikte konstruktiv. Lärm, Grenzen
                und Nutzungsfragen fair und dauerhaft lösen.
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
                  Der Nachbarschaftskonflikt
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Beschreiben Sie den Konflikt mit Ihrem Nachbarn
                    </label>
                    <textarea
                      name="beschreibung"
                      value={formData.beschreibung}
                      onChange={handleChangeForm}
                      placeholder="z.B. Mein Nachbar macht nachts Lärm mit Bohrmaschine. Ich habe mehrmals höflich gefragt, aber er fühlt sich provoziert. Dazu kommt sein Hecke überragt unsere Grenze..."
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
                      Hauptkonflikt-Typ
                    </label>
                    <select
                      name="konfliktTyp"
                      value={formData.konfliktTyp}
                      onChange={handleChangeForm}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    >
                      <option value="">-- Bitte wählen --</option>
                      <option value="laerm">Lärm</option>
                      <option value="grenze">Grenzfragen</option>
                      <option value="parking">Parkplatz/Zufahrt</option>
                      <option value="baum">Bäume/Hecken</option>
                      <option value="heizung">Heizung/Wasser</option>
                      <option value="sonstiges">Sonstiges</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-3">
                      Wie lange gibt es Konflikte?
                    </label>
                    <div className="space-y-3">
                      {[
                        { value: "kurz", label: "🟢 Kurz - wenige Wochen" },
                        {
                          value: "mittel",
                          label: "🟡 Mittel - mehrere Monate",
                        },
                        { value: "lang", label: "🔴 Lang - über ein Jahr" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="dauer"
                            value={option.value}
                            checked={formData.dauer === option.value}
                            onChange={handleChangeForm}
                            className="w-4 h-4"
                          />
                          <span className="text-slate-900">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                <h3 className="font-bold text-emerald-900 mb-2">
                  ℹ️ Mehrere Nachbarn?
                </h3>
                <p className="text-sm text-emerald-800">
                  Im nächsten Schritt können Sie bis zu 3 Nachbarn einladen. So
                  werden alle Perspektiven berücksichtigt.
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
                      Laden Sie jetzt die beteiligten Nachbarn ein, damit der
                      KI-Mediator alle Perspektiven analysieren kann.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8">
                <h2 className="text-2xl font-black text-slate-900 mb-6">
                  Schritt 2: Nachbarn einladen
                </h2>
                <p className="text-slate-600 mb-6">
                  Laden Sie bis zu 3 Nachbarn ein. Sie erhalten jeweils einen
                  Einladungslink.
                </p>

                <div className="space-y-6">
                  {neighbors.map((neighbor, index) => (
                    <div
                      key={neighbor.id}
                      className="p-6 rounded-2xl border border-slate-200 bg-slate-50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-900">
                          Nachbar {index + 1}
                        </h3>
                        {neighbors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeNeighbor(neighbor.id)}
                            className="text-sm font-semibold text-red-600 hover:text-red-700"
                          >
                            Entfernen
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            value={neighbor.name}
                            onChange={(e) =>
                              handleChangeNeighbor(
                                neighbor.id,
                                "name",
                                e.target.value,
                              )
                            }
                            placeholder="z.B. Hans Schmidt"
                            className={`w-full rounded-2xl border px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10 ${
                              errors[`neighbor-${neighbor.id}-name`]
                                ? "border-red-300 bg-red-50 focus:border-red-500"
                                : "border-slate-200 bg-white focus:border-emerald-500"
                            }`}
                          />
                          {errors[`neighbor-${neighbor.id}-name`] && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors[`neighbor-${neighbor.id}-name`]}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-2">
                            E-Mail
                          </label>
                          <input
                            type="email"
                            value={neighbor.email}
                            onChange={(e) =>
                              handleChangeNeighbor(
                                neighbor.id,
                                "email",
                                e.target.value,
                              )
                            }
                            placeholder="hans.schmidt@beispiel.de"
                            className={`w-full rounded-2xl border px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10 ${
                              errors[`neighbor-${neighbor.id}-email`]
                                ? "border-red-300 bg-red-50 focus:border-red-500"
                                : "border-slate-200 bg-white focus:border-emerald-500"
                            }`}
                          />
                          {errors[`neighbor-${neighbor.id}-email`] && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors[`neighbor-${neighbor.id}-email`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {neighbors.length < 3 && (
                    <button
                      type="button"
                      onClick={addNeighbor}
                      className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-emerald-600 hover:bg-slate-100 transition"
                    >
                      + Weiteren Nachbarn hinzufügen
                    </button>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  Wie funktioniert die Mediation?
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      num: "1",
                      title: "Alle laden",
                      text: "Jeder Nachbar erhält eine Einladung",
                    },
                    {
                      num: "2",
                      title: "Alle antworten",
                      text: "Jeder schildert seine Perspektive",
                    },
                    {
                      num: "3",
                      title: "KI analysiert",
                      text: "Findet Gemeinsames und Lösungen",
                    },
                    {
                      num: "4",
                      title: "Einigung",
                      text: "Alle Nachbarn akzeptieren die Lösung",
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
                  {loading ? "Wird versendet..." : "Einladungen versendet"}
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
