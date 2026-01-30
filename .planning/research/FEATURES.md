# Feature Landscape: Scroll-Driven Video Heroes & Illustration Sections

**Domain:** Product landing pages with scroll-scrubbed video heroes and illustration layouts
**Researched:** 2026-01-28
**Confidence:** HIGH (verified with Context7, official docs, and current 2026 web research)

## Context

This analysis examines features for adding scroll-driven animations to an existing landing page:
1. **Scroll-scrubbed video hero** - Apple-style video that plays as user scrolls
2. **Illustration sections** - Gateway Process-style technical illustrations (hand-drawn, stippled ink)
3. **Layout patterns** - How to structure illustration content with existing prose

**Existing features** (already built):
- Static hero image with dark overlay
- Tagline, description, install command
- Prose section with long-form content
- Theme toggle (light/dark)
- Copy-to-clipboard for install command

**Target aesthetic:** CIA Gateway Process documents - hand-drawn technical diagrams, black ink with stippled shading, diagrammatic quality.

## Table Stakes

Features users EXPECT from scroll-driven video heroes. Missing these = feels broken or janky.

| Feature | Why Expected | Complexity | Implementation Notes |
|---------|--------------|------------|---------------------|
| **1:1 scroll-to-video mapping** | Video progress must match scroll position exactly | Low | Native CSS `animation-timeline: scroll()` or GSAP ScrollTrigger with `scrub: true` |
| **Smooth frame transitions** | Choppy playback breaks immersion | Medium | Requires video encoded with high keyframe frequency (1-2 frame intervals) |
| **Fixed scroll distance** | Predictable scroll length for video sequence | Low | Define scroll range (typically 200vh-400vh) where video plays |
| **No scroll jank** | Must maintain 60fps during scroll | High | Use GPU-friendly properties (transform, opacity), avoid layout-triggering properties |
| **Preload/buffer handling** | Video must be loaded before user reaches it | Medium | Preload video, show loading state or static fallback until ready |
| **Mobile-appropriate fallback** | Video scrubbing is heavy on mobile | Medium | Static image or simpler animation on mobile, full video on desktop |
| **Reduced motion support** | Respect `prefers-reduced-motion` | Low | Show static frame or disable animation for users with motion sensitivity |
| **Consistent playback direction** | Scrubs forward on scroll down, backward on scroll up | Low | Bidirectional scrubbing using currentTime = scrollProgress * duration |

**Technical Reality Check:**
- CSS scroll-driven animations (as of 2026) work in Chrome/Edge, require flag in Firefox, not supported in Safari without polyfill
- GSAP ScrollTrigger is cross-browser but adds ~50KB bundle size
- Video file size with proper keyframes can be 3-5x larger than standard encoding

## Differentiators

Features that make scroll-driven video feel POLISHED vs merely functional.

### Polish Features (High Value)

| Feature | Value Proposition | Complexity | Priority |
|---------|-------------------|------------|----------|
| **Easing on scrub** | Smooths frame transitions, less jerky | Low | HIGH - Makes big quality difference |
| **Text overlay synchronized** | Hero text fades/moves in sync with video | Medium | HIGH - Essential for hero section cohesion |
| **Canvas-based rendering** | Better performance than HTML5 video scrubbing | High | MEDIUM - Optimization, not requirement |
| **Image sequence instead of video** | More control, smaller initial load, better scrubbing | Medium | MEDIUM - Alternative approach, not addition |
| **Progress indicator** | Shows how much of video remains | Low | LOW - Nice-to-have, not expected |
| **Scroll hint/chevron** | Communicates interactivity to users | Low | HIGH - Many users won't know to scroll |
| **Pause points** | Video pauses at key frames for readability | Medium | LOW - Can feel controlling |

### Performance Optimizations

| Feature | Value Proposition | Complexity | Priority |
|---------|-------------------|------------|----------|
| **Lazy load video** | Don't load until near viewport | Low | HIGH - Essential for page speed |
| **WebM + MP4 fallbacks** | WebM smaller, MP4 wider support | Low | HIGH - Browser compatibility |
| **Compressed keyframe video** | Balance quality vs file size | Medium | HIGH - Directly impacts UX |
| **RequestAnimationFrame throttling** | Reduce CPU usage during scroll | Low | MEDIUM - Performance optimization |
| **Intersection Observer trigger** | Only activate when hero is visible | Low | HIGH - Saves resources |

### Illustration Layout Features

| Feature | Value Proposition | Complexity | Priority |
|---------|-------------------|------------|----------|
| **Scroll-triggered fade-in** | Illustrations appear as user scrolls | Low | HIGH - Adds polish, matches video hero |
| **Staggered animation** | Items animate in sequence, not all at once | Low | MEDIUM - Feels more intentional |
| **Three-column grid** | Classic feature showcase layout | Low | HIGH - Standard pattern, works well |
| **Illustration + prose interspersed** | Breaks up long prose, maintains reading flow | Low | HIGH - Better than isolated grid |
| **Dark mode illustration variants** | Illustrations adapt to theme toggle | Medium | MEDIUM - Nice consistency with existing theme |
| **SVG format with inline styling** | Crisp at any size, theme-aware | Medium | HIGH - Best format for line art |
| **Caption/label under each** | Contextualizes what illustration shows | Low | HIGH - Necessary for comprehension |
| **Hover effects** | Subtle interaction feedback | Low | LOW - Don't overdo it |

