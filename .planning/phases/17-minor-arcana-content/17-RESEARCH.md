# Phase 17: Minor Arcana Content - Research

**Researched:** 2026-01-26
**Domain:** Tarot card meaning creation (content writing for 56 Minor Arcana cards)
**Confidence:** HIGH

## Summary

Phase 17 involves creating full interpretive content for 56 Minor Arcana cards (14 cards across 4 suits: Wands, Cups, Swords, Pentacles), matching the depth and structure established for the 22 Major Arcana cards in earlier phases. This is primarily a content creation task rather than a technical implementation, with clear structural requirements from Phase 16 and explicit direction from the discuss-phase context.

The standard approach is to maintain consistent four-field structure (Themes, Situations, Shadows, Symbols) across all 56 cards while ensuring each suit expresses its elemental nature through numbered progression (Ace-10 as journey narrative) and court archetypes (Page, Knight, Queen, King). The challenge lies in providing concrete, specific situations for each card rather than abstract keywords, and avoiding the common pitfall of treating pip cards as "lesser" or simpler than Major Arcana.

**Primary recommendation:** Write all 56 cards using identical structure to existing Major Arcana, with 3-4 concrete situations per card, journey-aware progression within each suit's Ace-10 sequence, and court cards embedded in standard format without separate personality sections.

## Standard Stack

This is a content creation phase, not a technical implementation phase. No new libraries or tools are required.

### Core
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| Markdown | N/A | Card data format | Established in Phase 16 architecture |
| Existing card files | Current | Wands/Cups/Swords/Pentacles placeholder files | Created in Phase 16, ready for content |

### Content Structure (from Major Arcana)
```markdown
## Card [number/name]: [Card Name]

**Themes:** [comma-separated core meanings]
**Situations:** [3-5 concrete, specific scenarios]
**Shadows:** [negative expressions and distortions]
**Symbols:** [traditional imagery with parenthetical meaning notes]
```

### Supporting
| Resource | Purpose | When to Use |
|----------|---------|-------------|
| Existing Major Arcana | Voice/tone reference | Consistency check for all 56 cards |
| Phase 16 PLAN.md | File structure requirements | Verify card format matches architecture |
| Discuss-phase CONTEXT | User decisions and constraints | Reference locked decisions throughout writing |

## Architecture Patterns

### Project Structure (Already Exists)
```
skills/tarot/cards/
├── major-arcana.md          # Reference for voice/style
├── wands.md                 # Phase 17: Populate with 14 cards
├── cups.md                  # Phase 17: Populate with 14 cards
├── swords.md                # Phase 17: Populate with 14 cards
└── pentacles.md             # Phase 17: Populate with 14 cards
```

### Pattern 1: Suit as Journey Narrative
**What:** Each suit's Ace through 10 tells a progression story filtered through its element.
**When to use:** Every pip card (Ace-10) should express its number's universal meaning through the suit's elemental lens.

**Structure:**
- **Ace:** Seed/pure potential of the suit's domain
- **2-3:** Initial development and early choices
- **4:** Stability and foundation
- **5:** Struggle and conflict
- **6:** Harmony and recovery
- **7:** Trials and testing
- **8:** Mastery and movement
- **9:** Near-completion and culmination
- **10:** Completion and transition to next cycle

**Example approach:**
```
Five of Wands (Fire element, struggle stage):
- Universal Five: Conflict, instability, temporary difficulty
- Through Fire lens: Competition, creative tension, clashing visions
- Concrete situations: "Five team members pitching different directions"
```

