# Phase 22: Footer + Polish - Research

**Researched:** 2026-01-29
**Domain:** Video scroll performance, Lighthouse optimization, footer semantics, cross-browser testing
**Confidence:** HIGH

## Summary

This phase addresses four distinct concerns: footer completion, video loading states, Lighthouse performance optimization, and cross-browser validation. The most significant discovery is that the current Chrome scroll animation lag is caused by video keyframe encoding - the video has only 1 keyframe across 242 frames, forcing Chrome to decode all preceding frames when seeking.

The footer implementation is straightforward semantic HTML. The Lighthouse 90+ target is achievable given the site's existing optimizations (Astro static site, WebP images, minimal JS). The cross-browser testing is manual verification across Chrome, Safari, Firefox, and Edge.

**Primary recommendation:** Re-encode the hero video with keyframes every 5-10 frames (`-g 10`) to fix Chrome scroll lag, then implement semantic footer and run Lighthouse audit.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| FFmpeg | 6.x+ | Video re-encoding for keyframes | Industry standard for video processing |
| Lighthouse | 12.x | Performance auditing | Chrome DevTools integrated, official Google tool |
| Vanilla JS | N/A | Loading state detection | Project constraint: zero runtime dependencies |

### Supporting
| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| Chrome DevTools Performance | Latest | Long Animation Frame debugging | Profile scroll jank, identify CPU bottlenecks |
| ffprobe | 6.x+ | Video analysis | Verify keyframe distribution after encoding |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Video currentTime | Canvas + frame images | 10x more complexity, storage; worth it only if re-encoding fails |
| Manual Lighthouse | PageSpeed Insights API | Automation; manual is fine for one-page site |

**No Installation Required:** All tools are external CLI utilities or browser built-ins. Project remains zero-runtime-dependency.

## Architecture Patterns

### Chrome Scroll Lag Root Cause Analysis

**Problem Identified:** Current `hero.mp4` has only 1 keyframe (I-frame) across 242 total frames:
```
$ ffprobe -show_entries frame=pict_type hero.mp4 | grep -c "^I"
1
```

**Why This Causes Lag:**
- When `video.currentTime` is set, browser must decode from nearest keyframe
- With 1 keyframe, Chrome decodes 0-241 frames for any seek position
- Safari reconstructs delta frames on-the-fly more efficiently (observed)
- Chrome stutters because main thread is blocked during decode

**Solution:** Re-encode with frequent keyframes:
```bash
ffmpeg -i hero.mp4 \
  -c:v libx264 \
  -crf 28 \
  -preset medium \
  -g 10 \
  -keyint_min 10 \
  -x264-params scenecut=0 \
  -profile:v main \
  -level 4.0 \
  -movflags +faststart \
  -an \
  hero-reencoded.mp4
```

**Key Parameters:**
- `-g 10`: Keyframe every 10 frames (0.4 seconds at 24fps)
- `-keyint_min 10`: Minimum keyframe interval
- `-x264-params scenecut=0`: Disable scene detection (consistent keyframe spacing)
- Other params preserved from v1.4 decisions

**Expected Impact:**
- File size increase: ~20-40% (keyframes are larger)
- Seek latency: decode max 10 frames vs 242
- Chrome performance: matches Safari smoothness

### Footer Semantic Structure

```html
<footer class="site-footer">
  <small>
    <a href="https://templeofsilicon.com"
       target="_blank"
       rel="noopener noreferrer">
      (c) 02026-, Temple of Silicon
    </a>
    <a href="https://github.com/jem-computer/esoterica"
       target="_blank"
       rel="noopener noreferrer"
       aria-label="View source on GitHub">
      <svg aria-hidden="true" ...><!-- GitHub icon --></svg>
    </a>
  </small>
</footer>
```

**Semantic Choices:**
- `<footer>` provides contentinfo landmark for screen readers
- `<small>` for copyright text (appropriate semantic use)
- `aria-label` on icon link (no visible text)
- `aria-hidden="true"` on decorative SVG

### Video Loading State Pattern

```javascript
// Show poster until video is ready for seeking
const video = document.getElementById('scroll-video');
const poster = document.querySelector('.hero-bg-poster');

video.addEventListener('canplaythrough', () => {
  poster.style.display = 'none';
});

// Fallback timeout (in case event doesn't fire)
setTimeout(() => {
  if (video.readyState >= 4) {
    poster.style.display = 'none';
  }
}, 3000);
```

**Note:** Safari may not fire `canplaythrough` until play() is called. The poster already exists in the markup; this adds explicit hide logic.

### Lighthouse 90+ Achievement Pattern

**Current Metric Weights (Lighthouse 12):**
| Metric | Weight | Target for 90+ |
|--------|--------|----------------|
| Total Blocking Time (TBT) | 30% | < 200ms |
| Largest Contentful Paint (LCP) | 25% | < 2.5s mobile, < 1.2s desktop |
| Cumulative Layout Shift (CLS) | 25% | < 0.1 |
| First Contentful Paint (FCP) | 10% | < 1.8s |
| Speed Index (SI) | 10% | < 4.3s |

