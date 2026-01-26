# Requirements: Esoterica

**Defined:** 2026-01-25
**Core Value:** Agents can draw and interpret tarot cards as a perspective-shifting tool

## v1.3 Requirements

Requirements for Minor Arcana milestone. Each maps to roadmap phases.

### Card Content

- [ ] **CARD-01**: Wands suit — 14 cards (Ace-10 + Page, Knight, Queen, King) with full depth
- [ ] **CARD-02**: Cups suit — 14 cards (Ace-10 + Page, Knight, Queen, King) with full depth
- [ ] **CARD-03**: Swords suit — 14 cards (Ace-10 + Page, Knight, Queen, King) with full depth
- [ ] **CARD-04**: Pentacles suit — 14 cards (Ace-10 + Page, Knight, Queen, King) with full depth
- [ ] **CARD-05**: Each card has themes, situations, shadows, and symbols (matching Major Arcana depth)
- [ ] **CARD-06**: Court cards have archetypal personality interpretations (Page=student, Knight=action, Queen=mastery, King=authority)

### Wizard Enhancement

- [ ] **WIZD-01**: Deck selection step in wizard ("Major Arcana only" vs "Full 78-card deck")
- [ ] **WIZD-02**: Deck choice affects card pool for random draw
- [ ] **WIZD-03**: Physical mode supports all 78 cards with fuzzy matching

### Architecture

- [ ] **ARCH-01**: Card data separated from SKILL.md into suit-based files
- [ ] **ARCH-02**: SKILL.md contains wizard flow, interpretation logic, and card index only
- [ ] **ARCH-03**: Card index includes name, suit, and keywords for all 78 cards
- [ ] **ARCH-04**: Read tool fetches only drawn cards' full meanings after selection
- [ ] **ARCH-05**: Five card data files: major-arcana.md, wands.md, cups.md, swords.md, pentacles.md

## Future Requirements

Deferred to later milestones.

### Reading Persistence

- **SAVE-01**: User can save reading to file
- **SAVE-02**: Reading file includes cards drawn, positions, and interpretation

### Reversals

- **REV-01**: Cards can appear reversed (upside-down)
- **REV-02**: Reversed meanings differ from upright meanings

## Out of Scope

Explicitly excluded for v1.3.

| Feature | Reason |
|---------|--------|
| Reversed card meanings | Adds complexity without core value; upright-only for now |
| Save readings to file | Deferred to v1.4 |
| Runes, astrology, numerology | Future esoteric tools, not this milestone |
| Custom reader personas | Two voices (Mystic/Grounded) sufficient |
| Voice selection in wizard | Config-based voice preference works well |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| ARCH-01 | Phase 16 | Pending |
| ARCH-02 | Phase 16 | Pending |
| ARCH-03 | Phase 16 | Pending |
| ARCH-04 | Phase 16 | Pending |
| ARCH-05 | Phase 16 | Pending |
| CARD-01 | Phase 17 | Pending |
| CARD-02 | Phase 17 | Pending |
| CARD-03 | Phase 17 | Pending |
| CARD-04 | Phase 17 | Pending |
| CARD-05 | Phase 17 | Pending |
| CARD-06 | Phase 17 | Pending |
| WIZD-01 | Phase 18 | Pending |
| WIZD-02 | Phase 18 | Pending |
| WIZD-03 | Phase 18 | Pending |

**Coverage:**
- v1.3 requirements: 14 total
- Mapped to phases: 14
- Unmapped: 0

---
*Requirements defined: 2026-01-25*
*Last updated: 2026-01-25 after v1.3 roadmap creation*
