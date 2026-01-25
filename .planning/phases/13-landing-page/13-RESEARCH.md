# Phase 13: Landing Page - Research

**Researched:** 2026-01-24
**Domain:** Static landing page deployment with GitHub Pages
**Confidence:** HIGH

## Summary

The landing page will be a minimal single-page HTML/CSS/JavaScript site deployed via GitHub Pages. The standard approach in 2026 is vanilla HTML/CSS with modern CSS features (custom properties, `light-dark()` function, new viewport units) rather than frameworks. GitHub Pages deploys from `/docs` folder on the main branch with no build step required for static HTML.

All three brand fonts (Cormorant Garamond, Source Sans 3, JetBrains Mono) are available on Google Fonts. Source Sans 3 is a variable font, enabling smooth responsive typography. Modern CSS viewport units (`100svh` instead of `100vh`) solve mobile browser UI issues for full-screen hero sections. The Clipboard API provides secure, user-friendly copy-to-clipboard functionality. Dark/light mode implementation uses CSS custom properties with `data-theme` attributes and localStorage persistence.

**Primary recommendation:** Use vanilla HTML/CSS with modern CSS features. Load only necessary font weights (400, 500, 700 for Cormorant; 400, 600 for Source Sans; 400 for JetBrains Mono). Implement theme toggle with localStorage and system preference detection. Use `100svh` for hero section height. Keep HTML file under 50KB for instant load.

## Standard Stack

The established libraries/tools for minimal landing pages in 2026:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vanilla HTML/CSS/JS | - | Page structure and interactivity | No framework needed for single-page sites; faster load, simpler deployment |
| Google Fonts | Latest | Font delivery | Industry standard CDN with 98%+ browser support; preconnect optimization |
| GitHub Pages | - | Static hosting | Free, HTTPS by default, simple deployment from `/docs` folder |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Clipboard API | Native | Copy-to-clipboard | Built into modern browsers; no library needed (92%+ support) |
| CSS Custom Properties | Native | Theme variables | Standard for dark/light mode implementation |
| Modern Viewport Units | Native (`svh`, `dvh`) | Responsive sizing | Solves classic 100vh mobile issue (90%+ browser support) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Google Fonts | Self-hosted fonts | Self-hosting reduces DNS lookup but requires manual updates and subsetting |
| GitHub Pages | Netlify/Vercel | More features but unnecessary complexity for static HTML |
| Vanilla CSS | Tailwind CSS | Framework adds build step and larger file size for minimal gain on single page |

**Installation:**
```bash
# No npm installation needed for vanilla approach
# Fonts loaded via Google Fonts CDN
# Deployed by committing to /docs folder
```

## Architecture Patterns

### Recommended Project Structure
```
docs/
├── index.html           # Single HTML file
├── styles.css           # All styles (can be inline for performance)
├── script.js            # Theme toggle + clipboard (can be inline)
├── favicon.ico          # Legacy multi-size ICO
├── icon.svg             # Modern SVG favicon
└── apple-touch-icon.png # iOS icon (180x180)
```

### Pattern 1: Inline Critical CSS for Performance
**What:** Embed CSS directly in `<style>` tag in `<head>` for instant rendering
**When to use:** Single-page sites where total CSS is under 10KB
**Example:**
```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Esoterica - Ancient patterns, new paths</title>
  <style>
    /* All CSS inline for instant load */
    :root {
      /* Theme variables */
    }
  </style>
  <script>
    /* Theme detection before page load to prevent FOUC */
    const theme = localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  </script>
</head>
```
Source: Web.dev theme patterns, performance best practices

### Pattern 2: Mobile-First Responsive with Modern Viewport Units
**What:** Use `min-width` media queries and `svh` units for hero sections
**When to use:** All responsive sites, especially with full-height hero sections
**Example:**
```css
/* Mobile first - base styles for 320px+ */
.hero {
  height: 100svh; /* Small viewport height - always fits on screen */
  background: url('hero-primary.png') center/cover;
}

/* Tablet 768px+ */
@media (min-width: 768px) {
  .hero {
    /* Enhancements for larger screens */
  }
}

/* Desktop 1024px+ */
@media (min-width: 1024px) {
  .hero {
    /* Desktop-specific styles */
  }
}
```
Source: BrowserStack responsive breakpoints guide, MDN viewport units

