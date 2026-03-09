import PropTypes from 'prop-types';
import AssumptionsDropdown from './shared/AssumptionsDropdown';

const SavedAssumptionsPanel = ({
  entries,
  activeId = null,
  hasUnsavedChanges = false,
  showCurrentActions = false,
  showShareForLocal = true,
  allowEntryManagementActions = true,
  onLoad,
  onSaveCurrent,
  onShareCurrent,
  onRename,
  onDelete,
  onCopyLink,
  onDescription,
}) => {
  return (
    <section className="assumptions-shell mb-5">
      <div className="flex items-center justify-between px-4 py-3 sm:px-5">
        <h2 className="assumptions-title text-2xl font-semibold text-strong">Active Assumptions</h2>
      </div>

      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        <AssumptionsDropdown
          entries={entries}
          activeId={activeId}
          hasUnsavedChanges={hasUnsavedChanges}
          showCurrentSaveAction={showCurrentActions}
          showCurrentShareAction={showCurrentActions}
          showShareForLocal={showShareForLocal}
          allowEntryManagementActions={allowEntryManagementActions}
          allowCopyLinkAction={true}
          onLoad={onLoad}
          onSaveCurrent={onSaveCurrent}
          onShareCurrent={onShareCurrent}
          onRename={onRename}
          onDelete={onDelete}
          onCopyLink={onCopyLink}
          onDescription={onDescription}
          menuAriaLabel="Assumptions Library entries"
        />
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
  showCurrentActions: PropTypes.bool,
  showShareForLocal: PropTypes.bool,
  allowEntryManagementActions: PropTypes.bool,
  onLoad: PropTypes.func.isRequired,
  onSaveCurrent: PropTypes.func,
  onShareCurrent: PropTypes.func,
  onRename: PropTypes.func,
  onDelete: PropTypes.func,
  onCopyLink: PropTypes.func,
  onDescription: PropTypes.func.isRequired,
};

export default SavedAssumptionsPanel;
