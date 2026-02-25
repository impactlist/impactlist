import { isPlainObject } from './typeGuards';

const SAVED_ASSUMPTIONS_KEY = 'savedAssumptions:v1';
const ACTIVE_SAVED_ASSUMPTIONS_ID_KEY = 'activeSavedAssumptionsId:v1';
const SAVED_ASSUMPTIONS_MIGRATION_KEY = 'savedAssumptionsMigration:v1';
export const SAVED_ASSUMPTIONS_CHANGED_EVENT = 'saved-assumptions:changed';

const MAX_SAVED_ASSUMPTIONS = 25;
const MAX_SAVED_ASSUMPTIONS_BYTES = 250 * 1024;

const SORT_ASC = (valueA = '', valueB = '') => {
  if (valueA === valueB) {
    return 0;
  }
  return valueA < valueB ? -1 : 1;
};

const emitSavedAssumptionsChanged = () => {
  if (typeof globalThis.dispatchEvent !== 'function') {
    return;
  }

  globalThis.dispatchEvent(new globalThis.CustomEvent(SAVED_ASSUMPTIONS_CHANGED_EVENT));
};

const canonicalizeForFingerprint = (value) => {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalizeForFingerprint).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    const keys = Object.keys(value).sort(SORT_ASC);
    return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalizeForFingerprint(value[key])}`).join(',')}}`;
  }

  return JSON.stringify(value);
};

const sanitizeForFingerprint = (value) => {
  if (value === undefined) {
    return null;
  }

  if (typeof value === 'number' && !Number.isFinite(value)) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeForFingerprint);
  }

  if (isPlainObject(value)) {
    const output = {};
    Object.keys(value).forEach((key) => {
      const sanitized = sanitizeForFingerprint(value[key]);
      if (sanitized !== undefined) {
        output[key] = sanitized;
      }
    });
    return output;
  }

  return value;
};

const calculateSerializedBytes = (value) => {
  return new globalThis.TextEncoder().encode(JSON.stringify(value)).length;
};

const buildDerivedShareUrl = (reference) => {
  if (!reference) {
    return null;
  }

  const path = `/?shared=${encodeURIComponent(reference)}`;
  const origin = globalThis.location?.origin;
  if (!origin) {
    return path;
  }

  return new globalThis.URL(path, origin).toString();
};

const isValidSource = (value) => value === 'local' || value === 'imported';

const createFingerprint = (assumptions) => {
  const safe = sanitizeForFingerprint(assumptions);
  return canonicalizeForFingerprint(safe);
};

const createNowIso = () => new Date().toISOString();

const createId = () => {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  const timestampPart = Date.now().toString(36);
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `local-${timestampPart}-${randomPart}`;
};

