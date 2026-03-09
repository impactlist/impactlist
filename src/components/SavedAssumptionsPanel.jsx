import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import IconActionButton from './shared/IconActionButton';
import useDismissibleMenu from '../hooks/useDismissibleMenu';

const DEFAULT_ENTRY_ID = '__default__';
const DEFAULT_ENTRY = Object.freeze({
  id: DEFAULT_ENTRY_ID,
  label: 'Default',
});

const getEntryUiState = (entry, { activeId, editingId, hasUnsavedChanges }) => {
  const isDefaultEntry = entry.id === DEFAULT_ENTRY_ID;
  const isActive = activeId === entry.id;
  const isEditing = !isDefaultEntry && editingId === entry.id;
  const isCurated = !isDefaultEntry && entry.source === 'curated';
  const isRemote = !isDefaultEntry && Boolean(entry.reference);
  const isLoadDisabled = isActive && !hasUnsavedChanges;
  const shouldShowDescriptionAction =
    !isDefaultEntry &&
    (isCurated ? Boolean(entry.description || entry.content) : !isRemote || Boolean(entry.description));

  return {
    isActive,
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

const SavedAssumptionsPanel = ({
  entries,
  activeId,
  hasUnsavedChanges,
  onLoad,
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
  const buttonId = useId();
  const menuId = useId();

  const activeEntry = useMemo(() => entries.find((entry) => entry.id === activeId) || null, [entries, activeId]);
  const selectedEntry = activeId === DEFAULT_ENTRY_ID ? DEFAULT_ENTRY : activeEntry || DEFAULT_ENTRY;
  const visibleEntries = useMemo(
    () => [DEFAULT_ENTRY, ...entries].filter((entry) => entry.id !== selectedEntry.id),
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

  const panelRef = useDismissibleMenu(menuOpen, closeMenu);

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
      onLoad(entry.id === DEFAULT_ENTRY_ID ? { id: DEFAULT_ENTRY_ID } : entry);
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
    () => getEntryUiState(selectedEntry, { activeId, editingId, hasUnsavedChanges }),
    [activeId, editingId, hasUnsavedChanges, selectedEntry]
  );

  const renderEntryActions = useCallback(
    (entry, entryUiState, mode = 'menu') => {
      if (entryUiState.isDefaultEntry) {
        return null;
      }

      const handleDescription = () => {
        onDescription(entry);
        if (mode === 'menu') {
          setMenuOpen(false);
        }
      };

      return (
        <div className={`saved-assumption-row__actions saved-assumption-row__actions--${mode}`}>
          {!entryUiState.isCurated && (
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
          {!entryUiState.isCurated && (
            <IconActionButton
              icon="delete"
              label="Delete"
              tone="danger"
              onClick={(event) => stopActionEvent(event, () => onDelete(entry.id))}
              className="saved-assumption-row__inline-icon"
            />
          )}
          {!entryUiState.isCurated && entry.shareUrl && (
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
    [beginRename, onCopyLink, onDelete, onDescription, stopActionEvent]
  );

  return (
    <section className="assumptions-shell mb-5">
      <div className="flex items-center justify-between px-4 py-3 sm:px-5">
        <h2 className="assumptions-title text-2xl font-semibold text-strong">Assumptions Library</h2>
      </div>

      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        <div className="saved-assumptions-panel" ref={panelRef}>
          <div
            className="assumptions-entry assumptions-entry--compact saved-assumptions-panel__summary"
            data-active={selectedEntryUiState.isActive}
            data-dirty={selectedEntryUiState.isActive && hasUnsavedChanges}
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
                  <button
                    type="button"
                    onClick={commitRename}
                    className="impact-btn impact-btn--secondary impact-btn--xs"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={cancelRename}
                    className="impact-btn impact-btn--secondary impact-btn--xs"
                  >
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
                    aria-label={`Select assumptions set. Current selection: ${selectedEntry.label}`}
                  >
                    <span className="saved-assumption-row__identity">
                      <span className="saved-assumption-row__label text-sm font-semibold text-strong">
                        {selectedEntry.label}
                      </span>
                      {!selectedEntryUiState.isDefaultEntry && (
                        <span
                          className="assumption-state-pill assumption-state-pill--compact"
                          data-state={
                            selectedEntryUiState.isCurated
                              ? 'curated'
                              : selectedEntryUiState.isRemote
                                ? 'remote'
                                : 'local'
                          }
                          title={
                            selectedEntryUiState.isRemote && selectedEntry.reference
                              ? `Remote ref: ${selectedEntry.reference}`
                              : undefined
                          }
                        >
                          {selectedEntryUiState.isCurated
                            ? 'Curated'
                            : selectedEntryUiState.isRemote
                              ? 'Remote'
                              : 'Local'}
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
            <div
              id={menuId}
              className="saved-assumptions-panel__menu"
              role="menu"
              aria-label="Assumptions Library entries"
            >
              <div className="saved-assumptions-panel__menu-list">
                {visibleEntries.map((entry) => {
                  const entryUiState = getEntryUiState(entry, { activeId, editingId, hasUnsavedChanges });

                  return (
                    <div
                      key={entry.id}
                      className="assumptions-entry assumptions-entry--compact saved-assumptions-panel__menu-entry"
                      data-active={entryUiState.isActive}
                      data-dirty={entryUiState.isActive && hasUnsavedChanges}
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
                              onClick={() => handleLoad(entry)}
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
                                    entryUiState.isRemote && entry.reference
                                      ? `Remote ref: ${entry.reference}`
                                      : undefined
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
      </div>
    </section>
  );
};

SavedAssumptionsPanel.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string,
      content: PropTypes.string,
      source: PropTypes.oneOf(['local', 'imported', 'curated']).isRequired,
      reference: PropTypes.string,
      shareUrl: PropTypes.string,
      updatedAt: PropTypes.string,
      lastLoadedAt: PropTypes.string,
    })
  ).isRequired,
  activeId: PropTypes.string,
  hasUnsavedChanges: PropTypes.bool,
  onLoad: PropTypes.func.isRequired,
  onRename: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCopyLink: PropTypes.func.isRequired,
  onDescription: PropTypes.func.isRequired,
};

SavedAssumptionsPanel.defaultProps = {
  activeId: null,
  hasUnsavedChanges: false,
};

export default SavedAssumptionsPanel;
