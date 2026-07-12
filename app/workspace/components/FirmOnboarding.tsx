"use client";

// ── Firmen-Onboarding ───────────────────────────────────────────────────────
// Wizard (Vollbild, 6 Schritte inkl. Vertrag & Zahlung) + Dashboard-Checkliste.
// Reine UI über bestehende Endpunkte (api.ts).

import { useCallback, useEffect, useRef, useState } from "react";
import type { WorkspaceSection, Organization, SystemUser, MediationVariantDto } from "../types";
import {
  fetchOrganizations,
  updateOrganization,
  fetchAllUsers,
  createOrgMember,
  createMediationCase,
  fetchVariants,
  setMediationVariant,
  fetchMediators,
  setMediationMediator,
  inviteParty,
  updateMediationStatus,
  fetchAllMediations,
  fetchOrgOnboarding,
  signOrgContract,
  createOrgOnboardingOrder,
  payOrgOnboarding,
  type MediatorOption,
  type OrgOnboardingStatus,
} from "../api";
import { cn } from "../ui";

const STEPS = [
  { key: "profil", label: "Firmenprofil", icon: "🏢" },
  { key: "mediatoren", label: "Mediatoren", icon: "⚖" },
  { key: "grundkonfig", label: "Grundkonfiguration", icon: "⚙" },
  { key: "konflikt", label: "Konflikt beschreiben", icon: "✎" },
  { key: "routine", label: "Routine & Mediator", icon: "🧭" },
  { key: "beteiligte", label: "Beteiligte & Start", icon: "👥" },
  { key: "abschluss", label: "Vertrag & Zahlung", icon: "§" },
] as const;

// Standard-Servicevertrag (Platzhalter, später anpassbar).
const CONTRACT_TEMPLATE = `Servicevereinbarung medipact – Business

Zwischen der medipact GmbH (Anbieter) und dem registrierten Unternehmen (Kunde).

1. Leistung: Bereitstellung der medipact-Plattform zur Durchführung interner
   Vorgänge (Vertragsgestaltung, Erklärungen, Mediation) für Mitarbeitende des Kunden.
2. Vergütung: gemäß gewähltem Business-Abo (monatlich, zzgl. USt.).
3. Laufzeit: monatlich kündbar, sofern nicht anders vereinbart.
4. Datenschutz: Verarbeitung gemäß Auftragsverarbeitungsvertrag / DSGVO.

Mit der Unterschrift bestätigt der/die Firmen-Admin die Vertretungsbefugnis
und die Annahme dieser Vereinbarung.`;

function getPaypal(): { Buttons: (o: unknown) => { render: (el: HTMLElement) => void } } | undefined {
  return (window as unknown as { paypal?: { Buttons: (o: unknown) => { render: (el: HTMLElement) => void } } }).paypal;
}

