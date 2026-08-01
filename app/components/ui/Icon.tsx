// ── medipact Icon-Set ──────────────────────────────────────────────────────
//
// Ein sauberes, marken-konsistentes Icon-Set (Petrol-Linie #336E7C, heller
// Look). Ersetzt die früheren Emoji-/Unicode-„Icons".
//
// Verwendung:
//   <Icon name="scale" />                     // per semantischem Namen
//   <Icon name={item.icon} />                 // ODER direkt mit dem alten
//                                             //   Emoji-String als Schlüssel
//
// Der Clou: EMOJI_TO_NAME bildet die bereits im Code hinterlegten Emojis auf
// echte SVGs ab. Dadurch müssen die Daten-Dateien (types.ts, blockTypes.ts …)
// NICHT geändert werden – nur die Render-Stellen `{x.icon}` -> `<Icon
// name={x.icon} />`. Unbekannte Zeichen werden unverändert als Text
// ausgegeben, es bricht also nie etwas.

const P: Record<string, string> = {
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
  scale: '<path d="M12 4v15"/><path d="M8.5 20h7"/><path d="M4.5 8h15"/><circle cx="12" cy="3.6" r="1.1" fill="currentColor" stroke="none"/><path d="M5 8l-2.2 4.6"/><path d="M5 8l2.2 4.6"/><path d="M2.4 12.6a2.7 2.2 0 0 0 5.2 0z"/><path d="M19 8l-2.2 4.6"/><path d="M19 8l2.2 4.6"/><path d="M16.4 12.6a2.7 2.2 0 0 0 5.2 0z"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 5.2a3 3 0 0 1 0 5.6"/><path d="M17.5 13.2a5 5 0 0 1 3 5.3"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.2"/><path d="M3.5 9.5h17"/><path d="M8 3v4"/><path d="M16 3v4"/><circle cx="8.5" cy="13.5" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="13.5" r="1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="13.5" r="1" fill="currentColor" stroke="none"/>',
  receipt: '<path d="M6 3.5h12v17l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4z"/><path d="M9 8.5h6"/><path d="M9 12h6"/>',
  compass: '<circle cx="12" cy="12" r="8.5"/><path d="M15.5 8.5l-2.7 4.3-4.3 2.7 2.7-4.3z" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none"/>',
  shield: '<path d="M12 3.2l7 2.8v5.2c0 4.8-3.4 7.4-7 8.8-3.6-1.4-7-4-7-8.8V6z"/><path d="M9 12l2.2 2.2L15.2 10"/>',
  gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1"/>',
  edit: '<path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19z"/><path d="M14.5 6.5l3 3"/>',
  play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',
  help: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.4a2.5 2.5 0 0 1 4.9.7c0 1.7-2.5 2.2-2.5 3.9"/><circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none"/>',
  video: '<rect x="3" y="7" width="12.5" height="10" rx="2.2"/><path d="M15.5 10.5l5-3v9l-5-3z" fill="currentColor" stroke="none"/>',
  star: '<path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.6 9.6l5.8-.8z" fill="currentColor" stroke="none"/>',
  paragraph: '<rect x="5.5" y="3.5" width="13" height="17" rx="2"/><path d="M13.6 8.2a2 2 0 0 0-3.4 1.4c0 1.9 3.4 1.4 3.4 3.3a2 2 0 0 1-3.4 1.4"/>',
  sparkle: '<path d="M12 3.5l1.6 6.9 6.9 1.6-6.9 1.6L12 20.5l-1.6-6.9L3.5 12l6.9-1.6z" fill="currentColor" stroke="none"/>',
  sparkles: '<path d="M11 4l1.4 6 6 1.4-6 1.4L11 19l-1.4-6L3.6 11.4 9.6 10z" fill="currentColor" stroke="none"/><path d="M18 14l.7 2.3 2.3.7-2.3.7L18 20l-.7-2.3-2.3-.7 2.3-.7z" fill="currentColor" stroke="none"/>',
  diamond: '<path d="M12 3.5l8.5 8.5-8.5 8.5L3.5 12z" fill="currentColor" stroke="none"/>',
  record: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/>',
  checkbox: '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M7.5 12l3 3 6-6.5"/>',
  sort: '<path d="M8 4v16"/><path d="M4.5 7.5L8 4l3.5 3.5"/><path d="M16 20V4"/><path d="M12.5 16.5L16 20l3.5-3.5"/>',
  plus: '<path d="M12 4.5v15"/><path d="M4.5 12h15"/>',
  euro: '<circle cx="12" cy="12" r="8.5"/><path d="M15.5 8.6a4.6 4.6 0 1 0 0 6.8"/><path d="M7 11h6.5"/><path d="M7 13.4h5.5"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/><circle cx="12" cy="15" r="1.2" fill="currentColor" stroke="none"/>',
  paperclip: '<path d="M20 11.5l-8.4 8.4a5 5 0 0 1-7-7l8.6-8.6a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.6 1.6 0 0 1-2.3-2.3l7.8-7.8"/>',
  image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M4 17l4.5-4.5 3.5 3.5 3-3 5 5"/>',
  check: '<path d="M4.5 12.5l4.5 4.5 10.5-11"/>',
  signature: '<path d="M3 19c3 0 3-9 6-9 2 0 1.5 6 3.5 6 1.8 0 2-5 4-5 1.4 0 1.5 3 3.5 3"/><path d="M3 21h18"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5"/><circle cx="12" cy="8" r="0.9" fill="currentColor" stroke="none"/>',
  "chevron-down": '<path d="M6 9.5l6 6 6-6"/>',
  pause: '<path d="M9 5v14M15 5v14"/>',
  card: '<rect x="2.5" y="5.5" width="19" height="13" rx="2.2"/><path d="M2.5 10h19"/><path d="M6 14.5h4"/>',
  file: '<path d="M7 3.5h7l4 4v13H7z"/><path d="M14 3.5v4h4"/><path d="M9.5 12h5M9.5 15h5"/>',
  pin: '<path d="M12 21c4.5-5 7-8 7-11a7 7 0 0 0-14 0c0 3 2.5 6 7 11z"/><circle cx="12" cy="10" r="2.4" fill="currentColor" stroke="none"/>',
  speech: '<path d="M4 5.5h13a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H9l-4 3.5V16H4a2 2 0 0 1-2-2V7.5a2 2 0 0 1 2-2z"/><path d="M7 9.5h7M7 12.5h4"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.2"/><path d="M3.5 7l8.5 6 8.5-6"/>',
  message: '<path d="M4 5.5h16a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H9l-4.5 3.5V16.5H4A1.5 1.5 0 0 1 2.5 15V7A1.5 1.5 0 0 1 4 5.5z"/><circle cx="8.5" cy="11" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="11" r="1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="11" r="1" fill="currentColor" stroke="none"/>',
  phone: '<path d="M6.5 3.5c-1.4 0-2.5 1.2-2.3 2.6C5 12.5 11.5 19 18 19.8c1.4.2 2.6-.9 2.6-2.3v-2.6c0-.9-.6-1.6-1.5-1.8l-2.6-.6c-.7-.2-1.5.1-1.9.8l-.6 1C11.5 15 9 12.5 8.1 9.5l1-.6c.7-.4 1-1.2.8-1.9L9.3 4.4c-.2-.9-.9-1.5-1.8-1.5z"/>',
  thought: '<path d="M6.5 13a4 4 0 1 1 1.2-7.8A4.5 4.5 0 0 1 16.5 6a3.5 3.5 0 0 1-.5 6.9H7z"/><circle cx="6" cy="17" r="1.3"/><circle cx="9.5" cy="19.5" r="0.9"/>',
  dove: '<path d="M3.5 13.5c3 .5 5.5-.8 7.5-3.5.8 2.2 2.4 3.5 4.8 3.5 2 0 3.7-1.2 3.7-1.2s-.8 5.2-6 6.2c-4.2.8-7.6-1.6-9-4.5z"/><path d="M11 10c1-2 1-4-.5-5.5"/><circle cx="17.5" cy="10.5" r="0.7" fill="currentColor" stroke="none"/>',
  handshake: '<path d="M11.5 7L9 9.3a1.6 1.6 0 0 0 0 2.4l.3.3a1.6 1.6 0 0 0 2.2 0l1.5-1.4 3 2.8a1.5 1.5 0 0 0 2.1-2.1"/><path d="M2.5 8.5l3-3 4 3.5"/><path d="M21.5 8.5l-3-3-2.5 2"/><path d="M12.5 13.5l2 1.9a1.4 1.4 0 0 0 2-2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0z"/>',
  building: '<rect x="6" y="3.5" width="12" height="17" rx="1"/><path d="M9 7h2M13 7h2M9 10.5h2M13 10.5h2M9 14h2M13 14h2"/><path d="M10.5 20.5V17h3v3.5"/>',
  clipboard: '<rect x="5" y="4.5" width="14" height="16" rx="2"/><rect x="8.5" y="2.8" width="7" height="3.4" rx="1.2"/><path d="M8.5 11h7M8.5 14.5h5"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.8"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
  mirror: '<ellipse cx="12" cy="9.5" rx="6" ry="7"/><path d="M9 20h6M12 16.5V20"/>',
  "arrow-right": '<path d="M4.5 12h14"/><path d="M13 6.5l5.5 5.5-5.5 5.5"/>',
  "check-circle": '<circle cx="12" cy="12" r="8.5"/><path d="M8 12.2l2.7 2.7 5.3-6"/>',
  "x-circle": '<circle cx="12" cy="12" r="8.5"/><path d="M9 9l6 6M15 9l-6 6"/>',
  warning: '<path d="M12 4L2.8 19.5h18.4z"/><path d="M12 10v4.5"/><circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none"/>',
  notebook: '<rect x="5.5" y="3.5" width="13" height="17" rx="2"/><path d="M9 3.5v17"/><path d="M12 8.5h4M12 12h4"/>',
  mic: '<rect x="9" y="3.5" width="6" height="10.5" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0"/><path d="M12 18v2.5M9 20.5h6"/>',
  heartbreak: '<path d="M12 20.5C7 16.5 3 13 3 8.8A4.6 4.6 0 0 1 7.6 4.2c1.8 0 3.4 1 4.4 2.4a5.3 5.3 0 0 1 4.4-2.4A4.6 4.6 0 0 1 21 8.8c0 4.2-4 7.7-9 11.7z"/><path d="M12 6.6l-1.6 3 2.8 2-1.8 3.4"/>',
  heart: '<path d="M12 20.5C7 16.5 3 13 3 8.8A4.6 4.6 0 0 1 7.6 4.2c1.8 0 3.4 1 4.4 2.4a5.3 5.3 0 0 1 4.4-2.4A4.6 4.6 0 0 1 21 8.8c0 4.2-4 7.7-9 11.7z"/>',
  scroll: '<path d="M7 3.5h11a2 2 0 0 1 2 2V7h-4"/><path d="M16 5.5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V17h10"/><path d="M8 9h5M8 12.5h5"/>',
  home: '<path d="M4 11l8-7 8 7"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/>',
  repeat: '<path d="M4 9.5a6 6 0 0 1 6-5h5"/><path d="M12.5 1.8L15.5 4.5l-3 2.7"/><path d="M20 14.5a6 6 0 0 1-6 5H9"/><path d="M11.5 22.2L8.5 19.5l3-2.7"/>',
  bulb: '<path d="M9 18a7 7 0 1 1 6 0v1.5H9z"/><path d="M9.8 21.5h4.4"/><path d="M12 14.5v3.5"/>',
  chart: '<path d="M4 4v16h16"/><path d="M8.5 16.5v-5M12.5 16.5V8M16.5 16.5v-3"/>',
  "trend-up": '<path d="M3.5 17.5l5.5-5.5 3.5 3.5 7-7.5"/><path d="M14.5 8h5v5"/>',
  brain: '<path d="M11.5 4a3 3 0 0 0-3 3 3.2 3.2 0 0 0-2.7 4.6A3.2 3.2 0 0 0 7 17.5a3 3 0 0 0 4.5 2.1z"/><path d="M11.5 4v15.6"/><path d="M12.5 4a3 3 0 0 1 3 3 3.2 3.2 0 0 1 2.7 4.6 3.2 3.2 0 0 1-1.2 5.9 3 3 0 0 1-4.5 2.1z"/>',
  bot: '<rect x="4.5" y="8" width="15" height="11" rx="2.5"/><path d="M12 4.5V8"/><circle cx="12" cy="3.5" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="13" r="1.1" fill="currentColor" stroke="none"/><circle cx="15" cy="13" r="1.1" fill="currentColor" stroke="none"/><path d="M9.5 16.5h5"/>',
  party: '<path d="M6.5 11L3 21l10-3.5z"/><path d="M9 10.5c2.5 1 4.5 3 5.5 5.5"/><path d="M14 4.5l.5 2.5-2.3 1"/><path d="M19.5 9.5L17 11"/><circle cx="18.5" cy="5" r="0.9" fill="currentColor" stroke="none"/><circle cx="20.5" cy="14.5" r="0.9" fill="currentColor" stroke="none"/>',
  eye: '<path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.6"/>',
  bolt: '<path d="M13 3L5.5 13.5H11L10 21l7.5-10.5H12z"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.3 15.3L21 21"/>',
  "face-sad": '<circle cx="12" cy="12" r="8.5"/><circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r="0.9" fill="currentColor" stroke="none"/><path d="M8.8 16.2a4.3 4.3 0 0 1 6.4 0"/>',
  "face-unsure": '<circle cx="12" cy="12" r="8.5"/><circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r="0.9" fill="currentColor" stroke="none"/><path d="M8.8 15.8c2-.9 4.4-.4 6.4.6"/>',
  "face-neutral": '<circle cx="12" cy="12" r="8.5"/><circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r="0.9" fill="currentColor" stroke="none"/><path d="M8.8 15.7h6.4"/>',
  "face-good": '<circle cx="12" cy="12" r="8.5"/><circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r="0.9" fill="currentColor" stroke="none"/><path d="M9 15.2a4.3 4.3 0 0 0 6 0"/>',
  "face-happy": '<circle cx="12" cy="12" r="8.5"/><circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r="0.9" fill="currentColor" stroke="none"/><path d="M8.2 14.2a4.3 4.3 0 0 0 7.6 0z" fill="currentColor" stroke="none"/>',
};