## Anti-Features

Features to deliberately NOT build. Common mistakes with scroll-driven content.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Hijacked scroll** | Taking control of scroll physics feels broken | Use native scroll, just sync video to it. Never preventDefault or override scroll behavior |
| **Horizontal scroll sections** | Disorienting, breaks back button, accessibility nightmare | Stick to vertical scroll. If you want horizontal layouts, use CSS Grid/Flexbox without scroll hijacking |
| **Auto-playing with audio** | Violates user expectations and browser policies | Scroll-driven videos should be silent. Add optional audio with user-initiated play button |
| **Scroll-jacking momentum** | Custom scroll physics (smooth scroll libraries) conflict with video scrubbing | Use native browser scroll. Let CSS or GSAP read scroll position, don't modify it |
| **Excessive animation duration** | Video that takes 5+ screen heights to complete | Keep video playback within 2-4 viewport heights. Users will abandon if it feels slow |
| **Parallax on everything** | Multiple parallax layers cause jank and confusion | Use parallax sparingly. Hero video + static content works better than 10 parallax layers |
| **Autoplay video before scroll** | Defeats purpose of scroll-driven interaction | Start with first frame visible. Only play via scroll interaction |
| **Complex multi-video sequences** | Multiple videos scrubbing at once kills performance | One scroll-driven video per page. Additional videos can be standard autoplay or click-to-play |
| **Invisible scroll triggers** | User doesn't understand why page isn't responding | Add visual scroll hint (chevron, "scroll to explore", etc.) |
| **No static fallback** | Broken experience when video doesn't load | Always show meaningful static frame if video fails to load |
| **Decorative illustrations without purpose** | CIA Gateway style is TECHNICAL and DIAGRAMMATIC, not decorative | Every illustration should explain something. If it's purely decorative, reconsider |
| **Overuse of animation** | Illustrations that animate on scroll, hover, click, and load | Pick ONE animation per element. Scroll-triggered fade-in is enough for most cases |

## Scroll-Driven Video: Technical UX Patterns

### Implementation Approach (2026 Best Practices)

**Option A: CSS Scroll-Driven Animations**
- **Pros:** Native, performant (off main thread), no JS dependencies
- **Cons:** Limited browser support (Chrome/Edge only, Firefox with flag, Safari needs polyfill)
- **Best for:** Future-forward projects, progressive enhancement strategy
- **Code pattern:**
  ```css
  @supports (animation-timeline: scroll()) {
    .video-container {
      animation: scrub-video linear;
      animation-timeline: scroll();
      animation-range: entry 0% cover 100%;
    }
  }
  ```

**Option B: GSAP ScrollTrigger**
- **Pros:** Cross-browser, battle-tested, smooth scrubbing, easy setup
- **Cons:** ~50KB bundle size, JavaScript dependency
- **Best for:** Production-ready projects needing wide browser support
- **Code pattern:**
  ```javascript
  gsap.to(video, {
    currentTime: video.duration,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });
  ```

**Option C: Canvas + Image Sequence**
- **Pros:** Maximum control, best scrubbing performance, no video codec issues
- **Cons:** Larger initial asset creation, more complex implementation
- **Best for:** High-polish marketing sites where control matters more than file size
- **Pattern:** Load PNG/WebP sequence, draw frames to canvas based on scroll position

**Recommended for Esoterica:** Start with **GSAP ScrollTrigger** (Option B)
- Rationale: Cross-browser support matters more than bleeding-edge CSS, manageable bundle size, extensive documentation

### Video Encoding Specifications

Critical for smooth scrubbing. Standard video encoding WILL NOT WORK.

| Parameter | Standard Video | Scroll-Scrub Video | Why |
|-----------|---------------|-------------------|-----|
| Keyframe interval | Every 72-250 frames | Every 1-2 frames | Delta frames can't be decoded mid-sequence; need full frame for every scroll position |
| File size impact | 1x baseline | 3-5x baseline | More keyframes = less compression |
| Browser differences | Firefox needs 1-2, Chrome/Safari can work with 5-10 | Use 1-2 for best cross-browser experience |

**FFmpeg encoding commands:**
```bash
# MP4 (H.264) - keyframe every 2 frames
ffmpeg -i input.mp4 -vf scale=1920:-2 -c:v libx264 -g 2 -crf 20 -pix_fmt yuv420p output.mp4

# WebM (VP9) - keyframe every 2 frames
ffmpeg -i input.mp4 -vf scale=1920:-2 -c:v libvpx-vp9 -g 2 -crf 30 output.webm
```

### Scroll Range Design

How much scroll distance for video playback?

| Scroll Distance | Effect | Use When |
|----------------|--------|----------|
| 100vh (1 screen) | Fast, aggressive | Very short video (2-3 seconds), high-energy product |
| 200vh (2 screens) | **Recommended** | Most use cases, comfortable pacing |
| 300-400vh (3-4 screens) | Slow, cinematic | Detailed product showcase, storytelling |
| 500vh+ (5+ screens) | Glacial, frustrating | Don't do this unless video is truly epic |