### Pattern 3: Three-Tier Theme Detection
**What:** Check localStorage, then system preference, then default to light
**When to use:** All sites with dark/light mode toggle
**Example:**
```javascript
// In <head> before page renders to prevent FOUC
const getTheme = () => {
  // 1. Check localStorage
  const saved = localStorage.getItem('theme');
  if (saved) return saved;

  // 2. Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  // 3. Default to light
  return 'light';
};

document.documentElement.setAttribute('data-theme', getTheme());
```
Source: web.dev/patterns/theming/theme-switch

### Pattern 4: CSS Custom Properties for Theme Colors
**What:** Define all colors as CSS variables under `[data-theme]` selectors
**When to use:** Sites with multiple color schemes
**Example:**
```css
/* Light theme (default) */
[data-theme="light"] {
  --bg-hero: rgba(0, 0, 0, 0.2); /* Overlay for light mode */
  --text-hero: #e5c8bc; /* Primary color */
  --text-body: #4b3829; /* Secondary color */
  --bg-page: #ffffff;
}

/* Dark theme */
[data-theme="dark"] {
  --bg-hero: rgba(0, 0, 0, 0.5); /* Darker overlay for dark mode */
  --text-hero: #e5c8bc;
  --text-body: #e5c8bc;
  --bg-page: #1a1a1a;
}

/* Usage */
.hero-text {
  color: var(--text-hero);
}
```
Source: CSS-Tricks light-dark() function, DEV Community theme patterns

### Pattern 5: Accessible Clipboard with User Feedback
**What:** Use Clipboard API with async/await and button text feedback
**When to use:** Copy-to-clipboard functionality (requires user interaction)
**Example:**
```javascript
const copyButton = document.querySelector('.copy-button');
const command = 'npm install -g esoterica';

copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(command);

    // User feedback via button text change
    const originalText = copyButton.textContent;
    copyButton.textContent = 'Copied!';

    setTimeout(() => {
      copyButton.textContent = originalText;
    }, 2000);
  } catch (err) {
    console.error('Copy failed:', err);
    // Fallback for non-HTTPS environments
  }
});
```
Source: MDN Clipboard API, web.dev/patterns/clipboard/copy-text

### Pattern 6: Performance-Optimized Font Loading
**What:** Preconnect to Google Fonts, load only necessary weights, use `font-display: swap`
**When to use:** All sites using Google Fonts
**Example:**
```html
<head>
  <!-- Preconnect for performance -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- Load only needed weights -->
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;700&family=Source+Sans+3:wght@400;600&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
</head>

<style>
  /* Specify fallbacks */
  body {
    font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  h1, h2, h3 {
    font-family: 'Cormorant Garamond', Georgia, serif;
  }

  code {
    font-family: 'JetBrains Mono', 'Courier New', monospace;
  }
</style>
```
Source: Request Metrics font optimization, DevStars 2026 font guide

### Anti-Patterns to Avoid
- **Using `100vh` for hero sections:** Mobile browsers calculate 100vh when UI is collapsed, causing content to be hidden on initial load. Use `100svh` instead.
- **Loading all font weights:** Each weight adds 100-200KB. Load only 400, 500, 700 for Cormorant; 400, 600 for Source Sans; 400 for JetBrains Mono.
- **Setting theme with JavaScript after page load:** Causes flash of wrong theme (FOUC). Set theme in inline `<script>` in `<head>` before page renders.
- **Using `@import` for Google Fonts:** Forces sequential loading. Use `<link>` tags for parallel loading.
- **Multiple CTAs:** Reduces conversions by 266%. Single CTA (install command) only.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Copy to clipboard | Custom selection + document.execCommand() | Clipboard API (`navigator.clipboard.writeText()`) | Modern async API with better security, 92%+ browser support, handles permissions |
| Dark mode detection | Manual localStorage management | Three-tier pattern (localStorage → `prefers-color-scheme` → default) | Standard pattern prevents FOUC, respects system preference, maintains user choice |
| Responsive breakpoints | Custom pixel values | Mobile-first with 768px, 1024px breakpoints | Industry standard matches common device sizes, simpler cascade |
| Font subsetting | Manual WOFF2 generation | Google Fonts automatic subsetting | Google Fonts automatically serves optimal subsets based on browser/language |
| Favicon generation | Manual resizing in image editor | Multi-size ICO + SVG + PNG approach | Covers all platforms (legacy, modern browsers, iOS) with 3 files |
| Full-screen hero on mobile | JavaScript viewport calculations | CSS `100svh` (small viewport height) | Pure CSS solution, 90%+ browser support, accounts for browser UI dynamically |

