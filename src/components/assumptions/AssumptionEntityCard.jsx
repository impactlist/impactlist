import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SectionCard from '../shared/SectionCard';
import IconActionButton from '../shared/IconActionButton';
import FormattedScientificValue from '../shared/FormattedScientificValue';

/**
 * One cause/recipient card on the assumptions list tabs: entity name linking
 * to its site page, a computed cost-per-life readout, and edit/reset/
 * justification actions.
 *
 * The cost per life is a derived result of the entity's effect parameters,
 * not a directly editable assumption, so it renders as a readout. The card
 * body is NOT a click target — with several links on one card, whole-card
 * clicks became misclick-prone, so only the explicit "(edit)" action opens
 * the editor.
 */
const AssumptionEntityCard = ({
  name,
  to,
  isCustom,
  baselineValue,
  currentValue,
  onEdit,
  onReset = null,
  justificationTo = null,
}) => {
  return (
    <SectionCard isCustom={isCustom} padding="sm" className="h-full">
      <div className="assumption-card__top">
        <div className="min-w-0">
          <div className="assumption-card__title-wrap pr-2">
            <Link to={to} className="assumptions-link assumption-card__title-link block min-w-0 truncate" title={name}>
              {name}
            </Link>
            {isCustom && (
              <span className="assumption-card__default-meta">
                {/* Non-breaking space: the meta is inline-flex, and when the
                    value renders in scientific notation it becomes a separate
                    flex item — CSS would strip a regular trailing space. */}
                adjusted · was&nbsp;
                <FormattedScientificValue value={baselineValue} variant="compact" />
              </span>
            )}
          </div>
        </div>

        <div className="assumption-card__actions">
          {/* Per-entity accessible name: several of these cards render on
              one page, so a bare "Reset" would be indistinguishable to
              assistive tech. */}
          {isCustom && onReset && <IconActionButton icon="reset" label={`Reset ${name}`} onClick={onReset} />}
        </div>
      </div>

      {/* No per-card "cost per life" caption: the tab's context line above
          the grid already states what the figure is. */}
      <div className="assumption-card__readout mt-2">
        <span className="assumption-card__readout-value">
          <FormattedScientificValue value={currentValue} />
        </span>
        {/* Parentheses INSIDE the controls: they're part of the hit target,
            not decoration around a bare word. */}
        <button
          type="button"
          className="assumptions-link assumption-card__edit-link impact-inline-action"
          aria-label={`Edit ${name}`}
          onClick={onEdit}
        >
          (edit)
        </button>
        {justificationTo && (
          <Link
            to={justificationTo}
            className="assumptions-link assumption-card__edit-link impact-inline-action"
            aria-label={`Justification for ${name}`}
          >
            (justification)
          </Link>
        )}
      </div>
    </SectionCard>
  );
};

AssumptionEntityCard.propTypes = {
  name: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  isCustom: PropTypes.bool.isRequired,
  baselineValue: PropTypes.string.isRequired,
  currentValue: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onReset: PropTypes.func,
  justificationTo: PropTypes.string,
};

export default AssumptionEntityCard;