const EMOJI_TO_NAME: Record<string, string> = {
  "⊞": "grid", "⚖": "scale", "⚖️": "scale", "👥": "users", "📅": "calendar",
  "📆": "calendar", "🧾": "receipt", "🧭": "compass", "🛡": "shield", "⚙": "gear",
  "✎": "edit", "▶": "play", "?": "help", "🎥": "video", "★": "star",
  "§": "paragraph", "✦": "sparkle", "✨": "sparkles", "◆": "diamond", "▪": "diamond",
  "📄": "file", "⏺": "record", "☑": "checkbox", "↕": "sort", "➕": "plus",
  "€": "euro", "🔒": "lock", "📎": "paperclip", "🖼": "image", "✔": "check",
  "✍": "signature", "ℹ": "info", "▾": "chevron-down", "⏸": "pause", "💳": "card",
  "📌": "pin", "🗣️": "speech", "🗣": "speech", "✉️": "mail", "✉": "mail",
  "💬": "message", "📞": "phone", "💭": "thought", "🕊️": "dove", "🕊": "dove",
  "🤝": "handshake", "🧑": "user", "🏢": "building", "📋": "clipboard",
  "🎯": "target", "🪞": "mirror",
  "➜": "arrow-right", "→": "arrow-right",
  "✅": "check-circle", "❌": "x-circle", "⚠": "warning", "⚠️": "warning",
  "📓": "notebook", "🎙": "mic", "🎙️": "mic", "💔": "heartbreak",
  "💚": "heart", "📜": "scroll", "🏡": "home", "🔁": "repeat",
  "💡": "bulb", "📊": "chart", "📈": "trend-up", "🧠": "brain",
  "🤖": "bot", "🎉": "party", "👁": "eye", "⚡": "bolt",
  "🔍": "search", "⌕": "search", "🔐": "lock", "📧": "mail", "↔": "repeat",
  "📝": "edit", "💶": "euro", "🎦": "video",
  "😔": "face-sad", "😕": "face-unsure", "😐": "face-neutral",
  "🙂": "face-good", "😊": "face-happy",
};

export interface IconProps {
  /** Semantischer Name (z.B. "scale") ODER der alte Emoji-String. */
  name: string;
  className?: string;
  /** CSS-Größe, Standard 1.15em (skaliert mit der Schriftgröße). */
  size?: number | string;
  /** Linienfarbe – Standard Marken-Petrol. */
  color?: string;
  strokeWidth?: number;
  title?: string;
}

export function iconNameFor(raw: string): string | null {
  const n = EMOJI_TO_NAME[raw] ?? raw;
  return P[n] ? n : null;
}

export default function Icon({
  name,
  className,
  size = "1.15em",
  color = "#336E7C",
  strokeWidth = 1.7,
  title,
}: IconProps) {
  const resolved = iconNameFor(name);
  // Unbekannt -> Originaltext ausgeben, damit nie etwas verschwindet.
  if (!resolved) {
    return <span className={className} aria-hidden={!title}>{name}</span>;
  }
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color, display: "inline-block", verticalAlign: "-0.15em", flexShrink: 0 }}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      dangerouslySetInnerHTML={{ __html: (title ? `<title>${title}</title>` : "") + P[resolved] }}
    />
  );
}
