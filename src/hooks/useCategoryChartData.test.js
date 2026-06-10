import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import useCategoryChartData from './useCategoryChartData';
import { createCombinedAssumptions } from '../utils/assumptionsDataHelpers';

const globalParameters = {
  discountRate: 0.02,
  populationGrowthRate: 0.01,
  timeLimit: 100,
  populationLimit: 2,
  currentPopulation: 8000000000,
  yearsPerLife: 50,
};

const qalyEffect = (effectId, costPerQALY) => ({ effectId, costPerQALY, startTime: 0, windowLength: 10 });

const buildCombined = ({ categoryCount = 2 } = {}) => {
  // categoryCount categories cat0..catN, one recipient split evenly across all
  // of them, plus a single-category recipient for simple cases.
  const categories = {};
  const splitCategories = {};
  for (let i = 0; i < categoryCount; i += 1) {
    categories[`cat${i}`] = { name: `Category ${i}`, effects: [qalyEffect(`effect${i}`, 1000 * (i + 1))] };
    splitCategories[`cat${i}`] = { fraction: 1 / categoryCount };
  }

  return createCombinedAssumptions(
    {
      globalParameters,
      categories,
      recipients: {
        split: { name: 'Split Recipient', categories: splitCategories },
        single: { name: 'Single Recipient', categories: { cat0: { fraction: 1 } } },
      },
    },
    null
  );
};

const donation = (recipientId, creditedAmount) => ({ recipientId, creditedAmount, date: '2020-05-01' });

const renderChartData = (combined, donations, options) =>
  renderHook(() => useCategoryChartData(combined, donations, options)).result.current;

describe('useCategoryChartData', () => {
  it('splits a donation across the recipient categories by fraction, sorted by amount', () => {
    const combined = buildCombined({ categoryCount: 2 });
    const rows = renderChartData(combined, [donation('split', 1000)]);

    expect(rows.map((row) => row.name)).toEqual(['Category 0', 'Category 1']);
    expect(rows[0].donationValue).toBe(500);
    expect(rows[1].donationValue).toBe(500);
    expect(rows[0].donationPercentage).toBe('50.0');
    expect(rows[0].categoryId).toBe('cat0');
  });

  it('computes lives saved consistent with the effective cost per life', () => {
    const combined = buildCombined();
    const [row] = renderChartData(combined, [donation('single', 1000)]);

    expect(row.livesSavedValue).toBeGreaterThan(0);
    expect(row.effectiveCostPerLife).toBeCloseTo(row.donationValue / row.livesSavedValue, 10);
    expect(row.livesSavedPercentage).toBe('100.0');
  });

  it('aggregates multiple donations to the same category', () => {
    const combined = buildCombined();
    const rows = renderChartData(combined, [donation('single', 300), donation('single', 700)]);

    expect(rows).toHaveLength(1);
    expect(rows[0].donationValue).toBe(1000);
  });

  it('collapses the tail into an Other Causes row past maxCategories', () => {
    const combined = buildCombined({ categoryCount: 5 });
    const rows = renderChartData(combined, [donation('split', 1000)], { maxCategories: 3 });

    expect(rows).toHaveLength(3);
    const other = rows[rows.length - 1];
    expect(other.name).toBe('Other Causes');
    // 3 of 5 equal-value categories collapsed: 200 + 200 + 200.
    expect(other.donationValue).toBeCloseTo(600, 10);
    expect(other.donationPercentage).toBe('60.0');
    // The aggregate row is deliberately not linkable.
    expect(other.categoryId).toBeUndefined();
  });

  it('returns no rows for no donations and throws on an unknown recipient', () => {
    const combined = buildCombined();
    expect(renderChartData(combined, [])).toEqual([]);
    expect(() => renderChartData(combined, [donation('nope', 100)])).toThrow(/Recipient not found/);
  });
});
