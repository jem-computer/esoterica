# Architecture

**Analysis Date:** 2026-01-21

## Pattern Overview

**Overall:** Plugin Manifest Registry

**Key Characteristics:**
- Minimal, configuration-driven architecture
- Static plugin metadata declaration
- No runtime application logic
- Serves as plugin marketplace configuration

## Layers

**Configuration Layer:**
- Purpose: Store and define plugin metadata for marketplace registration
- Location: `/.claude-plugin/marketplace.json`
- Contains: Plugin definitions, ownership information, plugin sources
- Depends on: None (static data)
- Used by: Plugin marketplaces, installation tools

**Planning Layer:**
- Purpose: Hold project planning and architecture documentation
- Location: `/.planning/codebase/`
- Contains: Architecture analysis documents, conventions, structure guides
- Depends on: None (documentation)
- Used by: Development team reference

## Data Flow

**Plugin Discovery:**

1. Plugin manifest reader loads `marketplace.json`
2. Parser extracts plugin definitions array
3. Each plugin entry exposes: name, source (local or remote), description, version, author
4. Marketplace system uses metadata for plugin discovery and installation

**Remote Plugin Loading:**

1. Plugin references external source via GitHub repository
2. Installation system resolves repo: `company/deploy-plugin`
3. Plugin source fetched from remote during deployment

## Key Abstractions

**Plugin Definition:**
- Purpose: Represents a plugin and its metadata
- Examples: `code-formatter` (local), `deployment-tools` (remote)
- Pattern: JSON object with name, source, description, version, author

**Ownership:**
- Purpose: Tracks plugin ownership and responsibility
- Pattern: Owner object with name and email properties

## Entry Points

**Marketplace Configuration:**
- Location: `/.claude-plugin/marketplace.json`
- Triggers: Plugin marketplace loading, installation requests
- Responsibilities: Declares all available plugins, links to sources, provides metadata

## Error Handling

**Strategy:** Configuration validation

**Patterns:**
- Missing required fields in plugin definitions
- Invalid source references (broken GitHub repos)
- Malformed JSON structures

## Cross-Cutting Concerns

**Logging:** Not applicable (static configuration)

**Validation:** Plugin manifest structure validation on load

**Authentication:** Required for GitHub source plugins (credentials needed for `company/deploy-plugin` access)

---

*Architecture analysis: 2026-01-21*
