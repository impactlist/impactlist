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

  // Negative cost per life (donations that cost lives) is legitimate input;
  // percentages use the gross magnitude total so mixed-sign categories sum to
  // 100% — a signed net denominator inflated shares past 100%.
  it('keeps lives-saved percentages on a gross basis for mixed-sign categories', () => {
    const combined = createCombinedAssumptions(
      {
        globalParameters,
        categories: {
          good: { name: 'Good Cause', effects: [qalyEffect('effect-good', 1000)] },
          harm: { name: 'Harmful Cause', effects: [qalyEffect('effect-harm', -1000)] },
        },
        recipients: {
          mixed: { name: 'Mixed Recipient', categories: { good: { fraction: 0.75 }, harm: { fraction: 0.25 } } },
        },
      },
      null
    );

    const rows = renderChartData(combined, [donation('mixed', 1000)]);
    const byName = Object.fromEntries(rows.map((row) => [row.name, row]));

    expect(byName['Good Cause'].livesSavedValue).toBeGreaterThan(0);
    expect(byName['Harmful Cause'].livesSavedValue).toBeLessThan(0);
    expect(byName['Good Cause'].livesSavedPercentage).toBe('75.0');
    expect(byName['Harmful Cause'].livesSavedPercentage).toBe('25.0');
  });

  it("keeps the Other Causes share consistent with the bar it labels (the collapsed rows' net)", () => {
    const combined = createCombinedAssumptions(
      {
        globalParameters,
        categories: {
          a: { name: 'Category A', effects: [qalyEffect('effect-a', 1000)] },
          b: { name: 'Category B', effects: [qalyEffect('effect-b', -1000)] },
          c: { name: 'Category C', effects: [qalyEffect('effect-c', 1000)] },
        },
        recipients: {
          spread: {
            name: 'Spread Recipient',
            categories: { a: { fraction: 0.5 }, b: { fraction: 0.3 }, c: { fraction: 0.2 } },
          },
        },
      },
      null
    );

    const rows = renderChartData(combined, [donation('spread', 1000)], { maxCategories: 2 });

    expect(rows.map((row) => row.name)).toEqual(['Category A', 'Other Causes']);
    const [categoryA, other] = rows;
    // B (-0.3) and C (+0.2) collapse into a net -0.1 bar; its label must
    // describe that bar — 10% of the gross total — not the 50% of collapsed
    // magnitude (which could label a zero-length bar "50%"). The visible
    // shares deliberately total under 100% when signs cancel inside Other.
    expect(other.livesSavedValue).toBeLessThan(0);
    expect(categoryA.livesSavedPercentage).toBe('50.0');
    expect(other.livesSavedPercentage).toBe('10.0');
  });
});
