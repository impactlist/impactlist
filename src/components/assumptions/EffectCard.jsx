import React from 'react';
import PropTypes from 'prop-types';
import EffectCostDisplay from '../shared/EffectCostDisplay';
import DisableToggleButton from '../shared/DisableToggleButton';

/**
 * The chrome shared by every effect card in the three effect editors: title
 * row with disable toggle and per-effect cost, the active-interval note, and
 * the dimming applied to disabled effects. The type-specific inputs render as
 * children.
 */
const EffectCard = ({
  index,
  effectId,
  headingLevel = 'h4',
  costPerLife,
  isDisabled = false,
  disabledNote = null,
  showDisableToggle = true,
  isToggledOff = false,
  onToggleDisabled,
  validTimeInterval = null,
  previewYear,
  children,
}) => {
  const Heading = headingLevel;
  const dimmedClass = isDisabled ? 'effect-disabled' : '';

  return (
    <div className="effect-card effect-card--section transition-all duration-200">
      <div className="mb-2">
        <div className="flex flex-wrap justify-between items-start gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Heading className={`effect-card__title ${dimmedClass}`}>
              Effect {index + 1}: {effectId}
            </Heading>
            {showDisableToggle && <DisableToggleButton isDisabled={isToggledOff} onToggle={onToggleDisabled} />}
            {disabledNote && <span className={`effect-card__disabled-note ${dimmedClass}`}>{disabledNote}</span>}
          </div>
          <div className={dimmedClass}>
            <EffectCostDisplay cost={costPerLife} showInfinity={true} className="text-sm whitespace-nowrap" />
          </div>
        </div>
        {validTimeInterval && (
          <p className={`effect-card__meta mt-1 ${dimmedClass}`}>
            Active:{' '}
            {validTimeInterval[0] === null
              ? `Until ${validTimeInterval[1]}`
              : `${validTimeInterval[0]} - ${validTimeInterval[1] || 'present'}`}
            {(previewYear < validTimeInterval[0] || (validTimeInterval[1] && previewYear > validTimeInterval[1])) && (
              <span className="effect-card__meta--inactive ml-2">(Not active in {previewYear})</span>
            )}
          </p>
        )}
      </div>

      <div className={isDisabled ? 'effect-disabled-content' : ''}>{children}</div>
    </div>
  );
};

EffectCard.propTypes = {
  index: PropTypes.number.isRequired,
  effectId: PropTypes.string.isRequired,
  headingLevel: PropTypes.oneOf(['h3', 'h4']),
  costPerLife: PropTypes.number,
  isDisabled: PropTypes.bool,
  disabledNote: PropTypes.node,
  showDisableToggle: PropTypes.bool,
  isToggledOff: PropTypes.bool,
  onToggleDisabled: PropTypes.func,
  validTimeInterval: PropTypes.array,
  previewYear: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  children: PropTypes.node,
};

export default EffectCard;