**Site Advantages:**
- Astro static site (minimal JS, zero runtime)
- Images already optimized (WebP, responsive)
- Fonts using `font-display: swap`
- No third-party scripts
- Video uses `preload="auto"` (controllable)

**Potential Issues:**
- LCP may be the video poster or first frame
- Video preload="auto" may hurt SI/FCP on slow connections

**Optimization Actions:**
1. Verify video `poster` is loading quickly (< 1s)
2. Consider `preload="metadata"` if preload="auto" hurts scores
3. Ensure `<link rel="preconnect">` for fonts.googleapis.com
4. Check for layout shifts from video/poster swap

### Anti-Patterns to Avoid
- **Large video keyframe intervals for scroll scrubbing:** Causes decode lag (current bug)
- **Icon-only links without accessible names:** Use aria-label on GitHub link
- **Multiple contentinfo landmarks:** Only one `<footer>` per page at root level
- **Blocking scripts before LCP:** Keep all JS at bottom or defer

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Performance auditing | Custom metrics | Lighthouse CLI or DevTools | Standardized, trusted benchmarks |
| Cross-browser testing grid | DIY infrastructure | Local browser installs | Overkill for 1-page site |
| GitHub SVG icon | Custom drawing | Simple Icons or SVG copy | Standardized, accessible |

**Key insight:** This phase is polish work; use established patterns rather than inventing solutions.

## Common Pitfalls

### Pitfall 1: Video Keyframe Starvation
**What goes wrong:** Scroll video is smooth in Safari but laggy in Chrome
**Why it happens:** Safari reconstructs delta frames efficiently; Chrome blocks main thread decoding
**How to avoid:** Encode with keyframes every 5-10 frames using `-g 10`
**Warning signs:** Only 1 I-frame shown by `ffprobe`; jank visible in Chrome DevTools performance trace

### Pitfall 2: Lighthouse Score Variability
**What goes wrong:** Score fluctuates between 80-95 on repeated runs
**Why it happens:** Network conditions, CPU load, throttling simulation variance
**How to avoid:** Run 3-5 times, use median score; run in Incognito mode
**Warning signs:** 10+ point swings between consecutive runs

### Pitfall 3: canplaythrough Event Unreliability
**What goes wrong:** Poster never hides on Safari iOS
**Why it happens:** Safari may not fire canplaythrough until play() is called
**How to avoid:** Use timeout fallback; check readyState directly
**Warning signs:** Poster visible indefinitely despite video data loaded

### Pitfall 4: Footer Link Accessibility
**What goes wrong:** Screen reader announces nothing for icon-only link
**Why it happens:** SVG has no text alternative; link has no aria-label
**How to avoid:** Add `aria-label="View source on GitHub"` to link; `aria-hidden="true"` on SVG
**Warning signs:** Lighthouse accessibility audit flags "Links do not have discernible names"

### Pitfall 5: Cross-Browser CSS Differences
**What goes wrong:** Sticky positioning or flexbox children render differently
**Why it happens:** Safari has known issues with sticky + flex children
**How to avoid:** Test in Safari early; use standard flex patterns
**Warning signs:** Layout breaks in Safari but works in Chrome

## Code Examples

Verified patterns from official sources:

### FFmpeg Re-encoding with Keyframes
```bash
# Source: FFmpeg documentation, blog.yoanngueny.com
# Re-encode with keyframe every 10 frames for smooth seeking

ffmpeg -i input.mp4 \
  -c:v libx264 \
  -crf 28 \
  -preset medium \
  -g 10 \
  -keyint_min 10 \
  -x264-params scenecut=0 \
  -profile:v main \
  -level 4.0 \
  -movflags +faststart \
  -an \
  output.mp4

# Verify keyframe distribution
ffprobe -v error -select_streams v:0 \
  -show_entries frame=pict_type \
  -of csv=print_section=0 output.mp4 | grep -c "^I"
# Expected: ~24 keyframes for 242 frame video
```

### Accessible GitHub Icon Link
```html
<!-- Source: MDN ARIA documentation, Font Awesome accessibility guide -->
<a href="https://github.com/jem-computer/esoterica"
   target="_blank"
   rel="noopener noreferrer"
   aria-label="View source on GitHub"
   class="footer-github">
  <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
  </svg>
</a>
```

### Video Loading State Detection
```javascript
// Source: MDN HTMLMediaElement, verified canplaythrough behavior
const video = document.getElementById('scroll-video');
const poster = document.querySelector('.hero-bg-poster');

function hidePoster() {
  if (poster) {
    poster.style.display = 'none';
  }
}

// Primary: wait for enough data buffered
video.addEventListener('canplaythrough', hidePoster, { once: true });

// Fallback: check readyState after timeout (Safari iOS edge case)
setTimeout(() => {
  if (video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
    hidePoster();
  }
}, 3000);

// Also hide on loadeddata if duration is short (already buffered)
video.addEventListener('loadeddata', () => {
  if (video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
    hidePoster();
  }
}, { once: true });
```

