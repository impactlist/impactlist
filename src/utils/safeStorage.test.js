import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';

/* global localStorage */

// The module memoizes its probe, so each test imports a fresh copy.
describe('safeStorage', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('returns the real storage when it is usable', async () => {
    const { getLocalStorage } = await import('./safeStorage');

    getLocalStorage().setItem('safe-storage-test', 'value');
    expect(localStorage.getItem('safe-storage-test')).toBe('value');
    localStorage.removeItem('safe-storage-test');
  });

  it('falls back to a working in-memory store when storage throws (blocked site data)', async () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('SecurityError: storage is blocked');
      },
      setItem: () => {
        throw new Error('SecurityError: storage is blocked');
      },
      removeItem: () => {
        throw new Error('SecurityError: storage is blocked');
      },
    });
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { getLocalStorage } = await import('./safeStorage');
    const storage = getLocalStorage();

    expect(() => storage.setItem('key', 'value')).not.toThrow();
    expect(storage.getItem('key')).toBe('value');
    expect(storage.getItem('missing')).toBe(null);
    storage.removeItem('key');
    expect(storage.getItem('key')).toBe(null);
    // The probe runs once — every caller shares the same fallback store.
    expect(getLocalStorage()).toBe(storage);
  });
});
