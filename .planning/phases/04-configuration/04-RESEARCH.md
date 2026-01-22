# Phase 4: Configuration - Research

**Researched:** 2026-01-22
**Domain:** Bash configuration file handling for CLI tools
**Confidence:** HIGH

## Summary

Configuration file handling in Bash CLI tools follows well-established patterns, with two primary approaches: simple key=value parsing (safer) vs sourcing shell files (convenient but risky). For the tarot skill's voice preference storage, the research reveals a clear path using simple key=value files with grep/cut parsing, avoiding code injection risks while maintaining simplicity.

The standard pattern uses dual-level config (global ~/.config/[tool]/ and project-level dotfiles) with explicit precedence handling. Git's configuration system provides the canonical reference: local config overrides global, with command-line flags taking ultimate precedence. This three-tier system (flag > project > global) is widely adopted across modern CLI tools.

For the tarot skill specifically, a simple key=value format is sufficient since only one setting (voice preference) needs storage. The skill already uses shell injection deliberately for randomness, so the context is security-aware. However, config files should NOT use source/eval to avoid unintended code execution.

**Primary recommendation:** Use simple `voice=mystic` or `voice=grounded` format in both config locations, with grep-based parsing instead of source. This provides safety, simplicity, and follows CLI tool conventions.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| grep | GNU grep 3.x+ | Safe config value extraction | POSIX-standard, available everywhere, prevents code injection |
| cut | GNU coreutils | Splitting key=value pairs | Standard Unix utility, simple and reliable |
| test/[ ] | Built-in | File existence checking | Bash built-in, no dependencies |

### Supporting
| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| mkdir -p | coreutils | Directory creation | When initializing config directories |
| IFS + read | Bash built-in | Line-by-line parsing | When validating entire config file |
| sed | GNU sed 4.x+ | Config value updates | When programmatically modifying config (future Phase 5) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| grep + cut | source | Source is convenient but allows arbitrary code execution - NEVER use for untrusted config |
| grep + cut | jq with JSON | JSON adds complexity; overkill for single key-value pair |
| Simple text file | Environment variables | ENV vars don't persist across sessions without shell config modification |

**Installation:**
```bash
# No installation needed - grep, cut, test are standard utilities
# Available on all Unix-like systems (macOS, Linux)
```

## Architecture Patterns

### Recommended Config Structure
```
~/.config/claude/tarot/       # Global config (follows XDG Base Directory spec)
└── config                    # Simple key=value format

[project-dir]/                # Project-level config
└── .tarot                    # Same format, project-specific override
```

### Pattern 1: Safe Key-Value Parsing
**What:** Extract value without executing code using grep + cut
**When to use:** Always, for any config file that might be user-edited
**Example:**
```bash
# Source: Bash config parsing best practices (opensource.com)
# Safe extraction of single value
CONFIG_FILE="$HOME/.config/claude/tarot/config"
if [ -f "$CONFIG_FILE" ]; then
    VOICE=$(grep '^voice=' "$CONFIG_FILE" | cut -d'=' -f2 | head -1)
fi

# With validation
if [ -n "$VOICE" ] && { [ "$VOICE" = "mystic" ] || [ "$VOICE" = "grounded" ]; }; then
    echo "$VOICE"  # Valid value
else
    echo "grounded"  # Default fallback
fi
```

### Pattern 2: Precedence Chain
**What:** Check multiple config sources in precedence order
**When to use:** When supporting multiple config levels (flag > project > global)
**Example:**
```bash
# Source: Git config precedence model (git-scm.com)
# Precedence: flag > project > global
VOICE=""

# 1. Check command-line flag (already implemented in Phase 3)
VOICE=$(echo "$ARGUMENTS" | grep -oiE '\-\-voice\s+(mystic|grounded)' | awk '{print tolower($2)}')

# 2. If no flag, check project-level config
if [ -z "$VOICE" ] && [ -f ".tarot" ]; then
    VOICE=$(grep '^voice=' ".tarot" | cut -d'=' -f2 | head -1)
fi

# 3. If still no value, check global config
if [ -z "$VOICE" ] && [ -f "$HOME/.config/claude/tarot/config" ]; then
    VOICE=$(grep '^voice=' "$HOME/.config/claude/tarot/config" | cut -d'=' -f2 | head -1)
fi

# 4. Default if nothing found
[ -z "$VOICE" ] && VOICE="grounded"
```

