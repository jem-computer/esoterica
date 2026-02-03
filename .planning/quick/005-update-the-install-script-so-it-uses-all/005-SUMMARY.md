---
phase: quick-005
plan: 01
subsystem: installer
tags: [npx, cli, multi-skill, installation]

# Dependency graph
requires:
  - phase: quick-004
    provides: 5 new witchy skills (micro-ritual, sacred-blessing, romantical, correspondence, incantation)
provides:
  - Multi-skill installation via npx @templeofsilicon/esoterica
  - All 6 user-facing skills installed in one command
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "SKILLS_TO_INSTALL array for centralized skill list management"
    - "forEach loop for batch installation/uninstallation"

key-files:
  created: []
  modified:
    - bin/install.js

key-decisions:
  - "Exclude generate-image from SKILLS_TO_INSTALL (internal skill)"
  - "Add witchy flourish 'The cauldron bubbles' to success message"

patterns-established:
  - "Skill list as constant at top of installer for easy maintenance"

# Metrics
duration: 3min
completed: 2026-02-02
---

# Quick Task 005: Update Install Script for Multi-Skill Installation

**Install script now installs all 6 user-facing skills (tarot, micro-ritual, sacred-blessing, romantical, correspondence, incantation) with generate-image correctly excluded**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-02
- **Completed:** 2026-02-02
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- SKILLS_TO_INSTALL array defines all 6 user-facing skills
- generate-image excluded (internal skill for illustration generation)
- Help text updated with all slash commands and descriptions
- Install/uninstall logic loops over skills array
- Verification checks all SKILL.md files exist after installation

## Task Commits

Each task was committed atomically:

1. **Task 1: Update install.js for multi-skill installation** - `e887c74` (feat)

## Files Created/Modified

- `bin/install.js` - Refactored for multi-skill installation with SKILLS_TO_INSTALL array

## Decisions Made

- **Exclude generate-image:** Internal skill for illustration generation, not user-facing
- **Add witchy flourish:** Extended success message to "The cards are shuffled. The cauldron bubbles. The threshold awaits."

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Install script ready for npm publish
- Users can now get all 6 skills with single `npx @templeofsilicon/esoterica` command

---
*Phase: quick-005*
*Completed: 2026-02-02*