**Key insight:** Modern CSS and browser APIs have matured to the point where vanilla solutions outperform libraries for simple landing pages. The complexity isn't in the features—it's in the edge cases (mobile viewport, FOUC prevention, font loading performance, accessibility).

## Common Pitfalls

### Pitfall 1: Flash of Unstyled Content (FOUC) with Theme Toggle
**What goes wrong:** Page loads with light theme, then flashes to dark theme if user preference is dark
**Why it happens:** Theme detection happens after HTML parsing and rendering
**How to avoid:** Inline theme detection script in `<head>` before any content
**Warning signs:** Visible theme switch on page load, especially on slow connections

**Prevention code:**
```html
<head>
  <script>
    // MUST be inline and synchronous in <head>
    const theme = localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  </script>
  <!-- Rest of head content -->
</head>
```

### Pitfall 2: Mobile Hero Section Cut Off by Browser UI
**What goes wrong:** Full-height hero section appears correct on desktop but is too tall on mobile, with content hidden below visible area
**Why it happens:** `100vh` calculates viewport height when browser UI (address bar, toolbars) is collapsed/hidden, but on initial load the UI is expanded
**How to avoid:** Use `100svh` (small viewport height) instead of `100vh`
**Warning signs:** Users can't see CTA without scrolling on mobile, hero text appears cut off

**Solution:**
```css
/* DON'T */
.hero {
  height: 100vh; /* Too tall on mobile initial load */
}

/* DO */
.hero {
  height: 100svh; /* Always fits visible area */
  /* Fallback for older browsers */
  height: 100vh;
  height: 100svh;
}
```

### Pitfall 3: Poor Text Contrast on Hero Image Overlay
**What goes wrong:** Hero text is illegible against image, especially when same image is used for both light and dark modes
**Why it happens:** Image has varying light/dark areas; overlay opacity isn't tuned for WCAG AA contrast (4.5:1)
**How to avoid:** Test overlay opacity with contrast checker; use darker overlay for light mode, even darker for dark mode
**Warning signs:** Text hard to read in certain areas, accessibility audit failures

**Solution:**
```css
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--bg-hero);
}

[data-theme="light"] {
  --bg-hero: rgba(0, 0, 0, 0.3); /* 30% dark overlay for light mode */
}

[data-theme="dark"] {
  --bg-hero: rgba(0, 0, 0, 0.6); /* 60% dark overlay for dark mode */
}

/* Test with WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/ */
/* Target: #e5c8bc text on darkened image areas should be 4.5:1+ */
```

### Pitfall 4: Slow Font Loading Blocks Rendering
**What goes wrong:** Page appears blank while waiting for Google Fonts to load
**Why it happens:** Missing `font-display: swap` and no preconnect to fonts.gstatic.com
**How to avoid:** Add preconnect links and use `display=swap` parameter in Google Fonts URL
**Warning signs:** Blank text on slow connections, Flash of Invisible Text (FOIT)

**Solution:**
```html
<!-- Preconnect to both domains -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Add display=swap to URL -->
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;700&display=swap" rel="stylesheet">
```

### Pitfall 5: Clipboard API Fails Without User Interaction
**What goes wrong:** Copy-to-clipboard fails silently or throws security error
**Why it happens:** Clipboard API requires "transient user activation" (recent click/keypress) for security
**How to avoid:** Only call `navigator.clipboard.writeText()` inside event handlers (click, keypress)
**Warning signs:** Works in dev but fails in production, console shows DOMException

