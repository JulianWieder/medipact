"use client";

import { hashId } from "@/lib/ids";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import InviteVideoRecorder from "@/app/components/mediation/InviteVideoRecorder";
import InviteMeetRecorder from "@/app/components/mediation/InviteMeetRecorder";

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: Record<string, unknown>) => {
        render: (container: HTMLElement) => void;
      };
    };
  }
}

type PartyStatus = {
  participant_id: number;
  role: string;
  name: string | null;
  owes: boolean;
  paid: boolean;
  amount_due_eur: number;
  is_you: boolean;
};

type PayStatus = {
  mediation_type: string;
  package: string;
  billing_model: string;
  case_base_price_eur: number;
  is_paid: boolean;
  all_owing_paid: boolean;
  you: {
    owes: boolean;
    base_due_eur: number;
    discount_code: string | null;
    discount_amount_eur: number;
    amount_due_eur: number;
    paid: boolean;
  };
  participants: PartyStatus[];
};

type Props = {
  mediationId: string;
  userRole: string;
  currentUserName?: string;
  initialIsPaid?: boolean;
};

type Participant = {
  id: string;
  name: string;
  email?: string;
  role: string;
  invitationStatus: "accepted" | "pending";
};

const roleLabel: Record<string, string> = {
  initiator: "Antragsteller",
  other_party: "Andere Seite",
  mediator: "Mediator",
  owner: "Antragsteller",
};

