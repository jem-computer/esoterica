# Architecture Research: Demo Widget

**Domain:** Terminal simulation widget with scroll-triggered phases
**Researched:** 2026-01-30
**Confidence:** HIGH (based on direct codebase analysis)

## Executive Summary

The demo widget integrates as a new Astro component (`DemoWidget.astro`) positioned between the hero and prose sections. It uses a dedicated scroll handler (`scroll-demo.js`) that follows the existing IntersectionObserver pattern from `scroll-reveal.js` rather than the continuous scroll-mapping pattern from `scroll-scrubber.js`. The typewriter animation is self-contained within the component, triggered by phase transitions detected via IntersectionObserver.

**Key architectural decision:** Use IntersectionObserver for phase triggers (like illustrations) rather than continuous scroll position mapping (like video). This provides discrete phase boundaries, better performance, and simpler state management.

## Component Structure

### New Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `DemoWidget.astro` | `site/src/components/DemoWidget.astro` | Terminal UI container with phase markers |
| `scroll-demo.js` | `site/src/scripts/scroll-demo.js` | Phase detection and typewriter orchestration |

### Modified Files

| File | Change |
|------|--------|
| `site/src/pages/index.astro` | Import DemoWidget, add section between hero and prose |
| `site/src/styles/global.css` | Demo widget styles (terminal chrome, typewriter) |

### No New Dependencies

The implementation uses:
- Vanilla JS (consistent with existing scripts)
- IntersectionObserver (browser-native, already used in scroll-reveal.js)
- CSS animations for cursor blink (no JS animation library)
- Inline data attributes for script content (no external JSON)

## Scroll Integration

### Existing Patterns

The site has two scroll handling patterns:

**Pattern A: Continuous Scroll Mapping** (scroll-scrubber.js)
```javascript
// Maps scroll position → video.currentTime
const progress = Math.max(0, Math.min(1, scrolled / scrollable));
video.currentTime = progress * video.duration;
```
- Used for: Hero video scrubbing
- Triggers: Every scroll event (throttled via requestAnimationFrame)
- When to use: Continuous value changes tied to scroll position

**Pattern B: Intersection Observer** (scroll-reveal.js)
```javascript
// Triggers class toggle when element enters viewport
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
);
```
- Used for: Illustration fade-in
- Triggers: Once when element crosses threshold
- When to use: Discrete state transitions

### Demo Widget Strategy: Pattern B (IntersectionObserver)

The demo widget has four discrete phases, not a continuous animation. Each phase:
1. Becomes "active" when its trigger element enters viewport
2. Starts typewriter animation for that phase's content
3. Remains visible as user scrolls past

**Implementation:**

```javascript
// Phase trigger elements (invisible markers within sticky container)
const phaseTriggers = document.querySelectorAll('.demo-phase-trigger');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const phase = entry.target.dataset.phase;
        activatePhase(phase);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
```

### Why Not Continuous Scroll Mapping?

The video scrubber pattern would require:
- Calculating scroll position within a tall container
- Mapping position → phase number
- Handling partial phases (50% through phase 2?)
- More complex state management

The intersection pattern is simpler:
- Define trigger points as DOM elements
- Observer fires once per phase
- Phase activation is binary (not active / active)
- Already proven in this codebase

## Data Flow

### Script Content Structure

Content for each phase lives as data attributes on the component, avoiding external files:

```html
<!-- In DemoWidget.astro -->
<div class="demo-terminal"
     data-phase-1="$ npx @templeofsilicon/esoterica&#10;&#10;Esoterica v1.3.0&#10;..."
     data-phase-2="? Choose a spread&#10;> Single Card&#10;..."
     data-phase-3="Drawing card...&#10;&#10;THE TOWER&#10;..."
     data-phase-4="[Interpretation text...]">
```

Using `&#10;` for newlines keeps content in the markup where it's easy to edit.

### Typewriter Flow

```
Phase trigger enters viewport
         │
         ▼
IntersectionObserver fires
         │
         ▼
activatePhase(phaseNumber)
         │
         ├── Stop any running typewriter
         │
         ├── Get content: terminal.dataset[`phase${phaseNumber}`]
         │
         ├── Clear terminal output area
         │
         ▼
startTypewriter(content, outputElement)
         │
         ├── Split content by character
         │
         ├── Recursive setTimeout (30-50ms per char)
         │
         ├── Handle newlines (instant)
         │
         └── Mark complete when done
```

### State Management

Minimal state, held in module scope:

```javascript
let currentPhase = 0;
let typewriterTimeout = null;
let typewriterComplete = false;

function activatePhase(phase) {
  if (phase <= currentPhase) return; // No going backwards
  currentPhase = phase;
  // ... start typewriter
}
```

No need for complex state libraries. The demo is linear (phases 1 → 2 → 3 → 4), non-interactive beyond scrolling.

## File Structure

### Directory Layout

```
site/src/
├── components/
│   ├── ScrollVideo.astro      # Existing
│   └── DemoWidget.astro       # NEW
├── scripts/
│   ├── scroll-scrubber.js     # Existing (video)
│   ├── scroll-reveal.js       # Existing (illustrations)
│   └── scroll-demo.js         # NEW (demo phases)
├── styles/
│   └── global.css             # Add demo styles
└── pages/
    └── index.astro            # Import + place DemoWidget
```

### DemoWidget.astro Structure

