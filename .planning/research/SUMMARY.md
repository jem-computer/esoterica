# Project Research Summary

**Project:** Esoterica (Claude Code Tarot Skills Framework)
**Domain:** AI Agent Tooling / Perspective-Shifting Tools
**Researched:** 2026-01-21
**Confidence:** MEDIUM

## Executive Summary

Esoterica is a Claude Code skill framework that enables AI agents to use tarot as a perspective-shifting tool for problem-solving. The research reveals that this project sits at the intersection of two domains: (1) Claude Code's skill + subagent architecture, and (2) AI-powered tarot interpretation adapted for coding contexts. The recommended approach leverages Claude Code's native extensibility through markdown-based skills that spawn specialized subagents, avoiding heavier alternatives like MCP servers.

The core architectural pattern is simple but powerful: a thin skill layer (`/tarot`) handles invocation and card randomization, spawning a specialized tarot-reader subagent that contains all domain knowledge (22 Major Arcana cards, two reader personas). This separation keeps the skill lightweight while giving the subagent full tool access for rich contextual interpretation. The framework requires zero external dependencies—built entirely on Claude Code's native tools (Task for subagent spawning, Bash for randomness, file system for configuration).

The critical risk is treating skills as stateful services rather than prompt expansions. Configuration must persist via file system (global `~/.claude/settings.json`, project `.claude/settings.local.json`), not internal state. Secondary risks include over-engineering randomness (use simple `bash shuf`), confusing reader voice with LLM persona (voice is interpretive lens, not personality), and building a tarot encyclopedia instead of a problem-solving tool (focus on perspective-shifting value, not historical accuracy).

## Key Findings

### Recommended Stack

Claude Code provides all necessary infrastructure for Esoterica with zero external dependencies. Skills are markdown files with prompt expansions, subagents are specialized Claude instances with their own system prompts, and configuration uses standard JSON files. The elegance of this approach is that it's entirely file-based and portable.

**Core technologies:**
- **Markdown skill definitions** (`.claude/skills/tarot.md`) — Claude Code's native skill format, provides slash-command interface
- **Markdown subagent prompts** (`.claude/agents/tarot-reader.md`) — Specialized agent with embedded card knowledge and reader personas
- **Task tool for subagent spawning** — Built-in Claude Code mechanism for delegating to specialized agents
- **Bash for randomness** (`shuf -n 1`) — Simple, zero-dependency card draw mechanism
- **JSON configuration files** (`~/.claude/settings.json`) — Standard config pattern with project override support

**Architecture decision: Embedded vs. external data**
Card meanings and symbolism are embedded directly in the subagent prompt rather than separate data files. This trades larger prompt size (~5000-8000 tokens for 22 cards) for simpler installation and zero filesystem dependencies beyond the skill/agent definitions themselves.

### Expected Features

The feature landscape for AI-agent tarot tools differs significantly from consumer tarot apps. Users expect perspective-shifting utility, not divination accuracy or visual aesthetics.