**Sources:**
- [The Minor Arcana: Meanings Behind the Number Cards | Tarot.com](https://www.tarot.com/tarot/meaning-of-numbers-in-minor-arcana)
- [Tarot Numerology: Minor Sequences — Hermit's Mirror](https://www.hermitsmirror.com/musings/tarot-numerology-minor-sequences)
- [Labyrinthos - Minor Arcana Pip Cards](https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/the-minor-arcana-of-the-tarot-de-marseille-numerology-of-pip-cards)

### Pattern 2: Elemental Expression Through Domains
**What:** Each suit expresses its element through a specific life domain.
**When to use:** All situations and themes should be grounded in the suit's domain.

**Elemental Domains:**
- **Wands (Fire):** Will, action, creativity, passion, ambition, enterprise, inspiration
- **Cups (Water):** Emotion, relationships, intuition, healing, connection, feeling
- **Swords (Air):** Intellect, conflict, truth, mental clarity, communication, analysis
- **Pentacles (Earth):** Material world, work, body, finances, practical concerns, tangible results

**Example:**
```
Three of Cups (Water element):
Themes should reference: emotional connection, celebration, friendship
Situations should be about: gatherings, emotional bonding, shared joy
NOT about: financial success, intellectual breakthroughs, willpower
```

**Sources:**
- [It's All in the Elements: How Water, Fire, Earth and Air Shape the Tarot](https://biddytarot.com/blog/elements/)
- [The Four Suits of the Tarot: Cups, Swords, Pentacles & Wands](https://www.aisforagrimony.com/the-living-grimoire/the-four-suits-of-the-tarot-cups-swords-pentacles-amp-wands)
- [Tarot Elements & the Four Suits Explained | Complete Guide – Tarot MasterGuide](https://www.tarotmasterguide.com/pages/tarot-elements-the-the-four-suits-explained)

### Pattern 3: Court Cards as Archetypal Stages
**What:** Court cards represent developmental stages or personality archetypes within their suit's domain.
**When to use:** Page/Knight/Queen/King follow archetypal progression while maintaining standard card structure.

**Court Progression:**
- **Page:** Youth, learning, messengers, new beginnings, curiosity, potential
- **Knight:** Action, pursuit, immature adult, movement, questing energy
- **Queen:** Maturity, mastery, nurturing, embodiment, internalized qualities
- **King:** Authority, mastery, leadership, externalized expression, discipline

**Critical decision from discuss-phase:** Court cards use ONLY the standard structure (Themes/Situations/Shadows/Symbols), NOT separate "As a person" sections. Personality interpretation is embedded within Themes rather than called out separately.

**Example:**
```
Queen of Wands (Fire element, mature feminine stage):
Themes: Confident leadership, charismatic presence, creative mastery, warm authority
[NOT a separate "As a person: Confident, charismatic, creative leader" section]
```

**Sources:**
- [Understanding Court Cards: Tarot Meanings and Guidance | Keen](https://www.keen.com/articles/tarot/court-cards-tarot-meanings)
- [The Court Cards Demystified: Understanding Pages, Knights, Queens, and Kings](https://learn.tarotreadings.com/the-court-cards-demystified-understanding-pages-knights-queens-and-kings/)
- [Court Cards as Personality Types: Complete Guide](https://www.tarot-guru.com/blog/court-cards-personality-types-guide)

### Pattern 4: Concrete Over Abstract (User Requirement)
**What:** Situations field must contain specific, recognizable scenarios, not vague keywords.
**When to use:** Every card, every time. This is a locked decision from discuss-phase.

**Requirement:** 3-4 concrete situations per card.

**Examples:**
- ✓ GOOD: "Starting a business, pitching a new idea to your team, launching a creative project"
- ✗ BAD: "New beginnings, fresh starts, initiation"

- ✓ GOOD: "Choosing between two job offers with different values, deciding whether to stay or leave a relationship"
- ✗ BAD: "Making choices, important decisions"

**Source:** User requirement from Phase 17 context (discuss-phase decisions)

### Anti-Patterns to Avoid

**Anti-pattern 1: Pip Card Shallowness**
- **What:** Treating numbered cards as simpler or less important than Major Arcana or court cards
- **Why it's bad:** User explicitly requires "full depth across all 56" and "no shortcuts for lesser cards"
- **What to do instead:** Give every pip card the same structural depth as Major Arcana (full Themes, Situations, Shadows, Symbols)

**Anti-pattern 2: Court Card Special Sections**
- **What:** Adding "As a person:" or separate personality description sections for court cards
- **Why it's bad:** User decision locked this out in discuss-phase; breaks structural consistency
- **What to do instead:** Embed personality/archetype interpretation directly in Themes field

**Anti-pattern 3: Keyword Situations**
- **What:** Using abstract keywords in Situations field instead of concrete scenarios
- **Why it's bad:** User explicitly requires concrete situations like "Starting a business" not "New beginnings"
- **What to do instead:** Always provide 3-4 specific, recognizable life situations per card

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Tarot meaning systems | Custom interpretations from scratch | Established numerological and elemental frameworks | Traditional tarot has 500+ years of symbolic consensus; deviation confuses users familiar with standard systems |
| Symbol sets per card | Invented symbolic systems | Traditional Rider-Waite-Smith imagery | RWS is the most recognized tarot system; users expect familiar symbols |
| Court card personalities | New archetypal frameworks | Standard Page/Knight/Queen/King developmental stages | Established court system is widely understood and taught |

**Key insight:** While exact wording is discretionary, the underlying symbolic systems (numbers, elements, court stages) should follow traditional tarot frameworks to maintain recognizability and coherence.

## Common Pitfalls

### Pitfall 1: Voice Drift Across 56 Cards
**What goes wrong:** Writing 56 cards consecutively risks voice/tone/style becoming inconsistent or diverging from Major Arcana reference.
**Why it happens:** Content creation fatigue, writing in different sessions, losing reference to original tone.
**How to avoid:**
- Keep `/Users/jem/code/111ecosystem/esoterica/skills/tarot/cards/major-arcana.md` open as reference
- Write in consistent blocks (complete one suit before next)
- Regularly compare new cards to Major Arcana for tone matching
**Warning signs:** New cards feel more verbose, more abstract, different emotional tone than Major Arcana

### Pitfall 2: Elemental Bleed Between Suits
**What goes wrong:** Wands situations starting to sound like Cups, Swords themes overlapping with Pentacles, loss of elemental distinction.
**Why it happens:** Universal card meanings (like "Two as partnership") can be expressed in any domain, easy to default to generic phrasing.
**How to avoid:**
- Start each card by stating "This is [Fire/Water/Air/Earth] expressing [number meaning]"
- Verify all situations are domain-appropriate (Wands=action, Cups=emotion, Swords=intellect, Pentacles=material)
- Cross-check: Could this situation appear in another suit? If yes, add elemental specificity.
**Warning signs:** Situations feel interchangeable between suits, lack of clear elemental flavor

### Pitfall 3: Number/Court Meaning Ignorance
**What goes wrong:** Cards don't express their number's universal energy or court stage's developmental position, breaking progression narrative.
**Why it happens:** Focusing on suit/element only, forgetting numbers and court ranks carry inherent meanings.
**How to avoid:**
- Reference number progression table before writing each pip card
- Reference court stage framework before writing each court card
- Verify: Does Five of [Suit] express struggle/conflict? Does Knight of [Suit] express action/pursuit?
**Warning signs:** Ace feels similar to Ten, Page reads like King, no sense of journey within suit

### Pitfall 4: Symbol Section Vagueness
**What goes wrong:** Symbols field becomes abstract concepts rather than concrete visual imagery with interpretive notes.
**Why it happens:** Minor Arcana imagery varies by deck, tempting toward thematic symbols rather than visual ones.
**How to avoid:**
- Follow Major Arcana pattern: "Object (what it means), Object (what it means)"
- Use Rider-Waite-Smith imagery as default reference (most recognized)
- Structure: "[Visual thing] ([its symbolic meaning])"
**Warning signs:** Symbols field reads like second Themes field, no parenthetical interpretations, nothing visually concrete

### Pitfall 5: Forced Positivity or Negativity
**What goes wrong:** Certain numbers (Five, Ten) or cards (Five of Swords, Ten of Swords) being written as entirely negative; Aces or Tens as entirely positive.
**Why it happens:** Traditional associations can be stark; easy to forget every card has constructive and destructive expressions.
**How to avoid:**
- Every card must have both constructive Themes AND destructive Shadows
- Even "difficult" cards have gifts (Five = necessary conflict can clarify)
- Even "positive" cards have shadows (Ace = overwhelming potential can paralyze)
**Warning signs:** Missing or thin Shadows field, overly optimistic or pessimistic overall tone

## Code Examples

### Example 1: Complete Pip Card (Ace of Wands)
```markdown
## Ace of Wands

**Themes:** Creative spark, new initiative, raw potential for action, inspired beginning, burst of will
**Situations:** Getting the idea that becomes your next project, feeling sudden creative fire, the moment before you start something ambitious, being offered an opportunity that excites you, passion igniting for a new direction
**Shadows:** All talk no action, burning hot then fizzling out, reckless enthusiasm without planning, inspiration without discipline, too many sparks and no follow-through
**Symbols:** Hand emerging from cloud (divine gift), wand with sprouting leaves (fertile potential), castle on hill (what could be built), mountains in distance (journey ahead), living branch (creative life force)
```

**Analysis:**
- Themes express Fire (creative, action, will) through number One (potential, beginning)
- Situations are concrete: "Getting the idea that becomes your next project" not "New beginnings"
- Shadows show destructive expression of same energy
- Symbols follow Major Arcana pattern: visual object with parenthetical meaning

### Example 2: Complete Court Card (Queen of Cups)
```markdown
## Queen of Cups

**Themes:** Emotional maturity, compassionate presence, intuitive wisdom, nurturing depths, empathic mastery
**Situations:** Being the person others come to with their feelings, trusting your intuition about someone's unspoken needs, offering comfort without fixing, creating emotionally safe space, counseling from deep understanding
**Shadows:** Emotional overwhelm from absorbing others' feelings, boundary dissolution, martyrdom through care, manipulating through emotional sensitivity, drowning in empathy
**Symbols:** Ornate cup (emotional treasure), throne by water (mastery of feeling), scalloped edges on cup (complexity of emotion), calm sea (peaceful emotional state), veiled figure (intuitive mystery)
```

**Analysis:**
- Standard structure (no "As a person" section)
- Themes embed personality: "compassionate presence" shows the Queen-as-archetype
- Situations show Water (emotion) through Queen stage (maturity, mastery)
- Clear element (Water) and court stage (Queen) expression without separate sections

### Example 3: Structural Wrapper for Suit File
```markdown
# Wands

Full card meanings for interpretation. Load this file after drawing Wands cards.

**Element:** Fire
**Domain:** Will/Action

## Ace of Wands

[Full card content]

---

## Two of Wands

[Full card content]

---

## Three of Wands

[Full card content]

[... continue through King of Wands]
```

**Analysis:**
- Maintains structure from Phase 16 (Element, Domain header)
- Horizontal rules between cards (from Major Arcana pattern)
- Loading instruction for Claude at top
- No additional metadata beyond what exists in placeholder files

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pip cards as simple symbols | Fully illustrated scenic pip cards | 1909 (Rider-Waite-Smith) | Modern readers expect narrative imagery for all 56 Minor Arcana |
| Court cards separate from pip cards | Integrated into suit progression | N/A (always separate) | Court cards require distinct archetypal treatment while maintaining format consistency |
| Keywords only | Concrete situations + themes | User decision (Phase 17) | Higher specificity makes readings more actionable and grounded |

**Not applicable for this phase:** This is content creation, not technical implementation, so "state of the art" refers to tarot interpretation approaches rather than software libraries or frameworks.

## Content Creation Strategy

### Voice Consistency Reference
- **Primary:** `/Users/jem/code/111ecosystem/esoterica/skills/tarot/cards/major-arcana.md`
- **Check:** Compare every 7-10 cards written against Major Arcana sample for tone match
- **Elements:** Poetic but not florid, specific but not clinical, archetypal but grounded

### Writing Order Recommendation
1. **Aces first (all four suits):** Establishes elemental baseline for each suit
2. **Complete Wands:** Full journey Ace-King gives template for other suits
3. **Complete Cups:** Second suit validates approach can transfer between elements
4. **Complete Swords then Pentacles:** Momentum-based completion

### Quality Checkpoints
**After each suit:**
- [ ] Do all 14 cards have identical structure (Themes/Situations/Shadows/Symbols)?
- [ ] Are Situations concrete and specific (not keywords)?
- [ ] Is elemental domain clear throughout (Fire/Water/Air/Earth)?
- [ ] Does Ace-10 tell a journey progression?
- [ ] Do court cards show developmental stages without special sections?
- [ ] Compare 3 random cards to Major Arcana: voice consistent?

## Open Questions

**None.** The phase requirements are explicit, structure is established, and locked decisions from discuss-phase eliminate ambiguity. This is pure content creation following clear patterns.

The only "unknown" is Claude's specific wording choices, which are explicitly listed as "Claude's Discretion" in the discuss-phase context. As long as structural requirements and user decisions are followed, execution is straightforward.

## Sources

### Primary (HIGH confidence)
- User-provided context from discuss-phase (CONTEXT.md) - Implementation decisions and requirements
- Phase 16 PLAN.md - Card file structure and format requirements
- Existing Major Arcana file - Voice, tone, and structural reference
- [Tarot.com - The Minor Arcana: Meanings Behind the Number Cards](https://www.tarot.com/tarot/meaning-of-numbers-in-minor-arcana) - Number progression meanings
- [Labyrinthos - Minor Arcana Pip Cards](https://labyrinthos.co/blogs/tarot-card-meanings-list) - Suit structure and pip card format

### Secondary (MEDIUM confidence)
- [Biddy Tarot - It's All in the Elements](https://biddytarot.com/blog/elements/) - Elemental associations verified across multiple sources
- [The Court Cards Demystified](https://learn.tarotreadings.com/the-court-cards-demystified-understanding-pages-knights-queens-and-kings/) - Court card archetypes
- [Hermit's Mirror - Tarot Numerology: Minor Sequences](https://www.hermitsmirror.com/musings/tarot-numerology-minor-sequences) - Number progression framework
- [Keen - Understanding Court Cards](https://www.keen.com/articles/tarot/court-cards-tarot-meanings) - Court card personality/archetype treatment

### Tertiary (LOW confidence)
- None used. All findings verified against multiple sources and official tarot education resources.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Structure established in Phase 16, no ambiguity
- Architecture: HIGH - User decisions locked in discuss-phase, format defined
- Pitfalls: HIGH - Common content creation risks well-documented in tarot education literature

**Research date:** 2026-01-26
**Valid until:** 60+ days (tarot interpretation conventions are stable; no fast-moving technical dependencies)
