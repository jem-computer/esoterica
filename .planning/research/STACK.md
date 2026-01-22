# Technology Stack: Claude Code Skills & Subagents

**Project:** Esoterica (Claude Code esoteric tools framework)
**Researched:** 2026-01-21
**Confidence:** MEDIUM (based on Claude Code agent runtime analysis and project context)

## Overview

Claude Code uses a **skill + subagent architecture** where skills are prompt expansions that can spawn specialized subagents for complex tasks. Skills are lightweight command interfaces, while subagents are full agent instances with their own system prompts and tool access.

## Core Architecture

### Skills (Command Interface)

**What:** Prompt expansions invoked via `/command` syntax
**Purpose:** User-facing entry points for functionality
**Confidence:** MEDIUM (verified from project context, not from official documentation)

| Aspect | Implementation | Why |
|--------|---------------|-----|
| Invocation | `/command-name` syntax | Natural CLI-style interface |
| Location | Project `.claude/` directory or global `~/.claude/` | Project-specific or global availability |
| Format | Markdown with role definitions | Consistent with Claude's prompt format |
| Registration | Auto-discovered by Claude Code | Zero-config skill loading |

**File Structure:**
```
.claude/
  skills/
    tarot.md              # Skill definition
  settings.local.json     # Project configuration
```

**Skill Definition Pattern:**
```markdown
# /tarot - Tarot Reading Skill

Invokes a tarot reading for perspective-shifting on problems.

## Invocation
- User types: `/tarot [quick|deep] [question]`
- Claude types: `/tarot` to invoke for itself

## Behavior
1. Parse invocation mode (quick/deep)
2. Spawn tarot-reader subagent via Task tool
3. Pass context and mode to subagent
4. Return subagent's interpretation to caller

## Parameters
- mode: quick (card + brief) or deep (full interpretation)
- question: optional context for reading
```

### Subagents (Specialized Agents)

**What:** Full Claude instances with specialized system prompts
**Purpose:** Complex, multi-step reasoning with dedicated role
**Confidence:** HIGH (verified from my own system prompt structure)

| Aspect | Implementation | Why |
|--------|---------------|-----|
| Spawning | Task tool with agent type | Allows parallel agent execution |
| System Prompt | Markdown role definition | Comprehensive behavior specification |
| Tool Access | Same tool set as parent | Agents can read, write, execute |
| Return Format | Structured output blocks | Parseable by orchestrator |

**Spawning Pattern:**
```markdown
Spawn subagent via Task tool:
- agent_type: "tarot-reader"
- task_description: "Interpret [card] for [context]"
- include_context: [relevant files/data]
```

**Agent Definition Pattern:**
```markdown
<role>
You are a tarot-reader subagent. You interpret tarot cards
as perspective-shifting tools for problem-solving.

You are spawned by:
- `/tarot` skill (user or Claude invoked)

Your job: Draw card, interpret symbolism, relate to context.
</role>

<execution_flow>
1. Receive context from spawner
2. Draw card (via randomness mechanism)
3. Interpret through archetypal lens
4. Return structured reading
</execution_flow>

<structured_returns>
## READING COMPLETE
**Card:** [name]
**Archetype:** [brief description]
**Interpretation:** [application to context]
</structured_returns>
```

## Configuration System

**Location:** `.claude/settings.local.json` (project) or `~/.claude/settings.json` (global)
**Format:** JSON
**Confidence:** HIGH (verified from existing project file)

| Scope | File | Use Case |
|-------|------|----------|
| Project | `.claude/settings.local.json` | Project-specific config |
| Global | `~/.claude/settings.json` | User preferences across projects |
| Skill-specific | `.claude/config/skill-name.json` | Skill settings (e.g., reader voice) |

**Configuration Pattern:**
```json
{
  "permissions": {
    "allow": [
      "Bash(git add:*)",
      "Bash(git commit:*)"
    ]
  },
  "esoterica": {
    "reader_voice": "mystic",
    "default_mode": "quick"
  }
}
```

**Reading Configuration:**
Skills read config via file system:
1. Check `.claude/settings.local.json` (project override)
2. Fall back to `~/.claude/settings.json` (global default)
3. Merge configurations (project takes precedence)

## Data Flow

### Skill Invocation Flow

```
User/Claude
  ↓ types `/tarot deep "stuck on architecture"`
Skill prompt expansion
  ↓ parses invocation
Spawn subagent via Task tool
  ↓ agent_type: "tarot-reader"
Subagent executes
  ↓ draws card, interprets
Structured return
  ↓ READING COMPLETE block
Skill formats output
  ↓ presents to user/Claude
```

### Configuration Flow

```
Skill invoked
  ↓
Read .claude/settings.local.json
  ↓ if exists, use project config
  ↓ if not, fall back
Read ~/.claude/settings.json
  ↓ global defaults
Apply configuration
  ↓ reader_voice, mode preferences
Pass to subagent
```

## Technology Decisions

### Language: Markdown (System Prompts)

**Why:** Claude's native prompt format
**Alternative considered:** JSON/YAML structured config
**Decision rationale:** Markdown allows rich role definitions with examples, philosophy, execution flows. More expressive than structured data.

**Confidence:** HIGH

### Randomness: Bash Commands