**Must have (table stakes):**
- Major Arcana card database (22 cards with upright meanings)
- Random card draw mechanism
- Contextual interpretation (AI applies card meaning to user's problem)
- Question/intention framing (implicit from conversation context)

**Should have (differentiators for AI agent use):**
- Multiple reader voices (Mystic vs. Grounded) — Different interpretive lenses for different needs
- Quick vs. deep reading modes — Respect time/depth preferences
- Global voice preference config — Persistent user preference
- Session continuity — Remember previous draws in conversation

**Defer (anti-features or v2+):**
- Minor Arcana (56 additional cards) — Complexity without proportional value for MVP
- Reversed meanings — Doubles interpretation complexity
- Visual deck imagery — Agents don't "see" cards; descriptions sufficient
- Multi-card spreads — Single card sufficient for quick perspective shifts
- Other esoteric tools (runes, astrology) — Framework supports future expansion but don't implement yet

**Key insight:** This is NOT a divination app for end-users. It's a reasoning tool for AI agents working on code/design problems. Features should optimize for problem-solving utility, not tarot scholarship.

### Architecture Approach

The three-tier architecture separates concerns cleanly: user invocation → skill orchestration → subagent interpretation. Skills handle argument parsing, config reading, and card randomization. Subagents contain domain expertise (card meanings, reader personas) and perform contextual interpretation.

**Major components:**
1. **Skill Layer** (`~/.claude/skills/tarot.md`) — Thin orchestration wrapper that parses `/tarot [mode] [question]`, reads voice preference from config, draws random card, spawns subagent with context
2. **Subagent Layer** (`~/.claude/agents/tarot-reader.md`) — Domain expert containing embedded Major Arcana knowledge, two reader personas (Mystic/Grounded), interpretation framework that applies card archetypal meaning to user context
3. **Configuration Layer** (`~/.claude/settings.json` + `.claude/settings.local.json`) — Persistent preferences with project override capability, stores voice preference and default mode
4. **Data Layer** (embedded in subagent) — 22 Major Arcana cards with keywords, symbolism, upright meanings embedded directly in subagent prompt for zero-dependency portability

**Data flow:** User invokes `/tarot quick "architecture decision"` → Skill parses mode (quick) and question → Skill reads config for voice preference → Skill draws card via `bash shuf` → Skill spawns tarot-reader subagent with {card, question, voice, mode} → Subagent loads card meaning, applies voice lens, generates interpretation → Main Claude receives and presents reading.

**Key architectural decision:** Card data embedded in subagent prompt rather than separate files. Rationale: simplifies installation (two files: skill + agent), eliminates filesystem dependencies, enables easy distribution. Trade-off: larger subagent prompt, but 22 cards fit comfortably within Claude's context window.

### Critical Pitfalls

Research identified 14 pitfalls across three severity levels. Top 5 that would cause project failure if not avoided:

1. **Treating Skills as Stateful Services** — Skills are prompt expansions invoked fresh each time, not persistent services. Store config in `~/.claude/settings.json`, not skill internal state. Detection: "settings don't stick between readings." Prevention: Document clearly that skills are stateless prompt expansions, read from config files on every invocation.

2. **Over-Engineering Randomness** — Complex seeding logic and timestamp dependencies create brittle, platform-specific code that's hard to test. Prevention: Use simple `bash shuf` for true random, or embrace "contextual draw" where LLM picks based on problem context (more honest, potentially more useful). Value is in interpretation, not draw mechanism.

3. **Confusing Reader Voice with LLM Persona** — Implementing Mystic vs. Grounded as different AI personalities rather than interpretive frameworks. Prevention: Voice = lens applied to interpretation, not persona change. Same card data, different framing. Mystic uses evocative metaphor, Grounded uses practical archetypal language. Both come from one subagent with voice parameter.

4. **Building Tarot Encyclopedia Instead of Perspective Tool** — Comprehensive card meanings and historical accuracy consume development time without improving problem-solving value. Prevention: Keep interpretations focused (2-3 paragraphs max), test with "Does this help me think differently?", defer comprehensive meanings to v2+.

5. **Global Config Without Project Overrides** — Implementing only global config prevents per-project preferences and team collaboration. Prevention: Build config hierarchy from start: project `.claude/settings.local.json` overrides global `~/.claude/settings.json`.

## Implications for Roadmap

Based on architecture dependencies and pitfall avoidance, the roadmap should follow a validation-first approach: build minimal viable reading experience, validate core value proposition (does tarot actually help agents solve problems?), then add differentiating features.

### Suggested Phase Structure

#### Phase 1: Core Reading Engine
**Rationale:** Validate end-to-end flow and core value before building features. This phase proves the fundamental architecture (skill → subagent → interpretation) works.

**Delivers:**
- `/tarot` skill that accepts invocations
- Random card draw via `bash shuf`
- tarot-reader subagent with 3-5 sample cards (for testing)
- Single reader voice (Grounded, default)
- Quick mode only
- Basic contextual interpretation

**Addresses features:**
- Card database (sample only)
- Random draw mechanism
- Contextual interpretation

**Avoids pitfalls:**
- Pitfall 1: Establishes config file pattern from start (even if minimal)
- Pitfall 2: Uses simple `bash shuf`, no complex randomness
- Pitfall 4: Minimal card set prevents encyclopedia trap

**Research flag:** MEDIUM — May need deeper research on Task tool syntax for subagent spawning. Skill file format (Markdown with YAML frontmatter?) needs verification.

---

#### Phase 2: Complete Card Dataset
**Rationale:** With proven architecture, expand content. This validates interpretation quality across all Major Arcana before adding voice complexity.

**Delivers:**
- All 22 Major Arcana cards embedded in subagent
- Rich symbolism descriptions for each card
- Tested interpretation quality for each card

**Addresses features:**
- Complete Major Arcana database (table stakes)
- Card meanings with symbolism

**Avoids pitfalls:**
- Pitfall 4: Focus on actionable insights, not historical accuracy
- Pitfall 6: If using data files (alternative architecture), establish pattern now

**Research flag:** LOW — This is content creation, well-understood domain. Standard tarot card meanings are widely documented.

---

#### Phase 3: Voice Differentiation
**Rationale:** With complete dataset, add the key differentiator. This phase makes the tool flexible for different user preferences and problem types.

**Delivers:**
- Mystic voice (evocative, metaphorical, poetic)
- Grounded voice (practical, archetypal, actionable)
- Voice parameter in subagent context
- Voice config in settings files

**Addresses features:**
- Multiple reader voices (high-value differentiator)

**Avoids pitfalls:**
- Pitfall 3: Voice as interpretive lens, not LLM persona
- Pitfall 10: Grounded voice as default prevents alienating skeptics

**Research flag:** LOW — This is prompt engineering iteration. Well-understood pattern.

---

#### Phase 4: Reading Modes & Configuration
**Rationale:** Add depth options and persistent preferences. Completes the MVP feature set.

**Delivers:**
- Deep reading mode (multi-paragraph interpretation with symbolism)
- Quick mode enhancements (ensure fast, focused)
- Global config file (`~/.claude/settings.json`)
- Project override config (`.claude/settings.local.json`)
- Config reading hierarchy (project overrides global)

**Addresses features:**
- Quick vs. deep modes (high-value differentiator)
- Global voice preference config

**Avoids pitfalls:**
- Pitfall 5: Project override mechanism built from start
- Pitfall 8: Consider optimization if subagent spawn is slow for quick draws

**Research flag:** LOW — Standard config patterns, file-based persistence well-understood.

---

#### Phase 5: Polish & Enhancement
**Rationale:** With complete MVP, add nice-to-have features based on usage feedback.

**Delivers (pick based on validation):**
- Problem-type awareness in interpretations
- Reflection prompts after card reveal
- Card-to-code-concept mapping examples
- Reading history/journaling (optional)
- Help documentation (`/tarot help`)

**Addresses features:**
- Session continuity
- Enhanced intelligence features

**Avoids pitfalls:**
- Pitfall 9: Reading history enables pattern recognition
- Pitfall 12: Skill discoverability via help command

**Research flag:** LOW — Enhancement features, can iterate based on user feedback.

---

### Phase Ordering Rationale

**Why this order:**
1. **Architecture validation first** — Phase 1 proves the skill + subagent pattern works before investing in content or features
2. **Content before complexity** — Phase 2 completes card dataset with single voice, avoiding the complexity of testing 22 cards × 2 voices simultaneously
3. **Differentiation after foundation** — Phase 3 adds voice differentiation only after interpretation quality is validated
4. **Configuration infrastructure early** — Phase 4 builds config system before Phase 5 enhancements that rely on it
5. **Polish after validation** — Phase 5 deferred until core value proposition is confirmed by usage

**Dependency insights from architecture research:**
- Skill invocation (Phase 1) must work before expanding card database (Phase 2)
- Single voice interpretation (Phase 1-2) must be solid before voice differentiation (Phase 3)
- Config infrastructure (Phase 4) enables enhancements (Phase 5)
- Critical path: Phase 1 → Phase 4 (can parallelize Phase 2-3 with sufficient confidence)

**How this avoids pitfalls:**
- Small increments prevent over-engineering (Pitfall 2, 4)
- Config pattern established early prevents refactor (Pitfall 5)
- Voice as lens, not persona, tested with complete dataset (Pitfall 3)
- Validation checkpoints after each phase prevent building wrong thing

### Research Flags

**Phases likely needing deeper research during planning:**
- **Phase 1 (Core Reading Engine)** — Task tool syntax for subagent spawning needs verification. Skill file format (Markdown structure, YAML frontmatter?) unclear from research. Recommend examining Claude Code skill examples or documentation.
- **Phase 4 (Configuration)** — Config file merge behavior (how exactly does project override global?) needs verification if not obvious during implementation.

**Phases with standard patterns (skip research-phase):**
- **Phase 2 (Card Dataset)** — Content creation, tarot card meanings well-documented
- **Phase 3 (Voice Differentiation)** — Prompt engineering, established LLM patterns
- **Phase 5 (Polish)** — Enhancement features, iterate based on feedback

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM | Claude Code skill patterns inferred from training data and project context; official docs unavailable. Task tool parameters need verification. |
| Features | HIGH | Tarot fundamentals well-understood; AI agent use case clearly analyzed from project requirements. Feature prioritization solid. |
| Architecture | MEDIUM | Skill + subagent pattern conceptually sound based on training knowledge, but implementation details (file format, Task tool syntax) need verification. |
| Pitfalls | MEDIUM-HIGH | UX pitfalls for tarot tools grounded in analysis of historical patterns. Claude Code specific pitfalls (stateful services, config) inferred from general agent patterns. |

**Overall confidence:** MEDIUM

Research synthesis is strong on domain fundamentals (tarot mechanics, AI interpretation, feature landscape) but medium on Claude Code specific implementation details due to unavailable official documentation. The architectural approach is sound, but specific syntax (skill file structure, Task tool parameters) should be verified during Phase 1 implementation.

### Gaps to Address

**Implementation details requiring validation:**

- **Skill file format** — Is it pure Markdown, Markdown with YAML frontmatter, or another structure? How does Claude Code discover and parse skills?
  - **Handle during:** Phase 1 implementation — Examine existing skill examples or Claude Code documentation

- **Task tool syntax** — Exact parameters for spawning subagent (`agent_type`, `task_description`, `include_context`). How is context passed and received?
  - **Handle during:** Phase 1 implementation — Test with minimal subagent, iterate on syntax

- **Subagent response format** — Does subagent return complete response at once, or can it stream? How does main thread receive output?
  - **Handle during:** Phase 1 implementation — Observe behavior during first integration test

- **Config merge behavior** — Exact precedence rules when project and global configs both exist. Is it deep merge or top-level override?
  - **Handle during:** Phase 4 implementation — Test config scenarios, document actual behavior

**Design decisions requiring user validation:**

- **Core value proposition** — Does tarot actually help agents/users solve problems, or is it novelty?
  - **Handle during:** Phase 1 validation — Use `/tarot` in real problem-solving scenarios, gather feedback

- **Voice distinctiveness** — Do Mystic vs. Grounded voices create meaningful choice, or does one dominate?
  - **Handle during:** Phase 3 testing — A/B test same card with both voices, assess preference

- **Quick vs. deep utility** — Do users value quick draw speed, or always prefer depth?
  - **Handle during:** Phase 4 validation — Track usage patterns (which mode users choose)

**Content quality requiring iteration:**

- **Interpretation prompts** — Prompt engineering for contextual interpretation will need refinement based on real usage.
  - **Handle during:** Phase 2-3 — Test interpretations with various problem types, iterate prompts

## Sources

### Primary (HIGH confidence)
- Esoterica PROJECT.md — Project requirements, scope, and explicit MCP rejection
- Existing `.claude/settings.local.json` in project — Confirms config file pattern

### Secondary (MEDIUM confidence)
- Training knowledge of Claude Code architecture (January 2025 cutoff) — Skill and subagent patterns
- Training knowledge of tarot reading practices and mechanics — Card meanings, reading structures
- Analysis of own system prompt structure — Subagent role definition patterns
- Training knowledge of AI-powered divination tools — Feature landscape and UX pitfalls

### Tertiary (LOW confidence)
- Inferred skill file discovery mechanism (assumed `.claude/skills/` auto-scanned)
- Inferred Task tool parameter schema (based on system prompt patterns)
- Inferred config merge behavior (assumed project overrides global)

**Note:** Unable to access external verification sources (web research tools restricted). Recommend validating Claude Code specific patterns against official documentation or existing skill examples during Phase 1 implementation.

---
*Research completed: 2026-01-21*
*Ready for roadmap: yes*
