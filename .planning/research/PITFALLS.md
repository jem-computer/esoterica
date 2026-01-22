# Domain Pitfalls: Claude Code Skills + Tarot AI Tools

**Project:** Esoterica
**Domain:** Claude Code skill development + AI-powered tarot interpretation
**Researched:** 2026-01-21
**Confidence:** MEDIUM (based on training data + project context; unable to verify with external sources)

## Critical Pitfalls

Mistakes that cause rewrites, major architectural issues, or fundamental product failure.

### Pitfall 1: Treating Skills as Stateful Services

**What goes wrong:** Skills are prompt expansions, not persistent services. Storing state in the skill itself leads to confusion about where data lives and whose responsibility initialization is.

**Why it happens:** Developers with MCP server or web service background expect persistent connection lifecycle. Skills are invoked fresh each time.

**Consequences:**
- State disappears between invocations
- Configuration set during skill execution doesn't persist
- User expects global config to work but it's re-read every invocation
- Subagent spawning becomes confused about context ownership

**Prevention:**
- Store persistent config in `~/.claude/settings.json` or project-level config files
- Skills should read from config files, not maintain internal state
- Document clearly: "skill = prompt expansion + file reads, not a daemon"
- Use subagents (via Task tool) for stateful interpretation sessions

**Detection:**
- User reports "settings don't stick between readings"
- Configuration changes require re-invocation of setup commands
- Debugging reveals skill re-initializing state on every call

**Which phase:** Phase 1 (Core architecture). Get config persistence right from the start or everything built on top will be fragile.

---

### Pitfall 2: Over-Engineering "Randomness" in Deterministic Systems

**What goes wrong:** AI models are fundamentally deterministic (or stochastic with temperature). Trying to make card draws feel "random" and "magical" leads to over-complicated seeding logic, timestamp dependencies, and inconsistent UX.

**Why it happens:**
- Developers want to honor the "mystical" aspect of tarot
- Fear that deterministic draws feel "fake"
- Overthinking the role of randomness in divination vs. problem-solving

