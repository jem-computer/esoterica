# Pitfalls Research: Demo Widget

**Domain:** Terminal simulation with scroll-driven typewriter animation
**Researched:** 2026-01-30
**Confidence:** HIGH (verified against existing codebase and authoritative sources)

## Executive Summary

The three pitfalls most likely to sink this feature:

1. **Main thread animation jank** - JavaScript-based typewriter animations compete with scroll handling, causing stuttering on mobile devices with limited CPU budgets
2. **Accessibility neglect** - Empty containers break screen readers; missing reduced-motion support violates WCAG 2.3.3; typewriter effects create cognitive barriers
3. **Existing scroll handler conflict** - The site already has two scroll-based systems (`scroll-scrubber.js` + `scroll-reveal.js`); a third risks compounding performance issues and creating timing conflicts

## Animation Pitfalls

### 1. Typewriter innerHTML Trap (CRITICAL)

**What goes wrong:** Most typewriter implementations start with an empty element and append characters to `innerHTML`. This:
- Breaks screen readers (element appears empty on page load)
- Hurts SEO (crawlers see empty content)
- Causes layout shifts as text appears
- Forces reflow on every character append

**Warning signs:**
- Element starts with no text content
- Text stored only in JavaScript
- Layout jumps during animation

**Prevention:**
- Keep full text in HTML from the start
- Use `color: transparent` or `clip-path` to hide text visually
- Reveal text via `::after` pseudo-element or gradually changing opacity
- Text remains accessible to screen readers and crawlers throughout

**Phase to address:** Phase 1 (Foundation) - architecture decision

### 2. setTimeout Timing Drift

**What goes wrong:** Using `setTimeout` for character timing causes inconsistent animation speed, especially during scroll events when the main thread is busy. Characters appear in bursts rather than smooth typing.

**Warning signs:**
- Uneven character timing
- Animation speeds up/slows down during scroll
- Performance issues in DevTools timeline

**Prevention:**
- Use `requestAnimationFrame` for animation loop
- Calculate elapsed time and derive animation state from it
- Tie animation progress to scroll position, not independent timer

**Phase to address:** Phase 2 (Animation System)

### 3. Scroll-to-Phase Synchronization Gap

**What goes wrong:** Animation phase (1-4) calculated from scroll position can desync from typewriter animation state. User scrolls to phase 3, but typewriter is still finishing phase 1 text.

**Warning signs:**
- Text from wrong phase visible
- Jarring content jumps when scrolling fast
- Incomplete text when scrolling backward

**Prevention:**
- Make typewriter animation instant-seekable (like video scrubbing)
- Calculate which character should be visible at any scroll position
- Skip animation when scrolling fast; animate only when near threshold
- Consider: scroll position = source of truth, typewriter state = derived

**Phase to address:** Phase 2 (Animation System)

### 4. Memory Leaks from Uncanceled Timers

**What goes wrong:** Animation timers (`setTimeout`, `setInterval`, `requestAnimationFrame`) not cleaned up when component unmounts or scroll section leaves viewport. Leads to accumulating orphan timers.

**Warning signs:**
- Memory grows over time in DevTools
- Console errors about updating unmounted components
- Animations continue after scrolling away

**Prevention:**
- Store timer references and cancel on cleanup
- Use `cancelAnimationFrame` when scroll leaves demo section
- Implement single animation loop pattern (not timer-per-character)
- Test with DevTools heap snapshots before/after scroll cycles

**Phase to address:** Phase 2 (Animation System)

## Accessibility Pitfalls

### 5. No prefers-reduced-motion Support (CRITICAL)

**What goes wrong:** Vestibular disorders affect 70+ million people. Rapid typewriter animation can trigger vertigo, migraines, or seizures. Missing reduced-motion support violates WCAG 2.3.3.

**Warning signs:**
- No `@media (prefers-reduced-motion)` in CSS
- No JavaScript check for motion preference
- Animation has no fallback state

**Prevention:**
- Check `window.matchMedia('(prefers-reduced-motion: reduce)')` early
- Show full text immediately for reduced-motion users (no typing)
- Existing pattern in codebase: `scroll-scrubber.js` line 23-31
- Test by toggling setting: DevTools > Rendering > Emulate reduced motion

**Phase to address:** Phase 1 (Foundation) - build in from start

### 6. Screen Reader Invisible Content

**What goes wrong:** Screen readers announce empty or incomplete text during typewriter animation. User hears gibberish or nothing.

**Warning signs:**
- VoiceOver/NVDA reads incomplete text
- Element has no text at page load
- Dynamic text updates not announced properly

