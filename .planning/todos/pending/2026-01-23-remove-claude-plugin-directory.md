---
created: 2026-01-23T17:55
title: Remove .claude-plugin directory
area: tooling
files:
  - .claude-plugin/marketplace.json
---

## Problem

The `.claude-plugin` directory exists but is not configured properly. It contains a marketplace.json file but the setup appears incomplete or incorrect. This should be cleaned up to avoid confusion.

## Solution

Delete the `.claude-plugin` directory entirely. Verify no other configuration depends on it first.
