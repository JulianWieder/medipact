import NextLink from "next/link";
import { Breadcrumbs } from "@/app/components/ui/Breadcrumbs";
import { KENNENLERN_ANZAHL, KENNENLERN_MINUTEN, MERKLISTE_MAX, STARTPAKET_NAME } from "@/lib/mediatorVermittlung";
import { ORT_UMKREIS_KM, type Ortsseite } from "@/lib/ortsseiten";
import type { VerzeichnisMediator } from "@/lib/umkreis";
import { MediatorenVerzeichnis } from "../MediatorenVerzeichnis";

// Inhalt der Ortsseite /mediator-finden/ort/[ort] (lib/ortsseiten.ts).
// Die Liste selbst ist das Verzeichnis mit vorbelegtem Ort – dieselben
// Karten, Merkliste und Filter wie auf /mediator-finden.
//
// Bewusst KEINE Unterseiten je Schwerpunkt („Scheidungsmediation in
// München"): Die Vermittlung ist ein Zusatzbaustein, solche Seiten würden
// bei Google mit /scheidungsmediation und /konflikte/* konkurrieren. Den
// Schwerpunkt filtert man im Verzeichnis.

export function OrtsseiteInhalt({
  seite,
  mediatoren,
  weitereOrte,
}: {
  seite: Ortsseite;
  mediatoren: VerzeichnisMediator[];
  weitereOrte: Ortsseite[];
}) {
  const ort = seite.ort.name;
  const n = seite.treffer.length;


  return (
    <main>
      <section className="section section-base pb-0 pt-28 lg:pt-32">
        <div className="container">
          <Breadcrumbs
            items={[{ label: "Mediator finden", href: "/mediator-finden" }, { label: ort }]}
          />
          <div className="mt-8 max-w-3xl">
            <div className="eyebrow mb-4">Mediation vor Ort</div>
            <h1 className="heading-1">{`Mediator:innen in ${ort}`}</h1>
            <p className="mt-6 text-lg leading-8 text-neutral-600">
              {n === 1 ? "Eine Mediatorin oder ein Mediator arbeitet" : `${n} Mediator:innen arbeiten`} in {ort}{" "}
              oder bis {ORT_UMKREIS_KM} km entfernt vor Ort. Jedes Profil haben wir vor der
              Veröffentlichung geprüft. Merken Sie sich bis zu {MERKLISTE_MAX} vor: Im {STARTPAKET_NAME} bereiten
              Sie und die andere Seite den Fall digital vor, dann lernen Sie bis zu {KENNENLERN_ANZAHL} von ihnen je{" "}
              {KENNENLERN_MINUTEN} Minuten kennen.
            </p>
          </div>
        </div>
      </section>

      <MediatorenVerzeichnis
        mediatoren={mediatoren}
        start={{
          ort: { ...seite.ort, label: ort },
          umkreis: ORT_UMKREIS_KM,
        }}
        kopf={{
          eyebrow: "Profile",
          titel: `Im Umkreis von ${ort}`,
          intro: "Ort, Umkreis und Schwerpunkt lassen sich hier ändern. Wer auch per Video arbeitet, steht darunter, auch wenn die Person weiter weg sitzt.",
        }}
        ortsseiten={weitereOrte.filter((o) => o.slug !== seite.slug).map((o) => ({ slug: o.slug, name: o.ort.name }))}
      />

      <section className="section section-base pt-0">
        <div className="container">
          <div className="max-w-3xl rounded-3xl bg-neutral-50 p-6 text-neutral-700 sm:p-8">
            <h2 className="heading-3">Lieber online, ohne feste Termine?</h2>
            <p className="mt-3">
              Nicht jeder Konflikt braucht Termine vor Ort. Im medipact-Verfahren arbeiten beide Seiten getrennt und
              in ihrem Tempo, egal wo sie wohnen.{" "}
              <NextLink href="/methode" className="font-semibold text-accent-700 hover:underline">
                Das Online-Verfahren ansehen
              </NextLink>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