**For Esoterica:** 200vh (2 viewport heights) is the sweet spot for a hero video introducing a tarot tool.

### Mobile Behavior Patterns

Scroll-driven video is HEAVY on mobile. Choose a fallback strategy:

| Strategy | Pros | Cons | Recommended |
|----------|------|------|-------------|
| **Same video, lower quality** | Consistent experience | Still heavy on bandwidth/CPU | Only if video is critical to message |
| **Static poster frame** | Fast, simple | Loses interactivity | **Best for most cases** - show hero frame |
| **Simpler animation** | Some motion, lighter weight | Requires creating alternative asset | Good compromise if budget allows |
| **Fade-in with text only** | Minimal load, focuses on copy | No visual interest | Fine for text-heavy products |

**Implementation:**
```css
/* Desktop: video scrubbing */
@media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
  .hero-video { display: block; }
  .hero-static { display: none; }
}

/* Mobile or reduced motion: static image */
@media (max-width: 767px), (prefers-reduced-motion: reduce) {
  .hero-video { display: none; }
  .hero-static { display: block; }
}
```

### Text Overlay Synchronization

Hero text should feel connected to video, not floating independently.

**Timing patterns:**

| Pattern | When Text Appears | Use Case |
|---------|------------------|----------|
| **Fade in with video start** | Text opacity 0→1 during first 20% of scroll | Simple, safe choice |
| **Staggered text reveal** | Tagline at 0-20%, description at 20-40%, CTA at 40-60% | Storytelling sequence |
| **Text fades out as video completes** | Text visible at start, fades before video end | Draws attention to video finale |
| **Parallax text movement** | Text moves slower than scroll (0.5x speed) | Adds depth, don't overdo |

**Anti-pattern:** Text that animates independently of scroll position. Text must respond to scroll, not time.

### Accessibility Requirements

| Requirement | Implementation | Why |
|-------------|---------------|-----|
| **prefers-reduced-motion** | Show static frame, disable all scroll animation | Vestibular disorders, motion sensitivity |
| **Keyboard navigation** | Don't break Tab/Shift+Tab through page | Scroll animations can't interfere with focus |
| **Screen reader experience** | Video is decorative, use `aria-hidden="true"` | Screen readers don't benefit from video scrubbing |
| **Static content always visible** | Hero text readable without video loading | Network failures, slow connections |
| **No scroll traps** | User can always scroll past hero section | Never lock scroll position |

## Illustration Layout Patterns

For Gateway Process-style technical illustrations (hand-drawn, stippled ink, diagrammatic).

### Layout Option 1: Three-Column Feature Grid

**Classic product page pattern.** Works well for 3, 6, or 9 discrete features.

**Structure:**
```
[Prose section]
  ↓
[3-Column Grid]
[Illustration] [Illustration] [Illustration]
[   Caption  ] [   Caption  ] [   Caption  ]
  ↓
[More prose or footer]
```

**Pros:**
- Scannable at a glance
- Equal weight to each illustration
- Responsive: 3 columns → 2 columns → 1 column

**Cons:**
- Creates visual break from prose flow
- Can feel like "features checklist"
- Less narrative structure

**When to use:**
- You have 3-6 distinct concepts to illustrate
- Concepts are equal importance
- Product has clear "features" to showcase

**Scroll animation:**
- Fade in grid as user scrolls into view
- Optional: stagger each item by 0.1s for left-to-right reveal

### Layout Option 2: Prose-Interspersed Illustrations

**Illustrations embedded within prose flow.** More editorial, less "product page."

**Structure:**
```
[Prose paragraph]
[Prose paragraph]
  ↓
[Full-width illustration with caption]
  ↓
[Prose paragraph]
[Prose paragraph]
  ↓
[Full-width illustration with caption]
  ↓
[Prose continues...]
```

**Pros:**
- Maintains reading flow
- Illustrations contextualized by surrounding text
- Feels more editorial, less marketing
- Flexible - illustrations can be different sizes

**Cons:**
- Less scannable
- Harder to compare illustrations side-by-side
- May break up prose rhythm if overused

**When to use:**
- You have long-form prose that benefits from visual breaks
- Illustrations are complex and need space
- Narrative flow matters more than scannability
- Existing prose section is substantial

**Scroll animation:**
- Fade in as illustration enters viewport
- Optional: subtle slide-up (20px) combined with fade

### Layout Option 3: Hybrid (Recommended for Esoterica)

**Combine both patterns.** Intersperse some illustrations, grid for others.

**Structure:**
```
[Scroll-driven video hero]
  ↓
[Prose section begins]
[Key concept 1 - full-width illustration]
[Prose continues]
[Key concept 2 - full-width illustration]
  ↓
[3-Column Grid: Three supporting concepts]
  ↓
[Footer]
```

**Why this works:**
- Prose-interspersed illustrations for major concepts (e.g., "How tarot readings work for agents")
- Grid for smaller, equal-weight features (e.g., "Multiple readers, Quick/Deep modes, Global config")
- Maintains flow while providing scannable summary

