import { describe, expect, it } from 'vitest';
import { computeNiceTicks } from './chartTicks';

describe('computeNiceTicks', () => {
  it('turns the mixed-sign entity-chart range into round ticks with 0 included', () => {
    // The regression case: raw domain [-1503, 18497] used to reach recharts
    // verbatim, which sliced it into equal parts from -1503 and rendered
    // ticks like 5,497 and 18,497.
    const { domain, ticks } = computeNiceTicks(-1503, 18497);

    expect(ticks).toEqual([-5000, 0, 5000, 10000, 15000, 20000]);
    expect(domain).toEqual([-5000, 20000]);
  });

  it('encloses the data range with the outer ticks', () => {
    const { domain } = computeNiceTicks(-1600, 1100);

    expect(domain[0]).toBeLessThanOrEqual(-1600);
    expect(domain[1]).toBeGreaterThanOrEqual(1100);
    expect(domain).toEqual([-2000, 1500]);
  });

  it('handles an all-negative range ending at the zero baseline', () => {
    const { domain, ticks } = computeNiceTicks(-1200, 0);

    expect(ticks).toEqual([-1200, -1000, -800, -600, -400, -200, 0]);
    expect(domain).toEqual([-1200, 0]);
  });

  it('steps down to fractional magnitudes for small lives-saved ranges', () => {
    const { ticks } = computeNiceTicks(-0.7, 2.1);

    expect(ticks).toEqual([-1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5]);
  });

  it('uses the next power of ten when the rough step exceeds the 5× mantissa', () => {
    // range 48000 / 6 target intervals = 8000: past 5000, so the ladder rolls
    // over to 10000.
    const { ticks } = computeNiceTicks(-8000, 40000);

    expect(ticks).toEqual([-10000, 0, 10000, 20000, 30000, 40000]);
  });

  it('throws on non-finite or non-increasing bounds', () => {
    expect(() => computeNiceTicks(0, 0)).toThrow(/minValue < maxValue/);
    expect(() => computeNiceTicks(5, -5)).toThrow(/minValue < maxValue/);
    expect(() => computeNiceTicks(-Infinity, 10)).toThrow(/finite/);
    expect(() => computeNiceTicks(-10, NaN)).toThrow(/finite/);
  });
});