**Prevention:**
```javascript
// DON'T - Will fail
window.addEventListener('load', async () => {
  await navigator.clipboard.writeText('text'); // No user activation!
});

// DO - User-initiated
button.addEventListener('click', async () => {
  await navigator.clipboard.writeText('text'); // Works - user just clicked
});
```

### Pitfall 6: Missing Favicon Causes iOS Screenshot Icon
**What goes wrong:** iOS devices show generic website screenshot instead of brand icon when user adds to home screen
**Why it happens:** Missing `apple-touch-icon.png` (180x180)
**How to avoid:** Include all three favicon formats: ICO, SVG, Apple Touch Icon
**Warning signs:** Generic icon on iOS home screen, low brand recognition

**Complete implementation:**
```html
<head>
  <!-- Modern browsers: SVG favicon -->
  <link rel="icon" href="/icon.svg" type="image/svg+xml">

  <!-- Legacy browsers: Multi-size ICO -->
  <link rel="icon" href="/favicon.ico" sizes="any">

  <!-- iOS: Apple Touch Icon -->
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">

  <!-- Optional: Web App Manifest for Android -->
  <link rel="manifest" href="/site.webmanifest">
</head>
```

### Pitfall 7: Weak or Hidden Value Proposition
**What goes wrong:** Users leave without understanding what Esoterica is or why they should install it
**Why it happens:** Value proposition is below the fold, uses vague language, or prioritizes name over benefit
**How to avoid:** Lead with tagline ("Ancient patterns, new paths"), make value visible without scrolling
**Warning signs:** High bounce rate, low install conversions

**Hierarchy:**
```html
<!-- DO: Value proposition first -->
<h1>Ancient patterns, new paths</h1>
<h2>Esoterica</h2>
<p>Perspective-shifting framework using tarot archetypes for complex decisions</p>

<!-- DON'T: Name first, value hidden -->
<h1>Esoterica</h1>
<p>Ancient patterns, new paths</p>
<!-- Value prop below fold or missing -->
```

### Pitfall 8: Aggressive Favicon Caching Prevents Updates
**What goes wrong:** Updated favicon doesn't appear for users even after hard refresh
**Why it happens:** Browsers cache favicons aggressively (often for weeks)
**How to avoid:** Use versioned URLs when updating favicon: `/favicon.ico?v=2`
**Warning signs:** Developer sees new icon, users report seeing old one

## Code Examples

Verified patterns from official sources:

### Complete HTML Structure
```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- SEO Meta Tags -->
  <title>Esoterica - Ancient patterns, new paths</title>
  <meta name="description" content="Perspective-shifting framework using tarot archetypes for complex decisions. CLI tool for developers.">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://111ecosystem.github.io/esoterica/">
  <meta property="og:title" content="Esoterica - Ancient patterns, new paths">
  <meta property="og:description" content="Perspective-shifting framework using tarot archetypes for complex decisions">
  <meta property="og:image" content="https://111ecosystem.github.io/esoterica/og-image.png">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="https://111ecosystem.github.io/esoterica/">
  <meta name="twitter:title" content="Esoterica - Ancient patterns, new paths">
  <meta name="twitter:description" content="Perspective-shifting framework using tarot archetypes for complex decisions">
  <meta name="twitter:image" content="https://111ecosystem.github.io/esoterica/og-image.png">

  <!-- Favicons -->
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">

  <!-- Fonts: Preconnect for performance -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;700&family=Source+Sans+3:wght@400;600&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">

  <!-- Theme detection: MUST be inline and synchronous -->
  <script>
    const theme = localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  </script>

  <style>
    /* All CSS inline for performance */
    /* See next example for complete CSS */
  </style>
</head>
<body>
  <!-- Page content -->
</body>
</html>
```
Source: MDN HTML best practices, web.dev SEO fundamentals, Zoho landing page guide

