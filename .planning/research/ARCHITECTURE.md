# Architecture: Claude Code Skill + Subagent Pattern

**Domain:** Claude Code extensibility (skills + agent spawning)
**Researched:** 2026-01-21
**Confidence:** MEDIUM (based on training knowledge + project context; official docs unavailable)

## Executive Summary

Claude Code skills are prompt expansions invoked via slash commands (e.g., `/tarot`). They trigger workflows that can spawn specialized subagents using the Task tool. The architecture follows a three-tier flow: **Skill Definition → Skill Logic → Subagent Execution**.

For Esoterica's `/tarot` skill:
1. User invokes `/tarot [quick|deep] [question]`
2. Skill logic determines card draw and spawns tarot-reader subagent
3. Subagent receives card data + user context, returns interpretation
4. Main Claude presents reading to user

**Key architectural decision:** Card data and reader personas live in subagent prompt, not skill file. This keeps the skill thin (routing logic) and subagent thick (domain knowledge).

## Recommended Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Claude Code Session                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ User/Agent: /tarot quick "architecture decision"       │ │
│  └────────────────┬───────────────────────────────────────┘ │
│                   │                                          │
│                   ▼                                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Skill: /tarot                             │ │
│  │  Location: ~/.claude/skills/tarot.md                   │ │
│  │                                                         │ │
│  │  Responsibilities:                                     │ │
│  │  - Parse invocation args (mode, question)             │ │
│  │  - Read config (~/.claude/config.yaml → voice pref)   │ │
│  │  - Draw card (bash: shuf tarot-deck.txt)              │ │
│  │  - Spawn tarot-reader subagent via Task tool          │ │
│  └────────────────┬───────────────────────────────────────┘ │
│                   │                                          │
│                   │ Task(agent_type: tarot-reader,           │
│                   │      context: {card, question, voice})   │
│                   ▼                                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │          Subagent: tarot-reader                        │ │
│  │  Location: ~/.claude/agents/tarot-reader.md            │ │
│  │                                                         │ │
│  │  Embedded Knowledge:                                   │ │
│  │  - Major Arcana meanings (22 cards)                    │ │
│  │  - Reader personas (Mystic, Grounded)                  │ │
│  │  - Interpretation framework                            │ │
│  │                                                         │ │
│  │  Receives: {card: "The Tower", question: "...",        │ │
│  │             voice: "mystic", mode: "quick"}            │ │
│  │                                                         │ │
│  │  Returns: Markdown-formatted interpretation            │ │
│  └────────────────┬───────────────────────────────────────┘ │
│                   │                                          │
│                   │ Return: structured reading               │
│                   ▼                                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Main Claude Thread                        │ │
│  │  Receives subagent output                              │ │
│  │  Presents to user                                      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Skill File: `/tarot`

**Location:** `~/.claude/skills/tarot.md`

**Purpose:** Orchestration layer. Handles invocation, draws card, spawns subagent.

**Structure:**
```markdown
# Tarot Reading Skill

**Invocation:** /tarot [quick|deep] [optional question]

**Description:** Draw a tarot card for perspective-shifting on current problem.

## Responsibilities

When invoked:
1. Parse mode (quick/deep, defaults to quick)
2. Parse question (optional user-provided context)
3. Read voice preference from config (~/.claude/config.yaml → tarot.voice)
4. Draw random card from Major Arcana deck
5. Spawn tarot-reader subagent with context
6. Return subagent's interpretation to user

## Implementation

[Prompt instructions for main Claude on how to execute above steps]
```

**Key Design Decisions:**
- Skill does NOT contain card meanings (subagent has that)
- Skill does NOT interpret (subagent does that)
- Skill DOES handle randomness (card draw)
- Skill DOES read config (voice preference)

### 2. Subagent: tarot-reader

**Location:** `~/.claude/agents/tarot-reader.md`

**Purpose:** Domain expert. Contains card knowledge and persona voices.

