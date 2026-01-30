---
phase: quick
plan: 003
type: execute
wave: 1
depends_on: []
files_modified:
  - .planning/quick/003-linkedin-carousel-posts/post-01-pattern-oracle/
  - .planning/quick/003-linkedin-carousel-posts/post-02-linear-shatter/
  - .planning/quick/003-linkedin-carousel-posts/post-03-ancient-code/
  - .planning/quick/003-linkedin-carousel-posts/post-04-spiral-knowing/
  - .planning/quick/003-linkedin-carousel-posts/post-05-threshold-crossing/
autonomous: true

must_haves:
  truths:
    - "5 LinkedIn posts ready to publish"
    - "Each post has 3 carousel images with copy"
    - "Voice is 40% clarity / 60% mysticism per guidelines"
  artifacts:
    - path: ".planning/quick/003-linkedin-carousel-posts/post-01-pattern-oracle/"
      provides: "First carousel post folder"
    - path: ".planning/quick/003-linkedin-carousel-posts/post-02-linear-shatter/"
      provides: "Second carousel post folder"
    - path: ".planning/quick/003-linkedin-carousel-posts/post-03-ancient-code/"
      provides: "Third carousel post folder"
    - path: ".planning/quick/003-linkedin-carousel-posts/post-04-spiral-knowing/"
      provides: "Fourth carousel post folder"
    - path: ".planning/quick/003-linkedin-carousel-posts/post-05-threshold-crossing/"
      provides: "Fifth carousel post folder"
  key_links: []
---

<objective>
Create 5 LinkedIn carousel posts using Esoterica illustrations with witchy/mystical voice.

Purpose: Generate engagement-farming social content that maintains brand mysticism
Output: 5 post folders, each with 3 images + caption file ready for LinkedIn
</objective>

<execution_context>
@/Users/jem/.claude/get-shit-done/workflows/execute-plan.md
@/Users/jem/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/phases/10-positioning/brand/voice-guidelines.md

Source images: ~/Pictures/esoterica-illustrations-archive/postprocessed/
- ancient-meets-modern/ (6 images)
- interrupting-linear-thinking/ (6 images)
- pattern-recognition/ (12 images)

Images are stippled fineliner illustrations showing:
- Vintage computers with all-seeing eyes surrounded by tarot suits
- Flower of Life geometry in circuit-board windows
- Binary code shattering into tarot cards (The Tower)
- Nautilus spirals with tarot symbols at golden ratio points
- QR codes merged with sacred geometry and celestial symbols
- Code pipelines exploding into mandalas that crumble towers
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create post folders and select images</name>
  <files>
    .planning/quick/003-linkedin-carousel-posts/post-01-pattern-oracle/
    .planning/quick/003-linkedin-carousel-posts/post-02-linear-shatter/
    .planning/quick/003-linkedin-carousel-posts/post-03-ancient-code/
    .planning/quick/003-linkedin-carousel-posts/post-04-spiral-knowing/
    .planning/quick/003-linkedin-carousel-posts/post-05-threshold-crossing/
  </files>
  <action>
  Create 5 post folders and copy 3 images to each. Image assignments:

  **Post 1 - Pattern Oracle (pattern-recognition theme):**
  - slide-1.png: gen-2026-01-29T23-14-11-01.png (computer with eye, tarot suits orbiting)
  - slide-2.png: gen-v2-2026-01-29T23-53-44-01.png
  - slide-3.png: gen-v2-2026-01-30T00-04-42-14.png

  **Post 2 - Linear Shatter (interrupting-linear-thinking theme):**
  - slide-1.png: gen-v2-2026-01-30T00-05-31-01.png (binary shattering into Tower card)
  - slide-2.png: gen-v2-2026-01-30T00-06-05-02.png
  - slide-3.png: gen-v2-2026-01-30T00-12-05-09.png (code pipelines into mandalas)

  **Post 3 - Ancient Code (ancient-meets-modern theme):**
  - slide-1.png: gen-2026-01-29T23-33-25-01.png (Flower of Life in window)
  - slide-2.png: gen-2026-01-29T23-34-02-02.png
  - slide-3.png: gen-2026-01-29T23-36-50-06.png (QR code as sacred geometry)

  **Post 4 - Spiral Knowing (pattern-recognition theme):**
  - slide-1.png: gen-v2-2026-01-29T23-57-32-05.png (nautilus with tarot symbols)
  - slide-2.png: gen-v2-2026-01-29T23-59-11-07.png
  - slide-3.png: gen-v2-2026-01-30T00-02-30-11.png

  **Post 5 - Threshold Crossing (mixed theme):**
  - slide-1.png: gen-2026-01-29T23-15-55-03.png (pattern-recognition)
  - slide-2.png: gen-2026-01-29T23-34-49-03.png (ancient-meets-modern)
  - slide-3.png: gen-v2-2026-01-30T00-13-44-11.png (interrupting-linear-thinking)

  Use cp to copy files with simple slide-N.png names.
  </action>
  <verify>ls each post folder shows 3 PNG files named slide-1.png, slide-2.png, slide-3.png</verify>
  <done>15 images organized across 5 post folders</done>
