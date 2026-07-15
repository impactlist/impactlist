/**
 * Storage accessors that survive browsers where site data is blocked.
 *
 * With cookies/site data disabled (Safari "Block all cookies", Chrome
 * third-party contexts, some privacy modes), merely touching
 * `globalThis.localStorage` throws a SecurityError — which would take the
 * whole app down to the error page just for visiting. Persistence is an
 * enhancement, not a requirement, so this is a deliberate exception to the
 * fail-hard rule (same spirit as the catch-and-clear guards for corrupted
 * persisted data): those visitors get a fully working app whose saved state
 * simply lives in memory for the session.
 *
 * The probe runs once per storage kind; every module-level and render-time
 * consumer goes through these accessors instead of touching the globals.
 */

const PROBE_KEY = '__impactlist_storage_probe__';

const createMemoryStorage = () => {
  const data = new Map();
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => {
      data.set(key, String(value));
    },
    removeItem: (key) => {
      data.delete(key);
    },
  };
};

const resolveStorage = (kind) => {
  try {
    const storage = globalThis[kind];
    // Older Safari private mode exposes storage but throws on writes, so
    // probe a write, not just the accessor.
    storage.setItem(PROBE_KEY, '1');
    storage.removeItem(PROBE_KEY);
    return storage;
  } catch (error) {
    console.error(`${kind} is unavailable; falling back to in-memory storage for this session`, error);
    return createMemoryStorage();
  }
};

const resolved = {};

export const getLocalStorage = () => (resolved.localStorage ??= resolveStorage('localStorage'));

export const getSessionStorage = () => (resolved.sessionStorage ??= resolveStorage('sessionStorage'));
