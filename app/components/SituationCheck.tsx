"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

type Choice = "yes" | "unsure" | "no";

type Question = {
  id: string;
  text: string;
  /** Label overrides for the three buttons, in order yes / unsure / no */
  labels?: [string, string, string];
  /** If true, a "no" answer here is the red-flag / extreme signal */
  extremeOn?: Choice;
};

const questions: Question[] = [
  {
    id: "willing",
    text: "Sind beide Seiten grundsätzlich bereit, miteinander zu sprechen?",
  },
  {
    id: "safe",
    text: "Können Sie offen sprechen, ohne sich unsicher oder unter Druck zu fühlen?",
  },
  {
    id: "extreme",
    text: "Spielen Gewalt, Drohungen, Stalking oder ein akutes Machtungleichgewicht eine zentrale Rolle in Ihrem Konflikt?",
    labels: ["Ja", "Unsicher", "Nein"],
    extremeOn: "yes",
  },
  {
    id: "ownSolution",
    text: "Geht es vor allem darum, gemeinsam eine Lösung zu finden – nicht zwingend darum, vor Gericht Recht zu bekommen?",
  },
  {
    id: "responsibility",
    text: "Ist die andere Seite grundsätzlich bereit, für ihren Anteil am Konflikt Verantwortung zu übernehmen?",
  },
];

type Result = "suitable" | "unsure" | "not_suitable" | "extreme";