export default function MediationClient({ mediationId, userRole, currentUserName, initialIsPaid = false }: Props) {
  const router = useRouter();
  const [inviteUrl, setInviteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");
  const [videoToken, setVideoToken] = useState("");
  const [meetToken, setMeetToken] = useState("");
  const [meetRecordingAvailable, setMeetRecordingAvailable] = useState(false);
  const [improving, setImproving] = useState(false);
  const [improveError, setImproveError] = useState("");
  const [invitationSubject, setInvitationSubject] = useState("");
  const [titleSuggestion, setTitleSuggestion] = useState("");
  const [titleSaving, setTitleSaving] = useState(false);
  const [titleSaved, setTitleSaved] = useState(false);
  const [generating, setGenerating] = useState(false);
  // Video-Modus der Einladung, konfiguriert über die Phase "einladung" im
  // Workflow Manager (optional | required | off). Default optional.
  const [videoMode, setVideoMode] = useState<"optional" | "required" | "off">("optional");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isPaid, setIsPaid] = useState(initialIsPaid);
  const [paying, setPaying] = useState(false);
  const [payStatus, setPayStatus] = useState<PayStatus | null>(null);
  const [discountInput, setDiscountInput] = useState("");
  const [discountBusy, setDiscountBusy] = useState(false);
  const [discountError, setDiscountError] = useState("");
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const paypalRenderedRef = useRef(false);

  useEffect(() => {
    async function loadParticipants() {
      try {
        const res = await fetch(`/api/mediations/${mediationId}/participants`);
        if (res.ok) {
          const data: Participant[] = await res.json();
          setParticipants(data);

          // Andere Partei direkt zur emotionalen Einleitung weiterleiten
          if (currentUserName) {
            const me = data.find((p) => p.name === currentUserName);
            if (me?.role === "other_party") {
              router.replace(`/dashboard/${hashId(mediationId)}/einleitung`);
              return;
            }
          }
        }
      } catch {
        // Fehler beim Laden still ignorieren
      }
    }
    loadParticipants();
  }, [mediationId, currentUserName, router]);

  // Video-Modus der Einladung aus der "einladung"-Phasenkonfiguration laden.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/mediations/${mediationId}/invite-settings`, { cache: "no-store" });
        if (res.ok && !cancelled) {
          const data = await res.json().catch(() => null);
          const mode = data?.video_mode;
          if (mode === "optional" || mode === "required" || mode === "off") setVideoMode(mode);
          setMeetRecordingAvailable(Boolean(data?.meet_recording_available));
        }
      } catch {
        // Fehler still ignorieren – Default "optional" bleibt.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mediationId]);

  const hasOtherParty = participants.some(
    (p) => p.role === "other_party" && p.invitationStatus === "accepted",
  );

  async function createInvite() {
    setLoading(true);
    setError("");

    const trimmedEmail = email.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (!isValidEmail) {
      setError("Bitte gib eine gültige E-Mail-Adresse ein.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/mediations/${mediationId}/invites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invited_email: trimmedEmail,
          personal_message: personalMessage.trim() || undefined,
          video_token: videoToken || undefined,
          meet_recording_token: meetToken || undefined,
          invitation_heading: invitationSubject.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        const raw = errorBody?.detail ?? errorBody?.error;
        const detail = Array.isArray(raw)
          ? raw.map((e: { msg?: string }) => e.msg ?? JSON.stringify(e)).join(", ")
          : (raw ?? "Unbekannter Fehler");
        setError(`Einladung fehlgeschlagen (${res.status}): ${detail}`);
        return;
      }

      const data = await res.json();
      setInviteUrl(data.invite_url);

      const participantsRes = await fetch(`/api/mediations/${mediationId}/participants`);
      if (participantsRes.ok) {
        setParticipants(await participantsRes.json());
      }
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setLoading(false);
    }
  }

  async function improveMessage() {
    if (!personalMessage.trim()) return;
    setImproving(true);
    setImproveError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/invites/message/improve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: personalMessage }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || typeof data?.text !== "string") {
        setImproveError(data?.detail ?? data?.error ?? "Text konnte nicht verbessert werden.");
        return;
      }
      setPersonalMessage(data.text);
    } catch {
      setImproveError("Server nicht erreichbar.");
    } finally {
      setImproving(false);
    }
  }

  // Nutzer beschreibt kurz, worum es geht → Claude macht daraus einen
  // professionellen Einladungstext + Überschrift + Fall-Titel-Vorschlag.
  // Alle Felder bleiben danach frei editierbar.
  async function generateInvitation() {
    if (!personalMessage.trim()) return;
    setGenerating(true);
    setImproveError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/invites/message/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: personalMessage }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || typeof data?.message !== "string") {
        setImproveError(data?.detail ?? data?.error ?? "Einladungstext konnte nicht erstellt werden.");
        return;
      }
      setPersonalMessage(data.message);
      if (typeof data.subject === "string" && data.subject.trim()) setInvitationSubject(data.subject);
      if (typeof data.title === "string" && data.title.trim()) {
        setTitleSuggestion(data.title);
        setTitleSaved(false);
      }
    } catch {
      setImproveError("Server nicht erreichbar.");
    } finally {
      setGenerating(false);
    }
  }

  // Übernimmt den (ggf. editierten) Fall-Titel-Vorschlag als Titel der Mediation.
  async function saveTitleSuggestion() {
    if (!titleSuggestion.trim()) return;
    setTitleSaving(true);
    try {
      const res = await fetch(`/api/mediations/${mediationId}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: titleSuggestion.trim() }),
      });
      if (res.ok) {
        setTitleSaved(true);
      } else {
        const data = await res.json().catch(() => null);
        setImproveError(data?.detail ?? data?.error ?? "Titel konnte nicht gespeichert werden.");
      }
    } catch {
      setImproveError("Server nicht erreichbar.");
    } finally {
      setTitleSaving(false);
    }
  }

  async function loadPayStatus() {
    try {
      const res = await fetch(`/api/mediations/${mediationId}/price`, { cache: "no-store" });
      if (res.ok) {
        const data: PayStatus = await res.json();
        setPayStatus(data);
        if (data.is_paid) setIsPaid(true);
      }
    } catch {
      // still ignorieren
    }
  }

  // Bezahl-Status laden, sobald die Gegenseite verbunden ist und noch nicht freigeschaltet wurde
  useEffect(() => {
    if (!hasOtherParty || isPaid) return;
    loadPayStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediationId, hasOtherParty, isPaid]);

  async function applyDiscount() {
    if (!discountInput.trim()) return;
    setDiscountBusy(true);
    setDiscountError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/discount`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: discountInput.trim() }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setDiscountError(data?.detail ?? data?.error ?? "Rabattcode ungültig.");
        return;
      }
      setPayStatus(data);
    } catch {
      setDiscountError("Server nicht erreichbar.");
    } finally {
      setDiscountBusy(false);
    }
  }

  async function removeDiscount() {
    setDiscountError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/discount`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setPayStatus(data);
        setDiscountInput("");
      }
    } catch {
      setDiscountError("Server nicht erreichbar.");
    }
  }

  async function redeemFree() {
    setPaying(true);
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/pay/free`, { method: "POST" });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.detail ?? data?.error ?? "Freischaltung fehlgeschlagen.");
        return;
      }
      setPayStatus(data);
      if (data.is_paid) setIsPaid(true);
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setPaying(false);
    }
  }

  // Zeigt PayPal nur, wenn die aktuelle Partei einen offenen Betrag (> 0 €) hat.
  const showPaypal =
    !!payStatus && payStatus.you.owes && !payStatus.you.paid && payStatus.you.amount_due_eur > 0 && !isPaid;

  // PayPal-Button für den EIGENEN Anteil rendern
  useEffect(() => {
    if (!hasOtherParty || isPaid) return;
    if (!showPaypal) {
      // Kein offener Betrag (bezahlt oder per Rabatt 0 €) -> evtl. Button entfernen.
      if (paypalContainerRef.current) paypalContainerRef.current.innerHTML = "";
      paypalRenderedRef.current = false;
      return;
    }
    if (paypalRenderedRef.current) return;

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) {
      setError("PayPal ist noch nicht konfiguriert (NEXT_PUBLIC_PAYPAL_CLIENT_ID fehlt).");
      return;
    }

    function renderButtons() {
      if (!window.paypal || !paypalContainerRef.current || paypalRenderedRef.current) return;
      paypalRenderedRef.current = true;
      window.paypal
        .Buttons({
          style: { layout: "vertical", color: "gold", label: "paypal" },
          createOrder: async () => {
            setError("");
            const res = await fetch(`/api/mediations/${mediationId}/pay/paypal/create-order`, {
              method: "POST",
            });
            const data = await res.json().catch(() => null);
            if (!res.ok) {
              throw new Error(data?.detail ?? "Order konnte nicht erstellt werden");
            }
            return data.order_id;
          },
          onApprove: async (data: { orderID: string }) => {
            setPaying(true);
            setError("");
            try {
              const res = await fetch(`/api/mediations/${mediationId}/pay/paypal/capture-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order_id: data.orderID }),
              });
              const body = await res.json().catch(() => null);
              if (!res.ok) {
                const raw = body?.detail ?? body?.error;
                setError(`Zahlung fehlgeschlagen: ${raw ?? "Unbekannter Fehler"}`);
                return;
              }
              setPayStatus(body);
              if (body.is_paid) setIsPaid(true);
            } catch {
              setError("Server nicht erreichbar.");
            } finally {
              setPaying(false);
            }
          },
          onError: () => {
            setError("PayPal hat einen Fehler gemeldet. Bitte versuche es erneut.");
          },
        })
        .render(paypalContainerRef.current);
    }

    const existing = document.getElementById("paypal-sdk") as HTMLScriptElement | null;
    if (window.paypal) {
      renderButtons();
    } else if (existing) {
      existing.addEventListener("load", renderButtons);
    } else {
      const script = document.createElement("script");
      script.id = "paypal-sdk";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR`;
      script.addEventListener("load", renderButtons);
      document.body.appendChild(script);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediationId, hasOtherParty, isPaid, showPaypal, payStatus?.you.amount_due_eur]);

  async function startMediation() {
    setAdvancing(true);
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active", phase: "einleitung" }),
      });
      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        const raw = errorBody?.detail ?? errorBody?.error;
        const detail = Array.isArray(raw)
          ? raw.map((e: { msg?: string }) => e.msg ?? JSON.stringify(e)).join(", ")
          : (raw ?? "Unbekannter Fehler");
        setError(`Fehler beim Starten (${res.status}): ${detail}`);
        return;
      }
      router.push(`/dashboard/${hashId(mediationId)}/einleitung`);
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setAdvancing(false);
    }
  }

  async function copyInviteLink() {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="app-shell pt-[73px]">
      <section className="container py-12">
        <div className="app-surface p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="eyebrow mb-3">Mediation vorbereiten</p>
              <h1 className="heading-2 text-neutral-900">Beteiligte</h1>
              <p className="mt-4 max-w-2xl text-neutral-600">
                Damit die Mediation starten kann, müssen alle Beteiligten dem
                Verfahren beitreten.
              </p>
            </div>
            <div className="mt-8 space-y-3">
              {(() => {
                const med = participants.find((p) => p.role === "mediator");
                return med ? (
                  <div className="flex items-center justify-between rounded-2xl border border-accent-200 bg-accent-50 px-5 py-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">
                        Dein Mediator
                      </p>
                      <p className="mt-1 font-semibold text-neutral-900">{med.name}</p>
                      {med.email && <p className="text-sm text-neutral-500">{med.email}</p>}
                    </div>
                    <span className="rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-accent-700">
                      Mediator
                    </span>
                  </div>
                ) : null;
              })()}
              {participants.filter((p) => p.role !== "mediator").map((participant) => (
                <div
                  key={participant.id}
                  className="card-muted flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-neutral-900">{participant.name}</p>
                    <p className="text-sm text-neutral-500">
                      {roleLabel[participant.role] ?? participant.role}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      participant.invitationStatus === "accepted"
                        ? "bg-accent-100 text-accent-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {participant.invitationStatus === "accepted"
                      ? "Verbunden"
                      : "Wartet auf Bestätigung"}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-600">
                ID: {mediationId}
              </div>
              {(userRole === "mediator" || userRole === "admin") && (
                <button
                  type="button"
                  onClick={() => router.push(`/dashboard/${hashId(mediationId)}/workflow`)}
                  className="btn btn-ghost text-sm"
                >
                  ⚙ Workflow-Einstellungen
                </button>
              )}
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {participants.map((person) => (
              <div
                key={person.id}
                className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-neutral-900">{person.name}</p>
                    <p className="mt-1 text-sm text-neutral-500">{roleLabel[person.role]}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      person.invitationStatus === "accepted"
                        ? "bg-accent-100 text-accent-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {person.invitationStatus === "accepted" ? "Verbunden" : "Wartet auf Bestätigung"}
                  </span>
                </div>
              </div>
            ))}

            {!hasOtherParty && (
              <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-5">
                <p className="font-semibold text-neutral-900">Andere Seite</p>
                <p className="mt-1 text-sm text-neutral-500">Noch nicht verbunden</p>
              </div>
            )}
          </div>

          {/* Bereit zum Starten: erst bezahlen, dann starten */}
          {hasOtherParty && !isPaid && (
            <div className="mt-10 rounded-3xl border-2 border-accent-400 bg-white p-8 shadow-lg shadow-accent-100/60">
              <div className="text-center">
                <p className="text-sm font-semibold text-accent-800 mb-1">Alle Beteiligten sind verbunden</p>
                <h2 className="text-xl font-bold text-neutral-900">Mediation freischalten</h2>
                <p className="mt-2 max-w-xl mx-auto text-sm text-neutral-600">
                  Jede Partei bezahlt ihren eigenen Anteil. Die Mediation startet,
                  sobald alle zahlungspflichtigen Parteien bezahlt haben.
                </p>

                {!payStatus && (
                  <p className="mt-6 text-sm text-neutral-400">Preis wird geladen…</p>
                )}

                {payStatus && payStatus.you.paid && (
                  <div className="mt-6 rounded-2xl border border-accent-200 bg-accent-50 p-5">
                    <p className="text-lg font-bold text-accent-700">Dein Anteil ist bezahlt ✓</p>
                    <p className="mt-1 text-sm text-neutral-600">
                      {payStatus.all_owing_paid
                        ? "Alle Parteien haben bezahlt – die Mediation kann starten."
                        : "Warten auf die Zahlung der anderen Seite …"}
                    </p>
                  </div>
                )}

                {payStatus && !payStatus.you.paid && !payStatus.you.owes && (
                  <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                    <p className="text-base font-semibold text-neutral-800">Für dich fällt kein Betrag an.</p>
                    <p className="mt-1 text-sm text-neutral-600">
                      Bei diesem Fall zahlt die andere Seite. Sobald das erledigt ist, geht es weiter.
                    </p>
                  </div>
                )}

                {payStatus && !payStatus.you.paid && payStatus.you.owes && (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-widest text-accent-600 mt-6 mb-2">
                      Dein Anteil
                    </p>
                    <div className="flex items-baseline justify-center gap-1">
                      {payStatus.you.discount_amount_eur > 0 && (
                        <span className="mr-2 text-2xl font-semibold text-neutral-400 line-through">
                          {payStatus.you.base_due_eur.toFixed(2)}
                        </span>
                      )}
                      <span className="text-5xl font-extrabold text-neutral-900 tracking-tight">
                        {payStatus.you.amount_due_eur.toFixed(2)}
                      </span>
                      <span className="text-2xl font-bold text-neutral-900">€</span>
                    </div>
                    <p className="text-neutral-400 text-sm mt-1">inkl. MwSt.</p>
                    {payStatus.you.discount_amount_eur > 0 && (
                      <p className="mt-1 text-sm font-semibold text-accent-700">
                        Rabatt „{payStatus.you.discount_code}“: −{payStatus.you.discount_amount_eur.toFixed(2)} €
                      </p>
                    )}

                    {/* Rabattcode */}
                    <div className="mt-5 w-full max-w-sm mx-auto text-left">
                      {payStatus.you.discount_code ? (
                        <button
                          type="button"
                          onClick={removeDiscount}
                          className="text-xs font-semibold text-neutral-500 underline"
                        >
                          Rabattcode entfernen
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={discountInput}
                            onChange={(e) => setDiscountInput(e.target.value)}
                            placeholder="Rabattcode"
                            className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-accent-500 focus:ring-4 focus:ring-accent-100"
                          />
                          <button
                            type="button"
                            onClick={applyDiscount}
                            disabled={discountBusy || !discountInput.trim()}
                            className="btn btn-secondary shrink-0 px-4 py-2 text-sm disabled:opacity-60"
                          >
                            {discountBusy ? "…" : "Anwenden"}
                          </button>
                        </div>
                      )}
                      {discountError && (
                        <p className="mt-2 text-xs font-semibold text-red-600">{discountError}</p>
                      )}
                    </div>

                    <p className="mt-4 max-w-sm mx-auto text-xs text-neutral-500">
                      Der Betrag wird zunächst nur reserviert und erst nach erfolgreicher
                      Freischaltung tatsächlich abgebucht.
                    </p>

                    <div className="mt-6 w-full max-w-sm mx-auto">
                      {payStatus.you.amount_due_eur > 0 ? (
                        <div ref={paypalContainerRef} />
                      ) : (
                        <button
                          type="button"
                          onClick={redeemFree}
                          disabled={paying}
                          className="btn btn-primary w-full disabled:opacity-60"
                        >
                          {paying ? "Wird freigeschaltet…" : "Kostenlos freischalten"}
                        </button>
                      )}
                      {paying && payStatus.you.amount_due_eur > 0 && (
                        <p className="mt-2 text-sm font-semibold text-neutral-500">Zahlung wird verarbeitet…</p>
                      )}
                    </div>
                  </>
                )}

                {/* Status aller Parteien */}
                {payStatus && payStatus.participants.length > 0 && (
                  <div className="mt-8 w-full max-w-sm mx-auto text-left">
                    <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">
                      Status
                    </p>
                    <ul className="space-y-1">
                      {payStatus.participants.map((p) => (
                        <li key={p.participant_id} className="flex items-center justify-between text-sm">
                          <span className="text-neutral-700">
                            {p.name ?? p.role}
                            {p.is_you && <span className="text-neutral-400"> (du)</span>}
                          </span>
                          <span className="font-semibold">
                            {!p.owes ? (
                              <span className="text-neutral-400">kein Betrag</span>
                            ) : p.paid ? (
                              <span className="text-accent-700">bezahlt ✓</span>
                            ) : (
                              <span className="text-neutral-500">offen · {p.amount_due_eur.toFixed(2)} €</span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-700">{error}</p>
                </div>
              )}
            </div>
          )}

          {hasOtherParty && isPaid && (
            <div className="mt-10 rounded-3xl border border-accent-200 bg-accent-50 p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-accent-800">Zahlung erhalten</p>
                  <h2 className="mt-2 text-xl font-bold text-neutral-900">Mediation starten</h2>
                  <p className="mt-2 max-w-xl text-sm text-neutral-600">
                    Alle Parteien haben dem Verfahren beigetreten. Du kannst die Mediation jetzt starten.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={startMediation}
                  disabled={advancing}
                  className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {advancing ? "Wird gestartet..." : "Weiter →"}
                </button>
              </div>
              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-700">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Einladung erstellen */}
          {!hasOtherParty && (
            <div className="mt-10 rounded-3xl border border-accent-200 bg-accent-50 p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-accent-800">Nächster Schritt</p>
                  <h2 className="mt-2 text-xl font-bold text-neutral-900">Andere Seite einladen</h2>
                  <p className="mt-2 max-w-xl text-sm text-neutral-600">
                    Erstelle einen sicheren Einladungslink. Die andere Seite kann damit dem Verfahren beitreten.
                  </p>
                </div>

                {!inviteUrl && (
                  <div className="w-full max-w-md">
                    <label htmlFor="invite-email" className="text-sm font-semibold text-neutral-900">
                      E-Mail-Adresse
                    </label>
                    <input
                      id="invite-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-accent-500 focus:ring-4 focus:ring-accent-100"
                    />

                    {videoMode !== "off" && (
                      <div className="mt-4">
                        {meetRecordingAvailable ? (
                          <InviteMeetRecorder
                            mediationId={mediationId}
                            onChange={setMeetToken}
                            onTranscript={setPersonalMessage}
                            required={videoMode === "required"}
                          />
                        ) : (
                          <InviteVideoRecorder
                            mediationId={mediationId}
                            videoToken={videoToken}
                            onChange={setVideoToken}
                            onTranscript={setPersonalMessage}
                            required={videoMode === "required"}
                          />
                        )}
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <label htmlFor="invite-message" className="block text-sm font-semibold text-neutral-900">
                        Persönliche Nachricht
                      </label>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={generateInvitation}
                          disabled={generating || !personalMessage.trim()}
                          className="btn btn-primary px-3 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {generating ? "Formuliere…" : "✨ Professionell formulieren"}
                        </button>
                        <button
                          type="button"
                          onClick={improveMessage}
                          disabled={improving || !personalMessage.trim()}
                          className="btn btn-ghost px-3 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {improving ? "…" : "Verbessern"}
                        </button>
                      </div>
                    </div>
                    <textarea
                      id="invite-message"
                      value={personalMessage}
                      onChange={(e) => setPersonalMessage(e.target.value)}
                      placeholder="Beschreibe kurz, worum es geht (Stichworte reichen) – oder nimm oben eine Video-Botschaft auf. Mit „Professionell formulieren“ macht die KI daraus eine freundliche Einladung, die du danach frei bearbeiten kannst."
                      className="mt-2 min-h-24 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-accent-500 focus:ring-4 focus:ring-accent-100"
                    />
                    <p className="mt-1 text-xs text-neutral-400">
                      Die Video-Botschaft ist optional. Kurz beschreiben → „Professionell formulieren“ →
                      Text prüfen und anpassen. Vor dem Versand wird er zusätzlich freundlich umformuliert.
                    </p>

                    <div className="mt-4">
                      <label htmlFor="invite-subject" className="block text-sm font-semibold text-neutral-900">
                        Überschrift der Einladung <span className="font-normal text-neutral-400">(optional)</span>
                      </label>
                      <input
                        id="invite-subject"
                        value={invitationSubject}
                        onChange={(e) => setInvitationSubject(e.target.value)}
                        placeholder="z.B. Einladung zu einem klärenden Gespräch"
                        className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-accent-500 focus:ring-4 focus:ring-accent-100"
                      />
                    </div>

                    {titleSuggestion && (
                      <div className="mt-4 rounded-xl border border-accent-200 bg-white p-3">
                        <label htmlFor="invite-title" className="block text-xs font-semibold text-neutral-900">
                          Vorgeschlagener Fall-Titel
                        </label>
                        <div className="mt-2 flex items-center gap-2">
                          <input
                            id="invite-title"
                            value={titleSuggestion}
                            onChange={(e) => {
                              setTitleSuggestion(e.target.value);
                              setTitleSaved(false);
                            }}
                            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-100"
                          />
                          <button
                            type="button"
                            onClick={saveTitleSuggestion}
                            disabled={titleSaving || !titleSuggestion.trim() || titleSaved}
                            className="btn btn-secondary shrink-0 px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {titleSaved ? "✓ Übernommen" : titleSaving ? "…" : "Als Fall-Titel übernehmen"}
                          </button>
                        </div>
                      </div>
                    )}

                    {improveError && (
                      <p className="mt-2 text-xs font-semibold text-red-600">{improveError}</p>
                    )}

                    <button
                      type="button"
                      onClick={createInvite}
                      disabled={loading || !email.trim() || (videoMode === "required" && !(meetRecordingAvailable ? meetToken : videoToken))}
                      className="btn btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? "Wird erstellt..." : "Einladung erstellen"}
                    </button>
                    {videoMode === "required" && !(meetRecordingAvailable ? meetToken : videoToken) && (
                      <p className="mt-2 text-center text-xs text-neutral-400">
                        Eine persönliche Botschaft ist für diese Einladung erforderlich.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-700">{error}</p>
                </div>
              )}

              {inviteUrl && (
                <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">Einladung ist bereit</p>
                      <p className="mt-1 text-sm text-neutral-500">Kopiere den Link und sende ihn an die andere Seite.</p>
                    </div>
                    <span className="rounded-full bg-accent-100 px-3 py-1 text-xs font-semibold text-accent-700">Aktiv</span>
                  </div>
                  <div className="mt-5 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                    <p className="break-all font-mono text-sm text-neutral-700">{inviteUrl}</p>
                  </div>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button type="button" onClick={copyInviteLink} className="btn btn-primary">
                      {copied ? "Kopiert ✓" : "Link kopieren"}
                    </button>
                    <button type="button" onClick={() => window.open(inviteUrl, "_blank")} className="btn btn-secondary">
                      Link öffnen
                    </button>
                    <button type="button" onClick={createInvite} disabled={loading} className="btn btn-ghost disabled:cursor-not-allowed disabled:opacity-60">
                      Neu erstellen
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
