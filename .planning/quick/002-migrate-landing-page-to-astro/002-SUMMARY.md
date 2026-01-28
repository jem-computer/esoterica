---
quick: 002
type: execute
subsystem: landing-page
tags: [astro, image-optimization, performance, github-pages]
requires: [docs/index.html static page, brand assets]
provides: [astro site, optimized hero image, extensible docs structure]
affects: []
tech-stack:
  added: [astro@5.0, sharp@0.33]
  patterns: [astro build pipeline, image optimization, static site generation]
key-files:
  created:
    - site/astro.config.mjs
    - site/src/layouts/Base.astro
    - site/src/pages/index.astro
    - site/src/styles/global.css
  modified:
    - docs/index.html
    - docs/_assets/ (optimized images)
decisions:
  - slug: astro-output-to-docs
    what: Configure Astro outDir to ../docs for GitHub Pages
    why: GitHub Pages serves from docs/ directory on main branch
    alternatives: [Build to dist/ and copy, Use gh-pages branch]
  - slug: hero-image-in-assets
    what: Place hero-primary.png in src/assets/ not public/
    why: Assets in src/assets/ get optimized by Astro, public/ served as-is
    impact: Hero reduced from 7.1MB to 268KB webp
  - slug: absolute-positioned-hero
    what: Use absolute positioned Image component instead of CSS background
    why: Astro Image component requires img tag, can't optimize CSS backgrounds
    tradeoff: Slight HTML structure change but identical visual result
metrics:
  duration: 4m 9s
  completed: 2026-01-27
---

# Quick Task 002: Migrate landing page to Astro

**One-liner:** Migrated static landing page to Astro with image optimization reducing hero from 7.1MB to 268KB webp while maintaining identical appearance.

## Objective

Replace the static `docs/index.html` landing page with an Astro-built version to enable:
1. Automatic image optimization (hero image was 7MB)
2. Future documentation page extensibility
3. Better asset management and build pipeline

## What Was Built

### Astro Project Structure

Created `site/` directory with full Astro 5.0 setup:
- **astro.config.mjs**: Configured to build to `../docs` for GitHub Pages compatibility
- **Base layout**: Reusable layout with meta tags, theme detection, fonts
- **Index page**: Landing page using Astro's Image component for optimization
- **Global CSS**: Extracted all styles from static HTML with iOS Safari fixes

### Image Optimization Achievement

**Before:** hero-primary.png = 7.1MB (7241KB)
**After:** hero-primary.9g873-g2_1hkql3.webp = 268KB

**96.3% size reduction** while maintaining visual quality at 80% quality setting.

### Technical Implementation

1. **Hero image handling:**
   - Source image in `src/assets/` for Astro optimization pipeline
   - Changed from CSS `background-image` to absolute positioned `<Image>` component
   - Added iOS Safari fix using `@supports (-webkit-touch-callout: none)`

2. **Asset organization:**
   - Fonts, favicons, og-image in `public/` (served as-is)
   - Hero image in `src/assets/` (optimized during build)
   - Build outputs to `docs/_assets/` for optimized files

3. **Build configuration:**
   - Site: `https://jem-computer.github.io`
   - Base: `/esoterica`
   - OutDir: `../docs` (GitHub Pages directory)
   - Assets: `_assets` (scoped directory for build artifacts)

## Tasks Completed

| Task | Name | Commit | Files | Duration |
|------|------|--------|-------|----------|
| 1 | Initialize Astro project | de99d76 | package.json, astro.config.mjs, tsconfig.json | ~1m |
| 2 | Copy static assets | 7d6cc4e | fonts/, favicons, hero source image | ~1m |
| 3 | Create Astro components | 7f93398 | global.css, Base.astro, index.astro | ~1m |
| 4 | Build and verify output | 50316e9 | docs/index.html, docs/_assets/ | ~1m |

**Total:** 4 tasks, 4 commits, 4m 9s

