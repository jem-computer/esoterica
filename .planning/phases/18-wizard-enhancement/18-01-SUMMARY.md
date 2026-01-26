---
phase: 18-wizard-enhancement
plan: 01
subsystem: skill-wizard
tags: [tarot, wizard-flow, deck-selection, minor-arcana]

# Dependency graph
requires:
  - phase: 17-minor-arcana-content
    provides: Full 78-card deck content (all suits)
provides:
  - Deck selection wizard question (Question 2.5)
  - Conditional card pool logic (0-21 vs 0-77)
  - User choice between Major-only and Full deck
affects: [18-wizard-enhancement (remaining plans), future wizard enhancements]

# Tech tracking
tech-stack:
  added: []
  patterns: [conditional-shuf-ranges, wizard-flow-insertion]

key-files:
  created: []
  modified: [skills/tarot/SKILL.md]

key-decisions:
  - "Major Arcana only listed first and described as 'recommended' for backwards compatibility"
  - "Question 2.5 inserted between spread and mode for logical flow"
  - "Conditional shuf ranges applied across all spread types (Single, Three-Card, Claude Suggests, Custom)"

patterns-established:
  - "Deck choice determines card pool range consistently across all spread/mode combinations"
  - "Digital mode dispatch pattern: check deck choice → select appropriate shuf range"

# Metrics
duration: 1.5min
completed: 2026-01-26
---

# Phase 18 Plan 01: Wizard Deck Selection Summary

**Deck selection wizard step with conditional card pools (0-21 Major-only vs 0-77 Full deck) inserted between spread and mode questions**

## Performance

- **Duration:** 1 min 27 sec
- **Started:** 2026-01-26T17:41:49Z
- **Completed:** 2026-01-26T17:43:16Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- Added Question 2.5 (Deck) to wizard flow with Major Arcana as default/recommended
- Updated all spread types (Single, Three-Card, Claude Suggests, Custom) with conditional shuf ranges
- Updated Mode Dispatch section with deck-based card pool logic
- Preserved backwards compatibility (Major-only remains default behavior)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Deck Selection Wizard Question** - `fde4415` (feat)
2. **Task 2: Update Mode Dispatch for Conditional Card Pools** - `f5f6af8` (feat)

## Files Created/Modified
- `skills/tarot/SKILL.md` - Added Question 2.5 (Deck), updated Spread Selection Logic with conditional ranges, updated Mode Dispatch with deck-based shuf logic

## Decisions Made

**1. Major Arcana only as first option and marked "recommended"**
- **Rationale:** Backwards compatibility - existing users who quickly click through wizard will get same Major-only behavior they're accustomed to
- **Impact:** Default behavior unchanged, Full deck is opt-in

**2. Question 2.5 placement between spread and mode**
- **Rationale:** Logical flow - spread determines how many cards, deck determines which pool, mode determines collection method
- **Impact:** Intuitive wizard progression

**3. Conditional shuf ranges applied to all spread types**
- **Rationale:** Consistency - deck choice should affect all random draws, not just some spreads
- **Impact:** Single Card, Three-Card, Claude Suggests, and Custom spreads all respect deck selection

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Deck selection wizard question complete and functional
- Conditional card pool logic implemented across all spread types
- Ready for Phase 18 Plan 02 (Minor Arcana card index expansion)
- Ready for Phase 18 Plan 03 (Physical mode card matching for Minor Arcana)

**Note:** While the wizard flow and conditional logic are complete, card draws from 22-77 range will require:
1. Expanded Card Index table (Plan 02)
2. Physical mode matching logic for Minor Arcana (Plan 03)
3. Card loading instructions for Minor Arcana files (already exists in Card Data Files section)

---
*Phase: 18-wizard-enhancement*
*Completed: 2026-01-26*