**Structure:**
```markdown
# Tarot Reader Agent

You are a tarot reader agent. You receive a drawn card, user context,
and voice preference, then provide interpretation.

## Your Knowledge Base

### Major Arcana

[Embedded data for 22 cards, each with:]
- **Card Name:** The Fool
- **Number:** 0
- **Keywords:** Beginnings, innocence, spontaneity, free spirit
- **Symbolism:** [description]
- **Upright Meaning:** [archetypal interpretation]

[Repeat for all 22 cards]

## Reader Personas

### Mystic Voice
Witchy, evocative, poetic. Leans into mystery and metaphor.
Example: "The Tower strikes—old structures crumble, necessary
destruction before rebirth. What foundation needs razing?"

### Grounded Voice
Practical archetypal language. Clear, direct, actionable.
Example: "The Tower represents disruption. Your current approach
has structural flaws. Time to rebuild from scratch."

## Input Format

You receive:
{
  "card": "The Tower",
  "question": "Should I refactor this architecture?",
  "voice": "grounded",
  "mode": "quick"
}

## Output Format

### Quick Mode (2-3 sentences)
- Card name and one-line essence
- Direct interpretation for question
- Actionable insight

### Deep Mode (full reading)
- Card name and archetypal overview
- Symbolism relevant to context
- Multi-paragraph interpretation
- Specific guidance for situation
```

**Key Design Decisions:**
- Subagent is stateless (no memory between readings)
- All card data embedded in prompt (no external files)
- Two personas differentiated by linguistic style
- Input/output formats clearly specified

### 3. Configuration

**Location:** `~/.claude/config.yaml` (global) or `.claude/config.yaml` (project)

**Purpose:** User preferences that persist across sessions.

```yaml
tarot:
  voice: "mystic"  # or "grounded"
  default_mode: "quick"  # or "deep"
```

**Access Pattern:**
- Skill reads config on invocation
- Falls back to defaults if not set
- Can be overridden per-invocation: `/tarot deep --voice grounded`

### 4. Card Deck Data

**Location:** Embedded in `~/.claude/agents/tarot-reader.md` (subagent prompt)

**Alternative Considered:** Separate `~/.claude/data/tarot-deck.txt`
- **Why rejected:** Adds filesystem dependency, complicates distribution
- **Trade-off:** Larger subagent prompt vs. cleaner separation of concerns
- **Decision:** Embed in prompt for simplicity and portability

**Format:**
```markdown
### Major Arcana

#### 0. The Fool
**Keywords:** Beginnings, innocence, spontaneity
**Upright Meaning:** New journey, leap of faith, beginner's mind
**Symbolism:** Standing at cliff's edge, looking skyward...

[Repeat for cards 1-21]
```

## Data Flow Patterns

### Invocation Flow

```
User → /tarot quick "architecture decision"
       ↓
Skill parses:
  - mode: "quick"
  - question: "architecture decision"
       ↓
Skill reads config:
  - ~/.claude/config.yaml → tarot.voice = "mystic"
       ↓
Skill draws card:
  - bash: shuf -n 1 ~/.claude/data/major-arcana-list.txt
  - Result: "The Tower"
       ↓
Skill spawns subagent:
  - Task(agent_type: "tarot-reader",
         context: {
           card: "The Tower",
           question: "architecture decision",
           voice: "mystic",
           mode: "quick"
         })
       ↓
Subagent receives context:
  - Loads card "The Tower" from embedded knowledge
  - Activates "mystic" persona
  - Generates "quick" interpretation
       ↓
Subagent returns:
  "🌙 **The Tower** — Necessary destruction precedes rebirth.

  Your architecture has structural flaws invisible from inside.
  This refactor isn't repair—it's demolition. Embrace it.
  What foundation assumptions need to crumble?"
       ↓
Main Claude presents to user
```

### Configuration Reading Pattern

```
Skill execution:
  1. Check for project-level config: ./.claude/config.yaml
     - If exists and has tarot.voice → use it
  2. Else, check global config: ~/.claude/config.yaml
     - If exists and has tarot.voice → use it
  3. Else, use default: "grounded"
```

### Card Draw Pattern

**Option 1: Static file + shuf (RECOMMENDED)**
```bash
# Skill creates/uses: ~/.claude/data/major-arcana-list.txt
# Contents: one card per line, "The Fool" to "The World"
card=$(shuf -n 1 ~/.claude/data/major-arcana-list.txt)
```

**Option 2: Inline bash array**
```bash
cards=("The Fool" "The Magician" ... "The World")
card=${cards[$RANDOM % 22]}
```

**Option 3: Ask subagent to "draw" (AVOID)**
- Problem: Subagent can't truly randomize, will bias toward dramatic cards
- Only use if no bash access

### Subagent Return Format

**Quick Mode:**
```markdown
**[Card Name]** — [One-line essence]

[2-3 sentence interpretation tied to question]

[Actionable insight or question to ponder]
```

**Deep Mode:**
```markdown
# [Card Name]

## Archetypal Overview
[Paragraph on card's essential meaning]

## Symbolism
[What visual/symbolic elements relate to user's context]

## Interpretation
[Multi-paragraph reading addressing the question]

## Guidance
[Specific next steps or perspectives to consider]
```

