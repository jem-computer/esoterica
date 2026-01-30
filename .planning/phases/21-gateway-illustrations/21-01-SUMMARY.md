---
phase: 21-gateway-illustrations
plan: 01
subsystem: assets
tags: [nano-banana-pro, replicate, image-generation, sharp, postprocessing]
requires: []
provides: [stamped-illustrations, pattern-recognition-png, interrupting-linear-png, ancient-modern-png]
affects: [21-02]
tech-stack:
  added: [sharp, replicate, dotenv]
  patterns: [stamp-filter-postprocessing, batch-image-generation]
key-files:
  created:
    - site/src/assets/illustrations/pattern-recognition.png
    - site/src/assets/illustrations/interrupting-linear.png
    - site/src/assets/illustrations/ancient-modern.png
    - scripts/generate-illustrations.mjs
    - scripts/generate-illustrations-v2.mjs
    - scripts/stamp-filter.mjs
key-decisions:
  - "Used Nano Banana Pro via Replicate API for line art generation"
  - "Developed custom stamp-filter.mjs for Photoshop-style postprocessing"
  - "Generated 60+ variations across 3 themes, user selected finals"
  - "Stamped images stored in postprocessed/, finals copied to site assets"
duration: ~3 hours (iterative generation + selection)
completed: 2026-01-29
---

# Phase 21 Plan 01: Generate Illustrations Summary

**One-liner:** Generated 60+ Gateway Process-style line art illustrations via Nano Banana Pro, developed stamp filter postprocessing script, user selected 3 finals.

## What Was Built

Three stamped line art illustrations for the landing page prose section:
- `pattern-recognition.png` — Concentric circles with tarot suit symbols
- `interrupting-linear.png` — Binary code fracturing into Fibonacci spiral
- `ancient-modern.png` — Terminal window with sacred geometry

## Accomplishments

1. **Batch Generation Pipeline**
   - Created `scripts/generate-illustrations.mjs` with 20 prompts per theme
   - Integrated dotenv for secure API token handling
   - Rate limit handling with retry logic

2. **V2 Generation with Code-y Prompts**
   - Created `scripts/generate-illustrations-v2.mjs` with binary/code-focused prompts
   - Better rate limiting (5s between requests, 30s retry on 429)
   - Full prompt logging (no truncation)

3. **Stamp Filter Postprocessing**
   - Created `scripts/stamp-filter.mjs` replicating Photoshop's Stamp filter
   - Uses sharp for grayscale → blur → threshold pipeline
   - Configurable balance and smoothness parameters
   - Batch processed all green-tagged favorites

4. **Final Selection & Archive**
   - User tagged favorites with green Finder tags
   - 26 images postprocessed to `brand/illustrations/postprocessed/`
   - 3 finals selected and copied to `site/src/assets/illustrations/`
   - Full archive moved to `~/Pictures/esoterica-illustrations-archive/`

## Files Created/Modified

**Created:**
- `scripts/generate-illustrations.mjs` — V1 batch generation
- `scripts/generate-illustrations-v2.mjs` — V2 with code-y prompts
- `scripts/stamp-filter.mjs` — Photoshop-style stamp postprocessing
- `site/src/assets/illustrations/pattern-recognition.png`
- `site/src/assets/illustrations/interrupting-linear.png`
- `site/src/assets/illustrations/ancient-modern.png`

**Dependencies Added:**
- `sharp` — Image processing for stamp filter
- `replicate` — API client for Nano Banana Pro
- `dotenv` — Environment variable loading

## Decisions Made

1. **Iterative prompt refinement** — User provided style suffix that worked better than initial prompts
2. **Stamp filter postprocessing** — Matches user's Photoshop workflow, now scriptable
3. **Green tag selection** — Used macOS Finder tags for visual curation, `mdfind` for programmatic access

## Deviations from Plan

- Plan called for 3-5 variations per prompt; generated 60+ total for better selection
- Added stamp filter postprocessing (not in original plan, user requested)
- Illustration generation was collaborative/iterative rather than fully automated

## Next Phase Readiness

✓ Three final illustrations ready in `site/src/assets/illustrations/`
✓ Files are stamped PNG, ~280KB each
✓ Ready for Plan 21-02 CSS integration
