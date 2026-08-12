"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Status = "idle" | "loading" | "success" | "error";

interface NewsletterSignupProps {
  /** "section" = großer Landing-Block, "footer" = kompaktes Feld. */
  variant?: "section" | "footer";
  /** Herkunft der Anmeldung, wird im Backend gespeichert. */
  source?: string;
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function NewsletterSignup({
  variant = "section",
  source = "landing",
}: NewsletterSignupProps) {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const isFooter = variant === "footer";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setStatus("error");
      setMessage(t("invalid"));
      return;
    }

    setStatus("loading");
    setMessage(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, source }),
      });

      if (res.ok) {
        setStatus("success");
        setMessage(t("success"));
        setEmail("");
      } else {
        const data = await res.json().catch(() => null);
        setStatus("error");
        setMessage(data?.error ?? t("error"));
      }
    } catch {
      setStatus("error");
      setMessage(t("error"));
    }
  }

  // ----- Footer-Variante: kompaktes Feld auf dunklem Grund -----
  if (isFooter) {
    return (
      <div>
        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-300">
          {t("footerHeading")}
        </h4>
        <p className="mt-4 text-sm text-neutral-400">{t("footerText")}</p>
        {status === "success" ? (
          <p className="mt-4 text-sm font-medium text-accent-400">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4" noValidate>
            <div className="flex gap-2">
              <label htmlFor="newsletter-footer-email" className="sr-only">
                {t("placeholder")}
              </label>
              <input
                id="newsletter-footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("placeholder")}
                autoComplete="email"
                className="min-w-0 flex-1 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-[15px] text-white placeholder:text-neutral-400 focus:border-accent-500 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-accent-500/40"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="shrink-0 rounded-xl bg-accent-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-accent-500 disabled:opacity-60"
              >
                {status === "loading" ? t("submitting") : t("footerButton")}
              </button>
            </div>
            {status === "error" && message && (
              <p className="mt-2 text-xs text-red-400">{message}</p>
            )}
            <p className="mt-2 text-xs text-neutral-500">
              {t("consent")}{" "}
              <Link
                href="/datenschutz"
                className="underline transition hover:text-neutral-300"
              >
                {t("privacyLink")}
              </Link>
            </p>
          </form>
        )}
      </div>
    );
  }

  // ----- Section-Variante: eigener Block auf der Landing Page -----
  return (
    <section className="section section-muted border-y border-neutral-200">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <div className="eyebrow mb-4 justify-center">{t("eyebrow")}</div>
        <h2 className="heading-2">{t("title")}</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-neutral-700">
          {t("text")}
        </p>

        {status === "success" ? (
          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-accent-200 bg-accent-50 px-6 py-5">
            <p className="text-base font-semibold text-accent-800">{message}</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 max-w-2xl"
            noValidate
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                {t("placeholder")}
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("placeholder")}
                autoComplete="email"
                className="min-w-0 flex-1 rounded-2xl border-2 border-neutral-300 bg-white px-6 py-4 text-lg text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-accent-500 focus:outline-none focus:ring-4 focus:ring-accent-500/25"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="shrink-0 rounded-2xl bg-accent-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-accent-900/20 transition hover:scale-[1.02] hover:bg-accent-500 disabled:opacity-60 disabled:hover:scale-100"
              >
                {status === "loading" ? t("submitting") : t("button")}
              </button>
            </div>
            {status === "error" && message && (
              <p className="mt-3 text-sm text-red-600">{message}</p>
            )}
            <p className="mt-4 text-xs text-neutral-500">
              {t("consent")}{" "}
              <Link
                href="/datenschutz"
                className="underline transition hover:text-neutral-700"
              >
                {t("privacyLink")}
              </Link>
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
