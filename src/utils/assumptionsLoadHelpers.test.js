import { describe, expect, it } from 'vitest';
import {
  getAssumptionsLoadRequest,
  isCurrentAssumptionsStateRepresentedByLibrary,
  OVERWRITE_UNSAVED_ASSUMPTIONS_MODAL,
} from './assumptionsLoadHelpers';

const defaultEntryId = '__default__';

describe('assumptionsLoadHelpers', () => {
  it('exports the overwrite modal copy used across assumptions selectors', () => {
    expect(OVERWRITE_UNSAVED_ASSUMPTIONS_MODAL).toEqual({
      title: 'Overwrite your unsaved assumptions?',
      description:
        'You already have custom assumptions in this browser. Continuing will replace them with this saved entry.',
      continueLabel: 'Continue (overwrite yours)',
      cancelLabel: 'Cancel',
    });
  });

  describe('isCurrentAssumptionsStateRepresentedByLibrary', () => {
    it('treats non-custom state as already represented', () => {
      expect(
        isCurrentAssumptionsStateRepresentedByLibrary({
          isUsingCustomValues: false,
          currentFingerprint: null,
          libraryEntries: [],
        })
      ).toBe(true);
    });

    it('returns false when custom state has no fingerprint', () => {
      expect(
        isCurrentAssumptionsStateRepresentedByLibrary({
          isUsingCustomValues: true,
          currentFingerprint: null,
          libraryEntries: [],
        })
      ).toBe(false);
    });

    it('matches custom state against saved library fingerprints', () => {
      expect(
        isCurrentAssumptionsStateRepresentedByLibrary({
          isUsingCustomValues: true,
          currentFingerprint: JSON.stringify({ globalParameters: { timeLimit: 500 } }),
          libraryEntries: [{ id: 'saved-1', assumptions: { globalParameters: { timeLimit: 500 } } }],
        })
      ).toBe(true);
    });
  });

  describe('getAssumptionsLoadRequest', () => {
    it('ignores missing entries', () => {
      expect(
        getAssumptionsLoadRequest({
          entry: null,
          activeId: null,
          currentFingerprint: null,
          isUsingCustomValues: false,
          isCurrentStateRepresentedBySavedAssumptions: true,
          defaultEntryId,
        })
      ).toEqual({ type: 'ignore' });
    });

    it('recognizes that default is already active when nothing custom is loaded', () => {
      expect(
        getAssumptionsLoadRequest({
          entry: { id: defaultEntryId },
          activeId: null,
          currentFingerprint: null,
          isUsingCustomValues: false,
          isCurrentStateRepresentedBySavedAssumptions: true,
          defaultEntryId,
        })
      ).toEqual({ type: 'already-default' });
    });

    it('applies default immediately when the current state is already represented', () => {
      expect(
        getAssumptionsLoadRequest({
          entry: { id: defaultEntryId },
          activeId: 'saved-1',
          currentFingerprint: JSON.stringify({ globalParameters: { timeLimit: 100 } }),
          isUsingCustomValues: false,
          isCurrentStateRepresentedBySavedAssumptions: true,
          defaultEntryId,
        })
      ).toEqual({ type: 'apply-default' });
    });

    it('asks for confirmation before loading default over unsaved custom state', () => {
      const entry = { id: defaultEntryId };

      expect(
        getAssumptionsLoadRequest({
          entry,
          activeId: 'saved-1',
          currentFingerprint: JSON.stringify({ globalParameters: { timeLimit: 100 } }),
          isUsingCustomValues: true,
          isCurrentStateRepresentedBySavedAssumptions: false,
          defaultEntryId,
        })
      ).toEqual({ type: 'confirm', entry });
    });

    it('activates a matching entry without reapplying assumptions', () => {
      const entry = {
        id: 'saved-1',
        assumptions: { globalParameters: { timeLimit: 250 } },
      };

      expect(
        getAssumptionsLoadRequest({
          entry,
          activeId: 'saved-2',
          currentFingerprint: JSON.stringify({ globalParameters: { timeLimit: 250 } }),
          isUsingCustomValues: true,
          isCurrentStateRepresentedBySavedAssumptions: true,
          defaultEntryId,
        })
      ).toEqual({ type: 'activate-matching-entry', entry });
    });

    it('asks for confirmation before replacing unsaved custom state with another entry', () => {
      const entry = {
        id: 'saved-2',
        assumptions: { globalParameters: { timeLimit: 300 } },
      };

      expect(
        getAssumptionsLoadRequest({
          entry,
          activeId: 'saved-1',
          currentFingerprint: JSON.stringify({ globalParameters: { timeLimit: 100 } }),
          isUsingCustomValues: true,
          isCurrentStateRepresentedBySavedAssumptions: false,
          defaultEntryId,
        })
      ).toEqual({ type: 'confirm', entry });
    });

    it('applies a different entry immediately when there are no unsaved custom changes', () => {
      const entry = {
        id: 'saved-2',
        assumptions: { globalParameters: { timeLimit: 300 } },
      };

      expect(
        getAssumptionsLoadRequest({
          entry,
          activeId: 'saved-1',
          currentFingerprint: JSON.stringify({ globalParameters: { timeLimit: 100 } }),
          isUsingCustomValues: false,
          isCurrentStateRepresentedBySavedAssumptions: true,
          defaultEntryId,
        })
      ).toEqual({ type: 'apply-entry', entry });
    });
  });
});