```astro
---
// No props needed - content is inline
---

<section class="demo" aria-label="Interactive demo">
  <div class="demo-sticky">
    <!-- Terminal chrome -->
    <div class="demo-terminal">
      <div class="demo-terminal-header">
        <span class="demo-terminal-button"></span>
        <span class="demo-terminal-button"></span>
        <span class="demo-terminal-button"></span>
        <span class="demo-terminal-title">Terminal</span>
      </div>
      <div class="demo-terminal-body">
        <pre class="demo-output"></pre>
        <span class="demo-cursor"></span>
      </div>
    </div>
  </div>

  <!-- Phase trigger markers (positioned via CSS) -->
  <div class="demo-phase-trigger" data-phase="1"></div>
  <div class="demo-phase-trigger" data-phase="2"></div>
  <div class="demo-phase-trigger" data-phase="3"></div>
  <div class="demo-phase-trigger" data-phase="4"></div>
</section>
```

### CSS Architecture

Add to global.css, following existing patterns:

```css
/* ===== DEMO WIDGET ===== */
.demo {
  position: relative;
  height: 400vh; /* 100vh per phase */
  background: var(--bg-page);
}

.demo-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.demo-terminal {
  width: 100%;
  max-width: 42rem;
  background: var(--demo-bg);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

/* Phase triggers - invisible markers */
.demo-phase-trigger {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  pointer-events: none;
}

.demo-phase-trigger[data-phase="1"] { top: 5%; }
.demo-phase-trigger[data-phase="2"] { top: 30%; }
.demo-phase-trigger[data-phase="3"] { top: 55%; }
.demo-phase-trigger[data-phase="4"] { top: 80%; }
```

## Build Order

Recommended implementation sequence based on dependencies:

### Phase 1: Static Shell

1. **DemoWidget.astro** - Terminal UI markup only (no content, no animation)
2. **global.css additions** - Terminal chrome styling, sticky container
3. **index.astro** - Import and place between hero and prose

**Checkpoint:** Scrolling shows static terminal container, sticky behavior works.

### Phase 2: Phase Infrastructure

4. **Phase trigger markers** - Add invisible triggers to DemoWidget.astro
5. **scroll-demo.js skeleton** - IntersectionObserver setup, console.log phase transitions
6. **index.astro** - Import scroll-demo.js

**Checkpoint:** Console logs phase transitions as you scroll through demo section.

### Phase 3: Typewriter Core

7. **Typewriter function** - Character-by-character output with cursor
8. **Content data** - Add data-phase-N attributes with actual script content
9. **Phase → typewriter wiring** - activatePhase starts typewriter for that phase

**Checkpoint:** Scrolling triggers typewriter animation for each phase.

### Phase 4: Polish

10. **Reduced motion** - Show all content immediately, no animation
11. **Mobile styles** - Responsive terminal sizing
12. **Theme support** - Dark/light terminal colors

**Checkpoint:** Complete, accessible demo widget.

## Integration Points

### With Hero Section

The demo comes after the hero's 300vh scroll region. No overlap:

```html
<div class="hero"><!-- 300vh, sticky video --></div>
<section class="demo"><!-- 400vh, sticky terminal --></section>
<section class="prose"><!-- Normal flow --></section>
```

### With Theme System

Use existing CSS custom properties:

```css
[data-theme="light"] {
  --demo-bg: #1E1E1E;      /* Dark terminal on light page */
  --demo-text: #D4D4D4;
  --demo-accent: #C586C0;   /* Purple for prompts */
}

[data-theme="dark"] {
  --demo-bg: #0D0D0D;      /* Darker terminal on dark page */
  --demo-text: #D4D4D4;
  --demo-accent: #C586C0;
}
```

Note: Terminal stays dark in both themes (standard terminal aesthetic). Only the shadow/border adapts.

### With Reduced Motion

Follow existing pattern from scroll-reveal.js:

```javascript
// In scroll-demo.js
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Show all phases immediately, no typewriter
  showAllPhasesInstantly();
  return;
}
```

```css
/* In global.css */
@media (prefers-reduced-motion: reduce) {
  .demo-cursor {
    animation: none;
  }
}
```

## Anti-Patterns to Avoid

### 1. Over-engineering State

**Don't:** Use a state management library or complex pub/sub for four phases.
**Do:** Simple module-scope variables (`currentPhase`, `typewriterTimeout`).

### 2. External Content Files

**Don't:** Load phase content from JSON or separate files.
**Do:** Inline content in data attributes. Four phases with ~20 lines each is not worth the complexity of async loading.

### 3. Mixing Scroll Patterns

**Don't:** Use continuous scroll position for phase detection.
**Do:** Use IntersectionObserver for discrete phases. Cleaner, more performant, consistent with existing illustration reveals.

### 4. Animating Too Much

**Don't:** Animate the terminal container, fade between phases, etc.
**Do:** Only the typewriter text animates. Container is stable. Reduces cognitive load and motion sickness risk.

### 5. Forgetting Reduced Motion

**Don't:** Assume typewriter animation is fine for everyone.
**Do:** Check `prefers-reduced-motion` first, show content instantly if set.

## Sources

- Direct codebase analysis of:
  - `/Users/jem/code/111ecosystem/esoterica/site/src/scripts/scroll-scrubber.js`
  - `/Users/jem/code/111ecosystem/esoterica/site/src/scripts/scroll-reveal.js`
  - `/Users/jem/code/111ecosystem/esoterica/site/src/components/ScrollVideo.astro`
  - `/Users/jem/code/111ecosystem/esoterica/site/src/pages/index.astro`
  - `/Users/jem/code/111ecosystem/esoterica/site/src/styles/global.css`
- Existing project architecture patterns established in v1.4 milestone
