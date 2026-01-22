# Phase 5: Polish & Integration - Context

**Gathered:** 2026-01-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Both user and Claude can invoke readings smoothly. Polish existing functionality: clean invocation, documented self-invocation, error handling, output format. No new capabilities — refine what's built.

</domain>

<decisions>
## Implementation Decisions

### Claude self-invocation
- Research needed: How Claude can invoke /tarot flexibly across workflows (raw prompting, GSD planning framework, etc.)
- Researcher should examine: GSD workflow integration points, Claude Code skill invocation patterns, when/how agents invoke skills
- Reference: https://github.com/glittercowboy/get-shit-done for planning framework context

### Output format
- Length: Adaptive to context — short for quick draws, longer when user provides detailed context
- Visual: Simple card header with decorative border/divider
- Context echo: Yes — quote/reference user's situation ("You mentioned [X] — this card suggests...")
- Closing: End with a reflective question ("What might shift if you...?")

### Claude's Discretion
- Help text content and examples
- Error message wording
- Specific card header styling
- How to detect "detailed context" vs "quick draw"

</decisions>

<specifics>
## Specific Ideas

- Output should feel like a real reading, not a lookup — reference user's actual situation
- Reflective question at end invites engagement rather than passive consumption
- Card header adds ceremony without being over-the-top

</specifics>

<deferred>
## Deferred Ideas

- **Physical card input mode** — User draws real tarot cards and enters them for interpretation. Separate command or flag to accept user-specified card. (from Phase 4 discussion)

- **Interactive TUI readings** — Embrace AskUserQuestion-style flow where readings pose answerable questions. User responds via TUI during reading. Would require skill architecture changes.

- **Combined physical + interactive flow** — User draws physical card → enters it → gets interactive reading with answerable prompts. Compelling v2 feature combining both deferred ideas.

</deferred>

---

*Phase: 05-polish-integration*
*Context gathered: 2026-01-22*
