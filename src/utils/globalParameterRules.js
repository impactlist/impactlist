// Single source of truth for global-parameter names and value constraints.
// Consumed by the build-time generator, app startup validation, the
// assumptions editor's form validation, and the future-value visualization —
// previously four divergent rule sets (one of which forgot yearsPerLife).
//
// This module must stay pure ES6 with no app/browser imports: the generator
// script imports it under Node, and the test harness copies it into temp
// workspaces.

export const GLOBAL_PARAMETER_RULES = {
  discountRate: {
    // Values are decimal fractions (0.02 = 2%).
    validate: (value) => {
      if (value < 0) return 'Discount rate cannot be negative';
      if (value > 1) return 'Discount rate must be no greater than 100%';
      return null;
    },
  },
  populationGrowthRate: {
    validate: (value) => {
      // -100% or less would collapse the population instantly and breaks
      // log1p in the growth integration.
      if (value <= -1) return 'Population growth rate cannot be -100% or less';
      return null;
    },
  },
  timeLimit: {
    validate: (value) => (value <= 0 ? 'Time limit must be positive' : null),
  },
  populationLimit: {
    validate: (value) => (value <= 0 ? 'Population limit must be positive' : null),
  },
  currentPopulation: {
    validate: (value) => (value <= 0 ? 'Current population must be positive' : null),
  },
  yearsPerLife: {
    validate: (value) => (value <= 0 ? 'Years per life must be positive' : null),
  },
};

export const GLOBAL_PARAMETER_NAMES = Object.keys(GLOBAL_PARAMETER_RULES);

/**
 * Validate a single (numeric) global parameter value.
 * @returns {string|null} A user-facing error message, or null if valid.
 */
export const getGlobalParameterError = (parameterName, value) => {
  const rule = GLOBAL_PARAMETER_RULES[parameterName];
  if (!rule) {
    return `Unknown global parameter "${parameterName}"`;
  }
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    return `Global parameter "${parameterName}" must be a finite number`;
  }
  return rule.validate(value);
};

/**
 * Assert a complete global-parameters object: every known parameter present
 * and valid, no unknown parameters. Throws on the first violation.
 */
export const assertValidGlobalParameters = (globalParameters, context = '') => {
  const suffix = context ? ` ${context}` : '';

  if (!globalParameters || typeof globalParameters !== 'object') {
    throw new Error(`Global parameters must be an object${suffix}`);
  }

  for (const key of Object.keys(globalParameters)) {
    if (!GLOBAL_PARAMETER_RULES[key]) {
      throw new Error(`Unknown global parameter "${key}"${suffix}`);
    }
  }

  for (const name of GLOBAL_PARAMETER_NAMES) {
    if (globalParameters[name] === undefined || globalParameters[name] === null) {
      throw new Error(`Global parameter "${name}" is missing${suffix}`);
    }
    const error = getGlobalParameterError(name, globalParameters[name]);
    if (error) {
      throw new Error(`${error}${suffix}`);
    }
  }
};
