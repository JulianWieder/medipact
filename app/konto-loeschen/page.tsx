import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import KontoLoeschenClient from "./KontoLoeschenClient";

// ── Konto löschen ───────────────────────────────────────────────────────────
//
// Diese Seite muss OHNE Login erreichbar sein. Das ist keine Designfrage: Der
// Play Store verlangt für Apps mit Nutzerkonten eine öffentliche Adresse, die
// direkt auf die Löschung zeigt – nicht die Startseite mit einem Link
// irgendwo darin – und die benennt, was gelöscht wird, was bleibt und warum.
// Ohne diese Seite gibt es keine Freigabe im Store.
//
// Deshalb steht der erklärende Teil im Server-Render und ist für jeden
// lesbar; der Knopf, der wirklich löscht, erscheint nur für Angemeldete.
//
// `robots: noindex` – die Seite soll erreichbar sein, aber nicht in der Suche
// neben „Mediation online" stehen.
export const metadata: Metadata = {
  title: "Konto löschen – medipact",
  description:
    "Wie du dein medipact-Konto und deine Daten löschst – sofort oder, bei laufender Mediation, auf Antrag.",
  robots: { index: false, follow: false },
};

function Abschnitt({
  titel,
  children,
}: {
  titel: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-neutral-400">
        {titel}
      </h2>
      <div className="space-y-3 text-base leading-7 text-neutral-600">
        {children}
      </div>
    </section>
  );
}

export default async function KontoLoeschenPage() {
  const session = await auth();

  return (
    <main className="app-shell pt-[73px]">
      <div className="mx-auto max-w-3xl space-y-12 px-6 py-20 lg:px-8">
        <div>
          <h1 className="heading-1 mb-2">Konto löschen</h1>
          <p className="text-lg font-light text-neutral-500">
            Was gelöscht wird, was bleibt und wie lange es dauert.
          </p>
        </div>

        <Abschnitt titel="Wenn du keine Mediation führst">
          <p>
            Dann ist es einfach: Dein Konto, dein Konflikt-Logbuch und dein
            Betreuungskalender werden <strong>sofort und vollständig
            gelöscht</strong> – Einträge, Betreuungszeiten, Absprachen,
            hochgeladene Dateien, Zugänge, die du für dein Kind oder die andere
            Seite angelegt hast, und deine Newsletter-Anmeldung.
          </p>
          <p>
            Das lässt sich nicht rückgängig machen, und wir bewahren nichts
            auf. Es gibt in diesem Fall auch nichts, das wir aufbewahren
            müssten.
          </p>
        </Abschnitt>

        <Abschnitt titel="Wenn du Partei einer laufenden Mediation bist">
          <p>
            Dann wird dein Wunsch <strong>vermerkt</strong> und dein Konto nach
            Abschluss des Verfahrens gelöscht. Wir melden uns innerhalb von 30
            Tagen mit dem weiteren Ablauf.
          </p>
          <p>
            Der Grund ist nicht Bequemlichkeit, sondern die Gegenseite: An
            einem laufenden Verfahren hängen ihre Eingaben, gemeinsam
            erarbeitete Vereinbarungen und Zusagen, auf die sich beide berufen.
            Wer daraus einseitig verschwindet, nimmt der anderen Person
            Material weg, das ihr gehört.
          </p>
          <p>Konkret bedeutet das:</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong>Gelöscht werden</strong> dein Zugang, dein Profil, deine
              Stammdaten und deine persönlichen Notizen.
            </li>
            <li>
              <strong>Es bleiben</strong> die Beiträge der anderen Partei,
              unterschriebene Vereinbarungen und Rechnungen. Letztere müssen
              wir zehn Jahre aufbewahren (§ 147 Abgabenordnung) – das ist eine
              gesetzliche Pflicht, keine Entscheidung von uns.
            </li>
          </ul>
        </Abschnitt>

        <Abschnitt titel="So löschst du">
          {session?.user ? (
            <KontoLoeschenClient />
          ) : (
            <>
              <p>
                Melde dich an – der Löschknopf erscheint dann direkt hier auf
                dieser Seite. Du findest ihn ebenso in der App und im Dashboard
                unter deinem Profil.
              </p>
              <Link
                href="/auth/login?callbackUrl=/konto-loeschen"
                className="btn btn-primary mt-2 inline-flex text-sm"
              >
                Anmelden und löschen
              </Link>
              <p className="pt-4 text-sm text-neutral-500">
                Kommst du nicht mehr in dein Konto? Schreib uns von der
                hinterlegten E-Mail-Adresse aus an{" "}
                <a className="underline" href="mailto:datenschutz@medipact.de">
                  datenschutz@medipact.de
                </a>{" "}
                – wir löschen dann für dich.
              </p>
            </>
          )}
        </Abschnitt>

        <Abschnitt titel="Weiteres">
          <p>
            Wie wir mit deinen Daten umgehen, steht in der{" "}
            <Link href="/datenschutz" className="underline">
              Datenschutzerklärung
            </Link>
            .
          </p>
        </Abschnitt>
      </div>
    </main>
  );
}
