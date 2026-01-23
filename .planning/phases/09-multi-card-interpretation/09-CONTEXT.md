# Phase 9: Multi-Card Interpretation - Context

**Gathered:** 2026-01-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Subagent interprets multi-card spreads with position awareness. Cards are woven into a connected narrative rather than interpreted separately. Single-card readings maintain their existing format.

</domain>

<decisions>
## Implementation Decisions

### Interpretation Structure
- Fully woven narrative — one continuous interpretation that moves through all cards as a connected story
- Position names woven naturally into prose ("What's present in your situation is...") — no explicit headers or markers
- Concise length: 2-3 paragraphs for typical 3-card readings
- End with a reflective question to sit with after the reading

### Card Relationships
- Explicitly call out tensions and harmonies between cards ("The Tower disrupts what The Empress nurtures...")
- Reference card imagery and visual symbolism when it strengthens the interpretation
- Claude's Discretion: handling repeated archetypes (emphasize theme vs differentiate by position)
- Claude's Discretion: acknowledging custom position names when it adds meaning

### Single vs Multi-Card Format
- Keep formats distinct — single card keeps current voice/format, multi-card gets woven narrative style
- Single card is position-agnostic — always interpreted the same way regardless of any position label
- Show card(s) drawn before interpretation (card art/name, then interpretation follows)
- Claude's Discretion: how to format multi-card display (list vs inline) based on spread type

</decisions>

<specifics>
## Specific Ideas

- Multi-card readings should feel like a story unfolding, not a list of meanings
- Imagery references should ground abstract concepts ("The Hanged Man's stillness, The Chariot's forward motion...")
- The closing question should emerge from the reading, not feel tacked on

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 09-multi-card-interpretation*
*Context gathered: 2026-01-22*