## Commits

```
de99d76 chore(quick-002): initialize Astro project with docs/ output configuration
7d6cc4e chore(quick-002): copy static assets and source images
7f93398 feat(quick-002): create Astro components with optimized image handling
50316e9 feat(quick-002): build Astro site with optimized hero image
```

## Deviations from Plan

None - plan executed exactly as written.

## Technical Decisions

### 1. Astro outDir to ../docs for GitHub Pages
**Context:** GitHub Pages serves from docs/ directory on main branch.
**Decision:** Configure Astro's `outDir: '../docs'` to build directly to GitHub Pages location.
**Alternatives considered:**
- Build to dist/ and copy with script
- Use gh-pages branch deployment
**Outcome:** Simplest approach, no extra build steps needed.

### 2. Hero image in src/assets/ vs public/
**Context:** Astro optimizes images in src/assets/, serves public/ as-is.
**Decision:** Place hero-primary.png in src/assets/ for optimization.
**Impact:** 96.3% size reduction (7.1MB → 268KB)
**Tradeoff:** Can't use CSS background-image, must use Image component with absolute positioning.

### 3. Absolute positioned Image vs CSS background
**Context:** Astro Image component requires <img> tag, can't optimize CSS backgrounds.
**Decision:** Changed hero structure from CSS background to absolute positioned Image.
**Implementation:**
```css
.hero { position: relative; overflow: hidden; }
.hero-bg { position: absolute; inset: 0; z-index: 0; }
.header, .main, .footer { position: relative; z-index: 10; }
```
**Outcome:** Identical visual appearance, massive performance gain.

### 4. iOS Safari background-attachment fix
**Context:** iOS Safari doesn't support `background-attachment: fixed`.
**Decision:** Added `@supports (-webkit-touch-callout: none)` to disable fixed positioning on iOS.
**Note:** With absolute positioned Image, this becomes less critical but kept for robustness.

## Verification Results

All success criteria met:

- [x] Astro builds without errors
- [x] Hero image optimized to 268KB (target: <500KB) ✓
- [x] Visual appearance matches original static page
- [x] Theme toggle works with localStorage persistence
- [x] Copy button copies command to clipboard
- [x] iOS Safari background handling correct
- [x] docs/index.html is Astro-generated
- [x] GitHub Pages deployment ready

## Performance Metrics

**Image Optimization:**
- Source: 7241KB PNG
- Output: 268KB WebP
- Reduction: 96.3%
- Format: WebP (modern, high compression)
- Quality: 80% (optimal balance)

**Build Performance:**
- Total build time: ~2 seconds
- Image optimization: 1.2 seconds
- Static generation: 13ms

**Page Load Impact:**
- Before: 7MB+ page load
- After: ~300KB total (including CSS)
- Expected LCP improvement: 80-90% faster

## Next Phase Readiness

**Blockers:** None

**Concerns:** None

**Recommendations:**
1. Consider adding sitemap plugin for SEO
2. Could add RSS feed for future blog posts
3. May want to configure content collections for docs pages

## Future Extensibility

The Astro structure enables:
- Additional documentation pages (just add to `src/pages/`)
- Blog or release notes (content collections)
- Dynamic OG image generation
- Further image optimization (multiple formats, srcset)
- Component library for consistent styling

## Notes

**Why Astro over alternatives:**
- Built-in image optimization (primary goal)
- Zero JavaScript by default (performance)
- File-based routing (simple)
- GitHub Pages compatible (static output)

**Font files not optimized:** New Spirit fonts remain in public/ as WOFF/WOFF2. These are already optimized formats and small enough (37KB + 34KB).

**OG image not optimized:** og-image.png stays in public/ at original size because OG tags require stable absolute URLs. Could optimize in future if needed for social media performance.

---

**Migration complete.** Landing page now built from Astro with 96% smaller hero image while maintaining identical appearance and all functionality.
