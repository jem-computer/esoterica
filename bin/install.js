#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Parse command line arguments
const args = process.argv.slice(2);
const showHelp = args.includes('--help') || args.includes('-h');
const isUninstall = args.includes('--uninstall');

// Show help
if (showHelp) {
  console.log(`
Esoterica - Tarot reading skill for Claude Code

Usage:
  npx esoterica              Install tarot skill to ~/.claude/skills/tarot
  npm install -g esoterica   Install globally, then run 'esoterica'
  esoterica --uninstall      Remove installed skill
  esoterica --help           Show this help message

After installation:
  Run /tarot in Claude Code to begin your reading

More info: https://github.com/jem-computer/esoterica
  `);
  process.exit(0);
}

// Resolve paths
const packageRoot = path.join(__dirname, '..');
const skillSource = path.join(packageRoot, 'skills', 'tarot');
const homeDir = os.homedir();
const skillDest = path.join(homeDir, '.claude', 'skills', 'tarot');

/**
 * Recursively copy directory from source to destination
 */
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.error('Error: Source directory not found:', src);
    process.exit(1);
  }

  // Create destination directory if it doesn't exist
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

// Uninstall logic
if (isUninstall) {
  if (fs.existsSync(skillDest)) {
    fs.rmSync(skillDest, { recursive: true, force: true });
    console.log('✓ Esoterica tarot skill uninstalled successfully');
    console.log('Removed:', skillDest);
  } else {
    console.log('⚠️  Esoterica tarot skill not found at:', skillDest);
    console.log('Nothing to uninstall.');
  }
  process.exit(0);
}

// Main installation logic
try {
  console.log('Installing Esoterica tarot skill...');
  console.log('');

  // Check if already installed
  if (fs.existsSync(skillDest)) {
    console.log('⚠️  Tarot skill already exists at:', skillDest);
    console.log('Overwriting with latest version...');
    console.log('');
  }

  // Copy skill directory
  copyDir(skillSource, skillDest);

  // Verify installation
  const skillFile = path.join(skillDest, 'SKILL.md');
  if (!fs.existsSync(skillFile)) {
    throw new Error('Installation verification failed - SKILL.md not found');
  }

  console.log('✓ Esoterica installed successfully!');
  console.log('');
  console.log('Location:', skillDest);
  console.log('');
  console.log('Next steps:');
  console.log('1. Restart Claude Code (if currently running)');
  console.log('2. Type /tarot to begin your reading');
  console.log('');
  console.log('The cards are shuffled. The threshold awaits.');

  process.exit(0);
} catch (error) {
  console.error('✗ Installation failed:', error.message);
  console.error('');
  console.error('Please report issues at: https://github.com/jem-computer/esoterica/issues');
  process.exit(1);
}
