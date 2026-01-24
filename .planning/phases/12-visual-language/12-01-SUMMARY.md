---
phase: 12-visual-language
plan: 01
subsystem: brand
tags: [replicate, image-generation, nano-banana-pro, sharp, typescript]

# Dependency graph
requires:
  - phase: 11-documentation
    provides: README with positioning and voice ready for visual assets
provides:
  - Generate-image skill for agentic image generation via Replicate
  - Eco-futurist prompt template maintaining brand aesthetic
  - Replicate client with async polling and rate limit handling
affects: [12-02-hero-generation, 12-03-social-assets, visual-content]

# Tech tracking
tech-stack:
  added: [replicate, sharp, get-image-colors]
  patterns: [Replicate async polling with exponential backoff, prompt template builder, immediate image download to avoid URL expiration]

key-files:
  created:
    - skills/generate-image/SKILL.md
    - skills/generate-image/src/replicate-client.ts
    - skills/generate-image/src/prompt-builder.ts
    - skills/generate-image/src/index.ts
    - skills/generate-image/src/types.ts
  modified: []

key-decisions:
  - "No wizard flow - inline parameters for batch generation (differs from tarot skill pattern)"
  - "Immediate image download after generation to avoid 1-hour URL expiration"
  - "150ms delay between generations for rate limit compliance (600/min limit)"
  - "Prompt template locked to eco-futurist aesthetic with configurable scene elements"

patterns-established:
  - "Replicate polling pattern: exponential backoff (2s, 4s, 8s, cap 10s) with 60-attempt max"
  - "Rate limit retry: 60-second wait on 429 response"
  - "Prompt optimization: Keep under 75 words for better model performance"

# Metrics
duration: 3min
completed: 2026-01-24
---

# Phase 12 Plan 01: Generate-Image Skill Summary

**Replicate Nano Banana Pro skill with eco-futurist prompt templates, async polling, and immediate download**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-24T23:05:04Z
- **Completed:** 2026-01-24T23:08:08Z
- **Tasks:** 3
- **Files modified:** 7 (4 created, 3 supporting)

## Accomplishments

- Generate-image skill infrastructure following MCP pattern with TypeScript
- ReplicateClient class with async polling, exponential backoff, and rate limit handling
- Eco-futurist prompt template builder maintaining locked aesthetic elements
- HERO_PROMPT_CONFIG with Joshua Tree altar scene and tagline cards (High Priestess, Justice, Chariot)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create skill infrastructure** - `7559691` (feat)
   - SKILL.md, package.json, tsconfig.json, types.ts
2. **Task 2: Implement Replicate client with polling** - `f82c95f` (feat)
   - replicate-client.ts with async polling and downloadImage
   - index.ts with generateImages function and env var check
3. **Task 3: Implement prompt template builder** - `1970611` (feat)
   - prompt-builder.ts with buildEsotericaPrompt and HERO_PROMPT_CONFIG

## Files Created/Modified

- `skills/generate-image/SKILL.md` - Skill documentation with usage and aesthetic guide
- `skills/generate-image/package.json` - Dependencies (replicate, sharp, get-image-colors)
- `skills/generate-image/tsconfig.json` - TypeScript ES2022 NodeNext configuration
- `skills/generate-image/src/types.ts` - PromptConfig, GenerateOptions, GenerationResult interfaces
- `skills/generate-image/src/replicate-client.ts` - Replicate API client with polling and download
- `skills/generate-image/src/index.ts` - Main generateImages function with rate limiting
- `skills/generate-image/src/prompt-builder.ts` - Eco-futurist prompt templates

## Decisions Made

1. **No wizard flow** - Unlike tarot skill, generate-image uses inline parameters for batch generation efficiency
2. **Immediate download pattern** - Images downloaded immediately after generation to avoid Replicate's 1-hour URL expiration
3. **Rate limit throttling** - 150ms delay between generations (effective 400/min) with buffer below 600/min limit
4. **Prompt optimization** - Template keeps total under 75 words for optimal Nano Banana Pro performance
5. **Hero scene specification** - Joshua Tree sunrise altar with three tagline cards (High Priestess, Justice, Chariot)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - dependencies installed successfully, TypeScript compiled cleanly on first attempt.

## User Setup Required

**External services require manual configuration.** The skill requires:

**Environment Variable:**
- `REPLICATE_API_TOKEN` - Get from Replicate Dashboard → Account Settings → API tokens

**Verification:**
```bash
export REPLICATE_API_TOKEN="your-token-here"
# Skill will error with clear message if token not set
```

## Next Phase Readiness

- Generate-image skill ready for hero image generation (plan 12-02)
- Prompt template locked to eco-futurist aesthetic with configurable scene elements
- TypeScript compiles without errors
- All dependencies installed and verified

**Ready for:**
- Hero image generation with HERO_PROMPT_CONFIG
- Social asset variations (different aspect ratios)
- Color palette extraction from generated images

---
*Phase: 12-visual-language*
*Completed: 2026-01-24*