### Pattern 3: Graceful Error Handling
**What:** Test file existence before reading, validate values after extraction
**When to use:** Always, to prevent errors from missing/malformed config
**Example:**
```bash
# Source: Bash file testing patterns (linuxize.com)
read_config_value() {
    local config_file="$1"
    local key="$2"
    local default="$3"

    # File existence check
    if [ ! -f "$config_file" ]; then
        echo "$default"
        return 0
    fi

    # File readability check
    if [ ! -r "$config_file" ]; then
        echo "$default"
        return 0
    fi

    # Extract value
    local value=$(grep "^${key}=" "$config_file" | cut -d'=' -f2 | head -1)

    # Return value if found, default otherwise
    [ -n "$value" ] && echo "$value" || echo "$default"
}

# Usage
VOICE=$(read_config_value "$HOME/.config/claude/tarot/config" "voice" "grounded")
```

### Pattern 4: Config File Format
**What:** Simple key=value pairs, one per line, with optional comments
**When to use:** For simple configuration with few settings
**Example:**
```bash
# ~/.config/claude/tarot/config
# Tarot reading voice preference
# Options: mystic, grounded
voice=mystic
```

### Anti-Patterns to Avoid
- **Using source/eval on config files:** Allows arbitrary code execution. A malicious `.tarot` file could contain `voice=grounded; rm -rf ~` and wreck the system. Use grep/cut instead.
- **No validation after parsing:** User could put `voice=banana` in config. Always validate against allowed values.
- **Failing on missing config:** Don't error if config file doesn't exist - use defaults gracefully.
- **Hard-coding paths:** Use variables for config paths to enable testing and flexibility.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Config file parsing | Custom parser with eval/awk magic | grep + cut for key-value | Safe, simple, handles edge cases (spaces, quotes, comments) |
| Directory creation | Manual error checking | mkdir -p | Creates parent directories, succeeds if exists |
| Value validation | Complex regex | Simple string comparison with [ ] | More readable, less error-prone for simple cases |
| Default fallback | Nested if statements | ${VAR:-default} syntax | Bash built-in, concise, idiomatic |

**Key insight:** Config parsing is a solved problem with well-known security pitfalls. Using standard Unix utilities (grep, cut) avoids reinventing wheels and prevents code injection vulnerabilities that plague custom parsers.

## Common Pitfalls

### Pitfall 1: Source Injection Vulnerability
**What goes wrong:** Using `source` or `.` to load config files allows arbitrary code execution
**Why it happens:** Convenient to write config as shell variables, but files can contain malicious code
**How to avoid:** NEVER use source for config files. Always parse with grep/cut/read loops
**Warning signs:** Config file contains anything other than `key=value` lines and comments
**Example of danger:**
```bash
# DANGEROUS - DO NOT DO THIS
source ~/.config/claude/tarot/config  # If file contains malicious code, it executes

# SAFE - DO THIS INSTEAD
VOICE=$(grep '^voice=' ~/.config/claude/tarot/config | cut -d'=' -f2)
```

### Pitfall 2: Missing Validation After Parsing
**What goes wrong:** Accept any value from config file without checking validity
**Why it happens:** Assumes users will only put valid values; they won't
**How to avoid:** Always validate extracted values against allowed options
**Warning signs:** Config contains `voice=banana` and script uses it without checking
**Example:**
```bash
# BAD - Uses value blindly
VOICE=$(grep '^voice=' config | cut -d'=' -f2)
# Now VOICE could be anything: "banana", "delete-everything", etc.

# GOOD - Validate before use
VOICE=$(grep '^voice=' config | cut -d'=' -f2)
if [ "$VOICE" != "mystic" ] && [ "$VOICE" != "grounded" ]; then
    VOICE="grounded"  # Reset to safe default
fi
```

