import { EFFECT_TOOLTIPS } from './effectTooltips';

export const QALY_EFFECT_FIELDS = [
  {
    name: 'costPerQALY',
    label: 'Cost per life-year',
    tooltip: EFFECT_TOOLTIPS.qaly.costPerQALY,
  },
  {
    name: 'startTime',
    label: 'Start Time (years)',
    tooltip: EFFECT_TOOLTIPS.qaly.startTime,
  },
  {
    name: 'windowLength',
    label: 'Duration (years)',
    tooltip: EFFECT_TOOLTIPS.qaly.windowLength,
  },
];

export const POPULATION_EFFECT_FIELDS = [
  {
    name: 'costPerMicroprobability',
    label: 'Cost per microprobability',
    tooltip: EFFECT_TOOLTIPS.population.costPerMicroprobability,
  },
  {
    name: 'populationFractionAffected',
    label: 'Population fraction affected',
    tooltip: EFFECT_TOOLTIPS.population.populationFractionAffected,
  },
  {
    name: 'qalyImprovementPerYear',
    label: 'Life-year improvement/year',
    tooltip: EFFECT_TOOLTIPS.population.qalyImprovementPerYear,
  },
  {
    name: 'startTime',
    label: 'Start time (years)',
    tooltip: EFFECT_TOOLTIPS.population.startTime,
  },
  {
    name: 'windowLength',
    label: 'Duration (years)',
    tooltip: EFFECT_TOOLTIPS.population.windowLength,
  },
];

export const getEffectFieldNames = (effect) => {
  if (!effect) return [];

  if (effect.costPerQALY !== undefined) {
    return QALY_EFFECT_FIELDS.map((field) => field.name);
  } else if (effect.costPerMicroprobability !== undefined) {
    return POPULATION_EFFECT_FIELDS.map((field) => field.name);
  }

  return [];
};

export const getEffectFields = (effect) => {
  if (!effect) return [];

  if (effect.costPerQALY !== undefined) {
    return QALY_EFFECT_FIELDS;
  } else if (effect.costPerMicroprobability !== undefined) {
    return POPULATION_EFFECT_FIELDS;
  }

  return [];
};
