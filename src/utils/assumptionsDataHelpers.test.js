import { afterEach, describe, it, expect, vi } from 'vitest';
import {
  createDefaultAssumptions,
  mergeEffects,
  mergeRecipientEffects,
  createCombinedAssumptions,
  getCostPerLifeFromCombined,
  getCostPerLifeForRecipientFromCombined,
  calculateLivesSavedForDonationFromCombined,
  calculateLivesSavedForCategoryFromCombined,
  calculateDonorStatsFromCombined,
  getActualCostPerLifeForCategoryDataFromCombined,
  getEffectiveCostPerLifeFromCombined,
  isCategoryCustomized,
  isRecipientCategoryCustomized,
  isGlobalParameterCustomized,
  getCustomizedCategories,
  getCustomizedRecipients,
  getCustomizedGlobalParameters,
} from './assumptionsDataHelpers';
import * as donationDataHelpers from './donationDataHelpers';
import { categoriesById, globalParameters, recipientsById } from '../data/generatedData.js';

const buildGlobalParameters = () => ({
  yearsPerLife: 50,
  discountRate: 0.02,
  timeLimit: 100,
  currentPopulation: 8000000000,
  populationGrowthRate: 0.01,
  populationLimit: 2,
});

const buildDefaults = () => ({
  globalParameters: buildGlobalParameters(),
  categories: {
    health: {
      name: 'Health',
      effects: [
        {
          effectId: 'health-effect',
          costPerQALY: 100,
          startTime: 0,
          windowLength: 10,
        },
      ],
    },
    aid: {
      name: 'Aid',
      effects: [
        {
          effectId: 'aid-effect',
          costPerQALY: 200,
          startTime: 0,
          windowLength: 10,
        },
      ],
    },
    catastrophic: {
      name: 'Catastrophic',
      effects: [
        {
          effectId: 'catastrophic-effect',
          costPerQALY: 500,
          startTime: 200,
          windowLength: 10,
        },
      ],
    },
  },
  recipients: {
    recipientA: {
      name: 'Recipient A',
      categories: {
        health: { fraction: 1 },
      },
    },
    recipientCustom: {
      name: 'Recipient Custom',
      categories: {
        health: {
          fraction: 1,
          effects: [
            {
              effectId: 'health-effect',
              overrides: { costPerQALY: 200 },
            },
          ],
        },
      },
    },
    recipientInfinite: {
      name: 'Recipient Infinite',
      categories: {
        catastrophic: { fraction: 1 },
      },
    },
    recipientBadWeights: {
      name: 'Recipient Bad Weights',
      categories: {
        health: { fraction: 0.6 },
        aid: { fraction: 0.5 },
      },
    },
  },
});

const clone = (value) => JSON.parse(JSON.stringify(value));

