import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const formatTimestamp = (isoString) => {
  if (!isoString) {
    return 'Never';
  }

  const timestamp = Date.parse(isoString);
  if (Number.isNaN(timestamp)) {
    return 'Unknown';
  }

  return new Date(timestamp).toLocaleString();
};

const SavedAssumptionsPanel = ({ entries, activeId, hasUnsavedChanges, onLoad, onRename, onDelete, onCopyLink }) => {
  const [editingId, setEditingId] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [isSmallScreen, setIsSmallScreen] = useState(() => {
    if (typeof globalThis.window === 'undefined') {
      return false;
    }
    return globalThis.window.innerWidth < 640;
  });
  const [isCollapsed, setIsCollapsed] = useState(isSmallScreen);
  const [hasUserToggledCollapse, setHasUserToggledCollapse] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(globalThis.window.innerWidth < 640);
    };

    globalThis.window.addEventListener('resize', handleResize);
    return () => {
      globalThis.window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!hasUserToggledCollapse) {
      setIsCollapsed(isSmallScreen);
    }
  }, [hasUserToggledCollapse, isSmallScreen]);

  const beginRename = (entry) => {
    setEditingId(entry.id);
    setEditLabel(entry.label);
  };

  const commitRename = () => {
    if (!editingId) {
      return;
    }

    const normalized = editLabel.trim();
    if (!normalized) {
      return;
    }

    onRename(editingId, normalized);
    setEditingId(null);
    setEditLabel('');
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditLabel('');
  };

  return (
    <section className="mb-4 rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-lg font-semibold text-slate-900">Saved Assumptions</h2>
        <button
          type="button"
          onClick={() => {
            setHasUserToggledCollapse(true);
            setIsCollapsed((current) => !current);
          }}
          className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          {isCollapsed ? 'Expand' : 'Collapse'}
        </button>
      </div>

      {!isCollapsed && (
        <div className="border-t border-slate-200 px-4 py-4">
          {entries.length === 0 ? (
            <p className="text-sm text-slate-600">No saved assumptions yet.</p>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => {
                const isActive = activeId === entry.id;
                const isEditing = editingId === entry.id;
                return (
                  <div key={entry.id} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editLabel}
                              onChange={(event) => setEditLabel(event.target.value)}
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
                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700">
                          {entry.source === 'imported' ? 'Imported' : 'Local'}
                        </span>
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
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-slate-600">
                      Updated: {formatTimestamp(entry.updatedAt)}
                      {entry.lastLoadedAt && ` • Last loaded: ${formatTimestamp(entry.lastLoadedAt)}`}
                      {entry.reference && ` • Ref: ${entry.reference}`}
                    </div>

                    {!isEditing && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => onLoad(entry)}
                          className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
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
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
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
