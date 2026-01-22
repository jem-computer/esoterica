# Phase 4: Configuration - Context

**Gathered:** 2026-01-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Global voice preference that persists across tarot readings. Users can set a default voice (mystic or grounded) that applies unless overridden. Config system only — no new invocation modes or card input methods.

</domain>

<decisions>
## Implementation Decisions

### Storage location
- Two config locations: global (~/.claude/tarot/config) and project-level (.tarot)
- Precedence order: `--voice` flag > project `.tarot` > global `~/.claude/tarot/config`
- Project-level file named `.tarot` (no extension)

### Claude's Discretion
- Config file format (JSON, key=value, etc.)
- Whether project-level config should be gitignored by default
- How user sets/changes preference (command, edit file, etc.)
- Default voice when no config exists (currently grounded per Phase 3)
- Error handling for malformed config

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches for config file handling.

</specifics>

<deferred>
## Deferred Ideas

- **Physical card input mode** — User draws real tarot cards and enters them for interpretation (like iPhone tarot apps). Would need separate command or flag to accept user-specified card. Add to backlog as Phase 6 or v2 feature.

</deferred>

---

*Phase: 04-configuration*
*Context gathered: 2026-01-22*
