import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import IconActionButton from './shared/IconActionButton';
import useDismissibleMenu from '../hooks/useDismissibleMenu';

const DEFAULT_ENTRY_ID = '__default__';
const DEFAULT_ENTRY = Object.freeze({
  id: DEFAULT_ENTRY_ID,
  label: 'Default',
});

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
  const [editLabel, setEditLabel] = useState('');
  const [renameError, setRenameError] = useState('');
  const buttonId = useId();
  const menuId = useId();

  const activeEntry = useMemo(() => entries.find((entry) => entry.id === activeId) || null, [entries, activeId]);
  const selectedEntry = activeId === DEFAULT_ENTRY_ID ? DEFAULT_ENTRY : activeEntry || DEFAULT_ENTRY;
  const visibleEntries = useMemo(() => [DEFAULT_ENTRY, ...entries], [entries]);

  const cancelRename = useCallback(() => {
    setEditingId(null);
    setEditLabel('');
    setRenameError('');
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    cancelRename();
  }, [cancelRename]);

  const panelRef = useDismissibleMenu(menuOpen, closeMenu);

  useEffect(() => {
    if (editingId && !menuOpen) {
      cancelRename();
    }
  }, [cancelRename, editingId, menuOpen]);

  const beginRename = useCallback((entry) => {
    setEditingId(entry.id);
    setEditLabel(entry.label);
    setRenameError('');
    setMenuOpen(true);
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

  return (
    <section className="assumptions-shell mb-5">
      <div className="flex items-center justify-between px-4 py-3 sm:px-5">
        <h2 className="assumptions-title text-2xl font-semibold text-strong">Assumptions Library</h2>
      </div>

      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        <div className="saved-assumptions-panel" ref={panelRef}>
          <button
            id={buttonId}
            type="button"
            className="saved-assumptions-panel__trigger"
            onClick={() => setMenuOpen((current) => !current)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? menuId : undefined}
            aria-label={`Select assumptions set. Current selection: ${selectedEntry.label}`}
          >
            <span className="saved-assumptions-panel__trigger-text">{selectedEntry.label}</span>
            <span className="saved-assumptions-panel__chevron" aria-hidden={true}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.512a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </button>

          {menuOpen && (
            <div
              id={menuId}
              className="saved-assumptions-panel__menu"
              role="menu"
              aria-label="Assumptions Library entries"
            >
              <div className="saved-assumptions-panel__menu-list">
                {visibleEntries.map((entry) => {
                  const isDefaultEntry = entry.id === DEFAULT_ENTRY_ID;
                  const isActive = activeId === entry.id;
                  const isEditing = !isDefaultEntry && editingId === entry.id;
                  const isCurated = !isDefaultEntry && entry.source === 'curated';
                  const isRemote = !isDefaultEntry && Boolean(entry.reference);
                  const isLoadDisabled = isActive && !hasUnsavedChanges;
                  // Local entries can always open the description editor; remote entries only surface the action
                  // when a description already exists because remote descriptions are view-only.
                  const shouldShowDescriptionAction =
                    !isDefaultEntry &&
                    (isCurated ? Boolean(entry.description || entry.content) : !isRemote || Boolean(entry.description));

                  return (
                    <div
                      key={entry.id}
                      className="assumptions-entry assumptions-entry--compact saved-assumptions-panel__menu-entry"
                      data-active={isActive}
                      data-dirty={isActive && hasUnsavedChanges}
                    >
                      <div className="saved-assumption-row__top">
                        {isEditing ? (
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
                              aria-checked={isActive}
                              disabled={isLoadDisabled}
                              onClick={() => handleLoad(entry)}
                              className="saved-assumption-row__load-target"
                              data-selected={isActive}
                            >
                              <span className="saved-assumption-row__label text-sm font-semibold text-strong">
                                {entry.label}
                              </span>
                              {!isDefaultEntry && (
                                <span
                                  className="assumption-state-pill assumption-state-pill--compact"
                                  data-state={isCurated ? 'curated' : isRemote ? 'remote' : 'local'}
                                  title={isRemote && entry.reference ? `Remote ref: ${entry.reference}` : undefined}
                                >
                                  {isCurated ? 'Curated' : isRemote ? 'Remote' : 'Local'}
                                </span>
                              )}
                            </button>

                            {!isDefaultEntry && (
                              <div className="saved-assumption-row__actions">
                                {!isCurated && (
                                  <IconActionButton
                                    icon="edit"
                                    label="Rename"
                                    onClick={(event) => stopActionEvent(event, () => beginRename(entry))}
                                    className="saved-assumption-row__inline-icon"
                                  />
                                )}
                                {shouldShowDescriptionAction && (
                                  <IconActionButton
                                    icon="description"
                                    label={
                                      isCurated || entry.description || entry.content
                                        ? 'View description'
                                        : 'Add description'
                                    }
                                    onClick={(event) =>
                                      stopActionEvent(event, () => {
                                        onDescription(entry);
                                        setMenuOpen(false);
                                      })
                                    }
                                    className="saved-assumption-row__inline-icon"
                                  />
                                )}
                                {!isCurated && (
                                  <IconActionButton
                                    icon="delete"
                                    label="Delete"
                                    tone="danger"
                                    onClick={(event) => stopActionEvent(event, () => onDelete(entry.id))}
                                    className="saved-assumption-row__inline-icon"
                                  />
                                )}
                                {!isCurated && entry.shareUrl && (
                                  <IconActionButton
                                    icon="copy-link"
                                    label="Copy Link"
                                    onClick={(event) => stopActionEvent(event, () => onCopyLink(entry))}
                                    className="saved-assumption-row__inline-icon"
                                  />
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      {isEditing && renameError && (
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