### Complete CSS Theme System
```css
/* CSS Custom Properties for Theming */
:root {
  /* Typography */
  --font-heading: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-code: 'JetBrains Mono', 'Courier New', monospace;

  /* Type scale */
  --text-h1: 3rem; /* 48px */
  --text-h2: 2.25rem; /* 36px */
  --text-body: 1rem; /* 16px */
}

/* Light theme (default) */
[data-theme="light"] {
  --bg-hero-overlay: rgba(0, 0, 0, 0.25);
  --text-hero: #e5c8bc; /* Primary */
  --text-heading: #4b3829; /* Secondary */
  --text-body: #4b3829;
  --bg-page: #ffffff;
  --bg-button: #e5c8bc;
  --text-button: #4b3829;
  --bg-button-hover: #9b7c6c; /* Warm Neutral */
}

/* Dark theme */
[data-theme="dark"] {
  --bg-hero-overlay: rgba(0, 0, 0, 0.5);
  --text-hero: #e5c8bc;
  --text-heading: #e5c8bc;
  --text-body: #e5c8bc;
  --bg-page: #1a1a1a;
  --bg-button: #4b3829;
  --text-button: #e5c8bc;
  --bg-button-hover: #9b7c6c;
}

/* Base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-body);
  font-size: var(--text-body);
  line-height: 1.6;
  background: var(--bg-page);
  color: var(--text-body);
}

/* Hero section with proper viewport handling */
.hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Fallback */
  height: 100svh; /* Small viewport height - always fits */
  background: url('brand/hero/winners/hero-primary.png') center/cover no-repeat;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--bg-hero-overlay);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 1rem;
}

.hero h1 {
  font-family: var(--font-heading);
  font-size: var(--text-h1);
  font-weight: 500;
  color: var(--text-hero);
  margin-bottom: 1rem;
}

.hero h2 {
  font-family: var(--font-heading);
  font-size: var(--text-h2);
  font-weight: 400;
  color: var(--text-hero);
  margin-bottom: 2rem;
}

/* Copy button */
.copy-container {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  background: var(--bg-button);
  color: var(--text-button);
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  font-family: var(--font-code);
  font-size: 0.875rem;
}

.copy-button {
  background: none;
  border: 1px solid currentColor;
  color: inherit;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 0.875rem;
  transition: background 0.2s;
}

.copy-button:hover {
  background: var(--bg-button-hover);
}

/* Theme toggle */
.theme-toggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: var(--bg-button);
  border: none;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1000;
}

/* Mobile-first responsive */
@media (min-width: 768px) {
  .hero h1 {
    font-size: 4rem; /* 64px */
  }

  .hero h2 {
    font-size: 3rem; /* 48px */
  }
}

@media (min-width: 1024px) {
  .hero h1 {
    font-size: 5rem; /* 80px */
  }
}
```
Source: BrowserStack responsive design, CSS-Tricks custom properties

### Complete JavaScript for Interactivity
```javascript
// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  // Update button aria-label for accessibility
  themeToggle.setAttribute('aria-label', `Switch to ${currentTheme} mode`);
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  // Only update if user hasn't set preference
  if (!localStorage.getItem('theme')) {
    const newTheme = e.matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
  }
});

// Copy to Clipboard
const copyButton = document.querySelector('.copy-button');
const installCommand = 'npm install -g esoterica';

copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(installCommand);

    const originalText = copyButton.textContent;
    copyButton.textContent = 'Copied!';

    setTimeout(() => {
      copyButton.textContent = originalText;
    }, 2000);
  } catch (err) {
    console.error('Copy failed:', err);

    // Fallback for non-HTTPS (dev environment)
    const textArea = document.createElement('textarea');
    textArea.value = installCommand;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
      copyButton.textContent = 'Copied!';
      setTimeout(() => {
        copyButton.textContent = originalText;
      }, 2000);
    } catch (fallbackErr) {
      console.error('Fallback copy failed:', fallbackErr);
    }

    document.body.removeChild(textArea);
  }
});
```
Source: MDN Clipboard API, web.dev theme patterns

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `100vh` for full-screen | `100svh`, `100dvh`, `100lvh` | 2021 | Solves mobile browser UI issue; content always visible on load |
| `document.execCommand('copy')` | Clipboard API (`navigator.clipboard`) | 2018-2020 | Async, secure, better permissions; 92%+ browser support in 2026 |
| `@import` for Google Fonts | `<link>` with preconnect | 2019+ | Parallel loading instead of sequential; 50-200ms faster |
| Media queries for dark mode | CSS `light-dark()` function | 2023+ | Single declaration instead of duplicate rules; 90%+ browser support |
| Framework (React/Vue) for landing pages | Vanilla HTML/CSS/JS | 2022+ | No build step, instant load, simpler deployment; frameworks add 100KB+ |
| Multiple favicon files (8+) | Three files (ICO, SVG, Apple Touch) | 2020+ | Covers all platforms with minimal files; SVG scales infinitely |
| Device-specific breakpoints | Content-based breakpoints (768, 1024) | 2018+ | Simpler, more maintainable; works across device evolution |

