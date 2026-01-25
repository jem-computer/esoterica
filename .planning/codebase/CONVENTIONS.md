# Coding Conventions

**Analysis Date:** 2026-01-21

## Naming Patterns

**Files:**
- Kebab-case for source files: `add.ts`, `server.ts`
- Kebab-case for test files: `add.test.ts`
- PascalCase for classes (none currently in codebase, but convention would apply via TypeScript)

**Functions:**
- Camel case for exported functions: `add`, `load`, `execute`
- Arrow functions preferred for simple/exported functions: `export const add = (a: number, b: number) => a + b;`

**Variables:**
- Camel case for all variables: `server`, `args`, `userId`, `message`
- Constants in camel case (no SCREAMING_SNAKE_CASE convention observed)

**Types:**
- PascalCase for Zod schemas and type definitions: `z.object()`, `z.string()`, `z.number()`
- Import types explicitly with `.js` extension due to ES modules: `from "./add.js"`

## Code Style

**Formatting:**
- Tool: Prettier 3.5.3
- No explicit .prettierrc file; uses default Prettier settings
- Indentation: 2 spaces (inferred from source files and formatted output)
- Semicolons: Present at end of statements
- Quote style: Double quotes for strings

**Linting:**
- Tool: ESLint 9.26.0 with TypeScript support
- Config: `eslint.config.ts` (flat config format)
- Key rules applied:
  - `@eslint/js` recommended rules
  - `typescript-eslint` recommended rules
  - `eslint-plugin-perfectionist` recommended-alphabetical (enforces alphabetical ordering of imports/exports)
  - `eslint-config-prettier` to disable conflicting Prettier rules
- JS files ignored in ESLint (line 12 of `eslint.config.ts`)

## Import Organization

**Order:**
1. External dependencies (e.g., `import { FastMCP } from "fastmcp"`)
2. Local modules (e.g., `import { add } from "./add.js"`)
3. Blank line between groups

**Examples from codebase:**
```typescript
// add.test.ts
import { expect, it } from "vitest";

import { add } from "./add.js";
```

```typescript
// server.ts
import { FastMCP } from "fastmcp";
import { z } from "zod";

import { add } from "./add.js";
```

**Path Aliases:**
- No path aliases configured; relative imports with explicit `.js` extension
- Uses ES modules (type: "module" in package.json)

## Error Handling

**Patterns:**
- Not extensively demonstrated in current codebase
- Async functions use `async/await` pattern (e.g., `async load()`, `async execute()`)
- No explicit try/catch blocks visible in source files
- Input validation via Zod schemas for API parameters: `z.object({...}).describe()`

## Logging

**Framework:** Not detected

**Patterns:**
- No logging framework configured
- Codebase relies on console output or framework-provided logging (FastMCP/Zod)

## Comments

**When to Comment:**
- Commented code sections preserved as examples: `// server.addTool({...})`
- Inline comments used sparingly: `// This tool doesn't interact with external systems`
- TSDoc/JSDoc not observed in current codebase

**JSDoc/TSDoc:**
- Not actively used
- Zod schemas include `.describe()` for parameter documentation instead

## Function Design

**Size:**
- Functions are small and focused
- Single-line arrow functions when appropriate: `export const add = (a: number, b: number) => a + b;`

**Parameters:**
- Explicit type annotations required: `(a: number, b: number)`
- Use Zod for complex parameter validation in tools/resources

**Return Values:**
- Explicit return types via Zod schemas for validated returns
- String conversion for tool results: `return String(add(args.a, args.b));`

## Module Design

**Exports:**
- Named exports preferred: `export const add = ...`
- One primary export per file (e.g., `add.ts` exports only `add`)

**Barrel Files:**
- Not currently used
- Single exports per file pattern followed

---

*Convention analysis: 2026-01-21*
