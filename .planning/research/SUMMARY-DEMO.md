# Project Research Summary: Demo Widget

**Project:** Esoterica v1.5 Demo Widget
**Domain:** Scroll-triggered terminal simulation with typewriter animation
**Researched:** 2026-01-30
**Confidence:** HIGH

## Executive Summary

The demo widget is a scroll-triggered terminal simulation showing esoterica in action through four phases: ask question → pull cards → interpret → integrate learnings. Research across stack, features, architecture, and pitfalls converges on one clear recommendation: **custom vanilla JS implementation with IntersectionObserver for phase triggers and setTimeout for typewriter animation.**

All four research tracks agree: no new dependencies. The existing site has zero runtime npm dependencies and uses vanilla JS for scroll-driven video (`scroll-scrubber.js`) and intersection-based reveals (`scroll-reveal.js`). Terminal libraries like xterm.js (265KB) are massive overkill for read-only display. Lightweight alternatives like Termynal (~6KB) add unnecessary dependencies when custom implementation is ~50 lines JS + ~100 lines CSS.

The key insight from features research: **scroll position is a playhead, not a progress bar**. Users control pacing through scroll, creating engagement via agency. The worst mistake is scroll hijacking or auto-advancing phases.

## Key Findings

### Recommended Stack

No new npm dependencies. Custom implementation using browser-native APIs already proven in the codebase.

| Technology | Purpose | Already in Project |
|------------|---------|-------------------|
| Vanilla JS | Typewriter logic, phase orchestration | Yes |
| IntersectionObserver | Phase trigger detection | Yes (scroll-reveal.js) |
| CSS animations | Cursor blink | Yes |
| CSS custom properties | Theme-aware colors | Yes |

**Explicitly rejected:**
- xterm.js (265KB — overkill)
- jQuery Terminal (requires jQuery)
- Termynal (external dependency unnecessary)
- TypeIt/TypewriterJS (commercial/npm when ~50 lines suffices)
- CSS scroll-driven animations (Safari support incomplete)

### Expected Features

**Must have (table stakes):**
- Terminal visual frame (Claude Code aesthetic)
- Blinking cursor (530ms blink rate)
- Typewriter text reveal (character-by-character)
- Scroll-to-phase mapping (4 discrete phases)
- `prefers-reduced-motion` support (show text instantly)
- Phase persistence (scroll up = see completed state, not re-animate)

**Should have (differentiators):**
- Variable typing speed (30-50ms base, pauses at punctuation)
- Phase-specific timing (fast questions, slower interpretations)
- Claude Code visual authenticity (dark terminal, monospace, purple accents)

**Anti-features (never build):**
- Scroll hijacking (users hate losing scroll control)
- Interactive input (creates confusion)
- Sound effects (accessibility nightmare)
- Auto-advancing phases (removes user agency)
- Heavy CRT/retro effects (distracts, performance cost)

### Architecture Approach

Use **IntersectionObserver** (like illustrations) not continuous scroll mapping (like video). Demo has discrete phases, not continuous values.

**Component structure:**
- `DemoWidget.astro` — Terminal UI container with phase markers
- `scroll-demo.js` — IntersectionObserver + typewriter orchestration
- CSS additions to `global.css` — Terminal chrome, typewriter styles

**Layout pattern:**
```
<section class="demo"> <!-- 400vh (100vh per phase) -->
  <div class="demo-sticky"> <!-- sticky container -->
    <div class="demo-terminal">...</div>
  </div>
  <!-- Invisible phase trigger markers -->
  <div class="demo-phase-trigger" data-phase="1"></div>
  <div class="demo-phase-trigger" data-phase="2"></div>
  <div class="demo-phase-trigger" data-phase="3"></div>
  <div class="demo-phase-trigger" data-phase="4"></div>
</section>
```

**Data flow:**
1. Phase trigger enters viewport
2. IntersectionObserver fires
3. `activatePhase(N)` stops any running typewriter
4. Get content from `data-phase-N` attribute
5. Start typewriter (setTimeout recursive, 30-50ms per char)
6. Mark phase complete when done

### Critical Pitfalls

Top 5 pitfalls that would cause feature failure:

1. **Typewriter innerHTML trap** — Starting with empty element breaks screen readers and SEO. Keep full text in DOM, reveal visually via CSS.

2. **No prefers-reduced-motion support** — WCAG 2.3.3 violation. 70+ million people affected. Check motion preference first, show content instantly if reduced.

3. **Scroll handler conflict** — Site has two scroll systems already. Use IntersectionObserver (not scroll events) to avoid competing for main thread.

4. **Memory leaks from uncanceled timers** — Store timer references, cancel on cleanup. Test with heap snapshots.

