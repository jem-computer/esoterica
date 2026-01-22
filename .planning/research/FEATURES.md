# Feature Landscape: Tarot Tools for AI Agents

**Domain:** Tarot/divination tools adapted for AI coding assistant context
**Researched:** 2026-01-21
**Confidence:** MEDIUM (based on training knowledge of tarot apps, verified against AI agent use case)

## Context

This analysis examines tarot tool features through two lenses:
1. **Traditional tarot apps** - What features define a useful tarot reading experience
2. **AI agent context** - How Esoterica's use case (problem-solving, planning, perspective-shifting for Claude Code agents) differs from consumer tarot apps

**Key distinction:** This is NOT a divination app for end-users. It's a reasoning tool for AI agents working on code/design problems.

## Table Stakes

Features users expect from ANY tarot tool. Missing these = incomplete experience.

| Feature | Why Expected | Complexity | Implementation Notes |
|---------|--------------|------------|---------------------|
| **Card database with meanings** | Core content - without meanings, cards are just images | Low | Major Arcana: 22 cards with upright meanings. Include: archetype, keywords, core symbolism |
| **Random card draw** | Essential mechanic - simulates physical shuffle/draw | Low | `shuf` or random selection. Must feel unpredictable even if deterministic |
| **Card imagery/symbolism reference** | Users need visual/symbolic context to interpret | Low-Med | Text descriptions of symbolism (who/what is depicted, key symbols). Images optional for MVP |
| **Contextual interpretation** | Raw meanings aren't enough - must apply to user's question | Medium | This is where AI shines. Given user context + card, generate relevant interpretation |
| **Question/intention framing** | Readings need focus - "what am I reading about?" | Low | Capture user's question/context before draw. Can be explicit or inferred from conversation |

**MVP Coverage:** Esoterica PROJECT.md already covers all table stakes:
- Major Arcana deck with meanings ✓
- Random draw via `shuf` ✓
- Subagent interpretation (contextual) ✓
- Question implicit in agent's current work context ✓

## Differentiators

Features that make a tarot tool SPECIAL. Not expected, but valued when present.

### For AI Agent Context (High Value)

| Feature | Value Proposition | Complexity | Priority |
|---------|-------------------|------------|----------|
| **Multiple reader voices** | Different perspectives for different needs (poetic vs practical) | Low | HIGH - Already in scope (Mystic/Grounded) |
| **Quick vs deep modes** | Respect user's time/depth needs | Low | HIGH - Already in scope |
| **Session continuity** | Remember previous draws in conversation context | Medium | HIGH - Natural for conversational AI |
| **Problem-type awareness** | Tailor interpretation to problem domain (architecture vs debugging vs planning) | Medium | MEDIUM - Could enhance contextual interpretation |
| **Card-to-code-concept mapping** | "The Tower = refactoring/destruction, The Hermit = code review/introspection" | Low-Med | MEDIUM - Makes it more useful for coding context |
| **Reflection prompts** | After card reveal, ask questions to deepen agent's thinking | Low | MEDIUM - Enhances perspective-shifting value |
| **Multi-card spreads** | More complex readings (past-present-future, problem-approach-outcome) | Medium | LOW for MVP - Single card sufficient initially |

### From Traditional Tarot Apps (Lower Value Here)

| Feature | Value Proposition | Complexity | Priority for Esoterica |
|---------|-------------------|------------|----------------------|
| **Spread library** | Pre-defined layouts (Celtic Cross, Three-Card, etc.) | Medium | LOW - Single card draw more appropriate for quick agent insights |
| **Reading journal/history** | Track readings over time, spot patterns | Medium | LOW - Agent conversation history serves this purpose |
| **Reversed card meanings** | Expanded interpretive range (upright vs reversed) | Low | OUT OF SCOPE - PROJECT.md explicitly defers this |
| **Learning mode** | Teach tarot meanings/symbolism | Low-Med | LOW - Agent doesn't need to "learn" tarot, just use it |
| **Daily card** | Automated daily draw for reflection | Low | LOW - Agent-initiated draws more appropriate |
| **Card of the day notifications** | Push engagement | Low | LOW - Not applicable to agent tool |
| **Deck selection** | Multiple deck styles (Rider-Waite, Thoth, modern) | Medium | OUT OF SCOPE - Single deck for MVP |
| **Community features** | Share readings, discuss interpretations | High | NOT APPLICABLE - Agent tool, not social app |