</task>

<task type="auto">
  <name>Task 2: Write carousel captions</name>
  <files>
    .planning/quick/003-linkedin-carousel-posts/post-01-pattern-oracle/caption.md
    .planning/quick/003-linkedin-carousel-posts/post-02-linear-shatter/caption.md
    .planning/quick/003-linkedin-carousel-posts/post-03-ancient-code/caption.md
    .planning/quick/003-linkedin-carousel-posts/post-04-spiral-knowing/caption.md
    .planning/quick/003-linkedin-carousel-posts/post-05-threshold-crossing/caption.md
  </files>
  <action>
  Write caption.md for each post with:
  - LinkedIn post text (engagement-farming hook + witchy substance)
  - Slide-by-slide carousel text (what to overlay or narrate)
  - Hashtags

  **Voice requirements (40% clarity / 60% mysticism):**
  - Use threshold language: "threshold," "veil," "cross," "liminal"
  - Use archetypal language: "pattern," "symbol," "resonance," "mirror"
  - Use confident verbs: "reveals," "illuminates," "transforms"
  - AVOID: corporate jargon, apologetic language, cliched mysticism
  - NO: "unlock your potential," "manifest," "spiritual journey"

  **Engagement-farming techniques:**
  - Open loops (curiosity gaps)
  - Pattern interrupts (unexpected juxtapositions)
  - "Most people don't know..." framing
  - Numbered lists that deliver real value
  - Questions that invite comments

  **Theme angles:**
  - Post 1: Pattern recognition as ancient practice (tarot suits = elements = algorithms)
  - Post 2: Breaking linear thinking with symbolic interruption
  - Post 3: Sacred geometry encoded in modern tech
  - Post 4: Spiral/iterative thinking vs linear progress myths
  - Post 5: Threshold moments in creative/dev work

  Each caption.md format:
  ```
  # Post Title

  ## LinkedIn Caption
  [The actual post text to copy/paste]

  ## Carousel Slides
  **Slide 1:** [description/text]
  **Slide 2:** [description/text]
  **Slide 3:** [description/text]

  ## Hashtags
  [space-separated hashtags]
  ```
  </action>
  <verify>cat each caption.md shows complete post with caption + slides + hashtags</verify>
  <done>5 caption files with engagement-farming witchy copy ready for LinkedIn</done>
</task>

</tasks>

<verification>
- [ ] 5 post folders exist under .planning/quick/003-linkedin-carousel-posts/
- [ ] Each folder contains slide-1.png, slide-2.png, slide-3.png
- [ ] Each folder contains caption.md with LinkedIn text + slide descriptions + hashtags
- [ ] Voice matches guidelines (40% clarity / 60% mysticism)
- [ ] No corporate jargon, no apologetic language
- [ ] Content is engagement-ready (hooks, open loops, CTAs)
</verification>

<success_criteria>
5 LinkedIn carousel posts ready to publish, each with:
- 3 curated images from Esoterica illustration archive
- Engagement-farming caption in witchy/mystical voice
- Per-slide descriptions for carousel flow
- Relevant hashtags
</success_criteria>

<output>
After completion, create `.planning/quick/003-linkedin-carousel-posts/003-SUMMARY.md`
</output>
