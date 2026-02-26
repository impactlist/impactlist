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
    <section className="mb-4 rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center px-4 py-3">
        <h2 className="text-lg font-semibold text-slate-900">Saved Assumptions</h2>
      </div>

      <div className="border-t border-slate-200 px-4 py-4">
        <div className="space-y-3">
          {shouldShowInactiveToggleAtTop && (
            <button
              type="button"
              onClick={() => {
                setShowInactiveEntries((current) => !current);
              }}
              className="self-start text-sm font-medium text-slate-500 underline underline-offset-2 hover:text-slate-700"
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
              <div key={entry.id} className="rounded-md border border-slate-200 bg-slate-50 p-3">
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
                          className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={commitRename}
                          className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelRename}
                          className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm font-semibold text-slate-900">{entry.label}</span>
                    )}
                    {!isDefaultEntry && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          isRemote ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isRemote ? 'Remote' : 'Local'}
                      </span>
                    )}
                    {isActive && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        Active
                      </span>
                    )}
                    {isActive && hasUnsavedChanges && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                        Unsaved changes
                      </span>
                    )}
                    {isRemote && <span className="text-xs text-slate-600">(Ref: {entry.reference})</span>}
                  </div>
                </div>

                {isEditing && renameError && (
                  <p className="mt-2 rounded-md bg-red-50 px-2 py-1 text-xs text-red-700">{renameError}</p>
                )}

                {!isEditing && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {isDefaultEntry ? (
                      <button
                        type="button"
                        onClick={() => onLoad({ id: DEFAULT_ENTRY_ID })}
                        disabled={isLoadDisabled}
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
                      >
                        Load
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => onLoad(entry)}
                          disabled={isLoadDisabled}
                          className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
                        >
                          Load
                        </button>
                        <button
                          type="button"
                          onClick={() => beginRename(entry)}
                          className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Rename
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(entry.id)}
                          className="rounded-md border border-red-300 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </button>
                        {entry.shareUrl && (
                          <button
                            type="button"
                            onClick={() => onCopyLink(entry)}
                            className="rounded-md border border-indigo-300 px-2 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-50"
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
              className="self-start text-sm font-medium text-slate-500 underline underline-offset-2 hover:text-slate-700"
            >
              {inactiveToggleLabel}
            </button>
          )}

          {entries.length === 0 && <p className="text-sm text-slate-600">No saved assumptions yet.</p>}
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
