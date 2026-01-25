# State: Esoterica

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-23)

**Core value:** Agents can draw and interpret tarot cards as a perspective-shifting tool
**Current focus:** v1.2 Brand & Marketing - Phase 12 (Visual Language)

## Current Position

Milestone: v1.2 Brand & Marketing
Phase: 12 of 14 (Visual Language)
Plan: 04 of 04
Status: Phase complete
Last activity: 2026-01-25 - Completed 12-04-PLAN.md (visual language documentation)

Progress: [████████████░░░░░░░░] 86% (12/14 phases complete, 4/4 plans in Phase 12)

## Performance Metrics

**Velocity:**
- Total plans completed: 16 (5 v1.0 + 5 v1.1 + 6 v1.2)
- Average duration (v1.1): 2.4 min
- Average duration (v1.2): 3.0 min
- Total execution time (v1.2): 24.5 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| v1.0 Phases 1-5 | 5 | - | - |
| Phase 6 (Wizard Infrastructure) | 1 | 3 min | 3 min |
| Phase 7 (Spread Options) | 2 | 4 min | 2 min |
| Phase 8 (Reading Modes) | 1 | 3 min | 3 min |
| Phase 9 (Multi-Card Interpretation) | 1 | 2 min | 2 min |
| Phase 10 (Positioning) | 2 | ~13 min | ~6.5 min |
| Phase 11 (Documentation) | 1 | 1.4 min | 1.4 min |
| Phase 12 (Visual Language) | 4 | 21.5 min | 5.4 min |

## Accumulated Context

### Decisions

All decisions logged in PROJECT.md Key Decisions table.

**Recent (Phase 12):**
- Extracted 6 brand colors (Primary, Secondary, Accent, Warm Neutral, Cool Neutral, Dark Base) from hero image
- Typography pairing: Cormorant Garamond (headlines) + Source Sans 3 (body) + JetBrains Mono (code)
- Film aesthetic codified: soft grain, natural lighting, analog warmth, no sharp focus
- Diversity representation explicitly documented: skin tone spectrum, background figures
- Asset generation scripts placed in skills/generate-image/ to leverage existing Sharp dependency
- Sharp's 'attention' positioning for smart cropping social variants
- Minimalist tarot card with star motif for favicon recognition at small sizes
- Instagram story 9:16 aspect ratio crops significantly from 16:9 hero - smart cropping handles automatically
- Background-figures composition chosen for hero image over hands-only or no-people alternatives
- Explicit diversity language required for AI generation: "diverse women" produces homogeneous output
- "Skin tone spectrum" phrasing most effective for global majority representation
- Generation scripts cleaned from repo after completion
- No wizard flow for generate-image - inline parameters for batch generation (differs from tarot skill)
- Immediate image download to avoid 1-hour URL expiration
- 150ms delay between generations for rate limit compliance
- Prompt template locked to eco-futurist aesthetic

**Phase 11:**
- README structure: Opening + What Is This + Quick Start + Usage + Why Tarot + Deck + Philosophy

**Phase 10:**
- Tagline: "Ancient patterns, new paths" - balances High Priestess (ancient wisdom) with Chariot (forward momentum)
- Name: Keep "Esoterica" - none of the alternatives clearly beat the current name
- Direction: Ancestral wisdom theme - timeless, archetypal resonance
- Positioning: Perspective-shifting framework using tarot archetypes for complex decisions
- Dual-audience: True equality - neither developers nor practitioners are primary
- Voice: Cosmic priestess energy - knowledgeable, mysterious, playful, confident

### Phase 12 Deliverables

**Plan 12-01:** Generate-image skill for agentic image generation:
- `skills/generate-image/SKILL.md` - Skill documentation with eco-futurist aesthetic guide
- `skills/generate-image/src/replicate-client.ts` - Replicate API client with async polling
- `skills/generate-image/src/prompt-builder.ts` - Eco-futurist prompt templates
- `skills/generate-image/src/index.ts` - Main generateImages function with rate limiting
- HERO_PROMPT_CONFIG with Joshua Tree altar scene and tagline cards

**Plan 12-02:** Hero image with diversity representation:
- `brand/hero/winners/hero-primary.png` - Selected hero image (background-figures skin-tone-spectrum composition)
- Archive of 29 variations preserved locally at ~/Pictures/esoterica-hero-archive/
- Prompt learnings on AI diversity representation (explicit language required)

**Plan 12-03:** Social media & favicon assets from hero image:
- `brand/social/` - 5 social media variants (OG, LinkedIn, Twitter, Instagram square/story)
- `brand/favicon/` - Favicon set (SVG source + 3 PNG sizes)
- `skills/generate-image/generate-social-assets.ts` - Social variant generator with smart cropping
- `skills/generate-image/generate-favicons.ts` - Favicon PNG generator from SVG

**Plan 12-04:** Visual language documentation:
- `brand/COLOR_PALETTE.md` - 6 brand colors extracted from hero with hex/RGB values and usage guidelines
- `brand/BRAND_GUIDE.md` - Comprehensive visual language documentation with typography, imagery rules, asset specs
- `brand/scripts/extract-palette.ts` - TypeScript extraction script template
- `skills/generate-image/extract-palette.mjs` - Working extraction script using get-image-colors

### Phase 11 Deliverables

- `README.md` - 160 lines with Esoterica voice, installation, usage examples

### Phase 10 Deliverables

Complete positioning suite ready for downstream phases:
- `brand/positioning-statement.md` - Four-part framework with tagline and card themes
- `brand/audience-framing.md` - Dual-audience messaging paths with sample content
- `brand/voice-guidelines.md` - Tone spectrum, language rules, 10 example transformations

### Pending Todos

- [ ] Let users save readings to file
- [ ] Debug ugly argument parsing in Skill
- [ ] Split tarot card descriptions from main skill
- [ ] Explore subagent benefits for tarot skill
- [ ] Integrate tarot with GSD workflow while keeping independence
- [ ] Remove .claude-plugin directory (not configured properly)
- [ ] Add npx installation support (like get-shit-done)
- [ ] Add contribution policy - coven members only (no random PRs)

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-01-25
Stopped at: Completed 12-04-PLAN.md (visual language documentation)
Resume file: None

## Next Steps

1. Phase 12 (Visual Language) complete - all brand assets and documentation ready
2. Move to Phase 13: Landing Page
3. Integrate hero image, social meta tags, favicon, and apply brand guide (colors, typography) to web presence

---
*Last updated: 2026-01-25 after 12-04-PLAN.md completion*