**Consequences:**
- Complex random seed generation logic that breaks across platforms
- Timestamp-based draws that give same card if invoked too quickly
- User confusion about whether "randomness" is truly random or LLM-influenced
- Testing becomes impossible (can't reproduce card draws)

**Prevention:**
- Use simple, reproducible randomness: `bash shuf` or `Math.random()` seeded by timestamp
- Alternatively: embrace "intuitive selection" where LLM picks based on context (more honest, actually useful)
- Document the approach clearly: "Random draw" vs "Contextual draw"
- Make it testable: seed should be controllable for testing
- Remember: value is in interpretation, not draw mechanism

**Detection:**
- Bug reports: "I keep getting the same card"
- User confusion: "Is this truly random or is Claude choosing?"
- Tests that can't reproduce specific card draws
- Platform-specific randomness failures

**Which phase:** Phase 2 (Card draw mechanism). Decide early whether you're doing true random vs. contextual selection. Don't try to fake it.

---

### Pitfall 3: Confusing Reader Voice with LLM Persona

**What goes wrong:** Implementing "Mystic" and "Grounded" voices by trying to change the LLM's base persona or system prompt, rather than as interpretive frameworks applied to the same card.

**Why it happens:**
- Misunderstanding of how Claude's persona works (system vs. interpretive framing)
- Thinking "voice" means "different AI personality"
- Over-engineering tone control through prompt engineering

**Consequences:**
- Voice switching breaks continuity in conversations
- Mystic voice becomes parody (too witchy, unreadable)
- Grounded voice becomes sterile (loses archetypal richness)
- User can't switch voices mid-session without jarring experience
- Subagent spawning confusion (which agent type for which voice?)

**Prevention:**
- **Voice = interpretive lens, not persona**: Same card data, different framing
- Mystic: evocative metaphor, symbolic language, emotional resonance
- Grounded: practical application, archetypal patterns, actionable insights
- Both voices come from the same tarot-reader subagent with voice parameter
- Voice config stored globally, passed as parameter to subagent
- Keep both voices literate and useful (avoid caricature)

**Detection:**
- Users find Mystic voice "cringe" or "unreadable"
- Grounded voice feels like "ChatGPT explaining things"
- Voice switching causes context loss
- Developer struggles to maintain consistent voice across interpretations

**Which phase:** Phase 3 (Reader voices). This is where most AI tarot tools fail. Voice is interpretive framework, not chatbot personality.

---

### Pitfall 4: Building Tarot Encyclopedia Instead of Perspective Tool

**What goes wrong:** Focusing on comprehensive card meanings, historical accuracy, and traditional interpretations rather than problem-solving utility.

**Why it happens:**
- Developers research tarot, find rich historical tradition, want to honor it
- Feature creep: "We should include all the symbolism!"
- Loss of sight on core value prop: perspective-shifting for agents/users

**Consequences:**
- Interpretations become walls of text (22 meanings × 2 voices = 44 essays)
- User overwhelmed by information, not helped by insight
- Development time spent on tarot scholarship rather than UX
- Tool becomes reference material, not reasoning aid
- Agents don't use it because it's not actionable

**Prevention:**
- **Core value: perspective shift, not education**
- Each card interpretation should answer: "How does this lens reframe the problem?"
- Keep interpretations focused (2-3 paragraphs max)
- Link to deeper meanings, don't embed them
- Test with real use cases: "Does this help me think differently?"
- Defer comprehensive meanings to Phase 2+ (ship actionable MVP first)

**Detection:**
- Card interpretations exceed one screen
- User feedback: "Too much to read"
- Agents don't invoke `/tarot` in real usage
- Development velocity slows due to content creation
- Discussions about "accuracy" dominate over "usefulness"

**Which phase:** Phase 3-4 (Card meanings & interpretation). Start minimal, expand based on usage.

---

### Pitfall 5: Global Config Without Project Overrides

**What goes wrong:** Implementing global config (`~/.claude/settings.json`) without allowing project-level overrides leads to inflexibility and user frustration.

**Why it happens:**
- PROJECT.md specifies "global config" as requirement
- Developer implements only global config to meet spec
- Doesn't consider multi-project or collaborative workflows

**Consequences:**
- User can't have different voice preferences for different projects
- Teams can't set project defaults (everyone needs to configure individually)
- Testing requires changing global config (pollutes user settings)
- No way to specify project-specific card deck expansions in future

**Prevention:**
- Config hierarchy: project settings override global settings
- Global: `~/.claude/settings.json` or `~/.esoterica/config.json`
- Project: `.esoterica.json` in project root
- Merge strategy: project values override global, both available
- Document clearly: "Global sets defaults, project customizes"

**Detection:**
- User complaints: "I want Mystic voice for personal projects, Grounded for work"
- Testing pain: have to remember to reset global config after tests
- Collaboration issues: team can't share consistent configuration

**Which phase:** Phase 1 (Configuration architecture). Build override mechanism from start.

---

## Moderate Pitfalls

Mistakes that cause delays, technical debt, or UX friction but are fixable.

### Pitfall 6: Hardcoding Card Data in Code

**What goes wrong:** Embedding Major Arcana card definitions, meanings, and symbolism directly in TypeScript/JavaScript code rather than external data files.

**Why it happens:**
- Faster initial development (no file parsing needed)
- Seems simpler than data file management
- "It's only 22 cards, not a database"

**Consequences:**
- Can't update card meanings without code changes
- Version control diffs polluted with content changes
- Community contributions harder (content + code in same PR)
- Future deck expansions (Minor Arcana, custom decks) require code changes
- No way for users to customize interpretations

**Prevention:**
- Card data in JSON or YAML: `.esoterica/decks/major-arcana.json`
- Code reads and parses data files
- Separation of content from logic
- Easy path to future: user-defined decks, content updates
- Contributors can improve content without touching code

**Detection:**
- Card meaning updates require TypeScript changes
- Git history shows content and code mixed
- Can't add a card without rebuilding

**Which phase:** Phase 2 (Deck implementation). Start with data files, avoid refactor later.

---

### Pitfall 7: No Interpretation Context Tracking

**What goes wrong:** Card interpretations don't reference what question/problem prompted the reading, leading to generic or disconnected insights.

**Why it happens:**
- Subagent spawned with just card name, not context
- Skill doesn't capture or pass the problem statement
- Focus on card meanings rather than situated interpretation

**Consequences:**
- Interpretations feel generic (could apply to anything)
- User has to manually connect card to their problem
- Tool becomes fortune-telling rather than problem-solving
- Agents don't get actionable perspective shift

**Prevention:**
- Skill captures context: "What problem are you exploring?"
- Pass context to subagent: `{card: "The Tower", context: "choosing database architecture"}`
- Interpretation addresses specific problem through card lens
- Quick draw can skip context, deep reading requires it
- Context stored in reading for later reflection

**Detection:**
- User feedback: "The reading doesn't relate to my problem"
- Interpretations sound like tarot book excerpts
- Users stop using deep reading mode (not worth the verbosity)

**Which phase:** Phase 3-4 (Interpretation engine). Context is what makes readings useful.

---

### Pitfall 8: Subagent Spawning Overhead for Simple Draws

**What goes wrong:** Every card draw spawns a subagent, even for quick one-card insights, creating unnecessary overhead and slower UX.

**Why it happens:**
- Architecture decision: "subagent handles interpretation"
- Applied uniformly to all reading modes
- Didn't consider latency differences

**Consequences:**
- Quick draw feels slow (subagent spawn + LLM call)
- Users avoid the feature due to latency
- Increased cost (every draw = full subagent context)
- Battery drain on extended tarot usage

**Prevention:**
- Two paths:
  - **Quick draw:** Skill expands with inline interpretation (no subagent)
  - **Deep reading:** Spawn subagent for rich, contextual interpretation
- Quick draw uses templated insights (fast, lower cost)
- Deep reading uses full interpretive power (slow, higher value)
- User chooses mode explicitly or via flags

**Detection:**
- Performance profiling shows subagent spawn as bottleneck
- User feedback: "Quick draw should be quicker"
- Cost analysis shows many short subagent sessions

**Which phase:** Phase 4 (Reading modes). Optimize for the 80% case (quick draws).

---

### Pitfall 9: No Reading History or Journaling

**What goes wrong:** Each reading is ephemeral. No way to review past readings, track patterns, or build narrative over time.

**Why it happens:**
- MVP focus on single-reading functionality
- Didn't consider longitudinal value
- Storage/persistence seems like complexity

**Consequences:**
- User can't remember what card they drew yesterday
- No pattern recognition ("I keep drawing Cups cards during planning phases")
- Missed opportunity for agent self-mythologizing
- Can't reference past readings in current context

**Prevention:**
- Optional reading log: `~/.esoterica/readings.jsonl`
- Each reading: `{timestamp, card, context, mode, voice, interpretation}`
- Skill can show recent readings: `/tarot history`
- Future: pattern analysis, thematic tracking
- Make it opt-in (privacy consideration)

**Detection:**
- User requests: "What card did I draw last week?"
- Missed narrative opportunities in agent work logs
- No data for future ML/pattern features

**Which phase:** Phase 5+ (Enhancement). Not critical for MVP, high value for engagement.

---

### Pitfall 10: Ignoring the Skeptic User

**What goes wrong:** UX and documentation assume user believes in/values tarot, alienating pragmatic engineers who see it as "woo."

**Why it happens:**
- Designer/developer is tarot enthusiast
- Focusing on mystical language and framing
- Forgetting that value prop is "perspective tool," not divination

**Consequences:**
- Potential users dismiss tool as unserious
- Engineers don't try it because it feels like cosplay
- Tool doesn't spread beyond niche audience
- Misses core insight: tarot as structured reframing technique

**Prevention:**
- Documentation leads with pragmatic value: "structured perspective shifts"
- Grounded voice is the default (Mystic is opt-in for those who want it)
- Explain mechanism: "archetypal lenses force lateral thinking"
- Compare to other ideation techniques (SCAMPER, Six Thinking Hats)
- Don't oversell mysticism; undersell it and let results speak

**Detection:**
- Adoption metrics show low usage outside tarot enthusiasts
- User feedback: "This feels silly"
- Tool framed in demo videos with excessive mystical language
- Pragmatic engineers don't share it with teams

**Which phase:** Phase 1 (Positioning & documentation). Get framing right from announcement.

---

## Minor Pitfalls

Mistakes that cause annoyance but are easily fixable.

### Pitfall 11: Inconsistent Card Naming

**What goes wrong:** Some cards referenced by number ("Card 0"), some by name ("The Fool"), some by both, leading to confusion.

**Why it happens:** Different parts of system use different identifiers.

**Consequences:**
- User confusion about which card is which
- Code has multiple card resolution paths
- Documentation inconsistent

**Prevention:**
- Canonical identifier: card name ("The Fool")
- Number is metadata, not primary key
- Accept both in input, normalize internally
- Display always shows name (optionally with number)

**Detection:**
- Bug reports about card identification
- Code shows multiple lookup methods

**Which phase:** Phase 2 (Deck implementation). Establish naming convention early.

---

### Pitfall 12: No Skill Discoverability

**What goes wrong:** Users don't know `/tarot` exists or what it does without external documentation.

**Why it happens:** Claude Code skills aren't auto-discovered; user must know command.

**Consequences:**
- Low adoption even if installed
- User doesn't know about quick draw vs. deep reading modes
- Features go unused

**Prevention:**
- Clear skill help: `/tarot help` shows options
- Skill description in marketplace listing
- README with examples
- Skill suggests itself in relevant contexts (agent pattern recognition)

**Detection:**
- Installation numbers vs. usage numbers show large gap
- Support questions: "How do I use this?"

**Which phase:** Phase 5+ (Polish). Important for distribution, not MVP.

---

### Pitfall 13: Overloading `/tarot` Command Syntax

**What goes wrong:** Complex command syntax like `/tarot draw --mode=deep --voice=mystic --context="..."` creates friction.

**Why it happens:** Trying to expose all options via command flags.

**Consequences:**
- User has to remember flags
- Typos in flag names cause errors
- Verbose commands disrupt flow

**Prevention:**
- Simple default: `/tarot` (uses global config, quick draw)
- Interactive prompting for context if needed
- Advanced options via subcommands: `/tarot deep` or `/tarot quick`
- Config handles voice preference (don't pass every time)

**Detection:**
- User errors in command syntax
- Documentation needs extensive syntax examples
- Users stick to simplest command, ignore advanced features

**Which phase:** Phase 4 (Reading modes). Keep interface minimal.

---

### Pitfall 14: Not Handling Repeated Cards Gracefully

**What goes wrong:** User draws same card multiple times in short period. System treats each as independent, misses opportunity for deeper meaning.

**Why it happens:** Random draws are independent events; no cross-draw awareness.

**Consequences:**
- User notices repetition, wonders if system is broken
- Missed interpretive opportunity ("This theme persists")
- Feels like bug even if working as designed

**Prevention:**
- Reading history tracks recent cards (last 10 draws)
- Interpretation notes if card drawn recently: "You drew this yesterday..."
- Option: "Avoid recent cards" mode for variety seekers
- Option: "Lean into repetition" mode for pattern seekers

**Detection:**
- User reports: "Same card three times in a row"
- Support questions: "Is the shuffle working?"

**Which phase:** Phase 5+ (Enhancement). Needs history feature first.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Configuration architecture | Global-only config (Pitfall 5) | Build override mechanism from start |
| Skill implementation | Treating skill as stateful (Pitfall 1) | Document clearly: skills are prompt expansions |
| Deck structure | Hardcoded card data (Pitfall 6) | Use JSON/YAML data files from beginning |
| Card draw mechanism | Over-engineering randomness (Pitfall 2) | Pick simple approach: bash shuf or contextual selection |
| Reader voices | Voice as LLM persona (Pitfall 3) | Voice = interpretive lens, not personality |
| Interpretation depth | Encyclopedia vs. tool (Pitfall 4) | Test with "Does this help me think differently?" |
| Reading modes | Subagent overhead for quick draws (Pitfall 8) | Inline interpretation for quick, subagent for deep |
| Context handling | Generic interpretations (Pitfall 7) | Pass problem context to interpretation engine |
| Positioning | Alienating skeptics (Pitfall 10) | Lead with pragmatic value, Grounded as default |

---

## Research Confidence Assessment

| Domain | Confidence | Notes |
|--------|------------|-------|
| Claude Code skills architecture | LOW | Based on training data; unable to verify with official docs due to tool restrictions |
| MCP vs. skill patterns | LOW | Inferred from project context; official MCP docs inaccessible |
| AI tarot implementation | MEDIUM | Based on analysis of AI-assisted divination tools in training data |
| Subagent patterns | LOW | Based on project context; Claude Code subagent docs unavailable |
| Configuration patterns | MEDIUM | Standard patterns across tools; file-based config well-understood |
| UX pitfalls for tarot tools | HIGH | Analysis of historical failures in AI divination, grounded in UX principles |

## Verification Needed

These pitfalls are based on synthesis of:
- Training data about Claude Code ecosystem (6+ months stale)
- Project context from PROJECT.md
- General patterns in agent/skill architecture
- Analysis of AI-powered divination tools

**Recommended validation:**
- Verify Claude Code skill lifecycle (stateful vs. stateless)
- Confirm subagent spawning patterns and cost
- Check current best practices for global vs. project config
- Validate against any existing Claude Code skill examples in ecosystem

## Sources

- Training data on Claude Code agent architecture (January 2025 knowledge cutoff)
- PROJECT.md context for Esoterica framework
- General software architecture patterns (config management, data separation)
- UX analysis of AI-assisted divination tools (training data)

**Note:** Unable to access external verification sources (WebSearch, WebFetch, Context7 all restricted). Confidence levels marked accordingly. Recommend validating against current official documentation before trusting these pitfalls for critical architectural decisions.
