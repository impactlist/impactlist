import { describe, expect, it } from 'vitest';
import { buildAssumptionsDiff, revertAssumptionsDiffEntry } from './assumptionsDiff';
import { normalizeUserAssumptions } from './assumptionsNormalization.js';

// Synthetic defaults so cases don't depend on the generated corpus. The
// recipient 'amf' ships default overrides/multipliers (a customized
// recipient); 'plain-org' inherits everything from its cause.
const buildDefaults = () => ({
  globalParameters: {
    discountRate: 0.02,
    populationGrowthRate: 0.01,
    populationLimit: 10,
    timeLimit: 100,
    currentPopulation: 8_000_000_000,
    yearsPerLife: 50,
  },
  categories: {
    health: {
      name: 'Global Health',
      effects: [{ effectId: 'standard', costPerQALY: 100, startTime: 0, windowLength: 10 }],
    },
    ai: {
      name: 'AI Risk',
      effects: [
        { effectId: 'standard', costPerQALY: 5000, startTime: 0, windowLength: 10 },
        {
          effectId: 'doom',
          costPerMicroprobability: 120,
          populationFractionAffected: 0.95,
          qalyImprovementPerYear: -1,
          startTime: 20,
          windowLength: 60,
        },
      ],
    },
  },
  recipients: {
    amf: {
      name: 'Against Malaria Foundation',
      categories: {
        health: {
          effects: [{ effectId: 'standard', overrides: { costPerQALY: 50 }, multipliers: { windowLength: 2 } }],
        },
      },
    },
    'plain-org': {
      name: 'Plain Org',
      categories: { health: {} },
    },
  },
});

const recipientAssumptions = (recipientId, effectEntry) => ({
  recipients: {
    [recipientId]: {
      categories: { health: { effects: [{ effectId: 'standard', ...effectEntry }] } },
    },
  },
});

const singleRecipientEntries = (diff) => diff.recipients[0].categories[0].entries;