5. **Scroll-to-phase synchronization gap** — Animation state must be derivable from scroll position. When scrolling fast, skip animation and show correct phase state.

## Contradiction Analysis

No major contradictions. All four research files recommend:
- Custom implementation over libraries
- IntersectionObserver over continuous scroll handlers
- Vanilla JS to maintain zero-dependency philosophy
- Reduced-motion support from the start

Minor clarification needed: FEATURES.md mentions Motion library (1.3KB) for variable typing speed. STACK.md recommends pure setTimeout. **Resolution:** Start with uniform setTimeout; add variable timing as polish if needed. Keep zero dependencies.

## Recommended Approach

| Decision | Choice | Confidence |
|----------|--------|------------|
| Terminal implementation | Custom (no library) | HIGH |
| Phase detection | IntersectionObserver | HIGH |
| Typewriter animation | setTimeout recursive | HIGH |
| Scroll integration | Not continuous — discrete phases | HIGH |
| Content storage | Inline data attributes | HIGH |
| Accessibility | Reduced-motion check first | HIGH |

## Implications for Roadmap

### Phase 1: Static Shell + Foundation
**Delivers:**
- DemoWidget.astro with terminal chrome (no content/animation)
- CSS for sticky container, terminal styling
- Index.astro placement (after hero, before prose)
- Reduced-motion check (if set, show static content early)

**Addresses:** Terminal visual frame, sticky layout, accessibility foundation
**Avoids:** innerHTML trap (text in DOM from start)

### Phase 2: Phase Infrastructure + Typewriter
**Delivers:**
- scroll-demo.js with IntersectionObserver
- Phase trigger markers in component
- Typewriter function with setTimeout
- Four phases of demo content
- Phase → typewriter wiring

**Addresses:** Scroll-to-phase mapping, typewriter reveal, phase persistence
**Avoids:** Scroll handler conflict (uses IO not scroll events), memory leaks (timer cleanup)

### Phase 3: Claude Code Styling + Polish
**Delivers:**
- Claude Code visual authenticity (colors, fonts, prompt styling)
- Cursor blink animation
- Semantic content blocks (user vs agent styling)
- Mobile responsive adjustments

**Addresses:** Claude Code aesthetic, cursor behavior
**Avoids:** Heavy effects (minimal styling only)

### Phase 4: Accessibility + Testing
**Delivers:**
- Full reduced-motion implementation (instant text reveal)
- Screen reader testing (VoiceOver)
- Safari/iOS testing
- Performance verification (no jank)

**Addresses:** Accessibility compliance, cross-browser support
**Avoids:** Accessibility neglect

### Phase Ordering Rationale

- **Phase 1 first:** Static shell validates layout before adding complexity
- **Phase 2 second:** Core functionality (phases + typewriter) is the feature
- **Phase 3 third:** Styling after functionality works
- **Phase 4 last:** Testing and accessibility polish after feature complete

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Codebase already has patterns; libraries verified as overkill |
| Features | MEDIUM | Multiple sources agree; Claude Code aesthetic needs visual tuning |
| Architecture | HIGH | Direct codebase analysis; IntersectionObserver pattern proven |
| Pitfalls | HIGH | Authoritative sources (MDN, Chrome DevDocs, W3C WCAG) |

**Overall confidence:** HIGH

### Gaps to Address

- **Claude Code color palette:** Need to verify against actual product (MEDIUM confidence on exact values)
- **Demo script content:** Four phases need actual copy written (creative task, not research)
- **Optimal phase trigger positions:** 5%, 30%, 55%, 80% suggested but tunable during implementation

## Sources

### Primary (HIGH confidence)
- [MDN: Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- [Chrome Developers: Scroll Animation Performance](https://developer.chrome.com/blog/scroll-animation-performance-case-study)
- [W3C WCAG: Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
- [xterm.js GitHub](https://github.com/xtermjs/xterm.js) — Bundle size verification
- [Termynal GitHub](https://github.com/ines/termynal) — Lightweight alternative comparison

### Secondary (MEDIUM confidence)
- [CSS-Tricks: Typewriter Effect](https://css-tricks.com/snippets/css/typewriter-effect/)
- [DEV Community: Terminal Simulation in Browser](https://dev.to/ehlo_250/how-to-create-a-terminal-simulation-in-the-browser-3l54)
- [Pope Tech: Accessible Animation Design](https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/)

### Codebase Analysis
- `site/src/scripts/scroll-scrubber.js` — Existing scroll pattern
- `site/src/scripts/scroll-reveal.js` — Existing IntersectionObserver pattern
- `site/src/components/ScrollVideo.astro` — Existing component structure

---
*Research completed: 2026-01-30*
*Ready for roadmap: yes*
