"use client";

import Link from "next/link";
import { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

interface Kind {
  id: string;
  vorname: string;
  geburtsdatum: string;
  sorgerecht: string;
}

interface FormData {
  // Step 1: Konflikt
  beschreibung: string;
  kinderAnzahl: string;
  vermögen: string;
  dauer: string;
  konfliktIntensität: string;

  // Step 2: Partner einladen
  partnerName: string;
  partnerEmail: string;

  // Step 3: Ihre Daten
  anrede: string;
  vorname: string;
  nachname: string;
  geburtsdatum: string;
  geburtsort: string;
  staatsangehoerigkeit: string;
  strasse: string;
  hausnummer: string;
  postleitzahl: string;
  ort: string;
  beruf: string;
  nettoeinkommen: string;
  vermoegen: string;

  // Step 4: Partner-Daten
  partnerAnrede: string;
  partnerVorname: string;
  partnerNachname: string;
  partnerGeburtsdatum: string;
  partnerBeruf: string;

  // Step 5: Ehe-Daten
  heiratsdatum: string;
  ehestaette: string;
  trennungsdatum: string;
  guetergemeinschaft: string;

  // Step 6: Kinder
  kinder: Kind[];

  // Step 7: Weitere Ehe-Informationen
  ehevertrag: string;
  tagEheschliessung: string;
  tagTrennung: string;
  letzterGemeinsammerAufenthalt: string;
  inEhewohnung: string;
  getrenntWohnungen: string;
  gerichtlichesVerfahren: string;
}

export default function TrennungMediationPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const [formData, setFormData] = useState<FormData>({
    beschreibung: "",
    kinderAnzahl: "0",
    vermögen: "",
    dauer: "mittel",
    konfliktIntensität: "mittel",
    partnerName: "",
    partnerEmail: "",
    anrede: "",
    vorname: "",
    nachname: "",
    geburtsdatum: "",
    geburtsort: "",
    staatsangehoerigkeit: "Deutschland",
    strasse: "",
    hausnummer: "",
    postleitzahl: "",
    ort: "",
    beruf: "",
    nettoeinkommen: "",
    vermoegen: "",
    partnerAnrede: "",
    partnerVorname: "",
    partnerNachname: "",
    partnerGeburtsdatum: "",
    partnerBeruf: "",
    heiratsdatum: "",
    ehestaette: "",
    trennungsdatum: "",
    guetergemeinschaft: "",
    kinder: [],
    ehevertrag: "",
    tagEheschliessung: "",
    tagTrennung: "",
    letzterGemeinsammerAufenthalt: "",
    inEhewohnung: "",
    getrenntWohnungen: "",
    gerichtlichesVerfahren: "",
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

    // Wenn Kinderanzahl sich ändert
    if (name === "kinderAnzahl") {
      const anzahl = parseInt(value);
      const newKinder = Array.from({ length: anzahl }, (_, i) => ({
        id: `kind-${i}`,
        vorname: "",
        geburtsdatum: "",
        sorgerecht: "",
      }));
      setFormData((prev) => ({ ...prev, kinder: newKinder }));
    }
  };

  const handleKindChange = (kindId: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      kinder: prev.kinder.map((k) =>
        k.id === kindId ? { ...k, [field]: value } : k,
      ),
    }));
  };

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNum === 1) {
      if (!formData.beschreibung.trim())
        newErrors.beschreibung = "Bitte beschreiben Sie den Konflikt";
    }

    if (stepNum === 2) {
      if (!formData.partnerName.trim())
        newErrors.partnerName = "Name erforderlich";
      if (!formData.partnerEmail)
        newErrors.partnerEmail = "E-Mail erforderlich";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.partnerEmail))
        newErrors.partnerEmail = "Ungültige E-Mail";
    }

    if (stepNum === 3) {
      if (!formData.anrede) newErrors.anrede = "Erforderlich";
      if (!formData.vorname.trim()) newErrors.vorname = "Erforderlich";
      if (!formData.nachname.trim()) newErrors.nachname = "Erforderlich";
      if (!formData.geburtsdatum) newErrors.geburtsdatum = "Erforderlich";
      if (!formData.postleitzahl.trim())
        newErrors.postleitzahl = "Erforderlich";
      if (!formData.ort.trim()) newErrors.ort = "Erforderlich";
    }

    if (stepNum === 5) {
      if (!formData.heiratsdatum) newErrors.heiratsdatum = "Erforderlich";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep((step + 1) as any);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (validateStep(7)) {
      setTimeout(() => {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
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
              Mediation erfolgreich gestartet!
            </h1>
            <p className="text-lg text-slate-600 mb-6">
              Alle Ihre Daten wurden gespeichert.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <p className="text-sm text-emerald-900">
                💡 Im nächsten Schritt wird Ihr(e) Partner(in) eingebunden.
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
              Zurück zur Übersicht
            </Link>

            <div className="space-y-4 mb-10">
              <div className="text-5xl">💔</div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Trennung & Unterhalt
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl">
                Regeln Sie Sorgerecht, Kindesunterhalt und Vermögensaufteilung
                fair und selbstbestimmt.
              </p>
            </div>

            <div className="mt-10">
              <p className="text-sm font-semibold text-slate-600 mb-3">
                Schritt {step} von 7
              </p>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-500"
                  style={{ width: `${(step / 7) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* STEP 1 */}
            {step === 1 && (
              <>
                <div className="rounded-2xl border border-slate-200 bg-white p-8">
                  <h2 className="text-2xl font-black text-slate-900 mb-6">
                    1. Der Konflikt
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Wie würden Sie die Situation beschreiben?
                      </label>
                      <textarea
                        name="beschreibung"
                        value={formData.beschreibung}
                        onChange={handleChangeForm}
                        placeholder="z.B. Meine Partnerin und ich trennen uns. Wir haben 2 Kinder (5 und 8 Jahre)..."
                        rows={6}
                        className={`w-full rounded-2xl border px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10 ${
                          errors.beschreibung
                            ? "border-red-300 bg-red-50"
                            : "border-slate-200 bg-white"
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
                        Wie viele gemeinsame Kinder haben Sie?
                      </label>
                      <select
                        name="kinderAnzahl"
                        value={formData.kinderAnzahl}
                        onChange={handleChangeForm}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                      >
                        <option value="0">Keine Kinder</option>
                        <option value="1">1 Kind</option>
                        <option value="2">2 Kinder</option>
                        <option value="3">3 Kinder</option>
                        <option value="4+">4 oder mehr Kinder</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Geschätzter Wert gemeinsames Vermögen
                      </label>
                      <select
                        name="vermögen"
                        value={formData.vermögen}
                        onChange={handleChangeForm}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                      >
                        <option value="">-- Bitte wählen --</option>
                        <option value="0-50k">Unter 50.000€</option>
                        <option value="50-100k">50.000€ - 100.000€</option>
                        <option value="100-250k">100.000€ - 250.000€</option>
                        <option value="250k+">Über 250.000€</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-3">
                        Wie würden Sie die Konflikt-Intensität beschreiben?
                      </label>
                      <div className="space-y-3">
                        {[
                          {
                            value: "niedrig",
                            label:
                              "🟢 Niedrig - Wir können sachlich miteinander sprechen",
                          },
                          {
                            value: "mittel",
                            label:
                              "🟡 Mittel - Es gibt Spannungen, aber wir wollen eine Lösung",
                          },
                          {
                            value: "hoch",
                            label:
                              "🔴 Hoch - Die Situation ist sehr angespannt",
                          },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center gap-3 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="konfliktIntensität"
                              value={option.value}
                              checked={
                                formData.konfliktIntensität === option.value
                              }
                              onChange={handleChangeForm}
                              className="w-4 h-4"
                            />
                            <span className="text-slate-900">
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">✅</div>
                    <div>
                      <h3 className="font-bold text-emerald-900 mb-1">
                        Ihre Angaben gespeichert
                      </h3>
                      <p className="text-sm text-emerald-800">
                        Laden Sie jetzt Ihre Partnerin/Ihren Partner ein.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-8">
                  <h2 className="text-2xl font-black text-slate-900 mb-6">
                    2. Partner(in) einladen
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="partnerName"
                        value={formData.partnerName}
                        onChange={handleChangeForm}
                        placeholder="z.B. Anna Schmidt"
                        className={`w-full rounded-2xl border px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10 ${
                          errors.partnerName
                            ? "border-red-300 bg-red-50"
                            : "border-slate-200 bg-white"
                        }`}
                      />
                      {errors.partnerName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.partnerName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        E-Mail-Adresse
                      </label>
                      <input
                        type="email"
                        name="partnerEmail"
                        value={formData.partnerEmail}
                        onChange={handleChangeForm}
                        placeholder="anna.schmidt@beispiel.de"
                        className={`w-full rounded-2xl border px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10 ${
                          errors.partnerEmail
                            ? "border-red-300 bg-red-50"
                            : "border-slate-200 bg-white"
                        }`}
                      />
                      {errors.partnerEmail && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.partnerEmail}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* STEP 3 - Ihre Daten */}
            {step === 3 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8">
                <h2 className="text-2xl font-black text-slate-900 mb-6">
                  3. Ihre Daten
                </h2>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Anrede
                    </label>
                    <select
                      name="anrede"
                      value={formData.anrede}
                      onChange={handleChangeForm}
                      className={`w-full rounded-2xl border px-4 py-3 text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10 ${
                        errors.anrede
                          ? "border-red-300 bg-red-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <option value="">-- Bitte wählen --</option>
                      <option value="herr">Herr</option>
                      <option value="frau">Frau</option>
                      <option value="divers">Divers</option>
                    </select>
                    {errors.anrede && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.anrede}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Vorname
                    </label>
                    <input
                      type="text"
                      name="vorname"
                      value={formData.vorname}
                      onChange={handleChangeForm}
                      placeholder="Max"
                      className={`w-full rounded-2xl border px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10 ${
                        errors.vorname
                          ? "border-red-300 bg-red-50"
                          : "border-slate-200 bg-white"
                      }`}
                    />
                    {errors.vorname && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.vorname}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Nachname
                    </label>
                    <input
                      type="text"
                      name="nachname"
                      value={formData.nachname}
                      onChange={handleChangeForm}
                      placeholder="Mustermann"
                      className={`w-full rounded-2xl border px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10 ${
                        errors.nachname
                          ? "border-red-300 bg-red-50"
                          : "border-slate-200 bg-white"
                      }`}
                    />
                    {errors.nachname && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.nachname}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Geburtsdatum
                    </label>
                    <input
                      type="date"
                      name="geburtsdatum"
                      value={formData.geburtsdatum}
                      onChange={handleChangeForm}
                      className={`w-full rounded-2xl border px-4 py-3 text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10 ${
                        errors.geburtsdatum
                          ? "border-red-300 bg-red-50"
                          : "border-slate-200 bg-white"
                      }`}
                    />
                    {errors.geburtsdatum && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.geburtsdatum}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Geburtsort
                    </label>
                    <input
                      type="text"
                      name="geburtsort"
                      value={formData.geburtsort}
                      onChange={handleChangeForm}
                      placeholder="Berlin"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Staatsangehörigkeit
                    </label>
                    <input
                      type="text"
                      name="staatsangehoerigkeit"
                      value={formData.staatsangehoerigkeit}
                      onChange={handleChangeForm}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Straße
                    </label>
                    <input
                      type="text"
                      name="strasse"
                      value={formData.strasse}
                      onChange={handleChangeForm}
                      placeholder="Musterstraße"
                      className={`w-full rounded-2xl border px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10 ${
                        errors.strasse
                          ? "border-red-300 bg-red-50"
                          : "border-slate-200 bg-white"
                      }`}
                    />
                    {errors.strasse && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.strasse}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Hausnummer
                    </label>
                    <input
                      type="text"
                      name="hausnummer"
                      value={formData.hausnummer}
                      onChange={handleChangeForm}
                      placeholder="42"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Postleitzahl
                    </label>
                    <input
                      type="text"
                      name="postleitzahl"
                      value={formData.postleitzahl}
                      onChange={handleChangeForm}
                      placeholder="10115"
                      className={`w-full rounded-2xl border px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10 ${
                        errors.postleitzahl
                          ? "border-red-300 bg-red-50"
                          : "border-slate-200 bg-white"
                      }`}
                    />
                    {errors.postleitzahl && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.postleitzahl}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Ort
                    </label>
                    <input
                      type="text"
                      name="ort"
                      value={formData.ort}
                      onChange={handleChangeForm}
                      placeholder="Berlin"
                      className={`w-full rounded-2xl border px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10 ${
                        errors.ort
                          ? "border-red-300 bg-red-50"
                          : "border-slate-200 bg-white"
                      }`}
                    />
                    {errors.ort && (
                      <p className="mt-1 text-sm text-red-600">{errors.ort}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Beruf
                    </label>
                    <input
                      type="text"
                      name="beruf"
                      value={formData.beruf}
                      onChange={handleChangeForm}
                      placeholder="z.B. Software-Entwickler"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Monatl. Nettoeinkommen (€)
                    </label>
                    <input
                      type="number"
                      name="nettoeinkommen"
                      value={formData.nettoeinkommen}
                      onChange={handleChangeForm}
                      placeholder="3000"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Eigenes Vermögen (€, OHNE Partner)
                    </label>
                    <input
                      type="number"
                      name="vermoegen"
                      value={formData.vermoegen}
                      onChange={handleChangeForm}
                      placeholder="50000"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 - Partner Daten */}
            {step === 4 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8">
                <h2 className="text-2xl font-black text-slate-900 mb-6">
                  4. Daten Ihres Partners
                </h2>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Anrede
                    </label>
                    <select
                      name="partnerAnrede"
                      value={formData.partnerAnrede}
                      onChange={handleChangeForm}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    >
                      <option value="">-- Bitte wählen --</option>
                      <option value="herr">Herr</option>
                      <option value="frau">Frau</option>
                      <option value="divers">Divers</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Vorname
                    </label>
                    <input
                      type="text"
                      name="partnerVorname"
                      value={formData.partnerVorname}
                      onChange={handleChangeForm}
                      placeholder="Anna"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Nachname
                    </label>
                    <input
                      type="text"
                      name="partnerNachname"
                      value={formData.partnerNachname}
                      onChange={handleChangeForm}
                      placeholder="Schmidt"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Geburtsdatum
                    </label>
                    <input
                      type="date"
                      name="partnerGeburtsdatum"
                      value={formData.partnerGeburtsdatum}
                      onChange={handleChangeForm}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Beruf
                    </label>
                    <input
                      type="text"
                      name="partnerBeruf"
                      value={formData.partnerBeruf}
                      onChange={handleChangeForm}
                      placeholder="z.B. Lehrerin"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5 - Ehe Daten */}
            {step === 5 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8">
                <h2 className="text-2xl font-black text-slate-900 mb-6">
                  5. Daten zur Ehe
                </h2>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Heiratsdatum
                    </label>
                    <input
                      type="date"
                      name="heiratsdatum"
                      value={formData.heiratsdatum}
                      onChange={handleChangeForm}
                      className={`w-full rounded-2xl border px-4 py-3 text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10 ${
                        errors.heiratsdatum
                          ? "border-red-300 bg-red-50"
                          : "border-slate-200 bg-white"
                      }`}
                    />
                    {errors.heiratsdatum && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.heiratsdatum}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Ort der Eheschließung
                    </label>
                    <input
                      type="text"
                      name="ehestaette"
                      value={formData.ehestaette}
                      onChange={handleChangeForm}
                      placeholder="Berlin"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Trennungsdatum
                    </label>
                    <input
                      type="date"
                      name="trennungsdatum"
                      value={formData.trennungsdatum}
                      onChange={handleChangeForm}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Güterverhältnis
                    </label>
                    <select
                      name="guetergemeinschaft"
                      value={formData.guetergemeinschaft}
                      onChange={handleChangeForm}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    >
                      <option value="">-- Bitte wählen --</option>
                      <option value="zugewinngemeinschaft">
                        Zugewinngemeinschaft (Standard)
                      </option>
                      <option value="guetergemeinschaft">
                        Gütergemeinschaft
                      </option>
                      <option value="gutertrennung">Gütertrennung</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6 - Kinder */}
            {step === 6 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8">
                <h2 className="text-2xl font-black text-slate-900 mb-6">
                  6. Gemeinsame Kinder
                </h2>

                {formData.kinder.length > 0 ? (
                  <div className="space-y-6">
                    {formData.kinder.map((kind, index) => (
                      <div
                        key={kind.id}
                        className="p-6 rounded-2xl border border-slate-200 bg-slate-50"
                      >
                        <h3 className="font-bold text-slate-900 mb-4">
                          Kind {index + 1}
                        </h3>
                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                              Vorname
                            </label>
                            <input
                              type="text"
                              value={kind.vorname}
                              onChange={(e) =>
                                handleKindChange(
                                  kind.id,
                                  "vorname",
                                  e.target.value,
                                )
                              }
                              placeholder="Vorname"
                              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                              Geburtsdatum
                            </label>
                            <input
                              type="date"
                              value={kind.geburtsdatum}
                              onChange={(e) =>
                                handleKindChange(
                                  kind.id,
                                  "geburtsdatum",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                              Aktuelles Sorgerecht
                            </label>
                            <select
                              value={kind.sorgerecht}
                              onChange={(e) =>
                                handleKindChange(
                                  kind.id,
                                  "sorgerecht",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                            >
                              <option value="">-- Bitte wählen --</option>
                              <option value="gemeinsam">Gemeinsames</option>
                              <option value="mutter">Mutter</option>
                              <option value="vater">Vater</option>
                              <option value="dritter">Dritter</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600">
                    Sie haben angegeben, dass Sie keine gemeinsamen Kinder
                    haben.
                  </p>
                )}
              </div>
            )}

            {/* STEP 7 - Weitere Ehe-Informationen */}
            {step === 7 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8">
                <h2 className="text-2xl font-black text-slate-900 mb-6">
                  7. Weitere Informationen zur Ehe
                </h2>

                <div className="space-y-8">
                  {/* Ehevertrag */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-3">
                      Ehevertrag vorhanden?
                    </label>
                    <div className="space-y-3">
                      {[
                        { value: "ja", label: "Ja" },
                        { value: "nein", label: "Nein" },
                        { value: "unbekannt", label: "Unbekannt / Unsicher" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="ehevertrag"
                            value={option.value}
                            checked={formData.ehevertrag === option.value}
                            onChange={handleChangeForm}
                            className="w-4 h-4"
                          />
                          <span className="text-slate-900">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Daten Eingabe */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Tag der Eheschließung
                      </label>
                      <input
                        type="date"
                        name="tagEheschliessung"
                        value={formData.tagEheschliessung}
                        onChange={handleChangeForm}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Tag der Trennung
                      </label>
                      <input
                        type="date"
                        name="tagTrennung"
                        value={formData.tagTrennung}
                        onChange={handleChangeForm}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Letzter gemeinsamer Aufenthalt
                      </label>
                      <input
                        type="date"
                        name="letzterGemeinsammerAufenthalt"
                        value={formData.letzterGemeinsammerAufenthalt}
                        onChange={handleChangeForm}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                      />
                    </div>
                  </div>

                  {/* Wohnsituation */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-3">
                      Noch in Ehewohnung?
                    </label>
                    <div className="space-y-3">
                      {[
                        { value: "ja", label: "Ja" },
                        { value: "nein", label: "Nein" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="inEhewohnung"
                            value={option.value}
                            checked={formData.inEhewohnung === option.value}
                            onChange={handleChangeForm}
                            className="w-4 h-4"
                          />
                          <span className="text-slate-900">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Getrennte Wohnungen */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-3">
                      Getrennte Wohnungen?
                    </label>
                    <div className="space-y-3">
                      {[
                        { value: "ja", label: "Ja" },
                        { value: "nein", label: "Nein" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="getrenntWohnungen"
                            value={option.value}
                            checked={
                              formData.getrenntWohnungen === option.value
                            }
                            onChange={handleChangeForm}
                            className="w-4 h-4"
                          />
                          <span className="text-slate-900">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Gerichtliches Verfahren */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-3">
                      Läuft schon ein Verfahren bei Gericht?
                    </label>
                    <div className="space-y-3">
                      {[
                        { value: "ja", label: "Ja" },
                        { value: "nein", label: "Nein" },
                        {
                          value: "geplant",
                          label: "Geplant / In Vorbereitung",
                        },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="gerichtlichesVerfahren"
                            value={option.value}
                            checked={
                              formData.gerichtlichesVerfahren === option.value
                            }
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
            )}

            {/* Buttons */}
            <div className="flex gap-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((step - 1) as any)}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-900 transition hover:bg-slate-50"
                >
                  Zurück
                </button>
              )}
              {step < 7 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 rounded-2xl bg-emerald-600 px-8 py-4 text-base font-bold text-white transition hover:bg-emerald-700 hover:scale-[1.01]"
                >
                  Weiter
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-2xl bg-emerald-600 px-8 py-4 text-base font-bold text-white transition hover:bg-emerald-700 hover:scale-[1.01] disabled:opacity-50"
                >
                  {loading ? "Wird gespeichert..." : "Mediation starten"}
                </button>
              )}
            </div>
          </form>
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
