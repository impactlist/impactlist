import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  completeSavedAssumptionsMigration,
  createAssumptionsFingerprint,
  deleteAllImportedAssumptions,
  deleteSavedAssumptions,
  getActiveSavedAssumptionsId,
  getSavedAssumptions,
  markSavedAssumptionsLoaded,
  maybeRunSavedAssumptionsMigration,
  renameSavedAssumptions,
  saveNewAssumptions,
  setActiveSavedAssumptionsId,
  upsertImportedSavedAssumptions,
  __internal,
} from './savedAssumptionsStore';

/* global localStorage, Storage */

const buildAssumptions = (timeLimit) => ({
  globalParameters: {
    timeLimit,
  },
  categories: {},
  recipients: {},
});

describe('savedAssumptionsStore', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('saves and returns local assumptions entries', () => {
    const saveResult = saveNewAssumptions({
      label: 'My Model',
      assumptions: buildAssumptions(120),
    });

    expect(saveResult.ok).toBe(true);

    const entries = getSavedAssumptions();
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      label: 'My Model',
      source: 'local',
      reference: null,
      shareUrl: null,
    });
    expect(entries[0].fingerprint).toBe(createAssumptionsFingerprint(buildAssumptions(120)));
  });

  it('derives share url for imported entries and keeps user rename on re-import', () => {
    const firstImport = upsertImportedSavedAssumptions({
      label: 'Incoming A',
      assumptions: buildAssumptions(100),
      reference: 'incoming-a',
    });

    expect(firstImport.ok).toBe(true);
    const firstEntry = getSavedAssumptions()[0];
    expect(firstEntry.shareUrl).toBe(`${window.location.origin}/?shared=incoming-a`);

    const renameResult = renameSavedAssumptions(firstEntry.id, 'My Renamed Copy');
    expect(renameResult.ok).toBe(true);

    const secondImport = upsertImportedSavedAssumptions({
      label: 'New Upstream Name',
      assumptions: buildAssumptions(160),
      reference: 'incoming-a',
    });

    expect(secondImport.ok).toBe(true);

    const latest = getSavedAssumptions()[0];
    expect(latest.label).toBe('My Renamed Copy');
    expect(latest.reference).toBe('incoming-a');
    expect(latest.fingerprint).toBe(createAssumptionsFingerprint(buildAssumptions(160)));
  });

  it('tracks and clears active saved assumptions id', () => {
    const saveResult = saveNewAssumptions({
      label: 'Current',
      assumptions: buildAssumptions(130),
    });

    expect(saveResult.ok).toBe(true);
    setActiveSavedAssumptionsId(saveResult.entry.id);
    expect(getActiveSavedAssumptionsId()).toBe(saveResult.entry.id);

    const deleteResult = deleteSavedAssumptions(saveResult.entry.id);
    expect(deleteResult.ok).toBe(true);
    expect(getActiveSavedAssumptionsId()).toBeNull();
  });

  it('marks entries loaded and updates lastLoadedAt', () => {
    const saveResult = saveNewAssumptions({
      label: 'Loadable',
      assumptions: buildAssumptions(111),
    });

    expect(saveResult.ok).toBe(true);
    const markResult = markSavedAssumptionsLoaded(saveResult.entry.id);
    expect(markResult.ok).toBe(true);

    const entries = getSavedAssumptions();
    expect(entries[0].lastLoadedAt).toBeTruthy();
  });

  it('deletes all imported assumptions while preserving local ones', () => {
    saveNewAssumptions({ label: 'Local 1', assumptions: buildAssumptions(101) });
    upsertImportedSavedAssumptions({ label: 'Imported 1', assumptions: buildAssumptions(102), reference: 'imp-1' });
    upsertImportedSavedAssumptions({ label: 'Imported 2', assumptions: buildAssumptions(103), reference: 'imp-2' });

    const deleteResult = deleteAllImportedAssumptions();
    expect(deleteResult.ok).toBe(true);
    expect(deleteResult.deletedCount).toBe(2);

    const entries = getSavedAssumptions();
    expect(entries).toHaveLength(1);
    expect(entries[0].source).toBe('local');
  });

  it('runs one-time migration and records migration flag on decline', () => {
    const shouldPrompt = maybeRunSavedAssumptionsMigration({
      currentAssumptions: buildAssumptions(145),
      defaultLabel: 'My Current Assumptions',
    });

    expect(shouldPrompt.shouldPrompt).toBe(true);

    const declineResult = completeSavedAssumptionsMigration({
      accepted: false,
      currentAssumptions: buildAssumptions(145),
    });

    expect(declineResult.ok).toBe(true);

    const secondCheck = maybeRunSavedAssumptionsMigration({
      currentAssumptions: buildAssumptions(145),
      defaultLabel: 'My Current Assumptions',
    });

    expect(secondCheck.shouldPrompt).toBe(false);
    expect(secondCheck.reason).toBe('already_migrated');
    expect(getSavedAssumptions()).toHaveLength(0);
  });

  it('stores migrated entry and sets active id on migration accept', () => {
    const migrationResult = completeSavedAssumptionsMigration({
      accepted: true,
      currentAssumptions: buildAssumptions(160),
      label: 'Migrated',
    });

    expect(migrationResult.ok).toBe(true);

    const entries = getSavedAssumptions();
    expect(entries).toHaveLength(1);
    expect(entries[0].label).toBe('Migrated');
    expect(getActiveSavedAssumptionsId()).toBe(entries[0].id);
  });

  it('returns over_limit when a single protected save cannot fit max serialized size', () => {
    const hugeAssumptions = {
      globalParameters: {
        oversizedPayload: 'x'.repeat(__internal.MAX_SAVED_ASSUMPTIONS_BYTES + 1024),
      },
      categories: {},
      recipients: {},
    };

    const result = saveNewAssumptions({
      label: 'Too Big',
      assumptions: hugeAssumptions,
    });

    expect(result.ok).toBe(false);
    expect(result.errorCode).toBe('over_limit');
    expect(getSavedAssumptions()).toHaveLength(0);
  });

  it('does not evict local entries when auto-capturing imported assumptions over capacity', () => {
    for (let i = 0; i < __internal.MAX_SAVED_ASSUMPTIONS; i += 1) {
      const saveResult = saveNewAssumptions({
        label: `Local ${i + 1}`,
        assumptions: buildAssumptions(200 + i),
      });
      expect(saveResult.ok).toBe(true);
    }

    const importResult = upsertImportedSavedAssumptions({
      label: 'Incoming',
      assumptions: buildAssumptions(999),
      reference: 'incoming-over-limit',
    });

    expect(importResult.ok).toBe(false);
    expect(importResult.errorCode).toBe('over_limit');

    const entries = getSavedAssumptions();
    expect(entries).toHaveLength(__internal.MAX_SAVED_ASSUMPTIONS);
    expect(entries.every((entry) => entry.source === 'local')).toBe(true);
  });

  it('returns storage_write_failed when localStorage write throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });

    const saveResult = saveNewAssumptions({
      label: 'Will Fail',
      assumptions: buildAssumptions(170),
    });

    expect(saveResult.ok).toBe(false);
    expect(saveResult.errorCode).toBe('storage_write_failed');
  });

  it('creates stable fingerprints regardless of object key order', () => {
    const fp1 = createAssumptionsFingerprint({
      globalParameters: {
        b: 2,
        a: 1,
      },
      categories: {
        z: { effects: [] },
        a: { effects: [] },
      },
      recipients: {},
    });

    const fp2 = createAssumptionsFingerprint({
      recipients: {},
      categories: {
        a: { effects: [] },
        z: { effects: [] },
      },
      globalParameters: {
        a: 1,
        b: 2,
      },
    });

    expect(fp1).toBe(fp2);
  });
});