### Pitfall 3: Hard Failure on Missing Config
**What goes wrong:** Script errors/exits if config file doesn't exist
**Why it happens:** Not testing file existence before reading
**How to avoid:** Use `[ -f "$file" ]` test before attempting to read; provide defaults
**Warning signs:** Script fails on first run before user creates config
**Example:**
```bash
# BAD - Fails if file doesn't exist
VOICE=$(cat ~/.config/claude/tarot/config | grep '^voice=' | cut -d'=' -f2)

# GOOD - Gracefully handles missing file
if [ -f ~/.config/claude/tarot/config ]; then
    VOICE=$(grep '^voice=' ~/.config/claude/tarot/config | cut -d'=' -f2)
fi
VOICE=${VOICE:-grounded}  # Default if not found
```

### Pitfall 4: Precedence Order Confusion
**What goes wrong:** Config sources checked in wrong order, wrong value wins
**Why it happens:** Not thinking through which config should override which
**How to avoid:** Follow Git model: narrower scope wins (flag > project > global)
**Warning signs:** User sets project `.tarot` file but global config still used
**Example:**
```bash
# BAD - Backwards precedence (global overrides project)
VOICE=$(grep '^voice=' ~/.config/claude/tarot/config | cut -d'=' -f2)
[ -z "$VOICE" ] && VOICE=$(grep '^voice=' .tarot | cut -d'=' -f2)

# GOOD - Correct precedence (project overrides global)
if [ -f ".tarot" ]; then
    VOICE=$(grep '^voice=' ".tarot" | cut -d'=' -f2)
fi
if [ -z "$VOICE" ] && [ -f ~/.config/claude/tarot/config ]; then
    VOICE=$(grep '^voice=' ~/.config/claude/tarot/config | cut -d'=' -f2)
fi
```

### Pitfall 5: Path Expansion Issues
**What goes wrong:** Using literal `~/.config` in scripts without expansion
**Why it happens:** Tilde expansion doesn't work in all contexts (quotes, variables)
**How to avoid:** Use `$HOME/.config` instead of `~/.config` in scripts
**Warning signs:** Config works in shell but not when called from skill
**Example:**
```bash
# BAD - Tilde may not expand correctly
CONFIG="~/.config/claude/tarot/config"  # Stored as literal string "~/.config..."

# GOOD - Use $HOME which always expands
CONFIG="$HOME/.config/claude/tarot/config"
```

### Pitfall 6: Gitignore Confusion
**What goes wrong:** Accidentally committing user-specific preferences or forgetting to track shared config
**Why it happens:** Not clear which config files should be committed
**How to avoid:** Project `.tarot` is user-specific (gitignore it); global config never in repo
**Warning signs:** Team members' config preferences conflict in git
**Rule of thumb:**
- `.tarot` (project-level) → Add to `.gitignore` (user preference, not shared)
- `~/.config/claude/tarot/config` (global) → Never in project repo anyway
- `.tarot.example` → Could commit this to show format

## Code Examples

Verified patterns from official sources:

### Complete Config Reading with Precedence
```bash
# Source: Git config model (git-scm.com) + Bash best practices
# Complete implementation for tarot voice preference

# Define config locations
GLOBAL_CONFIG="$HOME/.config/claude/tarot/config"
PROJECT_CONFIG=".tarot"
DEFAULT_VOICE="grounded"
VOICE=""

# Function to safely read config value
read_voice_config() {
    local file="$1"
    [ ! -f "$file" ] && return 1
    [ ! -r "$file" ] && return 1

    local value=$(grep '^voice=' "$file" | cut -d'=' -f2 | head -1)

    # Validate value
    if [ "$value" = "mystic" ] || [ "$value" = "grounded" ]; then
        echo "$value"
        return 0
    fi
    return 1
}

# Precedence: flag > project > global > default
# (Flag parsing already implemented in Phase 3, happens before this)

# Check project-level config
if [ -z "$VOICE" ]; then
    VOICE=$(read_voice_config "$PROJECT_CONFIG")
fi

# Check global config
if [ -z "$VOICE" ]; then
    VOICE=$(read_voice_config "$GLOBAL_CONFIG")
fi

# Apply default
VOICE=${VOICE:-$DEFAULT_VOICE}
```

