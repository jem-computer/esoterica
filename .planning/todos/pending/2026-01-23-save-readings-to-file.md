---
created: 2026-01-23T15:52
title: Let users save readings to file
area: feature
files:
  - skills/tarot/SKILL.md
---

## Problem

After a reading completes, the interpretation lives only in the conversation context. Users may want to preserve meaningful readings for future reference, reflection, or journaling. Currently no persistence mechanism exists.

## Solution

TBD - Ideas:
- Add "Save this reading?" prompt after interpretation completes
- Write to `readings/YYYY-MM-DD-spread-type.md` or similar
- Include: cards drawn, positions, full interpretation, user's original question
- Could be project-local (`./readings/`) or global (`~/.claude/tarot/readings/`)
