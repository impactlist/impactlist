import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { getCuratedAssumptionsEntries, isCuratedAssumptionsEntryId } from '../../utils/curatedAssumptionsProfiles';
import {
  createComparableAssumptionsFingerprint,
  getActiveSavedAssumptionsId,
  getSavedAssumptions,
  markSavedAssumptionsLoaded,
  SAVED_ASSUMPTIONS_CHANGED_EVENT,
  setActiveSavedAssumptionsId,
} from '../../utils/savedAssumptionsStore';
import { useAssumptions } from '../../contexts/AssumptionsContext';
import AssumptionsDescriptionModal from '../AssumptionsDescriptionModal';
import IconActionButton from './IconActionButton';
import useDismissibleMenu from '../../hooks/useDismissibleMenu';

const DEFAULT_ASSUMPTIONS_SELECTOR_VALUE = '__default__';
const CURRENT_CUSTOM_ASSUMPTIONS_SELECTOR_VALUE = '__current_custom__';

const AssumptionsSelector = ({ className = '' }) => {
  const [savedAssumptions, setSavedAssumptions] = useState([]);
  const [activeSavedAssumptionsIdState, setActiveSavedAssumptionsIdState] = useState(null);
  const [assumptionsMenuOpen, setAssumptionsMenuOpen] = useState(false);
  const [pendingDescriptionEntry, setPendingDescriptionEntry] = useState(null);
  const labelId = useId();
  const buttonId = useId();
  const { getNormalizedUserAssumptionsForSharing, isUsingCustomValues, setAllUserAssumptions } = useAssumptions();
  const closeAssumptionsMenu = useCallback(() => {
    setAssumptionsMenuOpen(false);
  }, []);
  const assumptionsMenuRef = useDismissibleMenu(assumptionsMenuOpen, closeAssumptionsMenu);

  const curatedAssumptions = useMemo(() => getCuratedAssumptionsEntries(), []);
  const libraryEntries = useMemo(
    () => [...curatedAssumptions, ...savedAssumptions],
    [curatedAssumptions, savedAssumptions]
  );
  const currentAssumptionsFingerprint = useMemo(
    () => createComparableAssumptionsFingerprint(getNormalizedUserAssumptionsForSharing()),
    [getNormalizedUserAssumptionsForSharing]
  );
  const activeLibraryEntry = libraryEntries.find((entry) => entry.id === activeSavedAssumptionsIdState) || null;
  const activeLibraryEntryFingerprint = useMemo(
    () => createComparableAssumptionsFingerprint(activeLibraryEntry?.assumptions),
    [activeLibraryEntry]
  );
  const isUsingCurrentCustomAssumptions =
    isUsingCustomValues && (!activeLibraryEntry || activeLibraryEntryFingerprint !== currentAssumptionsFingerprint);
  const assumptionsSelectorValue = isUsingCurrentCustomAssumptions
    ? CURRENT_CUSTOM_ASSUMPTIONS_SELECTOR_VALUE
    : activeSavedAssumptionsIdState || DEFAULT_ASSUMPTIONS_SELECTOR_VALUE;

  const assumptionsMenuEntries = useMemo(() => {
    const entries = [{ id: DEFAULT_ASSUMPTIONS_SELECTOR_VALUE, label: 'Default' }];

    if (isUsingCurrentCustomAssumptions) {
      entries.push({ id: CURRENT_CUSTOM_ASSUMPTIONS_SELECTOR_VALUE, label: 'Current custom assumptions' });
    }

    curatedAssumptions.forEach((entry) => {
      entries.push(entry);
    });

    savedAssumptions.forEach((entry) => {
      entries.push(entry);
    });

    return entries;
  }, [curatedAssumptions, isUsingCurrentCustomAssumptions, savedAssumptions]);

  const selectedAssumptionsLabel =
    assumptionsMenuEntries.find((entry) => entry.id === assumptionsSelectorValue)?.label || 'Default';

  const refreshSavedAssumptions = useCallback(() => {
    const entries = getSavedAssumptions();
    const activeId = getActiveSavedAssumptionsId();
    const activeExists =
      activeId && (entries.some((entry) => entry.id === activeId) || isCuratedAssumptionsEntryId(activeId));

    setSavedAssumptions(entries);
    setActiveSavedAssumptionsIdState(activeExists ? activeId : null);
  }, []);

  useEffect(() => {
    refreshSavedAssumptions();
  }, [refreshSavedAssumptions]);

  useEffect(() => {
    const handleSavedAssumptionsChanged = () => {
      refreshSavedAssumptions();
    };

    globalThis.addEventListener(SAVED_ASSUMPTIONS_CHANGED_EVENT, handleSavedAssumptionsChanged);
    return () => {
      globalThis.removeEventListener(SAVED_ASSUMPTIONS_CHANGED_EVENT, handleSavedAssumptionsChanged);
    };
  }, [refreshSavedAssumptions]);

  const handleAssumptionsSelectionChange = useCallback(
    (nextValue) => {
      if (nextValue === DEFAULT_ASSUMPTIONS_SELECTOR_VALUE) {
        setAllUserAssumptions(null);
        setActiveSavedAssumptionsId(null);
        setActiveSavedAssumptionsIdState(null);
        setAssumptionsMenuOpen(false);
        return;
      }

      if (nextValue === CURRENT_CUSTOM_ASSUMPTIONS_SELECTOR_VALUE) {
        setAssumptionsMenuOpen(false);
        return;
      }

      const nextEntry = libraryEntries.find((entry) => entry.id === nextValue);
      if (!nextEntry) {
        return;
      }

      setAllUserAssumptions(nextEntry.assumptions);

      if (nextEntry.source !== 'curated') {
        markSavedAssumptionsLoaded(nextEntry.id);
      }

      setActiveSavedAssumptionsId(nextEntry.id);
      setActiveSavedAssumptionsIdState(nextEntry.id);
      setAssumptionsMenuOpen(false);
    },
    [libraryEntries, setAllUserAssumptions]
  );

  const handleDescriptionModalOpen = useCallback((entry) => {
    if (!entry?.id || (!entry.description && !entry.content)) {
      return;
    }

    setPendingDescriptionEntry(entry);
    setAssumptionsMenuOpen(false);
  }, []);

  const handleDescriptionModalClose = useCallback(() => {
    setPendingDescriptionEntry(null);
  }, []);

  return (
    <>
      <div className={`assumptions-selector-bar ${className}`.trim()} ref={assumptionsMenuRef}>
        <span id={labelId} className="assumptions-selector-bar__label">
          Using assumptions:
        </span>
        <div className="assumptions-selector-bar__control">
          <button
            id={buttonId}
            type="button"
            className="assumptions-selector-bar__trigger"
            onClick={() => setAssumptionsMenuOpen((current) => !current)}
            aria-haspopup="menu"
            aria-expanded={assumptionsMenuOpen}
            aria-labelledby={`${labelId} ${buttonId}`}
          >
            <span className="assumptions-selector-bar__trigger-text">{selectedAssumptionsLabel}</span>
          </button>
          <span className="assumptions-selector-bar__chevron" aria-hidden={true}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.512a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          {assumptionsMenuOpen && (
            <div className="assumptions-selector-bar__menu" role="menu" aria-label="Assumptions options">
              {assumptionsMenuEntries.map((entry) => {
                const isSelected = entry.id === assumptionsSelectorValue;
                const canShowDescription = Boolean(entry.description || entry.content);

                return (
                  <div key={entry.id} className="assumptions-selector-bar__menu-row">
                    <button
                      type="button"
                      role="menuitemradio"
                      aria-checked={isSelected}
                      className="assumptions-selector-bar__menu-item"
                      data-selected={isSelected}
                      onClick={() => handleAssumptionsSelectionChange(entry.id)}
                    >
                      {entry.label}
                    </button>
                    {canShowDescription && (
                      <IconActionButton
                        icon="description"
                        label={`View description for ${entry.label}`}
                        onClick={() => handleDescriptionModalOpen(entry)}
                        className="assumptions-selector-bar__description-btn"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <AssumptionsDescriptionModal
        isOpen={Boolean(pendingDescriptionEntry)}
        entryLabel={pendingDescriptionEntry?.label || ''}
        initialDescription={pendingDescriptionEntry?.content || pendingDescriptionEntry?.description || ''}
        isReadOnly={true}
        onClose={handleDescriptionModalClose}
      />
    </>
  );
};

AssumptionsSelector.propTypes = {
  className: PropTypes.string,
};

export default AssumptionsSelector;
