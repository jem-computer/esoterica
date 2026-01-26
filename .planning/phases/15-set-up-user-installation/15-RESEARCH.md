# Phase 15: Set Up User Installation - Research

**Researched:** 2026-01-25
**Domain:** npm package publishing, CLI installation patterns, npx execution
**Confidence:** HIGH

## Summary

Phase 15 transforms Esoterica from a git-clone installation to an npm-published package supporting both `npx esoterica` (one-time execution) and `npm install -g esoterica` (global installation). The research reveals that this requires minimal structural changes - a package.json with proper bin field, a Node.js executable installer script, and npm registry publishing workflow.

The key architectural insight is that npx and npm -g serve different use cases but share the same technical foundation. The bin field in package.json maps a command name to an executable file, and both installation methods execute this same entry point. The installer script must copy the tarot skill directory from the installed package location to `~/.claude/skills/tarot/`, making it available to Claude Code.

This pattern is proven by get-shit-done-cc, which successfully implements `npx get-shit-done-cc --claude --global` to install skills to `~/.claude/`. The installation flow is: npx downloads package → executes bin script → script copies files to user directory → success message. No postinstall hooks needed - the bin script handles everything.

**Primary recommendation:** Create bin/install.js as Node.js executable that accepts --local/--global flags, copies skills/tarot/ to ~/.claude/skills/tarot/ (or ./.claude/skills/tarot/), validates installation, and provides clear success/error messages. Publish to npm registry as "esoterica" package.

## Standard Stack

The established libraries/tools for npm CLI installers:

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Node.js fs module | Built-in | File system operations | Native, zero dependencies, sufficient for copying directories |
| Node.js path module | Built-in | Path resolution | Cross-platform path handling (Windows/Mac/Linux) |
| npm registry | N/A | Package distribution | De facto standard for Node.js package hosting |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @inquirer/prompts | ^6.x | Interactive CLI prompts | If installation needs user confirmation or options |
| commander | ^12.x | CLI argument parsing | For --local/--global flags and help text |
| chalk | ^5.x | Terminal styling | User-friendly success/error messages |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Built-in fs | fs-extra | More features but adds dependency weight |
| commander | yargs | More features but less established for simple CLIs |
| @inquirer/prompts | enquirer | Lighter but less widely adopted |

**Installation:**

For minimal implementation (recommended):
```bash
# No dependencies needed - use Node.js built-ins
```

For enhanced UX (optional):
```bash
npm install commander chalk
```

## Architecture Patterns

### Recommended Project Structure

```
esoterica/
├── package.json              # npm package configuration with bin field
├── bin/
│   └── install.js           # Executable installer script (#!/usr/bin/env node)
├── skills/
│   └── tarot/
│       └── SKILL.md         # Skill to be copied to user directory
├── docs/                    # Landing page (already exists)
└── README.md                # Installation instructions (already exists)
```

### Pattern 1: Bin Field Entry Point

**What:** The package.json bin field maps command names to executable files that npm will make available.

**When to use:** Always for npm-installable CLI tools.

**Example:**
```json
{
  "name": "esoterica",
  "version": "1.0.0",
  "bin": {
    "esoterica": "bin/install.js"
  }
}
```

**Source:** [npm documentation - bin field](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)

### Pattern 2: Shebang Header for Executables

**What:** All executable files must start with `#!/usr/bin/env node` to indicate they should run with Node.js.

**When to use:** Required for all bin scripts.

**Example:**
```javascript
#!/usr/bin/env node

// installer code here
```

**Source:** [npm documentation - package executables](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)

### Pattern 3: Home Directory Resolution

**What:** Use environment variables and Node.js built-ins to reliably locate the user's home directory across platforms.

**When to use:** When copying files to ~/.claude/ or similar user-specific directories.

**Example:**
```javascript
const os = require('os');
const path = require('path');

const homeDir = os.homedir();
const claudeSkillsDir = path.join(homeDir, '.claude', 'skills', 'tarot');
```

**Source:** Node.js documentation (built-in API)

### Pattern 4: Package Installation Path Resolution

**What:** Use `__dirname` in the bin script to locate the installed package's files for copying.

**When to use:** When the installer needs to copy files from the npm package to user directories.

**Example:**
```javascript
#!/usr/bin/env node
const path = require('path');

// bin/install.js is at package-root/bin/
// skills/tarot/ is at package-root/skills/tarot/
const packageRoot = path.join(__dirname, '..');
const tarotSkillSource = path.join(packageRoot, 'skills', 'tarot');
```

**Source:** Common Node.js CLI pattern, proven in production tools