describe('buildAssumptionsDiff', () => {
  it('returns an empty diff for null user assumptions', () => {
    const diff = buildAssumptionsDiff(buildDefaults(), null);

    expect(diff.changeCount).toBe(0);
    expect(diff.globalParameters).toEqual([]);
    expect(diff.categories).toEqual([]);
    expect(diff.recipients).toEqual([]);
  });

  it('describes a percentage global parameter in percent form', () => {
    const diff = buildAssumptionsDiff(buildDefaults(), { globalParameters: { discountRate: 0.005 } });

    expect(diff.changeCount).toBe(1);
    expect(diff.globalParameters).toEqual([
      {
        path: { section: 'globalParameters', parameterName: 'discountRate' },
        fieldLabel: 'Discount Rate (%)',
        fromDisplay: '2%',
        toDisplay: '0.5%',
      },
    ]);
  });

  it('formats numeric global parameters with thousands separators', () => {
    const diff = buildAssumptionsDiff(buildDefaults(), { globalParameters: { timeLimit: 1_000_000 } });

    expect(diff.globalParameters[0].fromDisplay).toBe('100');
    expect(diff.globalParameters[0].toDisplay).toBe('1,000,000');
  });

  it('throws on a global parameter without a display definition', () => {
    expect(() => buildAssumptionsDiff(buildDefaults(), { globalParameters: { mystery: 1 } })).toThrow(
      /no display definition/
    );
  });

  it('describes category effect field edits as currency/number values', () => {
    const diff = buildAssumptionsDiff(buildDefaults(), {
      categories: { health: { effects: [{ effectId: 'standard', costPerQALY: 200 }] } },
    });

    expect(diff.changeCount).toBe(1);
    expect(diff.categories).toHaveLength(1);
    expect(diff.categories[0].categoryName).toBe('Global Health');
    expect(diff.categories[0].entries).toEqual([
      {
        path: { section: 'categories', categoryId: 'health', effectId: 'standard', field: 'costPerQALY' },
        effectLabel: null,
        fieldLabel: 'Cost per life-year',
        fromDisplay: '$100',
        toDisplay: '$200',
      },
    ]);
  });

  it('orders category entries by field definition order and labels effects only for multi-effect causes', () => {
    const diff = buildAssumptionsDiff(buildDefaults(), {
      categories: {
        ai: { effects: [{ effectId: 'doom', windowLength: 5, costPerMicroprobability: 500 }] },
      },
    });

    const entries = diff.categories[0].entries;
    expect(entries.map((entry) => entry.fieldLabel)).toEqual(['Cost per microprobability', 'Duration (years)']);
    expect(entries[0].effectLabel).toBe('doom');
    expect(entries[0].fromDisplay).toBe('$120');
    expect(entries[0].toDisplay).toBe('$500');
  });

  it('describes disabling a category effect as a status change', () => {
    const diff = buildAssumptionsDiff(buildDefaults(), {
      categories: { health: { effects: [{ effectId: 'standard', disabled: true }] } },
    });

    expect(diff.categories[0].entries).toEqual([
      {
        path: { section: 'categories', categoryId: 'health', effectId: 'standard', field: 'disabled' },
        effectLabel: null,
        fieldLabel: 'Status',
        fromDisplay: 'enabled',
        toDisplay: 'disabled',
      },
    ]);
  });

  it('sorts category groups by category name', () => {
    const diff = buildAssumptionsDiff(buildDefaults(), {
      categories: {
        health: { effects: [{ effectId: 'standard', costPerQALY: 1 }] },
        ai: { effects: [{ effectId: 'standard', costPerQALY: 1 }] },
      },
    });

    expect(diff.categories.map((group) => group.categoryName)).toEqual(['AI Risk', 'Global Health']);
  });

  it('diffs a recipient override against the recipient default override', () => {
    const diff = buildAssumptionsDiff(buildDefaults(), recipientAssumptions('amf', { overrides: { costPerQALY: 80 } }));

    expect(diff.recipients[0].recipientName).toBe('Against Malaria Foundation');
    expect(diff.recipients[0].categories[0].categoryName).toBe('Global Health');
    expect(singleRecipientEntries(diff)).toEqual([
      {
        path: {
          section: 'recipients',
          recipientId: 'amf',
          categoryId: 'health',
          effectId: 'standard',
          field: 'costPerQALY',
        },
        effectLabel: null,
        fieldLabel: 'Cost per life-year',
        fromDisplay: '$50',
        fromNote: null,
        toDisplay: '$80',
        toNote: null,
      },
    ]);
  });

  it('resolves fields gaining an override to the concrete cause value they had before', () => {
    const diff = buildAssumptionsDiff(
      buildDefaults(),
      recipientAssumptions('amf', { overrides: { costPerQALY: 50, startTime: 3 } })
    );

    // costPerQALY matches the recipient default override, so only startTime changed.
    expect(singleRecipientEntries(diff)).toEqual([
      {
        path: {
          section: 'recipients',
          recipientId: 'amf',
          categoryId: 'health',
          effectId: 'standard',
          field: 'startTime',
        },
        effectLabel: null,
        fieldLabel: 'Start time (years)',
        fromDisplay: '0',
        fromNote: 'from cause',
        toDisplay: '3',
        toNote: null,
      },
    ]);
  });

  it('resolves multipliers to concrete values with the factor as a note', () => {
    const diff = buildAssumptionsDiff(
      buildDefaults(),
      recipientAssumptions('plain-org', { multipliers: { costPerQALY: 0.5 } })
    );

    const [entry] = singleRecipientEntries(diff);
    expect(entry.fromDisplay).toBe('$100');
    expect(entry.fromNote).toBe('from cause');
    expect(entry.toDisplay).toBe('$50');
    expect(entry.toNote).toBe('× 0.5');
  });

  it('shows a user multiplier replacing the recipient default multiplier', () => {
    const diff = buildAssumptionsDiff(
      buildDefaults(),
      recipientAssumptions('amf', { multipliers: { windowLength: 3 } })
    );

    expect(singleRecipientEntries(diff)).toEqual([
      {
        path: {
          section: 'recipients',
          recipientId: 'amf',
          categoryId: 'health',
          effectId: 'standard',
          field: 'windowLength',
        },
        effectLabel: null,
        fieldLabel: 'Duration (years)',
        fromDisplay: '20',
        fromNote: '× 2',
        toDisplay: '30',
        toNote: '× 3',
      },
    ]);
  });

  it('mirrors wholesale override replacement: an override set drops default overrides it omits', () => {
    // User overrides replace the default overrides object entirely, so
    // overriding windowLength alone also un-overrides costPerQALY.
    const diff = buildAssumptionsDiff(
      buildDefaults(),
      recipientAssumptions('amf', { overrides: { windowLength: 20 } })
    );

    const entries = singleRecipientEntries(diff);
    expect(entries).toHaveLength(2);
    expect(entries[0]).toMatchObject({
      fieldLabel: 'Cost per life-year',
      fromDisplay: '$50',
      fromNote: null,
      toDisplay: '$100',
      toNote: 'from cause',
    });
    expect(entries[1]).toMatchObject({
      fieldLabel: 'Duration (years)',
      fromDisplay: '20',
      fromNote: '× 2',
      toDisplay: '20',
      toNote: null,
    });
  });

  it("resolves the 'now' side against the user's own cause edits", () => {
    const diff = buildAssumptionsDiff(buildDefaults(), {
      categories: { health: { effects: [{ effectId: 'standard', costPerQALY: 400 }] } },
      recipients: recipientAssumptions('amf', { overrides: { windowLength: 20 } }).recipients,
    });

    // The dropped default override falls through to the cause value, which
    // the user has edited: before = default cause 100, now = their 400.
    const entry = singleRecipientEntries(diff).find((candidate) => candidate.fieldLabel === 'Cost per life-year');
    expect(entry.fromDisplay).toBe('$50');
    expect(entry.toDisplay).toBe('$400');
    expect(entry.toNote).toBe('from cause');
  });

  it('describes disabling a recipient effect as a status change', () => {
    const diff = buildAssumptionsDiff(buildDefaults(), recipientAssumptions('plain-org', { disabled: true }));

    expect(singleRecipientEntries(diff)).toEqual([
      {
        path: {
          section: 'recipients',
          recipientId: 'plain-org',
          categoryId: 'health',
          effectId: 'standard',
          field: 'disabled',
        },
        effectLabel: null,
        fieldLabel: 'Status',
        fromDisplay: 'enabled',
        toDisplay: 'disabled',
      },
    ]);
  });

  it('counts entries across all sections', () => {
    const diff = buildAssumptionsDiff(buildDefaults(), {
      globalParameters: { discountRate: 0.005, timeLimit: 500 },
      categories: { health: { effects: [{ effectId: 'standard', costPerQALY: 200, windowLength: 5 }] } },
      recipients: recipientAssumptions('plain-org', { multipliers: { costPerQALY: 0.5 } }).recipients,
    });

    expect(diff.changeCount).toBe(5);
  });
});

