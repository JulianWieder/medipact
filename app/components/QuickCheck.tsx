"use client";

import { useState } from "react";
import Link from "next/link";

type Answer = "yes" | "maybe" | "no";

export default function QuickCheck() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const questions = [
    "Sind beide Seiten grundsätzlich bereit zu sprechen?",
    "Fühlen Sie sich sicher, offen zu sprechen?",
    "Worum geht es aktuell am meisten?",
  ];

  function answer(value: Answer) {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    setStep(step + 1);
  }

  function getResult() {
    const yes = answers.filter((a) => a === "yes").length;
    const no = answers.filter((a) => a === "no").length;

    if (no >= 1) return "not_suitable";
    if (yes >= 2) return "suitable";
    return "unclear";
  }

  const result = getResult();

  return (
    <section id="schnellcheck" className="section section-base">
      <div className="container max-w-2xl text-center">
        <p className="eyebrow mb-4">Schnell-Check</p>

        <h2 className="heading-2">
          Ist Mediation für Ihre Situation geeignet?
        </h2>

        {step < questions.length ? (
          <div className="mt-10">
            <p className="text-lg text-slate-700">{questions[step]}</p>

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
