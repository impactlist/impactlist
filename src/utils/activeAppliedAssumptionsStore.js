import { getLocalStorage, getSessionStorage } from './safeStorage';

export const ACTIVE_APPLIED_ASSUMPTIONS_KEY = 'activeAppliedAssumptions:v1';
export const SESSION_APPLIED_ASSUMPTIONS_KEY = 'customEffectsData';

const getStorageSources = () => ({
  durable: {
    label: 'localStorage',
    storage: getLocalStorage(),
    key: ACTIVE_APPLIED_ASSUMPTIONS_KEY,
  },
  session: {
    label: 'sessionStorage',
    storage: getSessionStorage(),
    key: SESSION_APPLIED_ASSUMPTIONS_KEY,
  },
});

const removeInvalidValue = ({ label, storage, key }) => {
  try {
    storage.removeItem(key);
  } catch (error) {
    console.error(`Could not remove invalid applied assumptions from ${label}`, error);
  }
};

const hasStoredValue = ({ label, storage, key }) => {
  try {
    return storage.getItem(key) !== null;
  } catch (error) {
    // If inspection fails, assume state may exist and still attempt to write
    // the reset tombstone. Otherwise a temporarily revoked storage area could
    // reveal and resurrect an older value when access returns.
    console.error(`Could not inspect applied assumptions in ${label}`, error);
    return true;
  }
};

const persistToSource = ({ label, storage, key }, serialized) => {
  try {
    if (serialized !== null) {
      storage.setItem(key, serialized);
    } else {
      storage.removeItem(key);
    }
  } catch (error) {
    // Persistence is an enhancement. Keep the valid in-memory React state
    // even if a browser revokes storage or one storage area exceeds quota.
    console.error(`Could not persist applied assumptions to ${label}`, error);
  }
};

/**
 * Load the browser-wide applied assumptions, falling back to the former
 * per-tab value so existing sessions migrate without losing work.
 *
 * The caller supplies schema-aware normalization because the current
 * generated defaults live in AssumptionsContext. A valid value that
 * normalizes to null means "use defaults" and is authoritative; only an
 * unreadable or invalid durable value falls through to the session mirror.
 */
export const loadActiveAppliedAssumptions = (normalizeAssumptions) => {
  const { durable, session } = getStorageSources();

  // This order is the precedence contract: browser-wide state, including an
  // explicit reset tombstone, must win over a stale per-tab mirror.
  for (const source of [durable, session]) {
    let serialized;
    try {
      serialized = source.storage.getItem(source.key);
    } catch (error) {
      console.error(`Could not read applied assumptions from ${source.label}; trying fallback`, error);
      continue;
    }

    if (!serialized) {
      continue;
    }

    try {
      return normalizeAssumptions(JSON.parse(serialized));
    } catch (error) {
      // Persisted data can outlive content/schema updates. An incompatible
      // value must not brick every future visit, so discard it and try the
      // compatibility mirror before falling back to defaults.
      console.error(`Discarding corrupted applied assumptions from ${source.label}`, error);
      removeInvalidValue(source);
    }
  }

  return null;
};

/**
 * localStorage is authoritative so applied values survive closing the tab.
 * The session copy is retained as a compatibility and privacy-mode fallback:
 * if durable storage is unavailable, refreshes in the current tab still work.
 */
export const persistActiveAppliedAssumptions = (assumptions) => {
  const { durable, session } = getStorageSources();

  if (assumptions) {
    const serialized = JSON.stringify(assumptions);
    persistToSource(durable, serialized);
    persistToSource(session, serialized);
    return;
  }

  // An absent durable key means "never had applied custom assumptions" and
  // may migrate a current tab's old session value. Once state has existed, an
  // explicit JSON null distinguishes "the user reset" from absence so another
  // tab's stale session mirror can never resurrect the cleared assumptions.
  const shouldWriteTombstone = hasStoredValue(durable) || hasStoredValue(session);
  persistToSource(durable, shouldWriteTombstone ? 'null' : null);
  persistToSource(session, null);
};