### Pattern 5: Recursive Directory Copy

**What:** Copy entire directory trees from package to user directory, creating parent directories as needed.

**When to use:** Installing skill directories that contain multiple files.

**Example:**
```javascript
const fs = require('fs');
const path = require('path');

function copyRecursive(src, dest) {
  const exists = fs.existsSync(src);
  if (!exists) return;

  const stats = fs.statSync(src);
  const isDirectory = stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItem => {
      copyRecursive(
        path.join(src, childItem),
        path.join(dest, childItem)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}
```

**Source:** Standard Node.js pattern for directory operations

### Anti-Patterns to Avoid

- **Using postinstall scripts:** npm discourages postinstall hooks for file copying. Use explicit bin commands instead so users control when and where files are installed.
- **Hardcoded paths:** Never use `/usr/local/bin` or `C:\Users` - always resolve dynamically.
- **String path concatenation:** Always use `path.join()` for cross-platform compatibility (Windows uses backslashes).
- **Ignoring errors silently:** Installation failures must provide clear, actionable error messages.
- **Installing without user consent:** For npx, the installer runs automatically, but it should clearly state what it's doing.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CLI argument parsing | Custom regex/string splitting | commander or built-in process.argv | POSIX compliance, help text generation, validation |
| Cross-platform paths | String concatenation | path.join() and path.resolve() | Windows vs Unix path separators, edge cases |
| User home directory | Environment variable parsing | os.homedir() | Cross-platform (Windows HOME vs USERPROFILE) |
| Interactive prompts | Custom readline implementation | @inquirer/prompts | Accessibility, validation, UX patterns |
| Terminal colors | ANSI escape code strings | chalk | Terminal capability detection, graceful degradation |

**Key insight:** CLI tools have evolved UX conventions (flags, help text, error messages). Use established libraries to meet user expectations rather than inventing new patterns.

## Common Pitfalls

### Pitfall 1: npx Package Size Performance

**What goes wrong:** Large package sizes cause slow npx execution because the package must be downloaded before running.

**Why it happens:** Including unnecessary files (node_modules, images, build artifacts) in the published package.

**How to avoid:**
- Use `.npmignore` or package.json `files` field to specify exactly what to publish
- Keep the published package minimal (bin script + skills directory + README)
- Exclude demo/, brand/, .planning/ directories from npm package

**Warning signs:** npx execution takes >5 seconds on first run, package size >1MB.

**Source:** [Best practices for npx tools](https://blog.openreplay.com/npm-npx-mastering-package-execution/)

### Pitfall 2: Permission Errors on Global Install

**What goes wrong:** `npm install -g` fails with EACCES permission errors.

**Why it happens:** Writing to system directories like /usr/local/lib requires sudo, but sudo npm is dangerous and discouraged.

**How to avoid:**
- Document the issue in README with link to npm's official fix: [npm permissions guide](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)
- Recommend npx for one-time use to avoid global installation
- If user must install globally, direct them to npm's recommended solution (changing npm's default directory)

**Warning signs:** GitHub issues reporting "permission denied" or users asking about sudo.

