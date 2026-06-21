"use client";

import { useState } from "react";
import Link from "next/link";

type Answer = "yes" | "maybe" | "no";

type Question = {
  text: string;
  hint?: string;
  /** Bei Red-Flag-Fragen ist "Ja" das negative Signal – wird intern umgedreht. */
  invert?: boolean;
};

const questions: Question[] = [
  {
    // Foot-in-the-door: konkretes Verhalten statt abstrakter Bereitschaft.
    text: "Wenn die andere Seite Sie heute anrufen würde, um über eine Lösung zu sprechen – würden Sie abheben?",
  },
  {
    // Perspective-Taking: prüft Empathie- statt Schuldfrage.
    text: "Können Sie sich vorstellen, dass die andere Seite die Lage ganz anders schildern würde – und trotzdem einen nachvollziehbaren Punkt hätte?",
  },
  {
    // Miracle Question (lösungsfokussierte Mediation): macht Motivation konkret spürbar.
    text: "Stellen Sie sich vor, der Konflikt wäre in vier Wochen gelöst. Würde sich Ihr Alltag dadurch spürbar leichter anfühlen?",
  },
  {
    // Psychologische Sicherheit statt reiner Gefühlsfrage.
    text: "Können Sie der anderen Seite sagen, was Sie wirklich denken, ohne dass es später gegen Sie verwendet wird?",
  },
  {
    // Sunk-Cost / Konsistenz: macht investierte Energie bewusst.
    text: "Haben Sie bereits eigene Zeit, Nerven oder Geld investiert, die Sie nicht einfach verloren geben wollen?",
  },
  {
    // Red-Flag-Frage, direkt gestellt statt verharmlost.
    text: "Gibt es aktuell Drohungen, massiven Druck oder Angst, die ein offenes Gespräch unmöglich machen?",
    hint: "Falls ja: Mediation ersetzt keinen Schutz – sprechen Sie zuerst mit einer Fachstelle oder Anwalt.",
    invert: true,
  },
];

export default function QuickCheck() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  function answer(value: Answer) {
    const question = questions[step];
    const normalized: Answer =
      question.invert && value !== "maybe" ? (value === "yes" ? "no" : "yes") : value;
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
        <p className="eyebrow mb-4">Schnell-Check</p>

        <h2 className="heading-2">
          Ist Mediation für Ihre Situation geeignet?
        </h2>

        {step < questions.length ? (
          <div className="mt-10">
            <div className="mb-6 flex justify-center gap-1.5">
              {questions.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-6 rounded-full transition-colors ${
                    i < step
                      ? "bg-emerald-500"
                      : i === step
                        ? "bg-emerald-300"
                        : "bg-slate-200"
                  }`}
                />
              ))}
            </div>

            <p className="text-lg leading-8 text-slate-700">
              {currentQuestion.text}
            </p>

            {currentQuestion.hint && (
              <p className="mt-3 text-sm text-slate-500">
                {currentQuestion.hint}
              </p>
            )}

            <div className="mt-6 flex justify-center gap-4">
              <button onClick={() => answer("yes")} className="btn btn-primary">
                Ja
              </button>

              <button
                onClick={() => answer("maybe")}
                className="btn btn-secondary"
              >
                Unsicher
              </button>

              <button
                onClick={() => answer("no")}
                className="btn btn-secondary"
              >
                Nein
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-10">
            {result === "suitable" && (
              <>
                <p className="text-lg text-emerald-700 font-medium">
                  Mediation ist wahrscheinlich sinnvoll.
                </p>
                <Link href="/kontakt" className="btn btn-primary mt-6">
                  Gespräch starten
                </Link>
              </>
            )}

            {result === "unclear" && (
              <>
                <p className="text-lg text-slate-700">
                  Ihre Situation ist noch nicht klar einzuordnen.
                </p>
                <Link href="/kontakt" className="btn btn-primary mt-6">
                  Situation klären
                </Link>
              </>
            )}

            {result === "not_suitable" && (
              <>
                <p className="text-lg text-red-600">
                  Mediation ist aktuell wahrscheinlich nicht geeignet.
                </p>
                <Link href="/kontakt" className="btn btn-secondary mt-6">
                  Alternative Schritte prüfen
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
