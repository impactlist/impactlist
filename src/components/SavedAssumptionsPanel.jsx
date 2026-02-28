import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import IconActionButton from './shared/IconActionButton';

const DEFAULT_ENTRY_ID = '__default__';
const DEFAULT_ENTRY = Object.freeze({
  id: DEFAULT_ENTRY_ID,
  label: 'Default',
});

const getRenameErrorMessage = (errorCode) => {
  if (errorCode === 'duplicate_label') {
    return 'You already have saved assumptions with that name. Choose a different name.';
  }

  return 'Could not rename saved assumptions.';
};

const SavedAssumptionsPanel = ({ entries, activeId, hasUnsavedChanges, onLoad, onRename, onDelete, onCopyLink }) => {
  const [editingId, setEditingId] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [renameError, setRenameError] = useState('');
  const [showInactiveEntries, setShowInactiveEntries] = useState(false);

  const activeEntry = entries.find((entry) => entry.id === activeId) || null;
  const isDefaultActive = activeId === DEFAULT_ENTRY_ID;
  const primaryEntry = isDefaultActive ? DEFAULT_ENTRY : activeEntry;
  const primaryEntries = primaryEntry ? [primaryEntry] : [];
  const inactiveCustomEntries = entries.filter((entry) => entry.id !== activeEntry?.id);
  const inactiveEntries = isDefaultActive ? inactiveCustomEntries : [DEFAULT_ENTRY, ...inactiveCustomEntries];
  const visibleEntries = [...primaryEntries, ...(showInactiveEntries ? inactiveEntries : [])];
  const inactiveEntriesCount = inactiveEntries.length;
  const inactiveToggleLabel = showInactiveEntries ? 'Hide Inactive' : `Show Inactive (${inactiveEntriesCount})`;
  const shouldShowInactiveToggle = inactiveEntries.length > 0;
  const shouldShowInactiveToggleAtTop = shouldShowInactiveToggle && entries.length >= 3 && showInactiveEntries;

  const beginRename = (entry) => {
    setEditingId(entry.id);
    setEditLabel(entry.label);
    setRenameError('');
  };

  const commitRename = () => {
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
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditLabel('');
    setRenameError('');
  };

  return (
    <section className="assumptions-shell mb-5 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 sm:px-5">
        <h2 className="assumptions-title text-2xl font-semibold text-[var(--text-strong)]">Assumptions Library</h2>
      </div>

      <div className="px-4 py-4 sm:px-5">
        <div className="space-y-3">
          {visibleEntries.map((entry, index) => {
            const isDefaultEntry = entry.id === DEFAULT_ENTRY_ID;
            const isActive = activeId === entry.id;
            const isEditing = !isDefaultEntry && editingId === entry.id;
            const isRemote = !isDefaultEntry && Boolean(entry.reference);
            const isLoadDisabled = isActive && !hasUnsavedChanges;

            return (
              <Fragment key={entry.id}>
                <div
                  className="assumptions-entry assumptions-entry--compact"
                  data-active={isActive}
                  data-dirty={isActive && hasUnsavedChanges}
                >
                  <div className="saved-assumption-row__top">
                    <div className="saved-assumption-row__identity">
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
                          <span className="saved-assumption-row__label text-sm font-semibold text-[var(--text-strong)]">
                            {entry.label}
                          </span>
                          {!isDefaultEntry && (
                            <>
                              <IconActionButton
                                icon="edit"
                                label="Rename"
                                onClick={() => beginRename(entry)}
                                className="saved-assumption-row__inline-icon"
                              />
                              <IconActionButton
                                icon="delete"
                                label="Delete"
                                tone="danger"
                                onClick={() => onDelete(entry.id)}
                                className="saved-assumption-row__inline-icon"
                              />
                              {entry.shareUrl && (
                                <IconActionButton
                                  icon="copy-link"
                                  label="Copy Link"
                                  onClick={() => onCopyLink(entry)}
                                  className="saved-assumption-row__inline-icon"
                                />
                              )}
                              <span
                                className="assumption-state-pill assumption-state-pill--compact"
                                data-state={isRemote ? 'remote' : 'local'}
                                title={isRemote && entry.reference ? `Remote ref: ${entry.reference}` : undefined}
                              >
                                {isRemote ? 'Remote' : 'Local'}
                              </span>
                            </>
                          )}
                          {isActive && (
                            <span className="assumption-state-pill assumption-state-pill--compact" data-state="active">
                              Active
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => onLoad(isDefaultEntry ? { id: DEFAULT_ENTRY_ID } : entry)}
                        disabled={isLoadDisabled}
                        className="impact-btn impact-btn--secondary impact-btn--xs"
                      >
                        Load
                      </button>
                    )}
                  </div>

                  {isEditing && renameError && (
                    <p className="assumptions-inline-error mt-2 rounded-md px-2 py-1 text-xs">{renameError}</p>
                  )}
                </div>

                {shouldShowInactiveToggleAtTop && index === 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowInactiveEntries((current) => !current);
                    }}
                    className="impact-btn impact-btn--ghost impact-btn--xs"
                  >
                    {inactiveToggleLabel}
                  </button>
                )}
              </Fragment>
            );
          })}

          {shouldShowInactiveToggle && (
            <button
              type="button"
              onClick={() => {
                setShowInactiveEntries((current) => !current);
              }}
              className="impact-btn impact-btn--ghost impact-btn--xs"
            >
              {inactiveToggleLabel}
            </button>
          )}

          {entries.length === 0 && !isDefaultActive && (
            <p className="text-sm text-[var(--text-muted)]">No saved assumptions yet.</p>
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
      source: PropTypes.oneOf(['local', 'imported']).isRequired,
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
};

SavedAssumptionsPanel.defaultProps = {
  activeId: null,
  hasUnsavedChanges: false,
};

export default SavedAssumptionsPanel;
