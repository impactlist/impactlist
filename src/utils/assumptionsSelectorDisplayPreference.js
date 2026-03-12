import { CURRENT_CUSTOM_ENTRY } from '../constants/customAssumptionsEntry';
import { DEFAULT_ASSUMPTIONS_ENTRY, DEFAULT_ASSUMPTIONS_ENTRY_ID } from '../constants/assumptionsLibraryEntries';

export const SHOW_ASSUMPTIONS_SELECTOR_EVERY_PAGE_KEY = 'showAssumptionsSelectorEveryPage:v1';
export const ASSUMPTIONS_SELECTOR_PREFERENCE_CHANGED_EVENT = 'assumptions-selector-preference:changed';
// Temporary UI simplification: keep the lightweight selector enabled sitewide,
// but hide the Assumptions-page preference control until we decide to bring it back.
export const ASSUMPTIONS_SELECTOR_PREFERENCE_CONTROL_ENABLED = false;

export const getShowAssumptionsSelectorEveryPage = () => {
  if (!ASSUMPTIONS_SELECTOR_PREFERENCE_CONTROL_ENABLED) {
    return true;
  }

  return globalThis.localStorage?.getItem(SHOW_ASSUMPTIONS_SELECTOR_EVERY_PAGE_KEY) === '1';
};

export const setShowAssumptionsSelectorEveryPage = (shouldShow) => {
  globalThis.localStorage?.setItem(SHOW_ASSUMPTIONS_SELECTOR_EVERY_PAGE_KEY, shouldShow ? '1' : '0');

  if (typeof globalThis.dispatchEvent === 'function') {
    globalThis.dispatchEvent(
      new globalThis.CustomEvent(ASSUMPTIONS_SELECTOR_PREFERENCE_CHANGED_EVENT, {
        detail: { shouldShow },
      })
    );
  }
};

export const getActiveAssumptionsLabel = ({ activeLibraryEntry, activeSavedAssumptionsId, hasUnsavedChanges }) => {
  if (hasUnsavedChanges) {
    return CURRENT_CUSTOM_ENTRY.label;
  }

  if (!activeLibraryEntry || activeSavedAssumptionsId === DEFAULT_ASSUMPTIONS_ENTRY_ID) {
    return DEFAULT_ASSUMPTIONS_ENTRY.label;
  }

  return activeLibraryEntry.label;
};
