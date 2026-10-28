"use client";

// Verzeichnis auf /mediator-finden: Filter nach Schwerpunkt, Ort und
// vor Ort / per Video. Die Liste kommt serverseitig aus kerno
// (lib/mediatoren.ts) – hier wird nur noch gefiltert.

import { useMemo, useState } from "react";
import NextLink from "next/link";
import clsx from "clsx";
import { Button } from "@/app/components/ui/Button";
import { MEDIATOR_ANFRAGE_URL } from "@/lib/mediatorVermittlung";
import {
  BEREICHE,
  bereichLabel,
  fotoUrl,
  stundensatzLabel,
  type Mediator,
} from "@/lib/mediatoren";

type Form = "alle" | "vor_ort" | "online";

export function MediatorenVerzeichnis({ mediatoren }: { mediatoren: Mediator[] }) {
  const [bereich, setBereich] = useState<string | null>(null);
  const [ort, setOrt] = useState("");
  const [form, setForm] = useState<Form>("alle");

  // Nur Schwerpunkte anbieten, die jemand im Verzeichnis auch hat.
  const angeboten = useMemo(
    () => BEREICHE.filter((b) => mediatoren.some((m) => m.bereiche.includes(b.id))),
    [mediatoren],
  );

  const treffer = useMemo(() => {
    const o = ort.trim().toLowerCase();
    return mediatoren.filter(
      (m) =>
        (!bereich || m.bereiche.includes(bereich)) &&
        (form === "alle" || (form === "online" ? m.online : m.vor_ort)) &&
        // Wer per Video arbeitet, passt zu jedem Ort.
        (!o || m.online || m.orte.some((x) => x.toLowerCase().includes(o))),
    );
  }, [mediatoren, bereich, ort, form]);

  return (
    <section id="verzeichnis" className="section section-base">
      <div className="container">
        <div className="mb-10 max-w-3xl">
          <div className="eyebrow mb-4">Unsere Mediator:innen</div>
          <h2 className="heading-2">Wählen Sie selbst, mit wem Sie sprechen</h2>
          <p className="mt-5 text-lg leading-8 text-neutral-600">
            Jedes Profil haben wir vor der Veröffentlichung geprüft. Das Vorgespräch fragen Sie direkt über das
            Profil an.
          </p>
        </div>

        {mediatoren.length === 0 ? (
          <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-8 text-neutral-700">
            <p className="text-lg font-semibold text-neutral-900">Das Verzeichnis wächst gerade.</p>
            <p className="mt-2 max-w-2xl">
              Bis die ersten Profile online sind, ordnen wir Ihnen eine passende Mediatorin persönlich zu.
            </p>
            <Button href={MEDIATOR_ANFRAGE_URL} className="mt-6">
              Mediatorin anfragen
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Schwerpunkt">
                <Chip an={bereich === null} onClick={() => setBereich(null)}>
                  Alle Bereiche
                </Chip>
                {angeboten.map((b) => (
                  <Chip key={b.id} an={bereich === b.id} onClick={() => setBereich(bereich === b.id ? null : b.id)}>
                    {b.label}
                  </Chip>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  value={ort}
                  onChange={(e) => setOrt(e.target.value)}
                  placeholder="Ort, z. B. Frankfurt"
                  aria-label="Ort"
                  className="w-48 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100"
                />
                <select
                  value={form}
                  onChange={(e) => setForm(e.target.value as Form)}
                  aria-label="Vor Ort oder per Video"
                  className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm outline-none focus:border-accent-400"
                >
                  <option value="alle">Vor Ort & Video</option>
                  <option value="vor_ort">Nur vor Ort</option>
                  <option value="online">Nur per Video</option>
                </select>
              </div>
            </div>

            {treffer.length === 0 ? (
              <p className="text-neutral-600">
                Für diese Auswahl gibt es noch kein Profil.{" "}
                <NextLink href={MEDIATOR_ANFRAGE_URL} className="font-semibold text-accent-700 hover:underline">
                  Lassen Sie sich eine Mediatorin zuordnen
                </NextLink>
                .
              </p>
            ) : (
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {treffer.map((m) => (
                  <li key={m.slug}>
                    <Karte m={m} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function Chip({ an, onClick, children }: { an: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={an}
      onClick={onClick}
      className={clsx(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        an
          ? "border-accent-500 bg-accent-50 text-accent-800"
          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900",
      )}
    >
      {children}
    </button>
  );
}

function Karte({ m }: { m: Mediator }) {
  const foto = fotoUrl(m);
  const satz = stundensatzLabel(m.stundensatz_cent);
  return (
    <NextLink
      href={`/mediator-finden/${m.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-[0_20px_50px_-20px_rgba(15,23,42,0.18)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        {foto ? (
          // Bilder kommen über den eigenen Proxy; next/image bräuchte dafür nichts extra, optimiert aber
          // auch nichts, was kerno nicht schon klein liefert.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={foto}
            alt={`Foto von ${m.anzeigename}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl font-semibold text-neutral-300">
            {m.anzeigename.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-lg font-semibold text-neutral-900">{m.anzeigename}</p>
        {m.titel && <p className="mt-1 text-sm text-neutral-600">{m.titel}</p>}
        <p className="mt-3 text-sm text-neutral-500">
          {[m.orte.join(", "), m.vor_ort && "vor Ort", m.online && "per Video"].filter(Boolean).join(" · ")}
        </p>
        {m.bereiche.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {m.bereiche.slice(0, 4).map((b) => (
              <span key={b} className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                {bereichLabel(b)}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-6 text-sm">
          <span className="text-neutral-700">
            {m.vorgespraech_kostenlos ? "Vorgespräch kostenlos" : satz ?? ""}
          </span>
          <span className="font-semibold text-accent-700">
            Profil ansehen <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </span>
        </div>
      </div>
    </NextLink>
  );
}
