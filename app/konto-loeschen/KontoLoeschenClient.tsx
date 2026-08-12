"use client";

import { useCallback, useEffect, useState } from "react";
import { signOut } from "next-auth/react";

// Der Teil der Löschseite, der wirklich löscht.
//
// Zwei Dinge sind Absicht und sollen nicht „vereinfacht" werden:
//
// 1. **Die Lage wird geladen, bevor irgendetwas angeboten wird.** Ob jemand
//    sofort löschen kann oder nur beantragen, weiß nur der Server. Ein Knopf,
//    der „Endgültig löschen" verspricht und dann einen Antrag daraus macht,
//    ist eine Lüge – und andersherum wäre es schlimmer.
// 2. **Das Wort muss getippt werden.** Ein Bestätigungsdialog wird
//    weggeklickt, ohne gelesen zu werden. Hier ist die Löschung unumkehrbar.

type Lage = {
  sofort_moeglich: boolean;
  grund: string | null;
  wird_geloescht: string[];
  bleibt: string[];
  dauer: string;
  bereits_beantragt: boolean;
  verfahren: { id: number; titel: string | null; status: string | null }[];
};

export default function KontoLoeschenClient() {
  const [lage, setLage] = useState<Lage | null>(null);
  const [wort, setWort] = useState("");
  const [busy, setBusy] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);
  const [fertig, setFertig] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/konto/loeschung", { cache: "no-store" });
        if (!res.ok) throw new Error();
        setLage((await res.json()) as Lage);
      } catch {
        setFehler("Wir konnten deinen Kontostand nicht laden. Bitte lade die Seite neu.");
      }
    })();
  }, []);

  const loeschen = useCallback(async () => {
    setBusy(true);
    setFehler(null);
    try {
      const res = await fetch("/api/konto", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bestaetigung: wort }),
      });
      const daten = await res.json().catch(() => null);
      if (!res.ok) {
        setFehler(daten?.detail ?? "Die Löschung hat nicht geklappt.");
        return;
      }
      if (daten?.status === "geloescht") {
        // Die Sitzung zeigt jetzt auf ein Konto, das es nicht mehr gibt.
        // Ohne signOut liefe der Nutzer in 401-Fehler statt auf die Startseite.
        await signOut({ callbackUrl: "/" });
        return;
      }
      setFertig(daten?.meldung ?? "Deine Löschung ist vermerkt.");
    } catch {
      setFehler("Server nicht erreichbar.");
    } finally {
      setBusy(false);
    }
  }, [wort]);

  if (fertig) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white px-5 py-4">
        <p className="text-sm font-semibold text-neutral-900">Vermerkt</p>
        <p className="mt-1 text-sm font-light leading-relaxed text-neutral-600">
          {fertig}
        </p>
      </div>
    );
  }

  if (fehler && !lage) {
    return <p className="text-sm text-red-600">{fehler}</p>;
  }

  if (!lage) {
    return <p className="text-sm text-neutral-400">Einen Moment …</p>;
  }

  if (lage.bereits_beantragt) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white px-5 py-4">
        <p className="text-sm font-semibold text-neutral-900">
          Deine Löschung ist bereits vermerkt.
        </p>
        <p className="mt-1 text-sm font-light leading-relaxed text-neutral-600">
          Dein Konto wird nach Abschluss deines Verfahrens gelöscht. Wenn du es
          dir anders überlegt hast, schreib uns an datenschutz@medipact.de.
        </p>
      </div>
    );
  }

  const sofort = lage.sofort_moeglich;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-neutral-200 bg-white px-5 py-4">
        <p className="text-sm font-semibold text-neutral-900">
          {sofort ? "Das wird jetzt gelöscht" : "Das passiert bei dir"}
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-light leading-relaxed text-neutral-600">
          {lage.wird_geloescht.map((z) => (
            <li key={z}>{z}</li>
          ))}
        </ul>
        {lage.bleibt.length > 0 && (
          <>
            <p className="mt-4 text-sm font-semibold text-neutral-900">Das bleibt</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-light leading-relaxed text-neutral-600">
              {lage.bleibt.map((z) => (
                <li key={z}>{z}</li>
              ))}
            </ul>
          </>
        )}
        <p className="mt-4 text-sm text-neutral-500">{lage.dauer}</p>
      </div>

      <div>
        <label
          htmlFor="bestaetigung"
          className="block text-sm font-medium text-neutral-700"
        >
          Tippe <span className="font-bold">LÖSCHEN</span>, um zu bestätigen
        </label>
        <input
          id="bestaetigung"
          value={wort}
          onChange={(e) => setWort(e.target.value)}
          autoComplete="off"
          className="mt-1.5 w-56 rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
        />
      </div>

      {fehler && <p className="text-sm text-red-600">{fehler}</p>}

      <button
        type="button"
        disabled={busy || wort.trim().toUpperCase() !== "LÖSCHEN"}
        onClick={loeschen}
        className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400"
      >
        {busy
          ? "Einen Moment …"
          : sofort
            ? "Konto endgültig löschen"
            : "Löschung beantragen"}
      </button>
    </div>
  );
}
