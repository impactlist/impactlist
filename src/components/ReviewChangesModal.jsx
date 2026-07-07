import PropTypes from 'prop-types';
import ModalShell, { ModalHeader } from './shared/ModalShell';
import IconActionButton from './shared/IconActionButton';
import FormattedScientificValue from './shared/FormattedScientificValue';

const entryPropType = PropTypes.shape({
  path: PropTypes.object.isRequired,
  effectLabel: PropTypes.string,
  fieldLabel: PropTypes.string.isRequired,
  fromDisplay: PropTypes.string.isRequired,
  fromNote: PropTypes.string,
  toDisplay: PropTypes.string.isRequired,
  toNote: PropTypes.string,
});

const buildRevertLabel = (groupTitle, entry) =>
  ['Revert', groupTitle, entry.effectLabel, entry.fieldLabel].filter(Boolean).join(' ');

const ChangeEntryRow = ({ groupTitle, entry, onRevert }) => (
  <li className="review-changes__row">
    <span className="review-changes__field">
      {entry.fieldLabel}
      {entry.effectLabel && <span className="review-changes__effect">{entry.effectLabel}</span>}
    </span>
    <span className="review-changes__values">
      <span className="review-changes__value review-changes__value--from">
        <FormattedScientificValue value={entry.fromDisplay} variant="compact" />
        {entry.fromNote && <span className="review-changes__value-note">{entry.fromNote}</span>}
      </span>
      <span className="review-changes__arrow" aria-hidden={true}>
        →
      </span>
      <span className="review-changes__value review-changes__value--to">
        <FormattedScientificValue value={entry.toDisplay} variant="compact" />
        {entry.toNote && <span className="review-changes__value-note">{entry.toNote}</span>}
      </span>
    </span>
    <IconActionButton icon="reset" label={buildRevertLabel(groupTitle, entry)} onClick={() => onRevert(entry.path)} />
  </li>
);

ChangeEntryRow.propTypes = {
  groupTitle: PropTypes.string,
  entry: entryPropType.isRequired,
  onRevert: PropTypes.func.isRequired,
};

const ChangeGroup = ({ title, entries, onRevert }) => (
  <div className="review-changes__group">
    {title && <h4 className="review-changes__group-title">{title}</h4>}
    <ul className="review-changes__list">
      {entries.map((entry) => (
        <ChangeEntryRow
          key={`${entry.path.effectId ?? entry.path.parameterName}-${entry.path.field ?? ''}-${entry.fieldLabel}`}
          groupTitle={title}
          entry={entry}
          onRevert={onRevert}
        />
      ))}
    </ul>
  </div>
);

ChangeGroup.propTypes = {
  title: PropTypes.string,
  entries: PropTypes.arrayOf(entryPropType).isRequired,
  onRevert: PropTypes.func.isRequired,
};

const ChangeSection = ({ title, children }) => (
  <section className="review-changes__section">
    <h3 className="review-changes__section-title">{title}</h3>
    {children}
  </section>
);

ChangeSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

/**
 * Lists every difference between the active assumptions and the site
 * defaults — the rendered form of the normalized user-assumptions diff — with
 * a one-click revert per entry. Pure view: the parent owns the diff (see
 * utils/assumptionsDiff.js) and the revert behavior.
 */
const ReviewChangesModal = ({ isOpen, onClose, diff, onRevert, hasUnappliedGlobalEdits = false }) => (
  <ModalShell
    isOpen={isOpen}
    onClose={onClose}
    labelledBy="review-changes-modal-title"
    panelClassName="review-changes-modal max-h-[calc(100vh-2rem)] overflow-y-auto"
  >
    <ModalHeader title="Changes from default assumptions" titleId="review-changes-modal-title" onClose={onClose} />

    {hasUnappliedGlobalEdits && (
      <p className="review-changes__note">Global parameter edits you haven&apos;t applied yet are not listed here.</p>
    )}

    {diff.changeCount === 0 ? (
      <p className="impact-modal__copy">All assumptions currently match the site defaults.</p>
    ) : (
      <div className="review-changes">
        {diff.globalParameters.length > 0 && (
          <ChangeSection title="Global parameters">
            <ChangeGroup entries={diff.globalParameters} onRevert={onRevert} />
          </ChangeSection>
        )}

        {diff.categories.length > 0 && (
          <ChangeSection title="Causes">
            {diff.categories.map((group) => (
              <ChangeGroup
                key={group.categoryId}
                title={group.categoryName}
                entries={group.entries}
                onRevert={onRevert}
              />
            ))}
          </ChangeSection>
        )}

        {diff.recipients.length > 0 && (
          <ChangeSection title="Recipients">
            {diff.recipients.map((recipientGroup) =>
              recipientGroup.categories.map((categoryGroup) => (
                <ChangeGroup
                  key={`${recipientGroup.recipientId}-${categoryGroup.categoryId}`}
                  title={`${recipientGroup.recipientName} · ${categoryGroup.categoryName}`}
                  entries={categoryGroup.entries}
                  onRevert={onRevert}
                />
              ))
            )}
          </ChangeSection>
        )}
      </div>
    )}

    <div className="mt-6 flex justify-end">
      <button type="button" onClick={onClose} className="impact-btn impact-btn--secondary">
        Close
      </button>
    </div>
  </ModalShell>
);

ReviewChangesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  diff: PropTypes.shape({
    changeCount: PropTypes.number.isRequired,
    globalParameters: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    recipients: PropTypes.array.isRequired,
  }).isRequired,
  onRevert: PropTypes.func.isRequired,
  hasUnappliedGlobalEdits: PropTypes.bool,
};

export default ReviewChangesModal;
