import fs from 'fs';
import os from 'os';
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

// Pure shared modules the generator imports — they must exist in the temp
// workspace for the script's relative imports to resolve.
const SHARED_MODULES = [
  'src/utils/dataValidation.js',
  'src/utils/constants.js',
  'src/utils/globalParameterRules.js',
  'scripts/siteOrigin.js',
];

const setupWorkspaceFromFixture = (fixtureName) => {
  const fixtureContentDir = path.join(fixturesRoot, fixtureName, 'content');
  // The OS temp dir, NOT the repo root: dev-server file watchers (vite,
  // vercel dev) watch the repo recursively, and workspaces flickering in and
  // out of existence mid-run crash their directory scans with ENOENT.
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'impactlist-generate-data-'));
  tempWorkspaces.push(tempDir);

  fs.cpSync(fixtureContentDir, path.join(tempDir, 'content'), { recursive: true });
  fs.mkdirSync(path.join(tempDir, 'scripts'), { recursive: true });
  fs.copyFileSync(scriptSource, path.join(tempDir, 'scripts', 'generate-data-from-markdown.mjs'));
  for (const modulePath of SHARED_MODULES) {
    const target = path.join(tempDir, modulePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(repoRoot, modulePath), target);
  }
  // The copied script resolves its bare imports (gray-matter, glob) through
  // node's upward node_modules walk, which finds nothing under the OS temp
  // dir — link the repo's install into the workspace. afterEach's rmSync
  // unlinks the symlink without following it.
  fs.symlinkSync(path.join(repoRoot, 'node_modules'), path.join(tempDir, 'node_modules'), 'dir');

  return tempDir;
};

const runGenerator = (workspaceDir, extraEnv = {}) => {
  const scriptPath = path.join(workspaceDir, 'scripts', 'generate-data-from-markdown.mjs');
  return spawnSync(process.execPath, [scriptPath], {
    cwd: workspaceDir,
    encoding: 'utf8',
    timeout: 10000,
    env: { ...process.env, ...extraEnv },
  });
};

const loadGeneratedModule = async (workspaceDir) => {
  // No cache-busting query needed: every workspace path is unique (mkdtemp),
  // and vite-node mangles `?t=` queries on files outside the project root.
  const outputPath = path.join(workspaceDir, 'src', 'data', 'generatedData.js');
  return import(pathToFileURL(outputPath).href);
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
    expect(generated.donations).toHaveLength(2);

    const donationsByDonor = Object.fromEntries(generated.donations.map((donation) => [donation.donorId, donation]));

    expect(donationsByDonor.donor_a).toMatchObject({
      donorId: 'donor_a',
      donor: 'Donor A',
      recipientId: 'recipient_one',
      recipient: 'Recipient One',
      amount: 1000,
      credit: 0.25,
      creditedAmount: 250,
      date: '2021-05-03',
    });

    expect(donationsByDonor.donor_b).toMatchObject({
      donorId: 'donor_b',
      donor: 'Donor B',
      recipientId: 'recipient_one',
      recipient: 'Recipient One',
      amount: 1000,
      credit: 0.75,
      creditedAmount: 750,
      date: '2021-05-03',
    });

    expect(generated.categoriesById.health.content).toContain('Public Notes');
    expect(generated.categoriesById.health.content).not.toContain('Internal Notes');
    expect(generated.donorsById.donor_a).toMatchObject({
      about: 'Donor A bio.',
      birthDate: '1980-02-03',
    });
    expect(generated.curatedAssumptionProfilesById['long-horizon']).toMatchObject({
      id: 'long-horizon',
      name: 'Long Horizon',
      description: 'Extends the time horizon and improves the health category.',
      sortOrder: 5,
      assumptions: {
        globalParameters: {
          timeLimit: 250,
        },
        categories: {
          health: {
            effects: [
              {
                effectId: 'health_effect',
                costPerQALY: 80,
              },
            ],
          },
        },
      },
    });
    expect(generated.curatedAssumptionProfilesById['long-horizon'].content).toContain('Long-horizon rationale.');
    expect(generated.curatedAssumptionProfilesById['long-horizon'].content).not.toContain('Internal Notes');

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

  it('fails fast on invalid donor birth dates', () => {
    const workspace = setupWorkspaceFromFixture('invalid-birth-date');
    const result = runGenerator(workspace);
    const output = `${result.stdout}\n${result.stderr}`;

    expect(result.status).not.toBe(0);
    expect(output).toContain("Donor file donor_a.md has invalid 'birthDate'");
  });

  it('fails validation when a curated assumptions profile references an unknown effect', () => {
    const workspace = setupWorkspaceFromFixture('invalid-curated-profile');
    const result = runGenerator(workspace);
    const output = `${result.stdout}\n${result.stderr}`;

    expect(result.status).not.toBe(0);
    expect(output).toContain('references unknown effect "missing_effect" in category "health"');
  });
});

