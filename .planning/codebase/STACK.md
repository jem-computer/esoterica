# Technology Stack

**Analysis Date:** 2026-01-21

## Overview

This repository is a minimal configuration repository for the GSD (Get Stuff Done) orchestration system. It does not contain an application codebase but rather serves as a reference implementation for plugin configuration and metadata.

## Languages

**Primary:**
- JSON - Configuration and plugin metadata

**Not Applicable:**
- No runtime application code present
- No programming language dependencies

## Runtime

**Environment:**
- Node.js (implied for related ecosystem, but not used in this repository)

**Package Manager:**
- Not applicable - no package.json or dependency manifest

## Frameworks

**Core:**
- Not applicable - configuration-only repository

**Infrastructure:**
- Claude Plugin System - Plugin marketplace definition (`/Users/jem/code/111ecosystem/esoterica/.claude-plugin/marketplace.json`)

## Key Dependencies

**Not detected** - No package manifests (package.json, requirements.txt, Cargo.toml, pyproject.toml, or go.mod) found in repository.

## Configuration

**Environment:**
- Minimal configuration
- Plugin metadata stored in JSON format at `.claude-plugin/marketplace.json`

**Build:**
- Not applicable - no build process

## Platform Requirements

**Development:**
- Any text editor or JSON validator

**Production:**
- Claude Plugin Marketplace integration (defined in `/.claude-plugin/marketplace.json`)
- External plugin source: GitHub repository (`company/deploy-plugin`)

## Plugins Defined

The repository defines two plugins in `.claude-plugin/marketplace.json`:

1. **code-formatter** (v2.1.0)
   - Location: `./plugins/formatter`
   - Purpose: Automatic code formatting on save

2. **deployment-tools**
   - Source: GitHub (`company/deploy-plugin`)
   - Purpose: Deployment automation tools

---

*Stack analysis: 2026-01-21*
