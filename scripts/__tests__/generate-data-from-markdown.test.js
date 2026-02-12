import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath, pathToFileURL } from 'url';
import { afterEach, describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const scriptSource = path.resolve(__dirname, '../generate-data-from-markdown.js');
const fixturesRoot = path.resolve(__dirname, '../__fixtures__/generate-data');

const tempWorkspaces = [];

const setupWorkspaceFromFixture = (fixtureName) => {
  const fixtureContentDir = path.join(fixturesRoot, fixtureName, 'content');
  const tempDir = fs.mkdtempSync(path.join(repoRoot, '.tmp-generate-data-'));
  tempWorkspaces.push(tempDir);

  fs.cpSync(fixtureContentDir, path.join(tempDir, 'content'), { recursive: true });
  fs.mkdirSync(path.join(tempDir, 'scripts'), { recursive: true });
  fs.copyFileSync(scriptSource, path.join(tempDir, 'scripts', 'generate-data-from-markdown.mjs'));

  return tempDir;
};

const runGenerator = (workspaceDir) => {
  const scriptPath = path.join(workspaceDir, 'scripts', 'generate-data-from-markdown.mjs');
  return spawnSync(process.execPath, [scriptPath], {
    cwd: workspaceDir,
    encoding: 'utf8',
    timeout: 10000,
  });
};

const loadGeneratedModule = async (workspaceDir) => {
  const outputPath = path.join(workspaceDir, 'src', 'data', 'generatedData.js');
  const moduleUrl = `${pathToFileURL(outputPath).href}?t=${Date.now()}-${Math.random()}`;
  return import(moduleUrl);
};

afterEach(() => {
  while (tempWorkspaces.length > 0) {
    const workspace = tempWorkspaces.pop();
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});

describe('generate-data-from-markdown script', () => {
  it('generates output from valid markdown and preserves credit-split + normalized dates', async () => {
    const workspace = setupWorkspaceFromFixture('valid-credit-split-date');

    const result = runGenerator(workspace);
    expect(result.status).toBe(0);

    const generated = await loadGeneratedModule(workspace);
    expect(generated.allDonations).toHaveLength(2);

    const donationsByDonor = Object.fromEntries(generated.allDonations.map((donation) => [donation.donorId, donation]));

    expect(donationsByDonor.donor_a).toMatchObject({
      donorId: 'donor_a',
      donor: 'Donor A',
      recipientId: 'recipient_one',
      recipient: 'Recipient One',
      amount: 1000,
      credit: 0.25,
      date: '2021-05-03',
    });

    expect(donationsByDonor.donor_b).toMatchObject({
      donorId: 'donor_b',
      donor: 'Donor B',
      recipientId: 'recipient_one',
      recipient: 'Recipient One',
      amount: 1000,
      credit: 0.75,
      date: '2021-05-03',
    });

    expect(generated.categoriesById.health.content).toContain('Public Notes');
    expect(generated.categoriesById.health.content).not.toContain('Internal Notes');

    expect(generated.donorsById).not.toHaveProperty('donor_unused');
    expect(generated.recipientsById).not.toHaveProperty('recipient_unused');
    expect(generated.categoriesById).not.toHaveProperty('education');
  });

  it('fails validation when fixture contains missing linked entities', () => {
    const workspace = setupWorkspaceFromFixture('missing-link');
    const result = runGenerator(workspace);
    const output = `${result.stdout}\n${result.stderr}`;

    expect(result.status).not.toBe(0);
    expect(output).toContain('references non-existent category ID "missing_category"');
    expect(output).toContain('Data validation failed');
  });

  it('fails fast on malformed frontmatter with required field errors', () => {
    const workspace = setupWorkspaceFromFixture('malformed-frontmatter');
    const result = runGenerator(workspace);
    const output = `${result.stdout}\n${result.stderr}`;

    expect(result.status).not.toBe(0);
    expect(output).toContain("Category file malformed_category.md is missing required 'id' field.");
  });
});