describe('assumptionsDataHelpers', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('createDefaultAssumptions returns deep copies of generated data', () => {
    const defaults = createDefaultAssumptions();

    expect(defaults.globalParameters).toEqual(globalParameters);

    const categoryId = Object.keys(defaults.categories)[0];
    const recipientId = Object.keys(defaults.recipients)[0];
    expect(categoryId).toBeDefined();
    expect(recipientId).toBeDefined();

    defaults.globalParameters.discountRate = 123;
    defaults.categories[categoryId].name = 'Mutated Category';
    defaults.recipients[recipientId].name = 'Mutated Recipient';

    expect(globalParameters.discountRate).not.toBe(123);
    expect(categoriesById[categoryId].name).not.toBe('Mutated Category');
    expect(recipientsById[recipientId].name).not.toBe('Mutated Recipient');
  });

  it('mergeEffects overlays user fields, appends unknown effects, and does not mutate defaults', () => {
    const defaultEffects = [{ effectId: 'e1', costPerQALY: 100, startTime: 0, windowLength: 10 }];
    const originalDefaults = clone(defaultEffects);
    const userEffects = [
      { effectId: 'e1', costPerQALY: 150 },
      { effectId: 'user-only', costPerQALY: 50, startTime: 2, windowLength: 5 },
    ];

    const merged = mergeEffects(defaultEffects, userEffects);

    expect(merged).toEqual([
      { effectId: 'e1', costPerQALY: 150, startTime: 0, windowLength: 10 },
      { effectId: 'user-only', costPerQALY: 50, startTime: 2, windowLength: 5 },
    ]);
    expect(defaultEffects).toEqual(originalDefaults);
  });

  it('mergeRecipientEffects applies override/multiplier precedence and preserves immutability', () => {
    const defaultEffects = [
      {
        effectId: 'e1',
        costPerQALY: 100,
        overrides: { startTime: 3, costPerQALY: 120 },
        multipliers: { costPerQALY: 0.5, windowLength: 2 },
      },
    ];
    const originalDefaults = clone(defaultEffects);
    const userEffects = [
      {
        effectId: 'e1',
        overrides: { costPerQALY: 300 },
        multipliers: { windowLength: 4 },
        disabled: true,
      },
    ];

    const merged = mergeRecipientEffects(defaultEffects, userEffects);

    // Intentional behavior: user overrides/multipliers replace the default nested structures,
    // rather than deep-merging into default overrides/multipliers.
    expect(merged[0]).toEqual({
      effectId: 'e1',
      costPerQALY: 100,
      overrides: { costPerQALY: 300 },
      multipliers: { windowLength: 4 },
      disabled: true,
    });
    expect(defaultEffects).toEqual(originalDefaults);
  });

  it('createCombinedAssumptions merges global/category/recipient overrides and exposes helper methods', () => {
    const defaults = buildDefaults();
    const userAssumptions = {
      globalParameters: { discountRate: 0.03 },
      categories: {
        health: {
          effects: [{ effectId: 'health-effect', costPerQALY: 150 }],
        },
      },
      recipients: {
        recipientA: {
          categories: {
            health: {
              effects: [{ effectId: 'health-effect', multipliers: { costPerQALY: 2 } }],
            },
          },
        },
      },
    };

    const combined = createCombinedAssumptions(defaults, userAssumptions);

    expect(combined.globalParameters.discountRate).toBe(0.03);
    expect(combined.categories.health.effects[0].costPerQALY).toBe(150);
    expect(combined.recipients.recipientA.categories.health.effects[0]).toMatchObject({
      effectId: 'health-effect',
      costPerQALY: 150,
      multipliers: { costPerQALY: 2 },
    });
    expect(combined.findRecipientId('Recipient A')).toBe('recipientA');
    expect(combined.getCategoryById('health')?.name).toBe('Health');
    expect(combined.getAllRecipients().some((recipient) => recipient.id === 'recipientA')).toBe(true);
    expect(combined.getAllCategories().some((category) => category.id === 'health')).toBe(true);
  });

  it('returns Infinity and zero lives for recipients whose effects are all outside timeLimit', () => {
    const combined = createCombinedAssumptions(buildDefaults(), null);

    const costPerLife = getCostPerLifeForRecipientFromCombined(combined, 'recipientInfinite', 2020);
    const livesSaved = calculateLivesSavedForDonationFromCombined(combined, {
      recipientId: 'recipientInfinite',
      amount: 100000,
      credit: 1,
      date: '2020-01-01',
    });

    expect(costPerLife).toBe(Infinity);
    expect(livesSaved).toBe(0);
  });

  it('throws when recipient category weights do not sum to 1', () => {
    const combined = createCombinedAssumptions(buildDefaults(), null);

    expect(() => getCostPerLifeForRecipientFromCombined(combined, 'recipientBadWeights', 2020)).toThrow(/sum to 1/);
  });

  it('calculates category and donation lives saved consistently with cost per life', () => {
    const combined = createCombinedAssumptions(buildDefaults(), null);
    const categoryCost = getCostPerLifeFromCombined(combined, 'health', 2020);

    const categoryLives = calculateLivesSavedForCategoryFromCombined(combined, 'health', 5000, 2020);
    const donationLives = calculateLivesSavedForDonationFromCombined(combined, {
      recipientId: 'recipientA',
      amount: 5000,
      credit: 0.5,
      date: '2020-05-01',
    });

    expect(categoryLives).toBeCloseTo(5000 / categoryCost, 10);
    expect(donationLives).toBeCloseTo(2500 / categoryCost, 10);
  });

  it('getActualCostPerLifeForCategoryDataFromCombined applies recipient effect modifications', () => {
    const combined = createCombinedAssumptions(buildDefaults(), null);
    const baseCost = getCostPerLifeFromCombined(combined, 'health', 2020);

    const customCategoryData = combined.recipients.recipientCustom.categories.health;
    const modifiedCost = getActualCostPerLifeForCategoryDataFromCombined(
      combined,
      'recipientCustom',
      'health',
      customCategoryData,
      2020
    );

    const plainCategoryData = combined.recipients.recipientA.categories.health;
    const plainCost = getActualCostPerLifeForCategoryDataFromCombined(
      combined,
      'recipientA',
      'health',
      plainCategoryData,
      2020
    );

    expect(modifiedCost).toBeCloseTo(baseCost * 2, 10);
    expect(plainCost).toBeCloseTo(baseCost, 10);
  });

  it('getEffectiveCostPerLifeFromCombined routes by entity type correctly', () => {
    const combined = createCombinedAssumptions(buildDefaults(), null);

    const categoryCost = getCostPerLifeFromCombined(combined, 'health', 2020);
    const recipientCost = getCostPerLifeForRecipientFromCombined(combined, 'recipientA', 2020);

    expect(getEffectiveCostPerLifeFromCombined(combined, null, 2020)).toBe(0);
    expect(getEffectiveCostPerLifeFromCombined(combined, { costPerLife: 1234 }, 2020)).toBe(1234);
    expect(getEffectiveCostPerLifeFromCombined(combined, { categoryId: 'health' }, 2020)).toBe(categoryCost);
    expect(getEffectiveCostPerLifeFromCombined(combined, { recipientId: 'recipientA' }, 2020)).toBe(recipientCost);
    expect(() => getEffectiveCostPerLifeFromCombined(combined, {}, 2020)).toThrow(
      'No valid calculation method found for cost per life.'
    );
  });

  it('calculateDonorStatsFromCombined handles known and unknown donation amounts', () => {
    const combined = createCombinedAssumptions(buildDefaults(), null);
    const recipientCost = getCostPerLifeFromCombined(combined, 'health', 2020);

    vi.spyOn(donationDataHelpers, 'getAllDonors').mockReturnValue([
      { id: 'donor-one', name: 'Donor One', netWorth: 1000000, totalDonated: 3000 },
      { id: 'donor-two', name: 'Donor Two', netWorth: 2000000 },
    ]);
    vi.spyOn(donationDataHelpers, 'getDonorId').mockImplementation((donor) => donor.id);
    vi.spyOn(donationDataHelpers, 'getDonationsForDonor').mockImplementation((donorId) => {
      if (donorId === 'donor-one') {
        return [
          {
            recipientId: 'recipientA',
            amount: 1000,
            credit: 1,
            date: '2020-01-01',
          },
        ];
      }
      return [];
    });

    const stats = calculateDonorStatsFromCombined(combined);

    expect(stats).toHaveLength(1);
    expect(stats[0]).toMatchObject({
      id: 'donor-one',
      knownDonations: 1000,
      totalDonated: 3000,
      totalDonatedField: 3000,
      rank: 1,
    });
    expect(stats[0].unknownLivesSaved).toBeGreaterThan(0);
    expect(stats[0].totalLivesSaved).toBeCloseTo(3000 / recipientCost, 10);
    expect(stats[0].costPerLife).toBeCloseTo(recipientCost, 10);
  });

  it('customization helpers return expected flags and keys', () => {
    const userAssumptions = {
      globalParameters: {
        discountRate: 0.03,
      },
      categories: {
        health: {
          effects: [{ effectId: 'health-effect', costPerQALY: 150 }],
        },
      },
      recipients: {
        recipientA: {
          categories: {
            health: {
              effects: [{ effectId: 'health-effect', overrides: { startTime: 3 } }],
            },
          },
        },
      },
    };

    expect(isCategoryCustomized(userAssumptions, 'health')).toBe(true);
    expect(isCategoryCustomized(userAssumptions, 'aid')).toBe(false);

    expect(isRecipientCategoryCustomized(userAssumptions, 'recipientA', 'health')).toBe(true);
    expect(isRecipientCategoryCustomized(userAssumptions, 'recipientA', 'aid')).toBe(false);

    expect(isGlobalParameterCustomized(userAssumptions, 'discountRate')).toBe(true);
    expect(isGlobalParameterCustomized(userAssumptions, 'timeLimit')).toBe(false);

    expect(getCustomizedCategories(userAssumptions)).toEqual(['health']);
    expect(getCustomizedRecipients(userAssumptions)).toEqual(['recipientA']);
    expect(getCustomizedGlobalParameters(userAssumptions)).toEqual(['discountRate']);

    expect(getCustomizedCategories(null)).toEqual([]);
    expect(getCustomizedRecipients(null)).toEqual([]);
    expect(getCustomizedGlobalParameters(null)).toEqual([]);
  });
});