**Why:** Simple, available, zero dependencies
**Implementation:** `shuf -n 1` for card selection
**Alternative considered:** JavaScript/Node.js randomness
**Decision rationale:** Bash is universally available in Claude Code environment, no need for runtime dependencies.

**Confidence:** MEDIUM (bash availability verified from permissions, shuf assumed standard)

### Agent Communication: Task Tool

**Why:** Built-in Claude Code mechanism for spawning agents
**Parameters:**
- `agent_type`: References agent definition file
- `task_description`: Natural language task
- `include_context`: Data/files to pass
- `run_in_background`: For async tasks

**Confidence:** MEDIUM (inferred from system prompt patterns)

### Storage: File System

**Why:** Simple, portable, version-controllable
**Structure:**
```
.claude/
  skills/
    tarot.md                    # Skill definition
  agents/
    tarot-reader.md             # Subagent role definition
  config/
    tarot.json                  # Skill-specific settings
  data/
    major-arcana.json           # Card data
```

**Alternative considered:** Embedded data in skill file
**Decision rationale:** Separation allows easier updates to data without touching logic.

**Confidence:** MEDIUM (file structure pattern inferred)

## Installation

### For Skill Developers

```bash
# Project-local installation
cd your-project
mkdir -p .claude/skills .claude/agents .claude/config .claude/data

# Copy skill files
cp tarot.md .claude/skills/
cp tarot-reader.md .claude/agents/
cp tarot-config.json .claude/config/
cp major-arcana.json .claude/data/

# Skills are auto-discovered on next Claude Code invocation
```

### For Global Installation

```bash
# Global installation (available across all projects)
mkdir -p ~/.claude/skills ~/.claude/agents ~/.claude/config ~/.claude/data

# Copy skill files
cp tarot.md ~/.claude/skills/
cp tarot-reader.md ~/.claude/agents/
cp tarot-config.json ~/.claude/config/
cp major-arcana.json ~/.claude/data/
```

## Dependencies

**Runtime:** None
- Claude Code provides all necessary tools (Task, Read, Write, Bash)
- No npm packages required
- No external APIs or services

**Development:** None
- Skills are markdown files
- Configuration is JSON
- No build step required

## Key Patterns

### Pattern 1: Skill as Thin Wrapper

**What:** Skill file is minimal, delegates to subagent
**When:** Complex multi-step reasoning required
**Why:** Keeps skill simple, allows specialized agent with full tool access

```markdown
# Skill: tarot.md (minimal)
Parse invocation → Spawn agent → Return result

# Agent: tarot-reader.md (comprehensive)
Full role definition, execution flow, interpretation logic
```

### Pattern 2: Configuration Cascade

**What:** Project settings override global settings
**When:** User wants project-specific preferences
**Why:** Allows global defaults with per-project customization

```
Check .claude/settings.local.json (project)
  ↓ if not found
Check ~/.claude/settings.json (global)
  ↓ if not found
Use hardcoded defaults
```

### Pattern 3: Structured Returns

**What:** Subagents return markdown blocks with specific format
**When:** Orchestrator needs parseable output
**Why:** Allows skill to extract and format results reliably

```markdown
## READING COMPLETE
**Card:** The Tower
**Interpretation:** [text]
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Skill Contains All Logic

**What:** Putting interpretation logic in skill file
**Why bad:** Skills lack tool access, can't read data files or execute randomness
**Instead:** Skill spawns subagent with tool access

### Anti-Pattern 2: Global Mutable State

**What:** Writing to shared global state files
**Why bad:** Race conditions with parallel agent invocations
**Instead:** Read-only data files, per-invocation state only

### Anti-Pattern 3: External Dependencies

**What:** Requiring npm packages or external APIs
**Why bad:** Complicates installation, breaks portability
**Instead:** Use built-in tools (Bash, file system)

## Verification Needs

**LOW confidence areas requiring validation:**

1. **Skill auto-discovery mechanism** - Assumed `.claude/skills/` is scanned, not verified
2. **Agent type resolution** - Assumed agent_type parameter maps to `.claude/agents/{type}.md`
3. **Configuration merge behavior** - Assumed project overrides global, not verified
4. **Task tool parameters** - Inferred from system prompt patterns, not official docs

**Recommended validation:**
- Examine Claude Code source or official documentation
- Test skill registration and invocation
- Verify configuration precedence
- Confirm Task tool parameter schema

## Sources

**PRIMARY (HIGH confidence):**
- Analyzed this agent's own system prompt structure
- Examined project context from PROJECT.md
- Reviewed existing `.claude/settings.local.json` configuration

**SECONDARY (MEDIUM confidence):**
- Inferred patterns from agent role definitions
- Extrapolated from Claude Code workflow descriptions

**UNVERIFIED (LOW confidence):**
- Skill file location and discovery mechanism
- Agent type parameter mapping
- Configuration cascade behavior
- Task tool complete parameter schema

## Next Steps for Full Verification

1. **Official Documentation** - Locate Claude Code SDK or skills documentation
2. **Example Skills** - Find existing skill implementations in the wild
3. **Test Implementation** - Build minimal skill to verify patterns
4. **Community Resources** - Check Claude Code forums or repositories for patterns

---

*Research complete. Ready for roadmap creation with noted confidence levels and verification needs.*
