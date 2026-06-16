import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { afterEach, describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const scriptSource = path.resolve(__dirname, '../sync-skills.js');
const hookSource = path.resolve(repoRoot, '.husky/pre-commit');

const tempWorkspaces = [];

const run = (command, args, cwd, extraEnv = {}) =>
  spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    timeout: 10000,
    env: { ...process.env, ...extraEnv },
  });

const runGit = (workspace, args) => {
  const result = run('git', args, workspace);
  expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
  return result;
};

const writeFile = (filePath, contents) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
};

const setupWorkspace = ({ includeHook = false } = {}) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'impactlist-sync-skills-'));
  tempWorkspaces.push(tempDir);

  writeFile(path.join(tempDir, 'package.json'), '{ "type": "module" }\n');
  writeFile(path.join(tempDir, '.claude/skills/example/SKILL.md'), 'canonical skill\n');
  writeFile(path.join(tempDir, '.agents/skills/example/SKILL.md'), 'canonical skill\n');
  writeFile(path.join(tempDir, 'scripts/sync-skills.js'), fs.readFileSync(scriptSource, 'utf8'));

  if (includeHook) {
    writeFile(path.join(tempDir, '.husky/pre-commit'), fs.readFileSync(hookSource, 'utf8'));
    writeFile(
      path.join(tempDir, 'bin/npx'),
      `#!/bin/sh
if [ "$1" = "lint-staged" ]; then
  exit 0
fi
echo "unexpected npx command: $*" >&2
exit 1
`
    );
    fs.chmodSync(path.join(tempDir, 'bin/npx'), 0o755);
  }

  runGit(tempDir, ['init', '-q']);
  runGit(tempDir, ['config', 'user.email', 'test@example.com']);
  runGit(tempDir, ['config', 'user.name', 'Test User']);
  runGit(tempDir, ['add', '.']);
  runGit(tempDir, ['commit', '-qm', 'initial skills']);

  return tempDir;
};

const runSyncSkills = (workspace, args = []) => run(process.execPath, ['scripts/sync-skills.js', ...args], workspace);

const combinedOutput = (result) => `${result.stdout}\n${result.stderr}`;

afterEach(() => {
  while (tempWorkspaces.length > 0) {
    const workspace = tempWorkspaces.pop();
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});

describe('sync-skills script', () => {
  it('check mode exits cleanly when the skill trees match', () => {
    const workspace = setupWorkspace();
    const result = runSyncSkills(workspace, ['--check']);

    expect(result.status, combinedOutput(result)).toBe(0);
    expect(result.stdout).toContain('Skills are in sync');
  });

  it('check mode reports divergent files with a remediation hint', () => {
    const workspace = setupWorkspace();
    writeFile(path.join(workspace, '.agents/skills/example/SKILL.md'), 'mirror-only edit\n');

    const result = runSyncSkills(workspace, ['--check']);
    const output = combinedOutput(result);

    expect(result.status, output).not.toBe(0);
    expect(output).toContain('example/SKILL.md contents differ');
    expect(output).toContain("To fix: move intended skill edits to .claude/skills, then run 'npm run sync-skills'");
  });

  it('check mode reports files that exist only in one skill tree', () => {
    const workspace = setupWorkspace();
    fs.rmSync(path.join(workspace, '.agents/skills/example/SKILL.md'));
    writeFile(path.join(workspace, '.agents/skills/extra/SKILL.md'), 'extra mirror skill\n');

    const result = runSyncSkills(workspace, ['--check']);
    const output = combinedOutput(result);

    expect(result.status, output).not.toBe(0);
    expect(output).toContain('example/SKILL.md exists only in .claude/skills');
    expect(output).toContain('extra/SKILL.md exists only in .agents/skills');
  });

  it('syncs canonical skills into a clean mirror', () => {
    const workspace = setupWorkspace();
    writeFile(path.join(workspace, '.claude/skills/example/SKILL.md'), 'updated canonical skill\n');

    const result = runSyncSkills(workspace);

    expect(result.status, combinedOutput(result)).toBe(0);
    expect(fs.readFileSync(path.join(workspace, '.agents/skills/example/SKILL.md'), 'utf8')).toBe(
      'updated canonical skill\n'
    );
  });

  it('refuses to overwrite a dirty mirror', () => {
    const workspace = setupWorkspace();
    writeFile(path.join(workspace, '.claude/skills/example/SKILL.md'), 'updated canonical skill\n');
    writeFile(path.join(workspace, '.agents/skills/example/SKILL.md'), 'local mirror edit\n');

    const result = runSyncSkills(workspace);
    const output = combinedOutput(result);

    expect(result.status, output).not.toBe(0);
    expect(output).toContain('Refusing to overwrite local .agents/skills changes.');
    expect(fs.readFileSync(path.join(workspace, '.agents/skills/example/SKILL.md'), 'utf8')).toBe(
      'local mirror edit\n'
    );
  });

  it('rejects unknown arguments without printing a stack trace', () => {
    const workspace = setupWorkspace();
    const result = runSyncSkills(workspace, ['--bogus']);
    const output = combinedOutput(result);

    expect(result.status, output).not.toBe(0);
    expect(output).toContain('sync-skills: unknown argument: --bogus');
    expect(output).toContain('Usage: npm run sync-skills -- [--check]');
    expect(output).not.toContain('    at ');
  });
});

describe('skill mirror pre-commit guard', () => {
  it('fails when a staged skill edit is accompanied by an untracked skill file', () => {
    const workspace = setupWorkspace({ includeHook: true });
    writeFile(path.join(workspace, '.claude/skills/example/SKILL.md'), 'staged canonical edit\n');
    runGit(workspace, ['add', '.claude/skills/example/SKILL.md']);
    writeFile(path.join(workspace, '.claude/skills/new-skill/SKILL.md'), 'untracked canonical skill\n');

    const result = run('sh', ['.husky/pre-commit'], workspace, {
      PATH: `${path.join(workspace, 'bin')}:${process.env.PATH}`,
    });
    const output = combinedOutput(result);

    expect(result.status, output).not.toBe(0);
    expect(output).toContain('pre-commit: skill files have unstaged changes while skill edits are staged.');
    expect(output).toContain('Untracked skill files:');
    expect(output).toContain('.claude/skills/new-skill/SKILL.md');
  });
});
