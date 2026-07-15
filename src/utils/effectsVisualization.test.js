import { describe, expect, it } from 'vitest';
import { calculateLivesSavedSegments } from './effectsVisualization';
import { createDefaultAssumptions, createCombinedAssumptions } from './assumptionsDataHelpers';

const buildSubYearCombined = () =>
  createCombinedAssumptions(createDefaultAssumptions(), {
    globalParameters: { timeLimit: 0.9 },
  });

// A global time limit below one year used to collapse every rounded sample
// point onto the single point t=0 — first crashing on a NaN interval, then
// (once the crash was fixed) integrating nothing: zero-width chart domain and
// a legend reporting zero lives per series against a nonzero total. The
// series must integrate over the fractional horizon and reconcile exactly.
const expectWellFormedSeries = (points) => {
  // More than one point: the chart gets a real time domain.
  expect(points.length).toBeGreaterThan(1);
  expect(points.at(-1).year).toBeGreaterThan(points[0].year);

  for (const point of points) {
    for (const value of Object.values(point)) {
      if (typeof value === 'number') {
        expect(Number.isFinite(value)).toBe(true);
      }
    }
  }

  // Normalization must make the per-series totals reconcile with the
  // headline total, not silently report zero.
  expect(points.totalLivesSaved).not.toBe(0);
  const seriesTotal = points.seriesMetadata.reduce((sum, series) => sum + series.totalLives, 0);
  expect(seriesTotal).toBeCloseTo(points.totalLivesSaved, 6);
};

describe('calculateLivesSavedSegments', () => {
  it('integrates and normalizes categories over a sub-year time limit', () => {
    const points = calculateLivesSavedSegments('disaster-relief', 1000000, 2024, buildSubYearCombined(), {
      isCategory: true,
    });

    expectWellFormedSeries(points);
  });

  it('integrates and normalizes recipients over a sub-year time limit', () => {
    const points = calculateLivesSavedSegments('aid-for-ukraine', 1000000, 2024, buildSubYearCombined());

    expectWellFormedSeries(points);
  });

  it('keeps series totals reconciled for an ordinary multi-year time limit', () => {
    const combined = createCombinedAssumptions(createDefaultAssumptions(), null);

    const points = calculateLivesSavedSegments('aid-for-ukraine', 1000000, 2024, combined);

    expect(points.length).toBeGreaterThan(1);
    const seriesTotal = points.seriesMetadata.reduce((sum, series) => sum + series.totalLives, 0);
    expect(seriesTotal).toBeCloseTo(points.totalLivesSaved, 6);
  });
});
