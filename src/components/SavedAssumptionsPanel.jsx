import { useState } from 'react';
import PropTypes from 'prop-types';

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
        <h2 className="assumptions-title text-2xl font-semibold text-[var(--text-strong)]">Saved Assumptions</h2>
      </div>

      <div className="border-t border-[var(--border-subtle)] px-4 py-4 sm:px-5">
        <div className="space-y-3">
          {shouldShowInactiveToggleAtTop && (
            <button
              type="button"
              onClick={() => {
                setShowInactiveEntries((current) => !current);
              }}
              className="impact-btn impact-btn--ghost text-xs"
            >
              {inactiveToggleLabel}
            </button>
          )}

          {visibleEntries.map((entry) => {
            const isDefaultEntry = entry.id === DEFAULT_ENTRY_ID;
            const isActive = activeId === entry.id;
            const isEditing = !isDefaultEntry && editingId === entry.id;
            const isRemote = !isDefaultEntry && Boolean(entry.reference);
            const isLoadDisabled = isActive && !hasUnsavedChanges;

            return (
              <div key={entry.id} className="assumptions-entry" data-active={isActive}>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
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
                          className="impact-btn impact-btn--secondary py-2 text-xs"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelRename}
                          className="impact-btn impact-btn--secondary py-2 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm font-semibold text-[var(--text-strong)]">{entry.label}</span>
                    )}
                    {!isDefaultEntry && (
                      <span
                        className="impact-muted-pill"
                        style={
                          isRemote
                            ? {
                                background: 'color-mix(in srgb, var(--accent-soft) 65%, white 35%)',
                                color: 'var(--accent-strong)',
                              }
                            : undefined
                        }
                      >
                        {isRemote ? 'Remote' : 'Local'}
                      </span>
                    )}
                    {isActive && (
                      <span className="assumption-state-pill" data-state="custom">
                        Active
                      </span>
                    )}
                    {isActive && hasUnsavedChanges && (
                      <span
                        className="assumption-state-pill"
                        style={{ background: 'color-mix(in srgb, #f2dfbc 78%, white 22%)', color: 'var(--warning)' }}
                      >
                        Unsaved changes
                      </span>
                    )}
                    {isRemote && <span className="text-xs text-[var(--text-muted)]">(Ref: {entry.reference})</span>}
                  </div>
                </div>

                {isEditing && renameError && (
                  <p className="mt-2 rounded-md bg-[#fff1f1] px-2 py-1 text-xs text-[var(--danger)]">{renameError}</p>
                )}

                {!isEditing && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {isDefaultEntry ? (
                      <button
                        type="button"
                        onClick={() => onLoad({ id: DEFAULT_ENTRY_ID })}
                        disabled={isLoadDisabled}
                        className="impact-btn impact-btn--secondary py-2 text-xs"
                      >
                        Load
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => onLoad(entry)}
                          disabled={isLoadDisabled}
                          className="impact-btn impact-btn--secondary py-2 text-xs"
                        >
                          Load
                        </button>
                        <button
                          type="button"
                          onClick={() => beginRename(entry)}
                          className="impact-btn impact-btn--secondary py-2 text-xs"
                        >
                          Rename
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(entry.id)}
                          className="impact-btn impact-btn--danger py-2 text-xs"
                        >
                          Delete
                        </button>
                        {entry.shareUrl && (
                          <button
                            type="button"
                            onClick={() => onCopyLink(entry)}
                            className="impact-btn impact-btn--secondary py-2 text-xs"
                          >
                            Copy Link
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {shouldShowInactiveToggle && (
            <button
              type="button"
              onClick={() => {
                setShowInactiveEntries((current) => !current);
              }}
              className="impact-btn impact-btn--ghost text-xs"
            >
              {inactiveToggleLabel}
            </button>
          )}

          {entries.length === 0 && <p className="text-sm text-[var(--text-muted)]">No saved assumptions yet.</p>}
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
