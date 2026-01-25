# External Integrations

**Analysis Date:** 2026-01-21

## Overview

This repository is a minimal configuration repository for the GSD orchestration system. It contains no application code with external integrations. The only integration point is plugin marketplace configuration.

## APIs & External Services

**Not detected** - No API integrations, SDKs, or external service clients found in the codebase.

## Data Storage

**Databases:**
- Not applicable - no data persistence layer

**File Storage:**
- Not applicable - no file storage integrations

**Caching:**
- Not applicable - no caching layer

## Authentication & Identity

**Auth Provider:**
- Not detected

**Implementation:**
- Not applicable - configuration-only repository

## Monitoring & Observability

**Error Tracking:**
- Not applicable

**Logs:**
- Not applicable

## CI/CD & Deployment

**Hosting:**
- Not detected in repository

**CI Pipeline:**
- Not detected in repository

**External Dependencies:**
- Deployment plugin sourced from GitHub: `company/deploy-plugin`
  - Referenced in: `/.claude-plugin/marketplace.json`

## Environment Configuration

**Required env vars:**
- Not detected - no environment-dependent configuration

**Secrets location:**
- Not applicable

## Webhooks & Callbacks

**Incoming:**
- Not detected

**Outgoing:**
- Not detected

## Plugin Marketplace Integration

**Configuration File:**
- Location: `/.claude-plugin/marketplace.json`
- Purpose: Defines plugins available to Claude Plugin System

**Plugin Sources:**
- Local: `./plugins/formatter` (code-formatter plugin v2.1.0)
- Remote: GitHub repository at `company/deploy-plugin` (deployment-tools plugin)

**Plugin Metadata:**
- Owner contact: `591643+jem-computer@users.noreply.github.com`

---

*Integration audit: 2026-01-21*
