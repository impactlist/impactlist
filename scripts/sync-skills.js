#!/usr/bin/env node

/* eslint-env node */

// Mirrors the canonical .claude/skills tree into .agents/skills so .agents-aware tooling
// sees the same skills. .claude/skills is the SOURCE OF TRUTH; .agents/skills is generated
// — never edit it by hand. Use --check to validate without writing. Writes refuse to
// overwrite local .agents/skills changes; move those edits into .claude/skills first.
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const source = path.join(__dirname, '../.claude/skills');
const mirror = path.join(__dirname, '../.agents/skills');
const args = new Set(process.argv.slice(2));
const checkOnly = args.has('--check');
const usage = 'Usage: npm run sync-skills -- [--check]';

for (const arg of args) {
  if (arg !== '--check') {
    console.error(`sync-skills: unknown argument: ${arg}`);
    console.error(usage);
    process.exit(1);
  }
}

const lstatOrNull = (p) => {
  try {
    return fs.lstatSync(p);
  } catch {
    return null;
  }
};

if (!fs.existsSync(source)) {
  console.error(`Canonical skills directory not found: ${source}`);
  process.exit(1);
}

const describeType = (stat) => {
  if (stat.isDirectory()) return 'directory';
  if (stat.isFile()) return 'file';
  if (stat.isSymbolicLink()) return 'symlink';
  return 'special file';
};

const listOnlyEntries = (rootPath, relativePath, treeLabel) => {
  const entryPath = path.join(rootPath, relativePath);
  const entryStat = lstatOrNull(entryPath);
  const label = relativePath || '.';

  if (!entryStat || !entryStat.isDirectory()) {
    return [`${label} exists only in ${treeLabel}`];
  }

  const entries = fs.readdirSync(entryPath).sort();
  if (entries.length === 0) {
    return [`${label} exists only in ${treeLabel}`];
  }

  return entries.flatMap((name) => listOnlyEntries(rootPath, path.join(relativePath, name), treeLabel));
};

const compareTrees = (leftRoot, rightRoot, relativePath = '') => {
  const leftPath = path.join(leftRoot, relativePath);
  const rightPath = path.join(rightRoot, relativePath);
  const label = relativePath || '.';
  const leftStat = lstatOrNull(leftPath);
  const rightStat = lstatOrNull(rightPath);

  if (!leftStat && !rightStat) return [];
  if (!leftStat) return listOnlyEntries(rightRoot, relativePath, '.agents/skills');
  if (!rightStat) return listOnlyEntries(leftRoot, relativePath, '.claude/skills');

  const leftType = describeType(leftStat);
  const rightType = describeType(rightStat);
  if (leftType !== rightType) {
    return [`${label} is a ${leftType} in .claude/skills but a ${rightType} in .agents/skills`];
  }

  if (leftStat.isDirectory()) {
    const leftEntries = fs.readdirSync(leftPath);
    const rightEntries = fs.readdirSync(rightPath);
    const names = [...new Set([...leftEntries, ...rightEntries])].sort();

    return names.flatMap((name) => compareTrees(leftRoot, rightRoot, path.join(relativePath, name)));
  }

  if (leftStat.isFile()) {
    const leftContent = fs.readFileSync(leftPath);
    const rightContent = fs.readFileSync(rightPath);
    return leftContent.equals(rightContent) ? [] : [`${label} contents differ`];
  }

  if (leftStat.isSymbolicLink()) {
    const leftTarget = fs.readlinkSync(leftPath);
    const rightTarget = fs.readlinkSync(rightPath);
    return leftTarget === rightTarget ? [] : [`${label} symlink targets differ`];
  }

  return [`${label} uses an unsupported file type`];
};

const mirrorStatus = () =>
  execFileSync('git', ['status', '--porcelain', '--untracked-files=all', '--', '.agents/skills'], {
    cwd: repoRoot,
    encoding: 'utf8',
  }).trim();

const differences = compareTrees(source, mirror);
if (checkOnly) {
  if (differences.length > 0) {
    console.error('.agents/skills is not in sync with .claude/skills:');
    for (const difference of differences.slice(0, 20)) {
      console.error(`  - ${difference}`);
    }
    if (differences.length > 20) {
      console.error(`  ...and ${differences.length - 20} more difference(s)`);
    }
    console.error(
      "\nTo fix: move intended skill edits to .claude/skills, then run 'npm run sync-skills' and stage .agents/skills."
    );
    process.exit(1);
  }

  console.log('Skills are in sync: .claude/skills == .agents/skills');
  process.exit(0);
}

const status = mirrorStatus();
if (status) {
  console.error('Refusing to overwrite local .agents/skills changes.');
  console.error(
    'Move the changes to .claude/skills, make both trees identical, or clear .agents/skills changes first.'
  );
  console.error(status);
  process.exit(1);
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
