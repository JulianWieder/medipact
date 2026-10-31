"use client";

// Verzeichnis auf /mediator-finden: Filter nach Schwerpunkt, Ort und
// vor Ort / per Video. Die Liste kommt serverseitig aus kerno
// (lib/mediatoren.ts) – hier wird nur noch gefiltert und vorgemerkt.
//
// Ort: PLZ oder Ortsname, aufgelöst über /api/orte (lib/geo.ts), dann
// Umkreis in km. Die Profile kommen mit fertigen Koordinaten (punkte).
// Lässt sich die Eingabe nicht auflösen, wird wie früher nach Text
// gefiltert. Video-Profile außerhalb des Umkreises stehen in einer eigenen
// Gruppe darunter – sie passen zu jedem Ort, aber nicht „in der Nähe".
//
// Die Ortsseiten (/mediator-finden/ort/…) nutzen dieselbe Komponente mit
// `start` (Ort und ggf. Schwerpunkt vorbelegt) und eigenem `kopf`.
//
// Vormerken ist die erste Auswahl für das Starterpaket: bis zu
// MERKLISTE_MAX Profile, ohne Konto (lib/merkliste.ts). Die Leiste unten
// bucht das Starterpaket mit genau dieser Vorauswahl.

import { useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
import clsx from "clsx";
import { Button } from "@/app/components/ui/Button";
import {
  KENNENLERN_ANZAHL,
  KENNENLERN_MINUTEN,
  MERKLISTE_MAX,
  STARTERPAKET_URL,
  STARTPAKET_PREIS,
  starterpaketUrl,
} from "@/lib/mediatorVermittlung";
import { useMerkliste } from "@/lib/merkliste";
import { MerkenButton } from "./MerkenButton";
import { BEREICHE, bereichLabel, fotoUrl, stundensatzLabel } from "@/lib/mediatoren";
import {
  UMKREISE,
  UMKREIS_STANDARD,
  kmLabel,
  naechsteKm,
  type Punkt,
  type VerzeichnisMediator,
} from "@/lib/umkreis";

type Form = "alle" | "vor_ort" | "online";
type Ort = Punkt & { label: string };

export function MediatorenVerzeichnis({
  mediatoren,
  start,
  kopf,
  ortsseiten = [],
}: {
  mediatoren: VerzeichnisMediator[];
  start?: { ort?: Ort; umkreis?: number; bereich?: string };
  kopf?: { eyebrow: string; titel: string; intro: React.ReactNode };
  /** Links „Mediator:innen nach Ort" – nur indexierte Ortsseiten. */
  ortsseiten?: { slug: string; name: string }[];
}) {
  const [bereich, setBereich] = useState<string | null>(start?.bereich ?? null);
  const [ortText, setOrtText] = useState(start?.ort?.label ?? "");
  const [ort, setOrt] = useState<Ort | null>(start?.ort ?? null);
  const [umkreis, setUmkreis] = useState<number>(start?.umkreis ?? UMKREIS_STANDARD);
  const [form, setForm] = useState<Form>("alle");
  const merkliste = useMerkliste();

  // Eingabe nach kurzer Pause auflösen; ältere Antworten verwerfen.
  useEffect(() => {
    const text = ortText.trim();
    // Unter drei Zeichen leert onChange den Ort, hier wird nichts gefragt.
    if (text.length < 3 || text === ort?.label) return;
    const abbruch = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/orte?q=${encodeURIComponent(text)}`, { signal: abbruch.signal });
        setOrt(res.ok ? ((await res.json()) as Ort) : null);
      } catch {
        if (!abbruch.signal.aborted) setOrt(null);
      }
    }, 300);
    return () => {
      clearTimeout(t);
      abbruch.abort();
    };
  }, [ortText, ort?.label]);

  // Nur Schwerpunkte anbieten, die jemand im Verzeichnis auch hat.
  const angeboten = useMemo(
    () => BEREICHE.filter((b) => mediatoren.some((m) => m.bereiche.includes(b.id))),
    [mediatoren],
  );

  // nahe: im Umkreis, nächste zuerst. perVideo: weiter weg, aber per Video.
  const { nahe, perVideo } = useMemo(() => {
    const basis = mediatoren.filter(
      (m) =>
        (!bereich || m.bereiche.includes(bereich)) &&
        (form === "alle" || (form === "online" ? m.online : m.vor_ort)),
    );
    if (ort) {
      const mitKm = basis.map((m) => ({ m, km: naechsteKm(m, ort) }));
      return {
        nahe: mitKm
          .filter((t): t is { m: VerzeichnisMediator; km: number } => t.km !== null && t.km <= umkreis)
          .sort((a, b) => a.km - b.km),
        perVideo: mitKm
          .filter((t) => (t.km === null || t.km > umkreis) && t.m.online)
          .map((t) => ({ m: t.m, km: null })),
      };
    }
    // Nicht auflösbar (Tippfehler, Ortsteil ohne eigenen Eintrag): Textsuche.
    // Wer per Video arbeitet, passt zu jedem Ort.
    const o = ortText.trim().toLowerCase();
    return {
      nahe: basis
        .filter((m) => !o || m.online || m.orte.some((x) => x.toLowerCase().includes(o)))
        .map((m) => ({ m, km: null })),
      perVideo: [],
    };
  }, [mediatoren, bereich, form, ort, ortText, umkreis]);

  // Nur Slugs, die es im Verzeichnis noch gibt – ein zurückgezogenes Profil
  // soll nicht still mitgebucht werden.
  const vorgemerkt = merkliste.liste.filter((slug) => mediatoren.some((m) => m.slug === slug));

  return (
    <section id="verzeichnis" className="section section-base">
      <div className="container">
        <div className="mb-10 max-w-3xl">
          <div className="eyebrow mb-4">{kopf?.eyebrow ?? "Unsere Mediator:innen"}</div>
          <h2 className="heading-2">{kopf?.titel ?? "Wählen Sie selbst, mit wem Sie sprechen"}</h2>
          <p className="mt-5 text-lg leading-8 text-neutral-600">
            {kopf?.intro ?? (
              <>
                Jedes Profil haben wir vor der Veröffentlichung geprüft. Merken Sie sich bis zu {MERKLISTE_MAX}{" "}
                Personen vor – im Starterpaket lernen Sie bis zu {KENNENLERN_ANZAHL} von ihnen je{" "}
                {KENNENLERN_MINUTEN} Minuten kennen. Dazu kommen Angebote von Mediator:innen, die zu Ihrem Fall
                passen.
              </>
            )}
          </p>
        </div>

        {mediatoren.length === 0 ? (
          <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-8 text-neutral-700">
            <p className="text-lg font-semibold text-neutral-900">Das Verzeichnis wächst gerade.</p>
            <p className="mt-2 max-w-2xl">
              Bis die ersten Profile online sind, starten Sie ohne Vorauswahl: Nach der Interessenphase machen
              Ihnen passende Mediator:innen Angebote.
            </p>
            <Button href={STARTERPAKET_URL} className="mt-6">
              Starterpaket buchen
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
                  value={ortText}
                  onChange={(e) => {
                    setOrtText(e.target.value);
                    if (e.target.value.trim().length < 3) setOrt(null);
                  }}
                  placeholder="PLZ oder Ort"
                  aria-label="PLZ oder Ort"
                  inputMode="search"
                  className="w-44 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100"
                />
                <select
                  value={umkreis}
                  onChange={(e) => setUmkreis(Number(e.target.value))}
                  aria-label="Umkreis"
                  disabled={!ort}
                  className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm outline-none focus:border-accent-400 disabled:text-neutral-400"
                >
                  {UMKREISE.map((km) => (
                    <option key={km} value={km}>
                      {`bis ${km} km`}
                    </option>
                  ))}
                </select>
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

            {ort && (
              <p className="-mt-4 mb-6 text-sm text-neutral-500">
                {nahe.length === 0
                  ? `Im Umkreis von ${umkreis} km um ${ort.label} gibt es noch kein Profil.`
                  : `${nahe.length === 1 ? "1 Profil" : `${nahe.length} Profile`} im Umkreis von ${umkreis} km um ${ort.label}, nächste zuerst.`}
              </p>
            )}

            {nahe.length === 0 && perVideo.length === 0 ? (
              <p className="text-neutral-600">
                Für diese Auswahl gibt es noch kein Profil.{" "}
                <NextLink href={STARTERPAKET_URL} className="font-semibold text-accent-700 hover:underline">
                  Starten Sie ohne Vorauswahl – passende Mediator:innen machen Ihnen Angebote
                </NextLink>
                .
              </p>
            ) : (
              <>
                {nahe.length > 0 && <Raster liste={nahe} merkliste={merkliste} />}
                {perVideo.length > 0 && (
                  <div className={nahe.length > 0 ? "mt-14" : undefined}>
                    <h3 className="heading-3">Per Video, unabhängig vom Ort</h3>
                    <p className="mb-6 mt-2 text-neutral-600">
                      Diese Mediator:innen arbeiten weiter entfernt, führen die Mediation aber auch per Video.
                    </p>
                    <Raster liste={perVideo} merkliste={merkliste} />
                  </div>
                )}
              </>
            )}

            {ort && (
              <p className="mt-8 text-xs text-neutral-400">
                Entfernung in Luftlinie. Ortsdaten:{" "}
                <a href="https://www.geonames.org" className="underline" rel="noopener" target="_blank">
                  GeoNames
                </a>
                ,{" "}
                <a
                  href="https://creativecommons.org/licenses/by/4.0/deed.de"
                  className="underline"
                  rel="noopener"
                  target="_blank"
                >
                  CC BY 4.0
                </a>
              </p>
            )}
          </>
        )}

        {ortsseiten.length > 0 && (
          <nav aria-label="Mediator:innen nach Ort" className="mt-16 border-t border-neutral-200 pt-10">
            <h3 className="heading-3">Mediator:innen nach Ort</h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {ortsseiten.map((o) => (
                <li key={o.slug}>
                  <NextLink
                    href={`/mediator-finden/ort/${o.slug}`}
                    className="inline-block rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-accent-300 hover:text-accent-800"
                  >
                    {`Mediation in ${o.name}`}
                  </NextLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
      {vorgemerkt.length > 0 && (
        <MerklistenLeiste
          namen={vorgemerkt.map((slug) => mediatoren.find((m) => m.slug === slug)?.anzeigename ?? slug)}
          href={starterpaketUrl(vorgemerkt)}
          onLeeren={merkliste.leeren}
        />
      )}
    </section>
  );
}

function Raster({
  liste,
  merkliste,
}: {
  liste: { m: VerzeichnisMediator; km: number | null }[];
  merkliste: ReturnType<typeof useMerkliste>;
}) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {liste.map(({ m, km }) => (
        <li key={m.slug}>
          <Karte
            m={m}
            km={km}
            vorgemerkt={merkliste.vorgemerkt(m.slug)}
            gesperrt={merkliste.voll && !merkliste.vorgemerkt(m.slug)}
            onMerken={() => merkliste.umschalten(m.slug)}
          />
        </li>
      ))}
    </ul>
  );
}

function MerklistenLeiste({
  namen,
  href,
  onLeeren,
}: {
  namen: string[];
  href: string;
  onLeeren: () => void;
}) {
  return (
    <div className="sticky bottom-4 z-30 mx-auto mt-10 max-w-3xl px-4">
      <div className="flex flex-col gap-3 rounded-3xl border border-accent-200 bg-white/95 p-4 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.35)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-neutral-900">
            {namen.length} von {MERKLISTE_MAX} vorgemerkt
          </p>
          <p className="truncate text-sm text-neutral-600">{namen.join(", ")}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onLeeren}
            className="text-sm font-medium text-neutral-500 hover:text-neutral-800"
          >
            Leeren
          </button>
          <Button href={href} size="sm">
            {`Starterpaket buchen · ${STARTPAKET_PREIS}`}
          </Button>
        </div>
      </div>
    </div>
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

function Karte({
  m,
  km,
  vorgemerkt,
  gesperrt,
  onMerken,
}: {
  m: VerzeichnisMediator;
  km: number | null;
  vorgemerkt: boolean;
  gesperrt: boolean;
  onMerken: () => void;
}) {
  const foto = fotoUrl(m);
  const satz = stundensatzLabel(m.stundensatz_cent);
  // Kein Button im Link: Die Karte ist ein Container, Foto und Name
  // verlinken auf das Profil, der Merken-Button steht daneben.
  return (
    <div
      className={clsx(
        "group flex h-full flex-col overflow-hidden rounded-3xl border bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-20px_rgba(15,23,42,0.18)]",
        vorgemerkt ? "border-accent-400 ring-2 ring-accent-100" : "border-neutral-200 hover:border-accent-300",
      )}
    >
      <NextLink
        href={`/mediator-finden/${m.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-neutral-100"
        tabIndex={-1}
        aria-hidden
      >
        {foto ? (
          // Bilder kommen über den eigenen Proxy; next/image bräuchte dafür nichts extra, optimiert aber
          // auch nichts, was kerno nicht schon klein liefert.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={foto}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl font-semibold text-neutral-300">
            {m.anzeigename.charAt(0)}
          </div>
        )}
        {vorgemerkt && (
          <span className="absolute left-4 top-4 rounded-full bg-accent-600 px-3 py-1 text-xs font-semibold text-white">
            Vorgemerkt
          </span>
        )}
      </NextLink>
      <div className="flex flex-1 flex-col p-6">
        <NextLink
          href={`/mediator-finden/${m.slug}`}
          className="text-lg font-semibold text-neutral-900 hover:text-accent-700"
        >
          {m.anzeigename}
        </NextLink>
        {m.titel && <p className="mt-1 text-sm text-neutral-600">{m.titel}</p>}
        <p className="mt-3 text-sm text-neutral-500">
          {[m.orte.join(", "), km !== null && kmLabel(km), m.vor_ort && "vor Ort", m.online && "per Video"]
            .filter(Boolean)
            .join(" · ")}
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
        {satz && <p className="mt-4 text-sm text-neutral-700">{satz}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-6 text-sm">
          <MerkenButton vorgemerkt={vorgemerkt} gesperrt={gesperrt} onClick={onMerken} />
          <NextLink href={`/mediator-finden/${m.slug}`} className="font-semibold text-accent-700">
            Profil <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </NextLink>
        </div>
      </div>
    </div>
  );
}
