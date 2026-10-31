import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { ladeMediatoren } from "@/lib/mediatoren";
import { mitPunkten, ortsseite, ortsseiten } from "@/lib/ortsseiten";
import { OrtsseiteInhalt } from "../OrtsseiteInhalt";

// Ortsseite „Mediation in München" (lib/ortsseiten.ts). Es gibt sie für
// jeden Ort, den ein Vor-Ort-Profil angibt; in den Index erst ab INDEX_AB
// Profilen. Der statische Pfad /ort/ geht vor /mediator-finden/[slug] –
// ein Profil mit dem Slug „ort" wäre deshalb nicht erreichbar.

type Props = { params: Promise<{ ort: string }> };

const NICHT_INDEXIEREN = { robots: { index: false, follow: true } } as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ort } = await params;
  const seite = ortsseite(mitPunkten(await ladeMediatoren()), ort);
  if (!seite) return { title: "Ort nicht gefunden | medipact", robots: { index: false } };
  const name = seite.ort.name;
  const lang = `Mediation in ${name}: Mediator:innen vor Ort | medipact`;
  const n = seite.treffer.length;
  return {
    ...pageMetadata({
      title: lang.length <= 60 ? lang : `Mediation in ${name} | medipact`,
      description: `${n === 1 ? "Eine Mediatorin oder ein Mediator" : `${n} geprüfte Mediator:innen`} in ${name} und Umgebung, vor Ort oder per Video. Profile ansehen, vormerken und im Starterpaket kennenlernen.`.slice(0, 155),
      path: `/mediator-finden/ort/${seite.slug}`,
    }),
    ...(seite.indexiert ? {} : NICHT_INDEXIEREN),
  };
}

export default async function Ortsseite({ params }: Props) {
  const { ort } = await params;
  const mediatoren = mitPunkten(await ladeMediatoren());
  const alle = ortsseiten(mediatoren);
  const seite = alle.find((s) => s.slug === ort);
  if (!seite) notFound();
  return <OrtsseiteInhalt seite={seite} mediatoren={mediatoren} weitereOrte={alle.filter((s) => s.indexiert)} />;
}
