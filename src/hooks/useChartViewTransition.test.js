import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import useChartViewTransition from './useChartViewTransition';
import { CHART_ANIMATION_DURATION } from '../utils/constants';

const rawRows = [
  { name: 'Alpha', donationValue: 100, livesSavedValue: 10 },
  { name: 'Beta', donationValue: 200, livesSavedValue: -5 },
  { name: 'Other Causes', donationValue: 500, livesSavedValue: 50 },
];

describe('useChartViewTransition', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('builds rows for the default lives-saved view, largest donations first with Other Causes pinned last', () => {
    const { result } = renderHook(() => useChartViewTransition(rawRows));

    expect(result.current.chartView).toBe('livesSaved');
    expect(result.current.isTransitioning).toBe(false);
    expect(result.current.chartData.map((row) => row.name)).toEqual(['Beta', 'Alpha', 'Other Causes']);
    // Idle: displayed value and animation target agree, on the lives values.
    expect(result.current.chartData[0].value).toBe(-5);
    expect(result.current.chartData[0].valueTarget).toBe(-5);
  });

  it('animates a toggle FROM the displayed value TO the new view, then settles', () => {
    const { result } = renderHook(() => useChartViewTransition(rawRows));

    act(() => {
      result.current.handleChartViewChange('donations');
    });

    // Mid-transition: value holds the old view, valueTarget moves to the new
    // one (the chart renders valueTarget with animation enabled).
    expect(result.current.isTransitioning).toBe(true);
    expect(result.current.chartData[0].value).toBe(-5);
    expect(result.current.chartData[0].valueTarget).toBe(200);

    act(() => {
      vi.advanceTimersByTime(CHART_ANIMATION_DURATION);
    });
    expect(result.current.isTransitioning).toBe(false);

    // After the animation buffer the settle rebuild aligns value with target.
    act(() => {
      vi.advanceTimersByTime(CHART_ANIMATION_DURATION + 50);
    });
    expect(result.current.chartView).toBe('donations');
    expect(result.current.chartData[0].value).toBe(200);
    expect(result.current.chartData[0].valueTarget).toBe(200);
  });

  it('rebuilds rows when the source data changes while idle', () => {
    const { result, rerender } = renderHook(({ raw }) => useChartViewTransition(raw), {
      initialProps: { raw: rawRows },
    });

    const updated = [{ name: 'Alpha', donationValue: 100, livesSavedValue: 42 }];
    rerender({ raw: updated });

    expect(result.current.chartData).toHaveLength(1);
    expect(result.current.chartData[0].value).toBe(42);
    expect(result.current.chartData[0].valueTarget).toBe(42);
  });

  it('keeps empty source data as an empty chart', () => {
    const { result } = renderHook(() => useChartViewTransition([]));
    expect(result.current.chartData).toEqual([]);
  });
});