## Anti-Features

Features to explicitly NOT build. Common in tarot apps but wrong for AI agent context.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Visual deck imagery** | Agents don't "see" cards; descriptions sufficient. Images add complexity without value | Provide rich text descriptions of symbolism and imagery |
| **Gamification** | Streaks, achievements, unlockables feel gimmicky for serious tool | Let value come from insights generated, not external rewards |
| **Astrology integration** | Scope creep. PROJECT.md explicitly defers other esoteric tools | Keep focused on tarot; build framework for future expansion without implementing it |
| **Marketplace/paid readings** | Wrong business model - this is a tool, not a service | Free, open framework |
| **Social/sharing features** | Agent readings are about internal process, not external sharing | Keep readings private to agent/user conversation |
| **Meditation timers/music** | Wrong medium - agents don't meditate with ambient sound | Focus on textual interpretation and reasoning |
| **Fortune-telling framing** | Predictive/fate language inappropriate for problem-solving tool | Frame as perspective-shifting, archetypal thinking, not prediction |
| **Minor Arcana (for MVP)** | 56 additional cards add complexity without proportional value | Start with 22 Major Arcana, most archetypal/recognizable |
| **Custom reader personas** | Too many voices dilute clarity | Two voices (Mystic/Grounded) cover the spectrum |
| **Card reversals (for MVP)** | Doubles interpretation complexity | Upright only initially |

## Feature Dependencies

Core dependencies for useful tarot experience:

```
Card Database
    ↓
Random Draw Mechanism
    ↓
Question/Context Capture
    ↓
Interpretation Engine (AI)
    ↓
Reader Voice (style/tone)
    ↓
Output Format (quick vs deep)
```

**Optional enhancements** (no hard dependencies):
- Reflection prompts (enhances interpretation)
- Problem-type awareness (enhances interpretation)
- Session continuity (enhances multi-turn value)
- Multi-card spreads (alternative to single draw)

## MVP Feature Set

Based on table stakes + high-value differentiators for AI agent context:

### Must Have (Table Stakes)
1. ✅ Major Arcana card database (22 cards)
2. ✅ Card meanings with symbolism descriptions
3. ✅ Random card draw mechanism
4. ✅ Contextual interpretation (AI-powered)
5. ✅ Question/intention implicit from conversation

### Should Have (High-Value Differentiators)
1. ✅ Multiple reader voices (Mystic, Grounded)
2. ✅ Quick vs deep reading modes
3. ✅ Global voice preference config
4. ⚠️ Session continuity (depends on conversation context handling)

### Could Have (Enhancement Opportunities)
1. Problem-type awareness in interpretations
2. Reflection prompts after card reveal
3. Card-to-code-concept mapping examples
4. Multi-card spreads (post-MVP)

### Won't Have (Anti-Features or Deferred)
1. ❌ Minor Arcana (deferred)
2. ❌ Reversed meanings (deferred)
3. ❌ Custom reader personas (deferred)
4. ❌ Visual imagery (not valuable for agents)
5. ❌ Other esoteric tools (deferred)

## Feature Complexity Analysis

| Feature Category | Estimated Effort | Risk |
|-----------------|------------------|------|
| Card database + meanings | LOW (content creation) | Low - straightforward data structure |
| Random draw | LOW (bash `shuf` or simple random) | Low - well-understood mechanism |
| Reader voice system | LOW (prompt engineering) | Medium - voice distinctiveness may need iteration |
| Quick vs deep modes | LOW (conditional prompt depth) | Low - simple branching |
| Contextual interpretation | MEDIUM (prompt design + testing) | Medium - quality depends on prompt engineering |
| Problem-type awareness | MEDIUM (context classification) | Medium - requires pattern matching user's work |
| Multi-card spreads | MEDIUM (layout logic + multi-card interpretation) | Medium - interpretation complexity increases |
| Session continuity | LOW-MEDIUM (conversation state) | Low - likely handled by agent framework |

