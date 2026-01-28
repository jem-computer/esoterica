# Summary: 19-02 Scroll-Driven Video Hero

## Result: COMPLETE

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create ScrollVideo component and scroll-scrubber script | c6ee245 | `site/src/components/ScrollVideo.astro`, `site/src/scripts/scroll-scrubber.js` |
| 2 | Integrate ScrollVideo into hero section | bdd6bd1 | `site/src/pages/index.astro`, `site/src/styles/global.css` |
| fix | Normalize BASE_URL trailing slash | 1e17f35 | `site/src/components/ScrollVideo.astro` |
| fix | Remove redundant Esoterica name from hero | ae09a54 | `site/src/pages/index.astro`, `site/src/styles/global.css` |

## Deliverables

- **ScrollVideo.astro**: `<video>` element with muted/playsinline/preload="auto", src from BASE_URL
- **scroll-scrubber.js**: IIFE mapping scroll position to video.currentTime via rAF throttle
- **index.astro**: Restructured hero with 300vh scroll container and sticky inner wrapper
- **global.css**: `.hero` at 300vh, `.hero-sticky` with position:sticky, overlay moved to sticky container

## Architecture

- `<video>` element (not canvas/frames) — same pattern as portfolio.jem.computer
- Hero is 300vh tall, creating 200vh of scroll travel
- Video + content pinned in `.hero-sticky` (position: sticky, top: 0, 100vh)
- JS: scroll progress = -heroRect.top / (heroHeight - viewportHeight) → video.currentTime
- Passive scroll listener with requestAnimationFrame throttle
- noscript fallback preserves static Image for JS-disabled browsers

## Deviations

- **BASE_URL trailing slash**: `import.meta.env.BASE_URL` returns `/esoterica` without trailing slash, causing video path to be `/esotericavideo/hero.mp4`. Fixed by normalizing with `.replace(/\/?$/, '/')`.
- **Removed p.name**: User requested removing the redundant "ESOTERICA" text from the hero (project name already in top-left logo).

## Verification

- Video loads (readyState=4, 1920x1068, 10.08s duration) ✓
- Scroll forward plays video forward ✓
- Scroll backward reverses video ✓
- Content overlays video correctly ✓
- Prose section appears after hero ✓
- No console errors ✓
- Build succeeds ✓