describe('donation validation', () => {
  const writeDonationsFile = (workspaceDir, fileName, contents) => {
    fs.writeFileSync(path.join(workspaceDir, 'content', 'donations', fileName), contents);
  };

  const runGeneratorExpectingError = (workspaceDir, expectedMessage) => {
    const result = runGenerator(workspaceDir);
    const output = `${result.stdout}\n${result.stderr}`;

    expect(result.status, output).not.toBe(0);
    expect(output).toContain(expectedMessage);
    return output;
  };

  const validDonation = `---
donations:
  - recipient: recipient_one
    amount: 500
    date: 2022-01-01
    credit:
      donor_a: 1.0
---
`;

  it('fails when the same donation appears in two files', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeDonationsFile(workspace, 'second_file.md', validDonation);

    const output = runGeneratorExpectingError(workspace, 'is an exact duplicate of a donation in');
    expect(output).toContain('donor_a.md');
    expect(output).toContain('second_file.md');
  });

  it('fails when the same event is recorded in two files with different credit', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeDonationsFile(workspace, 'donor_b.md', validDonation.replace('donor_a: 1.0', 'donor_b: 1.0'));

    const output = runGeneratorExpectingError(workspace, 'on recipient, date, and amount but with different credit');
    expect(output).toContain('donor_a.md');
    expect(output).toContain('donor_b.md');
    expect(output).toContain("merge them into a single entry (in one file) whose 'credit' map covers all donors");
  });

  it('allows same-looking donations from different donors when disambiguated with distinct notes', async () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeDonationsFile(
      workspace,
      'donor_a.md',
      validDonation.replace('donor_a: 1.0', "donor_a: 1.0\n    notes: 'Donor A gift reported by the recipient.'")
    );
    writeDonationsFile(
      workspace,
      'donor_b.md',
      validDonation.replace(
        'donor_a: 1.0',
        "donor_b: 1.0\n    notes: 'Separate donor B gift of the same size on the same day.'"
      )
    );

    const result = runGenerator(workspace);
    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);

    const generated = await loadGeneratedModule(workspace);
    expect(generated.donations).toHaveLength(2);
  });

  it('allows identical donations that are disambiguated with distinct notes', async () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeDonationsFile(
      workspace,
      'donor_a.md',
      `---
donations:
  - recipient: recipient_one
    amount: 500
    date: 2022-01-01
    credit:
      donor_a: 1.0
    notes: 'First of two identical grants in the source table.'

  - recipient: recipient_one
    amount: 500
    date: 2022-01-01
    credit:
      donor_a: 1.0
    notes: 'Second of two identical grants in the source table.'
---
`
    );

    const result = runGenerator(workspace);
    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);

    const generated = await loadGeneratedModule(workspace);
    expect(generated.donations).toHaveLength(2);
  });

  it('fails on a rolled-over calendar date that YAML would silently accept', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeDonationsFile(workspace, 'donor_a.md', validDonation.replace('date: 2022-01-01', 'date: 2022-02-30'));

    runGeneratorExpectingError(workspace, 'Expected a real calendar date.');
  });

  it('fails on a date that is not written as YYYY-MM-DD', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeDonationsFile(workspace, 'donor_a.md', validDonation.replace('date: 2022-01-01', 'date: "May 3, 2021 UTC"'));

    runGeneratorExpectingError(workspace, 'Expected YYYY-MM-DD.');
  });

  it('accepts real four-digit dates without an arbitrary year range', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeDonationsFile(workspace, 'donor_a.md', validDonation.replace('date: 2022-01-01', 'date: 0099-01-01'));

    const result = runGenerator(workspace);
    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
  });

  it('fails on a non-numeric amount', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeDonationsFile(workspace, 'donor_a.md', validDonation.replace('amount: 500', "amount: '500'"));

    runGeneratorExpectingError(workspace, "must have a positive numeric 'amount'");
  });

  it('fails when credit values do not sum to 1', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeDonationsFile(
      workspace,
      'donor_a.md',
      validDonation.replace('donor_a: 1.0', 'donor_a: 0.5\n      donor_b: 0.6')
    );

    runGeneratorExpectingError(workspace, 'instead of 1. Credit must describe how 100% of the donation');
  });

  it('fails on an empty credit object instead of silently dropping the donation', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeDonationsFile(workspace, 'donor_a.md', validDonation.replace('credit:\n      donor_a: 1.0', 'credit: {}'));

    runGeneratorExpectingError(workspace, "must have a non-empty 'credit' object");
  });

  it('fails when a donations file has no donations array', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeDonationsFile(workspace, 'donor_a.md', '---\ndonation:\n  - recipient: recipient_one\n---\n');

    runGeneratorExpectingError(workspace, "must contain a 'donations' array");
  });

  it('fails on unknown donation fields', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeDonationsFile(
      workspace,
      'donor_a.md',
      validDonation.replace('credit:', "sorce: 'https://example.com'\n    credit:")
    );

    runGeneratorExpectingError(workspace, "has unknown field 'sorce'");
  });
});

