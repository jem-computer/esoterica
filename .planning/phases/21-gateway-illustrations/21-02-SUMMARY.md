---
phase: 21-gateway-illustrations
plan: 02
subsystem: ui
tags: [css, intersection-observer, scroll-reveal, dark-mode, breakout-layout]
requires: [21-01]
provides: [illustration-integration, scroll-reveal-animation, dark-mode-inversion]
affects: []
tech-stack:
  added: []
  patterns: [css-breakout-layout, intersection-observer-reveal, filter-inversion-theming]
key-files:
  created:
    - site/src/scripts/scroll-reveal.js
  modified:
    - site/src/pages/index.astro
    - site/src/styles/global.css
key-decisions:
  - "CSS breakout layout with margin-left 50% + translateX(-50%) pattern"
  - "Filter invert(1) on img only to preserve caption text colors"
  - "Single IntersectionObserver for all illustrations"
duration: 8 min
completed: 2026-01-29
---

# Phase 21 Plan 02: Integrate Illustrations Summary

**One-liner:** Integrated three illustrations into prose with CSS breakout layout, dark mode filter inversion, and IntersectionObserver scroll reveal.

## What Was Built

Full illustration integration into the landing page:
- Three `<figure class="illustration">` elements with Astro `<Image>` components
- CSS breakout layout (65rem max-width from 38rem prose column)
- Dark mode adaptation via `filter: invert(1)` on images
- Scroll-triggered fade+slide reveal animation
- Reduced-motion accessibility support

## Accomplishments

1. **Markup Integration** (`index.astro`)
   - Added imports for three illustration PNGs
   - Inserted figures between prose paragraph groups (after P2, P4, P6)
   - Each figure has semantic `<figcaption>` with muted caption text
   - Added scroll-reveal.js script import

2. **CSS Breakout Layout** (`global.css`)
   - `.illustration` breaks out of 38rem prose to 65rem max-width
   - Uses `margin-left: 50%; transform: translateX(-50%)` centering
   - `overflow-x: clip` on `.prose` prevents horizontal scrollbar
   - Mobile: constrained to `calc(100vw - 2rem)`

3. **Scroll Reveal Animation**
   - Created `scroll-reveal.js` with single shared IntersectionObserver
   - Threshold 0.15, rootMargin -50px triggers natural reveal timing
   - `is-visible` class toggles opacity and translateY
   - Unobserve after reveal (one-time animation)

4. **Theme Adaptation**
   - `[data-theme="dark"] .illustration img { filter: invert(1) }`
   - Targets img only — caption text uses CSS custom properties
   - Black lines become white on dark background

5. **Reduced Motion Support**
   - CSS override: `opacity: 1; transform: translateX(-50%); transition: none`
   - JS guard: bails out if `prefers-reduced-motion: reduce`
   - Illustrations visible immediately with no animation

## Files Created/Modified

**Created:**
- `site/src/scripts/scroll-reveal.js` — IntersectionObserver scroll reveal

**Modified:**
- `site/src/pages/index.astro` — Illustration imports and markup
- `site/src/styles/global.css` — Illustration styles, breakout, theme, responsive

## Verification

- ✓ Build succeeds: `npx astro build`
- ✓ Three `<figure class="illustration">` elements in index.astro
- ✓ scroll-reveal.js contains IntersectionObserver and is-visible class toggle
- ✓ global.css contains illustration breakout, dark mode filter, reduced-motion override
- ✓ Commit: 58ff200

## Deviations from Plan

None — plan executed as written.

## Next Phase Readiness

✓ Phase 21 complete
✓ All illustrations integrated with proper styling and animation
✓ Ready for Phase 22 (Final Polish)