### Initialize Global Config Directory
```bash
# Source: XDG Base Directory Specification (freedesktop.org)
# Create config directory following XDG standards

# Use XDG_CONFIG_HOME if set, otherwise default to ~/.config
CONFIG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/claude/tarot"
CONFIG_FILE="$CONFIG_DIR/config"

# Create directory structure if it doesn't exist
if [ ! -d "$CONFIG_DIR" ]; then
    mkdir -p "$CONFIG_DIR"
fi

# Create default config file if it doesn't exist
if [ ! -f "$CONFIG_FILE" ]; then
    cat > "$CONFIG_FILE" <<'EOF'
# Tarot reading voice preference
# Options: mystic, grounded
voice=grounded
EOF
fi
```

### Inline Config Reading (Minimal Version)
```bash
# Source: Bash one-liner patterns
# For use directly in SKILL.md shell injection

# One-liner version for SKILL.md integration
# Precedence: project .tarot > global config > default "grounded"
![ -f .tarot ] && VOICE=$(grep '^voice=' .tarot | cut -d'=' -f2) || VOICE=""; [ -z "$VOICE" ] && [ -f "$HOME/.config/claude/tarot/config" ] && VOICE=$(grep '^voice=' "$HOME/.config/claude/tarot/config" | cut -d'=' -f2) || true; [ "$VOICE" = "mystic" ] || [ "$VOICE" = "grounded" ] || VOICE="grounded"; echo "$VOICE"
```

