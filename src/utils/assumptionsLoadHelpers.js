import { createComparableAssumptionsFingerprint } from './savedAssumptionsStore';

export const OVERWRITE_UNSAVED_ASSUMPTIONS_MODAL = Object.freeze({
  title: 'Overwrite your unsaved assumptions?',
  description:
    'You already have custom assumptions in this browser. Continuing will replace them with this saved entry.',
  continueLabel: 'Continue (overwrite yours)',
  cancelLabel: 'Cancel',
});

export const isCurrentAssumptionsStateRepresentedByLibrary = ({
  isUsingCustomValues,
  currentFingerprint,
  libraryEntries,
}) => {
  if (!isUsingCustomValues) {
    return true;
  }

  if (!currentFingerprint) {
    return false;
  }

  return libraryEntries.some(
    (entry) => createComparableAssumptionsFingerprint(entry.assumptions) === currentFingerprint
  );
};

export const getAssumptionsLoadRequest = ({
  entry,
  activeId,
  currentFingerprint,
  isUsingCustomValues,
  isCurrentStateRepresentedBySavedAssumptions,
  defaultEntryId,
}) => {
  if (!entry) {
    return { type: 'ignore' };
  }

  if (entry.id === defaultEntryId) {
    if (!isUsingCustomValues && !activeId) {
      return { type: 'already-default' };
    }

    return isCurrentStateRepresentedBySavedAssumptions ? { type: 'apply-default' } : { type: 'confirm', entry };
  }

  const entryFingerprint = createComparableAssumptionsFingerprint(entry.assumptions);
  if (entryFingerprint && entryFingerprint === currentFingerprint) {
    return { type: 'activate-matching-entry', entry };
  }

  if (isUsingCustomValues && !isCurrentStateRepresentedBySavedAssumptions) {
    return { type: 'confirm', entry };
  }

  return { type: 'apply-entry', entry };
};