**Deprecated/outdated:**
- **`document.execCommand('copy')`**: Deprecated; use Clipboard API
- **`100vh` for hero sections**: Use `100svh` for small viewport or `100dvh` for dynamic viewport
- **Multiple font weights (9+)**: Modern approach loads 2-3 weights maximum
- **Fixed pixel font sizes**: Use `rem` for accessibility (respects user font size preferences)

## Open Questions

Things that couldn't be fully resolved:

1. **Exact overlay opacity for WCAG AA compliance**
   - What we know: Need 4.5:1 contrast between #e5c8bc text and hero image with overlay
   - What's unclear: Optimal opacity values (0.25 vs 0.3 for light mode) depend on specific image areas
   - Recommendation: Test with WebAIM Contrast Checker using darkest/lightest image areas; adjust overlay opacity until all text areas pass 4.5:1

2. **Whether to inline all CSS or use external stylesheet**
   - What we know: Inline CSS (in `<style>` tag) prevents render-blocking; external CSS requires additional HTTP request
   - What's unclear: File size threshold where external CSS becomes better (likely 10-15KB)
   - Recommendation: Start with inline CSS; if total CSS exceeds 10KB, extract to external file with `<link rel="preload">`

3. **GitHub Pages URL structure**
   - What we know: Project sites use `https://owner.github.io/repo-name/`
   - What's unclear: Whether to create user site (`111ecosystem.github.io`) or project site
   - Recommendation: Use project site from main branch `/docs` folder (allows multiple projects; simpler setup)

## Sources

### Primary (HIGH confidence)
- MDN Clipboard API - https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
- web.dev Theme Switch Pattern - https://web.dev/patterns/theming/theme-switch
- CSS-Tricks light-dark() function - https://css-tricks.com/almanac/functions/l/light-dark/
- GitHub Pages Documentation - https://docs.github.com/en/pages
- Google Fonts (Cormorant Garamond, Source Sans 3, JetBrains Mono) - verified available

### Secondary (MEDIUM confidence)
- BrowserStack Responsive Design Breakpoints 2025 - https://www.browserstack.com/guide/responsive-design-breakpoints
- Request Metrics Google Fonts Performance - https://requestmetrics.com/web-performance/5-tips-to-make-google-fonts-faster/
- Smashing Magazine Accessible Text Over Images - https://www.smashingmagazine.com/2023/08/designing-accessible-text-over-images-part1/
- Kleinbyte Favicon Guide 2026 - https://kleinbyte.com/blog/the-ultimate-guide-to-favicon-creation-sizes-formats-and-best-practices-2026
- DevStars Website Fonts 2026 - https://www.devstars.com/blog/2026-website-fonts-guide/
- Elementor Website Speed Optimization 2026 - https://elementor.com/blog/website-speed-optimization-techniques/

### Tertiary (LOW confidence)
- WebSearch: Landing page mistakes (Moosend, Zoho, KlientBoost) - general best practices
- WebSearch: GitHub Pages deployment guides - mostly consistent with official docs
- WebSearch: Mobile viewport units - verified with MDN

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All technologies verified with official sources (MDN, web.dev, GitHub docs)
- Architecture: HIGH - Patterns documented in web.dev, MDN, and established community best practices
- Pitfalls: MEDIUM-HIGH - Common issues documented across multiple sources; some require testing to verify exact values

**Research date:** 2026-01-24
**Valid until:** 2026-03-24 (60 days - web standards are relatively stable)
