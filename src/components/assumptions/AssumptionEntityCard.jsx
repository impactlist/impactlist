import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SectionCard from '../shared/SectionCard';
import IconActionButton from '../shared/IconActionButton';
import FormattedScientificValue from '../shared/FormattedScientificValue';

/**
 * One cause/recipient card on the assumptions list tabs: entity name linking
 * to its site page, a computed cost-per-life readout, and edit/reset actions.
 *
 * The cost per life is a derived result of the entity's effect parameters,
 * not a directly editable assumption, so it renders as a readout. The whole
 * card opens the effect editor; the entity link and the action buttons stop
 * propagation so they don't also trigger the edit.
 */
const AssumptionEntityCard = ({ name, to, isCustom, baselineValue, currentValue, onEdit, onReset = null }) => {
  const stopThen = (action) => (event) => {
    event.stopPropagation();
    if (action) {
      action();
    }
  };

  return (
    <SectionCard isCustom={isCustom} padding="sm" className="h-full" onClick={onEdit}>
      <div className="assumption-card__top">
        <div className="min-w-0">
          <div className="assumption-card__title-wrap pr-2">
            <Link
              to={to}
              onClick={stopThen(null)}
              className="assumptions-link assumption-card__title-link block min-w-0 truncate"
              title={name}
            >
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
          {isCustom && onReset && <IconActionButton icon="reset" label="Reset" onClick={stopThen(onReset)} />}
          <IconActionButton icon="edit" label="Edit" onClick={stopThen(onEdit)} />
        </div>
      </div>

      <div className="assumption-card__readout mt-2">
        <span className="assumption-card__readout-value">
          <FormattedScientificValue value={currentValue} />
        </span>
        <span className="assumption-card__readout-caption">cost per life</span>
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
};

export default AssumptionEntityCard;
