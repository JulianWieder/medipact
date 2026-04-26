"use client";

import Link from "next/link";
import { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name ist erforderlich";
    }

    if (!formData.email) {
      newErrors.email = "E-Mail ist erforderlich";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ungültige E-Mail-Adresse";
    }

    if (!formData.password) {
      newErrors.password = "Passwort ist erforderlich";
    } else if (formData.password.length < 8) {
      newErrors.password = "Passwort muss mindestens 8 Zeichen lang sein";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwörter stimmen nicht überein";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    setErrors({});

    // TODO: API-Call zu Backend
    setTimeout(() => {
      // Simuliert erfolgreiche Registrierung
      window.location.href = "/dashboard";
      setLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <>
      <Header
        logoText="medipact"
        ctaText="Anmelden"
        ctaLink="/auth/login"
        isDark={false}
      />

      <main className="min-h-screen bg-white pt-[73px]">
        <div className="mx-auto max-w-md px-6 py-20 lg:px-8 lg:py-32">
          <div className="space-y-2 mb-10">
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Konto erstellen
            </h1>
            <p className="text-lg text-slate-600">
              Starten Sie Ihre Mediation mit medipact.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-slate-900 mb-2"
              >
                Vollständiger Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Max Mustermann"
                className={`w-full rounded-2xl border px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10 ${
                  errors.name
                    ? "border-red-300 bg-red-50 focus:border-red-500"
                    : "border-slate-200 bg-white focus:border-emerald-500"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-900 mb-2"
              >
                E-Mail-Adresse
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="kontakt@beispiel.de"
                className={`w-full rounded-2xl border px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10 ${
                  errors.email
                    ? "border-red-300 bg-red-50 focus:border-red-500"
                    : "border-slate-200 bg-white focus:border-emerald-500"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-900 mb-2"
              >
                Passwort
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full rounded-2xl border px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10 ${
                    errors.password
                      ? "border-red-300 bg-red-50 focus:border-red-500"
                      : "border-slate-200 bg-white focus:border-emerald-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition"
                >
                  {showPassword ? "Verbergen" : "Zeigen"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              <p className="mt-2 text-xs text-slate-500">
                Mindestens 8 Zeichen erforderlich
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-slate-900 mb-2"
              >
                Passwort wiederholen
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full rounded-2xl border px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/10 ${
                  errors.confirmPassword
                    ? "border-red-300 bg-red-50 focus:border-red-500"
                    : "border-slate-200 bg-white focus:border-emerald-500"
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-emerald-600 px-8 py-4 text-base font-bold text-white transition hover:bg-emerald-700 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Wird registriert..." : "Konto erstellen"}
            </button>
          </form>

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-slate-600">
            Durch die Registrierung stimmen Sie unseren{" "}
            <Link
              href="#"
              className="font-semibold text-emerald-600 hover:underline"
            >
              Nutzungsbedingungen
            </Link>{" "}
            und der{" "}
            <Link
              href="#"
              className="font-semibold text-emerald-600 hover:underline"
            >
              Datenschutzrichtlinie
            </Link>{" "}
            zu.
          </p>

          {/* Sign In Link */}
          <div className="mt-10 border-t border-slate-200 pt-10 text-center">
            <p className="text-slate-600">
              Bereits registriert?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-emerald-600 hover:text-emerald-700 transition"
              >
                Hier anmelden
              </Link>
            </p>
          </div>

          {/* Info Box */}
          <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <h3 className="font-bold text-emerald-900 mb-2">
              🔐 Sichere Daten
            </h3>
            <p className="text-sm text-emerald-800">
              Ihre Daten werden verschlüsselt und sicher gespeichert. Wir geben
              Ihre Daten niemals an Dritte weiter.
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