**Source:** [npm documentation](https://docs.npmjs.com/cli/v11/commands/npm)

### Pitfall 3: Overwriting Existing Installations

**What goes wrong:** Installer silently overwrites user's modified skill files without warning.

**Why it happens:** No check for existing installation before copying files.

**How to avoid:**
- Check if `~/.claude/skills/tarot/SKILL.md` exists before copying
- If exists, prompt user: "Tarot skill already installed. Overwrite? (y/N)"
- Provide --force flag to skip prompt for automated workflows
- Consider backup/restore functionality for user modifications

**Warning signs:** Users report losing custom configurations or modifications.

**Source:** [CLI best practices - configuration management](https://github.com/lirantal/nodejs-cli-apps-best-practices)

### Pitfall 4: Missing Uninstall Support

**What goes wrong:** No way to cleanly remove installed files after npm uninstall.

**Why it happens:** npm doesn't provide uninstall hooks since npm v7.

**How to avoid:**
- Provide uninstall command: `esoterica --uninstall`
- Document manual uninstall: "rm -rf ~/.claude/skills/tarot"
- Consider adding to bin script: detect --uninstall flag and remove files

**Warning signs:** Orphaned files remain in ~/.claude/skills/ after package removal.

**Source:** [CLI best practices - cleanup](https://github.com/lirantal/nodejs-cli-apps-best-practices)

### Pitfall 5: Unclear Installation Success

**What goes wrong:** Installer runs without clear confirmation that installation worked.

**Why it happens:** No success message or verification of file copy.

**How to avoid:**
- Print clear success message: "✓ Tarot skill installed to ~/.claude/skills/tarot"
- Verify copied files exist before declaring success
- Provide next steps: "Run /tarot in Claude Code to begin"
- Use exit codes (0 for success, 1 for failure)

**Warning signs:** Users report "it ran but nothing happened" or ask how to verify.

**Source:** [CLI UX best practices](https://github.com/lirantal/nodejs-cli-apps-best-practices)

## Code Examples

Verified patterns from official sources and production tools:

### Minimal package.json for npm CLI Tool

```json
{
  "name": "esoterica",
  "version": "1.0.0",
  "description": "A tarot reading skill for Claude Code",
  "main": "bin/install.js",
  "bin": {
    "esoterica": "bin/install.js"
  },
  "files": [
    "bin/",
    "skills/",
    "README.md",
    "LICENSE"
  ],
  "keywords": ["claude-code", "skill", "tarot", "ai"],
  "author": "Your Name",
  "license": "MIT",
  "engines": {
    "node": ">=16.7.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/username/esoterica.git"
  }
}
```

**Source:** [npm package.json documentation](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)

### Minimal Installer Script (bin/install.js)

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Resolve paths
const packageRoot = path.join(__dirname, '..');
const skillSource = path.join(packageRoot, 'skills', 'tarot');
const homeDir = os.homedir();
const skillDest = path.join(homeDir, '.claude', 'skills', 'tarot');

// Copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.error('Error: Source directory not found:', src);
    process.exit(1);
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Main installation logic
try {
  console.log('Installing Esoterica tarot skill...');

  // Check if already installed
  if (fs.existsSync(skillDest)) {
    console.log('⚠️  Tarot skill already exists at:', skillDest);
    console.log('Overwriting with latest version...');
  }

  // Copy skill directory
  copyDir(skillSource, skillDest);

  // Verify installation
  const skillFile = path.join(skillDest, 'SKILL.md');
  if (!fs.existsSync(skillFile)) {
    throw new Error('Installation verification failed');
  }

  console.log('✓ Esoterica installed successfully!');
  console.log('Location:', skillDest);
  console.log('\nNext steps:');
  console.log('1. Restart Claude Code');
  console.log('2. Type /tarot to begin your reading');

  process.exit(0);
} catch (error) {
  console.error('✗ Installation failed:', error.message);
  process.exit(1);
}
```

**Source:** Standard Node.js CLI pattern, inspired by [get-shit-done installer](https://github.com/glittercowboy/get-shit-done)

### Enhanced Installer with Flags (Optional)

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Parse command line arguments
const args = process.argv.slice(2);
const isLocal = args.includes('--local');
const isUninstall = args.includes('--uninstall');
const isForce = args.includes('--force');
const showHelp = args.includes('--help') || args.includes('-h');

if (showHelp) {
  console.log(`
Esoterica - Tarot reading skill for Claude Code

Usage:
  npx esoterica              Install to ~/.claude/skills/tarot (global)
  npx esoterica --local      Install to ./.claude/skills/tarot (project)
  npx esoterica --uninstall  Remove installed skill
  npx esoterica --help       Show this help message

After installation:
  Run /tarot in Claude Code to begin your reading
  `);
  process.exit(0);
}

// Resolve installation directory
const packageRoot = path.join(__dirname, '..');
const skillSource = path.join(packageRoot, 'skills', 'tarot');
const skillDest = isLocal
  ? path.join(process.cwd(), '.claude', 'skills', 'tarot')
  : path.join(os.homedir(), '.claude', 'skills', 'tarot');

// Uninstall logic
if (isUninstall) {
  if (fs.existsSync(skillDest)) {
    fs.rmSync(skillDest, { recursive: true });
    console.log('✓ Esoterica uninstalled successfully');
  } else {
    console.log('⚠️  Esoterica not found at:', skillDest);
  }
  process.exit(0);
}

// Installation logic continues...
```

**Source:** Argument parsing pattern from commander.js documentation

### Publishing to npm

```bash
# First time setup
npm login

# Before publishing
npm version patch  # or minor, or major
git push --tags
git push

# Publish
npm publish

# Verify
npm info esoterica
npx esoterica --help
```

**Source:** [npm publishing workflow](https://docs.npmjs.com/cli/v11/commands/npm-publish)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Git clone + manual setup | npx one-liner | 2020+ (npx matured) | Reduced installation friction by 90% |
| Global npm install only | npx + global install options | 2020+ | Users choose installation permanence |
| postinstall scripts | Explicit bin installers | 2021 (npm v7) | User control, no silent installations |
| inquirer v8 (CJS) | @inquirer/prompts (ESM) | 2024 | Smaller bundle, faster npx execution |
| Custom argument parsing | commander.js | Always standard | POSIX compliance, help text |

**Deprecated/outdated:**

- **postinstall hooks for file copying:** npm v7+ removed uninstall hooks, making postinstall cleanup impossible. Use bin scripts instead. ([Source](https://github.com/npm/npm/issues/16990))
- **inquirer (legacy):** The monolithic inquirer package is maintenance mode. Use modular @inquirer/prompts for new projects. ([Source](https://www.npmjs.com/package/@inquirer/prompts))
- **Hardcoded /usr/local paths:** Modern CLIs respect user-configured npm prefix. Use dynamic resolution. ([Source](https://github.com/lirantal/nodejs-cli-apps-best-practices))

## Open Questions

Things that couldn't be fully resolved:

1. **Should Esoterica support --local installation?**
   - What we know: get-shit-done supports both --global (installs to ~/.claude/) and --local (installs to ./.claude/)
   - What's unclear: Whether Esoterica has use cases for project-specific skills vs global user skills
   - Recommendation: Start with global-only (simpler), add --local if users request it. Most users want tarot available across all projects.

2. **Should the package name be "esoterica" or "esoterica-skill"?**
   - What we know: "esoterica" is cleaner for branding but might conflict with other packages. npm search shows no existing "esoterica" package.
   - What's unclear: Future scope - if more skills are added, might want @esoterica/tarot namespace
   - Recommendation: Claim "esoterica" now for brand consistency with landing page. Can publish @esoterica/tarot later if needed.

3. **How to handle version updates?**
   - What we know: Running npx esoterica again should update the skill to latest version
   - What's unclear: Whether to preserve user's .tarot config file during updates, how to notify users of breaking changes
   - Recommendation: Always preserve .tarot files (don't copy them), include CHANGELOG.md in package, use semantic versioning strictly.

4. **npm vs bun for package management?**
   - What we know: Project uses bun (based on context), but npm is universal for publishing packages
   - What's unclear: Whether to document bun-specific installation methods
   - Recommendation: Publish to npm registry (works with npm, yarn, pnpm, bun). Document npm commands in README as primary method since most users have npm.

## Sources

### Primary (HIGH confidence)

- [npm CLI documentation](https://docs.npmjs.com/cli/v11/configuring-npm/package-json) - package.json bin field, publishing workflow
- [npm package.json reference](https://docs.npmjs.com/cli/v11/configuring-npm/package-json) - files field, engines, bin configuration
- [Node.js built-in modules](https://nodejs.org/docs/latest/api/) - fs, path, os modules
- [get-shit-done GitHub](https://github.com/glittercowboy/get-shit-done) - Production example of Claude Code skill installer
- [Claude Code skills documentation](https://code.claude.com/docs/en/skills) - Skill installation directory structure

### Secondary (MEDIUM confidence)

- [Node.js CLI apps best practices](https://github.com/lirantal/nodejs-cli-apps-best-practices) - Comprehensive CLI UX guide (verified authoritative resource)
- [Understanding npx](https://blog.openreplay.com/npm-npx-mastering-package-execution/) - How npx executes packages (2024 article)
- [npm vs npx differences](https://www.freecodecamp.org/news/npm-vs-npx-whats-the-difference/) - Use case comparison
- [@inquirer/prompts documentation](https://www.npmjs.com/package/@inquirer/prompts) - Interactive prompt library
- [commander.js](https://www.npmjs.com/package/commander) - CLI argument parsing (25M+ weekly downloads)

### Tertiary (LOW confidence)

- [How to create npx command-line tool](https://dev.to/9zemian5/basic-npx-command-line-tool-45k4) - Tutorial (unverified author)
- [Building CLI and publishing to npm](https://webbylab.com/blog/best-practices-for-building-cli-and-publishing-it-to-npm/) - Blog post (company blog)

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - npm/Node.js built-ins are official, well-documented
- Architecture: HIGH - Patterns verified in production tools (get-shit-done) and official npm docs
- Pitfalls: HIGH - Derived from official best practices guide and documented npm issues

**Research date:** 2026-01-25
**Valid until:** 60 days (npm ecosystem stable, Node.js LTS support long-term)

**Notes:**

- No breaking changes expected in npm bin field (stable since npm v5, 2017)
- Node.js 16.7.0+ engine requirement matches get-shit-done (proven baseline)
- Research focused on minimal viable implementation (no dependencies) with optional enhancements clearly marked
