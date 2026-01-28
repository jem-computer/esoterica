---
phase: 19-scroll-video
plan: 01
subsystem: media
tags: [ffmpeg, h264, video-compression, web-video]

# Dependency graph
requires: []
provides:
  - "Compressed hero.mp4 (1.8MB, h264 Main, faststart) for scroll-driven playback"
affects: [19-02 scroll scrubber component, 20 visual polish]

# Tech tracking
tech-stack:
  added: [ffmpeg (build-time tool)]
  patterns: [video as build artifact (gitignored, CDN/LFS later)]

key-files:
  created:
    - site/public/video/hero.mp4
  modified:
    - .gitignore

key-decisions:
  - "CRF 28 yields 1.8MB from 25MB source -- excellent quality-to-size ratio"
  - "Audio stripped (-an) since scroll-driven playback has no audio use"
  - "Video directory gitignored as build artifact"

patterns-established:
  - "Video compression: h264 CRF 28, preset slow, Main profile, Level 4.0, faststart"
  - "Media build artifacts: gitignored, stored in CDN/LFS later"

# Metrics
duration: 5min
completed: 2026-01-28
---

# Phase 19 Plan 01: Video Compression Summary

**Source video compressed from 25MB to 1.8MB using h264 CRF 28 with faststart for instant web playback**

## Performance

- **Duration:** 5 min
- **Started:** 2026-01-28T21:15:32Z
- **Completed:** 2026-01-28T21:20:32Z
- **Tasks:** 1
- **Files modified:** 2 (hero.mp4 created, .gitignore updated)

## Accomplishments
- Compressed source video from 25MB to 1.8MB (93% reduction) at CRF 28
- h264 Main profile, Level 4.0 for broad browser/device compatibility
- faststart flag moves moov atom to front for instant web playback
- Audio stripped since scroll-driven playback has no audio use
- Video directory gitignored as build artifact

## Task Commits

Each task was committed atomically:

1. **Task 1: Compress video with ffmpeg** - `6318b91` (feat)

## Files Created/Modified
- `site/public/video/hero.mp4` - Compressed hero video (1.8MB, 1920x1068, h264, 24fps, 10.08s)
- `.gitignore` - Added site/public/video/ as build artifact exclusion

## Decisions Made
- CRF 28 selected per plan -- achieved 1.8MB which is well under the 5MB target, so no need to adjust
- Audio stripped with -an flag since scroll-driven playback uses no audio
- Video directory gitignored rather than committed (build artifact pattern)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Compressed hero.mp4 ready at site/public/video/hero.mp4 for the scroll scrubber component (Plan 02)
- 1.8MB file size is excellent for web delivery -- no further optimization needed
- faststart ensures instant playback start without buffering full file

---
*Phase: 19-scroll-video*
*Completed: 2026-01-28*