**Prevention:**
- Full text always present in DOM (hidden visually, not from AT)
- Use `aria-label` or `aria-describedby` with complete text
- Consider `aria-live="polite"` for phase transitions (not per-character)
- Test with VoiceOver: `Cmd+F5` on macOS

**Phase to address:** Phase 1 (Foundation)

### 7. Keyboard/Focus Trap

**What goes wrong:** Demo widget receives focus but has no keyboard interaction, or worse, prevents keyboard navigation past it.

**Warning signs:**
- Tab key gets stuck
- No visible focus indicator
- Widget not reachable by keyboard

**Prevention:**
- Use semantic HTML (`<pre>`, `<code>`) not custom elements
- Ensure widget is either focusable with `tabindex="0"` or skippable
- Test: can you Tab through the entire page without getting stuck?

**Phase to address:** Phase 3 (Polish)

## Performance Pitfalls

### 8. Main Thread Blocking During Scroll (CRITICAL)

**What goes wrong:** JavaScript scroll handlers compete for main thread with typewriter animation. On mobile (8.33ms frame budget at 120Hz), this causes visible jank.

**Warning signs:**
- Stuttering scroll on mobile devices
- Long tasks in Performance panel
- Frame drops below 60fps

**Prevention:**
- Minimize JavaScript in scroll handler (existing pattern: `ticking` flag)
- Animate only compositor-friendly properties: `transform`, `opacity`
- Do NOT animate: `width`, `height`, `top`, `left`, `color`, `background`
- Consider CSS scroll-driven animations (Chrome 115+) but requires polyfill/fallback

**Phase to address:** Phase 2 (Animation System)

### 9. Layout Thrashing

**What goes wrong:** Reading layout properties (like `getBoundingClientRect`) and writing style properties in same frame forces synchronous reflow. Multiply by scroll handler = severe jank.

**Warning signs:**
- Forced reflow warnings in DevTools
- Purple bars in Performance timeline
- Scroll feels "heavy"

**Prevention:**
- Batch all reads before writes
- Cache layout values (element positions) on resize, not scroll
- Existing pattern: `scroll-scrubber.js` reads once per rAF frame

**Phase to address:** Phase 2 (Animation System)

### 10. IntersectionObserver Threshold 1.0 Never Fires

**What goes wrong:** Setting threshold of 1.0 (100% visible) may never trigger if element can't be fully visible due to container constraints or scroll snap.

**Warning signs:**
- Animation never starts/stops at expected scroll position
- Works on some viewport sizes, not others
- Inconsistent behavior across browsers

**Prevention:**
- Use threshold 0.9 or lower for "fully visible" detection
- Use `rootMargin` to adjust trigger point
- Test on multiple viewport sizes and browsers

**Phase to address:** Phase 2 (Animation System)

## Integration Pitfalls

### 11. Conflicting Scroll Handlers (CRITICAL)

**What goes wrong:** Site already has two scroll-based systems:
- `scroll-scrubber.js`: Video scrubbing in hero section
- `scroll-reveal.js`: IntersectionObserver for illustrations

Adding a third scroll handler for the demo widget risks:
- Multiple `requestAnimationFrame` loops competing
- Inconsistent scroll progress calculations
- Debugging nightmare with three systems

**Warning signs:**
- Demo widget and video scrubbing both stutter
- Scroll position calculations drift apart
- Hard to trace which handler causes issues

**Prevention:**
- Consider extending existing `scroll-scrubber.js` rather than new script
- Use same `ticking` pattern for frame rate limiting
- If separate script, ensure it only activates when demo section is in view
- Use IntersectionObserver to enable/disable demo scroll handling

**Phase to address:** Phase 1 (Foundation) - architecture decision

### 12. View Transitions Conflict (if enabled later)

**What goes wrong:** Astro's View Transitions API can break scroll-based animations. Scripts don't re-run after page navigation. Scroll position becomes part of transition animation.

**Warning signs:**
- Animation works on first load, breaks on navigation
- Scroll position resets unexpectedly
- Animation continues after navigating away

**Prevention:**
- Listen for `astro:after-swap` event to reinitialize
- Store animation state that survives transitions
- Test with View Transitions enabled (currently not enabled in this site)

**Phase to address:** Future consideration (not currently using View Transitions)

### 13. Zero Runtime Dependencies Violation

**What goes wrong:** Project currently has zero runtime dependencies. Adding a typewriter library or animation framework breaks this constraint unnecessarily.

**Warning signs:**
- `npm install` for animation library
- Bundle size increases significantly
- New dependencies appear in package.json

