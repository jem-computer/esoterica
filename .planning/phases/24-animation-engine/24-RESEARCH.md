# Phase 24: Animation Engine - Research

**Researched:** 2026-01-30
**Domain:** Scroll-triggered phase transitions with typewriter text animation
**Confidence:** HIGH

## Summary

Phase 24 implements the animation system that brings the Terminal widget to life. IntersectionObserver detects which scroll zone the user is in (ask/pull/interpret/integrate), triggering typewriter animations for each phase's text. The foundation from Phase 23 provides a sticky terminal container with all text pre-loaded in the DOM via `data-phase` attributes.

The implementation follows the existing `scroll-reveal.js` pattern (IntersectionObserver for discrete triggers) rather than the `scroll-scrubber.js` pattern (continuous scroll mapping). This is appropriate because phase transitions are discrete events, not continuous values. The typewriter effect uses `setTimeout` recursion with proper cleanup to prevent memory leaks.

**Primary recommendation:** Use IntersectionObserver with multiple threshold triggers to detect phase transitions. Store previous `boundingClientRect.y` to detect scroll direction. For scroll-back behavior, re-highlight completed phases but skip re-animation (persist completed state). Typewriter uses setTimeout at 25ms per character with brief pauses at punctuation. Always check `prefers-reduced-motion` and show text instantly if set.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| IntersectionObserver | Browser API | Phase transition detection | Already used in scroll-reveal.js, performant |
| setTimeout/clearTimeout | Browser API | Typewriter character timing | Simpler than rAF for this use case, cancellable |
| CSS Custom Properties | CSS3 | Animation state styling | Already in global.css |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| requestAnimationFrame | Browser API | Frame-synced updates | Only if experiencing timing drift |
| matchMedia | Browser API | Reduced motion detection | Always check before animating |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| IntersectionObserver | scroll event + getBoundingClientRect | More code, worse performance |
| setTimeout | requestAnimationFrame | Overkill for 25ms text updates, harder to cancel |
| setTimeout | CSS animation with steps() | Cannot handle variable content length |
| Custom implementation | TypeIt, Termynal | Unnecessary dependency, custom is ~50 lines |

**Installation:**
```bash
# No additional dependencies - browser-native APIs only
```

## Architecture Patterns

### Recommended Project Structure
```
site/src/
├── scripts/
│   └── terminal-animation.js   # NEW: phase detection + typewriter
├── components/
│   └── Terminal.astro          # EXISTING: add script import
└── styles/
    └── global.css              # EXISTING: add animation state classes
```

### Pattern 1: Phase State Machine
**What:** Track current phase and scroll direction to determine animation behavior
**When to use:** For managing discrete phase transitions with persistence
**Example:**
```javascript
// Source: Existing codebase patterns + MDN IntersectionObserver
const state = {
  currentPhase: 0,
  completedPhases: new Set(),
  typewriterTimeoutId: null,
  lastY: undefined
};

function handlePhaseChange(phase, direction) {
  if (direction === 'down' && !state.completedPhases.has(phase)) {
    // New phase: start typewriter
    startTypewriter(phase);
    state.completedPhases.add(phase);
  } else if (direction === 'up') {
    // Scroll back: re-highlight but don't re-animate
    highlightPhase(phase);
  }
  state.currentPhase = phase;
}
```

### Pattern 2: Scroll Direction Detection via IntersectionObserver
**What:** Compare `boundingClientRect.y` across callbacks to determine scroll direction
**When to use:** When you need to differentiate scroll-up vs scroll-down behavior
**Example:**
```javascript
// Source: MDN + Ben Frain's IntersectionObserver direction detection
let lastY = undefined;

function detectDirection(entry) {
  const currentY = entry.boundingClientRect.y;
  const direction = lastY === undefined || currentY < lastY ? 'down' : 'up';
  lastY = currentY;
  return direction;
}
```

