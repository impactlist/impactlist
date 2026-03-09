import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import IconActionButton from './IconActionButton';
import useDismissibleMenu from '../../hooks/useDismissibleMenu';
import { CURRENT_CUSTOM_ENTRY, CURRENT_CUSTOM_ENTRY_ID } from '../../constants/customAssumptionsEntry';
import { DEFAULT_ASSUMPTIONS_ENTRY, DEFAULT_ASSUMPTIONS_ENTRY_ID } from '../../constants/assumptionsLibraryEntries';

export { DEFAULT_ASSUMPTIONS_ENTRY_ID };

const getEntryUiState = (entry, { activeId, editingId, hasUnsavedChanges }) => {
  const isDefaultEntry = entry.id === DEFAULT_ASSUMPTIONS_ENTRY_ID;
  const isCustomEntry = entry.id === CURRENT_CUSTOM_ENTRY_ID;
  const isActive = activeId === entry.id;
  const isEditing = !isDefaultEntry && !isCustomEntry && editingId === entry.id;
  const isCurated = !isDefaultEntry && !isCustomEntry && entry.source === 'curated';
  const isRemote = !isDefaultEntry && !isCustomEntry && Boolean(entry.reference);
  const isLoadDisabled = isActive && !hasUnsavedChanges;
  const shouldShowDescriptionAction = isCustomEntry
    ? true
    : isDefaultEntry
      ? Boolean(entry.description || entry.content)
      : isCurated
        ? Boolean(entry.description || entry.content)
        : !isRemote || Boolean(entry.description);

  return {
    isActive,
    isCustomEntry,
    isCurated,
    isDefaultEntry,
    isEditing,
    isLoadDisabled,
    isRemote,
    shouldShowDescriptionAction,
  };
};

const getRenameErrorMessage = (errorCode) => {
  if (errorCode === 'duplicate_label') {
    return 'You already have saved assumptions with that name. Choose a different name.';
  }

  if (errorCode === 'reserved_curated_label') {
    return 'That name is already used by a curated assumptions set. Choose a different name.';
  }

  return 'Could not rename saved assumptions.';
};

