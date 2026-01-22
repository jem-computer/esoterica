# Phase 7: Spread Options - Context

**Gathered:** 2026-01-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can choose from four spread types when requesting a reading. The wizard (from Phase 6) presents spread options, and this phase implements the actual spread logic: position generation, card drawing without duplicates, and passing positions to the interpretation flow.

</domain>

<decisions>
## Implementation Decisions

### Three-card spread
- Single preset: **Situation / Action / Outcome** (not Problem/Solution/Synthesis)
- Show positions to user BEFORE drawing ("You'll draw for: Situation, Action, Outcome")
- Unique cards only — each draw removes that card from the pool (like a physical deck)

### LLM-suggested behavior
- Always suggests exactly 3 cards (count is fixed)
- Uses user's question + recent conversation context to generate position names
- Shows suggested positions for approval before proceeding
- If user rejects, Claude suggests new positions (doesn't fall back to custom)

### Custom spread input
- Single text input: "Enter positions (comma-separated)"
- Maximum 5 cards per spread
- Minimum 1 card allowed — custom single-card with user's own position name is valid

### Spread selection UX
- Default option: Single card (Recommended)
- Descriptive labels: "Single card", "Situation/Action/Outcome", "Claude suggests", "Custom"
- No explicit card counts in descriptions — self-evident from spread names

### Claude's Discretion
- Exact wording of position approval prompt for LLM-suggested
- How to handle malformed custom input (empty positions, too many commas)
- Position name formatting (title case, etc.)

</decisions>

<specifics>
## Specific Ideas

- Three positions are "Situation / Action / Outcome" — this framing feels more actionable than P/S/S
- Approval flow for LLM-suggested should feel conversational, not form-like

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 07-spread-options*
*Context gathered: 2026-01-22*
