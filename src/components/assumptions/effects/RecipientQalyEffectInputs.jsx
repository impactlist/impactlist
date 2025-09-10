import React from 'react';
import BaseRecipientEffectInputs from './BaseRecipientEffectInputs';
import { getEffectTooltip } from '../../../constants/effectTooltips';

/**
 * Component for editing QALY effect overrides/multipliers for recipients
 * Wrapper around BaseRecipientEffectInputs with QALY-specific fields
 */
const RecipientQalyEffectInputs = (props) => {
  const fields = [
    { name: 'costPerQALY', label: 'Cost per life-year', tooltip: getEffectTooltip('qaly', 'costPerQALY') },
    { name: 'startTime', label: 'Start Time (years)', tooltip: getEffectTooltip('qaly', 'startTime') },
    { name: 'windowLength', label: 'Window Length (years)', tooltip: getEffectTooltip('qaly', 'windowLength') },
  ];

  return <BaseRecipientEffectInputs {...props} fields={fields} effectType="qaly" />;
};

export default RecipientQalyEffectInputs;
