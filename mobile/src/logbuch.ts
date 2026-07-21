// Gemeinsame Logbuch-Helfer: Eintragsarten, Datums-Parsing, Block-Labels.
import { Block, BlockValue, UploadValue } from "./types";

export const ENTRY_TYPES: { key: string; label: string; icon: string }[] = [
  { key: "vorkommnis", label: "Vorkommnis", icon: "⚡" },
  { key: "gedanke", label: "Gedanke", icon: "💭" },
  { key: "gespraech", label: "Gespräch", icon: "🗣️" },
  { key: "email", label: "E-Mail", icon: "✉️" },
  { key: "whatsapp", label: "WhatsApp", icon: "💬" },
  { key: "telefonat", label: "Telefonat", icon: "📞" },
];

export function entryTypeLabel(key: string): string {
  const t = ENTRY_TYPES.find((e) => e.key === key);
  return t ? `${t.icon} ${t.label}` : key;
}

/** Label eines Blocks (prompt/label/title – wie _block_labels im Backend). */
export function blockLabel(b: Block): string {
  const cfg = b.config ?? {};
  return String(cfg.prompt ?? cfg.label ?? cfg.title ?? b.id);
}

export function labelsFor(blocks: Block[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const b of blocks) out[b.id] = blockLabel(b);
  return out;
}

export function isUploadValue(v: BlockValue): v is UploadValue {
  return typeof v === "object" && v != null && "url" in v;
}

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|heic|heif)(\?|$)/i;
export function looksLikeImage(u: UploadValue): boolean {
  return IMAGE_EXT.test(u.name) || IMAGE_EXT.test(u.url);
}

/** "20.07.2026", "2026-07-20" oder leer → ISO-Datum (oder null). */
export function parseGermanDate(input: string): string | null {
  const s = input.trim();
  if (!s) return null;
  const de = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (de) {
    const [, d, m, y] = de;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  return null;
}

/** ISO-Timestamp → "20.07.2026" für die Anzeige. */
export function formatDate(iso: string | null): string {
  if (!iso) return "ohne Datum";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/** ISO-Datum (YYYY-MM-DD) → deutsche Schreibweise fürs Eingabefeld. */
export function isoToGerman(iso: string | null): string {
  if (!iso) return "";
  const m = iso.slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : "";
}