## Alternative Architectures Considered

### Alt 1: MCP Server with External API

**Structure:**
- MCP server exposes `draw_card()` and `interpret_card()` tools
- Main Claude calls tools directly, no subagent

**Why Rejected:**
- Overkill for static data (no external API needed)
- Requires server process management
- Adds deployment complexity
- PROJECT.md explicitly rejects MCP approach

### Alt 2: Single-File Skill (No Subagent)

**Structure:**
- Skill file contains both orchestration AND card meanings
- Interpretation happens inline in skill prompt

**Why Rejected:**
- Violates separation of concerns
- Skill prompt becomes 1000+ lines (unmaintainable)
- Can't swap personas cleanly
- Loses benefits of specialized subagent focus

### Alt 3: External Card Database

**Structure:**
- SQLite or JSON file with card data
- Skill queries file, passes data to subagent

**Why Rejected:**
- Adds filesystem dependency
- Complicates installation (must distribute data file)
- No performance gain (22 cards is tiny dataset)
- Embedding in prompt is simpler

## Build Order Implications

### Phase 1: Skill Scaffold
**Deliverable:** `/tarot` skill that can be invoked
- Create `~/.claude/skills/tarot.md`
- Implement argument parsing
- Test invocation (even if it just echoes back args)

**Dependencies:** None
**Validates:** Skill installation and invocation mechanism

### Phase 2: Card Draw Mechanism
**Deliverable:** Skill draws random card
- Create `~/.claude/data/major-arcana-list.txt` (22 lines)
- Implement bash shuf draw
- Test randomness

**Dependencies:** Phase 1
**Validates:** Data file location and random selection

### Phase 3: Subagent Creation
**Deliverable:** tarot-reader subagent exists, can receive input
- Create `~/.claude/agents/tarot-reader.md`
- Embed card meanings (can start with 1-3 cards for testing)
- Implement input parsing

**Dependencies:** None (can develop in parallel with Phase 1-2)
**Validates:** Subagent structure and input format

### Phase 4: Subagent Integration
**Deliverable:** Skill spawns subagent, receives response
- Skill calls Task tool with context
- Subagent returns formatted interpretation
- Main thread receives and displays

**Dependencies:** Phases 1-3
**Validates:** End-to-end data flow

### Phase 5: Configuration Layer
**Deliverable:** Voice preference persists
- Create config file structure
- Implement config reading in skill
- Test preference application

**Dependencies:** Phase 4
**Validates:** Configuration pattern

### Phase 6: Complete Card Dataset
**Deliverable:** All 22 Major Arcana cards
- Embed full card meanings in subagent
- Test each card's interpretation quality

**Dependencies:** Phase 4
**Validates:** Content completeness

### Phase 7: Persona Differentiation
**Deliverable:** Mystic vs Grounded voices
- Implement persona logic in subagent
- Test voice consistency

**Dependencies:** Phase 6
**Validates:** Reader voice quality

**Critical Path:** 1 → 2 → 4 (can parallelize 3 with 1-2)

**Research Flags:**
- Phase 1 may need research if skill installation location/format differs from `~/.claude/skills/`
- Phase 4 may need research on Task tool's exact syntax for context passing

## Edge Cases and Error Handling

### Skill-Level Errors

**Missing config file:**
- Behavior: Fall back to default voice ("grounded")
- Rationale: Graceful degradation, don't block on config

**Invalid card draw (file missing):**
- Behavior: Error message + offer to create deck file
- Rationale: This is critical path, can't proceed without