## Competitive Analysis (Training Knowledge)

**Note:** This analysis is based on my training knowledge of tarot apps (knowledge cutoff January 2025). Unable to verify current state due to web research tool limitations. Mark as **LOW confidence** for current market state.

### Traditional Tarot Apps
Popular apps (as of training data) typically include:
- **Labyrinthos** - Comprehensive deck, learning mode, spread library
- **Golden Thread Tarot** - Visual focus, journal, spread variety
- **Galaxy Tarot** - Traditional decks, spread library, reversed meanings

**Common pattern:** Focus on learning tarot, daily practice, journaling, multiple decks. Heavy visual emphasis.

**Esoterica differentiation:** Purpose-built for AI agents, not human learning. Contextual interpretation over rote meanings. Problem-solving over divination.

### AI Tarot Experiments
Emerging category (as of training data):
- ChatGPT with tarot plugins
- GPT-based tarot reading chatbots
- AI interpretation overlays on traditional apps

**Common pattern:** AI used for interpretation/explanation, but still user-facing divination apps. Generic interpretations, not domain-specific (coding/planning).

**Esoterica differentiation:** Agent-to-agent tool (agents using tarot for their own reasoning), not user-facing app. Coding/design problem context baked in.

## Recommendations for Roadmap

### Phase 1: Core Table Stakes
Focus on minimal viable reading experience:
- Major Arcana database with rich symbolism descriptions
- Random draw mechanism
- Single reader voice for testing
- Basic contextual interpretation

**Rationale:** Validate core value proposition before expanding features.

### Phase 2: Voice & Mode Differentiation
Add the differentiating features:
- Second reader voice (Mystic + Grounded)
- Quick vs deep modes
- Global voice preference config

**Rationale:** These are low-complexity, high-value features that make the tool flexible for different use cases.

### Phase 3: Enhanced Intelligence
Deepen the AI interpretation:
- Problem-type awareness
- Reflection prompts
- Card-to-code-concept mapping

**Rationale:** Builds on working foundation to make interpretations more useful for coding context.

### Phase 4+: Expansion (Post-MVP)
Consider after validating core:
- Multi-card spreads
- Minor Arcana
- Reversed meanings
- Additional reader voices

**Rationale:** Complexity that should wait for user feedback on core value.

## Research Gaps & Validation Needs

### HIGH Confidence
- Table stakes features (based on fundamental tarot mechanics)
- AI agent context requirements (based on stated use case)
- Anti-features (clear mismatches for agent tool)

### MEDIUM Confidence
- Feature complexity estimates (subject to implementation details)
- Reader voice distinctiveness (requires testing)
- Problem-type awareness value (hypothesis to validate)

### LOW Confidence
- Current competitive landscape (training data 18+ months old)
- Emerging AI tarot patterns (fast-moving space)
- User expectations for AI-powered readings (new category)

### Recommended Validation
1. **Build MVP with minimal features** - Test if single-card + contextual interpretation delivers value
2. **Test reader voices early** - Validate that Mystic vs Grounded creates meaningful choice
3. **Gather agent feedback** - Does tarot actually help with problem-solving/planning?
4. **Iterate on interpretation quality** - Prompt engineering likely needs refinement

## Sources

**Note:** Unable to access web research tools for current verification. This analysis draws from:

- Training knowledge of tarot application features (knowledge cutoff: January 2025)
- Training knowledge of tarot reading practices and mechanics
- Esoterica PROJECT.md requirements and scope
- AI agent use case analysis based on stated goals

**Confidence level:** MEDIUM overall
- HIGH for tarot fundamentals (table stakes)
- MEDIUM for AI agent adaptations (logical inference from use case)
- LOW for current competitive landscape (unverified, potentially outdated)

**Recommendation:** Treat competitive analysis as hypothesis. Focus on validating core value proposition (does tarot help agents solve problems?) rather than feature parity with consumer apps.
