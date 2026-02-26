import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  attachSavedAssumptionsShareReference,
  completeSavedAssumptionsMigration,
  createAssumptionsFingerprint,
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

  it('appends a numeric suffix when imported label collides with an existing entry label', () => {
    const local = saveNewAssumptions({
      label: 'Shared Name',
      assumptions: buildAssumptions(101),
      source: 'local',
    });
    expect(local.ok).toBe(true);

    const importResult = upsertImportedSavedAssumptions({
      label: 'Shared Name',
      assumptions: buildAssumptions(202),
      reference: 'incoming-shared-name',
    });

    expect(importResult.ok).toBe(true);

    const entries = getSavedAssumptions();
    expect(entries).toHaveLength(2);
    const importedEntry = entries.find((entry) => entry.reference === 'incoming-shared-name');
    expect(importedEntry).toBeTruthy();
    expect(importedEntry.label).toBe('Shared Name (2)');
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

  it('attaches a share reference to a matching local entry', () => {
    const saved = saveNewAssumptions({
      label: 'Local Snapshot',
      assumptions: buildAssumptions(140),
      source: 'local',
    });

    expect(saved.ok).toBe(true);

    const attachResult = attachSavedAssumptionsShareReference({
      reference: 'shared-140',
      assumptions: buildAssumptions(140),
      preferredId: saved.entry.id,
    });

    expect(attachResult.ok).toBe(true);

    const entries = getSavedAssumptions();
    expect(entries).toHaveLength(1);
    expect(entries[0].source).toBe('local');
    expect(entries[0].reference).toBe('shared-140');
    expect(entries[0].shareUrl).toBe(`${window.location.origin}/?shared=shared-140`);
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

  it('rejects saving a new entry with a duplicate label (case-insensitive)', () => {
    const first = saveNewAssumptions({
      label: 'My Model',
      assumptions: buildAssumptions(100),
    });
    expect(first.ok).toBe(true);

    const duplicate = saveNewAssumptions({
      label: ' my model ',
      assumptions: buildAssumptions(120),
    });
    expect(duplicate.ok).toBe(false);
    expect(duplicate.errorCode).toBe('duplicate_label');

    const entries = getSavedAssumptions();
    expect(entries).toHaveLength(1);
  });

  it('can auto-resolve duplicate labels when requested', () => {
    const first = saveNewAssumptions({
      label: 'My Model',
      assumptions: buildAssumptions(100),
    });
    expect(first.ok).toBe(true);

    const duplicateResolved = saveNewAssumptions({
      label: ' my model ',
      assumptions: buildAssumptions(120),
      resolveDuplicateLabel: true,
    });
    expect(duplicateResolved.ok).toBe(true);
    expect(duplicateResolved.entry.label).toBe('my model (2)');

    const entries = getSavedAssumptions();
    expect(entries).toHaveLength(2);
  });

  it('rejects renaming an entry to a label already used by another entry', () => {
    const first = saveNewAssumptions({
      label: 'First Label',
      assumptions: buildAssumptions(100),
    });
    const second = saveNewAssumptions({
      label: 'Second Label',
      assumptions: buildAssumptions(120),
    });
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);

    const renameResult = renameSavedAssumptions(second.entry.id, ' first label ');
    expect(renameResult.ok).toBe(false);
    expect(renameResult.errorCode).toBe('duplicate_label');
  });
});
