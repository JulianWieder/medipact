import Link from "next/link";

/**
 * Fußnoten für Einschränkungen (N26-Prinzip): Der Claim bleibt lesbar, die
 * Einschränkung steht als hochgestellte Ziffer mit Sprung ans Seitenende.
 *
 * Bewusst zurückhaltend (03.11.2026): Ziffer grau statt Akzentfarbe, Liste
 * klein und hellgrau – die Fußnote soll auffindbar sein, nicht mit dem
 * Claim um Aufmerksamkeit konkurrieren.
 *
 *   <FootnoteRef n={1} />                       direkt hinter dem Claim
 *   <FootnoteList items={t.raw("footnotes")} /> einmal am Ende der Seite
 *
 * Nummern werden bewusst von Hand vergeben (in Lesereihenfolge) — kein
 * Context, damit die Komponenten auch in Server Components ohne Umbau
 * funktionieren. Nur Aussagen verwenden, die sich belegen lassen; die
 * Fußnote nennt die Einschränkung und verlinkt die Quelle.
 */

export type FootnoteItem = {
  n: number;
  text: string;
  href?: string;
  linkLabel?: string;
};

export function FootnoteRef({
  n,
  label = "Fußnote",
}: {
  n: number;
  label?: string;
}) {
  return (
    <sup className="ml-0.5 text-[0.65em] font-normal leading-none">
      <a
        id={`fnref-${n}`}
        href={`#fn-${n}`}
        aria-label={`${label} ${n}`}
        className="text-neutral-400 no-underline hover:text-accent-700 hover:underline"
      >
        {n}
      </a>
    </sup>
  );
}

export function FootnoteList({
  items,
  backLabel = "Zurück zum Text",
}: {
  items: FootnoteItem[];
  backLabel?: string;
}) {
  if (!items?.length) return null;
  return (
    <ol className="space-y-1.5 text-[11px] leading-relaxed text-neutral-500">
      {items.map((f) => (
        <li key={f.n} id={`fn-${f.n}`} className="flex gap-2 scroll-mt-24">
          <span className="w-4 shrink-0 text-neutral-400">
            {f.n}
          </span>
          <span>
            {f.text}
            {f.href && f.linkLabel && (
              <>
                {" "}
                <Link
                  href={f.href}
                  className="text-neutral-600 underline underline-offset-2 hover:text-accent-700"
                >
                  {f.linkLabel}
                </Link>
                .
              </>
            )}{" "}
            <a
              href={`#fnref-${f.n}`}
              aria-label={backLabel}
              className="text-neutral-400 no-underline hover:text-accent-700"
            >
              ↩
            </a>
          </span>
        </li>
      ))}
    </ol>
  );
}
