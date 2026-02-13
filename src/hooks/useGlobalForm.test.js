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
});
