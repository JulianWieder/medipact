"use client"; // Fehlergrenzen muessen Client-Komponenten sein.

import { useEffect } from "react";
import { Button } from "@/app/components/ui/Button";

// Auffangseite fuer unerwartete Laufzeitfehler. Ohne diese Datei zeigte Next
// eine leere englische Fehlermeldung. `unstable_retry` ist die Schreibweise
// von Next 16 (node_modules/next/dist/docs/.../file-conventions/error.md).
export default function Fehler({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="app-shell pt-[73px]">
      <section className="mx-auto max-w-3xl px-6 py-24 text-center lg:px-8">
        <p className="eyebrow mb-4 justify-center">Fehler</p>
        <h1 className="heading-2">Hier ist etwas schiefgelaufen.</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-neutral-600">
          Das liegt an uns, nicht an Ihnen. Versuchen Sie es bitte noch
          einmal. Ihre Angaben auf anderen Seiten sind davon nicht betroffen.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button onClick={() => unstable_retry()} size="lg">
            Erneut versuchen
          </Button>
          <Button href="/" variant="secondary" size="lg">
            Zur Startseite
          </Button>
        </div>
      </section>
    </main>
  );
}
