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

// Pure shared modules the generator imports from src/ — they must exist in
// the temp workspace for the script's relative imports to resolve.
const SHARED_MODULES = ['src/utils/dataValidation.js', 'src/utils/constants.js', 'src/utils/globalParameterRules.js'];

const setupWorkspaceFromFixture = (fixtureName) => {
  const fixtureContentDir = path.join(fixturesRoot, fixtureName, 'content');
  const tempDir = fs.mkdtempSync(path.join(repoRoot, '.tmp-generate-data-'));
  tempWorkspaces.push(tempDir);

  fs.cpSync(fixtureContentDir, path.join(tempDir, 'content'), { recursive: true });
  fs.mkdirSync(path.join(tempDir, 'scripts'), { recursive: true });
  fs.copyFileSync(scriptSource, path.join(tempDir, 'scripts', 'generate-data-from-markdown.mjs'));
  for (const modulePath of SHARED_MODULES) {
    const target = path.join(tempDir, modulePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(repoRoot, modulePath), target);
  }

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

  it('fails on a date outside the plausible year range', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeDonationsFile(workspace, 'donor_a.md', validDonation.replace('date: 2022-01-01', 'date: 2205-01-01'));

    runGeneratorExpectingError(workspace, 'outside the plausible range 1900-2100');
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

  it('fails the build on out-of-bounds global parameters', () => {
    const workspace = setupWorkspaceFromFixture('donation-validation');
    writeContentFile(
      workspace,
      'globalParameters.md',
      '---\ndiscountRate: 1.5\npopulationGrowthRate: 0.01\ntimeLimit: 100\npopulationLimit: 2\ncurrentPopulation: 8000000000\nyearsPerLife: 50\n---\n'
    );

    runGeneratorExpectingError(workspace, 'Discount rate must be no greater than 100%');
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
});