// PayPal-Bezahlbutton für die Onboarding-Zahlung. Nichts, wenn kein Client-Id gesetzt.
function OrgPaypalButton({ orgId, onPaid }: { orgId: number; onPaid: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);
  const [error, setError] = useState("");
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;
    function render() {
      const paypal = getPaypal();
      if (!paypal || !ref.current || rendered.current) return;
      rendered.current = true;
      paypal
        .Buttons({
          style: { layout: "horizontal", color: "gold", label: "pay", height: 38 },
          createOrder: async () => {
            setError("");
            const d = await createOrgOnboardingOrder(orgId);
            return d.order_id;
          },
          onApprove: async (data: { orderID: string }) => {
            try {
              await payOrgOnboarding(orgId, "paypal", data.orderID);
              onPaid();
            } catch {
              setError("Zahlung konnte nicht abgeschlossen werden.");
            }
          },
          onError: () => setError("PayPal hat einen Fehler gemeldet."),
        })
        .render(ref.current);
    }
    const existing = document.getElementById("paypal-sdk") as HTMLScriptElement | null;
    if (getPaypal()) render();
    else if (existing) existing.addEventListener("load", render);
    else {
      const sc = document.createElement("script");
      sc.id = "paypal-sdk";
      sc.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR`;
      sc.addEventListener("load", render);
      document.body.appendChild(sc);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  if (!clientId) return null;
  return (
    <div>
      <div className="text-center text-[10px] uppercase tracking-widest text-neutral-300">oder</div>
      <div ref={ref} />
      {error && <p className="mt-1 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
      />
    </div>
  );
}

// Ein Block der Grundkonfiguration (WFM-Schritt organisation/abo_grundkonfiguration).
// Bewusst kompakt: Anzeige-Blöcke + die Eingabetypen, die der Seed nutzt.
export interface BcBlock { id: string; type: string; config: Record<string, unknown> }

function bcStr(c: Record<string, unknown>, k: string): string {
  const v = c?.[k];
  return typeof v === "string" ? v : "";
}

function BaseConfigBlock({
  block, value, onChange, disabled,
}: {
  block: BcBlock; value: unknown; onChange: (v: unknown) => void; disabled?: boolean;
}) {
  const c = block.config ?? {};
  if (block.type === "textausgabe") {
    return (
      <div>
        {bcStr(c, "title") && <p className="text-sm font-semibold text-neutral-900">{bcStr(c, "title")}</p>}
        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-600">{bcStr(c, "text")}</p>
      </div>
    );
  }
  if (block.type === "hinweis") {
    return <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{bcStr(c, "text")}</div>;
  }
  if (block.type === "auswahl") {
    const opts = Array.isArray(c.options) ? (c.options as string[]) : [];
    const multi = c.multi === true;
    const selected: string[] = Array.isArray(value) ? (value as string[]) : typeof value === "string" && value ? [value] : [];
    const toggle = (opt: string) => {
      if (disabled) return;
      if (multi) onChange(selected.includes(opt) ? selected.filter((o) => o !== opt) : [...selected, opt]);
      else onChange(opt);
    };
    return (
      <div>
        <p className="mb-1.5 text-sm font-medium text-neutral-800">{bcStr(c, "prompt")}</p>
        <div className="space-y-1">
          {opts.map((o) => (
            <label key={o} className="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 hover:border-accent-300">
              <input type={multi ? "checkbox" : "radio"} checked={selected.includes(o)} onChange={() => toggle(o)} disabled={disabled} />
              {o}
            </label>
          ))}
        </div>
      </div>
    );
  }
  if (block.type === "zustimmung") {
    const agreed = typeof value === "object" && value !== null
      ? (value as { agreed?: boolean }).agreed === true
      : value === true;
    return (
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-300 bg-white p-4">
        <input
          type="checkbox"
          checked={agreed}
          disabled={disabled}
          onChange={(e) => onChange({ agreed: e.target.checked, at: new Date().toISOString() })}
          className="mt-0.5"
        />
        <span className="text-sm text-neutral-700">{bcStr(c, "text")}</span>
      </label>
    );
  }
  // frage / texteingabe
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-neutral-800">{bcStr(c, "prompt") || bcStr(c, "label")}</p>
      <textarea
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={2}
        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400 disabled:bg-neutral-50"
      />
    </div>
  );
}

export function FirmOnboardingWizard({ onClose, onFinished }: { onClose: () => void; onFinished?: () => void }) {
  const [step, setStep] = useState(0);
  const [org, setOrg] = useState<Organization | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [billingEmail, setBillingEmail] = useState("");

  const [mediators, setMediators] = useState<SystemUser[]>([]);
  const [newMed, setNewMed] = useState({ name: "", email: "" });

  const [caseForm, setCaseForm] = useState({ title: "", description: "", priority: "" });
  const [caseId, setCaseId] = useState<number | null>(null);

  const [variants, setVariants] = useState<MediationVariantDto[]>([]);
  const [variantKey, setVariantKey] = useState("");
  const [mediatorOptions, setMediatorOptions] = useState<MediatorOption[]>([]);
  const [mediatorId, setMediatorId] = useState<number | "">("");

  const [inviteEmail, setInviteEmail] = useState("");
  const [invited, setInvited] = useState<string[]>([]);

  // Step 2: Grundkonfiguration (Abo-Modell, einmal pro Unternehmen).
  // Blöcke kommen aus dem WFM-Schritt organisation/abo_grundkonfiguration,
  // Antworten + Akzeptanz liegen am Unternehmen (organizations.base_config).
  // Ohne Akzeptanz blockt das Backend das Anlegen von Abo-Fällen (409).
  const [bcBlocks, setBcBlocks] = useState<BcBlock[]>([]);
  const [bcValues, setBcValues] = useState<Record<string, unknown>>({});
  const [bcAccepted, setBcAccepted] = useState(false);

  // Step 5: Abschluss (Vertrag + Zahlung)
  const [onb, setOnb] = useState<OrgOnboardingStatus | null>(null);
  const [signer, setSigner] = useState("");
  const [payBusy, setPayBusy] = useState(false);

  const loadMediators = useCallback(() => {
    fetchAllUsers().then((us) => setMediators(us.filter((u) => u.role === "mediator"))).catch(() => {});
  }, []);

  const loadOnb = useCallback((orgId: number) => {
    fetchOrgOnboarding(orgId).then(setOnb).catch(() => {});
  }, []);

  const loadBaseConfig = useCallback((orgId: number) => {
    fetch(`/api/organizations/${orgId}/base-config`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return;
        setBcBlocks(Array.isArray(d.blocks) ? d.blocks : []);
        setBcValues(d.values && typeof d.values === "object" ? d.values : {});
        setBcAccepted(Boolean(d.accepted));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchOrganizations()
      .then((list) => {
        const o = list[0] ?? null;
        setOrg(o);
        setBillingEmail(o?.billing_email ?? "");
        if (o) {
          setSigner((prev) => prev || o.name || "");
          loadOnb(o.id);
          loadBaseConfig(o.id);
        }
      })
      .catch(() => {});
    loadMediators();
  }, [loadMediators, loadOnb, loadBaseConfig]);

  useEffect(() => {
    if (step === 4) {
      fetchVariants("geschaeft").then(setVariants).catch(() => {});
      fetchMediators().then(setMediatorOptions).catch(() => {});
    }
  }, [step]);

  function next() { setError(""); setStep((s) => Math.min(s + 1, STEPS.length)); }
  function back() { setError(""); setStep((s) => Math.max(s - 1, 0)); }

  async function saveProfil() {
    if (!org) return next();
    setBusy(true); setError("");
    try {
      await updateOrganization(org.id, { billing_email: billingEmail.trim() });
      next();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Konnte nicht gespeichert werden.");
    } finally { setBusy(false); }
  }

  async function addMediator() {
    if (!newMed.name.trim() || !newMed.email.trim()) return;
    setBusy(true); setError("");
    try {
      await createOrgMember({ name: newMed.name.trim(), email: newMed.email.trim(), role: "mediator" });
      setNewMed({ name: "", email: "" });
      loadMediators();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Mediator konnte nicht angelegt werden.");
    } finally { setBusy(false); }
  }

  async function saveBaseConfig() {
    if (!org) return next();
    if (bcAccepted) return next();
    const agreement = bcValues["gk_zustimmung"];
    const agreed = typeof agreement === "object" && agreement !== null
      ? (agreement as { agreed?: boolean }).agreed === true
      : agreement === true;
    if (!agreed) { setError("Bitte die Grundkonfiguration lesen und akzeptieren."); return; }
    setBusy(true); setError("");
    try {
      const put = await fetch(`/api/organizations/${org.id}/base-config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values: bcValues }),
      });
      if (!put.ok) throw new Error("Konnte nicht gespeichert werden.");
      const acc = await fetch(`/api/organizations/${org.id}/base-config/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!acc.ok) throw new Error("Akzeptanz fehlgeschlagen.");
      setBcAccepted(true);
      next();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Grundkonfiguration konnte nicht gespeichert werden.");
    } finally { setBusy(false); }
  }

  async function createCase() {
    if (!caseForm.title.trim()) { setError("Bitte einen Titel für den Konflikt angeben."); return; }
    setBusy(true); setError("");
    try {
      const created = await createMediationCase({
        title: caseForm.title.trim(),
        description: caseForm.description.trim() || undefined,
        priority: caseForm.priority.trim() || undefined,
      });
      setCaseId(created.id);
      next();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fall konnte nicht angelegt werden.");
    } finally { setBusy(false); }
  }

  async function saveRoutine() {
    if (!caseId) return next();
    setBusy(true); setError("");
    try {
      if (variantKey) await setMediationVariant(caseId, variantKey);
      if (mediatorId !== "") await setMediationMediator(caseId, Number(mediatorId));
      next();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Konnte nicht gespeichert werden.");
    } finally { setBusy(false); }
  }

  async function addParticipant() {
    if (!inviteEmail.trim() || !caseId) return;
    setBusy(true); setError("");
    try {
      await inviteParty(caseId, inviteEmail.trim(), "other_party");
      setInvited((prev) => [...prev, inviteEmail.trim()]);
      setInviteEmail("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Einladung fehlgeschlagen.");
    } finally { setBusy(false); }
  }

  async function finish() {
    setBusy(true); setError("");
    try {
      if (caseId) await updateMediationStatus(caseId, { status: "active" });
      onFinished?.();
      next();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fall konnte nicht gestartet werden.");
    } finally { setBusy(false); }
  }

  async function signContract() {
    if (!org || !signer.trim()) { setError("Bitte den Namen für die Unterschrift eingeben."); return; }
    setPayBusy(true); setError("");
    try {
      await signOrgContract(org.id, signer.trim());
      loadOnb(org.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Vertrag konnte nicht unterschrieben werden.");
    } finally { setPayBusy(false); }
  }

  async function payInvoice() {
    if (!org) return;
    setPayBusy(true); setError("");
    try {
      await payOrgOnboarding(org.id, "invoice");
      onFinished?.();
      loadOnb(org.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Zahlung konnte nicht erfasst werden.");
    } finally { setPayBusy(false); }
  }

  const done = step >= STEPS.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm p-4">
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-neutral-100 px-7 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-600">Einrichtung</p>
              <h2 className="text-lg font-semibold text-neutral-900">{org?.name ? `${org.name} einrichten` : "Unternehmen einrichten"}</h2>
            </div>
            <button onClick={onClose} className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600" aria-label="Schließen">✕</button>
          </div>
          {!done && (
            <div className="mt-4 flex items-center gap-2">
              {STEPS.map((s, i) => (
                <div key={s.key} className="flex flex-1 items-center gap-2">
                  <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold", i < step ? "bg-accent-500 text-white" : i === step ? "bg-accent-100 text-accent-700 ring-2 ring-accent-400" : "bg-neutral-100 text-neutral-400")}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  {i < STEPS.length - 1 && <div className={cn("h-0.5 flex-1 rounded", i < step ? "bg-accent-400" : "bg-neutral-100")} />}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6">
          {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          {step === 0 && (
            <div className="space-y-4">
              <p className="text-sm text-neutral-500">Willkommen. Richte in wenigen Schritten dein Unternehmen ein.</p>
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm">
                <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Unternehmen</div>
                <div className="mt-0.5 font-medium text-neutral-800">{org?.name ?? "…"}</div>
                {org?.plan_label && <div className="mt-1 text-xs text-neutral-500">Abo: {org.plan_label}</div>}
              </div>
              <Field label="Rechnungs-E-Mail (optional)" value={billingEmail} onChange={setBillingEmail} placeholder="rechnung@firma.de" type="email" />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-neutral-500">Lege eure Firmen-Mediatoren an. Sie erhalten eine E-Mail, um ihr Passwort zu setzen.</p>
              <div className="flex flex-wrap items-end gap-3 rounded-xl border border-neutral-200 bg-white p-4">
                <div className="min-w-[8rem] flex-1"><Field label="Name" value={newMed.name} onChange={(v) => setNewMed((m) => ({ ...m, name: v }))} placeholder="Name" /></div>
                <div className="min-w-[10rem] flex-1"><Field label="E-Mail" value={newMed.email} onChange={(v) => setNewMed((m) => ({ ...m, email: v }))} placeholder="mediator@firma.de" type="email" /></div>
                <button onClick={addMediator} disabled={busy} className="rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-50">Anlegen</button>
              </div>
              <div className="rounded-xl border border-neutral-100">
                {mediators.length === 0 ? (
                  <div className="p-4 text-sm text-neutral-400">Noch keine Mediatoren.</div>
                ) : (
                  <div className="divide-y divide-neutral-100">
                    {mediators.map((m) => (
                      <div key={m.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                        <span className="font-medium text-neutral-800">{m.name}</span>
                        <span className="text-xs text-neutral-400">{m.email}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {bcAccepted && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">✓ Grundkonfiguration ist akzeptiert. Ihr könnt sie hier einsehen.</div>
              )}
              {bcBlocks.length === 0 ? (
                <p className="text-sm text-neutral-400">Grundkonfiguration wird geladen …</p>
              ) : (
                bcBlocks.map((b) => (
                  <BaseConfigBlock
                    key={b.id}
                    block={b}
                    value={bcValues[b.id]}
                    disabled={bcAccepted}
                    onChange={(v) => setBcValues((s) => ({ ...s, [b.id]: v }))}
                  />
                ))
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-neutral-500">Beschreibe den Konflikt/Vorgang, der bearbeitet werden soll.</p>
              <Field label="Titel" value={caseForm.title} onChange={(v) => setCaseForm((f) => ({ ...f, title: v }))} placeholder="z.B. Teamkonflikt Vertrieb" />
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">Beschreibung</label>
                <textarea value={caseForm.description} onChange={(e) => setCaseForm((f) => ({ ...f, description: e.target.value }))} rows={4} placeholder="Worum geht es? Wer ist beteiligt?" className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">Dringlichkeit (optional)</label>
                <select value={caseForm.priority} onChange={(e) => setCaseForm((f) => ({ ...f, priority: e.target.value }))} className="rounded-lg border border-neutral-200 px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400">
                  <option value="">– bitte wählen –</option>
                  <option value="niedrig">Niedrig</option>
                  <option value="mittel">Mittel</option>
                  <option value="hoch">Hoch</option>
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-neutral-500">Wähle eine Routine (Vorlage) und den zuständigen Mediator.</p>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">Routine / Variante</label>
                <select value={variantKey} onChange={(e) => setVariantKey(e.target.value)} className="w-full rounded-lg border border-neutral-200 px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400">
                  <option value="">Basis-Workflow (keine Variante)</option>
                  {variants.filter((v) => v.enabled).map((v) => (<option key={v.key} value={v.key}>{v.label}</option>))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">Mediator</label>
                <select value={mediatorId} onChange={(e) => setMediatorId(e.target.value === "" ? "" : Number(e.target.value))} className="w-full rounded-lg border border-neutral-200 px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400">
                  <option value="">– Mediator wählen –</option>
                  {mediatorOptions.map((m) => (<option key={m.user_id} value={m.user_id}>{m.name} ({m.email})</option>))}
                </select>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <p className="text-sm text-neutral-500">Lade die beteiligten Mitarbeiter ein. Danach kannst du den Fall starten.</p>
              <div className="flex items-end gap-3">
                <div className="flex-1"><Field label="E-Mail Beteiligte:r" value={inviteEmail} onChange={setInviteEmail} placeholder="mitarbeiter@firma.de" type="email" /></div>
                <button onClick={addParticipant} disabled={busy} className="rounded-lg border border-accent-300 px-4 py-2 text-sm font-semibold text-accent-700 hover:bg-accent-50 disabled:opacity-50">Einladen</button>
              </div>
              {invited.length > 0 && (
                <div className="rounded-xl border border-neutral-100 divide-y divide-neutral-100">
                  {invited.map((e, i) => (<div key={i} className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700"><span className="text-accent-500">✓</span>{e}</div>))}
                </div>
              )}
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <p className="text-sm text-neutral-500">Zum Abschluss: Servicevertrag bestätigen und Zahlung durchführen – einmalig für euer Unternehmen.</p>
              <div className="rounded-xl border border-neutral-200">
                <div className="border-b border-neutral-100 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Servicevertrag</div>
                <pre className="max-h-40 overflow-y-auto whitespace-pre-wrap px-4 py-3 text-xs leading-relaxed text-neutral-600">{CONTRACT_TEMPLATE}</pre>
              </div>

              {onb?.contract_signed ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">✓ Unterschrieben von {onb.contract_signer_name}</div>
              ) : (
                <div className="flex items-end gap-3">
                  <div className="flex-1"><Field label="Unterschrift (Name eintippen)" value={signer} onChange={setSigner} placeholder="Vor- und Nachname" /></div>
                  <button onClick={signContract} disabled={payBusy} className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-50">✍ Unterschreiben</button>
                </div>
              )}

              <div className="rounded-xl border border-neutral-200 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-800">Zahlung</span>
                  <span className="text-sm font-bold text-neutral-900">{(onb?.amount_eur ?? 0).toFixed(2)} {onb?.currency ?? "EUR"} <span className="text-xs font-normal text-neutral-400">/ Monat</span></span>
                </div>
                {onb?.paid ? (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">✓ Bezahlt ({onb.payment_method === "paypal" ? "PayPal" : "Rechnung / Abo"})</div>
                ) : (
                  <div className="space-y-2">
                    <button onClick={payInvoice} disabled={payBusy} className="w-full rounded-lg border border-accent-300 px-4 py-2 text-sm font-semibold text-accent-700 hover:bg-accent-50 disabled:opacity-50">Per Rechnung / Abo abschließen</button>
                    {org && <OrgPaypalButton orgId={org.id} onPaid={() => { onFinished?.(); loadOnb(org.id); }} />}
                  </div>
                )}
              </div>

              {onb?.complete && (
                <div className="rounded-lg border border-accent-200 bg-accent-50 px-3 py-2 text-sm font-medium text-accent-700">✓ Onboarding abgeschlossen – euer Unternehmen ist aktiviert.</div>
              )}
            </div>
          )}

          {done && (
            <div className="py-6 text-center">
              <div className="mb-3 text-4xl">🎉</div>
              <h3 className="text-lg font-semibold text-neutral-900">Alles eingerichtet</h3>
              <p className="mt-1 text-sm text-neutral-500">Weitere Fälle, Mediatoren und Beteiligte verwaltest du jederzeit im Workspace.</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-neutral-100 px-7 py-4">
          {done ? (
            <button onClick={onClose} className="ml-auto rounded-full bg-accent-500 px-6 py-2 text-sm font-semibold text-white hover:bg-accent-600">Zum Workspace →</button>
          ) : (
            <>
              <button onClick={step === 0 ? onClose : back} className="rounded-full px-4 py-2 text-sm text-neutral-500 hover:bg-neutral-100">{step === 0 ? "Später" : "Zurück"}</button>
              <div className="flex items-center gap-2">
                {step === 1 && <button onClick={next} className="rounded-full px-4 py-2 text-sm text-neutral-500 hover:bg-neutral-100">Überspringen</button>}
                <button
                  onClick={step === 0 ? saveProfil : step === 1 ? next : step === 2 ? saveBaseConfig : step === 3 ? createCase : step === 4 ? saveRoutine : step === 5 ? finish : next}
                  disabled={busy}
                  className="rounded-full bg-accent-500 px-6 py-2 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-50"
                >
                  {busy ? "…" : step === 2 ? (bcAccepted ? "Weiter" : "Akzeptieren & weiter") : step === 3 ? "Fall anlegen" : step === 5 ? "Fall starten" : step === 6 ? "Fertig" : "Weiter"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Dashboard-Checkliste ─────────────────────────────────────────────────────

export function FirmOnboardingChecklist({
  onOpenWizard, onNavigate, refreshKey = 0,
}: {
  onOpenWizard: () => void;
  onNavigate: (section: WorkspaceSection) => void;
  refreshKey?: number;
}) {
  const [hasMediator, setHasMediator] = useState(false);
  const [hasBaseConfig, setHasBaseConfig] = useState(false);
  const [hasCase, setHasCase] = useState(false);
  const [hasRoutine, setHasRoutine] = useState(false);
  const [hasActive, setHasActive] = useState(false);
  const [hasFinalized, setHasFinalized] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchAllUsers().catch(() => []),
      fetchAllMediations().catch(() => []),
      fetchOrganizations().catch(() => []),
    ])
      .then(([users, cases, orgs]) => {
        setHasMediator(users.some((u) => u.role === "mediator"));
        setHasCase(cases.length > 0);
        setHasRoutine(cases.some((c) => !!c.variant_key));
        setHasActive(cases.some((c) => c.status === "active"));
        setHasFinalized(!!orgs[0]?.onboarding_complete);
        setHasBaseConfig(!!orgs[0]?.base_config_accepted);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [refreshKey]);

  const items = [
    { label: "Firmenprofil prüfen", done: true, go: () => onNavigate("admin") },
    { label: "Mediatoren anlegen", done: hasMediator, go: () => onNavigate("admin") },
    { label: "Grundkonfiguration festlegen & akzeptieren", done: hasBaseConfig, go: onOpenWizard },
    { label: "Ersten Konflikt beschreiben", done: hasCase, go: onOpenWizard },
    { label: "Routine & Mediator zuordnen", done: hasRoutine, go: () => onNavigate("faelle") },
    { label: "Beteiligte einladen & starten", done: hasActive, go: () => onNavigate("faelle") },
    { label: "Vertrag & Zahlung abschließen", done: hasFinalized, go: onOpenWizard },
  ];
  const doneCount = items.filter((i) => i.done).length;
  const allDone = doneCount === items.length;

  if (!loaded || dismissed || allDone) return null;

  return (
    <div className="mb-6 rounded-2xl border border-accent-200 bg-gradient-to-br from-accent-50 to-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-600">Erste Schritte</p>
          <h3 className="text-base font-semibold text-neutral-900">Unternehmen einrichten</h3>
          <p className="mt-0.5 text-xs text-neutral-500">{doneCount} von {items.length} erledigt</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onOpenWizard} className="rounded-full bg-accent-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-accent-600">Einrichtung fortsetzen →</button>
          <button onClick={() => setDismissed(true)} className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100" title="Ausblenden">✕</button>
        </div>
      </div>
      <div className="mt-4 space-y-1.5">
        {items.map((it, i) => (
          <button key={i} onClick={it.go} className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-white">
            <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold", it.done ? "bg-accent-500 text-white" : "border border-neutral-300 text-transparent")}>✓</span>
            <span className={cn(it.done ? "text-neutral-400 line-through" : "text-neutral-700")}>{it.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