### Config File Creation with Validation
```bash
# Source: Bash error handling patterns (devops.aibit.im)
# Script to set voice preference (future Phase 5 tool)

set_voice_preference() {
    local voice="$1"
    local scope="${2:-global}"  # global or project

    # Validate input
    if [ "$voice" != "mystic" ] && [ "$voice" != "grounded" ]; then
        echo "Error: Voice must be 'mystic' or 'grounded'" >&2
        return 1
    fi

    # Determine target file
    local config_file
    if [ "$scope" = "project" ]; then
        config_file=".tarot"
    else
        config_file="$HOME/.config/claude/tarot/config"
        mkdir -p "$(dirname "$config_file")"
    fi

    # Write config (overwrite if exists)
    cat > "$config_file" <<EOF
# Tarot reading voice preference
# Set: $(date)
voice=$voice
EOF

    echo "Voice preference set to '$voice' ($scope)"
}

# Usage:
# set_voice_preference "mystic" "global"
# set_voice_preference "grounded" "project"
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| source config files | grep/cut parsing | ~2010s | Security: prevents code injection in config files |
| ~/.toolname/ config | XDG ~/.config/toolname/ | 2003 (XDG spec) | Organization: separates config/cache/data by type |
| Single global config | Multi-level precedence | Git popularized ~2005 | Flexibility: project-specific overrides without modifying global |
| Custom config parsers | Standard Unix utilities | Always preferred | Reliability: well-tested tools, fewer bugs |
| JSON for simple config | key=value for 1-2 settings | Ongoing debate | Simplicity: JSON adds complexity for trivial cases |

**Deprecated/outdated:**
- **Sourcing config files with `.` or `source`**: Still common but recognized as security risk. Modern tools parse instead of execute.
- **~/.toolname (home directory clutter)**: XDG Base Directory spec recommends ~/.config/toolname/ for config files. Still works but not preferred.
- **No config precedence**: Modern users expect project-level overrides. Single global config is limiting.

**Current best practice (2026):**
- XDG-compliant paths (~/.config/ for config)
- Multi-level precedence (flag > project > global)
- Simple formats (key=value) for simple needs
- Safe parsing (grep/cut, not eval/source)
- Graceful degradation (defaults when config missing)

## Open Questions

Things that couldn't be fully resolved:

1. **How should users set config preferences?**
   - What we know: Config files can be manually edited with text editor
   - What's unclear: Whether Phase 4 should include a helper command like `/tarot config set voice mystic` or if manual editing is sufficient
   - Recommendation: Phase 4 implements reading only. Manual editing is fine for now. Helper command could be Phase 5+ if users request it. Document config file location and format clearly.

2. **Should project-level .tarot be automatically added to .gitignore?**
   - What we know: Git convention suggests user preferences shouldn't be committed; XDG spec says global config handles user prefs
   - What's unclear: Whether `.tarot` is "user preference" (don't commit) or "project configuration" (do commit)
   - Recommendation: Treat as user preference → recommend adding `.tarot` to `.gitignore` in docs. Rationale: Voice is presentation preference, not project requirement. If a project wants to enforce a voice, they should document it, not commit config.

3. **XDG_CONFIG_HOME vs $HOME/.config hardcoded?**
   - What we know: XDG spec says respect $XDG_CONFIG_HOME if set, default to $HOME/.config if not
   - What's unclear: Whether the added complexity is worth it for a simple skill
   - Recommendation: Use `${XDG_CONFIG_HOME:-$HOME/.config}` pattern. It's one extra variable expansion but properly follows the spec. Users who set XDG_CONFIG_HOME expect tools to respect it.

4. **What if config file is unreadable (permissions)?**
   - What we know: `[ -r file ]` tests readability
   - What's unclear: Should we warn user or silently fall back to default?
   - Recommendation: Silent fallback to default. Config is optional enhancement; permission issues shouldn't break basic functionality. Same behavior as "file doesn't exist".

5. **Should empty config file (exists but no voice= line) behave differently than missing file?**
   - What we know: Both scenarios result in no value extracted
   - What's unclear: Is this a user error (file exists but malformed) vs intentional (file doesn't exist yet)?
   - Recommendation: Treat identically - fall back to default. Empty or missing file = use default. Simplest mental model for users.

## Sources

### Primary (HIGH confidence)
- [XDG Base Directory Specification](https://specifications.freedesktop.org/basedir/latest/) - Official freedesktop.org spec for config locations
- [Git Config Documentation](https://git-scm.com/docs/git-config) - Canonical precedence model (local > global)
- [Git Book: Git Configuration](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration) - Explanation of config scopes and precedence
- [Bash File Test Operators](https://linuxize.com/post/bash-check-if-file-exists/) - Standard file existence checking
- [Bash Hackers Wiki: Config Files](https://flokoe.github.io/bash-hackers-wiki/howto/conffile/) - Config parsing patterns and security

### Secondary (MEDIUM confidence)
- [Parsing Config Files with Bash - Opensource.com](https://opensource.com/article/21/6/bash-config) - Practical examples of safe parsing
- [Reading Properties Files - Baeldung on Linux](https://www.baeldung.com/linux/script-parsing-properties-file) - Key-value parsing approaches
- [XDG Base Directory - ArchWiki](https://wiki.archlinux.org/title/XDG_Base_Directory) - Practical XDG implementation guidance
- [Azure CLI Configuration](https://learn.microsoft.com/en-us/cli/azure/azure-cli-configuration) - Modern CLI config patterns
- [Advanced Bash Scripting: Error Handling - DevOps Knowledge Hub](https://devops.aibit.im/article/bash-scripting-error-handling-best-practices) - Error handling patterns

### Secondary (MEDIUM confidence - Community Best Practices)
- [GNU Bash Help: Safe Config Parsing](https://lists.gnu.org/archive/html/help-bash/2013-05/msg00018.html) - Security discussion on config parsing
- [Bash Config Parsing - DanielFGray](https://danielfgray.com/articles/bash-config) - Real-world config parsing patterns
- [Global .gitignore - DEV Community](https://dev.to/michaelcurrin/dotfiles-global-git-ignore-38ef) - Gitignore best practices for local config
- [Git Ignoring Files - GitHub Docs](https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files) - .gitignore patterns for local files

### Tertiary (LOW confidence - for validation)
- [Configuration Format Comparison](https://schoenwald.aero/posts/2025-05-03_configuration-format-comparison/) - Blog post comparing JSON/YAML/TOML/key-value (needs official source verification for specific claims)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - grep, cut, test are POSIX-standard, documented in official Bash manual
- Architecture: HIGH - XDG spec and Git precedence model are official specifications, widely adopted
- Pitfalls: HIGH - Security issues with `source` are well-documented in official Bash resources and security advisories
- Config format: HIGH - key=value format is proven standard, used by Git, systemd, countless tools

**Research date:** 2026-01-22
**Valid until:** ~90 days (stable domain - Bash and Unix utilities evolve slowly)

**Specific to tarot skill context:**
- Single setting (voice preference) makes simple key=value ideal
- Skill already uses shell injection deliberately (for randomness), so context is security-aware
- Two-level config (global + project) matches user's specified requirements
- Format should remain simple - this isn't a complex application config
