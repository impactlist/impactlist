import { useId, useState } from 'react';
import PropTypes from 'prop-types';
import IconActionButton from '../shared/IconActionButton';
import FormattedScientificValue from '../shared/FormattedScientificValue';

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
  <div className={`review-changes__group${title ? ' review-changes__group--titled' : ''}`}>
    {title && <h5 className="review-changes__group-title">{title}</h5>}
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
    <h4 className="review-changes__section-title">{title}</h4>
    {children}
  </section>
);

ChangeSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

/**
 * Collapsible on-page inventory of every difference between the active
 * assumptions and the site defaults — the rendered form of the normalized
 * user-assumptions diff — with a one-click revert per entry. Renders nothing
 * when there are no differences. Pure view: the parent owns the diff (see
 * utils/assumptionsDiff.js) and the revert behavior.
 */
const ReviewChangesSection = ({ diff, onRevert, hasUnappliedEdits = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const bodyId = useId();

  if (diff.changeCount === 0) {
    return null;
  }

  const differencesNoun = diff.changeCount === 1 ? 'difference' : 'differences';

  return (
    <section className="review-changes-section">
      <h3 className="review-changes-section__heading">
        {/* Deliberately quiet — a pseudo-link disclosure, not a boxed bar:
            the summary row above already announces the active set's state,
            and this is supporting detail. */}
        <button
          type="button"
          className="review-changes-section__toggle"
          aria-expanded={isOpen}
          aria-controls={isOpen ? bodyId : undefined}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="review-changes-section__glyph" aria-hidden={true}>
            {isOpen ? '−' : '+'}
          </span>
          <span className="review-changes-section__label">
            {isOpen ? 'Hide' : 'Show'} {diff.changeCount} {differencesNoun} from default assumptions
          </span>
        </button>
      </h3>

      {isOpen && (
        <div id={bodyId} className="review-changes-section__body">
          {hasUnappliedEdits && (
            <p className="review-changes__note">Edits you haven&apos;t applied yet are not listed here.</p>
          )}

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
        </div>
      )}
    </section>
  );
};

ReviewChangesSection.propTypes = {
  diff: PropTypes.shape({
    changeCount: PropTypes.number.isRequired,
    globalParameters: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    recipients: PropTypes.array.isRequired,
  }).isRequired,
  onRevert: PropTypes.func.isRequired,
  hasUnappliedEdits: PropTypes.bool,
};

export default ReviewChangesSection;
