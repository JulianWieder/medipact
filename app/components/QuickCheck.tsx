"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

type Answer = "yes" | "maybe" | "no";

type Question = {
  text: string;
  hint?: string;
};

// Fragentexte liegen in messages/*.json unter quickCheck.questions (die
// psychologische Begründung je Frage steht dort nicht, nur hier):
//   1. Foot-in-the-door: konkretes Verhalten statt abstrakter Bereitschaft.
//   2. Perspective-Taking: prüft Empathie- statt Schuldfrage.
//   3. Miracle Question (lösungsfokussierte Mediation): macht Motivation spürbar.
//   4. Psychologische Sicherheit statt reiner Gefühlsfrage.
//   5. Sunk-Cost / Konsistenz: macht investierte Energie bewusst.
//   6. Red-Flag-Frage, direkt gestellt statt verharmlost.
//
// Bei Red-Flag-Fragen ist "Ja" das negative Signal – wird intern umgedreht.
const INVERTED_QUESTIONS = new Set([5]);

export default function QuickCheck() {
  const t = useTranslations("quickCheck");
  const questions = t.raw("questions") as Question[];
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  function answer(value: Answer) {
    const normalized: Answer =
      INVERTED_QUESTIONS.has(step) && value !== "maybe" ? (value === "yes" ? "no" : "yes") : value;
    setAnswers([...answers, normalized]);
    setStep(step + 1);
  }

  function getResult() {
    const yes = answers.filter((a) => a === "yes").length;
    const no = answers.filter((a) => a === "no").length;

    if (no >= 1) return "not_suitable";
    if (yes >= 4) return "suitable";
    return "unclear";
  }

  const result = getResult();
  const currentQuestion = questions[step];

  return (
    <section id="schnellcheck" className="section section-base">
      <div className="container max-w-2xl text-center">
        <p className="eyebrow mb-4">{t("eyebrow")}</p>

        <h2 className="heading-2">{t("title")}</h2>

        {step < questions.length ? (
          <div className="mt-10">
            <div className="mb-6 flex justify-center gap-1.5">
              {questions.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-6 rounded-full transition-colors ${
                    i < step
                      ? "bg-accent-500"
                      : i === step
                        ? "bg-accent-300"
                        : "bg-neutral-200"
                  }`}
                />
              ))}
            </div>

            <p className="text-lg leading-8 text-neutral-700">
              {currentQuestion.text}
            </p>

            {currentQuestion.hint && (
              <p className="mt-3 text-sm text-neutral-500">
                {currentQuestion.hint}
              </p>
            )}

            <div className="mt-6 flex justify-center gap-4">
              <button onClick={() => answer("yes")} className="btn btn-primary">
                {t("yes")}
              </button>

              <button
                onClick={() => answer("maybe")}
                className="btn btn-secondary"
              >
                {t("maybe")}
              </button>

              <button
                onClick={() => answer("no")}
                className="btn btn-secondary"
              >
                {t("no")}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-10">
            {result === "suitable" && (
              <>
                <p className="text-lg text-accent-700 font-medium">
                  {t("suitable.text")}
                </p>
                <Link href="/kontakt" className="btn btn-primary mt-6">
                  {t("suitable.cta")}
                </Link>
              </>
            )}

            {result === "unclear" && (
              <>
                <p className="text-lg text-neutral-700">
                  {t("unclear.text")}
                </p>
                <Link href="/kontakt" className="btn btn-primary mt-6">
                  {t("unclear.cta")}
                </Link>
              </>
            )}

            {result === "not_suitable" && (
              <>
                <p className="text-lg text-red-600">
                  {t("notSuitable.text")}
                </p>
                <Link href="/kontakt" className="btn btn-secondary mt-6">
                  {t("notSuitable.cta")}
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
