import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ACTIVE_APPLIED_ASSUMPTIONS_KEY,
  SESSION_APPLIED_ASSUMPTIONS_KEY,
  loadActiveAppliedAssumptions,
  persistActiveAppliedAssumptions,
} from './activeAppliedAssumptionsStore';

/* global localStorage, sessionStorage, Storage */

const parseAsAppliedAssumptions = (value) => {
  if (value?.invalid) {
    throw new Error('Invalid assumptions');
  }
  return value?.useDefaults ? null : value;
};

describe('activeAppliedAssumptionsStore', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('prefers the versioned browser-wide value over a stale session mirror', () => {
    localStorage.setItem(ACTIVE_APPLIED_ASSUMPTIONS_KEY, JSON.stringify({ source: 'local' }));
    sessionStorage.setItem(SESSION_APPLIED_ASSUMPTIONS_KEY, JSON.stringify({ source: 'session' }));

    expect(loadActiveAppliedAssumptions(parseAsAppliedAssumptions)).toEqual({ source: 'local' });
  });

  it('loads the session value when no browser-wide value exists', () => {
    sessionStorage.setItem(SESSION_APPLIED_ASSUMPTIONS_KEY, JSON.stringify({ source: 'session' }));

    expect(loadActiveAppliedAssumptions(parseAsAppliedAssumptions)).toEqual({ source: 'session' });
  });

  it('discards an invalid browser-wide value and recovers from the session mirror', () => {
    localStorage.setItem(ACTIVE_APPLIED_ASSUMPTIONS_KEY, JSON.stringify({ invalid: true }));
    sessionStorage.setItem(SESSION_APPLIED_ASSUMPTIONS_KEY, JSON.stringify({ source: 'session' }));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(loadActiveAppliedAssumptions(parseAsAppliedAssumptions)).toEqual({ source: 'session' });
    expect(localStorage.getItem(ACTIVE_APPLIED_ASSUMPTIONS_KEY)).toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      'Discarding corrupted applied assumptions from localStorage',
      expect.any(Error)
    );
  });

  it('treats a valid default-equivalent browser-wide value as authoritative', () => {
    localStorage.setItem(ACTIVE_APPLIED_ASSUMPTIONS_KEY, JSON.stringify({ useDefaults: true }));
    sessionStorage.setItem(SESSION_APPLIED_ASSUMPTIONS_KEY, JSON.stringify({ source: 'stale-session' }));

    expect(loadActiveAppliedAssumptions(parseAsAppliedAssumptions)).toBeNull();
  });

  it('writes both copies and leaves a durable tombstone when explicitly cleared', () => {
    const assumptions = { globalParameters: { timeLimit: 123 } };

    persistActiveAppliedAssumptions(assumptions);

    expect(JSON.parse(localStorage.getItem(ACTIVE_APPLIED_ASSUMPTIONS_KEY))).toEqual(assumptions);
    expect(JSON.parse(sessionStorage.getItem(SESSION_APPLIED_ASSUMPTIONS_KEY))).toEqual(assumptions);

    persistActiveAppliedAssumptions(null);

    expect(localStorage.getItem(ACTIVE_APPLIED_ASSUMPTIONS_KEY)).toBe('null');
    expect(sessionStorage.getItem(SESSION_APPLIED_ASSUMPTIONS_KEY)).toBeNull();
  });

  it('does not write a tombstone for a first-time visitor with no stored state', () => {
    persistActiveAppliedAssumptions(null);

    expect(localStorage.getItem(ACTIVE_APPLIED_ASSUMPTIONS_KEY)).toBeNull();
    expect(sessionStorage.getItem(SESSION_APPLIED_ASSUMPTIONS_KEY)).toBeNull();
  });

  it('prevents a stale tab session from resurrecting assumptions after reset', () => {
    const staleAssumptions = { globalParameters: { timeLimit: 789 } };
    persistActiveAppliedAssumptions(staleAssumptions);

    // A second tab resets. Its session is cleared and the shared durable value
    // becomes an explicit default-state tombstone.
    persistActiveAppliedAssumptions(null);
    expect(localStorage.getItem(ACTIVE_APPLIED_ASSUMPTIONS_KEY)).toBe('null');

    // The first tab still has its own stale sessionStorage. On refresh, the
    // durable tombstone must win instead of migrating that tab's old value.
    sessionStorage.setItem(SESSION_APPLIED_ASSUMPTIONS_KEY, JSON.stringify(staleAssumptions));

    expect(loadActiveAppliedAssumptions(parseAsAppliedAssumptions)).toBeNull();
    expect(localStorage.getItem(ACTIVE_APPLIED_ASSUMPTIONS_KEY)).toBe('null');
  });

  it('still writes the session fallback when durable persistence fails', () => {
    // Resolve the safe-storage accessors before simulating a later browser
    // revocation, matching the real mid-session failure mode.
    loadActiveAppliedAssumptions(parseAsAppliedAssumptions);
    const originalSetItem = Storage.prototype.setItem;
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (key, value) {
      if (this === localStorage && key === ACTIVE_APPLIED_ASSUMPTIONS_KEY) {
        throw new Error('QuotaExceededError');
      }
      return originalSetItem.call(this, key, value);
    });
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const assumptions = { globalParameters: { timeLimit: 456 } };
    persistActiveAppliedAssumptions(assumptions);

    expect(JSON.parse(sessionStorage.getItem(SESSION_APPLIED_ASSUMPTIONS_KEY))).toEqual(assumptions);
    expect(console.error).toHaveBeenCalledWith(
      'Could not persist applied assumptions to localStorage',
      expect.any(Error)
    );
  });
});