**Implementation notes:**
- Full-width illustrations: max-width 800px, centered
- Grid illustrations: square or 4:3 ratio, equal sizing
- All illustrations: SVG format for crispness + theme support

### Illustration Technical Specs

For Gateway Process aesthetic (hand-drawn, technical, stippled):

| Spec | Value | Why |
|------|-------|-----|
| **Format** | SVG (inline or external) | Crisp at any size, CSS-styleable for dark mode |
| **Stroke color** | CSS custom property `--illustration-stroke` | Theme toggle can swap colors |
| **Background** | Transparent | Adapts to page background (light/dark theme) |
| **Line weight** | 1.5-2px | Hand-drawn feel without being too heavy |
| **Style** | Stippled shading, technical linework | Matches Gateway Process aesthetic |
| **Complexity** | Medium detail | Too simple = boring, too complex = overwhelming |
| **Size** | Source: 800-1200px wide | Sufficient detail, not excessive |
| **Animation** | Fade in (opacity 0→1) + optional slide-up 20px | Subtle, not distracting |

**Dark mode handling:**
```css
:root {
  --illustration-stroke: #1a1a1a; /* black for light mode */
}

[data-theme="dark"] {
  --illustration-stroke: #e8e8e8; /* off-white for dark mode */
}
```

### Grid Specifications

For three-column feature grid:

```css
.illustration-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
  max-width: 1200px;
  margin: 4rem auto;
}

@media (max-width: 768px) {
  .illustration-grid {
    grid-template-columns: 1fr; /* stack on mobile */
    gap: 2rem;
  }
}
```

**Item count guidance:**
- 3 items: Perfect
- 6 items: Good (2 rows)
- 9 items: Maximum (3 rows, getting long)
- 4, 5, 7, 8: Avoid (last row looks unbalanced)

**If you have 4-5 items:** Use 2-column grid on desktop instead.

## Feature Dependencies

```
Video Hero:
  Video encoding (high keyframes)
    ↓
  Scroll detection (CSS timeline or GSAP)
    ↓
  currentTime scrubbing
    ↓
  Text overlay animation (optional)
    ↓
  Mobile fallback (static image)
    ↓
  Reduced motion support

Illustration Sections:
  SVG illustrations created
    ↓
  Theme-aware styling (CSS variables)
    ↓
  Layout choice (grid vs interspersed vs hybrid)
    ↓
  Scroll-triggered fade-in (optional polish)
    ↓
  Captions for each illustration

Footer:
  (No dependencies, standalone component)
```

## Implementation Complexity

| Feature | Effort | Risk | Notes |
|---------|--------|------|-------|
| **Video encoding with keyframes** | LOW | LOW | One-time FFmpeg command, well-documented |
| **GSAP ScrollTrigger setup** | LOW | LOW | Copy-paste pattern from docs, adjust timing |
| **CSS scroll-driven animations** | LOW | MEDIUM | Browser support risk (Safari), polyfill adds complexity |
| **Canvas image sequence** | HIGH | MEDIUM | More control but significant implementation work |
| **Text overlay sync** | LOW | LOW | GSAP timeline or CSS keyframes, straightforward |
| **Mobile fallback** | LOW | LOW | CSS media query, show/hide static image |
| **Reduced motion support** | LOW | LOW | CSS media query `prefers-reduced-motion`, simple |
| **SVG illustrations creation** | MEDIUM | LOW | Design time, not code complexity (assumes illustrations already designed) |
| **Theme-aware SVG styling** | LOW | LOW | CSS custom properties, works with existing theme toggle |
| **Illustration grid layout** | LOW | LOW | CSS Grid, standard responsive pattern |
| **Prose-interspersed layout** | LOW | LOW | Position illustrations between paragraphs, simple |
| **Scroll-triggered fade-in** | LOW | LOW | Intersection Observer + CSS transition |
| **Footer** | LOW | LOW | Standard HTML/CSS component |

**Highest risk items:**
1. **Video file size** - High keyframe video can be 5-10MB+, impacts page load
2. **Mobile performance** - Scroll-driven video is CPU-intensive, must test on real devices
3. **Browser compatibility** - CSS scroll-driven animations have limited support, GSAP safer

## MVP Recommendations

### Must Have (Table Stakes)
1. Scroll-scrubbed video hero with 1:1 scroll mapping
2. Video encoded with high keyframe frequency (2 frame interval)
3. Static fallback image for mobile
4. `prefers-reduced-motion` support (show static frame)
5. Hero text overlay (existing tagline/description)
6. 3-6 SVG illustrations (Gateway Process style)
7. Theme-aware illustration styling (dark/light mode)
8. Layout choice: hybrid (prose-interspersed + grid)
9. Footer with links/info

### Should Have (High Polish)
1. Scroll hint/chevron ("scroll to explore")
2. Text overlay synchronized fade with video
3. Lazy load video (only load when near viewport)
4. WebM + MP4 fallbacks for browser compatibility
5. Scroll-triggered fade-in for illustrations
6. Intersection Observer for performance

### Could Have (Nice Polish)
1. Optional: Staggered animation for illustration grid
2. Optional: Subtle parallax on hero text (0.5x scroll speed)
3. Optional: Progress indicator for video
4. Optional: Easing on video scrub (smooth frame transitions)

