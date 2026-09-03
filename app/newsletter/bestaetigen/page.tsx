"use client";

// Bestätigungsseite des Double-Opt-in. Der Link aus der Bestätigungsmail
// landet hier; die Seite meldet das Token einmalig ans Backend.
//
// Bewusst kein Server-Rendering mit Nebenwirkung: Next dürfte den Server-
// Render wiederholen, und eine Bestätigung soll genau ein Mal passieren.

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Icon from "@/app/components/ui/Icon";

type Status = "loading" | "success" | "error" | "missing";

function BestaetigenContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Ohne Token gibt es nichts zu tun – das ist der Startzustand, kein
  // Ergebnis eines Effekts (setState im Effekt-Rumpf ist hier verboten).
  const [status, setStatus] = useState<Status>(token ? "loading" : "missing");
  const [errorMessage, setErrorMessage] = useState("");
  // React ruft Effekte im Strict Mode doppelt auf – ohne diese Sperre liefe
  // der zweite Aufruf ins Leere (Token ist dann schon verbraucht) und die
  // Seite zeigte fälschlich einen Fehler.
  const sent = useRef(false);

  useEffect(() => {
    if (!token) return;
    if (sent.current) return;
    sent.current = true;

    async function confirm() {
      try {
        const res = await fetch("/api/newsletter/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          setErrorMessage(data?.error ?? "Bestätigung fehlgeschlagen.");
          setStatus("error");
          return;
        }
        setStatus("success");
      } catch {
        setErrorMessage("Server nicht erreichbar.");
        setStatus("error");
      }
    }

    confirm();
  }, [token]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-white pt-[73px] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-accent-600 border-r-transparent" />
          <p className="text-neutral-600">Anmeldung wird bestätigt …</p>
        </div>
      </main>
    );
  }

  if (status === "success") {
    return (
      <main className="min-h-screen bg-white pt-[73px]">
        <div className="mx-auto max-w-md px-6 py-20 lg:px-8 lg:py-32">
          <div className="rounded-2xl border border-accent-200 bg-accent-50 p-8 text-center">
            <div className="mb-4">
              <Icon name="check-circle" size={44} />
            </div>
            <h1 className="mb-3 text-2xl font-black text-accent-900">
              Anmeldung bestätigt
            </h1>
            <p className="mb-6 text-sm text-neutral-600">
              Vielen Dank. Sie erhalten den medipact-Newsletter ein- bis zweimal im
              Monat. Abmelden können Sie sich jederzeit über den Link am Ende jeder
              Ausgabe.
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
            {isMissing ? "Kein Bestätigungscode" : "Bestätigung nicht möglich"}
          </h1>
          <p className="mb-6 text-sm text-neutral-600">
            {isMissing
              ? "Der Link ist unvollständig. Bitte klicken Sie den Link in der Bestätigungsmail direkt an."
              : errorMessage}
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

export default function NewsletterBestaetigenPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white pt-[73px] flex items-center justify-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-accent-600 border-r-transparent" />
        </main>
      }
    >
      <BestaetigenContent />
    </Suspense>
  );
}
