<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Standard scroll/topic effects (design system)

Two reusable primitives in `app/components/ui/` implement the ai.gov-inspired
effects used on the homepage. Use these instead of re-implementing the
scroll/tab wiring whenever a new marketing page wants the same feel.

- **`ScrollPinSection.tsx`** — scroll-pinned hero/section, exported as a hook
  + frame pair: `useScrollPin(ref)` wires up the scroll listener and returns
  a `scrollYProgress` MotionValue; `ScrollPinFrame` renders the tall
  scroll-through container with the `sticky` inner viewport. Call
  `useScrollPin`/`useTransform` directly in your component body (never
  inside a callback or render-prop — that breaks React's rules-of-hooks).
  See `HeroScrollPin.tsx` for the reference implementation (homepage hero).
- **`TabSwitcher.tsx`** — exports `TabSwitcher` (tab bar, active tab gets the
  accent box outline) and `CrossfadePanel` (AnimatePresence wrapper so the
  content tied to the active tab crossfades in/out). See `ThemenTabs.tsx`
  for the reference implementation (homepage "Themen" section).
- **`ImagePinHero.tsx`** — full-bleed image hero on top of `ScrollPinFrame`/
  `useScrollPin`: background photo + gradient overlay + slow zoom while
  pinned. Used for the standard "photo hero with headline" pattern across
  the site (`/konflikte`, `/preise`, `/karriere`, `/kontakt`, `/cases`,
  `about/page.tsx` and the `/konflikte/*` sub-pages via
  `MarketingPageTemplate.tsx`'s `heroImage` branch). Pass foreground content
  as children; use `overlayStrength="strong"` for centered/short copy like
  `/kontakt`. The homepage hero (`HeroScrollPin.tsx`) calls `useScrollPin`
  directly instead, since it needs per-element staggered fades that
  `ImagePinHero` doesn't expose.

- **`DidYouKnowSection.tsx`** — supremecourt.gov-inspired "Did You Know" fact
  carousel, modernized: dark `section-strong` block, serif headline, one fact
  at a time with a `01 / 0n` counter, prev/next arrows and dot pagination,
  crossfading via `CrossfadePanel` (from `TabSwitcher.tsx`). Exports two
  verified default fact sets — `mediationFacts` (general/history, used on the
  homepage) and `mediationsgesetzFacts` (German mediation law specifics, used
  on `/about` via `MarketingPageTemplate`'s optional `didYouKnowFacts` prop).
  Pass a custom `facts` array for other pages; omit `didYouKnowFacts` in
  `MarketingPageTemplate` to skip the section (e.g. the `/konflikte/*`
  sub-pages don't have it). Facts are factual claims (legal dates, statutes,
  history) — verify anything new against a source before adding it, don't
  invent medipact-specific statistics.

Three small, standardized building blocks in `app/components/ui/` — use these
instead of hand-rolling the same markup per call-site:

- **`ArrowLink.tsx`** — text link with the animated "→" (slides right on
  hover). Locale-aware like `Button.tsx` (picks next-intl vs. plain link via
  `isMigratedLocalePath`). `tone="accent" | "light" | "muted"` — use `light`
  in dark `section-strong` blocks. Translation strings must NOT contain a
  trailing "→"; the component renders the arrow itself.
- **`FeatureCard.tsx`** — small feature/benefit card (title + short text,
  optional icon) with the standard hover (accent border, slight lift). Used
  by `ThemenTabs`; use it wherever feature/trust lists render as cards.
- **`NumberedSteps.tsx`** — numbered step row (01/02/03, accent circle,
  connector line on desktop). `tone="dark"` for `section-strong`. Used in the
  homepage process section (steps come from `home.processSteps` in
  `messages/*.json`); reuse for "So funktioniert es" sections elsewhere.

When adding a similar effect to another page, build a small page-specific
component on top of these primitives (don't fork their internals) so
the underlying animation behavior stays consistent across the site.

### Dieselbe Sprache im eingeloggten Bereich (Dashboard/Logbuch/Fall)

Das Produkt soll sich wie die Landing anfühlen, ohne deren Marketing-Tempo
zu übernehmen. Dafür gibt es abgeschwächte Gegenstücke — keine eigenen
Effekte, sondern gedrosselte Varianten derselben Primitives:

- **`Reveal` + `stagger()`** (`app/components/ui/motion.tsx`) — Arbeits-
  Variante von `FadeIn`: 8px statt 24px Versatz, 0.45s statt 0.9s, und sie
  respektiert `prefers-reduced-motion` (rendert dann einen schlichten
  `div`). `stagger(i)` staffelt Listen und deckelt bei 6 Schritten.
- **`CrossfadePanel`** (aus `TabSwitcher.tsx`) — auch im Produkt für
  Filterwechsel: Dashboard-`SegmentedControl` und der Ansichts-Filter der
  Logbuch-Chronologie crossfaden statt hart umzuschalten.
- **`cardSurface` / `cardLift` / `cardHover` / `rowHover` / `Kicker`**
  (`app/components/ui/premium.tsx`) — die Hover- und Kicker-Sprache aus
  `ZweiWelten`/`OutcomeWand`/`FeatureCard` als geteilte Klassen-Konstanten.
  `cardLift` ist bewusst OHNE Randfarbe, damit Aufrufer mit eigener
  Randfarbe (amber, violet) nicht mit einer zweiten `hover:border-*`-Klasse
  kollidieren — welche gewinnt, entscheidet die Stylesheet-Reihenfolge,
  nicht die Reihenfolge im `cn()`-Aufruf. Dieselbe Falle gilt für zwei
  `hover:bg-*` auf einem Element (siehe „Deine Eingabe"-Zeilen im
  Dashboard: entweder-oder statt beide).

Zwei Regeln beim Einsatz:

1. **Bewegung außen, Hover innen.** `Reveal` nie mit einem
   `hover:-translate-y-*` auf demselben Element kombinieren —
   framer-motion schreibt `transform` inline und der Inline-Style schlägt
   die Klasse. Karte als Kind von `Reveal` rendern.
2. **Nur Lese-/Übersichtsflächen bewegen sich.** Formular-Panels
   (`PhaseNotesClient`, `StepBlocks`) bleiben bewusst statisch: ein
   Arbeitsbereich wird täglich benutzt, dort wird ein Fade nach dem
   dritten Mal als Verzögerung wahrgenommen, nicht als Politur.

## Konflikt-Typen auf den Marketing-Seiten

There are FOUR conflict types (matching the backend `mediation_type`s):
trennung, nachbarschaft, erbschaft, geschaeft ("Team & Organisation",
`/konflikte/geschaeft`, content in `app/content/geschaeftPage.ts`). When a
page lists conflict types (ThemenTabs, EmpfehlungenGrid, Header dropdown,
`/konflikte` overview, sitemap, metadata descriptions), include all four —
geschaeft was added last and is easy to forget.