**Prevention:**
- Build typewriter animation from scratch (it's not complex)
- Follow existing vanilla JS patterns in `scroll-scrubber.js`
- Maximum: one small utility if truly needed (< 2KB)

**Phase to address:** Phase 1 (Foundation) - technology decision

### 14. CSS Custom Properties Collision

**What goes wrong:** Demo widget CSS variables collide with existing design system. Colors or spacing suddenly wrong throughout site.

**Warning signs:**
- Existing components change appearance
- Hard-to-trace styling bugs
- Variables override unexpectedly

**Prevention:**
- Namespace demo widget variables: `--demo-*` prefix
- Scope styles to demo widget container
- Audit existing variables in `global.css` before adding new ones

**Phase to address:** Phase 3 (Visual Polish)

## Browser Compatibility Pitfalls

### 15. Safari Scroll Timing Differences

**What goes wrong:** Safari handles scroll events and `requestAnimationFrame` timing differently than Chrome. Animation may stutter or trigger at wrong positions.

**Warning signs:**
- Works in Chrome, broken in Safari
- Timing-dependent tests fail intermittently
- Scroll position drift on iOS

**Prevention:**
- Test on actual iOS device, not just simulator
- Existing workaround pattern: timeout fallback in `scroll-scrubber.js` line 16-21
- Use `passive: true` on scroll listeners (already done)

**Phase to address:** Phase 4 (Testing/Polish)

### 16. CSS Scroll-Driven Animations Browser Support

**What goes wrong:** Native CSS scroll-driven animations (Chrome 115+) not supported in Safari or Firefox (behind flag). Using them without fallback breaks for majority of users.

**Warning signs:**
- Animation only works in Chrome
- No `@supports` feature detection
- Safari shows static content

**Prevention:**
- JavaScript-based approach as primary (works everywhere)
- Consider CSS scroll-driven as progressive enhancement later
- Use `@supports (animation-timeline: scroll())` for feature detection

**Phase to address:** Future enhancement (not for MVP)

## Prevention Checklist

Quick reference for each phase:

### Phase 1: Foundation
- [ ] Full text in DOM from start (not empty + filled by JS)
- [ ] Check `prefers-reduced-motion` before any animation code runs
- [ ] Decide: extend `scroll-scrubber.js` or create new script?
- [ ] No new npm dependencies
- [ ] Namespace CSS variables with `--demo-*`

### Phase 2: Animation System
- [ ] `requestAnimationFrame` for animation loop
- [ ] Scroll position = source of truth for animation state
- [ ] Only animate `transform` and `opacity`
- [ ] Store and cancel timer references on cleanup
- [ ] Use IntersectionObserver threshold < 1.0

### Phase 3: Visual Polish
- [ ] Screen reader testing (VoiceOver)
- [ ] Keyboard navigation testing (Tab through page)
- [ ] Mobile performance testing (real device)
- [ ] Reduced motion fallback shows complete content

### Phase 4: Testing
- [ ] Safari iOS testing
- [ ] Multiple viewport sizes
- [ ] DevTools Performance panel check
- [ ] Memory leak testing (heap snapshots)

## Sources

### Typewriter Animation
- [MTG Dev - Accessible & SEO-friendly Typewriter Effect](https://mtg-dev.tech/blog/how-to-create-typewriter-effect-that-is-accessible-and-seo-friendly)
- [CSS-Tricks - Typewriter Effect](https://css-tricks.com/snippets/css/typewriter-effect/)

### Scroll Animation Performance
- [Chrome Developers - Scroll Animation Performance Case Study](https://developer.chrome.com/blog/scroll-animation-performance-case-study)
- [CSS-Tricks - Unleash the Power of Scroll-Driven Animations](https://css-tricks.com/unleash-the-power-of-scroll-driven-animations/)
- [Chrome Developers - CSS Scroll-Triggered Animations](https://developer.chrome.com/blog/scroll-triggered-animations)

### Accessibility
- [Pope Tech - Design Accessible Animation and Movement](https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/)
- [W3C - Understanding WCAG 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
- [MDN - prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)

### IntersectionObserver
- [MDN - Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Web Dev Simplified - Intersection Observer Ultimate Guide](https://blog.webdevsimplified.com/2022-01/intersection-observer/)

### Memory Leaks
- [David Walsh - Reducing Memory Leaks When Working with Animations](https://davidwalsh.name/reducing-memory-leaks-working-animations)
- [Video.js PR - setTimeout and requestAnimationFrame memory leak](https://github.com/videojs/video.js/pull/5294)

### Astro Integration
- [LaunchFast - Using AOS in Astro](https://www.launchfa.st/blog/aos-astro/)
- [WebReaper - Using AOS with View Transitions in Astro](https://webreaper.dev/posts/astro-aos-view-transitions/)