### Pattern 3: Typewriter with Cleanup
**What:** Character-by-character reveal with proper timer cleanup
**When to use:** For typewriter animations that may be interrupted
**Example:**
```javascript
// Source: MDN setTimeout/clearTimeout + pitfall research
function startTypewriter(element, text, charDelay = 25) {
  let index = 0;
  let timeoutId = null;

  function type() {
    if (index < text.length) {
      const char = text[index];
      element.textContent += char;
      index++;

      // Brief pause at punctuation
      const delay = '.!?,;:'.includes(char) ? charDelay * 4 : charDelay;
      timeoutId = setTimeout(type, delay);
    }
  }

  type();

  // Return cleanup function
  return function cancel() {
    clearTimeout(timeoutId);
  };
}
```

### Pattern 4: Phase Trigger Zones
**What:** Invisible marker elements positioned via CSS to define scroll zones
**When to use:** For creating scroll-based trigger points within a sticky container
**Example:**
```html
<!-- Source: Existing architecture research -->
<div class="terminal-container" style="height: 400vh;">
  <!-- Phase trigger markers - invisible, positioned absolutely -->
  <div class="phase-trigger" data-phase="1" style="top: 5%;"></div>
  <div class="phase-trigger" data-phase="2" style="top: 30%;"></div>
  <div class="phase-trigger" data-phase="3" style="top: 55%;"></div>
  <div class="phase-trigger" data-phase="4" style="top: 80%;"></div>

  <!-- Sticky terminal (from Phase 23) -->
  <section class="terminal">...</section>
</div>
```

### Anti-Patterns to Avoid
- **Re-animating on scroll-up:** User sees text they've already read typed again. Instead, show completed state instantly.
- **Empty container until animation:** Breaks screen readers and SEO. Text must be in DOM from start (Phase 23 handles this).
- **Animating during scroll:** Causes jank. Only animate when user pauses at a phase.
- **Multiple setTimeout chains:** Memory leak risk. Cancel previous before starting new.
- **Threshold 1.0:** May never fire if element can't be 100% visible. Use 0.9 or lower.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Phase detection | scroll position math | IntersectionObserver | Built-in, performant, handles edge cases |
| Scroll direction | window.scrollY comparison | entry.boundingClientRect.y | More reliable, integrated with observer |
| Motion preference | Custom toggle | matchMedia('prefers-reduced-motion') | OS-level, already in codebase |
| Timer cleanup | Manual tracking | Store and clear timeout ID | Standard pattern, prevents leaks |

**Key insight:** The browser provides all the primitives needed. IntersectionObserver + setTimeout + matchMedia = complete solution with no dependencies.

## Common Pitfalls

### Pitfall 1: Memory Leaks from Uncanceled Timers
**What goes wrong:** Typewriter setTimeout continues running after user scrolls away, accumulating orphan timers that never clean up.
**Why it happens:** Starting new typewriter without canceling previous one.
**How to avoid:** Store timeout ID in module state, call `clearTimeout(state.typewriterTimeoutId)` before starting any new animation.
**Warning signs:** Memory grows over time in DevTools, console errors about updating unmounted components.

### Pitfall 2: Text Completes Instantly on Fast Scroll
**What goes wrong:** User scrolls quickly through all phases, sees completed text everywhere (no animation).
**Why it happens:** IntersectionObserver fires rapidly, each phase immediately marks as "completed" before animation finishes.
**How to avoid:** Separate "entered" vs "completed" state. If user scrolls away mid-animation, complete text instantly (requirement SCRL-03), but track it was due to scroll-away, not natural completion.
**Warning signs:** Text appears fully typed even when scrolling slowly through phases.

### Pitfall 3: Scroll-Back Re-Animates
**What goes wrong:** User scrolls up to phase 2, sees text type out again character by character.
**Why it happens:** Animation triggered whenever phase enters viewport, regardless of direction or prior state.
**How to avoid:** Track `completedPhases` Set. On scroll-up, highlight phase but skip typewriter if already in Set (requirement SCRL-03).
**Warning signs:** Text re-types when scrolling up through the demo.

### Pitfall 4: Phase Indicator Desync
**What goes wrong:** Active indicator dot doesn't match the currently visible phase.
**Why it happens:** Indicator update in different code path than phase activation, race conditions.
**How to avoid:** Single source of truth: phase state machine updates indicator in same function that handles content.
**Warning signs:** Wrong dot lit up, multiple dots lit simultaneously.