describe('revertAssumptionsDiffEntry', () => {
  const defaults = buildDefaults();

  const revertedAndNormalized = (userAssumptions, path) =>
    normalizeUserAssumptions(revertAssumptionsDiffEntry(userAssumptions, path, defaults), defaults);

  it('reverts a global parameter', () => {
    const result = revertedAndNormalized(
      { globalParameters: { discountRate: 0.005 } },
      { section: 'globalParameters', parameterName: 'discountRate' }
    );

    expect(result).toBeNull();
  });

  it('reverts one category field and keeps the others', () => {
    const result = revertedAndNormalized(
      { categories: { health: { effects: [{ effectId: 'standard', costPerQALY: 200, windowLength: 5 }] } } },
      { section: 'categories', categoryId: 'health', effectId: 'standard', field: 'costPerQALY' }
    );

    expect(result).toEqual({ categories: { health: { effects: [{ effectId: 'standard', windowLength: 5 }] } } });
  });

  it('reverts a category status change', () => {
    const result = revertedAndNormalized(
      { categories: { health: { effects: [{ effectId: 'standard', disabled: true }] } } },
      { section: 'categories', categoryId: 'health', effectId: 'standard', field: 'disabled' }
    );

    expect(result).toBeNull();
  });

  it('reverts a recipient multiplier', () => {
    const result = revertedAndNormalized(recipientAssumptions('plain-org', { multipliers: { costPerQALY: 0.5 } }), {
      section: 'recipients',
      recipientId: 'plain-org',
      categoryId: 'health',
      effectId: 'standard',
      field: 'costPerQALY',
    });

    expect(result).toBeNull();
  });

  it('restores the recipient default override value for the reverted field', () => {
    const result = revertedAndNormalized(recipientAssumptions('amf', { overrides: { costPerQALY: 80 } }), {
      section: 'recipients',
      recipientId: 'amf',
      categoryId: 'health',
      effectId: 'standard',
      field: 'costPerQALY',
    });

    // Restoring costPerQALY to the default's 50 makes the override set match
    // the recipient default wholesale, so normalization prunes everything.
    expect(result).toBeNull();
  });

  it('drops an override the recipient default does not have', () => {
    const result = revertedAndNormalized(
      recipientAssumptions('amf', { overrides: { costPerQALY: 50, startTime: 3 } }),
      { section: 'recipients', recipientId: 'amf', categoryId: 'health', effectId: 'standard', field: 'startTime' }
    );

    expect(result).toBeNull();
  });

  it('reverts a recipient status change', () => {
    const result = revertedAndNormalized(recipientAssumptions('plain-org', { disabled: true }), {
      section: 'recipients',
      recipientId: 'plain-org',
      categoryId: 'health',
      effectId: 'standard',
      field: 'disabled',
    });

    expect(result).toBeNull();
  });

  it('throws when the entry no longer exists', () => {
    expect(() =>
      revertAssumptionsDiffEntry({}, { section: 'globalParameters', parameterName: 'discountRate' }, defaults)
    ).toThrow(/not customized/);
  });

  it('throws on an unknown section', () => {
    expect(() => revertAssumptionsDiffEntry({}, { section: 'nope' }, defaults)).toThrow(/unknown section/);
  });
});
