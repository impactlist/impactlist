#!/usr/bin/env node

/* eslint-env node */

// Mirrors the canonical .claude/skills tree into .agents/skills so .agents-aware tooling
// sees the same skills. .claude/skills is the SOURCE OF TRUTH; .agents/skills is generated
// — never edit it by hand. Run automatically by .husky/pre-commit when a commit touches
// .claude/skills, or manually via `npm run sync-skills`.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const source = path.join(__dirname, '../.claude/skills');
const mirror = path.join(__dirname, '../.agents/skills');

const lstatOrNull = (p) => {
  try {
    return fs.lstatSync(p);
  } catch {
    return null;
  }
};

if (!fs.existsSync(source)) {
  throw new Error(`Canonical skills directory not found: ${source}`);
}

// Replace whatever is at the mirror path. Use lstat (not stat) so we act on a symlink
// itself: unlink only the link, never recursing into and deleting its target. This also
// migrates the old `.agents/skills -> ../.claude/skills` symlink to a real copy.
const existing = lstatOrNull(mirror);
if (existing) {
  if (existing.isSymbolicLink()) {
    fs.unlinkSync(mirror);
  } else {
    fs.rmSync(mirror, { recursive: true, force: true });
  }
}

fs.cpSync(source, mirror, { recursive: true });
console.log('Synced skills: .claude/skills -> .agents/skills');
