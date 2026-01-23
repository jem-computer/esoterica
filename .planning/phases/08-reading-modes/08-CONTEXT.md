# Phase 8: Reading Modes - Context

**Gathered:** 2026-01-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Users choose between digital (random shuf selection) and physical (enter cards from real deck) modes. Both modes work with any spread type. The interpretation engine (Phase 9) consumes the cards regardless of source.

</domain>

<decisions>
## Implementation Decisions

### Physical card input
- Free text prompt for card entry ("What card did you draw?")
- One card at a time for multi-card spreads
- Prompt shows position name: "Card for Situation:"
- Include example in prompt: "(e.g., The Fool, Death, 16)"

### Validation & error handling
- Fuzzy, forgiving matching: "Tower", "the tower", "TOWER", "16" all resolve to The Tower
- Best guess + confirm for ambiguous input: "Did you mean The Magician?"
- Summary at end shows all cards with chance to correct before reading
- Gentle retry on unrecognizable input: "I don't recognize that card. What card did you draw for Situation?"

### Mode experience
- Physical mode gets distinct ritual moment: "Take a moment with your cards. When ready, tell me what you drew."
- Brief shuffle/draw suggestion: "Shuffle while focusing on your question, then draw [N] cards."
- Immediate interpretation after cards confirmed (no artificial pause)

### Edge cases
- No reversal support in v1.1 — all cards read upright
- Mode switch allowed with confirmation: "Switch to digital? This will replace the cards you entered."
- Duplicate cards prevented: "The Tower is already in your spread. Please draw another card."

### Claude's Discretion
- Mode memory (whether to remember last-used mode)
- Handling partial abandonment gracefully

</decisions>

<specifics>
## Specific Ideas

- Physical mode should feel like a pause for intention — "take a moment with your cards" creates space
- The flow is: ritual prompt → one-by-one entry → summary confirmation → interpretation
- Fuzzy matching means users don't need to type perfectly — match intent, not exact text

</specifics>

<deferred>
## Deferred Ideas

- Reversed cards — future enhancement, keep upright-only for v1.1
- Minor Arcana support — if added later, physical mode already handles free text entry

</deferred>

---

*Phase: 08-reading-modes*
*Context gathered: 2026-01-22*
