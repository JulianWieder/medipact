"use client";

import { useEffect, useRef, useState } from "react";

export type SectionNavItem = { id: string; label: string };

/**
 * Unternavigation für lange Marketing-Seiten (zuerst /methode): klebt unter
 * dem Header, springt per Anker zu den Abschnitten und markiert den, in dem
 * man gerade liest. Auf dem Handy horizontal wischbar.
 *
 * Einsatz: Nav und alle Abschnitte in EIN gemeinsames Element legen (nicht
 * direkt in <body>), sonst klebt die Leiste bis in den Footer. Jeder Eintrag
 * braucht ein Element mit passender `id` auf der Seite.
 *
 * Header-Höhe wird gemessen statt hart codiert: Der Header (Header.tsx) ist
 * ab md immer sichtbar, darunter blendet er sich beim Runterscrollen aus –
 * dort klebt die Leiste deshalb an top 0 und liegt unter dem Header (z-40 <
 * z-50), wenn er beim Hochscrollen zurückkommt.
 */
export function SectionNav({ items }: { items: SectionNavItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const [top, setTop] = useState(0);
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const measure = () => {
      const header = document.querySelector("header");
      setTop(desktop.matches && header ? header.offsetHeight : 0);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Aktiver Abschnitt = der letzte, dessen Oberkante die Leiste passiert hat.
  useEffect(() => {
    const onScroll = () => {
      const line = top + (navRef.current?.offsetHeight ?? 0) + 24;
      let current = items[0]?.id;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= line) current = item.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items, top]);

  // Aktiven Eintrag in der wischbaren Leiste sichtbar halten. Bewusst über
  // scrollLeft statt scrollIntoView, das sonst auch die Seite verschieben kann.
  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!list || !link) return;
    const left = link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2;
    list.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  const jump = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const offset = top + (navRef.current?.offsetHeight ?? 0);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - offset + 1,
      behavior: reduce ? "auto" : "smooth",
    });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav
      ref={navRef}
      aria-label="Abschnitte dieser Seite"
      style={{ top }}
      className="sticky z-40 border-b border-neutral-200/80 bg-white/90 backdrop-blur"
    >
      <ul
        ref={listRef}
        className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 [scrollbar-width:none] sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <li key={item.id} className="shrink-0">
            <a
              href={`#${item.id}`}
              data-id={item.id}
              onClick={(e) => jump(e, item.id)}
              aria-current={active === item.id ? "location" : undefined}
              className={`block rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                active === item.id
                  ? "bg-accent-50 text-accent-800 ring-1 ring-accent-200"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
