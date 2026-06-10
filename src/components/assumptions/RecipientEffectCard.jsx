import React from 'react';
import PropTypes from 'prop-types';
import EffectCard from './EffectCard';
import RecipientQalyEffectInputs from './effects/RecipientQalyEffectInputs';
import RecipientPopulationEffectInputs from './effects/RecipientPopulationEffectInputs';
import { getEffectType } from '../../utils/effectValidation';

/**
 * One recipient effect draft rendered as a card: shared chrome plus the
 * override/multiplier inputs for the effect's type. A recipient effect can be
 * disabled at the category level (not editable here — shown as a note) or at
 * the recipient level (the toggle).
 */
const RecipientEffectCard = ({
  effect,
  index,
  costPerLife,
  sources,
  errors,
  onChange,
  onToggleDisabled,
  globalParameters,
  previewYear,
  headingLevel = 'h4',
}) => {
  const baseEffect = effect._baseEffect;
  const effectType = getEffectType(baseEffect);
  const isDisabledByCategory = baseEffect?.disabled || false;
  const isDisabledByRecipient = effect.disabled || false;
  const isFullyDisabled = isDisabledByCategory || isDisabledByRecipient;

  const inputProps = {
    effectIndex: index,
    defaultCategoryEffect: sources.defaultCategoryEffect,
    userCategoryEffect: sources.userCategoryEffect,
    defaultRecipientEffect: sources.defaultRecipientEffect,
    errors,
    overrides: effect.overrides,
    multipliers: effect.multipliers,
    onChange,
    globalParameters,
    isDisabled: isFullyDisabled,
  };

  return (
    <EffectCard
      index={index}
      effectId={effect.effectId}
      headingLevel={headingLevel}
      costPerLife={costPerLife}
      isDisabled={isFullyDisabled}
      disabledNote={isDisabledByCategory ? '(Disabled in cause)' : null}
      showDisableToggle={!isDisabledByCategory}
      isToggledOff={isDisabledByRecipient}
      onToggleDisabled={onToggleDisabled}
      validTimeInterval={baseEffect?.validTimeInterval}
      previewYear={previewYear}
    >
      {effectType === 'qaly' ? (
        <RecipientQalyEffectInputs {...inputProps} />
      ) : effectType === 'population' ? (
        <RecipientPopulationEffectInputs {...inputProps} />
      ) : (
        <div className="text-sm text-danger">Unknown effect type</div>
      )}
    </EffectCard>
  );
};

RecipientEffectCard.propTypes = {
  effect: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  costPerLife: PropTypes.number,
  sources: PropTypes.shape({
    defaultRecipientEffect: PropTypes.object,
    defaultCategoryEffect: PropTypes.object,
    userCategoryEffect: PropTypes.object,
  }).isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onToggleDisabled: PropTypes.func.isRequired,
  globalParameters: PropTypes.object.isRequired,
  previewYear: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  headingLevel: PropTypes.oneOf(['h3', 'h4']),
};

export default RecipientEffectCard;