describe('pipeline strictness', () => {
  const writeContentFile = (workspaceDir, relativePath, contents) => {
    const target = path.join(workspaceDir, 'content', relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, contents);
  };

  const runGeneratorExpectingError = (workspaceDir, expectedMessage) => {
    const result = runGenerator(workspaceDir);
    const output = `${result.stdout}\n${result.stderr}`;

    expect(result.status, output).not.toBe(0);
    expect(output).toContain(expectedMessage);
    return output;
  };

  it('fails when two files declare the same entity id', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'categories/health_copy.md',
      '---\nid: health\nname: Health Copy\neffects:\n  - effectId: health_effect\n    startTime: 0\n    windowLength: 10\n    costPerQALY: 100\n---\n'
    );

    const output = runGeneratorExpectingError(workspace, 'Duplicate category id "health"');
    expect(output).toContain('health.md');
    expect(output).toContain('health_copy.md');
  });

  it('fails before assignment when an entity uses a prototype-key id', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'categories/unsafe.md',
      '---\nid: constructor\nname: Unsafe\neffects:\n  - effectId: unsafe_effect\n    startTime: 0\n    windowLength: 10\n    costPerQALY: 100\n---\n'
    );

    runGeneratorExpectingError(workspace, 'uses reserved object key "constructor"');
  });

  it('fails on duplicate category effect IDs instead of leaving lookup order ambiguous', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'categories/health.md',
      '---\nid: health\nname: Health\neffects:\n  - effectId: standard\n    startTime: 0\n    windowLength: 10\n    costPerQALY: 100\n  - effectId: standard\n    startTime: 1\n    windowLength: 5\n    costPerQALY: 200\n---\n'
    );

    runGeneratorExpectingError(workspace, 'duplicate effectId "standard"');
  });

  it('fails on duplicate recipient category IDs before object conversion can overwrite one', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'recipients/recipient_one.md',
      '---\nid: recipient_one\nname: Recipient One\ncategories:\n  - id: health\n    fraction: 0.5\n  - id: health\n    fraction: 0.5\n---\n'
    );

    runGeneratorExpectingError(workspace, 'duplicate category id "health"');
  });

  it('fails with file context when an effects entry or map has the wrong shape', () => {
    const categoryWorkspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      categoryWorkspace,
      'categories/health.md',
      '---\nid: health\nname: Health\neffects:\n  - not-an-object\n---\n'
    );
    runGeneratorExpectingError(categoryWorkspace, 'Category file health.md, effect #1 must be an object');

    const recipientWorkspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      recipientWorkspace,
      'recipients/recipient_one.md',
      '---\nid: recipient_one\nname: Recipient One\ncategories:\n  - id: health\n    fraction: 1\n    effects:\n      - effectId: health_effect\n        overrides: []\n---\n'
    );
    runGeneratorExpectingError(recipientWorkspace, "must use an object for 'overrides'");
  });

  it('rejects non-finite and ambiguous effects while allowing tiny finite values', () => {
    const nonFiniteWorkspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      nonFiniteWorkspace,
      'categories/health.md',
      '---\nid: health\nname: Health\neffects:\n  - effectId: standard\n    startTime: .inf\n    windowLength: 10\n    costPerQALY: 100\n---\n'
    );
    runGeneratorExpectingError(nonFiniteWorkspace, 'must be a finite number');

    const underflowWorkspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      underflowWorkspace,
      'categories/health.md',
      '---\nid: health\nname: Health\neffects:\n  - effectId: standard\n    startTime: 0\n    windowLength: 10\n    costPerQALY: 5e-324\n---\n'
    );
    const underflowResult = runGenerator(underflowWorkspace);
    expect(underflowResult.status, `${underflowResult.stdout}\n${underflowResult.stderr}`).toBe(0);

    const ambiguousWorkspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      ambiguousWorkspace,
      'categories/health.md',
      '---\nid: health\nname: Health\neffects:\n  - effectId: standard\n    startTime: 0\n    windowLength: 10\n    costPerQALY: 100\n    costPerMicroprobability: 100\n    populationFractionAffected: 1\n    qalyImprovementPerYear: 1\n---\n'
    );
    runGeneratorExpectingError(ambiguousWorkspace, "must have exactly one of 'costPerQALY'");
  });

  it('fails on unknown recipient fields and override/multiplier conflicts', () => {
    const unknownFieldWorkspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      unknownFieldWorkspace,
      'recipients/recipient_one.md',
      '---\nid: recipient_one\nname: Recipient One\ncategories:\n  - id: health\n    fraction: 1\n    effects:\n      - effectId: health_effect\n        overrides:\n          madeUpField: 2\n---\n'
    );
    runGeneratorExpectingError(unknownFieldWorkspace, 'overrides references unknown numeric field "madeUpField"');

    const conflictWorkspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      conflictWorkspace,
      'recipients/recipient_one.md',
      '---\nid: recipient_one\nname: Recipient One\ncategories:\n  - id: health\n    fraction: 1\n    effects:\n      - effectId: health_effect\n        overrides:\n          costPerQALY: 50\n        multipliers:\n          costPerQALY: 2\n---\n'
    );
    runGeneratorExpectingError(conflictWorkspace, 'cannot have both an override and a multiplier');
  });

  it('allows finite negative costs in authored category content', async () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'categories/health.md',
      '---\nid: health\nname: Health\neffects:\n  - effectId: health_effect\n    startTime: 0\n    windowLength: 10\n    costPerQALY: -100\n---\n'
    );

    const result = runGenerator(workspace);
    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
    const generated = await loadGeneratedModule(workspace);
    expect(generated.categoriesById.health.effects[0].costPerQALY).toBe(-100);
  });

  it('allows large finite curated inputs when their recipient combination remains finite', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'recipients/recipient_one.md',
      '---\nid: recipient_one\nname: Recipient One\ncategories:\n  - id: health\n    fraction: 1\n    effects:\n      - effectId: health_effect\n        multipliers:\n          windowLength: 2\n---\n'
    );
    writeContentFile(
      workspace,
      'assumptions/profiles/overflow.md',
      '---\nid: overflow\nname: Overflow\nassumptions:\n  categories:\n    health:\n      effects:\n        - effectId: health_effect\n          windowLength: 6755399441055743\n---\n'
    );

    const result = runGenerator(workspace);
    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);

    writeContentFile(
      workspace,
      'assumptions/profiles/overflow.md',
      '---\nid: overflow\nname: Overflow\nassumptions:\n  categories:\n    health:\n      effects:\n        - effectId: health_effect\n          windowLength: 1e308\n---\n'
    );
    runGeneratorExpectingError(workspace, 'produces a non-finite value');
  });

  it('fails on unknown frontmatter keys instead of silently ignoring them', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'donors/donor_a.md',
      '---\nid: donor_a\nname: Donor A\nbirthdate: 1980-02-03\nnetWorth: 1000000\nabout: Donor A bio.\n---\n'
    );

    runGeneratorExpectingError(workspace, "has unknown field 'birthdate'");
  });

  it('fails on internal-notes heading variants that would be published', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'categories/health.md',
      '---\nid: health\nname: Health\neffects:\n  - effectId: health_effect\n    startTime: 0\n    windowLength: 10\n    costPerQALY: 100\n---\n\n# Public Notes\n\nFine.\n\n## Internal Notes\n\nSecret editorial notes.\n'
    );

    runGeneratorExpectingError(workspace, 'internal-notes heading variant');
  });

  it('fails on unreplaced {{PLACEHOLDER}} tokens', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'recipients/recipient_one.md',
      '---\nid: recipient_one\nname: Recipient One\ncategories:\n  - id: health\n    fraction: 1\n---\n\nSee {{TYPO_VARIABLE}} for details.\n'
    );

    runGeneratorExpectingError(workspace, 'unreplaced placeholder {{TYPO_VARIABLE}}');
  });

  it('replaces {{CHALLENGE_ASSUMPTION:n}} with a pre-filled challenge-form link', async () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'categories/health.md',
      '---\nid: health\nname: Health\neffects:\n  - effectId: health_effect\n    startTime: 0\n    windowLength: 10\n    costPerQALY: 100\n---\n\n## Assumptions\n\n1. First assumption. {{CHALLENGE_ASSUMPTION:1}}\n2. Second assumption. {{CHALLENGE_ASSUMPTION:2}}\n'
    );

    const result = runGenerator(workspace);
    expect(result.status).toBe(0);

    const generated = await loadGeneratedModule(workspace);
    expect(generated.categoriesById.health.content).toContain(
      '[Challenge assumption](https://docs.google.com/forms/d/e/1FAIpQLSeyolsqiakbi83k8GKUj91_sWbuxu1rW-RKTnSOZ-8IU7veNQ/viewform?usp=pp_url&entry.899420459=Challenging%20assumption%202%20on%20the%20%27Health%27%20cause%20page%3A%0A "challenge-assumption:Challenge assumption 2")'
    );
  });

  it('supports challenge tokens at the end of multiline assumption items', async () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'categories/health.md',
      '---\nid: health\nname: Health\neffects:\n  - effectId: health_effect\n    startTime: 0\n    windowLength: 10\n    costPerQALY: 100\n---\n\n## Assumptions\n\n1. First assumption starts on one line\n   and continues onto another before its token. {{CHALLENGE_ASSUMPTION:1}}\n2. Second assumption. {{CHALLENGE_ASSUMPTION:2}}\n'
    );

    const result = runGenerator(workspace);
    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);

    const generated = await loadGeneratedModule(workspace);
    expect(generated.categoriesById.health.content).toContain(
      'and continues onto another before its token. [Challenge assumption]('
    );
    expect(generated.categoriesById.health.content).not.toContain('{{CHALLENGE_ASSUMPTION:1}}');
  });

  it('labels tokens with their enclosing section on pages with several Assumptions sections', async () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'categories/health.md',
      '---\nid: health\nname: Health\neffects:\n  - effectId: health_effect\n    startTime: 0\n    windowLength: 10\n    costPerQALY: 100\n---\n\n## Effect 1: standard-mundane\n\n### Assumptions\n\n1. First assumption. {{CHALLENGE_ASSUMPTION:1:Effect 1: standard-mundane}}\n\n## Effect 2: standard-utopia\n\n### Assumptions\n\n1. Other first assumption. {{CHALLENGE_ASSUMPTION:1:Effect 2: standard-utopia}}\n'
    );

    const result = runGenerator(workspace);
    expect(result.status).toBe(0);

    const generated = await loadGeneratedModule(workspace);
    // The section label lands in both the pre-filled text and the accessible label.
    expect(generated.categoriesById.health.content).toContain(
      '[Challenge assumption](https://docs.google.com/forms/d/e/1FAIpQLSeyolsqiakbi83k8GKUj91_sWbuxu1rW-RKTnSOZ-8IU7veNQ/viewform?usp=pp_url&entry.899420459=Challenging%20assumption%201%20%28under%20%27Effect%201%3A%20standard-mundane%27%29%20on%20the%20%27Health%27%20cause%20page%3A%0A "challenge-assumption:Challenge assumption 1 (under \'Effect 1: standard-mundane\')")'
    );
  });

  it('fails when a numbered assumption is missing its challenge token', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'categories/health.md',
      '---\nid: health\nname: Health\neffects:\n  - effectId: health_effect\n    startTime: 0\n    windowLength: 10\n    costPerQALY: 100\n---\n\n## Assumptions\n\n1. First assumption. {{CHALLENGE_ASSUMPTION:1}}\n2. Second assumption, token forgotten.\n'
    );

    runGeneratorExpectingError(workspace, 'is missing its {{CHALLENGE_ASSUMPTION:2}} token');
  });

  it('fails when a challenge token number does not match its assumption', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'categories/health.md',
      '---\nid: health\nname: Health\neffects:\n  - effectId: health_effect\n    startTime: 0\n    windowLength: 10\n    costPerQALY: 100\n---\n\n## Assumptions\n\n1. First assumption. {{CHALLENGE_ASSUMPTION:7}}\n'
    );

    runGeneratorExpectingError(workspace, 'carries mismatched token {{CHALLENGE_ASSUMPTION:7}}');
  });

  it('fails on a challenge token outside an Assumptions section', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'categories/health.md',
      '---\nid: health\nname: Health\neffects:\n  - effectId: health_effect\n    startTime: 0\n    windowLength: 10\n    costPerQALY: 100\n---\n\n## Details\n\nSee also {{CHALLENGE_ASSUMPTION:1}} in prose.\n'
    );

    runGeneratorExpectingError(
      workspace,
      "only allowed at the end of a numbered item's last line inside an Assumptions section"
    );
  });

  it('fails when a token label does not match the enclosing section heading', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'categories/health.md',
      '---\nid: health\nname: Health\neffects:\n  - effectId: health_effect\n    startTime: 0\n    windowLength: 10\n    costPerQALY: 100\n---\n\n## Effect 1: standard-mundane\n\n### Assumptions\n\n1. First assumption. {{CHALLENGE_ASSUMPTION:1:Stale heading}}\n\n## Effect 2: standard-utopia\n\n### Assumptions\n\n1. Other first assumption. {{CHALLENGE_ASSUMPTION:1:Effect 2: standard-utopia}}\n'
    );

    runGeneratorExpectingError(
      workspace,
      'expected {{CHALLENGE_ASSUMPTION:1:Effect 1: standard-mundane}}, found {{CHALLENGE_ASSUMPTION:1:Stale heading}}'
    );
  });

  it('fails on {{CHALLENGE_ASSUMPTION:n}} in content types without challenge links', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'donors/donor_a.md',
      '---\nid: donor_a\nname: Donor A\nbirthDate: 1980-02-03\nnetWorth: 1000000\nabout: Donor A bio.\n---\n\nBio text. {{CHALLENGE_ASSUMPTION:1}}\n'
    );

    runGeneratorExpectingError(
      workspace,
      'contains {{CHALLENGE_ASSUMPTION:1}}, which is only supported in category, recipient, and assumption files'
    );
  });

  it('injects the page feedback note on authored justifications and builds page-specific feedback buttons', async () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    // No blank line between heading and prose: the injected note still must
    // not merge into the prose paragraph.
    writeContentFile(
      workspace,
      'categories/health.md',
      '---\nid: health\nname: Health\neffects:\n  - effectId: health_effect\n    startTime: 0\n    windowLength: 10\n    costPerQALY: 100\n---\n\n# Justification of cost per life\nAuthored analysis text.\n\n{{CONTRIBUTION_NOTE}}\n'
    );
    // Headingless body: the note goes above the prose, again as its own
    // paragraph.
    writeContentFile(
      workspace,
      'assumptions/test_assumption.md',
      '---\nid: test_assumption\nname: Test Assumption\n---\n\nAuthored assumption text.\n'
    );
    // Any full-line shared token counts as boilerplate, not just the classic
    // default-justification pair — a page of stock notes has nothing
    // page-specific to challenge.
    writeContentFile(
      workspace,
      'recipients/recipient_one.md',
      '---\nid: recipient_one\nname: Recipient One\ncategories:\n  - id: health\n    fraction: 1\n---\n\n# Justification of cost per life\n\n{{RECIPIENT_DEFAULT_JUSTIFICATION}}\n\n{{GLOBAL_ASSUMPTIONS_NOTE}}\n\n{{STANDARD_QALY_METHOD_NOTE}}\n\n{{CONTRIBUTION_NOTE}}\n'
    );

    const result = runGenerator(workspace);
    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);

    const generated = await loadGeneratedModule(workspace);
    const healthFeedbackUrl =
      'https://docs.google.com/forms/d/e/1FAIpQLSeyolsqiakbi83k8GKUj91_sWbuxu1rW-RKTnSOZ-8IU7veNQ/viewform?usp=pp_url&entry.899420459=Feedback%20about%20the%20%27Health%27%20cause%20page%3A%0A';

    // The note lands directly below the leading heading, chip-styled via the
    // challenge-assumption title marker — and stays its own paragraph, with
    // a blank line separating it from the prose that followed the heading.
    expect(generated.categoriesById.health.content).toContain(
      `# Justification of cost per life\n\n_If you think anything on this page is wrong, please [submit feedback](${healthFeedbackUrl} "challenge-assumption:Submit feedback about this page")._\n\nAuthored analysis text.`
    );

    // Headingless assumption body: note first, prose second, separate
    // paragraphs.
    expect(generated.assumptionsById.test_assumption.content).toContain(
      'entry.899420459=Feedback%20about%20the%20%27Test%20Assumption%27%20assumption%20page%3A%0A'
    );
    expect(generated.assumptionsById.test_assumption.content).toContain(
      '"challenge-assumption:Submit feedback about this page")._\n\nAuthored assumption text.'
    );
    // CONTRIBUTION_NOTE now carries the same page-prefilled button.
    expect(generated.categoriesById.health.content).toContain(
      `You can [submit feedback](${healthFeedbackUrl} "challenge-assumption:Submit feedback about this page") or get more involved [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._`
    );

    // Boilerplate-only bodies get no top note, but their contribution note
    // still points at their own page.
    expect(generated.recipientsById.recipient_one.content).not.toContain('If you think anything on this page is wrong');
    expect(generated.recipientsById.recipient_one.content).toContain(
      'entry.899420459=Feedback%20about%20the%20%27Recipient%20One%27%20recipient%20page%3A%0A'
    );
  });

  it('fails on {{CONTRIBUTION_NOTE}} in content types without page context', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'donors/donor_a.md',
      '---\nid: donor_a\nname: Donor A\nbirthDate: 1980-02-03\nnetWorth: 1000000\nabout: Donor A bio.\n---\n\nBio text. {{CONTRIBUTION_NOTE}}\n'
    );

    runGeneratorExpectingError(
      workspace,
      'contains {{CONTRIBUTION_NOTE}}, which is only supported in category, recipient, and assumption files'
    );
  });

  it('fails on a malformed {{CHALLENGE_ASSUMPTION}} argument instead of shipping it as text', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'categories/health.md',
      '---\nid: health\nname: Health\neffects:\n  - effectId: health_effect\n    startTime: 0\n    windowLength: 10\n    costPerQALY: 100\n---\n\n1. First assumption. {{CHALLENGE_ASSUMPTION:one}}\n'
    );

    runGeneratorExpectingError(workspace, 'unreplaced placeholder {{CHALLENGE_ASSUMPTION:one}}');
  });

  it('fails the build when category fractions do not sum to 1', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'categories/education.md',
      '---\nid: education\nname: Education\neffects:\n  - effectId: edu_effect\n    startTime: 0\n    windowLength: 10\n    costPerQALY: 200\n---\n'
    );
    writeContentFile(
      workspace,
      'recipients/recipient_one.md',
      '---\nid: recipient_one\nname: Recipient One\ncategories:\n  - id: health\n    fraction: 0.5\n  - id: education\n    fraction: 0.4\n---\n'
    );

    runGeneratorExpectingError(workspace, 'do not sum to 1');
  });

  it('rejects unsupported discount rates while allowing rates above 100% and tiny finite positive values', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'globalParameters.md',
      '---\ndiscountRate: 10.01\npopulationGrowthRate: 0.01\ntimeLimit: 100\npopulationLimit: 2\ncurrentPopulation: 8000000000\nyearsPerLife: 50\n---\n'
    );

    runGeneratorExpectingError(workspace, 'Discount rate must be no greater than 1,000%');

    const underflowWorkspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      underflowWorkspace,
      'globalParameters.md',
      '---\ndiscountRate: 1.5\npopulationGrowthRate: 0.01\ntimeLimit: 100\npopulationLimit: 2\ncurrentPopulation: 8000000000\nyearsPerLife: 5e-324\n---\n'
    );
    const underflowResult = runGenerator(underflowWorkspace);
    expect(underflowResult.status, `${underflowResult.stdout}\n${underflowResult.stderr}`).toBe(0);
  });

  it('fails when a curated profile references a recipient that is filtered out for having no donations', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'recipients/recipient_unfunded.md',
      '---\nid: recipient_unfunded\nname: Recipient Unfunded\ncategories:\n  - id: health\n    fraction: 1\n---\n'
    );
    writeContentFile(
      workspace,
      'assumptions/profiles/test_profile.md',
      '---\nid: test-profile\nname: Test Profile\nassumptions:\n  recipients:\n    recipient_unfunded:\n      categories:\n        health:\n          effects:\n            - effectId: health_effect\n              overrides:\n                costPerQALY: 50\n---\n'
    );

    runGeneratorExpectingError(workspace, 'references unknown recipient "recipient_unfunded"');
  });

  it('accepts curated profiles that customize recipients with their own default effects', async () => {
    // Regression test: the recipient default effect entry is a wrapper
    // ({effectId, overrides, multipliers}), and field legality must be
    // checked against the base category effect — this used to hard-fail with
    // "references unknown field".
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'recipients/recipient_one.md',
      '---\nid: recipient_one\nname: Recipient One\ncategories:\n  - id: health\n    fraction: 1\n    effects:\n      - effectId: health_effect\n        multipliers:\n          costPerQALY: 4\n---\n'
    );
    writeContentFile(
      workspace,
      'assumptions/profiles/test_profile.md',
      '---\nid: test-profile\nname: Test Profile\nassumptions:\n  recipients:\n    recipient_one:\n      categories:\n        health:\n          effects:\n            - effectId: health_effect\n              multipliers:\n                costPerQALY: 2\n---\n'
    );

    const result = runGenerator(workspace);
    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);

    const generated = await loadGeneratedModule(workspace);
    const profile = generated.curatedAssumptionProfilesById['test-profile'];
    expect(profile.assumptions.recipients.recipient_one.categories.health.effects[0].multipliers.costPerQALY).toBe(2);
  });

  it('keeps a curated base-value override that replaces a recipient default multiplier', async () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'recipients/recipient_one.md',
      '---\nid: recipient_one\nname: Recipient One\ncategories:\n  - id: health\n    fraction: 1\n    effects:\n      - effectId: health_effect\n        multipliers:\n          costPerQALY: 4\n---\n'
    );
    writeContentFile(
      workspace,
      'assumptions/profiles/test_profile.md',
      '---\nid: test-profile\nname: Test Profile\nassumptions:\n  recipients:\n    recipient_one:\n      categories:\n        health:\n          effects:\n            - effectId: health_effect\n              overrides:\n                costPerQALY: 100\n---\n'
    );

    const result = runGenerator(workspace);
    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);

    const generated = await loadGeneratedModule(workspace);
    expect(
      generated.curatedAssumptionProfilesById['test-profile'].assumptions.recipients.recipient_one.categories.health
        .effects[0].overrides
    ).toEqual({ costPerQALY: 100 });
  });

  it('keeps a curated 1x multiplier that replaces a recipient default override', async () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'recipients/recipient_one.md',
      '---\nid: recipient_one\nname: Recipient One\ncategories:\n  - id: health\n    fraction: 1\n    effects:\n      - effectId: health_effect\n        overrides:\n          costPerQALY: 50\n---\n'
    );
    writeContentFile(
      workspace,
      'assumptions/profiles/test_profile.md',
      '---\nid: test-profile\nname: Test Profile\nassumptions:\n  recipients:\n    recipient_one:\n      categories:\n        health:\n          effects:\n            - effectId: health_effect\n              multipliers:\n                costPerQALY: 1\n---\n'
    );

    const result = runGenerator(workspace);
    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);

    const generated = await loadGeneratedModule(workspace);
    expect(
      generated.curatedAssumptionProfilesById['test-profile'].assumptions.recipients.recipient_one.categories.health
        .effects[0].multipliers
    ).toEqual({ costPerQALY: 1 });
  });

  it('keeps complete curated override maps when recipient defaults also have overrides', async () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'recipients/recipient_one.md',
      '---\nid: recipient_one\nname: Recipient One\ncategories:\n  - id: health\n    fraction: 1\n    effects:\n      - effectId: health_effect\n        overrides:\n          startTime: 3\n          costPerQALY: 120\n---\n'
    );
    writeContentFile(
      workspace,
      'assumptions/profiles/test_profile.md',
      '---\nid: test-profile\nname: Test Profile\nassumptions:\n  recipients:\n    recipient_one:\n      categories:\n        health:\n          effects:\n            - effectId: health_effect\n              overrides:\n                startTime: 3\n                costPerQALY: 999\n---\n'
    );

    const result = runGenerator(workspace);
    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);

    const generated = await loadGeneratedModule(workspace);
    expect(
      generated.curatedAssumptionProfilesById['test-profile'].assumptions.recipients.recipient_one.categories.health
        .effects[0].overrides
    ).toEqual({ startTime: 3, costPerQALY: 999 });
  });

  it('fails on unknown curated-profile frontmatter keys', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'assumptions/profiles/test_profile.md',
      '---\nid: test-profile\nname: Test Profile\ndescripton: typo\nassumptions:\n  categories:\n    health:\n      effects:\n        - effectId: health_effect\n          costPerQALY: 50\n---\n'
    );

    runGeneratorExpectingError(workspace, "has unknown field 'descripton'");
  });

  it('fails on unknown keys nested inside curated-profile entries', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'assumptions/profiles/test_profile.md',
      '---\nid: test-profile\nname: Test Profile\nassumptions:\n  categories:\n    health:\n      effects:\n        - effectId: health_effect\n          costPerQALY: 50\n      extraKey: 1\n---\n'
    );

    runGeneratorExpectingError(workspace, "has unknown field 'extraKey'");
  });

  it('fails on non-boolean disabled values in curated profiles', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'assumptions/profiles/test_profile.md',
      '---\nid: test-profile\nname: Test Profile\nassumptions:\n  categories:\n    health:\n      effects:\n        - effectId: health_effect\n          disabled: "false"\n---\n'
    );

    runGeneratorExpectingError(workspace, "must use a boolean for 'disabled'");
  });

  it('emits sitemap.xml and robots.txt with entity URLs from the configured origin', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');

    // Trailing slash exercises the origin normalization.
    const result = runGenerator(workspace, { SITE_ORIGIN: 'https://example.org/' });
    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);

    const sitemap = fs.readFileSync(path.join(workspace, 'public', 'sitemap.xml'), 'utf8');
    expect(sitemap).toContain('<loc>https://example.org/</loc>');
    expect(sitemap).toContain('<loc>https://example.org/donor/donor_a</loc>');
    expect(sitemap).toContain('<loc>https://example.org/recipient/recipient_one</loc>');
    expect(sitemap).toContain('<loc>https://example.org/cause/health</loc>');
    expect(sitemap).toContain('<loc>https://example.org/image-credits</loc>');

    const robots = fs.readFileSync(path.join(workspace, 'public', 'robots.txt'), 'utf8');
    expect(robots).toContain('Sitemap: https://example.org/sitemap.xml');
  });
});
