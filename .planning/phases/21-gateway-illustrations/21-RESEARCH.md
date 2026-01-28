# Phase 21: Gateway Illustrations - Research

**Researched:** 2026-01-28
**Domain:** Image prompt engineering (Nano Banana Pro), CSS layout/breakout patterns, CSS filter-based theme adaptation, Intersection Observer scroll-reveal, Astro static image handling
**Confidence:** HIGH

## Summary

Phase 21 adds three Gateway Process-style line art illustrations to the existing prose section of the landing page. The work breaks into three distinct domains: (1) generating illustration prompts for Nano Banana Pro via the existing Replicate-based `generate-image` skill, (2) integrating the resulting transparent PNGs into the Astro page with a CSS breakout layout wider than the 38rem prose column, and (3) adding theme-aware dark mode adaptation via CSS `filter: invert(1)` and scroll-triggered fade-in reveals via the Intersection Observer API.

The codebase already uses Astro with sharp-based image optimization, vanilla JS with zero runtime dependencies, and CSS custom properties for `data-theme` toggling. Phase 20 established the reduced-motion pattern (`@media (prefers-reduced-motion: reduce)`) that Phase 21 must follow for its animations. All three technologies (Intersection Observer, CSS filters, Astro Image component) are mature web platform features with universal browser support -- no external libraries are needed.

**Primary recommendation:** Place illustration PNGs in `site/src/assets/illustrations/` so Astro's sharp pipeline optimizes them. Use `format="png"` on the Astro `<Image>` component to preserve transparency (WebP conversion would also preserve transparency but PNG is specified in CONTEXT.md). Use a single shared `IntersectionObserver` instance for all three illustrations to minimize overhead. Apply `filter: invert(1)` via `[data-theme="dark"]` selector on the illustration wrapper class.

## Standard Stack

### Core

No external libraries needed. This phase uses only built-in web platform APIs and existing project tooling.

| API / Feature | Purpose | Why Standard |
|---------------|---------|--------------|
| Nano Banana Pro (Replicate API) | Generate line art illustrations from text prompts | Already integrated via `skills/generate-image`; outputs PNG at up to 4K |
| Astro `<Image>` component | Optimize and serve illustration PNGs with responsive srcset | Already used in `index.astro` for hero image; handles width/height/format |
| `IntersectionObserver` | Trigger fade-in animation when illustrations enter viewport | Baseline since 2017; 97%+ browser support; W3C standard |
| CSS `filter: invert()` | Adapt dark-line-on-transparent illustrations for dark mode | Universal support; single property, no JS needed |
| CSS custom properties | Theme-aware styling via `[data-theme]` selectors | Already established pattern in `global.css` |

### Supporting

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `sharp` (via Astro) | Image optimization at build time | Automatic -- Astro runs sharp on `<Image>` component imports |
| CSS `transform: translateY()` + `opacity` | GPU-accelerated fade+slide animation | For the scroll reveal entrance effect |
| `<figure>` / `<figcaption>` | Semantic HTML for illustration + caption | Accessibility best practice for images with captions |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS `filter: invert(1)` for dark mode | Separate dark-mode image assets | Double the image generation work and file size; invert is simpler and CONTEXT.md specifies trying invert first |
| `IntersectionObserver` | CSS `animation-timeline: view()` | CSS scroll-driven animations are too new (Chrome 145+, Safari 26+); not production-ready for broad support |
| Astro `<Image>` (src/assets) | Raw `<img>` in `public/` | Loses automatic optimization, responsive srcset, and build-time validation |
| PNG format preserved | WebP conversion | WebP supports transparency and is smaller, but CONTEXT.md explicitly specifies PNG; could revisit if file sizes are problematic |
| Single shared IntersectionObserver | One observer per illustration | Multiple observers waste memory; a single observer handles all three elements efficiently |

## Architecture Patterns

### Recommended File Structure

