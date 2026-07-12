import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useGlobalForm } from './useGlobalForm';

const baseParams = {
  discountRate: 0.02,
  populationGrowthRate: 0.01,
  populationLimit: 2,
  timeLimit: 100,
};

describe('useGlobalForm', () => {
  it('keeps malformed numeric input as a string and surfaces an error', async () => {
    const { result } = renderHook(() => useGlobalForm(baseParams, baseParams, null));

    act(() => {
      result.current.handleChange('timeLimit', '1.2.3');
    });

    await waitFor(() => {
      expect(result.current.formValues.timeLimit.raw).toBe('1.2.3');
      expect(result.current.errors.timeLimit).toBe('Invalid number');
    });
  });

  it('converts valid percentage input to decimal form', async () => {
    const { result } = renderHook(() => useGlobalForm(baseParams, baseParams, null));

    act(() => {
      result.current.handleChange('discountRate', '2.5');
    });

    await waitFor(() => {
      expect(result.current.formValues.discountRate.raw).toBe(0.025);
      expect(result.current.errors.discountRate).toBeUndefined();
    });
  });

  it('counts unapplied parameters and derives hasUnsavedChanges from the count', async () => {
    const { result } = renderHook(() => useGlobalForm(baseParams, baseParams, null));

    await waitFor(() => {
      expect(Object.keys(result.current.formValues)).not.toHaveLength(0);
    });
    expect(result.current.unappliedChangeCount).toBe(0);
    expect(result.current.hasUnsavedChanges).toBe(false);

    act(() => {
      result.current.handleChange('timeLimit', '155');
    });
    await waitFor(() => {
      expect(result.current.unappliedChangeCount).toBe(1);
    });

    act(() => {
      result.current.handleChange('discountRate', '7');
    });
    await waitFor(() => {
      expect(result.current.unappliedChangeCount).toBe(2);
    });
    expect(result.current.hasUnsavedChanges).toBe(true);

    // Typing a parameter back to its applied value un-counts it.
    act(() => {
      result.current.handleChange('timeLimit', '100');
    });
    await waitFor(() => {
      expect(result.current.unappliedChangeCount).toBe(1);
    });
  });

  it('discardDraft resets to the baseline a partial set load re-hydrated, not the original one', async () => {
    const { result, rerender } = renderHook(
      ({ globalParameters, userGlobalParameters }) => useGlobalForm(globalParameters, baseParams, userGlobalParameters),
      { initialProps: { globalParameters: baseParams, userGlobalParameters: null } }
    );

    act(() => {
      result.current.handleChange('timeLimit', '155');
    });
    await waitFor(() => {
      expect(result.current.formValues.timeLimit.raw).toBe(155);
    });

    // A loaded set changes discountRate only: that parameter re-hydrates
    // while the timeLimit draft survives (value-aware rehydration).
    rerender({
      globalParameters: { ...baseParams, discountRate: 0.05 },
      userGlobalParameters: { discountRate: 0.05 },
    });
    await waitFor(() => {
      expect(result.current.formValues.discountRate.raw).toBe(0.05);
    });
    expect(result.current.formValues.timeLimit.raw).toBe(155);
    expect(result.current.unappliedChangeCount).toBe(1);

    act(() => {
      result.current.discardDraft();
    });

    // The draft resets to the NEW applied baseline: the surviving draft goes
    // back to its applied value, the loaded parameter keeps its loaded one.
    await waitFor(() => {
      expect(result.current.formValues.timeLimit.raw).toBe(100);
    });
    expect(result.current.formValues.timeLimit.formatted).toBe('100');
    expect(result.current.formValues.discountRate.raw).toBe(0.05);
    expect(result.current.unappliedChangeCount).toBe(0);
    expect(result.current.hasUnsavedChanges).toBe(false);
  });

  it('discardDraft clears validation errors along with the draft', async () => {
    const { result } = renderHook(() => useGlobalForm(baseParams, baseParams, null));

    act(() => {
      result.current.handleChange('discountRate', '150');
    });
    await waitFor(() => {
      expect(result.current.errors.discountRate).toBeTruthy();
      expect(result.current.unappliedChangeCount).toBe(1);
    });

    act(() => {
      result.current.discardDraft();
    });

    await waitFor(() => {
      expect(result.current.errors).toEqual({});
    });
    expect(result.current.formValues.discountRate.raw).toBe(0.02);
    expect(result.current.unappliedChangeCount).toBe(0);
  });
});
