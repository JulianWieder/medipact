import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NextLink from "next/link";
import { Breadcrumbs } from "@/app/components/ui/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";
import { KENNENLERN_ANZAHL, KENNENLERN_MINUTEN, STARTPAKET_DANACH, STARTPAKET_NAME } from "@/lib/mediatorVermittlung";
import { ProfilAuswahl } from "../MerkenButton";
import {
  bereichLabel,
  fotoUrl,
  ladeMediator,
  ladeMediatoren,
  stundensatzLabel,
} from "@/lib/mediatoren";
import { mitPunkten, ortsseiteZu } from "@/lib/ortsseiten";

// Profilseite einer Mediatorin aus dem Verzeichnis (lib/mediatoren.ts).
// Nur freigegebene Profile – kerno antwortet sonst 404, dann auch hier.
//
// NOINDEX, nicht in der Sitemap, kein Person-Schema: Gebucht wird nur über
// medipact (Starterpaket). Ein Profil, das bei Google unter dem Namen der
// Mediatorin rankt, ist eine Visitenkarte für den Direktkontakt an uns
// vorbei. Gefunden wird über /mediator-finden und die Ortsseiten; dort
// stehen nur Vorname und Initial, keine Kontaktdaten.

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = await ladeMediator(slug);
  if (!m) return { title: "Profil nicht gefunden | medipact", robots: { index: false } };
  const ort = m.orte[0] ? ` in ${m.orte[0]}` : "";
  return {
    ...pageMetadata({
      title: `${m.anzeigename}, Mediation${ort} | medipact`.slice(0, 60),
      description: (
        m.kurzvita ??
        `${m.anzeigename}${m.titel ? `, ${m.titel}` : ""}: Mediation ${m.vor_ort ? "vor Ort" : ""}${m.vor_ort && m.online ? " und " : ""}${m.online ? "per Video" : ""}. Kennenlernen über medipact.`
      ).slice(0, 155),
      path: `/mediator-finden/${m.slug}`,
    }),
    robots: { index: false, follow: true },
  };
}

export default async function MediatorProfil({ params }: Props) {
  const { slug } = await params;
  const m = await ladeMediator(slug);
  if (!m) notFound();

  const foto = fotoUrl(m);
  const satz = stundensatzLabel(m.stundensatz_cent);
  // Ort verlinkt auf die Ortsseite (lib/ortsseiten.ts), aber nur, wenn dort
  // mehr steht als dieses eine Profil.
  const alle = mitPunkten(await ladeMediatoren());
  const orte = m.orte.map((o) => ({ name: o, seite: m.vor_ort ? ortsseiteZu(alle, o) : null }));

  return (
    <main>
      <section className="section section-base pt-28 lg:pt-32">
        <div className="container">
          <Breadcrumbs
            items={[{ label: "Mediator finden", href: "/mediator-finden" }, { label: m.anzeigename }]}
          />
          <div className="mt-8 grid gap-10 lg:grid-cols-[22rem_1fr] lg:gap-16">
            <div>
              <div className="aspect-square overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100">
                {foto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={foto} alt={`Foto von ${m.anzeigename}`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-7xl font-semibold text-neutral-300">
                    {m.anzeigename.charAt(0)}
                  </div>
                )}
              </div>
              <div className="mt-6 rounded-3xl border border-neutral-200 bg-white p-6">
                <dl className="space-y-3 text-sm">
                  {orte.length > 0 && (
                    <Zeile label="Ort">
                      {orte.map((o, i) => (
                        <span key={o.name}>
                          {i > 0 && ", "}
                          {o.seite && o.seite.treffer.length > 1 ? (
                            <NextLink
                              href={`/mediator-finden/ort/${o.seite.slug}`}
                              className="text-accent-700 hover:underline"
                              title={`Weitere Mediator:innen in ${o.seite.ort.name}`}
                            >
                              {o.name}
                            </NextLink>
                          ) : (
                            o.name
                          )}
                        </span>
                      ))}
                    </Zeile>
                  )}
                  <Zeile label="Form">
                    {[m.vor_ort && "Vor Ort", m.online && "Per Video"].filter(Boolean).join(" und ")}
                  </Zeile>
                  {m.sprachen.length > 0 && <Zeile label="Sprachen">{m.sprachen.join(", ")}</Zeile>}
                  {satz && <Zeile label="Honorar">{satz}</Zeile>}
                  <Zeile label="Kennenlernen">{KENNENLERN_MINUTEN} Min., im Starterpaket</Zeile>
                </dl>
                <ProfilAuswahl slug={m.slug} />
                <p className="mt-3 text-xs leading-5 text-neutral-500">
                  {`${STARTPAKET_NAME}: Themen und Interessen digital mit beiden Seiten, dann bis zu ${KENNENLERN_ANZAHL} Kennenlerngespräche – auch mit weiteren Mediator:innen.`}
                </p>
              </div>
            </div>

            <div>
              <div className="eyebrow mb-4">Mediation</div>
              <h1 className="heading-1">{m.anzeigename}</h1>
              {m.titel && <p className="mt-3 text-xl text-neutral-600">{m.titel}</p>}
              {m.bereiche.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {m.bereiche.map((b) => (
                    <span key={b} className="rounded-full bg-accent-50 px-3 py-1.5 text-sm font-medium text-accent-800">
                      {bereichLabel(b)}
                    </span>
                  ))}
                </div>
              )}
              {m.kurzvita && (
                <div className="mt-10">
                  <h2 className="heading-3">Über mich</h2>
                  <p className="mt-4 whitespace-pre-line text-lg leading-8 text-neutral-700">{m.kurzvita}</p>
                </div>
              )}
              {m.ausbildung && (
                <div className="mt-10">
                  <h2 className="heading-3">Ausbildung</h2>
                  <p className="mt-4 whitespace-pre-line leading-7 text-neutral-700">{m.ausbildung}</p>
                </div>
              )}
              <div className="mt-12 rounded-3xl bg-neutral-50 p-6 text-neutral-700">
                <h2 className="heading-3">So geht es weiter</h2>
                <ol className="mt-4 list-decimal space-y-2 pl-5">
                  <li>Starterpaket buchen, die andere Seite einladen und gemeinsam die Einleitung machen.</li>
                  <li>Themen und Interessen digital herausarbeiten – jede Seite in ihrem Tempo.</li>
                  <li>{`${KENNENLERN_MINUTEN} Minuten kennenlernen – mit ${m.anzeigename} und bis zu ${KENNENLERN_ANZAHL - 1} weiteren, wenn Sie vergleichen möchten.`}</li>
                  <li>Übergabe an die Person Ihrer Wahl.</li>
                </ol>
                <p className="mt-4 text-sm">{STARTPAKET_DANACH}</p>
                <p className="mt-4 text-sm">
                  Lieber online ohne feste Termine?{" "}
                  <NextLink href="/methode" className="font-semibold text-accent-700 hover:underline">
                    Das medipact-Verfahren
                  </NextLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Zeile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="text-right font-medium text-neutral-900">{children}</dd>
    </div>
  );
}