**Subagent spawn failure:**
- Behavior: Skill falls back to inline interpretation OR error
- Rationale: Depends on whether skill can interpret (it shouldn't)

### Subagent-Level Errors

**Unknown card received:**
- Behavior: Return error to skill, skill re-draws
- Rationale: Data mismatch between deck file and subagent knowledge

**Invalid voice preference:**
- Behavior: Default to "grounded"
- Rationale: Voice is aesthetic, not functional

**Missing question context:**
- Behavior: Provide general card interpretation
- Rationale: Card reading can be non-specific

## Performance Considerations

**Skill invocation overhead:**
- Negligible (file I/O for config, single bash shuf call)

**Subagent spawn time:**
- Depends on Claude Code's Task tool latency
- Estimated: 1-3 seconds for subagent initialization
- Mitigation: None needed (user expects brief pause for "reading")

**Prompt size:**
- Subagent prompt with 22 cards: ~5000-8000 tokens
- Within reasonable limits for Claude's context window

## Security Considerations

**Bash execution in skill:**
- Risk: If user question is interpolated into bash command
- Mitigation: Never pass user input directly to bash; sanitize or use fixed commands only

**Config file injection:**
- Risk: Malicious config.yaml with code execution
- Mitigation: Use safe YAML parser, only read expected keys

**Subagent prompt injection:**
- Risk: User question contains instructions to override subagent behavior
- Mitigation: Subagent prompt should clearly separate "card data" from "user context" sections

## Testing Strategy

**Skill Testing:**
1. Invocation parsing: `/tarot`, `/tarot quick`, `/tarot deep "question"`
2. Config reading: Set voice in config, verify skill reads correctly
3. Card draw: Invoke 50 times, verify all 22 cards appear (distribution check)
4. Subagent spawn: Verify Task call syntax, inspect context passed

**Subagent Testing:**
1. Card knowledge: For each card, verify interpretation quality
2. Persona consistency: Same card, both voices, verify style difference
3. Mode handling: Quick vs deep, verify length/depth difference
4. Edge cases: Missing question, invalid voice, unknown card

**Integration Testing:**
1. End-to-end: User invokes `/tarot`, receives interpretation
2. Config override: `/tarot --voice mystic` when config says "grounded"
3. Multi-invocation: Draw multiple cards in session, verify independence

## Scalability for Future Esoteric Tools

**Design for extensibility:**
- Skill naming: `/tarot` suggests future `/runes`, `/astrology`, etc.
- Subagent naming: `tarot-reader` suggests future `rune-caster`, `astro-interpreter`
- Config structure: Nested `tarot:`, `runes:` sections

**Shared patterns:**
- All esoteric skills: draw symbol → spawn interpreter → return reading
- All interpreters: embedded knowledge + persona + context-aware interpretation

**Where to generalize (future):**
- Could extract "esoteric reading framework" with shared config patterns
- Could create `esoteric-base` subagent that all interpreters extend

**Where NOT to generalize (now):**
- Don't create shared infrastructure until 2nd tool added
- Tarot-specific logic should stay tarot-specific

## Open Questions

1. **Skill file format:** Is it Markdown with YAML frontmatter? Pure Markdown? Needs verification.
   - **Impact:** Affects Phase 1 implementation
   - **Research needed:** Check Claude Code skill examples or docs

2. **Task tool syntax:** Exact parameters for spawning subagent unclear from training data.
   - **Impact:** Affects Phase 4 integration
   - **Research needed:** Review Task tool documentation or existing agent spawn examples

3. **Config file location:** Global vs project-level precedence order.
   - **Impact:** Affects Phase 5 config reading logic
   - **Research needed:** Check Claude Code config documentation

4. **Subagent response streaming:** Does subagent return complete response, or can it stream?
   - **Impact:** UX for deep readings (progressive display vs. wait-then-show)
   - **Research needed:** Test Task tool behavior

5. **Installation mechanism:** How does user install skill? Copy file? CLI command?
   - **Impact:** Documentation and distribution strategy
   - **Research needed:** Check Claude Code extension installation docs

## Confidence Assessment

| Component | Confidence | Rationale |
|-----------|------------|-----------|
| Skill as prompt file | MEDIUM | Training data suggests Markdown-based skills, but exact format unverified |
| Subagent via Task tool | MEDIUM | Task tool exists for agent spawning, syntax details need verification |
| Config in ~/.claude/ | HIGH | Standard config location pattern, verified in project's existing .claude/ dir |
| Card data embedded in prompt | HIGH | Design decision, no external dependency to verify |
| Data flow (skill → subagent → return) | MEDIUM | Conceptual pattern clear, implementation details need validation |

## Sources

**Training knowledge (as of January 2025):**
- Claude Code architecture patterns
- Agent SDK task/subagent spawning mechanisms
- Markdown-based skill definitions

**Project context:**
- `/Users/jem/code/111ecosystem/esoterica/.planning/PROJECT.md` (requirements)
- `/Users/jem/code/111ecosystem/esoterica/.planning/codebase/STRUCTURE.md` (existing structure)

**Gaps:**
- Official Claude Code skill documentation (unavailable during research)
- Task tool API reference (unavailable during research)
- Example skills for reference (none found in project)

---

*Architecture research: 2026-01-21 — MEDIUM confidence due to unavailable official docs, recommend verification of skill format and Task tool syntax during Phase 1 implementation*