const AssumptionsDropdown = ({
  entries,
  activeId,
  hasUnsavedChanges,
  inlineLabel,
  className,
  menuAriaLabel,
  showCurrentSaveAction,
  showCurrentShareAction,
  showShareForLocal,
  allowEntryManagementActions,
  allowCopyLinkAction,
  onLoad,
  onSaveCurrent,
  onShareCurrent,
  onRename,
  onDelete,
  onCopyLink,
  onDescription,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingSurface, setEditingSurface] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [renameError, setRenameError] = useState('');
  const labelId = useId();
  const buttonId = useId();
  const menuId = useId();
  const currentSelectionId = hasUnsavedChanges ? CURRENT_CUSTOM_ENTRY_ID : activeId;

  const activeEntry = useMemo(() => entries.find((entry) => entry.id === activeId) || null, [entries, activeId]);
  const selectedEntry = useMemo(() => {
    if (currentSelectionId === CURRENT_CUSTOM_ENTRY_ID) {
      return CURRENT_CUSTOM_ENTRY;
    }

    return currentSelectionId === DEFAULT_ASSUMPTIONS_ENTRY_ID
      ? DEFAULT_ASSUMPTIONS_ENTRY
      : activeEntry || DEFAULT_ASSUMPTIONS_ENTRY;
  }, [activeEntry, currentSelectionId]);
  const visibleEntries = useMemo(
    () => [DEFAULT_ASSUMPTIONS_ENTRY, ...entries].filter((entry) => entry.id !== selectedEntry.id),
    [entries, selectedEntry.id]
  );

  const cancelRename = useCallback(() => {
    setEditingId(null);
    setEditingSurface(null);
    setEditLabel('');
    setRenameError('');
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    cancelRename();
  }, [cancelRename]);

  const toggleMenu = useCallback(() => {
    setMenuOpen((current) => !current);
  }, []);

  const dropdownRef = useDismissibleMenu(menuOpen, closeMenu);

  useEffect(() => {
    if (editingSurface === 'menu' && editingId && !menuOpen) {
      cancelRename();
    }
  }, [cancelRename, editingId, editingSurface, menuOpen]);

  const beginRename = useCallback((entry, surface = 'menu') => {
    setEditingId(entry.id);
    setEditingSurface(surface);
    setEditLabel(entry.label);
    setRenameError('');
    setMenuOpen(surface === 'menu');
  }, []);

  const commitRename = useCallback(() => {
    if (!editingId) {
      return;
    }

    const normalized = editLabel.trim();
    if (!normalized) {
      return;
    }

    const result = onRename(editingId, normalized);
    if (result?.ok === false) {
      setRenameError(getRenameErrorMessage(result.errorCode));
      return;
    }

    setEditingId(null);
    setEditLabel('');
    setRenameError('');
  }, [editLabel, editingId, onRename]);

  const handleLoad = useCallback(
    (entry) => {
      onLoad(entry.id === DEFAULT_ASSUMPTIONS_ENTRY_ID ? { id: DEFAULT_ASSUMPTIONS_ENTRY_ID } : entry);
      closeMenu();
    },
    [closeMenu, onLoad]
  );

  const stopActionEvent = useCallback((event, action) => {
    event.preventDefault();
    event.stopPropagation();
    action();
  }, []);

  const selectedEntryUiState = useMemo(
    () => getEntryUiState(selectedEntry, { activeId: currentSelectionId, editingId, hasUnsavedChanges }),
    [currentSelectionId, editingId, hasUnsavedChanges, selectedEntry]
  );

  const renderEntryActions = useCallback(
    (entry, entryUiState, mode = 'menu') => {
      if (entryUiState.isDefaultEntry && !entryUiState.shouldShowDescriptionAction) {
        return null;
      }

      const shouldShowSummarySaveAction = mode === 'summary' && entryUiState.isCustomEntry && showCurrentSaveAction;
      const shouldShowSummaryShareAction =
        mode === 'summary' &&
        (entryUiState.isCustomEntry
          ? showCurrentShareAction
          : showShareForLocal && entry.source === 'local' && !entryUiState.isCurated && !entryUiState.isRemote);

      const canManageEntry =
        allowEntryManagementActions &&
        !entryUiState.isCurated &&
        !entryUiState.isCustomEntry &&
        !entryUiState.isDefaultEntry;
      const canCopyLinkEntry =
        (allowEntryManagementActions || allowCopyLinkAction) &&
        !entryUiState.isDefaultEntry &&
        !entryUiState.isCustomEntry;

      const handleDescription = () => {
        onDescription(entry);
        if (mode === 'menu') {
          setMenuOpen(false);
        }
      };

      return (
        <div className={`saved-assumption-row__actions saved-assumption-row__actions--${mode}`}>
          {shouldShowSummarySaveAction && (
            <button
              type="button"
              onClick={(event) => stopActionEvent(event, onSaveCurrent)}
              className="impact-btn impact-btn--secondary impact-btn--xs saved-assumption-row__summary-btn"
            >
              Save
            </button>
          )}
          {shouldShowSummaryShareAction && (
            <button
              type="button"
              onClick={(event) => stopActionEvent(event, onShareCurrent)}
              className="impact-btn impact-btn--custom-accent impact-btn--xs saved-assumption-row__summary-btn"
            >
              Share
            </button>
          )}
          {canManageEntry && (
            <IconActionButton
              icon="edit"
              label="Rename"
              onClick={
                mode === 'menu'
                  ? (event) => stopActionEvent(event, () => beginRename(entry))
                  : (event) => stopActionEvent(event, () => beginRename(entry, 'summary'))
              }
              className="saved-assumption-row__inline-icon"
            />
          )}
          {entryUiState.shouldShowDescriptionAction && (
            <IconActionButton
              icon="description"
              label={
                entryUiState.isCurated || entry.description || entry.content ? 'View description' : 'Add description'
              }
              onClick={(event) => stopActionEvent(event, handleDescription)}
              className="saved-assumption-row__inline-icon"
            />
          )}
          {canManageEntry && (
            <IconActionButton
              icon="delete"
              label="Delete"
              tone="danger"
              onClick={(event) => stopActionEvent(event, () => onDelete(entry.id))}
              className="saved-assumption-row__inline-icon"
            />
          )}
          {canCopyLinkEntry && entry.shareUrl && (
            <IconActionButton
              icon="copy-link"
              label="Copy Link"
              onClick={(event) => stopActionEvent(event, () => onCopyLink(entry))}
              className="saved-assumption-row__inline-icon"
            />
          )}
        </div>
      );
    },
    [
      allowEntryManagementActions,
      beginRename,
      onCopyLink,
      onDelete,
      onDescription,
      onSaveCurrent,
      onShareCurrent,
      showCurrentSaveAction,
      showCurrentShareAction,
      showShareForLocal,
      allowCopyLinkAction,
      stopActionEvent,
    ]
  );

  const dropdownMarkup = (
    <div
      className={`saved-assumptions-panel ${inlineLabel ? 'saved-assumptions-panel--inline' : ''}`.trim()}
      ref={dropdownRef}
    >
      <div
        className="assumptions-entry assumptions-entry--compact saved-assumptions-panel__summary"
        data-active={selectedEntryUiState.isActive}
        data-dirty={selectedEntryUiState.isActive && hasUnsavedChanges && !selectedEntryUiState.isCustomEntry}
        data-editing={selectedEntryUiState.isEditing}
        onClick={selectedEntryUiState.isEditing ? undefined : toggleMenu}
      >
        <div className="saved-assumption-row__top">
          {selectedEntryUiState.isEditing ? (
            <div className="saved-assumption-row__edit-controls">
              <input
                type="text"
                value={editLabel}
                onChange={(event) => {
                  setEditLabel(event.target.value);
                  setRenameError('');
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    commitRename();
                  } else if (event.key === 'Escape') {
                    event.preventDefault();
                    cancelRename();
                  }
                }}
                className="impact-field__input h-8 rounded-md px-2 text-sm"
                autoFocus
              />
              <button type="button" onClick={commitRename} className="impact-btn impact-btn--secondary impact-btn--xs">
                Save
              </button>
              <button type="button" onClick={cancelRename} className="impact-btn impact-btn--secondary impact-btn--xs">
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button
                id={buttonId}
                type="button"
                className="saved-assumption-row__load-target saved-assumptions-panel__summary-trigger"
                onClick={(event) => {
                  event.stopPropagation();
                  toggleMenu();
                }}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-controls={menuOpen ? menuId : undefined}
                aria-label={
                  inlineLabel ? undefined : `Select assumptions set. Current selection: ${selectedEntry.label}`
                }
                aria-labelledby={inlineLabel ? `${labelId} ${buttonId}` : undefined}
              >
                <span className="saved-assumption-row__identity">
                  <span className="saved-assumption-row__label text-sm font-semibold text-strong">
                    {selectedEntry.label}
                  </span>
                  {!selectedEntryUiState.isDefaultEntry && !selectedEntryUiState.isCustomEntry && (
                    <span
                      className="assumption-state-pill assumption-state-pill--compact"
                      data-state={
                        selectedEntryUiState.isCurated ? 'curated' : selectedEntryUiState.isRemote ? 'remote' : 'local'
                      }
                      title={
                        selectedEntryUiState.isRemote && selectedEntry.reference
                          ? `Remote ref: ${selectedEntry.reference}`
                          : undefined
                      }
                    >
                      {selectedEntryUiState.isCurated ? 'Curated' : selectedEntryUiState.isRemote ? 'Remote' : 'Local'}
                    </span>
                  )}
                </span>
              </button>
              {renderEntryActions(selectedEntry, selectedEntryUiState, 'summary')}
              <span className="saved-assumptions-panel__chevron" aria-hidden={true}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.512a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </>
          )}
        </div>
        {selectedEntryUiState.isEditing && renameError && (
          <p className="assumptions-inline-error mt-2 rounded-md px-2 py-1 text-xs">{renameError}</p>
        )}
      </div>

      {menuOpen && (
        <div id={menuId} className="saved-assumptions-panel__menu" role="menu" aria-label={menuAriaLabel}>
          <div className="saved-assumptions-panel__menu-list">
            {visibleEntries.map((entry) => {
              const entryUiState = getEntryUiState(entry, {
                activeId: currentSelectionId,
                editingId,
                hasUnsavedChanges,
              });

              return (
                <div
                  key={entry.id}
                  className="assumptions-entry assumptions-entry--compact saved-assumptions-panel__menu-entry"
                  data-active={entryUiState.isActive}
                  data-dirty={entryUiState.isActive && hasUnsavedChanges}
                  data-load-disabled={entryUiState.isLoadDisabled}
                  onClick={entryUiState.isEditing || entryUiState.isLoadDisabled ? undefined : () => handleLoad(entry)}
                >
                  <div className="saved-assumption-row__top">
                    {entryUiState.isEditing ? (
                      <div className="saved-assumption-row__edit-controls">
                        <input
                          type="text"
                          value={editLabel}
                          onChange={(event) => {
                            setEditLabel(event.target.value);
                            setRenameError('');
                          }}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              event.preventDefault();
                              commitRename();
                            } else if (event.key === 'Escape') {
                              event.preventDefault();
                              cancelRename();
                            }
                          }}
                          className="impact-field__input h-8 rounded-md px-2 text-sm"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={(event) => stopActionEvent(event, commitRename)}
                          className="impact-btn impact-btn--secondary impact-btn--xs"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={(event) => stopActionEvent(event, cancelRename)}
                          className="impact-btn impact-btn--secondary impact-btn--xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          role="menuitemradio"
                          aria-checked={entryUiState.isActive}
                          disabled={entryUiState.isLoadDisabled}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleLoad(entry);
                          }}
                          className="saved-assumption-row__load-target"
                          data-selected={entryUiState.isActive}
                        >
                          <span className="saved-assumption-row__label text-sm font-semibold text-strong">
                            {entry.label}
                          </span>
                          {!entryUiState.isDefaultEntry && (
                            <span
                              className="assumption-state-pill assumption-state-pill--compact"
                              data-state={
                                entryUiState.isCurated ? 'curated' : entryUiState.isRemote ? 'remote' : 'local'
                              }
                              title={
                                entryUiState.isRemote && entry.reference ? `Remote ref: ${entry.reference}` : undefined
                              }
                            >
                              {entryUiState.isCurated ? 'Curated' : entryUiState.isRemote ? 'Remote' : 'Local'}
                            </span>
                          )}
                        </button>
                        {renderEntryActions(entry, entryUiState)}
                      </>
                    )}
                  </div>
                  {entryUiState.isEditing && renameError && (
                    <p className="assumptions-inline-error mt-2 rounded-md px-2 py-1 text-xs">{renameError}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  if (!inlineLabel) {
    return <div className={className}>{dropdownMarkup}</div>;
  }

  return (
    <div className={`assumptions-selector-bar assumptions-selector-bar--inline ${className}`.trim()}>
      <div id={labelId} className="assumptions-selector-bar__label">
        {inlineLabel}
      </div>
      <div className="assumptions-selector-bar__control assumptions-selector-bar__control--rich">{dropdownMarkup}</div>
    </div>
  );
};

AssumptionsDropdown.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string,
      content: PropTypes.string,
      source: PropTypes.oneOf(['local', 'imported', 'curated']),
      reference: PropTypes.string,
      shareUrl: PropTypes.string,
    })
  ).isRequired,
  activeId: PropTypes.string,
  hasUnsavedChanges: PropTypes.bool,
  inlineLabel: PropTypes.node,
  className: PropTypes.string,
  menuAriaLabel: PropTypes.string,
  showCurrentSaveAction: PropTypes.bool,
  showCurrentShareAction: PropTypes.bool,
  showShareForLocal: PropTypes.bool,
  allowEntryManagementActions: PropTypes.bool,
  allowCopyLinkAction: PropTypes.bool,
  onLoad: PropTypes.func.isRequired,
  onSaveCurrent: PropTypes.func,
  onShareCurrent: PropTypes.func,
  onRename: PropTypes.func,
  onDelete: PropTypes.func,
  onCopyLink: PropTypes.func,
  onDescription: PropTypes.func.isRequired,
};

AssumptionsDropdown.defaultProps = {
  activeId: null,
  hasUnsavedChanges: false,
  inlineLabel: null,
  className: '',
  menuAriaLabel: 'Assumptions options',
  showCurrentSaveAction: false,
  showCurrentShareAction: false,
  showShareForLocal: false,
  allowEntryManagementActions: false,
  allowCopyLinkAction: false,
  onSaveCurrent: () => {},
  onShareCurrent: () => {},
  onRename: () => ({ ok: true }),
  onDelete: () => {},
  onCopyLink: () => {},
};

export default AssumptionsDropdown;
