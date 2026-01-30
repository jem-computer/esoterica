# Stack Research: Demo Widget

**Domain:** Terminal simulation widget with typewriter animations
**Researched:** 2026-01-30
**Confidence:** HIGH

## Executive Summary

**Recommendation: Custom implementation using vanilla JavaScript and CSS.**

The existing site has zero runtime npm dependencies, uses vanilla JS for scroll-driven video and IntersectionObserver for reveals, and follows a "no build complexity" philosophy. The demo widget should maintain this pattern. Terminal emulator libraries like xterm.js (265KB minified) are dramatically overkill for a read-only display. Lightweight alternatives like Termynal (~6KB total) exist but add unnecessary dependencies when custom implementation is ~50 lines of JS and ~100 lines of CSS.

## Terminal Simulation Options

### Option 1: xterm.js (NOT RECOMMENDED)

| Aspect | Details |
|--------|---------|
| Bundle size | 265KB minified (~85KB gzipped) |
| Purpose | Full terminal emulation with input handling |
| Features | ANSI codes, cursor movement, WebGL rendering, websocket connections |
| Used by | VS Code, Azure Cloud Shell, Replit |

**Why NOT for this project:**
- Massive overkill for read-only display
- Designed for interactive terminals with shell connections
- Would be the only npm runtime dependency
- 265KB for a feature that needs ~2KB of CSS

