"use client";

import { hashId } from "@/lib/ids";
import { useEffect, useRef, useState, type ReactNode } from "react";
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
  billing_address_complete?: boolean;
};

type AddonOffer = {
  key: string;
  label: string;
  description: string;
  price_eur: number;
};

type PayStatus = {
  mediation_type: string;
  package: string;
  billing_model: string;
  case_base_price_eur: number;
  is_paid: boolean;
  all_owing_paid: boolean;
  // Buchbare Add-ons des Einstiegs-Tarifs (leer bei Premium-Typen).
  addons_available?: AddonOffer[];
  you: {
    owes: boolean;
    base_due_eur: number;
    discount_code: string | null;
    discount_amount_eur: number;
    addons?: { key: string; price_eur: number }[];
    addons_total_eur?: number;
    amount_due_eur: number;
    paid: boolean;
    billing_address_complete?: boolean;
  };
  participants: PartyStatus[];
};

type Props = {
  mediationId: string;
  userRole: string;
  currentUserName?: string;
  initialIsPaid?: boolean;
  // Firmenfall (Abo-Modell): organizations.id, NULL/undefined = privater B2C-Fall.
  initialOrganizationId?: number | null;
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

// ── Onboarding-Schritte ──────────────────────────────────────────────────────
// Die erste Seite eines Falls ist ein geführtes Onboarding: erst wenn ein
// Schritt erledigt ist, wird der nächste relevant. Reihenfolge:
// 1. Beteiligte verbinden → 2. Rechnungsdaten → 3. Freischalten → 4. Start.

type StepState = "done" | "active" | "locked";

function StepCard({
  index,
  title,
  state,
  badge,
  children,
}: {
  index: number;
  title: string;
  state: StepState;
  badge?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={`rounded-3xl border bg-white transition ${
        state === "active"
          ? "border-accent-300 shadow-lg shadow-accent-100/60"
          : state === "done"
            ? "border-accent-200"
            : "border-neutral-200 opacity-60"
      }`}
    >
      <div className="flex items-center gap-4 p-6">
        <span
          className={`flex h-10 w-10 flex-none items-center justify-center rounded-full border text-sm font-black ${
            state === "done"
              ? "border-accent-500 bg-accent-500 text-white"
              : state === "active"
                ? "border-accent-300 bg-accent-50 text-accent-700"
                : "border-neutral-200 bg-neutral-50 text-neutral-400"
          }`}
        >
          {state === "done" ? "✓" : index}
        </span>
        <div className="flex flex-1 items-center justify-between gap-3">
          <h2
            className={`text-lg font-bold ${
              state === "locked" ? "text-neutral-400" : "text-neutral-900"
            }`}
          >
            {title}
          </h2>
          {badge && (
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                state === "done"
                  ? "bg-accent-100 text-accent-700"
                  : state === "active"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-neutral-100 text-neutral-500"
              }`}
            >
              {badge}
            </span>
          )}
        </div>
      </div>
      {state !== "locked" && children && (
        <div className="border-t border-neutral-100 p-6 pt-5">{children}</div>
      )}
    </div>
  );
}

export default function MediationClient({ mediationId, userRole, currentUserName, initialIsPaid = false, initialOrganizationId = null }: Props) {
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
  const [myRole, setMyRole] = useState("");
  const [isPaid, setIsPaid] = useState(initialIsPaid);
  const [paying, setPaying] = useState(false);
  const [payStatus, setPayStatus] = useState<PayStatus | null>(null);
  const [addonBusy, setAddonBusy] = useState(false);
  const [discountInput, setDiscountInput] = useState("");
  const [discountBusy, setDiscountBusy] = useState(false);
  const [discountError, setDiscountError] = useState("");
  // Rechnungsdaten (pro Fall, für den eingeloggten Teilnehmer). Pflicht für
  // jede zahlende Partei, bevor sie ihren Anteil bezahlt – beim Start wird
  // daraus automatisch die Rechnung erstellt.
  const [billingStreet, setBillingStreet] = useState("");
  const [billingPostalCode, setBillingPostalCode] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingSaved, setBillingSaved] = useState(false);
  const [billingEditing, setBillingEditing] = useState(false);
  const [billingBusy, setBillingBusy] = useState(false);
  const [billingError, setBillingError] = useState("");
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const paypalRenderedRef = useRef(false);

  useEffect(() => {
    async function loadParticipants() {
      try {
        const res = await fetch(`/api/mediations/${mediationId}/participants`);
        if (res.ok) {
          const data: Participant[] = await res.json();
          setParticipants(data);

          if (currentUserName) {
            const me = data.find((p) => p.name === currentUserName);
            if (me) setMyRole(me.role);
            // Eingeladene Partei VOR der Zahlung: erst die Aufklärung
            // (Situation, was Mediation ist, Ablauf, Video) durchlaufen —
            // sonst ist ihr erster Eindruck die Rechnung. Bestätigung wird
            // als block_response (einladung/gegenseite_aufklaerung) geprüft.
            if (me?.role === "other_party" && !initialIsPaid) {
              try {
                const r = await fetch(
                  `/api/mediations/${mediationId}/block-responses?phase=einladung&step_key=gegenseite_aufklaerung`,
                  { cache: "no-store" },
                );
                if (r.ok) {
                  const rows: { block_id: string; value: unknown }[] = await r.json();
                  const v = Array.isArray(rows)
                    ? rows.find((x) => x.block_id === "ga_verstanden")?.value
                    : undefined;
                  const confirmed =
                    typeof v === "object" && v !== null
                      ? (v as { agreed?: boolean }).agreed === true
                      : v === true;
                  if (!confirmed) {
                    router.replace(`/dashboard/${hashId(mediationId)}/intro`);
                    return;
                  }
                }
              } catch {
                // Aufklärung nicht prüfbar → Checkliste normal anzeigen
              }
            }
            // Andere Partei erst NACH der Freischaltung direkt zur emotionalen
            // Einleitung weiterleiten – vorher braucht sie diese Seite, um ihre
            // Rechnungsdaten zu hinterlegen und den eigenen Anteil zu bezahlen.
            if (me?.role === "other_party" && initialIsPaid) {
              // Abo-Fälle (Firmen-Abo): Beteiligte durchlaufen zuerst den
              // schlanken Business-Start (Grundkonfiguration + Rahmen +
              // Kurz-Intake) statt direkt in die Einleitung zu springen.
              router.replace(
                initialOrganizationId != null
                  ? `/dashboard/${hashId(mediationId)}/start`
                  : `/dashboard/${hashId(mediationId)}/einleitung`,
              );
              return;
            }
          }
        }
      } catch {
        // Fehler beim Laden still ignorieren
      }
    }
    loadParticipants();
  }, [mediationId, currentUserName, router, initialIsPaid, initialOrganizationId]);

  // Rechnungsdaten des eingeloggten Teilnehmers laden.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/mediations/${mediationId}/billing-address`, { cache: "no-store" });
        if (res.ok && !cancelled) {
          const data = await res.json().catch(() => null);
          const street = data?.billing_street ?? "";
          const postal = data?.billing_postal_code ?? "";
          const city = data?.billing_city ?? "";
          setBillingStreet(street);
          setBillingPostalCode(postal);
          setBillingCity(city);
          setBillingSaved(Boolean(street && postal && city));
        }
      } catch {
        // still ignorieren
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mediationId]);

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

  async function saveBillingAddress() {
    const street = billingStreet.trim();
    const postal = billingPostalCode.trim();
    const city = billingCity.trim();
    if (!street || !postal || !city) {
      setBillingError("Bitte fülle Straße, PLZ und Ort aus.");
      return;
    }
    setBillingBusy(true);
    setBillingError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/billing-address`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billing_street: street,
          billing_postal_code: postal,
          billing_city: city,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setBillingError(data?.detail ?? data?.error ?? "Rechnungsdaten konnten nicht gespeichert werden.");
        return;
      }
      setBillingSaved(true);
      setBillingEditing(false);
      // Bezahl-Status neu laden, damit billing_address_complete aktuell ist.
      if (hasOtherParty && !isPaid) loadPayStatus();
    } catch {
      setBillingError("Server nicht erreichbar.");
    } finally {
      setBillingBusy(false);
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

  // Add-on an-/abwählen (Einstiegs-Tarif): ersetzt die Auswahl serverseitig
  // komplett und aktualisiert den Bezahl-Status (Betrag inkl. Add-ons).
  async function toggleAddon(key: string) {
    if (!payStatus || payStatus.you.paid || addonBusy) return;
    const current = (payStatus.you.addons ?? []).map((a) => a.key);
    const next = current.includes(key)
      ? current.filter((k) => k !== key)
      : [...current, key];
    setAddonBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/addons`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys: next }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.detail ?? data?.error ?? "Add-ons konnten nicht gespeichert werden.");
        return;
      }
      setPayStatus(data);
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setAddonBusy(false);
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

  // Rechnungsdaten sind Voraussetzung für die eigene Zahlung (Rechnung pro
  // Partei beim Start) – ohne Adresse bleibt der Bezahl-Schritt gesperrt.
  const needsBillingBeforePay = !!payStatus && payStatus.you.owes && !billingSaved;

  // Zeigt PayPal nur, wenn die aktuelle Partei einen offenen Betrag (> 0 €)
  // hat UND ihre Rechnungsdaten hinterlegt sind.
  const showPaypal =
    !!payStatus &&
    payStatus.you.owes &&
    !payStatus.you.paid &&
    payStatus.you.amount_due_eur > 0 &&
    !isPaid &&
    billingSaved;

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

  // ── Schritt-Status fürs Onboarding ─────────────────────────────────────────
  const isMediatorHere = myRole === "mediator" || userRole === "mediator" || userRole === "admin";
  const step1Done = hasOtherParty;
  // Rechnungsdaten: erledigt, wenn gespeichert – oder gar nicht nötig
  // (Mediator bzw. Partei ohne eigenen Anteil).
  const billingNotNeeded = isMediatorHere || (!!payStatus && !payStatus.you.owes);
  const step2Done = billingSaved || billingNotNeeded;
  const step3Done = isPaid;
  const step1State: StepState = step1Done ? "done" : "active";
  const step2State: StepState = step2Done ? "done" : step1Done ? "active" : "locked";
  const step3State: StepState = step3Done ? "done" : step1Done && step2Done ? "active" : "locked";
  const step4State: StepState = step3Done ? "active" : "locked";

  const mediator = participants.find((p) => p.role === "mediator");
  const parties = participants.filter((p) => p.role !== "mediator");

  const inputClass =
    "w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-accent-500 focus:ring-4 focus:ring-accent-100";

  return (
    <main className="app-shell pt-[73px]">
      <section className="container py-12">
        {/* Kopf: Worum geht es hier + Mediator + Verfahrens-ID */}
        <div className="app-surface p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="eyebrow mb-3">Mediation vorbereiten</p>
              <h1 className="heading-2 text-neutral-900">Dein Start in die Mediation</h1>
              <p className="mt-4 max-w-2xl text-neutral-600">
                Vier Schritte bis zum Start: Beteiligte verbinden, Rechnungsdaten
                hinterlegen, Verfahren freischalten – dann kann die Mediation beginnen.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 lg:items-end">
              <div className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-600">
                Verfahrens-ID: {mediationId}
              </div>
              {/* Journal-Ausbau: das Logbuch läuft neben der Mediation weiter –
                  private Dokumentation + Journal, einzelne Einträge teilbar. */}
              <button
                type="button"
                onClick={() => router.push(`/dashboard/logbuch/${hashId(mediationId)}`)}
                className="btn btn-ghost text-sm"
              >
                📓 Logbuch &amp; Journal
              </button>
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

          {mediator && (
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-accent-200 bg-accent-50 px-5 py-4 sm:max-w-md">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">
                  Dein Mediator
                </p>
                <p className="mt-1 font-semibold text-neutral-900">{mediator.name}</p>
                {mediator.email && <p className="text-sm text-neutral-500">{mediator.email}</p>}
              </div>
              <span className="rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-accent-700">
                Mediator
              </span>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-5">
          {/* Schritt 1: Beteiligte verbinden */}
          <StepCard
            index={1}
            title="Beteiligte verbinden"
            state={step1State}
            badge={step1Done ? "Alle verbunden" : "Einladung offen"}
          >
            <div className="space-y-3">
              {parties.map((participant) => (
                <div key={participant.id} className="card-muted flex items-center justify-between">
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
              {!hasOtherParty && (
                <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-5 py-4">
                  <p className="font-semibold text-neutral-900">Andere Seite</p>
                  <p className="mt-1 text-sm text-neutral-500">Noch nicht verbunden</p>
                </div>
              )}
            </div>

            {/* Einladung erstellen (nur solange die andere Seite fehlt) */}
            {!hasOtherParty && myRole !== "other_party" && (
              <div className="mt-6 rounded-2xl border border-accent-200 bg-accent-50 p-5">
                <p className="text-sm font-semibold text-accent-800">Nächster Schritt</p>
                <p className="mt-1 text-sm text-neutral-600">
                  Erstelle einen sicheren Einladungslink. Die andere Seite kann damit dem
                  Verfahren beitreten.
                </p>

                {!inviteUrl && (
                  <div className="mt-4 w-full max-w-xl">
                    <label htmlFor="invite-email" className="text-sm font-semibold text-neutral-900">
                      E-Mail-Adresse
                    </label>
                    <input
                      id="invite-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className={`mt-2 ${inputClass}`}
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
                      className={`mt-2 min-h-24 ${inputClass}`}
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
                        className={`mt-2 ${inputClass}`}
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

                {inviteUrl && (
                  <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
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
          </StepCard>

          {/* Schritt 2: Rechnungsdaten */}
          <StepCard
            index={2}
            title="Rechnungsdaten hinterlegen"
            state={step2State}
            badge={step2Done ? (billingSaved ? "Gespeichert" : "Nicht erforderlich") : "Offen"}
          >
            {billingNotNeeded && !billingSaved ? (
              <p className="text-sm text-neutral-600">
                Für dich fällt kein Betrag an – Rechnungsdaten sind nicht erforderlich.
              </p>
            ) : billingSaved && !billingEditing ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Deine Rechnung geht an:</p>
                  <p className="mt-1 font-semibold text-neutral-900">
                    {billingStreet}, {billingPostalCode} {billingCity}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setBillingEditing(true)}
                  className="btn btn-ghost text-sm"
                >
                  Ändern
                </button>
              </div>
            ) : (
              <div className="max-w-xl">
                <p className="text-sm text-neutral-600">
                  Beim Start der Mediation wird für jede zahlende Partei automatisch eine
                  Rechnung über den eigenen Anteil erstellt. Dafür brauchen wir deine
                  Rechnungsadresse.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-[2fr_1fr_2fr]">
                  <div className="sm:col-span-3">
                    <label htmlFor="billing-street" className="text-sm font-semibold text-neutral-900">
                      Straße und Hausnummer
                    </label>
                    <input
                      id="billing-street"
                      value={billingStreet}
                      onChange={(e) => setBillingStreet(e.target.value)}
                      placeholder="Musterstraße 12"
                      className={`mt-2 ${inputClass}`}
                    />
                  </div>
                  <div>
                    <label htmlFor="billing-postal" className="text-sm font-semibold text-neutral-900">
                      PLZ
                    </label>
                    <input
                      id="billing-postal"
                      value={billingPostalCode}
                      onChange={(e) => setBillingPostalCode(e.target.value)}
                      placeholder="10115"
                      className={`mt-2 ${inputClass}`}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="billing-city" className="text-sm font-semibold text-neutral-900">
                      Ort
                    </label>
                    <input
                      id="billing-city"
                      value={billingCity}
                      onChange={(e) => setBillingCity(e.target.value)}
                      placeholder="Berlin"
                      className={`mt-2 ${inputClass}`}
                    />
                  </div>
                </div>
                {billingError && (
                  <p className="mt-3 text-xs font-semibold text-red-600">{billingError}</p>
                )}
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={saveBillingAddress}
                    disabled={billingBusy || !billingStreet.trim() || !billingPostalCode.trim() || !billingCity.trim()}
                    className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {billingBusy ? "Wird gespeichert…" : "Rechnungsdaten speichern"}
                  </button>
                  {billingEditing && (
                    <button type="button" onClick={() => setBillingEditing(false)} className="btn btn-ghost text-sm">
                      Abbrechen
                    </button>
                  )}
                </div>
                <p className="mt-3 text-xs text-neutral-400">
                  Die Rechnung steht nach dem Start als PDF in deinem Fall bereit und wird
                  nicht automatisch per E-Mail verschickt.
                </p>
              </div>
            )}
          </StepCard>

          {/* Schritt 3: Freischalten (Zahlung pro Partei) */}
          <StepCard
            index={3}
            title="Mediation freischalten"
            state={step3State}
            badge={step3Done ? "Freigeschaltet" : payStatus?.you.paid ? "Dein Anteil bezahlt" : "Offen"}
          >
            <div className="text-center">
              <p className="mx-auto max-w-xl text-sm text-neutral-600">
                Jede Partei bezahlt ihren eigenen Anteil. Die Mediation startet, sobald
                alle zahlungspflichtigen Parteien bezahlt haben.
              </p>

              {!payStatus && (
                <p className="mt-6 text-sm text-neutral-400">Preis wird geladen…</p>
              )}

              {payStatus && payStatus.you.paid && !isPaid && (
                <div className="mt-6 rounded-2xl border border-accent-200 bg-accent-50 p-5">
                  <p className="text-lg font-bold text-accent-700">Dein Anteil ist bezahlt ✓</p>
                  <p className="mt-1 text-sm text-neutral-600">
                    {payStatus.all_owing_paid
                      ? "Alle Parteien haben bezahlt – die Mediation kann starten."
                      : "Warten auf die Zahlung der anderen Seite …"}
                  </p>
                </div>
              )}

              {isPaid && (
                <div className="mt-6 rounded-2xl border border-accent-200 bg-accent-50 p-5">
                  <p className="text-lg font-bold text-accent-700">Zahlung erhalten ✓</p>
                  <p className="mt-1 text-sm text-neutral-600">
                    Alle Parteien haben bezahlt – weiter zu Schritt 4.
                  </p>
                </div>
              )}

              {payStatus && !payStatus.you.paid && !payStatus.you.owes && !isPaid && (
                <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                  <p className="text-base font-semibold text-neutral-800">Für dich fällt kein Betrag an.</p>
                  <p className="mt-1 text-sm text-neutral-600">
                    Bei diesem Fall zahlt die andere Seite. Sobald das erledigt ist, geht es weiter.
                  </p>
                </div>
              )}

              {needsBillingBeforePay && !payStatus?.you.paid && !isPaid && (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <p className="text-sm font-semibold text-amber-800">
                    Bitte hinterlege zuerst deine Rechnungsdaten (Schritt 2), dann kannst du
                    hier bezahlen.
                  </p>
                </div>
              )}

              {payStatus && !payStatus.you.paid && payStatus.you.owes && !isPaid && !needsBillingBeforePay && (
                <>
                  <p className="mt-6 mb-2 text-xs font-semibold uppercase tracking-widest text-accent-600">
                    Dein Anteil
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    {payStatus.you.discount_amount_eur > 0 && (
                      <span className="mr-2 text-2xl font-semibold text-neutral-400 line-through">
                        {payStatus.you.base_due_eur.toFixed(2)}
                      </span>
                    )}
                    <span className="text-5xl font-extrabold tracking-tight text-neutral-900">
                      {payStatus.you.amount_due_eur.toFixed(2)}
                    </span>
                    <span className="text-2xl font-bold text-neutral-900">€</span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-400">inkl. MwSt.</p>
                  {payStatus.you.discount_amount_eur > 0 && (
                    <p className="mt-1 text-sm font-semibold text-accent-700">
                      Rabatt „{payStatus.you.discount_code}“: −{payStatus.you.discount_amount_eur.toFixed(2)} €
                    </p>
                  )}

                  {/* Rabattcode */}
                  <div className="mx-auto mt-5 w-full max-w-sm text-left">
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

                  {/* Add-ons (Einstiegs-Tarif: 49 € Basis + buchbare Zusatzleistungen) */}
                  {(payStatus.addons_available?.length ?? 0) > 0 && (
                    <div className="mx-auto mt-5 w-full max-w-sm text-left">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                        Optionale Zusatzleistungen
                      </p>
                      <div className="space-y-2">
                        {payStatus.addons_available!.map((addon) => {
                          const selected = (payStatus.you.addons ?? []).some((a) => a.key === addon.key);
                          return (
                            <label
                              key={addon.key}
                              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                                selected
                                  ? "border-accent-500 bg-accent-50"
                                  : "border-neutral-200 bg-white hover:border-neutral-300"
                              } ${addonBusy ? "opacity-60" : ""}`}
                            >
                              <input
                                type="checkbox"
                                checked={selected}
                                disabled={addonBusy}
                                onChange={() => toggleAddon(addon.key)}
                                className="mt-1 h-4 w-4 accent-accent-600"
                              />
                              <span className="flex-1">
                                <span className="flex items-baseline justify-between gap-2">
                                  <span className="text-sm font-semibold text-neutral-900">{addon.label}</span>
                                  <span className="shrink-0 text-sm font-bold text-neutral-900">
                                    +{addon.price_eur.toFixed(0)} €
                                  </span>
                                </span>
                                <span className="mt-0.5 block text-xs text-neutral-500">{addon.description}</span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                      {(payStatus.you.addons_total_eur ?? 0) > 0 && (
                        <p className="mt-2 text-xs font-semibold text-neutral-600">
                          Zusatzleistungen: +{(payStatus.you.addons_total_eur ?? 0).toFixed(2)} €
                        </p>
                      )}
                    </div>
                  )}

                  <p className="mx-auto mt-4 max-w-sm text-xs text-neutral-500">
                    Der Betrag wird zunächst nur reserviert und erst nach erfolgreicher
                    Freischaltung tatsächlich abgebucht.
                  </p>

                  <div className="mx-auto mt-6 w-full max-w-sm">
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
              {payStatus && payStatus.participants.length > 0 && !isPaid && (
                <div className="mx-auto mt-8 w-full max-w-sm text-left">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">
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
          </StepCard>

          {/* Schritt 4: Mediation starten */}
          <StepCard
            index={4}
            title="Mediation starten"
            state={step4State}
            badge={step4State === "active" ? "Bereit" : undefined}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="max-w-xl text-sm text-neutral-600">
                Alle Beteiligten sind verbunden und die Zahlung ist erledigt. Mit dem Start
                werden die Rechnungen erstellt und ihr beginnt mit der ersten Phase.
              </p>
              <button
                type="button"
                onClick={startMediation}
                disabled={advancing}
                className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {advancing ? "Wird gestartet..." : "Mediation starten →"}
              </button>
            </div>
          </StepCard>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          )}

          {/* Gut zu wissen: die relevanten Infos zum Start kompakt an einer Stelle */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Gut zu wissen
            </p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="font-semibold text-neutral-900">So läuft die Mediation ab</p>
                <p className="mt-1 text-sm text-neutral-600">
                  Ihr durchlauft gemeinsam fünf Phasen: Einleitung, Themensammlung,
                  Interessen, Optionen und Abschlussvereinbarung. Euer Mediator begleitet
                  jeden Schritt.
                </p>
              </div>
              <div>
                <p className="font-semibold text-neutral-900">Jede Partei zahlt ihren Anteil</p>
                <p className="mt-1 text-sm text-neutral-600">
                  Die Kosten werden fair geteilt. Der Betrag wird erst abgebucht, wenn das
                  Verfahren tatsächlich freigeschaltet ist.
                </p>
              </div>
              <div>
                <p className="font-semibold text-neutral-900">Deine Rechnung</p>
                <p className="mt-1 text-sm text-neutral-600">
                  Beim Start wird automatisch eine Rechnung über deinen Anteil erstellt –
                  mit den Rechnungsdaten aus Schritt 2. Sie steht als PDF bereit.
                </p>
              </div>
              <div>
                <p className="font-semibold text-neutral-900">Vertraulich</p>
                <p className="mt-1 text-sm text-neutral-600">
                  Alle Inhalte des Verfahrens sind nur für die Beteiligten und den Mediator
                  sichtbar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
