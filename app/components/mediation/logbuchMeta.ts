// ── Gemeinsame Anzeige-Metadaten des Konflikt-Logbuchs ─────────────────────
//
// Wird sowohl im Logbuch selbst (LogbuchClient) als auch im Reiter „Logbuch"
// eines Falls (LinkedLogbuch) gebraucht. Die Icon-Strings sind die alten
// Emoji-Schlüssel – <Icon name={…} /> bildet sie auf die SVGs ab.

export interface LogbuchMeta {
  key: string;
  label: string;
  icon: string;
}

/** Art eines Eintrags (Backend: mediation_log_entries.entry_type). */
export const ENTRY_TYPE_META: LogbuchMeta[] = [
  { key: "vorkommnis", label: "Vorkommnis", icon: "📌" },
  { key: "gedanke", label: "Gedanke", icon: "💭" },
  { key: "gespraech", label: "Gespräch", icon: "🗣️" },
  { key: "email", label: "E-Mail", icon: "✉️" },
  { key: "whatsapp", label: "WhatsApp", icon: "💬" },
  { key: "telefonat", label: "Telefonat", icon: "📞" },
];

/** Geschäftliche Fälle: sachliche Labels statt persönlichem Journal-Ton. */
export const BUSINESS_TYPES = new Set([
  "odr", "schlichtung", "ecommerce", "b2b", "geschaeft", "arbeitsplatz",
]);

const BUSINESS_ENTRY_LABELS: Record<string, string> = {
  vorkommnis: "Vorgang",
  gedanke: "Interne Notiz",
  gespraech: "Besprechung",
  whatsapp: "Nachricht",
};

/** Bereich eines Eintrags (Ein-Buch-Prinzip, Keys = mediation_type). */
export const AREA_META: LogbuchMeta[] = [
  { key: "trennung", label: "Trennung & Familie", icon: "💔" },
  { key: "erbschaft", label: "Erbschaft", icon: "📜" },
  { key: "nachbarschaft", label: "Nachbarschaft", icon: "🏡" },
  { key: "verbraucher", label: "Verbraucher & Handwerker", icon: "🧾" },
  { key: "mietverhaeltnis", label: "Mietverhältnis", icon: "🏢" },
  { key: "odr", label: "Geschäft & Arbeit", icon: "🏢" },
];

export function entryTypeMeta(key: string | null | undefined, businessTone = false): LogbuchMeta {
  const k = (key ?? "").toLowerCase();
  const found = ENTRY_TYPE_META.find((t) => t.key === k);
  if (!found) return { key: k, label: k || "Eintrag", icon: "📌" };
  return businessTone && BUSINESS_ENTRY_LABELS[k]
    ? { ...found, label: BUSINESS_ENTRY_LABELS[k] }
    : found;
}

export function areaMetaFor(key: string | null | undefined): LogbuchMeta {
  const k = (key ?? "").toLowerCase();
  const found = AREA_META.find((a) => a.key === k);
  if (found) return found;
  if (BUSINESS_TYPES.has(k)) return AREA_META[AREA_META.length - 1];
  return { key: k, label: k || "Allgemein", icon: "📓" };
}

export function formatLogDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
