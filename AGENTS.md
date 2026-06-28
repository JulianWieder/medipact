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

When adding a similar effect to another page, build a small page-specific
component on top of these primitives (don't fork their internals) so
the underlying animation behavior stays consistent across the site.
