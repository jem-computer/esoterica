---
phase: 14-launch-materials
plan: 02
subsystem: marketing
tags: [remotion, video, demo, react, typescript]

# Dependency graph
requires:
  - phase: 12-visual-language
    provides: Brand colors, typography, visual identity from COLOR_PALETTE.md and BRAND_GUIDE.md
provides:
  - Remotion project in demo/ directory for programmatic video rendering
  - 60-second wizard flow demo composition with 5 sequences
  - Brand-aware demo with Esoterica colors and fonts
affects: [14-launch-materials (plan 01 for LinkedIn posts can reference demo video)]

# Tech tracking
tech-stack:
  added: [remotion, @remotion/cli, @remotion/bundler, @remotion/renderer]
  patterns: [Remotion Sequence-based video composition, React component animations with interpolate]

key-files:
  created:
    - demo/package.json
    - demo/remotion.config.ts
    - demo/tsconfig.json
    - demo/src/Root.tsx
    - demo/src/Demo.tsx
    - demo/src/WizardFlow.tsx
    - demo/src/styles.ts
    - demo/.gitignore
  modified: []

key-decisions:
  - "Remotion for programmatic video rendering instead of screen recording"
  - "60-second demo with hook in first 15 seconds (card draw animation)"
  - "5-sequence structure: title flash, card draw, interpretation, terminal, end card"
  - "Geist Mono fallback to Menlo/Monaco for terminal font"

patterns-established:
  - "Remotion Sequence timing for multi-scene demos"
  - "Frame-based interpolation for smooth animations"
  - "Terminal aesthetic with dark background and monospace fonts"

# Metrics
duration: 13min
completed: 2026-01-25
---

# Phase 14 Plan 02: Demo Video Summary

**Remotion project renders 60-second wizard flow demo with card draw hook, interpretation display, and Esoterica brand colors**

## Performance

- **Duration:** 13 min
- **Started:** 2026-01-26T00:59:27Z
- **Completed:** 2026-01-26T01:12:40Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- Remotion video project initialized with TypeScript and React
- Five-sequence demo composition showing authentic wizard flow
- Brand colors from COLOR_PALETTE.md integrated throughout
- Hook-first structure: card draw animation in first 15 seconds

## Task Commits

Each task was committed atomically:

1. **Task 1: Initialize Remotion project with Esoterica branding** - `9260b3d` (chore)
2. **Task 2: Create demo composition showing wizard flow** - `4f2f3a7` (feat)
3. **Cleanup: Add demo gitignore** - `6ea86fa` (chore)

## Files Created/Modified
- `demo/package.json` - Remotion dependencies and build scripts
- `demo/remotion.config.ts` - Video output configuration (JPEG format, overwrite)
- `demo/tsconfig.json` - TypeScript configuration for React JSX
- `demo/src/Root.tsx` - Remotion composition registry (60s at 30fps, 1920x1080)
- `demo/src/Demo.tsx` - Main demo composition with 5 sequences
- `demo/src/WizardFlow.tsx` - Scene components (install, cards, interpretation, endcard)
- `demo/src/styles.ts` - Brand colors and fonts from COLOR_PALETTE.md
- `demo/.gitignore` - Ignore node_modules and out directories

## Decisions Made

**Remotion for video rendering:**
- Programmatic rendering ensures consistent branding
- Version-controlled composition allows easy iteration
- React components enable smooth animations impossible with screen recordings

**60-second structure with hook first:**
- Traditional demo flow (install → run → result) buries the compelling visual
- Revised sequence leads with card draw animation (3-18s)
- First 15 seconds hook viewer before showing installation

**Five-sequence composition:**
1. (0-3s) Title flash: "Esoterica" with tagline
2. (3-18s) Card draw: Three cards appearing with reveal animation (THE HOOK)
3. (18-35s) Interpretation: Typewriter effect showing reading text
4. (35-50s) Terminal: Pull back to show install command context
5. (50-60s) End card: Tagline + install command + landing page URL

**Brand integration:**
- Primary color (#e5c8bc warm blush) for card names and highlights
- Terminal dark background (#1A1A1A) for authenticity
- Geist Mono fallback chain for terminal font compatibility

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - Remotion installation and TypeScript compilation succeeded without issues.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for video rendering:**
- Composition TypeScript compiles without errors
- All 5 sequences implemented with correct timing (1800 frames total)
- Brand colors verified from COLOR_PALETTE.md
- Demo shows authentic wizard flow (not marketing fluff)

**Next steps:**
1. Preview in Remotion Studio: `cd demo && npm run dev`
2. Render video: `cd demo && npm run build`
3. Optional GIF: `cd demo && npm run build:gif`
4. Use rendered video in Phase 14 Plan 01 LinkedIn posts

**No blockers** - ready to render demo video for launch materials.

---
*Phase: 14-launch-materials*
*Completed: 2026-01-25*