const readJson = (key) => {
  const raw = globalThis.localStorage.getItem(key);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const readMigrationStatus = () => {
  return globalThis.localStorage.getItem(SAVED_ASSUMPTIONS_MIGRATION_KEY) === '1';
};

const writeMigrationStatus = () => {
  globalThis.localStorage.setItem(SAVED_ASSUMPTIONS_MIGRATION_KEY, '1');
};

const pruneToSerializableAssumptions = (assumptions) => {
  if (!isPlainObject(assumptions)) {
    return null;
  }

  const keys = ['globalParameters', 'categories', 'recipients'];
  const output = {};
  keys.forEach((key) => {
    if (isPlainObject(assumptions[key])) {
      output[key] = assumptions[key];
    }
  });

  return Object.keys(output).length > 0 ? output : null;
};

const validateEntry = (entry) => {
  if (!isPlainObject(entry)) {
    return null;
  }

  if (typeof entry.id !== 'string' || entry.id.length === 0) {
    return null;
  }

  if (typeof entry.label !== 'string' || entry.label.trim().length === 0) {
    return null;
  }

  if (!isValidSource(entry.source)) {
    return null;
  }

  if (entry.reference !== null && entry.reference !== undefined && typeof entry.reference !== 'string') {
    return null;
  }

  const assumptions = pruneToSerializableAssumptions(entry.assumptions);
  if (!assumptions) {
    return null;
  }

  const fingerprint =
    typeof entry.fingerprint === 'string' && entry.fingerprint.length > 0
      ? entry.fingerprint
      : createFingerprint(assumptions);

  const createdAt = typeof entry.createdAt === 'string' ? entry.createdAt : createNowIso();
  const updatedAt = typeof entry.updatedAt === 'string' ? entry.updatedAt : createdAt;
  const lastLoadedAt = typeof entry.lastLoadedAt === 'string' ? entry.lastLoadedAt : null;
  const userRenamed = Boolean(entry.userRenamed);

  return {
    id: entry.id,
    label: entry.label.trim(),
    source: entry.source,
    reference: typeof entry.reference === 'string' && entry.reference.trim().length > 0 ? entry.reference.trim() : null,
    assumptions,
    fingerprint,
    createdAt,
    updatedAt,
    lastLoadedAt,
    userRenamed,
  };
};

const sortSavedAssumptions = (entries) => {
  return [...entries].sort((a, b) => SORT_ASC(b.updatedAt, a.updatedAt));
};

const loadSavedAssumptionsUnsafe = () => {
  const parsed = readJson(SAVED_ASSUMPTIONS_KEY);
  if (!Array.isArray(parsed)) {
    return [];
  }

  const normalized = parsed.map(validateEntry).filter(Boolean);
  return sortSavedAssumptions(normalized);
};

const pickOldestBy = (entries, key) => {
  return [...entries].sort((a, b) => SORT_ASC(a[key] || '', b[key] || ''));
};

const buildEvictionOrder = (entries) => {
  const imported = entries.filter((entry) => entry.source === 'imported');
  const local = entries.filter((entry) => entry.source === 'local');

  const importedByLastLoadedThenUpdated = [...imported].sort((a, b) => {
    const loadedCompare = SORT_ASC(a.lastLoadedAt || '', b.lastLoadedAt || '');
    if (loadedCompare !== 0) {
      return loadedCompare;
    }
    return SORT_ASC(a.updatedAt || '', b.updatedAt || '');
  });

  const localByLastLoaded = pickOldestBy(local, 'lastLoadedAt');
  const localByUpdated = pickOldestBy(local, 'updatedAt');

  const seen = new Set();
  const ordered = [];

  [...importedByLastLoadedThenUpdated, ...localByLastLoaded, ...localByUpdated].forEach((entry) => {
    if (seen.has(entry.id)) {
      return;
    }
    seen.add(entry.id);
    ordered.push(entry);
  });

  return ordered;
};

const applyLimits = (entries, { protectEntryIds = new Set(), allowLocalEviction = true } = {}) => {
  let next = sortSavedAssumptions(entries);
  let evictedCount = 0;
  let evictedImportedCount = 0;
  let evictedLocalCount = 0;

  const shouldTrim = () => {
    return next.length > MAX_SAVED_ASSUMPTIONS || calculateSerializedBytes(next) > MAX_SAVED_ASSUMPTIONS_BYTES;
  };

  const removeOne = (candidate) => {
    const beforeLength = next.length;
    next = next.filter((entry) => entry.id !== candidate.id);
    if (next.length !== beforeLength) {
      evictedCount += 1;
      if (candidate.source === 'imported') {
        evictedImportedCount += 1;
      } else if (candidate.source === 'local') {
        evictedLocalCount += 1;
      }
    }
  };

  while (shouldTrim()) {
    const candidates = buildEvictionOrder(next).filter((entry) => !protectEntryIds.has(entry.id));
    const importedCandidate = candidates.find((entry) => entry.source === 'imported');

    if (importedCandidate) {
      removeOne(importedCandidate);
      continue;
    }

    if (!allowLocalEviction) {
      break;
    }

    const localCandidate = candidates.find((entry) => entry.source === 'local');
    if (!localCandidate) {
      break;
    }

    removeOne(localCandidate);
  }

  return {
    entries: next,
    evictedCount,
    evictedImportedCount,
    evictedLocalCount,
    fitsLimits: !shouldTrim(),
  };
};

const writeSavedAssumptionsUnsafe = (entries) => {
  globalThis.localStorage.setItem(SAVED_ASSUMPTIONS_KEY, JSON.stringify(entries));
};

const persistSavedAssumptions = (
  entries,
  { protectEntryIds = new Set(), allowLocalEvictionFallback = true, emitChange = true } = {}
) => {
  const firstPass = applyLimits(entries, { protectEntryIds, allowLocalEviction: false });

  const writePass = (pass) => {
    try {
      writeSavedAssumptionsUnsafe(pass.entries);
      if (emitChange) {
        emitSavedAssumptionsChanged();
      }
      return {
        ok: true,
        evictedCount: pass.evictedCount,
        evictedImportedCount: pass.evictedImportedCount,
        evictedLocalCount: pass.evictedLocalCount,
        entries: pass.entries,
        storageError: null,
        errorCode: null,
      };
    } catch (error) {
      return {
        ok: false,
        evictedCount: pass.evictedCount,
        evictedImportedCount: pass.evictedImportedCount,
        evictedLocalCount: pass.evictedLocalCount,
        entries: entries,
        storageError: error,
        errorCode: 'storage_write_failed',
      };
    }
  };

  if (!firstPass.fitsLimits) {
    if (!allowLocalEvictionFallback) {
      return {
        ok: false,
        evictedCount: firstPass.evictedCount,
        evictedImportedCount: firstPass.evictedImportedCount,
        evictedLocalCount: firstPass.evictedLocalCount,
        entries: entries,
        storageError: null,
        errorCode: 'over_limit',
      };
    }

    const secondPass = applyLimits(entries, { protectEntryIds, allowLocalEviction: true });
    if (!secondPass.fitsLimits) {
      return {
        ok: false,
        evictedCount: secondPass.evictedCount,
        evictedImportedCount: secondPass.evictedImportedCount,
        evictedLocalCount: secondPass.evictedLocalCount,
        entries: entries,
        storageError: null,
        errorCode: 'over_limit',
      };
    }

    return writePass(secondPass);
  }

  const firstWriteResult = writePass(firstPass);
  if (firstWriteResult.ok || !allowLocalEvictionFallback) {
    return firstWriteResult;
  }

  const secondPass = applyLimits(entries, { protectEntryIds, allowLocalEviction: true });
  if (!secondPass.fitsLimits) {
    return {
      ok: false,
      evictedCount: secondPass.evictedCount,
      evictedImportedCount: secondPass.evictedImportedCount,
      evictedLocalCount: secondPass.evictedLocalCount,
      entries: entries,
      storageError: firstWriteResult.storageError,
      errorCode: 'over_limit',
    };
  }

  return writePass(secondPass);
};

const upsertEntryById = (entries, nextEntry) => {
  const index = entries.findIndex((entry) => entry.id === nextEntry.id);
  if (index === -1) {
    return [nextEntry, ...entries];
  }

  const next = [...entries];
  next[index] = nextEntry;
  return next;
};

const trimLabel = (label) => {
  if (typeof label !== 'string') {
    return '';
  }
  return label.trim();
};

const normalizeLabelKey = (label) => trimLabel(label).toLowerCase();

const hasDuplicateLabel = (entries, label, { excludeId = null } = {}) => {
  const labelKey = normalizeLabelKey(label);
  if (!labelKey) {
    return false;
  }

  return entries.some((entry) => {
    if (excludeId && entry.id === excludeId) {
      return false;
    }
    return normalizeLabelKey(entry.label) === labelKey;
  });
};

const buildLocalEntry = ({ label, assumptions, nowIso }) => {
  const normalizedLabel = trimLabel(label);
  if (!normalizedLabel) {
    throw new Error('Saved assumptions label is required.');
  }

  const cleanAssumptions = pruneToSerializableAssumptions(assumptions);
  if (!cleanAssumptions) {
    throw new Error('Saved assumptions data is invalid.');
  }

  return {
    id: createId(),
    label: normalizedLabel,
    source: 'local',
    reference: null,
    assumptions: cleanAssumptions,
    fingerprint: createFingerprint(cleanAssumptions),
    createdAt: nowIso,
    updatedAt: nowIso,
    lastLoadedAt: null,
    userRenamed: true,
  };
};

const buildUpdatedEntry = (entry, updates, nowIso) => {
  const nextLabel = updates.label !== undefined ? trimLabel(updates.label) : entry.label;
  if (!nextLabel) {
    throw new Error('Saved assumptions label is required.');
  }

  const nextAssumptions =
    updates.assumptions !== undefined ? pruneToSerializableAssumptions(updates.assumptions) : entry.assumptions;

  if (!nextAssumptions) {
    throw new Error('Saved assumptions data is invalid.');
  }

  const hasNewAssumptions = updates.assumptions !== undefined;
  const hasNewLabel = updates.label !== undefined;

  return {
    ...entry,
    label: nextLabel,
    assumptions: nextAssumptions,
    fingerprint: hasNewAssumptions ? createFingerprint(nextAssumptions) : entry.fingerprint,
    source: updates.source && isValidSource(updates.source) ? updates.source : entry.source,
    reference:
      updates.reference !== undefined
        ? typeof updates.reference === 'string' && updates.reference.trim().length > 0
          ? updates.reference.trim()
          : null
        : entry.reference,
    updatedAt: nowIso,
    lastLoadedAt: updates.markLoaded ? nowIso : entry.lastLoadedAt,
    userRenamed: hasNewLabel ? true : entry.userRenamed,
  };
};

export const getSavedAssumptions = () => {
  const entries = loadSavedAssumptionsUnsafe();
  return entries.map((entry) => ({
    ...entry,
    shareUrl: buildDerivedShareUrl(entry.reference),
  }));
};

export const getSavedAssumptionsRaw = () => loadSavedAssumptionsUnsafe();

export const getSavedAssumptionsLimits = () => ({
  maxEntries: MAX_SAVED_ASSUMPTIONS,
  maxBytes: MAX_SAVED_ASSUMPTIONS_BYTES,
});

export const getActiveSavedAssumptionsId = () => {
  const raw = globalThis.localStorage.getItem(ACTIVE_SAVED_ASSUMPTIONS_ID_KEY);
  return raw && raw.trim().length > 0 ? raw.trim() : null;
};

export const setActiveSavedAssumptionsId = (id, { emitChange = true } = {}) => {
  if (!id) {
    globalThis.localStorage.removeItem(ACTIVE_SAVED_ASSUMPTIONS_ID_KEY);
    if (emitChange) {
      emitSavedAssumptionsChanged();
    }
    return;
  }

  globalThis.localStorage.setItem(ACTIVE_SAVED_ASSUMPTIONS_ID_KEY, String(id));
  if (emitChange) {
    emitSavedAssumptionsChanged();
  }
};

export const clearActiveSavedAssumptionsId = ({ emitChange = true } = {}) => {
  globalThis.localStorage.removeItem(ACTIVE_SAVED_ASSUMPTIONS_ID_KEY);
  if (emitChange) {
    emitSavedAssumptionsChanged();
  }
};

export const createAssumptionsFingerprint = (assumptions) => {
  const cleanAssumptions = pruneToSerializableAssumptions(assumptions);
  return cleanAssumptions ? createFingerprint(cleanAssumptions) : '';
};

export const saveNewAssumptions = ({ label, assumptions, source = 'local', reference = null }) => {
  const nowIso = createNowIso();
  const baseEntry = buildLocalEntry({ label, assumptions, nowIso });

  const entry = {
    ...baseEntry,
    source: isValidSource(source) ? source : 'local',
    reference: typeof reference === 'string' && reference.trim().length > 0 ? reference.trim() : null,
    userRenamed: true,
  };

  const current = loadSavedAssumptionsUnsafe();
  if (hasDuplicateLabel(current, entry.label)) {
    return { ok: false, errorCode: 'duplicate_label' };
  }

  const withNew = [entry, ...current];
  const persistResult = persistSavedAssumptions(withNew, { protectEntryIds: new Set([entry.id]) });

  if (!persistResult.ok) {
    return { ok: false, errorCode: persistResult.errorCode || 'storage_write_failed' };
  }

  return {
    ok: true,
    entry,
    evictedCount: persistResult.evictedCount,
    evictedImportedCount: persistResult.evictedImportedCount,
    evictedLocalCount: persistResult.evictedLocalCount,
  };
};

export const updateSavedAssumptions = (id, updates = {}) => {
  const current = loadSavedAssumptionsUnsafe();
  const existing = current.find((entry) => entry.id === id);
  if (!existing) {
    return { ok: false, errorCode: 'not_found' };
  }

  const requestedLabel = updates.label !== undefined ? updates.label : existing.label;
  if (hasDuplicateLabel(current, requestedLabel, { excludeId: id })) {
    return { ok: false, errorCode: 'duplicate_label' };
  }

  const nowIso = createNowIso();
  const updated = buildUpdatedEntry(existing, updates, nowIso);
  const withUpdated = upsertEntryById(current, updated);
  const persistResult = persistSavedAssumptions(withUpdated, { protectEntryIds: new Set([updated.id]) });

  if (!persistResult.ok) {
    return { ok: false, errorCode: persistResult.errorCode || 'storage_write_failed' };
  }

  return {
    ok: true,
    entry: updated,
    evictedCount: persistResult.evictedCount,
    evictedImportedCount: persistResult.evictedImportedCount,
    evictedLocalCount: persistResult.evictedLocalCount,
  };
};

export const renameSavedAssumptions = (id, label) => {
  return updateSavedAssumptions(id, { label });
};

export const deleteSavedAssumptions = (id) => {
  const current = loadSavedAssumptionsUnsafe();
  const next = current.filter((entry) => entry.id !== id);
  if (next.length === current.length) {
    return { ok: false, errorCode: 'not_found' };
  }

  const persistResult = persistSavedAssumptions(next, { emitChange: false });
  if (!persistResult.ok) {
    return { ok: false, errorCode: 'storage_write_failed' };
  }

  if (getActiveSavedAssumptionsId() === id) {
    clearActiveSavedAssumptionsId({ emitChange: false });
  }

  emitSavedAssumptionsChanged();
  return { ok: true };
};

export const loadSavedAssumptionsById = (id) => {
  const current = loadSavedAssumptionsUnsafe();
  const entry = current.find((candidate) => candidate.id === id);
  if (!entry) {
    return null;
  }

  return {
    ...entry,
    shareUrl: buildDerivedShareUrl(entry.reference),
  };
};

export const markSavedAssumptionsLoaded = (id) => {
  return updateSavedAssumptions(id, { markLoaded: true });
};

export const upsertImportedSavedAssumptions = ({ label, assumptions, reference }) => {
  const normalizedReference = typeof reference === 'string' ? reference.trim() : '';
  if (!normalizedReference) {
    return { ok: false, errorCode: 'invalid_reference' };
  }

  const normalizedAssumptions = pruneToSerializableAssumptions(assumptions);
  if (!normalizedAssumptions) {
    return { ok: false, errorCode: 'invalid_assumptions' };
  }

  const current = loadSavedAssumptionsUnsafe();
  const nowIso = createNowIso();
  const existing = current.find((entry) => entry.reference === normalizedReference);
  const incomingLabel = trimLabel(label) || normalizedReference;

  let nextEntry;
  if (existing) {
    nextEntry = {
      ...existing,
      label: existing.userRenamed ? existing.label : incomingLabel,
      assumptions: normalizedAssumptions,
      fingerprint: createFingerprint(normalizedAssumptions),
      source: 'imported',
      reference: normalizedReference,
      updatedAt: nowIso,
      lastLoadedAt: nowIso,
    };
  } else {
    nextEntry = {
      id: createId(),
      label: incomingLabel,
      source: 'imported',
      reference: normalizedReference,
      assumptions: normalizedAssumptions,
      fingerprint: createFingerprint(normalizedAssumptions),
      createdAt: nowIso,
      updatedAt: nowIso,
      lastLoadedAt: nowIso,
      userRenamed: false,
    };
  }

  const withUpsert = upsertEntryById(current, nextEntry);
  const persistResult = persistSavedAssumptions(withUpsert, {
    protectEntryIds: new Set([nextEntry.id]),
    allowLocalEvictionFallback: false,
  });
  if (!persistResult.ok) {
    return { ok: false, errorCode: persistResult.errorCode || 'storage_write_failed' };
  }

  return {
    ok: true,
    entry: nextEntry,
    wasExisting: Boolean(existing),
    evictedCount: persistResult.evictedCount,
    evictedImportedCount: persistResult.evictedImportedCount,
    evictedLocalCount: persistResult.evictedLocalCount,
  };
};

export const maybeRunSavedAssumptionsMigration = ({ currentAssumptions, defaultLabel = 'My Current Assumptions' }) => {
  if (readMigrationStatus()) {
    return { shouldPrompt: false, reason: 'already_migrated' };
  }

  const hasCurrent = pruneToSerializableAssumptions(currentAssumptions);
  if (!hasCurrent) {
    writeMigrationStatus();
    return { shouldPrompt: false, reason: 'no_custom_assumptions' };
  }

  const existing = loadSavedAssumptionsUnsafe();
  if (existing.length > 0) {
    writeMigrationStatus();
    return { shouldPrompt: false, reason: 'library_not_empty' };
  }

  return {
    shouldPrompt: true,
    reason: 'needs_prompt',
    defaultLabel,
  };
};

export const completeSavedAssumptionsMigration = ({
  accepted,
  currentAssumptions,
  label = 'My Current Assumptions',
}) => {
  if (accepted) {
    const saveResult = saveNewAssumptions({
      label,
      assumptions: currentAssumptions,
      source: 'local',
    });

    if (!saveResult.ok) {
      return {
        ok: false,
        errorCode: saveResult.errorCode || 'storage_write_failed',
      };
    }

    setActiveSavedAssumptionsId(saveResult.entry.id);
  }

  writeMigrationStatus();
  return { ok: true };
};

export const __internal = {
  SAVED_ASSUMPTIONS_KEY,
  ACTIVE_SAVED_ASSUMPTIONS_ID_KEY,
  SAVED_ASSUMPTIONS_MIGRATION_KEY,
  MAX_SAVED_ASSUMPTIONS,
  MAX_SAVED_ASSUMPTIONS_BYTES,
  createFingerprint,
  canonicalizeForFingerprint,
  sanitizeForFingerprint,
  applyLimits,
  calculateSerializedBytes,
};
