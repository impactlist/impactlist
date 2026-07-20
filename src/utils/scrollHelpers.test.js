import { afterEach, describe, expect, it, vi } from 'vitest';
import { getMotionSafeScrollBehavior } from './scrollHelpers';

describe('getMotionSafeScrollBehavior', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uses smooth scrolling by default', () => {
    vi.spyOn(globalThis, 'matchMedia').mockReturnValue({ matches: false });

    expect(getMotionSafeScrollBehavior()).toBe('smooth');
  });

  it('uses instant scrolling when the visitor prefers reduced motion', () => {
    vi.spyOn(globalThis, 'matchMedia').mockReturnValue({ matches: true });

    expect(getMotionSafeScrollBehavior()).toBe('auto');
  });
});
