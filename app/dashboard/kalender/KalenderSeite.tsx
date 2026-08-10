"use client";

import Link from "next/link";
import Icon from "@/app/components/ui/Icon";
import BetreuungsKalender from "@/app/components/kalender/BetreuungsKalender";

// Rahmen um die Kalender-Komponente: Überschrift, Einordnung und der Fall,
// dass es noch gar keinen Kalender gibt. Die Komponente selbst ist dieselbe
// wie im Logbuch – nur mit `variante="seite"`.

export default function KalenderSeite({
  mediationId,
  nurLesen = false,
  startDatum = null,
}: {
  mediationId: string | null;
  nurLesen?: boolean;
  startDatum?: string | null;
}) {
  if (!mediationId) {
    return (
      <section className="container max-w-3xl py-12">
        <h1 className="font-display text-2xl font-medium text-neutral-900">
          Kalender
        </h1>
        <p className="mt-3 max-w-xl font-light text-neutral-600">
          Hier planen Eltern gemeinsam, wer das Kind wann betreut: ein
          Wochenmuster, Ferien und Feiertage, und für alles Weitere Absprachen,
          denen beide zustimmen. Was tatsächlich passiert ist, wird daneben
          festgehalten – Abweichungen bleiben so sichtbar, ohne dass jemand sie
          behaupten müsste.
        </p>

        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white px-6 py-8 text-center">
          <p className="text-sm font-semibold text-neutral-900">
            Noch kein Kalender
          </p>
          <p className="mx-auto mt-1.5 max-w-md text-sm font-light text-neutral-500">
            Der Kalender gehört zu deinem Konflikt-Logbuch – es ist kostenlos
            und in einem Schritt angelegt.
          </p>
          <Link
            href="/dashboard/logbuch/new"
            className="btn btn-primary mt-5 text-sm"
          >
            Logbuch anlegen
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container max-w-5xl py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium text-neutral-900">
            <Icon name="calendar" size={22} /> Kalender
          </h1>
          <p className="mt-2 max-w-xl text-sm font-light text-neutral-600">
            {nurLesen
              ? "Wann du bei wem bist. Ändern können den Plan nur deine Eltern."
              : "Betreuungszeiten planen, tauschen und festhalten – und daneben, was tatsächlich passiert ist."}
          </p>
        </div>
        {!nurLesen && (
          <Link href="/dashboard" className="btn btn-ghost text-sm">
            ← Übersicht
          </Link>
        )}
      </div>

      <div className="mt-8">
        <BetreuungsKalender
          mediationId={mediationId}
          variante="seite"
          nurLesen={nurLesen}
          // Auf der eigenen Seite gehören die Mediations-Termine dazu: wer
          // beides nutzt, soll nicht zwei Kalender im Kopf zusammenführen
          // müssen, um zu merken, dass die Sitzung auf den Übergabetag fällt.
          zeigeTermine={!nurLesen}
          startDatum={startDatum}
        />
      </div>

      {!nurLesen && (
        <p className="mt-8 text-xs font-light text-neutral-400">
          Derselbe Kalender liegt in deinem{" "}
          <Link href="/dashboard" className="underline hover:text-neutral-600">
            Konflikt-Logbuch
          </Link>{" "}
          – dort im Zusammenhang mit deinen Einträgen. Geteilte Termine sieht
          auch die eingeladene Person; alles andere bleibt bei dir.
        </p>
      )}
    </section>
  );
}
