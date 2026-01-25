# Testing Patterns

**Analysis Date:** 2026-01-21

## Test Framework

**Runner:**
- Vitest 3.1.3
- Config: No explicit vitest.config.ts; uses default configuration
- TypeScript support enabled via tsconfig.json integration

**Assertion Library:**
- Vitest built-in: `expect()` and `it()` functions

**Run Commands:**
```bash
npm run test              # Run all tests (vitest run)
npm run test -- --watch  # Watch mode (inferred, not in package.json)
npm run test -- --coverage  # Coverage (inferred, not in package.json)
```

## Test File Organization

**Location:**
- Co-located with source files in same directory
- Pattern: `[filename].test.ts` alongside `[filename].ts`

**Naming:**
- `.test.ts` suffix for test files: `add.test.ts`

**Structure:**
```
src/
├── add.ts
├── add.test.ts
└── server.ts
```

## Test Structure

**Suite Organization:**
```typescript
import { expect, it } from "vitest";

import { add } from "./add.js";

it("should add two numbers", () => {
  expect(add(1, 2)).toBe(3);
});
```

**Patterns:**
- Uses `it()` for individual test cases (not `describe()` blocks in current codebase)
- Single test per file demonstrated
- Import test utilities and code under test at top
- Test assertion immediately follows function call

## Mocking

**Framework:** Not detected in current tests

**Patterns:**
- Current test does not require mocking
- For FastMCP server (`server.ts`), mocking would be needed for external calls

**What to Mock:**
- FastMCP server methods and their async returns
- Zod validation results if testing error cases
- External API responses

**What NOT to Mock:**
- Pure utility functions like `add()` - test them directly
- Zod schema validation - test real validation behavior

## Fixtures and Factories

**Test Data:**
- Not currently used; simple literal values in tests: `add(1, 2)`
- For complex objects, create helper functions or use Zod factories

**Location:**
- Would be placed adjacent to test files or in shared `__fixtures__` directory if needed

## Coverage

**Requirements:** Not enforced

**View Coverage:**
```bash
npm run test -- --coverage
# (coverage command not in package.json, inferred from Vitest defaults)
```

## Test Types

**Unit Tests:**
- Scope: Pure functions and utilities
- Approach: Direct function calls with expected outputs
- Example: `add.test.ts` tests the `add()` function in isolation
- Pattern: Simple input → assertion pattern

**Integration Tests:**
- Scope: Server/resource orchestration
- Not currently implemented
- Would test FastMCP server integration with tools/resources
- Approach: Mock FastMCP dependencies and test execute/load flows

**E2E Tests:**
- Not used in current codebase
- Would require spawning server process and testing via stdio transport

## Common Patterns

**Async Testing:**
```typescript
// Async patterns would follow standard Vitest async support
it("should load async resource", async () => {
  const result = await someAsyncFunction();
  expect(result).toBe(expected);
});
```

**Error Testing:**
```typescript
// Error patterns not demonstrated; approach would use:
it("should throw error", () => {
  expect(() => {
    // function that throws
  }).toThrow();
});

// Or for async errors:
it("should reject on error", async () => {
  await expect(asyncFunctionThatRejects()).rejects.toThrow();
});
```

**Testing Zod Validation:**
```typescript
// Example pattern for testing Zod schemas
const schema = z.object({
  a: z.number(),
  b: z.number(),
});

it("should validate valid input", () => {
  const result = schema.safeParse({ a: 1, b: 2 });
  expect(result.success).toBe(true);
});

it("should reject invalid input", () => {
  const result = schema.safeParse({ a: "not a number", b: 2 });
  expect(result.success).toBe(false);
});
```

---

*Testing analysis: 2026-01-21*
