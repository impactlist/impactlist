import React from 'react';
import BaseRecipientEffectInputs from './BaseRecipientEffectInputs';
import { getEffectTooltip } from '../../../constants/effectTooltips';

/**
 * Component for editing population effect overrides/multipliers for recipients
 * Wrapper around BaseRecipientEffectInputs with population-specific fields
 */
const RecipientPopulationEffectInputs = (props) => {
  const fields = [
    {
      name: 'costPerMicroprobability',
      label: 'Cost per microprobability',
      tooltip: getEffectTooltip('population', 'costPerMicroprobability'),
    },
    {
      name: 'populationFractionAffected',
      label: 'Population fraction affected',
      tooltip: getEffectTooltip('population', 'populationFractionAffected'),
    },
    {
      name: 'qalyImprovementPerYear',
      label: 'Life-year improvement/year',
      tooltip: getEffectTooltip('population', 'qalyImprovementPerYear'),
    },
    { name: 'startTime', label: 'Start time (years)', tooltip: getEffectTooltip('population', 'startTime') },
    { name: 'windowLength', label: 'Window length (years)', tooltip: getEffectTooltip('population', 'windowLength') },
  ];

  return <BaseRecipientEffectInputs {...props} fields={fields} effectType="population" />;
};

export default RecipientPopulationEffectInputs;