### Pitfall 5: Reduced Motion Ignored
**What goes wrong:** Typewriter animation runs for users who have enabled "reduce motion" OS setting.
**Why it happens:** Forgot to check `matchMedia('prefers-reduced-motion: reduce')` before starting animation.
**How to avoid:** Check at script initialization, not just for cursor animation. If reduced motion, show all text immediately, skip typewriter entirely.
**Warning signs:** No conditional check in JS, only in CSS for cursor.

### Pitfall 6: Cursor Position Wrong During Typing
**What goes wrong:** Cursor doesn't follow the last typed character, appears at end of line or wrong position.
**Why it happens:** Cursor is a separate element not positioned relative to text content.
**How to avoid:** Cursor should be inline element immediately after the text span being typed. Move cursor element to active line as each phase starts.
**Warning signs:** Cursor at fixed position, not moving with text.

## Code Examples

Verified patterns from official sources:

### Phase Detection Setup
```javascript
// Source: MDN IntersectionObserver + existing scroll-reveal.js pattern
(function() {
  // Bail out for reduced-motion users
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    showAllPhasesInstantly();
    return;
  }

  const triggers = document.querySelectorAll('.phase-trigger');
  if (!triggers.length) return;

  let lastY = undefined;

  const observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const phase = parseInt(entry.target.dataset.phase, 10);
          const direction = lastY === undefined || entry.boundingClientRect.y < lastY
            ? 'down' : 'up';
          lastY = entry.boundingClientRect.y;
          handlePhaseTransition(phase, direction);
        }
      });
    },
    {
      threshold: 0.5,
      rootMargin: '0px 0px -10% 0px' // Trigger slightly before center
    }
  );

  triggers.forEach(function(trigger) {
    observer.observe(trigger);
  });
})();
```

### Typewriter with Punctuation Pauses
```javascript
// Source: MDN setTimeout + TYPE-02 requirement (30-50ms per char)
const state = {
  typewriterTimeoutId: null,
  typewriterCancel: null
};

function startTypewriter(element, text, onComplete) {
  // Cancel any running typewriter
  if (state.typewriterCancel) {
    state.typewriterCancel();
  }

  let index = 0;
  const baseDelay = 25; // Fast: 20-30ms per character (TYPE-02)

  function type() {
    if (index < text.length) {
      const char = text[index];
      element.textContent += char;
      index++;

      // Punctuation pauses for natural rhythm
      let delay = baseDelay;
      if ('.!?'.includes(char)) delay = baseDelay * 6; // Sentence end
      else if (',;:'.includes(char)) delay = baseDelay * 3; // Clause
      else if (char === '\n') delay = baseDelay * 2; // Line break

      state.typewriterTimeoutId = setTimeout(type, delay);
    } else {
      onComplete && onComplete();
    }
  }

  type();

  // Store cancel function
  state.typewriterCancel = function() {
    clearTimeout(state.typewriterTimeoutId);
    state.typewriterTimeoutId = null;
  };
}
```

### Complete Phase Instantly (Scroll-Away)
```javascript
// Source: Requirement SCRL-03 + TYPE-03
function completePhaseInstantly(phase) {
  // Cancel running typewriter
  if (state.typewriterCancel) {
    state.typewriterCancel();
  }

  // Get the text element for this phase
  const textEl = document.querySelector(`[data-phase="${phase}"] .terminal-text`);
  const fullText = textEl.dataset.fullText;

  // Show complete text immediately
  textEl.textContent = fullText;

  // Mark phase as completed
  state.completedPhases.add(phase);
}
```

### Indicator Update with Glow States
```javascript
// Source: Requirements + Phase 23 CSS foundation
function updateIndicators(activePhase, completedPhases) {
  document.querySelectorAll('.indicator').forEach(function(dot) {
    const phase = parseInt(dot.dataset.phase, 10);

    // Reset classes
    dot.classList.remove('active', 'completed');
    dot.removeAttribute('aria-current');

    if (phase === activePhase) {
      dot.classList.add('active');
      dot.setAttribute('aria-current', 'step');
    } else if (completedPhases.has(phase)) {
      dot.classList.add('completed');
    }
  });
}
```