### Lighthouse CLI Run
```bash
# Source: Chrome DevTools documentation
# Run Lighthouse from CLI for consistent results

# Mobile performance audit
npx lighthouse https://jem-computer.github.io/esoterica/ \
  --only-categories=performance \
  --preset=mobile \
  --output=html \
  --output-path=./lighthouse-mobile.html

# Desktop performance audit
npx lighthouse https://jem-computer.github.io/esoterica/ \
  --only-categories=performance \
  --preset=desktop \
  --output=html \
  --output-path=./lighthouse-desktop.html
```

### Long Animation Frames Debugging
```javascript
// Source: Chrome DevTools Long Animation Frames API documentation
// Debug scroll animation performance issues

const THRESHOLD = 50; // milliseconds

const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.duration > THRESHOLD) {
      console.log('Long Animation Frame:', {
        duration: entry.duration,
        blockingDuration: entry.blockingDuration,
        scripts: entry.scripts.map(s => ({
          invoker: s.invoker,
          duration: s.duration,
          source: `${s.sourceURL}:${s.sourceCharPosition}`
        }))
      });
    }
  }
});

observer.observe({ type: 'long-animation-frame', buffered: true });
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Long Tasks API | Long Animation Frames API | Chrome 123 (2024) | Better debugging for animation jank |
| Manual keyframe guessing | ffprobe analysis + targeted encoding | N/A | Data-driven video optimization |
| JavaScript scroll handlers | CSS Scroll-Driven Animations | Chrome 115, Safari 26 | Not applicable for video currentTime (CSS can't set video time) |

**Deprecated/outdated:**
- None relevant for this phase

## Open Questions

Things that couldn't be fully resolved:

1. **Optimal keyframe interval for file size vs smoothness**
   - What we know: -g 10 is recommended for scroll scrubbing
   - What's unclear: Exact file size increase for this specific video
   - Recommendation: Encode with -g 10, measure size; fall back to -g 5 if still laggy

2. **Safari iOS canplaythrough timing**
   - What we know: Safari may delay canplaythrough until play()
   - What's unclear: Whether current poster/video setup triggers issue
   - Recommendation: Test on real iOS device; add timeout fallback

3. **Edge-specific rendering quirks**
   - What we know: Edge is Chromium-based, should match Chrome
   - What's unclear: Any Edge-specific video issues
   - Recommendation: Manual testing; expect Chrome-like behavior

## Sources

### Primary (HIGH confidence)
- [Chrome DevTools Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring) - Metric weights, score thresholds
- [MDN HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event) - Video events, readyState
- [MDN ARIA aria-label](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label) - Accessible names for icon links
- [Chrome Long Animation Frames API](https://developer.chrome.com/docs/web-platform/long-animation-frames) - Debugging animation jank

### Secondary (MEDIUM confidence)
- [The secrets for an optimized scroll-based HTML5 video](https://blog.yoanngueny.com/the-secrets-for-an-optimized-scroll-based-html5-video/) - Keyframe encoding, easing
- [Scrubbing videos using JavaScript](https://muffinman.io/blog/scrubbing-videos-using-javascript/) - FFmpeg encoding commands, browser comparison
- [Scroll-driven animations performance case study](https://developer.chrome.com/en/blog/scroll-animation-performance-case-study) - Chrome vs CSS approach

### Tertiary (LOW confidence)
- WebSearch results on Chrome vs Safari video seeking (anecdotal community reports)

## Metadata

**Confidence breakdown:**
- Video re-encoding solution: HIGH - Root cause identified via ffprobe; solution well-documented
- Footer semantics: HIGH - MDN documentation is authoritative
- Lighthouse optimization: HIGH - Official Chrome documentation
- Cross-browser testing: MEDIUM - Manual verification; some browser-specific quirks may emerge

**Research date:** 2026-01-29
**Valid until:** 60 days (stable domain, no rapidly evolving APIs)

## Appendix: Current Video Analysis

**File:** `/site/public/video/hero.mp4`
**Analysis performed:** 2026-01-29

```
Codec: H.264 Main Profile Level 4.0
Resolution: 1920x1068
Frame rate: 24 fps
Duration: 10.083 seconds
Total frames: 242
File size: 1.8 MB
Bit rate: 1.46 Mbps

Keyframe distribution:
- I-frames (keyframes): 1
- P-frames (predictive): 60
- B-frames (bidirectional): 181

Issue: Single keyframe at frame 0 means Chrome must decode
all preceding frames for any seek position.
```

**Recommended Re-encoding:**
```bash
ffmpeg -i hero.mp4 \
  -c:v libx264 \
  -crf 28 \
  -preset medium \
  -g 10 \
  -keyint_min 10 \
  -x264-params scenecut=0 \
  -profile:v main \
  -level 4.0 \
  -movflags +faststart \
  -an \
  hero-keyframed.mp4
```

Expected result: ~24 keyframes (one every 10 frames), ~2.2-2.5 MB file size.
