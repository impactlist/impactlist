import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
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
  const isCurated = isDefaultEntry || (!isCustomEntry && entry.source === 'curated');
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

// The inline-rename input + Save/Cancel pair, shared by the summary row and
// menu rows (previously duplicated). Handlers receive the triggering event so
// menu call sites can stop row-click propagation.
const EntryRenameControls = ({ editLabel, inputRef, onEditLabelChange, onCommit, onCancel }) => (
  <div className="saved-assumption-row__edit-controls">
    <input
      type="text"
      value={editLabel}
      onChange={(event) => onEditLabelChange(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          onCommit(event);
        } else if (event.key === 'Escape') {
          event.preventDefault();
          onCancel(event);
        }
      }}
      className="impact-field__input h-8 rounded-md px-2 text-sm"
      ref={inputRef}
    />
    <button type="button" onClick={onCommit} className="impact-btn impact-btn--secondary impact-btn--xs">
      Save
    </button>
    <button type="button" onClick={onCancel} className="impact-btn impact-btn--secondary impact-btn--xs">
      Cancel
    </button>
  </div>
);

EntryRenameControls.propTypes = {
  editLabel: PropTypes.string.isRequired,
  inputRef: PropTypes.object,
  onEditLabelChange: PropTypes.func.isRequired,
  onCommit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

// Entry label + source pill, shared by the summary row and menu rows
// (previously duplicated).
const EntryLabel = ({ entry, uiState, showPill }) => (
  <>
    <span className="saved-assumption-row__label text-sm font-semibold text-strong">{entry.label}</span>
    {showPill && (
      <span
        className="assumption-state-pill assumption-state-pill--compact"
        data-state={uiState.isCurated ? 'curated' : uiState.isRemote ? 'remote' : 'local'}
        title={uiState.isRemote && entry.reference ? `Remote ref: ${entry.reference}` : undefined}
      >
        {uiState.isCurated ? 'Curated' : uiState.isRemote ? 'Remote' : 'Local'}
      </span>
    )}
  </>
);

EntryLabel.propTypes = {
  entry: PropTypes.object.isRequired,
  uiState: PropTypes.object.isRequired,
  showPill: PropTypes.bool.isRequired,
};

const AssumptionsDropdown = ({
  entries,
  activeId = null,
  hasUnsavedChanges = false,
  inlineLabel = null,
  inlineLabelText = null,
  className = '',
  menuAriaLabel = 'Assumptions options',
  showCurrentSaveAction = false,
  showCurrentShareAction = false,
  showShareForLocal = false,
  allowEntryManagementActions = false,
  allowCopyLinkAction = false,
  onLoad,
  onSaveCurrent = () => {},
  onShareCurrent = () => {},
  onRename = () => ({ ok: true }),
  onDelete = () => {},
  onCopyLink = () => {},
  onDescription,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingSurface, setEditingSurface] = useState(null);
  const renameInputRef = useRef(null);

  // Focus the rename input when inline editing starts. (Imperative focus
  // after an explicit user action, rather than the autoFocus attribute,
  // which jsx-a11y rejects because it can steal focus on page load.)
  useEffect(() => {
    if (editingId !== null) {
      renameInputRef.current?.focus();
    }
  }, [editingId, editingSurface]);
  const [editLabel, setEditLabel] = useState('');
  const [renameError, setRenameError] = useState('');
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

  const summaryTriggerRef = useRef(null);
  // Set before opening the menu via keyboard; consumed by the effect below.
  const pendingMenuFocusRef = useRef(null);

  const cancelRename = useCallback(() => {
    setEditingId(null);
    setEditingSurface(null);
    setEditLabel('');
    setRenameError('');
  }, []);

  const handleEditLabelChange = useCallback((value) => {
    setEditLabel(value);
    setRenameError('');
  }, []);

  const closeMenu = useCallback(
    (reason) => {
      setMenuOpen(false);
      cancelRename();
      // Keyboard convention: Escape returns focus to the trigger. Outside
      // clicks keep focus where the user clicked.
      if (reason === 'escape') {
        summaryTriggerRef.current?.focus();
      }
    },
    [cancelRename]
  );

  const toggleMenu = useCallback(() => {
    setMenuOpen((current) => !current);
  }, []);

  const dropdownRef = useDismissibleMenu(menuOpen, closeMenu);

  // --- keyboard semantics --------------------------------------------------
  // This popup is deliberately a DISCLOSURE, not an ARIA menu: its rows mix a
  // load action with Tab-reachable icon buttons and an inline rename input,
  // which strict menu semantics forbid. Arrow keys rove focus across the
  // load targets ([data-menu-item]) as a convenience; everything else keeps
  // normal Tab order.
  const getMenuItems = useCallback(
    () => [...(dropdownRef.current?.querySelectorAll('[data-menu-item]:not([disabled])') || [])],
    [dropdownRef]
  );

  const focusMenuItem = useCallback(
    (index) => {
      const items = getMenuItems();
      if (items.length === 0) {
        return;
      }
      const boundedIndex = Math.min(Math.max(index, 0), items.length - 1);
      items[boundedIndex].focus();
    },
    [getMenuItems]
  );

  useEffect(() => {
    if (menuOpen && pendingMenuFocusRef.current) {
      focusMenuItem(pendingMenuFocusRef.current === 'last' ? Number.MAX_SAFE_INTEGER : 0);
      pendingMenuFocusRef.current = null;
    }
  }, [menuOpen, focusMenuItem]);

  const handleTriggerKeyDown = (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
      return;
    }
    event.preventDefault();

    if (menuOpen) {
      // Already open: the open-effect won't rerun, so move focus directly.
      focusMenuItem(event.key === 'ArrowDown' ? 0 : Number.MAX_SAFE_INTEGER);
      return;
    }

    pendingMenuFocusRef.current = event.key === 'ArrowDown' ? 'first' : 'last';
    setMenuOpen(true);
  };

  const handleMenuItemKeyDown = (event) => {
    const items = getMenuItems();
    if (items.length === 0) {
      return;
    }
    const currentIndex = items.indexOf(event.currentTarget);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusMenuItem(currentIndex + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusMenuItem(currentIndex <= 0 ? 0 : currentIndex - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusMenuItem(0);
        break;
      case 'End':
        event.preventDefault();
        focusMenuItem(items.length - 1);
        break;
      default:
        break;
    }
  };

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
  const summaryTriggerAriaLabel = `${
    inlineLabel && inlineLabelText ? inlineLabelText : 'Select assumptions set'
  }. Current selection: ${selectedEntry.label}`;

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
      {/* The wrapper click only widens the pointer target; the inner
          summary-trigger <button> provides the keyboard/AT path. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        className="assumptions-entry assumptions-entry--compact saved-assumptions-panel__summary"
        data-active={selectedEntryUiState.isActive}
        data-dirty={selectedEntryUiState.isActive && hasUnsavedChanges && !selectedEntryUiState.isCustomEntry}
        data-editing={selectedEntryUiState.isEditing}
        onClick={selectedEntryUiState.isEditing ? undefined : toggleMenu}
      >
        <div className="saved-assumption-row__top saved-assumption-row__top--summary">
          {selectedEntryUiState.isEditing ? (
            <EntryRenameControls
              editLabel={editLabel}
              inputRef={renameInputRef}
              onEditLabelChange={handleEditLabelChange}
              onCommit={commitRename}
              onCancel={cancelRename}
            />
          ) : (
            <>
              <button
                id={buttonId}
                ref={summaryTriggerRef}
                type="button"
                className="saved-assumption-row__load-target saved-assumptions-panel__summary-trigger"
                onClick={(event) => {
                  event.stopPropagation();
                  // Keyboard activation (Enter/Space report detail 0) moves
                  // focus into the menu, per the menu-button pattern.
                  if (!menuOpen && event.detail === 0) {
                    pendingMenuFocusRef.current = 'first';
                  }
                  toggleMenu();
                }}
                onKeyDown={handleTriggerKeyDown}
                aria-expanded={menuOpen}
                aria-controls={menuOpen ? menuId : undefined}
                aria-label={summaryTriggerAriaLabel}
              >
                <span className="saved-assumption-row__identity">
                  <EntryLabel
                    entry={selectedEntry}
                    uiState={selectedEntryUiState}
                    showPill={!selectedEntryUiState.isCustomEntry}
                  />
                </span>
              </button>
              {renderEntryActions(selectedEntry, selectedEntryUiState, 'summary')}
              <span className="saved-assumptions-panel__chevron" data-open={menuOpen} aria-hidden={true}>
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
        <div id={menuId} className="saved-assumptions-panel__menu" role="group" aria-label={menuAriaLabel}>
          <div className="saved-assumptions-panel__menu-list">
            {visibleEntries.map((entry) => {
              const entryUiState = getEntryUiState(entry, {
                activeId: currentSelectionId,
                editingId,
                hasUnsavedChanges,
              });

              return (
                /* The row click only widens the pointer target; the inner
                   load-target <button> provides the keyboard/AT path. */
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                <div
                  key={entry.id}
                  className="assumptions-entry assumptions-entry--compact saved-assumptions-panel__menu-entry"
                  data-active={entryUiState.isActive}
                  data-dirty={entryUiState.isActive && hasUnsavedChanges}
                  data-load-disabled={entryUiState.isLoadDisabled}
                  onClick={entryUiState.isEditing || entryUiState.isLoadDisabled ? undefined : () => handleLoad(entry)}
                >
                  <div className="saved-assumption-row__top saved-assumption-row__top--menu">
                    {entryUiState.isEditing ? (
                      <EntryRenameControls
                        editLabel={editLabel}
                        inputRef={renameInputRef}
                        onEditLabelChange={handleEditLabelChange}
                        onCommit={(event) => stopActionEvent(event, commitRename)}
                        onCancel={(event) => stopActionEvent(event, cancelRename)}
                      />
                    ) : (
                      <>
                        <button
                          type="button"
                          data-menu-item
                          aria-pressed={entryUiState.isActive}
                          disabled={entryUiState.isLoadDisabled}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleLoad(entry);
                          }}
                          onKeyDown={handleMenuItemKeyDown}
                          className="saved-assumption-row__load-target"
                          data-selected={entryUiState.isActive}
                        >
                          <EntryLabel entry={entry} uiState={entryUiState} showPill={!entryUiState.isCustomEntry} />
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
      <div className="assumptions-selector-bar__label">{inlineLabel}</div>
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
  inlineLabelText: PropTypes.string,
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

export default AssumptionsDropdown;
