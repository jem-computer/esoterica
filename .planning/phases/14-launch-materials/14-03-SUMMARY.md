---
phase: 14-launch-materials
plan: 03
status: complete
completed: 2026-01-26
duration: ~25 min (including revision cycle)
commits:
  - 64faa54: "feat(14-03): generate LinkedIn carousel slides"
  - 03c7e95: "feat(14-03): render demo video to MP4 and GIF"
  - a177161: "fix(14-03): regenerate carousel with New Spirit + Input Mono fonts"
---

## Summary

Generated LinkedIn carousel slides and rendered demo video for launch materials.

## What Was Built

### LinkedIn Carousel (brand/launch/carousel/)
- 6 slides at 1080x1350px (4:5 portrait ratio for LinkedIn)
- **Fonts:** New Spirit Medium (headings), Input Mono (terminal)
- **Composition:** Hero crop centers on computer + tarot cards
- Reproducible via `generate-slides.sh`

| Slide | Content | Background |
|-------|---------|------------|
| 1 | Hook - "What if your AI agent could draw tarot cards?" | Hero + overlay |
| 2 | Problem - "Complex decisions need more than logic" | Warm white |
| 3 | Solution - "Esoterica" | Warm neutral |
| 4 | Demo - terminal output | Terminal dark |
| 5 | Install command | Terminal dark |
| 6 | CTA - "Ancient patterns, new paths" | Hero + overlay |

### Demo Video (demo/out/)
- `demo.mp4` - 60 seconds, 3.4MB, 1920x1080
- `demo.gif` - 60 seconds, 1.04MB (scaled 50%)
- Rendered via Remotion from demo/ project

## Deviations

1. **Carousel generation method:** Used ImageMagick instead of Canva for programmatic generation. Allows reproducibility via script.

2. **Font revision:** Initial generation used wrong fonts. Regenerated with New Spirit Medium + Input Mono after user feedback.

3. **Composition revision:** Initial hero crop cut off focal point (computer + cards). Adjusted to use South gravity with offset to center on key elements.

## Human Verification

**Status:** Approved with note "not perfect yet but let's keep going and we can tweak as needed"

**Reviewed:**
- [x] LinkedIn posts (brand/launch/linkedin-posts.md)
- [x] Carousel slides (brand/launch/carousel/)
- [x] Demo video (demo/out/demo.mp4)
- [x] OG meta tags (docs/index.html)

## Files Created/Modified

- `brand/launch/carousel/slide-01.png` through `slide-06.png`
- `brand/launch/carousel/generate-slides.sh`
- `demo/out/demo.mp4` (gitignored)
- `demo/out/demo.gif` (gitignored)

## Next Steps

Phase 14 and v1.2 Brand & Marketing milestone complete. Launch checklist:
- [ ] Enable GitHub Pages (Settings → Pages → main → /docs)
- [ ] Test OG tags at https://metatags.io/
- [ ] Post LinkedIn teaser
- [ ] Post LinkedIn announcement with demo video
