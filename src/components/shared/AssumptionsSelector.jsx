import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import useAssumptionsLibrary from '../../hooks/useAssumptionsLibrary';
import useAssumptionsSelectorPreference from '../../hooks/useAssumptionsSelectorPreference';
import { OVERWRITE_UNSAVED_ASSUMPTIONS_MODAL } from '../../utils/assumptionsLoadHelpers';
import AssumptionsDescriptionModal from '../AssumptionsDescriptionModal';
import SharedImportDecisionModal from '../SharedImportDecisionModal';
import InfoTooltipIcon from './InfoTooltipIcon';
import AssumptionsDropdown from './AssumptionsDropdown';

const AssumptionsSelector = ({ className = '', interactive }) => {
  const [pendingDescriptionEntry, setPendingDescriptionEntry] = useState(null);
  const [showSelectorEveryPage] = useAssumptionsSelectorPreference();

  const {
    libraryEntries,
    activeSavedAssumptionsId,
    hasUnsavedChanges,
    activeAssumptionsLabel,
    pendingLoadEntry,
    handleLoadEntry,
    handleContinuePendingLoad,
    handleCancelPendingLoad,
  } = useAssumptionsLibrary();

  // This dropdown path is controlled by the "show on every page" preference from the
  // Assumptions page, so it remains available without forcing it on by default.
  const shouldRenderInteractive = interactive ?? showSelectorEveryPage;

  const handleDescriptionModalOpen = useCallback((entry) => {
    if (!entry?.id || (!entry.description && !entry.content)) {
      return;
    }

    setPendingDescriptionEntry(entry);
  }, []);

  const handleDescriptionModalClose = useCallback(() => {
    setPendingDescriptionEntry(null);
  }, []);

  const editLink = (
    <Link to="/assumptions" className="assumptions-selector-bar__edit-link impact-link">
      view / edit
    </Link>
  );

  const inlineLabel = (
    <>
      <span>Active assumptions</span>
      <InfoTooltipIcon
        className="assumptions-selector-bar__label-tooltip"
        iconClassName="h-4 w-4 text-muted"
        content={
          <>
            <p>Change the active assumptions to see how it affects the rankings.</p>
            <p className="mt-2">
              If you want to view the details of the existing assumptions or specify/save/share your own assumptions, go
              to the Assumptions page.
            </p>
          </>
        }
      />
      {editLink}
    </>
  );
  const displayLabel = (
    <>
      <span className="assumptions-selector-bar__display-text">Active assumptions: {activeAssumptionsLabel}</span>
      <InfoTooltipIcon
        className="assumptions-selector-bar__label-tooltip"
        iconClassName="h-4 w-4 text-muted"
        content={
          <>
            <p>The active assumptions affect all rankings and calculations.</p>
            <p className="mt-2">To change them or view more detail, go to the Assumptions page.</p>
          </>
        }
      />
      {editLink}
    </>
  );

  if (!shouldRenderInteractive) {
    return (
      <div className={`assumptions-selector-bar assumptions-selector-bar--display ${className}`.trim()}>
        <div className="assumptions-selector-bar__display-line">{displayLabel}</div>
      </div>
    );
  }

  return (
    <>
      <AssumptionsDropdown
        className={className}
        inlineLabel={inlineLabel}
        inlineLabelText="Active assumptions"
        entries={libraryEntries}
        activeId={activeSavedAssumptionsId}
        hasUnsavedChanges={hasUnsavedChanges}
        menuAriaLabel="Assumptions options"
        allowEntryManagementActions={false}
        allowCopyLinkAction={false}
        showCurrentSaveAction={false}
        showCurrentShareAction={false}
        showShareForLocal={false}
        onLoad={handleLoadEntry}
        onDescription={handleDescriptionModalOpen}
      />

      <AssumptionsDescriptionModal
        isOpen={Boolean(pendingDescriptionEntry)}
        entryLabel={pendingDescriptionEntry?.label || ''}
        initialDescription={pendingDescriptionEntry?.content || pendingDescriptionEntry?.description || ''}
        isReadOnly={true}
        onClose={handleDescriptionModalClose}
      />
      <SharedImportDecisionModal
        isOpen={Boolean(pendingLoadEntry)}
        title={OVERWRITE_UNSAVED_ASSUMPTIONS_MODAL.title}
        description={OVERWRITE_UNSAVED_ASSUMPTIONS_MODAL.description}
        continueLabel={OVERWRITE_UNSAVED_ASSUMPTIONS_MODAL.continueLabel}
        cancelLabel={OVERWRITE_UNSAVED_ASSUMPTIONS_MODAL.cancelLabel}
        onContinue={handleContinuePendingLoad}
        onCancel={handleCancelPendingLoad}
      />
    </>
  );
};

AssumptionsSelector.propTypes = {
  className: PropTypes.string,
  interactive: PropTypes.bool,
};

export default AssumptionsSelector;