### CSS for Indicator States
```css
/* Source: Phase 23 foundation + requirements */
.indicator {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--terminal-green-dim);
  opacity: 0.3;
  transition: opacity 0.3s ease, box-shadow 0.3s ease;
}

/* Active: bright glow */
.indicator.active {
  opacity: 1;
  background: var(--terminal-green);
  box-shadow: 0 0 8px var(--terminal-glow);
}

/* Completed: dimmer glow */
.indicator.completed {
  opacity: 0.7;
  background: var(--terminal-green);
  box-shadow: 0 0 4px var(--terminal-glow);
}

/* Future: hollow/unlit (default state) */
```

### Text Dimming for Previous Phases
```css
/* Source: Context decision - "fades to dim" */
.terminal-line[data-phase] {
  color: var(--terminal-green);
  opacity: 0.4; /* Dimmed by default */
  transition: opacity 0.3s ease;
}

.terminal-line[data-phase].is-active {
  opacity: 1; /* Bright when active */
}

/* Keep visible but dimmed */
.terminal-line[data-phase].is-completed {
  opacity: 0.5;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| scroll event listener | IntersectionObserver | 2016+ | Dramatically better performance |
| Multiple independent observers | Single observer with multiple targets | Always | Cleaner, less overhead |
| CSS steps() typewriter | JS setTimeout for variable content | Always | More flexible, handles dynamic text |
| requestAnimationFrame for text | setTimeout for discrete updates | Always | Simpler for character timing |

**Deprecated/outdated:**
- scroll-timeline CSS: Still limited browser support (Chrome 115+ only), not ready for production without polyfill
- Using rAF for typewriter: Overkill for 25ms character updates, setTimeout is simpler and sufficient

## Open Questions

Things that couldn't be fully resolved:

1. **Optimal threshold for phase triggers**
   - What we know: 0.5 (50% visible) is common, but depends on container height
   - What's unclear: Exact feel with 400vh container and 4 phases
   - Recommendation: Start with 0.5, may need adjustment during testing

2. **Pulse animation for active indicator**
   - What we know: Context says "Claude's discretion" for whether active dot pulses
   - What's unclear: Whether pulse adds to or detracts from cursor pulse already present
   - Recommendation: Try static first; if it feels flat, add subtle 3s pulse

3. **Clickable indicator dots**
   - What we know: Context says "Claude's discretion" for whether dots are clickable
   - What's unclear: Adds interactivity complexity vs scroll-only simplicity
   - Recommendation: Skip for MVP; can add later if users expect it

4. **Phase-specific typing speeds**
   - What we know: Context says "Claude's discretion" for faster commands, slower interpretations
   - What's unclear: Exact speed ratios that feel natural
   - Recommendation: Try uniform 25ms first; if commands feel slow, drop to 15ms

## Sources

### Primary (HIGH confidence)
- [MDN IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) - API reference, threshold/rootMargin options
- [MDN setTimeout/clearTimeout](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout) - Timer patterns and cleanup
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) - Accessibility media query
- Existing codebase: `scroll-reveal.js`, `scroll-scrubber.js`, `Terminal.astro`, `global.css`

### Secondary (MEDIUM confidence)
- [Ben Frain - IntersectionObserver Direction](https://benfrain.com/determining-the-direction-of-intersectionobserver-events/) - Scroll direction detection technique
- [CSS-Tricks - Typewriter Effect](https://css-tricks.com/snippets/css/typewriter-effect/) - CSS-only limitations
- [Pope Tech - Accessible Animation](https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/) - Reduced motion best practices
- Existing research: `.planning/research/PITFALLS-DEMO.md`, `ARCHITECTURE-DEMO.md`, `STACK-DEMO.md`

### Tertiary (LOW confidence)
- Various CodePen examples for typewriter timing
- Stack Overflow discussions on IntersectionObserver edge cases

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Browser-native APIs, already used in codebase
- Architecture: HIGH - Extends proven patterns from Phase 23 and existing scripts
- Pitfalls: HIGH - Well-documented in existing research + MDN
- Timing/feel: MEDIUM - May need adjustment during implementation

**Research date:** 2026-01-30
**Valid until:** 60 days (stable browser APIs, no fast-moving dependencies)