Sources: [xterm.js GitHub](https://github.com/xtermjs/xterm.js), [xterm.js Releases](https://github.com/xtermjs/xterm.js/releases)

### Option 2: jQuery Terminal (NOT RECOMMENDED)

| Aspect | Details |
|--------|---------|
| Bundle size | ~140KB (plus jQuery dependency) |
| Purpose | Interactive command-line interpreters |
| Features | Custom commands, prompt customization, command history |

**Why NOT for this project:**
- Requires jQuery (not used anywhere in project)
- Interactive features unused
- Heavy for display-only use case

Source: [jQuery Terminal](https://terminal.jcubic.pl/)

### Option 3: Termynal (CONSIDERED BUT NOT RECOMMENDED)

| Aspect | Details |
|--------|---------|
| Bundle size | ~4KB JS + ~2KB CSS = ~6KB total |
| Purpose | Terminal animation for documentation/demos |
| Features | Typewriter effect, progress bars, custom prompts, async/await |
| License | MIT |

**Pros:**
- Lightweight and purpose-built for demos
- No dependencies
- Graceful degradation (content visible without JS)

**Why NOT for this project:**
- External dependency when custom is equally simple
- Style opinions may conflict with Claude Code aesthetic
- No benefit over custom implementation for this use case

Source: [Termynal GitHub](https://github.com/ines/termynal)

### Option 4: Custom Implementation (RECOMMENDED)

| Aspect | Details |
|--------|---------|
| Bundle size | ~0 (inline in component) |
| Purpose | Exactly what we need, nothing more |
| Features | Typewriter text, cursor blink, phase transitions |
| Maintenance | Self-owned, no version updates to track |

**Why RECOMMENDED:**
- Zero new dependencies (maintains site philosophy)
- Complete control over Claude Code visual styling
- Integrates directly with existing IntersectionObserver pattern
- ~50 lines JS + ~100 lines CSS
- No learning curve for future maintainers

## Typewriter Animation Approaches

### Approach A: CSS-Only Typewriter (NOT RECOMMENDED)

Uses `width` animation with `steps()` function and `overflow: hidden`.

```css
@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}
.typewriter {
  animation: typing 3.5s steps(40, end);
  white-space: nowrap;
  overflow: hidden;
}
```

**Pros:**
- No JavaScript needed
- GPU-accelerated, very performant

**Cons:**
- Requires monospace fonts (or careful step calculation)
- Cannot handle dynamic content length
- Cannot pause/resume mid-animation
- Each line needs its own animation timing
- Poor fit for multi-line terminal output

Source: [CSS-Tricks Typewriter Effect](https://css-tricks.com/snippets/css/typewriter-effect/)

### Approach B: setTimeout Recursive (RECOMMENDED)

Character-by-character output with configurable delay.

```javascript
function typewrite(text, element, charDelay = 30) {
  let i = 0;
  function type() {
    if (i < text.length) {
      element.textContent += text[i];
      i++;
      setTimeout(type, charDelay);
    }
  }
  type();
}
```

**Pros:**
- Full control over timing
- Easy to pause/stop (clear timeout)
- Handles any content length
- Can vary speed (fast for commands, slow for dramatic text)
- Works with multi-line output naturally

**Cons:**
- Slightly less performant than CSS (negligible for this use case)
- More code than CSS approach

**Why RECOMMENDED:**
- Phase transitions require stopping and restarting typewriter
- Content length varies per phase
- Need to coordinate with scroll events
- Already have similar patterns in codebase (setTimeout in scroll-scrubber.js)

### Approach C: requestAnimationFrame Loop (CONSIDERED)

Uses rAF for timing consistency across refresh rates.

```javascript
function typewrite(text, element) {
  let i = 0;
  let lastTime = 0;
  const charDelay = 30;

  function frame(time) {
    if (time - lastTime > charDelay && i < text.length) {
      element.textContent += text[i++];
      lastTime = time;
    }
    if (i < text.length) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
```

**Pros:**
- Synced with display refresh rate
- Better for continuous animations

**Cons:**
- Overkill for text output at 30ms intervals
- Harder to cancel than setTimeout

**Why NOT recommended:**
- setTimeout is simpler and sufficient
- Text output doesn't benefit from frame sync (unlike video scrubbing)

## Scroll Integration

### Existing Pattern: IntersectionObserver

The site already uses IntersectionObserver for illustration reveals (scroll-reveal.js). The demo widget should follow this pattern:

```javascript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activatePhase(entry.target.dataset.phase);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
```

**Why this works:**
- Discrete phase transitions (not continuous scrubbing)
- Already proven in codebase
- Excellent browser support
- More performant than scroll event listeners

**Integration points:**
- Phase trigger elements positioned within sticky container
- Observer fires once per phase, starts typewriter
- No need to track scroll position continuously

Sources: [MDN IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), existing `scroll-reveal.js` in codebase

## Claude Code Visual Styling

Claude Code's terminal UI is built with React and Ink, rendering to terminal with ANSI color codes. For a web simulation, key visual elements include:

| Element | Styling |
|---------|---------|
| Background | Dark (#0D0D0D to #1E1E1E) |
| Text | Light gray (#D4D4D4) |
| Prompts | Purple/magenta accent (#C586C0) |
| Success | Green (#4EC9B0) |
| Commands | Yellow (#DCDCAA) |
| Font | Monospace (SF Mono, Monaco, Consolas) |

**Implementation approach:**
- CSS custom properties for colors
- Semantic classes for text types (`.demo-prompt`, `.demo-command`, `.demo-output`)
- Keep terminal dark in both light/dark page themes (standard terminal aesthetic)

Source: [Claude Code Terminal Config](https://code.claude.com/docs/en/terminal-config)

## Recommendation

### Stack Additions: NONE

No new npm dependencies. Custom implementation using:

| Technology | Purpose | Already in Project |
|------------|---------|-------------------|
| Vanilla JavaScript | Typewriter logic, phase orchestration | Yes |
| IntersectionObserver | Phase trigger detection | Yes (scroll-reveal.js) |
| CSS animations | Cursor blink | Yes (pattern established) |
| CSS custom properties | Theme-aware colors | Yes |

### Implementation Outline

**New files:**
1. `DemoWidget.astro` - Component with terminal markup and phase content
2. `scroll-demo.js` - IntersectionObserver + typewriter logic

**Modified files:**
1. `global.css` - Terminal chrome and typewriter styles
2. `index.astro` - Import and placement

### What NOT to Add

| Library | Why Not |
|---------|---------|
| xterm.js | 265KB for read-only display is absurd |
| jQuery Terminal | Requires jQuery, interactive features unused |
| Termynal | External dependency when custom is equally simple |
| TypeIt | Commercial license, overkill features |
| TypewriterJS | npm dependency when ~50 lines suffices |
| Any CSS animation library | Cursor blink is one @keyframes rule |

### Performance Considerations

| Concern | Mitigation |
|---------|------------|
| Typewriter blocking main thread | setTimeout yields between characters |
| Memory leaks | Clear timeout on phase change and unmount |
| Accessibility | prefers-reduced-motion shows content instantly |
| Mobile performance | No canvas, no WebGL, minimal JS execution |

**Expected JS execution:**
- One IntersectionObserver (constant)
- One setTimeout chain per phase (~100-200 characters at 30ms = 3-6 seconds)
- No scroll event listeners for demo (IntersectionObserver handles it)

## Confidence Assessment

| Area | Confidence | Justification |
|------|------------|---------------|
| Terminal library decision | HIGH | Bundle sizes verified via GitHub releases |
| Custom implementation | HIGH | Existing codebase patterns prove feasibility |
| Typewriter approach | HIGH | setTimeout pattern already used in project |
| Scroll integration | HIGH | IntersectionObserver already proven |
| Claude Code styling | MEDIUM | Based on official docs, may need visual tuning |

## Sources

**Verified with official documentation/GitHub:**
- [xterm.js](https://xtermjs.org/) - Bundle size and features
- [xterm.js GitHub Releases](https://github.com/xtermjs/xterm.js/releases) - Size reduction to 265KB
- [Termynal GitHub](https://github.com/ines/termynal) - Lightweight alternative (~6KB total)
- [jQuery Terminal](https://terminal.jcubic.pl/) - Interactive terminal library
- [CSS-Tricks Typewriter Effect](https://css-tricks.com/snippets/css/typewriter-effect/) - CSS-only approach
- [Claude Code Terminal Config](https://code.claude.com/docs/en/terminal-config) - Visual styling reference
- [MDN IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) - Scroll integration

**Existing codebase analysis:**
- `/Users/jem/code/111ecosystem/esoterica/site/src/scripts/scroll-reveal.js` - IntersectionObserver pattern
- `/Users/jem/code/111ecosystem/esoterica/site/src/scripts/scroll-scrubber.js` - Scroll handling pattern
- `/Users/jem/code/111ecosystem/esoterica/.planning/research/ARCHITECTURE-DEMO.md` - Component structure
