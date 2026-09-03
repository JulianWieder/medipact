"use client";

// Abmeldeseite. Der Link steht im Fuß jeder Newsletter-Ausgabe und im
// List-Unsubscribe-Header. Ein Klick genügt – kein Login, kein Formular,
// keine Rückfrage. Alles andere wäre eine Hürde, die Empfänger stattdessen
// zum Spam-Knopf greifen lässt.

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Icon from "@/app/components/ui/Icon";

type Status = "loading" | "success" | "error" | "missing";

function AbmeldenContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Ohne Token gibt es nichts zu tun – das ist der Startzustand, kein
  // Ergebnis eines Effekts (setState im Effekt-Rumpf ist hier verboten).
  const [status, setStatus] = useState<Status>(token ? "loading" : "missing");
  const [errorMessage, setErrorMessage] = useState("");
  const sent = useRef(false);

  useEffect(() => {
    if (!token) return;
    if (sent.current) return;
    sent.current = true;

    async function unsubscribe() {
      try {
        const res = await fetch("/api/newsletter/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          setErrorMessage(data?.error ?? "Abmeldung fehlgeschlagen.");
          setStatus("error");
          return;
        }
        setStatus("success");
      } catch {
        setErrorMessage("Server nicht erreichbar.");
        setStatus("error");
      }
    }

    unsubscribe();
  }, [token]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-white pt-[73px] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-accent-600 border-r-transparent" />
          <p className="text-neutral-600">Abmeldung wird ausgeführt …</p>
        </div>
      </main>
    );
  }

  if (status === "success") {
    return (
      <main className="min-h-screen bg-white pt-[73px]">
        <div className="mx-auto max-w-md px-6 py-20 lg:px-8 lg:py-32">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center">
            <div className="mb-4">
              <Icon name="check-circle" size={44} />
            </div>
            <h1 className="mb-3 text-2xl font-black text-neutral-900">Abgemeldet</h1>
            <p className="mb-6 text-sm text-neutral-600">
              Sie erhalten keine weiteren Newsletter von medipact. Ihre Adresse
              bleibt nur als Sperrvermerk gespeichert, damit sie nicht versehentlich
              erneut angeschrieben wird.
            </p>
            <Link
              href="/"
              className="inline-block rounded-2xl bg-accent-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-700"
            >
              Zur Startseite
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isMissing = status === "missing";

  return (
    <main className="min-h-screen bg-white pt-[73px]">
      <div className="mx-auto max-w-md px-6 py-20 lg:px-8 lg:py-32">
        <div
          className={
            isMissing
              ? "rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center"
              : "rounded-2xl border border-red-200 bg-red-50 p-8 text-center"
          }
        >
          <div className="mb-4">
            <Icon
              name={isMissing ? "warning" : "x-circle"}
              size={44}
              color={isMissing ? "#B45309" : "#B91C1C"}
            />
          </div>
          <h1
            className={
              isMissing
                ? "mb-3 text-2xl font-black text-amber-900"
                : "mb-3 text-2xl font-black text-red-900"
            }
          >
            {isMissing ? "Kein Abmeldecode" : "Abmeldung nicht möglich"}
          </h1>
          <p className="mb-6 text-sm text-neutral-600">
            {isMissing
              ? "Der Link ist unvollständig. Bitte klicken Sie den Abmeldelink in der Newsletter-Mail direkt an."
              : errorMessage}
          </p>
          <p className="mb-6 text-xs text-neutral-500">
            Klappt es weiterhin nicht, genügt eine kurze Nachricht an uns – wir
            nehmen Sie von Hand aus dem Verteiler.
          </p>
          <Link
            href="/kontakt"
            className="inline-block rounded-2xl bg-accent-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-700"
          >
            Zum Kontakt
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function NewsletterAbmeldenPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white pt-[73px] flex items-center justify-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-accent-600 border-r-transparent" />
        </main>
      }
    >
      <AbmeldenContent />
    </Suspense>
  );
}
