import type { ReactNode } from "react";
import Icon from "@/app/components/ui/Icon";

// ── Mega-Panel für die Hauptnavigation ─────────────────────────────────────
//
// Stripe-Prinzip: Ein Dropdown, das nur Labels stapelt, zwingt zum Raten —
// „Abgleich & Tausch" sagt niemandem etwas, „Gewichten statt verhandeln"
// schon. Deshalb bekommt jeder Eintrag ein Icon, einen Titel und einen
// Halbsatz, die Einträge werden in betitelte Spalten gruppiert, und
// sekundäre Wege (Kostenrechner, Schnell-Check) stehen in einer getönten
// Fußleiste statt mitten in der Liste.
//
// Bewusst NICHT von Stripe übernommen:
//   • Die animierte Panel-Höhe beim Wechsel zwischen Menüpunkten. Viel
//     Aufwand, wenig Wirkung, und sie kostet Layout-Stabilität.
//   • Das sofortige Öffnen auf Hover. Auf dem Weg zur Nachbarspalte flackert
//     das; die 100 ms Öffnungsverzögerung stecken in Header.tsx als
//     `delay-100` (Basis-Klasse) + `group-hover:delay-0` (Schließen sofort).
//
// Rein präsentational und ohne Hooks — die Sichtbarkeit steuert Header.tsx
// per CSS (`group-hover` / `group-focus-within`), damit das Menü ohne
// JavaScript und mit Tastatur funktioniert.

export type NavPanelItem = {
  label: string;
  href: string;
  /** Halbsatz unter dem Titel. Beantwortet „Was ist das?" im Menü selbst. */
  desc: string;
  /** Name aus dem Icon-Set (app/components/ui/Icon.tsx). */
  icon: string;
};

export type NavPanelGroup = {
  /** Spaltenüberschrift. Weglassen, wenn es nur eine Gruppe gibt. */
  title?: string;
  items: NavPanelItem[];
};

export type NavPanelFooterLink = { label: string; href: string };

export function NavMegaPanel({
  groups,
  footer,
  renderLink,
}: {
  groups: NavPanelGroup[];
  footer?: NavPanelFooterLink[];
  /** Header.tsx entscheidet pro Pfad zwischen locale-aware und plain Link. */
  renderLink: (
    href: string,
    className: string,
    children: ReactNode,
  ) => ReactNode;
}) {
  const twoColumns = groups.length > 1;
  // Bei "Konflikte" traegt nur die erste Spalte eine Ueberschrift (fuenf
  // Konfliktarten, 3/2 aufgeteilt). Ohne Platzhalter startet die zweite
  // Spalte eine Zeile hoeher und die Icons stehen versetzt.
  const anyTitled = groups.some((g) => g.title);

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_24px_48px_-18px_rgba(30,41,59,0.22)]">
      <div
        className={
          twoColumns
            ? "grid grid-cols-2 divide-x divide-neutral-100"
            : "grid grid-cols-1"
        }
      >
        {groups.map((group, gi) => (
          <div key={group.title ?? gi} className="p-5">
            {group.title ? (
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-400">
                {group.title}
              </p>
            ) : (
              anyTitled && <p className="mb-3 text-[11px] leading-normal" aria-hidden="true">&nbsp;</p>
            )}
            <ul className="space-y-1">
              {group.items.map((child) => (
                <li key={child.href}>
                  {renderLink(
                    child.href,
                    "group/item flex gap-3 rounded-xl px-3 py-2.5 transition hover:bg-accent-50/70",
                    <>
                      <Icon
                        name={child.icon}
                        size="1.15rem"
                        className="mt-0.5"
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-neutral-900 transition group-hover/item:text-accent-700">
                          {child.label}
                        </span>
                        <span className="mt-0.5 block text-xs leading-5 text-neutral-500">
                          {child.desc}
                        </span>
                      </span>
                    </>,
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {footer && footer.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-neutral-100 bg-neutral-50/80 px-6 py-3">
          {footer.map((link) => (
            // renderLink liefert ein Element ohne key – deshalb der Wrapper.
            <span key={link.href} className="contents">
              {renderLink(
                link.href,
                "text-xs font-semibold text-neutral-600 transition hover:text-accent-700",
                <>
                  {link.label}
                  <span aria-hidden="true"> →</span>
                </>,
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