export default function SituationCheck() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Choice>>({});
  const [stoppedEarly, setStoppedEarly] = useState(false);

  function answer(question: Question, value: Choice) {
    const next = { ...answers, [question.id]: value };
    setAnswers(next);

    if (question.extremeOn && value === question.extremeOn) {
      setStoppedEarly(true);
      setStep(questions.length);
      return;
    }

    setStep(step + 1);
  }

  function getResult(): Result {
    if (stoppedEarly || answers.extreme === "yes") return "extreme";

    const positives = [
      answers.willing === "yes",
      answers.safe === "yes",
      answers.ownSolution === "yes",
      answers.responsibility === "yes",
    ].filter(Boolean).length;

    const negatives = [
      answers.willing === "no",
      answers.safe === "no",
      answers.ownSolution === "no",
      answers.responsibility === "no",
    ].filter(Boolean).length;

    if (negatives >= 2) return "not_suitable";
    if (positives >= 3 && negatives === 0) return "suitable";
    return "unsure";
  }

  const finished = step >= questions.length;
  const result = finished ? getResult() : null;

  function restart() {
    setStep(0);
    setAnswers({});
    setStoppedEarly(false);
  }

  return (
    <Card className="rounded-[2rem] p-8 sm:p-10">
      <p className="eyebrow mb-4">Schnell-Check</p>
      <h2 className="heading-2">Ist Mediation für Ihre Situation geeignet?</h2>
      <p className="mt-4 leading-7 text-neutral-600">
        Beantworten Sie {questions.length} kurze Fragen. Es werden keine
        Angaben gespeichert oder übermittelt.
      </p>

      {!finished && (
        <div className="mt-10">
          <div className="mb-6 flex items-center gap-2">
            {questions.map((q, i) => (
              <span
                key={q.id}
                className={`h-1.5 flex-1 rounded-full ${
                  i < step
                    ? "bg-accent-500"
                    : i === step
                      ? "bg-accent-300"
                      : "bg-neutral-200"
                }`}
              />
            ))}
          </div>

          <p className="text-lg font-medium text-neutral-900">
            {questions[step].text}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => answer(questions[step], "yes")}
              variant={questions[step].extremeOn === "yes" ? "secondary" : "primary"}
              className="sm:flex-1"
            >
              {questions[step].labels?.[0] ?? "Ja"}
            </Button>
            <Button
              onClick={() => answer(questions[step], "unsure")}
              variant="secondary"
              className="sm:flex-1"
            >
              {questions[step].labels?.[1] ?? "Unsicher"}
            </Button>
            <Button
              onClick={() => answer(questions[step], "no")}
              variant="secondary"
              className="sm:flex-1"
            >
              {questions[step].labels?.[2] ?? "Nein"}
            </Button>
          </div>
        </div>
      )}

      {finished && result === "extreme" && (
        <div className="mt-10">
          <Card variant="danger" className="!p-6">
            <h3 className="heading-3 text-red-700">
              Mediation ist hier wahrscheinlich nicht der richtige Weg.
            </h3>
            <p className="mt-3 leading-7 text-neutral-700">
              Wenn Gewalt, Drohungen, Stalking oder ein starkes
              Machtungleichgewicht im Raum stehen, kann ein Mediationsgespräch
              nicht das nötige Sicherheitsgefühl bieten – und wäre nicht fair
              gegenüber der betroffenen Person. Bitte wenden Sie sich zuerst an
              eine Stelle, die unmittelbar helfen kann.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-neutral-700">
              <li>
                <strong>Polizei (Notfall):</strong> 110
              </li>
              <li>
                <strong>Hilfetelefon Gewalt gegen Frauen:</strong> 08000 116
                016 (kostenlos, 24/7, mehrsprachig)
              </li>
              <li>
                <strong>Hilfetelefon Sexuelle Gewalt:</strong> 0800 22 55 530
              </li>
              <li>
                <strong>WEISSER RING (Opferhilfe):</strong> 116 006
              </li>
            </ul>
          </Card>
          <p className="mt-6 leading-7 text-neutral-600">
            Wenn sich die Lage später ändert oder Sie unsicher sind, was in
            Ihrem konkreten Fall sinnvoll ist, können Sie uns trotzdem
            unverbindlich schreiben – wir ordnen die Situation gemeinsam mit
            Ihnen ein, ohne Druck in Richtung Mediation.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button href="mailto:hallo@medipact.de?subject=Situation%20einordnen" variant="secondary">
              Unverbindlich schreiben
            </Button>
            <Button onClick={restart} variant="ghost">
              Check neu starten
            </Button>
          </div>
        </div>
      )}

      {finished && result === "suitable" && (
        <div className="mt-10">
          <p className="text-lg font-medium text-accent-700">
            Ihre Situation klingt grundsätzlich geeignet für Mediation.
          </p>
          <p className="mt-3 leading-7 text-neutral-600">
            Beide Seiten sind gesprächsbereit, es gibt keinen akuten
            Sicherheitsaspekt, und es geht um eine gemeinsame Lösung. Das ist
            ein guter Ausgangspunkt.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button href="/auth/register">Mediation jetzt starten</Button>
            <Button href="mailto:hallo@medipact.de?subject=Frage%20vor%20dem%20Start" variant="secondary">
              Erst noch eine Frage klären
            </Button>
          </div>
        </div>
      )}

      {finished && result === "unsure" && (
        <div className="mt-10">
          <p className="text-lg font-medium text-neutral-900">
            Ihre Situation ist noch nicht klar einzuordnen.
          </p>
          <p className="mt-3 leading-7 text-neutral-600">
            Das ist normal – nicht jeder Konflikt lässt sich mit ein paar
            Fragen eindeutig einordnen. Oft hilft ein kurzer Austausch, um zu
            sehen, was genau noch fehlt, damit ein faires Gespräch möglich
            wird.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button href="mailto:hallo@medipact.de?subject=Situation%20einordnen">
              Situation klären
            </Button>
            <Button onClick={restart} variant="ghost">
              Check neu starten
            </Button>
          </div>
        </div>
      )}

      {finished && result === "not_suitable" && (
        <div className="mt-10">
          <p className="text-lg font-medium text-neutral-900">
            Mediation ist aktuell wahrscheinlich nicht der passende nächste
            Schritt.
          </p>
          <p className="mt-3 leading-7 text-neutral-600">
            Wenn eine Seite nicht gesprächsbereit ist, keine Verantwortung
            übernimmt oder es vor allem um eine rechtlich verbindliche
            Klärung geht, ist anwaltliche oder gerichtliche Beratung oft der
            sinnvollere Weg. Wir sagen Ihnen ehrlich, wenn Mediation (noch)
            nicht passt.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button href="mailto:hallo@medipact.de?subject=Alternative%20Schritte" variant="secondary">
              Alternative Schritte besprechen
            </Button>
            <Button onClick={restart} variant="ghost">
              Check neu starten
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
