import { timingSafeEqual } from "crypto";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { seitenaufrufeLesen, type Seitenaufruf } from "@/lib/seitenaufrufe";

export const metadata: Metadata = {
  title: "Seitenaufrufe",
  robots: { index: false, follow: false },
};

/**
 * Auswertung des eigenen Seitenaufruf-Logs (lib/seitenaufrufe.ts).
 *
 * Kein Login: der Nutzerbereich liegt auf kerno. Stattdessen ein Schluessel
 * aus der .env (STATISTIK_SCHLUESSEL), aufgerufen als
 * /intern/seitenaufrufe?k=<schluessel>&tage=30. Ohne gesetzten Schluessel
 * oder mit falschem gibt es ein 404 - die Seite existiert nach aussen nicht.
 */
function schluesselPasst(k: string | undefined): boolean {
  const soll = process.env.STATISTIK_SCHLUESSEL?.trim();
  if (!soll || !k) return false;
  const a = Buffer.from(k);
  const b = Buffer.from(soll);
  return a.length === b.length && timingSafeEqual(a, b);
}

function zaehlen<T>(liste: T[], schluessel: (x: T) => string | null): [string, number][] {
  const z = new Map<string, number>();
  for (const x of liste) {
    const s = schluessel(x);
    if (s !== null) z.set(s, (z.get(s) ?? 0) + 1);
  }
  return [...z.entries()].sort((a, b) => b[1] - a[1]);
}

function Tabelle({
  titel,
  zeilen,
  max = 30,
}: {
  titel: string;
  zeilen: [string, number][];
  max?: number;
}) {
  const hoechster = zeilen[0]?.[1] ?? 1;
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
        {titel}
      </h2>
      {zeilen.length === 0 ? (
        <p className="text-sm text-neutral-500">Noch keine Daten.</p>
      ) : (
        <ul className="space-y-1.5">
          {zeilen.slice(0, max).map(([name, anzahl]) => (
            <li key={name} className="relative text-sm">
              <div
                className="absolute inset-y-0 left-0 rounded bg-accent-100"
                style={{ width: `${(anzahl / hoechster) * 100}%` }}
              />
              <div className="relative flex justify-between gap-4 px-2 py-0.5">
                <span className="truncate text-neutral-800">{name}</span>
                <span className="tabular-nums text-neutral-600">{anzahl}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function SeitenaufrufePage({
  searchParams,
}: {
  searchParams: Promise<{ k?: string; tage?: string }>;
}) {
  const { k, tage: tageRoh } = await searchParams;
  if (!schluesselPasst(k)) notFound();

  const tage = Math.min(Math.max(Number(tageRoh) || 30, 1), 400);
  const aufrufe = await seitenaufrufeLesen(tage);

  const einstiege = aufrufe.filter((a) => a.von === null || !a.von.startsWith("/"));
  const wege = aufrufe.filter((a) => a.von?.startsWith("/"));
  const mobilAnteil = aufrufe.length
    ? Math.round((aufrufe.filter((a) => a.mobil).length / aufrufe.length) * 100)
    : 0;

  const proTag = zaehlen(aufrufe, (a: Seitenaufruf) => a.t.slice(0, 10)).sort((a, b) =>
    b[0].localeCompare(a[0]),
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <h1 className="text-2xl font-semibold text-neutral-900">Seitenaufrufe</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Letzte {tage} Tage · {aufrufe.length} Aufrufe · {einstiege.length} Einstiege ·{" "}
        {mobilAnteil}% mobil
      </p>
      <nav className="mt-3 flex gap-3 text-sm">
        {[7, 30, 90, 365].map((t) => (
          <a
            key={t}
            href={`?k=${encodeURIComponent(k ?? "")}&tage=${t}`}
            className={t === tage ? "font-semibold text-accent-700" : "text-neutral-600 hover:underline"}
          >
            {t} Tage
          </a>
        ))}
      </nav>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Tabelle titel="Meistbesuchte Seiten" zeilen={zaehlen(aufrufe, (a) => a.pfad)} max={50} />
        <Tabelle titel="Einstiegsseiten" zeilen={zaehlen(einstiege, (a) => a.pfad)} />
        <Tabelle titel="Herkunft beim Einstieg" zeilen={zaehlen(einstiege, (a) => a.von ?? "direkt")} />
        <Tabelle
          titel="Klickwege auf der Website"
          zeilen={zaehlen(wege, (a) => `${a.von} → ${a.pfad}`)}
        />
        <Tabelle titel="Aufrufe pro Tag" zeilen={proTag} max={tage} />
      </div>
    </main>
  );
}
