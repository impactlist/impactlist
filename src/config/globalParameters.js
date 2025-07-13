/* eslint-env browser */

const DEFAULT_GLOBAL_PARAMETERS = {
  // Animal welfare weights relative to humans (humans = 1.0)
  simpleAnimalWeight: 0.01,
  mediumAnimalWeight: 0.1,
  complexAnimalWeight: 0.3,

  // Temporal discounting
  discountRate: 0.05, // discount rate (5% per year)

  // Population dynamics
  populationGrowthRate: 0.01, // population growth rate (1% per year)
  timeHorizon: 100, // time horizon in years
  populationLimit: null, // population limit as multiple of current population (optional)
  currentPopulation: 8000000000, // current global population (8 billion)
};

export const getGlobalParameters = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = window.localStorage.getItem('globalParameters');
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_GLOBAL_PARAMETERS, ...parsed };
    }
  }
  return DEFAULT_GLOBAL_PARAMETERS;
};

export const setGlobalParameters = (parameters) => {
  const current = getGlobalParameters();
  const updated = { ...current, ...parameters };
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem('globalParameters', JSON.stringify(updated));
  }
  return updated;
};

export const resetGlobalParameters = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem('globalParameters');
  }
  return DEFAULT_GLOBAL_PARAMETERS;
};

export const getPopulationWeight = (targetPopulation) => {
  const params = getGlobalParameters();
  switch (targetPopulation) {
    case 'human':
      return 1.0;
    case 'simpleAnimal':
      return params.simpleAnimalWeight;
    case 'mediumAnimal':
      return params.mediumAnimalWeight;
    case 'complexAnimal':
      return params.complexAnimalWeight;
    default:
      throw new Error(
        `Unknown target population: ${targetPopulation}. Valid options are: human, simpleAnimal, mediumAnimal, complexAnimal`
      );
  }
};