```
site/
├── src/
│   ├── assets/
│   │   ├── hero-primary.png           # existing
│   │   └── illustrations/             # NEW
│   │       ├── pattern-recognition.png
│   │       ├── interrupting-linear.png
│   │       └── ancient-modern.png
│   ├── pages/
│   │   └── index.astro                # MODIFIED (add illustration markup)
│   ├── scripts/
│   │   ├── scroll-scrubber.js         # existing (no changes)
│   │   └── scroll-reveal.js           # NEW (IntersectionObserver for illustrations)
│   └── styles/
│       └── global.css                 # MODIFIED (add illustration styles)
└── public/                            # no changes
```

### Pattern 1: CSS Breakout Layout for Illustrations

**What:** Illustrations break out of the 38rem prose column to roughly 60-70rem, creating visual breathing room while the text stays narrow.

**When to use:** When an element inside a constrained-width container needs to be wider than its parent.

**Example:**
```css
/* Source: common CSS layout pattern */
.illustration {
  /* Break out of .prose-inner (max-width: 38rem) */
  width: 100vw;
  max-width: 65rem;
  margin-left: 50%;
  transform: translateX(-50%);
  padding: 3rem 0;
}

.illustration img {
  width: 100%;
  height: auto;
  display: block;
}
```

**Why this approach:** The `margin-left: 50%; transform: translateX(-50%)` pattern centers a wider element relative to the viewport, regardless of the parent's `max-width`. This is more reliable than negative margins because it doesn't depend on knowing the parent's exact width.

### Pattern 2: Theme-Aware Illustration via CSS Filter

**What:** Invert dark-line-on-transparent illustrations for dark mode using CSS `filter: invert(1)`.

**When to use:** When illustrations are line art with dark strokes on transparent backgrounds, and the page background changes between light and dark.

**Example:**
```css
/* Source: MDN CSS filter: invert() */
[data-theme="dark"] .illustration img {
  filter: invert(1);
}
```