### Won't Have (Anti-Features)
1. Hijacked scroll or custom scroll physics
2. Horizontal scroll sections
3. Audio with video
4. Multiple scroll-driven videos
5. Excessive animation (parallax on everything)
6. Complex multi-step video sequences
7. Decorative illustrations without purpose

## Roadmap Implications

### Implementation Order

**Phase 1: Video Hero Foundation**
1. Encode video with high keyframe frequency
2. Set up GSAP ScrollTrigger for video scrubbing
3. Define scroll range (200vh recommended)
4. Sync existing hero text to video progress
5. Test cross-browser (Chrome, Firefox, Safari)

**Rationale:** Get core scroll-driven video working before adding illustrations. Video is the headline feature.

**Phase 2: Mobile & Accessibility**
1. Create static poster frame (hero image)
2. Add media query for mobile (show static, hide video)
3. Add `prefers-reduced-motion` support
4. Test on real mobile devices (iOS Safari, Android Chrome)

**Rationale:** Don't ship without mobile fallback. Performance and accessibility are non-negotiable.

**Phase 3: Illustration Integration**
1. Create 3-6 SVG illustrations in Gateway Process style
2. Add CSS custom properties for theme support
3. Implement hybrid layout (1-2 interspersed, 3-column grid for rest)
4. Add scroll-triggered fade-in with Intersection Observer

**Rationale:** Illustrations can be added after video works. They enhance but aren't dependent on video.

**Phase 4: Footer & Polish**
1. Add footer component
2. Add scroll hint chevron to hero
3. Optimize video file size (compress, test quality)
4. Fine-tune animation timing/easing

**Rationale:** Footer is independent. Polish last after core functionality validated.

### Research Flags for Implementation

**Likely needs deeper investigation:**
- **Video file size optimization** - Balance between keyframe frequency and file size, may need testing multiple compressions
- **Mobile performance testing** - Must test on real devices, not just desktop devtools

**Standard patterns, unlikely to need research:**
- GSAP ScrollTrigger setup (well-documented, proven pattern)
- CSS Grid for illustration layout (standard responsive technique)
- SVG styling with CSS variables (straightforward)
- Footer component (basic HTML/CSS)

## Sources

