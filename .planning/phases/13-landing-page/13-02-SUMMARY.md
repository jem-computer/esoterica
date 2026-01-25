---
phase: 13-landing-page
plan: 02
subsystem: web
tags: [github-pages, landing-page, typography, dark-mode]

# Dependency graph
requires:
  - phase: 13-01
    provides: docs/ directory with brand assets
provides:
  - Complete landing page at docs/index.html
  - Full-bleed hero with New Spirit Medium headings
  - Geist Mono body text from Google Fonts
  - Light/dark theme toggle with persistence
  - Copy-to-clipboard install command (2 CTAs)
  - Mystical prose section (~400 words)
affects: [github-pages-deployment, phase-14-launch]

# Tech tracking
tech-stack:
  added: ["Google Fonts (Geist Mono)", "Self-hosted webfont (New Spirit Medium)"]
  patterns: ["@font-face for custom fonts", "CSS custom properties for theming"]

key-files:
  created:
    - docs/fonts/NewSpirit-Medium.woff
    - docs/fonts/NewSpirit-Medium.woff2
  modified:
    - docs/index.html
    - brand/DESIGN_PROMPT.md

key-decisions:
  - "Full-bleed hero image with overlay (not featured image or no-image approach)"
  - "New Spirit Medium (500 weight) for headings via self-hosted woff2"
  - "Geist Mono from Google Fonts for body text"
  - "Whole Earth Catalog aesthetic: warm, minimal, typography-forward"
  - "Witchy mystical tone in prose (20% more than initial draft)"

patterns-established:
  - "Design prompt document for AI-assisted brand consistency"
  - "Multiple copy-to-clipboard CTAs (hero + end of prose)"

# Metrics
duration: ~45min (with design iterations)
completed: 2026-01-25
---

# Phase 13 Plan 02: Build Landing Page Summary

**Complete landing page with full-bleed hero, New Spirit + Geist Mono typography, mystical prose section, and dual install CTAs**

## Performance

- **Duration:** ~45 min (including design iterations)
- **Started:** 2026-01-25
- **Completed:** 2026-01-25
- **Design iterations:** 3 (minimal → featured image → full-bleed)
- **Files modified:** 4

## Accomplishments

- Created complete landing page with "Whole Earth Catalog" aesthetic
- Implemented full-bleed hero with dark overlay (light/dark theme aware)
- Added New Spirit Medium as self-hosted webfont for headings
- Switched body text to Geist Mono from Google Fonts
- Wrote ~400 words of mystical prose ("What happens when you give a machine the cards?")
- Added dual install CTAs (hero + end of prose)
- Created reusable design prompt document (brand/DESIGN_PROMPT.md)

## Task Commits

1. **Redesign landing page with New Spirit + Input Mono** - `ad7ec4b` (feat)
2. **Add mystical prose section after hero** - `768d067` (feat)
3. **Dial up mystical tone in prose section** - `2ead05c` (feat)
4. **Switch body font to Geist Mono** - `533744e` (feat)
5. **Add New Spirit Medium as self-hosted webfont** - `6f22692` (feat)
6. **Add second install CTA after prose section** - `dacd7e9` (feat)

## Design Evolution

1. **Initial:** Minimal off-white background, no hero image
2. **User feedback:** "We lost the hero image!"
3. **Attempt 2:** Featured image below content
4. **User feedback:** "I preferred the full-bleed style"
5. **Final:** Full-bleed hero with new typography system

## Key Copy

**Tagline:** "Ancient patterns, new paths"

**Prose opener:** "Something stirs. Claude is already reasoning through your problems at inhuman speed—but speed isn't wisdom, and logic alone can't see around corners. The cards open a different kind of eye."

**Closer:** "Ancient patterns. New paths. Install it. Draw a card. See what moves through you when you let the archetypes into your terminal."

## Deviations from Plan

- Added DESIGN_PROMPT.md (not in original plan, but valuable for brand consistency)
- Multiple design iterations based on user feedback
- Prose tone adjusted to be "20% more witchy" per user request

## Next Phase Readiness

Landing page complete and ready for GitHub Pages deployment. Phase 14 (Launch Materials) can proceed with:
- LinkedIn posts using established voice
- Demo GIF/video of wizard flow
- Open Graph images already in place

---
*Phase: 13-landing-page*
*Completed: 2026-01-25*