**Recommendation on filter formula:** For pure black-on-transparent line art, `filter: invert(1)` alone is sufficient -- it turns black (#000) lines to white (#FFF) against the dark `--bg-page`. No `hue-rotate()` is needed because there are no chromatic colors to shift. If the illustrations include subtle color tints (e.g., gold or muted earth tones), use `filter: invert(1) hue-rotate(180deg)` to preserve the original hue while inverting lightness.

**Transparent background note:** `invert()` on a transparent pixel produces a transparent pixel (inverting rgba(0,0,0,0) yields rgba(255,255,255,0) which is still transparent). This means transparent PNGs work correctly with invert -- only the visible strokes are affected.

### Pattern 3: Intersection Observer Scroll Reveal

**What:** Fade + slide up animation triggered when each illustration enters the viewport.

**When to use:** For scroll-triggered entrance animations with zero runtime dependencies.

**Example:**
```javascript
// Source: MDN IntersectionObserver API + project conventions (vanilla JS IIFE)
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const illustrations = document.querySelectorAll('.illustration');
  if (!illustrations.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  illustrations.forEach((el) => observer.observe(el));
})();
```

```css
/* Hidden state (initial) */
.illustration {
  opacity: 0;
  transform: translateY(2rem);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

/* Revealed state */
.illustration.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Reduced motion: always visible, no animation */
@media (prefers-reduced-motion: reduce) {
  .illustration {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

**Key decisions:**
- `threshold: 0.15` triggers when 15% of the illustration is visible -- feels natural for a tall image entering from below.
- `unobserve` after reveal prevents re-triggering (one-time animation).
- GPU-accelerated properties only (`opacity`, `transform`) -- no layout thrashing.
- Reduced-motion users see illustrations immediately with no animation, matching Phase 20 patterns.

### Pattern 4: Astro Image Component for Illustration PNGs

**What:** Use Astro's `<Image>` component to optimize illustrations at build time while preserving PNG transparency.

**When to use:** For any image in `src/assets/` that needs optimization.

**Example:**
```astro
---
import { Image } from 'astro:assets';
import patternImg from '../assets/illustrations/pattern-recognition.png';
---

<figure class="illustration">
  <Image
    src={patternImg}
    alt="Geometric pattern of concentric circles intersecting with a tarot card spread"
    width={1200}
    format="png"
    loading="lazy"
  />
  <figcaption>Pattern Recognition</figcaption>
</figure>
```

**Why `format="png"`:** Astro defaults to WebP conversion, which supports transparency but CONTEXT.md specifies PNG. Using `format="png"` preserves the original format while still applying sharp optimization (lossless compression, metadata stripping). If file sizes become problematic, WebP is a valid fallback since it also supports alpha channels.

### Anti-Patterns to Avoid

- **Placing illustrations in `public/` instead of `src/assets/`:** Bypasses Astro's image optimization pipeline. Images in `public/` are served as-is with no responsive srcset, no build-time validation, and no compression. Always use `src/assets/` with the `<Image>` component.
- **Creating a separate IntersectionObserver per illustration:** Wastes memory and CPU. A single observer can handle all three elements.
- **Using `scroll` event listener for reveal:** The codebase already has a scroll listener in `scroll-scrubber.js` for the hero video. Adding another scroll handler for the prose section introduces unnecessary scroll event overhead. IntersectionObserver is specifically designed for this use case and runs off the main thread.
- **Applying `filter: invert(1)` to the `<figure>` instead of the `<img>`:** This would also invert the caption text, which is already handled by CSS custom properties. Target only the `img` element.
- **Animating `width`, `height`, or `margin` for the reveal:** These trigger layout recalculation. Stick to `opacity` and `transform` for GPU-accelerated, jank-free animations.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image optimization | Manual sharp/imagemin scripts | Astro `<Image>` component with `format="png"` | Astro handles responsive srcset, lazy loading, width/height, and build-time optimization automatically |
| Scroll-triggered reveal | Custom scroll event + getBoundingClientRect | `IntersectionObserver` API | Purpose-built for element visibility detection; runs asynchronously off main thread; already in all browsers |
| Dark mode image adaptation | Generating separate dark-mode illustration assets | CSS `filter: invert(1)` on `[data-theme="dark"]` | Single line of CSS; no extra image generation cost; works for black-on-transparent line art |
| Breakout layout | JavaScript to measure and resize elements | CSS `margin-left: 50%; transform: translateX(-50%)` | Pure CSS, no JS, works with any parent width |
| Reduced-motion handling | Custom motion detection | `@media (prefers-reduced-motion: reduce)` + `matchMedia` guard | W3C standard; already established in Phase 20 |
| Image prompt generation | Writing prompts from scratch | Structured prompt template with Nano Banana Pro's recommended format | The model responds best to `[Subject + Adjectives] in [Context]. [Composition]. [Style/Media]` structure |

**Key insight:** This phase adds only 3 new files (3 illustration PNGs), 1 new script (`scroll-reveal.js`), and modifies 2 existing files (`index.astro`, `global.css`). The scope is deliberately small -- the complexity is in the prompt engineering, not the code.

## Common Pitfalls

### Pitfall 1: Astro Converts PNG to WebP, Losing Intentional Format

**What goes wrong:** Astro's default image optimization converts all images to WebP. If you don't specify `format="png"`, the transparent PNG becomes a WebP file.
**Why it happens:** Astro's sharp integration defaults to WebP for smaller file sizes.
**How to avoid:** Explicitly set `format="png"` on the `<Image>` component. WebP also supports transparency, so this is a preference issue rather than a functional one, but CONTEXT.md specifies PNG.
**Warning signs:** Build output shows `.webp` extensions for illustration files.

### Pitfall 2: CSS Filter Invert Affects Caption Text

**What goes wrong:** If `filter: invert(1)` is applied to the `<figure>` container, both the image AND the caption text get inverted.
**Why it happens:** CSS `filter` applies to the entire element subtree.
**How to avoid:** Target the selector to `.illustration img` only, not `.illustration`.
**Warning signs:** Caption text turns white-on-dark in light mode or black-on-light in dark mode.

### Pitfall 3: Illustrations Invisible on Page Load (No-JS Fallback)

**What goes wrong:** If illustrations start with `opacity: 0` in CSS and the IntersectionObserver JS fails to load, illustrations remain invisible forever.
**Why it happens:** The hidden state is set in CSS but the reveal depends on JavaScript.
**How to avoid:** Set `opacity: 0` only when JavaScript is available. Use a `.js-loaded` class on `<html>` or use the `<noscript>` pattern. Alternatively, rely on Astro's SSR to add a class indicating JS support, or simply accept that the site requires JS (it already does for theme toggle, copy button, and scroll video).
**Warning signs:** Illustrations not visible with JavaScript disabled.
**Recommendation:** Since the site already requires JS for core features (theme toggle, scroll video), set the hidden state in CSS and accept JS as a dependency. Add a `<noscript>` CSS override if desired: `noscript .illustration { opacity: 1; transform: none; }`.

### Pitfall 4: Breakout Layout Causes Horizontal Scrollbar

**What goes wrong:** Using `width: 100vw` on the illustration creates a horizontal scrollbar because `100vw` includes the scrollbar width.
**Why it happens:** `vw` units include scrollbar width on most browsers, but the page content area is narrower.
**How to avoid:** Use `width: min(100vw, 65rem)` and set `overflow-x: hidden` on the prose section or body. Alternatively, use `width: calc(100vw - var(--scrollbar-width))` but this is more complex.
**Warning signs:** Horizontal scrollbar appears when illustrations are in view.
**Recommendation:** Set `overflow-x: hidden` on `.prose` or use `overflow-x: clip` (newer, better -- clips without creating a new scroll context). Test on Windows where scrollbars are visible by default.

### Pitfall 5: Nano Banana Pro Generates Background Instead of Transparent

**What goes wrong:** The generated illustrations have solid white or colored backgrounds instead of transparency.
**Why it happens:** AI image generation models don't natively generate transparent backgrounds. Even when prompted with "transparent background," the model may interpret this as a white or light background.
**How to avoid:** Generate with an explicit white background, then use a background removal tool (e.g., `rembg`, sharp's `removeAlpha`, or Replicate's background removal models) to create transparency. Alternatively, prompt for "white background, clean line art" and then remove the white background in post-processing.
**Warning signs:** PNGs have solid white backgrounds instead of transparency when placed on `--bg-page`.
**Recommendation:** Accept that post-processing may be needed. The `generate-image` skill already outputs PNG. After generation, use an image editing step to remove the white background, or consider whether a white background is acceptable (on the light theme, white-on-`#FAF9F6` is nearly invisible; on dark theme with `invert(1)`, white becomes black which would show against `#1A1A1A`). If true transparency is critical, plan for a background removal step.

### Pitfall 6: Illustration File Size Too Large

**What goes wrong:** High-resolution PNG illustrations with fine line detail can be very large (5-10MB each).
**Why it happens:** PNG is lossless; detailed illustrations with anti-aliased lines produce large files even with transparency.
**How to avoid:** Generate at 2K resolution (not 4K) to keep file sizes manageable. Astro's sharp pipeline will further optimize. If sizes are still too large (>500KB per image), consider switching to WebP format which compresses better while preserving transparency.
**Warning signs:** Page load time increases significantly; Lighthouse flags large image payloads.
**Recommendation:** Generate at 2K, let Astro optimize, check resulting sizes. Target under 300KB per illustration after optimization.

## Code Examples

### Example 1: Nano Banana Pro Prompt Templates

Three illustration prompts, one per prose theme. Structured per Replicate's recommended format: `[Subject + Adjectives] in [Context]. [Composition]. [Style/Media]`.

```
Illustration 1 - Pattern Recognition:
"A minimalist line art illustration of concentric circles emanating from a central eye symbol, with tarot card outlines (The Fool, The High Priestess, The Wheel of Fortune) subtly woven into the geometric pattern. Sacred geometry elements: Vesica piscis forms where circles overlap. Fine black ink lines on pure white background, no shading, no fill, clean vector-style illustration with subtle golden ratio proportions. Technical drawing aesthetic with mystical undertones."

Illustration 2 - Interrupting Linear Thinking:
"A minimalist line art illustration showing a straight horizontal line that fractures into a spiraling Fibonacci sequence, with a tarot card (The Tower) emerging from the break point. Sacred geometry: hexagram star pattern radiating from the disruption. Monroe Institute-style concentric focus level rings in the background, barely visible. Fine black ink lines on pure white background, no shading, no fill, architectural blueprint aesthetic with esoteric symbols."

Illustration 3 - Ancient Meets Modern:
"A minimalist line art illustration of a terminal window frame containing an unfolding Flower of Life pattern, with circuit board traces flowing into and merging with the sacred geometry. A single tarot card (The Hermit holding a lantern) integrated into the geometry as a node in the pattern. Fine black ink lines on pure white background, no shading, no fill, technical schematic meets illuminated manuscript aesthetic."
```

**Prompt structure notes:**
- Each prompt explicitly requests "fine black ink lines on pure white background, no shading, no fill" -- this maximizes contrast for `filter: invert(1)` dark mode adaptation.
- Sacred geometry references are specific (Vesica piscis, Flower of Life, hexagram, Fibonacci) but blended with tarot imagery -- "a wink for those who get it."
- Gateway Process references are subtle: "concentric focus level rings," "concentric circles emanating" echo Monroe Institute diagrams without naming them.
- All three share consistent style language for visual cohesion.

**Generation parameters:**
```
aspect_ratio: "3:2"    (landscape, wider than tall -- matches breakout layout)
resolution: "2K"       (balance of quality and file size)
output_format: "png"   (already configured in replicate-client.ts)
variations: 3-5        (generate options, pick best)
```

### Example 2: Complete Illustration HTML Markup in index.astro

```astro
---
import { Image } from 'astro:assets';
import patternImg from '../assets/illustrations/pattern-recognition.png';
import interruptImg from '../assets/illustrations/interrupting-linear.png';
import ancientModernImg from '../assets/illustrations/ancient-modern.png';
---

<!-- Inside .prose-inner, between paragraph groups -->

<!-- After paragraphs 1-2 (pattern recognition theme) -->
<figure class="illustration">
  <Image
    src={patternImg}
    alt="Geometric line drawing of concentric circles with tarot card outlines woven into sacred geometry patterns"
    width={1200}
    format="png"
    loading="lazy"
  />
  <figcaption>Pattern Recognition</figcaption>
</figure>

<!-- After paragraphs 3-4 (interrupting linear thinking theme) -->
<figure class="illustration">
  <Image
    src={interruptImg}
    alt="Line drawing of a straight line fracturing into a Fibonacci spiral with The Tower card emerging from the break"
    width={1200}
    format="png"
    loading="lazy"
  />
  <figcaption>Interrupting Linear Thinking</figcaption>
</figure>

<!-- After paragraphs 5-6 (ancient meets modern theme) -->
<figure class="illustration">
  <Image
    src={ancientModernImg}
    alt="Line drawing of a terminal window containing a Flower of Life pattern merging with circuit board traces"
    width={1200}
    format="png"
    loading="lazy"
  />
  <figcaption>Ancient Wisdom, Modern Vessels</figcaption>
</figure>
```

### Example 3: Complete CSS for Illustrations

```css
/* ===== ILLUSTRATIONS ===== */
.illustration {
  /* Breakout from 38rem prose column */
  width: 100vw;
  max-width: 65rem;
  margin-left: 50%;
  transform: translateX(-50%);
  padding: 3rem 0;
  text-align: center;
}

.illustration img {
  width: 100%;
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

/* Theme adaptation: invert for dark mode */
[data-theme="dark"] .illustration img {
  filter: invert(1);
}

/* Caption styling */
.illustration figcaption {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-prose-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 1rem;
}

/* Scroll reveal: hidden state */
.illustration {
  opacity: 0;
  transform: translateX(-50%) translateY(2rem);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

/* Scroll reveal: visible state */
.illustration.is-visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* Reduced motion: always visible */
@media (prefers-reduced-motion: reduce) {
  .illustration {
    opacity: 1 !important;
    transform: translateX(-50%) !important;
  }
}

/* Prevent horizontal scrollbar from breakout */
.prose {
  overflow-x: clip;
}

/* Mobile: constrain breakout */
@media (max-width: 640px) {
  .illustration {
    width: calc(100vw - 2rem);
    padding: 2rem 0;
  }
}
```

**Important CSS note:** The breakout pattern uses `transform: translateX(-50%)` as the base transform. The scroll reveal adds `translateY(2rem)` to this. Both transforms must be combined: `transform: translateX(-50%) translateY(2rem)` for hidden state, `transform: translateX(-50%) translateY(0)` for visible state. The reduced-motion override resets to just `translateX(-50%)` (the breakout centering).

### Example 4: Complete Scroll Reveal Script

```javascript
// site/src/scripts/scroll-reveal.js
(function() {
  // Respect reduced-motion preference (consistent with Phase 20)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var illustrations = document.querySelectorAll('.illustration');
  if (!illustrations.length) return;

  var observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  illustrations.forEach(function(el) {
    observer.observe(el);
  });
})();
```

**Options rationale:**
- `threshold: 0.15` -- triggers when 15% of the illustration is visible. For a tall landscape illustration, this means the top portion is well into view before the animation fires.
- `rootMargin: '0px 0px -50px 0px'` -- shrinks the bottom edge of the viewport by 50px, meaning the illustration must be at least 50px above the viewport bottom to trigger. This prevents animations firing when only the very tip of an element peeks in.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| jQuery scroll handlers for reveal animations | IntersectionObserver API | Baseline 2017, widespread adoption ~2019 | No scroll event overhead; browser-native visibility detection |
| Libraries like AOS, ScrollReveal, Sal.js | Vanilla IntersectionObserver (for small scope) | ~2020 as browser support matured | Zero dependencies; 15 lines of JS replaces a library |
| Separate dark/light image assets | CSS `filter: invert()` for simple line art | Practical since ~2019 | Halves the number of image assets; single CSS property |
| Manual image compression pipelines | Framework-integrated (Astro `<Image>`) | Astro image optimization ~2023 | Automatic srcset, format selection, lazy loading |
| CSS scroll-driven animations (`animation-timeline: view()`) | IntersectionObserver + CSS transitions | scroll-driven animations: Chrome 145+, Safari 26+ (2025-2026) | Too new for production; IO remains the reliable choice |

**Deprecated/outdated:**
- `getBoundingClientRect()` in scroll handlers for visibility: Replaced by IntersectionObserver. Still valid but wasteful for this use case.
- jQuery Waypoints / ScrollMagic: Replaced by native IntersectionObserver. These add unnecessary weight.
- `@supports` for filter: `filter: invert()` has 97%+ browser support. No need for feature detection or fallback.

## Open Questions

1. **Nano Banana Pro transparent background output**
   - What we know: AI models typically generate solid backgrounds even when prompted for transparency. The Replicate API outputs PNG (already configured in `replicate-client.ts`), but the PNG will likely have a white or near-white background, not true transparency.
   - What's unclear: Whether Nano Banana Pro can produce true transparent backgrounds with the right prompt, or if post-processing (background removal) will always be needed.
   - Recommendation: Generate illustrations with "pure white background" explicitly in the prompt. Then test: if the white is close enough to `--bg-page` (#FAF9F6) on light mode, it may be acceptable as-is. If not, plan a background removal step using `rembg` or manual editing. For dark mode with `invert(1)`, a white background becomes black -- which is close to `--bg-page` dark (#1A1A1A) but not exact. True transparency is ideal if achievable.

2. **Exact prose paragraph placement for illustrations**
   - What we know: CONTEXT.md maps three themes to the prose -- (1) pattern recognition, (2) interrupting linear thinking, (3) ancient-meets-modern. The prose has 8 paragraphs plus the h2 heading.
   - What's unclear: Exactly which paragraph breaks work best visually.
   - Recommendation (Claude's discretion per CONTEXT.md): Place illustrations after paragraphs 2, 4, and 6. This creates a rhythm of ~2 paragraphs, illustration, ~2 paragraphs, illustration, ~2 paragraphs, illustration, final CTA paragraph + install block.

3. **Filter formula for illustrations with color tints**
   - What we know: Pure black-on-transparent works perfectly with `filter: invert(1)`. If illustrations include subtle color (gold, earth tones), `hue-rotate(180deg)` can correct the hue shift caused by inversion.
   - What's unclear: Whether the generated illustrations will be purely monochrome or include color.
   - Recommendation: Start with `filter: invert(1)`. If the generated illustrations have color elements, test `invert(1) hue-rotate(180deg)`. This is in Claude's discretion per CONTEXT.md.

## Sources

### Primary (HIGH confidence)
- [MDN: IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) - Constructor options, threshold, rootMargin, callback entry properties
- [MDN: CSS filter: invert()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/invert) - Syntax, values, behavior with transparency
- [Astro Image Component docs (Context7: /withastro/docs)](https://docs.astro.build/en/reference/modules/astro-assets/) - `<Image>` component props, format, width, layout options
- [Replicate: Nano Banana Pro API](https://replicate.com/google/nano-banana-pro) - Input schema: prompt, resolution, aspect_ratio, output_format parameters
- Local codebase analysis: `skills/generate-image/src/replicate-client.ts` confirms `output_format: "png"` already configured

### Secondary (MEDIUM confidence)
- [Replicate blog: How to prompt Nano Banana Pro](https://replicate.com/blog/how-to-prompt-nano-banana-pro) - Prompt structure: `[Subject + Adjectives] in [Context]. [Composition]. [Style/Media]`
- [Yihui Xie: Dark mode with filter invert](https://yihui.org/en/2023/09/dark-mode/) - CSS invert for selective image dark mode adaptation; transparent background caveat
- [dev.to: Fade-in animation with IntersectionObserver (Vanilla JS)](https://dev.to/miacan2021/fade-in-animation-on-scroll-with-intersectionobserver-vanilla-js-4p27) - Pattern: CSS transition + JS class toggle + unobserve after reveal
- [MROY Club: Scroll animations techniques 2025](https://mroy.club/articles/scroll-animations-techniques-and-considerations-for-2025) - Best practices for animation duration (~250ms sweet spot), GPU-accelerated properties

### Tertiary (LOW confidence)
- [Medium: Generating transparent backgrounds with Nano Banana Pro 2](https://jidefr.medium.com/generating-transparent-background-images-with-nano-banana-pro-2-1866c88a33c5) - Reports difficulty achieving true transparency; suggests post-processing (403 on fetch -- couldn't verify details)
- [GitHub: awesome-nanobanana-pro prompts](https://github.com/ZeroLu/awesome-nanobanana-pro) - Line art mode settings; community prompt examples

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All APIs are mature web standards with universal support; Astro Image component verified via Context7
- Architecture: HIGH - Breakout layout, IntersectionObserver pattern, and CSS filter inversion are well-established techniques verified across multiple authoritative sources
- Pitfalls: HIGH - Horizontal scrollbar issue, filter targeting, and transform combination gotchas are well-documented
- Prompt engineering: MEDIUM - Nano Banana Pro prompting best practices are documented by Replicate, but transparent background generation success rate is uncertain (one source reports difficulty)
- Image post-processing: LOW - Whether background removal will be needed depends on generation results; can't pre-verify

**Research date:** 2026-01-28
**Valid until:** 2026-02-28 (stable domain; all browser APIs are mature; Nano Banana Pro API is stable)