### Scroll-Driven Video Hero
- [CSS-Tricks: Fancy Scrolling Animations Used on Apple Product Pages](https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/)
- [Builder.io: Create Apple-style scroll animations with CSS view-timeline](https://www.builder.io/blog/view-timeline)
- [Scrollsequence: How to make scroll image animation like Sony, Apple and Samsung](https://scrollsequence.com/how-to-make-scroll-image-animation/)
- [Chrome Developers: A case study on scroll-driven animations performance](https://developer.chrome.com/blog/scroll-animation-performance-case-study)
- [Chrome Developers: Scroll-driven animations case studies](https://developer.chrome.com/blog/css-ui-ecommerce-sda)

### Video Scrubbing Implementation
- [Medium: "Scroll to Scrub" Videos by Chris How](https://medium.com/@chrislhow/scroll-to-scrub-videos-4664c29b4404)
- [Abhishek Ghosh: Playing with video scrubbing animations on the web](https://www.ghosh.dev/posts/playing-with-video-scrubbing-animations-on-the-web/)
- [Muffin Man: Scrubbing videos using JavaScript](https://muffinman.io/blog/scrubbing-videos-using-javascript/)
- [GSAP Community: Scrub through video smoothly - ScrollTrigger](https://gsap.com/community/forums/topic/25730-scrub-through-video-smoothly-scrolltrigger/)

### Performance Optimization
- [Codrops: Building a Scroll-Driven Dual-Wave Text Animation with GSAP](https://tympanus.net/codrops/2026/01/15/building-a-scroll-driven-dual-wave-text-animation-with-gsap/)
- [CSS Author: Scroll Animation Tools 2026: Which One Should You Actually Use?](https://cssauthor.com/scroll-animation-tools/)
- [WebExpo: Scroll-Driven Animations with CSS: Performance Focused Web Interactivity](https://webexpo.net/blog/scroll-driven-animations-with-css-performance-focused-web-interactivity/)
- [Smashing Magazine: An Introduction To CSS Scroll-Driven Animations](https://www.smashingmagazine.com/2024/12/introduction-css-scroll-driven-animations/)
- [MDN: CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)

### Mobile & Fallback Strategies
- [Cyd Stumpel: Two approaches to fallback CSS scroll driven animations](https://cydstumpel.nl/two-approaches-to-fallback-css-scroll-driven-animations/)
- [Medium: A complete guide to CSS Scroll-driven Animations by Mariana Beldi](https://marianabeldi.medium.com/a-complete-guide-to-css-scroll-driven-animations-9c995689bc58)

### Video Encoding Keyframes
- [Muffin Man: Scrubbing videos using JavaScript](https://muffinman.io/blog/scrubbing-videos-using-javascript/)
- [VideoHelp Forum: Using ffmpeg to make an html5 webm video scroll smoothly](https://forum.videohelp.com/threads/389787-Using-ffmpeg-to-make-an-html5-webm-video-scroll-smoothly)
- [Vid.co: Keyframes & GOPs: The Encoding Circles of Hell](https://vid.co/blog/keyframes-vs-gop-video-encoding-explained)

### Accessibility
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- [W3C: Understanding Success Criterion 2.3.3: Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
- [Josh W. Comeau: Accessible Animations in React with "prefers-reduced-motion"](https://www.joshwcomeau.com/react/prefers-reduced-motion/)
- [Motion.dev: Create accessible animations in React](https://motion.dev/docs/react-accessibility)
- [a11y with Lindsey: Reducing Motion to Improve Accessibility](https://www.a11ywithlindsey.com/blog/reducing-motion-improve-accessibility/)

### Landing Page Design Patterns
- [SeedProd: 10 Best Product Landing Page Examples of 2026](https://www.seedprod.com/product-landing-page-examples/)
- [SaaSFrame Blog: 10 SaaS Landing Page Trends for 2026](https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples)
- [involve.me: Landing Page Design Trends by Industry (2026 Guide)](https://www.involve.me/blog/landing-page-design-trends)
- [Superside: 20 Landing Page Examples That Actually Convert in 2026](https://www.superside.com/blog/landing-page-design-examples)

### Illustration Layout
- [MDN: CSS grid layout](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout)
- [CSS-Tricks: CSS Grid Layout Guide](https://css-tricks.com/css-grid-layout-guide/)
- [Matthew James Taylor: 3 Column Layouts (Responsive, Flexbox & CSS Grid)](https://matthewjamestaylor.com/3-column-layouts)

### Anti-Patterns
- [Digital Silk: Scrolling Effects In Web Design (2026): Benefits & Risks](https://www.digitalsilk.com/digital-trends/scrolling-effects/)
- [Chrome Developers: CSS scroll-triggered animations are coming!](https://developer.chrome.com/blog/scroll-triggered-animations)

## Confidence Assessment

| Area | Confidence | Rationale |
|------|-----------|-----------|
| **Scroll-driven video patterns** | HIGH | Multiple authoritative sources (Chrome Developers, CSS-Tricks, MDN), current 2026 documentation, verified techniques |
| **Video encoding specs** | HIGH | Technical specs verified across multiple sources, FFmpeg commands documented |
| **Performance optimization** | HIGH | Chrome case studies, MDN documentation, current 2026 best practices |
| **Browser compatibility** | HIGH | MDN documentation (updated Jan 2026), polyfill strategies documented |
| **Accessibility requirements** | HIGH | W3C standards, MDN documentation, WCAG guidelines |
| **Illustration layout patterns** | HIGH | MDN CSS Grid docs, CSS-Tricks guides, responsive patterns well-established |
| **2026 design trends** | MEDIUM | Multiple current sources but trends are subjective; verified patterns over opinions |
| **Mobile performance** | MEDIUM | General guidance available, but requires real device testing for specific project |

**Overall confidence:** HIGH

All technical specifications verified with authoritative sources (MDN, Chrome Developers, W3C). Implementation patterns drawn from current 2026 documentation and case studies. Mobile performance guidance is general (MEDIUM confidence) and will require project-specific testing, but fallback strategies are well-established.

---

# Feature Landscape: Terminal Demo Widget

**Domain:** Terminal demo widget for product landing page
**Researched:** 2026-01-30
**Confidence:** MEDIUM (WebSearch verified against multiple sources, no Context7 for this domain)

## Executive Summary

Terminal demo widgets succeed when they create the *feeling* of witnessing real software in action without the friction of actual interaction. The most effective demos share three qualities: **visual authenticity** (looks like a real terminal), **temporal pacing** (typewriter effects that feel human), and **narrative structure** (clear beginning, middle, end).

For scroll-triggered demos specifically, the key insight is that scroll position becomes a "playhead" - users control pacing by scrolling, which creates engagement through agency. The worst mistake is hijacking scroll behavior or making users wait for animations to complete before they can continue.

The four-phase narrative (ask question, pull cards, get interpretation, integrate learnings) maps well to scroll-triggered phases. Each phase should be a discrete "scene" that completes as the user scrolls through its range.

## Table Stakes (Demo Widget)

Features users expect. Missing = demo feels broken or amateurish.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Terminal visual frame** | Users need to recognize "this is a CLI" instantly | Low | Chrome (title bar, window buttons), monospace font, dark background. Claude Code aesthetic: warm parchment tones possible. |
| **Blinking cursor** | Universal signifier of "awaiting input" or "typing in progress" | Low | CSS animation, 530ms blink rate is standard. Hide during active typing, show at rest. |
| **Typewriter text reveal** | Creates temporal pacing, suggests "live" operation | Medium | Character-by-character reveal. Uniform speed is acceptable but feels robotic. |
| **Prompt indicator** | Shows command vs output distinction | Low | `$` or `>` for user input, different styling for output. Claude Code uses distinct styling for agent messages. |
| **Scroll-to-phase mapping** | Core interaction model for this widget | Medium | Scroll position maps to demo phases. Phase 1: 0-25%, Phase 2: 25-50%, etc. |
| **Phase persistence** | Scrolling up should show previous state, not re-animate | Medium | Once a phase completes, it stays completed. Scroll up = see static completed state. |
| **prefers-reduced-motion support** | Accessibility requirement | Low | Users with motion sensitivity get instant text (no typewriter), static states. Required by WCAG. |

## Differentiators (Demo Widget)

Features that make the demo memorable and effective.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Variable typing speed** | Feels genuinely human, not robotic | Medium | Motion library does this automatically: slower for long words, pauses at punctuation, variation between characters. ~1.3kb React component available. |
| **Phase-specific timing** | Different content types feel different | Medium | User questions type fast (confident). Card pulls have dramatic pause. Interpretations type slower (thoughtful). |
| **Semantic content blocks** | Content isn't just text, it has structure | Medium | User prompt styled differently from agent response. Card names could have distinct styling. |
| **Scroll progress indicator** | Shows user where they are in the narrative | Low | Subtle bar or dots showing 4 phases, current phase highlighted. |
| **"Skip to end" escape hatch** | Respects impatient users | Low | Small "skip" button or keyboard shortcut (spacebar?) to complete current phase instantly. |
| **Smooth phase transitions** | Phases don't jump, they flow | Medium | Brief fade or slide between phases rather than hard cuts. |
| **Ambient terminal effects** | Adds atmosphere without distraction | Low-Medium | Subtle scan lines, very slight color variation. NOT CRT warping or heavy effects. |
| **Card reveal moment** | The "pull" feels special | Medium | When cards are drawn, brief visual emphasis - perhaps a subtle glow or the card names appearing with slightly different timing. |
| **Claude Code visual authenticity** | Looks like the actual product | Medium | Match Claude Code's status bar, message styling, color palette. The "warm, analog-inspired" aesthetic with parchment tones. |

## Anti-Features (Demo Widget)

Features to explicitly NOT build. Common mistakes in this domain.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Scroll hijacking** | "Please oh please don't hijack the scrolling like the black trash can Mac Pro page did." Users hate losing scroll control. | Scroll should always respond normally. Animations trigger at positions, but scroll continues smoothly. Never lock scroll waiting for animation. |
| **Interactive input** | Fake interactivity creates confusion and disappointment | Demo is purely observational. No fake input fields. It's a recording, not a simulation. |
| **Sound effects** | Startles users, accessibility nightmare, feels gimmicky | Visual-only. If audio is ever added, must be opt-in with clear control. |
| **Heavy CRT/retro effects** | Distracts from content, dated aesthetic, performance cost | Subtle at most. This isn't a nostalgia piece - it's a product demo. |
| **Auto-advancing phases** | Removes user agency, forces pace | User controls pace via scroll. Never auto-advance to next phase. |
| **Loading states between phases** | Breaks immersion, suggests slow software | Pre-render all content. No spinners, no "loading..." text. |
| **Replay button** | Adds complexity, rarely used, implies demo is finished | Scroll up to see previous phases. Natural scroll behavior is the replay mechanism. |
| **Actual terminal functionality** | Massive scope creep, security concerns | This is a recording/animation, not a shell. Don't try to make it "real." |
| **Text that can be selected/copied** | Creates confusion about what's real | Text in demo is presentational. Keep actual install command separate (already exists in hero). |
| **Mobile-only simplification** | Mobile users deserve the demo too | Scale down gracefully. Smaller font, same content. Touch scroll works same as mouse scroll. |

## Best Practices (Demo Widget)

UX patterns verified across multiple sources for terminal simulations.

### Scroll Behavior

1. **Scroll position is the timeline.** Map scroll percentage to demo progress. User scrolls = demo advances.

2. **Phases are sticky.** Each phase occupies a scroll range. Within that range, the phase plays. Scrolling past = phase complete and static.

3. **Bi-directional works.** Scrolling up shows completed previous phases in their final state. Don't re-animate on reverse scroll.

4. **Performance matters.** Use CSS scroll-driven animations where possible (Chrome 145+ supports these natively). For broader support, IntersectionObserver + requestAnimationFrame. Avoid scroll event listeners on main thread.

### Typewriter Implementation

1. **Character-by-character** feels more authentic than word-by-word.

2. **Variable timing** creates human feel:
   - Base: 30-50ms per character
   - Punctuation: +100-200ms pause after
   - Word boundaries: slight pause
   - Long words: slight slowdown mid-word

3. **Cursor behavior:**
   - Visible and blinking when "idle"
   - Hidden or solid when "typing"
   - Returns to blinking after line completes

4. **Output vs input distinction:**
   - Input lines type character-by-character
   - Output can appear line-by-line or in blocks (faster pacing)

### Accessibility (Demo Widget)

1. **prefers-reduced-motion: reduce**
   - Disable all typewriter effects
   - Show text instantly
   - Scroll still controls phase, but no animation
   - "Reduce" means reduce, not remove - subtle fades okay

2. **Screen reader considerations:**
   - Demo content should be in DOM for screen readers
   - Use aria-live regions carefully (probably "polite", not "assertive")
   - Consider a static alternative summary

3. **Keyboard navigation:**
   - Scroll with keyboard (arrow keys, Page Up/Down) should work
   - Consider spacebar to skip current phase

### Visual Design (Demo Widget)

1. **Claude Code authenticity matters.** Match the actual product:
   - Monospace font (likely SF Mono or similar)
   - Warm, parchment-toned palette
   - Status bar with model/cost info (can be static/fake)
   - Message bubbles with distinct styling for user/agent

2. **Terminal chrome is optional.** A floating terminal window with title bar is classic but not required. The content styling alone can convey "terminal."

3. **Contrast with page.** Demo should stand out from surrounding content. Dark terminal on light page (or vice versa) creates clear boundary.

### Content Structure (Demo Widget)

For the four-phase narrative:

**Phase 1: Ask a question**
- User prompt appears with typewriter
- Brief, clear question about a real problem
- ~50-80 characters

**Phase 2: Pull cards**
- Agent acknowledges and draws
- Card names appear (could have special emphasis)
- Natural pause after draw completes

**Phase 3: Get interpretation**
- Longer text block
- Can reveal paragraph-by-paragraph rather than all at once
- This is the "meat" - worth spending scroll distance on

**Phase 4: Integrate learnings**
- Brief closing from agent
- Clear "complete" state
- Natural endpoint before user scrolls to next page section

### Performance Budget (Demo Widget)

- **Initial load:** Demo content should be in HTML, not loaded async
- **Animation:** CSS-driven where possible, JS only for typewriter sequencing
- **Memory:** Pre-calculate all text content, don't generate on scroll
- **Scroll handler:** Debounced or throttled, ideally using IntersectionObserver

## Recommendations for Esoterica Demo Widget

Based on research, prioritized feature list:

**Must Have (Table Stakes):**
1. Terminal visual frame with Claude Code aesthetic
2. Blinking cursor
3. Typewriter text reveal
4. Scroll-to-phase mapping for 4 phases
5. prefers-reduced-motion support

**Should Have (High-Value Differentiators):**
1. Variable typing speed (use Motion library or similar)
2. Phase-specific timing (faster questions, slower interpretations)
3. Claude Code visual authenticity (status bar, message styling)
4. Phase persistence on scroll-up

**Nice to Have (If Time Permits):**
1. Scroll progress indicator
2. Skip-to-end button
3. Subtle card reveal moment

**Explicitly Skip:**
- Interactive input
- Sound effects
- Heavy visual effects
- Replay functionality

## Sources (Demo Widget)

### Terminal Demo Implementation
- [DEV Community: Terminal Simulation in Browser](https://dev.to/ehlo_250/how-to-create-a-terminal-simulation-in-the-browser-3l54)
- [ITNEXT: Interactive Terminal Website with JavaScript](https://itnext.io/how-to-create-interactive-terminal-like-website-888bb0972288)
- [GitHub: fake-terminal-website](https://github.com/luisbraganca/fake-terminal-website)
- [GitHub: terminal-landing-page](https://github.com/bradtraversy/terminal-landing-page)

### Typewriter Effects
- [CSS-Tricks: Typewriter Effect](https://css-tricks.com/snippets/css/typewriter-effect/)
- [W3Schools: Typing Effect Tutorial](https://www.w3schools.com/howto/howto_js_typewriter.asp)
- [Motion: React Typewriter Component](https://motion.dev/docs/react-typewriter) - 1.3kb, variable speed, designed for scroll-triggered
- [FreeFrontend: CSS Typing Text Effects](https://freefrontend.com/css-typing-text/)

### Scroll-Triggered Animations
- [Chrome Developers: Scroll-Triggered Animations](https://developer.chrome.com/blog/scroll-triggered-animations) - New CSS API in Chrome 145
- [scroll-driven-animations.style](https://scroll-driven-animations.style/) - Demos and tools
- [Bram.us: CSS Scroll-Triggered Animations](https://www.bram.us/2025/12/12/css-scroll-triggered-animations-are-coming-to-chrome/)
- [Motion: React Scroll Animations](https://motion.dev/docs/react-scroll-animations)
- [Chrome Developers: Scroll Animation Performance](https://developer.chrome.com/blog/scroll-animation-performance-case-study)

### Animation Best Practices & Anti-Patterns
- [Vev: Website Scroll Animation 101](https://www.vev.design/blog/website-scroll-animation/)
- [CSS-Tricks: Apple-Style Scroll Animations](https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/)
- [Vev: Landing Page Animation 101](https://www.vev.design/blog/landing-page-animation/)

### Accessibility
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- [web.dev: prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion)
- [Tatiana Mac: No-Motion-First Approach](https://www.tatianamac.com/posts/prefers-reduced-motion)
- [Pope Tech: Accessible Animation Design](https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/)
- [W3C WAI: Animation Accessibility](https://www.w3.org/WAI/tutorials/carousels/animations/)

### Claude Code Interface
- [Claude Code Docs: Terminal Config](https://code.claude.com/docs/en/terminal-config)
- [Claude Code Product Page](https://claude.com/product/claude-code)
- [Prototypr: Claude Code CLI UI](https://prototypr.io/post/claude-code-cli-ui)
- [Medium: Claude Code Internals - Terminal UI](https://kotrotsos.medium.com/claude-code-internals-part-11-terminal-ui-542fe17db016)
